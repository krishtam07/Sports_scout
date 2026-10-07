import os
import math
import numpy as np
import pandas as pd

def _rank_data(arr):
    return pd.Series(arr).rank(method="average").values

def _calc_pearson(x, y):
    n = len(x)
    if n < 2:
        return 0.0, 1.0
    r = float(np.corrcoef(x, y)[0, 1])
    if abs(r) >= 1.0:
        return r, 0.0
    t_stat = r * np.sqrt((n - 2) / (1.0 - r**2))
    p_val = 2.0 * (1.0 - 0.5 * (1.0 + math.erf(abs(t_stat) / math.sqrt(2.0))))
    return r, float(p_val)

def _calc_spearman(x, y):
    rx = _rank_data(x)
    ry = _rank_data(y)
    return _calc_pearson(rx, ry)


BATTING_CSV = os.path.join(os.path.dirname(__file__), "data", "batting_ipl2024.csv")
BOWLING_CSV = os.path.join(os.path.dirname(__file__), "data", "bowling_ipl2024.csv")

REQUIRED_BATTING_COLS = [
    "Player", "Team", "Matches", "Innings", "Runs",
    "Batting_Average", "Strike_Rate", "Fours", "Sixes"
]

REQUIRED_BOWLING_COLS = [
    "Player", "Team", "Matches", "Innings", "Balls",
    "Wickets", "Bowling_Average", "Economy", "Bowling_Strike_Rate"
]

class DatasetValidationError(Exception):
    pass

def load_and_validate_datasets():
    # 1. File existence
    if not os.path.exists(BATTING_CSV):
        raise DatasetValidationError(f"Batting CSV file not found at path: {BATTING_CSV}")
    if not os.path.exists(BOWLING_CSV):
        raise DatasetValidationError(f"Bowling CSV file not found at path: {BOWLING_CSV}")

    try:
        df_batting = pd.read_csv(BATTING_CSV)
    except Exception as e:
        raise DatasetValidationError(f"Failed to read Batting CSV: {str(e)}")

    try:
        df_bowling = pd.read_csv(BOWLING_CSV)
    except Exception as e:
        raise DatasetValidationError(f"Failed to read Bowling CSV: {str(e)}")

    # 2. Check required columns
    missing_bat_cols = [c for c in REQUIRED_BATTING_COLS if c not in df_batting.columns]
    if missing_bat_cols:
        raise DatasetValidationError(f"Batting dataset missing required columns: {missing_bat_cols}")

    missing_bowl_cols = [c for c in REQUIRED_BOWLING_COLS if c not in df_bowling.columns]
    if missing_bowl_cols:
        raise DatasetValidationError(f"Bowling dataset missing required columns: {missing_bowl_cols}")

    # 3. Check non-empty
    if df_batting.empty:
        raise DatasetValidationError("Batting dataset is empty!")
    if df_bowling.empty:
        raise DatasetValidationError("Bowling dataset is empty!")

    # 4. Clean and validate data types
    num_bat_cols = ["Matches", "Innings", "Runs", "Batting_Average", "Strike_Rate", "Fours", "Sixes"]
    for col in num_bat_cols:
        df_batting[col] = pd.to_numeric(df_batting[col], errors='coerce')
    
    num_bowl_cols = ["Matches", "Innings", "Balls", "Wickets", "Bowling_Average", "Economy", "Bowling_Strike_Rate"]
    for col in num_bowl_cols:
        df_bowling[col] = pd.to_numeric(df_bowling[col], errors='coerce')

    # Remove nulls in key identifier fields if any
    df_batting = df_batting.dropna(subset=["Player", "Team", "Runs"]).reset_index(drop=True)
    df_bowling = df_bowling.dropna(subset=["Player", "Team", "Wickets"]).reset_index(drop=True)

    return df_batting, df_bowling


