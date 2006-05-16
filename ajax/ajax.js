// AJAX Plugin
// Docs Here:
// http://jquery.com/docs/ajax/

if ( typeof XMLHttpRequest == 'undefined' && typeof window.ActiveXObject == 'function') {
	var XMLHttpRequest = function() {
		return new ActiveXObject((navigator.userAgent.toLowerCase().indexOf('msie 5') >= 0) ?
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
	};
}

//
// Counter for holding the active query's
$.xmlActive=0;

$.xml = function( type, url, data, ret ) {
	var xml = new XMLHttpRequest();

	if ( xml ) {
		//
		// Increase the query counter
		$.xmlActive++;

		//
		// Show loader if needed
		if ($.xmlCreate)
			$.xmlCreate();

		//
		// Open the socket
		xml.open(type || "GET", url, true);

		if ( data )
			xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		//
		// Set header so calling script knows that it's an XMLHttpRequest
		xml.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		/* Force "Connection: close" for Mozilla browsers to work around
		 * a bug where XMLHttpReqeuest sends an incorrect Content-length
		 * header. See Mozilla Bugzilla #246651.
		 */
		if ( xml.overrideMimeType )
			xml.setRequestHeader('Connection', 'close');

		xml.onreadystatechange = function() {
			if ( xml.readyState == 4 ) {
				if ( ret ) ret(xml);

				//
				// Decrease counter
				$.xmlActive--;

				//
				// Hide loader if needed
				if ($.xmlActive <= 0) {
					if ($.xmlDestroy)
						$.xmlDestroy();
				}
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
		if ( ret ) ret( $.httpData(r,type) );
	});
};

$.getXML = function( url, ret ) {
	$.get( url, ret, "xml" );
};

$.post = function( url, data, ret, type ) {
	$.xml( "POST", url, $.param(data), function(r) {
		if ( ret ) ret( $.httpData(r,type) );
	});
};

$.postXML = function( url, data, ret ) {
	$.post( url, data, ret, "xml" );
};

$.param = function(a) {
	var s = [];
	if (a && typeof a == 'object' && a.constructor == Array) {
		for ( var i=0; i < a.length; i++ )
			s[s.length] = a[i]['name'] + "=" + encodeURIComponent( a[i]['value'] );
	} else {
		for ( var i in a )
			s[s.length] = i + "=" + encodeURIComponent( a[i] );
	}
	return s.join("&");
};

$.fn.load = function(a,o,f) {
	// Arrrrghhhhhhhh!!
	// I overwrote the event plugin's .load
	// this won't happen again, I hope -John
	if ( a && a.constructor == Function )
		return this.bind("load", a);

	var t = "GET";
	if ( o && o.constructor == Function ) {
		f = o;
		o = null;
	}
	if (o != null) {
		o = $.param(o);
		t = "POST";
	}
	var self = this;
	$.xml(t,a,o,function(h){
		var h = h.responseText;
		self.html(h).find("script").each(function(){
			try {
				eval( this.text || this.textContent || this.innerHTML );
			} catch(e){}
		});
		if(f)f(h);
	});
	return this;
};

/**
 * function:	$.fn.formValues
 * usage: 		$('#frmLogin').formValues()
 * docs:			Gets the form values and creates a key=>value array of the found values (only for ENABLED elements!)
 */
$.fn.formValues = function() {
	var a = new Array();
	this.find("input[@type='submit'],input[@type='hidden'],textarea,input[@checked],input[@type='password'],input[@type='text'],option[@selected]")
		.filter(":enabled").each(function() {
			o = {};
			o['name'] = this.name || this.id || this.parentNode.name || this.parentNode.id;
			o['value'] = this.value;
			a.push(o);
		});
	return a;
};

/**
 * function:	$.update
 * usage:		$.update('someJQueryObject', 'someurl', 'array');
 * docs:			Mimics the ajaxUpdater from prototype. Posts the key=>value array to the url and
 *					puts the results from that call in the jQuery object specified.
 *					--> If you set the blnNoEval to true, the script tags are NOT evaluated.
 */
$.update = function(objElement, strURL, arrValues, fncCallback) {
	$.post(strURL, arrValues, function(strHTML) {
		//
		// Update the element with the new HTML
		objElement.html(strHTML);

		//
		// Evaluate the scripts
		objElement.html(strHTML).find("script").each(function(){
			try { eval( this.text || this.textContent || this.innerHTML ); } catch(e){}
		});

		//
		// Callback handler
		if (fncCallback) fncCallback();
	});
};
