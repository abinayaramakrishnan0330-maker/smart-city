@echo off
title CivicConnect - Smart City & Civic Life Platform
echo ===================================================
echo   Starting CivicConnect Smart City Platform...
echo ===================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" %*
pause
