test("jQuery ajax - image preloading", function() {
	
	stop();
	
	var xhr = jQuery.ajax({
		url: url("../test/data/cow.jpg"),
		dataType: "image"
	}).success(function(image) {
		ok(image.width, "Image preloaded");
		ok(xhr.responseObject === image, "Image is set as responseObject in xhr");
		start();
	});
	
});

test("jQuery ajax - image preloading (error)", function() {
	
	stop();
	
	jQuery.ajax({
		url: url("../test/data/not_here.gif"),
		dataType: "image"
	}).error(function() {
		ok(true, "Image couldn't be found");
		start();
	});
	
});

test("jQuery ajax - image preloading (abort)", function() {
	
	stop();
	
	jQuery.ajax({
		url: url("../test/data/name.php?wait=5"),
		dataType: "image",
		timeout: 100
	}).error(function(_,status) {
		ok(status=="timeout", "Image preloading aborted by timeout");
		start();
	});
	
});

test("jQuery ajax - css (local)", function() {
	
	stop();
	
	jQuery.ajax({
		url: url("../test/data/css.php?wait=1&id=css-test-div-id"),
		dataType: "css"
	}).success(function() {
		ok(true, "CSS local success");
		var div = jQuery("<div id='css-test-div-id' />").appendTo(jQuery("body"));
		strictEqual( div.css("marginLeft") , "27px" , "CSS has been properly applied" );
		div.remove();
		start();
	});
	
});

test("jQuery ajax - css (remote)", function() {
	
	stop();
	
	jQuery.ajax({
		url: url("http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-lightness/jquery-ui.css"),
		dataType: "css"
	}).success(function() {
		ok(true, "CSS remote success");
		
		var div = jQuery("<div class='ui-icon' />").appendTo(jQuery("body")),
			textIndent = 1 * div.css("textIndent").replace(/px/,"");
			
		// Opera 16bits capping
		if ( textIndent === -32768 ) {
			strictEqual( textIndent , -32768 , "CSS has been properly applied" );
		} else {
			strictEqual( textIndent , -99999 , "CSS has been properly applied" );
		}
		
		div.remove();
		
		start();
	});
	
});

test("jQuery ajax - css autoDataType", function() {
	
	stop();
	
	jQuery.ajax({
		url: url("../test/data/css.php?wait=1&id=css-autodatatype")
	}).success(function() {
		ok(true, "Ajax success");
		var div = jQuery("<div id='css-autodatatype' />").appendTo(jQuery("body"));
		strictEqual( div.css("marginLeft") , "27px" , "CSS has been properly auto-determined and applied" );
		div.remove();
		start();
	});
	
});

