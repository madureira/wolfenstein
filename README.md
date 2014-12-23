# Running unit tests

$ karma start src/javascript/tests/karma.conf.js


# Run app
## Needs Node-webkit v0.11.3
$ zip -r wolfenstein.nw *

$ ~/projects/environment/node-webkit/nw wolfenstein.nw

# Pack app
$ gulp build
