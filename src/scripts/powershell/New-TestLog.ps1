function New-TestLog {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string] $TestName,
        [Parameter(Mandatory)]
        [string] $Title,
        [string] $Type = 'other',
        [string] $Context,
        [string] $Details,
        [string] $Content,
        [StatusType] $Status = 'Success'
    )

    if (!$Global:testScenario) {
        Write-Error "No Test Scenario have been created. Run New-TestScenario first."
        return
    }

    $testCase = $Global:testScenario.Tests | ? Name -eq $TestName

    if (!$testCase) {
        $testCase = New-TestCase -Name $TestName -Details $Details
    }

    $newLog = [TestLog]::new($Title)
    $newLog.Type = $Type
    $newLog.Context = $Context
    $newLog.Status = $Status
    $newLog.Details = $Details
    $newLog.Content = $Content
    $testCase.Logs.Add($newLog) | Out-Null

    $newLog
}