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

// Map over the $ in case of overwrite
if ( $ ) var ._$ = $;

/**
 * Create a new jQuery Object
 * @constructor
 */
var $ = jQuery = function(a,c) {
	/*
 	* Handle support for overriding other $() functions. Way too many libraries
 	* provide this function to simply ignore it and overwrite it.
 	*/

	// Check to see if this is a possible collision case
	if ( _$ && !c && ( a.constructor == String && 
      
		// Make sure that the expression is a colliding one
		!/[^a-zA-Z0-9_-]/.test(a) &&
        
		// and that there are no elements that match it
		// (this is the one truly ambiguous case)
		!document.getElementsByTagName(a).length ) ||

		// Watch for an array being passed in (Prototype 1.5)
		a.constructor == Array )

			// Use the default method, in case it works some voodoo
			return _$( a );

	// Watch for when a jQuery object is passed in as an arg
	if ( a && a.jquery )
		return a;
	
	// If the context is global, return a new object
	if ( window == this )
		return new jQuery(a,c);
	
	// Find the matching elements and save them for later
	this.cur = jQuery.Select(
		a || jQuery.context || document,
		c && c.jquery && c.get(0) || c
	);
}

jQuery.fn = jQuery.prototype = {
	/**
	 * The current SVN version of jQuery.
	 *
	 * @private
	 * @type String
	 */
	jquery: "$Rev$",
	
	/**
	 * The number of elements currently matched.
	 *
	 * @type Number
	 */
	size: function() {
		return this.get().length;
	},
	
	/**
	 * Access the elements matched. If a number is provided,
	 * the Nth element is returned, otherwise, an array of all
	 * matched items is returned.
	 *
	 * @type Array,DOMElement
	 */
	get: function(num) {
		return num == undefined ? this.cur : this.cur[num];
	},
	
	each: function(f) {
		for ( var i = 0; i < this.size(); i++ )
			f.apply( this.get(i), [i] );
		return this;
	},
	set: function(a,b) {
		return this.each(function(){
			if ( b === undefined )
				for ( var j in a )
					jQuery.attr(this,j,a[j]);
			else
				jQuery.attr(this,a,b);
		});
	},
	html: function(h) {
		return h == undefined && this.size() ?
			this.get(0).innerHTML : this.set( "innerHTML", h );
	},
	val: function(h) {
		return h == undefined && this.size() ?
			this.get(0).value : this.set( "value", h );
	},
	text: function(e) {
		e = e || this.get();
		var t = "";
		for ( var j = 0; j < e.length; j++ )
			for ( var i = 0; i < e[j].childNodes.length; i++ )
				t += e[j].childNodes[i].nodeType != 1 ?
					e[j].childNodes[i].nodeValue :
					jQuery.fn.text(e[j].childNodes[i].childNodes);
		return t;
	},
	
	css: function(a,b) {
		return a.constructor != String || b ?
			this.each(function(){
				if ( b === undefined )
					for ( var j in a )
						jQuery.attr(this.style,j,a[j]);
				else
					jQuery.attr(this.style,a,b);
			}) : jQuery.css( this.get(0), a );
	},
	toggle: function() {
		return this.each(function(){
			var d = jQuery.css(this,"display");
			if ( !d || d == "none" )
				$(this).show();
			else
				$(this).hide();
		});
	},
	show: function() {
		return this.each(function(){
			this.style.display = this.oldblock ? this.oldblock : "";
			if ( jQuery.css(this,"display") == "none" )
				this.style.display = "block";
		});
	},
	hide: function() {
		return this.each(function(){
			this.oldblock = jQuery.css(this,"display");
			if ( this.oldblock == "none" )
				this.oldblock = "block";
			this.style.display = "none";
		});
	},
	addClass: function(c) {
		return this.each(function(){
			jQuery.className.add(this,c);
		});
	},
	removeClass: function(c) {
		return this.each(function(){
			jQuery.className.remove(this,c);
		});
	},

	toggleClass: function(c) {
		return this.each(function(){
			if (jQuery.hasWord(this,c))
				jQuery.className.remove(this,c);
			else
				jQuery.className.add(this,c);
		});
	},
	remove: function() {
		this.each(function(){this.parentNode.removeChild( this );});
		return this.pushStack( [] );
	},
	
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
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.domManip(function(){
			for ( var i = 0; i < a.length; i++ )
				this.appendChild( clone ? a[i].cloneNode(true) : a[i] );
		});
	},
	
	appendTo: function() {
		var a = arguments;
		return this.each(function(){
			for ( var i = 0; i < a.length; i++ )
				$(a[i]).append( this );
		});
	},
	
	prepend: function() {
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.domManip(function(){
			for ( var i = a.length - 1; i >= 0; i-- )
				this.insertBefore( clone ? a[i].cloneNode(true) : a[i], this.firstChild );
		});
	},
	
	before: function() {
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.each(function(){
			for ( var i = 0; i < a.length; i++ )
				this.parentNode.insertBefore( clone ? a[i].cloneNode(true) : a[i], this );
		});
	},
	
	after: function() {
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.each(function(){
			for ( var i = a.length - 1; i >= 0; i-- )
				this.parentNode.insertBefore( clone ? a[i].cloneNode(true) : a[i], this.nextSibling );
		});
	},
	
	empty: function() {
		return this.each(function(){
			while ( this.firstChild )
				this.removeChild( this.firstChild );
		});
	},
	
	bind: function(t,f) {
		return this.each(function(){jQuery.event.add(this,t,f);});
	},
	unbind: function(t,f) {
		return this.each(function(){jQuery.event.remove(this,t,f);});
	},
	trigger: function(t) {
		return this.each(function(){jQuery.event.trigger(this,t);});
	},
	
	pushStack: function(a) {
		if ( !this.stack ) this.stack = [];
		this.stack.unshift( this.cur );
		if ( a ) this.cur = a;
		return this;
	},
	
	find: function(t) {
		var ret = [];
		this.each(function(){
			ret = jQuery.merge( ret, jQuery.Select(t,this) );
		});
		this.pushStack( ret );
		return this;
	},
	
	end: function() {
		this.cur = this.stack.shift();
		return this;
	},
	
	parent: function(a) {
		var ret = jQuery.map(this.cur,"d.parentNode");
		if ( a ) ret = jQuery.filter(a,ret).r;
		return this.pushStack(ret);
	},
	
	parents: function(a) {
		var ret = jQuery.map(this.cur,jQuery.parents);
		if ( a ) ret = jQuery.filter(a,ret).r;
		return this.pushStack(ret);
	},
	
	siblings: function(a) {
		// Incorrect, need to exclude current element
		var ret = jQuery.map(this.cur,jQuery.sibling);
		if ( a ) ret = jQuery.filter(a,ret).r;
		return this.pushStack(ret);
	},
	
	filter: function(t) {
		return this.pushStack( jQuery.filter(t,this.cur).r );
	},
	not: function(t) {
		return this.pushStack( t.constructor == String ?
			jQuery.filter(t,this.cur,false).r :
			jQuery.grep(this.cur,function(a){ return a != t; }) );
	},
	add: function(t) {
		return this.pushStack( jQuery.merge( this.cur, t.constructor == String ?
			jQuery.Select(t) : t.constructor == Array ? t : [t] ) );
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
		return jQuery.filter(expr,this.cur).r.length > 0;
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
	domManip: function(fn){
		return this.each(function(){
			var obj = this;
			
			if ( this.nodeName == "TABLE" ) {
				var tbody = this.getElementsByTagName("tbody");

				if ( !tbody.length ) {
					obj = document.createElement("tbody");
					this.appendChild( obj );
				} else
					obj = tbody[0];
			}
	
			fn.apply( obj );
		});
	}
};

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
})();

