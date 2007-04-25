load("build/js/writeFile.js");
load("build/js/base2.js");
load("build/js/Packer.js");
load("build/js/Words.js");

// arguments
var inFile = arguments[0];
var outFile = arguments[1] || inFile.replace(/\.js$/, "-p.js");

// options
var base62 = true;
var shrink = true;

var script = readFile(inFile);
var packer = new Packer;
var packedScript = packer.pack(script, base62, shrink);

writeFile(outFile, packedScript);
