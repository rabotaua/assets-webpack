'use strict'

/* eslint-disable no-unused-vars */
const changeBgClosure = (function () {

    /* eslint-enable no-unused-vars */

   if( window.location.pathname == '/' || window.location.pathname == '/ua' ) {


    // нас заставили это сделать прямо перед корпоративом :СС
    $('head').append(`
        <style>

             body > form {
                -webkit-animation-name: color_change;
                        animation-name: color_change;
                -webkit-animation-duration: 40s;
                        animation-duration: 40s;
                -webkit-animation-iteration-count: infinite;
                        animation-iteration-count: infinite;
                -webkit-animation-direction: alternate;
                        animation-direction: alternate;
                -webkit-animation-delay: 1s;
                        animation-delay: 1s;
             }
             
             @-webkit-keyframes color_change {
                0% { background-color: #f6f3fb }
                25% { background-color: hsl(72, 53%, 91%); }
                50% { background-color: hsl(144, 53%, 91%); }
                75% { background-color: hsl(216, 53%, 91%); }
                100% { background-color: hsl(360, 53%, 91%); }
            }
             
             @keyframes color_change {
                0% { background-color: #f6f3fb }
                25% { background-color: hsl(72, 53%, 91%); }
                50% { background-color: hsl(144, 53%, 91%); }
                75% { background-color: hsl(216, 53%, 91%); }
                100% { background-color: hsl(360, 53%, 91%); }
            }

        </style>
    `);

    return false;

   }


    const bgTargetEl = document.querySelector('body.rua-l-body') || document.querySelector('body > form')
    const classNames = ['f-bg-ultra-lilac', 'f-bg-ultra-turquoise', 'f-bg-ultra-blue', 'f-bg-ultra-blue-gray']
    let currentScreen = 0
    const screenCountChange = 2
    /* count of screens to change BackgroundColor */


    /* eslint-disable no-unused-vars */
    const removeClassByPrefix = function (prefix) {
        let c
        const regex = new RegExp("(^|\\s)" + prefix + "\\S+", 'g')
        c = this.getAttribute('class')
        this.setAttribute('class', c.replace(regex, ''))
    }.bind(bgTargetEl)
    /* eslint-enable no-unused-vars */

    const changeBgColors = () => {
        let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        let screen = Math.round((window.pageYOffset || document.documentElement.scrollTop) / (height * screenCountChange))

        currentScreen = Math.min(screen, classNames.length - 1)

        classNames.forEach(cls => {
            if (bgTargetEl.classList.contains(cls) && cls !== classNames[currentScreen]) {
                bgTargetEl.classList.remove(cls)
            }
        })

        bgTargetEl.classList.add(classNames[currentScreen])
    }

    window.addEventListener('load', () => {
        if (!bgTargetEl.classList.contains(classNames[0])) {
            bgTargetEl.classList.add(classNames[0])
        }

        changeBgColors()
    })

    window.addEventListener('scroll', changeBgColors)
})()