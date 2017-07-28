import cookies from 'js-cookie'


$(document).ready(() => {
	if(!cookies.get('cvsHideCounter')) {
		$('.f-wait-feedback').insertBefore('.rua-l-wrapper')
		$('.f-wait-feedback').addClass('-show')
	}
	else {
		return false
	}

	$('.f-wait-feedback__close').on('click', () => {
		cookies.set('cvsHideCounter', true, { expires: 14 })
		$('.f-wait-feedback').removeClass('-show')
	})
})
