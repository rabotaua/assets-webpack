const cvPanel = $('.f-vacancy-actionbar')

const offsetActionBar = $('.f-vacancy-actionbar').offset().top

const headerIsPinned = () => offsetActionBar < $(window).scrollTop()

const toggleCvPanel = (isShow) => {

    if( location.hash !== '#apply' ) {
        $(cvPanel)[isShow ? 'addClass' : 'removeClass']('-pin')

        // move up header (translateY in css) for hide visibility
        $('.f-header-fixed-wrapper')[isShow ? 'addClass' : 'removeClass']('-move-up-for-hide')

        // fix jump page (because different height)
        $('.js-cvheader-offset').css('padding-top', isShow ? $(cvPanel).outerHeight() : 0) 
    }
}

$(window).on('scroll', () => {
    toggleCvPanel(headerIsPinned() ? true : false)
})