/* global SetValidationControl, vh */

import 'sticky-kit/dist/sticky-kit.min'


ukrainian = ukrainian || false;

// sticky menu

$('.profile-info-container').attr('data-sticky_parent', '');
$('.profile-anchor-container').attr('data-sticky_column', '');
$('.profile-anchor-list').attr('data-sticky_column', '');

$('.profile-anchor-list').stick_in_parent({
    offset_top: 63
});

const saveChangesNotification = $('.js-save-changes');


$('.f-main-wrapper.-profile, .f-paper-admin').on('change keyup', 'input, select, textarea', function () {
    saveChangesNotification.addClass('toggleUp');
})
$('button[id$="hprLnkDeleteLogo"]').on('click', () => saveChangesNotification.addClass('toggleUp'));

// EVENTS

const payerName = $('.js-payer-name');
const isSameNameInput = $('.js-is-same-name');
const addInternalPhoneInp = $('.js-add-internal-phone');
const internalPhone = $('.js-profile-internal-phone');

function slideBlock(input, block) {
    input.change(function () {
        block.slideToggle(200);
        if (block === internalPhone) {
            block.find('input').val('');
        }
    })
}

slideBlock(isSameNameInput, payerName);
slideBlock(addInternalPhoneInp, internalPhone);


const additionalPhoneInp = $('.js-additional-phone-inp');
const additionalPhoneBlock = $('.js-additional-phone');
const addAdditionalPhoneBtn = $('.js-add-phone a');

addAdditionalPhoneBtn.click(function (e) {
    e.preventDefault();
    $(this).parent().addClass('hdn');
    additionalPhoneBlock.slideToggle(200);
});

const inpForTextarea = $('.js-disable-textarea');
const autoReplyText = $('.js-txtAutoReply');

$('.js-setReply').click(function (e) {
    e.preventDefault();
    if (ukrainian) {
        autoReplyText.val("Дякую за відгук на вакансію. \nМи обов'язково розглянемо вашу кандидатуру і, у випадку позитивного рішення, зв'яжемося з вами, щоб домовитися про співбесіду.")

    } else {
        autoReplyText.val('Спасибо за отклик на вакансию.\nМы обязательно рассмотрим вашу кандидатуру и, в случае положительного решения, свяжемся с вами, чтобы договориться о собеседовании.');
    }
});

inpForTextarea.change(function () {
    if (event.target.checked) {
        autoReplyText.removeAttr('disabled', 'disabled');
    } else {
        autoReplyText.attr('disabled', 'disabled');
    }
})

// file upload buttons

$('.js-upload-file-btn').click(function () {
    $('.js-upload-file-input').trigger('click');
})

$('.js-upload-file-input').change(function () {
    var filename = $(this).val().split('\\').pop();
    $('.js-code-file-name').html(filename);
})

$('.js-upload-logo-btn').click(function () {
    $('.js-upload-logo-input').trigger('click');
})

$('.js-upload-logo-input').change(function () {
    var filename = $(this).val().split('\\').pop();
    if (filename.indexOf(' ') > 0) {
        filename = filename.replace(/\s+/g, '-');
    }
    $('.js-logo-file-name').html(filename);
})


// popups

const changeMailBtn = $('.js-change-email');
const changePasswordBtn = $('.js-change-password');
const changeNameBtn = $('.js-change-name');
const changeMailPopup = $('.js-change-mail-popup');
const changePasswordPopup = $('.js-change-password-popup');
const changeNamePopup = $('.js-change-name-popup');
const closePopupBtn = $('.js-profile-popup-close');

function initPopup(elem) {
    elem.dialog({
        width: 380,
        autoOpen: false
    });
}

function openPopup(button, popup) {
    button.click(function (e) {
        e.preventDefault();
        popup.dialog('open');
    })
}

function closePopup(elem) {
    closePopupBtn.click(function (e) {
        e.preventDefault();
        elem.dialog('close');
    })
}

initPopup(changeMailPopup);
initPopup(changePasswordPopup);
initPopup(changeNamePopup);

openPopup(changeMailBtn, changeMailPopup);
openPopup(changePasswordBtn, changePasswordPopup);
openPopup(changeNameBtn, changeNamePopup);

closePopup(changeMailPopup);
closePopup(changePasswordPopup);
closePopup(changeNamePopup);

// company description

const countValue = $('.js-comp-descript-count');
const descriptTextarea = $('.js-company-descript');

