// Filename: js/views/home.js
define([
    'backbone',
    'text!../templates/slider.html'
], function (Backbone, html) {
    // The view
    return Backbone.View.extend({
        tagName:'ul'
        collection: null,
        template: _.template( html ),
        events: {

        },
        navigate: {

        },
        initialize: function(collection) {
            this.collection = collection;
        },
        render: function() {
            // Render the view using a templatetrfff
            this.$el.html(this.template({
                slides: this.collection.toJSON();
            }));
        }
    });
});