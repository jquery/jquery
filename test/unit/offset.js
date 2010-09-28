module("offset");

test("disconnected node", function() {
	expect(2);

	var result = jQuery( document.createElement("div") ).offset();

	equals( result.top, 0, "Check top" );
	equals( result.left, 0, "Check left" );
});

var supportsScroll = false;

testoffset("absolute"/* in iframe */, function($, iframe) {
	expect(4);
	
	var doc = iframe.document, tests;
	
	// force a scroll value on the main window
	// this insures that the results will be wrong
	// if the offset method is using the scroll offset
	// of the parent window
	var forceScroll = jQuery('<div>', { width: 2000, height: 2000 }).appendTo('body');
	window.scrollTo(200, 200);

	if ( document.documentElement.scrollTop || document.body.scrollTop ) {
		supportsScroll = true;
	}

	window.scrollTo(1, 1);
	
	// get offset
	tests = [
		{ id: '#absolute-1', top: 1, left: 1 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id, doc ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equals( jQuery( this.id, doc ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});


	// get position
	tests = [
		{ id: '#absolute-1', top: 0, left: 0 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id, doc ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		equals( jQuery( this.id, doc ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	});
	
	forceScroll.remove();
});

testoffset("absolute", function( jQuery ) {
	expect(178);
	
	// get offset tests
	var tests = [
		{ id: '#absolute-1',     top:  1, left:  1 }, 
		{ id: '#absolute-1-1',   top:  5, left:  5 },
		{ id: '#absolute-1-1-1', top:  9, left:  9 },
		{ id: '#absolute-2',     top: 20, left: 20 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});
	
	
	// get position
	tests = [
		{ id: '#absolute-1',     top:  0, left:  0 },
		{ id: '#absolute-1-1',   top:  1, left:  1 },
		{ id: '#absolute-1-1-1', top:  1, left:  1 },
		{ id: '#absolute-2',     top: 19, left: 19 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		equals( jQuery( this.id ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	});
	
	// test #5781
	var offset = jQuery( '#positionTest' ).offset({ top: 10, left: 10 }).offset();
	equals( offset.top,  10, "Setting offset on element with position absolute but 'auto' values." )
	equals( offset.left, 10, "Setting offset on element with position absolute but 'auto' values." )
	
	
	// set offset
	tests = [
		{ id: '#absolute-2',     top: 30, left: 30 },
		{ id: '#absolute-2',     top: 10, left: 10 },
		{ id: '#absolute-2',     top: -1, left: -1 },
		{ id: '#absolute-2',     top: 19, left: 19 },
		{ id: '#absolute-1-1-1', top: 15, left: 15 },
		{ id: '#absolute-1-1-1', top:  5, left:  5 },
		{ id: '#absolute-1-1-1', top: -1, left: -1 },
		{ id: '#absolute-1-1-1', top:  9, left:  9 },
		{ id: '#absolute-1-1',   top: 10, left: 10 },
		{ id: '#absolute-1-1',   top:  0, left:  0 },
		{ id: '#absolute-1-1',   top: -1, left: -1 },
		{ id: '#absolute-1-1',   top:  5, left:  5 },
		{ id: '#absolute-1',     top:  2, left:  2 },
		{ id: '#absolute-1',     top:  0, left:  0 },
		{ id: '#absolute-1',     top: -1, left: -1 },
		{ id: '#absolute-1',     top:  1, left:  1 }
	];
	jQuery.each( tests, function() {
		jQuery( this.id ).offset({ top: this.top, left: this.left });
		equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );
		
		var top = this.top, left = this.left;
		
		jQuery( this.id ).offset(function(i, val){
			equals( val.top, top, "Verify incoming top position." );
			equals( val.left, left, "Verify incoming top position." );
			return { top: top + 1, left: left + 1 };
		});
		equals( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + " })" );
		equals( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + " })" );
		
		jQuery( this.id )
			.offset({ left: this.left + 2 })
			.offset({ top:  this.top  + 2 });
		equals( jQuery( this.id ).offset().top,  this.top  + 2, "Setting one property at a time." );
		equals( jQuery( this.id ).offset().left, this.left + 2, "Setting one property at a time." );
		
		jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
			jQuery( this ).css({
				top:  props.top  + 1,
				left: props.left + 1
			});
		}});
		equals( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
		equals( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
	});
});

testoffset("relative", function( jQuery ) {
	expect(60);
	
	// IE is collapsing the top margin of 1px
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version, 10 ) < 8;
	
	// get offset
	var tests = [
		{ id: '#relative-1',   top: ie ?   6 :   7, left:  7 },
		{ id: '#relative-1-1', top: ie ?  13 :  15, left: 15 },
		{ id: '#relative-2',   top: ie ? 141 : 142, left: 27 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});
	
	
	// get position
	tests = [
		{ id: '#relative-1',   top: ie ?   5 :   6, left:  6 },
		{ id: '#relative-1-1', top: ie ?   4 :   5, left:  5 },
		{ id: '#relative-2',   top: ie ? 140 : 141, left: 26 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		equals( jQuery( this.id ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	});
	
	
	// set offset
	tests = [
		{ id: '#relative-2',   top: 200, left:  50 },
		{ id: '#relative-2',   top: 100, left:  10 },
		{ id: '#relative-2',   top:  -5, left:  -5 },
		{ id: '#relative-2',   top: 142, left:  27 },
		{ id: '#relative-1-1', top: 100, left: 100 },
		{ id: '#relative-1-1', top:   5, left:   5 },
		{ id: '#relative-1-1', top:  -1, left:  -1 },
		{ id: '#relative-1-1', top:  15, left:  15 },
		{ id: '#relative-1',   top: 100, left: 100 },
		{ id: '#relative-1',   top:   0, left:   0 },
		{ id: '#relative-1',   top:  -1, left:  -1 },
		{ id: '#relative-1',   top:   7, left:   7 }
	];
	jQuery.each( tests, function() {
		jQuery( this.id ).offset({ top: this.top, left: this.left });
		equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );
		
		jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
			jQuery( this ).css({
				top:  props.top  + 1,
				left: props.left + 1
			});
		}});
		equals( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
		equals( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
	});
});

testoffset("static", function( jQuery ) {
	expect(80);
	
	// IE is collapsing the top margin of 1px
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version, 10 ) < 8;
	
	// get offset
	var tests = [
		{ id: '#static-1',     top: ie ?   6 :   7, left:  7 },
		{ id: '#static-1-1',   top: ie ?  13 :  15, left: 15 },
		{ id: '#static-1-1-1', top: ie ?  20 :  23, left: 23 },
		{ id: '#static-2',     top: ie ? 121 : 122, left:  7 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});
	
	
	// get position
	tests = [
		{ id: '#static-1',     top: ie ?   5 :   6, left:  6 },
		{ id: '#static-1-1',   top: ie ?  12 :  14, left: 14 },
		{ id: '#static-1-1-1', top: ie ?  19 :  22, left: 22 },
		{ id: '#static-2',     top: ie ? 120 : 121, left:  6 }
	];
	jQuery.each( tests, function() {
		equals( jQuery( this.id ).position().top,  this.top,  "jQuery('" + this.top  + "').position().top" );
		equals( jQuery( this.id ).position().left, this.left, "jQuery('" + this.left +"').position().left" );
	});
	
	
	// set offset
	tests = [
		{ id: '#static-2',     top: 200, left: 200 },
		{ id: '#static-2',     top: 100, left: 100 },
		{ id: '#static-2',     top:  -2, left:  -2 },
		{ id: '#static-2',     top: 121, left:   6 },
		{ id: '#static-1-1-1', top:  50, left:  50 },
		{ id: '#static-1-1-1', top:  10, left:  10 },
		{ id: '#static-1-1-1', top:  -1, left:  -1 },
		{ id: '#static-1-1-1', top:  22, left:  22 },
		{ id: '#static-1-1',   top:  25, left:  25 },
		{ id: '#static-1-1',   top:  10, left:  10 },
		{ id: '#static-1-1',   top:  -3, left:  -3 },
		{ id: '#static-1-1',   top:  14, left:  14 },
		{ id: '#static-1',     top:  30, left:  30 },
		{ id: '#static-1',     top:   2, left:   2 },
		{ id: '#static-1',     top:  -2, left:  -2 },
		{ id: '#static-1',     top:   7, left:   7 }
	];
	jQuery.each( tests, function() {
		jQuery( this.id ).offset({ top: this.top, left: this.left });
		equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );
		
		jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
			jQuery( this ).css({
				top:  props.top  + 1,
				left: props.left + 1
			});
		}});
		equals( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
		equals( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
	});
});

