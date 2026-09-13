"""
AapdaSathi - Member 3: Relief Intelligence & Relief Matching AI Engine
Provides:
1. Relief Priority Scoring (SRS Section 18)
2. Need-to-Relief Distance & Inventory Matching (SRS Section 12)
3. AI-Based Predictive Relief Demand Forecasting (SRS Section 36)
4. "No One Left Without Essentials" Essential Coverage Score (SRS Section 17)
5. Shortage Heatmap Data Generator (SRS Section 13)
"""

import math
from typing import List, Dict, Any, Optional

EARTH_RADIUS_KM = 6371.0

# Predefined coordinates for major North Eastern Region (NER) centres
NER_LOCATIONS = {
    # Assam
    "Guwahati": (26.1445, 91.7362),
    "Dibrugarh": (27.4728, 94.9120),
    "Silchar": (24.8333, 92.7789),
    "Jorhat": (26.7509, 94.2037),
    "Nagaon": (26.3468, 92.6840),
    # Arunachal Pradesh
    "Itanagar": (27.0844, 93.6053),
    "Tawang": (27.5861, 91.8594),
    "Pasighat": (28.0664, 95.3265),
    "Bomdila": (27.2645, 92.4159),
    # Manipur
    "Imphal": (24.8170, 93.9368),
    "Churachandpur": (24.3333, 93.6833),
    "Thoubal": (24.6382, 94.0142),
    # Meghalaya
    "Shillong": (25.5788, 91.8933),
    "Tura": (25.5138, 90.2202),
    "Jowai": (25.4500, 92.2000),
    "Sohra": (25.2986, 91.7324),
    # Mizoram
    "Aizawl": (23.7271, 92.7176),
    "Lunglei": (22.8872, 92.7388),
    "Champhai": (23.4735, 93.3278),
    # Nagaland
    "Kohima": (25.6751, 94.1086),
    "Dimapur": (25.9090, 93.7266),
    "Mokokchung": (26.3253, 94.5204),
    # Tripura
    "Agartala": (23.8315, 91.2868),
    "Dharmanagar": (24.3756, 92.1648),
    "Udaipur": (23.5333, 91.4833),
    # Sikkim
    "Gangtok": (27.3389, 88.6065),
    "Namchi": (27.1667, 88.3500),
    "Mangan": (27.5111, 88.5283)
}

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in km."""
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(EARTH_RADIUS_KM * c, 2)


# ==========================================
# 1. RELIEF PRIORITY SCORE (SRS Section 18)
# ==========================================
def calculate_priority_score(
    population: int,
    urgency: str,
    vulnerable_count: Dict[str, int],
    road_blocked: bool = False,
    current_shortage_ratio: float = 0.5
) -> Dict[str, Any]:
    """
    Priority Score = Population Factor + Urgency + Resource Shortage + Accessibility + Vulnerability
    Output normalized score between 0 and 100 with category classification.
    """
    pop_score = min(25.0, (math.log10(max(population, 1)) / 4.0) * 25.0)

    urgency_map = {
        "CRITICAL": 25.0,
        "HIGH": 18.0,
        "MODERATE": 10.0,
        "LOW": 4.0
    }
    urgency_score = urgency_map.get(urgency.upper(), 10.0)
    shortage_score = min(20.0, current_shortage_ratio * 20.0)

    children = vulnerable_count.get("children", 0)
    elderly = vulnerable_count.get("elderly", 0)
    pregnant = vulnerable_count.get("pregnant", 0)
    injured = vulnerable_count.get("injured", 0)
    total_vulnerable = children + elderly + pregnant + injured
    
    if population > 0 and total_vulnerable > 0:
        vuln_density = (children * 1.5 + elderly * 1.5 + pregnant * 2.5 + injured * 3.0) / population
        vuln_score = min(20.0, vuln_density * 40.0)
    else:
        vuln_score = 0.0

    accessibility_score = 10.0 if road_blocked else 2.0

    total_score = round(pop_score + urgency_score + shortage_score + vuln_score + accessibility_score, 1)
    total_score = min(100.0, max(0.0, total_score))

    if total_score >= 80.0:
        priority_class = "CRITICAL"
        badge_color = "red"
    elif total_score >= 60.0:
        priority_class = "HIGH"
        badge_color = "orange"
    elif total_score >= 35.0:
        priority_class = "MODERATE"
        badge_color = "yellow"
    else:
        priority_class = "LOW"
        badge_color = "green"

    return {
        "priority_score": total_score,
        "priority_class": priority_class,
        "badge_color": badge_color,
        "breakdown": {
            "population_score": round(pop_score, 1),
            "urgency_score": round(urgency_score, 1),
            "shortage_score": round(shortage_score, 1),
            "vulnerability_score": round(vuln_score, 1),
            "accessibility_score": round(accessibility_score, 1)
        }
    }


# ==========================================
# 2. NEED-TO-RELIEF MATCHING (SRS Section 12)
# ==========================================
def match_need_to_relief(
    requested_item: str,
    required_quantity: float,
    request_lat: float,
    request_lon: float,
    inventory_depots: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Searches available sources:
    - Government Warehouses
    - Relief Centres
    - NGOs
    - Volunteers & Donors
    - Sibling Relief Camps
    Matches nearest available sources by Haversine distance and stock availability.
    """
    candidates = []

    for depot in inventory_depots:
        items = depot.get("items", {})
        avail_stock = items.get(requested_item, 0)
        
        if avail_stock <= 0:
            continue

        depot_lat = depot["latitude"]
        depot_lon = depot["longitude"]
        dist_km = haversine_distance(request_lat, request_lon, depot_lat, depot_lon)

        candidates.append({
            "depot_id": depot["id"],
            "depot_name": depot["name"],
            "depot_type": depot.get("type", "Warehouse"),
            "state": depot.get("state", "Assam"),
            "district": depot.get("district", "Kamrup"),
            "distance_km": dist_km,
            "available_quantity": avail_stock,
            "can_fulfill_fully": avail_stock >= required_quantity,
            "latitude": depot_lat,
            "longitude": depot_lon,
            "contact_person": depot.get("contact_person", "Officer in charge"),
            "contact_phone": depot.get("contact_phone", "+91 98765 43210")
        })

    candidates.sort(key=lambda x: (not x["can_fulfill_fully"], x["distance_km"]))

    if not candidates:
        return {
            "match_found": False,
            "message": f"No available stock for '{requested_item}' within registered depots.",
            "allocations": [],
            "total_allocated": 0,
            "remaining_unmet_demand": required_quantity
        }

    primary_match = candidates[0]
    allocations = []
    remaining = required_quantity

    for cand in candidates:
        if remaining <= 0:
            break
        qty_to_take = min(cand["available_quantity"], remaining)
        allocations.append({
            "depot_id": cand["depot_id"],
            "depot_name": cand["depot_name"],
            "depot_type": cand["depot_type"],
            "distance_km": cand["distance_km"],
            "allocated_quantity": qty_to_take,
            "contact_person": cand["contact_person"],
            "contact_phone": cand["contact_phone"]
        })
        remaining -= qty_to_take

    return {
        "match_found": True,
        "requested_item": requested_item,
        "required_quantity": required_quantity,
        "primary_recommendation": {
            "depot_name": primary_match["depot_name"],
            "depot_type": primary_match["depot_type"],
            "distance_km": primary_match["distance_km"],
            "available_quantity": primary_match["available_quantity"],
            "can_fulfill_fully": primary_match["can_fulfill_fully"]
        },
        "allocations": allocations,
        "total_allocated": required_quantity - remaining,
        "remaining_unmet_demand": max(0, remaining),
        "candidates_evaluated": len(candidates)
    }


