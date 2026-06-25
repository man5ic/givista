# Givista Project - Install All Dependencies
# Copy and paste this entire script into PowerShell, or run each section separately

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Givista - Install Dependencies" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Get project path
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $projectPath) {
    $projectPath = "C:\Users\ingol\Downloads\givista (7)\givista (5)\givista (2)\givista\givista"
}

Write-Host "Project path: $projectPath" -ForegroundColor Gray
Write-Host ""

# Check if Node.js is available
$nodeExe = "C:\Program Files\nodejs\node.exe"
$npmExe = "C:\Program Files\nodejs\npm.cmd"

if (-not (Test-Path $nodeExe)) {
    Write-Host "❌ Node.js not found at: $nodeExe" -ForegroundColor Red
    Write-Host "Please install Node.js first!" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js found" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 1: Install Backend Dependencies
# ============================================
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $projectPath "backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
    Write-Host "Running: npm install" -ForegroundColor Yellow
    Write-Host ""
    
    & $npmExe install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Backend folder not found: $backendPath" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ============================================
# STEP 2: Install Frontend Dependencies
# ============================================
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $projectPath "frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
    Write-Host "Running: npm install" -ForegroundColor Yellow
    Write-Host ""
    
    & $npmExe install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Frontend folder not found: $frontendPath" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ============================================
# STEP 3: Install AI Service Dependencies
# ============================================
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "STEP 3: Installing AI Service Dependencies" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$aiPath = Join-Path $projectPath "ai_service"
if (Test-Path $aiPath) {
    Set-Location $aiPath
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
    
    # Check if virtual environment exists
    $venvPython = Join-Path $aiPath "venv\Scripts\python.exe"
    $venvPip = Join-Path $aiPath "venv\Scripts\pip.exe"
    
    if (Test-Path $venvPython) {
        Write-Host "Using virtual environment Python" -ForegroundColor Gray
        Write-Host "Running: pip install -r requirements.txt" -ForegroundColor Yellow
        Write-Host ""
        
        & $venvPip install -r requirements.txt
    } else {
        Write-Host "Virtual environment not found. Using system Python" -ForegroundColor Yellow
        Write-Host "Running: py -m pip install -r requirements.txt" -ForegroundColor Yellow
        Write-Host ""
        
        py -m pip install -r requirements.txt
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ AI Service dependencies installed!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ AI Service installation failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ AI Service folder not found: $aiPath" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ============================================
# SUMMARY
# ============================================
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   Installation Complete!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All dependencies have been installed." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MySQL is running" -ForegroundColor White
Write-Host "2. Make sure database 'givista_db' exists" -ForegroundColor White
Write-Host "3. Start the services:" -ForegroundColor White
Write-Host ""
Write-Host "   Backend:   cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "   Frontend:  cd frontend && npm run dev" -ForegroundColor Cyan
Write-Host "   AI Service: cd ai_service && py app.py" -ForegroundColor Cyan
Write-Host ""

