load("build/js/writeFile.js");

var file = arguments[0];
writeFile(file, readFile(file).replace(new RegExp("@VERSION", "g"), readFile("version.txt").replace( /^\s+|\s+$/g, "" )));
