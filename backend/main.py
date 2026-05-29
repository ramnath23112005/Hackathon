from fastapi import FastAPI

from core.config import settings
from core.cors import setup_cors
from routes.chat import router as chat_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

setup_cors(app)
app.include_router(chat_router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.app_version}
