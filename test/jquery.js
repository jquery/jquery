// Use the right jQuery source on the test page (and iframes)
( function() {
	/* global loadTests: false */

	var config, src,
		parentUrl = window.location.protocol + "//" + window.location.host,
		QUnit = window.QUnit;

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
			id: "esmodules",
			label: "Load as modules",
			tooltip: "Load the jQuery module file (and its dependencies)"
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

	// Honor ES modules loading on the main window (detected by seeing QUnit on it).
	// This doesn't apply to iframes because they synchronously expect jQuery to be there.
	if ( config.esmodules && QUnit ) {

		import( `${ parentUrl }/src/jquery.js` )
			.then( ( { jQuery } ) => {
				window.jQuery = jQuery;

				// Include tests if specified
				if ( typeof loadTests === "function" ) {
					loadTests();
				}
			} )
			.catch( error => {
				console.error( error );
				QUnit.done();
			} );

	// Otherwise, load synchronously
	} else {
		document.write( "<script id='jquery-js' nonce='jquery+hardcoded+nonce' src='" + parentUrl + "/" + src + "'><\x2Fscript>" );
	}

} )();
