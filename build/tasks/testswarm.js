module.exports = function( grunt ) {

	"use strict";

	grunt.registerTask( "testswarm", function( commit, configFile ) {
		var jobName,
			testswarm = require( "testswarm" ),
			runs = {},
			done = this.async(),
			pull = /PR-(\d+)/.exec( commit ),
			config = grunt.file.readJSON( configFile ).jquery,
			tests = grunt.config([ this.name, "tests" ]);

		if ( pull ) {
			jobName = "Pull <a href='https://github.com/jquery/jquery/pull/" +
				pull[ 1 ] + "'>#" + pull[ 1 ] + "</a>";
		} else {
			jobName = "Commit <a href='https://github.com/jquery/jquery/commit/" +
				commit + "'>" + commit.substr( 0, 10 ) + "</a>";
		}

		tests.forEach(function( test ) {
			runs[ test ] = config.testUrl + commit + "/test/index.html?module=" + test;
		});

		testswarm.createClient( {
			url: config.swarmUrl,
			pollInterval: 10000,
			timeout: 1000 * 60 * 30
		} )
		.addReporter( testswarm.reporters.cli )
		.auth( {
			id: config.authUsername,
			token: config.authToken
		})
		.addjob(
			{
				name: jobName,
				runs: runs,
				runMax: config.runMax,
				browserSets: "popular-no-old-ie"
			}, function( err, passed ) {
				if ( err ) {
					grunt.log.error( err );
				}
				done( passed );
			}
		);
	});
};
