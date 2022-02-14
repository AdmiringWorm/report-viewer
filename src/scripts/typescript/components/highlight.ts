import "highlight.js";
import { HLJSApi } from "highlight.js";
import { components, computed, observable } from "knockout";

declare const hljs: HLJSApi;

export class HighlightComponent {
    private text = observable('');
    private language = observable('');
    public html = computed(() => {
        let results;
        if (this.language()) {
            results = hljs.highlight(this.text(), {
                language: this.language(),
                ignoreIllegals: true
            });
        } else {
            results = hljs.highlightAuto(this.text());
        }

        if (results) {
            return results.value;
        }

        return this.text();
    }, this);

    public constructor(params: any) {
        if (params.text) {
            this.text(params.text);
        }

        if (params.language) {
            this.language(params.language);
        }
    } 

    public static register() {
        components.register('highlightItem', {
            viewModel: HighlightComponent,
            template: '<pre><code data-bind="html: html"></code></pre>'
        });
    }
}