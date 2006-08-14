load( "build/js/writeFile.js", "build/js/parse.js" );

var dir = arguments[1];

var indexFile = readFile( "build/test/index.html" );
var testFile = readFile( "build/test/test.html" );
var files = {};

var jq = parse( readFile( arguments[0] ) );

for ( var i = 0; i < jq.length; i++ ) {
	if ( jq[i].tests.length > 0 ) {

		var count = 1;
		while ( files[ jq[i].name + count ] ) { count++; }
		var name = jq[i].name + count;
		
		var myFile = testFile
			.replace( /{TITLE}/g, jq[i].name )
			.replace( /{NUM}/g, jq[i].tests.length )
			.replace( /{TESTS}/g, jq[i].tests.join("\n") );

		var fileName = "tests/" + name + ".js";

		//writeFile( dir + "/" + fileName, myFile );
		writeFile( dir + "/" + fileName, jq[i].tests.join("\n") );

		files[ fileName ] = 1;
	}
}

var fileString = "";
for ( var i in files ) {
	if ( fileString ) fileString += ", ";
	fileString += "'" + i + "'";
}

writeFile( dir + "/index.html", indexFile.replace( /{FILES}/g, fileString ) );
