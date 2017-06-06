define( [
	"../core"
], function( jQuery, noGlobal ) {

        "use strict";

        // Map over jQuery in case of overwrite

        var _jQuery = window.jQuery;

	// Map over the $ in case of overwrite

	var _$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( this.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)

	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}
} );
