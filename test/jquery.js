// Use the right jQuery source on the test page (and iframes)
( function() {
	/* global loadTests: false */

	var FILEPATH = "/test/jquery.js",
		activeScript = [].slice.call( document.getElementsByTagName( "script" ), -1 )[ 0 ],
		parentUrl = activeScript && activeScript.src ?
			activeScript.src.replace( /[?#].*/, "" ) + FILEPATH.replace( /[^/]+/g, ".." ) + "/" :
			"../",
		QUnit = window.QUnit || parent.QUnit,
		require = window.require || parent.require,

		// Default to unminified jQuery for directly-opened iframes
		urlParams = QUnit ?
			QUnit.urlParams :
			{ dev: true },
		src = urlParams.dev ?
			"dist/jquery.js" :
			"dist/jquery.min.js";

	// Define configuration parameters controlling how jQuery is loaded
	if ( QUnit ) {

		// AMD loading is asynchronous and incompatible with synchronous test loading in Karma
		if ( !window.__karma__ ) {
			QUnit.config.urlConfig.push( {
				id: "amd",
				label: "Load with AMD",
				tooltip: "Load the AMD jQuery file (and its dependencies)"
			} );
		}

		QUnit.config.urlConfig.push( {
			id: "dev",
			label: "Load unminified",
			tooltip: "Load the development (unminified) jQuery file"
		} );
	}

	// Honor AMD loading on the main window (detected by seeing QUnit on it).
	// This doesn't apply to iframes because they synchronously expect jQuery to be there.
	if ( urlParams.amd && window.QUnit ) {
		require.config( {
			baseUrl: parentUrl
		} );
		src = "src/jquery";

		// Include tests if specified
		if ( typeof loadTests !== "undefined" ) {
			require( [ src ], loadTests );
		} else {
			require( [ src ] );
		}

	// Otherwise, load synchronously
	} else {
		document.write( "<script id='jquery-js' nonce='jquery+hardcoded+nonce' src='" + parentUrl + src + "'><\x2Fscript>" );
	}

} )();
