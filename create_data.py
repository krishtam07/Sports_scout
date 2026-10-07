import os
import pandas as pd

os.makedirs("backend/data", exist_ok=True)

batting_data = [
    {"Player": "Virat Kohli", "Team": "RCB", "Matches": 15, "Innings": 15, "Runs": 741, "Batting_Average": 61.75, "Strike_Rate": 154.69, "Fours": 62, "Sixes": 38},
    {"Player": "Ruturaj Gaikwad", "Team": "CSK", "Matches": 14, "Innings": 14, "Runs": 583, "Batting_Average": 53.00, "Strike_Rate": 141.16, "Fours": 58, "Sixes": 18},
    {"Player": "Riyan Parag", "Team": "RR", "Matches": 16, "Innings": 14, "Runs": 573, "Batting_Average": 52.09, "Strike_Rate": 149.21, "Fours": 40, "Sixes": 33},
    {"Player": "Travis Head", "Team": "SRH", "Matches": 15, "Innings": 15, "Runs": 567, "Batting_Average": 40.50, "Strike_Rate": 191.55, "Fours": 64, "Sixes": 32},
    {"Player": "Sanju Samson", "Team": "RR", "Matches": 16, "Innings": 15, "Runs": 531, "Batting_Average": 48.27, "Strike_Rate": 153.46, "Fours": 48, "Sixes": 24},
    {"Player": "Sai Sudharsan", "Team": "GT", "Matches": 12, "Innings": 12, "Runs": 527, "Batting_Average": 47.90, "Strike_Rate": 141.28, "Fours": 48, "Sixes": 16},
    {"Player": "KL Rahul", "Team": "LSG", "Matches": 14, "Innings": 14, "Runs": 520, "Batting_Average": 37.14, "Strike_Rate": 136.12, "Fours": 45, "Sixes": 19},
    {"Player": "Nicholas Pooran", "Team": "LSG", "Matches": 14, "Innings": 14, "Runs": 499, "Batting_Average": 62.37, "Strike_Rate": 178.21, "Fours": 35, "Sixes": 36},
    {"Player": "Sunil Narine", "Team": "KKR", "Matches": 15, "Innings": 14, "Runs": 488, "Batting_Average": 34.85, "Strike_Rate": 180.74, "Fours": 50, "Sixes": 33},
    {"Player": "Abhishek Sharma", "Team": "SRH", "Matches": 16, "Innings": 16, "Runs": 484, "Batting_Average": 32.26, "Strike_Rate": 204.21, "Fours": 36, "Sixes": 42},
    {"Player": "Heinrich Klaasen", "Team": "SRH", "Matches": 16, "Innings": 15, "Runs": 479, "Batting_Average": 39.91, "Strike_Rate": 171.07, "Fours": 19, "Sixes": 38},
    {"Player": "Rishabh Pant", "Team": "DC", "Matches": 13, "Innings": 13, "Runs": 446, "Batting_Average": 40.54, "Strike_Rate": 155.40, "Fours": 25, "Sixes": 25},
    {"Player": "Faf du Plessis", "Team": "RCB", "Matches": 15, "Innings": 15, "Runs": 438, "Batting_Average": 29.20, "Strike_Rate": 161.62, "Fours": 47, "Sixes": 21},
    {"Player": "Yashasvi Jaiswal", "Team": "RR", "Matches": 16, "Innings": 15, "Runs": 435, "Batting_Average": 31.07, "Strike_Rate": 155.91, "Fours": 54, "Sixes": 16},
    {"Player": "Phil Salt", "Team": "KKR", "Matches": 12, "Innings": 12, "Runs": 435, "Batting_Average": 39.54, "Strike_Rate": 182.00, "Fours": 50, "Sixes": 24},
    {"Player": "Shubman Gill", "Team": "GT", "Matches": 12, "Innings": 12, "Runs": 426, "Batting_Average": 38.72, "Strike_Rate": 147.40, "Fours": 39, "Sixes": 15},
    {"Player": "Rohit Sharma", "Team": "MI", "Matches": 14, "Innings": 14, "Runs": 417, "Batting_Average": 32.07, "Strike_Rate": 150.00, "Fours": 45, "Sixes": 23},
    {"Player": "Tilak Varma", "Team": "MI", "Matches": 13, "Innings": 13, "Runs": 416, "Batting_Average": 41.60, "Strike_Rate": 149.64, "Fours": 35, "Sixes": 19},
    {"Player": "Marcus Stoinis", "Team": "LSG", "Matches": 14, "Innings": 14, "Runs": 400, "Batting_Average": 36.36, "Strike_Rate": 148.69, "Fours": 37, "Sixes": 17},
    {"Player": "Shivam Dube", "Team": "CSK", "Matches": 14, "Innings": 14, "Runs": 396, "Batting_Average": 36.00, "Strike_Rate": 162.29, "Fours": 28, "Sixes": 28},
    {"Player": "Rajat Patidar", "Team": "RCB", "Matches": 15, "Innings": 13, "Runs": 395, "Batting_Average": 30.38, "Strike_Rate": 177.13, "Fours": 19, "Sixes": 33},
    {"Player": "Tristan Stubbs", "Team": "DC", "Matches": 14, "Innings": 13, "Runs": 378, "Batting_Average": 54.00, "Strike_Rate": 190.90, "Fours": 24, "Sixes": 24},
    {"Player": "Venkatesh Iyer", "Team": "KKR", "Matches": 14, "Innings": 13, "Runs": 370, "Batting_Average": 46.25, "Strike_Rate": 158.79, "Fours": 36, "Sixes": 19},
    {"Player": "Shashank Singh", "Team": "PBKS", "Matches": 14, "Innings": 14, "Runs": 354, "Batting_Average": 44.25, "Strike_Rate": 164.65, "Fours": 28, "Sixes": 21},
    {"Player": "Shreyas Iyer", "Team": "KKR", "Matches": 14, "Innings": 14, "Runs": 351, "Batting_Average": 39.00, "Strike_Rate": 146.86, "Fours": 31, "Sixes": 15},
    {"Player": "Suryakumar Yadav", "Team": "MI", "Matches": 11, "Innings": 11, "Runs": 345, "Batting_Average": 34.50, "Strike_Rate": 167.47, "Fours": 36, "Sixes": 18},
    {"Player": "Prabhsimran Singh", "Team": "PBKS", "Matches": 14, "Innings": 14, "Runs": 334, "Batting_Average": 23.85, "Strike_Rate": 156.80, "Fours": 38, "Sixes": 18},
    {"Player": "Jake Fraser-McGurk", "Team": "DC", "Matches": 9, "Innings": 9, "Runs": 330, "Batting_Average": 36.66, "Strike_Rate": 234.04, "Fours": 32, "Sixes": 28},
    {"Player": "Dinesh Karthik", "Team": "RCB", "Matches": 15, "Innings": 13, "Runs": 326, "Batting_Average": 36.22, "Strike_Rate": 187.35, "Fours": 27, "Sixes": 21},
    {"Player": "Sam Curran", "Team": "PBKS", "Matches": 13, "Innings": 13, "Runs": 270, "Batting_Average": 27.00, "Strike_Rate": 123.28, "Fours": 26, "Sixes": 8},
    {"Player": "Ravindra Jadeja", "Team": "CSK", "Matches": 14, "Innings": 11, "Runs": 267, "Batting_Average": 44.50, "Strike_Rate": 142.78, "Fours": 22, "Sixes": 8},
    {"Player": "Cameron Green", "Team": "RCB", "Matches": 13, "Innings": 12, "Runs": 255, "Batting_Average": 31.87, "Strike_Rate": 143.25, "Fours": 21, "Sixes": 10},
    {"Player": "Axar Patel", "Team": "DC", "Matches": 14, "Innings": 12, "Runs": 235, "Batting_Average": 29.37, "Strike_Rate": 131.28, "Fours": 16, "Sixes": 9},
    {"Player": "Will Jacks", "Team": "RCB", "Matches": 8, "Innings": 8, "Runs": 230, "Batting_Average": 32.85, "Strike_Rate": 175.57, "Fours": 22, "Sixes": 15},
    {"Player": "Andre Russell", "Team": "KKR", "Matches": 15, "Innings": 9, "Runs": 222, "Batting_Average": 31.71, "Strike_Rate": 185.00, "Fours": 18, "Sixes": 15},
    {"Player": "Hardik Pandya", "Team": "MI", "Matches": 14, "Innings": 13, "Runs": 216, "Batting_Average": 18.00, "Strike_Rate": 143.04, "Fours": 16, "Sixes": 11},
    {"Player": "Shahbaz Ahmed", "Team": "SRH", "Matches": 16, "Innings": 12, "Runs": 211, "Batting_Average": 26.37, "Strike_Rate": 138.81, "Fours": 12, "Sixes": 12},
    {"Player": "Ashutosh Sharma", "Team": "PBKS", "Matches": 11, "Innings": 9, "Runs": 189, "Batting_Average": 27.00, "Strike_Rate": 167.25, "Fours": 10, "Sixes": 15},
    {"Player": "Pat Cummins", "Team": "SRH", "Matches": 16, "Innings": 12, "Runs": 136, "Batting_Average": 17.00, "Strike_Rate": 143.15, "Fours": 10, "Sixes": 7},
    {"Player": "Krunal Pandya", "Team": "LSG", "Matches": 14, "Innings": 10, "Runs": 133, "Batting_Average": 33.25, "Strike_Rate": 131.68, "Fours": 11, "Sixes": 4},
    {"Player": "Swapnil Singh", "Team": "RCB", "Matches": 7, "Innings": 6, "Runs": 28, "Batting_Average": 14.00, "Strike_Rate": 155.55, "Fours": 3, "Sixes": 1}
]

