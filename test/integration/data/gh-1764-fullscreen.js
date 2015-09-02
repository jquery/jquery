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

	var fullscreenSupported = document.exitFullscreen ||
		document.exitFullscreen ||
		document.msExitFullscreen ||
		document.mozCancelFullScreen ||
		document.webkitExitFullscreen;

	function isFullscreen() {
		return !!( document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement ||
		document.msFullscreenElement );
	}

	function requestFullscreen( element ) {
		if ( !isFullscreen() ) {
			if ( element.requestFullscreen ) {
				element.requestFullscreen();
			} else if ( element.msRequestFullscreen ) {
				element.msRequestFullscreen();
			} else if ( element.mozRequestFullScreen ) {
				element.mozRequestFullScreen();
			} else if ( element.webkitRequestFullscreen ) {
				element.webkitRequestFullscreen();
			}
		}
	}

	function exitFullscreen() {
		if ( document.exitFullscreen ) {
			document.exitFullscreen();
		} else if ( document.msExitFullscreen ) {
			document.msExitFullscreen();
		} else if ( document.mozCancelFullScreen ) {
			document.mozCancelFullScreen();
		} else if ( document.webkitExitFullscreen ) {
			document.webkitExitFullscreen();
		}
	}

	function runTest() {
		var dimensions;
		if ( !fullscreenSupported ) {
			jQuery( mainSelector + " .result" )
				.attr( "class", "result success" )
				.text( "Fullscreen mode is not supported in this browser. Test not run." );
		} else if ( !isFullscreen() ) {
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
			exitFullscreen();
		} else {
			requestFullscreen( jQuery( mainSelector + " .container" )[ 0 ] );
		}
	}

	$( mainSelector + " .toggle-fullscreen" ).on( "click", toggleFullscreen );

	$( document ).on( [
		"webkitfullscreenchange",
		"mozfullscreenchange",
		"fullscreenchange",
		"MSFullscreenChange"
	].join( " " ), runTest );

	runTest();
}
