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
	if ( !url ) {
		ret = type.onComplete;
		var onSuccess = type.onSuccess;
		var onError = type.onError;
		data = type.data;
		url = type.url;
		type = type.type;
	}

	var xml = new XMLHttpRequest();

	if ( xml ) {
		// Open the socket
		xml.open(type || "GET", url, true);
		if ( data )
			xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		// Set header so calling script knows that it's an XMLHttpRequest
		xml.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

		/* Borrowed from Prototype:
		 * Force "Connection: close" for Mozilla browsers to work around
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

				if ( ( xml.status && ( xml.status >= 200 && xml.status < 300 ) || xml.status == 304 ) ||
					!xml.status && location.protocol == 'file:' ) {
					if ( onSuccess )
						onSuccess( xml );
				} else if ( onError ) {
					onError( xml );
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
	if (typeof o !== 'undefined') {
		o = $.param(o);
		t = "POST";
	}
	var self = this;
	$.xml(t,a,o,function(res){
		// Assign it and execute all scripts
		self.html(res.responseText).find("script").each(function(){
			try { eval( this.text || this.textContent || this.innerHTML || ""); } catch(e){}
		});

		// Callback function
		if (f && f.constructor == Function)
			f(res.responseText);
	});
	return this;
};

/**
 * Initial frontend function to submit form variables. This function
 * is for registering coordinates, in the case of an image being used
 * as the submit element, and sets up an event to listen and wait for
 * a form submit click. It then calls any following chained functions
 * to actually gather the variables and submit them.
 *
 * Usage examples, when used with getForm().putForm():
 *
 * 1. Just eval the results returned from the backend.
 *    $('#form-id').form();
 *
 * 2. Render backend results directly to target ID (expects (x)HTML).
 *    $('#form-id').form('#target-id');
 *
 * 3. Submit to backend URL (form action) then call this function.
 *    $('#form-id').form(post_callback);
 *
 * 4. Load target ID with backend results then call a function.
 *    $('#form-id').form('#target-id', null, post_callback);
 *
 * 5. Call a browser function (for validation) and then (optionally)
 *    load server results to target ID.
 *    $('#form-id').form('#target-id', pre_callback);
 *
 * 6. Call validation function first then load server results to
 *    target ID and then also call a browser function.
 *    $('#form-id').form('#target-id', pre_callback, post_callback);
 *
 * @param target   arg for the target id element to render
 * @param pre_cb   callback function before submission
 * @param post_cb  callback after any results are returned
 * @return         "this" object
 * @see            getForm(), putForm()
 * @author         Mark Constable (markc@renta.net)
 * @author         G. vd Hoven, Mike Alsup, Sam Collett
 * @version        20060606
 */
$.fn.form = function(target, pre_cb, post_cb) {
	$('input[@type="submit"],input[@type="image"]', this).click(function(ev){
		this.form.clicked = this;
		if (ev.offsetX != undefined) {
			this.form.clicked_x = ev.offsetX;
			this.form.clicked_y = ev.offsetY;
		} else {
			this.form.clicked_x = ev.pageX - this.offsetLeft;
			this.form.clicked_y = ev.pageY - this.offsetTop;
		}
	});
	this.submit(function(e){
		e.preventDefault();
		$(this).getForm().putForm(target, pre_cb, post_cb);
		return this;
  });
};

/**
 * This function gathers form element variables into an array that
 * is embedded into the current "this" variable as "this.vars". It
 * is normally used in conjunction with form() and putForm() but can
 * be used standalone as long as an image is not used for submission.
 *
 * Standalone usage examples:
 *
 * 1. Gather form vars and return array to LHS variable.
 *    var myform = $('#form-id').getForm();
 *
 * 2. Provide a serialized URL-ready string (after 1. above).
 *    var mystring = $.param(myform.vars);
 *
 * 3. Gather form vars and send to RHS plugin via "this.vars".
 *    $('#form-id').getForm().some_other_plugin();
 *
 * @return         "this" object
 * @see            form(), putForm()
 * @author         Mark Constable (markc@renta.net)
 * @author         G. vd Hoven, Mike Alsup, Sam Collett
 * @version        20060606
 */
$.fn.getForm = function() {
  var a = [];
  var ok = {INPUT:true, TEXTAREA:true, OPTION:true};
  $('*', this).each(function() {
    if (this.disabled || this.type == 'reset' || (this.type == 'checkbox' && !this.checked) || (this.type == 'radio' && !this.checked))
    	return;

    if (this.type == 'submit' || this.type == 'image') {
      if (this.form.clicked != this)
      	return;

      if (this.type == 'image') {
        if (this.form.clicked_x) {
					a.push({name: this.name+'_x', value: this.form.clicked_x});
					a.push({name: this.name+'_y', value: this.form.clicked_y});
					return;
				}
			}
		}

		if (!ok[this.nodeName.toUpperCase()])
			return;

		var par = this.parentNode;
		var p = par.nodeName.toUpperCase();
		if ((p == 'SELECT' || p == 'OPTGROUP') && !this.selected)
			return;

		var n = this.name || par.name;
		if (!n && p == 'OPTGROUP' && (par = par.parentNode))
			n = par.name;

		if (n == undefined)
			return;

		a.push({name: n, value: this.value});
	});

	this.vars = a;

	return this;
}

/**
 * Final form submission plugin usually used in conjunction with
 * form() and getForm(). If a second argument is a valid function
 * then it will be called before the form vars are sent to the
 * backend. If this pre-submit function returns exactly "false"
 * then it will abort further processing otherwise the process
 * will continue according to the first and third arguments.
 *
 * If the first argument is a function, and it exists, then the form
 * values will be submitted and that callback function called. If
 * the first argument is a string value then the "load()" plugin
 * will be called which will populate the innerHTML of the indicated
 * element and a callback will be called if there is third argument.
 * If there are no arguments then the form values are submitted with
 * an additional variable (evaljs=1) which indicates to the backend
 * to to prepare the returned results for evaluation, ie; the result
 * needs to be valid javascript all on a single line.
 *
 * Usage example:
 *
 * $.fn.myvars = function() {
 *   this.vars = [];
 *   for (var i in this) {
 *     if (this[i] instanceof Function || this[i] == null) continue;
 *     this.vars.push({name: i, value: this[i].length});
 *   }
 *   return this;
 * }
 *
 * precb = function(vars) {
 *   return confirm('Submit these values?\n\n'+$.param(vars));
 * }
 *
 * $('*').myvars().putForm('#mytarget',precb,null,'myhandler.php');
 *
 * @param target   arg for the target id element to render
 * @param pre_cb   callback function before submission
 * @param post_cb  callback after any results are returned
 * @param url      form action override
 * @param mth      form method override
 * @return         "this" object
 * @see            form(), getForm(), load(), xml()
 * @author         Mark Constable (markc@renta.net)
 * @author         G. vd Hoven, Mike Alsup, Sam Collett
 * @version        20060606
 */
$.fn.putForm = function(target, pre_cb, post_cb, url, mth) {
	if (pre_cb && pre_cb.constructor == Function)
		if (pre_cb(this.vars) === false)
			return;

	var f = this.get(0);
	var url = url || f.action || '';
	var mth = mth || f.method || 'POST';

	if (target && target.constructor == Function) {
		$.xml(mth, url, $.param(this.vars), target);
	} else if (target && target.constructor == String) {
		$(target).load(url, this.vars, post_cb);
	} else {
		this.vars.push({name: 'evaljs', value: 1});
		$.xml(mth, url, $.param(this.vars), function(r) { eval(r.responseText); });
	}

	return this;
}
