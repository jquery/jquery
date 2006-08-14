load("build/js/json.js", "build/js/xml.js", "build/js/writeFile.js", "build/js/parse.js");

var c = parse( readFile(arguments[0]) );
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
