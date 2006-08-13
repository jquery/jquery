// # $Id: Kinetic.pm 1493 2005-04-07 19:20:18Z theory $

Test.Harness.Director = function () {};
Test.Harness.Director.VERSION = '0.11';

Test.Harness.Director.runTests = function () {
    var harness = new Test.Harness.Director();
    harness.runTests.apply(harness, arguments);
};

Test.Harness.Director.prototype = new Test.Harness();
Test.Harness.Director.prototype.verbose = true;
Test.Harness.Director.prototype.args = {};

Test.Harness.Director.prototype.runTests = function (x_aFunctionNames) {
    // Allow for an array or a simple list in arguments.
    // XXX args.file isn't quite right since it's more function names, but
    // that is still to be ironed out.
    var functionNames = this.args.file
      ? typeof this.args.file == 'string' ? [this.args.file] : this.args.file
      : arguments;
    if (!x_aFunctionNames.length) return;
    var outfunctions = this.outFileNames(x_aFunctionNames);
    var harness = this;
    var start = new Date();
    var newLineRx = /(?:\r?\n|\r)+$/;
    var output = function (msg) { trace(msg.replace(newLineRx, '')) };

    for (var x = 0; x < x_aFunctionNames.length; x++){
        output(outfunctions[x]);
        eval(x_aFunctionNames[x] + "()");
        harness.outputResults(
            Test.Builder.Test,
            x_aFunctionNames[x],
            output,
            harness.args
        );
    }
    harness.outputSummary(
        output,
        new Date() - start
    );
};

Test.Harness.Director.prototype.formatFailures = function (fn) {
    // XXX Delete once the all-text version is implemented in Test.Harness.
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
    table += '</table>';
    output(table);
};