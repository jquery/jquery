// # $Id: Kinetic.pm 1493 2005-04-07 19:20:18Z theory $

// Set up namespace.
if (typeof self != 'undefined') {
    // Browser
    if (typeof Test == 'undefined') Test = {PLATFORM: 'browser'};
    else Test.PLATFORM = 'browser';
} else if (typeof _global != 'undefined') {
    //Director
    if (typeof _global.Test == "undefined") _global.Test = {PLATFORM: 'director'};
    else _global.Test.PLATFORM = 'director';
} else {
    throw new Error("Test.More does not support your platform");
}

// Constructor.
Test.Builder = function () {
    if (!Test.Builder.Test) {
        Test.Builder.Test = this.reset();
        Test.Builder.Instances.push(this);
    }
    return Test.Builder.Test;
};

// Static variables.
Test.Builder.VERSION = '0.11';
Test.Builder.Instances = [];
Test.Builder.lineEndingRx = /\r?\n|\r/g;
Test.Builder.StringOps = {
    eq: '==',
    ne: '!=',
    lt: '<',
    gt: '>',
    ge: '>=',
    le: '<='
};

// Stoopid IE.
Test.Builder.LF = typeof document != "undefined"
                  && typeof document.all != "undefined"
  ? "\r"
  : "\n";

// Static methods.
Test.Builder.die = function (msg) {
    throw new Error(msg);
};

Test.Builder._whoa = function (check, desc) {
    if (!check) return;
    Test.Builder.die("WHOA! " + desc + Test.Builder.LF +
                     + "This should never happen! Please contact the author "
                     + "immediately!");
};

