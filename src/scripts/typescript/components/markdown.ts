import MarkdownIt from "markdown-it";
import { components, observable, pureComputed } from "knockout";
import hljs from "highlight.js";

const md = new MarkdownIt({
    html: false,
    typographer: true,
    linkify: true,
    xhtmlOut: true,
    highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value
            } catch (__) {}
        } else {
            try {
                return hljs.highlightAuto(str).value;
            } catch (__) {}
        }
        return ""
    }
});

export class MarkdownComponent {
    private text = observable('');
    public html = pureComputed(() => {
        return md.render(this.text());
    }, this);

    constructor (params: any) {
        this.text(params.text);
    }

    public static register() {
        components.register('markdownItem', {
            viewModel: MarkdownComponent,
            template: '<div data-bind="html: html"></div>'
        });

        components.register('markdownNoteItem', {
            viewModel: MarkdownComponent,
            template: '<li class="list-group-item border-1 border-dark mb-2 rounded" data-bind="html: html"></li>'
        });
    }
}
