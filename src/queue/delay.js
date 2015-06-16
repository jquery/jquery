define([
	"../core",
	"../var/timeoutSet",
	"../var/timeoutClear",
	"../queue",
	"../effects" // Delay is optional because of this dependency
], function( jQuery, timeoutSet, timeoutClear ) {

// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = timeoutSet( next, time );
		hooks.stop = function() {
			timeoutClear( timeout );
		};
	});
};

return jQuery.fn.delay;
});
