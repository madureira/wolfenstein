App.define('Shortcut', 'core/config', (function(fn) {
    'use strict';

    var defaultShortcuts = [{
        key: 'container',
        value: App.Properties.container
    }];

    fn = function() {
        _addDefaultShortcuts();
    };

    /**
     * Add a shortcut to instantiate objects.
     *
     * @param String node
     * @param Object item
     *
     * @return void
     */
    fn.prototype.addShortcut = function(node, item) {
        App[node] = item;
    };

    function _addDefaultShortcuts() {
        var i = 0,
            listSize = defaultShortcuts.length;

        for (i; i < listSize; i++) {
            var current = defaultShortcuts[i];
            App[current.key] = current.value;
        }
    }

    return fn;
}));

new App.core.config.Shortcut();