# Dynamic analysis class
class IPLAnalyzer:
    def __init__(self):
        self.df_batting, self.df_bowling = load_and_validate_datasets()

    def reload(self):
        self.df_batting, self.df_bowling = load_and_validate_datasets()

    def get_dashboard_summary(self):
        total_batters = int(len(self.df_batting))
        total_bowlers = int(len(self.df_bowling))
        total_runs = int(self.df_batting["Runs"].sum())
        total_wickets = int(self.df_bowling["Wickets"].sum())

        top_run_scorer = self.df_batting.sort_values(by="Runs", ascending=False).iloc[0].to_dict()
        top_wicket_taker = self.df_bowling.sort_values(by="Wickets", ascending=False).iloc[0].to_dict()

        top5_batsmen = self.df_batting.sort_values(by="Runs", ascending=False).head(5).to_dict(orient="records")
        top5_bowlers = self.df_bowling.sort_values(by="Wickets", ascending=False).head(5).to_dict(orient="records")

        # Team aggregated stats
        teams = list(set(self.df_batting["Team"].unique()).union(set(self.df_bowling["Team"].unique())))
        team_summary = []
        for team in sorted(teams):
            b_runs = int(self.df_batting[self.df_batting["Team"] == team]["Runs"].sum())
            w_wkts = int(self.df_bowling[self.df_bowling["Team"] == team]["Wickets"].sum())
            b_count = int(len(self.df_batting[self.df_batting["Team"] == team]))
            w_count = int(len(self.df_bowling[self.df_bowling["Team"] == team]))
            team_summary.append({
                "team": team,
                "runs": b_runs,
                "wickets": w_wkts,
                "batters": b_count,
                "bowlers": w_count
            })

        return {
            "total_batters": total_batters,
            "total_bowlers": total_bowlers,
            "total_runs": total_runs,
            "total_wickets": total_wickets,
            "top_run_scorer": top_run_scorer,
            "top_wicket_taker": top_wicket_taker,
            "top5_batsmen": top5_batsmen,
            "top5_bowlers": top5_bowlers,
            "team_summary": team_summary
        }

    def get_batting_data(self, team=None, search=None, min_runs=0, min_sr=0.0, sort_by="Runs", order="desc"):
        df = self.df_batting.copy()

        if team and team != "ALL":
            df = df[df["Team"] == team]

        if search:
            df = df[df["Player"].str.contains(search, case=False, na=False)]

        if min_runs > 0:
            df = df[df["Runs"] >= min_runs]

        if min_sr > 0:
            df = df[df["Strike_Rate"] >= min_sr]

        if sort_by in df.columns:
            ascending = (order.lower() == "asc")
            df = df.sort_values(by=sort_by, ascending=ascending)

        return df.to_dict(orient="records")

    def get_bowling_data(self, team=None, search=None, min_wickets=0, max_economy=99.0, sort_by="Wickets", order="desc"):
        df = self.df_bowling.copy()

        if team and team != "ALL":
            df = df[df["Team"] == team]

        if search:
            df = df[df["Player"].str.contains(search, case=False, na=False)]

        if min_wickets > 0:
            df = df[df["Wickets"] >= min_wickets]

        if max_economy < 99.0:
            df = df[df["Economy"] <= max_economy]

        if sort_by in df.columns:
            ascending = (order.lower() == "asc")
            # If sorting by Economy or Bowling_Average, asc is usually better, but respect requested order
            df = df.sort_values(by=sort_by, ascending=ascending)

        return df.to_dict(orient="records")

    def get_descriptive_stats(self):
        # Batting stats
        b_runs = self.df_batting["Runs"].values
        b_sr = self.df_batting["Strike_Rate"].values

        batting_stats = {
            "runs": {
                "mean": round(float(np.mean(b_runs)), 2),
                "median": round(float(np.median(b_runs)), 2),
                "variance": round(float(np.var(b_runs, ddof=1)), 2),
                "std_dev": round(float(np.std(b_runs, ddof=1)), 2),
                "min": int(np.min(b_runs)),
                "max": int(np.max(b_runs)),
                "count": len(b_runs)
            },
            "strike_rate": {
                "mean": round(float(np.mean(b_sr)), 2),
                "median": round(float(np.median(b_sr)), 2),
                "variance": round(float(np.var(b_sr, ddof=1)), 2),
                "std_dev": round(float(np.std(b_sr, ddof=1)), 2),
                "min": round(float(np.min(b_sr)), 2),
                "max": round(float(np.max(b_sr)), 2),
                "count": len(b_sr)
            }
        }

        # Bowling stats
        w_wkts = self.df_bowling["Wickets"].values
        w_econ = self.df_bowling["Economy"].values

        bowling_stats = {
            "wickets": {
                "mean": round(float(np.mean(w_wkts)), 2),
                "median": round(float(np.median(w_wkts)), 2),
                "variance": round(float(np.var(w_wkts, ddof=1)), 2),
                "std_dev": round(float(np.std(w_wkts, ddof=1)), 2),
                "min": int(np.min(w_wkts)),
                "max": int(np.max(w_wkts)),
                "count": len(w_wkts)
            },
            "economy": {
                "mean": round(float(np.mean(w_econ)), 2),
                "median": round(float(np.median(w_econ)), 2),
                "variance": round(float(np.var(w_econ, ddof=1)), 2),
                "std_dev": round(float(np.std(w_econ, ddof=1)), 2),
                "min": round(float(np.min(w_econ)), 2),
                "max": round(float(np.max(w_econ)), 2),
                "count": len(w_econ)
            }
        }

        return {
            "batting": batting_stats,
            "bowling": bowling_stats
        }

    def _interpret_correlation(self, r):
        val = abs(r)
        direction = "positive" if r > 0 else "negative"
        if val >= 0.7:
            strength = "Strong"
        elif val >= 0.4:
            strength = "Moderate"
        elif val >= 0.2:
            strength = "Weak"
        else:
            strength = "Negligible / Very Weak"
        
        if val < 0.2:
            return f"Negligible correlation ({r:.4f}). No noticeable linear association."
        return f"{strength} {direction} correlation ({r:.4f})."

    def get_correlations(self):
        # 1. Batting: Runs vs Strike Rate
        b_runs = self.df_batting["Runs"].values
        b_sr = self.df_batting["Strike_Rate"].values

        pearson_bat_r, pearson_bat_p = _calc_pearson(b_runs, b_sr)
        spearman_bat_r, spearman_bat_p = _calc_spearman(b_runs, b_sr)

        # Calculate manual components for Spearman formula display: r_s = 1 - 6 * sum(d^2) / (n * (n^2 - 1))
        n_bat = len(b_runs)
        rank_runs = _rank_data(b_runs)
        rank_sr = _rank_data(b_sr)
        d_bat = rank_runs - rank_sr
        sum_d2_bat = float(np.sum(d_bat**2))

        # 2. Bowling: Wickets vs Economy
        w_wkts = self.df_bowling["Wickets"].values
        w_econ = self.df_bowling["Economy"].values

        pearson_bowl_r, pearson_bowl_p = _calc_pearson(w_wkts, w_econ)
        spearman_bowl_r, spearman_bowl_p = _calc_spearman(w_wkts, w_econ)

        n_bowl = len(w_wkts)
        rank_wkts = _rank_data(w_wkts)
        rank_econ = _rank_data(w_econ)
        d_bowl = rank_wkts - rank_econ
        sum_d2_bowl = float(np.sum(d_bowl**2))

        return {
            "batting": {
                "variables": "Runs vs Strike Rate",
                "n": n_bat,
                "pearson": {
                    "coefficient": round(float(pearson_bat_r), 4),
                    "p_value": round(float(pearson_bat_p), 6),
                    "interpretation": self._interpret_correlation(pearson_bat_r)
                },
                "spearman": {
                    "coefficient": round(float(spearman_bat_r), 4),
                    "p_value": round(float(spearman_bat_p), 6),
                    "sum_d_squared": round(sum_d2_bat, 2),
                    "interpretation": self._interpret_correlation(spearman_bat_r)
                }
            },
            "bowling": {
                "variables": "Wickets vs Economy",
                "n": n_bowl,
                "pearson": {
                    "coefficient": round(float(pearson_bowl_r), 4),
                    "p_value": round(float(pearson_bowl_p), 6),
                    "interpretation": self._interpret_correlation(pearson_bowl_r)
                },
                "spearman": {
                    "coefficient": round(float(spearman_bowl_r), 4),
                    "p_value": round(float(spearman_bowl_p), 6),
                    "sum_d_squared": round(sum_d2_bowl, 2),
                    "interpretation": self._interpret_correlation(spearman_bowl_r)
                }
            }
        }

    def get_probabilities(self):
        total_batters = len(self.df_batting)
        batters_gt_400 = self.df_batting[self.df_batting["Runs"] > 400]
        count_batters_400 = len(batters_gt_400)
        p_runs_400 = count_batters_400 / total_batters if total_batters > 0 else 0.0

        total_bowlers = len(self.df_bowling)
        bowlers_gte_15 = self.df_bowling[self.df_bowling["Wickets"] >= 15]
        count_bowlers_15 = len(bowlers_gte_15)
        p_wkts_15 = count_bowlers_15 / total_bowlers if total_bowlers > 0 else 0.0

        return {
            "batting_runs_gt_400": {
                "event": "Player scores more than 400 runs P(Runs > 400)",
                "favorable_outcomes": count_batters_400,
                "total_outcomes": total_batters,
                "decimal": round(float(p_runs_400), 4),
                "percentage": round(float(p_runs_400 * 100), 2),
                "qualifying_players": batters_gt_400[["Player", "Team", "Runs"]].to_dict(orient="records")
            },
            "bowling_wickets_gte_15": {
                "event": "Player takes at least 15 wickets P(Wickets >= 15)",
                "favorable_outcomes": count_bowlers_15,
                "total_outcomes": total_bowlers,
                "decimal": round(float(p_wkts_15), 4),
                "percentage": round(float(p_wkts_15 * 100), 2),
                "qualifying_players": bowlers_gte_15[["Player", "Team", "Wickets"]].to_dict(orient="records")
            }
        }

    def get_linear_regression(self):
        # Independent variable: Strike Rate (X)
        # Dependent variable: Runs (Y)
        X = self.df_batting["Strike_Rate"].values
        Y = self.df_batting["Runs"].values

        slope, intercept = np.polyfit(X, Y, 1)
        slope = float(slope)
        intercept = float(intercept)

        y_pred = slope * X + intercept
        ss_tot = np.sum((Y - np.mean(Y))**2)
        ss_res = np.sum((Y - y_pred)**2)
        r2 = float(1.0 - (ss_res / ss_tot)) if ss_tot != 0 else 0.0

        # Fitted regression line endpoints for rendering
        min_x = float(np.min(X))
        max_x = float(np.max(X))
        line_min_y = slope * min_x + intercept
        line_max_y = slope * max_x + intercept

        # Scatter data points
        points = []
        for idx, row in self.df_batting.iterrows():
            sr = float(row["Strike_Rate"])
            runs = float(row["Runs"])
            predicted_runs = float(slope * sr + intercept)
            points.append({
                "player": row["Player"],
                "team": row["Team"],
                "strike_rate": sr,
                "runs": runs,
                "predicted_runs": round(predicted_runs, 2),
                "residual": round(runs - predicted_runs, 2)
            })

        r2_pct = round(r2 * 100, 2)
        interpretation = (
            f"The coefficient of determination (R²) is {r2:.4f} ({r2_pct}%). "
            f"This means that approximately {r2_pct}% of the variation in Total Runs "
            f"can be statistically explained by the player's Strike Rate using this linear model. "
            f"The remaining {round(100 - r2_pct, 2)}% is attributed to other factors such as total balls faced, batting position, and team strategy."
        )

        equation_str = f"Runs = {slope:.4f} × (Strike Rate) + ({intercept:.2f})"

        return {
            "slope": round(slope, 4),
            "intercept": round(intercept, 2),
            "r2_score": round(r2, 4),
            "r2_percentage": r2_pct,
            "equation": equation_str,
            "interpretation": interpretation,
            "line_points": [
                {"strike_rate": min_x, "runs": round(line_min_y, 2)},
                {"strike_rate": max_x, "runs": round(line_max_y, 2)}
            ],
            "data_points": points
        }

    def get_visualizations_data(self):

        # 1. Runs distribution histogram
        runs_array = self.df_batting["Runs"].values
        counts, bin_edges = np.histogram(runs_array, bins=7)
        runs_histogram = []
        for i in range(len(counts)):
            runs_histogram.append({
                "bin": f"{int(bin_edges[i])}-{int(bin_edges[i+1])}",
                "range_start": int(bin_edges[i]),
                "range_end": int(bin_edges[i+1]),
                "count": int(counts[i])
            })

        # 2. Wickets distribution histogram
        wkts_array = self.df_bowling["Wickets"].values
        w_counts, w_bin_edges = np.histogram(wkts_array, bins=6)
        wickets_histogram = []
        for i in range(len(w_counts)):
            wickets_histogram.append({
                "bin": f"{int(w_bin_edges[i])}-{int(w_bin_edges[i+1])}",
                "range_start": int(w_bin_edges[i]),
                "range_end": int(w_bin_edges[i+1]),
                "count": int(w_counts[i])
            })

        # 3. Runs Boxplot Metrics
        q1 = float(np.percentile(runs_array, 25))
        median = float(np.median(runs_array))
        q3 = float(np.percentile(runs_array, 75))
        iqr = q3 - q1
        lower_bound = max(float(np.min(runs_array)), q1 - 1.5 * iqr)
        upper_bound = min(float(np.max(runs_array)), q3 + 1.5 * iqr)
        outliers = [float(x) for x in runs_array if x < lower_bound or x > upper_bound]

        runs_box_plot = {
            "min": float(np.min(runs_array)),
            "q1": round(q1, 2),
            "median": round(median, 2),
            "q3": round(q3, 2),
            "max": float(np.max(runs_array)),
            "iqr": round(iqr, 2),
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "outliers": outliers
        }

        # 4. Scatter data
        runs_vs_sr = self.df_batting[["Player", "Team", "Runs", "Strike_Rate", "Batting_Average"]].to_dict(orient="records")
        wkts_vs_econ = self.df_bowling[["Player", "Team", "Wickets", "Economy", "Bowling_Average"]].to_dict(orient="records")

        return {
            "runs_histogram": runs_histogram,
            "wickets_histogram": wickets_histogram,
            "runs_box_plot": runs_box_plot,
            "runs_vs_sr": runs_vs_sr,
            "wickets_vs_econ": wkts_vs_econ
        }

    def get_all_rounders(self):
        # Merge batting and bowling datasets on Player
        merged = pd.merge(
            self.df_batting,
            self.df_bowling,
            on="Player",
            suffixes=("_bat", "_bowl")
        )
        if merged.empty:
            return []

        # Unified team name (take batting team if present)
        merged["Team"] = merged["Team_bat"]

        # Sort all-rounders by combined impact metric (Runs + Wickets * 20)
        merged["AllRounder_Score"] = merged["Runs"] + (merged["Wickets"] * 20)
        merged = merged.sort_values(by="AllRounder_Score", ascending=False)

        cols = [
            "Player", "Team", "Matches_bat", "Innings_bat", "Runs",
            "Batting_Average", "Strike_Rate", "Wickets",
            "Bowling_Average", "Economy", "Bowling_Strike_Rate"
        ]
        result = merged[cols].rename(columns={
            "Matches_bat": "Batting_Matches",
            "Innings_bat": "Batting_Innings"
        }).to_dict(orient="records")

        return result

    def get_player_profile(self, player_name: str):
        bat_record = self.df_batting[self.df_batting["Player"].str.strip().str.lower() == player_name.strip().lower()]
        bowl_record = self.df_bowling[self.df_bowling["Player"].str.strip().str.lower() == player_name.strip().lower()]

        if bat_record.empty and bowl_record.empty:
            return None

        player_data = {}
        if not bat_record.empty:
            bat_info = bat_record.iloc[0].to_dict()
            player_data["name"] = bat_info["Player"]
            player_data["team"] = bat_info["Team"]
            player_data["batting"] = bat_info

            # Rank in batting by Runs
            sorted_bat = self.df_batting.sort_values(by="Runs", ascending=False).reset_index(drop=True)
            rank_bat = sorted_bat[sorted_bat["Player"] == bat_info["Player"]].index[0] + 1
            player_data["batting_rank"] = int(rank_bat)
        else:
            player_data["batting"] = None
            player_data["batting_rank"] = None

        if not bowl_record.empty:
            bowl_info = bowl_record.iloc[0].to_dict()
            if "name" not in player_data:
                player_data["name"] = bowl_info["Player"]
                player_data["team"] = bowl_info["Team"]
            player_data["bowling"] = bowl_info

            # Rank in bowling by Wickets
            sorted_bowl = self.df_bowling.sort_values(by="Wickets", ascending=False).reset_index(drop=True)
            rank_bowl = sorted_bowl[sorted_bowl["Player"] == bowl_info["Player"]].index[0] + 1
            player_data["bowling_rank"] = int(rank_bowl)
        else:
            player_data["bowling"] = None
            player_data["bowling_rank"] = None

        player_data["is_all_rounder"] = (player_data["batting"] is not None) and (player_data["bowling"] is not None)
        return player_data

    def compare_players(self, player1_name: str, player2_name: str):
        p1 = self.get_player_profile(player1_name)
        p2 = self.get_player_profile(player2_name)

        if not p1 or not p2:
            return {"error": "One or both players not found"}

        # Dynamic sentence comparison generation
        summary_sentences = []

        # Batting runs comparison
        if p1.get("batting") and p2.get("batting"):
            r1, r2 = p1["batting"]["Runs"], p2["batting"]["Runs"]
            sr1, sr2 = p1["batting"]["Strike_Rate"], p2["batting"]["Strike_Rate"]
            if r1 > r2:
                summary_sentences.append(f"{p1['name']} scored more runs ({r1} vs {r2})")
            elif r2 > r1:
                summary_sentences.append(f"{p2['name']} scored more runs ({r2} vs {r1})")
            else:
                summary_sentences.append(f"Both players are tied on total runs ({r1})")

            if sr1 > sr2:
                summary_sentences.append(f"while {p1['name']} maintains a higher strike rate ({sr1} vs {sr2}).")
            elif sr2 > sr1:
                summary_sentences.append(f"while {p2['name']} maintains a higher strike rate ({sr2} vs {sr1}).")
            else:
                summary_sentences.append(f"and both share identical strike rates ({sr1}).")
        
        # Bowling wickets comparison
        if p1.get("bowling") and p2.get("bowling"):
            w1, w2 = p1["bowling"]["Wickets"], p2["bowling"]["Wickets"]
            ec1, ec2 = p1["bowling"]["Economy"], p2["bowling"]["Economy"]
            if w1 > w2:
                summary_sentences.append(f"In bowling, {p1['name']} claimed more wickets ({w1} vs {w2}).")
            elif w2 > w1:
                summary_sentences.append(f"In bowling, {p2['name']} claimed more wickets ({w2} vs {w1}).")

            if ec1 < ec2:
                summary_sentences.append(f"{p1['name']} was more economical with an economy of {ec1} compared to {ec2}.")
            elif ec2 < ec1:
                summary_sentences.append(f"{p2['name']} was more economical with an economy of {ec2} compared to {ec1}.")

        summary_text = " ".join(summary_sentences) if summary_sentences else "Comparison available for selected players."

        return {
            "player1": p1,
            "player2": p2,
            "summary": summary_text
        }

    def scout_players(self, category: str = "batting", metric: str = "Runs"):
        category = category.lower()
        if category == "batting":
            df = self.df_batting.copy()
            valid_metrics = ["Runs", "Batting_Average", "Strike_Rate", "Fours", "Sixes"]
            if metric not in valid_metrics:
                metric = "Runs"
            df = df.sort_values(by=metric, ascending=False).reset_index(drop=True)
            records = df.head(10).to_dict(orient="records")
            total_records = len(df)
            top_player = records[0]["Player"]
            top_val = records[0][metric]

            insight = f"Based on {metric.replace('_', ' ')}, {top_player} leads the league with a top mark of {top_val} among {total_records} batting records."
            return {
                "category": "batting",
                "metric": metric,
                "rankings": records,
                "insight": insight
            }
        else:
            df = self.df_bowling.copy()
            valid_metrics = ["Wickets", "Bowling_Average", "Economy", "Bowling_Strike_Rate"]
            if metric not in valid_metrics:
                metric = "Wickets"

            # For Economy and Bowling_Average, lower is generally better
            ascending = True if metric in ["Economy", "Bowling_Average", "Bowling_Strike_Rate"] else False
            df = df.sort_values(by=metric, ascending=ascending).reset_index(drop=True)
            records = df.head(10).to_dict(orient="records")
            total_records = len(df)
            top_player = records[0]["Player"]
            top_val = records[0][metric]

            insight = f"Based on {metric.replace('_', ' ')}, {top_player} ranks 1st with {top_val} among {total_records} bowling records."
            return {
                "category": "bowling",
                "metric": metric,
                "rankings": records,
                "insight": insight
            }

    def get_teams(self):
        bat_teams = self.df_batting["Team"].unique().tolist()
        bowl_teams = self.df_bowling["Team"].unique().tolist()
        all_teams = sorted(list(set(bat_teams).union(set(bowl_teams))))
        return all_teams

    def get_all_player_names(self):
        bat_names = self.df_batting["Player"].unique().tolist()
        bowl_names = self.df_bowling["Player"].unique().tolist()
        return sorted(list(set(bat_names).union(set(bowl_names))))
