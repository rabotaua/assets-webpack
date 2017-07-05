import '../controls/templates/header'
import '../controls/common/tooltips.js'
import './jqueryui'
import './more_tags'
import './hash_scroll_top'
import '../controls/common/boldsymbol_position.js'

window.SetValidationControl = (errorDiv, message, isvalid) => {
    const wrapper = document.getElementById(errorDiv)
    if (!wrapper) return

    if (isvalid !== true) {
        let span = wrapper.querySelector('span.error-message')
        if (!span) {
            span = document.createElement('SPAN')
            span.className = 'error-message'
            wrapper.appendChild(span)
        }

        span.innerHTML = message
        wrapper.classList.add('error')
    } else {
        wrapper.classList.remove('error')
    }
}

//Show/hide captcha at vacancy list page
$('.job_alert_sidebar .dvEmail input').focus(function () {
    $('.job_alert_sidebar .job_alert_sidebar__captcha').css('display', 'block');
});