var jshint = require("./lib/jshint").JSHINT,
		src = require("fs").readFileSync("dist/jquery.js", "utf8"),
		config = {
			evil: true,
			undef: false,
			browser: true,
			wsh: true,
			eqnull: true,
			expr: true,
			curly: true,
			trailing: true,
			predef: [
				"define",
				"DOMParser"
			],
			maxerr: 100
		};

if ( jshint( src, config ) ) {
	console.log("JSHint check passed.");
} else {

	console.log("JSHint found errors.");

	jshint.errors.forEach(function( error ) {

		if ( !error ) {
			return;
		}

		var evidence = error.evidence ? error.evidence : "",
				character = error.character === true ? "EOL" : "C" + error.character;

		if ( evidence ) {
			evidence = evidence.replace( /\t/g, " " ).trim();
			console.log(" [L" + error.line + ":" + character + "] " + error.reason + "\n  " + evidence + "\n");
		}
	});
}