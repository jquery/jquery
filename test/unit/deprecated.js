module("deprecated");

// Start jQuery.browser tests
if ( jQuery.browser && jQuery.uaMatch ) {
	if ( jQuery.get && !isLocal ) {
		asyncTest( "browser", function() {
			jQuery.get( "data/ua.txt", function( data ) {
				var uas = data.split( "\n" );
				expect( (uas.length - 1) * 2 );

				jQuery.each(uas, function() {
					var parts = this.split( "\t" ),
							agent = parts[2],
							ua;

					if ( agent ) {
						ua = jQuery.uaMatch( agent );
						equal( ua.browser, parts[0], "browser (" + agent + ")" );
						equal( ua.version, parts[1], "version (" + agent + ")" );
					}
				});

				start();
			});
		});
	}
}
// End of jQuery.browser tests
