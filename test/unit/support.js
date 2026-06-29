QUnit.module( "support", { afterEach: moduleTeardown } );

var computedSupport = getComputedSupport( jQuery.support );

function getComputedSupport( support ) {
	var prop,
		result = {};

	for ( prop in support ) {
		if ( typeof support[ prop ] === "function" ) {
			result[ prop ] = support[ prop ]();
		} else {
			result[ prop ] = support[ prop ];
		}
	}

	return result;
}

if ( includesModule( "css" ) ) {
	testIframe(
		"body background is not lost if set prior to loading jQuery (trac-9239)",
		"support/bodyBackground.html",
		function( assert, jQuery, window, document, color, support ) {
			assert.expect( 2 );
			var okValue = {
				"#000000": true,
				"rgb(0, 0, 0)": true
			};
			assert.ok( okValue[ color ], "color was not reset (" + color + ")" );

			assert.deepEqual( jQuery.extend( {}, support ), computedSupport,
				"Same support properties" );
		}
	);
}

// This test checks CSP only for browsers with "Content-Security-Policy" header support
// i.e. no IE
testIframe(
	"Check CSP (https://developer.mozilla.org/en-US/docs/Security/CSP) restrictions",
	"mock.php?action=cspFrame",
	function( assert, jQuery, window, document, support ) {
		var done = assert.async();

		assert.expect( 2 );
		assert.deepEqual( jQuery.extend( {}, support ), computedSupport,
			"No violations of CSP polices" );

		supportjQuery.get( baseURL + "support/csp.log" ).done( function( data ) {
			assert.equal( data, "", "No log request should be sent" );
			supportjQuery.get( baseURL + "mock.php?action=cspClean" ).done( done );
		} );
	}
);

testIframe(
	"Verify correctness of support tests with bootstrap CSS on the page",
	"support/bootstrap.html",
	function( assert, jQuery, window, document, bodyStyle, support ) {
		assert.expect( 2 );
		assert.strictEqual( bodyStyle.boxSizing, "border-box",
			"border-box applied on body by Bootstrap" );
		assert.deepEqual( jQuery.extend( {}, support ), computedSupport,
			"Same support properties" );
	}
);

testIframe(
	"Verify correctness of support tests with CSS zoom on the root element",
	"support/zoom.html",
	function( assert, jQuery, window, document, htmlStyle, support ) {
		assert.expect( 1 );
		assert.deepEqual( jQuery.extend( {}, support ), computedSupport,
			"Same support properties" );
	}
);

( function() {
	var expected,
		userAgent = window.navigator.userAgent,
		expectedMap = {
			ie_11: {
				reliableColDimensions: 11,
				reliableTrDimensions: false
			},
			chrome: {
				reliableColDimensions: true,
				reliableTrDimensions: true
			},
			safari: {
				reliableColDimensions: false,
				reliableTrDimensions: true
			},
			firefox: {
				reliableColDimensions: false,
				reliableTrDimensions: false
			},
			ios: {
				reliableColDimensions: false,
				reliableTrDimensions: true
			}
		};

	if ( QUnit.isIE ) {
		expected = expectedMap.ie_11;
	} else if ( /\b(?:headless)?chrome\//i.test( userAgent ) ) {

		// Catches Edge, Chrome on Android & Opera as well.
		expected = expectedMap.chrome;
	} else if ( /\bfirefox\//i.test( userAgent ) ) {
		expected = expectedMap.firefox;
	} else if ( /\biphone os \d+_/i.test( userAgent ) ) {
		expected = expectedMap.ios;
	} else if ( /\bversion\/\d+(?:\.\d+)+ safari/i.test( userAgent ) ) {
		if ( navigator.maxTouchPoints > 1 ) {
			expected = expectedMap.ios;
		} else {
			expected = expectedMap.safari;
		}
	}

	QUnit.test( "Verify that support tests resolve as expected per browser", function( assert ) {
		if ( !expected ) {
			assert.expect( 1 );
			assert.ok( false, "Known client: " + userAgent );
		}

		var i, prop,
			j = 0;

		for ( prop in computedSupport ) {
			j++;
		}

		// Add an assertion per undefined support prop as it may
		// not even exist on computedSupport but we still want to run
		// the check.
		for ( prop in expected ) {
			if ( expected[ prop ] === undefined ) {
				j++;
			}
		}

		assert.expect( j );

		for ( i in expected ) {
			assert.equal( computedSupport[ i ], expected[ i ],
				"jQuery.support['" + i + "']: " + computedSupport[ i ] +
					", expected['" + i + "']: " + expected[ i ] +
					";\nUser Agent: " + navigator.userAgent );
		}
	} );

	QUnit.test( "Verify support tests are failing in one of tested browsers",
		function( assert ) {

		var prop, browserKey, supportTestName,
			i = 0,
			supportProps = {},
			failingSupportProps = {};

		for ( prop in computedSupport ) {
			i++;
		}

		// Add an assertion per undefined support prop as it may
		// not even exist on computedSupport but we still want to run
		// the check.
		for ( prop in expected ) {
			if ( expected[ prop ] === undefined ) {
				i++;
			}
		}

		assert.expect( i );

		// Record all support props and the failing ones and ensure every test
		// is failing at least once.
		for ( browserKey in expectedMap ) {
			for ( supportTestName in expectedMap[ browserKey ] ) {
				supportProps[ supportTestName ] = true;
				if ( !expectedMap[ browserKey ][ supportTestName ] ) {
					failingSupportProps[ supportTestName ] = true;
				}
			}
		}

		for ( supportTestName in supportProps ) {
			assert.ok( failingSupportProps[ supportTestName ],
				"jQuery.support['" + supportTestName +
					"'] is expected to fail at least in one browser" );
		}
	} );

} )();
