
/* 
 *************************************
 * <!-- Accordion Background Images -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.ACCORDION_BG               = APP.ACCORDION_BG || {};
	APP.ACCORDION_BG.version       = '0.0.4';
    APP.ACCORDION_BG.documentReady = function( $ ) {
		
		
        var $window      = $( window ),
		    windowWidth  = $window.width(),
		    windowHeight = $window.height();
		
		
		if ( windowWidth <= 768 ) return false;
		
		
		$( '.uix-accordion-img' ).each( function() {
			var $this           = $( this ),
				aEvent          = $this.data( 'event' ),
				outReset        = $this.data( 'out-reset' ),
				widthShow       = $this.data( 'width-show' ),
				closeBtn        = $this.data( 'close-btn' ),
				$li             = $this.find( 'ul' ).children( 'li' ),
				total           = $li.length;
			
			
			
			
			if( typeof aEvent === typeof undefined ) {
				aEvent = 'click';
			}	
			
			if( typeof outReset === typeof undefined ) {
				outReset = true;
			}	
			
			if( typeof widthShow === typeof undefined ) {
				widthShow = '60%';
			}		
			
			//Initialize the width of each item
			itemInit();
			
			

			$li.on( aEvent, function( e ) {
				//Prevents further propagation of the current event in the capturing and bubbling phases.
				e.stopPropagation();
			
				
				//Apply click method to outer div but not inner div
				if ( e.target.className == 'uix-accordion-img__content' ) {
					
					if ( $( this ).hasClass( 'active' ) ) {
						$( this ).addClass( 'active' );

					} else {
						
						$li.addClass( 'sub-active' );
						$( this ).addClass( 'active' );
						$( this ).siblings().removeClass( 'active' );

						$li.css( 'width', ( 100 - parseFloat( widthShow ) )/(total - 1) + '%' );
						$( this ).css( 'width', widthShow );

					}	
				}
			
			}); 
			
			if ( outReset ) {
				$this.on( 'mouseleave', function( e ) {
					itemInit();
				}); 	
			}
			
			if( typeof closeBtn != typeof undefined && closeBtn != false && closeBtn != '' ) {
				$( closeBtn ).on( 'click', function( e ) {
					e.preventDefault();
					itemInit();
				}); 		
				
			}	
			
			
	
			/*
			 * Initialize the width of each item
			 *
			 * @return {void}             - The constructor.
			 */
			function itemInit() {
				$li.removeClass( 'active sub-active' ).css( 'width', 100/total + '%' );
			}
			
			
			
		});
		
	
		
    };

    APP.components.documentReady.push( APP.ACCORDION_BG.documentReady );
    return APP;

}( APP, jQuery, window, document ) );



