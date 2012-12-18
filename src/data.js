var user, priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data( label ) {
	this.label = label || null;
	// Nodes|Objects
	this.owners = [];
	// Data objects
	this.cache = [];
}

Data.prototype = {
	constructor: Data,

	add: function( owner ) {
		this.owners.push( owner );
		this.cache[ this.owners.length - 1 ] = {};
		return this;
	},
	update: function( owner, data, value ) {
		var prop,
				index = this.owners.indexOf( owner );

		if ( index === -1 ) {
			this.add( owner );
			index = this.owners.length - 1;
		}
		if ( typeof data === "string" ) {
			this.cache[ index ][ data ] = value;
		} else {
			for ( prop in data ) {
				this.cache[ index ][ prop ] = data[ prop ];
			}
		}
		return this;
	},
	get: function( owner, key ) {
		var cache,
				index = this.owners.indexOf( owner );

		// If a valid owner is found, return cached data at
		// specified key, or entire data object if no key was
		// explicitly specified.
		if ( index > -1 ) {
			cache = this.cache[ index ];

			return key !== undefined ?
				cache[ key ] : cache;
		}

		return this.add( owner ).get( owner, key );
	},
	access: function( owner, key, value ) {
		if ( value === undefined && typeof key !== "object" ) {
			// Assume this is a request to read the cached data
			return this.get( owner, key );
		} else {
			// Allow setting or extending (existing objects) with an
			// object of properties, or a key and val
			return this.update( owner, key, value );
		}
		// Otherwise, this is a read request.
		return this.get( owner, key );
	},
	remove: function( owner, key ) {
		var i, l, name,
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
						name = jQuery.camelCase( key );
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
					name = key.concat( key.map( jQuery.camelCase ) );
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

function data_discard( owner ) {
	user.discard( owner );
	priv.discard( owner );
}

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

				console.log( data );

				if ( elem.nodeType === 1 && !priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					priv.update( elem, { hasDataAttrs: true });
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				user.update( this, key );
			});
		}


		// console.log( key, value );
		return jQuery.access( this, function( value ) {
			var data,
					camelKey = jQuery.camelCase( key );

			// TODO: THIS IS ONLY A ROUGH PASS
			// 				BUT SERIOUSLY... THIS IS THE BED WE'VE MADE.
			if ( value === undefined ) {
				data = user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				data = dataAttr( elem, key, data );
				if ( data !== undefined ) {
					return data;
				}

				data = user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, user.get( elem, key ) ) : null;
			}
			this.each(function() {
				var data = user.get( this, camelKey );

				user.update( this, camelKey, value );

				if ( /-/.test( key ) && data ) {
					user.update( this, key, value );
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
			user.update( elem, key, data, true );
		} else {
			data = undefined;
		}
	}

	return data;
}
