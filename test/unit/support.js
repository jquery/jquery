module("support", { teardown: moduleTeardown });

test("boxModel", function() {
	expect( 1 );

	equal( jQuery.support.boxModel, document.compatMode === "CSS1Compat" , "jQuery.support.boxModel is sort of tied to quirks mode but unstable since 1.8" );
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

testIframeWithCallback( "A background on the testElement does not cause IE8 to crash (#9823)", "support/testElementCrash.html", function() {
	expect( 1 );
	ok( true, "IE8 does not crash" );
});

testIframeWithCallback( "box-sizing does not affect jQuery.support.shrinkWrapBlocks", "support/shrinkWrapBlocks.html", function( shrinkWrapBlocks ) {
	expect( 1 );
	strictEqual( shrinkWrapBlocks, jQuery.support.shrinkWrapBlocks, "jQuery.support.shrinkWrapBlocks properties are the same" );
});

testIframeWithCallback( "Check CSP (https://developer.mozilla.org/en-US/docs/Security/CSP) restrictions", "support/csp.php", function( support ) {
	expect( 1 );
	deepEqual( jQuery.extend( {}, support ), jQuery.support, "No violations of CSP polices" );
});
