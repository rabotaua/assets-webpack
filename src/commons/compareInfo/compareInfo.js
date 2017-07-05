/* global SetValidationControl */

import { h, render } from 'preact'
const { apiUrl: api, ukrainian, attach, vacancyId, applyId } = ruavars
import ComparisonCandidates from '../../shared-components/ComparisonCandidates/ComparisonCandidates.jsx'
import {dictionary, getCompareParamsHelper} from '../../shared-components/ComparisonCandidates/helpers'

export default function initializeCompareInfo() {

	let salaries, experiences

	const defaultOptionText = ukrainian ? 'Оберіть варіант відповіді' : 'Выберите вариант ответа';

	const salaryForm = $('.compare-info-form #salary')
	const experienceForm = $('.compare-info-form #experience')

	const successExperienceCallback = response => {
		experiences = response
		experienceForm.append(`<option value="0">${defaultOptionText}</option>`)
		experiences.forEach(item => {
			const text = ukrainian ? item.ua : item.ru
			experienceForm.append(`<option value="${item.id}">${text}</option>`)
		})
	}

	const successSalaryCallback = response => {
		salaries = response
		salaryForm.append(`<option value="0">${defaultOptionText}</option>`)
		salaries.forEach(item => {
			const text = ukrainian ? item.ua : item.ru
			salaryForm.append(`<option value="${item.id}">${text}</option>`)
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
		if (!response.isActive) {
			$('.f-vacancy-afterapply__leftwrapper, .closed-vacancy-notification, .f-vacancy-afterapply__rightwrapper, .f-back-to-results').toggleClass('hidden-after-apply-block')
			return;
		}
		$.when(getCompareParamsHelper('experience', successExperienceCallback, errorExperienceCallback), getCompareParamsHelper('salary', successSalaryCallback, errorSalaryCallback))
			.done(() => {
				$('.compare-info-container').removeClass('hidden-after-apply-block')
			}).fail(error => console.log(error.statusText))

		const invalidSalarySelectMessage = ukrainian ? 'Вкажіть зарплатню' : 'Укажите зарплату';
		const invalidExperienceSelectMessage = ukrainian ? 'Вкажіть досвід' : 'Укажите опыт';


		$('.compare-info-skip-button').click(() => {
			$('.compare-info-container, .f-vacancy-afterapply__leftwrapper, .f-vacancy-afterapply__rightwrapper, .f-back-to-results').toggleClass('hidden-after-apply-block')
		})
		$('.compare-info-get-button').click(() => {
			const isSalaryInputValid = validateCompareSelect(salaryForm, invalidSalarySelectMessage);
			const isExperienceInputValid = validateCompareSelect(experienceForm, invalidExperienceSelectMessage);
			if (!isExperienceInputValid || !isSalaryInputValid) return;

			const selectedSalaryId = +salaryForm.val();
			const selectedExperienceId = +experienceForm.val();
			getCompareInfoHelper(selectedSalaryId, selectedExperienceId).success(response => {
				const { salary, experience, complete } = response;
				if (!salary || !experience) {
					render(
						h(ComparisonCandidates, { showInsufficientData: !complete, dictionary }),
						document.getElementById('compare-candidates')
					);
					$('.compare-info-container, .f-vacancy-afterapply__leftwrapper, #compare-candidates, .compare-candidates-title, .compare-candidates-container, .f-vacancy-afterapply__rightwrapper, .f-back-to-results').toggleClass('hidden-after-apply-block')
					$('#compare-candidates').addClass('unsuff');
					return;
				}
				const selectedSalary = salaries.filter(salary => salary.id === selectedSalaryId)[0]

				const selectedSalaryText = ukrainian ? selectedSalary.ua : selectedSalary.ru
				const selectedExperience = experiences.filter(experience => experience.id === selectedExperienceId)[0]
				const selectedExperienceText = ukrainian ? selectedExperience.ua : selectedExperience.ru;

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
				$('.compare-info-container, .f-vacancy-afterapply__leftwrapper, .compare-candidates-container, #compare-candidates, .f-vacancy-afterapply__rightwrapper, .f-back-to-results').toggleClass('hidden-after-apply-block')
			})
		})

		salaryForm.change(validateCompareSelect.bind(null, salaryForm, invalidSalarySelectMessage))
		experienceForm.change(validateCompareSelect.bind(null, experienceForm, invalidExperienceSelectMessage))

		function validateCompareSelect(select, message) {
			const isValid = !!+select.val();
			const errorDiv = select.closest('.f-input-block')
			SetValidationControl(errorDiv.attr('id'), message, isValid);
			return isValid;
		}
	}).fail(error => console.log(error.statusText))
}
