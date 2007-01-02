$.fn.alphaPager = function(fn,type) {
  type = type || "char";

  if ( fn == undefined ) {
    fn = function(a){ return _clean( $.fn.text.apply( a.childNodes ) ); };
  } else if ( fn.constructor == Number ) {
    var n = fn;
    fn = function(a){ return _clean( $.fn.text.apply( [a.childNodes[ n ]] ) ); };
  }

  function _clean(a){
    switch (type) {
      case "char":
        return a.substr(0,1).toUpperCase();
      case "word":
        return /^([a-z0-9]+)/.exec(a)[1];
    }
    return a;
  }

  return this.pager( fn );
};


$.fn.pager = function(step) {
  var types = {
    UL: "li",
    OL: "li",
    DL: "dt",
    TABLE: "tr"
  };

  return this.each(function(){
    var type = types[this.nodeName];
    var pagedUI = type == "tr" ? $("tbody",this) : $(this);
    var rows = $(type, pagedUI);
    var curPage = 0;
    var names = [], num = [];

    if ( !step || step.constructor != Function ) {
      step = step || 10;

      if (rows.length > step)
        for ( var i = 0; i <= rows.length; i += step ) {
          names.push( names.length + 1 );
          num.push( [ i, step ] );
        }
    } else {
      var last;
      rows.each(function(){
        var l = step( this );
        if ( l != last ) {
          names.push( l );
          var pre = num.length ? num[ num.length - 1 ][0] + num[ num.length - 1 ][1] : 0;
           
          num.push( [ pre, 0 ] );
          last = l;
        }

        num[ num.length - 1 ][1]++;
      });
    }

    if ( names.length > 1 ) {
      var pager = $(this).prev("ul.nav-page").empty();

      if ( !pager.length )
        pager = $("<ul class='nav-page'></ul>");

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
      var e = num[ curPage ][1];

      if ( !curPage ) prev.hide();
      else prev.show();

      if ( curPage == names.length - 1 ) next.hide();
      else next.show();

      $("li",pager)
        .removeClass("cur")
        .eq( curPage + 1 )
          .addClass("cur");

      pagedUI.empty().append(
        jQuery.makeArray( rows ).slice( s, s + e )
      );

      return false;
    }
  });
};
