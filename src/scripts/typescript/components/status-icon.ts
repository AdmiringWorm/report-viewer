import { components, observable } from "knockout";
import { StatusType } from "../status-type";
//import { StatusType } from "../status-type";

export class StatusIcon {
    public status = observable<StatusType>(StatusType.Success);

    constructor (params: any) {
        if (params.status === undefined) {
            this.status(params.success ? StatusType.Success : StatusType.Failed);
        } else {
            this.status(params.status);
        }
    }

    public static register() {
        components.register('statusIcon', {
            viewModel: StatusIcon,
            template: `<i class="fa-solid" data-bind="css: {
                'fa-check text-success': status() === 0,
                'fa-xmark text-danger': status() === 1,
                'fa-exclamation text-warning': status() === 2 || status() === 3
            }"></i>`
        })
    }
}