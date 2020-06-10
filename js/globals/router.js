define(['backbone'], function ( Backbone ) {
    return Backbone.Router.extend({
        // attributes
        autotrigger: { trigger: true },
        // inherit native back fn
        back: history.back.bind(history),
        // routes
        routes: {
            // default
            "home": 'page',
            "*actions": function( path, query ) {
                // console.info("Router.*actions", path, query);
                this.navigate(location.hash, this.autotrigger);
            }
        },
        // constructor
        initialize: function( options ) {
            console.info('Router.initialize');

            _.extend(this, options);

            // Required for Backbone's history
            Backbone.history.start({ root: '' });

            // define listeners here before returning the global object
            // e.g.
            // this.on('route', this.pageview); // attaches an event to fire on every page switch

            return this;
        },
        // auto paramitizer
        execute: function( callback, params ) {
            // debugery
            // console.debug('execute:', params);

            params.push(this.queryparams(params.pop()||''));

            if( callback ) {
                callback.apply(this, params);
            }
        },
        // turns an object into a querystring
        querystring: function( object, trimmed ) {
            var key, querystring = trimmed ? '':'?';

            for( key in object ) {
                querystring += key +'='+ object[key] +'&';
            }
            // slice will remove the trailing '&'
            // from the built string
            return querystring.slice(0,-1);
        },
        // turns a querystring into an object
        queryparams: function( querystring ) {
            if( !querystring ) {
                return { };
            }
            if( typeof querystring !== 'string' ) {
                return querystring;
            }
            if( querystring[0]==='?' ) {
                querystring = querystring.slice(1);
            }
            var pairs = querystring.split('&'),
                length = pairs.length, pair,
                params = { };
            while( length-- ) {
                pair = pairs[length].split('=');
                params[pair[0]]=pair[1];
            }
            return params;
        },
        page: function( params ) {
            console.debug('page:', params);
        },
        reload: function() {
            location.reload(true);
        }
    });
});