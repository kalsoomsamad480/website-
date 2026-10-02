"""Vercel serverless entry. Local development still uses: uvicorn main:app --reload --port 8000"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from main import app  # noqa: E402,F401
