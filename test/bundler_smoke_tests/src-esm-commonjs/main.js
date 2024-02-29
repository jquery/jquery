/* global startIframeTest */

import { $ as $imported } from "jquery";
import { $ as $required } from "./jquery-require.cjs";

startIframeTest( $required, $imported );
