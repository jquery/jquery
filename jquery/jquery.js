/*
 * jQuery (jquery.com)
 *
 * Copyright (c) 2006 John Resig (ejohn.org)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * $Date$
 * $Rev$
 */

function $(a,c) {
	var $a = a || $.context || document;
	var $c = c && c.$jquery && c.get(0) || c;
	
	// Since we're using Prototype's $ function,
	// be nice and have backwards compatability
	if ( typeof Prototype != "undefined" ) {
		if ( $a.constructor == String ) {
			var re = new RegExp( "[^a-zA-Z0-9_-]" );
			if ( !re.test($a) ) {
				$c = $c && $c.documentElement || document;
				if ( $c.getElementsByTagName($a).length === 0 ) {
					var obj = $c.getElementById($a);
					if ( obj !== null ) { return obj; }
				}
			}
		} else if ( $a.constructor == Array ) {
			return $.map( $a, function(b){
				if ( b.constructor == String ) {
					return document.getElementById(b);
				}
				return b;
			});
		}
	}

	// Load Dynamic Function List
	var self = {
		cur: $.Select($a,$c),
		$jquery: "$Rev$",
		
		// The only two getters
		size: function() {return this.get().length;},
		get: function(i) {
			return i === null ? this.cur : this.cur[i];
		},
		
		each: function(f) {
			for ( var i = 0; i < this.size(); i++ ) {
				$.apply( this.get(i), f, [i] );
			}
			return this;
		},
		set: function(a,b) {
			return this.each(function(){
				if ( b === null ) {
					for ( var j in a ) {
						$.attr(this,j,a[j]);
					}
				} else {
					$.attr(this,a,b);
				}
			});
		},
		html: function(h) {
			return h === null && this.size() ?
				this.get(0).innerHTML : this.set( "innerHTML", h );
		},
		val: function(h) {
			return h === null && this.size() ?
				this.get(0).value : this.set( "value", h );
		},
		
		css: function(a,b) {
			return  a.constructor != String || b ?
				this.each(function(){
					if ( !b ) {
						for ( var j in a ) {
							$.attr(this.style,j,a[j]);
						}
					} else {
						$.attr(this.style,a,b);
					}
				}) : $.css( this.get(0), a );
		},
		toggle: function() {
			return this.each(function(){
				var d = $.getCSS(this,"display");
				if ( d == "none" || d === '' ) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		},
		show: function(a) {
			return this.each(function(){
				this.style.display = this.$$oldblock ? this.$$oldblock : '';
				if ( $.getCSS(this,"display") == "none" ) {
					this.style.display = 'block';
				}
			});
		},
		hide: function(a) {
			return this.each(function(){
				this.$$oldblock = $.getCSS(this,"display");
				if ( this.$$oldblock == "none" ) {
					this.$$oldblock = 'block';
				}
				this.style.display = 'none';
			});
		},
		addClass: function(c) {
			return this.each(function(){
				if ($.hasWord(this,c)) {
					return null;
				}
				this.className += ( this.className.length > 0 ? " " : "" ) + c;
			});
		},
		removeClass: function(c) {
			return this.each(function(){
				this.className = c === null ? '' :
					this.className.replace(
						new RegExp('(^|\\s*\\b[^-])'+c+'($|\\b(?=[^-]))', 'g'), '');
			});
		},
		// TODO: Optomize
		toggleClass: function(c) {
			return this.each(function(){
				if ($.hasWord(this,c)) {
					this.className = 
						this.className.replace(
							new RegExp('(\\s*\\b[^-])'+c+'($|\\b(?=[^-]))', 'g'), '');
				} else {
					this.className += ( this.className.length > 0 ? " " : "" ) + c;
				}
			});
		},
		remove: function() {
			this.each(function(){this.parentNode.removeChild( this );});
			this.cur = [];
			return this;
		},
		
		wrap: function() {
			var a = $.clean(arguments);
			return this.each(function(){
				var b = a[0].cloneNode(true);
				this.parentNode.insertBefore( b, this );
				while ( b.firstChild ) {
					b = b.firstChild;
				}
				b.appendChild( this );
			});
		},
		
		append: function() {
			var clone = this.size() > 1;
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i = 0; i < a.length; i++ ) {
				  this.appendChild( clone ? a[i].cloneNode(true) : a[i] );
				}
			});
		},

		appendTo: function() {
			var a = arguments;
			return this.each(function(){
				for ( var i = 0; i < a.length; i++ ) {
					$(a[i]).append( this );
				}
			});
		},
		
		prepend: function() {
			var clone = this.size() > 1;
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i = a.length - 1; i >= 0; i-- ) {
					this.insertBefore( clone ? a[i].cloneNode(true) : a[i], this.firstChild );
				}
			});
		},
		
		before: function() {
			var clone = this.size() > 1;
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i = 0; i < a.length; i++ ) {
					this.parentNode.insertBefore( clone ? a[i].cloneNode(true) : a[i], this );
				}
			});
		},
		
		after: function() {
			var clone = this.size() > 1;
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i = a.length - 1; i >= 0; i-- ) {
					this.parentNode.insertBefore( clone ? a[i].cloneNode(true) : a[i], this.nextSibling );
				}
			});
		},

		empty: function() {
			return this.each(function(){
				while ( this.firstChild ) {
					this.removeChild( this.firstChild );
				}
			});
		},
		
		bind: function(t,f) {
			return this.each(function(){addEvent(this,t,f);});
		},
		unbind: function(t,f) {
			return this.each(function(){removeEvent(this,t,f);});
		},
		trigger: function(t) {
			return this.each(function(){triggerEvent(this,t);});
		},
		
		find: function(t) {
			var old = [], ret = [];
			this.each(function(){
				old[old.length] = this;
				ret = $.merge( ret, $.Select(t,this) );
			});
			this.old = old;
			this.cur = ret;
			return this;
		},
		end: function() {
			this.cur = this.old;
			return this;
		},

		parent: function(a) {
			this.cur = $.map(this.cur,function(d){
				return d.parentNode;
			});
			if ( a ) {
				this.cur = $.filter(a,this.cur).r;
			}
			return this;
		},
		
		parents: function(a) {
			this.cur = $.map(this.cur,$.parents);
			if ( a ) {
				this.cur = $.filter(a,this.cur).r;
			}
			return this;
		},
		
		siblings: function(a) {
			// Incorrect, need to exclude current element
			this.cur = $.map(this.cur,$.sibling);
			if ( a ) {
				this.cur = $.filter(a,this.cur).r;
			}
			return this;
		},
		
		filter: function(t) {
			this.cur = $.filter(t,this.cur).r;
			return this;
		},
		not: function(t) {
			this.cur = t.constructor == String ?
				$.filter(t,this.cur,false).r :
				$.grep(this.cur,function(a){return a != t;});
			return this;
		},
		add: function(t) {
			this.cur = $.merge( this.cur, t.constructor == String ?
				$.Select(t) : t.constructor == Array ? t : [t] );
			return this;
		},
		is: function(t) {
			return $.filter(t,this.cur).r.length > 0;
		},
		isNot: function(t) {
			return !this.s(t);
		}
	};
	
	// TODO: Remove need to return this
	for ( var i in $.fn ) {
		if ( self[i] !== null ) {
			self["_"+i] = self[i];
		}
		self[i] = $.fn[i];
	}
	
	if ( typeof Prototype != "undefined" && $a.constructor != String ) {
		if ( $c ) {
			$a = self.get();
		}
		for ( var k in self ) {(function(j){
			try {
				if ( $a[j] === null ) {
					$a[j] = function() {
						return $.apply(self,self[j],arguments);
					};
				}
			} catch(e) {}
		})(k);}
		return $a;
	}
	
	return self;
}

