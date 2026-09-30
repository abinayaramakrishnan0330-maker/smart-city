param(
    [int]$Port = 8085,
    [switch]$NoBrowser
)

# Expand candidate ports to a wide range to guarantee an open port is always found
$portsList = @()
if ($Port -gt 0) {
    $portsList += $Port
}
$portsList += (8085..8099)
$portsList += (3000..3010)
$portsList += (5000..5010)
$candidatePorts = $portsList | Select-Object -Unique

$listener = $null
$activePort = 0
$activePrefix = ""

foreach ($p in $candidatePorts) {
    # Try localhost first, then 127.0.0.1 fallback
    foreach ($hostName in @("localhost", "127.0.0.1")) {
        try {
            $candidateListener = New-Object System.Net.HttpListener
            $prefix = "http://" + $hostName + ":" + $p + "/"
            $candidateListener.Prefixes.Add($prefix)
            $candidateListener.Start()
            $listener = $candidateListener
            $activePort = $p
            $activePrefix = $prefix
            break
        } catch {
            if ($candidateListener) {
                try { $candidateListener.Close() } catch {}
            }
        }
    }
    if ($listener) { break }
}

if (-not $listener) {
    Write-Error "Could not bind to any candidate port ($($candidatePorts -join ', '))."
    exit 1
}

$prefix = $activePrefix
$baseDir = $PSScriptRoot
if (-not $baseDir) {
    $baseDir = (Get-Location).Path
}
$baseDir = [string]$baseDir

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   CivicFix AI - Smart City Life Server   " -ForegroundColor Green
Write-Host "   Tagline: 'Report it. Fix it. Prove it.'" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  URL: $prefix" -ForegroundColor Yellow
Write-Host "  Serving from: $baseDir" -ForegroundColor Gray
Write-Host "  AI Endpoint: $prefix" -NoNewline -ForegroundColor Gray
Write-Host "api/chat" -ForegroundColor Green
Write-Host "  Press Ctrl+C in this terminal to stop." -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan

if (-not $NoBrowser) {
    try {
        Start-Process $prefix
    } catch {
        Write-Warning "Could not auto-launch browser: $_"
    }
}

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".mjs"   = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".webp"  = "image/webp"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Add CORS and permissive headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "/index.html"
        }

        # ── Secure Backend AI API Route: POST /api/chat ──
        if ($request.HttpMethod -eq "POST" -and ($urlPath -eq "/api/chat" -or $urlPath -eq "/api/chat/")) {
            try {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $postData = $reader.ReadToEnd()
                $reader.Close()

                # Securely fetch API key from environment variable or .env file
                $apiKey = $env:GEMINI_API_KEY
                if (-not $apiKey) { $apiKey = $env:AI_API_KEY }
                if (-not $apiKey) {
                    $envFile = [System.IO.Path]::Combine($baseDir, ".env")
                    if ([System.IO.File]::Exists($envFile)) {
                        $envLines = [System.IO.File]::ReadAllLines($envFile)
                        foreach ($el in $envLines) {
                            if ($el -match "^\s*GEMINI_API_KEY\s*=\s*(.+)$" -or $el -match "^\s*AI_API_KEY\s*=\s*(.+)$") {
                                $apiKey = $matches[1].Trim().Trim('"').Trim("'")
                                break
                            }
                        }
                    }
                }

                $payload = try { $postData | ConvertFrom-Json } catch { $null }
                $userMsg = if ($payload -and $payload.message) { [string]$payload.message } else { "" }
                $lang = if ($payload -and $payload.language -eq "ta") { "ta" } else { "en" }
                $stage = if ($payload -and $payload.stage) { [string]$payload.stage } else { "ASK_PROBLEM" }

                $aiReply = ""
                $source = "civicfix_nlu"

                # If API key is securely present, call Google Gemini AI Studio API
                if ($apiKey -and $apiKey -ne "your_google_ai_studio_api_key_here") {
                    try {
                        $targetLang = if ($lang -eq "ta") { "natural, simple, fluent Tamil (தமிழ்)" } else { "clear, empathetic English" }
                        $sysInstruction = "You are CivicFix AI Assistant, the official bilingual AI assistant for the Smart City & Civic Life project 'CivicFix AI'. Project tagline: 'Report it. Fix it. Prove it.'. Help citizens report civic problems (potholes/damaged roads, garbage accumulation, drainage problems, streetlight problems, water supply issues, traffic/parking, public toilets). Understand English, Tamil, and Tanglish. STRICT RULE: You must respond ONLY in $targetLang. Never change language unless requested. Keep response concise, friendly, and practical for civic reporting."

                        $bodyObj = @{
                            contents = @(
                                @{
                                    role = "user"
                                    parts = @(
                                        @{ text = "$sysInstruction`n`nCurrent Dialog Stage: $stage`nCitizen message: $userMsg" }
                                    )
                                }
                            )
                            generationConfig = @{
                                temperature = 0.4
                                maxOutputTokens = 250
                            }
                        }
                        $bodyJson = $bodyObj | ConvertTo-Json -Depth 6

                        $candidateModels = @("gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro")
                        foreach ($modelName in $candidateModels) {
                            try {
                                $geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=$apiKey"
                                $geminiRes = Invoke-RestMethod -Uri $geminiEndpoint -Method POST -Body $bodyJson -ContentType "application/json; charset=utf-8" -TimeoutSec 6
                                if ($geminiRes.candidates -and $geminiRes.candidates[0].content.parts[0].text) {
                                    $aiReply = $geminiRes.candidates[0].content.parts[0].text.Trim()
                                    $source = "gemini_api ($modelName)"
                                    break
                                }
                            } catch {
                                # Try next model
                            }
                        }
                    } catch {
                        # Backend handled gracefully; fall back to client NLU
                        $aiReply = ""
                    }
                }

                $respObj = @{
                    ok = $true
                    reply = $aiReply
                    source = $source
                    language = $lang
                }

                $jsonString = $respObj | ConvertTo-Json
                $respBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $respBytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            } catch {
                $response.StatusCode = 500
            }
            try { $response.Close() } catch {}
            continue
        }

        # Clean path and prevent directory traversal
        $safePath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)

        # ── Security Rule: Never expose .env or .git to web clients ──
        if ($safePath -match "(^|\\)\.env" -or $safePath -match "(^|\\)\.git") {
            $response.StatusCode = 403
            $forbidden = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden: Access denied")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $forbidden.Length
            $response.OutputStream.Write($forbidden, 0, $forbidden.Length)
            try { $response.Close() } catch {}
            continue
        }

        $fullPath = [System.IO.Path]::Combine([string]$baseDir, [string]$safePath)

        if ([System.IO.File]::Exists($fullPath)) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }

            try {
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } catch {
                $response.StatusCode = 500
            }
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $notFound.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($notFound, 0, $notFound.Length)
            }
        }

        try { $response.Close() } catch {}
    }
} finally {
    if ($listener -and $listener.IsListening) {
        try { $listener.Stop() } catch {}
    }
    if ($listener) {
        try { $listener.Close() } catch {}
    }
}