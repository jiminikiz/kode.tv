define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            thumbnailUrl: 'img/thumbs/default.png',
            thumbnailWidth:  256,
            thumbnailHeight: 144,
            title: null,
            text: null
        },
        initialize: function(options) {
            _.extend(this, options);
        }
    });
});