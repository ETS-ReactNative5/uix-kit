
/* 
 *************************************
 * <!-- Dropdown Menu -->
 *************************************
 */	
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.DROPDOWN_MENU               = APP.DROPDOWN_MENU || {};
	APP.DROPDOWN_MENU.version       = '0.0.1';
    APP.DROPDOWN_MENU.documentReady = function( $ ) {

		//Create a trigger of Dropdown Menu on Click
		$( '.uix-dropdown-menu' ).each( function() {
			var $this = $( this );

			//Close the target
			$this.find( '> label' ).on( 'click', function( e ) {
				e.preventDefault();
				//Prevents further propagation of the current event in the capturing and bubbling phases.
				e.stopPropagation();

				$this.toggleClass( 'is-opened' );

			});	

			$this.find( 'li a' ).on( 'click', function() {
				$this.removeClass( 'is-opened' );	
				$this.find( 'input[type="hidden"]' ).val( $( this ).data( 'value' ) );
				$this.find( '> label > span' ).html( $( this ).text() );
 
			});		


			$( 'html' ).on( 'click', function() {
				$this.removeClass( 'is-opened' );	
			});		



		});

		
    };

    APP.components.documentReady.push( APP.DROPDOWN_MENU.documentReady );
    return APP;

}( APP, jQuery, window, document ) );


