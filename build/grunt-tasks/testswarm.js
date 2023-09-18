"use strict";

module.exports = function( grunt ) {
	grunt.registerTask( "testswarm", function( commit, configFile, projectName, browserSets,
			timeout, testMode ) {
		var jobName, config, tests,
			testswarm = require( "testswarm" ),
			runs = {},
			done = this.async(),
			pull = /PR-(\d+)/.exec( commit );

		projectName = projectName || "jquery";
		config = grunt.file.readJSON( configFile )[ projectName ];
		browserSets = browserSets || config.browserSets;
		if ( browserSets[ 0 ] === "[" ) {

			// We got an array, parse it
			browserSets = JSON.parse( browserSets );
		}
		timeout = timeout || 1000 * 60 * 15;
		tests = grunt.config( [ this.name, "tests" ] );

		if ( pull ) {
			jobName = "Pull <a href='https://github.com/jquery/jquery/pull/" +
				pull[ 1 ] + "'>#" + pull[ 1 ] + "</a>";
		} else {
			jobName = "Commit <a href='https://github.com/jquery/jquery/commit/" +
				commit + "'>" + commit.substr( 0, 10 ) + "</a>";
		}

		if ( testMode === "basic" ) {
			runs.basic = config.testUrl + commit + "/test/index.html?module=basic";
		} else {
			tests.forEach( function( test ) {
				runs[ test ] = config.testUrl + commit + "/test/index.html?module=" + test;
			} );
		}

		testswarm.createClient( {
			url: config.swarmUrl
		} )
		.addReporter( testswarm.reporters.cli )
		.auth( {
			id: config.authUsername,
			token: config.authToken
		} )
		.addjob(
			{
				name: jobName,
				runs: runs,
				runMax: config.runMax,
				browserSets: browserSets,
				timeout: timeout
			}, function( err, passed ) {
				if ( err ) {
					grunt.log.error( err );
				}
				done( passed );
			}
		);
	} );
};
