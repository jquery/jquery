#!/usr/bin/perl

my @stuff = split(",", "blur,focus,load,resize,scroll,unload,click,dblclick," .
		"mousedown,mouseup,mousemove,mouseover,mouseout,change,reset,select," .
		"submit,keydown,keypress,keyup,error");

foreach (@stuff) {

print qq~
		/**
		 * Bind a function to the $_ event of each matched element.
		 *
		 * \@example \$("p").$_( function() { alert("Hello"); } );
		 * \@before <p>Hello</p>
		 * \@result <p on$_="alert('Hello');">Hello</p>
		 *
		 * \@name $_
		 * \@type jQuery
		 * \@param Function fn A function to bind to the $_ event on each of the matched elements.
		 * \@cat Events
		 */

		/**
		 * Trigger the $_ event of each matched element. This causes all of the functions
		 * that have been bound to thet $_ event to be executed.
		 *
		 * \@example \$("p").$_();
		 * \@before <p on$_="alert('Hello');">Hello</p>
		 * \@result alert('Hello');
		 *
		 * \@name $_
		 * \@type jQuery
		 * \@cat Events
		 */

		/**
		 * Bind a function to the $_ event of each matched element, which will only be executed once.
		 * Unlike a call to the normal .$_() method, calling .one$_() causes the bound function to be
		 * only executed the first time it is triggered, and never again (unless it is re-bound).
		 *
		 * \@example \$("p").one$_( function() { alert("Hello"); } );
		 * \@before <p on$_="alert('Hello');">Hello</p>
		 * \@result alert('Hello'); // Only executed for the first $_
		 *
		 * \@name one$_
		 * \@type jQuery
		 * \@param Function fn A function to bind to the $_ event on each of the matched elements.
		 * \@cat Events
		 */

		/**
		 * Removes a bound $_ event from each of the matched
		 * elements. You must pass the identical function that was used in the original 
		 * bind method.
		 *
		 * \@example \$("p").un$_( myFunction );
		 * \@before <p on$_="myFunction">Hello</p>
		 * \@result <p>Hello</p>
		 *
		 * \@name un$_
		 * \@type jQuery
		 * \@param Function fn A function to unbind from the $_ event on each of the matched elements.
		 * \@cat Events
		 */

		/**
		 * Removes all bound $_ events from each of the matched elements.
		 *
		 * \@example \$("p").un$_();
		 * \@before <p on$_="alert('Hello');">Hello</p>
		 * \@result <p>Hello</p>
		 *
		 * \@name un$_
		 * \@type jQuery
		 * \@cat Events
		 */
~;


}