Test.Builder.typeOf = function (object) {
    var c = Object.prototype.toString.apply(object);
    var name = c.substring(8, c.length - 1);
    if (name != 'Object') return name;
    // It may be a non-core class. Try to extract the class name from
    // the constructor function. This may not work in all implementations.
    if (/function ([^(\s]+)/.test(Function.toString.call(object.constructor))) {
        return RegExp.$1;
    }
    // No idea. :-(
    return name;
};

// Instance methods.
Test.Builder.create = function () {
    var test = Test.Builder.Test;
    Test.Builder.Test = null;
    var ret = new Test.Builder();
    Test.Builder.Test = test;
    return ret.reset();
};

Test.Builder.prototype.reset = function () {
    this.TestDied      = false;
    this.HavePlan      = false;
    this.NoPlan        = false;
    this.CurrTest      = 0;
    this.ExpectedTests = 0;
    this.UseNums       = true;
    this.NoHeader      = false;
    this.NoEnding      = false;
    this.TestResults   = [];
    this.ToDo          = [];
    this.Buffer       = [];
    this.asyncs        = [0];
    this.asyncID       = 0;
    return this._setupOutput();
};

Test.Builder.prototype._print = function (msg) {
    this.output().call(this, msg);
};

Test.Builder.prototype.warn = function (msg) {
    this.warnOutput().apply(this, arguments);
};

Test.Builder.prototype.plan = function (arg) {
    if (!arg) return;
    if (this.HavePlan) Test.Builder.die("You tried to plan twice!");

    if (!(arg instanceof Object))
        Test.Builder.die("plan() doesn't understand " + arg);
    for (var cmd in arg) {
        if (cmd == 'tests') {
            if (arg[cmd] == null) {
                TestBulder.die(
                    "Got an undefined number of tests. Looks like you tried to "
                    + "say how many tests you plan to run but made a mistake."
                    + Test.Builder.LF
                );
            } else if (!arg[cmd]) {
                Test.Builder.die(
                    "You said to run 0 tests! You've got to run something."
                    + Test.Builder.LF
                );
            } else {
                this.expectedTests(arg[cmd]);
            }
        } else if (cmd == 'skipAll') {
            this.skipAll(arg[cmd]);
        } else if (cmd == 'noPlan' && arg[cmd]) {
            this.noPlan();
        } else {
            Test.Builder.die("plan() doesn't understand "
                             + cmd + (arg[cmd] ? (" " + arg[cmd]) : ''));
        }
    }
};

Test.Builder.prototype.expectedTests = function (max) {
    if (max) {
        if (isNaN(max)) {
            Test.Builder.die(
                "Number of tests must be a postive integer. You gave it '"
                + max + "'." + Test.Builder.LF
            );
        }

        this.ExpectedTests = max.valueOf();
        this.HavePlan       = 1;
        if (!this.noHeader()) this._print("1.." + max + Test.Builder.LF);
    }
    return this.ExpectedTests;
};

Test.Builder.prototype.noPlan = function () {
    this.NoPlan   = 1;
    this.HavePlan = 1;
};

Test.Builder.prototype.hasPlan = function () {
    if (this.ExpectedTests) return this.ExpectedTests;
    if (this.NoPlan) return 'noPlan';
};

Test.Builder.prototype.skipAll = function (reason) {
    var out = "1..0";
    if (reason) out += " # Skip " + reason;
    out += Test.Builder.LF;
    this.SkipAll = 1;
    if (!this.noHeader()) this._print(out);
    // Just throw and catch an exception.
    window.onerror = function () { return true; }
    throw new Error("__SKIP_ALL__");
};

Test.Builder.prototype.ok = function (test, desc) {
    // test might contain an object that we don't want to accidentally
    // store, so we turn it into a boolean.
    test = !!test;

    if (!this.HavePlan)
        Test.Builder.die("You tried to run a test without a plan! Gotta have a plan.");

    // I don't think we need to worry about threading in JavaScript.
    this.CurrTest++;

    // In case desc is a string overloaded object, force it to stringify.
    if (desc) desc = desc.toString();

    var startsNumber
    if (desc != null && /^[\d\s]+$/.test(desc)) {
        this.diag( "Your test description is '" + desc + "'. You shouldn't use",
                   Test.Builder.LF,
                   "numbers for your test names. Very confusing.");
    }

    var todo = this._todo();
    // I don't think we need to worry about result beeing shared between
    // threads.
    var out = '';
    var result = {};

    if (test) {
        result.ok        = true;
        result.actual_ok = test;
    } else {
        out += 'not ';
        result.ok        = todo ? true : false;
        result.actual_ok = false;
    }

    out += 'ok';
    if (this.useNumbers) out += ' ' + this.CurrTest;

    if (desc == null) {
        result.desc = '';
    } else {
        desc = desc.replace(Test.Builder.lineEndingRx, Test.Builder.LF + "# ");
        // XXX Does this matter since we don't have a TestHarness?
        desc.split('#').join('\\#'); // # # in a desc can confuse TestHarness.
        out += ' - ' + desc;
        result.desc = desc;
    }

    if (todo) {
        todo = todo.replace(Test.Builder.lineEndingRx, Test.Builder.LF + "# ");
        out += " # TODO " + todo;
        result.reason = todo;
        result.type   = 'todo';
    } else {
        result.reason = '';
        result.type   = '';
    }

    this.TestResults[this.CurrTest - 1] = result;

    out += Test.Builder.LF;
    this._print(out);

    if (!test) {
        var msg = todo ? "Failed (TODO)" : "Failed";
        // XXX Hrm, do I need this?
        //$self_print_diag(Test.Builder.LF) if $ENV{HARNESS_ACTIVE};
        this.diag("    " + msg + " test");
    }
    result.output = this.Buffer.splice(0).join('');
    return test;
};

Test.Builder.prototype.isEq = function (got, expect, desc) {
    if (got == null || expect == null) {
        // undefined only matches undefined and nothing else
        return this.isUndef(got, '==', expect, desc);
    }
    return this.cmpOK(got, '==', expect, desc);
};

Test.Builder.prototype.isNum = function (got, expect, desc) {
    if (got == null || expect == null) {
        // undefined only matches undefined and nothing else
        return this.isUndef(got, '==', expect, desc);
    }
    return this.cmpOK(Number(got), '==', Number(expect), desc);
};

Test.Builder.prototype.isntEq = function (got, dontExpect, desc) {
    if (got == null || dontExpect == null) {
        // undefined only matches undefined and nothing else
        return this.isUndef(got, '!=', dontExpect, desc);
    }
    return this.cmpOK(got, '!=', dontExpect, desc);
};

Test.Builder.prototype.isntNum = function (got, dontExpect, desc) {
    if (got == null || dontExpect == null) {
        // undefined only matches undefined and nothing else
        return this.isUndef(got, '!=', dontExpect, desc);
    }
    return this.cmpOK(Number(got), '!=', Number(dontExpect), desc);
};

Test.Builder.prototype.like = function (val, regex, desc) {
    return this._regexOK(val, regex, '=~', desc);
};

Test.Builder.prototype.unlike = function (val, regex, desc) {
    return this._regexOK(val, regex, '!~', desc);
};

Test.Builder.prototype._regexOK = function (val, regex, cmp, desc) {
    // Create a regex object.
    var type = Test.Builder.typeOf(regex);
    var ok;
    if (type.toLowerCase() == 'string') {
        // Create a regex object.
        regex = new RegExp(regex);
    } else {
        if (type != 'RegExp') {
            ok = this.ok(false, desc);
            this.diag("'" + regex + "' doesn't look much like a regex to me.");
            return ok;
        }
    }

    if (val == null || typeof val != 'string') {
        if (cmp == '=~') {
            // The test fails.
            ok = this.ok(false, desc);
            this._diagLike(val, regex, cmp);
        } else {
            // undefined matches nothing (unlike in Perl, where undef =~ //).
            ok = this.ok(true, desc);
        }
        return ok;
    }

    // Use val.match() instead of regex.test() in case they've set g.
    var test = val.match(regex);
    if (cmp == '!~') test = !test;
    ok = this.ok(test, desc);
    if (!ok) this._diagLike(val, regex, cmp);
    return ok;
};

Test.Builder.prototype._diagLike = function (val, regex, cmp) {
    var match = cmp == '=~' ? "doesn't match" : "      matches";
    return this.diag(
        "                  '" + val + "" + Test.Builder.LF +
        "    " + match + " /" + regex.source + "/"
    );
};

Test.Builder.prototype.cmpOK = function (got, op, expect, desc) {

    var test;
    if (Test.Builder.StringOps[op]) {
        // Force string context.
        test = eval("got.toString() " + Test.Builder.StringOps[op] + " expect.toString()");
    } else {
        test = eval("got " + op + " expect");
    }

    var ok = this.ok(test, desc);
    if (!ok) {
        if (/^(eq|==)$/.test(op)) {
            this._isDiag(got, op, expect);
        } else {
            this._cmpDiag(got, op, expect);
        }
    }
    return ok;
};

Test.Builder.prototype._cmpDiag = function (got, op, expect) {
    if (got != null) got = "'" + got.toString() + "'";
    if (expect != null) expect = "'" + expect.toString() + "'";
    return this.diag("    " + got + Test.Builder.LF + "        " + op
                     + Test.Builder.LF + "    " + expect);
};

Test.Builder.prototype._isDiag = function (got, op, expect) {
    var args = [got, expect];
    for (var i = 0; i < args.length; i++) {
        if (args[i] != null) {
            args[i] = op == 'eq' ? "'" + args[i].toString() + "'" : args[i].valueOf();
        }
    }

    return this.diag(
        "         got: " + args[0] + Test.Builder.LF +
        "    expected: " + args[1] + Test.Builder.LF
    );
};

Test.Builder.prototype.BAILOUT = function (reason) {
    this._print("Bail out! " + reason);
    // Just throw and catch an exception.
    window.onerror = function () {
        // XXX Do something to tell TestHarness it was a bailout?
        return true;
    }
    throw new Error("__BAILOUT__");
};

Test.Builder.prototype.skip = function (why) {
    if (!this.HavePlan)
        Test.Builder.die("You tried to run a test without a plan! Gotta have a plan.");

    // In case desc is a string overloaded object, force it to stringify.
    if (why) why = why.toString().replace(Test.Builder.lineEndingRx,
                                          Test.Builder.LF+ "# ");

    this.CurrTest++;
    this.TestResults[this.CurrTest - 1] = {
        ok:        true,
        actual_ok: true,
        desc:      '',
        type:      'skip',
        reason:    why
    };

    var out = "ok";
    if (this.useNumbers) out += ' ' + this.CurrTest;
    out    += " # skip " + why + Test.Builder.LF;
    this._print(out);
    this.TestResults[this.CurrTest - 1].output =
      this.Buffer.splice(0).join('');
    return true;
};

Test.Builder.prototype.todoSkip = function (why) {
    if (!this.HavePlan)
        Test.Builder.die("You tried to run a test without a plan! Gotta have a plan.");

    // In case desc is a string overloaded object, force it to stringify.
    if (why) why = why.toString().replace(Test.Builder.lineEndingRx,
                                          Test.Builder.LF + "# ");
    

    this.CurrTest++;
    this.TestResults[this.CurrTest - 1] = {
        ok:        true,
        actual_ok: false,
        desc:      '',
        type:      'todo_skip',
        reason:    why
    };

    var out = "not ok";
    if (this.useNumbers) out += ' ' + this.CurrTest;
    out    += " # TODO & SKIP " + why + Test.Builder.LF;
    this._print(out);
    this.TestResults[this.CurrTest - 1].output =
      this.Buffer.splice(0).join('');
    return true;
};

Test.Builder.prototype.skipRest = function (reason) {
    var out = "# Skip";
    if (reason) out += " " + reason;
    out += Test.Builder.LF;
    if (this.NoPlan) this.skip(reason);
    else {
        for (var i = this.CurrTest; i < this.ExpectedTests; i++) {
            this.skip(reason);
        }
    }
    // Just throw and catch an exception.
    window.onerror = function () { return true; }
    throw new Error("__SKIP_REST__");
};

Test.Builder.prototype.useNumbers = function (useNums) {
    if (useNums != null) this.UseNums = useNums;
    return this.UseNums;
};

Test.Builder.prototype.noHeader = function (noHeader) {
    if (noHeader != null) this.NoHeader = !!noHeader;
    return this.NoHeader;
};

Test.Builder.prototype.noEnding = function (noEnding) {
    if (noEnding != null) this.NoEnding = !!noEnding;
    return this.NoEnding;
};

Test.Builder.prototype.diag = function () {
    if (!arguments.length) return;

    var msg = '# ';
    // Join each agument and escape each line with a #.
    for (i = 0; i < arguments.length; i++) {
        // Replace any newlines.
        msg += arguments[i].toString().replace(Test.Builder.lineEndingRx,
                                               Test.Builder.LF + "# ");
    }

    // Append a new line to the end of the message if there isn't one.
    if (!(new RegExp(Test.Builder.LF + '$').test(msg)))
        msg += Test.Builder.LF;
    // Append the diag message to the most recent result.
    return this._printDiag(msg);
};

Test.Builder.prototype._printDiag = function () {
    var fn = this.todo() ? this.todoOutput() : this.failureOutput();
    fn.apply(this, arguments);
    return false;
};

Test.Builder.prototype.output = function (fn) {
    if (fn != null) {
        var buffer = this.Buffer;
        this.Output = function (msg) { buffer.push(msg); fn(msg) };
    }
    return this.Output;
};

Test.Builder.prototype.failureOutput = function (fn) {
    if (fn != null) {
        var buffer = this.Buffer;
        this.FailureOutput = function (msg) { buffer.push(msg); fn(msg) };
    }
    return this.FailureOutput;
};

Test.Builder.prototype.todoOutput = function (fn) {
    if (fn != null) {
        var buffer = this.Buffer;
        this.TodoOutput = function (msg) { buffer.push(msg); fn(msg) };
    }
    return this.TodoOutput;
};

Test.Builder.prototype.endOutput = function (fn) {
    if (fn != null) {
        var buffer = this.Buffer;
        this.EndOutput = function (msg) { buffer.push(msg); fn(msg) };
    }
    return this.EndOutput;
};

Test.Builder.prototype.warnOutput = function (fn) {
    if (fn != null) {
        var buffer = this.Buffer;
        this.WarnOutput = function (msg) { buffer.push(msg); fn(msg) };
    }
    return this.WarnOutput;
};

Test.Builder.prototype._setupOutput = function () {
    if (Test.PLATFORM == 'browser') {
        var writer = function (msg) {
            // I'm sure that there must be a more efficient way to do this,
            // but if I store the node in a variable outside of this function
            // and refer to it via the closure, then things don't work right
            // --the order of output can become all screwed up (see
            // buffer.html).  I have no idea why this is.
            var node = document.getElementById("test");
            if (node) {
                // This approach is neater, but causes buffering problems when
                // mixed with document.write. See tests/buffer.html.
                //node.appendChild(document.createTextNode(msg));
                //return;
                for (var i = 0; i < node.childNodes.length; i++) {
                    if (node.childNodes[i].nodeType == 3 /* Text Node */) {
                        // Append to the node and scroll down.
                        node.childNodes[i].appendData(msg);
                        window.scrollTo(0, document.body.offsetHeight
                                        || document.body.scrollHeight);
                        return;
                    }
                }

                // If there was no text node, add one.
                node.appendChild(document.createTextNode(msg));
                window.scrollTo(0, document.body.offsetHeight
                                || document.body.scrollHeight);
                return;
            }

            // Default to the normal write and scroll down...
            document.write(msg);
            window.scrollTo(0, document.body.offsetHeight
                            || document.body.scrollHeight);
        };

        this.output(writer);
        this.failureOutput(writer);
        this.todoOutput(writer);
        this.endOutput(writer);

        if (window) {
            if (window.alert.apply) this.warnOutput(window.alert, window);
            else this.warnOutput(function (msg) { window.alert(msg) });
        }

    } else if (Test.PLATFORM == 'director') {
        // Macromedia-Adobe:Director MX 2004 Support
        // XXX Is _player a definitive enough object?
        // There may be an even more explicitly Director object.
        this.output(trace);       
        this.failureOutput(trace);
        this.todoOutput(trace);
        this.warnOutput(trace);
    }

    return this;
};

Test.Builder.prototype.currentTest = function (num) {
    if (num == null) return this.CurrTest;

    if (!this.HavePlan)
        Test.Builder.die("Can't change the current test number without a plan!");
    this.CurrTest = num;
    if (num > this.TestResults.length ) {
        var reason = 'incrementing test number';
        for (i = this.TestResults.length; i < num; i++) {
            this.TestResults[i] = {
                ok:        true, 
                actual_ok: null,
                reason:    reason,
                type:      'unknown', 
                name:      null,
                output:    'ok - ' + reason + Test.Builder.LF
            };
        }
    } else if (num < this.TestResults.length) {
        // IE requires the second argument to truncate the array.
        this.TestResults.splice(num, this.TestResults.length);
    }
    return this.CurrTest;
};

Test.Builder.prototype.summary = function () {
    var results = new Array(this.TestResults.length);
    for (var i = 0; i < this.TestResults.length; i++) {
        results[i] = this.TestResults[i]['ok'];
    }
    return results
};

Test.Builder.prototype.details = function () {
    return this.TestResults;
};

Test.Builder.prototype.todo = function (why, howMany) {
    if (howMany) this.ToDo = [why, howMany];
    return this.ToDo[1];
};

Test.Builder.prototype._todo = function () {
    if (this.ToDo[1]) {
        if (this.ToDo[1]--) return this.ToDo[0];
        this.ToDo = [];
    }
    return false;
};

Test.Builder.prototype._sanity_check = function () {
    Test.Builder._whoa(
        this.CurrTest < 0,
        'Says here you ran a negative number of tests!'
    );

    Test.Builder._whoa(
        !this.HavePlan && this.CurrTest, 
        'Somehow your tests ran without a plan!'
    );

    Test.Builder._whoa(
        this.CurrTest != this.TestResults.length,
        'Somehow you got a different number of results than tests ran!'
    );
};

Test.Builder.prototype._notifyHarness = function () {
    // Special treatment for the browser harness.
    if (typeof window != 'undefined' && window.parent
        && window.parent.Test && window.parent.Test.Harness) {
        window.parent.Test.Harness.Done++;
    }
};

Test.Builder.prototype._ending = function () {
    if (this.Ended) return;
    this.Ended = true;
    if (this.noEnding()) {
        this._notifyHarness();
        return;
    }
    this._sanity_check();
    var out = this.endOutput();

    // Figure out if we passed or failed and print helpful messages.
    if( this.TestResults.length ) {
        // The plan?  We have no plan.
        if (this.NoPlan) {
            if (!this.noHeader())
                this._print("1.." + this.CurrTest + Test.Builder.LF);
            this.ExpectedTests = this.CurrTest;
        }

        var numFailed = 0;
        for (var i = 0; i < this.TestResults.length; i++) {
            if (!this.TestResults[i]) numFailed++;
        }
        numFailed += Math.abs(
            this.ExpectedTests - this.TestResults.length
        );

        if (this.CurrTest < this.ExpectedTests) {
            var s = this.ExpectedTests == 1 ? '' : 's';
            out(
                "# Looks like you planned " + this.ExpectedTests + " test"
                + s + " but only ran " + this.CurrTest + "." + Test.Builder.LF
            );
        } else if (this.CurrTest > this.ExpectedTests) {
           var numExtra = this.CurrTest - this.ExpectedTests;
            var s = this.ExpectedTests == 1 ? '' : 's';
            out(
                "# Looks like you planned " + this.ExpectedTests + " test"
                + s + " but ran " + numExtra + " extra." + Test.Builder.LF
            );
        } else if (numFailed) {
            var s = numFailed == 1 ? '' : 's';
            out(
                "# Looks like you failed " + numFailed + "test" + s + " of "
                + this.ExpectedTests + "." + Test.Builder.LF
            );
        }

        if (this.TestDied) {
            out(
                "# Looks like your test died just after " 
                + this.CurrTest + "." + Test.Builder.LF
            );
        }

    } else if (!this.SkipAll) {
        // skipAll requires no status output.
        if (this.TestDied) {
            out(
                "# Looks like your test died before it could output anything."
                + Test.Builder.LF
            );
        } else {
            out("# No tests run!" + Test.Builder.LF);
        }
    }
    this._notifyHarness();
};

Test.Builder.prototype.isUndef = function (got, op, expect, desc) {
    // Undefined only matches undefined, so we don't need to cast anything.
    var test = eval("got " + (Test.Builder.StringOps[op] || op) + " expect");
    this.ok(test, desc);
    if (!test) this._isDiag(got, op, expect);
    return test;
};

if (window) {
    // Set up an onload function to end all tests.
    window.onload = function () {
        for (var i = 0; i < Test.Builder.Instances.length; i++) {
            // The main process is always async ID 0.
            Test.Builder.Instances[i].endAsync(0);
        }
    };

    // Set up an exception handler. This is so that we can capture deaths but
    // still output information for TestHarness to pick up.
    window.onerror = function (msg, url, line) {
        // Output the exception.
        Test.Builder.Test.TestDied = true;
        Test.Builder.Test.diag("Error in " + url + " at line " + line + ": " + msg);
        return true;
    };
};

Test.Builder.prototype.beginAsync = function (timeout) {
	var id = ++this.asyncID;
    if (timeout && window && window.setTimeout) {
        // Are there other ways of setting timeout in non-browser settings?
        var aTest = this;
        this.asyncs[id] = window.setTimeout(
            function () { aTest.endAsync(id) }, timeout
        );
    } else {
        // Make sure it's defined.
        this.asyncs[id] = 0;
    }
	return id;
};

Test.Builder.prototype.endAsync = function (id) {
    if (this.asyncs[id] == undefined) return;
    if (this.asyncs[id]) {
		// Remove the timeout
		window.clearTimeout(this.asyncs[id]);
	}
    if (--this.asyncID < 0) this._ending();
};

Test.Builder.exporter = function (pkg, root) {
    if (typeof root == 'undefined') {
        if      (Test.PLATFORM == 'browser')  root = window;
        else if (Test.PLATFORM == 'director') root = _global;
        else throw new Error("Platform unknown");
    }
    for (var i = 0; i < pkg.EXPORT.length; i++) {
        if (typeof root[pkg.EXPORT[i]] == 'undefined')
            root[pkg.EXPORT[i]] = pkg[pkg.EXPORT[i]];
    }
};// # $Id: Kinetic.pm 1493 2005-04-07 19:20:18Z theory $
// Create a namespace for ourselves.

// Set up package.
if (typeof JSAN != 'undefined') new JSAN().use('Test.Builder');
else {
    if (typeof Test == 'undefined' || typeof Test.Builder == 'undefined')
        throw new Error(
            "You must load either JSAN or Test.Builder "
            + "before loading Test.More"
        );
}

Test.More = {};
Test.More.EXPORT = [
    'plan',
    'ok', 'is', 'isnt',
    'like', 'unlike',
    'cmpOK', 'canOK', 'isaOK',
    'pass', 'fail', 'diag', 'loadOK',
    'skip', 'todo', 'todoSkip', 'skipRest',
    'isDeeply', 'isSet', 'isa'
];
Test.More.EXPORT_TAGS = { ':all': Test.More.EXPORT };
Test.More.VERSION     = '0.11';

Test.More.ShowDiag = true;
Test.Builder.DNE = { dne: 'Does not exist' };
Test.More.Test = new Test.Builder();
Test.More.builder = function () { return Test.More.Test; };

Test.More.plan = function (cmds) {
    if (cmds.noDiag) {
        Test.More.ShowDiag = false;
        delete cmds.noDiag;
    }
    return Test.More.Test.plan.apply(Test.More.Test, [cmds]);
};

Test.More.ok = function (test, desc) {
    return Test.More.Test.ok(test, desc);
};

Test.More.is = function (got, expect, desc) {
    return Test.More.Test.isEq(got, expect, desc);
};

Test.More.isnt = function (got, expect, desc) {
    return Test.More.Test.isntEq(got, expect, desc);
};

Test.More.like = function (val, regex, desc) {
    return Test.More.Test.like(val, regex, desc);
};

Test.More.unlike = function (val, regex, desc) {
    return Test.More.Test.unlike(val, regex, desc);
};

Test.More.cmpOK = function (got, op, expect, desc) {
    return Test.More.Test.cmpOK(got, op, expect, desc);
};

Test.More.canOK = function (proto) {
    var ok;
    // Make sure they passed some method names for us to check.
    if (!arguments.length > 1) {
        ok = Test.More.Test.ok(false, clas + '.can(...)');
        Test.More.Test.diag('    canOK() called with no methods');
        return ok;
    }

    // Get the class name and the prototype.
    var clas;
    if (typeof proto == 'string') {
        // We just have a class name.
        clas = proto;
        proto = eval(clas + '.prototype');
    } else {
        // We have an object or something that can be converted to an object.
        clas = Test.Builder.typeOf(proto);
        proto = proto.constructor.prototype;
    }

    var nok = [];
    for (var i = 1; i < arguments.length; i++) {
        var method = arguments[i];
        if (typeof proto[method] != 'function') nok.push(method);
    }

    // There'es no can() method in JavaScript, but what the hell!
    var desc = clas + ".can('" + (arguments.length == 2 ? arguments[1] : '...') + "')";
    ok = Test.More.Test.ok(!nok.length, desc);
    for (var i = 0; i < nok.length; i++) {
        Test.More.Test.diag('    ' + clas + ".can('" + nok[i] + "') failed");
    }
    return ok;
};

Test.More.isaOK = function (object, clas, objName) {
    var mesg;
    if (objName == null) objName = 'The object';
    var name = objName + ' isa ' + clas;
    if (object == null) {
        mesg = objName + " isn't defined";
    } else if (!Test.More._isRef(object)) {
        mesg = objName + " isn't a reference";
    } else {
        var ctor = eval(clas);
        if (Object.isPrototypeOf) {
            // With JavaScript 1.5, we can determine inheritance.
            if (!ctor.prototype.isPrototypeOf(object)) {
                mesg = objName + " isn't a '" + clas + "' it's a '"
                  + Test.Builder.typeOf(object) + "'";
            }
        } else {
            // We can just determine what constructor was used. This will
            // not work for inherited constructors.
            if (object.constructor != ctor)
                mesg = objName + " isn't a '" + clas + "' it's a '"
                  + Test.Builder.typeOf(object) + '"';
        }
    }
    
    var ok;
    if (mesg) {
        ok = Test.More.Test.ok(false, name);
        Test.More.Test.diag('    ' + mesg);
    } else {
        ok = Test.More.Test.ok(true, name);
    }

    return ok;
};

Test.More.pass = function (name) {
    return Test.More.Test.ok(true, name);
};

Test.More.fail = function (name) {
    return Test.More.Test.ok(false, name);
};

Test.More.diag = function () {
    if (!Test.More.ShowDiag) return;
    return Test.More.Test.diag.apply(Test.More.Test, arguments);
};

// Use this instead of use_ok and require_ok.
Test.More.loadOK = function () {
    // XXX What do I do here? Eval?
    // XXX Just always fail for now, to keep people from using it just yet.
    return false;
};

Test.More.skip = function (why, howMany) {
    if (howMany == null) {
        if (!Test.Builder.NoPlan)
            Test.More.Test.warn("skip() needs to know howMany tests are in the block");
        howMany = 1;
    }
    for (i = 0; i < howMany; i++) {
        Test.More.Test.skip(why);
    }
};

Test.More.todo = function (why, howMany) {
    if (howMany == null) {
        if (!Test.Builder.NoPlan)
            Test.More.Test.warn("todo() needs to know howMany tests are in the block");
        howMany = 1;
    }
    return Test.More.Test.todo(why, howMany);
};

Test.More.todoSkip = function (why, howMany) {
    if (howMany == null) {
        if (!Test.Builder.NoPlan)
            Test.More.Test.warn("todoSkip() needs to know howMany tests are in the block");
        howMany = 1;
    }

    for (i = 0; i < howMany; i++) {
        Test.More.Test.todoSkip(why);
    }
};

Test.More.skipRest = function (why) {
    Test.More.Test.skipRest(why);
};

Test.More.isDeeply = function (it, as, name) {
    if (arguments.length != 2 && arguments.length != 3) {
        Test.More.Test.warn(
            'isDeeply() takes two or three args, you gave '
            + arguments.length + "."
        );
    }

    var ok;
    // ^ is the XOR operator.
    if (Test.More._isRef(it) ^ Test.More._isRef(as)) {
        // One's a reference, one isn't.
        ok = false;
    } else if (!Test.More._isRef(it) && !Test.More._isRef(as)) {
        // Neither is an object.
        ok = Test.More.Test.isEq(it, as, name);
    } else {
        // We have two objects. Do a deep comparison.
        var stack = [], seen = [];
        if ( Test.More._deepCheck(it, as, stack, seen)) {
            ok = Test.More.Test.ok(true, name);
        } else {
            ok = Test.More.Test.ok(false, name);
            Test.More.Test.diag(Test.More._formatStack(stack));
        }
    }
    return ok;
};

Test.More._deepCheck = function (e1, e2, stack, seen) {
    var ok = false;
    // Either they're both references or both not.
    var sameRef = !(!Test.More._isRef(e1) ^ !Test.More._isRef(e2));
    if (e1 == null && e2 == null) {
        ok = true;
    } else if (e1 != null ^ e2 != null) {
        ok = false;
    } else if (e1 == Test.More.DNE ^ e2 == Test.More.DNE) {
        ok = false;
    } else if (sameRef && e1 == e2) {
        // Handles primitives and any variables that reference the same
        // object, including functions.
        ok = true;
    } else if (isa(e1, 'Array') && isa(e2, 'Array')) {
        ok = Test.More._eqArray(e1, e2, stack, seen);
    } else if (typeof e1 == "object" && typeof e2 == "object") {
        ok = Test.More._eqAssoc(e1, e2, stack, seen);
    } else {
        // If we get here, they're not the same (function references must
        // always simply rererence the same function).
        stack.push({ vals: [e1, e2] });
        ok = false;
    }
    return ok;
};

Test.More._isRef = function (object) {
    var type = typeof object;
    return type == 'object' || type == 'function';
};

Test.More._formatStack = function (stack) {
    var variable = '$Foo';
    for (var i = 0; i < stack.length; i++) {
        var entry = stack[i];
        var type = entry['type'];
        var idx = entry['idx'];
        if (idx != null) {
            if (/^\d+$/.test(idx)) {
                // Numeric array index.
                variable += '[' + idx + ']';
            } else {
                // Associative array index.
                idx = idx.replace("'", "\\'");
                variable += "['" + idx + "']";
            }
        }
    }

    var vals = stack[stack.length-1]['vals'].slice(0, 2);
    var vars = [
        variable.replace('$Foo',     'got'),
        variable.replace('$Foo',     'expected')
    ];

    var out = "Structures begin differing at:" + Test.Builder.LF;
    for (var i = 0; i < vals.length; i++) {
        var val = vals[i];
        if (val == null) {
            val = 'undefined';
        } else {
             val == Test.More.DNE ? "Does not exist" : "'" + val + "'";
        }
    }

    out += vars[0] + ' = ' + vals[0] + Test.Builder.LF;
    out += vars[1] + ' = ' + vals[1] + Test.Builder.LF;
    
    return '    ' + out;
};

/* Commented out per suggestion from Michael Schwern. It turned out to be
   confusing to Test::More users because it isn't atually a test. Use
   isDeeply() instead and don't worry about it.

Test.More.eqArray = function (a1, a2) {
    if (!isa(a1, 'Array') || !isa(a2, 'Array')) {
        Test.More.Test.warn("Non-array passed to eqArray()");
        return false;
    }
    return Test.More._eqArray(a1, a2, [], []);
};

*/

Test.More._eqArray = function (a1, a2, stack, seen) {
    // Return if they're the same object.
    if (a1 == a2) return true;

    // JavaScript objects have no unique identifiers, so we have to store
    // references to them all in an array, and then compare the references
    // directly. It's slow, but probably won't be much of an issue in
    // practice. Start by making a local copy of the array to as to avoid
    // confusing a reference seen more than once (such as [a, a]) for a
    // circular reference.
    for (var j = 0; j < seen.length; j++) {
        if (seen[j][0] == a1) {
            return seen[j][1] == a2;
        }
    }

    // If we get here, we haven't seen a1 before, so store it with reference
    // to a2.
    seen.push([ a1, a2 ]);

    var ok = true;
    // Only examines enumerable attributes. Only works for numeric arrays!
    // Associative arrays return 0. So call _eqAssoc() for them, instead.
    var max = a1.length > a2.length ? a1.length : a2.length;
    if (max == 0) return Test.More._eqAssoc(a1, a2, stack, seen);
    for (var i = 0; i < max; i++) {
        var e1 = i > a1.length - 1 ? Test.More.DNE : a1[i];
        var e2 = i > a2.length - 1 ? Test.More.DNE : a2[i];
        stack.push({ type: 'Array', idx: i, vals: [e1, e2] });
        if (ok = Test.More._deepCheck(e1, e2, stack, seen)) {
            stack.pop();
        } else {
            break;
        }
    }
    return ok;
};

/* Commented out per suggestion from Michael Schwern. It turned out to be
   confusing to Test::More users because it isn't atually a test. Use
   isDeeply() instead and don't worry about it.

Test.More.eqHash = function () {
    return eqAssoc.apply(this, arguments);
};

Test.More.eqAssoc = function (o1, o2) {
    if (typeof o1 != "object" || typeof o2 != "object") {
        Test.More.Test.warn("Non-object passed to eqAssoc()");
        return false;
    } else if (   (isa(o1, 'Array') && o1.length > 0)
               || (isa(o2, 'Array') && o2.length > 0))
    {
        Test.More.Test.warn("Ordered array passed to eqAssoc()");
        return false;
    }
    return Test.More._eqAssoc(o1, o2, [], []);
};

*/

Test.More._eqAssoc = function (o1, o2, stack, seen) {
    // Return if they're the same object.
    if (o1 == o2) return true;

    // JavaScript objects have no unique identifiers, so we have to store
    // references to them all in an array, and then compare the references
    // directly. It's slow, but probably won't be much of an issue in
    // practice. Start by making a local copy of the array to as to avoid
    // confusing a reference seen more than once (such as [a, a]) for a
    // circular reference.
    seen = seen.slice(0);
    for (var j = 0; j < seen.length; j++) {
        if (seen[j][0] == o1) {
            return seen[j][1] == o2;
        }
    }

    // If we get here, we haven't seen o1 before, so store it with reference
    // to o2.
    seen.push([ o1, o2 ]);

    // They should be of the same class.

    var ok = true;
    // Only examines enumerable attributes.
    var o1Size = 0; for (var i in o1) o1Size++;
    var o2Size = 0; for (var i in o2) o2Size++;
    var bigger = o1Size > o2Size ? o1 : o2;
    for (var i in bigger) {
        var e1 = o1[i] == undefined ? Test.More.DNE : o1[i];
        var e2 = o2[i] == undefined ? Test.More.DNE : o2[i];
        stack.push({ type: 'Object', idx: i, vals: [e1, e2] });
        if (ok = Test.More._deepCheck(e1, e2, stack, seen)) {
            stack.pop();
        } else {
            break;
        }
    }
    return ok;
};

Test.More._eqSet = function (a1, a2, stack, seen) {
    return Test.More._eqArray(a1.slice(0).sort(), a2.slice(0).sort(), stack, seen);
};

Test.More.isSet = function (a1, a2, desc) {
    var stack = [], seen = [], ok = true;
    if (Test.More._eqSet(a1, a2, stack, seen)) {
        ok = Test.More.Test.ok(true, desc);
    } else {
        ok = Test.More.Test.ok(false, desc);
        Test.More.Test.diag(Test.More._formatStack(stack));
    }
    return ok;
};

Test.More.isa = function (object, clas) {
    return Test.Builder.typeOf(object) == clas;
};

// Handle exporting.
if (typeof JSAN == 'undefined') Test.Builder.exporter(Test.More);
// # $Id: Kinetic.pm 1493 2005-04-07 19:20:18Z theory $

// Set up namespace.
if (typeof self != 'undefined') {
    //Browser
    if (typeof Test == 'undefined') Test = {PLATFORM: 'browser'};
    else Test.PLATFORM = 'browser';
} else if (typeof _player != 'undefined'){
    //Director
    if (typeof _global.Test != "object") _global.Test = {PLATFORM: 'director'};
    else _global.Test.PLATFORM = 'director';
} else {
    throw new Error("Test.Harness does not support your platform");
}

Test.Harness = function () {};
Test.Harness.VERSION = '0.11';
Test.Harness.Done = 0;

// Stoopid IE.
Test.Harness.LF = typeof document != "undefined"
                  && typeof document.all != "undefined"
  ? "\r"
  : "\n";

Test.Harness.prototype.isDone = Test.Harness.isDone;

/*

    bonus           Number of individual todo tests unexpectedly passed
    ran             Number of individual tests ran
    ok              Number of individual tests passed
    subSkipped      Number of individual tests skipped
    todo            Number of individual todo tests

    files           Number of test files ran
    good            Number of test files passed
    bad             Number of test files failed
    tests           Number of test files originally given
    skipped         Number of test files skipped

*/

Test.Harness.prototype.bonus      = 0;
Test.Harness.prototype.ran        = 0;
Test.Harness.prototype.ok         = 0;
Test.Harness.prototype.subSkipped = 0;
Test.Harness.prototype.todo       = 0;
Test.Harness.prototype.files      = 0;
Test.Harness.prototype.good       = 0;
Test.Harness.prototype.bad        = 0;
Test.Harness.prototype.tests      = 0;
Test.Harness.prototype.skipped    = 0;
Test.Harness.prototype.failures   = [];

Test.Harness.runTests = function () {
    // XXX Can't handle inheritance, right? Or can we?
    var harness = new Test.Harness();
    harness.runTests.apply(harness, arguments);
};

Test.Harness.prototype.outFileNames = function (files) {
    var len = 0;
    for (var i = 0; i < files.length; i++) {
        if (files[i].length > len) len = files[i].length;
    }
    len += 3;
    var ret = [];
    for (var i = 0; i < files.length; i++) {
        var outName = files[i];
        var add = len - files[i].length;
        // Where is Perl's x operator when I need it??
        for (var j = 0; j < add; j++) {
            outName += '.';
        }
        ret.push(outName);
    }
    return ret;
};

Test.Harness.prototype.outputResults = function (test, file, fn, attrs) {
    this.tests++;
    this.ran += test.TestResults.length;
    var fails = [];
    var track = {
      fn:       file,
      total:    test.expectedTests,
      ok:       0,
      failList: []
    };

    if (test.TestResults.length) {
        this.files++;
        var pass = true;
        for (var i = 0; i < test.TestResults.length; i++) {
            var ok = "ok";
            if (test.TestResults[i].ok) {
                this.ok++;
                track.ok++
                if (test.TestResults[i].type == 'todo') {
                    // Handle unexpected pass.
                    if (test.TestResults[i].actualOK) this.bonus++;
                    this.todo ++;
                } else if (test.TestResults[i].type == 'skip') this.subSkipped++;
            } else {
                if (test.TestResults[i].type == 'todo') {
                    // Expected failure.
                    this.todo++;
                } else {
                    pass = false;
                    track.failList.push(i + 1);
                }
                ok = "not ok"; // XXX Need to handle TODO and TODO Skipped.
            }
            
            if (!pass || attrs.verbose) fn(test.TestResults[i].output);
        }
        
        if (pass) {
            this.good++;
            fn("ok" + Test.Harness.LF);
        } else {
            this.bad++;
            var err = "NOK # Failed ";
            if (track.failList.length == 1) {
                err += "test " + track.failList[0];
            } else {
                err += "tests " + this._failList(track.failList);
            }
            fn(err + " in " + file + Test.Harness.LF);
        }
    } else if (test.SkipAll){
        // All tests skipped.
        this.skipped++;
        this.good++;
        fn("1..0 # Skip 1" + Test.Harness.LF);
    } else {
        // Wha happened? Tests ran, but no results!
        this.files++;
        this.bad++;
        fn("FAILED before any test output arrived" + Test.Harness.LF);
    }
    if (track.failList.length) this.failures.push(track);
};

Test.Harness.prototype._allOK = function () {
    return this.bad == 0 && (this.ran || this.skipped) ? true : false;
};

Test.Harness.prototype.outputSummary = function (fn, time) {
    var bonusmsg = this._bonusmsg();
    var pct;
    if (this._allOK()) {
        fn("All tests successful" + bonusmsg + '.' + Test.Harness.LF);
    } else if (!this.tests) {
        fn("FAILED—no tests were run for some reason." + Test.Harness.LF);
    } else if (!this.ran) {
        var blurb = this.tests == 1 ? "file" : "files";
        fn("FAILED—" + this.tests + " test " + blurb + " could be run, "
           + "alas—no output ever seen." + Test.Harness.LF);
    } else {
        pct = this.good / this.tests * 100;
        var pctOK = 100 * this.ok / this.ran;
        var subpct = (this.ran - this.ok) + "/" + this.ran
          + " subtests failed, " + pctOK.toPrecision(4) + "% okay.";

        if (this.bad) {
            bonusmsg = bonusmsg.replace(/^,?\s*/, '');
            if (bonusmsg) fn(bonusmsg + '.' + Test.Harness.LF);
            fn("Failed " + this.bad + "/" + this.tests + " test scripts, "
               + pct.toPrecision(4) + "% okay. " + subpct + Test.Harness.LF);
        }
        this.formatFailures(fn);
    }

    fn("Files=" + this.tests + ", Tests=" + this.ran + ", " + (time / 1000)
       + " seconds" + Test.Harness.LF);
};

Test.Harness.prototype.formatFailures = function () {
    var table = '';
    var failedStr = "Failed Test";
    var middleStr = " Total Fail  Failed  ";
    var listStr = "List of Failed";
    var cols = 80;

    // Figure out our longest name string for formatting purposes.
    var maxNamelen = failedStr.length;
    for (var i = 0; i < this.failures.length; i++) {
        var len = this.failures[i].length;
        if (len > maxNamelen) maxNamelen = len;
    }

    var listLen = cols - middleStr.length - maxNamelen.length;
    if (listLen < listStr.length) {
        listLen = listStr.length;
        maxNamelen = cols - middleStr.length - listLen;
        if (maxNamelen < failedStr.length) {
            maxNamelen = failedStr.length;
            cols = maxNamelen + middleStr.length + listLen;
        }
    }

    var out = failedStr;
    if (out.length < maxNamelen) {
        for (var j = out.length; j < maxNameLength; j++) {
            out += ' ';
        }
    }
    out += '  ' + middleStr;
    // XXX Need to finish implementing the text-only version of the failures
    // table.
};

Test.Harness.prototype._bonusmsg = function () {
    var bonusmsg = '';
    if (this.bonus) {
        bonusmsg = (" (" + this.bonus + " subtest" + (this.bonus > 1 ? 's' : '')
          + " UNEXPECTEDLY SUCCEEDED)");
    }

    if (this.skipped) {
        bonusmsg += ", " + this.skipped + " test"
          + (this.skipped != 1 ? 's' : '');
        if (this.subSkipped) {
            bonusmsg += " and " + this.subSkipped + " subtest"
              + (this.subSkipped != 1 ? 's' : '');
        }
        bonusmsg += ' skipped';
    } else if (this.subSkipped) {
        bonusmsg += ", " + this.subSkipped + " subtest"
          + (this.subSkipped != 1 ? 's' : '') + " skipped";
    }

    return bonusmsg;
}

Test.Harness.prototype._failList = function (fails) {
    var last = -1;
    var dash = '';
    var list = [];
    for (var i = 0; i < fails.length; i++) {
        if (dash) {
            // We're in a series of numbers.
            if (fails[i] - 1 == last) {
                // We're still in it.
                last = fails[i];
            } else {
                // End of the line.
                list[list.length-1] += dash + last;
                last = -1;
                list.push(fails[i]);
                dash = '';
            }
        } else if (fails[i] - 1 == last) {
            // We're in a new series.
            last = fails[i];
            dash = '-';
        } else {
            // Not in a sequence.
            list.push(fails[i]);
            last = fails[i];
        }
    }
    if (dash) list[list.length-1] += dash + last;
    return list.join(' ');
}
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

Test.Harness.Browser.prototype._setupFrame = function () {
    // Setup the iFrame to run the tests.
    var node = document.getElementById('buffer');
    if (node) return node.contentWindow;
    node = document.createElement("iframe");
    node.setAttribute("id", "buffer");
    node.setAttribute("name", "buffer");
    // Safari makes it impossible to do anything with the iframe if it's set
    // to display:none. See:
    // http://www.quirksmode.org/bugreports/archives/2005/02/hidden_iframes.html
    if (/Safari/.test(navigator.userAgent)) {
        node.style.visibility = "hidden";
        node.style.height = "0"; 
        node.style.width = "0";
    } else
        node.style.display = "none";
    document.body.appendChild(node);
    return node.contentWindow;
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
    node.setAttribute("style", "white-space:pre; font-family: Verdana,Arial,serif;");
    document.body.appendChild(node);
    return function (msg) {
        node.appendChild(document.createTextNode(msg));
        window.scrollTo(0, document.body.offsetHeight
                        || document.body.scrollHeight);
    };
};

Test.Harness.Browser.prototype.runTests = function () {
    var files = this.args.file
      ? typeof this.args.file == 'string' ? [this.args.file] : this.args.file
      : arguments;
    if (!files.length) return;
    var outfiles = this.outFileNames(files);
    var buffer = this._setupFrame();
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
            buffer.location.href = files[ti];
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
    buffer.location.href = files[ti]; // replace() doesn't seem to work.
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
