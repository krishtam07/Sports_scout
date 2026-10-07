# 🏏 SPORTS SCOUT

### IPL 2024 Player Performance Analysis

**Turning IPL Performance Data into Statistical Insights**

*A B.Tech Statistics & Data Analytics Project*

---

## 📌 Project Overview

**Sports Scout** is a fully dynamic, interactive, professional web application designed for IPL 2024 cricket player performance analysis. Unlike static dashboards or mock prototypes, **Sports Scout** generates all statistics, charts, rankings, correlations, regression models, probability distributions, player comparisons, scouting leaderboards, and all-rounder evaluations dynamically from underlying CSV datasets.

---

## 🛠 Technology Architecture

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS v4 (Dark sports theme with custom glassmorphism & gradients)
- **Data Visualizations**: Recharts
- **Routing**: React Router (Single Page Application, no page reloads)
- **Icons**: Lucide React

### Backend
- **Framework**: Python FastAPI
- **Data Analysis & Processing**: Pandas, NumPy, SciPy
- **Machine Learning**: Scikit-Learn (Linear Regression Engine)
- **Server**: Uvicorn ASGI Server

### Data Source
- `backend/data/batting_ipl2024.csv`
- `backend/data/bowling_ipl2024.csv`

---

## 🚀 How to Run the Project

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Start the Backend API (FastAPI)

Open a terminal window and execute:

```powershell
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

The backend server will start at `http://127.0.0.1:8000`. You can inspect dataset validation at `http://127.0.0.1:8000/api/health`.

### 3. Start the Frontend Application (React)

Open a second terminal window and execute:

```powershell
cd frontend
npm install
npm run dev
```

Open your browser and navigate to `http://127.0.0.1:3000`.

---

## 📊 Core Features & Pages

1. **Dashboard (`/`)**: Dynamic KPIs (Total batters, bowlers, runs, wickets), Orange & Purple Cap highlights, Top 5 Batting/Bowling tables, and team performance chart.
2. **Batting Analysis (`/batting`)**: Multi-parameter search, team filtering, minimum runs slider, minimum strike rate slider, and column sorting.
3. **Bowling Analysis (`/bowling`)**: Player search, team filter, minimum wickets slider, maximum economy rate slider, and column sorting.
4. **Statistical Analysis (`/statistics`)**: Mean ($\bar{x}$), Median, Sample Variance ($s^2$), Standard Deviation ($s$), Pearson Correlation ($r$), Spearman Rank Correlation ($r_s$), Empirical Probability $P(A)$, and mathematical formula cards with expandable explanations.
5. **Visualizations (`/visualizations`)**: Interactive Recharts histograms (Runs & Wickets distributions), Box Plot summary cards, and scatter plots.
6. **Linear Regression (`/regression`)**: Scikit-learn Linear Regression model of Total Runs ($Y$) vs Strike Rate ($X$), displaying Slope ($m$), Intercept ($c$), $R^2$ score, fitted equation, plain English interpretation of $R^2$, and scatter plot overlay.
7. **Player Comparison (`/compare`)**: Side-by-side head-to-head comparison cards with metric highlights and auto-generated comparative insight sentences.
8. **Player Scout (`/scout`)**: Dynamic scouting leaderboards ranked by selected metric (Runs, Average, Strike Rate, Wickets, Economy) with badges and scout insight.
9. **All-Rounders (`/all-rounders`)**: Dual-skill recognition engine automatically detecting players present in both batting and bowling datasets.
10. **About Project (`/about`)**: Objective, academic statistical methods, system architecture, and tech stack details.
11. **Global Player Profile Modal**: Clicking any player anywhere on the website opens a comprehensive profile modal with ranks, badges, and full statistics.

---

## 🌐 API Endpoint Reference

- `GET /api/health` - Dataset validation & server status
- `GET /api/dashboard` - Summary KPIs, top players, team aggregates
- `GET /api/batting` - Filtered & sorted batting data
- `GET /api/bowling` - Filtered & sorted bowling data
- `GET /api/statistics` - Mean, median, variance, std dev
- `GET /api/correlation` - Pearson & Spearman correlations
- `GET /api/probability` - P(Runs > 400) and P(Wickets >= 15)
- `GET /api/regression` - Linear regression model & fitted line points
- `GET /api/visualizations` - Prepared chart datasets & box plot metrics
- `GET /api/all-rounders` - Combined dataset of dual-skill players
- `GET /api/player/{name}` - Full player profile
- `GET /api/compare` - Side-by-side player comparison
- `GET /api/scout` - Dynamic metric-based rankings & scout insights
- `GET /api/teams` - Unique team list
- `GET /api/players` - List of player names
