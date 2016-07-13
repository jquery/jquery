QUnit.module( "deprecated core", {
	setup: function() {
		this.sandbox = sinon.sandbox.create();
	},
	teardown: function() {
		this.sandbox.restore();
		return moduleTeardown.apply( this, arguments );
	}
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
