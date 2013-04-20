/*
Sticky Scroll v0.1
by Joscha Schmidt - http://www.itsjoe.de

For more information, visit:
http://itsjoe.de/

Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
- free for use in both personal and commercial projects
- attribution requires leaving author name, author link, and the license info intact
	
*/
(function( $ ){
	$.fn.stickyScroll = function(options) {
		
		options = $.extend({
			scrollOffsetTop : '0',
			elementOffsetTop : ''
		}, options);
		
		var stickyScrollElement = this;
		var elementOffset = stickyScrollElement.offset();
		var elementHeight = stickyScrollElement.outerHeight();

		if (stickyScrollElement.length)
		{
			$(window).on('scroll', function() {
				var scrollTop = $(window).scrollTop();
				
				if (scrollTop > options.scrollOffsetTop && !stickyScrollElement.hasClass('sticky'))
				{
//					console.log('IF: elem offset: ', elementOffset, 'sticky scroll elem: ', stickyScrollElement);
					stickyScrollElement.css({
						position: 'fixed',
						top: options.elementOffsetTop,
						left: elementOffset.left
						
					})
					.addClass('sticky')
					.next()
					.css('margin-top', elementHeight);
				}
				else if (scrollTop < options.scrollOffsetTop && stickyScrollElement.hasClass('sticky'))
				{
//					console.log('ELSE: elem offset: ', elementOffset, 'sticky scroll elem: ', stickyScrollElement);
					stickyScrollElement.css({
						position: '',
						top: '',
						left: ''
					})
					.removeClass('sticky')
					.next()
					.css('margin-top', 0);
				}
			});
		}
		
		
	};
})( jQuery );