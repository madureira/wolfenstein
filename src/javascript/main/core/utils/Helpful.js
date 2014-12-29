/**
 * This object contains several useful methods.
 *
 * @author Madureira
 */
App.Helpful = {

    isNull: function(value) {
        return (value === undefined || value === null);
    },

    isNumber: function(number) {
        return (typeof number === 'number');
    },

    hasOnlyNumbers: function(list) {
        var isNumber = true;
        for (var i=0; i < list.length; i++) {
            if (!App.Helpful.isNumber(list[i])) {
                isNumber = false;
                break;
            }
        }

        return isNumber;
    },

    isArray: function(array) {
        return (array instanceof Array);
    },

    mergeObjects: function(source, target) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                target[property] = target[property] || {};
                arguments.callee(source[property], target[property]);
            } else {
                target[property] = source[property];
            }
        }

        return target;
    },

    isNodeWebkit: function() {
        return (typeof process === "object");
    }

};
