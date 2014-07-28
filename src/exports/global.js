define([
	"../core",
	"../var/strundefined"
], function( jQuery, strundefined ) {

var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	//Define two const values for "forEach"'s loop  preConditionValue
	FOREACH_PRECONDITION_STATUSES = {
		NORMAL: 0,
		CONTINUE: 1,
		BREAK: 2
	},
	
jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
},

//Export the const values for "forEach"'s loop
jQuery.prototype.FOREACHSTATUS = FOREACH_PRECONDITION_STATUSES;


// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}

});
