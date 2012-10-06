module("callbacks", { teardown: moduleTeardown });

(function() {

var output,
	addToOutput = function( string ) {
		return function() {
			output += string;
		};
	},
	outputA = addToOutput( "A" ),
	outputB = addToOutput( "B" ),
	outputC = addToOutput( "C" ),
	tests = {
		"":                   "XABC   X     XABCABCC  X  XBB X   XABA  X   XX",
		"once":               "XABC   X     X         X  X   X   XABA  X   XX",
		"memory":             "XABC   XABC  XABCABCCC XA XBB XB  XABA  XC  XX",
		"unique":             "XABC   X     XABCA     X  XBB X   XAB   X   X",
		"stopOnFalse":        "XABC   X     XABCABCC  X  XBB X   XA    X   XX",
		"once memory":        "XABC   XABC  X         XA X   XA  XABA  XC  XX",
		"once unique":        "XABC   X     X         X  X   X   XAB   X   X",
		"once stopOnFalse":   "XABC   X     X         X  X   X   XA    X   XX",
		"memory unique":      "XABC   XA    XABCA     XA XBB XB  XAB   XC  X",
		"memory stopOnFalse": "XABC   XABC  XABCABCCC XA XBB XB  XA    X   XX",
		"unique stopOnFalse": "XABC   X     XABCA     X  XBB X   XA    X   X"
	},
	filters = {
		"no filter": undefined,
		"filter": function( fn ) {
			return function() {
				return fn.apply( this, arguments );
			};
		}
	};
	
	function showFlags( flags ) {
		if ( typeof flags === "string" ) {
			return '"' + flags + '"';
		}
		var output = [], key;
		for ( key in flags ) {
			output.push( '"' + key + '": ' + flags[ key ] );
		}
		return "{ " + output.join( ", " ) + " }";
	}

jQuery.each( tests, function( strFlags, resultString ) {

		var objectFlags = {};

		jQuery.each( strFlags.split( " " ), function() {
			if ( this.length ) {
				objectFlags[ this ] = true;
			}
		});

		jQuery.each( filters, function( filterLabel, filter ) {

			jQuery.each( { "string": strFlags, "object": objectFlags }, function( flagsTypes, flags ) {

				test( "jQuery.Callbacks( " + showFlags( flags ) + " ) - " + filterLabel, function() {

					expect( 21 );

					// Give qunit a little breathing room
					stop();
					setTimeout( start, 0 );

					var cblist,
						results = resultString.split( /\s+/ );

					// Basic binding and firing
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add(function( str ) {
						output += str;
					});
					cblist.fire( "A" );
					strictEqual( output, "XA", "Basic binding and firing" );
					strictEqual( cblist.fired(), true, ".fired() detects firing" );
					output = "X";
					cblist.disable();
					cblist.add(function( str ) {
						output += str;
					});
					strictEqual( output, "X", "Adding a callback after disabling" );
					cblist.fire( "A" );
					strictEqual( output, "X", "Firing after disabling" );

					// Basic binding and firing (context, arguments)
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add(function() {
						equal( this, window, "Basic binding and firing (context)" );
						output += Array.prototype.join.call( arguments, "" );
					});
					cblist.fireWith( window, [ "A", "B" ] );
					strictEqual( output, "XAB", "Basic binding and firing (arguments)" );

					// fireWith with no arguments
					output = "";
					cblist = jQuery.Callbacks( flags );
					cblist.add(function() {
						equal( this, window, "fireWith with no arguments (context is window)" );
						strictEqual( arguments.length, 0, "fireWith with no arguments (no arguments)" );
					});
					cblist.fireWith();

					// Basic binding, removing and firing
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( outputA, outputB, outputC );
					cblist.remove( outputB, outputC );
					cblist.fire();
					strictEqual( output, "XA", "Basic binding, removing and firing" );

					// Empty
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( outputA );
					cblist.add( outputB );
					cblist.add( outputC );
					cblist.empty();
					cblist.fire();
					strictEqual( output, "X", "Empty" );

					// Locking
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function( str ) {
						output += str;
					});
					cblist.lock();
					cblist.add( function( str ) {
						output += str;
					});
					cblist.fire( "A" );
					cblist.add( function( str ) {
						output += str;
					});
					strictEqual( output, "X", "Lock early" );

					// Ordering
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function() {
						cblist.add( outputC );
						outputA();
					}, outputB );
					cblist.fire();
					strictEqual( output, results.shift(), "Proper ordering" );

					// Add and fire again
					output = "X";
					cblist.add( function() {
						cblist.add( outputC );
						outputA();
					}, outputB );
					strictEqual( output, results.shift(), "Add after fire" );

					output = "X";
					cblist.fire();
					strictEqual( output, results.shift(), "Fire again" );

					// Multiple fire
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function( str ) {
						output += str;
					} );
					cblist.fire( "A" );
					strictEqual( output, "XA", "Multiple fire (first fire)" );
					output = "X";
					cblist.add( function( str ) {
						output += str;
					} );
					strictEqual( output, results.shift(), "Multiple fire (first new callback)" );
					output = "X";
					cblist.fire( "B" );
					strictEqual( output, results.shift(), "Multiple fire (second fire)" );
					output = "X";
					cblist.add( function( str ) {
						output += str;
					} );
					strictEqual( output, results.shift(), "Multiple fire (second new callback)" );

					// Return false
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( outputA, function() { return false; }, outputB );
					cblist.add( outputA );
					cblist.fire();
					strictEqual( output, results.shift(), "Callback returning false" );

					// Add another callback (to control lists with memory do not fire anymore)
					output = "X";
					cblist.add( outputC );
					strictEqual( output, results.shift(), "Adding a callback after one returned false" );

					// Callbacks are not iterated
					output = "";
					function handler( tmp ) {
						output += "X";
					}
					handler.method = function() {
						output += "!";
					};
					cblist = jQuery.Callbacks( flags );
					cblist.add( handler );
					cblist.add( handler );
					cblist.fire();
					strictEqual( output, results.shift(), "No callback iteration" );
				});
			});
		});
});

})();

test( "jQuery.Callbacks( options ) - options are copied", function() {

	expect( 1 );

	var options = {
			"unique": true
		},
		cb = jQuery.Callbacks( options ),
		count = 0,
		fn = function() {
			ok( !( count++ ), "called once" );
		};
	options["unique"] = false;
	cb.add( fn, fn );
	cb.fire();
});

test( "jQuery.Callbacks.fireWith - arguments are copied", function() {

	expect( 1 );

	var cb = jQuery.Callbacks( "memory" ),
		args = [ "hello" ];

	cb.fireWith( null, args );
	args[ 0 ] = "world";

	cb.add(function( hello ) {
		strictEqual( hello, "hello", "arguments are copied internally" );
	});
});

test( "jQuery.Callbacks.remove - should remove all instances", function() {

	expect( 1 );

	var cb = jQuery.Callbacks();

	function fn() {
		ok( false, "function wasn't removed" );
	}

	cb.add( fn, fn, function() {
		ok( true, "end of test" );
	}).remove( fn ).fire();
});

test( "jQuery.Callbacks() - adding a string doesn't cause a stack overflow", function() {

	expect( 1 );

	jQuery.Callbacks().add( "hello world" );

	ok( true, "no stack overflow" );
});
