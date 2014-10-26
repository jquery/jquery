define([
	"../core"
], function( jQuery ) {

// conveience wrapper to document.createElement()
// less confusing interface to creating DOM elements
var makeElt = jQuery.makeElt = function(element, attributes) {
    var elt = document.createElement(element), attr;

    // convenience to $.makeElt() + node.appendChild()
    elt.appendElt = function(element, attributes) {
        return this.appendChild( makeElt(element, attributes) );
    };

    if (attributes === undefined) {
        return elt;
    }

    // semantic shortcut
    if (attributes.class !== undefined) {
        elt.className = attributes.class;
    }

    // semantic shortcut
    if (attributes.text !== undefined) {
        elt.textContent = attributes.text;
    }

    // will produce full element, given properly formatted
    for (attr in attributes) {
        elt[attr] = attributes[attr];
    }

    return elt;

};

return makeElt;

});
