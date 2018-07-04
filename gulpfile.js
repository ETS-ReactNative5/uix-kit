var gulp              = require('gulp'),
	sass              = require('gulp-sass'),
	concat            = require('gulp-concat'),
	rename            = require('gulp-rename'),
	uglify            = require('gulp-uglify'),
	minifyCss         = require('gulp-minify-css'),
	jshint            = require('gulp-jshint'),
	cssbeautify       = require('gulp-cssbeautify'),
	headerComment     = require('gulp-header-comment'),
	version           = require('gulp-version-number'),
	fileinclude       = require('gulp-file-include'),
	clean             = require('gulp-clean'),
	sourcemaps        = require('gulp-sourcemaps'),
	replace           = require('gulp-replace'),
	webpack           = require('webpack'),
	WebpackDevServer  = require("webpack-dev-server"),
	path              = require("path"),
	fs                = require('fs'),
	json              = JSON.parse(fs.readFileSync('./package.json'));


var globs = {
	phpTar       : 'examples/assets/json/*.php',
	jsTar        : 'examples/assets/js',
	cssTar       : 'examples/assets/css',
	cssRTLTar    : 'examples/assets/css/rtl',
	cleanFilesTar: [ 'examples/include-*.html', '_components/**/scss/*.css', '_components/**/scss-rtl/*.css' ],
	htmlFiles    : '_components/**/*.{html, htm}',
    js           : '_components/**/js/*.js',
    scss         : '_components/**/scss/*.scss', 
	scssRTL      : '_components/**/scss-rtl/*.scss'
};



var customWebsiteVersion     = json.version,
	customWebsiteTitle       = 'Uix Kit Demo',
	customWebsiteDesc        = 'Free Responsive HTML5 UI Kit for Fast Web Design Based On Bootstrap',
	customWebsiteCanonical   = '<link rel="canonical" href="https://uiux.cc" />',
	customWebsiteAuthor      = json.author,
	customWebsiteGenerator   = 'Uix Kit',
	customComment            = `
		## Project Name        :  ` + customWebsiteTitle + `
        ## Project Description :  ` + customWebsiteDesc + `
		## Based on            :  ` + json.description + `
		## Version             :  ` + customWebsiteVersion + `
		## Last Update         :  <%= moment().format( "MMMM D, YYYY" ) %>
        ## Powered by          :  ` + customWebsiteAuthor + `
		## Created by          :  UIUX Lab (https://uiux.cc)
		## Contact Us          :  uiuxlab@gmail.com
		## Compatible With     :  Bootstrap 3.x
		## Released under the MIT license.
	`;





/*! 
 *************************************
 * WebPack configuration
 *************************************
 */

gulp.task('webpack', function(done) {
	
	// webpack configuration	
	var compiler = webpack({
				entry: [
					'webpack/hot/dev-server',
					'webpack-dev-server/client?http://localhost:8080'
				],
				module: {}
		}, function(error) {
			var pluginError;

			if (error) {
				pluginError = new gulpUtil.PluginError('webpack', error);

				if (done) {
					done(pluginError);
				} else {
					gulpUtil.log('[webpack]', pluginError);
				}

				return;
			}

			if (done) {
				done();
			}
	});

	
	module.exports = {
	  devServer: {
		  compress: true,
		  hot: true,
		  proxy: {
			"**": "http://localhost:8080"
		  } 
	  }
	}

	var server = new WebpackDevServer(compiler);
	server.listen(8080, "localhost", function() {});
	// server.close();
	


});


/*! 
 *************************************
 * Automatically add version number to request for preventing browser cache
 *************************************
 */