function setSymbCount() {
    const descript = descriptTextarea.val() != undefined ? descriptTextarea.val().length : '';

    countValue.html(descript);
    descriptTextarea.keyup(function () {
        countValue.html(($(this).val()).length);
    })
}

setSymbCount();

descriptTextarea.on('keypress paste', function (e) {
    if ($(this).val().length >= 255) {
        e.preventDefault();
    }
})

// citypicker
const inpCity = $('input[id$="inpCity"]');
const cityPicker = $('.js-profile-citypicker');

$('.js-no-office').on('change', function () {
    let hdnCityID = $('input[id$="hdnCityID"]');

    if (event.target.checked) {
        hdnCityID.val('34');

        inpCity.attr('disabled', 'disabled')
        cityPicker.addClass('disabled');

        if (ukrainian) {
            inpCity.val('Інші країни')
        } else {
            inpCity.val('Другие страны')
        }

    } else {
        hdnCityID.val('0');
        inpCity.removeAttr('disabled', 'disabled')
        cityPicker.removeClass('disabled');

        if (ukrainian) {
            inpCity.val('Всі регіони')
        } else {
            inpCity.val('Все регионы')
        }
    }
});

inpCity.on('autocompletechange autocompleteclose', function () {
    let valid = $('input[id$="hdnCityID"]').val() !== '0';
    if (valid) {
        saveChangesNotification.addClass('toggleUp');
    }
    SetValidationControl($('div[id$="pnlCityPicker"]').attr('id'), vh.msg.required, valid);
});

// notifications init

$('.profile-changes-saved-close').click(function () {
    $('.profile-changes-saved > div').slideUp(500);
    $('.profile-error > div').slideUp(500);
})

// navigation init

const profileAnchorLink = $('.js-profile-anchor');

profileAnchorLink.click(function (e) {
    profileAnchorLink.removeClass('active');
    $(this).addClass('active');
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 60
    }, 800);
    e.preventDefault();
})

function onScroll() {

    var scrollPos = $(document).scrollTop() + 100;
    var lastElem = profileAnchorLink[profileAnchorLink.length - 1];

    profileAnchorLink.each(function () {
        var currLink = $(this);

        var refElement = $(currLink.attr('href'));

        if (currLink.attr('href') != $(lastElem).attr('href') && refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            profileAnchorLink.removeClass('active');
            currLink.addClass('active');
        }
        else if (currLink.attr('href') === $(lastElem).attr('href') && refElement.position().top + refElement.outerHeight() + 250 < $(window).scrollTop() + $(window).height()) {
            profileAnchorLink.removeClass('active');
            currLink.addClass('active');
        }
        else {
            currLink.removeClass('active');
        }
    });
}

$(document).on('scroll', onScroll);

// select autowidth hack
const positionInput = $('.js-position');
const positionHackSelect = $('.js-position-hackselect');

function selectAutoWidth() {
    positionHackSelect.find('option:first').text(positionInput.find('option:selected').text());
    positionInput.css('width', positionHackSelect.width() + 90);
}

selectAutoWidth();

positionInput.change(function () {
    selectAutoWidth();
});


$(document).ready(function () {
    const companyName = $('.js-company-name');

    if (payerName.find('input').val() !== companyName.html()) {
        payerName.removeClass('hdn');
        isSameNameInput.attr('checked', 'checked')
    }

    if (inpForTextarea.is(':checked')) {
        autoReplyText.removeAttr('disabled', 'disabled');
    } else {
        autoReplyText.attr('disabled', 'disabled');
    }

    if (additionalPhoneInp.val()) {
        additionalPhoneBlock.removeClass('hdn');
        addAdditionalPhoneBtn.addClass('hdn');
    }

    if (inpCity.val() === 'Другие страны' || inpCity.val() === 'Інші країни') {
        $('.js-no-office').attr('checked', 'checked');
        cityPicker.addClass('disabled');
        inpCity.attr('disabled', 'disabled')
    }

    $('.js-change-password').on('click', () => $('input[id$="hdnFldPasswordChanged"]').val('changed'));
    $('.js-change-email').on('click', () => $('input[id$="hdnFldLoginChanged"]').val('changed'));

    if ($('input[id$="txtInternal"]').val() || $('input[id$="txtInnerPhone"]').val()) {
        $('.js-add-internal-phone').attr('checked', 'checked');
        $('.js-profile-internal-phone').removeClass('hdn');
    }
});
