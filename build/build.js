load("js/ParseMaster.js", "js/pack.js", "js/writeFile.js");

var out = readFile( arguments[0] );

writeFile( arguments[1], pack( out, 62, true, false ) );
