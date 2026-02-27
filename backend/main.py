from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn
from pydantic import BaseModel
import random
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Local Modules
from ai_engine import ai_engine
from api.auth import router as auth_router

app = FastAPI(title="🌾 AgroSmart AI API", description="Production-ready AI-Powered Agriculture Ecosystem")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# --- Feature Toggles ---
feature_toggles = {
    "crop_recommendation": True,
    "advisory_chat": True,
    "weather_api": True,
    "profit_estimator": True
}

def check_feature(name: str):
    if not feature_toggles.get(name, True):
        raise HTTPException(status_code=403, detail=f"Feature '{name}' is currently disabled.")

# --- Models ---
class PredictionRequest(BaseModel):
    soil_type: str
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    rainfall: float
    ph: float
    season: str

class ProfitRequest(BaseModel):
    crop: str
    land_size: float

class ProfitStrategyRequest(BaseModel):
    crop_name: str
    land_size: float
    yield_per_acre: float
    production_cost: float
    months_to_store: int

class ChatRequest(BaseModel):
    message: str

class NPKRequest(BaseModel):
    soil_type: str

class PHRequest(BaseModel):
    soil_type: str
    nitrogen: float
    phosphorus: float
    potassium: float
    rainfall: float
    temperature: float
    humidity: float

# --- AI Endpoints (Powered by Groq & ML) ---

@app.post("/api/ai/predict-npk")
async def predict_npk(req: NPKRequest):
    check_feature("crop_recommendation")
    return ai_engine.predict_npk(req.soil_type)

@app.post("/api/ai/predict-ph")
async def predict_ph(req: PHRequest):
    check_feature("crop_recommendation")
    return ai_engine.predict_ph(
        req.soil_type, req.nitrogen, req.phosphorus, req.potassium,
        req.rainfall, req.temperature, req.humidity
    )

@app.post("/api/ai/recommend-crop")
async def recommend_crop(req: PredictionRequest):
    check_feature("crop_recommendation")
    return ai_engine.predict_crop(
        req.soil_type, req.nitrogen, req.phosphorus, req.potassium,
        req.temperature, req.humidity, req.rainfall, req.ph, req.season
    )

@app.post("/api/ai/predict-profit")
async def predict_profit(req: ProfitRequest):
    check_feature("profit_estimator")
    return ai_engine.predict_profit(req.crop, req.land_size)

@app.post("/api/ai/profit-strategy")
async def profit_strategy(req: ProfitStrategyRequest):
    check_feature("profit_estimator")
    return ai_engine.predict_profit_strategy(
        req.crop_name, 
        req.land_size, 
        req.yield_per_acre, 
        req.production_cost, 
        req.months_to_store
    )

@app.post("/api/chat/advisory")
async def chat_advisory(req: ChatRequest):
    check_feature("advisory_chat")
    response = ai_engine.chat_with_ai(req.message)
    return {"response": response}

soil_predictions_db = []
weather_logs_db = []

@app.get("/api/weather/advisory")
async def get_weather(lat: float, lon: float, user_id: Optional[str] = None):
    check_feature("weather_api")
    weather_data = await ai_engine.get_weather(lat, lon)
    
    # Store in weather_logs
    if "error" not in weather_data:
        weather_log = {
            "id": f"WTH{random.randint(1000, 9999)}",
            "user_id": user_id,
            "temp": weather_data['temp'],
            "humidity": weather_data['humidity'],
            "condition": weather_data['condition'],
            "timestamp": datetime.now().isoformat()
        }
        weather_logs_db.append(weather_log)
        
        # Enhance with LLM advice based on weather
        advice_query = f"Current weather in {weather_data['city']} is {weather_data['temp']}°C and {weather_data['condition']}. Give a one-sentence farming tip."
        weather_data["ai_advisory"] = ai_engine.chat_with_ai(advice_query)
        
    return weather_data

