from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
import requests
import re
from google import genai
import os
from dotenv import load_dotenv
from pathlib import Path
import tempfile

load_dotenv()

# Gemini APIの設定
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("環境変数 GOOGLE_API_KEY が未設定です。")

client = genai.Client(api_key=api_key)

router = APIRouter()

class UpdateRepoUrlRequest(BaseModel):
    idea_id: str
    repo_url: HttpUrl

class RepoAnalysisResponse(BaseModel):
    languages: List[str]
    frameworks: List[str]
    databases: List[str]
    tools: List[str]
    skill_analysis: Optional[str] = None

def extract_github_info(repo_url: str) -> tuple[str, str]:
    """GitHubリポジトリURLからユーザー名とリポジトリ名を抽出"""
    pattern = r"github\.com/([^/]+)/([^/]+)"
    match = re.search(pattern, str(repo_url))
    if not match:
        raise ValueError("Invalid GitHub repository URL")
    return match.group(1), match.group(2)

def get_repository_readme(owner: str, repo: str) -> str:
    """リポジトリのREADMEを取得"""
    api_url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    response = requests.get(api_url)
    if response.status_code != 200:
        return ""
    
    content = response.json().get("content", "")
    # Base64デコード
    import base64
    return base64.b64decode(content).decode("utf-8")

def analyze_repository_with_gemini(owner: str, repo: str) -> str:
    """Geminiを使用してリポジトリを分析"""
    # メインのPythonファイルを取得
    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents"
    response = requests.get(api_url)
    if response.status_code != 200:
        return "リポジトリの内容を取得できませんでした。"

    # Pythonファイルを探す
    python_files = [item for item in response.json() if item["type"] == "file" and item["name"].endswith(".py")]
    if not python_files:
        return "分析可能なPythonファイルが見つかりませんでした。"

    # 最初のPythonファイルを取得
    main_file = python_files[0]
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{main_file['path']}"
    code_text = requests.get(raw_url, timeout=10).text

    # 一時ファイルに保存
    tmp_path = Path(tempfile.gettempdir()) / main_file["name"]
    tmp_path.write_text(code_text, encoding="utf-8")

    # ファイルをアップロード
    uploaded_file = client.files.upload(file=tmp_path)

    # promptを定義
    prompt = f"""このコードを以下の観点で分析してください：
    1. pandasなど基本的なライブラリを除いて使用されている技術スタックと活用レベル（初級、中級、上級）
    2. コードの品質や設計の特徴
    3. 開発者の経験レベル
 
    分析結果は日本語で出力してください。"""

    # Geminiで分析
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=[
            prompt,
            uploaded_file
        ]
    )
    return response.text

def analyze_repository(owner: str, repo: str) -> RepoAnalysisResponse:
    """GitHubリポジトリを分析して技術スタックを特定"""
    # GitHub APIを使用してリポジトリの内容を取得
    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents"
    response = requests.get(api_url)
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Repository not found")

    # 技術スタックの判定用パターン
    language_patterns = {
        "Python": [".py$"],
        "JavaScript": [".js$", ".ts$", ".jsx$", ".tsx$"],
        "Java": [".java$"],
        "Go": [".go$"],
        "Rust": [".rs$"],
        "Ruby": [".rb$"],
    }

    framework_patterns = {
        "React": ["package.json", "react", "next.config.js"],
        "Vue": ["vue.config.js", "nuxt.config.js"],
        "Django": ["manage.py", "requirements.txt"],
        "Flask": ["app.py", "flask_app.py"],
        "Express": ["package.json", "express"],
        "Spring": ["pom.xml", "application.properties"],
    }

    database_patterns = {
        "PostgreSQL": ["postgresql.conf", "pg_hba.conf"],
        "MySQL": ["my.cnf", "mysql.conf"],
        "MongoDB": ["mongod.conf", "mongo.conf"],
        "Redis": ["redis.conf"],
    }

    tool_patterns = {
        "Docker": ["Dockerfile", "docker-compose.yml"],
        "GitHub Actions": [".github/workflows"],
        "ESLint": [".eslintrc"],
        "Prettier": [".prettierrc"],
    }

    # 検出された技術スタック
    detected_languages = set()
    detected_frameworks = set()
    detected_databases = set()
    detected_tools = set()

    # リポジトリの内容を分析
    for item in response.json():
        if item["type"] == "file":
            filename = item["name"]
            path = item["path"]

            # 言語の判定
            for lang, patterns in language_patterns.items():
                if any(re.search(pattern, filename) for pattern in patterns):
                    detected_languages.add(lang)

            # フレームワークの判定
            for framework, patterns in framework_patterns.items():
                if any(pattern in filename or pattern in path for pattern in patterns):
                    detected_frameworks.add(framework)

            # データベースの判定
            for db, patterns in database_patterns.items():
                if any(pattern in filename for pattern in patterns):
                    detected_databases.add(db)

            # ツールの判定
            for tool, patterns in tool_patterns.items():
                if any(pattern in filename or pattern in path for pattern in patterns):
                    detected_tools.add(tool)

    # Geminiを使用した分析
    skill_analysis = analyze_repository_with_gemini(owner, repo)

    return RepoAnalysisResponse(
        languages=list(detected_languages),
        frameworks=list(detected_frameworks),
        databases=list(detected_databases),
        tools=list(detected_tools),
        skill_analysis=skill_analysis
    )

@router.put("/{idea_id}/repo-url")
async def update_repo_url(request: UpdateRepoUrlRequest):
    try:
        owner, repo = extract_github_info(request.repo_url)
        analysis = analyze_repository(owner, repo)
        # データベースへの保存は後回し
        return {
            "message": "GitHubリポジトリのURLが更新されました",
            "analysis": analysis
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail="無効なGitHubリポジトリURLです")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"リポジトリの分析中にエラーが発生しました: {str(e)}")

@router.get("/{idea_id}/repo-analysis")
async def get_repo_analysis(idea_id: str):
    try:
        # TODO: データベースからリポジトリURLを取得
        # 仮のリポジトリURLを使用
        repo_url = "https://github.com/aripoyo14/dokidoki_diary"
        owner, repo = extract_github_info(repo_url)
        analysis = analyze_repository(owner, repo)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 