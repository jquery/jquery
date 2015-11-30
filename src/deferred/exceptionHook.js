define( [
	"../core",
	"../deferred"
], function( jQuery ) {

// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error ) {

	// Support: IE9
	// Console exists when dev tools are open, which can happen at any time
	var warn = window.console && window.console.warn;

	if ( error && rerrorNames.test( error.name ) ) {
		warn( "jQuery.Deferred exception: " + error.message );
	}
};

} );
