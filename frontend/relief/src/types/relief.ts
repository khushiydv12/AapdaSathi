export type ReliefCategory = 
  | 'Food'
  | 'Drinking Water'
  | 'Medicines'
  | 'Blankets & Clothes'
  | 'Sanitary & Hygiene'
  | 'Emergency Equipment';

export type UrgencyLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DeliveryStatus = 
  | 'Requested' 
  | 'Verified' 
  | 'Assigned' 
  | 'In Transit' 
  | 'Delivered' 
  | 'Rejected';

export interface VulnerableDemographics {
  children: number;
  elderly: number;
  pregnant: number;
  injured: number;
}

export interface InventoryItem {
  item_id: string;
  item_name: string;
  category: ReliefCategory;
  quantity: number;
  unit: string;
  location: string;
  state: string;
  source: 'Government Warehouse' | 'Relief Centre' | 'NGO' | 'Volunteer' | 'Donor' | 'Relief Camp';
  expiry_date?: string;
  latitude: number;
  longitude: number;
  contact_person?: string;
  contact_phone?: string;
}

export interface ReliefRequest {
  request_id: string;
  location: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  people_count: number;
  required_item: string;
  category: ReliefCategory;
  quantity: number;
  unit: string;
  urgency: UrgencyLevel;
  vulnerable: VulnerableDemographics;
  road_blocked: boolean;
  status: DeliveryStatus;
  priority_score: number;
  priority_class: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  created_at: string;
  notes?: string;
  assigned_depot?: string;
  transporter?: string;
}

export interface DeliveryRecord {
  distribution_id: string;
  request_id: string;
  source_depot: string;
  destination_camp: string;
  item: string;
  quantity: number;
  unit: string;
  transporter: string;
  vehicle_no: string;
  dispatch_time: string;
  estimated_arrival: string;
  delivery_status: DeliveryStatus;
  recipient_confirmed: boolean;
  transit_progress_pct: number;
}

export interface EssentialPillarCoverage {
  required: number;
  available: number;
  shortage: number;
  coverage_pct: number;
}

export interface RegionalCoverageScore {
  state: string;
  overall_coverage_pct: number;
  lowest_coverage_pillar: string;
  biggest_gap_message: string;
  pillars: Record<string, EssentialPillarCoverage>;
}

export interface ShortageHeatmapDistrict {
  id: string;
  district: string;
  state: string;
  disaster_risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  food_status: 'ADEQUATE' | 'LOW' | 'CRITICAL';
  medical_status: 'ADEQUATE' | 'LOW' | 'CRITICAL';
  water_status: 'ADEQUATE' | 'LOW' | 'CRITICAL';
  overall_shortage: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  active_shortage_count: number;
  latitude: number;
  longitude: number;
}

export interface MatchAllocation {
  depot_id: string;
  depot_name: string;
  depot_type: string;
  distance_km: number;
  allocated_quantity: number;
  contact_person?: string;
  contact_phone?: string;
}

export interface MatchResult {
  match_found: boolean;
  requested_item: string;
  required_quantity: number;
  primary_recommendation?: {
    depot_name: string;
    depot_type: string;
    distance_km: number;
    available_quantity: number;
    can_fulfill_fully: boolean;
  };
  allocations: MatchAllocation[];
  total_allocated: number;
  remaining_unmet_demand: number;
}
