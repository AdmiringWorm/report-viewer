param([switch]$Release)

$distDir = "$PSScriptRoot\dist"
$srcDir = "$PSScriptRoot\src"

yarn install

if ($Release) {
    yarn tsc --removeComments --stripInternal --noEmitOnError --declaration
    yarn uglifyjs "$distDir\template.js" --compress --mangle -o "$distDir\template.min.js"
    $scriptContent = Get-Content -Raw -Encoding utf8 "$distDir\template.min.js"
    $scriptRef = "<script defer>$scriptContent</script>"
} else {
    yarn tsc --incremental --sourceMap
    $scriptRef = "<script src=`"template.js`"></script>"
}
$htmlContent = Get-Content -Encoding utf8 "$srcDir\index.html" | % {
    $_ -replace "{{SCRIPT_REFERENCE}}", $scriptRef
}

$htmlContent | Out-File -Encoding utf8 "$distDir\index.html"

$scripts = Get-ChildItem src -Filter "*.ps1" -Recurse

$newScriptContent = $scripts | % {
    Get-Content $_.FullName -Encoding utf8
    ""
}

$newScriptContent | Out-File "$distDir\helpers.ps1"