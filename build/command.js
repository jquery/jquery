import yargs from "yargs/yargs";
import { build } from "./tasks/build.js";
import slimExclude from "./tasks/lib/slim-exclude.js";

const argv = yargs( process.argv.slice( 2 ) )
	.version( false )
	.command( {
		command: "[options]",
		describe: "Build a jQuery bundle"
	} )
	.option( "filename", {
		alias: "f",
		type: "string",
		description:
			"Set the filename of the built file. Defaults to jquery.js."
	} )
	.option( "dir", {
		alias: "d",
		type: "string",
		description:
			"Set the dir to which to output the built file. Defaults to /dist."
	} )
	.option( "version", {
		alias: "v",
		type: "string",
		description:
			"Set the version to include in the built file. " +
			"Defaults to the version in package.json plus the " +
			"short commit SHA and any excluded modules."
	} )
	.option( "watch", {
		alias: "w",
		type: "boolean",
		description:
			"Watch the source files and rebuild when they change."
	} )
	.option( "exclude", {
		alias: "e",
		type: "array",
		description:
			"Modules to exclude from the build. " +
			"Specifying this option will cause the " +
			"specified modules to be excluded from the build."
	} )
	.option( "include", {
		alias: "i",
		type: "array",
		description:
			"Modules to include in the build. " +
			"Specifying this option will override the " +
			"default included modules and only include these modules."
	} )
	.option( "esm", {
		type: "boolean",
		description:
			"Build an ES module (ESM) bundle. " +
			"By default, a UMD bundle is built."
	} )
	.option( "factory", {
		type: "boolean",
		description:
			"Build the factory bundle. " +
			"By default, a UMD bundle is built."
	} )
	.option( "slim", {
		alias: "s",
		type: "boolean",
		description: "Build a slim bundle, which excludes " +
			slimExclude.join( ", " )
	} )
	.option( "amd", {
		type: "string",
		description:
			"Set the name of the AMD module. Leave blank to make an anonymous module."
	} )
	.help()
	.argv;

build( argv );
