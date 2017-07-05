/* global ukrainian, jQuery, cloudCompanyLogos */

import Mustache from 'mustache'
import Cookie from 'js-cookie'
import qs from 'qs'


import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/uk'

const guid = qs.parse(Cookie.get('rua-usm') || 'id=').id
const ukrainian = ukrainian || false
ukrainian ? moment.locale('ua') : moment.locale('ru')


/*
	docs: https://gist.github.com/fnnzzz/64489554343f0a8aa236d2c09a501126
	example: https://jsfiddle.net/fnnzzz/jv48gu1w/10/
*/



function Recommendator(options) {

	if( !options.template ) {
		console.error(`You didn't specify a template...`)
	}

	const listeners = []
	const citiesDictionary = {}
	const uaPrefix = ukrainian ? '/ua' : ''
	let totalItems = null
	let prevApiResponse = ''

	options = {
		template: options.template || null,
		start: options.start || 0,
		step: options.step || 5,
		immediately: options.immediately !== false,
		mustacheAdditionalObject: options.mustacheAdditionalObject || {},
		apiUrl: options.apiUrl || 'https://api.rabota.ua/',
    cloudCompanyLogos: options.cloudCompanyLogos || 'https://logo-frankfurt.cf-rabota.com.ua',
		gaKey: options.gaKey || 'unknown'
	}

	const dictionaryUrl = `${options.apiUrl}/dictionary/city`
	const recommendedApiUrl = `${options.apiUrl}/account/jobsearch/recommended`


	const gaEvents = {
		gaClickItem: `onclick="_gaq.push(['_trackEvent', '${options.gaKey}', 'vac_click'])"`,
	}

	const helpers = {
		cityName: function() {
			if( !citiesDictionary.hasOwnProperty(this.cityId) ) return null

			const { cityId } = this // this = mustache context
			const currentLang = ukrainian ? 'ua' : 'ru'
			return citiesDictionary[cityId][currentLang]
		},
		isUkrainian: function() {
			return ukrainian
		},
		shortDescription: function() {
			if( !this.description ) return null

			return this.description
					.replace(/<\/?\w+>/gi, ' ')
					.replace(/&nbsp;/gi, ' ')
					.substr(0, 250) + '…'
		},
		agoTime: function() {
			return moment(this.date).fromNow()
		},
		vacancyLink: function() {
			if(!this.notebookId) return null

			return `${uaPrefix}/company${this.notebookId}/vacancy${this.id}`
		},
		companyLink: function() {
			if(!this.notebookId) return null

			return `${uaPrefix}/company${this.notebookId}`
		},
		isCompanyProfile: function() {
			return !this.anonymous && this.showProfile
		},
		logoUrl: function () {
			return `${cloudCompanyLogos}/${this.logo}`
		}
	}

	const subscribe = (cb) => listeners.push(cb)
	const getTotalCount = () => totalItems
	const getCurrentStart = () => options.start

	const getCityDictionary = () => {
		jQuery.getJSON(dictionaryUrl)
			.then(cities => {
				cities.map(city => {
					citiesDictionary[city.id] = {...city}
				})
				render()
			})
	}

	const get = (newStart, newStep = options.step) => {

		options.start = newStart || options.start
		options.step = newStep || options.step


		// get hash map for cityID<->cityName
		if( !Object.keys(citiesDictionary).length ) {
			getCityDictionary()
		}

    jQuery.ajax({
      type: 'POST',
      url: `${recommendedApiUrl}?start=${options.start}&count=${options.step}&guid=${guid}`,
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      }
    }).then(data => {
				if( data && data.hasOwnProperty('total') && data.total > 0 ) {
					_gaq.push(['_trackEvent', options.gaKey, 'show', 'show', 1, true])

					options.start += options.step
					totalItems = data.total
					render(data)
				} else {
					totalItems = 0
					render()
				}
			})
	}

	const render = (apiResponse = prevApiResponse) => {
		if( !options.template ) return

		Mustache.parse(options.template)
		const gaObject = options.gaKey ? gaEvents : {}
		const { mustacheAdditionalObject } = options
		const rendered = Mustache.render(
			options.template, jQuery.extend(apiResponse, helpers, gaObject, mustacheAdditionalObject)
		)

		prevApiResponse = rendered
		listeners.map(f => f(rendered))
	}

	options.immediately ? get() : null

	return { subscribe, get, getTotalCount, getCurrentStart }
}

window.Recommendator = Recommendator
export default Recommendator
