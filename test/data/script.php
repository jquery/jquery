<?php
error_reporting(0);
if ( $_REQUEST['header'] ) {
	if ( $_REQUEST['header'] == "ecma" ) {
		header("Content-type: application/ecmascript");
	} else {
		header("Content-type: text/javascript");
	}
}
?>
ok( true, "Script executed correctly." );
