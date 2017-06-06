var loaderCount = 0;
$(document).ajaxStart(function() {
        $(".ui-dialog-titlebar").hide();
        $().waitingpopup();
        $().waitingpopup('open');
        loaderCount++;
});

$(document).ajaxStop(function() {
        if (--loaderCount == 0) {
                $().waitingpopup('close');
                $(".ui-dialog-titlebar").show();
        }
});

$(function() {
        $(".ui-dialog-titlebar").hide();
        $().waitingpopup();
        $().waitingpopup('open');
        loaderCount++;
});

$(document).ready(function() {
        if (--loaderCount == 0) {
                $().waitingpopup('close');
                $(".ui-dialog-titlebar").show();
        }
});

$(window).bind('beforeunload', showPopupOnBeforeUnloadEvent);

function showPopupOnBeforeUnloadEvent() {
        $(".ui-dialog-titlebar").hide();
        $().waitingpopup();
        $().waitingpopup('open');
}

function bindBeforeunload(){
        $(window).bind('beforeunload', showPopupOnBeforeUnloadEvent);        
}

function attachIframeEvent() {
        $('iframe').load(function() {
                if (--loaderCount == 0) {
                        $().waitingpopup('close');
                        $(".ui-dialog-titlebar").show();
                }
        });

        $('iframe').ready(function() {
                $(".ui-dialog-titlebar").hide();
                $().waitingpopup();
                $().waitingpopup('open');
                loaderCount++;
        });
}
