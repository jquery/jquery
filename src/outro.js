// Array of plugins
var plugins = jQuery[ jQuery.expando + "_plugins" ] = [],
	parentPlugins,
	iPlugins,
	lengthPlugins;

// Add a plugin
// A plugin is a function that takes the jQuery instance
// as its context and unique parameter
jQuery.addPlugin = function( fn ) {
	fn.call( jQuery, jQuery );
	plugins.push( fn );
};

// Copy plugins if asked and if context is a jQuery instance
if ( copyPlugins && jQuery.isArray( ( parentPlugins = this[ this.expando + "_plugins" ] ) ) ) {
	lengthPlugins = parentPlugins.length;
	for( iPlugins = 0; iPlugins < lengthPlugins; iPlugins++ ) {
		jQuery.addPlugin( parentPlugins[ iPlugins ] );
	}
}

// Attach newInstance method
jQuery.newInstance = newInstance;

// Return new instance
return jQuery;

})();
})(window);
