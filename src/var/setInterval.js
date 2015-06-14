define(function() {
	/* global globalSetInterval: false */
	return window.setInterval || globalSetInterval;
});
