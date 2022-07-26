/* exported bootstrapFrom */

// `mode` may be "iframe" or not specified.
function bootstrapFrom( mainSelector, mode ) {
	if ( mode === "iframe" && window.parent === window ) {
		jQuery( mainSelector + " .result" )
			.attr( "class", "result warn" )
			.text( "This test should be run in an iframe. Open ../gh-1764-fullscreen.html." );
		jQuery( mainSelector + " .toggle-fullscreen" ).remove();
		return;
	}

	function isFullscreen() {
		return !!( document.fullscreenElement );
	}

	function runTest() {
		var dimensions;
		if ( !isFullscreen() ) {
			jQuery( mainSelector + " .result" )
				.attr( "class", "result warn" )
				.text( "Enable fullscreen mode to fire the test." );
		} else {
			dimensions = jQuery( mainSelector + " .result" ).css( [ "width", "height" ] );
			dimensions.width = parseFloat( dimensions.width ).toFixed( 3 );
			dimensions.height = parseFloat( dimensions.height ).toFixed( 3 );
			if ( dimensions.width === "700.000" && dimensions.height === "56.000" ) {
				jQuery( mainSelector + " .result" )
					.attr( "class", "result success" )
					.text( "Dimensions in fullscreen mode are computed correctly." );
			} else {
				jQuery( mainSelector + " .result" )
					.attr( "class", "result error" )
					.html( "Incorrect dimensions; " +
						"expected: { width: '700.000', height: '56.000' };<br>" +
						"got: { width: '" + dimensions.width + "', height: '" +
						dimensions.height + "' }." );
			}
		}
	}

	function toggleFullscreen() {
		if ( isFullscreen() ) {
			document.exitFullscreen();
		} else {
			jQuery( mainSelector + " .container" )[ 0 ].requestFullscreen();
		}
	}

	$( mainSelector + " .toggle-fullscreen" ).on( "click", toggleFullscreen );

	$( document ).on( "fullscreenchange", runTest );

	runTest();
}
