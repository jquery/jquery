/**
 * Takes all matched elements and centers them, absolutely, 
 * within the context of their parent element. Great for 
 * doing slideshows.
 *   $("div img").center();
 */
$.fn.center = function(f) {
	return this.each(function(){
		if ( !f && this.nodeName == 'IMG' &&
				 !this.offsetWidth && !this.offsetHeight ) {
			var self = this;
			setTimeout(function(){
				$(self).center(true);
			}, 13);
		} else {
			var s = this.style;
			var p = this.parentNode;
			if ( $.css(p,"position") == 'static' ) {
				p.style.position = 'relative';
			}
			s.position = 'absolute';
			s.left = (($.css(p,"width") - $.css(this,"width"))/2) + "px";
			s.top = (($.css(p,"height") - $.css(this,"height"))/2) + "px";
		}
  });
};
