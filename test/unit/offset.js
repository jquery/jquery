module("offset");

// opens a new window to run the tests against
var testwin = function(name, fn) {
	testwin[name] = load_offset_fixture(name);
	var interval = setInterval(function() {
		if (testwin[name] && testwin[name].$ && testwin[name].$.isReady) {
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
	
	equals( $w('#absolute-1').offset().top, 1, "$('#absolute-1').offset().top" );
	equals( $w('#absolute-1').offset().left, 1, "$('#absolute-1').offset().left" );
	
	equals( $w('#absolute-1-1').offset().top, 5, "$('#absolute-1-1').offset().top" );
	equals( $w('#absolute-1-1').offset().left, 5, "$('#absolute-1-1').offset().left" );
	
	equals( $w('#absolute-1-1-1').offset().top, 9, "$('#absolute-1-1-1').offset().top" );
	equals( $w('#absolute-1-1-1').offset().left, 9, "$('#absolute-1-1-1').offset().left" );
	
	equals( $w('#absolute-2').offset().top, 20, "$('#absolute-2').offset().top" );
	equals( $w('#absolute-2').offset().left, 20, "$('#absolute-2').offset().left" );
	
	testwin["absolute"].close();
});

testwin("relative", function() {
	var $w = testwin["relative"].$;
	
	equals( $w('#relative-1').offset().top, jQuery.browser.msie ? 6 : 7, "$('#relative-1').offset().top" );
	equals( $w('#relative-1').offset().left, 7, "$('#relative-1').offset().left" );
	
	equals( $w('#relative-1-1').offset().top, jQuery.browser.msie ? 13 : 15, "$('#relative-1-1').offset().top" );
	equals( $w('#relative-1-1').offset().left, 15, "$('#relative-1-1').offset().left" );
	
	equals( $w('#relative-2').offset().top, jQuery.browser.msie ? 141 : 142, "$('#relative-2').offset().top" );
	equals( $w('#relative-2').offset().left, 27, "$('#relative-2').offset().left" );
	
	testwin["relative"].close();
});