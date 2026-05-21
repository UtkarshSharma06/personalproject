#!/usr/bin/env pwsh
# Script to add dark mode variants to all white backgrounds

Write-Host "Adding dark mode to all components..." -ForegroundColor Green

# Common patterns to replace
$patterns = @{
    'bg-white"' = 'bg-white dark:bg-card"'
    'bg-white ' = 'bg-white dark:bg-card '
    'bg-slate-50"' = 'bg-slate-50 dark:bg-muted"'
    'bg-slate-50 ' = 'bg-slate-50 dark:bg-muted '
    'border-slate-100"' = 'border-slate-100 dark:border-border"'
    'border-slate-100 ' = 'border-slate-100 dark:border-border '
    'border-slate-200"' = 'border-slate-200 dark:border-border"'
    'border-slate-200 ' = 'border-slate-200 dark:border-border '
    'text-slate-900"' = 'text-slate-900 dark:text-slate-100"'
    'text-slate-900 ' = 'text-slate-900 dark:text-slate-100 '
    'text-slate-700"' = 'text-slate-700 dark:text-slate-300"'
    'text-slate-700 ' = 'text-slate-700 dark:text-slate-300 '
    'text-slate-600"' = 'text-slate-600 dark:text-slate-400"'
    'text-slate-600 ' = 'text-slate-600 dark:text-slate-400 '
}

# Files to process
$files = Get-ChildItem -Path "src" -Include "*.tsx","*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($pattern in $patterns.Keys) {
        if ($content -match $pattern -and $content -notmatch $patterns[$pattern]) {
            $content = $content -replace [regex]::Escape($pattern), $patterns[$pattern]
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! Dark mode variants added." -ForegroundColor Green
