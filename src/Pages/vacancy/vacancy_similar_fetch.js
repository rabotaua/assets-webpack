/* global ukrainian, vacancyId, cityName, apiHostName, allVacanciesLinkRight, allVacanciesLinkBottom */

import Mustache from 'mustache'
import Cookie from 'js-cookie'
import qs from 'qs'
import whenBecomeVisible from '../../commons/whenBecomeVisible'

const guid = qs.parse(Cookie.get('rua-usm') || 'id=').id

const blockTemplate = `
    <div class="f-vacancy-whitebox {{#additionalClass}} {{.}} {{/additionalClass}}">
       <h2 class="f-vac-block-title {{titleStyle}}">
          {{ title }}
          {{{ icon }}}         
       </h2>
        
        {{#itemsHtml}}
            {{{.}}}
        {{/itemsHtml}}

       <a href="{{ allVacanciesLink }}" rel="nofollow" class="f-vacancy-watchallbtn f-btn-control-royal-blue-link fd-merchant fd-text-uppercase">
            {{ watchAllText }}
            <i class="fi-arrows-blue-right-light"></i>
        </a>
    </div>
`

const itemTemplate = `
    <div class="seo_block seo_holder rua-g-clearfix f-vac-block-item">
       <a href="{{ href }}" class="f-vac-block-item__title fd-merchant {{#ga_class}} {{.}} {{/ga_class}}">
            {{#item.vacancyName}}
                {{.}}
            {{/item.vacancyName}}

            {{#item.name}}
                {{.}}
            {{/item.name}}            
       </a>
       <div class="fd-f-left f-vac-block-item__flexline">

        {{#item.companyName}}
          <p class="rua-p-c-mid f-vac-block-item__company fd-thin-craftsmen f-text-gray">{{ item.companyName }}</p>
        {{/item.companyName}}

          {{#item.salary}}
            <p class="f-vac-block-item__salary fd-thin-craftsmen f-text-gray">{{.}}</p>
          {{/item.salary}}
          
          {{#cityName}}
              <p class="f-vac-block-item__region fd-thin-craftsmen f-text-gray"><i class="fi-location"></i>
                {{.}}
              </p>
          {{/cityName}}
       </div>
    </div>
`


