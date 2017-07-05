/* global headerControl, callbackUrl, notebookId, multiuserId */

import * as sbjs from 'sourcebuster'
import whenBecomeVisible from '../../commons/whenBecomeVisible'

window.addEventListener('load', function() {

	// Disable scroll when sidebar is opened
	let prevScrollTop = 0;
	let isSidebarVisible = false;

	document.getElementById('f-overlay-chkbx').addEventListener('change', (event) => {

		prevScrollTop = window.pageYOffset || document.documentElement.scrollTop;
		isSidebarVisible = event.target.checked;

		window.addEventListener('scroll', () => {
			if (isSidebarVisible) {
				window.scrollTo(0, prevScrollTop);
			}
		});
	})
});


window.headerControl = (function() {

	$(document).ready(function($) {

		let form = $('body > form');
		let header = $('.f-header');
		let menuLink = $('.f-header-menu-list-link a');

		if (!$('.-disable-pin-header').length) {
			pinHeader()
		}

		$(window).on('scroll', () => {
			if (!$('.-disable-pin-header').length) {
				pinHeader()
			}

		});
		$(menuLink).on('mouseover', addOutAnimForMenuLinks);

		function pinHeader() {
			if ($(window).scrollTop() > 50) {
				if (!$(form).hasClass('f-form-pinned')) {
					$(header).addClass('f-header-pinned');
					$(form).addClass('f-form-pinned');

					$('input').get()
						.filter(input => $(input).data('ui-autocomplete'))
						.forEach(input => $(input).autocomplete('close'))
				}
			}
			else {
				if ($(form).hasClass('f-form-pinned')) {
					$(header).removeClass('f-header-pinned');
					$(form).removeClass('f-form-pinned');

					$('input').get()
						.filter(input => $(input).data('ui-autocomplete'))
						.forEach(input => $(input).autocomplete('close'))
				}
			}
		}

		function addOutAnimForMenuLinks() {
			$(this).parent().addClass('-animationout-enabled');
		}

	});

	const checkBadgeValOverflow = function(val = 0) {
		val = isNaN(parseInt(val)) ? 0 : parseInt(val);
		if (val <= 0) return '';
		if (val > 99) return '99+';
		return val;
	}

	const updateVacancyCounter = () => {
		$.ajax({
			url: '/ws/vacancyws.asmx/SelectedCounter',
			type: "POST",
			contentType: "application/json; charset=utf-8",
			success: function(data) {
				$('.navVacCount').html(checkBadgeValOverflow(data.d[0]));
				$('.navNewVacCount').html(checkBadgeValOverflow(data.d[1]));
			}
		});
	}

	// for public api access
	return {
		checkBadgeValOverflow,
		updateVacancyCounter
	}

})();


// backward compatibility kostyl`
window.UpdateVacancyCounter = headerControl.updateVacancyCounter;


jQuery(document).on('click', '.jq-call-me-back', event => {
	event.preventDefault()

	const nameVal = $('#s-cb-name').val()
	const phoneVal = $('#s-cb-phone').val()

	if (!nameVal.length || !phoneVal.length) {
		$('.jq-call-me-back-validation')
			.addClass('-show')
			.text(ukrainian ? 'Заповніть всі поля' : 'Заполните все поля')
		return
	}

	$('.jq-call-me-back-validation').removeClass('-show')

	jQuery.ajax({ url: callbackUrl, data: { notebookId, multiuserId, name: nameVal, phone: phoneVal } }).then(() => {
		let date = new Date()
		date.setTime(date.getTime() + (24 * 60 * 60 * 1000))
		let expires = '; expires=' + date.toGMTString()
		document.cookie = 'callme=1' + expires + '; path=/'

		jQuery('.pnlCallback, .pnlCallbackDone').toggle()
	})
});


$(document).ready(() => {

	// if show block about ban of mail.ru emails
	if ($('header .f-bg-light-orange').length) {
		$('head').append(`<style>header[id$="header"] ~ .rua-l-wrapper { margin-top: 100px; }</style>`)
	}
})

//Footer is pinned when content's height is less than viewport's one
// function pinFooter() {
//     if (document.body.clientHeight < $(window).height()) {
//         $('.f-footer').addClass('f-pinned-footer');
//         $('body > form').css({height: '100vh', boxSizing: 'border-box'});
//     }
// }
// $(document).ready(pinFooter);
// $(document).resize(pinFooter);


sbjs.init()
window.sbjs = sbjs
window.whenBecomeVisible = whenBecomeVisible
