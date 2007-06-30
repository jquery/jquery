  jQuery.benchmarker.tests = [
		"*",
		"body", "body div", "div", 
		"div div div", "div div", ".dialog", "div.dialog", "div .dialog",
		"#speech5", "div#speech5", "div #speech5", "div > div", "div.scene div.dialog",
		"div#scene1.scene div.dialog div", "#scene1 #speech1", "body > div.dialog div#speech5",
		"div:nth-child(even)", "div:nth-child(odd)",
		"div:nth-child(1)", "div:nth-child(2n)",
		"div:nth-child(2n+3)", "div:first-child",
		"div:last-child", "div:only-child",
		"div:contains(CELIA)",
		"div ~ div", "div + div",
		"div[@class]", "div[@class=dialog]", "div[@class!=dialog]", 
		"div[@class^=dialog]", "div[@class$=dialog]", "div[@class*=dialog]"
		]

  jQuery.fn.benchmark = function() {
    this.each(function() {
      try {
        jQuery(this).parent().children("*:gt(1)").remove();
      } catch(e) { }
    })
    var times = 5;
    jQuery("#times").html(times);
    jQuery.benchmarker.startingList = this.get();
    benchmark(this.get(), times, jQuery.benchmarker.libraries);
  }

  jQuery(function() {
    for(i = 0; i < jQuery.benchmarker.tests.length; i++) {
      jQuery("tbody").append("<tr><td class='test'>" + jQuery.benchmarker.tests[i] + "</td></tr>");
    }
    jQuery("tbody tr:first-child").remove();
    jQuery("td.test").before("<td><input type='checkbox' checked='checked' /></td>");
    jQuery("button.runTests").bind("click", function() {
      jQuery('td[input:checked] + td.test').benchmark();
    });

    jQuery("button.retryTies").bind("click", function() { jQuery("tr[td.tie] td.test").benchmark() })

    jQuery("button.selectAll").bind("click", function() { jQuery("input[@type=checkbox]").each(function() { this.checked = true }) })
    jQuery("button.deselectAll").bind("click", function() { jQuery("input[@type=checkbox]").each(function() { this.checked = false }) })

    jQuery("#addTest").bind("click", function() {
      jQuery("table").append("<tr><td><input type='checkbox' /></td><td><input type='text' /><button>Add</button></td></tr>");
      jQuery("div#time-test > button").each(function() { this.disabled = true; })
      jQuery("tbody tr:last button").bind("click", function() {
        var td = jQuery(this).parent();
        td.html("<button>-</button>" + jQuery(this).prev().val()).addClass("test");
        jQuery("div#time-test > button").each(function() { this.disabled = false; })
        jQuery("button", td).bind("click", function() { jQuery(this).parents("tr").remove(); })
      })
    })

    var headers = jQuery.map(jQuery.benchmarker.libraries, function(i) {
      return "<th>" + i + "</th>"
    }).join("");

    jQuery("thead tr").append(headers);

    var footers = "";
    for(i = 0; i < jQuery.benchmarker.libraries.length; i++)
      footers += "<th></th>"

    var wlfooters = "";
    for(i = 0; i < jQuery.benchmarker.libraries.length; i++)
      wlfooters += "<td><span class='wins'>W</span> / <span class='fails'>F</span></th>"

    jQuery("tfoot tr:first").append(footers);
    jQuery("tfoot tr:last").append(wlfooters);

  });

   benchmark = function(list, times, libraries) {
     if(list[0]) {
       var times = times || 50;
       var el = list[0];
       var code = jQuery(el).text().replace(/^-/, "");
         if(!libraries[0].match(/^jQ/)) {
           code = code.replace(/@/, "");
         }
         var timeArr = []
         for(i = 0; i < times + 2; i++) {
           var time = new Date()
           try {
             window[libraries[0]](code);
           } catch(e) { }
           timeArr.push(new Date() - time);
         }
         var diff = Math.sum(timeArr) - Math.max.apply( Math, timeArr )
		- Math.min.apply( Math, timeArr );
         try {
           var libRes = window[libraries[0]](code);
           var jqRes = jQuery(code);
           if(((jqRes.length == 0) && (libRes.length != 0)) ||
             (libRes.length > 0 && (jqRes.length == libRes.length)) ||
             ((libraries[0] == "cssQuery" || libraries[0] == "jQuery") && code.match(/nth\-child/) && (libRes.length > 0)) ||
             ((libraries[0] == "jQold") && jqRes.length > 0)) {
             jQuery(el).parent().append("<td>" + Math.round(diff / times * 100) / 100 + "ms</td>");
           } else {
             jQuery(el).parent().append("<td class='fail'>FAIL</td>");
           }
         } catch(e) {
           jQuery(el).parent().append("<td class='fail'>FAIL</td>");
         }
       setTimeout(benchmarkList(list, times, libraries), 100);
     } else if(libraries[1]) {
       benchmark(jQuery.benchmarker.startingList, times, libraries.slice(1));
     } else {
       jQuery("tbody tr").each(function() {
         var winners = jQuery("td:gt(1)", this).min(2);
         if(winners.length == 1) winners.addClass("winner");
         else winners.addClass("tie");
       });
       setTimeout(count, 100);
     }
   }

  function benchmarkList(list, times, libraries) {
    return function() {
      benchmark(list.slice(1), times, libraries);
    }
  }

 function count() {
   for(i = 3; i <= jQuery.benchmarker.libraries.length + 2 ; i++) {
     var fails = jQuery("td:nth-child(" + i + ").fail").length;
     var wins = jQuery("td:nth-child(" + i + ").winner").length;
     jQuery("tfoot tr:first th:eq(" + (i - 1) + ")")
      .html("<span class='wins'>" + wins + "</span> / <span class='fails'>" + fails + "</span>");
   }
 }


 jQuery.fn.maxmin = function(tolerance, maxmin, percentage) {
   tolerance = tolerance || 0;
   var target = Math[maxmin].apply(Math, jQuery.map(this, function(i) {
     var parsedNum = parseFloat(i.innerHTML.replace(/[^\.\d]/g, ""));
     if(parsedNum || (parsedNum == 0)) return parsedNum;
   }));
   return this.filter(function() {
     if( withinTolerance(parseFloat(this.innerHTML.replace(/[^\.\d]/g, "")), target, tolerance, percentage) ) return true;
   })
 }

 jQuery.fn.max = function(tolerance, percentage) { return this.maxmin(tolerance, "max", percentage) }
 jQuery.fn.min = function(tolerance, percentage) { return this.maxmin(tolerance, "min", percentage) }

 function withinTolerance(number, target, tolerance, percentage) {
   if(percentage) { var high = target + ((tolerance / 100) * target); var low = target - ((tolerance / 100) * target); }
   else { var high = target + tolerance; var low = target - tolerance; }
   if(number >= low && number <= high) return true;
 }

 Math.sum = function(arr) {
   var sum = 0;
   for(i = 0; i < arr.length; i++) sum += arr[i];
   return sum;
 }