@app.post("/api/ai/save-prediction")
async def save_prediction(data: dict):
    # In a real app, this would use Supabase/PostgreSQL
    prediction_entry = {
        "id": f"PRED{random.randint(10000, 99999)}",
        "created_at": datetime.now().isoformat(),
        **data
    }
    soil_predictions_db.append(prediction_entry)
    return {"status": "success", "id": prediction_entry["id"]}

@app.get("/api/marketplace/crops")
async def list_crops(state: Optional[str] = None):
    crops = [
        {"id": "1", "farmer_name": "Ramesh Kumar", "crop_name": "Organic Wheat", "price": 42.5, "quantity": 500, "state": "Andhra Pradesh", "image": "https://img.freepik.com/free-photo/wheat-field_1112-613.jpg"},
        {"id": "2", "farmer_name": "Anita Reddy", "crop_name": "Basmati Rice", "price": 65.0, "quantity": 1200, "state": "Telangana", "image": "https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg"},
        {"id": "3", "farmer_name": "Suresh Babu", "crop_name": "Long Staple Cotton", "price": 95.0, "quantity": 300, "state": "Andhra Pradesh", "image": "https://img.freepik.com/free-photo/cotton-plant-field_1150-17684.jpg"},
        {"id": "4", "farmer_name": "Prakash J", "crop_name": "Turmeric Roots", "price": 120.0, "quantity": 150, "state": "Andhra Pradesh", "image": "https://img.freepik.com/free-photo/turmeric-roots-wooden-table_1150-14404.jpg"},
        {"id": "5", "farmer_name": "Venkata Rao", "crop_name": "Red Chillies", "price": 180.0, "quantity": 80, "state": "Telangana", "image": "https://img.freepik.com/free-photo/dried-red-chilli-peppers_1150-10906.jpg"}
    ]
    if state: return [c for c in crops if c['state'] == state]
    return crops

# Admin endpoints removed - System locked to Farmer role

@app.post("/api/ai/diagnose-disease")
async def diagnose_disease():
    # Deprecated section - Removed to optimize storage
    raise HTTPException(status_code=404, detail="Service Removed")

@app.get("/api/locations/states")
async def get_states():
    return ["Andhra Pradesh", "Telangana"]

@app.get("/api/locations/districts")
async def get_districts(state: str):
    districts = {
        "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari"],
        "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"]
    }
    return districts.get(state, [])

