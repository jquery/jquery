// Work in Progress Sort Functions
//

$.fn.sort = function(f) {
	cur = cur.sort(function(a,b){
		if ( typeof f == 'object' )
			var ret = f(a,b);
		else
			var ret = $.fn.genericSort(a,b,f);

		if ( a < b )
			b.parentNode.insertBefore( a, b );
		else if ( a > b )
			a.parentNode.insertBefore( b, a );
		return ret;
	});
	return this;
}

$.fn.reverse = function() {
	cur[0].parentNode.appendChild( cur[0] );
	for ( var i = 1; cur && i < cur.length; i++ )
		cur[i-1].parentNode.insertBefore( cur[i], cur[i-1] );
	cur = cur.reverse();
	return this;
}

$.fn.genericSort = function(a,b,c) {
	if ( typeof a == "string" || typeof b == "string" ) {
	} else if ( c != null ) {
		a = sibling(a.firstChild)[c].innerText;
		b = sibling(b.firstChild)[c].innerText;
	} else {
		a = a.innerText;
		b = b.innerText;
	}
	
	// Case insensitive
	a = a.toLowerCase();
	b = b.toLowerCase();
	
	// Figure out if it's an American-style date
	var re = new RegExp( "^(\d{2}).(\d{2}).(\d{2,4})$" );
	var ma = re.exec(a);
	var mb = re.exec(b);
	
	if ( ma.length && mb.length ) {
		a = ma.reverse().join('');
		b = mb.reverse().join('');
	}
	
	// If it contains a number, sort on that only
	if ( a.match(/\d/) ) {
		var re = new RegExp("[^0-9.-]","ig");
		a = parseFloat( a.replace( re, "" ) );
		b = parseFloat( b.replace( re, "" ) );
	}
	
	return ( a < b ? -1 : ( a > b ? 1 : 0 ) );
}
