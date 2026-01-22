# PowerShell script to start RAG backend server
Set-Location $PSScriptRoot
& ".\venv\Scripts\python.exe" -m uvicorn app.main:app --reload --port 8000



