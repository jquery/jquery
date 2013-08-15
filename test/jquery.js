// Use the right jQuery source on the test page (and iframes)
(function() {
	/* global loadTests: true, testSubproject: false */
	/* jshint eqeqeq: false */

	var i, len,
		// Parent is the current window if not an iframe, which is fine
		src = /^(.*)test\//.exec( parent.location.pathname )[1],
		QUnit = QUnit || parent.QUnit,
		require = require || parent.require;

	// Config parameter to force basic code paths
	QUnit.config.urlConfig.push({
		id: "basic",
		label: "Bypass optimizations",
		tooltip: "Force use of the most basic code by disabling native querySelectorAll; contains; compareDocumentPosition"
	});
	if ( QUnit.urlParams.basic ) {
		document.querySelectorAll = null;
		document.documentElement.contains = null;
		document.documentElement.compareDocumentPosition = null;
	}

	// iFrames won't load AMD (the iframe tests synchronously expect jQuery to be there)
	QUnit.config.urlConfig.push({
		id: "amd",
		label: "Load with AMD",
		tooltip: "Load the AMD jQuery file (and its dependencies)"
	});
	if ( QUnit.urlParams.amd && parent == window ) {
		require.config({ baseUrl: src });
		src = "src/jquery";
		// Include tests if specified
		if ( typeof loadTests !== "undefined" ) {
			QUnit.config.autostart = false;
			require( [ src ], function() {
				// Ensure load order (to preserve test numbers)
				(function loadDep() {
					var dep = loadTests.shift();
					if ( dep ) {
						require( [ dep ], loadDep );
					} else {
						// Subproject tests must be last because they replace our test fixture
						testSubproject( "Sizzle", "../bower_components/sizzle/test/", /^unit\/.*\.js$/ );

						QUnit.start();
					}
				})();
			});
		} else {
			require( [ src ] );
		}
		return;
	}

	// Config parameter to use minified jQuery
	QUnit.config.urlConfig.push({
		id: "dev",
		label: "Load unminified",
		tooltip: "Load the development (unminified) jQuery file"
	});
	if ( QUnit.urlParams.dev ) {
		src += "dist/jquery.js";
	} else {
		src += "dist/jquery.min.js";
	}

	// Load jQuery
	document.write( "<script id='jquery-js' src='" + src + "'><\x2Fscript>" );

	// Load tests synchronously if available
	if ( typeof loadTests !== "undefined" ) {
		for ( i = 0, len = loadTests.length; i < len; i++ ) {
			document.write( "<script src='" + loadTests.shift() + "'><\x2Fscript>" );
		}
	}
})();
