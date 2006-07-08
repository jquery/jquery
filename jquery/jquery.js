/*
 * jQuery - New Wave Javascript
 *
 * Copyright (c) 2006 John Resig (jquery.com)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * $Date$
 * $Rev$
 */

// Global undefined variable
window.undefined = window.undefined;

/**
 * Create a new jQuery Object
 * @constructor
 */
function jQuery(a,c) {

	// Shortcut for document ready (because $(document).each() is silly)
	if ( a && a.constructor == Function )
		return $(document).ready(a);

	// Make sure t hat a selection was provided
	a = a || jQuery.context || document;

	/*
 	 * Handle support for overriding other $() functions. Way too many libraries
 	 * provide this function to simply ignore it and overwrite it.
 	 */

	// Check to see if this is a possible collision case
	if ( jQuery._$ && !c && a.constructor == String && 
      
		// Make sure that the expression is a colliding one
		!/[^a-zA-Z0-9_-]/.test(a) &&
        
		// and that there are no elements that match it
		// (this is the one truly ambiguous case)
		!document.getElementsByTagName(a).length )

			// Use the default method, in case it works some voodoo
			return jQuery._$( a );

	// Watch for when a jQuery object is passed as the selector
	if ( a.jquery )
		return a;

	// Watch for when a jQuery object is passed at the context
	if ( c && c.jquery )
		return $(c.get()).find(a);
	
	// If the context is global, return a new object
	if ( window == this )
		return new jQuery(a,c);

	// Watch for when an array is passed in
	this.get( a.constructor == Array ?
		// Assume that it's an array of DOM Elements
		a :

		// Find the matching elements and save them for later
		jQuery.Select( a, c ) );

	var fn = arguments[ arguments.length - 1 ];
	if ( fn && fn.constructor == Function )
		this.each(fn);
}

// Map over the $ in case of overwrite
if ( $ )
	jQuery._$ = $;

// Map the jQuery namespace to the '$' one
var $ = jQuery;

