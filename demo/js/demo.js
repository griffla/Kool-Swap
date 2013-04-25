$(function() {
	$.koolSwap({
		swapBox : '#main',
		outDuration : 550,
		inDuration : 600,
	});

	readyFunctions(); // Load the readyFunctions on page $(document).ready()
	
	$(document)
	.on('click', 'header nav a.active', function(e) {
		e.preventDefault();
		if (e.originalEvent !== undefined) {
			e.stopImmediatePropagation();
		  }
	})
	.on({
		ksSwapCallback: function() {
			readyFunctions();
		},
		ksFade: function() {
			$.koolSwap({
				outEasing : '',
				inEasing : '',
				direction: '',
			});
		},
		ksTopToBottom: function() {
			$.koolSwap({
				direction: 'top-to-bottom',
				outEasing : 'easeInSine',
				inEasing : 'easeInSine',
			});
		},
		ksBottomToTop: function() {
			$.koolSwap({
				direction: 'bottom-to-top',
				outEasing : 'easeInSine',
				inEasing : 'easeInSine',
			});
		},
		ksLeftToRight: function() {
			$.koolSwap({
				direction: 'left-to-right',
				outEasing : 'easeInOutCirc',
				inEasing : 'easeOutQuad',
			});
		},
		ksRightToLeft: function() {
			$.koolSwap({
				direction: 'right-to-left',
				outEasing : 'easeInOutCirc',
				inEasing : 'easeOutQuad',
			});
		},
		ksSlow: function() {
			$.koolSwap({
				outDuration : 1250,
				inDuration : 1260,
			});
		},
		ksFast: function() {
			$.koolSwap({
				outDuration : 650,
				inDuration : 700,
			});
		},
		ksUltraFast: function() {
			$.koolSwap({
				outDuration : 250,
				inDuration : 300,
			});
		},
		ksSiblingsDemo: function() {
			$.koolSwap({
				bouncingBoxes : '#bouncingBox1, #bouncingBox2',
			});
		},
		ksSiblingsDemoReset: function() {
			$.koolSwap({
				bouncingBoxes : '',
			});
		}
	})
	.on('click', '#fadeSiblingAndReload', function() {
		$(document).trigger('ksSiblingsDemo');
	})
	.on('click', '#justReload', function() {
		$(document).trigger('ksSiblingsDemoReset');
	});

	if (is_touch_device()) {
		$('#settings')
		.on('touchstart', 'button', function(e) {
			var $this = $(this);
			changeAnimationType($this);
		});
	} else {
		$('#settings')
		.on('click', 'button', function(e) {
			var $this = $(this);
			changeAnimationType($this);
		});
	}
});

function changeAnimationType($this) {
	var settings = $this.attr('data-anim-type');
	$this
	.siblings('.active')
	.removeClass('active')
	.end()
	.addClass('active');
	
	$(document).trigger(settings);
}

function readyFunctions() {
	$('#tabContent').koolSwap({
		swapTriggerBox : '.tabs',
		bouncingBoxes : '.description, footer',
		direction: 'left-to-right',
		moveSwapBoxClasses : true,
		positionType: 'absolute',
	});
}


function is_touch_device() { // check if the plugin's running on a touch device
	var el = document.createElement('div');
	el.setAttribute('ongesturestart', 'return;');
	return typeof el.ongesturestart === "function";
};

