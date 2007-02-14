jQuery.extend({
	expr: {
		"": "m[2]=='*'||jQuery.nodeName(a,m[2])",
		"#": "a.getAttribute('id')==m[2]",
		":": {
			// Position Checks
			lt: "i<m[3]-0",
			gt: "i>m[3]-0",
			nth: "m[3]-0==i",
			eq: "m[3]-0==i",
			first: "i==0",
			last: "i==r.length-1",
			even: "i%2==0",
			odd: "i%2",

			// Child Checks
			"nth-child": "jQuery.nth(a.parentNode.firstChild,m[3],'nextSibling',a)==a",
			"first-child": "jQuery.nth(a.parentNode.firstChild,1,'nextSibling')==a",
			"last-child": "jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a",
			"only-child": "jQuery.sibling(a.parentNode.firstChild).length==1",

			// Parent Checks
			parent: "a.firstChild",
			empty: "!a.firstChild",

			// Text Check
			contains: "jQuery.fn.text.apply([a]).indexOf(m[3])>=0",

			// Visibility
			visible: 'a.type!="hidden"&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden"',
			hidden: 'a.type=="hidden"||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden"',

			// Form attributes
			enabled: "!a.disabled",
			disabled: "a.disabled",
			checked: "a.checked",
			selected: "a.selected||jQuery.attr(a,'selected')",

			// Form elements
			text: "a.type=='text'",
			radio: "a.type=='radio'",
			checkbox: "a.type=='checkbox'",
			file: "a.type=='file'",
			password: "a.type=='password'",
			submit: "a.type=='submit'",
			image: "a.type=='image'",
			reset: "a.type=='reset'",
			button: 'a.type=="button"||jQuery.nodeName(a,"button")',
			input: "/input|select|textarea|button/i.test(a.nodeName)"
		},
		".": "jQuery.className.has(a,m[2])",
		"@": {
			"=": "z==m[4]",
			"!=": "z!=m[4]",
			"^=": "z&&!z.indexOf(m[4])",
			"$=": "z&&z.substr(z.length - m[4].length,m[4].length)==m[4]",
			"*=": "z&&z.indexOf(m[4])>=0",
			"": "z",
			_resort: function(m){
				return ["", m[1], m[3], m[2], m[5]];
			},
			_prefix: "z=a[m[3]];if(!z||/href|src/.test(m[3]))z=jQuery.attr(a,m[3]);"
		},
		"[": "jQuery.find(m[2],a).length"
	},
	
	// The regular expressions that power the parsing engine
	parse: [
		// Match: [@value='test'], [@foo]
		/^\[ *(@)([a-z0-9_-]*) *([!*$^=]*) *('?"?)(.*?)\4 *\]/i,

		// Match: [div], [div p]
		/^(\[)\s*(.*?(\[.*?\])?[^[]*?)\s*\]/,

		// Match: :contains('foo')
		/^(:)([a-z0-9_-]*)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/i,

		// Match: :even, :last-chlid
		/^([:.#]*)([a-z0-9_*-]*)/i
	],

	token: [
		/^(\/?\.\.)/, "a.parentNode",
		/^(>|\/)/, "jQuery.sibling(a.firstChild)",
		/^(\+)/, "jQuery.nth(a,2,'nextSibling')",
		/^(~)/, function(a){
			var s = jQuery.sibling(a.parentNode.firstChild);
			return s.slice(jQuery.inArray(a,s) + 1);
		}
	],

	multiFilter: function( expr, elems, not ) {
		var old, cur = [];

		while ( expr && expr != old ) {
			old = expr;
			var f = jQuery.filter( expr, elems, not );
			expr = f.t.replace(/^\s*,\s*/, "" );
			cur = not ? elems = f.r : jQuery.merge( cur, f.r );
		}

		return cur;
	},

	/**
	 * @name $.find
	 * @type Array<Element>
	 * @private
	 * @cat Core
	 */
	find: function( t, context ) {
		// Quickly handle non-string expressions
		if ( typeof t != "string" )
			return [ t ];

		// Make sure that the context is a DOM Element
		if ( context && !context.nodeType )
			context = null;

		// Set the correct context (if none is provided)
		context = context || document;

		// Handle the common XPath // expression
		if ( !t.indexOf("//") ) {
			context = context.documentElement;
			t = t.substr(2,t.length);

		// And the / root expression
		} else if ( !t.indexOf("/") ) {
			context = context.documentElement;
			t = t.substr(1,t.length);
			if ( t.indexOf("/") >= 1 )
				t = t.substr(t.indexOf("/"),t.length);
		}

		// Initialize the search
		var ret = [context], done = [], last = null;

		// Continue while a selector expression exists, and while
		// we're no longer looping upon ourselves
		while ( t && last != t ) {
			var r = [];
			last = t;

			t = jQuery.trim(t).replace( /^\/\//i, "" );

			var foundToken = false;

			// An attempt at speeding up child selectors that
			// point to a specific element tag
			var re = /^[\/>]\s*([a-z0-9*-]+)/i;
			var m = re.exec(t);

			if ( m ) {
				// Perform our own iteration and filter
				jQuery.each( ret, function(){
					for ( var c = this.firstChild; c; c = c.nextSibling )
						if ( c.nodeType == 1 && ( jQuery.nodeName(c, m[1]) || m[1] == "*" ) )
							r.push( c );
				});

				ret = r;
				t = t.replace( re, "" );
				if ( t.indexOf(" ") == 0 ) continue;
				foundToken = true;
			} else {
				// Look for pre-defined expression tokens
				for ( var i = 0; i < jQuery.token.length; i += 2 ) {
					// Attempt to match each, individual, token in
					// the specified order
					var re = jQuery.token[i];
					var m = re.exec(t);

					// If the token match was found
					if ( m ) {
						// Map it against the token's handler
						r = ret = jQuery.map( ret, jQuery.isFunction( jQuery.token[i+1] ) ?
							jQuery.token[i+1] :
							function(a){ return eval(jQuery.token[i+1]); });

						// And remove the token
						t = jQuery.trim( t.replace( re, "" ) );
						foundToken = true;
						break;
					}
				}
			}

			// See if there's still an expression, and that we haven't already
			// matched a token
			if ( t && !foundToken ) {
				// Handle multiple expressions
				if ( !t.indexOf(",") ) {
					// Clean the result set
					if ( ret[0] == context ) ret.shift();

					// Merge the result sets
					jQuery.merge( done, ret );

					// Reset the context
					r = ret = [context];

					// Touch up the selector string
					t = " " + t.substr(1,t.length);

				} else {
					// Optomize for the case nodeName#idName
					var re2 = /^([a-z0-9_-]+)(#)([a-z0-9\\*_-]*)/i;
					var m = re2.exec(t);
					
					// Re-organize the results, so that they're consistent
					if ( m ) {
					   m = [ 0, m[2], m[3], m[1] ];

					} else {
						// Otherwise, do a traditional filter check for
						// ID, class, and element selectors
						re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
						m = re2.exec(t);
					}

					// Try to do a global search by ID, where we can
					if ( m[1] == "#" && ret[ret.length-1].getElementById ) {
						// Optimization for HTML document case
						var oid = ret[ret.length-1].getElementById(m[2]);

						// Do a quick check for node name (where applicable) so
						// that div#foo searches will be really fast
						ret = r = oid && 
						  (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];

					} else {
						// Pre-compile a regular expression to handle class searches
						if ( m[1] == "." )
							var rec = new RegExp("(^|\\s)" + m[2] + "(\\s|$)");

						// We need to find all descendant elements, it is more
						// efficient to use getAll() when we are already further down
						// the tree - we try to recognize that here
						jQuery.each( ret, function(){
							// Grab the tag name being searched for
							var tag = m[1] != "" || m[0] == "" ? "*" : m[2];

							// Handle IE7 being really dumb about <object>s
							if ( jQuery.nodeName(this, "object") && tag == "*" )
								tag = "param";

							jQuery.merge( r,
								m[1] != "" && ret.length != 1 ?
									jQuery.getAll( this, [], m[1], m[2], rec ) :
									this.getElementsByTagName( tag )
							);
						});

						// It's faster to filter by class and be done with it
						if ( m[1] == "." && ret.length == 1 )
							r = jQuery.grep( r, function(e) {
								return rec.test(e.className);
							});

						// Same with ID filtering
						if ( m[1] == "#" && ret.length == 1 ) {
							// Remember, then wipe out, the result set
							var tmp = r;
							r = [];

							// Then try to find the element with the ID
							jQuery.each( tmp, function(){
								if ( this.getAttribute("id") == m[2] ) {
									r = [ this ];
									return false;
								}
							});
						}

						ret = r;
					}

					t = t.replace( re2, "" );
				}

			}

			// If a selector string still exists
			if ( t ) {
				// Attempt to filter it
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}

		// Remove the root context
		if ( ret && ret[0] == context ) ret.shift();

		// And combine the results
		jQuery.merge( done, ret );

		return done;
	},

	filter: function(t,r,not) {
		// Look for common filter expressions
		while ( t && /^[a-z[({<*:.#]/i.test(t) ) {

			var p = jQuery.parse, m;

			jQuery.each( p, function(i,re){
		
				// Look for, and replace, string-like sequences
				// and finally build a regexp out of it
				m = re.exec( t );

				if ( m ) {
					// Remove what we just matched
					t = t.substring( m[0].length );

					// Re-organize the first match
					if ( jQuery.expr[ m[1] ]._resort )
						m = jQuery.expr[ m[1] ]._resort( m );

					return false;
				}
			});

			// :not() is a special case that can be optimized by
			// keeping it out of the expression list
			if ( m[1] == ":" && m[2] == "not" )
				r = jQuery.filter(m[3], r, true).r;

			// Handle classes as a special case (this will help to
			// improve the speed, as the regexp will only be compiled once)
			else if ( m[1] == "." ) {

				var re = new RegExp("(^|\\s)" + m[2] + "(\\s|$)");
				r = jQuery.grep( r, function(e){
					return re.test(e.className || "");
				}, not);

			// Otherwise, find the expression to execute
			} else {
				var f = jQuery.expr[m[1]];
				if ( typeof f != "string" )
					f = jQuery.expr[m[1]][m[2]];

				// Build a custom macro to enclose it
				eval("f = function(a,i){" +
					( jQuery.expr[ m[1] ]._prefix || "" ) +
					"return " + f + "}");

				// Execute it against the current filter
				r = jQuery.grep( r, f, not );
			}
		}

		// Return an array of filtered elements (r)
		// and the modified expression string (t)
		return { r: r, t: t };
	},
	
	getAll: function( o, r, token, name, re ) {
		for ( var s = o.firstChild; s; s = s.nextSibling )
			if ( s.nodeType == 1 ) {
				var add = true;

				if ( token == "." )
					add = s.className && re.test(s.className);
				else if ( token == "#" )
					add = s.getAttribute("id") == name;
	
				if ( add )
					r.push( s );

				if ( token == "#" && r.length ) break;

				if ( s.firstChild )
					jQuery.getAll( s, r, token, name, re );
			}

		return r;
	},

	/**
	 * All ancestors of a given element.
	 *
	 * @private
	 * @name $.parents
	 * @type Array<Element>
	 * @param Element elem The element to find the ancestors of.
	 * @cat DOM/Traversing
	 */
	parents: function( elem ){
		var matched = [];
		var cur = elem.parentNode;
		while ( cur && cur != document ) {
			matched.push( cur );
			cur = cur.parentNode;
		}
		return matched;
	},
	
	/**
	 * A handy, and fast, way to traverse in a particular direction and find
	 * a specific element.
	 *
	 * @private
	 * @name $.nth
	 * @type DOMElement
	 * @param DOMElement cur The element to search from.
	 * @param String|Number num The Nth result to match. Can be a number or a string (like 'even' or 'odd').
	 * @param String dir The direction to move in (pass in something like 'previousSibling' or 'nextSibling').
	 * @cat DOM/Traversing
	 */
	nth: function(cur,result,dir,elem){
		result = result || 1;
		var num = 0;
		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType == 1 ) num++;
			if ( num == result || result == "even" && num % 2 == 0 && num > 1 && cur == elem ||
				result == "odd" && num % 2 == 1 && cur == elem ) return cur;
		}
	},
	
	/**
	 * All elements on a specified axis.
	 *
	 * @private
	 * @name $.sibling
	 * @type Array
	 * @param Element elem The element to find all the siblings of (including itself).
	 * @cat DOM/Traversing
	 */
	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType == 1 && (!elem || n != elem) )
				r.push( n );
		}

		return r;
	}
});
