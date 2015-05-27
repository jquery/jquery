define([
    "./core",
], function( jQuery ) {

    /**
     * some url properties
     */
    var location = window.location,
        search = location.search.split('?')[1];

    jQuery.extend({
        getSearch: function( key ) {
            var searchObj = {},
                searchArray = [];

            // there is no search in location, return ''
            if (search === undefined) {
                return '';
            }
            searchArray = search.split('&');
            jQuery.each(searchArray, function ( index, item ) {
                item = item.split('=');
                searchObj[item[0]] = item[1];
            })
            // if want to get a specific vaule of key return the value
            // else retun the search Object
            return key !== null ? searchObj[key] : searchObj;
        }
    });
});
