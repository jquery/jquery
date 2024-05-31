// Use the right jQuery source on the test page (and iframes)
( function() {
	var dynamicImportSource, config, src,
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

		// Support: IE 11+
		// IE doesn't support the dynamic import syntax so it would crash
		// with a SyntaxError here.
		dynamicImportSource = "" +
			"import( `${ parentUrl }/src/jquery.js` )\n" +
			"	.then( ( { jQuery } ) => {\n" +
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

	// Otherwise, load synchronously
	} else {
		document.write( "<script id='jquery-js' nonce='jquery+hardcoded+nonce' src='" + parentUrl + "/" + src + "'><\x2Fscript>" );
	}

} )();
