( function() {

// Can't test what ain't there
if ( !jQuery.fx ) {
	return;
}

var oldRaf = window.requestAnimationFrame,
	defaultPrefilter = jQuery.Animation.prefilters[ 0 ],
	defaultTweener = jQuery.Animation.tweeners[ "*" ][ 0 ],
	startTime = 505877050;

// This module tests jQuery.Animation and the corresponding 1.8+ effects APIs
QUnit.module( "animation", {
	beforeEach: function() {
		window.requestAnimationFrame = null;
		this.sandbox = sinon.sandbox.create();
		this.clock = this.sandbox.useFakeTimers( startTime );
		this._oldInterval = jQuery.fx.interval;
		jQuery.fx.step = {};
		jQuery.fx.interval = 10;
		jQuery.Animation.prefilters = [ defaultPrefilter ];
		jQuery.Animation.tweeners = { "*": [ defaultTweener ] };
	},
	afterEach: function() {
		this.sandbox.restore();
		jQuery.fx.stop();
		jQuery.fx.interval = this._oldInterval;
		window.requestAnimationFrame = oldRaf;
		return moduleTeardown.apply( this, arguments );
	}
} );

QUnit.test( "Animation( subject, props, opts ) - shape", function( assert ) {
	assert.expect( 20 );

	var subject = { test: 0 },
		props = { test: 1 },
		opts = { queue: "fx", duration: 100 },
		animation = jQuery.Animation( subject, props, opts );

	assert.equal(
		animation.elem,
		subject,
		".elem is set to the exact object passed"
	);
	assert.equal(
		animation.originalOptions,
		opts,
		".originalOptions is set to options passed"
	);
	assert.equal(
		animation.originalProperties,
		props,
		".originalProperties is set to props passed"
	);

	assert.notEqual( animation.props, props, ".props is not the original however" );
	assert.deepEqual( animation.props, props, ".props is a copy of the original" );

	assert.deepEqual( animation.opts, {
		duration: 100,
		queue: "fx",
		specialEasing: { test: undefined },
		easing: jQuery.easing._default
	}, ".options is filled with default easing and specialEasing" );

	assert.equal( animation.startTime, startTime, "startTime was set" );
	assert.equal( animation.duration, 100, ".duration is set" );

	assert.equal( animation.tweens.length, 1, ".tweens has one Tween" );
	assert.equal( typeof animation.tweens[ 0 ].run, "function", "which has a .run function" );

	assert.equal( typeof animation.createTween, "function", ".createTween is a function" );
	assert.equal( typeof animation.stop, "function", ".stop is a function" );

	assert.equal( typeof animation.done, "function", ".done is a function" );
	assert.equal( typeof animation.fail, "function", ".fail is a function" );
	assert.equal( typeof animation.always, "function", ".always is a function" );
	assert.equal( typeof animation.progress, "function", ".progress is a function" );

	assert.equal( jQuery.timers.length, 1, "Added a timers function" );
	assert.equal( jQuery.timers[ 0 ].elem, subject, "...with .elem as the subject" );
	assert.equal( jQuery.timers[ 0 ].anim, animation, "...with .anim as the animation" );
	assert.equal( jQuery.timers[ 0 ].queue, opts.queue, "...with .queue" );

	// Cleanup after ourselves by ticking to the end
	this.clock.tick( 100 );
} );

QUnit.test( "Animation.prefilter( fn ) - calls prefilter after defaultPrefilter",
	function( assert ) {
		assert.expect( 1 );

		var prefilter = this.sandbox.stub(),
			defaultSpy = this.sandbox.spy( jQuery.Animation.prefilters, 0 );

		jQuery.Animation.prefilter( prefilter );

		jQuery.Animation( {}, {}, {} );
		assert.ok( prefilter.calledAfter( defaultSpy ), "our prefilter called after" );
	}
);

QUnit.test( "Animation.prefilter( fn, true ) - calls prefilter before defaultPrefilter",
	function( assert ) {
		assert.expect( 1 );

		var prefilter = this.sandbox.stub(),
			defaultSpy = this.sandbox.spy( jQuery.Animation.prefilters, 0 );

		jQuery.Animation.prefilter( prefilter, true );

		jQuery.Animation( {}, {}, {} );
		assert.ok( prefilter.calledBefore( defaultSpy ), "our prefilter called before" );
	}
);

QUnit.test( "Animation.prefilter - prefilter return hooks", function( assert ) {
	assert.expect( 34 );

	var animation, realAnimation, element,
		sandbox = this.sandbox,
		ourAnimation = { stop: this.sandbox.spy() },
		target = { height: 50 },
		props = { height: 100 },
		opts = { duration: 100 },
		prefilter = this.sandbox.spy( function() {
			realAnimation = this;
			sandbox.spy( realAnimation, "createTween" );

			assert.deepEqual( realAnimation.originalProperties, props, "originalProperties" );
			assert.equal( arguments[ 0 ], this.elem, "first param elem" );
			assert.equal( arguments[ 1 ], this.props, "second param props" );
			assert.equal( arguments[ 2 ], this.opts, "third param opts" );
			return ourAnimation;
		} ),
		defaultSpy = sandbox.spy( jQuery.Animation.prefilters, 0 ),
		queueSpy = sandbox.spy( function( next ) {
			next();
		} ),
		TweenSpy = sandbox.spy( jQuery, "Tween" );

	jQuery.Animation.prefilter( prefilter, true );

	sandbox.stub( jQuery.fx, "timer" );

	animation = jQuery.Animation( target, props, opts );

	assert.equal( prefilter.callCount, 1, "Called prefilter" );

	assert.equal(
		defaultSpy.callCount,
		0,
		"Returning something from a prefilter caused remaining prefilters to not run"
	);
	assert.equal( jQuery.fx.timer.callCount, 0, "Returning something never queues a timer" );
	assert.equal(
		animation,
		ourAnimation,
		"Returning something returned it from jQuery.Animation"
	);
	assert.equal(
		realAnimation.createTween.callCount,
		0,
		"Returning something never creates tweens"
	);
	assert.equal( TweenSpy.callCount, 0, "Returning something never creates tweens" );

	// Test overridden usage on queues:
	prefilter.reset();
	element = jQuery( "<div>" )
		.css( "height", 50 )
		.animate( props, 100 )
		.queue( queueSpy )
		.animate( props, 100 )
		.queue( queueSpy )
		.animate( props, 100 )
		.queue( queueSpy );

	assert.equal( prefilter.callCount, 1, "Called prefilter" );
	assert.equal( queueSpy.callCount, 0, "Next function in queue not called" );

	realAnimation.opts.complete.call( realAnimation.elem );
	assert.equal( queueSpy.callCount, 1, "Next function in queue called after complete" );

	assert.equal( prefilter.callCount, 2, "Called prefilter again - animation #2" );
	assert.equal( ourAnimation.stop.callCount, 0, ".stop() on our animation hasn't been called" );

	element.stop();
	assert.equal( ourAnimation.stop.callCount, 1, ".stop() called ourAnimation.stop()" );
	assert.ok(
		!ourAnimation.stop.args[ 0 ][ 0 ],
		".stop( falsy ) (undefined or false are both valid)"
	);

	assert.equal( queueSpy.callCount, 2, "Next queue function called" );
	assert.ok( queueSpy.calledAfter( ourAnimation.stop ), "After our animation was told to stop" );

	// ourAnimation.stop.reset();
	assert.equal( prefilter.callCount, 3, "Got the next animation" );

	ourAnimation.stop.reset();

	// do not clear queue, gotoEnd
	element.stop( false, true );
	assert.ok( ourAnimation.stop.calledWith( true ), ".stop(true) calls .stop(true)" );
	assert.ok( queueSpy.calledAfter( ourAnimation.stop ),
		"and the next queue function ran after we were told" );
} );

QUnit.test( "Animation.tweener( fn ) - unshifts a * tweener", function( assert ) {
	assert.expect( 2 );
	var starTweeners = jQuery.Animation.tweeners[ "*" ];

	jQuery.Animation.tweener( jQuery.noop );
	assert.equal( starTweeners.length, 2 );
	assert.deepEqual( starTweeners, [ jQuery.noop, defaultTweener ] );
} );

QUnit.test( "Animation.tweener( 'prop', fn ) - unshifts a 'prop' tweener", function( assert ) {
	assert.expect( 4 );
	var tweeners = jQuery.Animation.tweeners,
		fn = function() {};

	jQuery.Animation.tweener( "prop", jQuery.noop );
	assert.equal( tweeners.prop.length, 1 );
	assert.deepEqual( tweeners.prop, [ jQuery.noop ] );

	jQuery.Animation.tweener( "prop", fn );
	assert.equal( tweeners.prop.length, 2 );
	assert.deepEqual( tweeners.prop, [ fn, jQuery.noop ] );
} );

QUnit.test(
	"Animation.tweener( 'list of props', fn ) - unshifts a tweener to each prop",
	function( assert ) {
		assert.expect( 2 );
		var tweeners = jQuery.Animation.tweeners,
			fn = function() {};

		jQuery.Animation.tweener( "list of props", jQuery.noop );
		assert.deepEqual( tweeners, {
			list: [ jQuery.noop ],
			of: [ jQuery.noop ],
			props: [ jQuery.noop ],
			"*": [ defaultTweener ]
		} );

		// Test with extra whitespaces
		jQuery.Animation.tweener( " list\t of \tprops\n*", fn );
		assert.deepEqual( tweeners, {
			list: [ fn, jQuery.noop ],
			of: [ fn, jQuery.noop ],
			props: [ fn, jQuery.noop ],
			"*": [ fn, defaultTweener ]
		} );
	}
);

} )();
