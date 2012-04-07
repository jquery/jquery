jQuery(function($) {
	$('.relative').click(function() {
		$('#marker').css( $(this).offset() );
		var pos = $(this).position();
		$(this).css({ position: 'absolute', top: pos.top, left: pos.left });
		return false;
	});
});