jQuery.css = function(e,p) {
	// Adapted from Prototype 1.4.0
	if ( p == "height" || p == "width" ) {

		// Handle extra width/height provided by the W3C box model
		var ph = (!jQuery.boxModel ? 0 :
			jQuery.css(e,"paddingTop") + jQuery.css(e,"paddingBottom") +
			jQuery.css(e,"borderTopWidth") + jQuery.css(e,"borderBottomWidth")) || 0;

		var pw = (!jQuery.boxModel ? 0 :
			jQuery.css(e,"paddingLeft") + jQuery.css(e,"paddingRight") +
			jQuery.css(e,"borderLeftWidth") + jQuery.css(e,"borderRightWidth")) || 0;

		var oHeight, oWidth;

		if (jQuery.css(e,"display") != 'none') {
			oHeight = e.offsetHeight || parseInt(e.style.height) || 0;
			oWidth = e.offsetWidth || parseInt(e.style.width) || 0;
		} else {
			var els = e.style;
			var ov = els.visibility;
			var op = els.position;
			var od = els.display;
			els.visibility = "hidden";
			els.position = "absolute";
			els.display = "";
			oHeight = e.clientHeight || parseInt(e.style.height);
			oWidth = e.clientWidth || parseInt(e.style.width);
			els.display = od;
			els.position = op;
			els.visibility = ov;
		}

		return p == "height" ?
			(oHeight - ph < 0 ? 0 : oHeight - ph) :
			(oWidth - pw < 0 ? 0 : oWidth - pw);
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
	
	return /top|right|left|bottom/i.test(p) ? parseFloat( r ) : r;
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
	context = context || jQuery.context || document;
	if ( t.constructor != String )
		return t.constructor == Array ? t : [t];

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
		var re = /^\[ *@([a-z0-9*()_-]+) *([~!|*$^=]*) *'?"?([^'"]*)'?"? *\]/i;
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
	type.cur = ( type[n] == a );
	type.prev = ( type.n > 0 ? type[type.n - 1] : null );
	type.next = ( type.n < type.length - 1 ? type[type.n + 1] : null );
	return type;
};

jQuery.hasWord = function(e,a) {
	if ( e == undefined ) return;
	if ( e.className ) e = e.className;
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
		if ( t !== null ) {
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
		element["on" + type] = jQuery.event.handle;
	},
	
	guid: 1,
	
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
					jQuery.event.remove( element, j );
	},
	
	trigger: function(element,type,data) {
		data = data || [ jQuery.event.fix({ type: type }) ];
		if ( element && element["on" + type] )
			element["on" + type].apply( element, data );
	},
	
	handle: function(event) {
		if ( !event && !window.event ) return;
	
		var returnValue = true, handlers = [];
		event = event || jQuery.event.fix(window.event);
	
		for ( var j in this.events[event.type] )
			handlers[handlers.length] = this.events[event.type][j];
	
		for ( var i = 0; i < handlers.length; i++ ) {
			if ( handlers[i].constructor == Function ) {
				this.handleEvent = handlers[i];
				if (this.handleEvent(event) === false) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}
		}
		return returnValue;
	},
	
	fix: function(event) {
		event.preventDefault = function() {
			this.returnValue = false;
		};
		
		event.stopPropagation = function() {
			this.cancelBubble = true;
		};
		
		return event;
	}

};
