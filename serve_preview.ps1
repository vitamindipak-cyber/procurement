# Simple local preview server for procurement app (No Node.js required)
# Uses Windows built-in .NET HttpListener to serve the dist/ directory.

$port = 3000
$prefix = "http://localhost:$port/"
$distPath = Join-Path $PSScriptRoot "dist"

if (-not (Test-Path $distPath)) {
    Write-Host "Error: dist directory not found at $distPath" -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mp3"  = "audio/mpeg"
    ".mp4"  = "video/mp4"
    ".vtt"  = "text/vtt; charset=utf-8"
    ".md"   = "text/markdown; charset=utf-8"
    ".pdf"  = "application/pdf"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "`n=======================================================" -ForegroundColor Cyan
    Write-Host " स्थानीय सर्भर सुरु भयो: $prefix" -ForegroundColor Green
    Write-Host " ब्राउजरमा खोल्न: http://localhost:$port" -ForegroundColor Yellow
    Write-Host " बन्द गर्न टर्मिनलमा Ctrl + C थिच्नुहोस्" -ForegroundColor Gray
    Write-Host "=======================================================`n" -ForegroundColor Cyan

    Start-Process $prefix

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "/index.html"
        }

        # Normalize relative path to prevent directory traversal
        $relative = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $distPath $relative

        # Single page application fallback: if file does not exist, serve index.html
        if (-not (Test-Path $filePath) -or (Get-Item $filePath) -is [System.IO.DirectoryInfo]) {
            $filePath = Join-Path $distPath "index.html"
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

        try {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $response.StatusCode = 500
        } finally {
            $response.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
