module("support", { teardown: moduleTeardown });

test("boxModel", function() {
	expect( 1 );

	equal( jQuery.support.boxModel, document.compatMode === "CSS1Compat" , "jQuery.support.boxModel is sort of tied to quirks mode but unstable since 1.8" );
});

if ( jQuery.css ) {
	testIframeWithCallback( "body background is not lost if set prior to loading jQuery (#9238)", "support/bodyBackground", function( color, support ) {
		expect( 2 );
		var i,
			passed = true,
			okValue = {
				"#000000": true,
				"rgb(0, 0, 0)": true
			};
		ok( okValue[ color ], "color was not reset (" + color + ")" );

		for ( i in jQuery.support ) {
			if ( jQuery.support[ i ] !== support[ i ] ) {
				passed = false;
				strictEqual( jQuery.support[ i ], support[ i ], "Support property " + i + " is different" );
			}
		}
		for ( i in support ) {
			if ( !( i in jQuery.support ) ) {
				passed = false;
				strictEqual( jQuery.support[ i ], support[ i ], "Unexpected property: " + i );
			}
		}
		ok( passed, "Same support properties" );
	});
}

testIframeWithCallback( "A background on the testElement does not cause IE8 to crash (#9823)", "support/testElementCrash", function() {
	expect(1);
	ok( true, "IE8 does not crash" );
});

(function() {

	var userAgent = window.navigator.userAgent,
		expected;

	// These tests do not have to stay
	// They are here to help with upcoming support changes for 1.8
	if ( /chrome\/19\.0/i.test(userAgent) ) {
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
			"boxModel":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true
		};
	} else if ( /msie 8\.0/i.test(userAgent) ) {
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
			"boxModel":true,
			"reliableHiddenOffsets":false,
			"ajax":true,
			"cors":false,
			"doesNotIncludeMarginInBodyOffset":true
		};
	} else if ( /msie 7\.0/i.test(userAgent) ) {
		expected = {
			"ajax": true,
			"appendChecked": false,
			"boxModel": true,
			"changeBubbles": false,
			"checkClone": false,
			"checkOn": true,
			"cors": false,
			"cssFloat": false,
			"deleteExpando": false,
			"doesNotIncludeMarginInBodyOffset": true,
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
			"style": false
		};
	} else if ( /msie 6\.0/i.test(userAgent) ) {
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
			"boxModel":true,
			"reliableHiddenOffsets":false,
			"ajax":true,
			"cors":false,
			"doesNotIncludeMarginInBodyOffset":true
		};
	} else if ( /5\.1\.1 safari/i.test(userAgent) ) {
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
			"boxModel":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true
		};
	} else if ( /firefox\/3\.6/i.test(userAgent) ) {
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
			"enctype":false,
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
			"boxModel":true,
			"reliableHiddenOffsets":true,
			"ajax":true,
			"cors":true,
			"doesNotIncludeMarginInBodyOffset":true
		};
	}

	if ( expected ) {
		test("Verify that the support tests resolve as expected per browser", function() {
			for ( var i in expected ) {
				if ( jQuery.ajax || i !== "ajax" && i !== "cors" ) {
					equal( jQuery.support[i], expected[i], "jQuery.support['" + i + "']: " + jQuery.support[i] + ", expected['" + i + "']: " + expected[i]);
				}
			}
		});
	}

})();
