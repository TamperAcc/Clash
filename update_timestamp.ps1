$files = @("Clash.conf", "Clash.yaml")
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

foreach ($file in $files) {
    if (Test-Path $file) {
        try {
            # Read with UTF-8 encoding
            $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
            
            # Update timestamp
            $newContent = $content -replace "# Last Updated: .*", "# Last Updated: $date"
            
            # Write back with UTF-8 encoding (No BOM)
            [System.IO.File]::WriteAllText($file, $newContent, (New-Object System.Text.UTF8Encoding $False))
            
            Write-Host "Successfully updated timestamp in $file" -ForegroundColor Green
        }
        catch {
            Write-Host "Error updating $file : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}
