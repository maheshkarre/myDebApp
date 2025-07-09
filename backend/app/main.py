from fastapi import FastAPI

from app.routes import auth, projects

app = FastAPI()

app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
