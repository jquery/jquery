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
		"":							"XABC 	X		XABCABCC 	X 	XBB X	XABA	X",
		"once":						"XABC 	X 		X 			X 	X 	X	XABA	X",
		"memory":					"XABC 	XABC 	XABCABCCC 	XA 	XBB	XB	XABA	XC",
		"unique":					"XABC 	X		XABCA		X	XBB	X	XAB		X",
		"stopOnFalse":				"XABC 	X		XABCABCC	X	XBB	X	XA		X",
		"once memory":				"XABC 	XABC	X			XA	X	XA	XABA	XC",
		"once unique":				"XABC 	X		X			X	X	X	XAB		X",
		"once stopOnFalse":			"XABC 	X		X			X	X	X	XA		X",
		"memory unique":			"XABC 	XA		XABCA		XA	XBB	XB	XAB		XC",
		"memory stopOnFalse":		"XABC 	XABC	XABCABCCC	XA	XBB	XB	XA		X",
		"unique stopOnFalse":		"XABC 	X		XABCA		X	XBB	X	XA		X"
	},
	filters = {
		"no filter": undefined,
		"filter": function( fn ) {
			return function() {
				return fn.apply( this, arguments );
			};
		}
	};

jQuery.each( tests, function( flags, resultString ) {

		jQuery.each( filters, function( filterLabel, filter ) {

			test( "jQuery.Callbacks( \"" + flags + "\" ) - " + filterLabel, function() {

				expect( 20 );

				// Give qunit a little breathing room
				stop();
				setTimeout( start, 0 );

				var cblist;
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

			});
		});
});

})();
