/* global apiHostName */

import levenshtein from './levenshtein-algorithm'
import domainsArr from './domains-list'

export default (() => {
	const findSimilarEmails = (emailDomain, maxDistVal, domains) => {
		const filteredArray = []

		Object.keys(domains).map(domain => {
			const dist = levenshtein(emailDomain, domain)

			if( dist < maxDistVal ) {
				filteredArray.push({ name: domain, dist, count: domains[domain] })
			}
		})

		return filteredArray.length ? filteredArray : null
	}


	const findMostPopularEmail = (filteredArr) => {
		let maxRatio = -Infinity
		let probableEmail = null

		if( !filteredArr || !filteredArr.hasOwnProperty('length') || !filteredArr.length ) return false

		filteredArr.map(item => {
			const { dist, count } = item
			const ratio = parseInt(count) / parseInt(dist + 1)

			if( ratio > maxRatio ) {
				maxRatio = ratio
				probableEmail = item.name
			}
		})

		return probableEmail
	}

	const findMisprints = (email = '', options = {}) => {
		const maxDistVal = options.maxDistVal || 3
		const domains = options.domains || domainsArr
		const emailParts = email.trim().toLowerCase().split('@')

		if( emailParts[1] ) {
			const similars = findSimilarEmails(emailParts[1], maxDistVal, domains)
			const findPopular = findMostPopularEmail(similars)

			if(findPopular && findPopular.length) {
				return `${emailParts[0]}@${findPopular}`
			}
		}

		return false
	}

	const apiCheck = (email = '') => {
		if( email.hasOwnProperty('length') && !email.length ) return false

		return $.ajax({
			type: 'POST',
			url: `${apiHostName}/service/checkemail?email=${email}`,
			timeout: 5000
		})
	}

	window.oracleFindMisprints = findMisprints
	window.oracleApiCheck = apiCheck

	return {
		findMisprints,
		apiCheck
	}

})()