# DayZero - Goal Recovery System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3.1-blue)

> **Get back on track, one actionable step at a time.**

DayZero is an AI-powered goal recovery system that helps you restart abandoned goals with personalized, time-boxed action steps. Whether you stopped exercising, learning a new skill, or working on a project, DayZero provides science-backed strategies to help you begin again.

## Features

-  **AI-Powered Recommendations** - Uses Google Gemini AI to generate personalized recovery steps
-  **Time-Boxed Actions** - Get actionable steps that fit your available time (15 mins to 3+ hours)
-  **Progress Tracking** - Monitor your recovery journey and success rate
-  **Domain-Specific** - Tailored strategies for Work, Learning, Health, and Financial goals
-  **User Authentication** - Secure login with Supabase or continue as guest
-  **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
-  **Feedback System** - Rate and improve recommendations with integrated tracking

##  Live Demo

- **Frontend**: [https://your-app.vercel.app](https://day-zero-zeta.vercel.app/)
- **Backend API**: [https://your-backend.onrender.com](https://dayzero-krs5.onrender.com)

##  Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: CSS Modules
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: Google Gemini 2.5 Flash
- **Tracking**: Opik (by Comet ML)
- **Deployment**: Render

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Required API Keys

You'll need to sign up for these free services:

1. **Google Gemini API** - [Get API Key](https://makersuite.google.com/app/apikey)
2. **Supabase** - [Create Project](https://supabase.com)
3. **Opik (Optional)** - [Sign Up](https://www.comet.com/site/products/opik/)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/CodeWithRonaldo/DayZero.git
cd DayZero
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=3000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Prompt Management (v1 or v2)
PROMPT_VERSION=v1

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Opik Configuration (Optional)
OPIK_API_KEY=your_opik_api_key
OPIK_BASE_URL=https://app.comet.com
OPIK_PROJECT_NAME=DayZero

# Environment
NODE_ENV=development
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API URL
VITE_API_URL=http://localhost:3000
```

##  Running Locally

### Start the Backend Server

```bash
cd server
npm start
```

Server will run on `http://localhost:3000`

### Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser!

##  Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com) → New Web Service
3. Connect your repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add all environment variables from `server/.env`
6. Deploy!

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) → New Project
3. Import your repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your Render backend URL)
6. Deploy!

##  Project Structure

```
DayZero/
├── frontend/                 # React frontend application
│   ├── pages/               # React components/pages
│   │   ├── Login.jsx        # Authentication page
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── InputForm.jsx    # Goal input form
│   │   ├── RecoveryOutput.jsx # AI-generated recovery steps
│   │   ├── History.jsx      # Recovery history
│   │   └── Header.jsx       # Navigation header
│   ├── *.module.css         # CSS modules for styling
│   ├── supabase.js          # Supabase client
│   └── trackingService.js   # Analytics tracking
│
├── server/                  # Express backend API
│   ├── index.js            # Main server file
│   ├── prompts.js          # AI prompt templates (v1/v2)
│   ├── validation.js       # Output validation logic
│   └── .env                # Environment variables (not committed)
│
└── README.md               # You are here!
```

##  API Endpoints

### POST `/api/generate`

Generate a personalized recovery step.

**Request Body:**
```json
{
  "domain": "Work",
  "goal": "Exercise 3 times per week",
  "time_gap": "1-2 weeks",
  "reason": "Low energy / burnout",
  "capacity": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "domain": "Work",
    "failure_type": "burnout",
    "strategy": "maintenance_mode",
    "next_step": "Set a 15-minute timer and do one bodyweight exercise...",
    "stop_condition": "When the timer goes off",
    "rationale": "Starting small reduces overwhelm...",
    "safety_note": null,
    "capacity_minutes": 30
  }
}
```

### POST `/feedback`

Submit feedback for a recovery step.

**Request Body:**
```json
{
  "trace_id": "recovery_trace_id",
  "primary_feedback": "helpful"
}
```

##  Features in Detail

### 1. Personalized Recovery Steps
- AI analyzes your goal, why you stopped, and available time
- Generates specific, actionable next steps
- Provides clear stop conditions to prevent overwhelm

### 2. Multiple Domains
- **Work**: Projects, productivity, career goals
- **Learning**: Skills, courses, education
- **Health**: Fitness, nutrition, wellness
- **Financial**: Budgeting, saving, investing

### 3. Smart Time Management
- Choose from 15 minutes to 3+ hours
- Steps are tailored to your available capacity
- No overwhelming commitments

### 4. Progress Tracking
- View your recovery history
- Track success rates
- Monitor improvement over time

##  Security Best Practices

- ✅ All sensitive API keys stored in environment variables
- ✅ `.env` files excluded from Git via `.gitignore`
- ✅ CORS configured for frontend-backend communication
- ✅ Supabase handles authentication securely
- ⚠️ Never commit API keys to version control

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For powering intelligent recovery recommendations
- **Supabase** - For authentication and database services
- **Opik/Comet ML** - For AI tracing and evaluation
- **Vercel & Render** - For hosting services



<div align="center">
  <strong>Made with ❤️ to help you get back on track</strong>
</div>
