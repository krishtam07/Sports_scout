import sys
import os

# Add backend directory to sys.path so app and analysis modules can be imported
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app import app
