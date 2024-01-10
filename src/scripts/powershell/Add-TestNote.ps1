function Add-TestNote {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string] $Note
    )

    if (!$Global:testScenario) {
        Write-Error "No Test Scenario have been created. Run New-TestScenario first."
        return
    }

    $Global:testScenario.Notes.Add($Note)
}