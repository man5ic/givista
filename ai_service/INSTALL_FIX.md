# 🔧 Fix: scikit-learn Installation Issue

## Problem
`scikit-learn==1.5.0` requires GCC >= 8.0 to build from source, but your system has GCC 6.3.0.

## Solution
Updated `requirements.txt` to use `scikit-learn==1.3.2` which has pre-built wheels available.

## Steps to Fix:

### 1. Make sure you're in the ai_service folder and venv is activated:
```powershell
cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\ai_service"
venv\Scripts\activate
```

### 2. Try installing again:
```powershell
pip install -r requirements.txt
```

### 3. If that still fails, try installing packages one by one:
```powershell
pip install Flask==3.0.0
pip install flask-cors==4.0.0
pip install scikit-learn==1.3.2
pip install pandas==2.1.4
pip install numpy==1.26.2
pip install scipy==1.11.4
pip install python-dotenv==1.0.0
```

### 4. Alternative: Use pip to find compatible versions automatically:
```powershell
pip install Flask flask-cors scikit-learn pandas numpy scipy python-dotenv
```

This will install the latest compatible versions with pre-built wheels.

