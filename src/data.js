var user, priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Nodes|Objects
	this.owners = [];
	// Data objects
	this.cache = [];
}

Data.prototype = {
	add: function( owner ) {
		this.owners.push( owner );
		return (this.cache[ this.owners.length - 1 ] = {});
	},
	set: function( owner, data, value ) {
		var prop,
				index = this.owners.indexOf( owner );

		if ( index === -1 ) {
			this.add( owner );
			index = this.owners.length - 1;
		}
		if ( typeof data === "string" ) {
			this.cache[ index ][ data ] = value;
		} else {

			if ( jQuery.isEmptyObject( this.cache[ index ] ) ) {
				this.cache[ index ] = data;
			} else {
				for ( prop in data ) {
					this.cache[ index ][ prop ] = data[ prop ];
				}
			}
		}
		return this;
	},
	get: function( owner, key ) {
		var cache,
				index = this.owners.indexOf( owner );

		// A valid cache is found, or needs to be created.
		// New entries will be added and return the current
		// empty data object to be used as a return reference
		// return this.add( owner );
		cache = index === -1 ?
			this.add( owner ) : this.cache[ index ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		if ( value === undefined && (key && typeof key !== "object") ) {
			// Assume this is a request to read the cached data
			return this.get( owner, key );
		} else {

			// If only an owner was specified, return the entire
			// cache object.
			if ( key === undefined ) {
				return this.get( owner );
			}

			// Allow setting or extending (existing objects) with an
			// object of properties, or a key and val
			this.set( owner, key, value );
			return value !== undefined ? value : key;
		}
		// Otherwise, this is a read request.
		return this.get( owner, key );
	},
	remove: function( owner, key ) {
		var i, l, name,
				camel = jQuery.camelCase,
				index = this.owners.indexOf( owner ),
				cache = this.cache[ index ];

		if ( key === undefined ) {
			cache	= {};
		} else {
			if ( cache ) {
				// Support array or space separated string of keys
				if ( !Array.isArray( key ) ) {
					// Try the string as a key before any manipulation
					//

					if ( key in cache ) {
						name = [ key ];
					} else {
						// split the camel cased version by spaces unless a key with the spaces exists
						name = camel( key );
						name = name in cache ?
							[ name ] : name.split(" ");
					}
				} else {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( camel ) );
				}
				i = 0;
				l = name.length;

				for ( ; i < l; i++ ) {
					delete cache[ name[i] ];
				}
			}
		}
		this.cache[ index ] = cache;
	},
	hasData: function( owner ) {
		var index = this.owners.indexOf( owner );

		if ( index > -1 ) {
			return !jQuery.isEmptyObject( this.cache[ index ] );
		}
		return false;
	},
	discard: function( owner ) {
		var index = this.owners.indexOf( owner );
		this.owners.splice( index, 1 );
		this.cache.splice( index, 1 );
		return this;
	}
};

// This will be used by remove() in manipulation to sever
// remaining references to node objects. One day we'll replace the dual
// arrays with a WeakMap and this won't be an issue.
// function data_discard( owner ) {
	// user.discard( owner );
	// priv.discard( owner );
// }

user = new Data();
priv = new Data();


jQuery.extend({
	acceptData: function() {
		return true;
	},
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	hasData: function( elem ) {
		return user.hasData( elem ) || priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		return user.remove( elem, name );
	},

	// TODO: Replace all calls to _data and _removeData with direct
	// calls to
	//
	// priv.access( elem, name, data );
	//
	// priv.remove( elem, name );
	//
	_data: function( elem, name, data ) {
		return priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		return priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = user.get( elem );

				if ( elem.nodeType === 1 && !priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					priv.set( elem, { hasDataAttrs: true });
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
					camelKey = jQuery.camelCase( key );

			// Get the Data...
			if ( value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// As a last resort, attempt to find
				// the data by checking AGAIN, but with
				// a camelCased key.
				data = user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return undefined;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				user.set( this, camelKey, value );

				// *... In the case of properties that might ACTUALLY
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( /-/.test( key ) && data !== undefined ) {
					user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ?
					JSON.parse( data ) : data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}

	return data;
}
