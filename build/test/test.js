load( "build/js/writeFile.js", "build/js/parse.js" );

function addParams(name, params) {
	if(params.length > 0) {
		name += "(";
		for ( var i = 0; i < params.length; i++) {
			name += params[i].type + ", ";
		}
		return name.substring(0, name.length - 2) + ")";
	} else {
		return name + "()";
	}
}
function addTestWrapper(name, test) {
	return 'test("' + name + '", function() {\n' + test + '\n});';
}

var dir = arguments[1];
var jq = parse( readFile( arguments[0] ) );

var testFile = [];

String.prototype.decode = function() {
	return this.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
};

for ( var i = 0; i < jq.length; i++ ) {
	if ( jq[i].tests.length > 0 ) {
		var method = jq[i];
		var name = addParams(method.name, method.params);
		testFile[testFile.length] = addTestWrapper(name, method.tests.join("\n").decode());
	}
}

var indexFile = readFile( "build/test/index.html" );
writeFile( dir + "/index.html", indexFile.replace( /{TESTS}/g, testFile.join("\n") ) );
