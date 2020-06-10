define(['backbone','config'], function (Backbone) {
    return Backbone.Model.extend({
        initialize: function( attributes ) {
            _.extend(this, attributes);

            this.on('request', this.timeout);
        },
        timeout: function(model, request, settings) {
            // console.debug('API:model:timeout', model);
            clearTimeout( model.tid );

            model.tid = setTimeout(
                // callback
                model.abort,
                // delay
                (model.requestTimeout || Config.globalRequestTimeout || 10000),
                // pass the model
                model,
                // params
                request,
                // request settings
                settings
            );

            model.listenToOnce(model,'sync', model.complete, model);
        },
        complete: function( model ) {
            clearTimeout( model.tid );
        },
        abort: function( model, request, settings ) {
            // console.debug('API:model:abort', arguments);
            request.abort();
        }
    });
});