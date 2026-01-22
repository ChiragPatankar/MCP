# Quick Backend Connection Test
Write-Host "`n=== Testing Backend Connection ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing /health/live..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health/live" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ SUCCESS - Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   → Backend might not be running on port 8000" -ForegroundColor Yellow
    exit
}

# Test 2: CORS Preflight
Write-Host "`n2. Testing CORS (OPTIONS request)..." -ForegroundColor Yellow
try {
    $cors = Invoke-WebRequest -Uri "http://localhost:8000/chat" `
        -Method OPTIONS `
        -Headers @{
            "Origin" = "http://localhost:5173"
            "Access-Control-Request-Method" = "POST"
            "Access-Control-Request-Headers" = "Content-Type,Authorization,X-Tenant-Id,X-User-Id"
        } `
        -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ CORS Preflight OK - Status: $($cors.StatusCode)" -ForegroundColor Green
    if ($cors.Headers['Access-Control-Allow-Origin']) {
        Write-Host "   Access-Control-Allow-Origin: $($cors.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ CORS Preflight FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   → CORS might not be configured correctly" -ForegroundColor Yellow
}

# Test 3: Chat Endpoint (with dev headers)
Write-Host "`n3. Testing /chat endpoint..." -ForegroundColor Yellow
$body = @{
    tenant_id = "dev_tenant"
    user_id = "dev_user"
    kb_id = "default"
    question = "test"
} | ConvertTo-Json

try {
    $chat = Invoke-WebRequest -Uri "http://localhost:8000/chat" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{
            "X-Tenant-Id" = "dev_tenant"
            "X-User-Id" = "dev_user"
        } `
        -Body $body `
        -TimeoutSec 30 -ErrorAction Stop
    Write-Host "   ✅ Chat request SUCCESS - Status: $($chat.StatusCode)" -ForegroundColor Green
    Write-Host "   Response preview: $($chat.Content.Substring(0, [Math]::Min(200, $chat.Content.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Chat request FAILED" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response body: $responseBody" -ForegroundColor Gray
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host "`nCheck your backend terminal for:" -ForegroundColor Yellow
Write-Host "  - '=== CHAT REQUEST RECEIVED ==='" -ForegroundColor White
Write-Host "  - Any error messages" -ForegroundColor White

