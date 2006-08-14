load("build/js/writeFile.js");

var blockMatch = /\s*\/\*\*\s*((.|\n)*?)\s*\*\/\n*/g;
var f = readFile(arguments[0]).replace( blockMatch, "\n" );

writeFile( arguments[1], f );
