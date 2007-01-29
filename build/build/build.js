load("../jquery/build/js/ParseMaster.js", "../jquery/build/js/pack.js", "../jquery/build/js/writeFile.js");

var out = readFile( arguments[0] );

writeFile( arguments[1], pack( out, 62, true, false ) );
