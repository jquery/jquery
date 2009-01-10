html text<br/>
<script type="text/javascript">/* <![CDATA[ */
testFoo = "foo"; jQuery('#foo').html('foo');
ok( true, "test.php executed" );
/* ]]> */</script>
<script src="data/test.js?<?php srand(); echo time() . '' . rand(); ?>"></script>
blabla