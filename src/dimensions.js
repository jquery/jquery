(function( jQuery ) {

// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// height, width, innerHeight and innerWidth
	jQuery.each( { padding: "inner" + name, content: type }, function( extra, funcName ) {
		jQuery.fn[ funcName ] = function( value ) {
			var args = [ type, extra ];
			if ( arguments.length ) {
				args.push( value );
			}
			return getDimension.apply( this, args );
		};
	});

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin, value ) {
		var args = [ type, ( margin === true || value === true ) ? "margin" : "border" ];
		if ( arguments.length && typeof margin !== "boolean" ) {
			args.push( margin );
		}
		return getDimension.apply( this, args );
	};

	function getDimension( type, extra, value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
				// isn't a whole lot we can do. See pull request at this URL for discussion:
				// https://github.com/jquery/jquery/pull/764
				return elem.document.documentElement[ clientProp ];
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type, extra );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery.style( elem, type, value, extra );
		}, type, value, arguments.length > 2, null );
	}
});

})( jQuery );
