<?php
error_reporting(0);
if ( $_REQUEST['header'] ) {
	header("Content-type: text/javascript");
}
?>
ok( true, "Script executed correctly." );
