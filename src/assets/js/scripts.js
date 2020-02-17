(function ($) {
	"use strict";

	// Page Loaded...
	$(document).ready(function () {

		/*==========  Accordion  ==========*/
		$('.panel-heading a').on('click', function() {
			$('.panel-heading').removeClass('active');
			$(this).parents('.panel-heading').addClass('active');
			$('.panel-heading .icon .fa-minus-square-o').removeClass('fa-minus-square-o').addClass('fa-plus-square');
			$(this).find('i').removeClass('fa-plus-square').addClass('fa-minus-square-o');
		});

		/*==========  Responsive Navigation  ==========*/
		$('.main-nav').children().clone().appendTo('.responsive-nav');
		$('.responsive-menu-open').on('click', function(event) {
			event.preventDefault();
			$('body').addClass('no-scroll');
			$('.responsive-menu').addClass('open');
			return false;
		});
		$('.responsive-menu-close').on('click', function(event) {
			event.preventDefault();
			$('body').removeClass('no-scroll');
			$('.responsive-menu').removeClass('open');
			return false;
		});

		/*==========  Twitter  ==========*/
		$('#tweets').twittie({
			username: 'EnvatoMarket',
			template: '{{tweet}}<span class="date">{{date}}</span>',
			dateFormat: '%b. %d, %Y',
			apiPath: './scripts/Tweetie/api/tweet.php'
		}, function() {
			$('#tweets ul').addClass('slides');
			$('#tweets').flexslider({
				controlNav: false,
				directionNav: false,
				smoothHeight: true,
				start: function() {
					twitterHeight()
				},
				after: function() {
					twitterHeight()
				}
			});
			return false;
		});
		function twitterHeight() {
			var height = $('.twitter').outerHeight();
			$('.footer .twitter .icon span').css('border-top-width',height);
			return false;
		}

		/*==========  Range Sliders  ==========*/
		$('#price-slider').noUiSlider({
			connect: true,
			behaviour: 'tap',
			margin: 5000,
			start: [20000, 100000],
			step: 2000,
			range: {
				'min': 0,
				'max': 150000
			}
		});
		$('#price-slider').Link('lower').to($('#price-min'), null, wNumb({
			decimals: 0
		}));
		$('#price-slider').Link('upper').to($('#price-max'), null, wNumb({
			decimals: 0
		}));
		$('#distance-slider').noUiSlider({
			connect: true,
			behaviour: 'tap',
			margin: 20000,
			start: [100000, 400000],
			step: 10000,
			range: {
				'min': 0,
				'max': 500000
			}
		});
		$('#distance-slider').Link('lower').to($('#distance-min'), null, wNumb({
			decimals: 0
		}));
		$('#distance-slider').Link('upper').to($('#distance-max'), null, wNumb({
			decimals: 0
		}));

		/*==========  Featured Cars  ==========*/
		$('#featured-cars').owlCarousel({
			loop: true,
			nav: true,
			dots: false,
			autoplay: true,
			navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 3
				},
				1200: {
					items: 5
				}
			}
		});
		$('#featured-cars-three').owlCarousel({
			loop: true,
			nav: true,
			dots: false,
			autoplay: true,
			navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 2
				},
				1200: {
					items: 3
				}
			}
		});

		/*==========  Blog Masonry  ==========*/
		var $blogMasonryContainer = $('#blog-masonry').imagesLoaded(function() {
			$blogMasonryContainer.isotope({
				itemSelector: '.blog-post',
				layoutMode: 'masonry',
				masonry: {
					columnWidth: $blogMasonryContainer.find('.blog-masonry-sizer')[0]
				}
			});
			return false;
		});

		/*==========  Team  ==========*/
		$('#team-slider').owlCarousel({
			loop: true,
			nav: false,
			dots: true,
			autoplay: true,
			responsive: {
				0: {
					items: 1
				},
				768: {
					items: 2
				},
				1200: {
					items: 4
				}
			}
		});

		/*==========  Popular Comparisons  ==========*/
		$('#popular-comparisons').owlCarousel({
			loop: true,
			nav: false,
			dots: true,
			autoplay: true,
			responsive: {
				0: {
					items: 1
				},
				1200: {
					items: 2
				}
			}
		});

		/*==========  Car Details Slider  ==========*/
		$('#car-details-slider').owlCarousel({
			items: 1,
			loop: true,
			nav: false,
			dots: true,
			autoplay: true
		});

		/*==========  Welcome Slider  ==========*/
		$('.welcome').flexslider({
			selector: '.slides > .slide',
			smoothHeight: true,
			controlNav: false,
		});

	});
	
	/*==========  File Inputs  ==========*/
	$(document).on('change', '.file-input :file', function() {
		var input = $(this),
			numFiles = input.get(0).files ? input.get(0).files.length : 1,
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [numFiles, label]);
		return false;
	});
	$('.file-input :file').on('fileselect', function(event, numFiles, label) {
		var log = numFiles > 1 ? numFiles + ' files selected' : label;
		$(this).parent().next('.file-input-selection').html(log);
		return false;
	});
	
	/*==========  Validate Email  ==========*/
	function validateEmail($validate_email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if( !emailReg.test( $validate_email ) ) {
			return false;
		} else {
			return true;
		}
		return false;
	}
	
	/*==========  Contact Form  ==========*/
	$('#contact-form').on('submit', function() {
		$('#contact-error').fadeOut();
		$('#contact-success').fadeOut();
		$('#contact-loading').fadeOut();
		$('#contact-loading').fadeIn();
		if (validateEmail($('#contact-email').val()) && $('#contact-email').val().length !== 0 && $('#contact-name').val().length !== 0 && $('#contact-message').val().length !== 0) {
			var action = $(this).attr('action');
			$.ajax({
				type: "POST",
				url : action,
				data: {
					contact_name: $('#contact-name').val(),
					contact_email: $('#contact-email').val(),
					contact_phone: $('#contact-phone').val(),
					contact_subject: $('#contact-subject').val(),
					contact_message: $('#contact-message').val()
				},
				success: function() {
					$('#contact-error').fadeOut();
					$('#contact-success').fadeOut();
					$('#contact-loading').fadeOut();
					$('#contact-success .message').html('Success! Thanks for contacting us!');
					$('#contact-success').fadeIn();
				},
				error: function() {
					$('#contact-error').fadeOut();
					$('#contact-success').fadeOut();
					$('#contact-loading').fadeOut();
					$('#contact-error .message').html('Sorry, an error occurred.');
					$('#contact-error').fadeIn();
				}
			});
		} else if (!validateEmail($('#contact-email').val()) && $('#contact-email').val().length !== 0 && $('#contact-name').val().length !== 0 && $('#contact-message').val().length !== 0) {
			$('#contact-error').fadeOut();
			$('#contact-success').fadeOut();
			$('#contact-loading').fadeOut();
			$('#contact-error .message').html('Please enter a valid email.');
			$('#contact-error').fadeIn();
		} else {
			$('#contact-error').fadeOut();
			$('#contact-success').fadeOut();
			$('#contact-loading').fadeOut();
			$('#contact-error .message').html('Please fill out all the fields.');
			$('#contact-error').fadeIn();
		}
		return false;
	});
	$('#footer-contact-form').on('submit', function() {
		var contactForm = $(this);
		contactForm.find('.contact-error').fadeOut();
		contactForm.find('.contact-success').fadeOut();
		contactForm.find('.contact-loading').fadeOut();
		contactForm.find('.contact-loading').fadeIn();
		if (validateEmail(contactForm.find('.contact-email').val()) && contactForm.find('.contact-email').val().length !== 0 && contactForm.find('.contact-name').val().length !== 0 && contactForm.find('.contact-message').val().length !== 0) {
			var action = $(this).attr('action');
			$.ajax({
				type: "POST",
				url : action,
				data: {
					contact_name: contactForm.find('.contact-name').val(),
					contact_email: contactForm.find('.contact-email').val(),
					contact_phone: '',
					contact_subject: '',
					contact_message: contactForm.find('.contact-message').val()
				},
				success: function() {
					contactForm.find('.contact-error').fadeOut();
					contactForm.find('.contact-success').fadeOut();
					contactForm.find('.contact-loading').fadeOut();
					contactForm.find('.contact-success .message').html('Success! Thanks for contacting us!');
					contactForm.find('.contact-success').fadeIn();
				},
				error: function() {
					contactForm.find('.contact-error').fadeOut();
					contactForm.find('.contact-success').fadeOut();
					contactForm.find('.contact-loading').fadeOut();
					contactForm.find('.contact-error .message').html('Sorry, an error occurred.');
					contactForm.find('.contact-error').fadeIn();
				}
			});
		} else if (!validateEmail(contactForm.find('.contact-email').val()) && contactForm.find('.contact-email').val().length !== 0 && contactForm.find('.contact-name').val().length !== 0 && contactForm.find('.contact-message').val().length !== 0) {
			contactForm.find('.contact-error').fadeOut();
			contactForm.find('.contact-success').fadeOut();
			contactForm.find('.contact-loading').fadeOut();
			contactForm.find('.contact-error .message').html('Please enter a valid email.');
			contactForm.find('.contact-error').fadeIn();
		} else {
			contactForm.find('.contact-error').fadeOut();
			contactForm.find('.contact-success').fadeOut();
			contactForm.find('.contact-loading').fadeOut();
			contactForm.find('.contact-error .message').html('Please fill out all the fields.');
			contactForm.find('.contact-error').fadeIn();
		}
		return false;
	});

	/*==========  Map  ==========*/
	var map;
	function initialize_full_width_map() {
		if ($('.map').length) {
			var myLatLng = new google.maps.LatLng(-37.814199, 144.961560);
			var mapOptions = {
				zoom: 15,
				center: myLatLng,
				scrollwheel: false,
				panControl: false,
				zoomControl: true,
				scaleControl: false,
				mapTypeControl: false,
				streetViewControl: false
			};
			map = new google.maps.Map(document.getElementById('map'), mapOptions);
			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map,
				title: 'Envato',
				icon: './images/marker.png'
			});
		} else {
			return false;
		}
		return false;
	}
	google.maps.event.addDomListener(window, 'load', initialize_full_width_map);

})(jQuery);