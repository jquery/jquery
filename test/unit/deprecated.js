QUnit.module( "deprecated", { afterEach: moduleTeardown } );


QUnit.test( "bind/unbind", function( assert ) {
	assert.expect( 4 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.find( "b" )
		.bind( "click", { bindData: 19 }, function( e, trig ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.data.bindData, 19, "correct trigger data" );
			assert.equal( trig, 42, "correct bind data" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.trigger( "click", [ 42 ] )
		.unbind( "click" )
		.trigger( "click" )
		.remove();
} );

QUnit.test( "delegate/undelegate", function( assert ) {
	assert.expect( 2 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.delegate( "b", "click", function( e ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.find( "b" )
			.trigger( "click" )
			.end()
		.undelegate( "b", "click" )
		.remove();
} );

if ( jQuery.fn.hover ) {
	QUnit.test( "hover() mouseenter mouseleave", function( assert ) {
		assert.expect( 1 );

		var times = 0,
			handler1 = function() { ++times; },
			handler2 = function() { ++times; };

		jQuery( "#firstp" )
			.hover( handler1, handler2 )
			.mouseenter().mouseleave()
			.off( "mouseenter", handler1 )
			.off( "mouseleave", handler2 )
			.hover( handler1 )
			.mouseenter().mouseleave()
			.off( "mouseenter mouseleave", handler1 )
			.mouseenter().mouseleave();

		assert.equal( times, 4, "hover handlers fired" );

	} );
}


QUnit[ jQuery.fn.click ? "test" : "skip" ]( "trigger() shortcuts", function( assert ) {
	assert.expect( 5 );

	var counter, clickCounter,
		elem = jQuery( "<li><a href='#'>Change location</a></li>" ).prependTo( "#firstUL" );
	elem.find( "a" ).on( "click", function() {
		var close = jQuery( "spanx", this ); // same with jQuery(this).find("span");
		assert.equal( close.length, 0, "Context element does not exist, length must be zero" );
		assert.ok( !close[ 0 ], "Context element does not exist, direct access to element must return undefined" );
		return false;
	} ).click();

	// manually clean up detached elements
	elem.remove();

	jQuery( "#check1" ).click( function() {
		assert.ok( true, "click event handler for checkbox gets fired twice, see #815" );
	} ).click();

	counter = 0;
	jQuery( "#firstp" )[ 0 ].onclick = function() {
		counter++;
	};
	jQuery( "#firstp" ).click();
	assert.equal( counter, 1, "Check that click, triggers onclick event handler also" );

	clickCounter = 0;
	jQuery( "#simon1" )[ 0 ].onclick = function() {
		clickCounter++;
	};
	jQuery( "#simon1" ).click();
	assert.equal( clickCounter, 1, "Check that click, triggers onclick event handler on an a tag also" );
} );

QUnit[ jQuery.fn.click ? "test" : "skip" ]( "Event aliases", function( assert ) {

	// Explicitly skipping focus/blur events due to their flakiness
	var	$elem = jQuery( "<div />" ).appendTo( "#qunit-fixture" ),
		aliases = ( "resize scroll click dblclick mousedown mouseup " +
			"mousemove mouseover mouseout mouseenter mouseleave change " +
			"select submit keydown keypress keyup contextmenu" ).split( " " );
	assert.expect( aliases.length );

	jQuery.each( aliases, function( i, name ) {

		// e.g. $(elem).click(...).click();
		$elem[ name ]( function( event ) {
			assert.equal( event.type, name, "triggered " + name );
		} )[ name ]().off( name );
	} );
} );

QUnit.test( "jQuery.parseJSON", function( assert ) {
	assert.expect( 20 );

	assert.strictEqual( jQuery.parseJSON( null ), null, "primitive null" );
	assert.strictEqual( jQuery.parseJSON( "0.88" ), 0.88, "Number" );
	assert.strictEqual(
		jQuery.parseJSON( "\" \\\" \\\\ \\/ \\b \\f \\n \\r \\t \\u007E \\u263a \"" ),
		" \" \\ / \b \f \n \r \t ~ \u263A ",
		"String escapes"
	);
	assert.deepEqual( jQuery.parseJSON( "{}" ), {}, "Empty object" );
	assert.deepEqual( jQuery.parseJSON( "{\"test\":1}" ), { "test": 1 }, "Plain object" );
	assert.deepEqual( jQuery.parseJSON( "[0]" ), [ 0 ], "Simple array" );

	assert.deepEqual(
		jQuery.parseJSON( "[ \"string\", -4.2, 2.7180e0, 3.14E-1, {}, [], true, false, null ]" ),
		[ "string", -4.2, 2.718, 0.314, {}, [], true, false, null ],
		"Array of all data types"
	);
	assert.deepEqual(
		jQuery.parseJSON( "{ \"string\": \"\", \"number\": 4.2e+1, \"object\": {}," +
			"\"array\": [[]], \"boolean\": [ true, false ], \"null\": null }" ),
		{ string: "", number: 42, object: {}, array: [ [] ], "boolean": [ true, false ], "null": null },
		"Dictionary of all data types"
	);

	assert.deepEqual( jQuery.parseJSON( "\n{\"test\":1}\t" ), { "test": 1 },
		"Leading and trailing whitespace are ignored" );

	assert.throws( function() {
		jQuery.parseJSON();
	}, null, "Undefined raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "" );
	}, null, "Empty string raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "''" );
	}, null, "Single-quoted string raises an error" );

	assert.throws( function() {
		var result = jQuery.parseJSON( "0101" );

		// Support: IE <=9 only
		// Ensure base-10 interpretation on browsers that erroneously accept leading-zero numbers
		if ( result === 101 ) {
			throw new Error( "close enough" );
		}
	}, null, "Leading-zero number raises an error or is parsed as decimal" );
	assert.throws( function() {
		jQuery.parseJSON( "{a:1}" );
	}, null, "Unquoted property raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "{'a':1}" );
	}, null, "Single-quoted property raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "[,]" );
	}, null, "Array element elision raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "{},[]" );
	}, null, "Comma expression raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "[]\n,{}" );
	}, null, "Newline-containing comma expression raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "\"\"\n\"\"" );
	}, null, "Automatic semicolon insertion raises an error" );

	assert.strictEqual( jQuery.parseJSON( [ 0 ] ), 0, "Input cast to string" );
} );

