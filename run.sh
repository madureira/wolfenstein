#!/bin/bash

rm -f doom.nw && zip -r doom.nw * && ~/projects/environment/node-webkit/nw doom.nw
