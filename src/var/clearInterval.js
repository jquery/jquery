define(function() {
	/* global globalClearInterval: false */
	return window.clearInterval || globalClearInterval;
});
