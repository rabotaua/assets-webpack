/* global jQuery */

jQuery(document).ready(function ($) {

	function hideAllTooltips () {
		$('.rua-tooltip').each(function (index, node) {
			let hideTimeout = $(node).data('hideTimeout')
			if (hideTimeout) {
				clearTimeout(hideTimeout)
			}
		}).removeClass('active')
	}

	function startHideTimeout ($tooltip) {
		let hideTimeout = setTimeout(function () {
			$tooltip.removeClass('active')
		}, 500)
		$tooltip.data('hideTimeout', hideTimeout)
	}

	function stopHideTimeout ($tooltip) {
		let hideTimeout = $tooltip.data('hideTimeout')
		if (hideTimeout) {
			clearTimeout(hideTimeout)
		}
	}

	$(document).on('click', function () {
		hideAllTooltips()
	})

	$(document).on('mouseover', '[data-tooltip]', function () {
		let $tooltip = $($(this).attr('data-tooltip'))
		if (!$tooltip.size()) return

		if ($tooltip.hasClass('active')) {
			stopHideTimeout($tooltip)
		} else {

			hideAllTooltips()

			let positionObj = {
				my: 'center top+10',
				at: 'center bottom',
				of: $(this),
				collision: 'fit'
			}

			let tooltipPosition = $tooltip.data('position')

			if (tooltipPosition) {
				if (tooltipPosition === 'top') {
					positionObj = {
						my: 'left-5 bottom-10',
						at: 'left top',
						of: $(this),
						collision: 'fit'
					}
				}
				if (tooltipPosition === 'right') {
					positionObj = {
						my: 'left+10 center',
						at: 'right center',
						of: $(this),
						collision: 'fit'
					}
				}
			}

			$tooltip.css({
				zIndex: 1 + Math.max.apply(null, $('*:visible').get().map(function (node) { return node.style.zIndex || 0 }))
			}).position(positionObj)//.addClass('active');

			let showTimeout = setTimeout(function () {
				$('.rua-tooltip.active').removeClass('active')
				$tooltip.addClass('active')
			}, 1000)
			$tooltip.data('showTimeout', showTimeout)
		}
	})

	$(document).on('mouseover', '.rua-tooltip.active', function () {
		stopHideTimeout($(this))
	})

	$(document).on('mouseleave', '.rua-tooltip.active', function () {
		startHideTimeout($(this))
	})

	$(document).on('mouseleave', '[data-tooltip]', function () {
		let $tooltip = $($(this).attr('data-tooltip'))
		if (!$tooltip.size()) return
		let showTimeout = $tooltip.data('showTimeout')
		if (showTimeout) {
			clearTimeout(showTimeout)
		}
		startHideTimeout($tooltip)
	})
})
