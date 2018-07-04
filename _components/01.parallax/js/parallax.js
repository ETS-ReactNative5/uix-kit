
/* 
 *************************************
 * <!-- Parallax -->
 *************************************
 */
APP = ( function ( APP, $, window, document ) {
    'use strict';
	
    APP.PARALLAX               = APP.PARALLAX || {};
	APP.PARALLAX.version       = '0.0.3';
    APP.PARALLAX.documentReady = function( $ ) {

        var $window      = $( window ),
		    windowWidth  = $window.width(),
		    windowHeight = $window.height();

        
		//  Initialize
		parallaxInit( windowWidth, windowHeight );
		
		$window.on( 'resize', function() {
			// Check window width has actually changed and it's not just iOS triggering a resize event on scroll
			if ( $window.width() != windowWidth ) {

				// Update the window width for next time
				windowWidth  = $window.width();
				windowHeight = $window.height();

				// Do stuff here
				parallaxInit( windowWidth, windowHeight );
		

			}
		});
		
	
		/*
		 * Initialize parallx settings
		 *
		 * @param  {number} w         - Returns width of browser viewport
		 * @param  {number} h         - Returns height of browser viewport
		 * @return {void}             - The constructor.
		 */
		function parallaxInit( w, h ) {
			
			/* Pure parallax scrolling effect without other embedded HTML elements */
			$( '.uix-parallax--pure-bg' ).each( function() {
				var $this       = $( this ),
					dataImg     = $this.data( 'parallax-bg' ),
					dataSpeed   = $this.data( 'parallax' );
				
				if( typeof dataSpeed === typeof undefined ) {
					dataSpeed = 0;
				}
				
				if( typeof dataImg != typeof undefined && dataImg != '' ) {
					$this.css( 'background-image', 'url('+dataImg+')' );
				}
				
				$window.on( 'scroll touchmove', function() {
					var scrolled = $window.scrollTop();
					$this.css( {
							'margin-top': Math.round( scrolled * dataSpeed ) + 'px',
							'transition': 'none'
						} );
				});	
				
		
			});
			
			
			/* Parallax scrolling effect with embedded HTML elements */
			$( '.uix-parallax' ).each( function() {
				var $this            = $( this ),
					$curImg          = $this.find( '.uix-parallax__img' ),
					dataImg          = $curImg.attr( 'src' ),
					dataSkew         = $this.data( 'skew' ),
					dataSpeed        = $this.data( 'speed' ),
					dataOverlay      = $this.data( 'overlay-bg' ),
					dataFullyVisible = $this.data( 'fully-visible' ),
					dataElSpeed      = $this.find( '.uix-parallax__el' ).data( 'el-speed' ),	
					curImgH          = null,
					curImgW          = null,
					curSize          = 'cover',
				    curAtt           = 'fixed';
				
				
				if( 
					typeof dataOverlay === typeof undefined ||
					dataOverlay == 'none' ||
					dataOverlay == 0 ||
					dataOverlay == false
				  ) {
					dataOverlay = 'rgba(0, 0, 0, 0)';
				}
				
				if( typeof dataSpeed === typeof undefined ) { // If there is no data-xxx, save current source to it
					dataSpeed = 0;
				}	
				
				if( typeof dataElSpeed === typeof undefined ) {
					dataElSpeed = 0;
				}	
				
				if( typeof dataFullyVisible === typeof undefined ) {
					dataFullyVisible = false;
				}	
				
				//Trigger a callback when the selected images are loaded
				//Check if the picture is loaded on the page
				var img    = new Image();
				img.onload = function() {
					
					curImgH = $curImg.height();
					curImgW = $curImg.width();
					
					//Custom height for parallax container
					if ( 
						$this.hasClass( 'uix-height--10' ) || 
						$this.hasClass( 'uix-height--20' ) || 
						$this.hasClass( 'uix-height--30' ) || 
						$this.hasClass( 'uix-height--40' ) || 
						$this.hasClass( 'uix-height--50' ) || 
						$this.hasClass( 'uix-height--60' ) || 
						$this.hasClass( 'uix-height--70' ) || 
						$this.hasClass( 'uix-height--80' ) || 
						$this.hasClass( 'uix-height--90' ) || 
						$this.hasClass( 'uix-height--100' )
					 ) {		

						var newH = $this.height();
						$this.css( {
							'height': newH + 'px'
						} );	
						$curImg.css( 'max-height', newH + 'px' );	
					 } else {
						$this.css( {
							'height': $this.height() + 'px'
						} );	
					 }


					//If the ".uix-v-align--absolute" has more content
					if ( w <= 768 ) {

						if ( $this.find( '.uix-v-align--absolute' ).height() >= curImgH ) {
							$this.find( '.uix-v-align--absolute' ).addClass( 'uix-v-align--relative' );
							$curImg.hide();	
						}

					}


					if ( w > 768 ) {

						//Enable parallax only desktop
						$this.bgParallax( "50%", dataSpeed );


						//Resize the background image to cover the entire container and
						//Resize the background image to make sure the image is fully visible
						if ( curImgW > w ) {
							curSize = 'contain';
						} else {
							curSize = 'cover';
						}

						curAtt = 'fixed';

					} else {
						curSize = 'contain';
						curAtt  = 'scroll';
					}

					//Determine image height and parallax container height
					//If the height is the same, higher or lower than the height of the container height, 
					//be sure to use the cover attribute
					if ( curImgH <= $this.height() ) {
						curSize = 'cover';
					}

					//Whether to display all pictures, including the edges
					if ( dataFullyVisible ) {

						if ( curImgW < w ) {
							curSize = 'cover';
						} else {
							curSize = 'contain';
						}

					}


					//console.log( 'Height: ' +curImgH + '===' + $this.height() + ' | Width: ' + curImgW + '===' + w + ' | ' + curSize );

					//Add background image to parallax container
					if( typeof dataImg != typeof undefined ) {

						if ( Modernizr.cssanimations ) {
							// supported

							$this.css( {
								'background' : 'linear-gradient('+dataOverlay+', '+dataOverlay+'), url(' + dataImg + ') 50% 0/'+curSize+' no-repeat ' + curAtt
							} );
						} else {
							// not-supported

							$this.css( {
								'background' : 'url(' + dataImg + ') 50% 0/'+curSize+' no-repeat ' + curAtt
							} );
						}

					}


					//Apply tilt effect
					if( typeof dataSkew != typeof undefined ) {
						$this.css( {
							'transform'  : 'skew(0deg, '+dataSkew+'deg)'
						} );
					}


					//Embedded parent disparity elements
					if ( $this.find( '.uix-parallax__el' ).length > 0 ) {
						$window.on( 'scroll touchmove', function() {
							var scrolled = $window.scrollTop();
							$this.find( '.uix-parallax__el' ).css( {
								'transform' : 'translateY('+Math.round( ( $this.offset().top - scrolled ) * dataElSpeed )+'px)',
								'transition': 'none'
							} );
						});			
					}
	
					
					
				};
				
				
				img.src = dataImg;
				
			
		
			});
			
		
	
		}	
		
    };

    APP.components.documentReady.push( APP.PARALLAX.documentReady );
    return APP;

}( APP, jQuery, window, document ) );





