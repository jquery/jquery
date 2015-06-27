( function() {

// Can't test what ain't there
if ( !jQuery.fx ) {
	return;
}

var oldRaf = window.requestAnimationFrame;

QUnit.module( "tween", {
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

QUnit.test( "jQuery.Tween - Default propHooks on plain objects", function( assert ) {
	assert.expect( 8 );
	var propHooks, defaultHook, testObject, fakeTween, stepSpy;

	propHooks = jQuery.Tween.propHooks;
	assert.equal( typeof propHooks, "object", "jQuery.Tween.propHooks exists" );

	defaultHook = propHooks._default;
	assert.ok( defaultHook, "_default propHook exists" );

	testObject = { test: 0 };
	fakeTween = { elem: testObject, prop: "test", now: 10, unit: "px" };

	assert.equal( defaultHook.get( fakeTween ), 0, "Can get property of object" );

	fakeTween.prop = "testMissing";
	assert.equal( defaultHook.get( fakeTween ), undefined, "Can get missing property on object" );

	defaultHook.set( fakeTween );
	assert.equal( testObject.testMissing, 10, "Sets missing value properly on plain object" );

	fakeTween.prop = "opacity";
	defaultHook.set( fakeTween );
	assert.equal( testObject.opacity, 10, "Correctly set opacity on plain object" );

	fakeTween.prop = "test";
	stepSpy = jQuery.fx.step.test = this.sandbox.spy();

	defaultHook.set( fakeTween );
	assert.ok( stepSpy.calledWith( fakeTween ), "Step function called with Tween" );
	assert.equal( testObject.test, 0, "Because step didn't set, value is unchanged" );
} );

QUnit.test( "jQuery.Tween - Default propHooks on elements", function( assert ) {
	assert.expect( 19 );
	var propHooks, defaultHook, testElement, fakeTween, cssStub, styleStub, stepSpy;

	propHooks = jQuery.Tween.propHooks;
	assert.equal( typeof propHooks, "object", "jQuery.Tween.propHooks exists" );

	defaultHook = propHooks._default;
	assert.ok( defaultHook, "_default propHook exists" );

	testElement = jQuery( "<div>" )[ 0 ];
	fakeTween = { elem: testElement, prop: "height", now: 10, unit: "px" };

	cssStub = this.sandbox.stub( jQuery, "css" ).returns( 10 );

	assert.equal( defaultHook.get( fakeTween ), 10, "Gets expected style value" );
	assert.ok( cssStub.calledWith( testElement, "height", "" ), "Calls jQuery.css correctly" );

	fakeTween.prop = "testOpti";
	testElement.testOpti = 15;
	cssStub.reset();

	assert.equal( defaultHook.get( fakeTween ), 15, "Gets expected value not defined on style" );
	assert.equal( cssStub.callCount, 0, "Did not call jQuery.css" );

	fakeTween.prop = "testMissing";
	assert.equal( defaultHook.get( fakeTween ), 10, "Can get missing property on element" );
	assert.ok( cssStub.calledWith( testElement, "testMissing", "" ), "...using jQuery.css" );

	cssStub.returns( "" );
	assert.equal( defaultHook.get( fakeTween ), 0, "Uses 0 for empty string" );

	cssStub.returns( "auto" );
	assert.equal( defaultHook.get( fakeTween ), 0, "Uses 0 for 'auto'" );

	cssStub.returns( null );
	assert.equal( defaultHook.get( fakeTween ), 0, "Uses 0 for null" );

	cssStub.returns( undefined );
	assert.equal( defaultHook.get( fakeTween ), 0, "Uses 0 for undefined" );

	cssStub.reset();

	// Setters
	styleStub = this.sandbox.stub( jQuery, "style" );
	fakeTween.prop = "height";

	defaultHook.set( fakeTween );
	assert.ok( styleStub.calledWith( testElement, "height", "10px" ),
		"Calls jQuery.style with elem, prop, now+unit" );

	styleStub.reset();
	fakeTween.prop = "testMissing";

	defaultHook.set( fakeTween );
	assert.equal( styleStub.callCount, 0, "Did not call jQuery.style for non css property" );
	assert.equal( testElement.testMissing, 10, "Instead, set value on element directly" );

	jQuery.cssHooks.testMissing = jQuery.noop;
	fakeTween.now = 11;

	defaultHook.set( fakeTween );
	delete jQuery.cssHooks.testMissing;

	assert.ok( styleStub.calledWith( testElement, "testMissing", "11px" ),
		"Presence of cssHooks causes jQuery.style with elem, prop, now+unit" );
	assert.equal( testElement.testMissing, 10, "And value was unchanged" );

	stepSpy = jQuery.fx.step.test = this.sandbox.spy();
	styleStub.reset();

	fakeTween.prop = "test";
	defaultHook.set( fakeTween );
	assert.ok( stepSpy.calledWith( fakeTween ), "Step function called with Tween" );
	assert.equal( styleStub.callCount, 0, "Did not call jQuery.style" );
} );

QUnit.test( "jQuery.Tween - Plain Object", function( assert ) {
	assert.expect( 13 );
	var testObject = { test: 100 },
		testOptions = { duration: 100 },
		tween, easingSpy;

	tween = jQuery.Tween( testObject, testOptions, "test", 0, "linear" );
	assert.equal( tween.elem, testObject, "Sets .element" );
	assert.equal( tween.options, testOptions, "sets .options" );
	assert.equal( tween.prop, "test", "sets .prop" );
	assert.equal( tween.end, 0, "sets .end" );

	assert.equal( tween.easing, "linear", "sets .easing when provided" );

	assert.equal( tween.start, 100, "Reads .start value during construction" );
	assert.equal( tween.now, 100, "Reads .now value during construction" );

	easingSpy = this.sandbox.spy( jQuery.easing, "linear" );

	assert.equal( tween.run( 0.1 ), tween, ".run() returns this" );

	assert.equal( tween.now, 90, "Calculated tween" );

	assert.ok( easingSpy.calledWith( 0.1 ), "...using jQuery.easing.linear" );
	assert.equal( testObject.test, 90, "Set value" );

	tween.run( 1 );
	assert.equal( testObject.test, 0, "Checking another value" );

	tween.run( 0 );
	assert.equal( testObject.test, 100, "Can even go back in time" );
} );

QUnit.test( "jQuery.Tween - Element", function( assert ) {
	assert.expect( 15 );
	var testElement = jQuery( "<div>" ).css( "height", 100 )[ 0 ],
		testOptions = { duration: 100 },
		tween, easingSpy, eased;

	tween = jQuery.Tween( testElement, testOptions, "height", 0 );
	assert.equal( tween.elem, testElement, "Sets .element" );
	assert.equal( tween.options, testOptions, "sets .options" );
	assert.equal( tween.prop, "height", "sets .prop" );
	assert.equal( tween.end, 0, "sets .end" );

	assert.equal(
		tween.easing,
		jQuery.easing._default,
		"sets .easing to default when not provided"
	);
	assert.equal( tween.unit, "px", "sets .unit to px when not provided" );

	assert.equal( tween.start, 100, "Reads .start value during construction" );
	assert.equal( tween.now, 100, "Reads .now value during construction" );

	easingSpy = this.sandbox.spy( jQuery.easing, "swing" );

	assert.equal( tween.run( 0.1 ), tween, ".run() returns this" );
	assert.equal( tween.pos, jQuery.easing.swing( 0.1 ), "set .pos" );
	eased = 100 - ( jQuery.easing.swing( 0.1 ) * 100 );
	assert.equal( tween.now, eased, "Calculated tween" );

	assert.ok( easingSpy.calledWith( 0.1 ), "...using jQuery.easing.linear" );
	assert.equal(
		parseFloat( testElement.style.height ).toFixed( 2 ),
		eased.toFixed( 2 ), "Set value"
	);

	tween.run( 1 );
	assert.equal( testElement.style.height, "0px", "Checking another value" );

	tween.run( 0 );
	assert.equal( testElement.style.height, "100px", "Can even go back in time" );
} );

QUnit.test( "jQuery.Tween - No duration", function( assert ) {
	assert.expect( 3 );

	var testObject = { test: 100 },
		testOptions = { duration: 0 },
		tween, easingSpy;

	tween = jQuery.Tween( testObject, testOptions, "test", 0 );
	easingSpy = this.sandbox.spy( jQuery.easing, "swing" );
	tween.run( 0.5 );

	assert.equal( tween.pos, 0.5, "set .pos correctly" );
	assert.equal( testObject.test, 50, "set value on object correctly" );
	assert.equal( easingSpy.callCount, 0, "didn't ease the value" );
} );

QUnit.test( "jQuery.Tween - step function option", function( assert ) {
	assert.expect( 4 );

	var testObject = { test: 100 },
		testOptions = { duration: 100, step: this.sandbox.spy() },
		tween, propHookSpy;

	propHookSpy = this.sandbox.spy( jQuery.Tween.propHooks._default, "set" );

	tween = jQuery.Tween( testObject, testOptions, "test", 0, "linear" );
	assert.equal( testOptions.step.callCount, 0, "didn't call step on create" );

	tween.run( 0.5 );
	assert.ok(
		testOptions.step.calledOn( testObject ),
		"Called step function in context of animated object"
	);
	assert.ok(
		testOptions.step.calledWith( 50, tween ),
		"Called step function with correct parameters"
	);
	assert.ok(
		testOptions.step.calledBefore( propHookSpy ),
		"Called step function before calling propHook.set"
	);

} );

QUnit.test( "jQuery.Tween - custom propHooks", function( assert ) {
	assert.expect( 3 );

	var testObject = {},
		testOptions = { duration: 100, step: this.sandbox.spy() },
		propHook = {
			get: sinon.stub().returns( 100 ),
			set: sinon.stub()
		},
		tween;

	jQuery.Tween.propHooks.testHooked = propHook;

	tween = jQuery.Tween( testObject, testOptions, "testHooked", 0, "linear" );
	assert.ok( propHook.get.calledWith( tween ), "called propHook.get on create" );
	assert.equal( tween.now, 100, "Used return value from propHook.get" );

	tween.run( 0.5 );
	assert.ok(
		propHook.set.calledWith( tween ),
		"Called propHook.set function with correct parameters"
	);

	delete jQuery.Tween.propHooks.testHooked;
} );

QUnit.test( "jQuery.Tween - custom propHooks - advanced values", function( assert ) {
	assert.expect( 5 );

	var testObject = {},
		testOptions = { duration: 100, step: this.sandbox.spy() },
		propHook = {
			get: sinon.stub().returns( [ 0, 0 ] ),
			set: sinon.spy()
		},
		tween;

	jQuery.Tween.propHooks.testHooked = propHook;

	tween = jQuery.Tween( testObject, testOptions, "testHooked", [ 1, 1 ], "linear" );
	assert.ok( propHook.get.calledWith( tween ), "called propHook.get on create" );
	assert.deepEqual( tween.start, [ 0, 0 ], "Used return value from get" );

	tween.run( 0.5 );

	// Some day this NaN assumption might change - perhaps add a "calc" helper to the hooks?
	assert.ok( isNaN( tween.now ), "Used return value from propHook.get" );
	assert.equal( tween.pos, 0.5, "But the eased percent is still available" );
	assert.ok(
		propHook.set.calledWith( tween ),
		"Called propHook.set function with correct parameters"
	);

	delete jQuery.Tween.propHooks.testHooked;
} );

} )();
