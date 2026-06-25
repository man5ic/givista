# 🔧 Fix: Python 3.13 Compatibility Issue

## Problem
You're using Python 3.13.7, which is very new. Older versions of scikit-learn (1.3.2) don't have pre-built wheels for Python 3.13, so pip tries to compile from source and fails.

## Solution
Updated `requirements.txt` to use the latest versions without pinning exact versions. This will automatically install versions that have pre-built wheels for Python 3.13.

## Steps to Fix:

### 1. Make sure you're in the ai_service folder and venv is activated:
```powershell
cd "C:\Users\Amol Aaba Shelar\Downloads\givista (2)\givista\givista\ai_service"
venv\Scripts\activate
```

### 2. Install packages (this will get Python 3.13 compatible versions):
```powershell
pip install -r requirements.txt
```

### 3. If that works, run the app:
```powershell
python app.py
```

## Alternative: Install packages individually

If the above doesn't work, try installing packages one by one to see which one fails:

```powershell
pip install Flask==3.0.0
pip install flask-cors==4.0.0
pip install scikit-learn
pip install pandas
pip install numpy
pip install scipy
pip install python-dotenv==1.0.0
```

This will install the latest compatible versions that have pre-built wheels for Python 3.13.

