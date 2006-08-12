#!/bin/sh
cat jquery/jquery.js event/event.js fx/fx.js ajax/ajax.js > jquery-svn.js
cd docs && ./build.sh && cd ..