$.apply = function(o,f,a) {
	a = a || [];
	if ( f.apply ) {
		return f.apply( o, a );
	} else {
		var p = [];
		for (var i = 0; i < a.length; i++) {
			p[i] = 'a['+i+']';
		}
		o.$$exec = this;
		var r = eval('o.$$exec(' + p.join(',') + ')');
		o.$$exec = null;
		return r;
	}
};

$.getCSS = function(e,p) {
	// Adapted from Prototype 1.4.0
	if ( p == 'height' || p == 'width' ) {
		if ($.getCSS(e,"display") != 'none') {
			return p == 'height' ?
				e.offsetHeight || parseInt(e.style.height,10) : 
				e.offsetWidth || parseInt(e.style.width,10);
		}
		var els = e.style;
		var ov = els.visibility;
		var op = els.position;
		var od = els.display;
		els.visibility = 'hidden';
		els.position = 'absolute';
		els.display = '';
		var oHeight = e.clientHeight || parseInt(e.style.height,10);
		var oWidth = e.clientWidth || parseInt(e.style.width,10);
		els.display = od;
		els.position = op;
		els.visibility = ov;
		return p == 'height' ? oHeight : oWidth;
	}
	
	if (e.style[p]) {
		return e.style[p];
 	} else if (e.currentStyle) {
		return e.currentStyle[p];
	} else if (document.defaultView && document.defaultView.getComputedStyle) {
		p = p.replace(/([A-Z])/g,"-$1");
		p = p.toLowerCase();
		var s = document.defaultView.getComputedStyle(e,"");
		var r = s ? s.getPropertyValue(p) : p;
		return r;
 	} else {
		return null;
	}
};
$.css = $.getCSS;

