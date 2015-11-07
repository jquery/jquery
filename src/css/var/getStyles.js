define( [
	"../../core"
], function( jQuery ) {

return function( elem ) {
    return ( jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 ?
        elem.defaultView : elem.ownerDocument.defaultView ).getComputedStyle( elem );
};
} );
