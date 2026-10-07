from fastapi import FastAPI, APIRouter, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from analysis import IPLAnalyzer, DatasetValidationError

app = FastAPI(
    title="SPORTS SCOUT - IPL 2024 Analytics API",
    description="Backend API for B.Tech Statistics/Data Analytics project on IPL 2024",
    version="1.0.0"
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def fix_vercel_path(request: Request, call_next):
    raw_path = request.query_params.get("path")
    if raw_path:
        if not raw_path.startswith("/"):
            raw_path = "/" + raw_path
        request.scope["path"] = raw_path
    return await call_next(request)


analyzer = None
init_error = None

@app.on_event("startup")
def startup_event():
    global analyzer, init_error
    try:
        analyzer = IPLAnalyzer()
        init_error = None
        print("Data validation successful! Datasets loaded into IPLAnalyzer.")
    except DatasetValidationError as ve:
        init_error = str(ve)
        print(f"Dataset validation failed on startup: {init_error}")
    except Exception as e:
        init_error = f"Unexpected error loading dataset: {str(e)}"
        print(f"Error on startup: {init_error}")

def check_analyzer():
    global analyzer, init_error
    if analyzer is None and init_error is None:
        try:
            analyzer = IPLAnalyzer()
        except DatasetValidationError as ve:
            init_error = str(ve)
        except Exception as e:
            init_error = f"Unexpected error loading dataset: {str(e)}"

    if init_error:
        raise HTTPException(
            status_code=500,
            detail=f"IPL dataset error: {init_error}"
        )
    if analyzer is None:
        raise HTTPException(
            status_code=500,
            detail="IPL dataset analyzer not initialized."
        )

router = APIRouter()

@router.get("/")
def api_root():
    return {"message": "Sports Scout API is active", "health": "/api/health"}

@router.get("/health")

def get_health():
    if init_error:
        return {"status": "error", "message": init_error}
    return {"status": "ok", "message": "Sports Scout API is running and dataset is valid."}

@router.get("/dashboard")
def get_dashboard():
    check_analyzer()
    return analyzer.get_dashboard_summary()

@router.get("/batting")
def get_batting(
    team: str = Query(None, description="Filter by team"),
    search: str = Query(None, description="Filter by player name search"),
    min_runs: int = Query(0, description="Minimum runs scored"),
    min_sr: float = Query(0.0, description="Minimum strike rate"),
    sort_by: str = Query("Runs", description="Column to sort by"),
    order: str = Query("desc", description="Sort direction: asc or desc")
):
    check_analyzer()
    return analyzer.get_batting_data(
        team=team,
        search=search,
        min_runs=min_runs,
        min_sr=min_sr,
        sort_by=sort_by,
        order=order
    )

@router.get("/bowling")
def get_bowling(
    team: str = Query(None, description="Filter by team"),
    search: str = Query(None, description="Filter by player name search"),
    min_wickets: int = Query(0, description="Minimum wickets taken"),
    max_economy: float = Query(99.0, description="Maximum economy rate"),
    sort_by: str = Query("Wickets", description="Column to sort by"),
    order: str = Query("desc", description="Sort direction: asc or desc")
):
    check_analyzer()
    return analyzer.get_bowling_data(
        team=team,
        search=search,
        min_wickets=min_wickets,
        max_economy=max_economy,
        sort_by=sort_by,
        order=order
    )

@router.get("/statistics")
def get_statistics():
    check_analyzer()
    return analyzer.get_descriptive_stats()

@router.get("/correlation")
def get_correlation():
    check_analyzer()
    return analyzer.get_correlations()

@router.get("/probability")
def get_probability():
    check_analyzer()
    return analyzer.get_probabilities()

@router.get("/regression")
def get_regression():
    check_analyzer()
    return analyzer.get_linear_regression()

@router.get("/visualizations")
def get_visualizations():
    check_analyzer()
    return analyzer.get_visualizations_data()

@router.get("/all-rounders")
def get_all_rounders():
    check_analyzer()
    return analyzer.get_all_rounders()

@router.get("/player/{player_name}")
def get_player_profile(player_name: str):
    check_analyzer()
    res = analyzer.get_player_profile(player_name)
    if not res:
        raise HTTPException(status_code=404, detail=f"Player '{player_name}' not found in dataset")
    return res

@router.get("/compare")
def compare_players(
    player1: str = Query(..., description="First player name"),
    player2: str = Query(..., description="Second player name")
):
    check_analyzer()
    res = analyzer.compare_players(player1, player2)
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res

@router.get("/scout")
def scout_players(
    category: str = Query("batting", description="Category: batting or bowling"),
    metric: str = Query("Runs", description="Metric to rank by")
):
    check_analyzer()
    return analyzer.scout_players(category=category, metric=metric)

@router.get("/teams")
def get_teams():
    check_analyzer()
    return analyzer.get_teams()

@router.get("/players")
def get_all_players():
    check_analyzer()
    return analyzer.get_all_player_names()

app.include_router(router, prefix="/api")
app.include_router(router, prefix="")

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)



