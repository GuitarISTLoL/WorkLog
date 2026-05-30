param(
  [switch]$Seed
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example"
}

docker compose up -d --build

if ($Seed) {
  Write-Host "Running seed..."
  docker compose --profile seed run --rm seed
}

Write-Host "Done."
Write-Host "  Front: http://localhost:3001"
Write-Host "  API:   http://localhost:3000"
