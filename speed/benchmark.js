// Runs a function many times without the function call overhead
function benchmark(fn, times, name){
	fn = fn.toString();
	var s = fn.indexOf('{')+1,
		e = fn.lastIndexOf('}');
	fn = fn.substring(s,e);
	
	return benchmarkString(fn, times, name);
}

function benchmarkString(fn, times, name) {
	var fn = new Function("i", "var t=new Date; while(i--) {" + fn + "}; return new Date - t")(times)
	fn.displayName = name || "benchmarked";
	return fn;
}
