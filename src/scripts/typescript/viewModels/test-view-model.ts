import { observable, Observable, observableArray, ObservableArray } from "knockout";
import { ILogModel, LogViewModel } from "./log-viewmodel";

export interface ITestDataModel {
    name: string;
    details?: string;
    command?: string;
    success?: boolean;
    logs: ILogModel[];
}

export class TestViewModel {
    public name: Observable<string>;
    public command: Observable<string>;
    public details: Observable<string>;
    public success: Observable<boolean>;
    public logs: ObservableArray<LogViewModel>;

    constructor(data?: ITestDataModel) {
        this.name = observable(data?.name ?? "");
        this.command = observable(data?.command ?? "");
        this.details = observable(data?.details ?? "");
        this.success = observable(data?.success ?? true);

        this.logs = observableArray<LogViewModel>([]);

        if (data?.logs) {
            for (const log of data.logs) {
                if (!log.success && this.success()) {
                    this.success(false);
                }

                const vm = new LogViewModel(log, this.success());
                this.logs.push(vm);
            }
        }
    }
}