function base64_encode(str) {
	// Cross-Browser Method (compressed)  
	// Create Base64 Object  
	var Base64 = {
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		encode: function(e) {
			var t = "";
			var n, r, i, s, o, u, a;
			var f = 0;
			e = Base64._utf8_encode(e);
			while (f < e.length) {
				n = e.charCodeAt(f++);
				r = e.charCodeAt(f++);
				i = e.charCodeAt(f++);
				s = n >> 2;
				o = (n & 3) << 4 | r >> 4;
				u = (r & 15) << 2 | i >> 6;
				a = i & 63;
				if (isNaN(r)) {
					u = a = 64
				} else if (isNaN(i)) {
					a = 64
				}
				t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
			}
			return t
		},
		decode: function(e) {
			var t = "";
			var n, r, i;
			var s, o, u, a;
			var f = 0;
			e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (f < e.length) {
				s = this._keyStr.indexOf(e.charAt(f++));
				o = this._keyStr.indexOf(e.charAt(f++));
				u = this._keyStr.indexOf(e.charAt(f++));
				a = this._keyStr.indexOf(e.charAt(f++));
				n = s << 2 | o >> 4;
				r = (o & 15) << 4 | u >> 2;
				i = (u & 3) << 6 | a;
				t = t + String.fromCharCode(n);
				if (u != 64) {
					t = t + String.fromCharCode(r)
				}
				if (a != 64) {
					t = t + String.fromCharCode(i)
				}
			}
			t = Base64._utf8_decode(t);
			return t
		},
		_utf8_encode: function(e) {
			e = e.replace(/\r\n/g, "\n");
			var t = "";
			for (var n = 0; n < e.length; n++) {
				var r = e.charCodeAt(n);
				if (r < 128) {
					t += String.fromCharCode(r)
				} else if (r > 127 && r < 2048) {
					t += String.fromCharCode(r >> 6 | 192);
					t += String.fromCharCode(r & 63 | 128)
				} else {
					t += String.fromCharCode(r >> 12 | 224);
					t += String.fromCharCode(r >> 6 & 63 | 128);
					t += String.fromCharCode(r & 63 | 128)
				}
			}
			return t
		},
		_utf8_decode: function(e) {
			var t = "";
			var n = 0;
			var r = c1 = c2 = 0;
			while (n < e.length) {
				r = e.charCodeAt(n);
				if (r < 128) {
					t += String.fromCharCode(r);
					n++
				} else if (r > 191 && r < 224) {
					c2 = e.charCodeAt(n + 1);
					t += String.fromCharCode((r & 31) << 6 | c2 & 63);
					n += 2
				} else {
					c2 = e.charCodeAt(n + 1);
					c3 = e.charCodeAt(n + 2);
					t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
					n += 3
				}
			}
			return t
		}
	}
	// Encode the String  
	return Base64.encode(unescape(encodeURIComponent(str)));
}


//Delete include files
gulp.task('clean-scripts', [ 'html' ], function () {
  return gulp.src( globs.cleanFilesTar, {read: true})
	.pipe(clean());
});




