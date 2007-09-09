/*
 * jQuery @VERSION - New Wave Javascript
 *
 * Copyright (c) 2007 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date$
 * $Rev$
 */

// Map over jQuery in case of overwrite
if ( typeof jQuery != "undefined" )
	var _jQuery = jQuery;

var jQuery = window.jQuery = function(a,c) {
	// If the context is global, return a new object
	if ( window == this || !this.init )
		return new jQuery(a,c);
	
	return this.init(a,c);
};

// Map over the $ in case of overwrite
if ( typeof $ != "undefined" )
	var _$ = $;
	
// Map the jQuery namespace to the '$' one
window.$ = jQuery;

var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;

jQuery.fn = jQuery.prototype = {
	init: function(a,c) {
		// Make sure that a selection was provided
		a = a || document;

		// Handle HTML strings
		if ( typeof a  == "string" ) {
			var m = quickExpr.exec(a);
			if ( m && (m[1] || !c) ) {
				// HANDLE: $(html) -> $(array)
				if ( m[1] )
					a = jQuery.clean( [ m[1] ], c );

				// HANDLE: $("#id")
				else {
					var tmp = document.getElementById( m[3] );
					if ( tmp )
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( tmp.id != m[3] )
							return jQuery().find( a );
						else {
							this[0] = tmp;
							this.length = 1;
							return this;
						}
					else
						a = [];
				}

			// HANDLE: $(expr)
			} else
				return new jQuery( c ).find( a );

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction(a) )
			return new jQuery(document)[ jQuery.fn.ready ? "ready" : "load" ]( a );

		return this.setArray(
			// HANDLE: $(array)
			a.constructor == Array && a ||

			// HANDLE: $(arraylike)
			// Watch for when an array-like object is passed as the selector
			(a.jquery || a.length && a != window && !a.nodeType && a[0] != undefined && a[0].nodeType) && jQuery.makeArray( a ) ||

			// HANDLE: $(*)
			[ a ] );
	},
	
	jquery: "@VERSION",

	size: function() {
		return this.length;
	},
	
	length: 0,

	get: function( num ) {
		return num == undefined ?

			// Return a 'clean' array
			jQuery.makeArray( this ) :

			// Return just the object
			this[num];
	},
	
	pushStack: function( a ) {
		var ret = jQuery(a);
		ret.prevObject = this;
		return ret;
	},
	
	setArray: function( a ) {
		this.length = 0;
		Array.prototype.push.apply( this, a );
		return this;
	},

	each: function( fn, args ) {
		return jQuery.each( this, fn, args );
	},

	index: function( obj ) {
		var pos = -1;
		this.each(function(i){
			if ( this == obj ) pos = i;
		});
		return pos;
	},

	attr: function( key, value, type ) {
		var obj = key;
		
		// Look for the case where we're accessing a style value
		if ( key.constructor == String )
			if ( value == undefined )
				return this.length && jQuery[ type || "attr" ]( this[0], key ) || undefined;
			else {
				obj = {};
				obj[ key ] = value;
			}
		
		// Check to see if we're setting style values
		return this.each(function(index){
			// Set all the styles
			for ( var prop in obj )
				jQuery.attr(
					type ? this.style : this,
					prop, jQuery.prop(this, obj[prop], type, index, prop)
				);
		});
	},

	css: function( key, value ) {
		return this.attr( key, value, "curCSS" );
	},

	text: function(e) {
		if ( typeof e != "object" && e != null )
			return this.empty().append( document.createTextNode( e ) );

		var t = "";
		jQuery.each( e || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					t += this.nodeType != 1 ?
						this.nodeValue : jQuery.fn.text([ this ]);
			});
		});
		return t;
	},

	wrapAll: function(html) {
		if ( this[0] )
			// The elements to wrap the target around
			jQuery(html, this[0].ownerDocument)
				.clone()
				.insertBefore(this[0])
				.map(function(){
					var elem = this;
					while ( elem.firstChild )
						elem = elem.firstChild;
					return elem;
				})
				.append(this);

		return this;
	},

	wrapInner: function(html) {
		return this.each(function(){
			jQuery(this).contents().wrapAll(html);
		});
	},

	wrap: function(html) {
		return this.each(function(){
			jQuery(this).wrapAll(html);
		});
	},

	append: function() {
		return this.domManip(arguments, true, 1, function(a){
			this.appendChild( a );
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

	end: function() {
		return this.prevObject || jQuery([]);
	},

	find: function(t) {
		var data = jQuery.map(this, function(a){ return jQuery.find(t,a); });
		return this.pushStack( /[^+>] [^+>]/.test( t ) || t.indexOf("..") > -1 ?
			jQuery.unique( data ) : data );
	},

	clone: function(events) {
		// Do the clone
		var ret = this.map(function(){
			return this.outerHTML ? jQuery(this.outerHTML)[0] : this.cloneNode(true);
		});
		
		if (events === true) {
			var clone = ret.find("*").andSelf();

			this.find("*").andSelf().each(function(i) {
				var events = jQuery.data(this, "events");
				for ( var type in events )
					for ( var handler in events[type] )
						jQuery.event.add(clone[i], type, events[type][handler], events[type][handler].data);
			});
		}

		// Return the cloned set
		return ret;
	},

	filter: function(t) {
		return this.pushStack(
			jQuery.isFunction( t ) &&
			jQuery.grep(this, function(el, index){
				return t.apply(el, [index]);
			}) ||

			jQuery.multiFilter(t,this) );
	},

	not: function(t) {
		return this.pushStack(
			t.constructor == String &&
			jQuery.multiFilter(t, this, true) ||

			jQuery.grep(this, function(a) {
				return ( t.constructor == Array || t.jquery )
					? jQuery.inArray( a, t ) < 0
					: a != t;
			})
		);
	},

	add: function(t) {
		return this.pushStack( jQuery.merge(
			this.get(),
			t.constructor == String ?
				jQuery(t).get() :
				t.length != undefined && (!t.nodeName || t.nodeName == "FORM") ?
					t : [t] )
		);
	},

	is: function(expr) {
		return expr ? jQuery.multiFilter(expr,this).length > 0 : false;
	},

	hasClass: function(expr) {
		return this.is("." + expr);
	},
	
	val: function( val ) {
		if ( val == undefined ) {
			if ( this.length ) {
				var elem = this[0];
		    	
				// We need to handle select boxes special
				if ( jQuery.nodeName(elem, "select") ) {
					var index = elem.selectedIndex,
						a = [],
						options = elem.options,
						one = elem.type == "select-one";
					
					// Nothing was selected
					if ( index < 0 )
						return null;

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[i];
						if ( option.selected ) {
							// Get the specifc value for the option
							var val = jQuery.browser.msie && !option.attributes["value"].specified ? option.text : option.value;
							
							// We don't need an array for one selects
							if ( one )
								return val;
							
							// Multi-Selects return an array
							a.push(val);
						}
					}
					
					return a;
					
				// Everything else, we just grab the value
				} else
					return this[0].value.replace(/\r/g, "");
			}
		} else
			return this.each(function(){
				if ( val.constructor == Array && /radio|checkbox/.test(this.type) )
					this.checked = (jQuery.inArray(this.value, val) >= 0 ||
						jQuery.inArray(this.name, val) >= 0);
				else if ( jQuery.nodeName(this, "select") ) {
					var tmp = val.constructor == Array ? val : [val];

					jQuery("option", this).each(function(){
						this.selected = (jQuery.inArray(this.value, tmp) >= 0 ||
						jQuery.inArray(this.text, tmp) >= 0);
					});

					if ( !tmp.length )
						this.selectedIndex = -1;
				} else
					this.value = val;
			});
	},
	
	html: function( val ) {
		return val == undefined ?
			( this.length ? this[0].innerHTML : null ) :
			this.empty().append( val );
	},

	replaceWith: function( val ) {
		return this.after( val ).remove();
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ) );
	},

	map: function(fn) {
		return this.pushStack(jQuery.map( this, function(elem,i){
			return fn.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},
	
	domManip: function(args, table, dir, fn) {
		var clone = this.length > 1, a; 

		return this.each(function(){
			if ( !a ) {
				a = jQuery.clean(args, this.ownerDocument);
				if ( dir < 0 )
					a.reverse();
			}

			var obj = this;

			if ( table && jQuery.nodeName(this, "table") && jQuery.nodeName(a[0], "tr") )
				obj = this.getElementsByTagName("tbody")[0] || this.appendChild(document.createElement("tbody"));

			jQuery.each( a, function(){
				if ( jQuery.nodeName(this, "script") ) {
					if ( this.src )
						jQuery.ajax({ url: this.src, async: false, dataType: "script" });
					else
						jQuery.globalEval( this.text || this.textContent || this.innerHTML || "" );
				} else
					fn.apply( obj, [ clone ? this.cloneNode(true) : this ] );
			});
		});
	}
};

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, a = 1, al = arguments.length, deep = false;

	// Handle a deep copy situation
	if ( target.constructor == Boolean ) {
		deep = target;
		target = arguments[1] || {};
	}

	// extend jQuery itself if only one argument is passed
	if ( al == 1 ) {
		target = this;
		a = 0;
	}

	var prop;

	for ( ; a < al; a++ )
		// Only deal with non-null/undefined values
		if ( (prop = arguments[a]) != null )
			// Extend the base object
			for ( var i in prop ) {
				// Prevent never-ending loop
				if ( target == prop[i] )
					continue;

				// Recurse if we're merging object values
				if ( deep && typeof prop[i] == 'object' && target[i] )
					jQuery.extend( target[i], prop[i] );

				// Don't bring in undefined values
				else if ( prop[i] != undefined )
					target[i] = prop[i];
			}

	// Return the modified object
	return target;
};

var expando = "jQuery" + (new Date()).getTime(), uuid = 0;

jQuery.extend({
	noConflict: function(deep) {
		window.$ = _$;
		if ( deep )
			window.jQuery = _jQuery;
		return jQuery;
	},

	// This may seem like some crazy code, but trust me when I say that this
	// is the only cross-browser way to do this. --John
	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName && 
			fn.constructor != Array && /function/i.test( fn + "" );
	},
	
	// check if an element is in a XML document
	isXMLDoc: function(elem) {
		return elem.documentElement && !elem.body ||
			elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
	},

	// Evalulates a script in a global context
	// Evaluates Async. in Safari 2 :-(
	globalEval: function( data ) {
		data = jQuery.trim( data );
		if ( data ) {
			if ( window.execScript )
				window.execScript( data );
			else if ( jQuery.browser.safari )
				// safari doesn't provide a synchronous global eval
				window.setTimeout( data, 0 );
			else
				eval.call( window, data );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},
	
	cache: {},
	
	data: function( elem, name, data ) {
		var id = elem[ expando ];

		// Compute a unique ID for the element
		if ( !id ) 
			id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};
		
		// Prevent overriding the named cache with undefined values
		if ( data != undefined )
			jQuery.cache[ id ][ name ] = data;
		
		// Return the named cache data, or the ID for the element	
		return name ? jQuery.cache[ id ][ name ] : id;
	},
	
	removeData: function( elem, name ) {
		var id = elem[ expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			// Remove the section of cache data
			delete jQuery.cache[ id ][ name ];

			// If we've removed all the data, remove the element's cache
			name = "";
			for ( name in jQuery.cache[ id ] ) break;
			if ( !name )
				jQuery.removeData( elem );

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete jQuery.cache[ id ];
		}
	},

	// args is for internal usage only
	each: function( obj, fn, args ) {
		if ( args ) {
			if ( obj.length == undefined )
				for ( var i in obj )
					fn.apply( obj[i], args );
			else
				for ( var i = 0, ol = obj.length; i < ol; i++ )
					if ( fn.apply( obj[i], args ) === false ) break;

		// A special, fast, case for the most common use of each
		} else {
			if ( obj.length == undefined )
				for ( var i in obj )
					fn.call( obj[i], i, obj[i] );
			else
				for ( var i = 0, ol = obj.length, val = obj[0]; 
					i < ol && fn.call(val,i,val) !== false; val = obj[++i] ){}
		}

		return obj;
	},
	
	prop: function(elem, value, type, index, prop){
			// Handle executable functions
			if ( jQuery.isFunction( value ) )
				value = value.call( elem, [index] );
				
			// exclude the following css properties to add px
			var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;

			// Handle passing in a number to a CSS property
			return value && value.constructor == Number && type == "curCSS" && !exclude.test(prop) ?
				value + "px" :
				value;
	},

	className: {
		// internal only, use addClass("class")
		add: function( elem, c ){
			jQuery.each( (c || "").split(/\s+/), function(i, cur){
				if ( !jQuery.className.has( elem.className, cur ) )
					elem.className += ( elem.className ? " " : "" ) + cur;
			});
		},

		// internal only, use removeClass("class")
		remove: function( elem, c ){
			elem.className = c != undefined ?
				jQuery.grep( elem.className.split(/\s+/), function(cur){
					return !jQuery.className.has( c, cur );	
				}).join(" ") : "";
		},

		// internal only, use is(".class")
		has: function( t, c ) {
			return jQuery.inArray( c, (t.className || t).toString().split(/\s+/) ) > -1;
		}
	},

	swap: function(e,o,f) {
		for ( var i in o ) {
			e.style["old"+i] = e.style[i];
			e.style[i] = o[i];
		}
		f.apply( e, [] );
		for ( var i in o )
			e.style[i] = e.style["old"+i];
	},

	css: function(e,p) {
		if ( p == "height" || p == "width" ) {
			var old = {}, oHeight, oWidth, d = ["Top","Bottom","Right","Left"];

			jQuery.each( d, function(){
				old["padding" + this] = 0;
				old["border" + this + "Width"] = 0;
			});

			jQuery.swap( e, old, function() {
				if ( jQuery(e).is(':visible') ) {
					oHeight = e.offsetHeight;
					oWidth = e.offsetWidth;
				} else {
					e = jQuery(e.cloneNode(true))
						.find(":radio").removeAttr("checked").end()
						.css({
							visibility: "hidden", position: "absolute", display: "block", right: "0", left: "0"
						}).appendTo(e.parentNode)[0];

					var parPos = jQuery.css(e.parentNode,"position") || "static";
					if ( parPos == "static" )
						e.parentNode.style.position = "relative";

					oHeight = e.clientHeight;
					oWidth = e.clientWidth;

					if ( parPos == "static" )
						e.parentNode.style.position = "static";

					e.parentNode.removeChild(e);
				}
			});

			return p == "height" ? oHeight : oWidth;
		}

		return jQuery.curCSS( e, p );
	},

	curCSS: function(elem, prop, force) {
		var ret, stack = [], swap = [];

		// A helper method for determining if an element's values are broken
		function color(a){
			if ( !jQuery.browser.safari )
				return false;

			var ret = document.defaultView.getComputedStyle(a,null);
			return !ret || ret.getPropertyValue("color") == "";
		}

		if (prop == "opacity" && jQuery.browser.msie) {
			ret = jQuery.attr(elem.style, "opacity");
			return ret == "" ? "1" : ret;
		}
		
		if (prop.match(/float/i))
			prop = styleFloat;

		if (!force && elem.style[prop])
			ret = elem.style[prop];

		else if (document.defaultView && document.defaultView.getComputedStyle) {

			if (prop.match(/float/i))
				prop = "float";

			prop = prop.replace(/([A-Z])/g,"-$1").toLowerCase();
			var cur = document.defaultView.getComputedStyle(elem, null);

			if ( cur && !color(elem) )
				ret = cur.getPropertyValue(prop);

			// If the element isn't reporting its values properly in Safari
			// then some display: none elements are involved
			else {
				// Locate all of the parent display: none elements
				for ( var a = elem; a && color(a); a = a.parentNode )
					stack.unshift(a);

				// Go through and make them visible, but in reverse
				// (It would be better if we knew the exact display type that they had)
				for ( a = 0; a < stack.length; a++ )
					if ( color(stack[a]) ) {
						swap[a] = stack[a].style.display;
						stack[a].style.display = "block";
					}

				// Since we flip the display style, we have to handle that
				// one special, otherwise get the value
				ret = prop == "display" && swap[stack.length-1] != null ?
					"none" :
					document.defaultView.getComputedStyle(elem,null).getPropertyValue(prop) || "";

				// Finally, revert the display styles back
				for ( a = 0; a < swap.length; a++ )
					if ( swap[a] != null )
						stack[a].style.display = swap[a];
			}

			if ( prop == "opacity" && ret == "" )
				ret = "1";

		} else if (elem.currentStyle) {
			var newProp = prop.replace(/\-(\w)/g,function(m,c){return c.toUpperCase();});
			ret = elem.currentStyle[prop] || elem.currentStyle[newProp];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !/^\d+(px)?$/i.test(ret) && /^\d/.test(ret) ) {
				var style = elem.style.left;
				var runtimeStyle = elem.runtimeStyle.left;
				elem.runtimeStyle.left = elem.currentStyle.left;
				elem.style.left = ret || 0;
				ret = elem.style.pixelLeft + "px";
				elem.style.left = style;
				elem.runtimeStyle.left = runtimeStyle;
			}
		}

		return ret;
	},
	
	clean: function(a, doc) {
		var r = [];
		doc = doc || document;

		jQuery.each( a, function(i,arg){
			if ( !arg ) return;

			if ( arg.constructor == Number )
				arg = arg.toString();
			
			// Convert html string into DOM nodes
			if ( typeof arg == "string" ) {
				// Fix "XHTML"-style tags in all browsers
				arg = arg.replace(/(<(\w+)[^>]*?)\/>/g, function(m, all, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area)$/i)? m : all+"></"+tag+">";
				});

				// Trim whitespace, otherwise indexOf won't work as expected
				var s = jQuery.trim(arg).toLowerCase(), div = doc.createElement("div"), tb = [];

				var wrap =
					// option or optgroup
					!s.indexOf("<opt") &&
					[1, "<select>", "</select>"] ||
					
					!s.indexOf("<leg") &&
					[1, "<fieldset>", "</fieldset>"] ||
					
					s.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[1, "<table>", "</table>"] ||
					
					!s.indexOf("<tr") &&
					[2, "<table><tbody>", "</tbody></table>"] ||
					
				 	// <thead> matched above
					(!s.indexOf("<td") || !s.indexOf("<th")) &&
					[3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
					
					!s.indexOf("<col") &&
					[2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] ||

					// IE can't serialize <link> and <script> tags normally
					jQuery.browser.msie &&
					[1, "div<div>", "</div>"] ||
					
					[0,"",""];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + arg + wrap[2];
				
				// Move to the right depth
				while ( wrap[0]-- )
					div = div.lastChild;
				
				// Remove IE's autoinserted <tbody> from table fragments
				if ( jQuery.browser.msie ) {
					
					// String was a <table>, *may* have spurious <tbody>
					if ( !s.indexOf("<table") && s.indexOf("<tbody") < 0 ) 
						tb = div.firstChild && div.firstChild.childNodes;
						
					// String was a bare <thead> or <tfoot>
					else if ( wrap[1] == "<table>" && s.indexOf("<tbody") < 0 )
						tb = div.childNodes;

					for ( var n = tb.length-1; n >= 0 ; --n )
						if ( jQuery.nodeName(tb[n], "tbody") && !tb[n].childNodes.length )
							tb[n].parentNode.removeChild(tb[n]);
	
					// IE completely kills leading whitespace when innerHTML is used	
					if ( /^\s/.test(arg) )	
						div.insertBefore( doc.createTextNode( arg.match(/^\s*/)[0] ), div.firstChild );

				}
				
				arg = jQuery.makeArray( div.childNodes );
			}

			if ( 0 === arg.length && (!jQuery.nodeName(arg, "form") && !jQuery.nodeName(arg, "select")) )
				return;

			if ( arg[0] == undefined || jQuery.nodeName(arg, "form") || arg.options )
				r.push( arg );
			else
				r = jQuery.merge( r, arg );

		});

		return r;
	},
	
	attr: function(elem, name, value){
		var fix = jQuery.isXMLDoc(elem) ? {} : jQuery.props;

		// Safari mis-reports the default selected property of a hidden option
		// Accessing the parent's selectedIndex property fixes it
		if ( name == "selected" && jQuery.browser.safari )
			elem.parentNode.selectedIndex;
		
		// Certain attributes only work when accessed via the old DOM 0 way
		if ( fix[name] ) {
			if ( value != undefined ) elem[fix[name]] = value;
			return elem[fix[name]];
		} else if ( jQuery.browser.msie && name == "style" )
			return jQuery.attr( elem.style, "cssText", value );

		else if ( value == undefined && jQuery.browser.msie && jQuery.nodeName(elem, "form") && (name == "action" || name == "method") )
			return elem.getAttributeNode(name).nodeValue;

		// IE elem.getAttribute passes even for style
		else if ( elem.tagName ) {

			if ( value != undefined ) {
				if ( name == "type" && jQuery.nodeName(elem,"input") && elem.parentNode )
					throw "type property can't be changed";
				elem.setAttribute( name, value );
			}

			if ( jQuery.browser.msie && /href|src/.test(name) && !jQuery.isXMLDoc(elem) ) 
				return elem.getAttribute( name, 2 );

			return elem.getAttribute( name );

		// elem is actually elem.style ... set the style
		} else {
			// IE actually uses filters for opacity
			if ( name == "opacity" && jQuery.browser.msie ) {
				if ( value != undefined ) {
					// IE has trouble with opacity if it does not have layout
					// Force it by setting the zoom level
					elem.zoom = 1; 
	
					// Set the alpha filter to set the opacity
					elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/,"") +
						(parseFloat(value).toString() == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
				}
	
				return elem.filter ? 
					(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100).toString() : "";
			}
			name = name.replace(/-([a-z])/ig,function(z,b){return b.toUpperCase();});
			if ( value != undefined ) elem[name] = value;
			return elem[name];
		}
	},
	
	trim: function(t){
		return (t||"").replace(/^\s+|\s+$/g, "");
	},

	makeArray: function( a ) {
		var r = [];

		// Need to use typeof to fight Safari childNodes crashes
		if ( typeof a != "array" )
			for ( var i = 0, al = a.length; i < al; i++ )
				r.push( a[i] );
		else
			r = a.slice( 0 );

		return r;
	},

	inArray: function( b, a ) {
		for ( var i = 0, al = a.length; i < al; i++ )
			if ( a[i] == b )
				return i;
		return -1;
	},

	merge: function(first, second) {
		// We have to loop this way because IE & Opera overwrite the length
		// expando of getElementsByTagName

		// Also, we need to make sure that the correct elements are being returned
		// (IE returns comment nodes in a '*' query)
		if ( jQuery.browser.msie ) {
			for ( var i = 0; second[i]; i++ )
				if ( second[i].nodeType != 8 )
					first.push(second[i]);
		} else
			for ( var i = 0; second[i]; i++ )
				first.push(second[i]);

		return first;
	},

	unique: function(first) {
		var r = [], done = {};

		try {
			for ( var i = 0, fl = first.length; i < fl; i++ ) {
				var id = jQuery.data(first[i]);
				if ( !done[id] ) {
					done[id] = true;
					r.push(first[i]);
				}
			}
		} catch(e) {
			r = first;
		}

		return r;
	},

	grep: function(elems, fn, inv) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( typeof fn == "string" )
			fn = eval("false||function(a,i){return " + fn + "}");

		var result = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, el = elems.length; i < el; i++ )
			if ( !inv && fn(elems[i],i) || inv && !fn(elems[i],i) )
				result.push( elems[i] );

		return result;
	},

	map: function(elems, fn) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( typeof fn == "string" )
			fn = eval("false||function(a){return " + fn + "}");

		var result = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, el = elems.length; i < el; i++ ) {
			var val = fn(elems[i],i);

			if ( val !== null && val != undefined ) {
				if ( val.constructor != Array ) val = [val];
				result = result.concat( val );
			}
		}

		return result;
	}
});

