(() => {
	const cityNames = document.querySelectorAll('.f-bigcities-cityname');
	const spanBefore = `<br /><span class="fd-serf f-bigcities-cityname-descr">(`;
	const spanAfter = `)</span>`; 

	for( let i = 0; i < cityNames.length; i++ ) {
		let cityVal = cityNames[i].innerHTML;

		if( cityNames[i].innerHTML.indexOf("(") !== -1 ) {
			cityNames[i].innerHTML = cityVal.replace('(', spanBefore).replace(')', spanAfter);
			cityNames[i].className += ' -withdescr';
		}
	}

    $(document).ready(() => {
        if ($('#rec_vacs_var_a').is(':visible') || $('#rec_vacs_var_b').is(':visible')) {
            _gaq.push(['_trackEvent', 'recommended-ukraine', 'show']);
            $('.f-vac-block-item__title').on('click', () => {
                _gaq.push(['_trackEvent', 'recommended-ukraine', 'vac_click']);
            });
        }
    });
})();