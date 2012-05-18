// Resources
// https://gist.github.com/2489540

/*global config:true, task:true*/
module.exports = function( grunt ) {

	var task = grunt.task;
	var file = grunt.file;
	var utils = grunt.utils;
	var log = grunt.log;
	var verbose = grunt.verbose;
	var fail = grunt.fail;
	var option = grunt.option;
	var config = grunt.config;
	var template = grunt.template;

	grunt.initConfig({
		pkg: "<json:package.json>",
		meta: {
			banner: "/*! jQuery v@<%= pkg.version %> jquery.com | jquery.org/license */"
		},
		compare_size: {
			files: [
				"dist/jquery.js",
				"dist/jquery.min.js"
			]
		},
		selector: {
			"src/selector.js": [
				"src/sizzle-jquery.js",
				"src/sizzle/sizzle.js"
			]
		},
		build: {
			"dist/jquery.js": [
				"src/intro.js",
				"src/core.js",
				"src/callbacks.js",
				"src/deferred.js",
				"src/support.js",
				"src/data.js",
				"src/queue.js",
				"src/attributes.js",
				"src/event.js",
				"src/selector.js",
				"src/traversing.js",
				"src/manipulation.js",
				"src/css.js",
				"src/ajax.js",
				"src/ajax/jsonp.js",
				"src/ajax/script.js",
				"src/ajax/xhr.js",
				"src/effects.js",
				"src/offset.js",
				"src/dimensions.js",
				"src/exports.js",
				"src/outro.js"
			]
		},
		min: {
			"dist/jquery.min.js": [ "<banner>", "dist/jquery.js" ]
		},
		lint: {
			files: [ "grunt.js", "dist/jquery.js" ]
		},
		qunit: {
			files: "test/index.html"
		},
		watch: {
			files: "<config:lint.files>",
			tasks: "concat lint"
		},
		jshint: {
			options: {
				evil: true,
				browser: true,
				wsh: true,
				eqnull: true,
				expr: true,
				curly: true,
				trailing: true,
				undef: true,
				smarttabs: true,
				predef: [
					"define",
					"DOMParser",
					"WebKitPoint",
					"__dirname"
				],
				maxerr: 100
			},
			globals: {
				jQuery: true,
				global: true,
				module: true,
				exports: true,
				require: true,
				file: true,
				log: true,
				console: true
			}
		},
		uglify: {}
	});

	// Default grunt.
	grunt.registerTask( "default", "selector build lint min compare_size" );

	grunt.loadNpmTasks("grunt-compare-size");

	grunt.registerTask( "testswarm", function( commit, configFile ) {
		var testswarm = require( "testswarm" ),
			testUrls = [];
		var tests = "ajax attributes callbacks core css data deferred dimensions effects event manipulation offset queue selector support traversing".split( " " );
		tests.forEach(function( test ) {
			testUrls.push( "http://swarm.jquery.org/git/jquery/" + commit + "/test/index.html?filter=" + test );
		});
		testswarm({
			url: "http://swarm.jquery.org/",
			pollInterval: 10000,
			timeout: 1000 * 60 * 30,
			done: this.async()
		}, {
			authUsername: "jquery",
			authToken: grunt.file.readJSON( configFile ).jquery.authToken,
			jobName: 'jQuery commit #<a href="https://github.com/jquery/jquery/commit/' + commit + '">' + commit.substr( 0, 10 ) + '</a>',
			runMax: 4,
			"runNames[]": tests,
			"runUrls[]": testUrls,
			"browserSets[]": ["popular"]
		});
	});

	// Build src/selector.js
	grunt.registerMultiTask( "selector", "Build src/selector.js", function() {

		var name = this.file.dest,
				files = this.file.src,
				sizzle = {
					api: file.read( files[0] ),
					src: file.read( files[1] )
				},
				compiled;

		// sizzle-jquery.js -> sizzle after "EXPOSE", replace window.Sizzle
		compiled = sizzle.src.replace( "window.Sizzle = Sizzle;", sizzle.api );
		verbose.write("Injected sizzle-jquery.js into sizzle.js");

		// Write concatenated source to file
		file.write( name, compiled );

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

		// Otherwise, print a success message.
		log.writeln( "File '" + name + "' created." );
	});


	// Special concat/build task to handle various jQuery build requirements
	grunt.registerMultiTask( "build", "Concatenate source, embed date/version", function() {
		// Concat specified files.
		var compiled = "",
				name = this.file.dest;

		this.file.src.forEach(function( filepath ) {
			compiled += file.read( filepath ).replace( /.function..jQuery...\{/g, "" ).replace( /\}...jQuery..;/g, "" );
		});

		// Embed Date
		// Embed Version
		compiled = compiled.replace( "@DATE", new Date() )
									.replace( "@VERSION", config("pkg.version") );

		// Write concatenated source to file
		file.write( name, compiled );

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

		// Otherwise, print a success message.
		log.writeln( "File '" + name + "' created." );
	});
};
