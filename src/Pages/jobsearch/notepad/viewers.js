/* global ukrainian ko api _gaq logo js*/

import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/uk'

const ukrainian = window['ukrainian'] || false

ukrainian ? moment.locale('ua') : moment.locale('ru')

jQuery.support.cors = true

const Dictionary = {
	title: ukrainian ? 'Перегляди резюме' : 'Просмотры резюме',
	subtitle: ukrainian ? 'Статистика переглядів резюме компаніями за останні 6 місяців.' :
		'Статистика просмотров резюме компаниями за последние 6 месяцев.',
	noSalary: ukrainian ? 'Зарплата не вказана' : 'Зарплата не указана',
	more: ukrainian ? 'Ще' : 'Еще',
	recommendedTitle: ukrainian ? 'Відповідні вакансії' : 'Подходящие вакансии',
	companyProfile: ukrainian ? 'Профіль компанії' : 'Профиль компании'
}

//Helper functions
const getCity = model => () => {
	let city = model.cities().filter(city => {
		return city.id === model.cityId()
	}).shift()
	return city ? (ukrainian ? city.ua : city.ru) : null
}

let isEventCanBeAdded = true

function ResumeModel(id, cities, parent) {
	const model = this
	const initialStartView = 0
	const initialCountView = 5
	const initialStartRecommended = 0
	const initialCountRecommended = 5
	const step = 10
	model.cities = cities
	model.id = ko.observable(id)
	model.cityId = ko.observable()
	model.city = ko.computed(getCity(model))
	model.position = ko.observable('')
	model.salary = ko.observable('')
	model.totalView = ko.observable()
	model.totalRecommended = ko.observable()
	model.views = ko.observableArray([])
	model.recommended = ko.observableArray([])
	model.startView = ko.observable(initialStartView)
	model.countView = ko.observable(initialCountView)
	model.startRecommended = ko.observable(initialStartRecommended)
	model.countRecommended = ko.observable(initialCountRecommended)
	model.cvLink = ko.computed(() => `/jobsearch/cvbuilder?resumeId=${model.id()}`)


	//Recommended state


	model.showViewCount = ko.computed(() => {
		const diff = model.totalView() - model.views().length
		return diff >= step ? step : diff
	})

	model.showRecommendedCount = ko.computed(() => {
		const diff = model.totalRecommended() - model.recommended().length
		return diff >= step ? step : diff
	})

	model.isShowViewCountVisible = ko.computed(() => model.totalView() - model.views().length > 0)

	model.isShowRecommendedCountVisible = ko.computed(() => model.totalRecommended() - model.recommended().length > 0)

	model.viewsTotalText = ko.computed(() => {
		if (model.totalView()) {
			const viewedStr = model.totalView().toString()
			const lastNumber = viewedStr.charAt(viewedStr.length - 1)
			switch (lastNumber) {
				case '4':
				case '3':
				case '2':
					return ukrainian ? 'перегляди' : 'просмотра'
				case '1':
					return ukrainian ? 'перегляд' : 'просмотр'
				default:
					return ukrainian ? 'переглядів' : 'просмотров'
			}
		}
	})

	model.viewedViewText = ko.computed(() => {
		switch (model.showViewCount()) {
			case 4:
			case 3:
			case 2:
				return ukrainian ? 'перегляди' : 'просмотра'
			case 1:
				return ukrainian ? 'перегляд' : 'просмотр'
			default:
				return ukrainian ? 'переглядів' : 'просмотров'
		}
	})

	model.viewedRecommendedText = ko.computed(() => {
		switch (model.showRecommendedCount()) {
			case 4:
			case 3:
			case 2:
				return ukrainian ? 'вакансії' : 'вакансии'
			case 1:
				return ukrainian ? 'вакансія' : 'вакансия'
			default:
				return ukrainian ? 'вакансій' : 'вакансий'
		}
	})

	model.getResume = function () {
		$.ajax({
			type: 'GET',
			url: `${api}/resume/${id}`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).then(resume => {
			const {position, salary} = resume.position
			const {cityId} = resume.personal

			model.cityId(cityId)
			model.position(position)
			model.salary(salary)
		}).then(() => {
			if (model.position() && model.cityId()) {
				model.getRecommended()
			}
		})
	}

	model.getViews = function () {
		$.ajax({
			type: 'GET',
			url: `${api}/account/jobsearch/cvview/?start=${model.startView()}&count=${model.countView()}&cvId=${id}`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).then(data => {
			model.totalView(data.total)
			let documents = data.documents.map(d => {
				const uaPrefix = window.location.pathname.indexOf('/ua/') >= 0 ? '/ua' : ''

				if (d.companyLogo.indexOf('default') >= 0 || !d.companyLogo) {
					d.companyLogo = `${ruavars.cloudImages}/2017/05/without-logo.png`
				} else {
					d.companyLogo = logo + '/' + d.companyLogo
				}
				d.reviewDate = moment(d.reviewDate).format('DD MMMM YYYY')
				d.companyLink = d.notebookId ? `${uaPrefix}/company${d.notebookId}` : null
				return d
			})
			model.views(model.views().concat(documents))

			if (model.countView() === initialCountView) {
				model.startView(initialCountView)
			} else {
				model.startView(model.startView() + step)
			}
			model.countView(step)
		})
	}

	model._gaVacancyClick = vacancyLink => () => {
		_gaq.push(['_trackEvent', 'viewerspage-recommended', 'vac_click'])
		window.location = vacancyLink
	}

	model.getMoreVacancies = () => {
		_gaq.push(['_trackEvent', 'viewerspage-recommended', 'showmore_click'])
		model.getRecommended()
	}

	model.getRecommended = function () {
		$.ajax({
			type: 'POST',
			url: `${api}/account/jobsearch/recommendedbyresume/?position=${model.position()}&cityId=${model.cityId()}&start=${model.startRecommended()}&count=${model.countRecommended()}&cvId=${id}`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).then(data => {
			model.totalRecommended(data.total)
			const documents = data.documents.map(d => {
				//Temporal fix
				//TODO: figure out why ua var is false at runtime
				const uaPrefix = window.location.pathname.indexOf('/ua/') >= 0 ? '/ua' : ''
				d.vacancyLink = d.notebookId ? `${uaPrefix}/company${d.notebookId}/vacancy${d.id}` : null

				d.companyLink = d.notebookId ? `${uaPrefix}/company${d.notebookId}` : null
				d.isCompanyProfile = !d.anonymous && d.showProfile
				d.agoTime = moment(d.date).fromNow()
				d.shortDescription = d.description ? (d.description
					.replace(/<\/?\w+>/gi, ' ')
					.replace(/&nbsp;/gi, ' ')
					.substr(0, 250) + '…') : null
				return d
			})
			model.recommended(model.recommended().concat(documents))

			if (model.countRecommended() === initialCountRecommended) {
				model.startRecommended(initialCountRecommended)
			} else {
				model.startRecommended(model.startRecommended() + step)
			}
			model.countRecommended(step)
		}).then(() => {
			if (parent.resumes().some(resume => resume.views().length) && isEventCanBeAdded) {
				_gaq.push(['_trackEvent', 'viewerspage-recommended', 'show', 'show', 1, true])
				isEventCanBeAdded = false
			}
		})
	}

	model.followVacancyLink = vacancyLink => () => {
		window.location = vacancyLink
	}

	model.isRecommendedBlockVisisble = ko.computed(() => !!model.recommended().length)

	model.getResume()
	model.getViews()
	// model.getRecommendations()
}

function ViewersModel() {
	let model = this

	model.dictionary = Dictionary

	model.resumes = ko.observableArray([])

	model.cities = ko.observableArray([])

	model.getCities = () => {
		$.getJSON(`${api}/dictionary/city`).then(cities => {
			model.cities(cities)
		})
	}

	model.init = () => {
		$.ajax({
			type: 'GET',
			url: `${api}/resume`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).then(resumes => {
			model.resumes(resumes.map(resume => new ResumeModel(resume.id, model.cities, model)))
		})
	}

	model.getCities()

	model.init()
}

$.get(`${js}/assets.rabota.ua/Pages/jobsearch/notepad/viewers.html`).then(html => {
	$('#viewerstpl').html(html)
	let model = new ViewersModel()
	ko.applyBindings(model, document.getElementById('viewers'))
	window['model'] = model
})

