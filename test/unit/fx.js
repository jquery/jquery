module("fx");

test("animate(Hash, Object, Function)", function() {
	expect(1);
	stop();
	var hash = {opacity: 'show'};
	var hashCopy = jQuery.extend({}, hash);
	jQuery('#foo').animate(hash, 0, function() {
		equals( hash.opacity, hashCopy.opacity, 'Check if animate changed the hash parameter' );
		start();
	});
});

test("animate option (queue === false)", function () {
	expect(1);
	stop();

	var order = [];

	var $foo = jQuery("#foo");
	$foo.animate({width:'100px'}, 200, function () {
		// should finish after unqueued animation so second
		order.push(2);
	});
	$foo.animate({fontSize:'2em'}, {queue:false, duration:10, complete:function () {
		// short duration and out of queue so should finish first
		order.push(1);
	}});
	$foo.animate({height:'100px'}, 10, function() {
		// queued behind the first animation so should finish third 
		order.push(3);
		isSet( order, [ 1, 2, 3], "Animations finished in the correct order" );
		start();
	});
});

test("animate non-element", function(){
	expect(1);
	stop();

	var obj = { test: 0 };

	jQuery(obj).animate({test: 200}, 200, function(){
		equals( obj.test, 200, "The custom property should be modified." );
		start();
	});
});

test("stop()", function() {
	expect(3);
	stop();

	var $foo = jQuery("#nothiddendiv");
	var w = 0;
	$foo.hide().width(200).width();

	$foo.animate({ width:'show' }, 1000);
	setTimeout(function(){
		var nw = $foo.width();
		ok( nw != w, "An animation occurred " + nw + "px " + w + "px");
		$foo.stop();

		nw = $foo.width();
		ok( nw != w, "Stop didn't reset the animation " + nw + "px " + w + "px");
		setTimeout(function(){
			equals( nw, $foo.width(), "The animation didn't continue" );
			start();
		}, 100);
	}, 100);
});

test("stop() - several in queue", function() {
	expect(4);
	stop();

	var $foo = jQuery("#nothiddendiv");
	var w = 0;
	$foo.hide().width(200).width();

	$foo.animate({ width:'show' }, 1000);
	$foo.animate({ width:'hide' }, 1000);
	$foo.animate({ width:'show' }, 1000);
	setTimeout(function(){
		equals( $foo.queue().length, 3, "All 3 still in the queue" );
		var nw = $foo.width();
		ok( nw != w, "An animation occurred " + nw + "px " + w + "px");
		$foo.stop();

		nw = $foo.width();
		ok( nw != w, "Stop didn't reset the animation " + nw + "px " + w + "px");
		equals( $foo.queue().length, 2, "The next animation continued" );
		$foo.stop(true);
		start();
	}, 100);
});

test("stop(clearQueue)", function() {
	expect(4);
	stop();

	var $foo = jQuery("#nothiddendiv");
	var w = 0;
	$foo.hide().width(200).width();

	$foo.animate({ width:'show' }, 1000);
	$foo.animate({ width:'hide' }, 1000);
	$foo.animate({ width:'show' }, 1000);
	setTimeout(function(){
		var nw = $foo.width();
		ok( nw != w, "An animation occurred " + nw + "px " + w + "px");
		$foo.stop(true);

		nw = $foo.width();
		ok( nw != w, "Stop didn't reset the animation " + nw + "px " + w + "px");

		equals( $foo.queue().length, 0, "The animation queue was cleared" );
		setTimeout(function(){
			equals( nw, $foo.width(), "The animation didn't continue" );
			start();
		}, 100);
	}, 100);
});

test("stop(clearQueue, gotoEnd)", function() {
	expect(3);
	stop();

	var $foo = jQuery("#nothiddendiv");
	var w = 0;
	$foo.hide().width(200).width();

	$foo.animate({ width:'show' }, 1000);
	$foo.animate({ width:'hide' }, 1000);
	$foo.animate({ width:'show' }, 1000);
	$foo.animate({ width:'hide' }, 1000);
	setTimeout(function(){
		var nw = $foo.width();
		ok( nw != w, "An animation occurred " + nw + "px " + w + "px");
		$foo.stop(false, true);

		nw = $foo.width();
		equals( nw, 200, "Stop() reset the animation" );

		setTimeout(function(){
			equals( $foo.queue().length, 3, "The next animation continued" );
			$foo.stop(true);
			start();
		}, 100);
	}, 100);
});

