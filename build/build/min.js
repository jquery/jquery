load("build/js/jsmin.js", "build/js/writeFile.js");

// arguments
var inFile = arguments[0];
var outFile = arguments[1] || inFile.replace(/\.js$/, ".min.js");

var script = readFile(inFile);
var header = script.match(/\/\*(.|\n)*?\*\//)[0];
var minifiedScript = jsmin('', script, 3);

writeFile( outFile, header + minifiedScript );
