if ( jQuery.browser ) {
	
	module("deprecated");

	// Start jQuery.browser tests
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
	// End of jQuery.browser tests

	test("hover pseudo-event", function() {
		expect(2);

		var balance = 0;
		jQuery( "#firstp" )
			.on( "hovercraft", function() {
				ok( false, "hovercraft is full of ills" );
			})
			.on( "click.hover.me.not", function( e ) {
				equal( e.handleObj.namespace, "hover.me.not", "hover hack doesn't mangle namespaces" );
			})
			.bind("hover", function( e ) {
				if ( e.type === "mouseenter" ) {
					balance++;
				} else if ( e.type === "mouseleave" ) {
					balance--;
				} else {
					ok( false, "hover pseudo: unknown event type "+e.type );
				}
			})
			.trigger("click")
			.trigger("mouseenter")
			.trigger("mouseleave")
			.unbind("hover")
			.trigger("mouseenter");

		equal( balance, 0, "hover pseudo-event" );
	});

}