test("toggle()", function() {
	expect(6);
	var x = jQuery("#foo");
	ok( x.is(":visible"), "is visible" );
	x.toggle();
	ok( x.is(":hidden"), "is hidden" );
	x.toggle();
	ok( x.is(":visible"), "is visible again" );
	
	x.toggle(true);
	ok( x.is(":visible"), "is visible" );
	x.toggle(false);
	ok( x.is(":hidden"), "is hidden" );
	x.toggle(true);
	ok( x.is(":visible"), "is visible again" );
});

jQuery.checkOverflowDisplay = function(){
	var o = jQuery.css( this, "overflow" );

	equals(o, "visible", "Overflow should be visible: " + o);
	equals(jQuery.css( this, "display" ), "inline", "Display shouldn't be tampered with.");

	start();
}

test("JS Overflow and Display", function() {
	expect(2);
	stop();
	jQuery.makeTest( "JS Overflow and Display" )
		.addClass("widewidth")
		.css({ overflow: "visible", display: "inline" })
		.addClass("widewidth")
		.text("Some sample text.")
		.before("text before")
		.after("text after")
		.animate({ opacity: 0.5 }, "slow", jQuery.checkOverflowDisplay);
});
		
test("CSS Overflow and Display", function() {
	expect(2);
	stop();
	jQuery.makeTest( "CSS Overflow and Display" )
		.addClass("overflow inline")
		.addClass("widewidth")
		.text("Some sample text.")
		.before("text before")
		.after("text after")
		.animate({ opacity: 0.5 }, "slow", jQuery.checkOverflowDisplay);
});

jQuery.each( {
	"CSS Auto": function(elem,prop){
		jQuery(elem).addClass("auto" + prop)
			.text("This is a long string of text.");
		return "";
	},
	"JS Auto": function(elem,prop){
		jQuery(elem).css(prop,"auto")
			.text("This is a long string of text.");
		return "";
	},
	"CSS 100": function(elem,prop){
		jQuery(elem).addClass("large" + prop);
		return "";
	},
	"JS 100": function(elem,prop){
		jQuery(elem).css(prop,prop == "opacity" ? 1 : "100px");
		return prop == "opacity" ? 1 : 100;
	},
	"CSS 50": function(elem,prop){
		jQuery(elem).addClass("med" + prop);
		return "";
	},
	"JS 50": function(elem,prop){
		jQuery(elem).css(prop,prop == "opacity" ? 0.50 : "50px");
		return prop == "opacity" ? 0.5 : 50;
	},
	"CSS 0": function(elem,prop){
		jQuery(elem).addClass("no" + prop);
		return "";
	},
	"JS 0": function(elem,prop){
		jQuery(elem).css(prop,prop == "opacity" ? 0 : "0px");
		return 0;
	}
}, function(fn, f){
	jQuery.each( {
		"show": function(elem,prop){
			jQuery(elem).hide().addClass("wide"+prop);
			return "show";
		},
		"hide": function(elem,prop){
			jQuery(elem).addClass("wide"+prop);
			return "hide";
		},
		"100": function(elem,prop){
			jQuery(elem).addClass("wide"+prop);
			return prop == "opacity" ? 1 : 100;
		},
		"50": function(elem,prop){
			return prop == "opacity" ? 0.50 : 50;
		},
		"0": function(elem,prop){
			jQuery(elem).addClass("noback");
			return 0;
		}
	}, function(tn, t){
		test(fn + " to " + tn, function() {
			var elem = jQuery.makeTest( fn + " to " + tn );
	
			var t_w = t( elem, "width" );
			var f_w = f( elem, "width" );
			var t_h = t( elem, "height" );
			var f_h = f( elem, "height" );
			var t_o = t( elem, "opacity" );
			var f_o = f( elem, "opacity" );
			
			var num = 0;
			
			if ( t_h == "show" ) num++;
			if ( t_w == "show" ) num++;
			if ( t_w == "hide"||t_w == "show" ) num++;
			if ( t_h == "hide"||t_h == "show" ) num++;
			if ( t_o == "hide"||t_o == "show" ) num++;
			if ( t_w == "hide" ) num++;
			if ( t_o.constructor == Number ) num += 2;
			if ( t_w.constructor == Number ) num += 2;
			if ( t_h.constructor == Number ) num +=2;
			
			expect(num);
			stop();
	
			var anim = { width: t_w, height: t_h, opacity: t_o };
	
			elem.animate(anim, 50, function(){
				if ( t_w == "show" )
					equals( this.style.display, "block", "Showing, display should block: " + this.style.display);
					
				if ( t_w == "hide"||t_w == "show" )
					equals(this.style.width.indexOf(f_w), 0, "Width must be reset to " + f_w + ": " + this.style.width);
					
				if ( t_h == "hide"||t_h == "show" )
					equals(this.style.height.indexOf(f_h), 0, "Height must be reset to " + f_h + ": " + this.style.height);
					
				var cur_o = jQuery.attr(this.style, "opacity");
				if ( cur_o !== "" ) cur_o = parseFloat( cur_o );
	
				if ( t_o == "hide"||t_o == "show" )
					equals(cur_o, f_o, "Opacity must be reset to " + f_o + ": " + cur_o);
					
				if ( t_w == "hide" )
					equals(this.style.display, "none", "Hiding, display should be none: " + this.style.display);
					
				if ( t_o.constructor == Number ) {
					equals(cur_o, t_o, "Final opacity should be " + t_o + ": " + cur_o);
					
					ok(jQuery.curCSS(this, "opacity") != "" || cur_o == t_o, "Opacity should be explicitly set to " + t_o + ", is instead: " + cur_o);
				}
					
				if ( t_w.constructor == Number ) {
					equals(this.style.width, t_w + "px", "Final width should be " + t_w + ": " + this.style.width);
					
					var cur_w = jQuery.css(this,"width");

					ok(this.style.width != "" || cur_w == t_w, "Width should be explicitly set to " + t_w + ", is instead: " + cur_w);
				}
					
				if ( t_h.constructor == Number ) {
					equals(this.style.height, t_h + "px", "Final height should be " + t_h + ": " + this.style.height);
					
					var cur_h = jQuery.css(this,"height");

					ok(this.style.height != "" || cur_h == t_h, "Height should be explicitly set to " + t_h + ", is instead: " + cur_w);
				}
				
				if ( t_h == "show" ) {
					var old_h = jQuery.curCSS(this, "height");
					jQuery(elem).append("<br/>Some more text<br/>and some more...");
					ok(old_h != jQuery.css(this, "height" ), "Make sure height is auto.");
				}
	
				start();
			});
		});
	});
});

