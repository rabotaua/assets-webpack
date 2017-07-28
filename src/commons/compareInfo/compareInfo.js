/* global SetValidationControl */

import { h, render } from 'preact'
import jsCookie from 'js-cookie'
import ComparisonCandidates from '../../shared-components/ComparisonCandidates/ComparisonCandidates.jsx'
import { dictionary, getCompareParamsHelper } from '../../shared-components/ComparisonCandidates/helpers'
let {apiUrl: api, ukrainian, vacancyId, applyId, attach} = ruavars

export default function initializeCompareInfo() {
	if(parseInt(jsCookie.get('appHistorySkipCount')) === 3) {
		$(document).ready(() => {
			// $('.compare-info-container').css('opacity', 0)
			// setTimeout(() => {
			// 	$('.compare-info-skip-button').trigger('click')
			// }, 250)
		})
	}

	const mappedParams = window.location.search.slice(1).split('&').reduce((obj, param) => {
		const [key, value] = param.split('=')
		obj[key] = value
		return obj
	}, {})

	try {
		applyId = applyId || JSON.parse(mappedParams.applyId)
		vacancyId = vacancyId || JSON.parse(mappedParams.vacancyId)
		attach = attach || JSON.parse(mappedParams.attach)
	//	Parsing values here is necessary because we must be sure that appropriate param presents in query string
	} catch (e) {
		if (!applyId || !vacancyId || !attach) {
			console.log(`Some of required parameters is not provided: ${e.message}`)
		} else {
			throw new ReferenceError(`You've got an error`)
		}
	}


	let salaries, experiences

	const defaultOptionText = ukrainian ? 'Оберіть варіант відповіді' : 'Выберите вариант ответа'

	const salaryForm = $('.compare-info-form #salary')
	const experienceForm = $('.compare-info-form #experience')

	const setOptionsToLocalStorage = (selectedSalaryId, selectedExperienceId) => {
		try {
			localStorage.setItem('appHistorySelectedSalaryId', selectedSalaryId)
			localStorage.setItem('appHistorySelectedExpId', selectedExperienceId)
		} catch(e) { /* nothing */ }
	}

	const optionIsSelected = (type, id) => {
		if( !type || !id ) return false

		try {
			return parseInt(localStorage.getItem(type)) === id
		} catch(e) { return false }
	}

	const successExperienceCallback = response => {
		experiences = response
		experienceForm.append(`<option value="0">${defaultOptionText}</option>`)
		experiences.forEach(item => {
			const text = ukrainian ? item.ua : item.ru

			experienceForm.append(
				`<option value="${item.id}" ${optionIsSelected('appHistorySelectedExpId', item.id) ? 'selected' : ''}>
					${text}
				</option>`
			)
		})
	}

	const successSalaryCallback = response => {
		salaries = response
		salaryForm.append(`<option value="0">${defaultOptionText}</option>`)
		salaries.forEach(item => {
			const text = ukrainian ? item.ua : item.ru
			salaryForm.append(
				`<option value="${item.id}" ${optionIsSelected('appHistorySelectedSalaryId', item.id) ? 'selected' : ''}>
					${text}
				</option>`
			)
		})
	}

	const errorExperienceCallback = error => console.log(error.statusText)

	const errorSalaryCallback = error => console.log(error.statusText)

	const getCompareInfoHelper = (salaryId, experienceId) => {
		return $.ajax({
			method: 'POST',
			url: `${api}/account/jobsearch/statusapplication`,
			data: {
				vacancyId,
				salaryId,
				experienceId,
				applyId,
				attach
			}
		})
	}


	$.ajax({
		method: 'GET',
		url: `${api}/vacancy?id=${vacancyId}`
	}).success(response => {
		if (response && response.hasOwnProperty('isActive') && !response.isActive) {
			$('.f-vacancy-afterapply__leftwrapper, .f-vacancy-afterapply__rightwrapper, .closed-vacancy-notification, .f-back-to-results').fadeToggle(100)
			return
		}
		$.when(getCompareParamsHelper('experience', successExperienceCallback, errorExperienceCallback), getCompareParamsHelper('salary', successSalaryCallback, errorSalaryCallback))
			.done(() => {
				$('.compare-info-container').removeClass('hidden-after-apply-block')
			}).fail(error => console.log(error.statusText))

		const invalidSalarySelectMessage = ukrainian ? 'Вкажіть зарплатню' : 'Укажите зарплату'
		const invalidExperienceSelectMessage = ukrainian ? 'Вкажіть досвід' : 'Укажите опыт'

		// $('.compare-info-skip-button').click(() => {

		// 	const skipKey = 'appHistorySkipCount'
		// 	const skipCountValue = parseInt(jsCookie.get(skipKey) || 0)

		// 	if(skipCountValue < 3) {
		// 		jsCookie.set(skipKey, skipCountValue + 1, { expires: 90 })
		// 	}

		// 	if (skipCountValue === 3) {
		// 		jsCookie.set(skipKey, 3, { expires: 14 })
		// 	}

		// 	if (skipCountValue > 3) {
		// 		jsCookie.remove(skipKey)
		// 	}

		// 	$('.compare-info-container').addClass('move_left_animation').fadeOut(200)
		// 	$('.f-vacancy-afterapply__leftwrapper, .f-vacancy-afterapply__rightwrapper').fadeIn(400);
		// 	$('.f-back-to-results').delay(200).fadeIn(400)
		// })

		$('.compare-info-get-button a').click((e) => {
			e.preventDefault()
			e.stopPropagation()

			const isSalaryInputValid = validateCompareSelect(salaryForm, invalidSalarySelectMessage)
			const isExperienceInputValid = validateCompareSelect(experienceForm, invalidExperienceSelectMessage)
			if (!isExperienceInputValid || !isSalaryInputValid) return

			if ($('.js-compare-info-form').hasClass('ui-dialog-content')) {
				$('.js-compare-info-form').dialog('close')
			}

			const selectedSalaryId = +salaryForm.val()
			const selectedExperienceId = +experienceForm.val()

			/* remember options ids to localStorage */
			setOptionsToLocalStorage(selectedSalaryId, selectedExperienceId)

			getCompareInfoHelper(selectedSalaryId, selectedExperienceId).success(response => {
				const {salary, experience, complete} = response

				if (!salary || !experience || !complete) {
					render(
						h(ComparisonCandidates, {showInsufficientData: !complete, dictionary}),
						document.getElementById('compare-candidates')
					)

					// $('.compare-info-container').fadeOut(200)
					$('.compare-candidates-container').show()
					$('#compare-candidates').show()
					$('.compare-candidates-title').hide()
					$('.compare-info-container').hide()

					$('.f-vacancy-afterapply__leftwrapper, .f-vacancy-afterapply__rightwrapper, .f-back-to-results')
						.delay(100)
						.slideDown(300)

					$('#compare-candidates').addClass('unsuff')
					return
				}
				const selectedSalary = salaries.filter(salary => salary.id === selectedSalaryId)[0]

				const selectedSalaryText = ukrainian ? selectedSalary.ua : selectedSalary.ru
				const selectedExperience = experiences.filter(experience => experience.id === selectedExperienceId)[0]
				const selectedExperienceText = ukrainian ? selectedExperience.ua : selectedExperience.ru

				const props = {
					collapseView: false,
					dictionary,
					showInsufficientData: !complete,
					salary: {
						parts: salary,
						text: selectedSalaryText
					},
					experience: {
						parts: experience,
						text: selectedExperienceText
					}
				}

				render(
					h(ComparisonCandidates, props),
					document.getElementById('compare-candidates')
				)

				// $('.compare-info-container').fadeOut(200)
				$('.compare-candidates-container').show()
				$('.compare-info-container').hide()

				$('.f-vacancy-afterapply__leftwrapper, #compare-candidates, .compare-candidates-title, .f-vacancy-afterapply__rightwrapper, .f-back-to-results')
					.delay(100)
					.slideDown(300)
			})
		})

		salaryForm.change(validateCompareSelect.bind(null, salaryForm, invalidSalarySelectMessage))
		experienceForm.change(validateCompareSelect.bind(null, experienceForm, invalidExperienceSelectMessage))

		salaryForm.blur()
		experienceForm.blur()

		function addRotateClass(select) {
			$(select).closest('.f-input-block').find('.fi-drop-down-icon').addClass('default-rotate')
		}

		function removeRotateClass(select) {
			$(select).closest('.f-input-block').find('.fi-drop-down-icon').removeClass('default-rotate')
		}

		salaryForm.focus(function () {
			removeRotateClass(this)
		})
		experienceForm.focus(function () {
			removeRotateClass(this)
		})

		function validateCompareSelect(select, message) {
			const isValid = !!+select.val()
			const errorDiv = select.closest('.f-input-block')
			SetValidationControl(errorDiv.attr('id'), message, isValid)
			addRotateClass(select)
			select.blur()
			return isValid
		}
	}).fail(error => console.log(error.statusText))
}
