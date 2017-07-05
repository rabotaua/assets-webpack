$(document).ready( setTimeout(calcSymbolPosition, 500) );
$(window).on('resize', calcSymbolPosition)

$('.f-rubrics-innertabs-item.-on_click_hide_boldtitleicon').on('click', 'a', () => {
    $('.f-boldsymboltitle .fi-logo-symbol').removeClass('-show');
    setTimeout(calcSymbolPosition, 100);
});

function calcSymbolPosition() { 
    $('.f-boldsymboltitle span').each((index, el) => {
        const titleWidth = $(el).width();
        $(el).siblings('.fi-logo-symbol').css('left', titleWidth).addClass('-show');
    })
}