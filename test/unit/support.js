module("support", { teardown: moduleTeardown });

function supportIFrameTest( title, url, noDisplay, func ) {

	if ( noDisplay !== true ) {
		func = noDisplay;
		noDisplay = false;
	}

	test( title, function() {
		var iframe;

		stop();
		window.supportCallback = function() {
			var self = this,
				args = arguments;
			setTimeout( function() {
				window.supportCallback = undefined;
				iframe.remove();
				func.apply( self, args );
				start();
			}, 0 );
		};
		iframe = jQuery( "<div/>" ).css( "display", noDisplay ? "none" : "block" ).append(
				jQuery( "<iframe/>" ).attr( "src", "data/support/" + url + ".html" )
			).appendTo( "body" );
	});
}

supportIFrameTest( "proper boxModel in compatMode CSS1Compat (IE6 and IE7)", "boxModelIE", function( compatMode, boxModel ) {
	ok( compatMode !== "CSS1Compat" || boxModel, "boxModel properly detected" );
});

supportIFrameTest( "body background is not lost if set prior to loading jQuery (#9238)", "bodyBackground", function( color, support ) {
	expect( 2 );
	var okValue = {
			"#000000": true,
			"rgb(0, 0, 0)": true
	};
	ok( okValue[ color ], "color was not reset (" + color + ")" );
	var i, passed = true;
	for ( i in jQuery.support ) {
		if ( jQuery.support[ i ] !== support[ i ] ) {
			passed = false;
			strictEqual( jQuery.support[ i ], support[ i ], "Support property " + i + " is different" );
		}
	}
	for ( i in support ) {
		if ( !( i in jQuery.support ) ) {
			ok = false;
			strictEqual( src[ i ], dest[ i ], "Unexpected property: " + i );
		}
	}
	ok( passed, "Same support properties" );
});

supportIFrameTest( "A background on the testElement does not cause IE8 to crash (#9823)", "testElementCrash", function() {
	expect(1);
	ok( true, "IE8 does not crash" );
});
