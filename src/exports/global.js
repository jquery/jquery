define( [
	"../core"
], function( jQuery, noGlobal ) {

        "use strict";

        // Map over jQuery in case of overwrite

        var _jQuery = global.jQuery;

	// Map over the $ in case of overwrite

	var _$ = global.$;

	jQuery.noConflict = function( deep ) {
		if ( this.$ === jQuery ) {
			global.$ = _$;
		}

		if ( deep && global.jQuery === jQuery ) {
			global.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)

	if ( !noGlobal ) {
		global.jQuery = global.$ = jQuery;
	}
} );