testoffset("fixed", function( jQuery ) {
	expect(28);
	
	jQuery.offset.initialize();
	
	var tests = [
		{ id: '#fixed-1', top: 1001, left: 1001 },
		{ id: '#fixed-2', top: 1021, left: 1021 }
	];

	jQuery.each( tests, function() {
		if ( !supportsScroll ) {
			ok( true, "Browser doesn't support scroll position." );
			ok( true, "Browser doesn't support scroll position." );

		} else if ( jQuery.offset.supportsFixedPosition ) {
			equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
			equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
		} else {
			// need to have same number of assertions
			ok( true, 'Fixed position is not supported' );
			ok( true, 'Fixed position is not supported' );
		}
	});
	
	tests = [
		{ id: '#fixed-1', top: 100, left: 100 },
		{ id: '#fixed-1', top:   0, left:   0 },
		{ id: '#fixed-1', top:  -4, left:  -4 },
		{ id: '#fixed-2', top: 200, left: 200 },
		{ id: '#fixed-2', top:   0, left:   0 },
		{ id: '#fixed-2', top:  -5, left:  -5 }
	];
	
	jQuery.each( tests, function() {
		if ( jQuery.offset.supportsFixedPosition ) {
			jQuery( this.id ).offset({ top: this.top, left: this.left });
			equals( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
			equals( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );
		
			jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
				jQuery( this ).css({
					top:  props.top  + 1,
					left: props.left + 1
				});
			}});
			equals( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
			equals( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
		} else {
			// need to have same number of assertions
			ok( true, 'Fixed position is not supported' );
			ok( true, 'Fixed position is not supported' );
			ok( true, 'Fixed position is not supported' );
			ok( true, 'Fixed position is not supported' );
		}
	});
});

