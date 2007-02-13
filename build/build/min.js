load("build/js/jsmin.js", "build/js/writeFile.js");

var f = jsmin('', readFile(arguments[0]), 3);

writeFile( arguments[1], f );