jQuery.fn = jQuery.prototype = {
	/**
	 * The current SVN version of jQuery.
	 *
	 * @private
	 * @property
	 * @name jquery
	 * @type String
	 */
	jquery: "$Rev$",
	
	/**
	 * The number of elements currently matched.
	 *
	 * @property
	 * @name length
	 * @type Number
	 */
	
	/**
	 * The number of elements currently matched.
	 *
	 * @name size
	 * @type Number
	 */
	size: function() {
		return this.length;
	},
	
	/**
	 * Access all matched elements. This serves as a backwards-compatible
	 * way of accessing all matched elements (other than the jQuery object
	 * itself, which is, in fact, an array of elements).
	 *
	 * @name get
	 * @type Array<Element>
	 */
	 
	/**
	 * Access a single matched element. <tt>num</tt> is used to access the 
	 * <tt>num</tt>th element matched.
	 *
	 * @name get
	 * @type Element
	 * @param Number num Access the element in the <tt>num</tt>th position.
	 */
	 
	/**
	 * Set the jQuery object to an array of elements.
	 *
	 * @private
	 * @name get
	 * @type jQuery
	 * @param Elements elems An array of elements
	 */
	get: function( num ) {
		// Watch for when an array (of elements) is passed in
		if ( num && num.constructor == Array ) {
		
			// Use a tricky hack to make the jQuery object
			// look and feel like an array
			this.length = 0;
			[].push.apply( this, num );
			
			return this;
		} else
			return num == undefined ?

				// Return a 'clean' array
				$.map( this, function(a){ return a } ) :

				// Return just the object
				this[num];
	},
	
	/**
	 * Execute a function within the context of every matched element.
	 * This means that every time the passed-in function is executed
	 * (which is once for every element matched) the 'this' keyword
	 * points to the specific element.
	 *
	 * Additionally, the function, when executed, is passed a single
	 * argument representing the position of the element in the matched
	 * set.
	 *
	 * @name each
	 * @type jQuery
	 * @param Function fn A function to execute
	 */
	each: function( fn ) {
		// Iterate through all of the matched elements
		for ( var i = 0; i < this.length; i++ )
		
			// Execute the function within the context of each element
			fn.apply( this[i], [i] );
		
		return this;
	},
	
	/**
	 * Access a property on the first matched element.
	 * This method makes it easy to retreive a property value
	 * from the first matched element.
	 *
	 * @name attr
	 * @type Object
	 * @param String name The name of the property to access.
	 */
	 
	/**
	 * Set a hash of key/value object properties to all matched elements.
	 * This serves as the best way to set a large number of properties
	 * on all matched elements.
	 *
	 * @name attr
	 * @type jQuery
	 * @param Hash prop A set of key/value pairs to set as object properties.
	 */
	 
	/**
	 * Set a single property to a value, on all matched elements.
	 *
	 * @name attr
	 * @type jQuery
	 * @param String key The name of the property to set.
	 * @param Object value The value to set the property to.
	 */
	attr: function( key, value ) {
		// Check to see if we're setting style values
		return key.constructor != String || value ?
			this.each(function(){
				// See if we're setting a hash of styles
				if ( value == undefined )
					// Set all the styles
					for ( var prop in key )
						jQuery.attr(
							type ? this.style : this,
							prop, key[prop]
						);
				
				// See if we're setting a single key/value style
				else
					jQuery.attr(
						type ? this.style : this,
						key, value
					);
			}) :
			
			// Look for the case where we're accessing a style value
			jQuery[ type || "attr" ]( this[0], key );
	},
	
	/**
	 * Access a style property on the first matched element.
	 * This method makes it easy to retreive a style property value
	 * from the first matched element.
	 *
	 * @name css
	 * @type Object
	 * @param String name The name of the property to access.
	 */
	 
	/**
	 * Set a hash of key/value style properties to all matched elements.
	 * This serves as the best way to set a large number of style properties
	 * on all matched elements.
	 *
	 * @name css
	 * @type jQuery
	 * @param Hash prop A set of key/value pairs to set as style properties.
	 */
	 
	/**
	 * Set a single style property to a value, on all matched elements.
	 *
	 * @name css
	 * @type jQuery
	 * @param String key The name of the property to set.
	 * @param Object value The value to set the property to.
	 */
	css: function( key, value ) {
		return this.attr( key, value, "css" );
	},
	
	/**
	 * Retreive the text contents of all matched elements. The result is
	 * a string that contains the combined text contents of all matched
	 * elements. This method works on both HTML and XML documents.
	 *
	 * @name text
	 * @type String
	 */
	text: function(e) {
		e = e || this;
		var t = "";
		for ( var j = 0; j < e.length; j++ ) {
			var r = e[j].childNodes;
			for ( var i = 0; i < r.length; i++ )
				t += r[i].nodeType != 1 ?
					r[i].nodeValue : jQuery.fn.text([ r[i] ]);
		}
		return t;
	},
	
	/**
	 * Set a single style property to a value, on all matched elements.
	 *
	 * @name wrap
	 * @type jQuery
	 * @any String html A string of HTML, that will be created on the fly and wrapped around the target.
	 * @any Element elem A DOM element that will be wrapped.
	 * @any Array<Element> elems An array of elements, the first of which will be wrapped.
	 * @any Object 
	 */
	wrap: function() {
		var a = jQuery.clean(arguments);
		return this.each(function(){
			var b = a[0].cloneNode(true);
			this.parentNode.insertBefore( b, this );
			while ( b.firstChild )
				b = b.firstChild;
			b.appendChild( this );
		});
	},
	
	append: function() {
		return this.domManip(arguments, true, 1, function(a){
			this.appendChild( 1 );
		});
	},
	
	prepend: function() {
		return this.domManip(arguments, true, -1, function(a){
			this.insertBefore( a, this.firstChild );
		});
	},
	
	before: function() {
		return this.domManip(arguments, false, 1, function(a){
			this.parentNode.insertBefore( a, this );
		});
	},
	
	after: function() {
		return this.domManip(arguments, false, -1, function(a){
			this.parentNode.insertBefore( a, this.nextSibling );
		});
	},
	
	/**
	 * A wrapper function for each() to be used by append and prepend.
	 * Handles cases where you're trying to modify the inner contents of
	 * a table, when you actually need to work with the tbody.
	 *
	 * @private
	 * @member jQuery
	 * @param {Function} fn The function doing the DOM manipulation.
	 * @type jQuery
	 */
	domManip: function(args, table, dir, fn){
		var clone = this.size() > 1;
		var a = jQuery.clean(args);
		
		return this.each(function(){
			var obj = this;
			
			if ( table && this.nodeName == "TABLE" ) {
				var tbody = this.getElementsByTagName("tbody");

				if ( !tbody.length ) {
					obj = document.createElement("tbody");
					this.appendChild( obj );
				} else
					obj = tbody[0];
			}
	
			for ( var i = ( dir < 0 ? a.length - 1 : 0 );
				i != ( dir < 0 ? dir : a.length ); i += dir )
					fn.apply( obj, [ a[i] ] );
		});
	},
	
	pushStack: function(a,args) {
		var fn = args && args[args.length-1];

		if ( !fn || fn.constructor != Function ) {
			if ( !this.stack ) this.stack = [];
			this.stack.push( this.get() );
			this.get( a );
		} else {
			var old = this.get();
			this.get( a );
			if ( fn.constructor == Function )
				return this.each( fn );
			this.get( old );
		}

		return this;
	},

	end: function() {
		this.get( this.stack.pop() );
		return this;
	},
	
	find: function(t) {
		return this.pushStack( jQuery.map( this, function(a){
			return jQuery.Select(t,a);
		}), arguments );
	},
	
	filter: function(t) {
		return t.constructor == Array ?
			// Multi Filtering
			this.pushStack( jQuery.map(this,function(a){
				for ( var i = 0; i < t.length; i++ )
					if ( jQuery.filter(t[i],[a]).r.length )
						return a;
			}), arguments ) :
			
			this.pushStack( jQuery.filter(t,this).r, arguments );
	},
	not: function(t) {
		return this.pushStack( t.constructor == String ?
			jQuery.filter(t,this,false).r :
			jQuery.grep(this,function(a){ return a != t; }), arguments );
	},
	add: function(t) {
		return this.pushStack( jQuery.merge( this, t.constructor == String ?
			jQuery.Select(t) : t.constructor == Array ? t : [t] ), arguments );
	},
	
	/**
	 * A wrapper function for each() to be used by append and prepend.
	 * Handles cases where you're trying to modify the inner contents of
	 * a table, when you actually need to work with the tbody.
	 *
	 * @member jQuery
	 * @param {String} expr The expression with which to filter
	 * @type Boolean
	 */
	is: function(expr) {
		return jQuery.filter(expr,this).r.length > 0;
	}
};

