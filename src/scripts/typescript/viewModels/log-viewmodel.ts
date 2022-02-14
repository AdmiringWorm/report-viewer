import { observable, Observable, pureComputed } from "knockout";

export interface ILogModel {
    title: string;
    details?: string;
    context?: string;
    success?: boolean;
    content: string;
    type?: string;
}

export class LogViewModel {
    public title: Observable<string>;
    public description: Observable<string>;
    public context: Observable<string>;
    public success: Observable<boolean>;
    public content: Observable<string>;
    public type: Observable<string>;

    public language = pureComputed(() => {
        switch (this.type()?.toLowerCase()) {
            case 'command':
                return 'console';
            case 'odata':
                return 'xml';
            default:
                return 'plaintext';
        }
    }, this);

    public constructor(data?: ILogModel, globalSuccess: boolean = true) {
        this.title = observable(data?.title ?? "");
        this.description = observable(data?.details ?? "");
        this.context = observable(data?.context ?? "");
        this.success = observable(data?.success ?? globalSuccess);
        this.content = observable(data?.content ?? "No Content");
        this.type = observable(data?.type?.toLowerCase() ?? 'other');
    }
}