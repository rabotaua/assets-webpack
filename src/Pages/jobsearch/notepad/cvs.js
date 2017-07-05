/* global ukrainian ko $ ruavars*/

import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/uk'
import {togglAdditionalLinks} from '../../vacancy/vacancy'


const {apiUrl: api, cloudAssets, ukrainian} = ruavars

ukrainian ? moment.locale('uk') : moment.locale('ru')

jQuery.support.cors = true

const Dictionary = {
	title: ukrainian ? 'Мої резюме' : 'Мои резюме',
	subtitle: ukrainian ? 'Створено' : 'Создано',
	maxAvailable: ukrainian ? 'Максимально доступні' : 'Максимально доступно',
	noSalary: ukrainian ? 'Зарплата не вказана' : 'Зарплата не указана',
	noPosition: ukrainian ? 'Резюме без назви' : 'Резюме без названия',
	noCity: ukrainian ? 'Місто не вказане' : 'Город не указан',
	activitylevel: {
		visibleToAll: ukrainian ? 'Всім користувачам' : 'Всем пользователям портала',
		visibleOnlyToEmployeers: ukrainian ? 'Зареєстрованим роботодавцям' : 'Зарегистрированным работодателям',
		visibleOnlyToOwner: ukrainian ? 'Тільки мені (приховане резюме)' : 'Никому (скрыть резюме)',
		visibleToAllExcept: ukrainian ? 'Всім роботодавцям, за винятком' : 'Всем работодателям, кроме'
	},
	inActiveResume: ukrainian ? 'Резюме неактивнe' : 'Резюме неактивно',
	renew: ukrainian ? 'Оновити' : 'Обновить',
	updated: ukrainian ? 'Оновлено' : 'Обновлено',
	publish: ukrainian ? 'Опубліковати' : 'Опубликовать',
	fill: ukrainian ? 'Заповнити' : 'Заполнить',
	else: ukrainian ? 'Ще' : 'Еще',
	preview: ukrainian ? 'Попередній перегляд' : 'Предпросмотр',
	download: ukrainian ? 'Скачати у форматі .doc' : 'Скачать в формате .doc',
	hide: ukrainian ? 'Сховати' : 'Спрятать',
	edit: ukrainian ? 'Редагувати' : 'Редактировать',
	createCopy: ukrainian ? 'Створити копію' : 'Создать копию',
	remove: ukrainian ? 'Видалити' : 'Удалить',
	recommendedTitle: ukrainian ? 'Відповідні вакансії' : 'Подходящие вакансии',
	createCV: ukrainian ? 'Створити резюме' : 'Создать резюме'
}

//Helper functions
const getCity = (parentModel, model) => () => {
	let city = parentModel.cities().filter(city => {
		return city.id === model.cityId()
	}).shift()
	return city ? (ukrainian ? city.ua : city.ru) : null
}

const initialStartRecommended = 0
const initialCountRecommended = 5
const step = 10

