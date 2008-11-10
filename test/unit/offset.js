module("offset");

// opens a new window to run the tests against
var testwin = function(name, fn) {
	testwin[name] = load_offset_fixture(name);
	var interval = setInterval(function() {
		if (testwin[name] && testwin[name].$ && testwin[name].jQuery.isReady) {
			clearInterval(interval);
			test(name, fn);
		}
	}, 0);
	
	function load_offset_fixture(name) {
		var win = window.open( "./data/offset/" + name + ".html?num"+parseInt(Math.random()*1000), name, 'left=0,top=0,width=500,height=500,toolbar=1,resizable=0' );
		if ( !win ) { 
			alert("Please disable your popup blocker for the offset test suite");
			throw "Please disable your popup blocker for the offset test suite";
		}
		return win;
	}
};

testwin("absolute", function() {
	var $w = testwin["absolute"].$;
	
	equals( $w('#absolute-1').offset().top, 1, "jQuery('#absolute-1').offset().top" );
	equals( $w('#absolute-1').offset().left, 1, "jQuery('#absolute-1').offset().left" );
	
	equals( $w('#absolute-1-1').offset().top, 5, "jQuery('#absolute-1-1').offset().top" );
	equals( $w('#absolute-1-1').offset().left, 5, "jQuery('#absolute-1-1').offset().left" );
	
	equals( $w('#absolute-1-1-1').offset().top, 9, "jQuery('#absolute-1-1-1').offset().top" );
	equals( $w('#absolute-1-1-1').offset().left, 9, "jQuery('#absolute-1-1-1').offset().left" );
	
	equals( $w('#absolute-2').offset().top, 20, "jQuery('#absolute-2').offset().top" );
	equals( $w('#absolute-2').offset().left, 20, "jQuery('#absolute-2').offset().left" );
	
	
	equals( $w('#absolute-1').position().top, 0, "jQuery('#absolute-1').position().top" );
	equals( $w('#absolute-1').position().left, 0, "jQuery('#absolute-1').position().left" );
	
	equals( $w('#absolute-1-1').position().top, 1, "jQuery('#absolute-1-1').position().top" );
	equals( $w('#absolute-1-1').position().left, 1, "jQuery('#absolute-1-1').position().left" );
	
	equals( $w('#absolute-1-1-1').position().top, 1, "jQuery('#absolute-1-1-1').position().top" );
	equals( $w('#absolute-1-1-1').position().left, 1, "jQuery('#absolute-1-1-1').position().left" );
	
	equals( $w('#absolute-2').position().top, 19, "jQuery('#absolute-2').position().top" );
	equals( $w('#absolute-2').position().left, 19, "jQuery('#absolute-2').position().left" );
	
	testwin["absolute"].close();
});

