function Open-TestScenario {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]
        $Path
    )

    $Global:testScenario = [TestScenario]::Load($Path)
    $Global:testScenario
}