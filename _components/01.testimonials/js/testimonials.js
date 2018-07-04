/* 
 *************************************
 * <!-- Testimonials Carousel -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.TESTIMONIALS               = APP.TESTIMONIALS || {};
	APP.TESTIMONIALS.version       = '0.0.1';
    APP.TESTIMONIALS.documentReady = function( $ ) {

		var $obj                 = $( '.uix-testimonials .flexslider' ),
			testimonialsControls = '';
		
		
		for ( var i = 0; i < $obj.find( '.slides > li' ).length; i++ ) {
			testimonialsControls += '<li></li>';
		}
		$( '.uix-testimonials__controls' ).html( testimonialsControls );
    	
		
		
		$obj.flexslider({
			animation         : 'slide',
			slideshow         : true,
			smoothHeight      : true,
			controlNav        : true,
			manualControls    : '.uix-testimonials__controls li',
			directionNav      : false,
			animationSpeed    : 600,
			slideshowSpeed    : 7000,
			selector          : ".slides > li",
			start: function(slider){
				$obj.on( 'mousedown', function( e ) {
					if ( $obj.data( 'flexslider' ).animating ) {
						return;
					}
						
					$( this ).addClass('dragging');
					$( this ).data( 'origin_offset_x', parseInt( $( this ).css( 'margin-left' ) ) );
					$( this ).data( 'origin_offset_y', parseInt( $( this ).css( 'margin-top' ) ) );
					$( this ).data( 'origin_mouse_x', parseInt( e.pageX ) );
					$( this ).data( 'origin_mouse_y', parseInt( e.pageY ) );
				} );
			
				$obj.on( 'mouseup', function( e ) {
					if ( $obj.data('flexslider').animating ) {
						return;
					}
						
					$( this ).removeClass('dragging');
					var origin_mouse_x = $( this ).data( 'origin_mouse_x' ),
					    origin_mouse_y = $( this ).data( 'origin_mouse_y' );
					
					if ( 'horizontal' === $obj.data('flexslider').vars.direction ) {
						if ( e.pageX > origin_mouse_x ) {
							$obj.flexslider('prev');
						}
						if ( e.pageX < origin_mouse_x ) {
							$obj.flexslider('next');
						}
					} else {
						if ( e.pageY > origin_mouse_y ) {
							$obj.flexslider('prev');
						}
						if ( e.pageY < origin_mouse_y ) {
							$obj.flexslider('next');
						}
					}
				} );
				
				
				$( '.uix-testimonials__count .total' ).text( '0' + slider.count );
				$( '.uix-testimonials__count .cur' ).text( '0' + parseFloat( slider.currentSlide + 1 ) );
				
			},
			after: function(slider){
				
				$( '.uix-testimonials__count .total' ).text( '0' + slider.count );
				$( '.uix-testimonials__count .cur' ).text( '0' + parseFloat( slider.currentSlide + 1 ) );
				
			}
		});
		
		
    };

    APP.components.documentReady.push( APP.TESTIMONIALS.documentReady );
    return APP;

}( APP, jQuery, window, document ) );




