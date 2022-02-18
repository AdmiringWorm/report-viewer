import { observable, Observable, pureComputed } from "knockout";
import { StatusType } from "../status-type";

export interface ILogModel {
    title: string;
    details?: string;
    context?: string;
    success?: boolean;
    status?: StatusType;
    content: string;
    type?: string;
}

export class LogViewModel {
    public title: Observable<string>;
    public description: Observable<string>;
    public context: Observable<string>;
    public status: Observable<StatusType>;
    public content: Observable<string>;
    public type: Observable<string>;

    public language = pureComputed(() => {
        switch (this.type()?.toLowerCase()) {
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

    public constructor(data?: ILogModel, globalStatus = StatusType.Success) {
        this.title = observable(data?.title ?? "");
        this.description = observable(data?.details ?? "");
        this.context = observable(data?.context ?? "");
        this.content = observable(data?.content ?? "No Content");
        this.type = observable(data?.type?.toLowerCase() ?? 'other');

        if (data?.status === undefined) {
            const success = data?.success ?? globalStatus == StatusType.Success;
            this.status = observable<StatusType>(success ? StatusType.Success : StatusType.Failed);
        } else {
            this.status = observable<StatusType>(data?.status ?? globalStatus);
        }
    }
}