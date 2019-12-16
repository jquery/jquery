// Use the right jQuery source on the test page (and iframes)
( function() {
	/* global loadTests: false */

	var config, src,
		FILEPATH = "/test/jquery.js",
		activeScript = [].slice.call( document.getElementsByTagName( "script" ), -1 )[ 0 ],
		parentUrl = activeScript && activeScript.src ?
			activeScript.src.replace( /[?#].*/, "" ) + FILEPATH.replace( /[^/]+/g, ".." ) + "/" :
			"../",
		QUnit = window.QUnit,
		require = window.require;

	function getQUnitConfig() {
		var config = Object.create( null );

		// Default to unminified jQuery for directly-opened iframes
		if ( !QUnit ) {
			config.dev = true;
		} else {

			// QUnit.config is populated from QUnit.urlParams but only at the beginning
			// of the test run. We need to read both.
			QUnit.config.urlConfig.forEach( function( entry ) {
				config[ entry.id ] = QUnit.config[ entry.id ] != null ?
					QUnit.config[ entry.id ] :
					QUnit.urlParams[ entry.id ];
			} );
		}

		return config;
	}

	// Define configuration parameters controlling how jQuery is loaded
	if ( QUnit ) {
		QUnit.config.urlConfig.push( {
			id: "amd",
			label: "Load with AMD",
			tooltip: "Load the AMD jQuery file (and its dependencies)"
		}, {
			id: "dev",
			label: "Load unminified",
			tooltip: "Load the development (unminified) jQuery file"
		} );
	}

	config = getQUnitConfig();

	src = config.dev ?
		"dist/jquery.js" :
		"dist/jquery.min.js";

	// Honor AMD loading on the main window (detected by seeing QUnit on it).
	// This doesn't apply to iframes because they synchronously expect jQuery to be there.
	if ( config.amd && QUnit ) {
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
