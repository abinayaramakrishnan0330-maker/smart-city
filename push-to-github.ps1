param(
    [string]$RepoUrl = ""
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   CivicFix AI - Push to GitHub Helper    " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

if (-not $RepoUrl) {
    Write-Host "Please enter your GitHub repository URL." -ForegroundColor Yellow
    Write-Host "Example: https://github.com/your-username/smart-city.git" -ForegroundColor Gray
    $RepoUrl = Read-Host "GitHub Repository URL"
}

if (-not $RepoUrl) {
    Write-Error "Repository URL cannot be empty. Please create a repository at https://github.com/new and provide its URL."
    exit 1
}

# Check if git is available
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    # Check standard install locations
    $stdPaths = @(
        "C:\Program Files\Git\cmd\git.exe",
        "C:\Program Files (x86)\Git\cmd\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
    )
    foreach ($p in $stdPaths) {
        if (Test-Path $p) {
            $env:PATH += ";$(Split-Path $p)"
            $gitCmd = Get-Command git -ErrorAction SilentlyContinue
            break
        }
    }
}

if (-not $gitCmd) {
    Write-Host "Git is not detected in your PATH." -ForegroundColor Yellow
    Write-Host "Please install Git from https://git-scm.com/download/win or use GitHub Desktop (https://desktop.github.com/)." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n1. Initializing Git repository..." -ForegroundColor Cyan
git init

Write-Host "2. Staging project files (excluding .env)..." -ForegroundColor Cyan
git add .

Write-Host "3. Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit: CivicFix AI Smart City Platform & Bilingual Chatbot"

Write-Host "4. Setting main branch..." -ForegroundColor Cyan
git branch -M main

Write-Host "5. Configuring remote origin: $RepoUrl" -ForegroundColor Cyan
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin $RepoUrl

Write-Host "6. Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   Successfully pushed to GitHub! 🚀      " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
