/*
Kool Swap v0.1
by Joscha Schmidt - http://www.itsjoe.de

For more information, visit:
http://itsjoe.de/kool-swap/

Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
- free for use in both personal and commercial projects
- attribution requires leaving author name, author link, and the license info intact
	
*/
(function( $ ){
	var methods = {
		defaults: {
			swapBox : 'body > :first-child',
			swapBoxOffsetTop : '0',
			swapTriggerBox : '.kool-swap',
			swapTrigger : 'a',
			loadErrorMessage : 'The requested page could not be loaded.',
			loadErrorBacklinkText : 'Go back to the last page',
			swapBoxSiblings : '',
			topToBottom : false, 
			leftToRight : false,
			inEasing : 'easeInSine',
			outEasing : 'easeInBack',
			inDuration : 700,
			outDuration : 500,
			checkForImages : true,
			direction: '',
		},
		settings: {},
		// Initial operations
		init : function(options) { 
			methods.settings = $.extend({}, methods.defaults, options);
			var hasPushstate = (window.history && history.pushState != 0),
				$swapBox = $(methods.settings.swapBox),
				swapBoxClass = $swapBox.attr('class'),
				swapBoxId = $swapBox.attr('id'),
				swapBoxTagName = $swapBox.prop("tagName"),
				swapTriggerBox = methods.settings.swapTriggerBox,
				swapTrigger = methods.settings.swapTrigger;
			
			if (!$('html').is('[data-ks-initialised]')) {
				$('html').attr('data-ks-initialised', 'true');
				methods.listenToPushstate(); // Function to listen to pushstate for back/forward button functionality 
				
				// for the 404 back link
				$('body').on('click', '.ajaxPageSwitchBacklink', function() {
					window.history.back();
				});
			}
			
			function is_touch_device() { // check if the plugin's running on a touch device
				var el = document.createElement('div');
				el.setAttribute('ongesturestart', 'return;');
				return typeof el.ongesturestart === "function";
			};
			
			if (is_touch_device()) {
				$(document)
				.off('touchstart', swapTriggerBox + ' ' + swapTrigger)
				.on('touchstart', swapTriggerBox + ' ' + swapTrigger, function(e) {
					var item = $(this);
					methods.ksCollectLoadPageInfo(e, item, hasPushstate, swapBoxId, swapBoxClass, swapBoxTagName, swapTriggerBox, swapTrigger);
				});
			} else {
				$(document)
				.off('click', swapTriggerBox + ' ' + swapTrigger)
				.on('click', swapTriggerBox + ' ' + swapTrigger, function(e) {
					switch (methods.settings.direction) {
					    case 'left-to-right':
					    case 'right-to-left':
					    case 'top-to-bottom':
					    case 'bottom-to-top':
					    case '':
							$swapBoxIn = 'ks-swap-box-in';
							if (!$('.ks-swap-box-in').length) {
								var item = $(this);
								methods.ksCollectLoadPageInfo(e, item, hasPushstate, swapBoxId, $swapBoxIn, swapBoxClass, swapBoxTagName, swapTriggerBox, swapTrigger);
							} else {
								return false;
							}
							break;
				        default:
							alert('Kool Swap Error: \n The defined direction ' + methods.settings.direction + ' does not exist.');
				        	return false;
				        	break;
					}
				});
			}
		},
		ksCollectLoadPageInfo: function(e, item, hasPushstate, swapBoxId, $swapBoxIn, swapBoxClass, swapBoxTagName, swapTriggerBox, swapTrigger) {
			if (hasPushstate) {
				e.preventDefault();
				var url = item.attr('href');
				
				var $swapBoxIn;
				switch (methods.settings.direction) {
				    case 'left-to-right':
						$swapBoxIn = 'ks-swap-box-in-l';
						break;
				    case 'right-to-left':
						$swapBoxIn = 'ks-swap-box-in-r';
						break;
				    case 'top-to-bottom':
						$swapBoxIn = 'ks-swap-box-in-t';
						break;
				    case 'bottom-to-top':
						$swapBoxIn = 'ks-swap-box-in-b';
						break;
				    case '':
						$swapBoxIn = 'ks-swap-box-in';
						break;
			        default:
						alert('Kool Swap Error: \n The defined direction ' + methods.settings.direction + ' does not exist.');
			        	return false;
			        	break;
				}
				
				methods.ksLoadPage(url, swapBoxId, $swapBoxIn, swapBoxClass, swapBoxTagName, swapTriggerBox, swapTrigger);
				history.pushState({'url':url}, null, url); // Update the url
				$('html').attr('data-ks-history-pushed', 'true');
			}
		},
		ksLoadPage: function(href, swapBoxId, swapBoxIn, swapBoxClass, swapBoxTagName, swapTriggerBox, swapTrigger) {
			var $swapBox = $(methods.settings.swapBox); // redefine $swapBox variable
			if (href != '') {
				var $swapBox = $(methods.settings.swapBox); // redefine $swapBox variable
				methods.ksAddSwapBoxIn(swapBoxTagName, swapBoxIn, swapBoxClass);
				$.ajax({
					type: 'GET',
					url: href,
					data: {},
					beforeSend: function() {
						methods.ksCreateLoadBox();
					},
					error : function(data, xhrStatusText, xhrStatus) {
						$swapBox.html(methods.settings.loadErrorMessage + '<p>' + xhrStatusText + ': <strong>' + xhrStatus + '</strong></p><p><a class="ajaxPageSwitchBacklink">' + methods.settings.loadErrorBacklinkText + '</a></p>');
					},
					success: function(data) {
						
						if (methods.settings.swapBoxSiblings) {
							methods.ksFadeSiblings(data, swapBoxId, swapBoxIn);
						} else {
							methods.ksPositionSwapBox(data, swapBoxId, swapBoxIn);
						}
					},
					dataType: 'html'
				});
			} else {
				alert('There is no target defined! Please check the references (i.e. normally href) of the swapTriggers.');
			}
		},
		ksCreateLoadBox: function() {
			if (!$('#ks-loading-box').length) {
				loadTimer = setTimeout(function() { // Show the loading box if the loadings of contents takes longer than 200ms
					$('html').append('<div id="ks-loading-box"><div class="ks-loading"></div></div>');
					$('#ks-loading-box').fadeIn('fast');
				}, 200);
			} else {
				methods.ksRemoveLoadBox();
				methods.ksCreateLoadBox();
			}
		},
		ksRemoveLoadBox: function() {
			$('#ks-loading-box').fadeOut('fast').remove();
		},
		ksAddSwapBoxIn: function(swapBoxTagName, swapBoxIn, swapBoxClass) {
			var $swapBox = $(methods.settings.swapBox); // redefine $swapBox variable
			//$swapBox.after('<' + swapBoxTagName.toLowerCase() + ' class="ks-swap-box-in ' + (typeof swapBoxClass != 'undefined' ? swapBoxClass : '') + '" id="' + swapBoxIn + '"></' + swapBoxTagName.toLowerCase() + '>'); // create the temp container
			// swapBoxOut classes are no longer transfered
			$swapBox.after('<' + swapBoxTagName.toLowerCase() + ' class="ks-swap-box-in" id="' + swapBoxIn + '"></' + swapBoxTagName.toLowerCase() + '>'); // create the temp container
		},
		ksFadeSiblings: function(data, swapBoxId, swapBoxIn) {
			var $swapBox = $(methods.settings.swapBox); // redefine $swapBox variable
			
			$swapBox
			.siblings(methods.settings.swapBoxSiblings)
			.fadeOut(200, function() {
				methods.ksPositionSwapBox(data, swapBoxId, swapBoxIn);
			});
		},
		ksPositionSwapBox: function(data, swapBoxId, swapBoxIn) {
			var $swapBox = $(methods.settings.swapBox), // redefine $swapBox variable
				mainOffset = $swapBox.position(),
				mainWidth = $swapBox.width(),
				mainMarginLeft = $swapBox.css('margin-left'),
				mainMarginRight = $swapBox.css('margin-left'),
				swapBoxLeftAbsolute = mainOffset.left + parseFloat(mainMarginLeft);
				swapBoxRightAbsolute = mainOffset.left + parseFloat(mainMarginLeft) + mainWidth - parseFloat(mainMarginRight);
				
			$swapBox
			.css({
				position: 'absolute',
				top: mainOffset.top,
				left: swapBoxLeftAbsolute,
				marginLeft: 0,
				width: mainWidth,
			});
			methods.ksPrepareSwap(data, swapBoxId, swapBoxIn, mainOffset, swapBoxLeftAbsolute, mainWidth);
		},
		ksPrepareSwap: function(data, swapBoxId, swapBoxIn, mainOffset, swapBoxLeftAbsolute, mainWidth) {
			var $swapBox = $(methods.settings.swapBox), // redefine $swapBox variable
				$swapBoxIn = $('#' + swapBoxIn),
				htmlId = data.match(/<\/*html\s+.*id="([^"].*)".*>/), // exclude html classes
				bodyId = data.match(/<\/*body\s+.*id="([^"].*)".*>/), // exclude body classes
				htmlClass = data.match(/<\/*html\s+.*class="([^"].*)".*>/), // exclude html classes
				bodyClass = data.match(/<\/*body\s+.*class="([^"].*)".*>/), // exclude body classes
				pageTitle = data.match(/<\/*title>(.*)<\/title>/); // exclude page title
			
			if (swapBoxInContents = $(data).filter('#' + swapBoxId).html() != undefined) { // Check if we have to use .filter or .find to get the data
				var swapBoxInContainer = $(data).filter('#' + swapBoxId);
				swapBoxInContents = swapBoxInContainer.html();
				var swapBoxInClasses = swapBoxInContainer.attr('class');
			} else {
				var swapBoxInContainer = $(data).find('#' + swapBoxId);
				swapBoxInContents = swapBoxInContainer.html();						
				var swapBoxInClasses = swapBoxInContainer.attr('class');
			}
			
			$swapBoxIn
			.addClass(swapBoxInClasses) // add the swapBoxIn classes
			.css({marginLeft: 0}) // Set the margin to 0 because the swapBox was positioned in place
			.html(swapBoxInContents); // Attach the contents to the target temp container
			
			$(document).trigger('ksLoadCallback'); // Trigger the ksLoad callback event
			
			var swapBoxInImages =  $swapBoxIn.find('img'); // Check if there are images in the swapIn box 
			var count = 0;
			if (swapBoxInImages.length && methods.settings.checkForImages == true) {
				swapBoxInImages.on('load', function() {
					count++;
			        if (count == swapBoxInImages.length){
			        	methods.ksSwapContent(swapBoxIn, swapBoxId, mainOffset, swapBoxLeftAbsolute, mainWidth, htmlId, bodyId, htmlClass, bodyClass, pageTitle);
			        }
				});
			} else {
				methods.ksSwapContent(swapBoxIn, swapBoxId, mainOffset, swapBoxLeftAbsolute, mainWidth, htmlId, bodyId, htmlClass, bodyClass, pageTitle);
			}
		},
		// Swap the content
		ksSwapContent: function(swapBoxIn, swapBoxId, mainOffset, swapBoxLeftAbsolute, mainWidth, htmlId, bodyId, htmlClass, bodyClass, pageTitle) {
			var $swapBox = $(methods.settings.swapBox), // redefine $swapBox variable
				$swapBoxIn = $('#' + swapBoxIn),
				swapBoxInHeight = $swapBoxIn.outerHeight(),
				swapBoxInWidth = $swapBoxIn.outerWidth(),
				swapBoxHeight = $swapBoxIn.outerHeight(),
				viewportHeight = $(window).outerHeight(),
				viewportWidth = $(window).outerWidth();

			clearTimeout(loadTimer);
			methods.ksRemoveLoadBox();
			//methods.ksPrepareSwapBoxIn($swapBoxIn, swapBoxIn, swapBoxInHeight, swapBoxInWidth, swapBoxHeight, viewportHeight, viewportWidth);

			if (methods.settings.direction) {
				$swapBoxIn.css({width: mainWidth});
				
				var swapBoxOutAnimProperties = {}, swapBoxInAnimProperties = {};
				// Define animation value
				var swapBoxOutAnimValue;
				switch (swapBoxIn) {
				    case 'ks-swap-box-in-t':
				    case 'ks-swap-box-in-b-pushstate':
						$swapBoxIn.css('top', -swapBoxInHeight * 2);
				    	swapBoxOutAnimValue = swapBoxHeight;
				    	break;
				    case 'ks-swap-box-in-t-pushstate':
				    case 'ks-swap-box-in-b':
						$swapBoxIn.css('top', swapBoxHeight * 2);
				    	swapBoxOutAnimValue = -swapBoxHeight;
				    	break;
				    case 'ks-swap-box-in-l':
				    case 'ks-swap-box-in-r-pushstate':
						$swapBoxIn.css('left', -swapBoxInWidth * 2);
				    	swapBoxOutAnimValue = viewportWidth;
				    	break;
				    case 'ks-swap-box-in-l-pushstate':
				    case 'ks-swap-box-in-r':
						$swapBoxIn.css('left', swapBoxInWidth * 2);
				    	swapBoxOutAnimValue = -viewportWidth;
				    	break;
			        default:
						alert('Kool Swap Error: \n The swapBoxIn class is in an undefined format: ' + swapBoxIn + '.');
			        	return false;
			        	break;
				}
				
				switch (methods.settings.direction) {
				    case 'left-to-right':
				    case 'right-to-left':
						var finalInDuration = methods.settings.inDuration, 
							finalOutDuration = methods.settings.outDuration;
						
						swapBoxOutAnimProperties = {left: swapBoxOutAnimValue};
						swapBoxInAnimProperties = {left: swapBoxLeftAbsolute};
						
						$swapBoxIn.css('top', mainOffset.top + methods.settings.swapBoxOffsetTop);
						$('body').css('overflow-x', 'hidden'); // Prevent horizontal scrollbars on animation
			        	break;
				    case 'top-to-bottom':
				    case 'bottom-to-top':
						/* Every page wants to reach the end position in the defined space of time (duration).
						 * This causes that high pages (based on the height in pixels after all content were loaded)
						 * seem to animate faster than low pages. 
						 * I thought about a work around and came to the formula DURATION + (HEIGHT OF THE SWAP (IN) BOX / DURATION * 100)
						 * This calculates a final in-duration value that seems to work fine.
						 */ 
						var finalInDuration = methods.settings.inDuration + (swapBoxInHeight / methods.settings.inDuration * 100),
							finalOutDuration = methods.settings.outDuration + (swapBoxHeight / methods.settings.outDuration * 100);
						
						swapBoxInAnimProperties = {top: mainOffset.top};
						swapBoxOutAnimProperties = {top: swapBoxOutAnimValue};
						
						$('body').css('overflow-y', 'hidden'); // Prevent vertical scrollbars on animation
			        	break;
				}
				
				$swapBox
				.show()
				.animate(
					swapBoxOutAnimProperties, finalOutDuration, methods.settings.outEasing, function() {
						$(this).remove();
						$(document).trigger('ksSwapCallback');
						methods.ksSwitchClasses(htmlId, bodyId, htmlClass, bodyClass, pageTitle);
					});
				
				$swapBoxIn
				.show()
				.animate(
					swapBoxInAnimProperties, finalInDuration, methods.settings.inEasing, function() {
						$(this).attr('id', swapBoxId).removeClass('ks-swap-box-in');
						methods.ksCheckForSiblings($(this));
					});
			} else {
				$swapBox
				.animate({opacity: 0}, methods.settings.outDuration, function() {
					$(this).remove(); // remove the $swapBox container
					methods.ksSwitchClasses(htmlId, bodyId, htmlClass, bodyClass, pageTitle);
					$swapBoxIn
					.css('opacity', 0)
					.animate({opacity: 1}, methods.settings.inDuration, function() {
						methods.ksCheckForSiblings($(this));
					})
					.attr('id', swapBoxId).removeClass('ks-swap-box-in');
				});
			}
		},
		ksCheckForSiblings: function($this) {
			if (methods.settings.swapBoxSiblings) {
				$this
				.siblings(methods.settings.swapBoxSiblings)
					.fadeIn(200, function() {
						methods.ksSwapCallback();
					});
			} else {
				methods.ksSwapCallback();
			}
		},
		ksSwitchClasses : function(htmlId, bodyId, htmlClass, bodyClass, pageTitle) {
			$('html, body').attr({ // remove ids and classes from html and body
				'class': '',
				'id' : '',
			}); 
			(htmlId ? $('html').attr('id', htmlId[1]) : ''); // Add IDs from the target page 
			(bodyId ? $('body').attr('id', bodyId[1]) : ''); // Add IDs from the target page 
			(htmlClass ? $('html').addClass(htmlClass[1]) : ''); // Add classes from the target page 
			(bodyClass ? $('body').addClass(bodyClass[1]) : ''); // Add classes from the target page 
			(pageTitle ? $('title').text(pageTitle[1]) : '');
		},
		ksSwapCallback: function() {
			$('body').css({
				overflow: 'auto',
				overflowY: 'auto',
				overflowX: 'auto',				
			}); // Prevent scrollbars on animation
			$(document).trigger('ksSwapCallback'); // Trigger the swap callback event
		},
		update : function(options) {
			methods.settings = $.extend({}, methods.settings, options);
		},
		destroy : function() {
			$(methods.settings.swapTriggerBox).off('click', methods.settings.swapTrigger);
		},
		listenToPushstate : function(options) { // Listen to the pushstate to make back/forward browser buttons work
			var hasPushstate = (window.history && history.pushState != 0),
				$swapBox = $(methods.settings.swapBox),
				swapBoxClass = $swapBox.attr('class'),
				swapBoxId = $swapBox.attr('id'),
				swapBoxTagName = $swapBox.prop("tagName"),
				swapTriggerBox = methods.settings.swapTriggerBox,
				swapTrigger = methods.settings.swapTrigger;

			if (hasPushstate) {
				$(window).bind('popstate', function(e) { // Listen to popstate
					if($('html').is('[data-ks-history-pushed]')) { 
						var locationPath = location.pathname;
						//var currentpage = locationPath.replace(/^.*[\\\/]/, '');

						var $swapBoxIn;
						switch (methods.settings.direction) {
						    case 'left-to-right':
								$swapBoxIn = 'ks-swap-box-in-l-pushstate';
								break;
						    case 'right-to-left':
								$swapBoxIn = 'ks-swap-box-in-r-pushstate';
								break;
						    case 'top-to-bottom':
								$swapBoxIn = 'ks-swap-box-in-t-pushstate';
								break;
						    case 'bottom-to-top':
								$swapBoxIn = 'ks-swap-box-in-b-pushstate';
								break;
						    case '':
								$swapBoxIn = 'ks-swap-box-in-pushstate';
								break;
					        default:
								alert('Kool Swap Error: \n The defined direction ' + methods.settings.direction + ' does not exist.');
					        	return false;
					        	break;
						}
						methods.ksLoadPage(locationPath, swapBoxId, $swapBoxIn, swapBoxClass, swapBoxTagName, swapTriggerBox, swapTrigger);
					}
					e.stopPropagation();
				});
			}
		}
	};
	
	$.koolSwap = function(method) {
		if (methods[method]) {
			return methods[method].apply($(window), Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply($(window), arguments);
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.KoolSwap' );
		}    
	};
})( jQuery );