$(function() {

	/* "THE MODEL, captures the behavior of the application in terms of its problem domain, 
		independent of the user interface. The model directly manages the data, logic and 
		rules of the application."
	*/
	var model = function() {
		var originalTxt,
			lines = [];

		var init = function() {

		};

		var parseAndStoreText = function( txt ) {
			originalTxt = txt;
			lines = originalTxt.split('\n');
		};

		return {
			init : init,
			parseAndStoreText : parseAndStoreText
		};

	}();



/* "A view can be any output representation of information, such as a chart or a diagram; 
	multiple views of the same information are possible. "

	This view changes based on the height of the browser, so it will encapsulate logic to 
	deal with that.
*/
	var view = function() {
		var $content,
			height,
			linesToShow,
			topLineNumber,
			bottomLineNumber;

		var init = function() {
			$content = $('.lineviewer-content');

    		handleBrowserResize(); // Get height of browser & lines to show
		};

		var handleBrowserResize = function() {
			height = $content.height();
			linesToShow = Math.floor( height / parseInt( $content.css('font-size') ) );
			console.log( linesToShow );		
		};

		var extractText = function() {
			var txt = $content.text();			// get contents
			$content.text('');					// empty out the content area
			return txt;
		};

		return {
			init : init,
			extractText : extractText,
			browserResizeEvent : handleBrowserResize
		};

	}();



	/* "the controller, accepts input and converts it to commands for the model or view."

	*/
	var controller = function() {
		var $up = $('.lineviewer-up'),		// Even though these are UI elements, they provide input into system, 
			$down = $('.lineviewer-down');	// so they are owned by the controller.

		var init = function() {
			model.init();
			view.init();

    		// Set it up so that everytime the browser is resized, we recalculate 
    		// the number of lines to show in the content div.  
			$(window).on( 'resize', function() {
				view.browserResizeEvent();
			});

			model.parseAndStoreText( view.extractText() );
		};

		return {
			init : init

		};
	}();


	controller.init();




//     var view = function() {
//     	var $content = $('.lineviewer-content'),
//     		$up = $('.lineviewer-up'),
//     		$down = $('.lineviewer-up'),
//     		height,						// updated by resize event, in pixels, used to calculate lines to show
//     		currentLinesPerScreen,		// the last rendered lines per div 
//     		linesPerScreen,				// browser resize causes this to be updated
//     		top,						// index into which line is showing at the top part of the div
//     		bottom;


//     	var 
//     	init = function() {
//     		var adjustNumberOfLinesToShow = function() {
// 				height = $content.height();
// 				linesPerScreen = Math.floor( height / parseInt( $content.css('font-size') ) );
// 				console.log( linesPerScreen );
//     		};

//     		// Set it up so that everytime the browser is resized, we recalculate the number of 
//     		// lines to show in the content div.  
// 			$(window).on( 'resize', adjustNumberOfLinesToShow );

// 			// Do it at least once at startup
// 			adjustNumberOfLinesToShow();

// 			currentLinesPerScreen = linesPerScreen;
// 			top = 0;							// default to show line 0 at top			
// 			bottom = top + currentLinesPerScreen;
//     	},

//     	extractTextToDisplay = function() {
//     		return $content.text();
//     	},

//     	clearContentArea = function() {
//     		$content.text('');
//     	};


//     	return {
//     		init : init,
//     		extractText : extractTextToDisplay,
//     		clearContentArea : clearContentArea
//     	};
//     }();


//     var model = function() {
//     	var rawText = "",
//     		lines = [];

//     	var
//     	init = function() {
// 			rawText = "";
// 			lines = [];
//     	},

//     	parseAndStoreText = function( txt, parseFn ) {
//     		rawText = txt;
//     		lines = parseFn( txt );
//     	},

//     	showTxt = function() {
//     		console.log('--> ' + lines.length );
//     		for ( var i = 0; i < lines.length; i++ ) {
//     			console.log( i + ' : ' + lines[ i ] );
//     		}
//     	};

//     	return {
//     		init : init,
//     		parseAndStoreText : parseAndStoreText
//     	};

//     }();

//     var controller = function() {
//     	var 
//     	init = function() {
//     		// Ask the view and model to do their initialization stuff
//     		view.init();
//     		model.init();

//     		// Ask the view for the text from the html, give it to the model
//     		model.parseAndStoreText( view.extractText(), function(s) { return s.split('\n'); } );

//     		// Ask the view to clear out the content area
//     		view.clearContentArea();
//     	}();



//     	return {
//     		upPressed : upPressed,
//     		downPressed : downPressed
//     	};
//     }();


});