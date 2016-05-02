QUnit.module( "support", { teardown: moduleTeardown } );

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

var computedSupport = getComputedSupport( jQuery.support );

QUnit.test( "zoom of doom (#13089)", function( assert ) {
	assert.expect( 1 );

	if ( computedSupport.inlineBlockNeedsLayout ) {
		ok( document.body.style.zoom, "Added a zoom to the body (#11048, #12869)" );
	} else {
		ok( !document.body.style.zoom, "No zoom added to the body" );
	}
} );

if ( jQuery.css ) {
	testIframeWithCallback(
		"body background is not lost if set prior to loading jQuery (#9239)",
		"support/bodyBackground.html",
		function( color, support, assert ) {
			assert.expect( 2 );
			var okValue = {
				"#000000": true,
				"rgb(0, 0, 0)": true
			};
			assert.ok( okValue[ color ], "color was not reset (" + color + ")" );

			QUnit.stop();

			// Run doc ready tests as well
			jQuery( function() {
				assert.deepEqual( jQuery.extend( {}, support ), computedSupport, "Same support properties" );
				QUnit.start();
			} );
		}
	);

	testIframeWithCallback(
		"box-sizing does not affect jQuery.support.shrinkWrapBlocks",
		"support/shrinkWrapBlocks.html",
		function( shrinkWrapBlocks, assert ) {
			assert.expect( 1 );
			assert.strictEqual(
				shrinkWrapBlocks,
				computedSupport.shrinkWrapBlocks,
				"jQuery.support.shrinkWrapBlocks properties are the same"
			);
	} );
}

testIframeWithCallback(
	"A background on the testElement does not cause IE8 to crash (#9823)",
	"support/testElementCrash.html", function( assert ) {
		assert.expect( 1 );
		assert.ok( true, "IE8 does not crash" );
	}
);

// This test checks CSP only for browsers with "Content-Security-Policy" header support
// i.e. no old WebKit or old Firefox
testIframeWithCallback(
	"Check CSP (https://developer.mozilla.org/en-US/docs/Security/CSP) restrictions",
	"support/csp.php",
	function( support, assert ) {
		var done = assert.async();

		assert.expect( 2 );
		assert.deepEqual( jQuery.extend( {}, support ), computedSupport, "No violations of CSP polices" );

		supportjQuery.get( "data/support/csp.log" ).done( function( data ) {
			assert.equal( data, "", "No log request should be sent" );
			supportjQuery.get( "data/support/csp-clean.php" ).done( done );
		} );
	}
);

( function() {
	var expected, version,
		userAgent = window.navigator.userAgent;

	if ( /edge\//i.test( userAgent ) ) {
		version = userAgent.match( /edge\/(\d+)/i )[ 1 ];
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": version >= 13,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": true,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /opera.*version\/12\.1/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": true,
			"radioValue": false,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": false,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /(msie 10\.0|trident\/7\.0)/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": false,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": true,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": false,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": false,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": true,
			"radioValue": false,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /msie 9\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": false,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": false,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": true,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": false,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": false,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": true,
			"radioValue": false,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /msie 8\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": false,
			"boxSizing": true,
			"boxSizingReliable": false,
			"change": false,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": false,
			"cssFloat": false,
			"deleteExpando": false,
			"enctype": true,
			"focusin": true,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": false,
			"htmlSerialize": false,
			"inlineBlockNeedsLayout": false,
			"input": false,
			"leadingWhitespace": false,
			"noCloneChecked": false,
			"noCloneEvent": false,
			"opacity": false,
			"optDisabled": true,
			"optSelected": false,
			"ownFirst": false,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": false,
			"reliableHiddenOffsets": false,
			"reliableMarginRight": true,
			"reliableMarginLeft": false,
			"shrinkWrapBlocks": false,
			"style": false,
			"submit": false,
			"tbody": true
		};
	} else if ( /msie 7\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": false,
			"attributes": false,
			"boxSizing": false,
			"boxSizingReliable": false,
			"change": false,
			"checkClone": false,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": false,
			"cssFloat": false,
			"deleteExpando": false,
			"enctype": true,
			"focusin": true,
			"getSetAttribute": false,
			"hrefNormalized": false,
			"html5Clone": false,
			"htmlSerialize": false,
			"inlineBlockNeedsLayout": true,
			"input": true,
			"leadingWhitespace": false,
			"noCloneChecked": false,
			"noCloneEvent": false,
			"opacity": false,
			"optDisabled": true,
			"optSelected": false,
			"ownFirst": false,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": false,
			"reliableHiddenOffsets": false,
			"reliableMarginRight": true,
			"reliableMarginLeft": false,
			"shrinkWrapBlocks": false,
			"style": false,
			"submit": false,
			"tbody": false
		};
	} else if ( /msie 6\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": false,
			"attributes": false,
			"boxSizing": false,
			"boxSizingReliable": false,
			"change": false,
			"checkClone": false,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": false,
			"cssFloat": false,
			"deleteExpando": false,
			"enctype": true,
			"focusin": true,
			"getSetAttribute": false,
			"hrefNormalized": false,
			"html5Clone": false,
			"htmlSerialize": false,
			"inlineBlockNeedsLayout": true,
			"input": true,
			"leadingWhitespace": false,
			"noCloneChecked": false,
			"noCloneEvent": false,
			"opacity": false,
			"optDisabled": true,
			"optSelected": false,
			"ownFirst": false,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": false,
			"reliableHiddenOffsets": false,
			"reliableMarginRight": true,
			"reliableMarginLeft": false,
			"shrinkWrapBlocks": true,
			"style": false,
			"submit": false,
			"tbody": false
		};
	} else if ( /chrome/i.test( userAgent ) ) {

		// Catches Chrome on Android as well (i.e. the default
		// Android browser on Android >= 4.4).
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": true,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /\b9\.\d(\.\d+)* safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /8\.0(\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /5\.[01](\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": false,
			"checkOn": false,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": false,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /6\.0(\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /firefox/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": true,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": false,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /iphone os 9_/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /iphone os 8_/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /iphone os 7_/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /iphone os 6_/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /android 4\.[0-3]/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": false,
			"checkOn": false,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": true,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"reliableMarginLeft": false,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
	} else if ( /android 2\.3/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"attributes": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": false,
			"clearCloneStyle": false,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusin": false,
			"getSetAttribute": true,
			"hrefNormalized": true,
			"html5Clone": true,
			"htmlSerialize": true,
			"inlineBlockNeedsLayout": false,
			"input": true,
			"leadingWhitespace": true,
			"noCloneChecked": true,
			"noCloneEvent": true,
			"opacity": true,
			"optDisabled": false,
			"optSelected": true,
			"ownFirst": true,
			"pixelMarginRight": true,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": false,
			"reliableMarginLeft": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submit": true,
			"tbody": true
		};
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

} )();
