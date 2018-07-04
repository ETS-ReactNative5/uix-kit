
/* 
 *************************************
 * <!-- 3D Carousel -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP._3D_CAROUSEL               = APP._3D_CAROUSEL || {};
	APP._3D_CAROUSEL.version       = '0.0.1';
    APP._3D_CAROUSEL.documentReady = function( $ ) {

		$( '.uix-3d-carousel' ).each( function() {
			var $this             = $( this ),
				dataTiming        = $this.data( 'timing' ),
				dataPrevBtn       = $this.data( 'prev-btn' ),
				dataNextBtn       = $this.data( 'next-btn' ),
				dataDraggable     = $this.data( 'draggable' ),
			    autoSwap          = null,
				$wrapper          = $this.find( '> ul' ),
				$items            = $wrapper.find( '> li' ),
				items             = [],
				startItem         = 1,
				position          = 0,
				itemCount         = $items.length,
				leftpos           = itemCount,
				resetCount        = itemCount;

			if( typeof dataTiming === typeof undefined ) dataTiming = 5000;
			if( typeof dataPrevBtn === typeof undefined ) dataPrevBtn = ".my-carousel-3d-prev";
			if( typeof dataNextBtn === typeof undefined ) dataNextBtn = ".my-carousel-3d-next";
			if ( typeof dataDraggable === typeof undefined ) dataDraggable = false;
			

			//Avoid problems caused by insufficient quantity
			//-------------------------------------		
			if ( itemCount == 3 ) {
				var $clone3 = $items.eq(1).clone();
				$items.last().after( $clone3 );
			}
			
			if ( itemCount == 2 ) {
				var $clone2_1 = $items.eq(0).clone(),
					$clone2_2 = $items.eq(1).clone();
				$items.last().after( [$clone2_1, $clone2_2 ] );
			}
			
			if ( itemCount == 1 ) {
				var $clone1_1 = $items.eq(0).clone(),
					$clone1_2 = $items.eq(0).clone(),
					$clone1_3 = $items.eq(0).clone();
					
				$items.last().after( [$clone1_1, $clone1_2, $clone1_3 ] );
			}		
			

			//New objects of items and wrapper
			$wrapper  = $this.find( '> ul' );
			$items = $wrapper.find( '> li' );
			itemCount = $items.length;
			leftpos  = itemCount;
			resetCount = itemCount;

			//Adding an index to an element makes it easy to query
			//-------------------------------------	
			$items.each( function( index ) {
				items[index] = $( this ).text();
				$( this ).attr( 'id', index+1 );

			});

			//Pause slideshow and reinstantiate on mouseout
			//-------------------------------------	
			$wrapper.on( 'mouseenter', function() {
				clearInterval( autoSwap );
			} ).on( 'mouseleave' , function() {
				autoSwap = setInterval( itemUpdates, dataTiming );
			} );


			
			//Initialize the default effect
			//-------------------------------------	
			itemUpdates( 'clockwise' );
			
			
			//The matched click events for the element.
			//-------------------------------------	
			$( dataPrevBtn ).on( 'click', function( e ) {
				e.preventDefault();
				itemUpdates( 'clockwise' );
				return false;
				
			});
			$( dataNextBtn ).on( 'click', function( e ) {
				e.preventDefault();
				itemUpdates( 'counter-clockwise' );
				return false;
				
			});
			
			
			$items.on( 'click', function( e ) {
				e.preventDefault();

				if ( $( this ).attr( 'class' ) == 'uix-3d-carousel__item uix-3d-carousel__item--left-pos' ) {
					itemUpdates( 'counter-clockwise' );
				} else {
					itemUpdates( 'clockwise' );
				}
			});


			//Drag and Drop
			//-------------------------------------	
			var $dragDropTrigger = $wrapper;

			//Mouse event
			$dragDropTrigger.on( 'mousedown._3D_CAROUSEL touchstart._3D_CAROUSEL', function( e ) {
				e.preventDefault();

				var touches = e.originalEvent.touches;

				$( this ).addClass( 'dragging' );
				$( this ).data( 'origin_offset_x', parseInt( $( this ).css( 'margin-left' ) ) );
				$( this ).data( 'origin_offset_y', parseInt( $( this ).css( 'margin-top' ) ) );


				if ( touches && touches.length ) {	
					$( this ).data( 'origin_mouse_x', parseInt( touches[0].pageX ) );
					$( this ).data( 'origin_mouse_y', parseInt( touches[0].pageY ) );

				} else {

					if ( dataDraggable ) {
						$( this ).data( 'origin_mouse_x', parseInt( e.pageX ) );
						$( this ).data( 'origin_mouse_y', parseInt( e.pageY ) );	
					}


				}

				$dragDropTrigger.on( 'mouseup._3D_CAROUSEL touchmove._3D_CAROUSEL', function( e ) {
					e.preventDefault();

					$( this ).removeClass( 'dragging' );
					var touches        = e.originalEvent.touches,
						origin_mouse_x = $( this ).data( 'origin_mouse_x' ),
						origin_mouse_y = $( this ).data( 'origin_mouse_y' );

					if ( touches && touches.length ) {

						var deltaX = origin_mouse_x - touches[0].pageX,
							deltaY = origin_mouse_y - touches[0].pageY;

						if ( deltaX >= 50) {
							//--- left
							itemUpdates( 'clockwise' );


						}
						if ( deltaX <= -50) {
							//--- right
							itemUpdates( 'counter-clockwise' );


						}
						if ( deltaY >= 50) {
							//--- up


						}
						if ( deltaY <= -50) {
							//--- down

						}

						if ( Math.abs( deltaX ) >= 50 || Math.abs( deltaY ) >= 50 ) {
							$dragDropTrigger.off( 'touchmove._3D_CAROUSEL' );
						}	


					} else {

						if ( dataDraggable ) {
							//right
							if ( e.pageX > origin_mouse_x ) {
								itemUpdates( 'counter-clockwise' );
							}

							//left
							if ( e.pageX < origin_mouse_x ) {
								itemUpdates( 'clockwise' );
								
							}

							//down
							if ( e.pageY > origin_mouse_y ) {

							}

							//up
							if ( e.pageY < origin_mouse_y ) {

							}	

							$dragDropTrigger.off( 'mouseup._3D_CAROUSEL' );

						}	



					}



				} );




			} );
			

			/*
			 * Swap Between Images
			 *
			 * @param  {string} action           - Direction of movement, optional: clockwise, counter-clockwise
			 * @return {void}                    - The constructor.
			 */
			function itemUpdates( action ) {
				var direction = action;

				//moving carousel backwards
				if ( direction == 'counter-clockwise' ) {
					var leftitem = parseFloat( $wrapper.find( '> li.uix-3d-carousel__item--left-pos' ).attr( 'id' ) - 1 );
					if ( leftitem == 0 ) {
						leftitem = itemCount;
					}

					$wrapper.find( '> li.uix-3d-carousel__item--right-pos' ).removeClass( 'uix-3d-carousel__item--right-pos' ).addClass( 'uix-3d-carousel__item--back-pos' );
					$wrapper.find( '> li.uix-3d-carousel__item--main-pos' ).removeClass( 'uix-3d-carousel__item--main-pos' ).addClass( 'uix-3d-carousel__item--right-pos' );
					$wrapper.find( '> li.uix-3d-carousel__item--left-pos' ).removeClass( 'uix-3d-carousel__item--left-pos' ).addClass( 'uix-3d-carousel__item--main-pos' );
					$wrapper.find( '> li#' + leftitem + '').removeClass( 'uix-3d-carousel__item--back-pos' ).addClass( 'uix-3d-carousel__item--left-pos' );

					startItem--;

					if ( startItem < 1 ) {
						startItem = itemCount;
					}
				}

				//moving carousel forward
				if ( direction == 'clockwise' || direction == '' || direction == null ) {
					var carousel3DPos = function( dir ) {
						if ( dir != 'leftposition' ) {
							//increment image list id
							position++;

							//if final result is greater than image count, reset position.
							if ( startItem + position > resetCount ) {
								position = 1 - startItem;
							}
						}

						//setting the left positioned item
						if (dir == 'leftposition') {
							//left positioned image should always be one left than main positioned image.
							position = startItem - 1;

							//reset last image in list to left position if first image is in main position
							if (position < 1) {
								position = itemCount;
							}
						}

						return position;
					};

					$wrapper.find( '> li#' + startItem + '').removeClass( 'uix-3d-carousel__item--main-pos' ).addClass( 'uix-3d-carousel__item--left-pos' );
					$wrapper.find( '> li#' + (startItem + carousel3DPos()) + '').removeClass( 'uix-3d-carousel__item--right-pos' ).addClass( 'uix-3d-carousel__item--main-pos' );
					$wrapper.find( '> li#' + (startItem + carousel3DPos()) + '').removeClass( 'uix-3d-carousel__item--back-pos' ).addClass( 'uix-3d-carousel__item--right-pos' );
					$wrapper.find( '> li#' + carousel3DPos( 'leftposition' ) + '').removeClass( 'uix-3d-carousel__item--left-pos' ).addClass( 'uix-3d-carousel__item--back-pos' );

					startItem++;
					position = 0;
					if ( startItem > itemCount ) {
						startItem = 1;
					}
				}
			}

			

		});

		
    };

    APP.components.documentReady.push( APP._3D_CAROUSEL.documentReady );
    return APP;

}( APP, jQuery, window, document ) );


