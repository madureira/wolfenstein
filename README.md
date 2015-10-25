# Wolfenstein 3D
[![GitHub version](https://badge.fury.io/gh/madureira%2Fwolfenstein.svg)](http://badge.fury.io/gh/madureira%2Fwolfenstein) [![Build Status: Linux](https://travis-ci.org/madureira/wolfenstein.svg)](https://travis-ci.org/madureira/wolfenstein) [![Coverage Status](https://coveralls.io/repos/madureira/wolfenstein/badge.png)](https://coveralls.io/r/madureira/wolfenstein) [![Code Climate](https://codeclimate.com/github/madureira/wolfenstein/badges/gpa.svg)](https://codeclimate.com/github/madureira/wolfenstein) [![Dependency Status](https://www.versioneye.com/user/projects/549fa2c46b1b81d16a000b65/badge.svg?style=flat)](https://www.versioneye.com/user/projects/549fa2c46b1b81d16a000b65)

This is a javascript implementation of the game Wolfenstein 3D.
Wolfenstein 3D is a first-person shooter video game developed by id Software and published by Apogee Software.
Originally released on May 5, 1992, for the PC operating system DOS.

![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/github-logo.jpg)

![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/screenshot_01.png) ![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/screenshot_02.png) ![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/screenshot_03.png)


## Dependencies
1. Node >= 4.1.2


## How to generate source files
```sh
$ npm install
$ npm run prepare
```


## How to Play?
When you run:
```sh
    $ npm run build
```
Is generated executables to each plataform inside:
```
bin/wolfenstein/
```
Choose your plataform and enjoy :)


### Linux
Run the executable file:
```sh
    $ ./bin/wolfenstein/linux64/wolfenstein
```


### Windows
Run the executable file:
```sh
    bin\wolfenstein\win64\wolfenstein.exe
```


### OSX
Run the executable file:
```sh
    bin/wolfenstein/osx64/wolfenstein
```


## Controls
| Keys          | Function                |
| ------------- |:-----------------------:|
| W / ↑         | move foward             |
| S / ↓         | move backward           |
| A / ←         | turn left               |
| D / →         | turn right              |
| F             | Show Frames per second  |
| M             | Show level map          |

---

## Development
To execute the game and modify the code in runtime, open the file index.html in your browser (Supported browser: Google Chrome).
To edit files and see the changes at runtime, run in watch mode:
```sh
    $ npm run watch
```

### Running unit tests
```sh
    $ npm test
```
