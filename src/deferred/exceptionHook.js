define( [
	"../core",
	"../deferred"
], function( jQuery ) {

"use strict";

// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
// Notice that Error is a choice too, as ? regex means (0-1) times.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)?Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack );

		// If process stack exists, then give it out as a second warning too.
		if ( stack ) {
			window.console.warn( stack );
		}
	}
};

} );
