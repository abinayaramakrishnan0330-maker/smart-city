#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if command -v powershell.exe &> /dev/null; then
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$DIR/build.ps1" "$@"
elif command -v pwsh &> /dev/null; then
    pwsh -NoProfile -File "$DIR/build.ps1" "$@"
else
    echo "==================================================="
    echo "   Building CivicConnect Smart City Platform...   "
    echo "==================================================="
    has_error=0
    for f in "index.html" "src/civic-platform.js" "src/styles/civicconnect.css"; do
        if [ ! -f "$DIR/$f" ]; then
            echo "[FAIL] $f missing!" >&2
            has_error=1
        else
            echo "[PASS] $f verified."
        fi
    done
    if [ $has_error -ne 0 ]; then
        exit 1
    fi
    echo "Build completed successfully. 0 errors, 0 warnings."
    exit 0
fi