$.clean = function(a) {
	var r = [];
	for ( var i = 0; i < a.length; i++ ) {
		if ( a[i].constructor == String ) {
			var div = document.createElement("div");
			div.innerHTML = a[i];
			for ( var j = 0; j < div.childNodes.length; j++ ) {
				r[r.length] = div.childNodes[j];
			}
		} else if ( a[i].length ) {
			for ( var k = 0; k < a[i].length; k++ ) {
				r[r.length] = a[i][k];
			}
		} else if ( a[i] !== null ) {
			r[r.length] = 
				a[i].nodeType ? a[i] : document.createTextNode(a[i].toString());
		}
	}
	return r;
};

$.g = {
	'': "m[2] == '*' || a.nodeName.toUpperCase() == m[2].toUpperCase()",
	'#': "a.id == m[2]",
	':': {
		lt: "i < m[3]-0",
		gt: "i > m[3]-0",
		nth: "m[3] - 0 == i",
		eq: "m[3] - 0 == i",
		first: "i == 0",
		last: "i == r.length - 1",
		even: "i % 2 == 0",
		odd: "i % 2 == 1",
		"first-child": "$.sibling(a,0).cur",
		"nth-child": "(m[3] == 'even'?$.sibling(a,m[3]).n % 2 == 0 :(m[3] == 'odd'?$.sibling(a,m[3]).n % 2 == 1:$.sibling(a,m[3]).cur))",
		"last-child": "$.sibling(a,0,true).cur",
		"nth-last-child": "$.sibling(a,m[3],true).cur",
		"first-of-type": "$.ofType(a,0)",
		"nth-of-type": "$.ofType(a,m[3])",
		"last-of-type": "$.ofType(a,0,true)",
		"nth-last-of-type": "$.ofType(a,m[3],true)",
		"only-of-type": "$.ofType(a) == 1",
		"only-child": "$.sibling(a).length == 1",
		parent: "a.childNodes.length > 0",
		empty: "a.childNodes.length == 0",
		root: "a == ( a.ownerDocument ? a.ownerDocument : document ).documentElement",
		contains: "(a.innerText || a.innerHTML).indexOf(m[3]) != -1",
		visible: "(!a.type || a.type != 'hidden') && ($.getCSS(a,'display') != 'none' && $.getCSS(a,'visibility') != 'hidden')",
		hidden: "(a.type && a.type == 'hidden') || $.getCSS(a,'display') == 'none' || $.getCSS(a,'visibility') == 'hidden'",
		enabled: "a.disabled == false",
		disabled: "a.disabled",
		checked: "a.checked"
	},
	// TODO: Write getAttribute helper
	".": "$.hasWord(a,m[2])",
	"@": {
		"=": "$.attr(a,m[3]) == m[4]",
		"!=": "$.attr(a,m[3]) != m[4]",
		"~=": "$.hasWord($.attr(a,m[3]),m[4])",
		"|=": "$.attr(a,m[3]).indexOf(m[4]) == 0",
		"^=": "$.attr(a,m[3]).indexOf(m[4]) == 0",
		"$=": "$.attr(a,m[3]).substr( $.attr(a,m[3]).length - m[4].length, m[4].length ) == m[4]",
		"*=": "$.attr(a,m[3]).indexOf(m[4]) >= 0",
		"": "m[3] == '*' ? a.attributes.length > 0 : $.attr(a,m[3])"
	},
	"[": "$.Select(m[2],a).length > 0"
};

