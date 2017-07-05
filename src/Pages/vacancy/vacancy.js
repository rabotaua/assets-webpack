import './vacancy_cv_header.js'
import './grab_vacancies_stat.js'
import '../../commons/recommendator.js'
import initializeCompareInfo from '../../commons/compareInfo/compareInfo'
//Preact dependencies


// RUA vars
const { ukrainian } = ruavars

export function togglAdditionalLinks() {
	$('.f-additional-links-title, .f-share').click(function() {
		$(this).closest('.f-additional-links').find('.f-additional-links-holder').toggleClass('active')
		$(this).find('.fi-drop-down-icon').toggleClass('up')
	})

	$(document).click(function(e) {
		let target = $('.f-additional-links-title, .f-share')
		if (e.target != target[0] && !target.has(e.target).length) {
			$('.f-additional-links-title, .f-share').find('.fi-drop-down-icon').removeClass('up')
		}
	})

	$('.f-share .f-share-title').click(function() {
		$('.f-share .f-tooltip').toggleClass('active')
	})

	$('body').click(function(e) {
		if ($(e.target).closest('.f-additional-links-title').length) {
			$('.f-share .f-share-holder').removeClass('active')
			return
		}
		if ($(e.target).closest('.f-share-title').length) {
			$('.f-additional-links .f-additional-links-holder').removeClass('active')
			return
		}
		if (!$(e.target).closest('.f-additional-links-holder').length) {
			$('.f-additional-links .f-additional-links-holder').removeClass('active')
		}
		if (!$(e.target).closest('.f-share-holder').length) {
			$('.f-share .f-share-holder').removeClass('active')
		}
	})
}

togglAdditionalLinks()

let fileUpload = $('#spFile .resume_file')

fileUpload.change(function() {
	let index = this.value.lastIndexOf('\\') + 1
	let value = this.value.substring(index)
	$(this).closest('label').find('span:last-of-type').text(value)
	if (this.value) {
		$(this).closest('label').addClass('f-attached').find('span:first-of-type').css('display', 'none')
	} else {
		$(this).closest('label').removeClass('f-attached').find('span:first-of-type').css('display', 'initial')
	}
})

$('#spFile label').click(function(e) {
	if ($(e.target).hasClass('fi-close-big')) {
		$(this).removeClass('f-attached').find('.resume_file').val('')
		$(this).find('span:first-of-type').css('display', 'initial')
		$(this).find('span:last-of-type').text('')
		e.preventDefault()
	}
})


// GA Events
$('.plhSendButton').on('click', (e) => {
	e.stopPropagation()

	if ($(e.target).hasClass('-ontop')) {
		if ($('.f-vacancy-actionbar').hasClass('-pin')) {
			_gaq.push(['_trackEvent', 'vacancy', 'vac_apply_nav']) // if top btn is PIN
		} else {
			_gaq.push(['_trackEvent', 'vacancy', 'vac_apply_under']) // top btn
		}
	}
	else {
		_gaq.push(['_trackEvent', 'vacancy', 'vac_apply_bottom']) // bottom btn
	}
})


$(document).ready(function() {
	if ($('.f-vacancy-wrapper .f-apply-cv-container').length) {
		$('.f-vacancy-inner-wrapper').css('boxShadow', '0 2px 2px 0 rgba(0, 0, 0, 0.2)')
	}
})