gulp.task('html', function() {


	//Replace placeholder variables
	var ver = new Date().getTime();
	ver     = base64_encode( ver );
	
	var versionConfig = {
		'value'    : '%MDS%',
		'replaces' : [  
			[/assets\/css\/rtl\/uix-kit-rtl(.*)\"/ig, 'assets\/css\/rtl\/uix-kit-rtl.css?ver=' + ver + '\"' ],
			[/assets\/css\/uix-kit.min(.*)\"/ig, 'assets\/css\/uix-kit.min.css?ver=' + ver + '\"' ],
			[/assets\/css\/uix-kit.IE(.*)\"/ig, 'assets\/css\/uix-kit.IE.css?ver=' + ver + '\"' ],
			[/assets\/js\/uix-kit.min(.*)\"/ig, 'assets\/js\/uix-kit.min.js?ver=' + ver + '\"' ],
			[/\@\@\{website_title\}/ig, customWebsiteTitle ],
			[/\@\@\{website_desc\}/ig, customWebsiteDesc ],
			[/\@\@\{website_canonical\}/ig, customWebsiteCanonical ],
			[/\@\@\{website_author\}/ig, customWebsiteAuthor ],
			[/\@\@\{website_generator\}/ig, customWebsiteGenerator ],
			[/\@\@\{website_version\}/ig, customWebsiteVersion ]
			
		],
	};

  console.log( 'cache:' + ver );
	
	

  //Delete all HTML files from examples/
  gulp.src( 'examples/*.html', {read: true})
	  .pipe(clean());

	
  return gulp.src( globs.htmlFiles )

		//File include
		.pipe(fileinclude({
		  prefix: '@@',
		  basepath: '@file'
		}))

		//Add version
		.pipe(version( versionConfig ))

		//Remove a folder structure when copying files in gulp
		.pipe(rename({dirname: ''}))
		.pipe(gulp.dest( 'examples' ));
	
	

	
	
});	


/*! 
 *************************************
 * Javascript & CSS tasks
 *************************************
 */
//Compile SCSS (RTL)
gulp.task('styles', function(){
  return gulp.src( globs.scssRTL )
    .pipe(sourcemaps.init())
	.pipe(concat('uix-kit-rtl.scss'))
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

	.pipe(cssbeautify({
		indent: '    ',
		openbrace: 'end-of-line',
		autosemicolon: true
	}))


	.pipe(headerComment(`
		---------------------------
		MAIN TEMPLATE STYLES (RTL)
		---------------------------

		Adding support for language written in a Right To Left (RTL) direction is easy -
		it's just a matter of overwriting all the horizontal positioning attributes
		of your CSS stylesheet in a separate stylesheet file named rtl.css.

		` + customComment + `

	`))
  
	 // be careful with the sources returned otherwise contents might not be loaded properly
	 .pipe(sourcemaps.mapSources(function(sourcePath, file) {
		// source paths are prefixed with '../src/'
		 return '_components/' + sourcePath;
	 }))
	.pipe(sourcemaps.write( '', {
		  includeContent   : false,
		  mapFile: function(mapFilePath) {
			// source map files are named *.map instead of *.js.map
			return mapFilePath.replace('.min', '');
		  }
	 }))
  
	.pipe(gulp.dest( globs.cssRTLTar ));

});	

//Compile SCSS
gulp.task('sass', function(){
	
  gulp.start( 'clean-scripts' );
  return gulp.src( globs.scss )
    .pipe(sourcemaps.init())
    .pipe(concat('uix-kit.scss'))
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  
	.pipe(cssbeautify({
		indent: '    ',
		openbrace: 'end-of-line',
		autosemicolon: true
	}))
  

	.pipe(headerComment(`
		---------------------------
		MAIN TEMPLATE STYLES
		---------------------------

		` + customComment + `

	`))
  
    .pipe(gulp.dest( globs.cssTar ))
  
    .pipe(minifyCss())
	.pipe(rename({
		suffix: '.min'
	}))
	
	.pipe(headerComment( customComment))

	 // be careful with the sources returned otherwise contents might not be loaded properly
	 .pipe(sourcemaps.mapSources(function(sourcePath, file) {
		// source paths are prefixed with '../src/'
		 return '_components/' + sourcePath;
	 }))
	.pipe(sourcemaps.write( '', {
		  includeContent   : false,
		  mapFile: function(mapFilePath) {
			// source map files are named *.map instead of *.js.map
			return mapFilePath.replace('.min', '');
		  }
	 }))

	.pipe(gulp.dest( globs.cssTar ));
	
	
});


//Merge JS
//@http://jshint.com/docs/options/
gulp.task('jshint', function () {
	return gulp.src( globs.js )
		.pipe(jshint({
            "validthis" : true,// Tolerate using this in a non-constructor
	     	"expr"      : true, //This option suppresses warnings about the use of expressions where normally you would expect to see assignments or function calls. 
		    "scripturl" : true //This option suppresses warnings about the use of script-targeted URLs
		}))
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
	
	 gulp.start( 'clean-scripts' );
     return gulp.src( globs.js )
	    .pipe(sourcemaps.init())
        .pipe(concat('uix-kit.js'))
	 
		.pipe(headerComment(`
			---------------------------
			MAIN SCRIPTS
			---------------------------

			` + customComment + `

		`))
	 
	    .pipe(gulp.dest( globs.jsTar ))
	 
	    //Compress
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
	
	    .pipe(headerComment( customComment))
	 
		 // be careful with the sources returned otherwise contents might not be loaded properly
		 .pipe(sourcemaps.mapSources(function(sourcePath, file) {
			// source paths are prefixed with '../src/'
			 return '_components/' + sourcePath;
		 }))
	    .pipe(sourcemaps.write( '', {
			  includeContent   : false,
			  mapFile: function(mapFilePath) {
				// source map files are named *.map instead of *.js.map
				return mapFilePath.replace('.min', '');
			  }
		 }))
	 
	    .pipe(gulp.dest( globs.jsTar ));

	
	
});

/*! 
 *************************************
 * Generate table of contents
 *************************************
 */
gulp.task('compile-scss', [ 'sass' ], function() {
	
	var tocCode1 = [];
	
    /* reading the file names in the directory */
	var folderNames = fs.readdir('_components/', (err, list) => {
								  list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
		                        
                                    //Read the SCSS and JS Files
									for ( var k = 0; k < list.length; k++ ) {
										
										generateTOC( list[ k ], 'scss', tocCode1 );
										
									}
		
		
								 
								});
	

	
});


gulp.task('compile-scss-rtl', [ 'styles' ], function() {
	
	var tocCode2 = [];
	
    /* reading the file names in the directory */
	var folderNames = fs.readdir('_components/', (err, list) => {
								  list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
		                        
                                    //Read the SCSS and JS Files
									for ( var k = 0; k < list.length; k++ ) {
										
										generateTOC( list[ k ], 'scss-rtl', tocCode2 );
										
									}
		
		
								 
								});
	

	
});

gulp.task('compile-js', [ 'scripts' ], function() {
	
	var tocCode3 = [];
	
    /* reading the file names in the directory */
	var folderNames = fs.readdir('_components/', (err, list) => {
								  list = list.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
		                        
                                    //Read the SCSS and JS Files
									for ( var k = 0; k < list.length; k++ ) {
										
										generateTOC( list[ k ], 'js', tocCode3 );
										
									}
		
		
								 
								});
	

	
});


function generateTOC( folderName, folderType, tocCode ) {
	
	var curPath = '_components/' + folderName + '/' + folderType;
	
	if ( fs.existsSync( curPath ) ) {

		var fileNames = fs.readdirSync( curPath, 'utf8' );

		fileNames.forEach( function( fileName ) {

			if ( fileName != '.DS_Store' ) {

				var filePath = curPath + '/' + fileName,
					stats    = fs.statSync( filePath );

				//console.log( fileName + ' Size: ' + stats["size"] );

				fs.readFile( filePath, function( err, content ) {

					if ( err ) throw err;

					var curCon  = content.toString(),
						newtext = curCon.match(/\<\!--(.*)--\>/ );

					//is the matched group if found
					if ( newtext && newtext.length > 1 ) {  
						
						
						tocCode.push( newtext[1] );
						
						//console.log( tocCode );

						var curToc = '';
						for ( var p = 0; p < tocCode.length; p++ ) {

							var curIndex = p + 1;

							if ( p > 0 ) {
								curToc += '    ' + curIndex + '.' + tocCode[ p ] + '\n';
							} else {
								curToc +=  curIndex + '.' + tocCode[ p ] + '\n';
							}


						}


						if ( folderType == 'scss' ) {
							gulp.src( 'examples/assets/css/uix-kit.css' )
								.pipe( replace( '${{TOC}}', curToc ) )
								.pipe( gulp.dest( globs.cssTar ) );		
						}
						
						if ( folderType == 'scss-rtl' ) {
							gulp.src( 'examples/assets/css/rtl/uix-kit-rtl.css' )
								.pipe( replace( '${{TOC}}', curToc ) )
								.pipe( gulp.dest( globs.cssRTLTar ) );		
						}
						
						if ( folderType == 'js' ) {
							gulp.src( 'examples/assets/js/uix-kit.js' )
								.pipe( replace( '${{TOC}}', curToc ) )
								.pipe( gulp.dest( globs.jsTar ) );		
						}		

					}


				});


			}

		});	

	}//end if


}

/*! 
 *************************************
 * Auto spy the project files
 *************************************
 */
gulp.watch('files-to-watch', ['tasks_to_run']); 

//Running gulp and webpack scripts
gulp.task('default', ['jshint', 'webpack'], function() {
    gulp.start( [ 'sass', 'scripts', 'styles', 'watch', 'compile-scss', 'compile-scss-rtl', 'compile-js' ] );
	
});

gulp.task('watch', function(){
	gulp.watch( globs.scssRTL, [ 'styles', 'compile-scss-rtl' ] ); 
	gulp.watch( globs.scss, [ 'sass', 'compile-scss' ] ); 
	gulp.watch( globs.js, [ 'scripts', 'compile-js' ] ); 
	gulp.watch( globs.htmlFiles, [ 'clean-scripts' ] ); 
	
	
});
