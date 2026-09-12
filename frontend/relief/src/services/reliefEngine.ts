import { 
  InventoryItem, 
  ReliefRequest, 
  MatchResult, 
  RegionalCoverageScore,
  VulnerableDemographics
} from '../types/relief';

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

export function computePriorityScore(
  population: number,
  urgency: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL',
  vulnerable: VulnerableDemographics,
  roadBlocked: boolean,
  shortageRatio: number = 0.5
): { score: number; priorityClass: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' } {
  // Population factor: max 25 points
  const popScore = Math.min(25, (Math.log10(Math.max(population, 1)) / 4.0) * 25.0);

  // Urgency weight: max 25 points
  const urgencyWeight = {
    'CRITICAL': 25,
    'HIGH': 18,
    'MODERATE': 10,
    'LOW': 4
  }[urgency];

  // Shortage score: max 20 points
  const shortageScore = Math.min(20, shortageRatio * 20.0);

  // Vulnerability factor: max 20 points
  const children = vulnerable.children || 0;
  const elderly = vulnerable.elderly || 0;
  const pregnant = vulnerable.pregnant || 0;
  const injured = vulnerable.injured || 0;
  const totalVuln = children + elderly + pregnant + injured;

  let vulnScore = 0;
  if (population > 0 && totalVuln > 0) {
    const weightedVuln = (children * 1.5 + elderly * 1.5 + pregnant * 2.5 + injured * 3.0);
    vulnScore = Math.min(20, (weightedVuln / population) * 40.0);
  }

  // Accessibility: 10 if cut off, 2 if accessible
  const accessibilityScore = roadBlocked ? 10 : 2;

  const total = Math.min(100, Math.max(0, Math.round((popScore + urgencyWeight + shortageScore + vulnScore + accessibilityScore) * 10) / 10));

  let priorityClass: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (total >= 80) priorityClass = 'CRITICAL';
  else if (total >= 60) priorityClass = 'HIGH';
  else if (total >= 35) priorityClass = 'MODERATE';

  return { score: total, priorityClass };
}

export function matchNeedToRelief(
  request: ReliefRequest,
  inventory: InventoryItem[]
): MatchResult {
  // Find all depots that hold the requested item or same category
  const candidates = inventory
    .filter(item => item.item_name.toLowerCase().includes(request.required_item.toLowerCase()) || 
                    item.category === request.category)
    .filter(item => item.quantity > 0)
    .map(depot => {
      const dist = haversineDistance(request.latitude, request.longitude, depot.latitude, depot.longitude);
      return {
        depot_id: depot.item_id,
        depot_name: `${depot.source} (${depot.location})`,
        depot_type: depot.source,
        distance_km: dist,
        available_quantity: depot.quantity,
        can_fulfill_fully: depot.quantity >= request.quantity,
        contact_person: depot.contact_person,
        contact_phone: depot.contact_phone
      };
    });

  // Sort by fulfillment capability and closest distance
  candidates.sort((a, b) => {
    if (a.can_fulfill_fully && !b.can_fulfill_fully) return -1;
    if (!a.can_fulfill_fully && b.can_fulfill_fully) return 1;
    return a.distance_km - b.distance_km;
  });

  if (candidates.length === 0) {
    return {
      match_found: false,
      requested_item: request.required_item,
      required_quantity: request.quantity,
      allocations: [],
      total_allocated: 0,
      remaining_unmet_demand: request.quantity
    };
  }

  const primary = candidates[0];
  const allocations: MatchResult['allocations'] = [];
  let remaining = request.quantity;

  for (const c of candidates) {
    if (remaining <= 0) break;
    const take = Math.min(c.available_quantity, remaining);
    allocations.push({
      depot_id: c.depot_id,
      depot_name: c.depot_name,
      depot_type: c.depot_type,
      distance_km: c.distance_km,
      allocated_quantity: take,
      contact_person: c.contact_person,
      contact_phone: c.contact_phone
    });
    remaining -= take;
  }

  return {
    match_found: true,
    requested_item: request.required_item,
    required_quantity: request.quantity,
    primary_recommendation: {
      depot_name: primary.depot_name,
      depot_type: primary.depot_type,
      distance_km: primary.distance_km,
      available_quantity: primary.available_quantity,
      can_fulfill_fully: primary.can_fulfill_fully
    },
    allocations,
    total_allocated: request.quantity - remaining,
    remaining_unmet_demand: Math.max(0, remaining)
  };
}

export function computeEssentialCoverageScore(
  stateName: string,
  pillarsInput: Record<string, { required: number; available: number }>
): RegionalCoverageScore {
  const pillarsList = ['Food', 'Water', 'Medicine', 'Shelter', 'Sanitation'];
  const pillars: Record<string, { required: number; available: number; shortage: number; coverage_pct: number }> = {};
  
  let totalPct = 0;
  let lowestPillar = 'Food';
  let lowestCoverage = 101;

  for (const p of pillarsList) {
    const data = pillarsInput[p] || { required: 1000, available: 800 };
    const shortage = Math.max(0, data.required - data.available);
    const coverage_pct = Math.min(100, Math.round((data.available / Math.max(1, data.required)) * 100));

    pillars[p] = {
      required: data.required,
      available: data.available,
      shortage,
      coverage_pct
    };

    totalPct += coverage_pct;
    if (coverage_pct < lowestCoverage) {
      lowestCoverage = coverage_pct;
      lowestPillar = p;
    }
  }

  const overall = Math.round(totalPct / pillarsList.length);

  return {
    state: stateName,
    overall_coverage_pct: overall,
    lowest_coverage_pillar: lowestPillar,
    biggest_gap_message: `Critical relief bottleneck identified in ${lowestPillar} (${lowestCoverage}% coverage). Priority dispatch required.`,
    pillars
  };
}

export function runDemandForecast(
  disaster: string,
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL',
  population: number,
  durationDays: number,
  currentStocks: { food: number; water: number; medicine: number; blankets: number }
) {
  const mult = {
    'CRITICAL': 1.4,
    'HIGH': 1.2,
    'MODERATE': 1.0,
    'LOW': 0.8
  }[severity];

  const reqFood = Math.round(population * 3 * durationDays * mult);
  const reqWater = Math.round(population * 3.5 * durationDays * mult);
  const reqMeds = Math.round(population * 0.05 * mult);
  const reqBlankets = Math.round(population * 0.4 * mult);

  const forecast = [
    { name: 'Food Packets', required: reqFood, current: currentStocks.food, unit: 'packets' },
    { name: 'Drinking Water', required: reqWater, current: currentStocks.water, unit: 'liters' },
    { name: 'Medical Kits', required: reqMeds, current: currentStocks.medicine, unit: 'kits' },
    { name: 'Blankets', required: reqBlankets, current: currentStocks.blankets, unit: 'pieces' }
  ].map(item => {
    const shortage = Math.max(0, item.required - item.current);
    const coverage = Math.min(100, Math.round((item.current / Math.max(1, item.required)) * 100));
    return {
      ...item,
      shortage,
      coverage,
      isCritical: coverage < 50
    };
  });

  const alerts = forecast.filter(f => f.isCritical).map(f => 
    `Critical ${f.name} Shortage: Depletion within ${durationDays * 24}h. Gap: ${f.shortage.toLocaleString()} ${f.unit}`
  );

  return {
    disaster,
    severity,
    population,
    durationDays,
    forecast,
    alerts,
    hasCriticalWarning: alerts.length > 0
  };
}
