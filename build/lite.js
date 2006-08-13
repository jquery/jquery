load("build/js/writeFile.js");

var blockMatch = /\s*\/\*\*\s*((.|\n)*?)\n*\*\/\s*/g;
var f = readFile(arguments[0]).replace( blockMatch, "" );

writeFile( arguments[1], f );
