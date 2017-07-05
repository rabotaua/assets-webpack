$(document).ready(() => {
    if ($('#rec_vacs_var_a').is(':visible') || $('#rec_vacs_var_b').is(':visible')) {
        _gaq.push(['_trackEvent', 'recommended-vacancies', 'show']);
        $('.f-vac-block-item__title').on('click', () => {
            _gaq.push(['_trackEvent', 'recommended-vacancies', 'vac_click']);
        });
    }
});