(function(){
	var b = navigator.userAgent.toLowerCase();

	// Figure out what browser is being used
	jQuery.browser =
		( /webkit/.test(b) && "safari" ) ||
		( /opera/.test(b) && "opera" ) ||
		( /msie/.test(b) && "msie" ) ||
		( !/compatible/.test(b) && "mozilla" ) ||
		"other";

	// Check to see if the W3C box model is being used
	jQuery.boxModel = ( jQuery.browser != "msie" || document.compatMode == "CSS1Compat" );

	var axis = {
		parent: "a.parentNode",
		parents: jQuery.parents,
		ancestors: jQuery.parents,
		next: "a.nextSibling",
		prev: "a.previousSibling",
		siblings: jQuery.sibling
	};
	
	for ( var i in axis ) {(function(){
		var t = axis[i];
		jQuery.fn[ i ] = function(a) {
			var ret = jQuery.map(this,t);
			if ( a ) ret = jQuery.filter(a,ret).r;
			return this.pushStack( ret, arguments );
		};
	})();}
	
	var to = "html,append,prepend,before,after".split(',');
	
	for ( var i = 0; i < to.length; i++ ) {(function(){
		var n = to[i];
		jQuery.fn[ n + "To" ] = function(){
			var a = arguments;
			return this.each(function(){
				for ( var i = 0; i < a.length; i++ )
					$(a[i])[n]( this );
			});
		};
	})();}
	
	var each = {
		show: function(){
			this.style.display = this.oldblock ? this.oldblock : "";
			if ( jQuery.css(this,"display") == "none" )
				this.style.display = "block";
		},
		
		hide: function(){
			this.oldblock = jQuery.css(this,"display");
			if ( this.oldblock == "none" )
				this.oldblock = "block";
			this.style.display = "none";
		},
		
		toggle: function(){
			var d = jQuery.css(this,"display");
			$(this)[ !d || d == "none" ? 'show' : 'hide' ]();
		},
		
		addClass: function(c){
			jQuery.className.add(this,c);
		},
		
		removeClass: function(c){
			jQuery.className.remove(this,c);
		},
	
		toggleClass: function( c ){
			jQuery.className[ jQuery.hasWord(this,a) ? 'remove' : 'add' ](this,c);
		},
		
		remove: function(){
			this.parentNode.removeChild( this );
		},
	
		empty: function(){
			while ( this.firstChild )
				this.removeChild( this.firstChild );
		},
		
		bind: function( type, fn ) {
			jQuery.event.add( this, type, fn );
		},
		
		unbind: function( type, fn ) {
			jQuery.event.remove( this, type, fn );
		},
		
		trigger: function( type ) {
			jQuery.event.trigger( this, type );
		},
	};
	
	for ( var i in each ) {(function(){
		var n = each[i];
		jQuery.fn[ i ] = function(a,b) {
			var a = arguments;
			return this.each(function(){
				n.apply( this, a );
			});
		};
	})();}
	
	var attr = {
		val: 'value',
		html: 'innerHTML'
	};
	
	for ( var i in attr ) {(function(){
		var n = attr[i];
		jQuery.fn[ i ] = function(h) {
			return h == undefined && this.length ?
				this[0][n] : this.set( n, h );
		};
	})();}

})();

