# install.ps1 - installs the skills and plugins listed in setup/skills.md and setup/plugins.md.
# Third-party skills and plugins come straight from their authors' repos.
# Only my own skills are copied, from ..\skills in this repo.
#
#   .\install.ps1 -DryRun                 print every command, run nothing
#   .\install.ps1                         ask before each group
#   .\install.ps1 -Yes -Skip variants     install everything except the prototype variants
#
# Groups: core, when-needed, variants
param(
    [switch]$DryRun,
    [switch]$Yes,
    [string[]]$Skip = @()
)

$ErrorActionPreference = 'Continue'
$add = 'npx --yes skills add'
$flags = '-g -a claude-code -y'

# Copies one of my own skills into ~\.claude\skills. Never overwrites an existing folder.
function Copy-MySkill([string]$Name) {
    $src = Join-Path $PSScriptRoot "..\skills\$Name"
    $dst = Join-Path $HOME ".claude\skills\$Name"
    if (Test-Path $dst) { Write-Host "  skipped: $dst already exists"; return }
    New-Item -ItemType Directory -Force (Split-Path $dst) | Out-Null
    Copy-Item -Recurse -ErrorAction Stop $src $dst
    Write-Host "  copied to $dst"
}

$groups = [ordered]@{
    'core' = @(
        'claude plugin install caveman --marketplace JuliusBrussee/caveman',
        'claude plugin install ponytail --marketplace DietrichGebert/ponytail',
        'claude plugin install frontend-design --marketplace anthropics/claude-plugins-official',
        "$add obra/superpowers --skill verification-before-completion $flags",
        "$add emilkowalski/skills --skill emil-design-eng --skill animate --skill apple-design --skill mobile-native --skill review-animations --skill prototype $flags",
        "$add Nutlope/hallmark --skill hallmark $flags",
        'Copy-MySkill decision-toolkit'
    )
    'when-needed' = @(
        'claude plugin install design --marketplace anthropics/knowledge-work-plugins',
        'claude plugin install ralph-loop --marketplace anthropics/claude-plugins-official',
        "$add jakubkrehel/skills --skill better-interface --skill better-layout --skill better-colors --skill better-typography --skill better-ui --skill better-accessibility --skill better-writing --skill better-motion --skill interface-review $flags",
        "$add emilkowalski/skills --skill break-ui --skill animation-performance $flags",
        "$add getsentry/skills --skill find-bugs --skill security-review $flags",
        "$add mattpocock/skills --skill grill-me --skill grilling $flags",
        "$add MengTo/Skills --skill audit-ai-design-slop --skill no-ai-design-slop $flags",
        "$add FeedHive/ai-slop-detector --skill ai-slop-detector $flags",
        'Copy-MySkill interactive-learning'
    )
    'variants' = @(
        "$add Leonxlnx/taste-skill --skill design-taste-frontend $flags",
        "$add Leonxlnx/taste-skill-classics --skill minimalist-ui --skill industrial-brutalist-ui --skill high-end-visual-design --skill stitch-design-taste $flags",
        "$add Leonxlnx/imagegen-skills --skill imagegen-frontend-web $flags",
        "$add MengTo/Skills --skill build-awwwards-quality-sites $flags",
        "$add arhamhi/oxfords --skill oxfords $flags"
    )
}

# With -File, "-Skip core,variants" arrives as one string, so split it ourselves.
$Skip = @($Skip | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
foreach ($s in $Skip) {
    if (-not $groups.Contains($s)) { Write-Host "Unknown group '$s'. Use: $($groups.Keys -join ', ')"; exit 1 }
}
if (-not $DryRun) {
    foreach ($tool in 'claude', 'npx') {
        if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { Write-Host "'$tool' not found. See setup/README.md, step 0."; exit 1 }
    }
}

$failed = @()
foreach ($name in $groups.Keys) {
    if ($Skip -contains $name) { Write-Host "`n# $name (skipped)"; continue }
    if (-not $DryRun -and -not $Yes) {
        $answer = Read-Host "`nInstall group '$name'? [y/N]"
        if ($answer -notmatch '^(y|yes)$') { Write-Host "# $name (skipped)"; continue }
    }
    Write-Host "`n# $name"
    foreach ($cmd in $groups[$name]) {
        Write-Host "> $cmd"
        if ($DryRun) { continue }
        $global:LASTEXITCODE = 0
        try { Invoke-Expression $cmd } catch { Write-Host "  $_"; $global:LASTEXITCODE = 1 }
        if ($LASTEXITCODE -ne 0) { $failed += $cmd }
    }
}

if ($DryRun) { Write-Host "`nDry run: nothing was installed."; exit 0 }
if ($failed.Count -gt 0) {
    Write-Host "`nThese commands failed. Run them by hand to see why:"
    $failed | ForEach-Object { Write-Host "  $_" }
    exit 1
}
Write-Host "`nDone. Start a new Claude Code session so it picks everything up."
