$imgPath = "c:\Users\Planet pc\Pictures\study-buddy-ai-main\public\email-logo.png"
$bytes = [System.IO.File]::ReadAllBytes($imgPath)
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Out-File -FilePath "c:\Users\Planet pc\Pictures\study-buddy-ai-main\public\logo_base64.txt" -NoNewline
