// Defines the namespace container
var App = App || {};

App.maps = App.maps || {};

App.Properties = {

    container: 'stage',

    selectorEngine: (function() {
        return {
            byId: function(id) {
                return document.getElementById(id);
            },
            createTag: function(tagName) {
                return document.createElement(tagName);
            },
            getByTag: function(tagName) {
                return document.getElementsByTagName(tagName)[0];
            },
            removeById: function(id) {
                var elem = document.getElementById(id);
                var parentNode = elem.parentNode;
                parentNode.removeChild(elem);
            }
        };
    })(),

    templateEngine: App.template,
    texturesPath: 'src/resources/textures/',
    spritesPath: 'src/resources/sprites/',
    statusbarPath: 'src/resources/statusbar/',
    soundPath: 'src/resources/sounds/',
    fps: 30,

    playerSpeed: 0.18,

    playerRotateSpeed: 3,

    raycastingColor: 'rgba(0,100,0,0.3)',

    screenWidth: 720,
    screenHeight: 480,
    stripWidth: 2,

    miniMapElementId: 'minimap',
    miniMapObjectElementId: 'minimapobjects',
    miniMapScale: 4,
    miniMapBlocksColor: '#000',
    miniMapDebugMode: false

};
