define(['backbone','config'], function ( Backbone, Config ) {
    return Backbone.Collection.extend({
        initialize: function( attributes ) {
            _.extend(this, attributes);
            this.on('request', this.timeout);
        },
        timeout: function(collection, request, settings) {
            // console.debug('API:collection:timeout', collection);
            clearTimeout( collection.tid );

            collection.tid = setTimeout(
                // callback
                collection.abort,
                // delay
                (collection.requestTimeout || Config.globalRequestTimeout || 10000),
                // pass the collection
                collection,
                // params
                request,
                // request settings
                settings
            );

            collection.listenToOnce(collection,'sync', collection.complete, collection);
        },
        complete: function( collection ) {
            clearTimeout( collection.tid );
        },
        abort: function( collection, request, settings ) {
            // console.debug('API:collection:abort');
            request.abort();
        }
    });
});