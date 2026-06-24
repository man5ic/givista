# Backend Server Restart Script
# Run this script to restart the backend server

Write-Host "=== Restarting Backend Server ===" -ForegroundColor Cyan
Write-Host ""

# Get the backend directory
$backendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path $backendPath)) {
    $backendPath = "C:\Users\ingol\Downloads\givista (7)\givista (5)\givista (2)\givista\givista\backend"
}

Set-Location $backendPath
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Stop any existing Node processes
Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Stopped existing processes" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "No existing Node processes found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host ""

# Start the server
$npmExe = "C:\Program Files\nodejs\npm.cmd"
& $npmExe run dev