QUnit.test( "jQuery.isArray", function( assert ) {
	assert.expect( 1 );

	assert.strictEqual( jQuery.isArray, Array.isArray, "Array.isArray equals jQuery.isArray" );
} );

QUnit.test( "jQuery.nodeName", function( assert ) {
	assert.expect( 8 );

	assert.strictEqual( typeof jQuery.nodeName, "function", "jQuery.nodeName is a function" );

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "div" ), "div" ),
		true,
		"Basic usage (true)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "div" ), "span" ),
		false,
		"Basic usage (false)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "div" ), "DIV" ),
		true,
		"Ignores case in the name parameter"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "section" ), "section" ),
		true,
		"Works on HTML5 tags (true)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "section" ), "article" ),
		false,
		"Works on HTML5 tags (false)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "custom-element" ), "custom-element" ),
		true,
		"Works on custom elements (true)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "custom-element" ), "my-element" ),
		false,
		"Works on custom elements (true)"
	);
} );


QUnit.test( "type", function( assert ) {
	assert.expect( 28 );

	assert.equal( jQuery.type( null ), "null", "null" );
	assert.equal( jQuery.type( undefined ), "undefined", "undefined" );
	assert.equal( jQuery.type( true ), "boolean", "Boolean" );
	assert.equal( jQuery.type( false ), "boolean", "Boolean" );
	assert.equal( jQuery.type( Boolean( true ) ), "boolean", "Boolean" );
	assert.equal( jQuery.type( 0 ), "number", "Number" );
	assert.equal( jQuery.type( 1 ), "number", "Number" );
	assert.equal( jQuery.type( Number( 1 ) ), "number", "Number" );
	assert.equal( jQuery.type( "" ), "string", "String" );
	assert.equal( jQuery.type( "a" ), "string", "String" );
	assert.equal( jQuery.type( String( "a" ) ), "string", "String" );
	assert.equal( jQuery.type( {} ), "object", "Object" );
	assert.equal( jQuery.type( /foo/ ), "regexp", "RegExp" );
	assert.equal( jQuery.type( new RegExp( "asdf" ) ), "regexp", "RegExp" );
	assert.equal( jQuery.type( [ 1 ] ), "array", "Array" );
	assert.equal( jQuery.type( new Date() ), "date", "Date" );
	assert.equal( jQuery.type( new Function( "return;" ) ), "function", "Function" );
	assert.equal( jQuery.type( function() {} ), "function", "Function" );
	assert.equal( jQuery.type( new Error() ), "error", "Error" );
	assert.equal( jQuery.type( window ), "object", "Window" );
	assert.equal( jQuery.type( document ), "object", "Document" );
	assert.equal( jQuery.type( document.body ), "object", "Element" );
	assert.equal( jQuery.type( document.createTextNode( "foo" ) ), "object", "TextNode" );
	assert.equal( jQuery.type( document.getElementsByTagName( "*" ) ), "object", "NodeList" );

	// Avoid Lint complaints
	var MyString = String,
		MyNumber = Number,
		MyBoolean = Boolean,
		MyObject = Object;
	assert.equal( jQuery.type( new MyBoolean( true ) ), "boolean", "Boolean" );
	assert.equal( jQuery.type( new MyNumber( 1 ) ), "number", "Number" );
	assert.equal( jQuery.type( new MyString( "a" ) ), "string", "String" );
	assert.equal( jQuery.type( new MyObject() ), "object", "Object" );
} );

