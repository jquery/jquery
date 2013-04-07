module("support", { teardown: moduleTeardown });

test( "zoom of doom (#13089)", function() {
	expect( 1 );

	if ( jQuery.support.inlineBlockNeedsLayout ) {
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

		deepEqual( jQuery.extend( {}, support ), jQuery.support, "Same support properties" );
	});
}

testIframeWithCallback( "A non-1 zoom on body doesn't cause WebKit to fail box-sizing test", "support/boxSizing.html", function( boxSizing ) {
	expect( 1 );
	equal( boxSizing, jQuery.support.boxSizing, "box-sizing properly detected on page with non-1 body zoom" );
});

testIframeWithCallback( "A background on the testElement does not cause IE8 to crash (#9823)", "support/testElementCrash.html", function() {
	expect( 1 );
	ok( true, "IE8 does not crash" );
});

testIframeWithCallback( "box-sizing does not affect jQuery.support.shrinkWrapBlocks", "support/shrinkWrapBlocks.html", function( shrinkWrapBlocks ) {
	expect( 1 );
	strictEqual( shrinkWrapBlocks, jQuery.support.shrinkWrapBlocks, "jQuery.support.shrinkWrapBlocks properties are the same" );
});

(function() {
	var expected,
		userAgent = window.navigator.userAgent;

	// These tests do not have to stay
	// They are here to help with upcoming support changes for 1.8
	if ( /chrome/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":true,
			"tbody":true,
			"htmlSerialize":true,
			"style":true,
			"hrefNormalized":true,
			"opacity":true,
			"cssFloat":true,
			"checkOn":true,
			"optSelected":true,
			"getSetAttribute":true,
			"enctype":true,
			"html5Clone":true,
			"submitBubbles":true,
			"changeBubbles":true,
			"focusinBubbles":false,
			"deleteExpando":true,
			"noCloneEvent":true,
			"inlineBlockNeedsLayout":false,
			"shrinkWrapBlocks":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"optDisabled":true,
			"radioValue":true,
			"checkClone":true,
			"appendChecked":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"clearCloneStyle": true,
			"ownLast": false
		};
	} else if ( /opera.*version\/12\.1/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":true,
			"tbody":true,
			"htmlSerialize":true,
			"style":true,
			"hrefNormalized":true,
			"opacity":true,
			"cssFloat":true,
			"checkOn":true,
			"optSelected":true,
			"getSetAttribute":true,
			"enctype":true,
			"html5Clone":true,
			"submitBubbles":true,
			"changeBubbles":true,
			"focusinBubbles":false,
			"deleteExpando":true,
			"noCloneEvent":true,
			"inlineBlockNeedsLayout":false,
			"shrinkWrapBlocks":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"optDisabled":true,
			"radioValue":false,
			"checkClone":true,
			"appendChecked":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"clearCloneStyle": true,
			"ownLast": false
		};
	} else if ( /msie 10\.0/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":true,
			"tbody":true,
			"htmlSerialize":true,
			"style":true,
			"hrefNormalized":true,
			"opacity":true,
			"cssFloat":true,
			"checkOn":true,
			"optSelected":false,
			"getSetAttribute":true,
			"enctype":true,
			"html5Clone":true,
			"submitBubbles":true,
			"changeBubbles":true,
			"focusinBubbles":true,
			"deleteExpando":true,
			"noCloneEvent":true,
			"inlineBlockNeedsLayout":false,
			"shrinkWrapBlocks":false,
			"reliableMarginRight":true,
			"noCloneChecked":false,
			"optDisabled":true,
			"radioValue":false,
			"checkClone":true,
			"appendChecked":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"clearCloneStyle": false,
			"ownLast": false
		};
	} else if ( /msie 9\.0/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":true,
			"tbody":true,
			"htmlSerialize":true,
			"style":true,
			"hrefNormalized":true,
			"opacity":true,
			"cssFloat":true,
			"checkOn":true,
			"optSelected":false,
			"getSetAttribute":true,
			"enctype":true,
			"html5Clone":true,
			"submitBubbles":true,
			"changeBubbles":true,
			"focusinBubbles":true,
			"deleteExpando":true,
			"noCloneEvent":true,
			"inlineBlockNeedsLayout":false,
			"shrinkWrapBlocks":false,
			"reliableMarginRight":true,
			"noCloneChecked":false,
			"optDisabled":true,
			"radioValue":false,
			"checkClone":true,
			"appendChecked":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":false,
			"clearCloneStyle": false,
			"ownLast": false
		};
	} else if ( /msie 8\.0/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":false,
			"tbody":true,
			"htmlSerialize":false,
			"style":false,
			"hrefNormalized":true,
			"opacity":false,
			"cssFloat":false,
			"checkOn":true,
			"optSelected":false,
			"getSetAttribute":true,
			"enctype":true,
			"html5Clone":false,
			"submitBubbles":false,
			"changeBubbles":false,
			"focusinBubbles":true,
			"deleteExpando":false,
			"noCloneEvent":false,
			"inlineBlockNeedsLayout":false,
			"shrinkWrapBlocks":false,
			"reliableMarginRight":true,
			"noCloneChecked":false,
			"optDisabled":true,
			"radioValue":false,
			"checkClone":true,
			"appendChecked":true,
			"reliableHiddenOffsets":false,
			"ajax":true,
			"cors":false,
			"clearCloneStyle": true,
			"ownLast": true
		};
	} else if ( /msie 7\.0/i.test( userAgent ) ) {
		expected = {
			"ajax": true,
			"appendChecked": false,
			"changeBubbles": false,
			"checkClone": false,
			"checkOn": true,
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
			"leadingWhitespace": false,
			"noCloneChecked": false,
			"noCloneEvent": false,
			"opacity": false,
			"optDisabled": true,
			"optSelected": false,
			"radioValue": false,
			"reliableHiddenOffsets": false,
			"reliableMarginRight": true,
			"shrinkWrapBlocks": false,
			"submitBubbles": false,
			"tbody": false,
			"style": false,
			"clearCloneStyle": true,
			"ownLast": true
		};
	} else if ( /msie 6\.0/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":false,
			"tbody":false,
			"htmlSerialize":false,
			"style":false,
			"hrefNormalized":false,
			"opacity":false,
			"cssFloat":false,
			"checkOn":true,
			"optSelected":false,
			"getSetAttribute":false,
			"enctype":true,
			"html5Clone":false,
			"submitBubbles":false,
			"changeBubbles":false,
			"focusinBubbles":true,
			"deleteExpando":false,
			"noCloneEvent":false,
			"inlineBlockNeedsLayout":true,
			"shrinkWrapBlocks":true,
			"reliableMarginRight":true,
			"noCloneChecked":false,
			"optDisabled":true,
			"radioValue":false,
			"checkClone":false,
			"appendChecked":false,
			"reliableHiddenOffsets":false,
			"ajax":true,
			"cors":false,
			"clearCloneStyle": true,
			"ownLast": true
		};
	} else if ( /5\.1\.1 safari/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":true,
			"tbody":true,
			"htmlSerialize":true,
			"style":true,
			"hrefNormalized":true,
			"opacity":true,
			"cssFloat":true,
			"checkOn":false,
			"optSelected":true,
			"getSetAttribute":true,
			"enctype":true,
			"html5Clone":true,
			"submitBubbles":true,
			"changeBubbles":true,
			"focusinBubbles":false,
			"deleteExpando":true,
			"noCloneEvent":true,
			"inlineBlockNeedsLayout":false,
			"shrinkWrapBlocks":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"optDisabled":true,
			"radioValue":true,
			"checkClone":false,
			"appendChecked":false,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"clearCloneStyle": true,
			"ownLast": false
		};
	} else if ( /firefox/i.test( userAgent ) ) {
		expected = {
			"leadingWhitespace":true,
			"tbody":true,
			"htmlSerialize":true,
			"style":true,
			"hrefNormalized":true,
			"opacity":true,
			"cssFloat":true,
			"checkOn":true,
			"optSelected":true,
			"getSetAttribute":true,
			"enctype":true,
			"html5Clone":true,
			"submitBubbles":true,
			"changeBubbles":true,
			"focusinBubbles":false,
			"deleteExpando":true,
			"noCloneEvent":true,
			"inlineBlockNeedsLayout":false,
			"shrinkWrapBlocks":false,
			"reliableMarginRight":true,
			"noCloneChecked":true,
			"optDisabled":true,
			"radioValue":true,
			"checkClone":true,
			"appendChecked":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"clearCloneStyle": true,
			"ownLast": false
		};
	}

	if ( expected ) {
		test("Verify that the support tests resolve as expected per browser", function() {
			expect( 30 );

			for ( var i in expected ) {
				if ( jQuery.ajax || i !== "ajax" && i !== "cors" ) {
					equal( jQuery.support[i], expected[i], "jQuery.support['" + i + "']: " + jQuery.support[i] + ", expected['" + i + "']: " + expected[i]);
				} else {
					ok( true, "no ajax; skipping jQuery.support['" + i + "']" );
				}
			}
		});
	}

})();

// Support: Safari 5.1
// Shameless browser-sniff, but Safari 5.1 mishandles CSP
if ( !( typeof navigator !== "undefined" &&
	(/ AppleWebKit\/\d.*? Version\/(\d+)/.exec(navigator.userAgent) || [])[1] < 6 ) ) {

	testIframeWithCallback( "Check CSP (https://developer.mozilla.org/en-US/docs/Security/CSP) restrictions", "support/csp.php", function( support ) {
		expect( 1 );
		deepEqual( jQuery.extend( {}, support ), jQuery.support, "No violations of CSP polices" );
	});
}
