jQuery.noConflict(); // Allow the test to run with other libs or jQuery's.

// jQuery-specific QUnit.reset
(function() {
	var reset = QUnit.reset;
	var ajaxSettings = jQuery.ajaxSettings
	QUnit.reset = function() {
		reset.apply(this, arguments);
		jQuery.event.global = {};
		jQuery.ajaxSettings = jQuery.extend({}, ajaxSettings);
	};
})();

// load testswarm agent
(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + 9 ) );
	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}

	// (Temporarily) Disable Ajax tests to reduce network strain
	isLocal = QUnit.isLocal = true;

	document.write("<scr" + "ipt src='http://swarm.jquery.org/js/inject.js?" + (new Date).getTime() + "'></scr" + "ipt>");
})();
