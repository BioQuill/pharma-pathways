from fastapi import APIRouter, Depends, HTTPException
from pathlib import Path
import json
from backend.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/models",
    tags=["models"],
    dependencies=[Depends(get_current_user)]
)

MODELS_DIR = Path("backend/resources/models")

@router.get("/{model_name}")
def get_model(model_name: str):
    file_path = MODELS_DIR / f"{model_name}.json"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Model not found")

    with open(file_path, "r") as f:
        return json.load(f)