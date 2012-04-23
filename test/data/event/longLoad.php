<?php
sleep((int)$_GET['sleep']);
?>
<script type="text/javascript">
window.parent.parent.iframeCallback(<?php echo $_GET['return'];?>);
</script>