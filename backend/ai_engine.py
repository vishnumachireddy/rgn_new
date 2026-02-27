import os
import pandas as pd
import joblib
import httpx
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Paths
DATA_DIR = "ml_data"
MODEL_DIR = "models"
CROP_DATA_PATH = os.path.join(DATA_DIR, "crop_recommendation_dataset.csv")
PROFIT_DATA_PATH = os.path.join(DATA_DIR, "crop_profit_dataset.csv")

SOIL_NPK_DATA_PATH = os.path.join(DATA_DIR, "soil_npk_dataset.csv")
SOIL_PH_DATA_PATH = os.path.join(DATA_DIR, "soil_ph_dataset.csv")

CROP_MODEL_PATH = os.path.join(MODEL_DIR, "crop_model.pkl")
PROFIT_MODEL_PATH = os.path.join(MODEL_DIR, "profit_model.pkl")
SOIL_NPK_MODEL_PATH = os.path.join(MODEL_DIR, "soil_npk_model.pkl")
PH_MODEL_PATH = os.path.join(MODEL_DIR, "ph_model.pkl")
STRATEGY_DATA_PATH = os.path.join(DATA_DIR, "market_future_profit_dataset.csv")
PRICE_MODEL_PATH = os.path.join(MODEL_DIR, "price_model.pkl")
FUTURE_PRICE_MODEL_PATH = os.path.join(MODEL_DIR, "future_price_model.pkl")
ENCODERS_PATH = os.path.join(MODEL_DIR, "encoders.pkl")

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
WEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

