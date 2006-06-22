/**
 * A method for submitting an HTML form using AJAX, as opposed to the
 * standard page-load way.
 *
 * This method attempts to mimic the functionality of the original form
 * as best as possible (duplicating the method, action, and exact contents
 * of the form).
 *
 * There are three different resulting operations that can occur, after
 * your form has been submitted.
 *
 * 1. The form is submitted and a callback is fired, letting you know
 *    when it's done:
 *    $("form").ajaxSubmit(function(){
 *      alert("all done!");
 *    });
 *
 * 2. The form is submitted and the resulting HTML contents are injected
 *    into the page, at your specified location.
 *    $("form").ajaxSubmit("#destination");
 *
 * 3. The form is submitted and the results returned from the server are
 *    automatically executed (useful for having the server return more
 *    Javascript commands to execute).
 *    $("form").ajaxSubmit();
 *
 * Additionally, an optional pre-submit callback can be provided. If it,
 * when called with the contents of the form, returns false, the form will
 * not be submitted.
 *
 * Finally, both the URL and method of the form submission can be
 * overidden using the 'url' and 'mth' arguments.
 *
 * @param target   arg for the target id element to render
 * @param post_cb  callback after any results are returned
 * @param pre_cb   callback function before submission
 * @param url      form action override
 * @param mth      form method override
 * @return         "this" object
 * @see            ajaxForm(), serialize(), load(), $.ajax()
 * @author         Mark Constable (markc@renta.net)
 * @author         G. vd Hoven, Mike Alsup, Sam Collett, John Resig
 */
$.fn.ajaxSubmit = function(target, post_cb, pre_cb, url, mth) {
	if ( !this.vars ) this.serialize();
	
	if (pre_cb && pre_cb.constructor == Function)
		if (pre_cb(this.vars) === false) return;

	var f = this.get(0);
	var url = url || f.action || '';
	var mth = mth || f.method || 'POST';

	if (target && target.constructor == Function) {
		$.ajax(mth, url, $.param(this.vars), target);
	} else if (target && target.constructor == String) {
		$(target).load(url, this.vars, post_cb);
	} else {
		this.vars.push({name: 'evaljs', value: 1});
		$.ajax(mth, url, $.param(this.vars), function(r) {
			eval(r.responseText);
		});
	}

	return this;
};

/**
 * This function can be used to turn any HTML form into a form
 * that submits using AJAX only.
 *
 * The purpose of using this method, instead of the ajaxSubmit()
 * and submit() methods, is to make absolutely sure that the
 * coordinates of <input type="image"/> elements are transmitted
 * correctly OR figuring out exactly which <input type="submit"/>
 * element was clicked to submit the form.
 *
 * If neither of the above points are important to you, then you'll
 * probably just want to stick with the simpler ajaxSubmit() function.
 *
 * Usage examples, similar to ajaxSubmit():
 *
 * 1. Just eval the results returned from the backend.
 *    $('#form-id').ajaxForm();
 *
 * 2. Render backend results directly to target ID (expects (x)HTML).
 *    $('#form-id').ajaxForm('#target-id');
 *
 * 3. Submit to backend URL (form action) then call this function.
 *    $('#form-id').ajaxForm(post_callback);
 *
 * 4. Load target ID with backend results then call a function.
 *    $('#form-id').ajaxForm('#target-id', post_callback);
 *
 * 5. Call a browser function (for validation) and then (optionally)
 *    load server results to target ID.
 *    $('#form-id').ajaxForm('#target-id', null, pre_callback);
 *
 * 6. Call validation function first then load server results to
 *    target ID and then also call a browser function.
 *    $('#form-id').ajaxForm('#target-id', post_callback, pre_callback);
 *
 * @param target   arg for the target id element to render
 * @param post_cb  callback after any results are returned
 * @param pre_cb   callback function before submission
 * @return         the jQuery Object
 * @see            serialize(), ajaxSubmit()
 * @author         Mark Constable (markc@renta.net)
 * @author         G. vd Hoven, Mike Alsup, Sam Collett, John Resig
 */
$.fn.ajaxForm = function(target, post_cb, pre_cb) {
	return this.each(function(){
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
	}).submit(function(e){
		e.preventDefault();
		$(this).ajaxSubmit(target, post_cb, pre_cb);
		return false;
	});
};

/**
 * A simple wrapper function that sits around the .serialize()
 * method, allowing you to easily extract the data stored within
 * a form.
 *
 * Usage examples:
 *
 * 1. Serialize the contents of a form to a & and = delmited string:
 *    $.param( $("form").formdata() );
 *
 * @return         An array of name/value pairs representing the form
 * @see            serialize()
 # @author         John Resig
 */
$.fn.formdata = function(){
	this.serialize();
	return this.vars;
};

/**
 * This function gathers form element variables into an array that
 * is embedded into the current "this" variable as "this.vars". It
 * is normally used in conjunction with formdata() or ajaxSubmit() but can
 * be used standalone as long as you don't need the x and y coordinates
 * associated with an <input type="image"/> element..
 *
 * Standalone usage examples:
 *
 * 1. Gather form vars and return array to LHS variable.
 *    var myform = $('#form-id').serialize();
 *
 * 2. Provide a serialized URL-ready string (after 1. above).
 *    var mystring = $.param(myform.vars);
 *
 * 3. Gather form vars and send to RHS plugin via "this.vars".
 *    $('#form-id').serialize().some_other_plugin();
 *
 * @return         the jQuery Object
 * @see            ajaxForm(), ajaxSubmit()
 * @author         Mark Constable (markc@renta.net)
 * @author         G. vd Hoven, Mike Alsup, Sam Collett, John Resig
 */
$.fn.serialize = function() {
	var a = [];
	var ok = {INPUT:true, TEXTAREA:true, OPTION:true};

	$('*', this).each(function() {
		if (this.disabled || this.type == 'reset' || 
			(this.type == 'checkbox' && !this.checked) || 
			(this.type == 'radio' && !this.checked)) return;

		if (this.type == 'submit' || this.type == 'image') {
			if (this.form.clicked != this) return;

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
		if ((p == 'SELECT' || p == 'OPTGROUP') && !this.selected) return;

		var n = this.name || par.name;
		if (!n && p == 'OPTGROUP' && (par = par.parentNode))
			n = par.name;

		if (n == undefined) return;

		a.push({name: n, value: this.value});
	});
	
	this.vars = a;

	return this;
};
