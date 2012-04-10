jQuery(function($) {
	$('.absolute').click(function() {
		$('#marker').css( $(this).offset() );
		var pos = $(this).position();
		$(this).css({ "top": pos.top, "left": pos.left });
		return false;
	});
});