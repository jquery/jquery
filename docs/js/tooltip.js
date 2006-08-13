/*
Description:

	jQuery ToolTip Demo. Demo of how to add elements and get mouse coordinates
	There is also a ToolTip plugin found at http://www.eyecon.ro/interface/,
	  which uses a CSS class to style the tooltip, but shows it below the input/anchor, rather than where the mouse is

Usage:

	$(window).load(
		function()
		{
			$("a,input").ToolTipDemo('#fff');
		}
	);

Parameters:

	bgcolour : Background colour
*/
$.fn.ToolTipDemo = function(bgcolour)
{
	this.mouseover(
		function(e)
		{
			if((!this.title && !this.alt) && !this.tooltipset) return;
			// get mouse coordinates
			// based on code from http://www.quirksmode.org/js/events_properties.html
			var mouseX = e.pageX || (e.clientX ? e.clientX + document.body.scrollLeft : 0);
			var mouseY = e.pageY || (e.clientY ? e.clientY + document.body.scrollTop : 0);
			mouseX += 10;
			mouseY += 10;
			bgcolour = bgcolour || "#eee";
			// if there is no sibling after this one, or the next siblings className is not tooltipdemo
			if(!this.nextSibling || this.nextSibling.className != "tooltipdemo")
			{
				// create a div and style it
				var div = document.createElement("div");
				$(div).css(
				{
					border: "2px outset #ddd",
					padding: "2px",
					backgroundColor: bgcolour,
					position: "absolute"
				})
				// add the title/alt attribute to it
				.html((this.title || this.alt)).addClass("tooltipdemo");
				this.title = "";
				this.alt = "";
				if(this.nextSibling)
				{
					this.parentNode.insertBefore(div, this.nextSibling);
				}
				else
				{
					this.parentNode.appendChild(div);
				}
				this.tooltipset = true;
			}
			$(this.nextSibling).show().css({left: mouseX + "px", top: mouseY + 3 + "px"});
		}
	).mouseout(
		function()
		{
			if(this.nextSibling && this.nextSibling.className == "tooltipdemo")
			{
				$(this.nextSibling).hide();
			}
		}
	);
	return this;
}
