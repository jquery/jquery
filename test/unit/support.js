module("support", { teardown: moduleTeardown });

test("boxModel", function() {
	expect( 1 );

	equal( jQuery.support.boxModel, document.compatMode === "CSS1Compat" , "jQuery.support.boxModel is sort of tied to quirks mode but unstable since 1.8" );
});

if ( jQuery.css ) {
	testIframeWithCallback( "body background is not lost if set prior to loading jQuery (#9239)", "support/bodyBackground.html", function( color, support ) {
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

testIframeWithCallback( "A background on the testElement does not cause IE8 to crash (#9823)", "support/testElementCrash.html", function() {
	expect(1);
	ok( true, "IE8 does not crash" );
});

testIframeWithCallback( "box-sizing does not affect jQuery.support.shrinkWrapBlocks", "support/shrinkWrapBlocks.html", function( shrinkWrapBlocks ) {
	expect( 1 );
	strictEqual( shrinkWrapBlocks, jQuery.support.shrinkWrapBlocks, "jQuery.support.shrinkWrapBlocks properties are the same" );
});
