load("build/js/json.js", "build/js/xml.js", "build/js/writeFile.js", "build/js/parse.js");

var dir = arguments[1];

var c = parse( read(arguments[0]) );
output( c, "docs" );

c = categorize( c );
output( c, "cat" );

function output( c, n ) {
	var json = Object.toJSON( c );

	writeFile( dir + "/data/jquery-" + n + "-json.js", json );
	writeFile( dir + "/data/jquery-" + n + "-jsonp.js", "docsLoaded(" + json + ")" );

	Object.toXML.force = { desc: 1, code: 1, before: 1, result: 1 };
	
	var xml = Object.toXML( n == "docs" ? { method: c } : c, "docs" );

	xml = xml.replace("<docs>", "<docs version='" + read("version.txt").slice(0,-1) + "'>");

	writeFile( dir + "/data/jquery-" + n + "-xml.xml", 
		"<?xml version='1.0' encoding='ISO-8859-1'?>\n" + xml );

	writeFile( dir + "/" + ( n == "docs" ? "index" : n ) + ".xml",
		"<?xml version='1.0' encoding='ISO-8859-1'?>\n" +
		"<?xml-stylesheet type='text/xsl' href='style/" + n + ".xsl'?>\n" + xml
	);
}
