function New-TestCase {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string] $Name,
        [string] $Command,
        [string] $Details
    )

    if (!$Global:testScenario) {
        Write-Error "No Test Scenario have been created. Run New-TestScenario first."
        return
    }

    if ($Global:testScenario.Tests | ? Name -eq $Name ) {
        Write-Error "A test case with the name $Name is already present. Unable to create new case."
        return
    }

    $case = [TestCase]::new($Name)
    $case.Command = $Command
    $case.Details = $Details
    $Global:testScenario.Tests.Add($case) | Out-Null

    $case
}