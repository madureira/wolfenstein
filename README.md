# Wolfenstein 3D

This is a javascript implementation of the game Wolfenstein 3D.
Wolfenstein 3D is a first-person shooter video game developed by id Software and published by Apogee Software.
Originally released on May 5, 1992, for the PC operating system DOS.

## How to PLay?

### Windows
Execute the file inside

```sh
    bin\wolfenstein\win64\wolfenstein.exe
```

### Linux
Execute the file inside

```sh
    ./bin/wolfenstein/linux64/wolfenstein
```


## Running unit tests

$ karma start src/javascript/tests/karma.conf.js


# Run app
## Needs Node-webkit v0.11.3
$ zip -r wolfenstein.nw *

$ ~/projects/environment/node-webkit/nw wolfenstein.nw

# Pack app
$ gulp build
