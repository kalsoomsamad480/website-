"""Alladin Cafe AI assistant (FastAPI). Run: uvicorn main:app --reload --port 8000"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import chat_routes, health_routes
from app.core.llm_client import llm
from app.services.backend_client import backend
from app.utils.logger import get_logger

log = get_logger("main")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    log.info("Assistant starting in %s mode.", "LLM" if llm.enabled else "rules (no LLM_API_KEY)")
    yield
    await backend.close()


# Only the Node backend calls this service, so no CORS is configured
app = FastAPI(title="Alladin Cafe Assistant", version="1.0.0", lifespan=lifespan)
app.include_router(health_routes.router)
app.include_router(chat_routes.router)
