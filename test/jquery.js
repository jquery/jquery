// Use the right jQuery source on the test page (and iframes)
( function() {
	/* global loadTests: false */

	var dynamicImportSource,
		FILEPATH = "/test/jquery.js",
		activeScript = [].slice.call( document.getElementsByTagName( "script" ), -1 )[ 0 ],
		parentUrl = activeScript && activeScript.src ?
			activeScript.src.replace( /[?#].*/, "" ) + FILEPATH.replace( /[^/]+/g, ".." ) + "/" :
			"../",
		QUnit = window.QUnit,
		require = window.require,

		// Default to unminified jQuery for directly-opened iframes
		config = QUnit ?

			// QUnit.config is populated from QUnit.urlParams but only at the beginning
			// of the test run. We need to read both.
			{
				esmodules: !!( QUnit.config.esmodules || QUnit.urlParams.esmodules ),
				amd: !!( QUnit.config.amd || QUnit.urlParams.amd )
			} :

			{ dev: true },
		src = config.dev ?
			"dist/jquery.js" :
			"dist/jquery.min.js";

	// Define configuration parameters controlling how jQuery is loaded
	if ( QUnit ) {
		QUnit.config.urlConfig.push( {
			id: "esmodules",
			label: "Load as modules",
			tooltip: "Load the jQuery module file (and its dependencies)"
		}, {
			id: "amd",
			label: "Load with AMD",
			tooltip: "Load the AMD jQuery file (and its dependencies)"
		}, {
			id: "dev",
			label: "Load unminified",
			tooltip: "Load the development (unminified) jQuery file"
		} );
	}

	// Honor ES modules loading on the main window (detected by seeing QUnit on it).
	// This doesn't apply to iframes because they synchronously expect jQuery to be there.
	if ( config.esmodules && QUnit ) {

		// Support: IE 11+, Edge 12 - 18+
		// IE/Edge don't support the dynamic import syntax so they'd crash
		// with a SyntaxError here.
		dynamicImportSource = "" +
			"import( `${ parentUrl }src/jquery.js` )\n" +
			"	.then( ( { default: jQuery } ) => {\n" +
			"		window.jQuery = jQuery;\n" +
			"		if ( typeof loadTests === \"function\" ) {\n" +
			"			// Include tests if specified\n" +
			"			loadTests();\n" +
			"		}\n" +
			"	} )\n" +
			"	.catch( error => {\n" +
			"		console.error( error );\n" +
			"		QUnit.done();\n" +
			"	} );";

		eval( dynamicImportSource );

	// Apply similar treatment for AMD modules
	} else if ( config.amd && QUnit ) {
		require.config( {
			baseUrl: parentUrl
		} );
		src = "amd/jquery";

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