/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function( $ ){
	var $window = $(window);
	var windowHeight = $window.height();

	$window.resize(function () {
		windowHeight = $window.height();
	});

	$.fn.bgParallax = function(xpos, speedFactor, outerHeight) {
		var $this = $(this);
		var getHeight;
		var firstTop;
		var paddingTop = 0;
		
		//get the starting position of each element to have parallax applied to it		
		$this.each( function(){
		    firstTop = $this.offset().top;
		});

		if (outerHeight) {
			getHeight = function(jqo) {
				return jqo.outerHeight(true);
			};
		} else {
			getHeight = function(jqo) {
				return jqo.height();
			};
		}
			
		// setup defaults if arguments aren't specified
		if (arguments.length < 1 || xpos === null) xpos = "50%";
		if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
		if (arguments.length < 3 || outerHeight === null) outerHeight = true;
		
		// function to be called whenever the window is scrolled or resized
		function update(){
			var pos = $window.scrollTop();				

			$this.each( function(){
				var $element = $(this);
				var top = $element.offset().top;
				var height = getHeight($element);

				// Check if totally above or totally below viewport
				if (top + height < pos || top > pos + windowHeight) {
					return;
				}

				$this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");
			});
		}		

		$window.bind('scroll', update).resize(update);
		update();
	};
})(jQuery);


