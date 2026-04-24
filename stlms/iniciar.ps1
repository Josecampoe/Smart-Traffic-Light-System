# ============================================================
# STLMS — Script de inicio completo
# Compila el frontend y arranca Spring Boot en http://localhost:8080
# ============================================================

$env:JAVA_HOME = "C:\Users\labinf6.pasto\AppData\Local\Programs\Eclipse Adoptium\jdk-25.0.2.10-hotspot"
$env:PATH      = "$env:JAVA_HOME\bin;C:\Program Files\Apache NetBeans\java\maven\bin;$env:PATH"

$root    = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║   STLMS — Smart Traffic Light System     ║" -ForegroundColor Cyan
Write-Host "  ║   Patron State Workshop                  ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Iniciando... (esto puede tardar ~30 segundos)" -ForegroundColor Yellow
Write-Host ""

Set-Location $backend
& mvn spring-boot:run

Write-Host ""
Write-Host "  Servidor detenido." -ForegroundColor Red
