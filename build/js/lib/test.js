function q() {
	var r = new Array();
	for ( var i = 0; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[i] ) );
	}
	return r;
}

function t(a,b,c) {
	var f = jQuery.find(b);
	var s = "";
	for ( var i = 0; i < f.length; i++ )
		s += (s?",":"") + '"' + f[i].id + '"';
	isSet(f,q.apply(q,c),a + " (" + b + ")") ||
		diag( s );
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

plan({noPlan: true});
