param(
    [switch]$Release
)

$distDir = "$PSScriptRoot/dist"
$srcDir = "$PSScriptRoot/src"

$encoding = if ($IsCoreCLR) {
    'utf8NoBOM'
} else {
    'utf8'
}

$encodingBom = if ($IsCoreCLR) {
    'utf8BOM'
} else {
    'utf8'
}

yarn install

if ($Release) {
    if (Test-Path "$distDir") {
        "Removing existing distribution files"
        Remove-Item "$distDir\*" -Recurse
    }
    yarn tsc --removeComments --stripInternal --noEmitOnError
    yarn uglifyjs "$distDir/template.js" --compress --mangle -o "$distDir/template.min.js"
    $sha = Get-FileHash -Algorithm SHA256 -Path "$distDir/template.min.js" | % Hash
    $scriptRef = "<script src=`"template.min.js?sha=$sha`"></script>"
} else {
    yarn tsc --incremental --sourceMap
    $sha = Get-FileHash -Algorithm SHA256 -Path "$distDir/template.js" | % Hash
    $scriptRef = "<script src=`"template.js?sha=$sha`"></script>"
}
$htmlContent = Get-Content -Encoding utf8 "$srcDir/index.html" | % {
    $_ -replace "{{SCRIPT_REFERENCE}}", $scriptRef
}

$htmlContent | Out-File -Encoding $encoding "$distDir/index.html"

$scripts = Get-ChildItem src -Filter "*.ps1" -Recurse

$newScriptContent = $scripts | % {
    Get-Content $_.FullName -Encoding utf8
    ""
}

$newScriptContent | Out-File -Encoding $encodingBom "$distDir/helpers.ps1"