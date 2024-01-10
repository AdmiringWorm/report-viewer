class TestLog {
    # Property: Holds name
    [String] $Title
    [String] $Type
    [String] $Context
    [StatusType] $Status
    [string] $Details
    [string] $Content

    TestLog() {
    }

    # Constructor: Creates a new MyClass object, with the specified name
    TestLog([String] $NewTitle) {
        # Set name for TestLog
        $this.Title = $NewTitle
        $this.Status = 'Success'
    }
}