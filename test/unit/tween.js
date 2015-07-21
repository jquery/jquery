( function() {

// Can't test what ain't there
if ( !jQuery.fx ) {
	return;
}

var oldRaf = window.requestAnimationFrame;

module( "tween", {
	setup: function() {
		window.requestAnimationFrame = null;
		this.sandbox = sinon.sandbox.create();
		this.clock = this.sandbox.useFakeTimers( 505877050 );
		this._oldInterval = jQuery.fx.interval;
		jQuery.fx.step = {};
		jQuery.fx.interval = 10;
		jQuery.now = Date.now;
	},
	teardown: function() {
		this.sandbox.restore();
		jQuery.now = Date.now;
		jQuery.fx.stop();
		jQuery.fx.interval = this._oldInterval;
		window.requestAnimationFrame = oldRaf;
		return moduleTeardown.apply( this, arguments );
	}
} );

test( "jQuery.Tween - Default propHooks on plain objects", function() {
	expect( 8 );
	var propHooks, defaultHook, testObject, fakeTween, stepSpy;

	propHooks = jQuery.Tween.propHooks;
	equal( typeof propHooks, "object", "jQuery.Tween.propHooks exists" );

	defaultHook = propHooks._default;
	ok( defaultHook, "_default propHook exists" );

	testObject = { test: 0 };
	fakeTween = { elem: testObject, prop: "test", now: 10, unit: "px" };

	equal( defaultHook.get( fakeTween ), 0, "Can get property of object" );

	fakeTween.prop = "testMissing";
	equal( defaultHook.get( fakeTween ), undefined, "Can get missing property on object" );

	defaultHook.set( fakeTween );
	equal( testObject.testMissing, 10, "Sets missing value properly on plain object" );

	fakeTween.prop = "opacity";
	defaultHook.set( fakeTween );
	equal( testObject.opacity, 10, "Correctly set opacity on plain object" );

	fakeTween.prop = "test";
	stepSpy = jQuery.fx.step.test = this.sandbox.spy();

	defaultHook.set( fakeTween );
	ok( stepSpy.calledWith( fakeTween ), "Step function called with Tween" );
	equal( testObject.test, 0, "Because step didn't set, value is unchanged" );
} );

test( "jQuery.Tween - Default propHooks on elements", function() {
	expect( 19 );
	var propHooks, defaultHook, testElement, fakeTween, cssStub, styleStub, stepSpy;

	propHooks = jQuery.Tween.propHooks;
	equal( typeof propHooks, "object", "jQuery.Tween.propHooks exists" );

	defaultHook = propHooks._default;
	ok( defaultHook, "_default propHook exists" );

	testElement = jQuery( "<div>" )[ 0 ];
	fakeTween = { elem: testElement, prop: "height", now: 10, unit: "px" };

	cssStub = this.sandbox.stub( jQuery, "css" ).returns( 10 );

	equal( defaultHook.get( fakeTween ), 10, "Gets expected style value" );
	ok( cssStub.calledWith( testElement, "height", "" ), "Calls jQuery.css correctly" );

	fakeTween.prop = "testOpti";
	testElement.testOpti = 15;
	cssStub.reset();

	equal( defaultHook.get( fakeTween ), 15, "Gets expected value not defined on style" );
	equal( cssStub.callCount, 0, "Did not call jQuery.css" );

	fakeTween.prop = "testMissing";
	equal( defaultHook.get( fakeTween ), 10, "Can get missing property on element" );
	ok( cssStub.calledWith( testElement, "testMissing", "" ), "...using jQuery.css" );

	cssStub.returns( "" );
	equal( defaultHook.get( fakeTween ), 0, "Uses 0 for empty string" );

	cssStub.returns( "auto" );
	equal( defaultHook.get( fakeTween ), 0, "Uses 0 for 'auto'" );

	cssStub.returns( null );
	equal( defaultHook.get( fakeTween ), 0, "Uses 0 for null" );

	cssStub.returns( undefined );
	equal( defaultHook.get( fakeTween ), 0, "Uses 0 for undefined" );

	cssStub.reset();

	// Setters
	styleStub = this.sandbox.stub( jQuery, "style" );
	fakeTween.prop = "height";

	defaultHook.set( fakeTween );
	ok( styleStub.calledWith( testElement, "height", "10px" ),
		"Calls jQuery.style with elem, prop, now+unit" );

	styleStub.reset();
	fakeTween.prop = "testMissing";

	defaultHook.set( fakeTween );
	equal( styleStub.callCount, 0, "Did not call jQuery.style for non css property" );
	equal( testElement.testMissing, 10, "Instead, set value on element directly" );

	jQuery.cssHooks.testMissing = jQuery.noop;
	fakeTween.now = 11;

	defaultHook.set( fakeTween );
	delete jQuery.cssHooks.testMissing;

	ok( styleStub.calledWith( testElement, "testMissing", "11px" ),
		"Presence of cssHooks causes jQuery.style with elem, prop, now+unit" );
	equal( testElement.testMissing, 10, "And value was unchanged" );

	stepSpy = jQuery.fx.step.test = this.sandbox.spy();
	styleStub.reset();

	fakeTween.prop = "test";
	defaultHook.set( fakeTween );
	ok( stepSpy.calledWith( fakeTween ), "Step function called with Tween" );
	equal( styleStub.callCount, 0, "Did not call jQuery.style" );
} );

test( "jQuery.Tween - Plain Object", function() {
	expect( 13 );
	var testObject = { test: 100 },
		testOptions = { duration: 100 },
		tween, easingSpy;

	tween = jQuery.Tween( testObject, testOptions, "test", 0, "linear" );
	equal( tween.elem, testObject, "Sets .element" );
	equal( tween.options, testOptions, "sets .options" );
	equal( tween.prop, "test", "sets .prop" );
	equal( tween.end, 0, "sets .end" );

	equal( tween.easing, "linear", "sets .easing when provided" );

	equal( tween.start, 100, "Reads .start value during construction" );
	equal( tween.now, 100, "Reads .now value during construction" );

	easingSpy = this.sandbox.spy( jQuery.easing, "linear" );

	equal( tween.run( 0.1 ), tween, ".run() returns this" );

	equal( tween.now, 90, "Calculated tween" );

	ok( easingSpy.calledWith( 0.1, 0.1 * testOptions.duration, 0, 1, testOptions.duration ),
		"...using jQuery.easing.linear with back-compat arguments" );
	equal( testObject.test, 90, "Set value" );

	tween.run( 1 );
	equal( testObject.test, 0, "Checking another value" );

	tween.run( 0 );
	equal( testObject.test, 100, "Can even go back in time" );
} );

test( "jQuery.Tween - Element", function() {
	expect( 15 );
	var testElement = jQuery( "<div>" ).css( "height", 100 )[ 0 ],
		testOptions = { duration: 100 },
		tween, easingSpy, eased;

	tween = jQuery.Tween( testElement, testOptions, "height", 0 );
	equal( tween.elem, testElement, "Sets .element" );
	equal( tween.options, testOptions, "sets .options" );
	equal( tween.prop, "height", "sets .prop" );
	equal( tween.end, 0, "sets .end" );

	equal( tween.easing, jQuery.easing._default, "sets .easing to default when not provided" );
	equal( tween.unit, "px", "sets .unit to px when not provided" );

	equal( tween.start, 100, "Reads .start value during construction" );
	equal( tween.now, 100, "Reads .now value during construction" );

	easingSpy = this.sandbox.spy( jQuery.easing, "swing" );

	equal( tween.run( 0.1 ), tween, ".run() returns this" );
	equal( tween.pos, jQuery.easing.swing( 0.1 ), "set .pos" );
	eased = 100 - ( jQuery.easing.swing( 0.1 ) * 100 );
	equal( tween.now, eased, "Calculated tween" );

	ok( easingSpy.calledWith( 0.1, 0.1 * testOptions.duration, 0, 1, testOptions.duration ),
		"...using jQuery.easing.linear with back-compat arguments" );
	equal( parseFloat( testElement.style.height ).toFixed( 2 ), eased.toFixed( 2 ), "Set value" );

	tween.run( 1 );
	equal( testElement.style.height, "0px", "Checking another value" );

	tween.run( 0 );
	equal( testElement.style.height, "100px", "Can even go back in time" );
} );

test( "jQuery.Tween - No duration", function() {
	expect( 3 );

	var testObject = { test: 100 },
		testOptions = { duration: 0 },
		tween, easingSpy;

	tween = jQuery.Tween( testObject, testOptions, "test", 0 );
	easingSpy = this.sandbox.spy( jQuery.easing, "swing" );
	tween.run( 0.5 );

	equal( tween.pos, 0.5, "set .pos correctly" );
	equal( testObject.test, 50, "set value on object correctly" );
	equal( easingSpy.callCount, 0, "didn't ease the value" );
} );

test( "jQuery.Tween - step function option", function() {
	expect( 4 );

	var testObject = { test: 100 },
		testOptions = { duration: 100, step: this.sandbox.spy() },
		tween, propHookSpy;

	propHookSpy = this.sandbox.spy( jQuery.Tween.propHooks._default, "set" );

	tween = jQuery.Tween( testObject, testOptions, "test", 0, "linear" );
	equal( testOptions.step.callCount, 0, "didn't call step on create" );

	tween.run( 0.5 );
	ok( testOptions.step.calledOn( testObject ),
		"Called step function in context of animated object" );
	ok( testOptions.step.calledWith( 50, tween ), "Called step function with correct parameters" );

	ok( testOptions.step.calledBefore( propHookSpy ),
		"Called step function before calling propHook.set" );

} );

test( "jQuery.Tween - custom propHooks", function() {
	expect( 3 );

	var testObject = {},
		testOptions = { duration: 100, step: this.sandbox.spy() },
		propHook = {
			get: sinon.stub().returns( 100 ),
			set: sinon.stub()
		},
		tween;

	jQuery.Tween.propHooks.testHooked = propHook;

	tween = jQuery.Tween( testObject, testOptions, "testHooked", 0, "linear" );
	ok( propHook.get.calledWith( tween ), "called propHook.get on create" );
	equal( tween.now, 100, "Used return value from propHook.get" );

	tween.run( 0.5 );
	ok( propHook.set.calledWith( tween ), "Called propHook.set function with correct parameters" );

	delete jQuery.Tween.propHooks.testHooked;
} );

test( "jQuery.Tween - custom propHooks - advanced values", function() {
	expect( 5 );

	var testObject = {},
		testOptions = { duration: 100, step: this.sandbox.spy() },
		propHook = {
			get: sinon.stub().returns( [ 0, 0 ] ),
			set: sinon.spy()
		},
		tween;

	jQuery.Tween.propHooks.testHooked = propHook;

	tween = jQuery.Tween( testObject, testOptions, "testHooked", [ 1, 1 ], "linear" );
	ok( propHook.get.calledWith( tween ), "called propHook.get on create" );
	deepEqual( tween.start, [ 0, 0 ], "Used return value from get" );

	tween.run( 0.5 );

	// Some day this NaN assumption might change - perhaps add a "calc" helper to the hooks?
	ok( isNaN( tween.now ), "Used return value from propHook.get" );
	equal( tween.pos, 0.5, "But the eased percent is still available" );
	ok( propHook.set.calledWith( tween ), "Called propHook.set function with correct parameters" );

	delete jQuery.Tween.propHooks.testHooked;
} );

} )();
