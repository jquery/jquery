QUnit.module( "callbacks", {
	afterEach: moduleTeardown
} );

( function() {

if ( !includesModule( "callbacks" ) ) {
	return;
}

( function() {

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
			return "'" + flags + "'";
		}
		var output = [], key;
		for ( key in flags ) {
			output.push( "'" + key + "': " + flags[ key ] );
		}
		return "{ " + output.join( ", " ) + " }";
	}

jQuery.each( tests, function( strFlags, resultString ) {

		var objectFlags = {};

		jQuery.each( strFlags.split( " " ), function() {
			if ( this.length ) {
				objectFlags[ this ] = true;
			}
		} );

		jQuery.each( filters, function( filterLabel ) {

			jQuery.each( {
				"string": strFlags,
				"object": objectFlags
			}, function( flagsTypes, flags ) {

				QUnit.test( "jQuery.Callbacks( " + showFlags( flags ) + " ) - " + filterLabel, function( assert ) {

					assert.expect( 29 );

					var cblist,
						results = resultString.split( /\s+/ );

					// Basic binding and firing
					output = "X";
					cblist = jQuery.Callbacks( flags );
					assert.strictEqual( cblist.locked(), false, ".locked() initially false" );
					assert.strictEqual( cblist.disabled(), false, ".disabled() initially false" );
					assert.strictEqual( cblist.fired(), false, ".fired() initially false" );
					cblist.add( function( str ) {
						output += str;
					} );
					assert.strictEqual( cblist.fired(), false, ".fired() still false after .add" );
					cblist.fire( "A" );
					assert.strictEqual( output, "XA", "Basic binding and firing" );
					assert.strictEqual( cblist.fired(), true, ".fired() detects firing" );
					output = "X";
					cblist.disable();
					cblist.add( function( str ) {
						output += str;
					} );
					assert.strictEqual( output, "X", "Adding a callback after disabling" );
					cblist.fire( "A" );
					assert.strictEqual( output, "X", "Firing after disabling" );
					assert.strictEqual( cblist.disabled(), true, ".disabled() becomes true" );
					assert.strictEqual( cblist.locked(), true, "disabling locks" );

					// Emptying while firing (trac-13517)
					cblist = jQuery.Callbacks( flags );
					cblist.add( cblist.empty );
					cblist.add( function() {
						assert.ok( false, "not emptied" );
					} );
					cblist.fire();

					// Disabling while firing
					cblist = jQuery.Callbacks( flags );
					cblist.add( cblist.disable );
					cblist.add( function() {
						assert.ok( false, "not disabled" );
					} );
					cblist.fire();

					// Basic binding and firing (context, arguments)
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function() {
						assert.equal( this, window, "Basic binding and firing (context)" );
						output += Array.prototype.join.call( arguments, "" );
					} );
					cblist.fireWith( window, [ "A", "B" ] );
					assert.strictEqual( output, "XAB", "Basic binding and firing (arguments)" );

					// fireWith with no arguments
					output = "";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function() {
						assert.equal( this, window, "fireWith with no arguments (context is window)" );
						assert.strictEqual( arguments.length, 0, "fireWith with no arguments (no arguments)" );
					} );
					cblist.fireWith();

					// Basic binding, removing and firing
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( outputA, outputB, outputC );
					cblist.remove( outputB, outputC );
					cblist.fire();
					assert.strictEqual( output, "XA", "Basic binding, removing and firing" );

					// Empty
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( outputA );
					cblist.add( outputB );
					cblist.add( outputC );
					cblist.empty();
					cblist.fire();
					assert.strictEqual( output, "X", "Empty" );

					// Locking
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function( str ) {
						output += str;
					} );
					cblist.lock();
					cblist.add( function( str ) {
						output += str;
					} );
					cblist.fire( "A" );
					cblist.add( function( str ) {
						output += str;
					} );
					assert.strictEqual( output, "X", "Lock early" );
					assert.strictEqual( cblist.locked(), true, "Locking reflected in accessor" );

					// Locking while firing (gh-1990)
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( cblist.lock );
					cblist.add( function( str ) {
						output += str;
					} );
					cblist.fire( "A" );
					assert.strictEqual( output, "XA", "Locking doesn't abort execution (gh-1990)" );

					// Ordering
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function() {
						cblist.add( outputC );
						outputA();
					}, outputB );
					cblist.fire();
					assert.strictEqual( output, results.shift(), "Proper ordering" );

					// Add and fire again
					output = "X";
					cblist.add( function() {
						cblist.add( outputC );
						outputA();
					}, outputB );
					assert.strictEqual( output, results.shift(), "Add after fire" );

					output = "X";
					cblist.fire();
					assert.strictEqual( output, results.shift(), "Fire again" );

					// Multiple fire
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( function( str ) {
						output += str;
					} );
					cblist.fire( "A" );
					assert.strictEqual( output, "XA", "Multiple fire (first fire)" );
					output = "X";
					cblist.add( function( str ) {
						output += str;
					} );
					assert.strictEqual( output, results.shift(), "Multiple fire (first new callback)" );
					output = "X";
					cblist.fire( "B" );
					assert.strictEqual( output, results.shift(), "Multiple fire (second fire)" );
					output = "X";
					cblist.add( function( str ) {
						output += str;
					} );
					assert.strictEqual( output, results.shift(), "Multiple fire (second new callback)" );

					// Return false
					output = "X";
					cblist = jQuery.Callbacks( flags );
					cblist.add( outputA, function() { return false; }, outputB );
					cblist.add( outputA );
					cblist.fire();
					assert.strictEqual( output, results.shift(), "Callback returning false" );

					// Add another callback (to control lists with memory do not fire anymore)
					output = "X";
					cblist.add( outputC );
					assert.strictEqual( output, results.shift(), "Adding a callback after one returned false" );

					// Callbacks are not iterated
					output = "";
					function handler() {
						output += "X";
					}
					handler.method = function() {
						output += "!";
					};
					cblist = jQuery.Callbacks( flags );
					cblist.add( handler );
					cblist.add( handler );
					cblist.fire();
					assert.strictEqual( output, results.shift(), "No callback iteration" );
				} );
			} );
		} );
} );

} )();

