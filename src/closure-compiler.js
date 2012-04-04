/**
 * Provides type information for Closure-compiler. Should
 * have no effect on non-compiled code.
 */

/**
 * @interface
 * @see http://api.jquery.com/Types/#Promise
 */
jQuery.Promise = function () {};

/**
 * @param {function()} doneCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.done = function( doneCallbacks ) {};

/**
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.fail = function( failCallbacks ) {};

/**
 * @param {function()} doneCallbacks
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.then = function( doneCallbacks, failCallbacks ) {};

/**
 * @param {function()} callbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.progress = function( callbacks ) {};

/**
 * @override
 * @param {function()} doneCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Deferred.prototype.done = function( doneCallbacks ) {};

/**
 * @override
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Deferred.prototype.fail = function( failCallbacks ) {};

/**
 * @override
 * @param {function()} doneCallbacks
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Deferred.prototype.then = function( doneCallbacks, failCallbacks ) {};

/**
 * @override
 * @param {function()} callbacks
 * @return {jQuery.Promise}
 */
jQuery.Deferred.prototype.progress = function( callbacks ) {};

/**
 * @param {Object} obj
 * @return {jQuery.Promise}
 */
jQuery.Deferred.prototype.promise = function( obj ) {};

/** @suppress {uselessCode} */
(function() {
	/** @type {string} */
	jQuery.Event.prototype.delegateTarget;	
	/** @type {string} */
	jQuery.Event.prototype.type;
	/** @type {boolean} */
	jQuery.Event.prototype.isTrigger;
	/** @type {boolean} */
	jQuery.Event.prototype.exclusive;
	/** @type {string} */
	jQuery.Event.prototype.namespace;
	/** @type {RegExp} */
	jQuery.Event.prototype.namespace_re;
})();

/** @interface */
jQuery.event.EventData = function() {};

/**
 * @this {Element}
 * @param {Event} e
 */
jQuery.event.EventData.prototype.handler = function(e) {};

/** @suppress {uselessCode} */
(function() {
	/** @type {string} */
	jQuery.event.EventData.prototype.type;
	/** @type {string} */
	jQuery.event.EventData.prototype.origType;
	/** @type {*} */
	jQuery.event.EventData.prototype.data;
	/** @type {number} */
	jQuery.event.EventData.prototype.guid;
	/** @type {string} */
	jQuery.event.EventData.prototype.selector;
	/** @type {boolean} */
	jQuery.event.EventData.prototype.quick;
	/** @type {string} */
	jQuery.event.EventData.prototype.namespace;
})

/** @interface */
jQuery.event.special.Event = function() {};

/**
 * @this {Element}
 * @param {Event} e
 * @param {*} data
 */
jQuery.event.special.Event.prototype._default = function( e, data ) {};

/**
 * @this {Element}
 * @param {*} data
 * @param {string} namespaces
 * @param {function(Event)} eventHandle
 */
jQuery.event.special.Event.prototype.setup = function( data, namespaces, eventHandle ) {};

/**
 * @this {Element}
 * @param {*} data
 * @param {string} namespaces
 * @param {function(Event)} eventHandle
 */
jQuery.event.special.Event.prototype.teardown = function( data, namespaces, eventHandle ) {};

/**
 * @this {Element}
 * @param {Object.<string, *>} handleObj
 */
jQuery.event.special.Event.prototype.add = function( handleObj ) {};

/**
 * @this {Element}
 * @param {Object.<string, *>} handleObj
 */
jQuery.event.special.Event.prototype.remove = function( handleObj ) {};

/**
 * @this {Element}
 * @param {jQuery.Event} event
 */
jQuery.event.special.Event.prototype.handle = function( event ) {};

/** @suppress {uselessCode} */
(function() {
	/** @type {string} */
	jQuery.event.special.Event.prototype.bindType;

	/** @type {string} */
	jQuery.event.special.Event.prototype.delegateType;
	
	/** @type {boolean} */
	jQuery.event.special.Event.prototype.noBubble;
})();

/** @interface */
jQuery.event.Handlers = function() {};

/** @suppress {uselessCode} */
(function() {
	/** @type {number} */
	jQuery.event.Handlers.prototype.delegateCount;
})();

/**
 * @constructor
 * @extends {XMLHttpRequest}
 * @implements {jQuery.Promise}
 * @private
 * @see http://api.jquery.com/jQuery.ajax/#jqXHR
 */
jQuery.jqXHR = function () {};

/**
 * @override
 * @param {function()} doneCallbacks
 * @return {jQuery.Promise}
 */
jQuery.jqXHR.prototype.done = function(doneCallbacks) {};

/**
 * @override
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.jqXHR.prototype.fail = function(failCallbacks) {};

/**
 * @override
 * @deprecated
 */
jQuery.jqXHR.prototype.onreadystatechange = function (callback) {};

