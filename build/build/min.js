load("../jquery/build/js/jsmin.js", "../jquery/build/js/writeFile.js");

var f = jsmin('', readFile(arguments[0]), 3);

writeFile( arguments[1], f );
