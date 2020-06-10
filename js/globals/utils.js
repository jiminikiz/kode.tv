define(function() {
    window.Utils = {
        // callback debugger
        debugery: function(e,r) {
            console.debug({
                error: e,
                result: r
            });
        },
        // db success debugger
        txSuccess: function( tx, results ) {
            var rows = results.rows, tuples = [],
                R = rows.length, r = 0;
            if( R ) {
                for( r; r<R; r++ ) {
                    tuples.push( rows.item(r) );
                }
            }
            // debugery
            // console.debug('TX result:', tuples || 'success');
        },
        // db failure debugger
        txFailure: function( tx, error ) {
            console.error( error && error.message );
        },
        // turns an object into a query string
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
            if( querystring[0]==='?' ) {
                querystring = querystring.slice(1);
            }
            var pairs = querystring.split('&'),
                length = pairs.length, pair,
                params = { };

            while(length--) {
                pair = pairs[length].split('=');
                params[pair[0]]=pair[1];
            }
            return params;
        },
        hashcrumbs: function( hash ) {
            var pieces = (hash||location.hash).slice(1).split('?');
            return {
                parts: (pieces.shift()||'').split('/'),
                query: Utils.queryparams( pieces.shift() ),
            };
        },
        hashpage: function( hash ) {
            return this.hashcrumbs( 0, hash ).split('?').shift();
        },
        hashquery: function( hash ) {
            return (hash||location.hash).split('?').pop();
        },
        hashparams: function( hash ) {
            return this.queryparams( this.hashquery( hash ) );
        }
    };
});