const MAXIMUM_ROWS = 20
const VIEWED = 'VIEWED'
const APPLIED = 'APPLIED'
const SUBMITTED = 'SUBMITTED'


const getScore = () => {
	if( location.search.indexOf('mode=apply') > -1 ) {
		return APPLIED
	}
	else if ( location.search.indexOf('apply=thanksforapply') > -1 ) {
		return SUBMITTED
	}
	else {
		return VIEWED
	}
}

const getDataFromLS = () => {
	try {
		return JSON.parse(localStorage.getItem('vacancies_data')) || {}
	}
	catch(e) { console.log(e) }
}

const checkOverflow = (obj, category) => {
	if( obj.hasOwnProperty(category) && Object.keys(obj[category]).length > MAXIMUM_ROWS ) {
		let splicedArr = Object.keys(obj[category]).sort((a, b) => obj[category][a] < obj[category][b])

		splicedArr = splicedArr.splice(0, MAXIMUM_ROWS).reduce((acc, vacID) => {
			acc[vacID] = obj[category][vacID]
			return acc
		}, {})

		return splicedArr
	}

	return false
}

const writeToLS = (obj) => {
	const category = Object.keys(obj)[0]
	let spliced = null

	if(category) {
		spliced = checkOverflow(obj, category)
	}

	if(spliced) {
		obj = Object.assign(obj, {
			...obj,
			[category]: spliced
		})
	}

	try {
		localStorage.setItem('vacancies_data', JSON.stringify(obj))
	}
	catch(e) { console.log(e) }
}

$(document).ready(() => {

	// setTimeout(() => {
	// 	console.log(getDataFromLS())
	// }, 1000)

	const urlArr = location.pathname.split('/')
	const vacancyID = parseInt(urlArr[urlArr.length - 1].replace('vacancy', ''), 10)

	const prevData = getDataFromLS()
	const newScore = getScore()

	writeToLS(
		Object.assign(prevData, {
			[newScore]: {
				...prevData[newScore],
				[vacancyID]: Date.now()
			}
		})
	)
})