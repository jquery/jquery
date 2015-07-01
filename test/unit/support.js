module("support", { teardown: moduleTeardown });

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

test( "zoom of doom (#13089)", function() {
	expect( 1 );

	ok( !document.body.style.zoom, "No zoom added to the body" );
});

if ( jQuery.css ) {
	testIframeWithCallback( "body background is not lost if set prior to loading jQuery (#9239)", "support/bodyBackground.html", function( color, support ) {
		expect( 2 );
		var okValue = {
			"#000000": true,
			"rgb(0, 0, 0)": true
		};
		ok( okValue[ color ], "color was not reset (" + color + ")" );

		stop();
		// Run doc ready tests as well
		jQuery(function() {
			deepEqual( jQuery.extend( {}, support ), computedSupport, "Same support properties" );
			start();
		});
	});
}

testIframeWithCallback( "A background on the testElement does not cause IE8 to crash (#9823)", "support/testElementCrash.html", function() {
	expect( 1 );
	ok( true, "IE8 does not crash" );
});


// This test checks CSP only for browsers with "Content-Security-Policy" header support
// i.e. no old WebKit or old Firefox
testIframeWithCallback( "Check CSP (https://developer.mozilla.org/en-US/docs/Security/CSP) restrictions",
	"support/csp.php",
	function( support ) {
		expect( 2 );
		deepEqual( jQuery.extend( {}, support ), computedSupport, "No violations of CSP polices" );

		stop();

		supportjQuery.get( "data/support/csp.log" ).done(function( data ) {
			equal( data, "", "No log request should be sent" );
			supportjQuery.get( "data/support/csp-clean.php" ).done( start );
		});
	}
);

(function() {
	var expected,
		userAgent = window.navigator.userAgent;

	if ( /edge\//i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /(msie 10\.0|trident\/7\.0)/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": false,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": true,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /msie 9\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": false,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": false,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": true,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /msie 8\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": false,
			"boxSizingReliable": false,
			"change": false,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": false,
			"createHTMLDocument": false,
			"cssFloat": false,
			"deleteExpando": false,
			"focusin": true,
			"gBCRDimensions": false,
			"html5Clone": false,
			"htmlSerialize": false,
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
			"style": false,
			"submit": false
		};
	} else if ( /chrome/i.test( userAgent ) ) {
		// Catches Chrome on Android as well (i.e. the default
		// Android browser on Android >= 4.4).
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /8\.0(\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"createHTMLDocument": false,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /(6|7)\.0(\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /firefox/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /iphone os 8/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"createHTMLDocument": false,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /iphone os (6|7)/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /android 4\.[0-3]/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": false,
			"checkOn": false,
			"clearCloneStyle": true,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	} else if ( /android 2\.3/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"attributes": true,
			"boxSizingReliable": true,
			"change": true,
			"checkClone": true,
			"checkOn": false,
			"clearCloneStyle": false,
			"cors": true,
			"createHTMLDocument": true,
			"cssFloat": true,
			"deleteExpando": true,
			"focusin": false,
			"gBCRDimensions": true,
			"html5Clone": true,
			"htmlSerialize": true,
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
			"style": true,
			"submit": true
		};
	}

	if ( expected ) {
		test( "Verify that the support tests resolve as expected per browser", function() {
			var i, prop,
				j = 0;

			for ( prop in computedSupport ) {
				j++;
			}

			expect( j );

			for ( i in expected ) {
				if ( jQuery.ajax || i !== "ajax" && i !== "cors" ) {
					equal( computedSupport[i], expected[i],
						"jQuery.support['" + i + "']: " + computedSupport[i] +
							", expected['" + i + "']: " + expected[i]);
				} else {
					ok( true, "no ajax; skipping jQuery.support['" + i + "']" );
				}
			}
		});
	}

})();
