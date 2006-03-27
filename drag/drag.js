$.drug = null;

$.dragstart = function(e)
{
    this.dragElement.deltaX = e.clientX - this.dragElement.offsetLeft;
    this.dragElement.deltaY = e.clientY - this.dragElement.offsetTop;

    // Save CSS
    this.dragElement.oldPos = $.css(this.dragElement, 'position');
    this.dragElement.oldCursor = $.css(this.dragElement, 'cursor');
    this.dragElement.oldUserSelect = $.css(this.dragElement, 'user-select');

    $(this.dragElement).css('position', 'absolute')
                       .css('cursor', 'move')
                       .css('user-select', 'none');
    $.drug = this.dragElement;
};

$.dragstop = function(e)
{
    $.drug = null;

    // Restore CSS
    $(this).css('cursor', this.oldCursor)
           .css('user-select', this.oldUserSelect);
}

$.drag = function(e)
{
    if ($.drug == null) {
	return;
    }
	
    // Update position
    var nx = (e.clientX - $.drug.deltaX);
    var ny = (e.clientY - $.drug.deltaY);

    // Bounds check
    // Left edge
    nx = (nx < 0) ? 0 : nx;
    // right edge
    nx = (nx + $.drug.offsetWidth) > document.width ? document.width - $.drug.offsetWidth : nx;

    // Top
    ny = (ny < window.scrollY) ? window.scrollY : ny;

    // Bottom
    ny = (ny + $.drug.offsetHeight) > window.innerHeight + window.scrollY ? window.innerHeight + window.scrollY - $.drug.offsetHeight: ny;
            
    $($.drug).css('left', nx + 'px')
             .css('top', ny + 'px');
};

$.draginit = false;

$.fn.Draggable = function(handle)
{
    // Don't add > 1 of these handlers
    if (!$.draginit) {
	$(document).bind('mousemove', $.drag);
    }
    
    return this.each(function()
    {
	var dhe = handle ? $(this).find(handle) : $(this);
	dhe.get(0).dragElement = this;

	dhe.bind('mousedown', $.dragstart)
	   .bind('mouseup', $.dragstop);
    });
};
