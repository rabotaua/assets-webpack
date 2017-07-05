(() => {

	if( !$('body').hasClass('fedor') || location.hash.length === 0 )
		return false;

	let targetEl = []

	try {
		targetEl = $(location.hash);
	} catch(e) { console.log(e) }

	if( targetEl.length !== 0 ) {
		if( $('.not-fixed-header').length ) return
			
		overriddenScrollTop(targetEl);
	}

	function overriddenScrollTop(el) {
		
		$(document).ready(function($) {
			setTimeout(() => {
				const offsetTop = el.offset().top;
				const headerHeight = $(".f-header-fixed-wrapper").height();
				$(window).scrollTop(offsetTop - headerHeight);
			}, 350)
		});

	}

})()
