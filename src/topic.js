(function( jQuery ) {

	var topics = {},
		sliceTopic = [].slice;

	jQuery.Topic = function( id ) {
		var callbacks,
			method,
			topic = id && topics[ id ];
		if ( !topic ) {
			callbacks = jQuery.Callbacks();
			topic = {
				publish: callbacks.fire,
				subscribe: callbacks.add,
				unsubscribe: callbacks.remove
			};
			if ( id ) {
				topics[ id ] = topic;
			}
		}
		return topic;
	};

	jQuery.extend({
		subscribe: function( id ) {
			var topic = jQuery.Topic( id ),
				args = sliceTopic.call( arguments, 1 );
			topic.subscribe.apply( topic, args );
			return {
				topic: topic,
				args: args
			};
		},
		unsubscribe: function( id ) {
			var topic = id && id.topic || jQuery.Topic( id );
			topic.unsubscribe.apply( topic, id && id.args ||
					sliceTopic.call( arguments, 1 ) );
		},
		publish: function( id ) {
			var topic = jQuery.Topic( id );
			topic.publish.apply( topic, sliceTopic.call( arguments, 1 ) );
		}
	});

})( jQuery );