testoffset("table", function( jQuery ) {
	expect(4);
	
	equals( jQuery('#table-1').offset().top, 6, "jQuery('#table-1').offset().top" );
	equals( jQuery('#table-1').offset().left, 6, "jQuery('#table-1').offset().left" );
	
	equals( jQuery('#th-1').offset().top, 10, "jQuery('#th-1').offset().top" );
	equals( jQuery('#th-1').offset().left, 10, "jQuery('#th-1').offset().left" );
});

testoffset("scroll", function( jQuery, win ) {
	expect(16);
	
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version, 10 ) < 8;
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#scroll-1').offset().top, ie ? 6 : 7, "jQuery('#scroll-1').offset().top" );
	equals( jQuery('#scroll-1').offset().left, 7, "jQuery('#scroll-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#scroll-1-1').offset().top, ie ? 9 : 11, "jQuery('#scroll-1-1').offset().top" );
	equals( jQuery('#scroll-1-1').offset().left, 11, "jQuery('#scroll-1-1').offset().left" );
	
	
	// scroll offset tests .scrollTop/Left
	equals( jQuery('#scroll-1').scrollTop(), 5, "jQuery('#scroll-1').scrollTop()" );
	equals( jQuery('#scroll-1').scrollLeft(), 5, "jQuery('#scroll-1').scrollLeft()" );
	
	equals( jQuery('#scroll-1-1').scrollTop(), 0, "jQuery('#scroll-1-1').scrollTop()" );
	equals( jQuery('#scroll-1-1').scrollLeft(), 0, "jQuery('#scroll-1-1').scrollLeft()" );
	
	// equals( jQuery('body').scrollTop(), 0, "jQuery('body').scrollTop()" );
	// equals( jQuery('body').scrollLeft(), 0, "jQuery('body').scrollTop()" );
	
	win.name = "test";

	if ( !supportsScroll ) {
		ok( true, "Browser doesn't support scroll position." );
		ok( true, "Browser doesn't support scroll position." );

		ok( true, "Browser doesn't support scroll position." );
		ok( true, "Browser doesn't support scroll position." );
	} else {
		equals( jQuery(win).scrollTop(), 1000, "jQuery(window).scrollTop()" );
		equals( jQuery(win).scrollLeft(), 1000, "jQuery(window).scrollLeft()" );
	
		equals( jQuery(win.document).scrollTop(), 1000, "jQuery(document).scrollTop()" );
		equals( jQuery(win.document).scrollLeft(), 1000, "jQuery(document).scrollLeft()" );
	}
	
	// test jQuery using parent window/document
	// jQuery reference here is in the iframe
	window.scrollTo(0,0);
	equals( jQuery(window).scrollTop(), 0, "jQuery(window).scrollTop() other window" );
	equals( jQuery(window).scrollLeft(), 0, "jQuery(window).scrollLeft() other window" );
	equals( jQuery(document).scrollTop(), 0, "jQuery(window).scrollTop() other document" );
	equals( jQuery(document).scrollLeft(), 0, "jQuery(window).scrollLeft() other document" );
});

