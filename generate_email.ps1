$logoUrl = "https://your-domain.com/email-logo.png"
$template = [System.IO.File]::ReadAllText("c:\Users\Planet pc\Pictures\study-buddy-ai-main\email_template_base.html")
$finalContent = $template.Replace("YOUR_LOGO_URL_HERE", $logoUrl)
[System.IO.File]::WriteAllText("c:\Users\Planet pc\Pictures\study-buddy-ai-main\public\supabase_reset_password_email_embedded.html", $finalContent, [System.Text.Encoding]::UTF8)
