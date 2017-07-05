/* global vh SetValidationControl*/

let ukrainian = window['ukrainian'] || false;
function validateEmail(event) {
    let val = $('input[id$="txtNewEmail"]').val().trim().toLowerCase();
    let alertBox = $('#notValidDomain');

    let isValid = true, message = '';

    if (!vh.isValid.email(val)) {
        isValid = false;
        message = val ? vh.msg.wrong_format : vh.msg.required
    }

    if (['mail.ru', 'list.ru', 'bk.ru', 'inbox.ru', 'mail.ua', 'yandex.ru', 'yandex.ua'].some(d => val.indexOf(d) !== -1)) {

        message = ukrainian ? 'Не відповідає вимогам' : 'Не соответсвует требованиям';
        isValid = false;
        alertBox.show()
    } else {
        alertBox.hide()
    }


    SetValidationControl('dvNewEmail', message, isValid);
    if (!isValid) {
        event.preventDefault()

    }
}

$('input[id$="txtNewEmail"]').on('blur', validateEmail);

$('input[id$="btnOk"]').on('click', validateEmail);

$('input[id$="lnkResend"]').on('click', validateEmail);