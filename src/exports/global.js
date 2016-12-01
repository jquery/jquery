define( [
	"../core"
], function( jQuery, noGlobal ) {
	
        // Map over jQuery in case of overwrite

        var _jQuery = this.jQuery;

	// Map over the $ in case of overwrite

	var _$ = this.$;

	jQuery.noConflict = function( deep ) {
		if ( this.$ === jQuery ) {
			this.$ = _$;
		}

		if ( deep && this.jQuery === jQuery ) {
			this.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)

	if ( !noGlobal ) {
		this.jQuery = this.$ = jQuery;
	}
} );
