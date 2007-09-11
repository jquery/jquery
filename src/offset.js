// The Offset Method
// Originally By Brandon Aaron, part of the Dimension Plugin
// http://jquery.com/plugins/project/dimensions
jQuery.fn.offset = function() {
	var left = 0, top = 0, elem = this[0], results;
	
	if ( elem ) with ( jQuery.browser ) {
		var	absolute     = jQuery.css(elem, "position") == "absolute", 
		    parent       = elem.parentNode, 
		    offsetParent = elem.offsetParent, 
		    doc          = elem.ownerDocument,
		    safari2      = safari && parseInt(version) < 522;
	
		// Use getBoundingClientRect if available
		if ( elem.getBoundingClientRect ) {
			box = elem.getBoundingClientRect();
		
			// Add the document scroll offsets
			add(
				box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
				box.top  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop)
			);
		
			// IE adds the HTML element's border, by default it is medium which is 2px
			// IE 6 and IE 7 quirks mode the border width is overwritable by the following css html { border: 0; }
			// IE 7 standards mode, the border is always 2px
			if ( msie ) {
				var border = jQuery("html").css("borderWidth");
				border = (border == "medium" || jQuery.boxModel && parseInt(version) >= 7) && 2 || border;
				add( -border, -border );
			}
	
		// Otherwise loop through the offsetParents and parentNodes
		} else {
		
			// Initial element offsets
			add( elem.offsetLeft, elem.offsetTop );
		
			// Get parent offsets
			while ( offsetParent ) {
				// Add offsetParent offsets
				add( offsetParent.offsetLeft, offsetParent.offsetTop );
			
				// Mozilla and Safari > 2 does not include the border on offset parents
				// However Mozilla adds the border for table cells
				if ( mozilla && /^t[d|h]$/i.test(parent.tagName) || !safari2 )
					border( offsetParent );
				
				// Safari <= 2 doubles body offsets with an absolutely positioned element or parent
				if ( safari2 && !absolute && jQuery.css(offsetParent, "position") == "absolute" )
					absolute = true;
			
				// Get next offsetParent
				offsetParent = offsetParent.offsetParent;
			}
		
			// Get parent scroll offsets
			while ( parent.tagName && !/^body|html$/i.test(parent.tagName) ) {
				// Work around opera inline/table scrollLeft/Top bug
				if ( !/^inline|table-row.*$/i.test(jQuery.css(parent, "display")) )
					// Subtract parent scroll offsets
					add( -parent.scrollLeft, -parent.scrollTop );
			
				// Mozilla does not add the border for a parent that has overflow != visible
				if ( mozilla && jQuery.css(parent, "overflow") != "visible" )
					border( parent );
			
				// Get next parent
				parent = parent.parentNode;
			}
		
			// Safari doubles body offsets with an absolutely positioned element or parent
			if ( safari2 && absolute )
				add( -doc.body.offsetLeft, -doc.body.offsetTop );
		}

		// Return an object with top and left properties
		results = { top: top, left: left };
	}

	return results;

	function border(elem) {
		add( jQuery.css(elem, "borderLeftWidth"), jQuery.css(elem, "borderTopWidth") );
	}

	function add(l, t) {
		left += parseInt(l) || 0;
		top += parseInt(t) || 0;
	}
};
