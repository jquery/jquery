// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function(i, name){

	var tl = name == "Height" ? "Top"    : "Left",  // top or left
		br = name == "Height" ? "Bottom" : "Right"; // bottom or right
	
	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function(){
		return this[ name.toLowerCase() ]() + 
			num(this, "padding" + tl) + 
			num(this, "padding" + br);
	};
	
	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function(margin) {
		return this["inner" + name]() + 
			num(this, "border" + tl + "Width") +
			num(this, "border" + br + "Width") +
			(!!margin ? 
				num(this, "margin" + tl) + num(this, "margin" + br) : 0);
	};
	
});

function num(elem, prop) {
	elem = elem.jquery ? elem[0] : elem;
	return elem && parseInt( jQuery.curCSS(elem, prop, true) ) || 0;
}