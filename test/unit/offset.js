module("offset");

testoffset("absolute", function( jQuery ) {
	equals( jQuery('#absolute-1').offset().top, 1, "jQuery('#absolute-1').offset().top" );
	equals( jQuery('#absolute-1').offset().left, 1, "jQuery('#absolute-1').offset().left" );
	
	equals( jQuery('#absolute-1-1').offset().top, 5, "jQuery('#absolute-1-1').offset().top" );
	equals( jQuery('#absolute-1-1').offset().left, 5, "jQuery('#absolute-1-1').offset().left" );
	
	equals( jQuery('#absolute-1-1-1').offset().top, 9, "jQuery('#absolute-1-1-1').offset().top" );
	equals( jQuery('#absolute-1-1-1').offset().left, 9, "jQuery('#absolute-1-1-1').offset().left" );
	
	equals( jQuery('#absolute-2').offset().top, 20, "jQuery('#absolute-2').offset().top" );
	equals( jQuery('#absolute-2').offset().left, 20, "jQuery('#absolute-2').offset().left" );
	
	
	equals( jQuery('#absolute-1').position().top, 0, "jQuery('#absolute-1').position().top" );
	equals( jQuery('#absolute-1').position().left, 0, "jQuery('#absolute-1').position().left" );
	
	equals( jQuery('#absolute-1-1').position().top, 1, "jQuery('#absolute-1-1').position().top" );
	equals( jQuery('#absolute-1-1').position().left, 1, "jQuery('#absolute-1-1').position().left" );
	
	equals( jQuery('#absolute-1-1-1').position().top, 1, "jQuery('#absolute-1-1-1').position().top" );
	equals( jQuery('#absolute-1-1-1').position().left, 1, "jQuery('#absolute-1-1-1').position().left" );
	
	equals( jQuery('#absolute-2').position().top, 19, "jQuery('#absolute-2').position().top" );
	equals( jQuery('#absolute-2').position().left, 19, "jQuery('#absolute-2').position().left" );
});

