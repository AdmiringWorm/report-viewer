"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
requirejs.config({
    map: {
        "*": {
            "highlight.js": "highlightjs"
        }
    },
    paths: {
        "bootstrap": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.1/js/bootstrap.bundle.min",
        "diff": "https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.0.0/diff.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min",
        "knockout": "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.1/knockout-latest.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        "highlightjs": "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min",
        "markdown-it": "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.3.2/markdown-it.min"
    }
});
requirejs(["knockout-configure"], () => requirejs(["index"]));
define("status-type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusType = void 0;
    var StatusType;
    (function (StatusType) {
        StatusType[StatusType["Success"] = 0] = "Success";
        StatusType[StatusType["Failed"] = 1] = "Failed";
        StatusType[StatusType["Inconclusive"] = 2] = "Inconclusive";
        StatusType[StatusType["NotRun"] = 3] = "NotRun";
    })(StatusType = exports.StatusType || (exports.StatusType = {}));
});
define("viewModels/log-viewmodel", ["require", "exports", "knockout"], function (require, exports, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogViewModel = void 0;
    class LogViewModel {
        constructor(data, globalStatus = 0 /* Success */) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            this.language = (0, knockout_1.pureComputed)(() => {
                var _a;
                switch ((_a = this.type()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
                    case 'command':
                    case 'terminal':
                        return 'console';
                    case 'odata':
                    case 'xml':
                        return 'xml';
                    default:
                        return 'plaintext';
                }
            }, this);
            this.title = (0, knockout_1.observable)((_a = data === null || data === void 0 ? void 0 : data.title) !== null && _a !== void 0 ? _a : "");
            this.description = (0, knockout_1.observable)((_b = data === null || data === void 0 ? void 0 : data.details) !== null && _b !== void 0 ? _b : "");
            this.context = (0, knockout_1.observable)((_c = data === null || data === void 0 ? void 0 : data.context) !== null && _c !== void 0 ? _c : "");
            this.content = (0, knockout_1.observable)((_d = data === null || data === void 0 ? void 0 : data.content) !== null && _d !== void 0 ? _d : "No Content");
            this.type = (0, knockout_1.observable)((_f = (_e = data === null || data === void 0 ? void 0 : data.type) === null || _e === void 0 ? void 0 : _e.toLowerCase()) !== null && _f !== void 0 ? _f : 'other');
            if ((data === null || data === void 0 ? void 0 : data.status) === undefined) {
                const success = (_g = data === null || data === void 0 ? void 0 : data.success) !== null && _g !== void 0 ? _g : globalStatus == 0 /* Success */;
                this.status = (0, knockout_1.observable)(success ? 0 /* Success */ : 1 /* Failed */);
            }
            else {
                this.status = (0, knockout_1.observable)((_h = data === null || data === void 0 ? void 0 : data.status) !== null && _h !== void 0 ? _h : globalStatus);
            }
        }
    }
    exports.LogViewModel = LogViewModel;
});
define("viewModels/dialog-viewmodel", ["require", "exports", "diff", "knockout"], function (require, exports, diff_1, knockout_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DialogViewModel = void 0;
    class DialogViewModel {
        constructor(title, allLogs) {
            this._allLogs = (0, knockout_2.observableArray)([]);
            this.left = (0, knockout_2.observable)();
            this.right = (0, knockout_2.observable)();
            this.title = (0, knockout_2.observable)("");
            this.leftLogs = (0, knockout_2.computed)(() => knockout_2.utils.arrayFilter(this._allLogs(), (model) => this.right() != model), this);
            this.rightLogs = (0, knockout_2.computed)(() => knockout_2.utils.arrayFilter(this._allLogs(), (model) => (this.left() !== undefined && this.left() != model)
                || (this.left() === undefined && this.right() == model)), this);
            this.diff = (0, knockout_2.computed)(() => {
                var _a, _b, _c, _d;
                let left = (_b = (_a = this.left()) === null || _a === void 0 ? void 0 : _a.content()) !== null && _b !== void 0 ? _b : "";
                let right = (_d = (_c = this.right()) === null || _c === void 0 ? void 0 : _c.content()) !== null && _d !== void 0 ? _d : "";
                const patch = (0, diff_1.createPatch)("comparison", left, right);
                const diffJson = Diff2Html.parse(patch);
                const diffHtml = Diff2Html.html(diffJson, {
                    outputFormat: 'side-by-side',
                    drawFileList: false
                });
                return diffHtml;
            });
            this.title(title);
            this._allLogs(allLogs);
            if (allLogs.length > 0) {
                this.left(allLogs[0]);
            }
            if (allLogs.length > 1) {
                this.right(allLogs[1]);
            }
        }
    }
    exports.DialogViewModel = DialogViewModel;
});
define("viewModels/status-viewmodel", ["require", "exports", "knockout"], function (require, exports, knockout_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusViewModel = void 0;
    class StatusViewModel {
        constructor(total = 0, success = 0, failed = 0) {
            this.total = (0, knockout_3.observable)(total);
            this.success = (0, knockout_3.observable)(success);
            this.failed = (0, knockout_3.observable)(failed);
        }
        reset() {
            this.total(0);
            this.success(0);
            this.failed(0);
        }
    }
    exports.StatusViewModel = StatusViewModel;
});
define("viewModels/test-view-model", ["require", "exports", "knockout", "viewModels/log-viewmodel"], function (require, exports, knockout_4, log_viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestViewModel = void 0;
    class TestViewModel {
        constructor(data) {
            var _a, _b, _c, _d, _e;
            this.name = (0, knockout_4.observable)((_a = data === null || data === void 0 ? void 0 : data.name) !== null && _a !== void 0 ? _a : "");
            this.command = (0, knockout_4.observable)((_b = data === null || data === void 0 ? void 0 : data.command) !== null && _b !== void 0 ? _b : "");
            this.details = (0, knockout_4.observable)((_c = data === null || data === void 0 ? void 0 : data.details) !== null && _c !== void 0 ? _c : "");
            if ((data === null || data === void 0 ? void 0 : data.status) === undefined) {
                const success = (_d = data === null || data === void 0 ? void 0 : data.success) !== null && _d !== void 0 ? _d : true;
                this.status = (0, knockout_4.observable)(success ? 0 /* Success */ : 1 /* Failed */);
            }
            else {
                this.status = (0, knockout_4.observable)((_e = data === null || data === void 0 ? void 0 : data.status) !== null && _e !== void 0 ? _e : 0 /* Success */);
            }
            this.logs = (0, knockout_4.observableArray)([]);
            if (data === null || data === void 0 ? void 0 : data.logs) {
                for (const log of data.logs) {
                    if (log.status === undefined) {
                        if (!log.success && this.status() === 0 /* Success */) {
                            this.status(1 /* Failed */);
                        }
                    }
                    else {
                        if ((log.status === 2 /* Inconclusive */ || log.status === 3 /* NotRun */) && this.status() === 0 /* Success */) {
                            this.status(2 /* Inconclusive */);
                        }
                        else if (log.status === 1 /* Failed */ && this.status() !== 1 /* Failed */) {
                            this.status(log.status);
                        }
                    }
                    const vm = new log_viewmodel_1.LogViewModel(log);
                    this.logs.push(vm);
                }
            }
        }
    }
    exports.TestViewModel = TestViewModel;
});
define("viewModels/main-viewmodel", ["require", "exports", "knockout", "viewModels/dialog-viewmodel", "viewModels/status-viewmodel", "viewModels/test-view-model"], function (require, exports, knockout_5, dialog_viewmodel_1, status_viewmodel_1, test_view_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MainViewModel {
        constructor() {
            this.title = (0, knockout_5.observable)("No JSON Data Loaded");
            this.description = (0, knockout_5.observable)("Use the local JSON File button to browse to a JSON file to use!");
            this.isLoading = (0, knockout_5.observable)(true);
            this.status = (0, knockout_5.observable)(new status_viewmodel_1.StatusViewModel());
            this.showSuccessful = (0, knockout_5.observable)(true);
            this.showFailed = (0, knockout_5.observable)(true);
            this.showNotes = (0, knockout_5.observable)(false);
            this.tests = (0, knockout_5.observableArray)([]);
            this.selectedTest = (0, knockout_5.observable)(new dialog_viewmodel_1.DialogViewModel("NO TESTS", []));
            this.openDiffDialog = (test) => {
                const vm = new dialog_viewmodel_1.DialogViewModel(test.name(), test.logs());
                this.selectedTest(vm);
            };
            this.filteredTests = (0, knockout_5.computed)(() => {
                return knockout_5.utils.arrayFilter(this.tests(), (test) => {
                    return (this.showSuccessful() && test.status() === 0 /* Success */)
                        || (this.showFailed() && test.status() === 1 /* Failed */)
                        || test.status() === 2 /* Inconclusive */ || test.status() === 3 /* NotRun */;
                });
            }, this);
            this.notes = (0, knockout_5.observableArray)([]);
            this.loadLocalJson = (event) => {
                if (!event) {
                    return;
                }
                const fileInput = event.target;
                if (!fileInput.files || fileInput.files.length === 0 || !fileInput.files[0]) {
                    return;
                }
                this.isLoading(true);
                this.updateData({});
                const reader = new FileReader();
                reader.onload = (ev) => {
                    var _a;
                    const content = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.result;
                    if (!content || typeof content !== typeof "string") {
                        this.isLoading(false);
                        return;
                    }
                    try {
                        const data = JSON.parse(content);
                        this.updateData(data);
                        fileInput.value = '';
                    }
                    catch (err) {
                        alert("Unable to parse JSON. Was the data given a JSON file?\n" + err);
                    }
                    this.isLoading(false);
                };
                reader.onerror = (err) => {
                    alert("Failed to read file:\n" + err);
                    this.isLoading(false);
                };
                reader.readAsText(fileInput.files[0]);
            };
            this.openDiffDialog.bind(this);
        }
        updateData(data) {
            var _a, _b, _c;
            this.title((_a = data.title) !== null && _a !== void 0 ? _a : "");
            this.description((_c = (_b = data.description) !== null && _b !== void 0 ? _b : data.details) !== null && _c !== void 0 ? _c : "");
            this.selectedTest(new dialog_viewmodel_1.DialogViewModel("NO TESTS", []));
            if (data.notes) {
                for (const note of data.notes) {
                    this.notes.push(note);
                }
            }
            else {
                this.notes([]);
            }
            if (data.tests) {
                const status = this.status();
                for (const test of data.tests) {
                    status.total(status.total() + 1);
                    var testVM = new test_view_model_1.TestViewModel(test);
                    this.tests.push(testVM);
                    if (testVM.status() === 0 /* Success */) {
                        status.success(status.success() + 1);
                    }
                    else if (testVM.status() === 1 /* Failed */) {
                        status.failed(status.failed() + 1);
                    }
                }
            }
            else {
                this.tests([]);
                this.status().reset();
            }
        }
    }
    exports.default = MainViewModel;
});
define("index", ["require", "exports", "knockout", "viewModels/main-viewmodel"], function (require, exports, knockout_6, main_viewmodel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    main_viewmodel_1 = __importDefault(main_viewmodel_1);
    var viewModel = new main_viewmodel_1.default();
    (0, knockout_6.applyBindings)(viewModel, document.getElementById("htmlDocument"));
    viewModel.isLoading(false);
});
define("components/highlight", ["require", "exports", "knockout", "highlight.js"], function (require, exports, knockout_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HighlightComponent = void 0;
    class HighlightComponent {
        constructor(params) {
            this.text = (0, knockout_7.observable)('');
            this.language = (0, knockout_7.observable)('');
            this.html = (0, knockout_7.computed)(() => {
                let results;
                if (this.language()) {
                    results = hljs.highlight(this.text(), {
                        language: this.language(),
                        ignoreIllegals: true
                    });
                }
                else {
                    results = hljs.highlightAuto(this.text());
                }
                if (results) {
                    return results.value;
                }
                return this.text();
            }, this);
            if (params.text) {
                this.text(params.text);
            }
            if (params.language) {
                this.language(params.language);
            }
        }
        static register() {
            knockout_7.components.register('highlightItem', {
                viewModel: HighlightComponent,
                template: '<pre><code data-bind="html: html"></code></pre>'
            });
        }
    }
    exports.HighlightComponent = HighlightComponent;
});
define("components/markdown", ["require", "exports", "markdown-it", "knockout", "highlight.js"], function (require, exports, markdown_it_1, knockout_8, highlight_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MarkdownComponent = void 0;
    markdown_it_1 = __importDefault(markdown_it_1);
    highlight_js_1 = __importDefault(highlight_js_1);
    const md = new markdown_it_1.default({
        html: false,
        typographer: true,
        linkify: true,
        xhtmlOut: true,
        highlight: (str, lang) => {
            if (lang && highlight_js_1.default.getLanguage(lang)) {
                try {
                    return highlight_js_1.default.highlight(str, { language: lang }).value;
                }
                catch (__) { }
            }
            else {
                try {
                    return highlight_js_1.default.highlightAuto(str).value;
                }
                catch (__) { }
            }
            return "";
        }
    });
    class MarkdownComponent {
        constructor(params) {
            this.text = (0, knockout_8.observable)('');
            this.html = (0, knockout_8.pureComputed)(() => {
                return md.render(this.text());
            }, this);
            this.text(params.text);
        }
        static register() {
            knockout_8.components.register('markdownItem', {
                viewModel: MarkdownComponent,
                template: '<div data-bind="html: html"></div>'
            });
            knockout_8.components.register('markdownNoteItem', {
                viewModel: MarkdownComponent,
                template: '<li class="list-group-item border-1 border-dark mb-2 rounded" data-bind="html: html"></li>'
            });
        }
    }
    exports.MarkdownComponent = MarkdownComponent;
});
define("components/status-icon", ["require", "exports", "knockout"], function (require, exports, knockout_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusIcon = void 0;
    //import { StatusType } from "../status-type";
    class StatusIcon {
        constructor(params) {
            this.status = (0, knockout_9.observable)(0 /* Success */);
            if (params.status === undefined) {
                this.status(params.success ? 0 /* Success */ : 1 /* Failed */);
            }
            else {
                this.status(params.status);
            }
        }
        static register() {
            knockout_9.components.register('statusIcon', {
                viewModel: StatusIcon,
                template: `<i class="fa-solid" data-bind="css: {
                'fa-check text-success': status() === 0,
                'fa-xmark text-danger': status() === 1,
                'fa-exclamation text-warning': status() === 2 || status() === 3
            }"></i>`
            });
        }
    }
    exports.StatusIcon = StatusIcon;
});
define("knockout-configure", ["require", "exports", "components/highlight", "components/markdown", "components/status-icon"], function (require, exports, highlight_1, markdown_1, status_icon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    markdown_1.MarkdownComponent.register();
    highlight_1.HighlightComponent.register();
    status_icon_1.StatusIcon.register();
});
//# sourceMappingURL=template.js.map