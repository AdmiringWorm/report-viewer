import { Observable, observable } from "knockout";

export class StatusViewModel {
    public total: Observable<number>;
    public success: Observable<number>;
    public failed: Observable<number>;

    constructor(total = 0, success = 0, failed = 0) {
        this.total = observable(total);
        this.success = observable(success);
        this.failed = observable(failed);
    }

    public reset() {
        this.total(0);
        this.success(0);
        this.failed(0);
    }
}