jQuery.className = {
	add: function(o,c){
		if (jQuery.hasWord(o,c)) return;
		o.className += ( o.className ? " " : "" ) + c;
	},
	remove: function(o,c){
		o.className = !c ? "" :
			o.className.replace(
				new RegExp("(^|\\s*\\b[^-])"+c+"($|\\b(?=[^-]))", "g"), "");
	}
};

$.swap = function(e,o,f) {
	for ( var i in o ) {
		e.style["old"+i] = e.style[i];
		e.style[i] = o[i];
	}
	f.apply( e, [] );
	for ( var i in o )
		e.style[i] = e.style["old"+i];
};

jQuery.css = function(e,p) {
	// Adapted from Prototype 1.4.0
	if ( p == "height" || p == "width" ) {
		var old = {}, oHeight, oWidth, d = ["Top","Bottom","Right","Left"];

		for ( var i in d ) {
			old["padding" + d[i]] = 0;
			old["border" + d[i] + "Width"] = 0;
		}

		$.swap( e, old, function() {
			if (jQuery.css(e,"display") != 'none') {
				oHeight = e.offsetHeight;
				oWidth = e.offsetWidth;
			} else
				$.swap( e, { visibility: 'hidden', position: 'absolute', display: '' },
					function(){
						oHeight = e.clientHeight;
						oWidth = e.clientWidth;
					});
		});

		return p == "height" ? oHeight : oWidth;
	}
	
	var r;

	if (e.style[p])
		r = e.style[p];
 	else if (e.currentStyle)
		r = e.currentStyle[p];
	else if (document.defaultView && document.defaultView.getComputedStyle) {
		p = p.replace(/([A-Z])/g,"-$1").toLowerCase();
		var s = document.defaultView.getComputedStyle(e,"");
		r = s ? s.getPropertyValue(p) : null;
 	}
	
	return r;
};

jQuery.clean = function(a) {
	var r = [];
	for ( var i = 0; i < a.length; i++ ) {
		if ( a[i].constructor == String ) {

			if ( !a[i].indexOf("<tr") ) {
				var tr = true;
				a[i] = "<table>" + a[i] + "</table>";
			} else if ( !a[i].indexOf("<td") || !a[i].indexOf("<th") ) {
				var td = true;
				a[i] = "<table><tbody><tr>" + a[i] + "</tr></tbody></table>";
			}

			var div = document.createElement("div");
			div.innerHTML = a[i];

			if ( tr || td ) {
				div = div.firstChild.firstChild;
				if ( td ) div = div.firstChild;
			}

			for ( var j = 0; j < div.childNodes.length; j++ )
				r[r.length] = div.childNodes[j];
		} else if ( a[i].length && !a[i].nodeType )
			for ( var k = 0; k < a[i].length; k++ )
				r[r.length] = a[i][k];
		else if ( a[i] !== null )
			r[r.length] =
				a[i].nodeType ? a[i] : document.createTextNode(a[i].toString());
	}
	return r;
};

