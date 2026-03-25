#!/bin/bash
set -e

cleanup() {
    echo "--- Stopping all services... ---"
    kill $(jobs -p) 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM EXIT

if [ ! -d "node_modules" ]; then 
    echo "--- Installing frontend dependencies... ---"
    npm install
fi

echo "--- Starting Frontend (Vite) in background... ---"
npm run dev -- --host & 

cd backend

if [ ! -d ".venv" ]; then 
    echo "--- Creating virtual environment... ---"
    python -m venv .venv
fi

source .venv/Scripts/activate

echo "--- Checking/Installing backend dependencies... ---"
pip install -r requirements.txt

echo "--- Applying database migrations... ---"
python manage.py migrate

echo "--- Starting Django server... ---"
python -u manage.py runserver 0.0.0.0:8000