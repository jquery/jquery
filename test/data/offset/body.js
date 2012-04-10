jQuery(function($) {
	$('body').click(function() {
		$('#marker').css( $(this).offset() );
		return false;
	});
});