QUnit[ typeof Symbol === "function" ? "test" : "skip" ]( "type for `Symbol`", function( assert ) {
	assert.expect( 2 );

	assert.equal( jQuery.type( Symbol() ), "symbol", "Symbol" );
	assert.equal( jQuery.type( Object( Symbol() ) ), "symbol", "Symbol" );
} );

QUnit.test( "isFunction", function( assert ) {
	assert.expect( 20 );

	var mystr, myarr, myfunction, fn, obj, nodes, first, input, a;

	// Make sure that false values return false
	assert.ok( !jQuery.isFunction(), "No Value" );
	assert.ok( !jQuery.isFunction( null ), "null Value" );
	assert.ok( !jQuery.isFunction( undefined ), "undefined Value" );
	assert.ok( !jQuery.isFunction( "" ), "Empty String Value" );
	assert.ok( !jQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	assert.ok( jQuery.isFunction( String ), "String Function(" + String + ")" );
	assert.ok( jQuery.isFunction( Array ), "Array Function(" + Array + ")" );
	assert.ok( jQuery.isFunction( Object ), "Object Function(" + Object + ")" );
	assert.ok( jQuery.isFunction( Function ), "Function Function(" + Function + ")" );

	// When stringified, this could be misinterpreted
	mystr = "function";
	assert.ok( !jQuery.isFunction( mystr ), "Function String" );

	// When stringified, this could be misinterpreted
	myarr = [ "function" ];
	assert.ok( !jQuery.isFunction( myarr ), "Function Array" );

	// When stringified, this could be misinterpreted
	myfunction = { "function": "test" };
	assert.ok( !jQuery.isFunction( myfunction ), "Function Object" );

	// Make sure normal functions still work
	fn = function() {};
	assert.ok( jQuery.isFunction( fn ), "Normal Function" );

	assert.notOk( jQuery.isFunction( Object.create( fn ) ), "custom Function subclass" );

	obj = document.createElement( "object" );

	// Some versions of Firefox and Chrome say this is a function
	assert.ok( !jQuery.isFunction( obj ), "Object Element" );

	// Since 1.3, this isn't supported (#2968)
	//assert.ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	nodes = document.body.childNodes;

	// Safari says this is a function
	assert.ok( !jQuery.isFunction( nodes ), "childNodes Property" );

	first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	assert.ok( !jQuery.isFunction( first ), "A normal DOM Element" );

	input = document.createElement( "input" );
	input.type = "text";
	document.body.appendChild( input );

	// Since 1.3, this isn't supported (#2968)
	//assert.ok( jQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	a = document.createElement( "a" );
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	assert.ok( !jQuery.isFunction( a ), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme( callback ) {
		function fn( response ) {
			callback( response );
		}

		assert.ok( jQuery.isFunction( fn ), "Recursive Function Call" );

		fn( { some: "data" } );
	}

	callme( function() {
		callme( function() {} );
	} );
} );

QUnit.test( "isFunction(cross-realm function)", function( assert ) {
	assert.expect( 1 );

	var iframe, doc,
		done = assert.async();

	// Functions from other windows should be matched
	Globals.register( "iframeDone" );
	window.iframeDone = function( fn, detail ) {
		window.iframeDone = undefined;
		assert.ok( jQuery.isFunction( fn ), "cross-realm function" +
			( detail ? " - " + detail : "" ) );
		done();
	};

	iframe = jQuery( "#qunit-fixture" )[ 0 ].appendChild( document.createElement( "iframe" ) );
	doc = iframe.contentDocument || iframe.contentWindow.document;
	doc.open();
	doc.write( "<body onload='window.parent.iframeDone( function() {} );'>" );
	doc.close();
} );

supportjQuery.each(
	{
		GeneratorFunction: "function*() {}",
		AsyncFunction: "async function() {}"
	},
	function( subclass, source ) {
		var fn;
		try {
			fn = Function( "return " + source )();
		} catch ( e ) {}

		QUnit[ fn ? "test" : "skip" ]( "isFunction(" + subclass + ")",
			function( assert ) {
				assert.expect( 1 );

				assert.equal( jQuery.isFunction( fn ), true, source );
			}
		);
	}
);

QUnit[ typeof Symbol === "function" && Symbol.toStringTag ? "test" : "skip" ](
	"isFunction(custom @@toStringTag)",
	function( assert ) {
		assert.expect( 2 );

		var obj = {},
			fn = function() {};
		obj[ Symbol.toStringTag ] = "Function";
		fn[ Symbol.toStringTag ] = "Object";

		assert.equal( jQuery.isFunction( obj ), false, "function-mimicking object" );
		assert.equal( jQuery.isFunction( fn ), true, "object-mimicking function" );
	}
);

QUnit.test( "jQuery.isWindow", function( assert ) {
	assert.expect( 14 );

	assert.ok( jQuery.isWindow( window ), "window" );
	assert.ok( jQuery.isWindow( document.getElementsByTagName( "iframe" )[ 0 ].contentWindow ), "iframe.contentWindow" );
	assert.ok( !jQuery.isWindow(), "empty" );
	assert.ok( !jQuery.isWindow( null ), "null" );
	assert.ok( !jQuery.isWindow( undefined ), "undefined" );
	assert.ok( !jQuery.isWindow( document ), "document" );
	assert.ok( !jQuery.isWindow( document.documentElement ), "documentElement" );
	assert.ok( !jQuery.isWindow( "" ), "string" );
	assert.ok( !jQuery.isWindow( 1 ), "number" );
	assert.ok( !jQuery.isWindow( true ), "boolean" );
	assert.ok( !jQuery.isWindow( {} ), "object" );
	assert.ok( !jQuery.isWindow( { setInterval: function() {} } ), "fake window" );
	assert.ok( !jQuery.isWindow( /window/ ), "regexp" );
	assert.ok( !jQuery.isWindow( function() {} ), "function" );
} );

QUnit.test( "jQuery.camelCase()", function( assert ) {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the-4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"-ms-take": "msTake"
	};

	assert.expect( 7 );

	jQuery.each( tests, function( key, val ) {
		assert.equal( jQuery.camelCase( key ), val, "Converts: " + key + " => " + val );
	} );
} );

QUnit.test( "jQuery.now", function( assert ) {
	assert.expect( 1 );

	assert.ok( typeof jQuery.now() === "number", "jQuery.now is a function" );
} );

QUnit.test( "jQuery.proxy", function( assert ) {
	assert.expect( 9 );

	var test2, test3, test4, fn, cb,
		test = function() {
			assert.equal( this, thisObject, "Make sure that scope is set properly." );
		},
		thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	jQuery.proxy( test, thisObject )();

	// Another take on it
	jQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	assert.equal( jQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Partial application
	test2 = function( a ) {
		assert.equal( a, "pre-applied", "Ensure arguments can be pre-applied." );
	};
	jQuery.proxy( test2, null, "pre-applied" )();

	// Partial application w/ normal arguments
	test3 = function( a, b ) {
		assert.equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." );
	};
	jQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	test4 = { "meth": function( a ) {
			assert.equal( a, "boom", "Ensure old syntax works." );
		} };
	jQuery.proxy( test4, "meth" )( "boom" );

	// jQuery 1.9 improved currying with `this` object
	fn = function() {
		assert.equal( Array.prototype.join.call( arguments, "," ), "arg1,arg2,arg3", "args passed" );
		assert.equal( this.foo, "bar", "this-object passed" );
	};
	cb = jQuery.proxy( fn, null, "arg1", "arg2" );
	cb.call( thisObject, "arg3" );
} );

QUnit.test( "isNumeric", function( assert ) {
	assert.expect( 43 );

	var t = jQuery.isNumeric,
		ToString = function( value ) {
			this.toString = function() {
				return String( value );
			};
		};

	assert.ok( t( "-10" ), "Negative integer string" );
	assert.ok( t( "0" ), "Zero string" );
	assert.ok( t( "5" ), "Positive integer string" );
	assert.ok( t( -16 ), "Negative integer number" );
	assert.ok( t( 0 ), "Zero integer number" );
	assert.ok( t( 32 ), "Positive integer number" );
	assert.ok( t( "-1.6" ), "Negative floating point string" );
	assert.ok( t( "4.536" ), "Positive floating point string" );
	assert.ok( t( -2.6 ), "Negative floating point number" );
	assert.ok( t( 3.1415 ), "Positive floating point number" );
	assert.ok( t( 1.5999999999999999 ), "Very precise floating point number" );
	assert.ok( t( 8e5 ), "Exponential notation" );
	assert.ok( t( "123e-2" ), "Exponential notation string" );
	assert.ok( t( "040" ), "Legacy octal integer literal string" );
	assert.ok( t( "0xFF" ), "Hexadecimal integer literal string (0x...)" );
	assert.ok( t( "0Xba" ), "Hexadecimal integer literal string (0X...)" );
	assert.ok( t( 0xFFF ), "Hexadecimal integer literal" );

	if ( +"0b1" === 1 ) {
		assert.ok( t( "0b111110" ), "Binary integer literal string (0b...)" );
		assert.ok( t( "0B111110" ), "Binary integer literal string (0B...)" );
	} else {
		assert.ok( true, "Browser does not support binary integer literal (0b...)" );
		assert.ok( true, "Browser does not support binary integer literal (0B...)" );
	}

	if ( +"0o1" === 1 ) {
		assert.ok( t( "0o76" ), "Octal integer literal string (0o...)" );
		assert.ok( t( "0O76" ), "Octal integer literal string (0O...)" );
	} else {
		assert.ok( true, "Browser does not support octal integer literal (0o...)" );
		assert.ok( true, "Browser does not support octal integer literal (0O...)" );
	}

	assert.equal( t( new ToString( "42" ) ), false, "Only limited to strings and numbers" );
	assert.equal( t( "" ), false, "Empty string" );
	assert.equal( t( "        " ), false, "Whitespace characters string" );
	assert.equal( t( "\t\t" ), false, "Tab characters string" );
	assert.equal( t( "abcdefghijklm1234567890" ), false, "Alphanumeric character string" );
	assert.equal( t( "xabcdefx" ), false, "Non-numeric character string" );
	assert.equal( t( true ), false, "Boolean true literal" );
	assert.equal( t( false ), false, "Boolean false literal" );
	assert.equal( t( "bcfed5.2" ), false, "Number with preceding non-numeric characters" );
	assert.equal( t( "7.2acdgs" ), false, "Number with trailing non-numeric characters" );
	assert.equal( t( undefined ), false, "Undefined value" );
	assert.equal( t( null ), false, "Null value" );
	assert.equal( t( NaN ), false, "NaN value" );
	assert.equal( t( Infinity ), false, "Infinity primitive" );
	assert.equal( t( Number.POSITIVE_INFINITY ), false, "Positive Infinity" );
	assert.equal( t( Number.NEGATIVE_INFINITY ), false, "Negative Infinity" );
	assert.equal( t( new ToString( "Devo" ) ), false, "Custom .toString returning non-number" );
	assert.equal( t( {} ), false, "Empty object" );
	assert.equal( t( [] ), false, "Empty array" );
	assert.equal( t( [ 42 ] ), false, "Array with one number" );
	assert.equal( t( function() {} ), false, "Instance of a function" );
	assert.equal( t( new Date() ), false, "Instance of a Date" );
} );

QUnit[ typeof Symbol === "function" ? "test" : "skip" ]( "isNumeric(Symbol)", function( assert ) {
	assert.expect( 2 );

	assert.equal( jQuery.isNumeric( Symbol() ), false, "Symbol" );
	assert.equal( jQuery.isNumeric( Object( Symbol() ) ), false, "Symbol inside an object" );
} );