jQuery(document).ready(function() {

	let allBottomVacs = []
	const isThxApplyPage = window.location.href.indexOf('thanksforapply') > -1

	function shuffleArray(arr) {
		let counter = arr.length

		while (counter > 0) {
			const rndIndex = ~~(Math.random() * counter)
			counter--

			// swap items
			let tmp = arr[counter]
			arr[counter] = arr[rndIndex]
			arr[rndIndex] = tmp
		}

		return arr
	}


	function gaClickEvents(prefix, checkCategory = false) {
		jQuery(`.f-vacancy-whitebox.-${prefix}`).on('click', '.f-vac-block-item__title, .f-vacancy-watchallbtn', (e) => {
			const gaLabel = $(e.target).hasClass('f-vac-block-item__title') ? `${prefix}_vac_click` : `${prefix}_show_all`

			let categoryString = 'vacancy'
			if (checkCategory) {
				categoryString = isThxApplyPage ? 'thanksforapply' : 'vacancy'
			}

			_gaq.push(['_trackEvent', categoryString, gaLabel]);
		})
	}

	function getSimilarVacancies(apiHostName, isHotOnly) {
		return jQuery.ajax({
			type: 'POST',
			url: apiHostName.replace('api', ukrainian ? 'ua-api' : 'api') + '/vacancy/similar',
			data: JSON.stringify({ isHotOnly, vacancyId, count: 5 }),
			dataType: 'json',
			contentType: 'application/json',
			crossDomain: true
		});
	}

	function similarVacancyItemMapper(item, cityName, vacancyLinkTail, ga_class) {
		const href = `${(ukrainian ? '/ua' : '')}/company${item.notebookId}/vacancy${item.id}${vacancyLinkTail}`

		return Mustache.render(itemTemplate, { href, item, cityName: item['cityName'] || cityName,  ga_class});
	}

	function similarVacancyMapper(title, items, icon, allVacanciesLink, vacancyLinkTail, additionalClass, ga_class, titleIsBold = false) {
		if (!items.length) return null;

		let titleStyle = titleIsBold ? 'fd-beefy-soldier' : 'fd-thin-soldier'

		let itemsHtml
		itemsHtml = items.map(item => similarVacancyItemMapper(item, cityName, vacancyLinkTail, ga_class))
		const watchAllText = ukrainian ? 'Дивитись усі' : 'Смотреть все'

		return Mustache.render(blockTemplate, {
			title,
			titleStyle,
			itemsHtml,
			icon,
			allVacanciesLink,
			watchAllText,
			additionalClass,
			ga_class
		})
	}

	function render2blocks() {
		jQuery.when(
			getSimilarVacancies(apiHostName, false),
			getSimilarVacancies(apiHostName, true)
		).then(function(all, hot) {
			hot = hot[0].filter(function(item) {
				return item.id !== vacancyId;
			}).slice(0, 4);

			let hotIds = hot.map(function(item) {
				return item.id;
			});

			// push GA events with count of hot-vacancies
			if (hotIds.length) {
				_gaq.push(['_trackEvent', 'vacancy', 'hot-show', hotIds.length + ""])
			}

			let all_bottom = all[0].filter(function(item) {
				return item.id !== vacancyId;
			}).slice(0, 10);

			allBottomVacs = all_bottom // for access from another func

			if (all_bottom.length) {
				_gaq.push(['_trackEvent', 'vacancy', 'similar_bottom-show', all_bottom.length + ""])
			}

			if (!$('form').hasClass('authorized_jobsearcher')) {
				renderSimilarOnSide(all_bottom)
			}

			jQuery('.seo_holder_right').prepend(
				similarVacancyMapper(
					ukrainian ? 'Схожі гарячі вакансії' : 'Похожие горячие вакансии',
					hot,
					'<span class="fi-hot"></span>',
					allVacanciesLinkRight,
					'',
					'-offset-bottom -hot', /* additional classes */
					'ga_hot_similar ga_sidebar_hot_vac', /*ga_class */
					false /* bold title */
				)
			)

			jQuery('.seo_holder_bottom').append(
				similarVacancyMapper(
					ukrainian ? 'Схожі вакансії' : 'Похожие вакансии',
					all_bottom,
					'', /* icon -> empty */
					allVacanciesLinkBottom,
					'',
					'-bottom-block -similar_bottom -offset-bottom', /* additional class */
					'ga_similar ga_under_similar_vac',
					true /* bold title */)
			)

			gaClickEvents('hot')
			gaClickEvents('similar_bottom')

			/*let ids = all_bottom.map(function(item) {
				return item.id;
			}).join(',');*/
		});
	}

	function renderSimilarOnSide(list) {

		const reversedList = [...list].reverse().slice(0, 4)

		jQuery('.seo_holder_right').append(
			similarVacancyMapper(
				ukrainian ? 'Схожі вакансії' : 'Похожие вакансии',
				reversedList,
				'',
				allVacanciesLinkBottom,
				'',
				'-similar_right',
				'ga_similar ga_sidebar_similar_vac',
				false)
		)

		if (reversedList.length) {
			_gaq.push(['_trackEvent', 'vacancy', 'similar_right-show', reversedList.length + ""])
		}

		gaClickEvents('similar_right')
	}


	function fetchRecommended() {
		if ($('form').hasClass('authorized_jobsearcher')) {
			$.ajax({
				type: 'POST',
				url: `${apiHostName}/account/jobsearch/recommended?guid=${guid}`,
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true
			}).then(popular => {
				if (!popular.total) {
					renderSimilarOnSide(allBottomVacs)
					return null
				}

				let editedResponse = popular.documents.map(item => {
					if (item.salary > 0) {
						item.salary = item.salary + ' грн.'
					}

					return item
				})

				editedResponse = shuffleArray(editedResponse)
				editedResponse = editedResponse.slice(0, 4)

				if (editedResponse.length) {
					whenBecomeVisible('.f-vacancy-afterapply__leftwrapper', () => {
						const category = isThxApplyPage ? 'thanksforapply' : 'vacancy'
						_gaq.push(['_trackEvent', category, 'recomend-show', editedResponse.length + ""])
					})
				}

				jQuery('.seo_holder_right').prepend(
					similarVacancyMapper(
						ukrainian ? 'Рекомендовані вакансії' : 'Рекомендуемые вакансии',
						editedResponse,
						'<span class="fi-recomended"></span>',
						'/jobsearch/notepad/vacancies_profile_popular',
						'',
						'-offset-bottom -recomend',
						'ga_recom_new ga_sidebar_recom_vac',
						false
					)
				)

				gaClickEvents('recomend', true)
			})
		}
	}

	if (!isThxApplyPage) {
		render2blocks()
	}

	fetchRecommended()
});
