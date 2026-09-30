# 🏙️ CivicFix AI – Smart City & Civic Life Platform

> **Tagline:** *“Report it. Fix it. Prove it.”*  
> An intelligent, AI-powered civic platform and bilingual assistant connecting citizens with municipal services for rapid grievance redressal and transparent city governance.

---

## 🌟 Key Features

- 🤖 **CivicFix AI Assistant (Bilingual Chatbot)**:
  - **Languages**: Full bilingual support for **English** and **Tamil (தமிழ்)** with instant language switching.
  - **Tanglish & NLP Engine**: Understands colloquial English, Tamil script, and Tanglish phrases.
  - **9-Stage Automated Complaint Flow**:
    1. Problem identification (Potholes, Garbage, Drainage, Streetlights, Water Supply, Traffic, Toilets).
    2. Location capturing with GPS auto-detection.
    3. Time & duration tracking.
    4. Severity level tagging (Low, Medium, High, Critical).
    5. Photographic evidence attachment.
    6. Formatted Complaint Summary card.
    7. Citizen confirmation before dispatch.
    8. Unique Complaint ID generator (`CF-2026-XXXX`).
    9. Real-time tracking docket with SLA timeline.
- 🗺️ **Smart City Geospatial Map**: Interactive city map marking hospitals, emergency centers, transit hubs, and civic tickets.
- 📊 **Civic Health Dashboard**: Real-time telemetry, automated triage metrics, and ward maintenance bottlenecks.
- 🛡️ **SOS & Emergency Broadcasts**: Rapid 1-tap emergency dispatch for police, ambulance, fire & rescue.
- 🔒 **Secure AI Backend Proxy**: Zero-frontend exposure of AI API keys with server-side protection.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Windows PowerShell (built-in) or modern web browser.

### Run with Built-in Server
Open PowerShell in the project directory:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
The server will automatically bind to an available port (e.g. `http://localhost:8085/`) and open your default browser.

---

## 🔑 AI API Configuration (Optional)

To enable Google Gemini AI integration:
1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Add your Google AI Studio API key inside `.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Restart `server.ps1`. The server will automatically connect to Gemini AI Studio.

---

## 📂 Project Structure

```
smart-city/
├── index.html                   # Main single-page application entry
├── server.ps1                   # Standalone PowerShell HTTP & API proxy server
├── .env.example                 # Environment configuration template
├── .gitignore                   # Git ignore rules for secrets
├── src/
│   ├── components/
│   │   └── civicfix-assistant.js # Bilingual chatbot state machine & NLU engine
│   ├── styles/
│   │   ├── index.css            # Core design system & CSS tokens
│   │   ├── civicconnect.css     # Smart City UI theme
│   │   └── civicfix.css         # Chatbot modal & responsive styles
│   └── civic-platform.js        # Core civic application runtime
└── README.md                    # Project documentation
```

---

## 📜 License
MIT License. Built for Smart City & Civic Life Hackathons / Ideathons.
