<?php
error_reporting(0);
$id = isset ( $_REQUEST['id'] ) ? $_REQUEST['id'] : null;
$wait = isset( $_REQUEST['wait'] ) ? $_REQUEST['wait'] : null;

if ( $wait ) sleep( $wait );

header("Content-type: text/css");

if ( $id ) {
	?>
	div#<?= $id ?> { margin-left: 27px }
	<?php
}
?>