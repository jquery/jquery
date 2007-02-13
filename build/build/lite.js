load("build/js/writeFile.js");

var blockMatch = /\s*\/\*\*\s*((.|\n|\r\n)*?)\s*\*\/\n*/g;
var f = readFile(arguments[0]).replace( blockMatch, "\n" ).replace( /\n\n+/g, "\n\n" );

writeFile( arguments[1], f );
