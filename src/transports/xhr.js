var xhrHandledTypes = {
	"auto": 1,
	"text": 1,
	"xml": 1
};

jQuery.transport.install("xhr", {
	
	optionsFilter: function(s) {
		
		// Handle crossDomain mess
		if ( s.crossDomain ) {
			var crossDomain = jQuery.support.crossDomainRequest;
			if (!crossDomain) {
				throw "jQuery[transports/xhr]: cross domain requests not supported";
			}
			if (crossDomain!==true) {
				return crossDomain;
			}
		}
		
		// Put text type if needed
		if ( ! xhrHandledTypes[ s.dataTypes[0] ] ) {
			s.dataTypes.unshift("text");
		}
		
	},
	
	factory: function() {
		
		var xhr,
			abortStatusText,
			callback;
	
		return {
			
			getHeaders: function() {
				return xhr && !abortStatusText ?
					xhr.getAllResponseHeaders() :
					"";
			},
			
			send: function(s,headers,complete) {
				
				try {
					
					xhr = s.xhr();
					
					// Set cross domain info
					if (s.crossDomain) {
						xhr.withCredentials = s.crossDomain;
					}
					
					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open(s.type, s.url, s.async, s.username, s.password);
					} else {
						xhr.open(s.type, s.url, s.async);
					}
					
					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						
						jQuery.each(headers, function(key,value) {
							xhr.setRequestHeader(key,value);
						});
						
					} catch(_) {}
					
					// Install listener
					// TODO: check if it still leaks under IE with new code architecture
					callback = xhr.onreadystatechange = function() {
						// Not aborted and not complete => ignore
						if (!abortStatusText && xhr.readyState!=4) {
							return;
						}
						
						// Get info
						var status, statusText, response;
							
						if (abortStatusText) {
							
							status = 0;
							statusText = abortStatusText;
							
						} else {
							
							status = xhr.status;
							statusText = xhr.statusText;
							
							// Guess response if needed & update datatype if "auto"
							var dataType = s.transportDataType,
								ct = xhr.getResponseHeader("content-type"),
								xml = dataType === "xml" || dataType=="auto" && ct && ct.indexOf("xml") >= 0,
								response = xml ? xhr.responseXML : xhr.responseText;
								
							if (dataType=="auto") {
								s.dataTypes[0] = s.transportDataType = xml ? "xml" : "text";
							}
							
							// Filter status for non standard behaviours
							switch (status) {
								
								// Opera returns 0 when status is 304
								case 0:
									status = 304;
									break;
								
								// IE error sometimes returns 1223 when it should be 204, see #1450
								case 1223:
									status = 204;
								
							}
							
						}
						
						// Remove listener (IE complains if not a function)
						xhr.onreadystatechange = callback = noOp;
						
						// Call complete
						complete(status,statusText,response);
						
						// Cleanup
						xhr = complete = undefined;
						
					};
					
					// Do send the request
					xhr.send( s.type === "POST" || s.type === "PUT" ? s.data : null );
					
					// firefox 1.5 doesn't fire statechange for sync requests
					if ( !s.async && callback) {
						callback();
					}
					
				} catch(e) {
					
					xhr = xhr.onreadystatechange = undefined;
					complete(0,"error",e);
					complete = undefined;
					
				}
			},
			
			abort: function(statusText) {
				if (xhr) {
					abortStatusText = statusText || "abort";
					xhr.abort();
					// Opera doesn't fire statechange for abort
					if ( callback ) {
						callback();
					}
				}
			}
			
		};
		
	}
});