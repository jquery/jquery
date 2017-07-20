QUnit.test( "addClass(), removeClass(), toggleClass() test", function( assert ) {
    var $elem = jQuery( "<div id='TestDIV'></div>" );

    function testAddClass() {
        assert.ok( $elem.hasClass( "Class1" ), "Element has Class1" );
        assert.ok( $elem.hasClass( "Class2" ), "Element has Class2" );
        assert.ok( $elem.hasClass( "Class3" ), "Element has Class3" );
        assert.ok( $elem.hasClass( "Class4" ), "Element has Class4" );
    }

    function testRemoveClass() {
        assert.notOk( $elem.hasClass( "Class1" ), "Element does not have Class1" );
        assert.notOk( $elem.hasClass( "Class2" ), "Element does not have Class2" );
        assert.notOk( $elem.hasClass( "Class3" ), "Element does not have Class3" );
        assert.notOk( $elem.hasClass( "Class4" ), "Element does not have Class4" );
    }

    $elem.addClass( [ "Class1", "Class2", "Class3 Class4" ] );
    testAddClass();
    $elem.removeClass( [ "Class1", "Class2", "Class3 Class4" ] );
    testRemoveClass();

    $elem.addClass( "Class1" );
    testAddClass();
    $elem.addClass( "Class2" );
    testAddClass();
    $elem.addClass( "Class3 Class4" );
    testAddClass();
    $elem.removeClass( "Class1" );
    testRemoveClass();
    $elem.removeClass( "Class2" );
    testRemoveClass();
    $elem.removeClass( "Class3 Class4" );
    testRemoveClass();

    $elem.addClass( [ "Class1" ] );
    testAddClass();
    $elem.addClass( [ "Class2" ] );
    testAddClass();
    $elem.addClass( [ "Class3 Class4" ] );
    testAddClass();
    $elem.removeClass( [ "Class1" ] );
    testRemoveClass();
    $elem.removeClass( [ "Class2" ] );
    testRemoveClass();
    $elem.removeClass( [ "Class3 Class4" ] );
    testRemoveClass();

    $elem.toggleClass( false );
    testRemoveClass();
    $elem.toggleClass( true );
    testAddClass();
} );
