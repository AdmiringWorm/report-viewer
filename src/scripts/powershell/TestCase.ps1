class TestCase {
    # Property: Holds name
    [String] $Name
    [String] $Command
    [String] $Details
    [System.Collections.Generic.List[TestLog]] $Logs

    TestCase() {
        $this.Logs = [System.Collections.Generic.List[TestLog]]::new()
    }

    # Constructor: Creates a new MyClass object, with the specified name
    TestCase([String] $NewName) {
        # Set name for TestCase
        $this.Name = $NewName
        $this.Logs = [System.Collections.Generic.List[TestLog]]::new()
    }
}