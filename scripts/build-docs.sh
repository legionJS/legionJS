#!/bin/bash

# Clean docs directory
rm -rf ./docs/build/*

# Build docs
node node_modules/jsdoc/jsdoc.js -c ./jsdoc.conf.json
