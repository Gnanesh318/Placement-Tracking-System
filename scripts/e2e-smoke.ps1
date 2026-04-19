$ErrorActionPreference = 'Stop'
$PSDefaultParameterValues['Invoke-WebRequest:UseBasicParsing'] = $true
$PSDefaultParameterValues['Invoke-RestMethod:UseBasicParsing'] = $true

$base = 'https://placement-tracking-system-virid.vercel.app'
$report = [ordered]@{}
$report.base = $base

function Add-Result {
    param(
        [string]$Key,
        [string]$Value
    )
    $script:report[$Key] = $Value
}

function Add-Detail {
    param(
        [string]$Key,
        [string]$Value
    )
    $script:report[$Key] = $Value
}

try {
    $health = Invoke-RestMethod -Uri ($base + '/api/health') -TimeoutSec 30
    Add-Result 'health' 'pass'
    Add-Detail 'healthStatus' ($health.status)
    Add-Detail 'healthDatabase' ($health.database)
} catch {
    Add-Result 'health' 'fail'
    Add-Detail 'healthError' $_.Exception.Message
}

$studentEmail = ('student' + (Get-Random) + '@example.com')
$studentPassword = 'Test@12345'
$studentReg = ('REG' + (Get-Random))
Add-Detail 'studentEmail' $studentEmail

try {
    $regBody = @{
        name = 'E2E Student'
        email = $studentEmail
        password = $studentPassword
        registerNumber = $studentReg
        department = 'Information Technology'
        batch = '2027'
        cgpa = '8.2'
    } | ConvertTo-Json

    $null = Invoke-RestMethod -Method Post -Uri ($base + '/api/auth/register') -ContentType 'application/json' -Body $regBody -TimeoutSec 45
    Add-Result 'studentRegister' 'pass'
} catch {
    Add-Result 'studentRegister' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'studentRegisterDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'studentRegisterDetails' $_.Exception.Message
    }
}

$studentSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession
try {
    $csrf = Invoke-RestMethod -Uri ($base + '/api/auth/csrf') -WebSession $studentSession -TimeoutSec 45
    $form = 'csrfToken=' + [uri]::EscapeDataString($csrf.csrfToken) +
        '&email=' + [uri]::EscapeDataString($studentEmail) +
        '&password=' + [uri]::EscapeDataString($studentPassword) +
        '&callbackUrl=' + [uri]::EscapeDataString($base + '/student') +
        '&json=true'

    $loginResp = Invoke-WebRequest -Uri ($base + '/api/auth/callback/credentials') -Method Post -ContentType 'application/x-www-form-urlencoded' -Body $form -WebSession $studentSession -MaximumRedirection 0 -ErrorAction SilentlyContinue -TimeoutSec 45

    if ($loginResp.StatusCode -in 200, 302) {
        Add-Result 'studentLogin' 'pass'
    } else {
        Add-Result 'studentLogin' 'fail'
        Add-Detail 'studentLoginStatus' ([string]$loginResp.StatusCode)
    }
} catch {
    Add-Result 'studentLogin' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'studentLoginDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'studentLoginDetails' $_.Exception.Message
    }
}

$studentPages = @('/student', '/student/setup', '/student/drives', '/student/applications')
foreach ($page in $studentPages) {
    $k = 'page' + $page.Replace('/', '_')
    try {
        $pageResp = Invoke-WebRequest -Uri ($base + $page) -WebSession $studentSession -TimeoutSec 45
        if ($pageResp.StatusCode -eq 200) {
            Add-Result $k 'pass'
        } else {
            Add-Result $k ('fail:' + [string]$pageResp.StatusCode)
        }
    } catch {
        Add-Result $k 'fail'
        if ($_.ErrorDetails.Message) {
            Add-Detail ($k + 'Details') $_.ErrorDetails.Message
        } else {
            Add-Detail ($k + 'Details') $_.Exception.Message
        }
    }
}

try {
    $profileGet = Invoke-RestMethod -Uri ($base + '/api/profile') -WebSession $studentSession -TimeoutSec 45
    Add-Result 'apiProfileGet' 'pass'
    if ($profileGet.user -and $profileGet.user.email) {
        Add-Detail 'apiProfileEmail' $profileGet.user.email
    }
} catch {
    Add-Result 'apiProfileGet' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'apiProfileGetDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'apiProfileGetDetails' $_.Exception.Message
    }
}

