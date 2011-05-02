// Run minified source from dist (do make first)
// Should be loaded before QUnit but after src
(function() {
	if ( /jquery\=min/.test( window.location.search ) ) {
		jQuery.noConflict( true );
		document.write(unescape("%3Cscript%20src%3D%27../dist/jquery.min.js%27%3E%3C/script%3E"));
	}
})();