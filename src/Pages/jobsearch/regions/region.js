(() => {

	const tabsList = $('.f-rubrics-innerpaddings.-citypage .f-rubrics-innertabs-item');

	$('.f-rubrics-innertabs-item').on('click', '[data-tab]', function(event) {
		event.preventDefault();
		
		let clickedTab = event.delegateTarget;

		// toggle tab
		$(tabsList).removeClass('-activetab');
		$(clickedTab).addClass('-activetab');

		// toggle block with content
		const newShowContent = $(this).attr('data-tab');
		$('.f-citypage-listby-listwrap').removeClass('-show');
		$(`.f-citypage-listby-listwrap.-${newShowContent}`).addClass('-show');
	});


	// fade-in effect for city pic
	$(document).ready(function() {
		setTimeout(() => $('.f-citypage-photocityblock').addClass('-isloaded'), 100);
		
		// change AD-block for CityPage (Работа находит вас сама)
		$('#adv_block').html( $('#city_banner_adv').html() );
	});
})()