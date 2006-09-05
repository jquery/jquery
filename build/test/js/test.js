var queue = [];
var blocking = false;
var fixture;

function reset() {
	if(fixture) {
		$("#main").html(fixture);
	} else {
		fixture = $("#main").html();
	}
}

function synchronize(callback) {
	queue[queue.length] = callback;
	if(!blocking) {
		process();
	}
}

function process() {
	while(queue.length && !blocking) {
		var call = queue[0];
		queue = queue.slice(1);
		call();
	}
}

function runTests(files) {
	var fixture = null;
	reset();
	var startTime = new Date();
	for( var i=0; i < files.length; i++) {
		runTest( files, i );
	}
	synchronize(function() {
		var runTime = new Date() - startTime;
		$('body').append('<br/>Tests completed in ' + runTime + ' milliseconds.');
	});
}

function runTest( files, num ) {
	synchronize(function() {
		blocking = true;
		$.get(files[num],function(js){
			js = js.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
	
			try {
				eval(js);
			} catch(e) {
				if(typeof console != "undefined") 
					console.error(e);
				Test.push( [ false, "Died on test #" + (Test.length+1) + ": " + e ] );
			}
	
			var good = 0, bad = 0;
			var ol = document.createElement("ol");
	
			var li = "", state = "pass";
			for ( var i = 0; i < Test.length; i++ ) {
				var li = document.createElement("li");
				li.className = Test[i][0] ? "pass" : "fail";
				li.innerHTML = Test[i][1];
				ol.appendChild( li );
	
				if ( !Test[i][0] ) {
					state = "fail";
					bad++;
				} else good++;
			}
	
			var li = document.createElement("li");
			li.className = state;
	
			var b = document.createElement("b");
			b.innerHTML = files[num] + " <b style='color:black;'>(<b class='fail'>" + bad + "</b>, <b class='pass'>" + good + "</b>, " + Test.length + ")</b>";
			b.onclick = function(){
				var n = this.nextSibling;
				if ( jQuery.css( n, "display" ) == "none" )
					n.style.display = "block";
				else
					n.style.display = "none";
			};
			li.appendChild( b );
	
			li.appendChild( ol );
	
			document.getElementById("tests").appendChild( li );
	
			Test = [];
			reset();
			blocking = false;
			process();
		});
	});
}

var Test = [];

function ok(a, msg) {
	Test.push( [ !!a, msg ] );
}

function cmpOK( a, c, b, msg ) {
	var res;
	eval( "res = (a " + c + " b)" );
	Test.push( [ res, msg ] );
}

function isSet(a, b, msg) {
	var ret = true;

	if ( a && b && a.length == b.length ) {
		for ( var i in a )
			if ( a[i] != b[i] )
				ret = false;
	} else
		ret = false;

	if ( !ret && console )
		console.log( msg, a, b );

	Test.push( [ ret, msg ] );
}

function q() {
	var r = [];

	for ( var i = 0; i < arguments.length; i++ )
		r.push( document.getElementById( arguments[i] ) );

	return r;
}

function t(a,b,c) {
	var f = jQuery.find(b);

	var s = "";
	for ( var i = 0; i < f.length; i++ )
		s += (s && ",") + '"' + f[i].id + '"';

	isSet(f, q.apply(q,c), a + " (" + b + ")");
}

function o(a) {
	var li = document.createElement("li");
	li.innerHTML = a;
	if ( a.indexOf("#") == 0 )
		li.className = "comment";
	else if ( a.indexOf("TODO") >= 0 )
		li.className = "todo";
	else if ( a.indexOf("not ok") == 0 )
		li.classname = "fail";
	else
		li.className = "pass";
	document.getElementById("test").appendChild(li);
}

//plan({noPlan: true});