QUnit.test( "jQuery.Callbacks( options ) - options are copied", function( assert ) {

	assert.expect( 1 );

	var options = {
			"unique": true
		},
		cb = jQuery.Callbacks( options ),
		count = 0,
		fn = function() {
			assert.ok( !( count++ ), "called once" );
		};
	options[ "unique" ] = false;
	cb.add( fn, fn );
	cb.fire();
} );

QUnit.test( "jQuery.Callbacks.fireWith - arguments are copied", function( assert ) {

	assert.expect( 1 );

	var cb = jQuery.Callbacks( "memory" ),
		args = [ "hello" ];

	cb.fireWith( null, args );
	args[ 0 ] = "world";

	cb.add( function( hello ) {
		assert.strictEqual( hello, "hello", "arguments are copied internally" );
	} );
} );

QUnit.test( "jQuery.Callbacks.remove - should remove all instances", function( assert ) {

	assert.expect( 1 );

	var cb = jQuery.Callbacks();

	function fn() {
		assert.ok( false, "function wasn't removed" );
	}

	cb.add( fn, fn, function() {
		assert.ok( true, "end of test" );
	} ).remove( fn ).fire();
} );

QUnit.test( "jQuery.Callbacks.has", function( assert ) {

	assert.expect( 13 );

	var cb = jQuery.Callbacks();
	function getA() {
		return "A";
	}
	function getB() {
		return "B";
	}
	function getC() {
		return "C";
	}
	cb.add( getA, getB, getC );
	assert.strictEqual( cb.has(), true, "No arguments to .has() returns whether callback function(s) are attached or not" );
	assert.strictEqual( cb.has( getA ), true, "Check if a specific callback function is in the Callbacks list" );

	cb.remove( getB );
	assert.strictEqual( cb.has( getB ), false, "Remove a specific callback function and make sure its no longer there" );
	assert.strictEqual( cb.has( getA ), true, "Remove a specific callback function and make sure other callback function is still there" );

	cb.empty();
	assert.strictEqual( cb.has(), false, "Empty list and make sure there are no callback function(s)" );
	assert.strictEqual( cb.has( getA ), false, "Check for a specific function in an empty() list" );

	cb.add( getA, getB, function() {
		assert.strictEqual( cb.has(), true, "Check if list has callback function(s) from within a callback function" );
		assert.strictEqual( cb.has( getA ), true, "Check if list has a specific callback from within a callback function" );
	} ).fire();

	assert.strictEqual( cb.has(), true, "Callbacks list has callback function(s) after firing" );

	cb.disable();
	assert.strictEqual( cb.has(), false, "disabled() list has no callback functions (returns false)" );
	assert.strictEqual( cb.has( getA ), false, "Check for a specific function in a disabled() list" );

	cb = jQuery.Callbacks( "unique" );
	cb.add( getA );
	cb.add( getA );
	assert.strictEqual( cb.has(), true, "Check if unique list has callback function(s) attached" );
	cb.lock();
	assert.strictEqual( cb.has(), false, "locked() list is empty and returns false" );
} );

QUnit.test( "jQuery.Callbacks() - adding a string doesn't cause a stack overflow", function( assert ) {

	assert.expect( 1 );

	jQuery.Callbacks().add( "hello world" );

	assert.ok( true, "no stack overflow" );
} );

QUnit.test( "jQuery.Callbacks() - disabled callback doesn't fire (gh-1790)", function( assert ) {

	assert.expect( 1 );

	var cb = jQuery.Callbacks(),
		fired = false,
		shot = function() { fired = true; };

	cb.disable();
	cb.empty();
	cb.add( shot );
	cb.fire();
	assert.ok( !fired, "Disabled callback function didn't fire" );
} );

QUnit.test( "jQuery.Callbacks() - list with memory stays locked (gh-3469)", function( assert ) {

	assert.expect( 3 );

	var cb = jQuery.Callbacks( "memory" ),
		fired = 0,
		count1 = function() { fired += 1; },
		count2 = function() { fired += 10; };

	cb.add( count1 );
	cb.fire();
	assert.equal( fired, 1, "Pre-lock() fire" );

	cb.lock();
	cb.add( count2 );
	assert.equal( fired, 11, "Post-lock() add" );

	cb.fire();
	assert.equal( fired, 11, "Post-lock() fire ignored" );
} );

} )();
