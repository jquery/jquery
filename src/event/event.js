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

		// if data is passed, bind to handler
		if( data ) 
			handler.data = data;

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid )
			handler.guid = this.guid++;

		// Init the element's event structure
		if (!element.events)
			element.events = {};

		// Get the current list of functions bound to this event
		var handlers = element.events[type];

		// If it hasn't been initialized yet
		if (!handlers) {
			// Init the event handler queue
			handlers = element.events[type] = {};

			// Remember an existing handler, if it's already there
			if (element["on" + type])
				handlers[0] = element["on" + type];
		}

		// Add the function to the element's handler list
		handlers[handler.guid] = handler;

		// And bind the global event handler to the element
		element["on" + type] = this.handle;

		// Remember the function in a global list (for triggering)
		if (!this.global[type])
			this.global[type] = [];
		this.global[type].push( element );
	},

	guid: 1,
	global: {},

	// Detach an event or set of events from an element
	remove: function(element, type, handler) {
		if (element.events)
			if ( type && type.type )
				delete element.events[ type.type ][ type.handler.guid ];
			else if (type && element.events[type])
				if ( handler )
					delete element.events[type][handler.guid];
				else
					for ( var i in element.events[type] )
						delete element.events[type][i];
			else
				for ( var j in element.events )
					this.remove( element, j );
	},

	trigger: function(type,data,element) {
		// Clone the incoming data, if any
		data = jQuery.makeArray(data || []);

		// Handle a global trigger
		if ( !element )
			jQuery.each( this.global[type] || [], function(){
				jQuery.event.trigger( type, data, this );
			});

		// Handle triggering a single element
		else {
			var handler = element["on" + type ], val,
				fn = jQuery.isFunction( element[ type ] );

			if ( handler ) {
				// Pass along a fake event
				data.unshift( this.fix({ type: type, target: element }) );
	
				// Trigger the event
				if ( (val = handler.apply( element, data )) !== false )
					this.triggered = true;
			}

			if ( fn && val !== false )
				element[ type ]();

			this.triggered = false;
		}
	},

	handle: function(event) {
		// Handle the second event of a trigger and when
		// an event is called after a page has unloaded
		if ( typeof jQuery == "undefined" || jQuery.event.triggered ) return;

		// Empty object is for triggered events with no data
		event = jQuery.event.fix( event || window.event || {} ); 

		// returned undefined or false
		var returnValue;

		var c = this.events[event.type];

		var args = [].slice.call( arguments, 1 );
		args.unshift( event );

		for ( var j in c ) {
			// Pass in a reference to the handler function itself
			// So that we can later remove it
			args[0].handler = c[j];
			args[0].data = c[j].data;

			if ( c[j].apply( this, args ) === false ) {
				event.preventDefault();
				event.stopPropagation();
				returnValue = false;
			}
		}

		// Clean up added properties in IE to prevent memory leak
		if (jQuery.browser.msie) event.target = event.preventDefault = event.stopPropagation = event.handler = event.data = null;

		return returnValue;
	},

	fix: function(event) {
		// Fix target property, if necessary
		if ( !event.target && event.srcElement )
			event.target = event.srcElement;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == undefined && event.clientX != undefined ) {
			var e = document.documentElement, b = document.body;
			event.pageX = event.clientX + (e.scrollLeft || b.scrollLeft);
			event.pageY = event.clientY + (e.scrollTop || b.scrollTop);
		}
				
		// check if target is a textnode (safari)
		if (jQuery.browser.safari && event.target.nodeType == 3) {
			// store a copy of the original event object 
			// and clone because target is read only
			var originalEvent = event;
			event = jQuery.extend({}, originalEvent);
			
			// get parentnode from textnode
			event.target = originalEvent.target.parentNode;
			
			// add preventDefault and stopPropagation since 
			// they will not work on the clone
			event.preventDefault = function() {
				return originalEvent.preventDefault();
			};
			event.stopPropagation = function() {
				return originalEvent.stopPropagation();
			};
		}
		
		// fix preventDefault and stopPropagation
		if (!event.preventDefault)
			event.preventDefault = function() {
				this.returnValue = false;
			};
			
		if (!event.stopPropagation)
			event.stopPropagation = function() {
				this.cancelBubble = true;
			};
			
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
	 * data as the second paramter (and the handler function as the third), see 
	 * second example.
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
		return this.each(function(){
			jQuery.event.add( this, type, fn || data, data );
		});
	},
	
	/**
	 * Binds a handler to a particular event (like click) for each matched element.
	 * The handler is executed only once for each element. Otherwise, the same rules
	 * as described in bind() apply.
	 The event handler is passed an event object that you can use to prevent
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
			}, data);
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
	 * Trigger a type of event on every matched element.
	 *
	 * @example $("p").trigger("click")
	 * @before <p click="alert('hello')">Hello</p>
	 * @result alert('hello')
	 *
	 * @name trigger
	 * @type jQuery
	 * @param String type An event type to trigger.
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
			this.lastToggle = this.lastToggle == 0 ? 1 : 0;
			
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
	 *   $(this).addClass("over");
	 * },function(){
	 *   $(this).addClass("out");
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
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
	
			// Traverse up the tree
			while ( p && p != this ) try { p = p.parentNode } catch(e) { p = this; };
			
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
	 * and attaching a function to that. By using this method, your bound Function 
	 * will be called the instant the DOM is ready to be read and manipulated, 
	 * which is exactly what 99.99% of all Javascript code needs to run.
	 *
	 * There is one argument passed to the ready event handler: A reference to
	 * the jQuery function. You can name that argument whatever you like, and
	 * can therefore stick with the $ alias without risc of naming collisions.
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
	 * @desc Uses both the shortcut for $(document).ready() and the argument
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
		else {
			// Add the function to the wait list
			jQuery.readyList.push( function() { return f.apply(this, [jQuery]) } );
		}
	
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
			// Remove event lisenter to avoid memory leak
			if ( jQuery.browser.mozilla || jQuery.browser.opera )
				document.removeEventListener( "DOMContentLoaded", jQuery.ready, false );
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
	 * that have been bound to thet submit event to be executed.
	 *
	 * Note: This does not execute the submit method of the form element! If you need to
	 * submit the form via code, you have to use the DOM method, eg. $("form")[0].submit();
	 *
	 * @example $("form").submit();
	 * @desc Triggers all submit events registered for forms, but does not submit the form
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
	 * that have been bound to thet blur event to be executed.
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
	 * that have been bound to thet select event to be executed.
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
				if ( this.readyState != "complete" ) return;
				this.parentNode.removeChild( this );
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

// Clean up after IE to avoid memory leaks
if (jQuery.browser.msie)
	jQuery(window).one("unload", function() {
		var global = jQuery.event.global;
		for ( var type in global ) {
			var els = global[type], i = els.length;
			if ( i && type != 'unload' )
				do
					jQuery.event.remove(els[i-1], type);
				while (--i);
		}
	});
