"use strict";

const rblog = /^https:\/\/blog.jquery.com/;

exports.validBlogUrl = function validBlogUrl( version, blogUrl ) {
	if ( !version ) {
		throw new Error( "No version specified" );
	}

	const validBlogUrl = rblog.test( blogUrl );

	// Require a blog URL for releases that are not beta/alpha/rc
	if ( /^\d+\.\d+\.\d+$/.test( version ) && !validBlogUrl ) {
		throw new Error( "Invalid blog URL" );
	}

	return validBlogUrl;
};
