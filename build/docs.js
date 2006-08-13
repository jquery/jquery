load("js/json.js");
load("js/xml.js");
load("js/writeFile.js");

var types = {
	jQuery: "A jQuery object.",
	Object: "A simple Javascript object. For example, it could be a String or a Number.",
	String: "A string of characters.",
	Number: "A numeric valid.",
	Element: "The Javascript object representation of a DOM Element.",
	Hash: "A Javascript object that contains key/value pairs in the form of properties and values.",
	"Array&lt;Element&gt;": "An Array of DOM Elements.",
	"Array&lt;String&gt;": "An Array of strings.",
	Function: "A reference to a Javascript function."
};

var f = readFile(arguments[0]);

var c = [], bm, m;
var blockMatch = /\/\*\*\s*((.|\n)*?)\s*\*\//g;
var paramMatch = /\@(\S+) *((.|\n)*?)(?=\n\@|!!!)/m;

while ( bm = blockMatch.exec(f) ) {
	block = bm[1].replace(/^\s*\* ?/mg,"") + "!!!";
	var ret = { params: [], examples: [] };

	while ( m = paramMatch.exec( block ) ) {
		block = block.replace( paramMatch, "" );

		var n = m[1];
		var v = m[2]
			.replace(/\s*$/g,"")
			.replace(/^\s*/g,"")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\n/g, "<br/>")
			/*.replace(/(\s\s+)/g, function(a){
				var ret = "";
				for ( var i = 0; i < a.length; i++ )
					ret += "&nbsp;";
				return ret;
			})*/ || 1;

		if ( n == 'param' || n == 'any' ) {
			var args = v.split(/\s+/);
			v = args.slice( 2, args.length );
			v = { type: args[0], name: args[1], desc: v.join(' ') };
			if ( n == 'any' ) v.any = 1;
			n = "params";
		} else if ( n == 'example' ) {
			v = { code: v };
			n = "examples";
		}

		if ( n == 'desc' || n == 'before' || n == 'after' || n == 'result' ) {
			ret.examples[ ret.examples.length - 1 ][ n ] = v;
		} else {
			if ( ret[ n ] ) {
				if ( ret[ n ].constructor == Array ) {
					ret[ n ].push( v );
				} else {
					ret[ n ] = [ ret[ n ], v ];
				}
			} else {
				ret[ n ] = v;
			}
		}
	}
  
	ret.desc = block.replace(/\s*!!!$/,"")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
			//.replace(/\n\n/g, "<br/><br/>")
			//.replace(/\n/g, " ");

	var m = /^((.|\n)*?(\.|$))/.exec( ret.desc );
	if ( m ) ret['short'] = m[1];

	if ( ret.name ) c.push( ret );
}

var json = Object.toJSON( c );

writeFile( arguments[1] + "/data/jquery-docs-json.js", json );
writeFile( arguments[1] + "/data/jquery-docs-jsonp.js", "docsLoaded(" + json + ")" );

Object.toXML.force = { desc: 1, code: 1, before: 1, result: 1 };

var xml = Object.toXML( { method: c }, "docs" );

writeFile( arguments[1] + "/data/jquery-docs-xml.xml", 
	"<?xml version='1.0' encoding='ISO-8859-1'?>\n" + xml );

writeFile( arguments[1] + "/index.xml",
	"<?xml version='1.0' encoding='ISO-8859-1'?>\n" +
	"<?xml-stylesheet type='text/xsl' href='style/docs.xsl'?>\n" + xml
);
