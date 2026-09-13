# AapdaSathi M2 - Dynamic Isolation & Landslide Risk Engine

def calculate_isolation_risk(rainfall_mm, soil_moisture_pct, terrain_slope_degrees):
    # NER logic: Heavy rain + high soil saturation + steep slope = Landslides & road cutoffs
    vulnerability_index = (rainfall_mm * 0.5) + (soil_moisture_pct * 0.3) + (terrain_slope_degrees * 2)
    
    if vulnerability_index > 150:
        return {
            "severity": "CRITICAL",
            "hazard_type": "Landslide & Flash Flood",
            "road_status": "BLOCKED (Impassable)",
            "isolation_status": "ISOLATED - Air Drop Required"
        }
    elif vulnerability_index > 100:
        return {
            "severity": "HIGH",
            "hazard_type": "Flash Flood Risk",
            "road_status": "PARTIALLY BLOCKED",
            "isolation_status": "ACCESSIBLE - Heavy Off-Road Only"
        }
    else:
        return {
            "severity": "LOW",
            "hazard_type": "None",
            "road_status": "CLEAR",
            "isolation_status": "NORMAL ACCESSIBILITY"
        }

# Simulated test case: Steep mountain region in Meghalaya during heavy rainfall
meghalaya_sample = {
    "district": "East Khasi Hills",
    "rainfall": 120, 
    "soil_moisture": 85, 
    "slope": 40
}

risk_report = calculate_isolation_risk(
    meghalaya_sample["rainfall"], 
    meghalaya_sample["soil_moisture"], 
    meghalaya_sample["slope"]
)

print(f"\n==========================================")
print(f" AAPDASATHI INTELLIGENCE: {meghalaya_sample['district']}")
print(f"==========================================")
print(f"Disaster Severity : {risk_report['severity']}")
print(f"Identified Hazard : {risk_report['hazard_type']}")
print(f"Highway Status    : {risk_report['road_status']}")
print(f"Relief Routing    : {risk_report['isolation_status']}")
print(f"==========================================\n")