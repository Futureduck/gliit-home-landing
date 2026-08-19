<#
  글잇 랜딩 — 로컬 미리보기 서버
  사용법:  PowerShell 에서  .\serve.ps1     (중지: Ctrl+C)
  포트 바꾸려면:  .\serve.ps1 -Port 8080
#>
param(
  [int]$Port = 5173,
  [switch]$NoBrowser
)

$root = Join-Path $PSScriptRoot 'dist'
if (-not (Test-Path $root)) { Write-Error "dist 폴더가 없습니다: $root"; exit 1 }

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() }
catch { Write-Error "포트 $Port 를 열 수 없습니다. 다른 포트로 시도하세요:  .\serve.ps1 -Port 8080"; exit 1 }

Write-Host ""
Write-Host "  글잇 랜딩 미리보기" -ForegroundColor Magenta
Write-Host "  $prefix" -ForegroundColor Cyan
Write-Host "  중지하려면 Ctrl+C" -ForegroundColor DarkGray
Write-Host ""

if (-not $NoBrowser) { Start-Process $prefix }

$mime = @{
  '.html'='text/html; charset=utf-8'; '.js'='application/javascript; charset=utf-8'
  '.css'='text/css; charset=utf-8';   '.json'='application/json; charset=utf-8'
  '.png'='image/png';  '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp'
  '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.txt'='text/plain; charset=utf-8'
  '.xml'='application/xml; charset=utf-8'
  '.ttf'='font/ttf'; '.woff'='font/woff'; '.woff2'='font/woff2'
}

try {
  while ($listener.IsListening) {
    # GetContextAsync + 폴링 = Ctrl+C 가 먹힘 (동기 GetContext 는 인터럽트 불가)
    $task = $listener.GetContextAsync()
    while (-not $task.Wait(200)) { }
    $ctx = $task.Result
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
      if ($rel -eq '') { $rel = 'index.html' }
      $path = Join-Path $root $rel
      # vercel.json 의 cleanUrls 와 동일하게: /consult 요청이면 consult.html 을 준다
      if (-not (Test-Path -LiteralPath $path -PathType Leaf) -and (Test-Path -LiteralPath "$path.html" -PathType Leaf)) {
        $path = "$path.html"
      }
      if (Test-Path -LiteralPath $path -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
        $res.ContentType = $ct
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $res.StatusCode = 404
        Write-Host "  404  $rel" -ForegroundColor DarkYellow
      }
    } catch {
      try { $res.StatusCode = 500 } catch {}
    }
    try { $res.Close() } catch {}
  }
} finally {
  $listener.Stop(); $listener.Close()
  Write-Host "`n  서버를 종료했습니다." -ForegroundColor DarkGray
}
