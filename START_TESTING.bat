@echo off
REM Givista - Quick Start Script for Windows
REM This script helps you start all services for testing

echo ==========================================
echo   Givista - Testing Setup
echo ==========================================
echo.

echo Step 1: Checking project structure...
if exist "backend\package.json" (
    echo [OK] Backend folder found
) else (
    echo [ERROR] Backend folder not found!
    pause
    exit /b 1
)

if exist "frontend\package.json" (
    echo [OK] Frontend folder found
) else (
    echo [ERROR] Frontend folder not found!
    pause
    exit /b 1
)

if exist "ai_service\requirements.txt" (
    echo [OK] AI Service folder found
) else (
    echo [ERROR] AI Service folder not found!
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   Setup Checklist
echo ==========================================
echo.
echo Before starting, ensure:
echo [1] MySQL is running
echo [2] Database 'givista_db' is created
echo [3] Backend .env file is configured
echo [4] Frontend .env file is configured
echo.
echo Press any key to continue...
pause > nul

echo.
echo ==========================================
echo   Starting Services
echo ==========================================
echo.
echo NOTE: You need 3 separate terminal windows!
echo.
echo Window 1: Backend
echo   cd backend
echo   npm run dev
echo.
echo Window 2: Frontend  
echo   cd frontend
echo   npm run dev
echo.
echo Window 3: AI Service
echo   cd ai_service
echo   venv\Scripts\activate
echo   python app.py
echo.
echo See TESTING_GUIDE.md for detailed instructions!
echo.
pause