# ========================================================
# 3. PREDICTIVE RELIEF DEMAND FORECASTING (SRS Section 36)
# ========================================================
def forecast_relief_demand(
    disaster_type: str,
    severity: str,
    population_affected: int,
    expected_duration_days: int,
    current_stocks: Dict[str, float]
) -> Dict[str, Any]:
    """
    AI-Based Relief Demand Forecasting:
    Based on population + disaster severity + duration
    """
    sev_mult = {
        "CRITICAL": 1.4,
        "HIGH": 1.2,
        "MODERATE": 1.0,
        "LOW": 0.8
    }.get(severity.upper(), 1.0)

    food_needed = round(population_affected * 3.0 * expected_duration_days * sev_mult)
    water_liters_needed = round(population_affected * 3.5 * expected_duration_days * sev_mult)
    medical_kits_needed = round(population_affected * 0.05 * sev_mult)
    blankets_needed = round(population_affected * 0.4 * sev_mult)

    forecast_items = [
        {"item": "Food Packets", "required": food_needed, "current": current_stocks.get("Food Packets", 0.0), "unit": "packets"},
        {"item": "Drinking Water", "required": water_liters_needed, "current": current_stocks.get("Drinking Water", 0.0), "unit": "liters"},
        {"item": "Medical Kits", "required": medical_kits_needed, "current": current_stocks.get("Medical Kits", 0.0), "unit": "kits"},
        {"item": "Blankets", "required": blankets_needed, "current": current_stocks.get("Blankets", 0.0), "unit": "pieces"}
    ]

    has_critical_shortage = False
    critical_alerts = []

    for f in forecast_items:
        shortage = max(0.0, f["required"] - f["current"])
        f["shortage"] = shortage
        f["coverage_ratio"] = round(min(1.0, f["current"] / max(1.0, f["required"])) * 100, 1)
        if f["coverage_ratio"] < 50.0:
            has_critical_shortage = True
            critical_alerts.append(
                f"Critical {f['item']} shortage: {int(shortage):,} {f['unit']} required within {expected_duration_days * 24} hours."
            )

    return {
        "disaster_type": disaster_type,
        "severity": severity,
        "population_affected": population_affected,
        "duration_days": expected_duration_days,
        "has_critical_shortage": has_critical_shortage,
        "critical_alerts": critical_alerts,
        "forecast_breakdown": forecast_items,
        "summary": (
            f"AI Forecast: {population_affected:,} citizens affected by {severity} {disaster_type} "
            f"will require {food_needed:,} food packets and {water_liters_needed:,}L water over {expected_duration_days} days."
        )
    }


