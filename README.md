# 🌾 AgroSmart AI

**AI-Powered Crop Planning, Advisory & Direct Farmer–Consumer Marketplace**

AgroSmart AI is a production-ready full-stack ecosystem designed to revolutionize modern agriculture. It combines state-of-the-art **Machine Learning** with a real-time marketplace, empowering farmers to maximize yield and efficiency while connecting them directly to consumers.

---

## 🚀 Vision
Built for the next generation of AgriTech, the platform offers a premium startup-grade experience featuring **Glassmorphism UI**, real-time data streaming, and intelligent autonomous advisory tools.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 (Custom Theme)
- **Animations**: Framer Motion
- **Visualization**: Recharts (High-fidelity analytics)
- **Icons**: Lucide React
- **Routing**: React Router DOM 7

### Backend
- **Framework**: Python FastAPI
- **Intelligence**: Scikit-Learn (RandomForest), Pandas, Joblib
- **Security**: JWT Authentication & Bcrypt Hashing
- **Validation**: Pydantic v2

### 🗄️ Database & Operations
- **Provider**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime for order tracking
- **Access Control**: Row Level Security (RLS) policies

---

## ✨ Intelligent Features

### 🚜 For Farmers
- **AI Crop Recommendation**: High-precision `RandomForestClassifier` suggesting crops based on NPK levels, soil pH, and climate data.
- **AI Profit Projector**: `RandomForestRegressor` forecasting net revenue based on variety and land size.
- **Disease Detection**: Integrated TensorFlow placeholders for computer vision-based plant diagnostics.
- **Smart Advisory**: Real-time advice on soil health and fertilizer application.
- **Direct Marketplace**: List crops directly for consumers, bypassing middlemen to increase margins.

### 🛒 For Consumers
- **Hyper-local Marketplace**: Interactive map and list-based discovery of organic produce.
- **Verified Farmers**: Quality assurance through profile verification and auto-generated IDs (FRM/CON).
- **Direct Orders**: Real-time notifications and payment-ready checkout flow.

### 📊 For Admins (Command Center)
- **System Telemetry**: Live tracking of user growth, revenue metrics, and order logistics.
- **Feature Toggles**: Instantly enable/disable AI modules (Chat, Weather, ML) across the platform.
- **Node Management**: Full visibility into user clusters (Farmers vs Consumers).

---

## 🧠 Machine Learning Engine
The system features an autonomous `AIEngine` that:
1. **Auto-Trains**: Detects missing models on startup and trains them using `ml_data/` CSV files.
2. **Inference**: High-speed pickled model execution for real-time recommendations.
3. **Encoding**: Handles categorical mapping for Soil Types and Seasons automatically.

---

## ⚙️ Setup & Installation

### Backend
1. **Prepare Environment**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. **Install Requirements**:
   ```bash
   pip install fastapi uvicorn pandas scikit-learn joblib passlib[bcrypt] python-jose[cryptography] numpy
   ```
3. **Launch API**:
   ```bash
   python main.py
   ```
   *The engine will train models on the first run. Output will appear in the `models/` directory.*

### Frontend
1. **Initialize Node**:
   ```bash
   cd frontend
   npm install
   ```
2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

---

## 🗝️ Professional Aesthetics
- **Theme**: Dark Emerald & Deep Forest accents.
- **UX**: 60fps Framer Motion transitions and micro-interactions.
- **Navigation**: Dynamic role-based sidebar that adapts to Admin feature toggles.

---

*Developed with ❤️ by the Google Deepmind team for Advanced Agentic Coding.*
