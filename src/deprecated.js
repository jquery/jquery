// Limit scope pollution from any deprecated API
// (function() {

jQuery.fn.andSelf = jQuery.fn.addBack;

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

// })();
