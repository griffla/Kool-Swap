$(function() {
	//readyFuntions(); // Load the readyFunctions on page $(document).ready()
	
	$(document)
	.on('click', 'header nav a.active', function(e) {
		e.preventDefault();
		if (e.originalEvent !== undefined) {
			e.stopImmediatePropagation();
		  }
	})
	.on({
		ksLoadCallback: function() {
		},
		ksSwapCallback: function() {
		},
		ksFog: function() {
			$.koolSwap('update',{
				outEasing : '',
				inEasing : '',
				outDuration : 400,
				inDuration : 600,
				direction: '',
			});
		},
		ksKangaroo: function() {
			$.koolSwap('update',{
				outEasing : 'easeInBack',
				inEasing : 'easeInSine',
				outDuration : 400,
				inDuration : 650,
				direction: 'top-to-bottom',
//				direction: 'bottom-to-top',
			});
		},
		ksVelociraptor: function() {
			$.koolSwap('update',{
				outEasing : 'easeInOutCirc',
				inEasing : 'easeOutQuad',
				outDuration : 700,
				inDuration : 600,
				direction: 'right-to-left',
//				direction: 'left-to-right',
			});
		},
		ksSiblingsDemo: function() {
			$.koolSwap('update',{
				swapBoxSiblings : '#demoSibling1, #demoSibling2',
			});
		},
		ksSiblingsDemoReset: function() {
			$.koolSwap('update',{
				swapBoxSiblings : '',
			});
		}
	})
	.on('click', '#fadeSiblingAndReload', function() {
		$(document).trigger('ksSiblingsDemo');
	})
	.on('click', '#justReload', function() {
		$(document).trigger('ksSiblingsDemoReset');
	});

	$.koolSwap({
		swapBox : '#main',
		outDuration : 200,
		inDuration : 300,
	});

	function is_touch_device() { // check if the plugin's running on a touch device
		var el = document.createElement('div');
		el.setAttribute('ongesturestart', 'return;');
		return typeof el.ongesturestart === "function";
	};

	if (is_touch_device()) {
		$('#animType')
		.on('touchstart', 'button', function(e) {
			var $this = $(this);
			changeAnimationType($this);
		});
	} else {
		$('#animType')
		.on('click', 'button', function(e) {
			var $this = $(this);
			changeAnimationType($this);
		});
	}
});

function changeAnimationType($this) {
	var animType = $this.attr('data-anim-type');
	
	$this
	.siblings('.active')
	.removeClass('active')
	.end()
	.addClass('active');
	
	$(document).trigger(animType);
	
	$('header')
	.find('nav')
		.find('a.active')
			.click();
}