jQuery.g = {
	"": "m[2]== '*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
	"#": "a.getAttribute('id')&&a.getAttribute('id')==m[2]",
	":": {
		lt: "i<m[3]-0",
		gt: "i>m[3]-0",
		nth: "m[3]-0==i",
		eq: "m[3]-0==i",
		first: "i==0",
		last: "i==r.length-1",
		even: "i%2==0",
		odd: "i%2==1",
		"first-child": "jQuery.sibling(a,0).cur",
		"nth-child": "(m[3]=='even'?jQuery.sibling(a,m[3]).n%2==0:(m[3]=='odd'?jQuery.sibling(a,m[3]).n%2==1:jQuery.sibling(a,m[3]).cur))",
		"last-child": "jQuery.sibling(a,0,true).cur",
		"nth-last-child": "jQuery.sibling(a,m[3],true).cur",
		"first-of-type": "jQuery.ofType(a,0)",
		"nth-of-type": "jQuery.ofType(a,m[3])",
		"last-of-type": "jQuery.ofType(a,0,true)",
		"nth-last-of-type": "jQuery.ofType(a,m[3],true)",
		"only-of-type": "jQuery.ofType(a)==1",
		"only-child": "jQuery.sibling(a).length==1",
		parent: "a.childNodes.length",
		empty: "!a.childNodes.length",
		root: "a==(a.ownerDocument||document).documentElement",
		contains: "(a.innerText||a.innerHTML).indexOf(m[3])!=-1",
		visible: "(!a.type||a.type!='hidden')&&(jQuery.css(a,'display')!='none'&&jQuery.css(a,'visibility')!= 'hidden')",
		hidden: "(a.type&&a.type=='hidden')||jQuery.css(a,'display')=='none'||jQuery.css(a,'visibility')== 'hidden'",
		enabled: "!a.disabled",
		disabled: "a.disabled",
		checked: "a.checked"
	},
	".": "jQuery.hasWord(a,m[2])",
	"@": {
		"=": "jQuery.attr(a,m[3])==m[4]",
		"!=": "jQuery.attr(a,m[3])!=m[4]",
		"~=": "jQuery.hasWord(jQuery.attr(a,m[3]),m[4])",
		"|=": "!jQuery.attr(a,m[3]).indexOf(m[4])",
		"^=": "!jQuery.attr(a,m[3]).indexOf(m[4])",
		"$=": "jQuery.attr(a,m[3]).substr( jQuery.attr(a,m[3]).length - m[4].length,m[4].length )==m[4]",
		"*=": "jQuery.attr(a,m[3]).indexOf(m[4])>=0",
		"": "m[3]=='*'?a.attributes.length>0:jQuery.attr(a,m[3])"
	},
	"[": "jQuery.Select(m[2],a).length"
};

jQuery.token = [
	"\\.\\.|/\\.\\.", "a.parentNode",
	">|/", "jQuery.sibling(a.firstChild)",
	"\\+", "jQuery.sibling(a).next",
	"~", function(a){
		var r = [];
		var s = jQuery.sibling(a);
		if ( s.n > 0 )
			for ( var i = s.n; i < s.length; i++ )
				r[r.length] = s[i];
		return r;
	}
];

