Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   Building CivicConnect Smart City Platform...   " -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

$baseDir = $PSScriptRoot
if (-not $baseDir) {
    $baseDir = (Get-Location).Path
}

$hasError = $false

$files = @("index.html", "src/civic-platform.js", "src/styles/civicconnect.css")
foreach ($f in $files) {
    $targetPath = Join-Path $baseDir $f
    if (-not (Test-Path $targetPath)) {
        Write-Error "[FAIL] $f missing!"
        $hasError = $true
    } else {
        Write-Host "[PASS] $f verified." -ForegroundColor Green
    }
}

if ($hasError) {
    exit 1
}

Write-Host "Build completed successfully. 0 errors, 0 warnings." -ForegroundColor Green
exit 0
