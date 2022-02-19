class TestScenario {
    # Property: Holds name
    [String] $Title
    [String] $Details
    [System.Collections.Generic.List[string]] $Notes
    [System.Collections.Generic.List[TestCase]] $Tests

    TestScenario() {
        $this.Notes = [System.Collections.Generic.List[string]]::new()
        $this.Tests = [System.Collections.Generic.List[TestCase]]::new()
    }

    # Constructor: Creates a new MyClass object, with the specified name
    TestScenario([String] $NewTitle) {
        # Set name for TestScenario
        $this.Title = $NewTitle
        $this.Notes = [System.Collections.Generic.List[string]]::new()
    }

    [void]Save([string]$Path, [bool]$writeIndented = $false) {
        $options = [System.Text.Json.JsonSerializerOptions]::new()
        $options.IgnoreNullValues = $true
        $options.IgnoreReadOnlyFields = $true
        $options.IncludeFields = $false
        $options.PropertyNameCaseInsensitive = $true
        $options.PropertyNamingPolicy = [System.Text.Json.JsonNamingPolicy]::CamelCase
        $options.WriteIndented = $writeIndented

        $json = [System.Text.Json.JsonSerializer]::Serialize($this, $options)
        
        $json | Out-File $Path -Encoding utf8
    }

    static [TestScenario]Load([string]$Path) {
        $options = [System.Text.Json.JsonSerializerOptions]::new()
        $options.IgnoreNullValues = $true
        $options.IgnoreReadOnlyFields = $true
        $options.IncludeFields = $false
        $options.PropertyNameCaseInsensitive = $true
        $options.PropertyNamingPolicy = [System.Text.Json.JsonNamingPolicy]::CamelCase

        $json = Get-Content -Raw -Encoding utf8 $Path

        $t = [TestScenario]
        $data = [System.Text.Json.JsonSerializer]::Deserialize($json, $t , $options)
        return $data
    }
}