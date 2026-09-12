"""
Unit tests for AapdaSathi Member 3 Relief AI Engine
"""
import unittest
from relief_engine import (
    calculate_priority_score,
    match_need_to_relief,
    forecast_relief_demand,
    calculate_essential_coverage,
    NER_LOCATIONS
)

class TestReliefEngine(unittest.TestCase):

    def test_priority_score_vulnerable_and_cutoff(self):
        # Scenario: 500 people, critical urgency, 120 vulnerable, road blocked
        res = calculate_priority_score(
            population=500,
            urgency="CRITICAL",
            vulnerable_count={"children": 40, "elderly": 30, "pregnant": 10, "injured": 15},
            road_blocked=True,
            current_shortage_ratio=0.9
        )
        self.assertGreaterEqual(res["priority_score"], 80.0)
        self.assertEqual(res["priority_class"], "CRITICAL")
        self.assertEqual(res["badge_color"], "red")

    def test_matching_nearest_warehouse(self):
        # Relief Camp in Silchar requires 500 bottles of water
        camp_lat, camp_lon = NER_LOCATIONS["Silchar"]
        
        depots = [
            {
                "id": "DEPOT-01",
                "name": "Guwahati Central Warehouse",
                "type": "Government Warehouse",
                "state": "Assam",
                "district": "Kamrup Metropolitan",
                "latitude": NER_LOCATIONS["Guwahati"][0],
                "longitude": NER_LOCATIONS["Guwahati"][1],
                "items": {"Drinking Water": 10000}
            },
            {
                "id": "DEPOT-02",
                "name": "Silchar Local NGO Hub",
                "type": "NGO",
                "state": "Assam",
                "district": "Cachar",
                "latitude": camp_lat + 0.03,  # ~3.5 km away
                "longitude": camp_lon + 0.02,
                "items": {"Drinking Water": 650}
            }
        ]

        result = match_need_to_relief(
            requested_item="Drinking Water",
            required_quantity=500,
            request_lat=camp_lat,
            request_lon=camp_lon,
            inventory_depots=depots
        )

        self.assertTrue(result["match_found"])
        self.assertEqual(result["primary_recommendation"]["depot_name"], "Silchar Local NGO Hub")
        self.assertLess(result["primary_recommendation"]["distance_km"], 10.0)
        self.assertTrue(result["primary_recommendation"]["can_fulfill_fully"])

    def test_forecast_relief_demand(self):
        # Flood in Assam affecting 20,000 people for 3 days (From SRS Section 36 example)
        res = forecast_relief_demand(
            disaster_type="Flood",
            severity="HIGH",
            population_affected=20000,
            expected_duration_days=3,
            current_stocks={"Food Packets": 8000, "Drinking Water": 12000}
        )
        self.assertTrue(res["has_critical_shortage"])
        self.assertGreater(len(res["critical_alerts"]), 0)

    def test_essential_coverage_score(self):
        # Test breakdown from SRS Section 15: Food 90%, Water 65%, Medicine 55%, Shelter 85%, Sanitation 70%
        reqs = {
            "Food": {"required": 10000, "available": 9000},       # 90%
            "Water": {"required": 10000, "available": 6500},      # 65%
            "Medicine": {"required": 10000, "available": 5500},   # 55%
            "Shelter": {"required": 10000, "available": 8500},    # 85%
            "Sanitation": {"required": 10000, "available": 7000}  # 70%
        }
        res = calculate_essential_coverage(reqs)
        self.assertAlmostEqual(res["overall_coverage_pct"], 73.0, delta=0.5)
        self.assertEqual(res["lowest_coverage_pillar"], "Medicine")

if __name__ == "__main__":
    unittest.main()
