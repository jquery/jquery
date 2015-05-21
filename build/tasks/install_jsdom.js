module.exports = function( grunt ) {
	grunt.registerTask( "jsdom", function() {
		var current,
			pkg = grunt.config( "pkg" ),
			version = pkg.jsdomVersions[

				// Unfortunately, this is currently the only
				// way to tell the difference between Node and iojs
				/^v0/.test( process.version ) ? "node" : "iojs"
			];

		try {
			current = require( "jsdom/package.json" ).version;
			if ( current === version ) {
				return;
			}
		} catch ( e ) {}

		// Use npm on the command-line
		// There is no local npm
		grunt.util.spawn( {
			cmd: "npm",
			args: [ "install", "jsdom@" + version ],
			opts: { stdio: "inherit" }
		}, this.async() );
	});
};