testoffset("relative", function( jQuery ) {
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version ) < 8;
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#relative-1').offset().top, ie ? 6 : 7, "jQuery('#relative-1').offset().top" );
	equals( jQuery('#relative-1').offset().left, 7, "jQuery('#relative-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#relative-1-1').offset().top, ie ? 13 : 15, "jQuery('#relative-1-1').offset().top" );
	equals( jQuery('#relative-1-1').offset().left, 15, "jQuery('#relative-1-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#relative-2').offset().top, ie ? 141 : 142, "jQuery('#relative-2').offset().top" );
	equals( jQuery('#relative-2').offset().left, 27, "jQuery('#relative-2').offset().left" );
	
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#relative-1').position().top, ie ? 5 : 6, "jQuery('#relative-1').position().top" );
	equals( jQuery('#relative-1').position().left, 6, "jQuery('#relative-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#relative-1-1').position().top, ie ? 4 : 5, "jQuery('#relative-1-1').position().top" );
	equals( jQuery('#relative-1-1').position().left, 5, "jQuery('#relative-1-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#relative-2').position().top, ie ? 140 : 141, "jQuery('#relative-2').position().top" );
	equals( jQuery('#relative-2').position().left, 26, "jQuery('#relative-2').position().left" );
});

testoffset("static", function( jQuery ) {
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version ) < 8;
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-1').offset().top, ie ? 6 : 7, "jQuery('#static-1').offset().top" );
	equals( jQuery('#static-1').offset().left, 7, "jQuery('#static-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-1-1').offset().top, ie ? 13 : 15, "jQuery('#static-1-1').offset().top" );
	equals( jQuery('#static-1-1').offset().left, 15, "jQuery('#static-1-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-1-1-1').offset().top, ie ? 20 : 23, "jQuery('#static-1-1-1').offset().top" );
	equals( jQuery('#static-1-1-1').offset().left, 23, "jQuery('#static-1-1-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-2').offset().top, ie ? 121 : 122, "jQuery('#static-2').offset().top" );
	equals( jQuery('#static-2').offset().left, 7, "jQuery('#static-2').offset().left" );
	
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-1').position().top, ie ? 5 : 6, "jQuery('#static-1').position().top" );
	equals( jQuery('#static-1').position().left, 6, "jQuery('#static-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-1-1').position().top, ie ? 12 : 14, "jQuery('#static-1-1').position().top" );
	equals( jQuery('#static-1-1').position().left, 14, "jQuery('#static-1-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-1-1-1').position().top, ie ? 19 : 22, "jQuery('#static-1-1-1').position().top" );
	equals( jQuery('#static-1-1-1').position().left, 22, "jQuery('#static-1-1-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#static-2').position().top, ie ? 120 : 121, "jQuery('#static-2').position().top" );
	equals( jQuery('#static-2').position().left, 6, "jQuery('#static-2').position().left" );
});

if ( jQuery.offset.supportsFixedPosition ) {
	testoffset("fixed", function( jQuery ) {
		equals( jQuery('#fixed-1').offset().top, 1001, "jQuery('#fixed-1').offset().top" );
		equals( jQuery('#fixed-1').offset().left, 1001, "jQuery('#fixed-1').offset().left" );
	
		equals( jQuery('#fixed-2').offset().top, 1021, "jQuery('#fixed-2').offset().top" );
		equals( jQuery('#fixed-2').offset().left, 1021, "jQuery('#fixed-2').offset().left" );
	});
}

testoffset("table", function( jQuery ) {
	var ie = jQuery.browser.msie;
	
	equals( jQuery('#table-1').offset().top, 6, "jQuery('#table-1').offset().top" );
	equals( jQuery('#table-1').offset().left, 6, "jQuery('#table-1').offset().left" );
	
	equals( jQuery('#th-1').offset().top, 10, "jQuery('#th-1').offset().top" );
	equals( jQuery('#th-1').offset().left, 10, "jQuery('#th-1').offset().left" );
	
	// equals( jQuery('#th-2').offset().top, 10, "jQuery('#th-2').offset().top" );
	// equals( jQuery('#th-2').offset().left, 116, "jQuery('#th-2').offset().left" );
	// 
	// equals( jQuery('#th-3').offset().top, 10, "jQuery('#th-3').offset().top" );
	// equals( jQuery('#th-3').offset().left, 222, "jQuery('#th-3').offset().left" );
	
	// equals( jQuery('#td-1').offset().top, ie ? 116 : 112, "jQuery('#td-1').offset().top" );
	// equals( jQuery('#td-1').offset().left, 10, "jQuery('#td-1').offset().left" );
	// 
	// equals( jQuery('#td-2').offset().top, ie ? 116 : 112, "jQuery('#td-2').offset().top" );
	// equals( jQuery('#td-2').offset().left, 116, "jQuery('#td-2').offset().left" );
	// 
	// equals( jQuery('#td-3').offset().top, ie ? 116 : 112, "jQuery('#td-3').offset().top" );
	// equals( jQuery('#td-3').offset().left, 222, "jQuery('#td-3').offset().left" );
});

testoffset("scroll", function( jQuery ) {
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version ) < 8;
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#scroll-1').offset().top, ie ? 6 : 7, "jQuery('#scroll-1').offset().top" );
	equals( jQuery('#scroll-1').offset().left, 7, "jQuery('#scroll-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( jQuery('#scroll-1-1').offset().top, ie ? 9 : 11, "jQuery('#scroll-1-1').offset().top" );
	equals( jQuery('#scroll-1-1').offset().left, 11, "jQuery('#scroll-1-1').offset().left" );
});

testoffset("body", function( jQuery ) {
	equals( jQuery('body').offset().top, 1, "jQuery('#body').offset().top" );
	equals( jQuery('body').offset().left, 1, "jQuery('#body').offset().left" );
});

test("offsetParent", function(){
	expect(11);

	var body = jQuery("body").offsetParent();
	equals( body.length, 1, "Only one offsetParent found." );
	equals( body[0], document.body, "The body is its own offsetParent." );

	var header = jQuery("#header").offsetParent();
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
					fn.call( this, win.jQuery );
					document.body.removeChild( iframe );
					iframe = null;
				}
			}, 15 );
	});
	
	function loadFixture() {
		var src = './data/offset/' + name + '.html?' + parseInt( Math.random()*1000 ),
			iframe = jQuery('<iframe />').css({
				width: 500, height: 500, position: 'absolute', top: -600, left: -600, visiblity: 'hidden'
			}).appendTo('body')[0];
		iframe.contentWindow.location = src;
		return iframe;
	}
}
