var types = {
	jQuery: "A jQuery object.",
	Object: "A simple Javascript object. For example, it could be a String or a Number.",
	String: "A string of characters.",
	Number: "A numeric valid.",
	Element: "The Javascript object representation of a DOM Element.",
	Hash: "A Javascript object that contains key/value pairs in the form of properties and values.",
	"Array&lt;Element&gt;": "An Array of DOM Elements.",
	"Array&lt;String&gt;": "An Array of strings.",
	Function: "A reference to a Javascript function.",
	XMLHttpRequest: "An XMLHttpRequest object (referencing a HTTP request)."
};

$(document).ready(function(){
	$("span.tooltip").each(function(){
		if ( types[ this.innerHTML ] )
			this.title = types[ this.innerHTML ];
	}).ToolTipDemo('#fff');

	$("a.name").click(function(){
		$("div.more,div.short",this.parentNode.parentNode)
			.find("div.desc").each(function(){
				$(this).html( $(this).html().replace(/\n\n/g, "<br/><br/>") );
			}).end()
			.toggle('slow');
		return false;
	});
	
	$("#docs").alphaPager(function(a){
		return $.fn.text.apply( [a.getElementsByTagName("span")[2]] ).replace(/^\$\./,"").substr(0,1).toUpperCase();
	});
});
