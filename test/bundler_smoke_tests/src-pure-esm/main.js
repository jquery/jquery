import { $ } from "jquery";

console.assert( /^jQuery/.test( $.expando ),
	"jQuery.expando should be detected" );
