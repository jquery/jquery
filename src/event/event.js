/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code orignated from 
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function(element, type, handler, data) {
		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.browser.msie && element.setInterval != undefined )
			element = window;
		
		// Make sure that the function being executed has a unique ID
		if ( !handler.guid )
			handler.guid = this.guid++;
			
		// if data is passed, bind to handler 
		if( data != undefined ) { 
        	// Create temporary function pointer to original handler 
			var fn = handler; 

			// Create unique handler function, wrapped around original handler 
			handler = function() { 
				// Pass arguments and context to original handler 
				return fn.apply(this, arguments); 
			};

			// Store data in unique handler 
			handler.data = data;

			// Set the guid of unique handler to the same of original handler, so it can be removed 
			handler.guid = fn.guid;
		}

		// Init the element's event structure
		if (!element.$events)
			element.$events = {};
		
		if (!element.$handle)
			element.$handle = function() {
				// returned undefined or false
				var val;

				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				if ( typeof jQuery == "undefined" || jQuery.event.triggered )
				  return val;
				
				val = jQuery.event.handle.apply(element, arguments);
				
				return val;
			};

		// Get the current list of functions bound to this event
		var handlers = element.$events[type];

		// Init the event handler queue
		if (!handlers) {
			handlers = element.$events[type] = {};	
			
			// And bind the global event handler to the element
			if (element.addEventListener)
				element.addEventListener(type, element.$handle, false);
			else
				element.attachEvent("on" + type, element.$handle);
		}

		// Add the function to the element's handler list
		handlers[handler.guid] = handler;

		// Keep track of which events have been used, for global triggering
		this.global[type] = true;
	},

	guid: 1,
	global: {},

	// Detach an event or set of events from an element
	remove: function(element, type, handler) {
		var events = element.$events, ret, index;

		if ( events ) {
			// type is actually an event object here
			if ( type && type.type ) {
				handler = type.handler;
				type = type.type;
			}
			
			if ( !type ) {
				for ( type in events )
					this.remove( element, type );

			} else if ( events[type] ) {
				// remove the given handler for the given type
				if ( handler )
					delete events[type][handler.guid];
				
				// remove all handlers for the given type
				else
					for ( handler in element.$events[type] )
						delete events[type][handler];

				// remove generic event handler if no more handlers exist
				for ( ret in events[type] ) break;
				if ( !ret ) {
					if (element.removeEventListener)
						element.removeEventListener(type, element.$handle, false);
					else
						element.detachEvent("on" + type, element.$handle);
					ret = null;
					delete events[type];
				}
			}

			// Remove the expando if it's no longer used
			for ( ret in events ) break;
			if ( !ret )
				element.$handle = element.$events = null;
		}
	},

	trigger: function(type, data, element) {
		// Clone the incoming data, if any
		data = jQuery.makeArray(data || []);

		// Handle a global trigger
		if ( !element ) {
			// Only trigger if we've ever bound an event for it
			if ( this.global[type] )
				jQuery("*").trigger(type, data);

		// Handle triggering a single element
		} else {
			var val, ret, fn = jQuery.isFunction( element[ type ] || null );
			
			// Pass along a fake event
			data.unshift( this.fix({ type: type, target: element }) );

			// Trigger the event
			if ( jQuery.isFunction( element.$handle ) )
				val = element.$handle.apply( element, data );
			if ( !fn && element["on"+type] && element["on"+type].apply( element, data ) === false )
				val = false;

			if ( fn && val !== false && !(jQuery.nodeName(element, 'a') && type == "click") ) {
				this.triggered = true;
				element[ type ]();
			}

			this.triggered = false;
		}
	},

	handle: function(event) {
		// returned undefined or false
		var val;

		// Empty object is for triggered events with no data
		event = jQuery.event.fix( event || window.event || {} ); 

		var c = this.$events && this.$events[event.type], args = [].slice.call( arguments, 1 );
		args.unshift( event );

		for ( var j in c ) {
			// Pass in a reference to the handler function itself
			// So that we can later remove it
			args[0].handler = c[j];
			args[0].data = c[j].data;

			if ( c[j].apply( this, args ) === false ) {
				event.preventDefault();
				event.stopPropagation();
				val = false;
			}
		}

		// Clean up added properties in IE to prevent memory leak
		if (jQuery.browser.msie)
			event.target = event.preventDefault = event.stopPropagation =
				event.handler = event.data = null;

		return val;
	},

	fix: function(event) {
		// store a copy of the original event object 
		// and clone to set read-only properties
		var originalEvent = event;
		event = jQuery.extend({}, originalEvent);
		
		// add preventDefault and stopPropagation since 
		// they will not work on the clone
		event.preventDefault = function() {
			// if preventDefault exists run it on the original event
			if (originalEvent.preventDefault)
				return originalEvent.preventDefault();
			// otherwise set the returnValue property of the original event to false (IE)
			originalEvent.returnValue = false;
		};
		event.stopPropagation = function() {
			// if stopPropagation exists run it on the original event
			if (originalEvent.stopPropagation)
				return originalEvent.stopPropagation();
			// otherwise set the cancelBubble property of the original event to true (IE)
			originalEvent.cancelBubble = true;
		};
		
		// Fix target property, if necessary
		if ( !event.target && event.srcElement )
			event.target = event.srcElement;
				
		// check if target is a textnode (safari)
		if (jQuery.browser.safari && event.target.nodeType == 3)
			event.target = originalEvent.target.parentNode;

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var e = document.documentElement, b = document.body;
			event.pageX = event.clientX + (e && e.scrollLeft || b.scrollLeft || 0);
			event.pageY = event.clientY + (e && e.scrollTop || b.scrollTop || 0);
		}
			
		// Add which for key events
		if ( !event.which && (event.charCode || event.keyCode) )
			event.which = event.charCode || event.keyCode;
		
		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		// Add which for click: 1 == left; 2 == middle; 3 == right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
			
		return event;
	}
};