function ResumeModel(data, parentModel) {
	const model = this

	model.id = ko.observable(data.resumeId)
	model.position = ko.observable(data.speciality)
	model.salary = ko.observable(data.salary)
	model.cityId = ko.observable()
	model.city = ko.computed(getCity(parentModel, model))
	model.photo = ko.observable(data.photo)
	model.currencyId = ko.observable(data.currencyId)
	model.activeLevel = ko.observable(data.activeLevelId)
	model.initialActiveLevel = ko.observable(data.activeLevelId)
	model.educations = ko.observableArray([])
	model.experiences = ko.observableArray([])
	model.rubrics = ko.observableArray([])
	model.viewCount = ko.observable()
	model.updatedDate = ko.observable()
	model.resumeCount = ko.observable()

	//Recommended vacancies
	model.totalRecommended = ko.observable()
	model.recommended = ko.observableArray([])
	model.startRecommended = ko.observable(initialStartRecommended)
	model.countRecommended = ko.observable(initialCountRecommended)

	model.showRecommendedCount = ko.computed(() => {
		const diff = model.totalRecommended() - model.recommended().length
		return diff >= step ? step : diff
	})

	model.isShowRecommendedCountVisible = ko.computed(() => model.totalRecommended() - model.recommended().length > 0)

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

	model.isInitiallyRecommendedBlockVisisble = ko.observable(false)

	model.isRecommendedBlockVisisble = ko.computed(() => model.isInitiallyRecommendedBlockVisisble() && !model.isResumeInActive() && !!model.recommended().length)

	model.currency = ko.computed(() => (model.currencyId() === 1) ? 'грн' : 'usd')

	model.linkToCVBuilder = ko.computed(() => {
		return `/jobsearch/cvbuilder?resumeId=${model.id()}`
	})

	model.linkToCVView = ko.computed(() => {
		return `/jobsearch/notepad/viewers?resumeId=${model.id()}`
	})

	model.linkToDownLoadCV = ko.computed(() => {
		return `/service/cvexport?resumeId=${model.id()}`
	})

	model.CVPrewiew = ko.computed(() => {
		return `/cv/${model.id()}`
	})

	model.hideCV = () => {
		model.activeLevel(6)
		updateState()
	}

	model.updateDateFormatted = ko.computed(() => {
		return moment(model.updatedDate()).format('D MMMM YYYY')
	})

	model.positionText = ko.computed(() => model.position() ? model.position() : Dictionary.noPosition)
	model.salaryText = ko.computed(() => model.salary() ? (model.salary() + ' ' + model.currency()) : Dictionary.noSalary)
	model.cityText = ko.computed(() => model.city() ? model.city() : Dictionary.noCity)

	model.isResumeInActive = ko.computed(() => {
		return model.activeLevel() === 6
	})
	model.isResumeInitialInActive = ko.computed(() => {
		return model.initialActiveLevel() === 6
	})

	model.canResumeBeActivated = ko.computed(() => {
		return (!!model.experiences().length || !!model.educations().length) && !!model.rubrics().length && !!model.position()
	})

	model.isResumeChecked = ko.computed(() => {
		return model.canResumeBeActivated() && !model.isResumeInActive()
	})

	model.canCopyBeCreated = ko.computed(() => {
		return model.resumeCount() < 5
	})

	model.activeLevelText = ko.computed(() => {
		switch (model.activeLevel()) {
			case 1:
				return Dictionary.activitylevel.visibleToAll
			case 2:
				return Dictionary.activitylevel.visibleOnlyToEmployeers
			case 3:
				return Dictionary.activitylevel.visibleToAllExcept
			case 6:
				return Dictionary.activitylevel.visibleOnlyToOwner
		}
	})

	model.viewCountText = ko.computed(() => {
		if (model.viewCount() !== undefined) {
			const viewedStr = model.viewCount().toString()
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

	model.updateDate = function () {
		$.ajax({
			type: 'POST',
			url: `${api}/resume/${model.id()}/date`,
			xhrFields: {
				withCredentials: true
			}
		})
			.success(() => {
				model.updatedDate(moment().format())
				model.isInitiallyRecommendedBlockVisisble(true)
			})
	}

	function updateState() {
		let data = {
			resumeId: model.id(),
			level: model.activeLevel(),
			branchIds: [],
			companyIds: []
		}
		data = JSON.stringify(data)
		return $.ajax({
			type: 'POST',
			url: `${api}/resume/${model.id()}/state`,
			contentType: 'application/json',
			data,
			processData: false,
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		})
	}

	model.publish = function () {
		model.activeLevel(1)
		updateState()
			.then(() => {
				model.updateDate()
			})
	}

	model._gaVacancyClick = vacancyLink => () => {
		window.location = vacancyLink
	}

	model.getMoreVacancies = () => {
		model.getRecommended()
	}

	model.removeCV = () => {
		$.ajax({
			type: 'DELETE',
			url: `${api}/resume/${model.id()}`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		})
			.success(() => {
				parentModel.resumes.remove(model)
				parentModel.resumes().forEach(resume => {
					resume.resumeCount(resume.resumeCount() - 1)
				})
				parentModel.resumesCount(parentModel.resumesCount() - 1)
			})
	}

	model.getRecommended = function () {
		$.ajax({
			type: 'POST',
			url: `${api}/account/jobsearch/recommendedbyresume/?position=${model.position()}&cityId=${model.cityId()}&start=${model.startRecommended()}&count=${model.countRecommended()}&cvId=${model.id()}`,
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
		})
	}

	model.getResumeInfo = () => {
		$.ajax({
			type: 'GET',
			url: `${api}/resume/${model.id()}`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).then(data => {
			model.educations(data.educations)
			model.experiences(data.experiences)
			model.rubrics(data.position.rubrics)
			model.viewCount(data.state.viewCount)
			model.updatedDate(data.updateDate)
			model.resumeCount(data.resumeCount)
			model.cityId(data.personal.cityId)
		}).then(() => {
			if (model.position() && model.cityId()) {
				model.getRecommended()
			}
		})
	}

	model.createCopy = () => {
		$.ajax({
			type: 'POST',
			url: `${api}/resume/${model.id()}/copy`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		})
			.success(url => {
				window.location = url
			})
	}

	model.toggleActiveLevel = () => {
		if (model.isResumeInActive()) {
			if (model.isResumeInitialInActive()) {
				model.activeLevel(1)
			} else {
				model.activeLevel(model.initialActiveLevel())
			}
		} else {
			model.activeLevel(6)
		}
		updateState().then(() => {
			model.isInitiallyRecommendedBlockVisisble(true)
		})
	}

	model.getResumeInfo()
}


function CvsModel() {
	const model = this

	model.cities = ko.observableArray([])

	model.dictionary = Dictionary
	model.maxAvailable = 5

	model.resumes = ko.observableArray([])
	model.resumesCount = ko.observable(0)

	model.resumesAvailableText = ko.computed(() => `${model.resumesCount()}/${model.maxAvailable}`)

	model.isCreateCVButtonVisible = ko.computed(() => {
		return	model.resumes().length < 5;
	})

	model.getCities = () => {
		$.getJSON(`${api}/dictionary/city`).then(cities => {
			model.cities(cities)
		})
	}

	model.init = () => {
		$.ajax({
			type: 'POST',
			url: `${api}/account/jobsearch/cvlist`,
			contentType: 'application/json',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
		}).then(resumes => {
			model.resumes(resumes.map(resume => new ResumeModel(resume, model)))
			model.resumesCount(resumes.length)
			togglAdditionalLinks()
		})
	}

	model.getCities()

	model.init()
}


$.get(`${cloudAssets}/assets.rabota.ua/Pages/jobsearch/notepad/cvs.html`).then(html => {
	$('#cvstpl').html(html)
	let model = new CvsModel()
	ko.applyBindings(model, document.getElementById('cvs'))
	window['model'] = model
})

ko.bindingHandlers.toggleRecommended = {
	update: (element, valueAccessor) => {
		const value = valueAccessor();
		if (value) $(element).slideDown(500);
		else $(element).slideUp(500);
	}
}