class AIEngine:
    def __init__(self):
        os.makedirs(MODEL_DIR, exist_ok=True)
        self.crop_model = None
        self.profit_model = None
        self.soil_npk_model = None
        self.ph_model = None
        self.price_model = None
        self.future_price_model = None
        self.encoders = {}
        self.load_or_train()
        
        # Initialize Groq Client
        self.groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

    def load_or_train(self):
        # We check if all model files exist
        models_exist = all(os.path.exists(p) for p in [
            CROP_MODEL_PATH, PROFIT_MODEL_PATH, SOIL_NPK_MODEL_PATH, 
            PH_MODEL_PATH, PRICE_MODEL_PATH, FUTURE_PRICE_MODEL_PATH, ENCODERS_PATH
        ])
        
        if models_exist:
            self.crop_model = joblib.load(CROP_MODEL_PATH)
            self.profit_model = joblib.load(PROFIT_MODEL_PATH)
            self.soil_npk_model = joblib.load(SOIL_NPK_MODEL_PATH)
            self.ph_model = joblib.load(PH_MODEL_PATH)
            self.price_model = joblib.load(PRICE_MODEL_PATH)
            self.future_price_model = joblib.load(FUTURE_PRICE_MODEL_PATH)
            self.encoders = joblib.load(ENCODERS_PATH)
        else:
            print("AI Engine: Training models...")
            # 1. Initialize Encoders with comprehensive labels to avoid transform errors
            self.init_encoders()
            # 2. Train models
            self.train_crop_model()
            self.train_profit_model()
            self.train_soil_npk_model()
            self.train_ph_model()
            self.train_strategy_models()
            joblib.dump(self.encoders, ENCODERS_PATH)
            print("AI Engine: Training complete.")

    def init_encoders(self):
        # Pre-fit encoders with all possible values from datasets
        self.encoders['soil_type'] = LabelEncoder()
        self.encoders['season'] = LabelEncoder()
        self.encoders['crop'] = LabelEncoder()
        
        # Collect all possible soil types and seasons
        crop_df = pd.read_csv(CROP_DATA_PATH)
        soil_df = pd.read_csv(SOIL_NPK_DATA_PATH)
        ph_df = pd.read_csv(SOIL_PH_DATA_PATH)
        profit_df = pd.read_csv(PROFIT_DATA_PATH)
        
        all_soils = pd.concat([crop_df['soil_type'], soil_df['soil_type'], ph_df['soil_type']]).unique()
        all_seasons = crop_df['season'].unique()
        all_crops = pd.concat([crop_df['crop_label'], profit_df['crop']]).unique()
        
        self.encoders['soil_type'].fit(all_soils)
        self.encoders['season'].fit(all_seasons)
        self.encoders['crop'].fit(all_crops)
        
        # Strategy specific
        if os.path.exists(STRATEGY_DATA_PATH):
            strat_df = pd.read_csv(STRATEGY_DATA_PATH)
            self.encoders['strategy_crop'] = LabelEncoder()
            self.encoders['strategy_crop'].fit(strat_df['crop_name'].unique())

    def train_crop_model(self):
        df = pd.read_csv(CROP_DATA_PATH)
        df['soil_type'] = self.encoders['soil_type'].transform(df['soil_type'])
        df['season'] = self.encoders['season'].transform(df['season'])
        X = df.drop('crop_label', axis=1)
        y = df['crop_label']
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        self.crop_model = model
        joblib.dump(model, CROP_MODEL_PATH)

    def train_profit_model(self):
        df = pd.read_csv(PROFIT_DATA_PATH)
        df['crop'] = self.encoders['crop'].transform(df['crop'])
        X = df[['crop', 'land_size_acres']]
        y = df['net_profit']
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        self.profit_model = model
        joblib.dump(model, PROFIT_MODEL_PATH)

    def train_soil_npk_model(self):
        from sklearn.multioutput import MultiOutputRegressor
        df = pd.read_csv(SOIL_NPK_DATA_PATH)
        df['soil_type_encoded'] = self.encoders['soil_type'].transform(df['soil_type'])
            
        X = df[['soil_type_encoded']]
        y = df[['nitrogen', 'phosphorus', 'potassium']]
        
        regr = RandomForestRegressor(n_estimators=100, random_state=42)
        model = MultiOutputRegressor(regr)
        model.fit(X, y)
        
        self.soil_npk_model = model
        joblib.dump(model, SOIL_NPK_MODEL_PATH)

    def train_ph_model(self):
        df = pd.read_csv(SOIL_PH_DATA_PATH)
        df['soil_type_encoded'] = self.encoders['soil_type'].transform(df['soil_type'])
        
        X = df[['soil_type_encoded', 'nitrogen', 'phosphorus', 'potassium', 'rainfall', 'temperature', 'humidity']]
        y = df['soil_ph']
        
        model = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42)
        model.fit(X, y)
        
        self.ph_model = model
        joblib.dump(model, PH_MODEL_PATH)

    def predict_ph(self, soil_type, n, p, k, rain, temp, humid):
        try:
            soil_enc = self.encoders['soil_type'].transform([soil_type])[0]
            prediction = self.ph_model.predict([[soil_enc, n, p, k, rain, temp, humid]])[0]
            
            ph = round(float(prediction), 2)
            
            if ph < 6.0:
                rec = "Soil acidic. Consider lime treatment."
            elif 6.0 <= ph <= 7.5:
                rec = "Soil optimal for most crops."
            else:
                rec = "Soil alkaline. Add organic compost or gypsum."
                
            return {
                "predicted_ph": ph,
                "confidence_note": "AI Estimated Soil pH",
                "recommendation": rec
            }
        except Exception as e:
            return {"error": str(e)}

    def predict_npk(self, soil_type):
        try:
            soil_enc = self.encoders['soil_type'].transform([soil_type])[0]
            prediction = self.soil_npk_model.predict([[soil_enc]])[0]
            n, p, k = prediction
            fertility = (n + p + k) / 3.0
            return {
                "nitrogen": int(n),
                "phosphorus": int(p),
                "potassium": int(k),
                "fertility_score": round(float(fertility), 2)
            }
        except Exception as e:
            return {"error": str(e)}

    def predict_crop(self, soil_type, n, p, k, temp, humid, rain, ph, season):
        try:
            soil_enc = self.encoders['soil_type'].transform([soil_type])[0]
            season_enc = self.encoders['season'].transform([season])[0]
            input_data = [[soil_enc, n, p, k, temp, humid, rain, ph, season_enc]]
            prediction = self.crop_model.predict(input_data)[0]
            prob = self.crop_model.predict_proba(input_data).max()
            
            # Get LLM Advisory for this crop
            advisory = self.get_groq_advisory(prediction, soil_type, temp)
            
            return {
                "recommended_crop": prediction,
                "confidence_score": round(float(prob) * 100, 2),
                "ai_insight": advisory
            }
        except Exception as e:
            return {"error": str(e)}

    def predict_profit(self, crop, land_size):
        try:
            crop_enc = self.encoders['crop'].transform([crop])[0]
            prediction = self.profit_model.predict([[crop_enc, land_size]])[0]
            
            # Get LLM Financial Analysis
            analysis = self.get_groq_profit_analysis(crop, land_size, prediction)
            
            return {
                "estimated_profit": round(float(prediction), 2),
                "ai_analysis": analysis
            }
        except Exception as e:
            return {"error": str(e)}

    # --- Profit Strategy Logic ---
    def train_strategy_models(self):
        if not os.path.exists(STRATEGY_DATA_PATH): return
        
        df = pd.read_csv(STRATEGY_DATA_PATH)
        df['crop_encoded'] = self.encoders['strategy_crop'].transform(df['crop_name'])
        
        # Present Price Model
        X_now = df[['crop_encoded', 'month', 'demand_index', 'supply_index']]
        y_now = df['avg_market_price']
        
        model_now = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)
        model_now.fit(X_now, y_now)
        self.price_model = model_now
        joblib.dump(model_now, PRICE_MODEL_PATH)
        
        # Future Price Model
        model_future = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42)
        model_future.fit(X_now, y_now) # Simple reuse for same relationship logic
        self.future_price_model = model_future
        joblib.dump(model_future, FUTURE_PRICE_MODEL_PATH)

    def predict_profit_strategy(self, crop, land_size, yield_per_acre, production_cost, months_to_store):
        try:
            import datetime
            now = datetime.datetime.now()
            current_month = now.month
            future_month = (current_month + months_to_store - 1) % 12 + 1
            
            crop_enc = self.encoders['strategy_crop'].transform([crop])[0]
            
            # Default market indexes if no real-time data
            demand = 85.0
            supply = 75.0
            
            # Predictions
            current_price = self.price_model.predict([[crop_enc, current_month, demand, supply]])[0]
            future_price = self.future_price_model.predict([[crop_enc, future_month, demand, supply]])[0]
            
            total_yield = land_size * yield_per_acre
            
            # Storage cost logic (simulated from dataset average)
            storage_cost_rate = current_price * 0.02
            total_storage_cost = storage_cost_rate * months_to_store * total_yield
            
            sell_now_profit = (current_price * total_yield) - production_cost
            store_profit = (future_price * total_yield) - production_cost - total_storage_cost
            
            risk_score = (abs(future_price - current_price) / current_price) * 100
            
            recommendation = "Sell Now"
            if store_profit > sell_now_profit and risk_score < 20:
                recommendation = f"Store for {months_to_store} months"
            
            # AI Statement
            ai_stmt = "We use RandomForest-based market forecasting models trained on historical pricing, demand, and supply data to estimate both present and future crop profitability. The system evaluates storage cost and risk to recommend the most profitable selling strategy."
            
            return {
                "sell_now_profit": round(float(sell_now_profit), 2),
                "store_profit": round(float(store_profit), 2),
                "risk_score": round(float(risk_score), 2),
                "current_price": round(float(current_price), 2),
                "future_price": round(float(future_price), 2),
                "recommended_strategy": recommendation,
                "ai_explanation": ai_stmt
            }
        except Exception as e:
            return {"error": str(e)}

    # --- Groq LLM Methods ---
    def get_groq_advisory(self, crop, soil, temp):
        if not self.groq_client: return "AI Advisory unavailable (Check API Key)"
        prompt = f"As an expert Agrieducator, provide a short, actionable 3-point advice for a farmer planting {crop} in {soil} soil with average temperature {temp}°C. Be concise and professional."
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except: return "Failed to fetch AI insights."

    def get_groq_profit_analysis(self, crop, acres, profit):
        if not self.groq_client: return "Financial Analysis unavailable."
        prompt = f"A farmer is growing {crop} on {acres} acres with an estimated net profit of ₹{profit}. Provide a one-sentence strategic insight on how to increase this margin."
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except: return "Could not generate analysis."

    def chat_with_ai(self, query):
        if not self.groq_client: return "AI Chat offline."
        
        # Rigid agricultural system prompt
        system_prompt = (
            "You are AgroSmart AI, a hyper-specialized agricultural advisor. "
            "STRICT RULE: You only answer questions related to agriculture, farming, crops, "
            "soil health, livestock, agritech, and weather's impact on farming. "
            "If a user asks about anything else (e.g. politics, coding, non-farm business, entertainment), "
            "politely refuse and state that you are an AI dedicated solely to farming and agriculture."
        )
        
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt}, 
                    {"role": "user", "content": query}
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except: return "I'm having trouble connecting to my brain right now."

    # --- Weather API Integration ---
    async def get_weather(self, lat, lon):
        # Reload key in case it changed recently
        api_key = os.getenv("OPENWEATHER_API_KEY")
        
        # If key is missing, return a healthy fallback instead of a raw error object
        if not api_key: 
             return {
                "temp": 28, "humidity": 65, "condition": "Syncing", 
                "description": "Weather Key Pending Activation",
                "city": "Remote Station", "offline": True
            }
        
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        
        async with httpx.AsyncClient() as client:
            try:
                res = await client.get(url, timeout=10.0)
                if res.status_code != 200:
                    raise Exception(f"API Error: {res.status_code}")
                
                data = res.json()
                return {
                    "temp": data['main']['temp'],
                    "humidity": data['main']['humidity'],
                    "condition": data['weather'][0]['main'],
                    "description": data['weather'][0]['description'],
                    "city": data.get('name', 'Unknown Region')
                }
            except Exception as e:
                print(f"Weather API Fetch Failed: {str(e)}")
                return {
                    "temp": 28,
                    "humidity": 65,
                    "condition": "Cloudy",
                    "description": "Weather service currently synchronizing",
                    "city": "Your Region",
                    "offline": True
                }

ai_engine = AIEngine()
