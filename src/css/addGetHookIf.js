define(function() {

function addGetHookIf( hookVar, conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	hookVar = {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				// The test was not ready at this point; screw the hook this time
				// but check again when needed next time.
				return;
			}

			if ( condition ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete hookVar.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			hookVar.get = hookFn;

			return hookVar.get.apply( hookVar, arguments );
		}
	};
}

return addGetHookIf;

});
