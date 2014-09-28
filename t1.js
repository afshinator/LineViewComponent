$(function() {

	var view = function() {
		var
			$content = $('.lineviewer-content'),
			$up = $('.lineviewer-up'),		
			$down = $('.lineviewer-down');

		var
			init = function() {},

			clear = function() { $content.empty(); },
			getText = function() { return $content.text(); },
			getFontSize = function() { return $content.css('font-size'); },
			height = function() { return $content.height(); },

			captureBrowserResize = function( callback ) { $(window).on( 'resize', callback ); },

			captureScroll = function ( upOrDown, callback ) {
				// http://stackoverflow.com/questions/4080497/how-can-i-listen-for-a-click-and-hold-in-jquery
				var timeoutId = 0,
					$el = ( upOrDown === 'up' ) ? $up : $down;

				$el.mousedown(function() {
				    callback();
				});
			},

			render = function( lines, top, linesToShow ) {
				var html = '', i;
				console.log('top: '+ top + '   lineToShow :' + linesToShow );
				for ( i = 0; i < linesToShow; i++ ) {
					html += '<span class="line">' + ( i + top ) + ': ' + lines[ top + i ] + '<br></span>';
				}
				clear();
				$content.append( html );
			};

		return {
			init : init,
			clear : clear,									// empty the div
			getText : getText,								// return all the text in the div
			getFontSize : getFontSize,						// return font-size
			viewableContentHeight : height,					// return height of the div
			captureBrowserResize : captureBrowserResize,	// pass in function to execute on browser resize
			captureScroll : captureScroll,					// 1st param: 'up' or 'down', 2nd: function to execute on scroll
			render : render									// update the DOM;
		};
		
	}();


	var model = function() {
		var
			originalTxt,
			lines = [],
			linesToShow,
			top;

		var
			init = function( txt ) {
				top = 0;
				originalTxt = txt;
				lines = originalTxt.split('\n');
				computeLinesToShow();
			},

			computeLinesToShow = function ( ) {
				// This is an approximation of how many lines will need to get shown
				// TODO: The smaller the height of the browser, the closer this approximation is.
				linesToShow = Math.floor( view.viewableContentHeight() / parseInt( view.getFontSize() ) );
				view.render( lines, top, linesToShow );		// tell view to show appropriate # of lines
			},

			handleScrollUp = function() {
				if ( top > 0 ) {
					top--;
					view.render( lines, top, linesToShow );
				}
			}


			handleScrollDown = function() {
				if ( top + linesToShow < lines.length ) {
					top++;
					view.render( lines, top, linesToShow );
				}
			}
			;

		return {
			init : init,
			computeLinesToShow : computeLinesToShow,
			handleScrollUp : handleScrollUp,
			handleScrollDown : handleScrollDown
		};
		
	}();


	var controller = function() {
		var 
			// Returns a function that ignores all further invocations until wait amount
			// of time has passed, at which time it will invoke the function once.
			// Used to limit how many times a callback function is called for gui events.
			debounce = function(func, wait) {
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
				view.init();
				model.init( view.getText() );			// get all the text in the content div, give it to the model
				view.captureBrowserResize( debounce( model.computeLinesToShow, 300 ) );	// tell the view to trigger the model method on browser resize
				view.captureScroll( 'up', model.handleScrollUp );
				view.captureScroll( 'down', model.handleScrollDown );	
			}();

		return {
			init : init,
			debounce : debounce
		}
	}();	



});