jQuery.fn.extend({

	/**
	 * Binds a handler to a particular event (like click) for each matched element.
	 * The event handler is passed an event object that you can use to prevent
	 * default behaviour. To stop both default action and event bubbling, your handler
	 * has to return false.
	 *
	 * In most cases, you can define your event handlers as anonymous functions
	 * (see first example). In cases where that is not possible, you can pass additional
	 * data as the second parameter (and the handler function as the third), see 
	 * second example.
	 *
	 * Calling bind with an event type of "unload" will automatically
	 * use the one method instead of bind to prevent memory leaks.
	 *
	 * @example $("p").bind("click", function(){
	 *   alert( $(this).text() );
	 * });
	 * @before <p>Hello</p>
	 * @result alert("Hello")
	 *
	 * @example function handler(event) {
	 *   alert(event.data.foo);
	 * }
	 * $("p").bind("click", {foo: "bar"}, handler)
	 * @result alert("bar")
	 * @desc Pass some additional data to the event handler.
	 *
	 * @example $("form").bind("submit", function() { return false; })
	 * @desc Cancel a default action and prevent it from bubbling by returning false
	 * from your function.
	 *
	 * @example $("form").bind("submit", function(event){
	 *   event.preventDefault();
	 * });
	 * @desc Cancel only the default action by using the preventDefault method.
	 *
	 *
	 * @example $("form").bind("submit", function(event){
	 *   event.stopPropagation();
	 * });
	 * @desc Stop only an event from bubbling by using the stopPropagation method.
	 *
	 * @name bind
	 * @type jQuery
	 * @param String type An event type
	 * @param Object data (optional) Additional data passed to the event handler as event.data
	 * @param Function fn A function to bind to the event on each of the set of matched elements
	 * @cat Events
	 */
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},
	
	/**
	 * Binds a handler to a particular event (like click) for each matched element.
	 * The handler is executed only once for each element. Otherwise, the same rules
	 * as described in bind() apply.
	 * The event handler is passed an event object that you can use to prevent
	 * default behaviour. To stop both default action and event bubbling, your handler
	 * has to return false.
	 *
	 * In most cases, you can define your event handlers as anonymous functions
	 * (see first example). In cases where that is not possible, you can pass additional
	 * data as the second paramter (and the handler function as the third), see 
	 * second example.
	 *
	 * @example $("p").one("click", function(){
	 *   alert( $(this).text() );
	 * });
	 * @before <p>Hello</p>
	 * @result alert("Hello")
	 *
	 * @name one
	 * @type jQuery
	 * @param String type An event type
	 * @param Object data (optional) Additional data passed to the event handler as event.data
	 * @param Function fn A function to bind to the event on each of the set of matched elements
	 * @cat Events
	 */
	one: function( type, data, fn ) {
		return this.each(function(){
			jQuery.event.add( this, type, function(event) {
				jQuery(this).unbind(event);
				return (fn || data).apply( this, arguments);
			}, fn && data);
		});
	},

	/**
	 * The opposite of bind, removes a bound event from each of the matched
	 * elements.
	 *
	 * Without any arguments, all bound events are removed.
	 *
	 * If the type is provided, all bound events of that type are removed.
	 *
	 * If the function that was passed to bind is provided as the second argument,
	 * only that specific event handler is removed.
	 *
	 * @example $("p").unbind()
	 * @before <p onclick="alert('Hello');">Hello</p>
	 * @result [ <p>Hello</p> ]
	 *
	 * @example $("p").unbind( "click" )
	 * @before <p onclick="alert('Hello');">Hello</p>
	 * @result [ <p>Hello</p> ]
	 *
	 * @example $("p").unbind( "click", function() { alert("Hello"); } )
	 * @before <p onclick="alert('Hello');">Hello</p>
	 * @result [ <p>Hello</p> ]
	 *
	 * @name unbind
	 * @type jQuery
	 * @param String type (optional) An event type
	 * @param Function fn (optional) A function to unbind from the event on each of the set of matched elements
	 * @cat Events
	 */
	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	/**
	 * Trigger a type of event on every matched element. This will also cause
	 * the default action of the browser with the same name (if one exists)
	 * to be executed. For example, passing 'submit' to the trigger()
	 * function will also cause the browser to submit the form. This
	 * default action can be prevented by returning false from one of
	 * the functions bound to the event.
	 *
	 * You can also trigger custom events registered with bind.
	 *
	 * @example $("p").trigger("click")
	 * @before <p click="alert('hello')">Hello</p>
	 * @result alert('hello')
	 *
	 * @example $("p").click(function(event, a, b) {
	 *   // when a normal click fires, a and b are undefined
	 *   // for a trigger like below a refers too "foo" and b refers to "bar"
	 * }).trigger("click", ["foo", "bar"]);
	 * @desc Example of how to pass arbitrary data to an event
	 * 
	 * @example $("p").bind("myEvent",function(event,message1,message2) {
	 * 	alert(message1 + ' ' + message2);
	 * });
	 * $("p").trigger("myEvent",["Hello","World"]);
	 * @result alert('Hello World') // One for each paragraph
	 *
	 * @name trigger
	 * @type jQuery
	 * @param String type An event type to trigger.
	 * @param Array data (optional) Additional data to pass as arguments (after the event object) to the event handler
	 * @cat Events
	 */
	trigger: function( type, data ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this );
		});
	},

	/**
	 * Toggle between two function calls every other click.
	 * Whenever a matched element is clicked, the first specified function 
	 * is fired, when clicked again, the second is fired. All subsequent 
	 * clicks continue to rotate through the two functions.
	 *
	 * Use unbind("click") to remove.
	 *
	 * @example $("p").toggle(function(){
	 *   $(this).addClass("selected");
	 * },function(){
	 *   $(this).removeClass("selected");
	 * });
	 * 
	 * @name toggle
	 * @type jQuery
	 * @param Function even The function to execute on every even click.
	 * @param Function odd The function to execute on every odd click.
	 * @cat Events
	 */
	toggle: function() {
		// Save reference to arguments for access in closure
		var a = arguments;

		return this.click(function(e) {
			// Figure out which function to execute
			this.lastToggle = 0 == this.lastToggle ? 1 : 0;
			
			// Make sure that clicks stop
			e.preventDefault();
			
			// and execute the function
			return a[this.lastToggle].apply( this, [e] ) || false;
		});
	},
	
	/**
	 * A method for simulating hovering (moving the mouse on, and off,
	 * an object). This is a custom method which provides an 'in' to a 
	 * frequent task.
	 *
	 * Whenever the mouse cursor is moved over a matched 
	 * element, the first specified function is fired. Whenever the mouse 
	 * moves off of the element, the second specified function fires. 
	 * Additionally, checks are in place to see if the mouse is still within 
	 * the specified element itself (for example, an image inside of a div), 
	 * and if it is, it will continue to 'hover', and not move out 
	 * (a common error in using a mouseout event handler).
	 *
	 * @example $("p").hover(function(){
	 *   $(this).addClass("hover");
	 * },function(){
	 *   $(this).removeClass("hover");
	 * });
	 *
	 * @name hover
	 * @type jQuery
	 * @param Function over The function to fire whenever the mouse is moved over a matched element.
	 * @param Function out The function to fire whenever the mouse is moved off of a matched element.
	 * @cat Events
	 */
	hover: function(f,g) {
		
		// A private function for handling mouse 'hovering'
		function handleHover(e) {
			// Check if mouse(over|out) are still within the same parent element
			var p = e.relatedTarget;
	
			// Traverse up the tree
			while ( p && p != this ) try { p = p.parentNode; } catch(e) { p = this; };
			
			// If we actually just moused on to a sub-element, ignore it
			if ( p == this ) return false;
			
			// Execute the right function
			return (e.type == "mouseover" ? f : g).apply(this, [e]);
		}
		
		// Bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	},
	
	/**
	 * Bind a function to be executed whenever the DOM is ready to be
	 * traversed and manipulated. This is probably the most important 
	 * function included in the event module, as it can greatly improve
	 * the response times of your web applications.
	 *
	 * In a nutshell, this is a solid replacement for using window.onload, 
	 * and attaching a function to that. By using this method, your bound function 
	 * will be called the instant the DOM is ready to be read and manipulated, 
	 * which is when what 99.99% of all JavaScript code needs to run.
	 *
	 * There is one argument passed to the ready event handler: A reference to
	 * the jQuery function. You can name that argument whatever you like, and
	 * can therefore stick with the $ alias without risk of naming collisions.
	 * 
	 * Please ensure you have no code in your &lt;body&gt; onload event handler, 
	 * otherwise $(document).ready() may not fire.
	 *
	 * You can have as many $(document).ready events on your page as you like.
	 * The functions are then executed in the order they were added.
	 *
	 * @example $(document).ready(function(){ Your code here... });
	 *
	 * @example jQuery(function($) {
	 *   // Your code using failsafe $ alias here...
	 * });
	 * @desc Uses both the [[Core#.24.28_fn_.29|shortcut]] for $(document).ready() and the argument
	 * to write failsafe jQuery code using the $ alias, without relying on the
	 * global alias.
	 *
	 * @name ready
	 * @type jQuery
	 * @param Function fn The function to be executed when the DOM is ready.
	 * @cat Events
	 * @see $.noConflict()
	 * @see $(Function)
	 */
	ready: function(f) {
		// If the DOM is already ready
		if ( jQuery.isReady )
			// Execute the function immediately
			f.apply( document, [jQuery] );
			
		// Otherwise, remember the function for later
		else
			// Add the function to the wait list
			jQuery.readyList.push( function() { return f.apply(this, [jQuery]); } );
	
		return this;
	}
});

