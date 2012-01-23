var jshint = require("./lib/jshint").JSHINT,
		src = require("fs").readFileSync("dist/jquery.js", "utf8"),
		config = {
			evil: true,
			browser: true,
			wsh: true,
			eqnull: true,
			expr: true,
			curly: true,
			trailing: true,
			undef: true,
			smarttabs: true,
			predef: [
				"define",
				"DOMParser"
			],
			maxerr: 100
		};

if ( jshint( src, config ) ) {
	console.log("JSHint check passed.");
} else {

	console.log( "JSHint found errors." );

	jshint.errors.forEach(function( e ) {
		if ( !e ) { return; }

		var str = e.evidence ? e.evidence : "",
		character = e.character === true ? "EOL" : "C" + e.character;

		if ( str ) {
			str = str.replace( /\t/g, " " ).trim();
			console.log( " [L" + e.line + ":" + character + "] " + e.reason + "\n  " + str + "\n");
		}
	});
}