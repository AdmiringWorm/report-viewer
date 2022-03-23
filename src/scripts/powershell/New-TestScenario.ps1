function New-TestScenario {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string] $Title,
        [string] $Details
    )

    $global:testScenario = [TestScenario]::new($Title)

    if ($Details) {
        $global:testScenario.Details = $Details
    }
}