jQuery.extend({
	/*
	 * All the code that makes DOM Ready work nicely.
	 */
	isReady: false,
	readyList: [],
	
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Remember that the DOM is ready
			jQuery.isReady = true;
			
			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				jQuery.each( jQuery.readyList, function(){
					this.apply( document );
				});
				
				// Reset the list of functions
				jQuery.readyList = null;
			}
			// Remove event listener to avoid memory leak
			if ( jQuery.browser.mozilla || jQuery.browser.opera )
				document.removeEventListener( "DOMContentLoaded", jQuery.ready, false );
			
			// Remove script element used by IE hack
			if( !window.frames.length ) // don't remove if frames are present (#1187)
				jQuery(window).load(function(){ jQuery("#__ie_init").remove(); });
		}
	}
});

new function(){

	/**
	 * Bind a function to the scroll event of each matched element.
	 *
	 * @example $("p").scroll( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onscroll="alert('Hello');">Hello</p>
	 *
	 * @name scroll
	 * @type jQuery
	 * @param Function fn A function to bind to the scroll event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the submit event of each matched element.
	 *
	 * @example $("#myform").submit( function() {
	 *   return $("input", this).val().length > 0;
	 * } );
	 * @before <form id="myform"><input /></form>
	 * @desc Prevents the form submission when the input has no value entered.
	 *
	 * @name submit
	 * @type jQuery
	 * @param Function fn A function to bind to the submit event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Trigger the submit event of each matched element. This causes all of the functions
	 * that have been bound to that submit event to be executed, and calls the browser's
	 * default submit action on the matching element(s). This default action can be prevented
	 * by returning false from one of the functions bound to the submit event.
	 *
	 * Note: This does not execute the submit method of the form element! If you need to
	 * submit the form via code, you have to use the DOM method, eg. $("form")[0].submit();
	 *
	 * @example $("form").submit();
	 * @desc Triggers all submit events registered to the matched form(s), and submits them.
	 *
	 * @name submit
	 * @type jQuery
	 * @cat Events
	 */

	/**
	 * Bind a function to the focus event of each matched element.
	 *
	 * @example $("p").focus( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onfocus="alert('Hello');">Hello</p>
	 *
	 * @name focus
	 * @type jQuery
	 * @param Function fn A function to bind to the focus event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Trigger the focus event of each matched element. This causes all of the functions
	 * that have been bound to thet focus event to be executed.
	 *
	 * Note: This does not execute the focus method of the underlying elements! If you need to
	 * focus an element via code, you have to use the DOM method, eg. $("#myinput")[0].focus();
	 *
	 * @example $("p").focus();
	 * @before <p onfocus="alert('Hello');">Hello</p>
	 * @result alert('Hello');
	 *
	 * @name focus
	 * @type jQuery
	 * @cat Events
	 */

	/**
	 * Bind a function to the keydown event of each matched element.
	 *
	 * @example $("p").keydown( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onkeydown="alert('Hello');">Hello</p>
	 *
	 * @name keydown
	 * @type jQuery
	 * @param Function fn A function to bind to the keydown event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the dblclick event of each matched element.
	 *
	 * @example $("p").dblclick( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p ondblclick="alert('Hello');">Hello</p>
	 *
	 * @name dblclick
	 * @type jQuery
	 * @param Function fn A function to bind to the dblclick event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the keypress event of each matched element.
	 *
	 * @example $("p").keypress( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onkeypress="alert('Hello');">Hello</p>
	 *
	 * @name keypress
	 * @type jQuery
	 * @param Function fn A function to bind to the keypress event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the error event of each matched element.
	 *
	 * @example $("p").error( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onerror="alert('Hello');">Hello</p>
	 *
	 * @name error
	 * @type jQuery
	 * @param Function fn A function to bind to the error event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the blur event of each matched element.
	 *
	 * @example $("p").blur( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onblur="alert('Hello');">Hello</p>
	 *
	 * @name blur
	 * @type jQuery
	 * @param Function fn A function to bind to the blur event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Trigger the blur event of each matched element. This causes all of the functions
	 * that have been bound to that blur event to be executed, and calls the browser's
	 * default blur action on the matching element(s). This default action can be prevented
	 * by returning false from one of the functions bound to the blur event.
	 *
	 * Note: This does not execute the blur method of the underlying elements! If you need to
	 * blur an element via code, you have to use the DOM method, eg. $("#myinput")[0].blur();
	 *
	 * @example $("p").blur();
	 * @before <p onblur="alert('Hello');">Hello</p>
	 * @result alert('Hello');
	 *
	 * @name blur
	 * @type jQuery
	 * @cat Events
	 */

	/**
	 * Bind a function to the load event of each matched element.
	 *
	 * @example $("p").load( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onload="alert('Hello');">Hello</p>
	 *
	 * @name load
	 * @type jQuery
	 * @param Function fn A function to bind to the load event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the select event of each matched element.
	 *
	 * @example $("p").select( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onselect="alert('Hello');">Hello</p>
	 *
	 * @name select
	 * @type jQuery
	 * @param Function fn A function to bind to the select event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Trigger the select event of each matched element. This causes all of the functions
	 * that have been bound to that select event to be executed, and calls the browser's
	 * default select action on the matching element(s). This default action can be prevented
	 * by returning false from one of the functions bound to the select event.
	 *
	 * @example $("p").select();
	 * @before <p onselect="alert('Hello');">Hello</p>
	 * @result alert('Hello');
	 *
	 * @name select
	 * @type jQuery
	 * @cat Events
	 */

	/**
	 * Bind a function to the mouseup event of each matched element.
	 *
	 * @example $("p").mouseup( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onmouseup="alert('Hello');">Hello</p>
	 *
	 * @name mouseup
	 * @type jQuery
	 * @param Function fn A function to bind to the mouseup event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the unload event of each matched element.
	 *
	 * @example $("p").unload( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onunload="alert('Hello');">Hello</p>
	 *
	 * @name unload
	 * @type jQuery
	 * @param Function fn A function to bind to the unload event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the change event of each matched element.
	 *
	 * @example $("p").change( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onchange="alert('Hello');">Hello</p>
	 *
	 * @name change
	 * @type jQuery
	 * @param Function fn A function to bind to the change event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the mouseout event of each matched element.
	 *
	 * @example $("p").mouseout( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onmouseout="alert('Hello');">Hello</p>
	 *
	 * @name mouseout
	 * @type jQuery
	 * @param Function fn A function to bind to the mouseout event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the keyup event of each matched element.
	 *
	 * @example $("p").keyup( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onkeyup="alert('Hello');">Hello</p>
	 *
	 * @name keyup
	 * @type jQuery
	 * @param Function fn A function to bind to the keyup event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the click event of each matched element.
	 *
	 * @example $("p").click( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onclick="alert('Hello');">Hello</p>
	 *
	 * @name click
	 * @type jQuery
	 * @param Function fn A function to bind to the click event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Trigger the click event of each matched element. This causes all of the functions
	 * that have been bound to thet click event to be executed.
	 *
	 * @example $("p").click();
	 * @before <p onclick="alert('Hello');">Hello</p>
	 * @result alert('Hello');
	 *
	 * @name click
	 * @type jQuery
	 * @cat Events
	 */

	/**
	 * Bind a function to the resize event of each matched element.
	 *
	 * @example $("p").resize( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onresize="alert('Hello');">Hello</p>
	 *
	 * @name resize
	 * @type jQuery
	 * @param Function fn A function to bind to the resize event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the mousemove event of each matched element.
	 *
	 * @example $("p").mousemove( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onmousemove="alert('Hello');">Hello</p>
	 *
	 * @name mousemove
	 * @type jQuery
	 * @param Function fn A function to bind to the mousemove event on each of the matched elements.
	 * @cat Events
	 */

	/**
	 * Bind a function to the mousedown event of each matched element.
	 *
	 * @example $("p").mousedown( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onmousedown="alert('Hello');">Hello</p>
	 *
	 * @name mousedown
	 * @type jQuery
	 * @param Function fn A function to bind to the mousedown event on each of the matched elements.
	 * @cat Events
	 */
	 
	/**
	 * Bind a function to the mouseover event of each matched element.
	 *
	 * @example $("p").mouseover( function() { alert("Hello"); } );
	 * @before <p>Hello</p>
	 * @result <p onmouseover="alert('Hello');">Hello</p>
	 *
	 * @name mouseover
	 * @type jQuery
	 * @param Function fn A function to bind to the mousedown event on each of the matched elements.
	 * @cat Events
	 */
	jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
		"mousedown,mouseup,mousemove,mouseover,mouseout,change,select," + 
		"submit,keydown,keypress,keyup,error").split(","), function(i,o){
		
		// Handle event binding
		jQuery.fn[o] = function(f){
			return f ? this.bind(o, f) : this.trigger(o);
		};
			
	});
	
	// If Mozilla is used
	if ( jQuery.browser.mozilla || jQuery.browser.opera )
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", jQuery.ready, false );
	
	// If IE is used, use the excellent hack by Matthias Miller
	// http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited
	else if ( jQuery.browser.msie ) {
	
		// Only works if you document.write() it
		document.write("<scr" + "ipt id=__ie_init defer=true " + 
			"src=//:><\/script>");
	
		// Use the defer script hack
		var script = document.getElementById("__ie_init");
		
		// script does not exist if jQuery is loaded dynamically
		if ( script ) 
			script.onreadystatechange = function() {
				if ( document.readyState != "complete" ) return;
				jQuery.ready();
			};
	
		// Clear from memory
		script = null;
	
	// If Safari  is used
	} else if ( jQuery.browser.safari )
		// Continually check to see if the document.readyState is valid
		jQuery.safariTimer = setInterval(function(){
			// loaded and complete are both valid states
			if ( document.readyState == "loaded" || 
				document.readyState == "complete" ) {
	
				// If either one are found, remove the timer
				clearInterval( jQuery.safariTimer );
				jQuery.safariTimer = null;
	
				// and execute any waiting functions
				jQuery.ready();
			}
		}, 10); 

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
	
};