$.fn = {};

$.Select = function( t, context ) {
	context = context || $.context || document;
	if ( t.constructor != String ) {
		return [t];
	}
	
	if ( t.indexOf("//") === 0 ) {
		context = context.documentElement;
		t = t.substr(2,t.length);
	} else if ( t.indexOf("/") === 0 ) {
		context = context.documentElement;
		t = t.substr(1,t.length);
		// FIX Assume the root element is right :(
		if ( t.indexOf('/') ) {
			t = t.substr(t.indexOf('/'),t.length);
		}
	}
	
	var ret = [context];
	var done = [];
	var last = null;
  
	while ( t.length > 0 && last != t ) {
    var r = [];
		last = t;
	    
    t = $.cleanSpaces(t);
	    
    var re = new RegExp( "^//", "i" );
    t = t.replace( re, "" );
	
    if ( t.indexOf('..') === 0 || t.indexOf('/..') === 0 ) {
			if ( t.indexOf('/') === 0 ) {
				t = t.substr(1,t.length);
			}
			r = $.map( ret, function(a){ return a.parentNode; } );
			t = t.substr(2,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf('>') === 0 || t.indexOf('/') === 0 ) {
			r = $.map( ret, function(a){ return ( a.childNodes.length > 0 ? $.sibling( a.firstChild ) : null ); } );
			t = t.substr(1,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf('+') === 0 ) {
			r = $.map( ret, function(a){ return $.sibling(a).next; } );
			t = t.substr(1,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf('~') === 0 ) {
			r = $.map( ret, function(a){
				var r = [];
				var s = $.sibling(a);
				if ( s.n > 0 ) {
					for ( var i = s.n; i < s.length; i++ ) {
						r[r.length] = s[i];
					}
				}
				return r;
			});
			t = t.substr(1,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf(',') === 0 || t.indexOf('|') === 0 ) {
			if ( ret[0] == context ) { ret.shift(); }
			done = $.merge( done, ret );
			r = ret = [context];
			t = " " + t.substr(1,t.length);
    } else {
			var re2 = new RegExp( "^([#.]?)([a-z0-9\\*_-]*)", "i" );
			var m = re2.exec(t);
			
			if ( m[1] == "#" ) { // Ummm, should make this work in all XML docs
				var oid = document.getElementById(m[2]);
				r = oid ? [oid] : [];
				t = t.replace( re, "" );
			} else {
				if ( m[2] === "" || m[1] == "." ) { m[2] = "*"; }
	
				for ( var i = 0; i < ret.length; i++ ) {
					var o = ret[i];
					if ( o ) {
						switch( m[2] ) {
							case '*':
								r = $.merge( $.getAll(o), r );
							break;
							case 'text': case 'radio': case 'checkbox': case 'hidden':
							case 'button': case 'submit': case 'image': case 'password':
							case 'reset': case 'file':
								r = $.merge( $.grep( $.tag(o,"input"), 
									function(a){ return a.type == m[2]; }), r );
							break;
							case 'input':
								r = $.merge( $.tag(o,"input"), r );
								r = $.merge( $.tag(o,"select"), r );
								r = $.merge( $.tag(o,"textarea"), r );
							break;
							default:
								r = $.merge( r, $.tag(o,m[2]) );
							break;
						}
					}
				}
			}
		}

		var val = $.filter(t,r);
		ret = r = val.r;
		t = $.cleanSpaces(val.t);
	}

	if ( ret && ret[0] == context ) { ret.shift(); }
	done = $.merge( done, ret );
	return done;
};

$.tag = function(a,b){
	return a && typeof a.getElementsByTagName != "undefined" ?
		a.getElementsByTagName( b ) : [];
};

$.attr = function(o,a,v){
	if ( a && a.constructor == String ) {
		var fix = {
			'for': 'htmlFor',
			'text': 'cssText',
			'class': 'className',
			'float': 'cssFloat'
		};
		a = (fix[a] && fix[a].replace && fix[a]) || a;
		var r = new RegExp("-([a-z])","ig");
		a = a.replace(r,function(z,b){return b.toUpperCase();});
		if ( v !== null ) {
			o[a] = v;
			if ( o.setAttribute ) {
				o.setAttribute(a,v);
			}
		} 
		return o[a] || o.getAttribute(a) || '';
	} else {
		return '';
	}
};

$.filter = function(t,r,not) {
	var g = $.grep;
	if ( not === false ) {
		g = function(a,f) {return $.grep(a,f,true);};
	}
	
	while ( t.length > 0 && t.match(/^[:\\.#\\[a-zA-Z\\*]/) ) {
		var re = new RegExp( "^\\[ *@([a-z0-9\\(\\)_-]+) *([~!\\|\\*$^=]*) *'?\"?([^'\"]*)'?\"? *\\]", "i" );
		var m = re.exec(t);
		
		if ( m !== null ) {
			m = ['', '@', m[2], m[1], m[3]];
		} else {
			re = new RegExp( "^(\\[) *([^\\]]*) *\\]", "i" );
			m = re.exec(t);
			
			if ( m === null ) {
				re = new RegExp( "^(:)([a-z0-9\\*_-]*)\\( *[\"']?([^ \\)'\"]*)['\"]? *\\)", "i" );
				m = re.exec(t);
				
				if ( m === null ) {
					re = new RegExp( "^([:\\.#]*)([a-z0-9\\*_-]*)", "i" );
					m = re.exec(t);
				}
			}
		}
		t = t.replace( re, "" );
		
		if ( m[1] == ":" && m[2] == "not" ) {
			r = $.filter(m[3],r,false).r;
		} else {
			var f = null;

			if ( $.g[m[1]].constructor == String ) {
				f = $.g[m[1]];
			} else if ( $.g[m[1]][m[2]] ) {
				f = $.g[m[1]][m[2]];
			}
						
			if ( f !== null ) {
				f = new Function('a','i','return ' + f);
				r = g( r, f );
			}
		}
	}

	return { r: r, t: t };
};

$.parents = function(a){
	var b = [];
	var c = a.parentNode;
	while ( c !== null && c != document ) {
		b[b.length] = c;
		c = c.parentNode;
	}
	return b;
};

$.cleanSpaces = function(t){
	return t.replace(/^\s+|\s+$/g, '');
};

$.ofType = function(a,n,e) {
	var t = $.grep($.sibling(a),function(b){return b.nodeName == a.nodeName;});
	if ( e ) { n = t.length - n - 1; }
	return n !== null ? t[n] == a : t.length;
};

$.sibling = function(a,n,e) {
	var type = [];
	var tmp = a.parentNode.childNodes;
	for ( var i = 0; i < tmp.length; i++ ) {
		if ( tmp[i].nodeType == 1 ) {
			type[type.length] = tmp[i];
		}
		if ( tmp[i] == a ) {
			type.n = type.length - 1;
		}
	}
	if ( e ) { n = type.length - n - 1; }
	type.cur = ( type[n] == a );
	type.prev = ( type.n > 0 ? type[type.n - 1] : null );
	type.next = ( type.n < type.length - 1 ? type[type.n + 1] : null );
	return type;
};

$.hasWord = function(e,a) {
	if ( e === null ) { return false; }
	if ( e.className !== null ) { e = e.className; }
	return new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
};

$.getAll = function(o,r) {
	r = r || [];
	var s = o.childNodes;
	for ( var i = 0; i < s.length; i++ ) {
		if ( s[i].nodeType == 1 ) {
			r[r.length] = s[i];
			$.getAll( s[i], r );
		}
	}
	return r;
};

$.merge = function(a,b) {
	var d = [];
	for ( var k = 0; k < b.length; k++ ) { d[k] = b[k]; }
	
	for ( var i = 0; i < a.length; i++ ) {
		var c = true;
		for ( var j = 0; j < b.length; j++ ) {
			if ( a[i] == b[j] ) {
				c = false;
			}
		}
		if ( c ) {
			d[d.length] = a[i];
		}
	}

	return d;
};

$.grep = function(a,f,s) {
	var r = [];
	if ( a !== null ) {
		for ( var i = 0; i < a.length; i++ ) {
			if ( (!s && f(a[i],i)) || (s && !f(a[i],i)) ) {
				r[r.length] = a[i];
			}
		}
	}
	return r;
};

$.map = function(a,f) {
	var r = [];
	for ( var i = 0; i < a.length; i++ ) {
		var t = f(a[i],i);
		if ( t !== null ) {
			if ( t.constructor != Array ) { t = [t]; }
			r = $.merge( t, r );
		}
	}
	return r;
};

// Bind an event to an element
// Original by Dean Edwards
function addEvent(element, type, handler) {
	if ( element.location ) { element = window; } // Ughhhhh....
	if (!handler.$$guid) { handler.$$guid = addEvent.guid++; }
	if (!element.events) { element.events = {}; }
	var handlers = element.events[type];
	if (!handlers) {
		handlers = element.events[type] = {};
		if (element["on" + type]) {
			handlers[0] = element["on" + type];
		}
	}
	handlers[handler.$$guid] = handler;
	element["on" + type] = handleEvent;
}

addEvent.guid = 1;

// Detach an event or set of events from an element
function removeEvent(element, type, handler) {
	if (element.events) {
		if (type && element.events[type]) {
			if ( handler ) {
				delete element.events[type][handler.$$guid];
			} else {
				for ( var i in element.events[type] ) {
					delete element.events[type][i];
				}
			}
		} else {
			for ( var j in element.events ) {
				removeEvent( element, j );
			}
		}
	}
}

function triggerEvent(element,type,data) {
	data = data || [{ type: type }];
	if ( element && element["on" + type] ) {
		$.apply( element, element["on" + type], data );
	}
}

function handleEvent(event) {
	var returnValue = true;
	event = event || fixEvent(window.event);
	var handlers = [];
	for ( var j in this.events[event.type] ) {
		handlers[handlers.length] = this.events[event.type][j];
	}
	for ( var i = 0; i < handlers.length; i++ ) {
		try {
			if ( handlers[i].constructor == Function ) {
				this.$$handleEvent = handlers[i];
				if (this.$$handleEvent(event) === false) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}
		} catch(e){}
	}
	return returnValue;
}

function fixEvent(event) {
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
}

fixEvent.preventDefault = function() {
	this.returnValue = false;
};

fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};

// Move to module

$.fn.text = function(e) {
	e = e || this.cur;
	var t = "";
	for ( var j = 0; j < e.length; j++ ) {
		for ( var i = 0; i < e[j].childNodes.length; i++ ) {
		 	t += e[j].childNodes[i].nodeType != 1 ?
				e[j].childNodes[i].nodeValue :
				$.fn.text(e[j].childNodes[i].childNodes);
		}
	}
	return t;
};

/*setTimeout(function(){
	if ( typeof Prototype != "undefined" && $.g == null && $.clean == null )
		throw "Error: You are overwriting jQuery, please include jQuery last.";
}, 1000);*/