try {
    $profileBody = @{ interests = @('SOFTWARE_DEV', 'AI_ML') } | ConvertTo-Json
    $null = Invoke-RestMethod -Method Put -Uri ($base + '/api/profile') -ContentType 'application/json' -Body $profileBody -WebSession $studentSession -TimeoutSec 45
    Add-Result 'apiProfilePut' 'pass'
} catch {
    Add-Result 'apiProfilePut' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'apiProfilePutDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'apiProfilePutDetails' $_.Exception.Message
    }
}

try {
    $drives = Invoke-RestMethod -Uri ($base + '/api/drives') -WebSession $studentSession -TimeoutSec 45
    Add-Result 'apiDrivesGet' 'pass'
    $drivesCount = 0
    if ($drives.drives) {
        $drivesCount = ($drives.drives | Measure-Object).Count
    }
    Add-Detail 'drivesCount' ([string]$drivesCount)
} catch {
    Add-Result 'apiDrivesGet' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'apiDrivesGetDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'apiDrivesGetDetails' $_.Exception.Message
    }
}

try {
    $apps = Invoke-RestMethod -Uri ($base + '/api/applications') -WebSession $studentSession -TimeoutSec 45
    Add-Result 'apiApplicationsGet' 'pass'
    $appsCount = 0
    if ($apps.applications) {
        $appsCount = ($apps.applications | Measure-Object).Count
    }
    Add-Detail 'applicationsCount' ([string]$appsCount)
} catch {
    Add-Result 'apiApplicationsGet' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'apiApplicationsGetDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'apiApplicationsGetDetails' $_.Exception.Message
    }
}

$adminSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$adminEmail = 'admin@college.edu'
$adminPassword = 'admin123'
Add-Detail 'adminEmailTried' $adminEmail

try {
    $adminCsrf = Invoke-RestMethod -Uri ($base + '/api/auth/csrf') -WebSession $adminSession -TimeoutSec 45
    $adminForm = 'csrfToken=' + [uri]::EscapeDataString($adminCsrf.csrfToken) +
        '&email=' + [uri]::EscapeDataString($adminEmail) +
        '&password=' + [uri]::EscapeDataString($adminPassword) +
        '&callbackUrl=' + [uri]::EscapeDataString($base + '/admin') +
        '&json=true'

    $adminLoginResp = Invoke-WebRequest -Uri ($base + '/api/auth/callback/credentials') -Method Post -ContentType 'application/x-www-form-urlencoded' -Body $adminForm -WebSession $adminSession -MaximumRedirection 0 -ErrorAction SilentlyContinue -TimeoutSec 45
    if ($adminLoginResp.StatusCode -in 200, 302) {
        Add-Result 'adminLogin' 'pass'
    } else {
        Add-Result 'adminLogin' 'fail'
        Add-Detail 'adminLoginStatus' ([string]$adminLoginResp.StatusCode)
    }
} catch {
    Add-Result 'adminLogin' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'adminLoginDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'adminLoginDetails' $_.Exception.Message
    }
}

$adminPages = @('/admin', '/admin/students', '/admin/companies', '/admin/drives')
foreach ($page in $adminPages) {
    $k = 'page' + $page.Replace('/', '_')
    try {
        $pageResp = Invoke-WebRequest -Uri ($base + $page) -WebSession $adminSession -TimeoutSec 45 -MaximumRedirection 5
        if ($pageResp.StatusCode -eq 200) {
            Add-Result $k 'pass'
        } else {
            Add-Result $k ('fail:' + [string]$pageResp.StatusCode)
        }
    } catch {
        Add-Result $k 'fail'
        if ($_.ErrorDetails.Message) {
            Add-Detail ($k + 'Details') $_.ErrorDetails.Message
        } else {
            Add-Detail ($k + 'Details') $_.Exception.Message
        }
    }
}

try {
    $null = Invoke-RestMethod -Uri ($base + '/api/admin/analytics') -WebSession $adminSession -TimeoutSec 45
    Add-Result 'apiAdminAnalytics' 'pass'
} catch {
    Add-Result 'apiAdminAnalytics' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'apiAdminAnalyticsDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'apiAdminAnalyticsDetails' $_.Exception.Message
    }
}

try {
    $null = Invoke-RestMethod -Uri ($base + '/api/admin/students') -WebSession $adminSession -TimeoutSec 45
    Add-Result 'apiAdminStudents' 'pass'
} catch {
    Add-Result 'apiAdminStudents' 'fail'
    if ($_.ErrorDetails.Message) {
        Add-Detail 'apiAdminStudentsDetails' $_.ErrorDetails.Message
    } else {
        Add-Detail 'apiAdminStudentsDetails' $_.Exception.Message
    }
}

$report | ConvertTo-Json -Depth 8
