define(function() {
	/* global globalSetTimeout: false */
	return window.setTimeout || globalSetTimeout;
});
