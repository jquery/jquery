var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},
	
	expando:expando,

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache;

		// Compute a unique ID for the element
		if(!id) id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !cache[ id ] )
			cache[ id ] = {};

		var thisCache = cache[ id ];

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) thisCache[ name ] = data;

		if(name === true) return thisCache
		else if(name) return thisCache[name]
		else return id
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if( jQuery.isEmptyObject(thisCache) )
					jQuery.removeData( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete cache[ id ];
		}
	},
	queue: function( elem, type, data ) {
		if( !elem ) return;

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if( !data ) return q || [];

		if ( !q || jQuery.isArray(data) )
			q = jQuery.data( elem, type, jQuery.makeArray(data) );
		else
			q.push( data );

		return q;
	},

	dequeue: function( elem, type ){
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if( fn === "inprogress" ) fn = queue.shift();

		if( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if( type == "fx" ) queue.unshift("inprogress");

			fn.call(elem, function() { jQuery.dequeue(elem, type); });
		}
	}
});

jQuery.fn.extend({
	data: function( key, value ){
		if(typeof key === "undefined" && this.length) return jQuery.data(this[0], true);

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length )
				data = jQuery.data( this[0], key );

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},
	queue: function(type, data){
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined )
			return jQuery.queue( this[0], type );

		return this.each(function(i, elem){
			var queue = jQuery.queue( this, type, data );

			if( type == "fx" && queue[0] !== "inprogress" )
				jQuery.dequeue( this, type )
		});
	},
	dequeue: function(type){
		return this.each(function(){
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function(type){
		return this.queue( type || "fx", [] );
	}
});