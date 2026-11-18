@echo off
title GeNnTXT - Cockpit Fiscal & Reforma Tributaria RTC
cd /d "%~dp0"

echo =========================================================================
echo           GeNnTXT - COCKPIT FISCAL & REFORMA TRIBUTARIA RTC
echo =========================================================================
echo.
echo [1/2] Inicializando o Servidor Web Unificado (FastAPI + React SPA)...
echo.

set "PYTHON_CMD=python"
where.exe python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    set "PYTHON_CMD=%LOCALAPPDATA%\Microsoft\WindowsApps\python.exe"
)

start "Servidor GeNnTXT" %PYTHON_CMD% -m uvicorn app:app --app-dir backend --host 127.0.0.1 --port 8000

echo [2/2] Abrindo o Cockpit Fiscal no navegador padrao...
timeout /t 3 >nul
start http://localhost:8000

echo.
echo =========================================================================
echo  Plataforma Web disponivel em: http://localhost:8000
echo  Para desenvolvimento ativo (Hot-Reloading): execute iniciar_dev.bat
echo =========================================================================
echo.
pause
