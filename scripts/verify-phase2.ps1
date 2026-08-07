$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

Write-Host "`n[1/4] فحص الحزم" -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
  npm install
}

Write-Host "`n[2/4] ESLint" -ForegroundColor Cyan
npm run lint

Write-Host "`n[3/4] TypeScript" -ForegroundColor Cyan
npm run typecheck

Write-Host "`n[4/4] Production Build" -ForegroundColor Cyan
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build

Write-Host "`nتم اجتياز فحوص المرحلة الثانية بنجاح" -ForegroundColor Green
