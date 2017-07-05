/* global ruavars ko _gaq */

import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/uk'

import {h, render} from 'preact'
import ComparisonCandidates from '../../../shared-components/ComparisonCandidates/ComparisonCandidates.jsx'

jQuery.support.cors = true

const {ukrainian} = ruavars;

ukrainian ? moment.locale('ua') : moment.locale('ru')


const dictionary = {
	header: ukrainian ? 'Статус відправлених резюме' : 'Статус отправленных резюме',
	subheader: ukrainian ? 'відправлених резюме за останні 6 місяців.' : 'отправленных резюме за последние 6 месяцев.',
	viewed: ukrainian ? 'Переглянуто' : 'Просмотрено',
	noData: ukrainian ? 'Немає даних <br> про перегляд' : 'Нет данных <br> о просмотре',
	noDataHeader: ukrainian ? 'Немає даних про перегляд' : 'Нет данных о просмотре',
	decline: ukrainian ? 'Відмова' : 'Отказ',
	invite: ukrainian ? 'Запрошення' : 'Приглашение',
	more: ukrainian ? 'Ще 20' : 'Еще 20',
	recommendedTitle: ukrainian ? 'Відповідні вакансії' : 'Подходящие вакансии',
	status: ukrainian ? 'Cтатус відгуку' : 'Статус отклика',
	moreRecommended: ukrainian ? 'Ще 10 вакансій' : 'Еще 10 вакансий',
	ditails: ukrainian ? 'детальніше' : 'подробнее',
	hide: ukrainian ? 'згорнути' : 'скрыть',
	waitingForResponse: ukrainian ? 'Очікуйте <br> на зворотній зв\'язок <br> від роботодавця' : 'Ожидайте <br> обратной связи <br> от работодателя',
	invited: ukrainian ? 'Роботодавець <br> відправив <br> запрошення на <br> співбесіду' : 'Работодатель <br> отправил <br> приглашение на <br> собеседование',
	declined: ukrainian ? 'Роботодавець <br> не готовий зробити <br> пропозицію <br> про роботу' : 'Работодатель <br> не готов сделать <br> предложение <br> о работе'
}

const ajax = (type, url) => $.ajax({
	type,
	url,
	contentType: 'application/json',
	dataType: 'json',
	xhrFields: {
		withCredentials: true
	}
})

function appliedVacancyModel(appliedVacancy, cities, parent) {
	const model = this

	ko.utils.extend(model, appliedVacancy)

	model.count = ko.observable(5)
	model.start = ko.observable(0)

	model.dateView = ko.observable(moment(model.dateView).format('DD MMMM YYYY'))
	model.logo = ko.observable()
	model.cities = cities
	model.city = cities()[model.cityId]
	model.isViewed = ko.observable(appliedVacancy.isViewed)
	model.dictionary = parent.dictionary
	model.invited = ko.observable(appliedVacancy.invited)
	model.declined = ko.observable(appliedVacancy.declined)
	model.applyDate = ko.observable(moment(appliedVacancy.applyDate).format('DD MMMM YYYY'))
	model.companyLogo = ko.observable()

	model.isResumeVisible = ko.observable(false)
	model.toggleBtnText = ko.computed(() => model.isResumeVisible() ? dictionary.hide : dictionary.ditails)
	model.isWaitingForFeedback = ko.computed(() => !model.invited() && !model.declined())
	model.isResumeViewed = ko.computed(() => !model.isViewed())

	model.linkToVacancy = ko.computed(() => `/company${model.notebookId}/vacancy${model.vacancyId}`)
	model.linkToCompany = ko.computed(() => `/company${model.notebookId}`)
	model.linkToCV = ko.computed(() => `/cv/${model.resumeId}`)

	model.resumeToggle = () => model.isResumeVisible(!model.isResumeVisible())

	model.setLogoSrc = () => {
		const logo = appliedVacancy.logo

		if (logo.indexOf('default') >= 0 || !logo) {
			model.companyLogo(ruavars.cloudImages + '/2017/05/without-logo.png')
		} else {
			model.companyLogo(ruavars.cloudCompanyLogos + '/' + logo)
		}
	}

	model.setLogoSrc()

}


function ApplicationHistoryModel () {
	let model = this

	model.vacancies = ko.observableArray([])
	model.cities = ko.observableArray([])
	model.total = ko.observable()
	model.start = ko.observable(0)
	model.dictionary = dictionary

	const count = 20

	model.isLoadMoreVisible = ko.computed(() => {
		return model.vacancies().length < model.total()
	})

	model.loadMore = () => {
		model.start(model.start() + count)
		model.init()
	}


	model.getCities = () => {
		$.getJSON(`${ruavars.apiUrl}/dictionary/city`).then(cities => {
			cities = cities.reduce((result, item) => {
				result[item.id] = ukrainian ? item.ua : item.ru
				return result
			}, {})
			model.cities(cities)
		})
	}

	model.init = () => {
		ajax('GET', `${ruavars.apiUrl}/account/jobsearch/application_history?start=${model.start()}&count=${count}`)
		.then(vacancies => {
			model.total(vacancies.total)
			vacancies.documents.map(appliedVacancy => new appliedVacancyModel(appliedVacancy, model.cities, model)).forEach(x => model.vacancies.push(x))
			model.vacancies()[0].isResumeVisible(true);
		})
	}

	model.getCities()
	model.init()
}

$.get(`${ruavars.cloudAssets}/assets.rabota.ua/Pages/jobsearch/notepad/application_history.html`).then(html => {
	$('#application_history_tpl').html(html)
	let model = new ApplicationHistoryModel()
	ko.applyBindings(model, document.getElementById('application_history'))
	window['model'] = model
})



// testing preact
const props = {
	collapseView: false,
	salary: {
		parts: [15, 41, 47],
		hit: 2
	},
	experience: {
		parts: [73, 27],
		hit: 1
	},
	showInsufficientData: false
}
render(
	h(ComparisonCandidates, props),
	document.querySelector('#test_preact')
)
