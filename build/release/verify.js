"use strict";

const { validBlogUrl } = require( "./validBlogUrl" );
const { argv } = require( "process" );

const version = argv[ 2 ];
const blogUrl = argv[ 3 ];

validBlogUrl( version, blogUrl );
