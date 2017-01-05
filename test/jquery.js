// Use the right jQuery source on the test page (and iframes)
( function() {
	/* global loadTests: false */

	var path = window.location.pathname.split( "test" )[ 0 ],
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
		QUnit.config.urlConfig.push( {
			id: "amd",
			label: "Load with AMD",
			tooltip: "Load the AMD jQuery file (and its dependencies)"
		} );
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
			baseUrl: path
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
		document.write( "<script id='jquery-js' src='" + path + src + "'><\x2Fscript>" );

		// Synchronous-only tests (other tests are loaded from the test page)
		if ( typeof loadTests !== "undefined" ) {
			document.write( "<script src='" + path + "test/unit/ready.js'><\x2Fscript>" );
		}
	}

} )();
