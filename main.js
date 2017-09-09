requirejs.config({
    paths: {
    	webfontloader: "https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader",
        jquery: "http://code.jquery.com/jquery-3.2.1.slim.min",
        popper: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js",
        bootstrap: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"
    },
    shim: {
        bootstrap: {
            deps: ['jquery']
        }
    }
});

//Define dependencies and pass a callback when dependencies have been loaded
require(["jquery", "bootstrap"], function ($) {
    //Bootstrap and jquery are ready to use here
    //Access jquery and bootstrap plugins with $ variable
});