var types = {
	jQuery: "A jQuery object.",
	Object: "A simple Javascript object. For example, it could be a String or a Number.",
	String: "A string of characters.",
	Number: "A numeric valid.",
	Element: "The Javascript object representation of a DOM Element.",
	Map: "A Javascript object that contains key/value pairs in the form of properties and values.",
	"Array&lt;Element&gt;": "An Array of DOM Elements.",
	"Array&lt;String&gt;": "An Array of strings.",
	Function: "A reference to a Javascript function.",
	XMLHttpRequest: "An XMLHttpRequest object (referencing a HTTP request).",
	"&lt;Content&gt;": "A String (to generate HTML on-the-fly), a DOM Element, an Array of DOM Elements or a jQuery object"
};

$(document).ready(function(){
	var tooltips = $("span.tooltip").each(function() {
		var type = this.innerHTML;
		if( type.indexOf("|") != -1 ) {
			var $this = $(this).empty();
			$.each(type.split("\|"), function(i, n) {
				var title = types[n] && " title=\"" + types[n] + "\"" || "";
				var pipe = i != 0 ? "|" : "";
				$this.append( pipe + "<span class=\"tooltip\" " + title + ">" + n + "</span>" );
			});
		} else if ( types[ this.innerHTML ] )
			this.title = types[ this.innerHTML ];
	})
	tooltips.add($("span.tooltip", tooltips)).ToolTipDemo('#fff');

	$("a.name").click(function(){
		$("div.more,div.short",this.parentNode.parentNode).toggle();
		return false;
	});
	
	$("#docs").alphaPager(function(a){
		return $.fn.text.apply( [a.getElementsByTagName("span")[2]] ).replace(/^\$\./,"").substr(0,1).toUpperCase();
	});
});