jQuery(document).ready($ => {
	jQuery('.attach_list.radio input:radio:first').prop('checked', true)

	if (location.search.indexOf('mode=apply') !== -1) {
		_gaq.push(['_trackEvent', 'apply_form_show', 'show_form', $('form.authorized').size() > 0 ? 'logged' : 'notlogged', 1, true])
	}

	return // disable

	if (window.location.search.match(/apply/)) return

	const days = [
		ukrainian ? 'неділя' : 'воскресенье',
		ukrainian ? 'понеділок' : 'понедельник',
		ukrainian ? 'вівторок' : 'вторник',
		ukrainian ? 'середа' : 'среда',
		ukrainian ? 'четвер' : 'четверг',
		ukrainian ? 'п&rsquo;ятниця' : 'пятница',
		ukrainian ? 'субота' : 'суббота'
	]

	const categoryNames = {
		1: 'Тайм-менеджмент',
		2: 'Ораторское мастерство',
		3: 'Лидерство',
		4: 'Психология отношений',
		5: 'Карьера',
		6: 'Управление людьми',
		7: 'Управлением проектами',
		8: 'Английский язык',
		9: 'Креативность',
		10: 'Книги',
		11: 'Подкаст rabota.ua'
	}

	const categoryIcons = {
		1: 'fi-m-time-menegement',
		2: 'fi-m-megafon',
		3: 'fi-m-leader',
		4: 'fi-m-friendship',
		5: 'fi-m-carreer',
		6: 'fi-m-people',
		7: 'fi-m-project',
		8: 'fi-m-english',
		9: 'fi-m-creative',
		10: 'fi-m-books',
		11: 'fi-m-microphone'
	}

	$.getJSON('https://blog.rabota.ua/?feed=eventsFeed').then(data => {
		if (!data || !data.length) return

		let items = data.slice(0, 3).map(item => {
			let { url, title, date } = item
			let dateObj = new Date(date)
			let day = days[dateObj.getDay()] || ''


			return `
                <p>
                    <span style="display: block;margin:0">
                        <i class="fi-calendar"></i>
                        <span class="fd-beefy">${date}</span>
                        <span class="f-text-gray">${day}</span>
                    </span>
                    <a style="margin-top:5px;margin-bottom:0" class="f-vacancy-link f-text-royal-blue" href="${url}" target="_blank">${title}</a>
                </p>
            `
		}).join('')

		let html = `
            <div class="seo_block">
                <h2 class="fd-thin-gunso f-text-black">${ukrainian ? 'Інші можливості' : 'Другие возможности'}</h2>
                <div>${items}</div>
                <p class="last">
                    <a href="http://blog.rabota.ua/events/" class="f-btn-control-royal-blue-link fd-beefy-merchant fd-text-uppercase">
                        ${ukrainian ? 'Всі можливості' : 'Все возможности'}
                        <i class="fi-arrows-right-big"></i>
                    </a>
                </p>
            </div>
        `

		$('.f-seo-block-right').append(html)
	})

	$.getJSON('https://blog.rabota.ua/?feed=postsFeed').then(data => {
		if (!data || !data.length) return

		data = data.filter(i => i.title && i.subtitle)
		if (!data || !data.length) return

		let item = data[Math.floor(Math.random() * data.length)]
		let { url, title, subtitle, category } = item
		let moreLinkText = item.category === '11' ? (ukrainian ? 'Слухати' : 'Слушать') : (ukrainian ? 'Читати' : 'Читать')
		let categoryName = categoryNames[category] || (ukrainian ? 'Новини' : 'Новости')
		let categoryIcon = categoryIcons[category] || 'fi-m-books'

		let html = `
            <div class="seo_block">
                <h2 class="fd-thin-gunso f-text-black">${ukrainian ? 'Читайте і слухайте' : 'Читайте и слушайте'}</h2>
                <div>
                    <p>
                        <span class="fd-beefy-soldier" style="display: block;margin:0">
                            <i class="${categoryIcon}"></i>
                            ${categoryName}
                        </span>
                        <a style="margin-top:10px;margin-bottom:0" class="f-vacancy-link f-text-royal-blue" href="${url}" target="_blank">${title}</a>
                        <span class="fd-craftsmen f-text-gray">
                            ${subtitle}
                        </span>
                    </p>
                </div>
                <p class="last">
                    <a href="${url}" class="f-btn-control-royal-blue-link fd-beefy-merchant fd-text-uppercase">
                        ${moreLinkText}
                        <i class="fi-arrows-right-big"></i>
                    </a>
                </p>
            </div>
        `

		$('.f-seo-block-right').append(html)
	})
})

//Compare info block

jQuery(document).ready(() => {
	initializeCompareInfo();
})
