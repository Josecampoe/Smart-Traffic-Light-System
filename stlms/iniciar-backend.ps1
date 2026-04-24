# Script de inicio del backend STLMS
$env:JAVA_HOME = "C:\Users\labinf6.pasto\AppData\Local\Programs\Eclipse Adoptium\jdk-25.0.2.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Program Files\Apache NetBeans\java\maven\bin;$env:PATH"

Write-Host "Iniciando backend STLMS..." -ForegroundColor Green
Set-Location "$PSScriptRoot\backend"
& mvn spring-boot:run
