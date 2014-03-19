module.exports = function( grunt ) {

	"use strict";

	grunt.registerTask( "testswarm", function( commit, configFile, projectName ) {
		var jobName, config, tests,
			testswarm = require( "testswarm" ),
			runs = {},
			done = this.async(),
			pull = /PR-(\d+)/.exec( commit );

		projectName = projectName || "jquery";
		config = grunt.file.readJSON( configFile )[ projectName ];
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

		testswarm.createClient({
			url: config.swarmUrl
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
				browserSets: projectName === "jqueryweekly" ?
					"weekly-no-old-ie" :
					[ "popular-no-old-ie", "ios" ],
				timeout: projectName === "jqueryweekly" ? 1000 * 60 * 60 : 1000 * 60 * 30
			}, function( err, passed ) {
				if ( err ) {
					grunt.log.error( err );
				}
				done( passed );
			}
		);
	});
};
