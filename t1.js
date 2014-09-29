$(function() {

	var view = function() {
		var
			$content = $('.lineviewer-content'),		// main content area
			$up = $('.lineviewer-up'),						// scroll up button
			$down = $('.lineviewer-down');				// scroll down button

		var
			init = function() {},							// TODO:   not necessary now, but as more code is added...

			clear = function() { $content.empty(); },							// Clear out main content area 
			getText = function() { return $content.text(); },
			getFontSize = function() { return $content.css('font-size'); },
			height = function() { return $content.height(); },

			captureBrowserResize = function( callback ) { $(window).on( 'resize', callback ); },

			captureScrollButtons = function ( upOrDown, callback ) {
				var timeoutId = 0,
					$el = ( upOrDown === 'up' ) ? $up : $down;

				$el.on( 'mouseover mouseout click', function(e) {
					if ( e.type === 'mouseover' ) {
						$(this).addClass('highlight1');
					} 
					else if ( e.type === 'mouseout' ) {
						$(this).removeClass('highlight1');
					}
					else if ( e.type === 'click' ) {
						$(this).hide().fadeIn( 75, function() { callback(); });	// Turn button off & on for visual feedback, as well as call handler
					}
				});

				captureMouseWheel( upOrDown, callback );
			},


			captureMouseWheel = function( upOrDown, callback ) {
				$(window).bind( 'mousewheel', function(e) {
					if( upOrDown === 'up' && e.originalEvent.wheelDelta > 0 ) {
						callback();
					} 
					if ( upOrDown === 'down' && e.originalEvent.wheelDelta < 0) {
						callback();
					}
				});
			},


			render = function( lines, top, linesToShow ) {
				var html = '', i;
				// console.log('top: '+ top + '   lineToShow :' + linesToShow );
				for ( i = 0; i < linesToShow; i++ ) {
					html += '<span class="line">' + ( i + top ) + ': ' + lines[ top + i ] + '<br></span>';
				}
				clear();
				$content.append( html );
// console.log( ' the check ' + ( $content.offsetHeight < $content.scrollHeight ) ) ;
			};

		return {
			init : init,
			clear : clear,											// Empty the main content area
			getText : getText,									// Return all the text in the main content area
			getFontSize : getFontSize,							// return font-size
			viewableContentHeight : height,					// return height of the div
			captureBrowserResize : captureBrowserResize,	// pass in function to execute on browser resize
			captureScrollButtons : captureScrollButtons,	// 1st param: 'up' or 'down', 2nd: function to execute on scroll
			captureMouseWheel : captureMouseWheel,			// 
			render : render										// update the DOM;
		};
		
	}();


	var model = function() {
		var
			originalTxt,						// Will hold all the original text in the main content div
			lines = [],							// The original text split up into lines, based on \n
			linesToShow,						// How many lines there are to show
			top;									// Current line # being shown at top of main content area

		var
			init = function( txt ) {
				top = 0;
				originalTxt = txt;
				lines = originalTxt.split('\n');
				computeLinesToShow();
				render();
			},

			computeLinesToShow = function ( ) {
				// This is an approximation of how many lines will need to get shown
				// TODO: The smaller the height of the browser, the closer this approximation is.
				linesToShow = Math.floor( view.viewableContentHeight() / parseInt( view.getFontSize() ) - view.viewableContentHeight()/100 );
				console.log( '--> ' + linesToShow );
			},

			handleScrollUp = function() {
				if ( top > 0 ) {
					top--;
					render();
				}
			},

			handleScrollDown = function() {
				if ( top + linesToShow < lines.length ) {
					top++;
					render();
				}
			},

			render = function() {
				if ( lines.length <= linesToShow ) {
					view.render( lines, top, lines.length );
				} else {
					view.render( lines, top, linesToShow );
				}
			};

		return {
			init : init,
			computeLinesToShow : computeLinesToShow,
			handleScrollUp : handleScrollUp,
			handleScrollDown : handleScrollDown
		};
		
	}();


	var controller = function() {
		// Returns a function that ignores all further invocations until wait amount
		// of time has passed, at which time it will invoke the function once.
		// Used to limit how many times a callback function is called for gui events.
		var debounce = function(func, wait) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					func.apply(context, args);
				};
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
			};
			return func;
		},

		init = function() {
			// view.init();										// TODO: Might be useful sometime in the future

			// Initialize model with text in main content area
			model.init( view.getText() );						

			view.captureBrowserResize( debounce( model.computeLinesToShow, 300 ) );	// Setup view to tell the model when browser resizes
			view.captureScrollButtons( 'up', model.handleScrollUp );				// Setup view to invoke model methods when scroll buttons pressed
			view.captureScrollButtons( 'down', model.handleScrollDown );
		}();

		return {
			init : init,
			debounce : debounce
		}
	}();	

});