jQuery(function($) {
	$('table, th, td').click(function() {
		$('#marker').css( $(this).offset() );
		return false;
	});
});