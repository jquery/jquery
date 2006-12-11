jQuery.fn.extend({

	// We're overriding the old toggle function, so
	// remember it for later
	_toggle: jQuery.fn.toggle,
	
	/**
	 * Toggle between two function calls every other click.
	 * Whenever a matched element is clicked, the first specified function 
	 * is fired, when clicked again, the second is fired. All subsequent 
	 * clicks continue to rotate through the two functions.
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
	toggle: function(a,b) {
		// If two functions are passed in, we're
		// toggling on a click
		return a && b && a.constructor == Function && b.constructor == Function ? this.click(function(e){
			// Figure out which function to execute
			this.last = this.last == a ? b : a;
			
			// Make sure that clicks stop
			e.preventDefault();
			
			// and execute the function
			return this.last.apply( this, [e] ) || false;
		}) :
		
		// Otherwise, execute the old toggle function
		this._toggle.apply( this, arguments );
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
		
		// A private function for haandling mouse 'hovering'
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
	 * Please ensure you have no code in your &lt;body&gt; onload event handler, 
	 * otherwise $(document).ready() may not fire.
	 *
	 * You can have as many $(document).ready events on your page as you like.
	 *
	 * @example $(document).ready(function(){ Your code here... });
	 *
	 * @name ready
	 * @type jQuery
	 * @param Function fn The function to be executed when the DOM is ready.
	 * @cat Events
	 */
	ready: function(f) {
		// If the DOM is already ready
		if ( jQuery.isReady )
			// Execute the function immediately
			f.apply( document );
			
		// Otherwise, remember the function for later
		else {
			// Add the function to the wait list
			jQuery.readyList.push( f );
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
				for ( var i = 0; i < jQuery.readyList.length; i++ )
					jQuery.readyList[i].apply( document );
				
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
		 * @cat Events/Browser
		 */

		/**
		 * Trigger the scroll event of each matched element. This causes all of the functions
		 * that have been bound to thet scroll event to be executed.
		 *
		 * @example $("p").scroll();
		 * @before <p onscroll="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name scroll
		 * @type jQuery
		 * @cat Events/Browser
		 */

		/**
		 * Bind a function to the scroll event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .scroll() method, calling .onescroll() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onescroll( function() { alert("Hello"); } );
		 * @before <p onscroll="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first scroll
		 *
		 * @name onescroll
		 * @type jQuery
		 * @param Function fn A function to bind to the scroll event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes a bound scroll event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unscroll( myFunction );
		 * @before <p onscroll="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unscroll
		 * @type jQuery
		 * @param Function fn A function to unbind from the scroll event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes all bound scroll events from each of the matched elements.
		 *
		 * @example $("p").unscroll();
		 * @before <p onscroll="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unscroll
		 * @type jQuery
		 * @cat Events/Browser
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
		 * @cat Events/Form
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
		 * @cat Events/Form
		 */

		/**
		 * Bind a function to the submit event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .submit() method, calling .onesubmit() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onesubmit( function() { alert("Hello"); } );
		 * @before <p onsubmit="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first submit
		 *
		 * @name onesubmit
		 * @type jQuery
		 * @param Function fn A function to bind to the submit event on each of the matched elements.
		 * @cat Events/Form
		 */

		/**
		 * Removes a bound submit event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unsubmit( myFunction );
		 * @before <p onsubmit="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unsubmit
		 * @type jQuery
		 * @param Function fn A function to unbind from the submit event on each of the matched elements.
		 * @cat Events/Form
		 */

		/**
		 * Removes all bound submit events from each of the matched elements.
		 *
		 * @example $("p").unsubmit();
		 * @before <p onsubmit="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unsubmit
		 * @type jQuery
		 * @cat Events/Form
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
		 * @cat Events/UI
		 */

		/**
		 * Trigger the focus event of each matched element. This causes all of the functions
		 * that have been bound to thet focus event to be executed.
		 *
		 * @example $("p").focus();
		 * @before <p onfocus="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name focus
		 * @type jQuery
		 * @cat Events/UI
		 */

		/**
		 * Bind a function to the focus event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .focus() method, calling .onefocus() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onefocus( function() { alert("Hello"); } );
		 * @before <p onfocus="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first focus
		 *
		 * @name onefocus
		 * @type jQuery
		 * @param Function fn A function to bind to the focus event on each of the matched elements.
		 * @cat Events/UI
		 */

		/**
		 * Removes a bound focus event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unfocus( myFunction );
		 * @before <p onfocus="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unfocus
		 * @type jQuery
		 * @param Function fn A function to unbind from the focus event on each of the matched elements.
		 * @cat Events/UI
		 */

		/**
		 * Removes all bound focus events from each of the matched elements.
		 *
		 * @example $("p").unfocus();
		 * @before <p onfocus="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unfocus
		 * @type jQuery
		 * @cat Events/UI
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
		 * @cat Events/Keyboard
		 */

		/**
		 * Trigger the keydown event of each matched element. This causes all of the functions
		 * that have been bound to thet keydown event to be executed.
		 *
		 * @example $("p").keydown();
		 * @before <p onkeydown="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name keydown
		 * @type jQuery
		 * @cat Events/Keyboard
		 */

		/**
		 * Bind a function to the keydown event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .keydown() method, calling .onekeydown() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onekeydown( function() { alert("Hello"); } );
		 * @before <p onkeydown="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first keydown
		 *
		 * @name onekeydown
		 * @type jQuery
		 * @param Function fn A function to bind to the keydown event on each of the matched elements.
		 * @cat Events/Keyboard
		 */

		/**
		 * Removes a bound keydown event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unkeydown( myFunction );
		 * @before <p onkeydown="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unkeydown
		 * @type jQuery
		 * @param Function fn A function to unbind from the keydown event on each of the matched elements.
		 * @cat Events/Keyboard
		 */

		/**
		 * Removes all bound keydown events from each of the matched elements.
		 *
		 * @example $("p").unkeydown();
		 * @before <p onkeydown="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unkeydown
		 * @type jQuery
		 * @cat Events/Keyboard
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
		 * @cat Events/Mouse
		 */

		/**
		 * Trigger the dblclick event of each matched element. This causes all of the functions
		 * that have been bound to thet dblclick event to be executed.
		 *
		 * @example $("p").dblclick();
		 * @before <p ondblclick="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name dblclick
		 * @type jQuery
		 * @cat Events/Mouse
		 */

		/**
		 * Bind a function to the dblclick event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .dblclick() method, calling .onedblclick() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onedblclick( function() { alert("Hello"); } );
		 * @before <p ondblclick="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first dblclick
		 *
		 * @name onedblclick
		 * @type jQuery
		 * @param Function fn A function to bind to the dblclick event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes a bound dblclick event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").undblclick( myFunction );
		 * @before <p ondblclick="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name undblclick
		 * @type jQuery
		 * @param Function fn A function to unbind from the dblclick event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes all bound dblclick events from each of the matched elements.
		 *
		 * @example $("p").undblclick();
		 * @before <p ondblclick="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name undblclick
		 * @type jQuery
		 * @cat Events/Mouse
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
		 * @cat Events/Keyboard
		 */

		/**
		 * Trigger the keypress event of each matched element. This causes all of the functions
		 * that have been bound to thet keypress event to be executed.
		 *
		 * @example $("p").keypress();
		 * @before <p onkeypress="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name keypress
		 * @type jQuery
		 * @cat Events/Keyboard
		 */

		/**
		 * Bind a function to the keypress event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .keypress() method, calling .onekeypress() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onekeypress( function() { alert("Hello"); } );
		 * @before <p onkeypress="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first keypress
		 *
		 * @name onekeypress
		 * @type jQuery
		 * @param Function fn A function to bind to the keypress event on each of the matched elements.
		 * @cat Events/Keyboard
		 */

		/**
		 * Removes a bound keypress event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unkeypress( myFunction );
		 * @before <p onkeypress="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unkeypress
		 * @type jQuery
		 * @param Function fn A function to unbind from the keypress event on each of the matched elements.
		 * @cat Events/Keyboard
		 */

		/**
		 * Removes all bound keypress events from each of the matched elements.
		 *
		 * @example $("p").unkeypress();
		 * @before <p onkeypress="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unkeypress
		 * @type jQuery
		 * @cat Events/Keyboard
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
		 * @cat Events/Browser
		 */

		/**
		 * Trigger the error event of each matched element. This causes all of the functions
		 * that have been bound to thet error event to be executed.
		 *
		 * @example $("p").error();
		 * @before <p onerror="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name error
		 * @type jQuery
		 * @cat Events/Browser
		 */

		/**
		 * Bind a function to the error event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .error() method, calling .oneerror() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").oneerror( function() { alert("Hello"); } );
		 * @before <p onerror="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first error
		 *
		 * @name oneerror
		 * @type jQuery
		 * @param Function fn A function to bind to the error event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes a bound error event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unerror( myFunction );
		 * @before <p onerror="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unerror
		 * @type jQuery
		 * @param Function fn A function to unbind from the error event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes all bound error events from each of the matched elements.
		 *
		 * @example $("p").unerror();
		 * @before <p onerror="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unerror
		 * @type jQuery
		 * @cat Events/Browser
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
		 * @cat Events/UI
		 */

		/**
		 * Trigger the blur event of each matched element. This causes all of the functions
		 * that have been bound to thet blur event to be executed.
		 *
		 * @example $("p").blur();
		 * @before <p onblur="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name blur
		 * @type jQuery
		 * @cat Events/UI
		 */

		/**
		 * Bind a function to the blur event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .blur() method, calling .oneblur() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").oneblur( function() { alert("Hello"); } );
		 * @before <p onblur="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first blur
		 *
		 * @name oneblur
		 * @type jQuery
		 * @param Function fn A function to bind to the blur event on each of the matched elements.
		 * @cat Events/UI
		 */

		/**
		 * Removes a bound blur event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unblur( myFunction );
		 * @before <p onblur="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unblur
		 * @type jQuery
		 * @param Function fn A function to unbind from the blur event on each of the matched elements.
		 * @cat Events/UI
		 */

		/**
		 * Removes all bound blur events from each of the matched elements.
		 *
		 * @example $("p").unblur();
		 * @before <p onblur="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unblur
		 * @type jQuery
		 * @cat Events/UI
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
		 * @cat Events/Browser
		 */

		/**
		 * Trigger the load event of each matched element. This causes all of the functions
		 * that have been bound to thet load event to be executed.
		 *
		 * Marked as private: Calling load() without arguments throws exception because the ajax load
		 * does not handle it.
		 *
		 * @example $("p").load();
		 * @before <p onload="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name load
		 * @private
		 * @type jQuery
		 * @cat Events/Browser
		 */

		/**
		 * Bind a function to the load event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .load() method, calling .oneload() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").oneload( function() { alert("Hello"); } );
		 * @before <p onload="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first load
		 *
		 * @name oneload
		 * @type jQuery
		 * @param Function fn A function to bind to the load event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes a bound load event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unload( myFunction );
		 * @before <p onload="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unload
		 * @type jQuery
		 * @param Function fn A function to unbind from the load event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes all bound load events from each of the matched elements.
		 *
		 * @example $("p").unload();
		 * @before <p onload="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unload
		 * @type jQuery
		 * @cat Events/Browser
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
		 * @cat Events/Form
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
		 * @cat Events/Form
		 */

		/**
		 * Bind a function to the select event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .select() method, calling .oneselect() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").oneselect( function() { alert("Hello"); } );
		 * @before <p onselect="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first select
		 *
		 * @name oneselect
		 * @type jQuery
		 * @param Function fn A function to bind to the select event on each of the matched elements.
		 * @cat Events/Form
		 */

		/**
		 * Removes a bound select event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unselect( myFunction );
		 * @before <p onselect="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unselect
		 * @type jQuery
		 * @param Function fn A function to unbind from the select event on each of the matched elements.
		 * @cat Events/Form
		 */

		/**
		 * Removes all bound select events from each of the matched elements.
		 *
		 * @example $("p").unselect();
		 * @before <p onselect="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unselect
		 * @type jQuery
		 * @cat Events/Form
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
		 * @cat Events/Mouse
		 */

		/**
		 * Trigger the mouseup event of each matched element. This causes all of the functions
		 * that have been bound to thet mouseup event to be executed.
		 *
		 * @example $("p").mouseup();
		 * @before <p onmouseup="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name mouseup
		 * @type jQuery
		 * @cat Events/Mouse
		 */

		/**
		 * Bind a function to the mouseup event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .mouseup() method, calling .onemouseup() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onemouseup( function() { alert("Hello"); } );
		 * @before <p onmouseup="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first mouseup
		 *
		 * @name onemouseup
		 * @type jQuery
		 * @param Function fn A function to bind to the mouseup event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes a bound mouseup event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unmouseup( myFunction );
		 * @before <p onmouseup="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmouseup
		 * @type jQuery
		 * @param Function fn A function to unbind from the mouseup event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes all bound mouseup events from each of the matched elements.
		 *
		 * @example $("p").unmouseup();
		 * @before <p onmouseup="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmouseup
		 * @type jQuery
		 * @cat Events/Mouse
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
		 * @cat Events/Browser
		 */

		/**
		 * Trigger the unload event of each matched element. This causes all of the functions
		 * that have been bound to thet unload event to be executed.
		 *
		 * @example $("p").unload();
		 * @before <p onunload="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name unload
		 * @type jQuery
		 * @cat Events/Browser
		 */

		/**
		 * Bind a function to the unload event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .unload() method, calling .oneunload() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").oneunload( function() { alert("Hello"); } );
		 * @before <p onunload="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first unload
		 *
		 * @name oneunload
		 * @type jQuery
		 * @param Function fn A function to bind to the unload event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes a bound unload event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").ununload( myFunction );
		 * @before <p onunload="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name ununload
		 * @type jQuery
		 * @param Function fn A function to unbind from the unload event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes all bound unload events from each of the matched elements.
		 *
		 * @example $("p").ununload();
		 * @before <p onunload="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name ununload
		 * @type jQuery
		 * @cat Events/Browser
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
		 * @cat Events/Form
		 */

		/**
		 * Trigger the change event of each matched element. This causes all of the functions
		 * that have been bound to thet change event to be executed.
		 *
		 * @example $("p").change();
		 * @before <p onchange="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name change
		 * @type jQuery
		 * @cat Events/Form
		 */

		/**
		 * Bind a function to the change event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .change() method, calling .onechange() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onechange( function() { alert("Hello"); } );
		 * @before <p onchange="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first change
		 *
		 * @name onechange
		 * @type jQuery
		 * @param Function fn A function to bind to the change event on each of the matched elements.
		 * @cat Events/Form
		 */

		/**
		 * Removes a bound change event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unchange( myFunction );
		 * @before <p onchange="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unchange
		 * @type jQuery
		 * @param Function fn A function to unbind from the change event on each of the matched elements.
		 * @cat Events/Form
		 */

		/**
		 * Removes all bound change events from each of the matched elements.
		 *
		 * @example $("p").unchange();
		 * @before <p onchange="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unchange
		 * @type jQuery
		 * @cat Events/Form
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
		 * @cat Events/Mouse
		 */

		/**
		 * Trigger the mouseout event of each matched element. This causes all of the functions
		 * that have been bound to thet mouseout event to be executed.
		 *
		 * @example $("p").mouseout();
		 * @before <p onmouseout="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name mouseout
		 * @type jQuery
		 * @cat Events/Mouse
		 */

		/**
		 * Bind a function to the mouseout event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .mouseout() method, calling .onemouseout() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onemouseout( function() { alert("Hello"); } );
		 * @before <p onmouseout="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first mouseout
		 *
		 * @name onemouseout
		 * @type jQuery
		 * @param Function fn A function to bind to the mouseout event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes a bound mouseout event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unmouseout( myFunction );
		 * @before <p onmouseout="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmouseout
		 * @type jQuery
		 * @param Function fn A function to unbind from the mouseout event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes all bound mouseout events from each of the matched elements.
		 *
		 * @example $("p").unmouseout();
		 * @before <p onmouseout="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmouseout
		 * @type jQuery
		 * @cat Events/Mouse
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
		 * @cat Events/Keyboard
		 */

		/**
		 * Trigger the keyup event of each matched element. This causes all of the functions
		 * that have been bound to thet keyup event to be executed.
		 *
		 * @example $("p").keyup();
		 * @before <p onkeyup="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name keyup
		 * @type jQuery
		 * @cat Events/Keyboard
		 */

		/**
		 * Bind a function to the keyup event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .keyup() method, calling .onekeyup() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onekeyup( function() { alert("Hello"); } );
		 * @before <p onkeyup="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first keyup
		 *
		 * @name onekeyup
		 * @type jQuery
		 * @param Function fn A function to bind to the keyup event on each of the matched elements.
		 * @cat Events/Keyboard
		 */

		/**
		 * Removes a bound keyup event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unkeyup( myFunction );
		 * @before <p onkeyup="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unkeyup
		 * @type jQuery
		 * @param Function fn A function to unbind from the keyup event on each of the matched elements.
		 * @cat Events/Keyboard
		 */

		/**
		 * Removes all bound keyup events from each of the matched elements.
		 *
		 * @example $("p").unkeyup();
		 * @before <p onkeyup="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unkeyup
		 * @type jQuery
		 * @cat Events/Keyboard
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
		 * @cat Events/Mouse
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
		 * @cat Events/Mouse
		 */

		/**
		 * Bind a function to the click event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .click() method, calling .oneclick() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").oneclick( function() { alert("Hello"); } );
		 * @before <p onclick="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first click
		 *
		 * @name oneclick
		 * @type jQuery
		 * @param Function fn A function to bind to the click event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes a bound click event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unclick( myFunction );
		 * @before <p onclick="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unclick
		 * @type jQuery
		 * @param Function fn A function to unbind from the click event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes all bound click events from each of the matched elements.
		 *
		 * @example $("p").unclick();
		 * @before <p onclick="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unclick
		 * @type jQuery
		 * @cat Events/Mouse
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
		 * @cat Events/Browser
		 */

		/**
		 * Trigger the resize event of each matched element. This causes all of the functions
		 * that have been bound to thet resize event to be executed.
		 *
		 * @example $("p").resize();
		 * @before <p onresize="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name resize
		 * @type jQuery
		 * @cat Events/Browser
		 */

		/**
		 * Bind a function to the resize event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .resize() method, calling .oneresize() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").oneresize( function() { alert("Hello"); } );
		 * @before <p onresize="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first resize
		 *
		 * @name oneresize
		 * @type jQuery
		 * @param Function fn A function to bind to the resize event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes a bound resize event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unresize( myFunction );
		 * @before <p onresize="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unresize
		 * @type jQuery
		 * @param Function fn A function to unbind from the resize event on each of the matched elements.
		 * @cat Events/Browser
		 */

		/**
		 * Removes all bound resize events from each of the matched elements.
		 *
		 * @example $("p").unresize();
		 * @before <p onresize="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unresize
		 * @type jQuery
		 * @cat Events/Browser
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
		 * @cat Events/Mouse
		 */

		/**
		 * Trigger the mousemove event of each matched element. This causes all of the functions
		 * that have been bound to thet mousemove event to be executed.
		 *
		 * @example $("p").mousemove();
		 * @before <p onmousemove="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name mousemove
		 * @type jQuery
		 * @cat Events/Mouse
		 */

		/**
		 * Bind a function to the mousemove event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .mousemove() method, calling .onemousemove() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onemousemove( function() { alert("Hello"); } );
		 * @before <p onmousemove="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first mousemove
		 *
		 * @name onemousemove
		 * @type jQuery
		 * @param Function fn A function to bind to the mousemove event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes a bound mousemove event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unmousemove( myFunction );
		 * @before <p onmousemove="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmousemove
		 * @type jQuery
		 * @param Function fn A function to unbind from the mousemove event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes all bound mousemove events from each of the matched elements.
		 *
		 * @example $("p").unmousemove();
		 * @before <p onmousemove="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmousemove
		 * @type jQuery
		 * @cat Events/Mouse
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
		 * @cat Events/Mouse
		 */

		/**
		 * Trigger the mousedown event of each matched element. This causes all of the functions
		 * that have been bound to thet mousedown event to be executed.
		 *
		 * @example $("p").mousedown();
		 * @before <p onmousedown="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name mousedown
		 * @type jQuery
		 * @cat Events/Mouse
		 */

		/**
		 * Bind a function to the mousedown event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .mousedown() method, calling .onemousedown() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onemousedown( function() { alert("Hello"); } );
		 * @before <p onmousedown="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first mousedown
		 *
		 * @name onemousedown
		 * @type jQuery
		 * @param Function fn A function to bind to the mousedown event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes a bound mousedown event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unmousedown( myFunction );
		 * @before <p onmousedown="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmousedown
		 * @type jQuery
		 * @param Function fn A function to unbind from the mousedown event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes all bound mousedown events from each of the matched elements.
		 *
		 * @example $("p").unmousedown();
		 * @before <p onmousedown="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmousedown
		 * @type jQuery
		 * @cat Events/Mouse
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
		 * @cat Events/Mouse
		 */

		/**
		 * Trigger the mouseover event of each matched element. This causes all of the functions
		 * that have been bound to thet mousedown event to be executed.
		 *
		 * @example $("p").mouseover();
		 * @before <p onmouseover="alert('Hello');">Hello</p>
		 * @result alert('Hello');
		 *
		 * @name mouseover
		 * @type jQuery
		 * @cat Events/Mouse
		 */

		/**
		 * Bind a function to the mouseover event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .mouseover() method, calling .onemouseover() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * @example $("p").onemouseover( function() { alert("Hello"); } );
		 * @before <p onmouseover="alert('Hello');">Hello</p>
		 * @result alert('Hello'); // Only executed for the first mouseover
		 *
		 * @name onemouseover
		 * @type jQuery
		 * @param Function fn A function to bind to the mouseover event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes a bound mouseover event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * @example $("p").unmouseover( myFunction );
		 * @before <p onmouseover="myFunction">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmouseover
		 * @type jQuery
		 * @param Function fn A function to unbind from the mouseover event on each of the matched elements.
		 * @cat Events/Mouse
		 */

		/**
		 * Removes all bound mouseover events from each of the matched elements.
		 *
		 * @example $("p").unmouseover();
		 * @before <p onmouseover="alert('Hello');">Hello</p>
		 * @result <p>Hello</p>
		 *
		 * @name unmouseover
		 * @type jQuery
		 * @cat Events/Mouse
		 */

	var e = ("blur,focus,load,resize,scroll,unload,click,dblclick," +
		"mousedown,mouseup,mousemove,mouseover,mouseout,change,reset,select," + 
		"submit,keydown,keypress,keyup,error").split(",");

	// Go through all the event names, but make sure that
	// it is enclosed properly
	for ( var i = 0; i < e.length; i++ ) new function(){
			
		var o = e[i];
		
		// Handle event binding
		jQuery.fn[o] = function(f){
			return f ? this.bind(o, f) : this.trigger(o);
		};
		
		// Handle event unbinding
		jQuery.fn["un"+o] = function(f){ return this.unbind(o, f); };
		
		// Finally, handle events that only fire once
		jQuery.fn["one"+o] = function(f){
			// save cloned reference to this
			var element = jQuery(this);
			var handler = function() {
				// unbind itself when executed
				element.unbind(o, handler);
				element = null;
				// apply original handler with the same arguments
				return f.apply(this, arguments);
			};
			return this.bind(o, handler);
		};
			
	};
	
	// If Mozilla is used
	if ( jQuery.browser.mozilla || jQuery.browser.opera ) {
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", jQuery.ready, false );
	
	// If IE is used, use the excellent hack by Matthias Miller
	// http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited
	} else if ( jQuery.browser.msie ) {
	
		// Only works if you document.write() it
		document.write("<scr" + "ipt id=__ie_init defer=true " + 
			"src=//:><\/script>");
	
		// Use the defer script hack
		var script = document.getElementById("__ie_init");
		if (script) // script does not exist if jQuery is loaded dynamically
			script.onreadystatechange = function() {
				if ( this.readyState != "complete" ) return;
				this.parentNode.removeChild( this );
				jQuery.ready();
			};
	
		// Clear from memory
		script = null;
	
	// If Safari  is used
	} else if ( jQuery.browser.safari ) {
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
	} 

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
	
};

// Clean up after IE to avoid memory leaks
if (jQuery.browser.msie) jQuery(window).unload(function() {
	var event = jQuery.event, global = event.global;
	for (var type in global) {
 		var els = global[type], i = els.length;
		if (i>0) do if (type != 'unload') event.remove(els[i-1], type); while (--i);
	}
});
