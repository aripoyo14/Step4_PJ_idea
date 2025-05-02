from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import ideas

app = FastAPI()

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(ideas.router, prefix="/api/ideas", tags=["ideas"])

@app.get("/")
def read_root():
    return {"message": "Hello World"}

