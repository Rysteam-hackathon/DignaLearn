import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, docente, gamification, progress

load_dotenv()

app = FastAPI(title="DignaLearn API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gamification.router)
app.include_router(docente.router)
app.include_router(auth.router)
app.include_router(progress.router)


@app.get("/")
def read_root():
    return {"status": "ok", "message": "DignaLearn API corriendo"}
