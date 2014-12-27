# Wolfenstein 3D [![Build Status](https://travis-ci.org/madureira/wolfenstein.svg)](https://travis-ci.org/madureira/wolfenstein)

This is a javascript implementation of the game Wolfenstein 3D.
Wolfenstein 3D is a first-person shooter video game developed by id Software and published by Apogee Software.
Originally released on May 5, 1992, for the PC operating system DOS.

![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/github-logo.jpg)

![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/screenshot_01.png) ![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/screenshot_02.png) ![alt tag](https://raw.github.com/madureira/wolfenstein/master/src/resources/icons/screenshot_03.png)

## Dependencies

1. Node >= 0.11.3


## How to generate source files

```sh
    $ npm install
    $ npm install -g karma-cli gulp@3.6.2
    $ gulp
```


## How to Play?
First of all, we need to generate binary files.
If your system is 32 bits, you should change the version on bin/wolfenstein/PLATAFORM{version}/ to run executable file.

```sh
    $ gulp build
```

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
    bin/wolfenstein/osx64/wolfenstein.app
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

### Running unit tests

```sh
    $ karma start src/javascript/tests/karma.conf.js
```