jQuery.fn.saveState = function(){
	var check = ['opacity','height','width','display','overflow'];	
	expect(check.length);
	
	stop();
	return this.each(function(){
		var self = this;
		self.save = {};
		jQuery.each(check, function(i,c){
			self.save[c] = jQuery.css(self,c);
		});
	});
};

jQuery.checkState = function(){
	var self = this;
	jQuery.each(this.save, function(c,v){
		var cur = jQuery.css(self,c);
		equals( v, cur, "Make sure that " + c + " is reset (Old: " + v + " Cur: " + cur + ")");
	});
	start();
}

// Chaining Tests
test("Chain fadeOut fadeIn", function() {
	jQuery('#fadein div').saveState().fadeOut('fast').fadeIn('fast',jQuery.checkState);
});
test("Chain fadeIn fadeOut", function() {
	jQuery('#fadeout div').saveState().fadeIn('fast').fadeOut('fast',jQuery.checkState);
});

test("Chain hide show", function() {
	jQuery('#show div').saveState().hide('fast').show('fast',jQuery.checkState);
});
test("Chain show hide", function() {
	jQuery('#hide div').saveState().show('fast').hide('fast',jQuery.checkState);
});

test("Chain toggle in", function() {
	jQuery('#togglein div').saveState().toggle('fast').toggle('fast',jQuery.checkState);
});
test("Chain toggle out", function() {
	jQuery('#toggleout div').saveState().toggle('fast').toggle('fast',jQuery.checkState);
});

test("Chain slideDown slideUp", function() {
	jQuery('#slidedown div').saveState().slideDown('fast').slideUp('fast',jQuery.checkState);
});
test("Chain slideUp slideDown", function() {
	jQuery('#slideup div').saveState().slideUp('fast').slideDown('fast',jQuery.checkState);
});

test("Chain slideToggle in", function() {
	jQuery('#slidetogglein div').saveState().slideToggle('fast').slideToggle('fast',jQuery.checkState);
});
test("Chain slideToggle out", function() {
	jQuery('#slidetoggleout div').saveState().slideToggle('fast').slideToggle('fast',jQuery.checkState);
});

jQuery.makeTest = function( text ){
	var elem = jQuery("<div></div>")
		.attr("id", "test" + jQuery.makeTest.id++)
		.addClass("box");

	jQuery("<h4></h4>")
		.text( text )
		.appendTo("#fx-tests")
		.click(function(){
			jQuery(this).next().toggle();
		})
		.after( elem );

	return elem;
}

jQuery.makeTest.id = 1;
