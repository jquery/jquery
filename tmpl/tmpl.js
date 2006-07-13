// test commit

$.fn.get = function(i) {
	return i == null ?
		this.$$unclean ? $.sibling(this.$$unclean[0]) : this.cur :
			(this.get())[i];
};

$.fn._get = function(i) {
	return i == null ? this.cur : this.cur[i];
};

$.fn.set = function(a,b) {
	return this.each(function(){
		if ( b == null )
			for ( var j in a )
				this[$.attr(j)] = a[j];
		else {
			if ( b.constructor != String ) { // TODO: Fix this
				for ( var i in b ) {	
					var c = $.Select(i,this);
					for ( var j in c )
						c[j][$.attr(a)] = b[i];
				}
			} else
				this[$.attr(a)] = b;
		}
	});
};

function $C(a) {
  if ( a.indexOf('<') >= 0 ) {
    if ( a.indexOf('<tr') >= 0 ) {
      var r = $C("table").html("<tbody>"+a+"</tbody>");
      r.$$unclean = r.get(0).childNodes[0].childNodes;
    } else {
      var r = $C("div").html(a);
      r.$$unclean = r.get(0).childNodes;
    }
    return r;
  } else {
    return $(document.createElement(a),document);
  }
};

$.fn.appendTo = function() {
	var self = this;
	var a = arguments;
	return this.each(function(){
		for ( var i = 0; i < a.length; i++ ) {
			if ( self.$$unclean )
				$(a[i]).append( self.get() );
			else
				$(a[i]).append( this );
		}
	});
};

$.clean = function(a) {
	var r = [];
	for ( var i = 0; i < a.length; i++ ) {
		if ( a[i].constructor == String ) {
			// Cool, but has scary side-effects
			//a[i] = a[i].replace( /#([a-zA-Z0-9_-]+)/g, " id='$1' " );
			//a[i] = a[i].replace( /\.([a-zA-Z0-9_-]+)/g, " class='$1' " );
			var div = document.createElement("div");
			div.innerHTML = a[i];
			for ( var j = 0; j < div.childNodes.length; j++ )
				r[r.length] = div.childNodes[j];
		} else if ( a[i].length ) {
			for ( var j = 0; j < a[i].length; j++ )
				r[r.length] = a[i][j];
		} else {
			r[r.length] = a[i];
		}
	}
	return r;
};

// Frequently-used Accessors
window.cssQuery = $.Select;
document.getElementsByClass = function(a){return $.Select("."+a)};
document.getElementsBySelector = $.Select;

	
	// Make Xpath Axes Sane
	//var re = new RegExp( "/?descendant::", "i" );
	//t = t.replace( re, " " );
	//var re = new RegExp( "/?child::", "i" );
	//t = t.replace( re, "/" );
	// If only...
	//var re = new RegExp( "/?following-sibling::", "i" );
	//t = t.replace( re, " + " );
	//var re = new RegExp( "/?preceding-sibling::", "i" );
	//t = t.replace( re, " ~ " );
	//var re = new RegExp( "/?self::", "i" );
	//t = t.replace( re, "" );
	//var re = new RegExp( "/?parent::", "i" );
	//t = t.replace( re, " .. " );
	
	// following
	// preceding
	// ancestor
	// ancestor-or-self
	// descendant-or-self

// Deprecated
//style: function(a,b){ return this.css(a,b); },
