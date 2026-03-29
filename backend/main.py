from fastapi import FastAPI
from backend.auth.router import router as auth_router
from backend.auth.dependencies import get_current_user
from backend.resources.models.routers import router as models_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(models_router)

@app.get("/")
def root():
    return {"status": "Backend running"}