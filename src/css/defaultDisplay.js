define([
	"../core"
], function( jQuery ) {

var displays = {
	li: "list-item",
	table: "table",
	caption: "table-caption",
	colgroup: "table-column-group",
	thead: "table-header-group",
	tfoot: "table-footer-group",
	tbody: "table-row-group",
	col: "table-column",
	td: "table-cell",
	th: "table-cell",
	tr: "table-row"
};

jQuery.map([ "b", "big", "i", "small", "tt",
	"abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong", "samp", "var",
	"a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup",
	"button", "input", "label", "select", "textarea" ],
	function( value ) {
		displays[ value ] = "inline";
	});

function defaultDisplay( elem ) {
	return displays[ elem.nodeName.toLowerCase() ] || "block";
}

return defaultDisplay;
});
