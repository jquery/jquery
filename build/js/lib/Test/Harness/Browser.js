// # $Id: Kinetic.pm 1493 2005-04-07 19:20:18Z theory $

if (typeof JSAN != 'undefined') new JSAN().use('Test.Harness');

Test.Harness.Browser = function () {};
Test.Harness.Browser.VERSION = '0.11';

Test.Harness.Browser.runTests = function () {
    var harness = new Test.Harness.Browser();
    harness.runTests.apply(harness, arguments);
};

Test.Harness.Browser.prototype = new Test.Harness();
Test.Harness.Browser.prototype.interval = 100;

Test.Harness.Browser.prototype._setupFrame = function (a) {
    // Setup the iFrame to run the tests.
    var node = document.getElementById('buffer');
    if (node) return node.contentWindow;
    node = document.createElement("iframe");
    node.setAttribute("id", "buffer");
    node.setAttribute("name", "buffer");
		node.style.visibility = "hidden";
		node.style.height = 0; 
		node.style.width = 0;
    document.body.appendChild(node);
		
		var self = this;
		setTimeout( function(){
			self.buffer = node.contentWindow;
			self._runTests.apply(self,a);
		}, 200 );
};

Test.Harness.Browser.prototype._setupOutput = function () {
    // Setup the pre element for test output.
    var node = document.createElement("pre");
    node.setAttribute("id", "output");
    document.body.appendChild(node);
    return function (msg) {
        node.appendChild(document.createTextNode(msg));
        window.scrollTo(0, document.body.offsetHeight
                        || document.body.scrollHeight);
    };
};

Test.Harness.Browser.prototype._setupSummary = function () {
    // Setup the div for the summary.
    var node = document.createElement("div");
    node.setAttribute("id", "summary");
    //node.setAttribute("style", "white-space:pre; font-family: Verdana,Arial,serif;");
    document.body.appendChild(node);
    return function (msg) {
        node.appendChild(document.createTextNode(msg));
        window.scrollTo(0, document.body.offsetHeight
                        || document.body.scrollHeight);
    };
};

Test.Harness.Browser.prototype.runTests = function () {
	this._setupFrame(arguments);
}

Test.Harness.Browser.prototype._runTests = function () {
    var files = this.args.file
      ? typeof this.args.file == 'string' ? [this.args.file] : this.args.file
      : arguments;
    if (!files.length) return;
    var outfiles = this.outFileNames(files);
    var buffer = this.buffer;
    var harness = this;
    var ti = 0;
    var start;
    var node = document.getElementById('output');
    var output = this._setupOutput();
    var summaryOutput = this._setupSummary();
    // These depend on how we're watching for a test to finish.
    var finish = function () {}, runNext = function () {};

    // This function handles most of the work of outputting results and
    // running the next test, if there is one.
    var runner = function () {
        harness.outputResults(
            buffer.Test.Builder.Test,
            files[ti],
            output,
            harness.args
        );

        if (files[++ti]) {
            output(outfiles[ti] + (harness.args.verbose ? Test.Harness.LF : ''));
            buffer.location.href = files[ti] + "?" + start.getTime();
            runNext();
        } else {
            harness.outputSummary(
                summaryOutput,
                new Date() - start
             );
            finish();
        }
    };

    if (Object.watch) {
        // We can use the cool watch method, and avoid setting timeouts!
        // We just need to unwatch() when all tests are finished.
        finish = function () { Test.Harness.unwatch('Done') };
        Test.Harness.watch('Done', function (attr, prev, next) {
            if (next < buffer.Test.Builder.Instances.length) return next;
            runner();
            return 0;
        });
    } else {
        // Damn. We have to set timeouts. :-(
        var wait = function () {
            // Check Test.Harness.Done. If it's non-zero, then we know that
            // the buffer is fully loaded, because it has incremented
            // Test.Harness.Done.
            if (Test.Harness.Done > 0
                && Test.Harness.Done >= buffer.Test.Builder.Instances.length)
            {
                Test.Harness.Done = 0;
                runner();
            } else {
                window.setTimeout(wait, harness.interval);
            }
        };
        // We'll just have to set a timeout for the next test.
        runNext = function () { window.setTimeout(wait, harness.interval); };
        window.setTimeout(wait, this.interval);
    }

    // Now start the first test.
    output(outfiles[ti] + (this.args.verbose ? Test.Harness.LF : ''));
    start = new Date();
    buffer.location.href = files[ti] + "?" + start.getTime(); // replace() doesn't seem to work.
};

// From "JavaScript: The Difinitive Guide 4ed", p 214.
Test.Harness.Browser.prototype.args = {};
var pairs = location.search.substring(1).split(",");
for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var key = pairs[i].substring(0, pos);
    var val = pairs[i].substring(pos + 1); 
    if (Test.Harness.Browser.prototype.args[key]) {
        if (typeof Test.Harness.Browser.prototype.args[key] == 'string') {
            Test.Harness.Browser.prototype.args[key] =
                [Test.Harness.Browser.prototype.args[key]];
        }
        Test.Harness.Browser.prototype.args[key].push(unescape(val));
    } else {
        Test.Harness.Browser.prototype.args[key] = unescape(val);
    }
}
delete pairs;

Test.Harness.Browser.prototype.formatFailures = function (fn) {
    // XXX append new element for table and then populate it.
    var failedStr = "Failed Test";
    var middleStr = " Total Fail  Failed  ";
    var listStr = "List of Failed";
    var table = '<table style=""><tr><th>Failed Test</th><th>Total</th>'
      + '<th>Fail</th><th>Failed</th></tr>';
    for (var i = 0; i < this.failures.length; i++) {
        var track = this.failures[i];
        table += '<tr><td>' + track.fn + '</td>'
          + '<td>' + track.total + '</td>'
          + '<td>' + track.total - track.ok + '</td>'
          + '<td>' + this._failList(track.failList) + '</td></tr>'
    };
    table += '</table>' + Test.Harness.LF;
    var node = document.getElementById('summary');
    node.innerHTML += table;
    window.scrollTo(0, document.body.offsetHeight || document.body.scrollHeight);
};
