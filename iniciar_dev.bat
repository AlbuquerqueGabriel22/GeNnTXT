@echo off
title GeNnTXT - Modo Desenvolvimento (Vite + FastAPI)
cd /d "%~dp0"

echo [1/2] Iniciando Servidor Backend FastAPI (Porta 8000)...
start "Backend FastAPI" python -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000 --reload

echo [2/2] Iniciando Servidor Frontend Vite (Porta 3000)...
start "Frontend Vite" cmd /k "cd frontend && npm run dev"

timeout /t 3 >nul
start http://localhost:3000
