jQuery(function($) {
	window.scrollTo(1000,1000);
	$('#scroll-1')[0].scrollLeft = 5;
	$('#scroll-1')[0].scrollTop = 5;
	$('.scroll').click(function() {
		$('#marker').css( $(this).offset() );
		return false;
	});
});