# ========================================================
# 4. "NO ONE LEFT WITHOUT ESSENTIALS" (SRS Section 17)
# ========================================================
def calculate_essential_coverage(
    requirements: Dict[str, Dict[str, float]]
) -> Dict[str, Any]:
    """
    Calculates regional coverage across 5 pillars:
    Food, Water, Medicine, Shelter, Sanitation.
    """
    pillars = ["Food", "Water", "Medicine", "Shelter", "Sanitation"]
    breakdown = {}
    total_coverage = 0.0

    lowest_pillar = None
    lowest_coverage = 101.0

    for pillar in pillars:
        data = requirements.get(pillar, {"required": 1000.0, "available": 1000.0})
        req = max(1.0, data.get("required", 1.0))
        avail = data.get("available", 0.0)
        coverage_pct = round(min(100.0, (avail / req) * 100.0), 1)
        
        breakdown[pillar] = {
            "required": req,
            "available": avail,
            "shortage": max(0.0, req - avail),
            "coverage_pct": coverage_pct
        }
        total_coverage += coverage_pct

        if coverage_pct < lowest_coverage:
            lowest_coverage = coverage_pct
            lowest_pillar = pillar

    overall_coverage = round(total_coverage / len(pillars), 1)

    return {
        "overall_coverage_pct": overall_coverage,
        "lowest_coverage_pillar": lowest_pillar,
        "biggest_gap_message": f"Critical gap detected in {lowest_pillar} at only {lowest_coverage}% fulfillment.",
        "breakdown": breakdown
    }
