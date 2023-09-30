/*BAnner*/

var words = document.getElementsByClassName('word');
var wordArray = [];
var currentWord = 0;

words[currentWord].style.opacity = 1;
for (var i = 0; i < words.length; i++) {
  splitLetters(words[i]);
}

function changeWord() {
  var cw = wordArray[currentWord];
  var nw = currentWord == words.length-1 ? wordArray[0] : wordArray[currentWord+1];
  for (var i = 0; i < cw.length; i++) {
    animateLetterOut(cw, i);
  }
  
  for (var i = 0; i < nw.length; i++) {
    nw[i].className = 'letter behind';
    nw[0].parentElement.style.opacity = 1;
    animateLetterIn(nw, i);
  }
  
  currentWord = (currentWord == wordArray.length-1) ? 0 : currentWord+1;
}

function animateLetterOut(cw, i) {
  setTimeout(function() {
		cw[i].className = 'letter out';
  }, i*80);
}

function animateLetterIn(nw, i) {
  setTimeout(function() {
		nw[i].className = 'letter in';
  }, 340+(i*80));
}

function splitLetters(word) {
  var content = word.innerHTML;
  word.innerHTML = '';
  var letters = [];
  for (var i = 0; i < content.length; i++) {
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.innerHTML = content.charAt(i);
    word.appendChild(letter);
    letters.push(letter);
  }
  
  wordArray.push(letters);
}

changeWord();
setInterval(changeWord, 4000);

function myFunction() {
  var x = document.getElementById("navbar-nav");
  if (x.className === "navbar-nav") {
    x.className += " responsive";
  } else {
    x.className = "navbar-nav";
  }
}


$('textarea').blur(function () {
  $('#hire textarea').each(function () {
      $this = $(this);
      if ( this.value != '' ) {
        $this.addClass('focused');
        $('textarea + label + span').css({'opacity': 1});
      }
      else {
        $this.removeClass('focused');
        $('textarea + label + span').css({'opacity': 0});
      }
  });
});

$('#hire .field:first-child input').blur(function () {
  $('#hire .field:first-child input').each(function () {
      $this = $(this);
      if ( this.value != '' ) {
        $this.addClass('focused');
        $('.field:first-child input + label + span').css({'opacity': 1});
      }
      else {
        $this.removeClass('focused');
        $('.field:first-child input + label + span').css({'opacity': 0});
      }
  });
});

$('#hire .field:nth-child(2) input').blur(function () {
  $('#hire .field:nth-child(2) input').each(function () {
      $this = $(this);
      if ( this.value != '' ) {
        $this.addClass('focused');
        $('.field:nth-child(2) input + label + span').css({'opacity': 1});
      }
      else {
        $this.removeClass('focused');
        $('.field:nth-child(2) input + label + span').css({'opacity': 0});
      }
  });
});



