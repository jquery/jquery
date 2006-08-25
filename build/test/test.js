load( "build/js/writeFile.js", "build/js/parse.js" );

var dir = arguments[1];

var indexFile = readFile( "build/test/index.html" );
var testFile = readFile( "build/test/test.html" );

var jq = parse( readFile( arguments[0] ) );

var fileList = [];
var count = 1;

for ( var i = 0; i < jq.length; i++ ) {
	if ( jq[i].tests.length > 0 ) {
		var name = count + "-" + jq[i].name;
		
		var myFile = testFile
			.replace( /{TITLE}/g, jq[i].name )
			.replace( /{NUM}/g, jq[i].tests.length )
			.replace( /{TESTS}/g, jq[i].tests.join("\n") );

		var fileName = "tests/" + name + ".js";

		writeFile( dir + "/" + fileName, jq[i].tests.join("\n") );

		fileList.push( fileName );

		count++;
	}
}

var fileString = "";
for ( var i = 0; i < fileList.length; i++ ) {
	if ( fileString ) fileString += ", ";
	fileString += "'" + fileList[i] + "'";
}

writeFile( dir + "/index.html", indexFile.replace( /{FILES}/g, fileString ) );
