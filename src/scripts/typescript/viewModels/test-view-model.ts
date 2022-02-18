import { observable, Observable, observableArray, ObservableArray } from "knockout";
import { StatusType } from "../status-type";
import { ILogModel, LogViewModel } from "./log-viewmodel";

export interface ITestDataModel {
    name: string;
    details?: string;
    command?: string;
    success?: boolean;
    status?: StatusType;
    logs: ILogModel[];
}

export class TestViewModel {
    public name: Observable<string>;
    public command: Observable<string>;
    public details: Observable<string>;
    public status: Observable<StatusType>;
    public logs: ObservableArray<LogViewModel>;

    constructor(data?: ITestDataModel) {
        this.name = observable(data?.name ?? "");
        this.command = observable(data?.command ?? "");
        this.details = observable(data?.details ?? "");
        if (data?.status === undefined) {
            const success = data?.success ?? true;
            this.status = observable<StatusType>(success ? StatusType.Success : StatusType.Failed);
        } else {
            this.status = observable(data?.status ?? StatusType.Success);
        }

        this.logs = observableArray<LogViewModel>([]);

        if (data?.logs) {
            for (const log of data.logs) {
                if (log.status === undefined) {
                    if (!log.success && this.status() === StatusType.Success) {
                        this.status(StatusType.Failed);
                    }
                } else {
                    if ((log.status === StatusType.Inconclusive || log.status === StatusType.NotRun) && this.status() === StatusType.Success) {
                        this.status(StatusType.Inconclusive);
                    }
                    else if (log.status === StatusType.Failed && this.status() !== StatusType.Failed) {
                        this.status(log.status);
                    }
                }

                const vm = new LogViewModel(log);
                this.logs.push(vm);
            }
        }
    }
}