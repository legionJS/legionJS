#!/bin/bash

##Static Analysis
#JSHint
node ./node_modules/jshint/bin/jshint src/ 

#JSCS
node ./node_modules/jscs/bin/jscs src/


##Tests
#Node tests
#node ./node_modules/mocha/bin/mocha tests/tests.js
node node_modules/istanbul/lib/cli.js cover --dir coverage/node node_modules/mocha/bin/_mocha -- -R spec tests/tests.js

#Instrament code for coverage in browser
node ./node_modules/istanbul/lib/cli.js instrument src/ -o src_instrumented

#Browser Tests in Phantom JS
./node_modules/phantomjs/bin/phantomjs ./node_modules/mocha-phantomjs/lib/mocha-phantomjs.coffee tests/testrunner.html spec '{"hooks": "mocha-phantomjs-istanbul", "coverageFile": "coverage/phantom/coverage.json"}'

##
#Generate Coverage report
node ./node_modules/istanbul/lib/cli.js report --dir coverage_report html text