// # $Id: Kinetic.pm 1493 2005-04-07 19:20:18Z theory $
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
