define( [
	"../core"
], function( jQuery ) {
jQuery.fn.extend( {
	getCSSPath: function( path ) {
		if ( typeof path === "undefined" ) {
			path = "";
		}
		if ( this.is( "html" ) ) {
			return "html" + path;
		}

		var cur = this.get( 0 ).nodeName.toLowerCase(),
			index = this.index() + 1,
			id    = this.attr( "id" ),
			classes = this.attr( "class" );

		if ( typeof id !== "undefined" ) {
			cur += "#" + id;
		} else if ( typeof classes !== "undefined" ) {
			var elemlen = this.parent().children( cur ).length,
				classesList = classes.split( /[\s\n]+/ ),
				classname = "";
			if ( classesList.length > 0 ) {
				classname = classesList[ 0 ];
				elemlen = this.parent().children( cur + "." + classname ).length;
			}
			if ( elemlen > 1 ) {
				cur += "." + classname + ":nth-child(" + index + ")";
			} else {
				cur += "." + classname;
			}
		}

		return this.parent().getCSSPath( ">" + cur + path );
	}
} );
} );
