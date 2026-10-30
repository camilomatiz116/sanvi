# Script de inicio rápido de desarrollo para SANVI
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "🛍️ INICIANDO SANVI - EL TEMU COLOMBIANO DE SAN VICTORINO" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow

# Iniciar Backend en una ventana nueva
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Iniciar Frontend en una ventana nueva
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Servidores iniciando:" -ForegroundColor Green
Write-Host "  • Backend API: http://localhost:4000/api/health" -ForegroundColor Cyan
Write-Host "  • Frontend Web: http://localhost:3000" -ForegroundColor Cyan