testwin("relative", function() {
	var $w = testwin["relative"].$;
	
	// IE is collapsing the top margin of 1px
	equals( $w('#relative-1').offset().top, jQuery.browser.msie ? 6 : 7, "jQuery('#relative-1').offset().top" );
	equals( $w('#relative-1').offset().left, 7, "jQuery('#relative-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#relative-1-1').offset().top, jQuery.browser.msie ? 13 : 15, "jQuery('#relative-1-1').offset().top" );
	equals( $w('#relative-1-1').offset().left, 15, "jQuery('#relative-1-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#relative-2').offset().top, jQuery.browser.msie ? 141 : 142, "jQuery('#relative-2').offset().top" );
	equals( $w('#relative-2').offset().left, 27, "jQuery('#relative-2').offset().left" );
	
	
	// IE is collapsing the top margin of 1px
	equals( $w('#relative-1').position().top, jQuery.browser.msie ? 5 : 6, "jQuery('#relative-1').position().top" );
	equals( $w('#relative-1').position().left, 6, "jQuery('#relative-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#relative-1-1').position().top, jQuery.browser.msie ? 4 : 5, "jQuery('#relative-1-1').position().top" );
	equals( $w('#relative-1-1').position().left, 5, "jQuery('#relative-1-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#relative-2').position().top, jQuery.browser.msie ? 140 : 141, "jQuery('#relative-2').position().top" );
	equals( $w('#relative-2').position().left, 26, "jQuery('#relative-2').position().left" );
	
	testwin["relative"].close();
});

testwin("static", function() {
	var $w = testwin["static"].$;
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-1').offset().top, jQuery.browser.msie ? 6 : 7, "jQuery('#static-1').offset().top" );
	equals( $w('#static-1').offset().left, 7, "jQuery('#static-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-1-1').offset().top, jQuery.browser.msie ? 13 : 15, "jQuery('#static-1-1').offset().top" );
	equals( $w('#static-1-1').offset().left, 15, "jQuery('#static-1-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-1-1-1').offset().top, jQuery.browser.msie ? 20 : 23, "jQuery('#static-1-1-1').offset().top" );
	equals( $w('#static-1-1-1').offset().left, 23, "jQuery('#static-1-1-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-2').offset().top, jQuery.browser.msie ? 121 : 122, "jQuery('#static-2').offset().top" );
	equals( $w('#static-2').offset().left, 7, "jQuery('#static-2').offset().left" );
	
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-1').position().top, jQuery.browser.msie ? 5 : 6, "jQuery('#static-1').position().top" );
	equals( $w('#static-1').position().left, 6, "jQuery('#static-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-1-1').position().top, jQuery.browser.msie ? 12 : 14, "jQuery('#static-1-1').position().top" );
	equals( $w('#static-1-1').position().left, 14, "jQuery('#static-1-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-1-1-1').position().top, jQuery.browser.msie ? 19 : 22, "jQuery('#static-1-1-1').position().top" );
	equals( $w('#static-1-1-1').position().left, 22, "jQuery('#static-1-1-1').position().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#static-2').position().top, jQuery.browser.msie ? 120 : 121, "jQuery('#static-2').position().top" );
	equals( $w('#static-2').position().left, 6, "jQuery('#static-2').position().left" );
	
	testwin["static"].close();
});

if ( !jQuery.browser.msie || (jQuery.browser.msie && parseInt(jQuery.browser.version) > 6) )
	testwin("fixed", function() {
		var $w = testwin["fixed"].$;
	
		equals( $w('#fixed-1').offset().top, 1001, "jQuery('#fixed-1').offset().top" );
		equals( $w('#fixed-1').offset().left, 1001, "jQuery('#fixed-1').offset().left" );
	
		equals( $w('#fixed-2').offset().top, 1021, "jQuery('#fixed-2').offset().top" );
		equals( $w('#fixed-2').offset().left, 1021, "jQuery('#fixed-2').offset().left" );
	
		testwin["fixed"].close();
	});

testwin("table", function() {
	var $w = testwin["table"].$;
	
	equals( $w('#table-1').offset().top, 6, "jQuery('#table-1').offset().top" );
	equals( $w('#table-1').offset().left, 6, "jQuery('#table-1').offset().left" );
	
	equals( $w('#th-1').offset().top, 10, "jQuery('#table-1').offset().top" );
	equals( $w('#th-1').offset().left, 10, "jQuery('#table-1').offset().left" );
	
	equals( $w('#th-2').offset().top, 10, "jQuery('#table-1').offset().top" );
	equals( $w('#th-2').offset().left, 116, "jQuery('#table-1').offset().left" );
	
	testwin["table"].close();
});

testwin("scroll", function() {
	var $w = testwin["scroll"].$;
	
	// IE is collapsing the top margin of 1px
	equals( $w('#scroll-1').offset().top, jQuery.browser.msie ? 6 : 7, "jQuery('#scroll-1').offset().top" );
	equals( $w('#scroll-1').offset().left, 7, "jQuery('#scroll-1').offset().left" );
	
	// IE is collapsing the top margin of 1px
	equals( $w('#scroll-1-1').offset().top, jQuery.browser.msie ? 9 : 11, "jQuery('#scroll-1-1').offset().top" );
	equals( $w('#scroll-1-1').offset().left, 11, "jQuery('#scroll-1-1').offset().left" );
	
	testwin["scroll"].close();
});

testwin("body", function() {
	var $w = testwin["body"].$;
	
	equals( $w('body').offset().top, 1, "jQuery('#body').offset().top" );
	equals( $w('body').offset().left, 1, "jQuery('#body').offset().left" );
	
	testwin["body"].close();
});