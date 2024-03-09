import { $ as $imported } from "jquery";
import { $ as $required } from "./jquery-require.cjs";

console.assert( $required === $imported,
	"Only one copy of jQuery should exist" );

console.assert( /^jQuery/.test( $imported.expando ),
	"jQuery.expando should be detected" );
