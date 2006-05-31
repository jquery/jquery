// AJAX Plugin
// Docs Here:
// http://jquery.com/docs/ajax/

if ( typeof XMLHttpRequest == 'undefined' && typeof window.ActiveXObject == 'function') {
	XMLHttpRequest = function() {
		return new ActiveXObject((navigator.userAgent.toLowerCase().indexOf('msie 5') >= 0) ?
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
	};
}

// Counter for holding the active query's
$.xmlActive=0;

$.xml = function( type, url, data, ret ) {
	var xml = new XMLHttpRequest();

	if ( xml ) {
		// Open the socket
		xml.open(type || "GET", url, true);
		if ( data )
			xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// Set header so calling script knows that it's an XMLHttpRequest
		xml.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		/* Force "Connection: close" for Mozilla browsers to work around
		 * a bug where XMLHttpReqeuest sends an incorrect Content-length
		 * header. See Mozilla Bugzilla #246651.
		 */
		if ( xml.overrideMimeType )
			xml.setRequestHeader('Connection', 'close');

		xml.onreadystatechange = function() {
			// Socket is openend
			if ( xml.readyState == 1 ) {
				// Increase counter
				$.xmlActive++;

				// Show loader if needed
				if ( ($.xmlActive >= 1) && ($.xmlCreate) )
					$.xmlCreate();
			}

			// Socket is closed and data is available
			if ( xml.readyState == 4 ) {
				// Decrease counter
				$.xmlActive--;

				// Hide loader if needed
				if ( ($.xmlActive <= 0) && ($.xmlDestroy) ) {
					$.xmlDestroy();
					$.xmlActive = 0
				}

				// Process result
				if ( ret )
					ret(xml);
			}
		};

		xml.send(data)
	}
};

$.httpData = function(r,type) {
	return r.getResponseHeader("content-type").indexOf("xml") > 0 || type == "xml" ?
		r.responseXML : r.responseText;
};

$.get = function( url, ret, type ) {
	$.xml( "GET", url, null, function(r) {
		if ( ret ) { ret( $.httpData(r,type) ); }
	});
};

$.getXML = function( url, ret ) {
	$.get( url, ret, "xml" );
};

$.post = function( url, data, ret, type ) {
	$.xml( "POST", url, $.param(data), function(r) {
		if ( ret ) { ret( $.httpData(r,type) ); }
	});
};

$.postXML = function( url, data, ret ) {
	$.post( url, data, ret, "xml" );
};

$.param = function(a) {
	var s = [];
	if (a && typeof a == 'object' && a.constructor == Array) {
		for ( var i=0; i < a.length; i++ ) {
			s[s.length] = a[i].name + "=" + encodeURIComponent( a[i].value );
		}
	} else {
		for ( var j in a ) {
			s[s.length] = j + "=" + encodeURIComponent( a[j] );
		}
	}
	return s.join("&");
};

$.fn.load = function(a,o,f) {
	// Arrrrghhhhhhhh!!
	// I overwrote the event plugin's .load
	// this won't happen again, I hope -John
	if ( a && a.constructor == Function ) {
		return this.bind("load", a);
	}

	var t = "GET";
	if ( o && o.constructor == Function ) {
		f = o;
		o = null;
	}
	if (o !== null) {
		o = $.param(o);
		t = "POST";
	}
	var self = this;
	$.xml(t,a,o,function(h){
		h = h.responseText;
		self.html(h).find("script").each(function(){
			try {
				$.eval( this.text || this.textContent || this.innerHTML );
			} catch(e){}
		});
		if(f){f(h);}
	});
	return this;
};

/**
 * name:       $.fn.formValues
 * example:    $('#frmLogin').formValues('sButton')
 * docs:       Gets form values and creates a key=>value array of the found values.
 *             Optionally adds the button which is clicked if you provide it.
 *             Only does this for ENABLED elements in the order of the form.
 */
$.fn.formValues = function(sButton) {
	var a = [];
	var elp = {INPUT:true, TEXTAREA:true, OPTION:true};

	// Loop the shite
	$('*', this).each(function() {
		// Skip elements not of the types in elp
		if (!elp[this.tagName])
			return;

		// Skip disabled elements
		if (this.disabled)
			return;

		// Skip non-selected nodes
		if ((this.parentNode.nodeName == 'SELECT') && (!this.selected))
			return;

		// Skip non-checked nodes
		if (((this.type == 'radio') || (this.type == 'checkbox')) && (!this.checked))
			return;

		// If we come here, everything is fine, so add the data
		a.push({
			name: this.name || this.id || this.parentNode.name || this.parentNode.id,
			value: this.value
		});
	});

	// Add submit button if needed
	if (sButton && (sButton !== null))
		a.push({ name: sButton, value: 'x' });

	return a;
};

/**
 * name:       $.fn.update
 * example:    $('someJQueryObject').update('sURL', 'sAction', 'aValues', 'fCallback');
 * docs:       Calls sURL with sAction and sends the aValues
 *	            Puts the results from that call in the jQuery object and calls fCallback
 */
$.fn.update = function(sURL, sMethod, aValues, fCallback) {
	var el = this;

	// Process
	$.xml(
		sMethod || "GET",
		sURL || "",
		$.param(aValues),
		function(sResult) {
			sResult = $.httpData(sResult);

			// Update the element with the new HTML
			el.html(sResult);

			// Evaluate the scripts AFTER this (so you can allready modify the new HTML!)
			el.html(sResult).find("script").each(function(){
				try { $.eval( this.text || this.textContent || this.innerHTML ); } catch(e) { }
			});

			// And call the callback handler :)
			if (fCallback && (fCallback.constructor == Function))
				fCallback();
		}
	);
};

/**
 * name:			$.fn.serialize
 * example:    $('someJQueryObject').serialize('sButton', 'fCallback');
 * docs:       Calls the form's action with the correct method and the serialized values.
 *             Optionally adds the button which is clicked if you provide it.
 *             When there are results, the fCallback function is called.
 */
$.fn.serialize = function(sButton, fCallback) {
	var el = this.get(0);

	// Process
	$.xml(
		el.method || "GET",
		el.action || "",
		$.param(this.formValues(sButton)),
		function(sResult) {
			if (fCallback && (fCallback.constructor == Function))
				fCallback($.httpData(sResult));
		}
	);
};
