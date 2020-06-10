define([
    'backbone',
    'views/components/header',
    'text!templates/home.html',
    'keykode',
],function ( Backbone, Header, html ) {
    return Backbone.View.extend({
        el: 'body',
        name: 'index',
        header: new Header(),
        template: _.template( html ),

        events: {
            'keydown': 'keykode',
            'click':'refocus'
        },
        keykodes: {
            reload: 'reload'
        },
        back: function(e) {
            App.Router.back();
        },
        reload: function() {
            App.Router.reload();
        },
        refocus: function(e) {
            e.preventDefault();
            var active = document.querySelector('.active');
            if( active ) {
                active.focus();
            } active = null;
        },
        initialize: function() {
            console.log('Initializing App');
            Backbone.Keykode.setScope(this);
        },
        render: function() {
            $('#page').html(this.template());
        }
    });
});