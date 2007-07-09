// Init
load("build/runtest/env.js");

window.location = "test/index.html";

window.onload = function(){
    // Load the test runner
    load("dist/jquery.js","build/runtest/testrunner.js");
    
    // Load the tests
    load(
        "src/jquery/coreTest.js",
        "src/selector/selectorTest.js",
        "src/event/eventTest.js",
        "src/fx/fxTest.js"
        //"src/ajax/ajaxTest.js"
    );
    
    // Display the results
    results();
};