testoffset("body", function( jQuery ) {
	expect(2);
	
	equals( jQuery('body').offset().top, 1, "jQuery('#body').offset().top" );
	equals( jQuery('body').offset().left, 1, "jQuery('#body').offset().left" );
});

test("Chaining offset(coords) returns jQuery object", function() {
	expect(2);
	var coords = { top:  1, left:  1 };
	equals( jQuery("#absolute-1").offset(coords).selector, "#absolute-1", "offset(coords) returns jQuery object" );
	equals( jQuery("#non-existent").offset(coords).selector, "#non-existent", "offset(coords) with empty jQuery set returns jQuery object" );
});

test("offsetParent", function(){
	expect(11);

	var body = jQuery("body").offsetParent();
	equals( body.length, 1, "Only one offsetParent found." );
	equals( body[0], document.body, "The body is its own offsetParent." );

	var header = jQuery("#qunit-header").offsetParent();
	equals( header.length, 1, "Only one offsetParent found." );
	equals( header[0], document.body, "The body is the offsetParent." );

	var div = jQuery("#nothiddendivchild").offsetParent();
	equals( div.length, 1, "Only one offsetParent found." );
	equals( div[0], document.body, "The body is the offsetParent." );

	jQuery("#nothiddendiv").css("position", "relative");

	div = jQuery("#nothiddendivchild").offsetParent();
	equals( div.length, 1, "Only one offsetParent found." );
	equals( div[0], jQuery("#nothiddendiv")[0], "The div is the offsetParent." );

	div = jQuery("body, #nothiddendivchild").offsetParent();
	equals( div.length, 2, "Two offsetParent found." );
	equals( div[0], document.body, "The body is the offsetParent." );
	equals( div[1], jQuery("#nothiddendiv")[0], "The div is the offsetParent." );
});

function testoffset(name, fn) {
	
	test(name, function() {
		// pause execution for now
		stop();
		
		// load fixture in iframe
		var iframe = loadFixture(),
			win = iframe.contentWindow,
			interval = setInterval( function() {
				if ( win && win.jQuery && win.jQuery.isReady ) {
					clearInterval( interval );
					// continue
					start();
					// call actual tests passing the correct jQuery isntance to use
					fn.call( this, win.jQuery, win );
					document.body.removeChild( iframe );
					iframe = null;
				}
			}, 15 );
	});
	
	function loadFixture() {
		var src = './data/offset/' + name + '.html?' + parseInt( Math.random()*1000, 10 ),
			iframe = jQuery('<iframe />').css({
				width: 500, height: 500, position: 'absolute', top: -600, left: -600, visiblity: 'hidden'
			}).appendTo('body')[0];
		iframe.contentWindow.location = src;
		return iframe;
	}
}
