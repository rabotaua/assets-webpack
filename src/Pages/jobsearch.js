// RUA-15257
(window.Image ? (new Image()) : document.createElement('img')).src = location.protocol + '//vk.com/rtrg?r=KSWXyYIUo92U3NpMwbPdjk2VTtSQt*LEQf6NWowNdTiVJ9xvBulQPIS1XpRBdv3oLc1opogDx80wXWW0SHZyPDHEoAJD02BO0toXZyfymutQ2b54yosZmxULbQTEjWypZJ4T6OFNtPDs*DAW7XkfFZUDM/zUTuju9o6T9vu0Z/c-';


// RUA-15311
window._retag = window._retag || [];
window._retag.push({code: "9ce8886123", level: 0});
(function () {
    var id = "admitad-retag";
    if (document.getElementById(id)) {
        return;
    }
    var s = document.createElement("script");
    s.async = true;
    s.id = id;
    var r = (new Date).getTime();
    s.src = (document.location.protocol == "https:" ? "https:" : "http:") +
        "//cdn.admitad.com/static/js/retag.min.js?r=" + r;
    var a = document.getElementsByTagName("script")[0]
    a.parentNode.insertBefore(s, a);
})()


$('.f-searchby > .f-input').click(function () {
    $(this).closest('.f-seo-tabs').addClass('f-paper');
    $('.f-rubrics-innerpaddings > .fi-close-big').css('display', 'block');
    $(this).find('i.fi-drop-down-icon').addClass('up');
    $(this).siblings().find('i.fi-drop-down-icon').removeClass('up');

    switch ($(this).data('search-category')) {
        case 'rubrics':
            if (!$('.f-seo-tabs .f-rubrics-container > div.f-rubrics-itemsblock:first-of-type').hasClass('active')) {
                $('.f-seo-tabs .f-rubrics-container > div').removeClass('active');
                $('.f-seo-tabs .f-rubrics-container > div.f-rubrics-itemsblock:first-of-type').addClass('active');
                $('.f-seo-tabs-footer').css('display', 'none');
                $('.f-seo-tabs').removeClass('f-all-cities');
            } else {
                $('.f-seo-tabs .f-rubrics-container > div').removeClass('active');
                $(this).find('i.fi-drop-down-icon').removeClass('up');
                closeSeoTabs();
                $('.f-seo-tabs .fi-close-big').css('display', 'none');
            }
            break;
        case 'cities':
            if (!$('.f-seo-tabs .f-rubrics-container > div.f-rubrics-itemsblock:nth-of-type(2)').hasClass('active')) {
                $('.f-seo-tabs .f-rubrics-container > div').removeClass('active');
                $('.f-seo-tabs .f-rubrics-container > div.f-rubrics-itemsblock:nth-of-type(2)').addClass('active');
                $('.f-seo-tabs-footer').css('display', 'block');
                $('.f-seo-tabs-footer > a.f-btn-control-default:last-of-type').css('display', 'none');
                $('.f-seo-tabs').addClass('f-all-cities');
            } else {
                $('.f-seo-tabs .f-rubrics-container > div').removeClass('active');
                $(this).find('i.fi-drop-down-icon').removeClass('up');
                closeSeoTabs();
                $('.f-seo-tabs .fi-close-big').css('display', 'none');
            }
            break;
        case 'popular':
            if (!$('.f-seo-tabs .f-rubrics-container > div.f-rubrics-itemsblock:last-of-type').hasClass('active')) {
                $('.f-seo-tabs .f-rubrics-container > div').removeClass('active');
                $('.f-seo-tabs .f-rubrics-container > div.f-rubrics-itemsblock:last-of-type').addClass('active');
                $('.f-seo-tabs-footer').css('display', 'block');
                $('.f-seo-tabs-footer > a.f-btn-control-default:last-of-type').css('display', 'inline-flex');
                $('.f-seo-tabs').removeClass('f-all-cities');
            } else {
                $('.f-seo-tabs .f-rubrics-container > div').removeClass('active');
                $(this).find('i.fi-drop-down-icon').removeClass('up');
                closeSeoTabs();
                $('.f-seo-tabs .fi-close-big').css('display', 'none');
            }
            break;
    }
})

function closeSeoTabs() {
    $('.f-seo-tabs').removeClass('f-paper');
    $('.f-seo-tabs .f-rubrics-container > div').removeClass('active');
    $('.f-seo-tabs-footer').css('display', 'none');
    $('.f-seo-tabs i.fi-drop-down-icon').removeClass('up');
}

$('.f-rubrics-innerpaddings > .fi-close-big').click(function () {
    closeSeoTabs();
    $(this).css('display', 'none');
});

$(document).click(function (e) {
    var seoTabs = $('.f-seo-tabs');
    if (e.target != seoTabs[0] && !seoTabs.has(e.target).length) {
        closeSeoTabs();
        $('.f-rubrics-innerpaddings > .fi-close-big').css('display', 'none');
    }
});



// GA events for recommended vacancies block on main-page
$(document).ready(() => {
	$('#rec_vacs_var_a, #rec_vacs_var_b').on('click', '.f-vac-block-item__title', () => {
		try {
			_gaq.push(['_trackEvent', 'home', 'home_vac_recomend_click ']);
		}
		catch(e) { console.log(e) }
	})

	if( $('#rec_vacs_var_a').is(':visible') || $('#rec_vacs_var_b').is(':visible') ) {
		try {
			_gaq.push(['_trackEvent', 'home', 'home_vac_recomend_block_show ']);
		}
		catch(e) { console.log(e) }
	}

	$('.ga-vacrec-watchall').on('click', () => {
		try {
			_gaq.push(['_trackEvent', 'home', 'home_vac_recomend_show_all ']);
		}
		catch(e) { console.log(e) }
    })
})