var userAgent = navigator.userAgent.toLowerCase();

// Figure out what browser is being used
jQuery.browser = {
	version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
	safari: /webkit/.test(userAgent),
	opera: /opera/.test(userAgent),
	msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
	mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
};

var styleFloat = jQuery.browser.msie ? "styleFloat" : "cssFloat";
	
jQuery.extend({
	// Check to see if the W3C box model is being used
	boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",
	
	styleFloat: jQuery.browser.msie ? "styleFloat" : "cssFloat",
	
	props: {
		"for": "htmlFor",
		"class": "className",
		"float": styleFloat,
		cssFloat: styleFloat,
		styleFloat: styleFloat,
		innerHTML: "innerHTML",
		className: "className",
		value: "value",
		disabled: "disabled",
		checked: "checked",
		readonly: "readOnly",
		selected: "selected",
		maxlength: "maxLength"
	}
});

jQuery.each({
	parent: "a.parentNode",
	parents: "jQuery.parents(a)",
	next: "jQuery.nth(a,2,'nextSibling')",
	prev: "jQuery.nth(a,2,'previousSibling')",
	siblings: "jQuery.sibling(a.parentNode.firstChild,a)",
	children: "jQuery.sibling(a.firstChild)",
	contents: "jQuery.nodeName(a,'iframe')?a.contentDocument||a.contentWindow.document:jQuery.makeArray(a.childNodes)"
}, function(i,n){
	jQuery.fn[ i ] = function(a) {
		var ret = jQuery.map(this,n);
		if ( a && typeof a == "string" )
			ret = jQuery.multiFilter(a,ret);
		return this.pushStack( jQuery.unique(ret) );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(i,n){
	jQuery.fn[ i ] = function(){
		var a = arguments;
		return this.each(function(){
			for ( var j = 0, al = a.length; j < al; j++ )
				jQuery(a[j])[n]( this );
		});
	};
});

jQuery.each( {
	removeAttr: function( key ) {
		jQuery.attr( this, key, "" );
		this.removeAttribute( key );
	},
	addClass: function(c){
		jQuery.className.add(this,c);
	},
	removeClass: function(c){
		jQuery.className.remove(this,c);
	},
	toggleClass: function( c ){
		jQuery.className[ jQuery.className.has(this,c) ? "remove" : "add" ](this, c);
	},
	remove: function(a){
		if ( !a || jQuery.filter( a, [this] ).r.length ) {
			jQuery.removeData( this );
			this.parentNode.removeChild( this );
		}
	},
	empty: function() {
		// Clean up the cache
		jQuery("*", this).each(function(){ jQuery.removeData(this); });

		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(i,n){
	jQuery.fn[ i ] = function() {
		return this.each( n, arguments );
	};
});

jQuery.each( [ "height", "width" ], function(i,n){
	jQuery.fn[ n ] = function(h) {
		return h == undefined ?
			( this.length ? jQuery.css( this[0], n ) : null ) :
			this.css( n, h.constructor == String ? h : h + "px" );
	};
});
