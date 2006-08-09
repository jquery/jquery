var rules = {
	self: "{$}",
	type: function(a){ /*console.log( a, types[a] );*/ return types[a]; },
	"self[*]": "<li><span class='type'><span title='{@type($.type)}'>{$.type}</span></span> <span class='fn'>" + 
		"<a href='#{$.name}' class='name' title='{$.name}: {$.short}'>{$.name}</a>({$.params})</span>" + 
		"<div class='short'>{$.short}</div><div class='more'><div class='desc'>{$.desc}</div>{$.examples}</div></li>",
	"self[*].params[*]": " <span class='arg-type' title='{@type($.type)}'>{$.type}</span> <span class='arg-name' title='{$.desc}'>{$.name}</span> ",
	"self[*].examples[*]": "<div class='example'><h5>Example:</h5><p>{$.desc}</p><pre>{$.code}</pre><b>HTML:</b><pre>{$.before}</pre><b>Result:</b><pre>{$.result}</pre></div>"
};

var types = {
	jQuery: "A jQuery object.",
	Object: "A simple Javascript object. For example, it could be a String or a Number.",
	String: "A string of characters.",
	Number: "A numeric valid.",
	Element: "The Javascript object representation of a DOM Element.",
	Hash: "A Javascript object that contains key/value pairs in the form of properties and values.",
	"Array&lt;Element&gt;": "An Array of DOM Elements.",
	"Array&lt;String&gt;": "An Array of strings.",
	Function: "A reference to a Javascript function."
};

function docsLoaded(docs) {
	// Make sure that there are no private functions
	docs = jQuery.grep( docs, "!a.private" )
		// Sort by function name
		.sort(function(a,b){
			if ( a.name < b.name ) return -1;
			else if ( a.name == b.name ) {
				// Sort by number of parameters
				if ( a.params.length < b.params.length ) return -1;
				else if ( a.params.length == b.params.length ) return 0;
				else return 1;
			} else return 1;
		});

	// Put in the DOM, when it's ready
	$(document).ready(function(){
		$("#docs").html( jsonT( docs, rules ) );
		setTimeout(function(){
		$("#docs").pager( function(){return this.firstChild.nextSibling.nextSibling.firstChild.innerHTML;}, function(s,e){
			$(this).html( jsonT( docs.slice( s, e ), rules ) );
			/*$(this).slideUp("slow",function(){
				this.style.opacity = 1;
				this.style.width = "";
				this.style.height = "";
				$(this).html( jsonT( docs.slice( s, e ), rules ) );
				$(this).slideDown("slow");
			});*/
			$("span",this).filter("[@title]").addClass("tooltip").ToolTipDemo('#fff');
			$("a.name",this).click(function(){
				$("div.more,div.short",this.parentNode.parentNode).toggle();
				return false;
			});
		});
		}, 13);
	});
}
