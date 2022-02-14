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
