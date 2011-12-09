var JSHINT = require("./lib/jshint").JSHINT,
	print = require("sys").print,
	src = require("fs").readFileSync("dist/jquery.js", "utf8");

JSHINT(src, {
	evil: true,
	undef: false,
	browser: true,
	wsh: true,
	eqnull: true,
	expr: true,
	curly: true,
	eqeq: true,
	trailing: true,
	predef: [
		"define",
		"DOMParser"
	],
	maxerr: 100
});

var e = JSHINT.errors, found = e.length, i = 0, w;

for ( ; i < e.length; i++ ) {
	w = e[i];

	print( "\n" + w.evidence + "\n" );
	print( "    Problem at line " + w.line + " character " + w.character + ": " + w.reason );
}

if ( found > 0 ) {
	print( "\n" + found + " Error(s) found.\n" );
} else {
	print( "JSHint check passed.\n" );
}