function Complete-TestCase {
    [CmdletBinding()]
    param (
        [Parameter()]
        [string]
        $Path
    )

    if (!$Global:CurrentTestCase) {
        Write-Error "No Test Case was started. Unable to complete a test case."
        return
    }

    $Global:testScenario.Save($Path, $true)
    $Global:CurrentTestCase = $null
}