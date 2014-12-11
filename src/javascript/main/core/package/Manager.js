/**
 * This function is responsible to generate the namespace dynamically.
 *
 * @author Madureira
 *
 * @param string namespace
 *
 * @return void
 */
App.define = App.define || function(clazz, namespace, object) {

    /**
     * Generates an object based on array.
     * # Example
     *      Given: array([0] => 'a', [1] => 'b')
     *      Return: Object({ a: { b: {} } });
     *
     * @param array list
     *
     * @return object
     */
    function generatesObjectByArray(list) {
        var namespaceTree = {};
        var rootPackage = list[0];

        list.reverse();

        for (var i=0; list.length > i; i++) {
            var tmp = {};

            if (i === 0) {
                var implementation = {};

                switch(rootPackage) {
                    case 'views':
                        implementation = object(function(){}, App.Properties.selectorEngine, App.Properties.templateEngine);
                        break;
                    default:
                        implementation = object(function(){});
                }

                tmp[list[i]] = implementation;
            } else {
                tmp[list[i]] = namespaceTree;
            }

            namespaceTree = tmp;
        }

        return namespaceTree;
    }

    /**
     * Creates a namespace or merge if it exist on namespace container tree.
     *
     * @param object namespace
     * @param object context
     *
     * @return object
     */
    function createNamespace(namespace, context) {
        return App.Helpful.mergeObjects(namespace, context);
    }

    var namespaceList = namespace.split('/');
    namespaceList.push(clazz);

    var newNamespaceObject = generatesObjectByArray(namespaceList);

    App = createNamespace(newNamespaceObject, App);
};

