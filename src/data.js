(function( jQuery ) {

var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},
	internalCache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem, pvt /* internal use only */ ) {
		var thisCache,
			isNode = elem.nodeType,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		if ( isNode ) {
			if ( !id ) {
				return false;
			}

			thisCache = ( pvt ? jQuery.internalCache : jQuery.cache )[ id ];
			if ( pvt === undefined && (!thisCache || isEmptyDataObject(thisCache)) ) {
				thisCache = jQuery.internalCache[ id ];
			}
		} else {
			thisCache = elem[ id ];
			if ( pvt && thisCache) {
				thisCache = thisCache[ id ];
			}
		}

		return !!thisCache && !isEmptyDataObject( thisCache );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ?
				( pvt ? jQuery.internalCache : jQuery.cache ) :
				( pvt ? elem[ internalKey ] : elem ),

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!cache || !id || !cache[ id ]) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		// only happens when using internal data on a non-node
		if ( !cache ) {
			cache = elem[ internalKey ] = {
				toJSON: jQuery.noop
			};
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			cache[ id ] = jQuery.extend(cache[ id ], name);
		}

		thisCache = cache[ id ];

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Leak the 'events' key from the internal cache in the public data API
		// for backwards compat
		if ( name === "events" && !thisCache[ name ] && !pvt ) {
			return jQuery.data( elem, name, data, true );
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ?
				( pvt ? jQuery.internalCache : jQuery.cache ) :
				( pvt ? elem[ jQuery.expando ] : elem ),

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando,
			thisCache = cache && cache[ id ];

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !thisCache ) {
			return;
		}

		if ( name ) {

			// Support interoperable removal of hyphenated or camelcased keys
			if ( !thisCache[ name ] ) {
				name = jQuery.camelCase( name );
			}

			delete thisCache[ name ];

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !isEmptyDataObject(thisCache) ) {
				return;
			}
		}

		// removing "data" on a plain object - keep the internal data around
		if ( !isNode && !pvt && !isEmptyDataObject( thisCache[ jQuery.expando ] ) ) {
			cache[ id ] = {
				toJSON: jQuery.noop
			};
			cache[ id ][ jQuery.expando ] = thisCache[ jQuery.expando ];
			return;
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// remove data cache if it is empty
		if ( !isNode && pvt && isEmptyDataObject( cache ) ) {
			jQuery.removeData( elem );
		}

		if ( isNode && !jQuery.hasData( elem, !pvt ) ) {
			
			// delete the other cache object (it was empty, we just checked)
			delete jQuery[ pvt ? "cache" : "internalCache" ][ id ];

			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
			    var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

})( jQuery );
