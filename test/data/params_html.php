<div id="post">
<?php
	foreach( $_POST as $key=>$value )
		echo "<b id='$key'>$value</b>";
?>
</div>
<div id="get">
<?php
	foreach( $_GET as $key=>$value )
		echo "<b id='$key'>$value</b>";
?>
</div>