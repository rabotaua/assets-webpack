/* global vh */


import emailOracle from '../../../commons/email-oracle'



const changeRecommendedTooltip = (recommendedEmail, isShow) => {
	const tooltip = $('.recommended-email-tooltip')
	$(tooltip).css('display', isShow ? 'block' : 'none')
	$(tooltip).find('p').text(recommendedEmail)

if (isShow) {
	_gaq.push(['_trackEvent', 'email_validation', 'tooltip_show']);
}
}

$(document).ready(() => {

	let prevVal = null
	let similarEmail = null
	const selectLangVal = parseInt($('.form-inline select').val())

	const errorMessages = {
		1: 'Возможно вы имели в виду: ',
		2: 'Maybe you meant: ',
		3: 'Можливо ви мали на увазі: '
	}

	// append div of suggest
	$('#dvEmail').append(`
		<div class="recommended-email-tooltip" style="display: none;">
			${errorMessages[selectLangVal]}
			<p></p>
		</div>
	`)

	$('.txtEmail').on('blur', function() {

		const emailVal = $(this).val().trim()

		if (!vh.isValid.email(emailVal)) {
			changeRecommendedTooltip('', false)
			return
		}

		if (emailVal.length && emailVal !== prevVal) {
			const checkEmail = emailOracle.findMisprints(emailVal)

			if (emailVal !== checkEmail && checkEmail) {
				similarEmail = checkEmail
				changeRecommendedTooltip(checkEmail, true)
				return
			}

			changeRecommendedTooltip('', false)
		}
	})

	$('.recommended-email-tooltip p').on('click', () => {
		$('.txtEmail').val(similarEmail)
		changeRecommendedTooltip('', false)

		_gaq.push(['_trackEvent', 'email_validation', 'tooltip_сlick', similarEmail.toLowerCase().split('@')[1]]);
	})

})