/**
 * @override
 * @param {function()} callbacks
 * @return {jQuery.Promise}
 */
jQuery.jqXHR.prototype.progress = function(callbacks) {};

/**
 * @private
 * @param {Object.<string,*>} map
 * @return {jQuery.jqXHR}
 */
jQuery.jqXHR.prototype.statusCode = function(map) {};

/**
 * @override
 * @param {function()} doneCallbacks
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.jqXHR.prototype.then = function(doneCallbacks, failCallbacks) {};

/** @interface */
jQuery.AjaxSettings = function() {};

(function() {
	/** @type {Object.<string,string>} */
	jQuery.AjaxSettings.prototype.accepts;

	/** @type {boolean} */
	jQuery.AjaxSettings.prototype.async;
	
	/**
	 * @param {jQuery.jqXHR} jqXHR
	 * @param {jQuery.AjaxSettings} settings
	 * @this {(jQuery.AjaxSettings|Object)}
	 */
	jQuery.AjaxSettings.prototype.beforeSend = function(jqXHR, settings) {};
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.cache;
	
	/** @type {Array.<function(jQuery.jqXHR,string)>|function(jQuery.jqXHR,string)} */
	jQuery.AjaxSettings.prototype.complete = function(jqXHR, textStatus) {};
	
	/** @type {Object.<string,string>} */
	jQuery.AjaxSettings.prototype.contents;
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.contentType;
	
	/** @type {(jQuery.AjaxSettings|Object)} */
	jQuery.AjaxSettings.prototype.context;
	
	/** @type {Object.<string,string>} */
	jQuery.AjaxSettings.prototype.converters;
	
	/** @type {boolean} */
	jQuery.AjaxSettings.prototype.crossDomain;
	
	/** @type {*} */
	jQuery.AjaxSettings.prototype.data;
	
	/**
	 * @param {string|Document} data
	 * @param {string} type
	 * @return {string|Document}
	 */
	jQuery.AjaxSettings.prototype.dataFilter = function(data, type) {};
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.dataType;
	
	/** @type {Array.<function(jQuery.jqXHR,String)>|function(jQuery.jqXHR,String)} */ 
	jQuery.AjaxSettings.prototype.error = function(jqXHR, textStatus) {};
	
	/** @type {jQuery.AjaxSettings} */
	jQuery.AjaxSettings.prototype.flatOptions;
	
	/** @type {boolean} */
	jQuery.AjaxSettings.prototype.global;
	
	/** @type {Object.<string, string>} */
	jQuery.AjaxSettings.prototype.headers;
	
	/** @type {boolean} */
	jQuery.AjaxSettings.prototype.ifModified;
		
	/** @type {boolean} */
	jQuery.AjaxSettings.prototype.isLocal;
	
	/** @type {boolean|string} */
	jQuery.AjaxSettings.prototype.jsonp;
	
	/** @type {string|function():string} */
	jQuery.AjaxSettings.prototype.jsonpCallback;
	
	/** @type {String} */
	jQuery.AjaxSettings.prototype.mimeType;
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.password;
	
	/** @type {boolean} */
	jQuery.AjaxSettings.prototype.processData;
	
	/** @type {Object.<string,string>} */
	jQuery.AjaxSettings.prototype.responseFields;
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.scriptCharset;
	
	/** @type {Object.<string,function()>} */
	jQuery.AjaxSettings.prototype.statusCode;
	
	/**
	 * @param {*} data
	 * @param {string} textStatus
	 * @param {jQuery.jqXHR} jqXHR
	 */
	jQuery.AjaxSettings.prototype.success = function(data, textStatus, jqXHR) {};
	
	/** @type {number} */
	jQuery.AjaxSettings.prototype.timeout;
	
	/** @type {boolean} */
	jQuery.AjaxSettings.prototype.traditional;
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.type;
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.url;
	
	/** @type {string} */
	jQuery.AjaxSettings.prototype.username;
	
	/** @return {XMLHttpRequest} */
	jQuery.AjaxSettings.prototype.xhr = function() {};
	
	/** @type {Object.<string,*>} */
	jQuery.AjaxSettings.prototype.xhrFields;
})();

/**
 * @constructor
 * @private
 */
jQuery.AnimationOptions = function() {};

jQuery.AnimationOptions.prototype.complete = function() {};

jQuery.AnimationOptions.prototype.step = function() {};

/** @suppress {uselessCode} */
(function(){
	/** @type {(string|number)} */
	jQuery.AnimationOptions.prototype.duartion;
	/** @type {string} */
	jQuery.AnimationOptions.prototype.easing;
	/** @type {(boolean|string)} */
	jQuery.AnimationOptions.prototype.queue;
	/** @type {Object.<string,function()>} */
	jQuery.AnimationOptions.prototype.specialEasing;
})();
