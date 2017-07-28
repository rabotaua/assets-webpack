/* global ruavars ko _gaq */

import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/uk'

import {h, render} from 'preact'
import ComparisonCandidates from '../../../shared-components/ComparisonCandidates/ComparisonCandidates.jsx'
import {
	dictionary as comparisonDict,
	getCompareParamsHelper
} from '../../../shared-components/ComparisonCandidates/helpers'

jQuery.support.cors = true

const {ukrainian} = ruavars;

ukrainian ? moment.locale('ua') : moment.locale('ru')


const dictionary = {
	header: ukrainian ? 'Статус відправлених резюме' : 'Статус отправленных резюме',
	subheader: ukrainian ? 'відправлених резюме за останні 6 місяців.' : 'отправленных резюме за последние 6 месяцев.',
	viewed: ukrainian ? 'Переглянуто' : 'Просмотрено',
	sent: ukrainian ? 'Відправлено ' : 'Отправлено',
	sentCvText: ukrainian ? 'Відправлене резюме:' : 'Отправленное резюме:',
	letterText: ukrainian ? 'Супровідний лист' : 'Сопроводительное письмо',
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
	declined: ukrainian ? 'Роботодавець <br> не готовий зробити <br> пропозицію <br> про роботу' : 'Работодатель <br> не готов сделать <br> предложение <br> о работе',
	vacancyClosed: ukrainian ? 'Вакансія закрита' : 'Вакансия завершена',
	notViewedTooltip: ukrainian ? 'Резюме доставлено і немає точних даних про те, що резюме було переглянуто роботодавцем.' : 'Резюме доставлено и нет точных данных о том, что резюме было просмотрено работодателем.'
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

ko.bindingHandlers.reactComparison = {
	init(element, valueAccessor) {
		const props = valueAccessor()()
		render(h(ComparisonCandidates, props), element)
	},
	update(element, valueAccessor) {
		const props = valueAccessor()()
		render(h(ComparisonCandidates, props), element, element.childNodes[0])
	}
}

function AppliedVacancyModel(appliedVacancy, cities, parent) {
	const model = this

	ko.utils.extend(model, appliedVacancy)

	model.count = ko.observable(5)
	model.start = ko.observable(0)

	model.dateView = ko.observable( model.dateView ? moment(model.dateView).format('DD MMMM YYYY') : '' )
	model.logo = ko.observable()
	model.cities = cities
	model.applyId = appliedVacancy.applyId
	model.isViewed = ko.observable(appliedVacancy.isViewed)
	model.dictionary = parent.dictionary
	model.invited = ko.observable(appliedVacancy.invited)
	model.declined = ko.observable(appliedVacancy.declined)
	model.applyDate = ko.observable(moment(appliedVacancy.applyDate).format('DD MMMM YYYY'))

	model.companyLogo = ko.observable()
	model.vacancyIsClosed = ko.computed(() => appliedVacancy.state !== 4)

	model.vacancyName = ko.computed(() => {
		if(model.vacancyIsClosed() && appliedVacancy.vacancyName.length >= 25 ) {
			return appliedVacancy.vacancyName.slice(0, 25) + '…'
		}
		return appliedVacancy.vacancyName
	})

	model.formattedCompanyName = ko.computed(() => {
		let limit = 40

		if(model.vacancyIsClosed()) {
			limit = 25
		}

		if( appliedVacancy.companyName.length >= limit ) {
			return appliedVacancy.companyName.slice(0, limit-1) + '…'
		}
		return appliedVacancy.companyName
	})

	model.city = ko.computed(() => {
		let limit = 15
		if(model.vacancyIsClosed() && cities().hasOwnProperty(model.cityId) && cities()[model.cityId].length >= limit) {
			return cities()[model.cityId].slice(0, limit-1) + '…'
		}

		return cities()[model.cityId]
	})

	model.resumeName = ko.observable(appliedVacancy.resumeName)
	model.letter = ko.observable(appliedVacancy.letter)

	model.isResumeVisible = ko.observable(false)
	model.toggleBtnText = ko.computed(() => model.isResumeVisible() ? dictionary.hide : dictionary.ditails)
	model.isWaitingForFeedback = ko.computed(() => !model.invited() && !model.declined())
	model.isResumeViewed = ko.computed(() => !model.isViewed())

	model.linkToVacancy = ko.computed(() => `/company${model.notebookId}/vacancy${model.vacancyId}`)
	model.linkToCompany = ko.computed(() => `/company${model.notebookId}`)
	model.linkToCV = ko.computed(() => {
		const arctype = model.resumeId ? 2 : 1
		return `/jobsearch/notepad/viewcv?arctype=${arctype}&id=${model.applyId}&resumeId=${model.resumeId}`
	})


	model.letterBoxIsShow = ko.observable(false)
	model.showLetterBox = () => model.letterBoxIsShow(true)
	model.closeLetterBox = () => model.letterBoxIsShow(false)
	model.letterCloseIcon = ruavars.cloudImages + '/2017/07/letter-box-close.svg'
	model.vacancyCloseIcon = ruavars.cloudImages + '/2017/07/vac-closed.svg'
	model.notViewedIcon = ruavars.cloudImages + '/2017/07/not-viewed-app-history.svg'

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

	model.comparisonTitle = ruavars.ukrainian ? 'Порівняльна статистика по вакансії' : 'Сравнительная статистика по вакансии'

	const getRangeText = (dict) => {
		let id

		if (model.status && model.status.salaryId) {
			id = model.status.salaryId

			if( dict && dict.hasOwnProperty(id) ) {
				return dict[id][ ukrainian ? 'ua' : 'ru' ]
			}
		}

		return ''
	}


	const isAttach = model.resumeId === 0

	model.reactProps = ko.computed(() => {
		if(!model.status) {
			return {
				isRepliesPage: true,
				collapseView: !model.isResumeVisible(),
				dictionary: comparisonDict,
				yetNotAvailable: true,
				compactMode: true,
				vacancyIsClosed: model.vacancyIsClosed(),
				surveyLink: model.vacancyId ? `/${ ukrainian ? 'ua/' : '' }jobsearch/notepad/vacancypoll?vacancyid=${model.vacancyId}&applyId=${model.applyId}&attach=${isAttach}` : '#'
			}
		}

		return !model.status.complete ? {
			isRepliesPage: true,
			collapseView: !model.isResumeVisible(),
			showInsufficientData: true,
			compactMode: true,
			dictionary: comparisonDict,
			vacancyIsClosed: model.vacancyIsClosed(),
			salary: null,
			experience: null
		} : {
			collapseView: !model.isResumeVisible(),
			showInsufficientData: !model.status.complete,
			dictionary: comparisonDict,
			salary: {
				parts: model.status.salary,
				text: getRangeText(parent.rangeSalaryDictionary())
			},
			experience: {
				parts: model.status.experience,
				text: getRangeText(parent.rangeExperienceDictionary())
			}
		}
	})
}


function ApplicationHistoryModel () {
	let model = this

	model.vacancies = ko.observableArray([])
	model.cities = ko.observableArray([])
	model.total = ko.observable()
	model.start = ko.observable(0)
	model.dictionary = dictionary
	model.zeroResultPic = ruavars.cloudImages + '/2017/07/app_history_if_zero.png'

	model.rangeSalaryDictionary = ko.observable()
	model.rangeExperienceDictionary = ko.observable()

	const count = 20

	model.isLoadMoreVisible = ko.computed(() => {
		return model.vacancies().length < model.total()
	})

	model.loadMore = () => {
		model.start(model.start() + count)
		model.init()
	}

	const normalizeDict = (data, observable) => {
		data.map(({ id, ru, ua }) => {
			observable({
				...observable(),
				[id]: { ru, ua }
			})
		})
	}

	getCompareParamsHelper('salary', (data) => normalizeDict(data, model.rangeSalaryDictionary))
	getCompareParamsHelper('experience', (data) => normalizeDict(data, model.rangeExperienceDictionary))

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
			.then(({ total, documents}) => {
				model.total(total)
				documents.map(appliedVacancy => new AppliedVacancyModel(appliedVacancy, model.cities, model)).forEach(x => model.vacancies.push(x))
				if(total) {
					model.vacancies()[0].isResumeVisible(true);
				}
			})
			.then(() => {
				setTimeout(() => {
					$('.applied-vacancy').each((index, item) => {
						const zIndex = $('.applied-vacancy').length - index
						$(item).css('zIndex', zIndex)
					})
				}, 500)
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
