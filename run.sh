#!/bin/bash

rm -f wolfenstein.nw && zip -r wolfenstein.nw * && ~/projects/environment/node-webkit/nw wolfenstein.nw
