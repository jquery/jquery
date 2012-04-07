jQuery(function($) {
	window.scrollTo(1000,1000);
	$('.fixed').click(function() {
		$('#marker').css( $(this).offset() );
		return false;
	});
});