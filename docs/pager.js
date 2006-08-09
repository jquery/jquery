$.fn.clone = function(){
	return this.pushStack( $.map(this,"a.cloneNode(true)"), arguments );
};


$.fn.pager = function(step,fn) {
  var types = {
    UL: "li",
    OL: "li",
    DL: "dt",
    TABLE: "tbody > tr"
  };

  return this.each(function(){
    var pagedUI = this;
    var rows = $(types[this.nodeName], this);
    var curPage = 0;
    var names = [], num = [];

    if ( !step || step.constructor != Function ) {
      step = step || 10;

      if (rows.length > step)
        for ( var i = 0; i <= rows.length; i += step ) {
          names.push( names.length + 1 );
          num.push( [ i * step, step ] );
        }
    } else {
      var last;
      rows.each(function(){
        var l = step.apply( this ).substr(0,1);
        if ( l != last ) {
          names.push( l.toUpperCase() );
          var pre = num.length ? num[ num.length - 1 ][0] + num[ num.length - 1 ][1] : 0;
           
          num.push( [ pre, 0 ] );
          last = l;
        }

        num[ num.length - 1 ][1]++;
      });
    }

    if ( names.length ) {
      var pager = $("<ul class='nav-page'></ul>");

      for ( var i = 0; i < names.length; i++ )
        $("<a href=''></a>").rel( i ).html( names[i] ).click(function() {
          return handleCrop( this.rel );
        }).wrap("<li></li>").parent().appendTo(pager);

      pager.insertBefore( this );

      var prev = $("<a href=''>&laquo; Prev</a>").click(function(){
        return handleCrop( --curPage );
      }).wrap("<li class='prev'></li>").parent().prependTo(pager);

      var next = $("<a href=''>Next &raquo;</a>").click(function(){
        return handleCrop( ++curPage );
      }).wrap("<li class='next'></li>").parent().appendTo(pager);

      handleCrop( 0 );
    }

    function handleCrop( page ) {
      curPage = page - 0;
      var s = num[ curPage ][0];
      var e = s + num[ curPage ][1];

      if ( !curPage ) prev.hide();
      else prev.show();

      if ( curPage == names.length - 1 ) next.hide();
      else next.show();

      $("li",pager)
        .removeClass("cur")
        .eq( curPage + 1 )
          .addClass("cur");

      rows
	.hide()
      	.gt(s - 1).lt(e)
          .show()
        .end().end();

      if ( fn )
        fn.apply( pagedUI, [ s, e ] );

      return false;
    }
  });
};
