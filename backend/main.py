from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import settings
from core.cors import setup_cors
from core.demo_mode import is_demo_mode
from core.logger import setup_logger
from routes.agent import router as agent_router
from routes.chat import router as chat_router

logger = setup_logger("main")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

setup_cors(app)
app.include_router(chat_router)
app.include_router(agent_router)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("%s %s", request.method, request.url.path)
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error("Unhandled error: %s", str(e))
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error. Please try again."},
        )


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": settings.app_version,
        "demo_mode": is_demo_mode(),
        "wire": {
            "configured": bool(settings.wire_api_key),
            "actions": {
                "x": bool(settings.wire_action_x),
                "reddit": bool(settings.wire_action_reddit),
                "news": bool(settings.wire_action_news),
            },
        },
    }
