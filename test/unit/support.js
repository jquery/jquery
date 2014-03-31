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

	if ( computedSupport.inlineBlockNeedsLayout ) {
		ok( document.body.style.zoom, "Added a zoom to the body (#11048, #12869)" );
	} else {
		ok( !document.body.style.zoom, "No zoom added to the body" );
	}
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

testIframeWithCallback( "box-sizing does not affect jQuery.support.shrinkWrapBlocks", "support/shrinkWrapBlocks.html", function( shrinkWrapBlocks ) {
	expect( 1 );
	strictEqual( shrinkWrapBlocks, computedSupport.shrinkWrapBlocks, "jQuery.support.shrinkWrapBlocks properties are the same" );
});


// This test checkes CSP only for browsers with "Content-Security-Policy" header support
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

	if ( /chrome/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": true,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /opera.*version\/12\.1/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": true,
			"radioValue": false,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /trident\/7\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": false,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": true,
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
			"ownLast": false,
			"pixelPosition": true,
			"radioValue": false,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /msie 10\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": false,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": true,
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
			"ownLast": false,
			"pixelPosition": true,
			"radioValue": false,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /msie 9\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": false,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": false,
			"cors": false,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": true,
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
			"ownLast": false,
			"pixelPosition": true,
			"radioValue": false,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /msie 8\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": false,
			"changeBubbles": false,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": false,
			"cssFloat": false,
			"deleteExpando": false,
			"enctype": true,
			"focusinBubbles": true,
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
			"ownLast": true,
			"pixelPosition": false,
			"radioValue": false,
			"reliableHiddenOffsets": false,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": false,
			"submitBubbles": false,
			"tbody": true
		};
	} else if ( /msie 7\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": false,
			"boxSizing": false,
			"boxSizingReliable": false,
			"changeBubbles": false,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": false,
			"cssFloat": false,
			"deleteExpando": false,
			"enctype": true,
			"focusinBubbles": true,
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
			"ownLast": true,
			"pixelPosition": false,
			"radioValue": false,
			"reliableHiddenOffsets": false,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": false,
			"submitBubbles": false,
			"tbody": false
		};
	} else if ( /msie 6\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": false,
			"boxSizing": false,
			"boxSizingReliable": false,
			"changeBubbles": false,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": false,
			"cssFloat": false,
			"deleteExpando": false,
			"enctype": true,
			"focusinBubbles": true,
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
			"ownLast": true,
			"pixelPosition": false,
			"radioValue": false,
			"reliableHiddenOffsets": false,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": true,
			"style": false,
			"submitBubbles": false,
			"tbody": false
		};
	} else if ( /7\.0(\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /6\.0(\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /5\.1(\.\d+|) safari/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": false,
			"checkOn": false,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /firefox/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": true,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /iphone os (?:6|7)_/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": true,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /android 2\.3/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": true,
			"checkOn": false,
			"clearCloneStyle": false,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": false,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
		};
	} else if ( /android 4\.[0-3]/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": true,
			"boxSizing": true,
			"boxSizingReliable": true,
			"changeBubbles": true,
			"checkClone": false,
			"checkOn": false,
			"clearCloneStyle": true,
			"cors": true,
			"cssFloat": true,
			"deleteExpando": true,
			"enctype": true,
			"focusinBubbles": false,
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
			"ownLast": false,
			"pixelPosition": false,
			"radioValue": true,
			"reliableHiddenOffsets": true,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"style": true,
			"submitBubbles": true,
			"tbody": true
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
