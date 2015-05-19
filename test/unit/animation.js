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
module( "animation", {
	setup: function() {
		window.requestAnimationFrame = null;
		this.sandbox = sinon.sandbox.create();
		this.clock = this.sandbox.useFakeTimers( startTime );
		this._oldInterval = jQuery.fx.interval;
		jQuery.fx.step = {};
		jQuery.fx.interval = 10;
		jQuery.now = Date.now;
		jQuery.Animation.prefilters = [ defaultPrefilter ];
		jQuery.Animation.tweeners = { "*": [ defaultTweener ] };
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

test( "Animation( subject, props, opts ) - shape", function() {
	expect( 20 );

	var subject = { test: 0 },
		props = { test: 1 },
		opts = { queue: "fx", duration: 100 },
		animation = jQuery.Animation( subject, props, opts );

	equal( animation.elem, subject, ".elem is set to the exact object passed" );
	equal( animation.originalOptions, opts, ".originalOptions is set to options passed" );
	equal( animation.originalProperties, props, ".originalProperties is set to props passed" );

	notEqual( animation.props, props, ".props is not the original however" );
	deepEqual( animation.props, props, ".props is a copy of the original" );

	deepEqual( animation.opts, {
		duration: 100,
		queue: "fx",
		specialEasing: { test: undefined },
		easing: jQuery.easing._default
	}, ".options is filled with default easing and specialEasing" );

	equal( animation.startTime, startTime, "startTime was set" );
	equal( animation.duration, 100, ".duration is set" );

	equal( animation.tweens.length, 1, ".tweens has one Tween" );
	equal( typeof animation.tweens[ 0 ].run, "function", "which has a .run function" );

	equal( typeof animation.createTween, "function", ".createTween is a function" );
	equal( typeof animation.stop, "function", ".stop is a function" );

	equal( typeof animation.done, "function", ".done is a function" );
	equal( typeof animation.fail, "function", ".fail is a function" );
	equal( typeof animation.always, "function", ".always is a function" );
	equal( typeof animation.progress, "function", ".progress is a function" );

	equal( jQuery.timers.length, 1, "Added a timers function" );
	equal( jQuery.timers[ 0 ].elem, subject, "...with .elem as the subject" );
	equal( jQuery.timers[ 0 ].anim, animation, "...with .anim as the animation" );
	equal( jQuery.timers[ 0 ].queue, opts.queue, "...with .queue" );

	// Cleanup after ourselves by ticking to the end
	this.clock.tick( 100 );
} );

test( "Animation.prefilter( fn ) - calls prefilter after defaultPrefilter", function() {
	expect( 1 );

	var prefilter = this.sandbox.stub(),
		defaultSpy = this.sandbox.spy( jQuery.Animation.prefilters, 0 );

	jQuery.Animation.prefilter( prefilter );

	jQuery.Animation( {}, {}, {} );
	ok( prefilter.calledAfter( defaultSpy ), "our prefilter called after" );
} );

test( "Animation.prefilter( fn, true ) - calls prefilter before defaultPrefilter", function() {
	expect( 1 );

	var prefilter = this.sandbox.stub(),
		defaultSpy = this.sandbox.spy( jQuery.Animation.prefilters, 0 );

	jQuery.Animation.prefilter( prefilter, true );

	jQuery.Animation( {}, {}, {} );
	ok( prefilter.calledBefore( defaultSpy ), "our prefilter called before" );
} );

test( "Animation.prefilter - prefilter return hooks", function() {
	expect( 34 );

	var animation, realAnimation, element,
		sandbox = this.sandbox,
		ourAnimation = { stop: this.sandbox.spy() },
		target = { height: 50 },
		props = { height: 100 },
		opts = { duration: 100 },
		prefilter = this.sandbox.spy( function() {
			realAnimation = this;
			sandbox.spy( realAnimation, "createTween" );

			deepEqual( realAnimation.originalProperties, props, "originalProperties" );
			equal( arguments[ 0 ], this.elem, "first param elem" );
			equal( arguments[ 1 ], this.props, "second param props" );
			equal( arguments[ 2 ], this.opts, "third param opts" );
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

	equal( prefilter.callCount, 1, "Called prefilter" );

	equal( defaultSpy.callCount, 0,
		"Returning something from a prefilter caused remaining prefilters to not run" );
	equal( jQuery.fx.timer.callCount, 0, "Returning something never queues a timer" );
	equal( animation, ourAnimation, "Returning something returned it from jQuery.Animation" );
	equal( realAnimation.createTween.callCount, 0, "Returning something never creates tweens" );
	equal( TweenSpy.callCount, 0, "Returning something never creates tweens" );

	// Test overriden usage on queues:
	prefilter.reset();
	element = jQuery( "<div>" )
		.css( "height", 50 )
		.animate( props, 100 )
		.queue( queueSpy )
		.animate( props, 100 )
		.queue( queueSpy )
		.animate( props, 100 )
		.queue( queueSpy );

	equal( prefilter.callCount, 1, "Called prefilter" );
	equal( queueSpy.callCount, 0, "Next function in queue not called" );

	realAnimation.opts.complete.call( realAnimation.elem );
	equal( queueSpy.callCount, 1, "Next function in queue called after complete" );

	equal( prefilter.callCount, 2, "Called prefilter again - animation #2" );
	equal( ourAnimation.stop.callCount, 0, ".stop() on our animation hasn't been called" );

	element.stop();
	equal( ourAnimation.stop.callCount, 1, ".stop() called ourAnimation.stop()" );
	ok( !ourAnimation.stop.args[ 0 ][ 0 ], ".stop( falsy ) (undefined or false are both valid)" );

	equal( queueSpy.callCount, 2, "Next queue function called" );
	ok( queueSpy.calledAfter( ourAnimation.stop ), "After our animation was told to stop" );

	// ourAnimation.stop.reset();
	equal( prefilter.callCount, 3, "Got the next animation" );

	ourAnimation.stop.reset();

	// do not clear queue, gotoEnd
	element.stop( false, true );
	ok( ourAnimation.stop.calledWith( true ), ".stop(true) calls .stop(true)" );
	ok( queueSpy.calledAfter( ourAnimation.stop ),
		"and the next queue function ran after we were told" );
} );

test( "Animation.tweener( fn ) - unshifts a * tweener", function() {
	expect( 2 );
	var starTweeners = jQuery.Animation.tweeners[ "*" ];

	jQuery.Animation.tweener( jQuery.noop );
	equal( starTweeners.length, 2 );
	deepEqual( starTweeners, [ jQuery.noop, defaultTweener ] );
} );

test( "Animation.tweener( 'prop', fn ) - unshifts a 'prop' tweener", function() {
	expect( 4 );
	var tweeners = jQuery.Animation.tweeners,
		fn = function() {};

	jQuery.Animation.tweener( "prop", jQuery.noop );
	equal( tweeners.prop.length, 1 );
	deepEqual( tweeners.prop, [ jQuery.noop ] );

	jQuery.Animation.tweener( "prop", fn );
	equal( tweeners.prop.length, 2 );
	deepEqual( tweeners.prop, [ fn, jQuery.noop ] );
} );

test( "Animation.tweener( 'list of props', fn ) - unshifts a tweener to each prop", function() {
	expect( 2 );
	var tweeners = jQuery.Animation.tweeners,
		fn = function() {};

	jQuery.Animation.tweener( "list of props", jQuery.noop );
	deepEqual( tweeners, {
		list: [ jQuery.noop ],
		of: [ jQuery.noop ],
		props: [ jQuery.noop ],
		"*": [ defaultTweener ]
	} );

	// Test with extra whitespaces
	jQuery.Animation.tweener( " list\t of \tprops\n*", fn );
	deepEqual( tweeners, {
		list: [ fn, jQuery.noop ],
		of: [ fn, jQuery.noop ],
		props: [ fn, jQuery.noop ],
		"*": [ fn, defaultTweener ]
	} );
} );

} )();
