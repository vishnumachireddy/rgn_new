import random

class CropRecommender:
    def __init__(self):
        self.crop_database = {
            "Black Soil": ["Cotton", "Soybeans", "Wheat", "Linseed"],
            "Red Soil": ["Groundnut", "Tobacco", "Millets", "Potatoes"],
            "Alluvial Soil": ["Rice", "Wheat", "Sugarcane", "Jute"],
            "Laterite Soil": ["Cashew", "Coffee", "Rubber", "Tea"]
        }

    def get_recommendation(self, soil_type: str, location: str, season: str):
        # Base recommendations from soil
        base_crops = self.crop_database.get(soil_type, ["Maize", "Vegetables"])
        
        results = []
        for crop in base_crops:
            suitability = random.randint(70, 98)
            # Adjust suitability based on season (Mock)
            if season == "Kharif" and crop == "Rice":
                suitability += 5
            
            results.append({
                "name": crop,
                "suitability_score": min(suitability, 100),
                "expected_yield": f"{random.uniform(1.5, 4.0):.1f} Tons/Acre",
                "estimated_profit": f"₹{random.randint(30000, 80000)}",
                "risk_level": "Low" if suitability > 85 else "Medium"
            })
            
        return sorted(results, key=lambda x: x["suitability_score"], reverse=True)
