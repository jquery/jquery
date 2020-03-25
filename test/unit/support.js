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

if ( jQuery.css ) {
	testIframe(
		"body background is not lost if set prior to loading jQuery (#9239)",
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
// i.e. no old WebKit or old Firefox
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

( function() {
	var browserKey, expected,
		userAgent = window.navigator.userAgent,
		expectedMap = {
			edge: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": false,
				"scrollboxSize": true
			},
			ie_10_11: {
				"ajax": true,
				"boxSizingReliable": false,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": false,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": true,
				"noCloneChecked": false,
				"option": true,
				"optSelected": false,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": false,
				"reliableMarginLeft": true,
				"reliableTrDimensions": false,
				"scrollboxSize": true
			},
			ie_9: {
				"ajax": true,
				"boxSizingReliable": false,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": false,
				"cors": false,
				"createHTMLDocument": true,
				"focusin": true,
				"noCloneChecked": false,
				"option": false,
				"optSelected": false,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": false,
				"reliableMarginLeft": true,
				"reliableTrDimensions": false,
				"scrollboxSize": false
			},
			chrome: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			safari: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			safari_9_10: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": false,
				"pixelPosition": false,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			firefox: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			firefox_60: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": true,
				"reliableMarginLeft": false,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			ios: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": true,
				"pixelPosition": true,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			ios_9_10: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": false,
				"pixelPosition": false,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			ios_8: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": false,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": false,
				"pixelPosition": false,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			ios_7: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": true,
				"checkOn": true,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": false,
				"pixelPosition": false,
				"radioValue": true,
				"reliableMarginLeft": true,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			},
			android: {
				"ajax": true,
				"boxSizingReliable": true,
				"checkClone": false,
				"checkOn": false,
				"clearCloneStyle": true,
				"cors": true,
				"createHTMLDocument": true,
				"focusin": false,
				"noCloneChecked": true,
				"option": true,
				"optSelected": true,
				"pixelBoxStyles": false,
				"pixelPosition": false,
				"radioValue": true,
				"reliableMarginLeft": false,
				"reliableTrDimensions": true,
				"scrollboxSize": true
			}
		};

	// Make the slim build pass tests.
	for ( browserKey in expectedMap ) {
		if ( !jQuery.ajax ) {
			delete expectedMap[ browserKey ].ajax;
			delete expectedMap[ browserKey ].cors;
		}
	}

	if ( /edge\//i.test( userAgent ) ) {
		expected = expectedMap.edge;
	} else if ( /(msie 10\.0|trident\/7\.0)/i.test( userAgent ) ) {
		expected = expectedMap.ie_10_11;
	} else if ( /msie 9\.0/i.test( userAgent ) ) {
		expected = expectedMap.ie_9;
	} else if ( /chrome/i.test( userAgent ) ) {

		// Catches Chrome on Android as well (i.e. the default
		// Android browser on Android >= 4.4).
		expected = expectedMap.chrome;
	} else if ( /\b(?:9|10)\.\d+(\.\d+)* safari/i.test( userAgent ) ) {
		expected = expectedMap.safari_9_10;
	} else if ( /firefox\/(?:4\d|5\d|60)/i.test( userAgent ) ) {
		expected = expectedMap.firefox_60;
	} else if ( /firefox/i.test( userAgent ) ) {
		expected = expectedMap.firefox;
	} else if ( /android 4\.[0-3]/i.test( userAgent ) ) {
		expected = expectedMap.android;
	} else if ( /iphone os (?:9|10)_/i.test( userAgent ) ) {
		expected = expectedMap.ios_9_10;
	} else if ( /iphone os 8_/i.test( userAgent ) ) {
		expected = expectedMap.ios_8;
	} else if ( /iphone os 7_/i.test( userAgent ) ) {
		expected = expectedMap.ios_7;
	} else if ( /(?:iphone|ipad);.*(?:iphone)? os \d+_/i.test( userAgent ) ) {
		expected = expectedMap.ios;
	} else if ( /\b\d+(\.\d+)+ safari/i.test( userAgent ) ) {
		expected = expectedMap.safari;
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

		assert.expect( j );

		for ( i in expected ) {
			if ( jQuery.ajax || i !== "ajax" && i !== "cors" ) {
				assert.equal( computedSupport[ i ], expected[ i ],
					"jQuery.support['" + i + "']: " + computedSupport[ i ] +
						", expected['" + i + "']: " + expected[ i ] );
			} else {
				assert.ok( true, "no ajax; skipping jQuery.support['" + i + "']" );
			}
		}
	} );

	QUnit.test( "Verify most support tests are failing in one " +
		"of tested browsers", function( assert ) {

		var prop, browserKey, supportTestName,
			i = 0,
			supportProps = {},
			failingSupportProps = {},
			whitelist = {
				ajax: true
			};

		for ( prop in computedSupport ) {
			i++;
		}

		assert.expect( i );

		// Record all support props and the failing ones and ensure everyone
		// except a few on a whitelist are failing at least once.
		for ( browserKey in expectedMap ) {
			for ( supportTestName in expectedMap[ browserKey ] ) {
				supportProps[ supportTestName ] = true;
				if ( expectedMap[ browserKey ][ supportTestName ] !== true ) {
					failingSupportProps[ supportTestName ] = true;
				}
			}
		}

		for ( supportTestName in supportProps ) {
			assert.ok( whitelist[ supportTestName ] || failingSupportProps[ supportTestName ],
				"jQuery.support['" + supportTestName + "'] always succeeds; remove it?" );
		}
	} );

} )();