/*Carousel*/
$(document).ready(function() {
  var carousel = $("#carousel").slidingCarousel({
    squeeze: 100
  });
});
(function($) {
	$.fn.slidingCarousel = function (options) {
		options = $.extend({}, $.fn.slidingCarousel.defaults, options || {});

		var pluginData = {
			container: $(this),
			sinus:   [0],
			images:  null,
			mIndex:  null
		};

		var preload = function(callback) {
			var images = pluginData.container.find('.slide img'),
				total  = images.length,
				shift  = total % 2,
				middle = total < 3 ? total : ~~(total / 2) + shift,
				result = [],
				loaded = 0;

			images.each(function (index, element) {
				var img = new Image();

				$(img).bind('load error', function () {
					loaded++;

					// push loaded images into regular array.
					// to preserve the order array gets constructed so, that elements indexed:
					//
					//    0 1 2 3 4 5 6
					//
					// are shifted within destination array by half of total length (-1 depending on parity/oddness):
					//
					//    6 5 4 0 1 2 3
					//
					// and finally reversed to get correct scrolling direction.

					result[(index+middle-shift) % total] = element;

					// need ratio for calculating new widths
					element.ratio = this.width / this.height;
					element.origH = this.height;
					element.idx   = index;

					if (loaded == total) {
						pluginData.mIndex = middle;
						pluginData.sinsum = 0;
						pluginData.images = result.reverse();

						// prepare symetric sinus table

						for (var n=1, freq=0; n<total; n++) {
							pluginData.sinus[n] = (n<=middle) ? Math.sin(freq+=(1.6/middle)) : pluginData.sinus[total-n];

							if (n < middle)
								pluginData.sinsum += pluginData.sinus[n]*options.squeeze;
						}
						callback(pluginData.images);
					}
				});
				img.src = element.src;
			});
		};

		var setupCarousel = function() {
			preload(doLayout);
			setupEvents();
		};

		var setupEvents = function() {
			pluginData.container
				.find ('.slide p > a').click(function(e) {
					var idx = $(this).find('img')[0].idx,
						arr = pluginData.images;

					while (arr[pluginData.mIndex-1].idx != idx ) {
						arr.push(arr.shift());
					}
					doLayout(arr, true);
				})
				.end()
				.find('.navigate-right').click(function() {
					var images = pluginData.images;

					images.splice(0,0,images.pop());
					doLayout(images, true);
				})
				.end()
				.find('.navigate-left').click(function() {
					var images = pluginData.images;

					images.push(images.shift());
					doLayout(images, true);
				});
		};

		var doLayout = function(images, animate) {
			var mid  = pluginData.mIndex,
				sin  = pluginData.sinus,
				posx = 0,
				diff = 0,
				width  = images[mid-1].origH * images[mid-1].ratio,  /* width of middle picture */
				middle = (pluginData.container.width() - width)/2,   /* center of middle picture, relative to container */
				offset = middle - pluginData.sinsum,                 /* to get the center, all sinus offset that will be added below have to be substracted */
				height = images[mid-1].origH, top, left, idx, j=1;

			// hide description before doing layout
			pluginData.container.find('span').hide().css('opacity', 0);

			$.each(images, function(i, img) {
				idx = Math.abs(i+1-mid);
				top = idx * 15;

				// calculating new width and caching it for later use
				img.cWidth = (height-(top*2)) * img.ratio;

				diff = sin[i] * options.squeeze;
				left = posx += (i < mid) ? diff : images[i-1].cWidth + diff - img.cWidth;

				var el = $(img).closest('.slide'),
					fn = function() {
						if (i === mid-1) {
							// show caption gently
							el.find('span').show().animate({opacity: 0.7});
						}
					};
                    
				if (animate) {
					el.animate({
						height   : height - (top*2),
						zIndex   : mid-idx,
						top      : top,
						left     : left+offset,
						opacity  : i==mid-1 ? 1 : sin[j++]*0.8
					}, options.animate, fn);
				}
				else
				{
					el.css({
						zIndex   : mid-idx,
						height   : height - (top*2),
						top      : top,
						left     : left+offset,
						opacity  : 0
					}).show().animate({opacity: i==mid-1 ? 1 : sin[j++]*0.8 }, fn);

					if (options.shadow) {
						el.addClass('shadow');						
					}
				}
			});

			if (!animate) {
				pluginData.container
					.find('.navigate-left').css('left', middle+50)
					.end()
					.find('.navigate-right').css('left', middle+width-75);
			}
		};

		this.initialize = function () {
			setupCarousel();
		};

		// Initialize the plugin
		return this.initialize();

	};

	$.fn.slidingCarousel.defaults = {
		shadow: true,
		squeeze: 124,
		animate: 250
	};

})(jQuery);

/*Back to top button*/
var btn = $('#button');

$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});

btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});





function myFunction() {
  var x = document.getElementById("myNavbar");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
}








$('#myCarousel').carousel({
	interval: false
  });
  $('#carousel-thumbs').carousel({
	interval: false
  });
  
  // handles the carousel thumbnails
  // https://stackoverflow.com/questions/25752187/bootstrap-carousel-with-thumbnails-multiple-carousel
  $('[id^=carousel-selector-]').click(function() {
	var id_selector = $(this).attr('id');
	var id = parseInt( id_selector.substr(id_selector.lastIndexOf('-') + 1) );
	$('#myCarousel').carousel(id);
  });
  // Only display 3 items in nav on mobile.
  if ($(window).width() < 575) {
	$('#carousel-thumbs .row div:nth-child(4)').each(function() {
	  var rowBoundary = $(this);
	  $('<div class="row mx-0">').insertAfter(rowBoundary.parent()).append(rowBoundary.nextAll().addBack());
	});
	$('#carousel-thumbs .carousel-item .row:nth-child(even)').each(function() {
	  var boundary = $(this);
	  $('<div class="carousel-item">').insertAfter(boundary.parent()).append(boundary.nextAll().addBack());
	});
  }
  // Hide slide arrows if too few items.
  if ($('#carousel-thumbs .carousel-item').length < 2) {
	$('#carousel-thumbs [class^=carousel-control-]').remove();
	$('.machine-carousel-container #carousel-thumbs').css('padding','0 5px');
  }
  // when the carousel slides, auto update
  $('#myCarousel').on('slide.bs.carousel', function(e) {
	var id = parseInt( $(e.relatedTarget).attr('data-slide-number') );
	$('[id^=carousel-selector-]').removeClass('selected');
	$('[id=carousel-selector-'+id+']').addClass('selected');
  });
  // when user swipes, go next or previous
  $('#myCarousel').swipe({
	fallbackToMouseEvents: true,
	swipeLeft: function(e) {
	  $('#myCarousel').carousel('next');
	},
	swipeRight: function(e) {
	  $('#myCarousel').carousel('prev');
	},
	allowPageScroll: 'vertical',
	preventDefaultEvents: false,
	threshold: 75
  });
  /*
  $(document).on('click', '[data-toggle="lightbox"]', function(event) {
	event.preventDefault();
	$(this).ekkoLightbox();
  });
  */
  
  $('#myCarousel .carousel-item img').on('click', function(e) {
	var src = $(e.target).attr('data-remote');
	if (src) $(this).ekkoLightbox();
  });