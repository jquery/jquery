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
