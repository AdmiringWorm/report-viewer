import { createPatch } from "diff";
import { computed, observable, observableArray, utils } from "knockout";
import { LogViewModel } from "./log-viewmodel";

interface IDiff2HtmlInterface {
    parse(diffInput: string, configuration?: {}): any[]
    html(diffInput: string | any[], configuration?: {}): string;
}

declare const Diff2Html: IDiff2HtmlInterface;

export class DialogViewModel {
    private _allLogs = observableArray<LogViewModel>([]);
    public left = observable<LogViewModel>();
    public right = observable<LogViewModel>();
    public title = observable<string>("");

    constructor(title: string, allLogs: LogViewModel[]) {
        this.title(title);
        this._allLogs(allLogs);

        if (allLogs.length > 0) {
            this.left(allLogs[0]);
        }

        if (allLogs.length > 1) {
            this.right(allLogs[1]);
        }
    }

    public leftLogs = computed<LogViewModel[]>(() => 
        utils.arrayFilter(this._allLogs(), (model) =>
            this.right() != model),
        this);

    public rightLogs = computed<LogViewModel[]>(() => 
        utils.arrayFilter(this._allLogs(), (model) => 
            (this.left() !== undefined && this.left() != model)
             || (this.left() === undefined && this.right() == model)),
        this);

    public diff = computed<string>(() => {
        let left = this.left()?.content() ?? "";
        let right = this.right()?.content() ?? "";

        const patch = createPatch("comparison", left, right);

        const diffJson = Diff2Html.parse(patch);
        const diffHtml = Diff2Html.html(diffJson, {
            outputFormat: 'side-by-side',
            drawFileList: false
        });

        return diffHtml;
    });
}