jQuery.Select = function( t, context ) {
	// Make sure that the context is a DOM Element
	if ( context && context.getElementsByTagName == undefined )
		context = null;

	// Set the correct context (if none is provided)
	context = context || jQuery.context || document;

	if ( t.constructor != String ) return [t];

	if ( !t.indexOf("//") ) {
		context = context.documentElement;
		t = t.substr(2,t.length);
	} else if ( !t.indexOf("/") ) {
		context = context.documentElement;
		t = t.substr(1,t.length);
		// FIX Assume the root element is right :(
		if ( t.indexOf("/") >= 1 )
			t = t.substr(t.indexOf("/"),t.length);
	}

	var ret = [context];
	var done = [];
	var last = null;

	while ( t.length > 0 && last != t ) {
		var r = [];
		last = t;

		t = jQuery.cleanSpaces(t).replace( /^\/\//i, "" );
		
		var foundToken = false;
		
		for ( var i = 0; i < jQuery.token.length; i += 2 ) {
			var re = new RegExp("^(" + jQuery.token[i] + ")");
			var m = re.exec(t);
			
			if ( m ) {
				r = ret = jQuery.map( ret, jQuery.token[i+1] );
				t = jQuery.cleanSpaces( t.replace( re, "" ) );
				foundToken = true;
			}
		}
		
		if ( !foundToken ) {

			if ( !t.indexOf(",") || !t.indexOf("|") ) {
				if ( ret[0] == context ) ret.shift();
				done = jQuery.merge( done, ret );
				r = ret = [context];
				t = " " + t.substr(1,t.length);
			} else {
				var re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
				var m = re2.exec(t);
	
				if ( m[1] == "#" ) {
					// Ummm, should make this work in all XML docs
					var oid = document.getElementById(m[2]);
					r = ret = oid ? [oid] : [];
					t = t.replace( re2, "" );
				} else {
					if ( !m[2] || m[1] == "." ) m[2] = "*";
	
					for ( var i = 0; i < ret.length; i++ )
						r = jQuery.merge( r,
							m[2] == "*" ?
								jQuery.getAll(ret[i]) :
								ret[i].getElementsByTagName(m[2])
						);
				}
			}
			
		}

		if ( t ) {
			var val = jQuery.filter(t,r);
			ret = r = val.r;
			t = jQuery.cleanSpaces(val.t);
		}
	}

	if ( ret && ret[0] == context ) ret.shift();
	done = jQuery.merge( done, ret );

	return done;
};

jQuery.getAll = function(o,r) {
	r = r || [];
	var s = o.childNodes;
	for ( var i = 0; i < s.length; i++ )
		if ( s[i].nodeType == 1 ) {
			r[r.length] = s[i];
			jQuery.getAll( s[i], r );
		}
	return r;
};

jQuery.attr = function(o,a,v){
	if ( a && a.constructor == String ) {
		var fix = {
			"for": "htmlFor",
			"class": "className",
			"float": "cssFloat"
		};
		a = (fix[a] && fix[a].replace && fix[a]) || a;
		var r = /-([a-z])/ig;
		a = a.replace(r,function(z,b){return b.toUpperCase();});
		if ( v != undefined ) {
			o[a] = v;
			if ( o.setAttribute && a != "disabled" )
				o.setAttribute(a,v);
		}
		return o[a] || o.getAttribute(a) || "";
	} else
		return "";
};

jQuery.filter = function(t,r,not) {
	var g = jQuery.grep;
	if ( not === false )
		g = function(a,f) {return jQuery.grep(a,f,true);};

	while ( t && t.match(/^[:\\.#\\[a-zA-Z\\*]/) ) {
		var re = /^\[ *@([a-z*_-][a-z0-9()_-]*) *([~!|*$^=]*) *'?"?([^'"]*)'?"? *\]/i;
		var m = re.exec(t);

		if ( m )
			m = ["", "@", m[2], m[1], m[3]];
		else {
			re = /^(\[) *([^\]]*) *\]/i;
			m = re.exec(t);

			if ( !m ) {
				re = /^(:)([a-z0-9*_-]*)\( *["']?([^ \)'"]*)['"]? *\)/i;
				m = re.exec(t);

				if ( !m ) {
					re = /^([:\.#]*)([a-z0-9*_-]*)/i;
					m = re.exec(t);
				}
			}
		}
		t = t.replace( re, "" );

		if ( m[1] == ":" && m[2] == "not" )
			r = jQuery.filter(m[3],r,false).r;
		else {
			var f = null;

			if ( jQuery.g[m[1]].constructor == String )
				f = jQuery.g[m[1]];
			else if ( jQuery.g[m[1]][m[2]] )
				f = jQuery.g[m[1]][m[2]];

			if ( f ) {
				eval("f = function(a,i){return " + f + "}");
				r = g( r, f );
			}
		}
	}

	return { r: r, t: t };
};

jQuery.parents = function(a){
	var b = [];
	var c = a.parentNode;
	while ( c && c != document ) {
		b[b.length] = c;
		c = c.parentNode;
	}
	return b;
};

jQuery.cleanSpaces = function(t){
	return t.replace(/^\s+|\s+$/g, "");
};

jQuery.ofType = function(a,n,e) {
	var t = jQuery.grep(jQuery.sibling(a),function(b){ return b.nodeName == a.nodeName; });
	if ( e ) n = t.length - n - 1;
	return n != undefined ? t[n] == a : t.length;
};

jQuery.sibling = function(a,n,e) {
	var type = [];
	var tmp = a.parentNode.childNodes;
	for ( var i = 0; i < tmp.length; i++ ) {
		if ( tmp[i].nodeType == 1 )
			type[type.length] = tmp[i];
		if ( tmp[i] == a )
			type.n = type.length - 1;
	}
	if ( e ) n = type.length - n - 1;
	type.cur = type[n] == a;
	type.next = type[type.n + 1];
	return type;
};

jQuery.hasWord = function(e,a) {
	if ( e.className )
		e = e.className;
	return new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
};

jQuery.merge = function(a,b) {
	var d = [];
	for ( var k = 0; k < b.length; k++ ) d[k] = b[k];

	for ( var i = 0; i < a.length; i++ ) {
		var c = true;
		for ( var j = 0; j < b.length; j++ )
			if ( a[i] == b[j] )
				c = false;
		if ( c ) d[d.length] = a[i];
	}

	return d;
};

jQuery.grep = function(a,f,s) {
	if ( f.constructor == String )
		f = new Function("a","i","return " + f);
	var r = [];
	if ( a )
		for ( var i = 0; i < a.length; i++ )
			if ( (!s && f(a[i],i)) || (s && !f(a[i],i)) )
				r[r.length] = a[i];
	return r;
};

jQuery.map = function(a,f) {
	if ( f.constructor == String )
		f = new Function("a","return " + f);
	
	var r = [];
	for ( var i = 0; i < a.length; i++ ) {
		var t = f(a[i],i);
		if ( t !== null && t != undefined ) {
			if ( t.constructor != Array ) t = [t];
			r = jQuery.merge( t, r );
		}
	}
	return r;
};

jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function(element, type, handler) {
		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.browser == "msie" && element.setInterval != undefined )
			element = window;
	
		if (!handler.guid) handler.guid = jQuery.event.guid++;
		if (!element.events) element.events = {};
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			if (element["on" + type])
				handlers[0] = element["on" + type];
		}
		handlers[handler.guid] = handler;
		element["on" + type] = this.handle;

		if (!this.global[type])
			this.global[type] = [];
		this.global[type].push( element );
	},
	
	guid: 1,
	global: {},
	
	// Detach an event or set of events from an element
	remove: function(element, type, handler) {
		if (element.events)
			if (type && element.events[type])
				if ( handler )
					delete element.events[type][handler.guid];
				else
					for ( var i in element.events[type] )
						delete element.events[type][i];
			else
				for ( var j in element.events )
					this.remove( element, j );
	},
	
	trigger: function(type,data,element) {
		// Touch up the incoming data
		data = data || [];

		// Handle a global trigger
		if ( !element ) {
			var g = this.global[type];
			if ( g )
				for ( var i = 0; i < g.length; i++ )
					this.trigger( type, data, g[i] );

		// Handle triggering a single element
		} else if ( element["on" + type] ) {
			// Pass along a fake event
			data.unshift( this.fix({ type: type, target: element }) );

			// Trigger the event
			element["on" + type].apply( element, data );
		}
	},
	
	handle: function(event) {
		// Handle adding events to items in IFrames, in IE
		event = event ||
			jQuery.event.fix( ((this.ownerDocument || this.document || 
				this).parentWindow || window).event );

		// If no correct event was found, fail
		if ( !event ) return;
	
		var returnValue = true, handlers = [];
	
		for ( var j in this.events[event.type] )
			handlers[handlers.length] = this.events[event.type][j];
	
		for ( var i = 0; i < handlers.length; i++ )
			if ( handlers[i].constructor == Function ) {
				this.handleEvent = handlers[i];
				if (this.handleEvent(event) === false) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}
		return returnValue;
	},
	
	fix: function(event) {
		if ( event ) {
			event.preventDefault = function() {
				this.returnValue = false;
			};
		
			event.stopPropagation = function() {
				this.cancelBubble = true;
			};
		}
		
		return event;
	}

};