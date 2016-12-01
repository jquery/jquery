var $, jQuery;

define( [
	"../core"
], function( jQueryDefined, noGlobal ) {

        "use strict";

        // Map over jQuery in case of overwrite
	
        var _jQuery = jQuery;

	// Map over the $ in case of overwrite
        
	var _$ = $;

	jQueryDefined.noConflict = function( deep ) {
		if ( $ === jQueryDefined ) {
			$ = _$;
		}

		if ( deep && jQuery === jQueryDefined ) {
			jQuery = _jQuery;
		}

		return jQueryDefined;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
        
	if ( !noGlobal ) {
		jQuery = $ = jQueryDefined;
	}
} );
