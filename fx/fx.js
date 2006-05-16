$.speed = function(s,o) {
	if ( o && o.constructor == Function ) { o = { onComplete: o }; }
	o = o || {};
	var ss = {"crawl":1200,"xslow":850,"slow":600,"medium":400,"fast":200,"xfast":75,"normal":400};
	o.duration = typeof s == "number" ? s : ss[s] || 400;
	return o;
};

$.fn.hide = function(a,o) {
	o = $.speed(a,o);
	return a ? this.each(function(){
		new fx.FadeSize(this,o).hide();
	}) : this._hide();
};

$.fn.show = function(a,o) {
	o = $.speed(a,o);
	return a ? this.each(function(){
		new fx.FadeSize(this,o).show();
	}) : this._show();
};

$.fn.slideDown = function(a,o) {
	o = $.speed(a,o);
	return this.each(function(){
		new fx.Resize(this,o).show("height");
	});
};

$.fn.slideUp = function(a,o) {
	o = $.speed(a,o);
	return this.each(function(){
		new fx.Resize(this,o).hide("height");
	});
};

$.fn.fadeOut = function(a,o) {
	o = $.speed(a,o);
	return a ? this.each(function(){
		new fx.Opacity(this,o).hide();
	}) : this._hide();
};

$.fn.fadeIn = function(a,o) {
	o = $.speed(a,o);
	return a ? this.each(function(){
		new fx.Opacity(this,o).show();
	}) : this._show();
};

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
			s.left = parseInt(($.css(p,"width") - $.css(this,"width"))/2, 10) + "px";
			s.top = parseInt(($.css(p,"height") - $.css(this,"height"))/2, 10) + "px";
		}
  });
};

$.setAuto = function(e,p) {
	var a = e.style[p];
	var o = $.css(e,p);
	e.style[p] = 'auto';
	var n = $.css(e,p);
	if ( o != n ) {
		e.style[p] = a;
	}
};

/*
 * I originally wrote fx() as a clone of moo.fx and in the process
 * of making it small in size the code became illegible to sane 
 * people. You've been warned.
 */

function fx(el,op,ty,tz){
	var z = this;
	z.a = function(){z.el.style[ty]=z.now+z.o.unit;};
	z.max = function(){return z.el["io"+ty]||z.el["natural"+tz]||z.el["scroll"+tz]||z.cur();};
	z.cur = function(){return parseInt($.getCSS(z.el,ty),10);};
	z.show = function(){z.ss("block");z.o.auto=true;z.custom(0,z.max());};
	z.hide = function(){z.el.$o=$.getCSS(z.el,"overflow");z.el["io"+ty]=this.cur();z.custom(z.cur(),0);};
	z.ss = function(a){if(y.display!=a){y.display=a;}};
	z.toggle = function(){if(z.cur()>0){z.hide();}else{z.show();}};
	z.modify = function(a){z.custom(z.cur(),z.cur()+a);};
	z.clear = function(){clearInterval(z.timer);z.timer=null;};
	z.el = el.constructor==String?document.getElementById(el):el;
	var y = z.el.style;
	z.oo = y.overflow;
	y.overflow = "hidden";
	z.o = {
		unit: "px",
		duration: (op && op.duration) || 400,
		onComplete: (op && op.onComplete) || op
	};
	z.step = function(f,tt){
		var t = (new Date()).getTime();
		var p = (t - z.s) / z.o.duration;
		if (t >= z.o.duration+z.s) {
			z.now = tt;
			z.clear();
			setTimeout(function(){
				y.overflow = z.oo;
				if(y.height=="0px"||y.width=="0px"){z.ss("none");}
				if ( ty != "opacity" && z.o.auto ) {
					$.setAuto( z.el, "height" );
					$.setAuto( z.el, "width" );
				}
				if(z.o.onComplete.constructor == Function){z.el.$_ = z.o.onComplete;z.el.$_();}
			},13);
		} else {
			z.now = ((-Math.cos(p*Math.PI)/2) + 0.5) * (tt-f) + f;
		}
		z.a();
	};
	z.custom = function(f,t){
		if(z.timer) {return null;}
		this.now=f;z.a();z.io=z.cur();z.s=(new Date()).getTime();
		z.timer=setInterval(function(){z.step(f,t);}, 13);
	};
}
fx.fn = ["show","hide","toggle"];
fx.ty = ["Height","Width","Left","Top"];
for(var $i in fx.ty){(function(){
	var c = fx.ty[$i];
	fx[c] = function(a,b){
		return new fx(a,b,c.toLowerCase(),c);
	};
})();}
fx.Opacity = function(a,b){
	var o = new fx(a,b,"opacity");
	o.cur = function(){return parseFloat(o.el.style.opacity);};
	o.a = function() {
		var e = o.el.style;
		if (o.now == 1) { o.now = 0.9999; }
		if (window.ActiveXObject) {
			e.filter = "alpha(opacity=" + o.now*100 + ")";
		}
		e.opacity = o.now;
	};
	o.io = o.now = 1;
	o.a();
	return o;
};
fx.Resize = function(e,o){
	var z = this;
	var h = new fx.Height(e,o);
	if(o) { o.onComplete = null; }
	var w = new fx.Width(e,o);
	function c(a,b,d){return (!a||a==c||b==d);}
	for(var i in fx.fn){(function(){
		var j = fx.fn[i];
		z[j] = function(a,b){
			if(c(a,b,"height")) { h[j](); }
			if(c(a,b,"width")) { w[j](); }
		};
	})();}
	z.modify = function(c,d){
		h.modify(c);
		w.modify(d);
	};
};
fx.FadeSize = function(e,o){
	var z = this;
	var r = new fx.Resize(e,o);
	if(o) { o.onComplete = null; }
	var p = new fx.Opacity(e,o);
	for(var i in fx.fn){(function(){
		var j = fx.fn[i];
		z[j] = function(a,b){p[j]();r[j](a,b);};
	})();}
};