bowling_data = [
    {"Player": "Harshal Patel", "Team": "PBKS", "Matches": 14, "Innings": 14, "Balls": 312, "Wickets": 24, "Bowling_Average": 19.87, "Economy": 9.15, "Bowling_Strike_Rate": 13.00},
    {"Player": "Varun Chakaravarthy", "Team": "KKR", "Matches": 15, "Innings": 14, "Balls": 336, "Wickets": 21, "Bowling_Average": 19.14, "Economy": 8.04, "Bowling_Strike_Rate": 16.00},
    {"Player": "Jasprit Bumrah", "Team": "MI", "Matches": 13, "Innings": 13, "Balls": 312, "Wickets": 20, "Bowling_Average": 16.80, "Economy": 6.48, "Bowling_Strike_Rate": 15.60},
    {"Player": "T Natarajan", "Team": "SRH", "Matches": 14, "Innings": 14, "Balls": 306, "Wickets": 19, "Bowling_Average": 24.47, "Economy": 9.09, "Bowling_Strike_Rate": 16.10},
    {"Player": "Arshdeep Singh", "Team": "PBKS", "Matches": 14, "Innings": 14, "Balls": 302, "Wickets": 19, "Bowling_Average": 26.57, "Economy": 10.03, "Bowling_Strike_Rate": 15.89},
    {"Player": "Harshit Rana", "Team": "KKR", "Matches": 13, "Innings": 11, "Balls": 253, "Wickets": 19, "Bowling_Average": 20.15, "Economy": 9.08, "Bowling_Strike_Rate": 13.31},
    {"Player": "Andre Russell", "Team": "KKR", "Matches": 15, "Innings": 14, "Balls": 176, "Wickets": 19, "Bowling_Average": 15.52, "Economy": 10.05, "Bowling_Strike_Rate": 9.26},
    {"Player": "Avesh Khan", "Team": "RR", "Matches": 16, "Innings": 15, "Balls": 330, "Wickets": 19, "Bowling_Average": 27.68, "Economy": 9.58, "Bowling_Strike_Rate": 17.36},
    {"Player": "Pat Cummins", "Team": "SRH", "Matches": 16, "Innings": 16, "Balls": 360, "Wickets": 18, "Bowling_Average": 31.44, "Economy": 9.27, "Bowling_Strike_Rate": 20.00},
    {"Player": "Yuzvendra Chahal", "Team": "RR", "Matches": 15, "Innings": 15, "Balls": 348, "Wickets": 18, "Bowling_Average": 30.33, "Economy": 9.41, "Bowling_Strike_Rate": 19.33},
    {"Player": "Sunil Narine", "Team": "KKR", "Matches": 15, "Innings": 14, "Balls": 336, "Wickets": 17, "Bowling_Average": 21.64, "Economy": 6.69, "Bowling_Strike_Rate": 19.76},
    {"Player": "Mitchell Starc", "Team": "KKR", "Matches": 14, "Innings": 13, "Balls": 275, "Wickets": 17, "Bowling_Average": 26.11, "Economy": 10.61, "Bowling_Strike_Rate": 16.17},
    {"Player": "Mukesh Kumar", "Team": "DC", "Matches": 10, "Innings": 10, "Balls": 214, "Wickets": 17, "Bowling_Average": 21.64, "Economy": 10.36, "Bowling_Strike_Rate": 12.58},
    {"Player": "Khaleel Ahmed", "Team": "DC", "Matches": 14, "Innings": 14, "Balls": 300, "Wickets": 17, "Bowling_Average": 28.17, "Economy": 9.58, "Bowling_Strike_Rate": 17.64},
    {"Player": "Tushar Deshpande", "Team": "CSK", "Matches": 13, "Innings": 13, "Balls": 288, "Wickets": 17, "Bowling_Average": 24.94, "Economy": 8.83, "Bowling_Strike_Rate": 16.94},
    {"Player": "Kuldeep Yadav", "Team": "DC", "Matches": 11, "Innings": 11, "Balls": 258, "Wickets": 16, "Bowling_Average": 23.25, "Economy": 8.65, "Bowling_Strike_Rate": 16.12},
    {"Player": "Trent Boult", "Team": "RR", "Matches": 16, "Innings": 16, "Balls": 330, "Wickets": 16, "Bowling_Average": 27.68, "Economy": 8.05, "Bowling_Strike_Rate": 20.62},
    {"Player": "Sam Curran", "Team": "PBKS", "Matches": 13, "Innings": 13, "Balls": 264, "Wickets": 16, "Bowling_Average": 26.06, "Economy": 10.15, "Bowling_Strike_Rate": 16.50},
    {"Player": "Yash Dayal", "Team": "RCB", "Matches": 14, "Innings": 14, "Balls": 310, "Wickets": 15, "Bowling_Average": 30.60, "Economy": 9.14, "Bowling_Strike_Rate": 20.66},
    {"Player": "Mohammed Siraj", "Team": "RCB", "Matches": 14, "Innings": 14, "Balls": 300, "Wickets": 15, "Bowling_Average": 33.06, "Economy": 9.18, "Bowling_Strike_Rate": 20.00},
    {"Player": "Mustafizur Rahman", "Team": "CSK", "Matches": 9, "Innings": 9, "Balls": 206, "Wickets": 14, "Bowling_Average": 22.71, "Economy": 9.26, "Bowling_Strike_Rate": 14.71},
    {"Player": "Naveen-ul-Haq", "Team": "LSG", "Matches": 10, "Innings": 10, "Balls": 218, "Wickets": 14, "Bowling_Average": 26.57, "Economy": 10.22, "Bowling_Strike_Rate": 15.57},
    {"Player": "Sandeep Sharma", "Team": "RR", "Matches": 11, "Innings": 11, "Balls": 245, "Wickets": 13, "Bowling_Average": 23.92, "Economy": 8.18, "Bowling_Strike_Rate": 18.84},
    {"Player": "Matheesha Pathirana", "Team": "CSK", "Matches": 6, "Innings": 6, "Balls": 130, "Wickets": 13, "Bowling_Average": 13.00, "Economy": 7.68, "Bowling_Strike_Rate": 10.00},
    {"Player": "Mohit Sharma", "Team": "GT", "Matches": 12, "Innings": 12, "Balls": 265, "Wickets": 13, "Bowling_Average": 41.69, "Economy": 10.89, "Bowling_Strike_Rate": 20.38},
    {"Player": "Gerald Coetzee", "Team": "MI", "Matches": 10, "Innings": 10, "Balls": 212, "Wickets": 13, "Bowling_Average": 26.23, "Economy": 10.17, "Bowling_Strike_Rate": 16.30},
    {"Player": "Piyush Chawla", "Team": "MI", "Matches": 11, "Innings": 11, "Balls": 210, "Wickets": 13, "Bowling_Average": 24.00, "Economy": 8.91, "Bowling_Strike_Rate": 16.15},
    {"Player": "Axar Patel", "Team": "DC", "Matches": 14, "Innings": 14, "Balls": 276, "Wickets": 11, "Bowling_Average": 30.72, "Economy": 7.34, "Bowling_Strike_Rate": 25.09},
    {"Player": "Hardik Pandya", "Team": "MI", "Matches": 14, "Innings": 12, "Balls": 216, "Wickets": 11, "Bowling_Average": 35.18, "Economy": 10.75, "Bowling_Strike_Rate": 19.63},
    {"Player": "Bhuvneshwar Kumar", "Team": "SRH", "Matches": 16, "Innings": 16, "Balls": 330, "Wickets": 11, "Bowling_Average": 48.45, "Economy": 9.35, "Bowling_Strike_Rate": 30.00},
    {"Player": "Kagiso Rabada", "Team": "PBKS", "Matches": 11, "Innings": 11, "Balls": 244, "Wickets": 11, "Bowling_Average": 33.81, "Economy": 8.85, "Bowling_Strike_Rate": 22.18},
    {"Player": "Vaibhav Arora", "Team": "KKR", "Matches": 10, "Innings": 10, "Balls": 210, "Wickets": 11, "Bowling_Average": 29.09, "Economy": 9.14, "Bowling_Strike_Rate": 19.09},
    {"Player": "Cameron Green", "Team": "RCB", "Matches": 13, "Innings": 12, "Balls": 194, "Wickets": 10, "Bowling_Average": 27.80, "Economy": 8.60, "Bowling_Strike_Rate": 19.40},
    {"Player": "Rashid Khan", "Team": "GT", "Matches": 12, "Innings": 12, "Balls": 288, "Wickets": 10, "Bowling_Average": 36.70, "Economy": 7.64, "Bowling_Strike_Rate": 28.80},
    {"Player": "Ravi Bishnoi", "Team": "LSG", "Matches": 14, "Innings": 14, "Balls": 300, "Wickets": 10, "Bowling_Average": 43.80, "Economy": 8.76, "Bowling_Strike_Rate": 30.00},
    {"Player": "Ravindra Jadeja", "Team": "CSK", "Matches": 14, "Innings": 14, "Balls": 288, "Wickets": 8, "Bowling_Average": 37.62, "Economy": 7.83, "Bowling_Strike_Rate": 36.00},
    {"Player": "Shahbaz Ahmed", "Team": "SRH", "Matches": 16, "Innings": 11, "Balls": 144, "Wickets": 6, "Bowling_Average": 38.33, "Economy": 9.58, "Bowling_Strike_Rate": 24.00},
    {"Player": "Swapnil Singh", "Team": "RCB", "Matches": 7, "Innings": 6, "Balls": 90, "Wickets": 6, "Bowling_Average": 19.66, "Economy": 7.86, "Bowling_Strike_Rate": 15.00},
    {"Player": "Krunal Pandya", "Team": "LSG", "Matches": 14, "Innings": 12, "Balls": 228, "Wickets": 6, "Bowling_Average": 40.50, "Economy": 6.40, "Bowling_Strike_Rate": 38.00},
    {"Player": "Marcus Stoinis", "Team": "LSG", "Matches": 14, "Innings": 8, "Balls": 108, "Wickets": 4, "Bowling_Average": 40.50, "Economy": 9.00, "Bowling_Strike_Rate": 27.00}
]

df_batting = pd.DataFrame(batting_data)
df_bowling = pd.DataFrame(bowling_data)

df_batting.to_csv("backend/data/batting_ipl2024.csv", index=False)
df_bowling.to_csv("backend/data/bowling_ipl2024.csv", index=False)
print("CSV datasets created successfully!")
