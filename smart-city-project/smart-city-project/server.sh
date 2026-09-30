#!/usr/bin/env bash
# CivicConnect Server launcher for Git Bash / WSL / Unix shells
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if command -v powershell.exe &> /dev/null; then
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$DIR/server.ps1" "$@"
elif command -v pwsh &> /dev/null; then
    pwsh -NoProfile -File "$DIR/server.ps1" "$@"
elif command -v python3 &> /dev/null; then
    echo "Launching Python HTTP server on http://localhost:8085/..."
    cd "$DIR" && python3 -m http.server 8085
elif command -v python &> /dev/null; then
    echo "Launching Python HTTP server on http://localhost:8085/..."
    cd "$DIR" && python -m http.server 8085
else
    echo "Please run server.ps1 using PowerShell: powershell -ExecutionPolicy Bypass -File ./server.ps1"
fi
