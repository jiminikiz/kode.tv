require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        }
    },
    paths: {
        // libs
        jquery:     'lib/vendor/jquery.min',
        underscore: 'lib/vendor/underscore.min',
        backbone:   'lib/vendor/backbone.min',
        domReady:   'lib/vendor/domReady',
        keykode:    'lib/vendor/keykode',
        text:       'lib/vendor/text',
        // globals
        config:     'globals/config',
        router:     'globals/router',
        utils:      'globals/utils',
        // templates
        templates:  'views/templates',
    }
});

require(['router','utils'], function ( Router ) {
    console.info("Main.initialize");
    // Auto added to window:
    // @Utils
    // @Config
    // @Backbone

    // Create the Router (Router)
    window.Router = new Router();
});