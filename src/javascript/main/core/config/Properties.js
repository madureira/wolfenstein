// Defines the namespace container
var App = App || {};

App.maps = App.maps || {};

App.Properties = {

    //container: '#stage',
    container: 'stage',
    //selectorEngine: jQuery,
    selectorEngine: function(id) { return document.getElementById(id); },
    templateEngine: App.template,
    resources: 'src/resources'

};
