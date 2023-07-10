"use strict";

const fs = require( "fs" );
const shell = require( "shelljs" );
const path = require( "path" );
const os = require( "os" );

const cdnFolderContainer = "dist/cdn";
const cdnFolderVersioned = `${ cdnFolderContainer }/versioned`;
const cdnFolderUnversioned = `${ cdnFolderContainer }/unversioned`;

const versionedReleaseFiles = {
	"jquery-@VER.js": "dist/jquery.js",
	"jquery-@VER.min.js": "dist/jquery.min.js",
	"jquery-@VER.min.map": "dist/jquery.min.map",
	"jquery-@VER.slim.js": "dist/jquery.slim.js",
	"jquery-@VER.slim.min.js": "dist/jquery.slim.min.js",
	"jquery-@VER.slim.min.map": "dist/jquery.slim.min.map",
	"jquery-@VER.module.js": "dist-module/jquery.module.js",
	"jquery-@VER.module.min.js": "dist-module/jquery.module.min.js",
	"jquery-@VER.module.min.map": "dist-module/jquery.module.min.map",
	"jquery-@VER.slim.module.js": "dist-module/jquery.slim.module.js",
	"jquery-@VER.slim.module.min.js": "dist-module/jquery.slim.module.min.js",
	"jquery-@VER.slim.module.min.map": "dist-module/jquery.slim.module.min.map"
};

const unversionedReleaseFiles = {
	"jquery.js": "dist/jquery.js",
	"jquery.min.js": "dist/jquery.min.js",
	"jquery.min.map": "dist/jquery.min.map",
	"jquery.slim.js": "dist/jquery.slim.js",
	"jquery.slim.min.js": "dist/jquery.slim.min.js",
	"jquery.slim.min.map": "dist/jquery.slim.min.map",
	"jquery.module.js": "dist-module/jquery.module.js",
	"jquery.module.min.js": "dist-module/jquery.module.min.js",
	"jquery.module.min.map": "dist-module/jquery.module.min.map",
	"jquery.slim.module.js": "dist-module/jquery.slim.module.js",
	"jquery.slim.module.min.js": "dist-module/jquery.slim.module.min.js",
	"jquery.slim.module.min.map": "dist-module/jquery.slim.module.min.map"
};

/**
 * Generates copies for the CDNs
 */
function makeReleaseCopies( Release ) {
	[
		{ filesMap: versionedReleaseFiles, cdnFolder: cdnFolderVersioned },
		{ filesMap: unversionedReleaseFiles, cdnFolder: cdnFolderUnversioned }
	].forEach( ( { filesMap, cdnFolder } ) => {
		shell.mkdir( "-p", cdnFolder );

		Object.keys( filesMap ).forEach( key => {
			let text;
			const builtFile = filesMap[ key ];
			const unpathedFile = key.replace( /@VER/g, Release.newVersion );
			const releaseFile = cdnFolder + "/" + unpathedFile;

			if ( /\.map$/.test( releaseFile ) ) {

				// Map files need to reference the new uncompressed name;
				// assume that all files reside in the same directory.
				// "file":"jquery.min.js" ... "sources":["jquery.js"]
				text = fs.readFileSync( builtFile, "utf8" )
					.replace( /"file":"([^"]+)"/,
						"\"file\":\"" + unpathedFile.replace( /\.min\.map/, ".min.js\"" ) )
					.replace( /"sources":\["([^"]+)"\]/,
						"\"sources\":[\"" + unpathedFile.replace( /\.min\.map/, ".js" ) + "\"]" );
				fs.writeFileSync( releaseFile, text );
			} else if ( builtFile !== releaseFile ) {
				shell.cp( "-f", builtFile, releaseFile );
			}
		} );

	} );
}

async function makeArchives( Release ) {

	Release.chdir( Release.dir.repo );

	async function makeArchive( { cdn, filesMap, cdnFolder } ) {
		return new Promise( ( resolve, reject ) => {
			if ( Release.preRelease ) {
				console.log( "Skipping archive creation for " + cdn + "; this is a beta release." );
				resolve();
				return;
			}

			console.log( "Creating production archive for " + cdn );

			let i, sum, result;
			const archiver = require( "archiver" )( "zip" );
			const md5file = cdnFolder + "/" + cdn + "-md5.txt";
			const output = fs.createWriteStream(
				cdnFolder + "/" + cdn + "-jquery-" + Release.newVersion + ".zip"
			);
			const rmd5 = /[a-f0-9]{32}/;
			const rver = /@VER/;

			output.on( "close", resolve );

			output.on( "error", err => {
				reject( err );
			} );

			archiver.pipe( output );

			let finalFilesMap = Object.create( null );
			for ( const [ releaseFile, builtFile ] of Object.entries( filesMap ) ) {
				finalFilesMap[ releaseFile.replace( rver, Release.newVersion ) ] = builtFile;
			}

			const files = Object
				.keys( filesMap )
				.map( item => `${ cdnFolder }/${
					item.replace( rver, Release.newVersion )
				}` );

			if ( os.platform() === "win32" ) {
				sum = [];
				for ( i = 0; i < files.length; i++ ) {
					result = Release.exec(
						"certutil -hashfile " + files[ i ] + " MD5", "Error retrieving md5sum"
					);
					sum.push( rmd5.exec( result )[ 0 ] + " " + files[ i ] );
				}
				sum = sum.join( "\n" );
			} else {
				sum = Release.exec( "md5 -r " + files.join( " " ), "Error retrieving md5sum" );
			}
			fs.writeFileSync( md5file, sum );
			files.push( md5file );

			files.forEach( file => {
				archiver.append( fs.createReadStream( file ),
					{ name: path.basename( file ) } );
			} );

			archiver.finalize();
		} );
	}

	async function buildGoogleCDN() {
		await makeArchive( {
			cdn: "googlecdn",
			filesMap: unversionedReleaseFiles,
			cdnFolder: cdnFolderUnversioned
		} );
	}

	async function buildMicrosoftCDN() {
		await makeArchive( {
			cdn: "mscdn",
			filesMap: versionedReleaseFiles,
			cdnFolder: cdnFolderVersioned
		} );
	}

	await buildGoogleCDN();
	await buildMicrosoftCDN();
}

module.exports = {
	makeReleaseCopies: makeReleaseCopies,
	makeArchives: makeArchives
};
