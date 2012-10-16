if ( jQuery.browser ) {
	module("deprecated");

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

	test("toggle(Function, Function, ...)", function() {
		expect(16);

		var count = 0,
			fn1 = function(e) { count++; },
			fn2 = function(e) { count--; },
			preventDefault = function(e) { e.preventDefault(); },
			link = jQuery("#mark");
		link.click(preventDefault).click().toggle(fn1, fn2).click().click().click().click().click();
		equal( count, 1, "Check for toggle(fn, fn)" );

		jQuery("#firstp").toggle(function () {
			equal(arguments.length, 4, "toggle correctly passes through additional triggered arguments, see #1701" );
		}, function() {}).trigger("click", [ 1, 2, 3 ]);

		var first = 0;
		jQuery("#simon1").one("click", function() {
			ok( true, "Execute event only once" );
			jQuery(this).toggle(function() {
				equal( first++, 0, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
			}, function() {
				equal( first, 1, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
			});
			return false;
		}).click().click().click();

		var turn = 0;
		var fns = [
			function(){
				turn = 1;
			},
			function(){
				turn = 2;
			},
			function(){
				turn = 3;
			}
		];

		var $div = jQuery("<div>&nbsp;</div>").toggle( fns[0], fns[1], fns[2] );
		$div.click();
		equal( turn, 1, "Trying toggle with 3 functions, attempt 1 yields 1");
		$div.click();
		equal( turn, 2, "Trying toggle with 3 functions, attempt 2 yields 2");
		$div.click();
		equal( turn, 3, "Trying toggle with 3 functions, attempt 3 yields 3");
		$div.click();
		equal( turn, 1, "Trying toggle with 3 functions, attempt 4 yields 1");
		$div.click();
		equal( turn, 2, "Trying toggle with 3 functions, attempt 5 yields 2");

		$div.unbind("click",fns[0]);
		var data = jQuery._data( $div[0], "events" );
		ok( !data, "Unbinding one function from toggle unbinds them all");

		// manually clean up detached elements
		$div.remove();

		// Test Multi-Toggles
		var a = [], b = [];
		$div = jQuery("<div/>");
		$div.toggle(function(){ a.push(1); }, function(){ a.push(2); });
		$div.click();
		deepEqual( a, [1], "Check that a click worked." );

		$div.toggle(function(){ b.push(1); }, function(){ b.push(2); });
		$div.click();
		deepEqual( a, [1,2], "Check that a click worked with a second toggle." );
		deepEqual( b, [1], "Check that a click worked with a second toggle." );

		$div.click();
		deepEqual( a, [1,2,1], "Check that a click worked with a second toggle, second click." );
		deepEqual( b, [1,2], "Check that a click worked with a second toggle, second click." );

		// manually clean up detached elements
		$div.remove();
	});

	test("attrFn test", function() {
		expect(1);
		ok(!!jQuery.attrFn, "attrFnPresent");
	});

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