@app.get("/api/locations/mandals")
async def get_mandals(district: str):
    # Comprehensive dataset for all districts in AP and TS
    mandals_data = {
        # Andhra Pradesh
        "Anantapur": ["Anantapur", "Atmakur", "Bukkaraya Samudram", "Garladinne", "Kudair", "Narpala", "Peddapappur", "Putlur", "Raptadu", "Singanamala"],
        "Chittoor": ["Bangarupalem", "Chittoor", "Chittoor Urban", "Gangadhara Nellore", "Gudipala", "Irala", "Penumuru", "Pulicherla", "Puthalapattu", "Rompicherla"],
        "East Godavari": ["Chagallu", "Devarapalle", "Gopalapuram", "Kovvur", "Nallajerla", "Nidadavole", "Peravali", "Tallapudi", "Undrajavaram", "Anaparthi"],
        "Guntur": ["Guntur East", "Guntur West", "Medikonduru", "Pedakakani", "Pedanandipadu", "Phirangipuram", "Prathipadu", "Tadikonda", "Thullur", "Vatticherukuru"],
        "Kadapa": ["Atlur", "B. Kodur", "Badvel", "Brahmamgarimattam", "Chapad", "Duvvur", "Gopavaram", "Kalasapadu", "Khajipet", "Porumamilla"],
        "Krishna": ["Bapulapadu", "Gannavaram", "Gudivada", "Gudlavalleru", "Nandivada", "Pedaparupudi", "Unguturu", "Avanigadda", "Bantumilli", "Challapalli"],
        "Kurnool": ["Adoni Urban", "Adoni Rural", "Gonegandla", "Holagunda", "Kosigi", "Kowthalam", "Mantralayam", "Nandavaram", "Pedda Kadubur", "Yemmiganur"],
        "Nellore": ["Ananthasagaram", "Anumasamudrampeta", "Atmakur", "Chejerla", "Kaluvoya", "Marripadu", "Sangam", "Sitarampuramu", "Udayagiri", "Gudur"],
        "Prakasam": ["Korisapadu", "J. Panguluru", "Addanki", "Ballikurava", "Santhamaguluru", "Mundlamuru Ongole", "Thallur", "Darsi", "Donakonda Kanigiri", "Kurichedu"],
        "Srikakulam": ["Ichchapuram", "Kanchili", "Kaviti", "Mandasa", "Palasa Mandal", "Sompeta", "Vajrapukothuru", "Amadalavalasa", "Burja", "Etcherla"],
        "Visakhapatnam": ["Anandapuram", "Bheemunipatnam", "Padmanabham", "Seethammadhara", "Visakhapatnam Rural", "Gajuwaka", "Gopalapatnam", "Maharanipeta", "Mulagada", "Pedagantyada"],
        "Vizianagaram": ["Badangi", "Bobbili", "Dattirajeru", "Gajapathinagaram", "Mentada", "Ramabhadrapuram", "Therlam", "Cheepurupalle", "Garividi", "Gurla"],
        "West Godavari": ["Akividu", "Bhimavaram", "Kalla", "Palacoderu", "Undi", "Veeravasaram", "Achanta", "Mogalthur", "Palakollu Mandal", "Penugonda"],
        
        # Telangana
        "Adilabad": ["Adilabad Rural", "Adilabad Urban", "Bazarhatnoor", "Bela", "Boath", "Bheempoor", "Gudihathnur", "Ichoda", "Jainad", "Mavala"],
        "Bhadradri Kothagudem": ["Allapalli", "Annapureddypally", "Aswaraopeta", "Chandrugonda", "Chunchupally", "Dammapeta", "Gundala", "Julurpad", "Kothagudem", "Laxmidevipalli"],
        "Hyderabad": ["Amberpet", "Asif Nagar", "Bahadurpura", "Bandlaguda", "Charminar", "Golkonda", "Himayathnagar", "Nampally", "Saidabad"],
        "Jagtial": ["Beerpur", "Buggaram", "Dharmapuri", "Gollapalle", "Jagtial", "Jagtial Rural", "Kodimial", "Mallial", "Pegadapalle", "Raikal"],
        "Jangaon": ["Bachannapeta", "Devaruppala", "Jangaon", "Lingalaghanpur", "Narmetta", "Raghunathapalle", "Tharigoppula"],
        "Jayashankar Bhupalpally": ["Bhupalpalle", "Chityal", "Ghanpur", "Kataram", "Mahadevpur", "Maha Mutharam", "Malharrao", "Mogullapalle", "Palimela", "Regonda"],
        "Jogulamba Gadwal": ["Kaloor_Timmanadoddi", "Dharur", "Gadwal", "Itikyal", "Maldakal", "Ghattu", "Aiza", "Rajoli", "Waddepalle", "Manopad"],
        "Kamareddy": ["Banswada", "Bichkunda", "Birkoor", "Jukkal", "Madnur", "Nasurullabad", "Nizamsagar", "Pedda Kodapgal", "Pitlam", "Dongli"],
        "Karimnagar": ["Chigurumamidi", "Choppadandi", "Gangadhara", "Ganneruvaram", "Karimnagar", "Karimnagar (Rural-I)", "Karimnagar (Rural-II)", "Manakondur", "Ramadugu", "Thimmapur"],
        "Khammam": ["Enkuru", "Kalluru", "Penuballi", "Sathupalli", "Thallada", "Vemsoor"],
        "Kumuram Bheem": ["Asifabad", "Jainoor", "Kerameri", "Lingapur", "Rebbena", "Sirpur_U", "Tiryani", "Wankidi"],
        "Mahabubabad": ["Bayyaram", "Dornakal", "Ganagavaram", "Garla", "Gudur", "Kesamudram", "Kothaguda", "Kuravi", "Mahabubabad", "Seerole"],
        "Mahabubnagar": ["Addakal", "Balanagar", "Bhoothpur", "Chinna_Chintha_Kunta", "Devarkadara", "Gandeed", "Hanwada", "Jadcherla", "Koilkonda", "Mahabubnagar_Rural"],
        "Mancherial": ["Bheemaram", "Chennur", "Dandepally", "Hajipur", "Jaipur", "Jannaram", "Kotapally", "Luxettipet", "Mancherial", "Mandamarri"],
        "Medak": ["Alladurg", "Havelighanpur", "Medak", "Nizampet", "Papannapet", "Ramayampet", "Regode", "Shankarampet_A", "Shankarampet_R", "Tekmal"],
        "Medchal": ["Alwal", "Bachupally", "Balanagar", "Dundigal Gandimaisamma", "Kukatpally", "Malkajgiri", "Quthbullapur"],
        "Mulugu": ["Eturnagaram", "Govindaraopet", "Kannaigudem", "Mangapet", "Mulugu", "Sammakka Saralamma Tadvai", "Venkatapur", "Venkatapuram", "Wazeed"],
        "Nagarkurnool": ["Achampet", "Amrabad", "Balmoor", "Lingal", "Padra", "Uppunuthala"],
        "Nalgonda": ["Chandampet", "Chinthapalle", "Devarakonda", "Gundlapalle", "Gurrampode", "Kondamallapally", "Marriguda", "Nampalle", "Neredugommu", "Pedda_adiserlapalle"],
        "Narayanpet": ["Damaragidda", "Dhanwada", "Gundumal", "Kosgi", "Krishna", "Kottha pally", "Maddur", "Maganoor", "Makthal", "Marikal"],
        "Nirmal": ["Basar", "Bhainsa", "Kubeer", "Kuntala", "Lokeshwaram", "Mudhole", "Tanoor"],
        "Nizamabad": ["Aloor", "Armur", "Balkonda", "Bheemgal", "Donkeshwar", "Jakranpalle", "Kammarpalle", "Mendora", "Mortad", "Mupkal"],
        "Peddapalli": ["Kamanpur", "Manthani", "Mutharam", "Ramagiri"],
        "Rajanna Sircilla": ["Ellanthakunta", "Gambhiraopeta", "Mustabad", "Sircilla", "Thangallapalle", "Veernapalle", "Yellareddypeta"],
        "Rangareddy": ["Chevella", "Moinabad", "Shabad", "Shankarpalle"],
        "Sangareddy": ["Kalher", "Kangti", "Manoor", "Nagilgidda", "Narayankhed", "Sirgapoor"],
        "Siddipet": ["Dubbak", "Siddipet (Rural)", "Chinnakodur", "Nangnoor", "Siddipet (Urban)", "Thoguta", "Mirdoddi", "Doulthabad", "Komuravelli", "Cherial"],
        "Suryapet": ["Atmakur(s)", "Chivvemla", "Jajireddygudem", "Maddirala", "Mothey", "Nagaram", "Nuthankal", "Penpahad", "Thirumalagiri", "Thungathurthy"],
        "Vikarabad": ["Basheerabad", "Bommaraspet", "Doulthabad", "Kodangal", "Peddemul", "Tandur", "Yelal"],
        "Wanaparthy": ["Amarchinta", "Atmakur", "Chinnambavi", "Ghanpur (Khilla)", "Gopalpeta", "Kothakota", "Madanapur", "Pangal", "Pebbair", "Peddamandadi"],
        "Warangal": ["Geesugonda", "Khila Warangal", "Parvathagiri", "Rayaparthy", "Wardhannapet", "Warangal", "Sangem"],
        "Yadadri Bhuvanagiri": ["Addaguduru", "Alair", "Atmakur (M)", "Bibinagar", "Bhongir", "Bommalaramaram", "Gundala", "Motakondur", "Mothkur", "Rajapet"]
    }
    return mandals_data.get(district, [f"{district} Central", f"{district} East", f"{district} West", f"{district} Rural"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
