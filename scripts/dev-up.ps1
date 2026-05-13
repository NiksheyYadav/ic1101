#!/usr/bin/env pwsh
# dev-up.ps1 - Windows equivalent of dev-up.sh
# Starts the FastAPI API and Next.js web app in parallel.

$root = $PSScriptRoot ? (Split-Path $PSScriptRoot -Parent) : (Get-Location)

Write-Host "Starting API on http://localhost:8000 ..." -ForegroundColor Cyan
$api = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\apps\api'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000" -PassThru

Write-Host "Starting Web on http://localhost:3000 ..." -ForegroundColor Cyan
$web = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\apps\web'; npm run dev -- --port 3000" -PassThru

Write-Host ""
Write-Host "  Web:      http://localhost:3000" -ForegroundColor Green
Write-Host "  API:      http://localhost:8000" -ForegroundColor Green
Write-Host "  API docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C or close the terminal windows to stop." -ForegroundColor Yellow

$api, $web | Wait-Process
