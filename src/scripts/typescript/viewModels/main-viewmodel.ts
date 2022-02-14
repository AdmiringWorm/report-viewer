import {computed, observable, observableArray, utils} from "knockout";
import { DialogViewModel } from "./dialog-viewmodel";
import { StatusViewModel } from "./status-viewmodel";
import { ITestDataModel, TestViewModel } from "./test-view-model";

interface IDataTemplate {
    title?: string;
    description?: string;
    details?: string;
    notes?: string[];
    tests?: ITestDataModel[];
}

export default class MainViewModel {
    public title = observable("No JSON Data Loaded");
    public description = observable("Use the local JSON File button to browse to a JSON file to use!");
    public isLoading = observable(true);
    public status = observable(new StatusViewModel());
    public showSuccessful = observable(true);
    public showFailed = observable(true);
    public showNotes = observable(false);
    public tests = observableArray<TestViewModel>([]);
    public selectedTest = observable<DialogViewModel>(new DialogViewModel("NO TESTS", []));
    
    public openDiffDialog = (test: TestViewModel) => {
        const vm = new DialogViewModel(test.name(), test.logs());
        this.selectedTest(vm);
    };

    constructor() {
        this.openDiffDialog.bind(this);
    }

    public filteredTests = computed<TestViewModel[]>(() => {
        return utils.arrayFilter(this.tests(), (test) => {
            return (this.showSuccessful() && test.success())
                || (this.showFailed() && !test.success());
        });
    }, this);

    public notes = observableArray<string>([]);

    public loadLocalJson = (event: Event) => {
        if (!event) {
            return;
        }

        const fileInput = event.target as HTMLInputElement;

        if (!fileInput.files || fileInput.files.length === 0 || !fileInput.files[0]) {
            return;
        }

        this.isLoading(true);
        this.updateData({});

        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result as string;
            if (!content || typeof content !== typeof "string") {
                this.isLoading(false);
                return;
            }

            try {
                const data: IDataTemplate = JSON.parse(content);
                this.updateData(data);

                fileInput.value = '';
            } catch (err) {
                alert("Unable to parse JSON. Was the data given a JSON file?\n" + err);
            }

            this.isLoading(false);
        };
        reader.onerror = (err) => {
            alert("Failed to read file:\n" + err);
            this.isLoading(false);
        };

        reader.readAsText(fileInput.files[0]);
    }

    private updateData(data: IDataTemplate): void {
        this.title(data.title ?? "");
        this.description(data.description ?? data.details ?? "");
        this.selectedTest(new DialogViewModel("NO TESTS", []));

        if (data.notes) {
            for (const note of data.notes) {
                this.notes.push(note);
            }
        } else {
            this.notes([]);
        }

        if (data.tests) {
            const status = this.status();
            for (const test of data.tests) {
                status.total(status.total() + 1);
                var testVM = new TestViewModel(test);
                this.tests.push(testVM);

                if (testVM.success()) {
                    status.success(status.success() + 1);
                } else {
                    status.failed(status.failed() + 1);
                }
            }
        } else {
            this.tests([]);
            this.status().reset();
        }
    }
}