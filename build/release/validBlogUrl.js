const rblog = /^https:\/\/blog\.jquery\.com/;

/**
 * Blog URLs are required for all releases,
 * even pre-releases.
 */
export default function validBlogUrl( blogUrl ) {
	return rblog.test( blogUrl );
}
