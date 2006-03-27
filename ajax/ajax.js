// AJAX Plugin
// Docs Here:
// http://jquery.com/docs/ajax/

if ( typeof XMLHttpRequest == 'undefined' && typeof window.ActiveXObject == 'function') {
	var XMLHttpRequest = function() {
		return new ActiveXObject((navigator.userAgent.toLowerCase().indexOf('msie 5') >= 0) ? 
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
	};
}

$.xml = function( type, url, data, ret ) {
	var xml = new XMLHttpRequest();

	if ( xml ) {
		xml.open(type || "GET", url, true);

		if ( data )
			xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xml.onreadystatechange = function() {
			if ( xml.readyState == 4 ) {
				if ( ret ) ret(xml);
				$.triggerAJAX( $.httpData(xml) );
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

// Global AJAX Event Binding
// Requested here:
// http://jquery.com/discuss/2006-March/000415/

$.fn.handleAJAX = function( callback ) {
	$.ajaxHandles = $.merge( $.ajaxHandles, this.cur );
	return this.bind( 'ajax', callback );
};

$.ajaxHandles = [];
$.triggerAJAX = function(data){
	for ( var i = 0; i < $.ajaxHandles.length; i++ )
		triggerEvent( $.ajaxHandles[i], 'ajax', [data] );
};

// Dynamic Form Submission
// Based upon the mailing list post at:
// http://jquery.com/discuss/2006-March/000424/

$.fn.serialize = function(callback) {
	return this.each(function(){
		var a = {};
		$(this)
			.find("input:checked,hidden,text,option[@selected],textarea")
			.filter(":enabled").each(function() {
				a[ this.name || this.id || this.parentNode.name || this.parentNode.id ] = this.value;
			});
		$.xml( this.method || "GET", this.action || "", $.param(a), callback );
	});
};

$.param = function(a) {
	var s = [];
	for ( var i in a )
	s[s.length] = i + "=" + encodeURIComponent( a[i] );
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
