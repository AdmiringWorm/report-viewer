function Start-TestCase {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string] $Name,
        [string] $Command,
        [string] $Details
    )

    $Global:CurrentTestCase = New-TestCase @PSBoundParameters
    $Global:CurrentTestCase
}