/* global ukrainian, Recommendator, jQuery */
import '../../commons/recommendator.js'
import qs from 'qs'


const {keyWords, regionId} = qs.parse((window.location.search || '?').substring(1))
const hasNotEmptySearchParams = !!keyWords || !!regionId
const zeroContainer = jQuery('.recommended-vacs-if-zero-result')
const findCount = parseInt(jQuery('[id$="ltCount"] span').text())
const isEmptySearchResults = findCount === 0

const userIsAuth = jQuery('form.authorized').length

if( isEmptySearchResults ) {
	const mustacheTemplate = `
		<div>
			<h2 class="f-vac-block-title fd-beefy-soldier" style="margin-bottom: 0">
	          ${ ukrainian ? 'Рекомендовані вакансії' : 'Рекомендуемые вакансии' }
	          <span class="fi-recomended"></span>
	       </h2>
	
			{{#documents}}
				<article class="f-vacancylist-vacancyblock">
					<div class="fd-f-left">
						<div class="fd-f1">
							<h3 class="fd-beefy-gunso f-vacancylist-vacancytitle">
								<a {{{ gaClickItem }}} class="f-visited-enable ga_recom_new ga_0_search" href="{{ vacancyLink }}">
									{{ name }}
									
									{{#hot}}
										<i class="fi-hot" data-tooltip="#hot-tip"></i>
									{{/hot}}
									
									{{#isSpecialNeeds}}
										<i data-tooltip="#special-needs-people" class="f-text-gray fi-disabled-icon"></i>
									{{/isSpecialNeeds}}
								</a>
							</h3>
							<p class="f-vacancylist-companyname fd-merchant f-text-dark-bluegray">
								<a class="f-text-dark-bluegray f-visited-enable ga_recom" href="{{ companyLink }}">
									{{ companyName }}
									
									{{#isAgency}}
										<span class="f-vaclist123_agency f-text-gray fd-thin-soldier">
											{{#isUkrainian}}
												агенство	
											{{/isUkrainian}}
										
											{{^isUkrainian}}
												агентство
											{{/isUkrainian}}
										</span>
									{{/isAgency}}
								</a>
							</p>
							<div class="f-vacancylist-characs-block fd-f-left-middle">
								{{ #salary }}
									<p class="fd-beefy-soldier -price">{{.}} грн</p>	
								{{ /salary }}
								
								{{ #cityName }}
									<p class="fd-merchant">
										<i class="fi-location"></i>
										{{.}}
									</p>
								{{ /cityName }}
								
								{{#isCompanyProfile}}
									<p class="fd-merchant f-text-dark-bluegray">
										<i class="fi-company-profile"></i>
										<a class="f-text-dark-bluegray" rel="nofollow" href='{{ companyLink }}'>
											{{#isUkrainian}}
												Профіль компанії
											{{/isUkrainian}}
										
											{{^isUkrainian}}
												Профиль компании
											{{/isUkrainian}}
										</a>
									</p>
								{{/isCompanyProfile}}
							</div>
							<p style="cursor: pointer;" 
								onclick="window.location = '{{ vacancyLink }}'" 
								class="f-vacancylist-shortdescr f-text-gray fd-craftsmen">
								<span {{{ gaClickItem }}}>
									{{{ shortDescription }}}
								</span>
							</p>
						</div>
					</div>
					
					<div class="fd-f-left-middle fd-f1 f-vacancylist-bottomblock">
						<div class="fd-f1">
							<div class="fd-craftsmen f-vacancylist-tags">
								{{ #listTags }}	
									<a class="f-vacancylist-tags-linkcolor">
										{{ name }}
									</a>
								{{ /listTags}}
							</div>
						</div>
						<div>
							<p class="f-vacancylist-agotime f-text-light-gray fd-craftsmen">{{ agoTime }}</p>
						</div> 
					</div>
				</article>
			{{/documents}}
		</div>
	`

	const recomVacs = Recommendator({
		gaKey: userIsAuth ? 'recommended-zero-search' : 'recommended-zero-search-no-login',
		template: mustacheTemplate,
		apiUrl: window['api']
	})

	jQuery(document).ready(() => {
		recomVacs.subscribe((rndr) => {
			if( recomVacs.getTotalCount() === 0 ) {
				zeroContainer.removeClass('-show')
				return
			}

			zeroContainer.addClass('-show')
			zeroContainer.html(rndr)
		})
	})

	window.recomVacs = recomVacs
}


if ( !isEmptySearchResults && !hasNotEmptySearchParams ) {
  const topContainer = jQuery('<div class="top-recommended-block"></div>').insertBefore('.f-vacancylist-leftwrap')

  const topTemplate = `
<div class="f-vacancylist-leftwrap fd-f1 f-paper" style="margin-bottom: 20px;">
{{#total}}
<h2 class="f-vac-block-title fd-beefy-soldier">
    ${ ukrainian ? 'Рекомендовані для Вас' : 'Рекомендуемые для Вас' }
    <span class="fi-recomended"></span>
</h2>
{{/total}}

<table class="f-vacancylist-tablewrap" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
    <tbody>
    {{#documents}}
    <tr>
        <td>
						<article class="f-vacancylist-vacancyblock">
								<div class="fd-f-left">
										<div class="fd-f1">
												<h3 class="fd-beefy-gunso f-vacancylist-vacancytitle">
														<a class="f-visited-enable ga_recom_new ga_without_key" {{{ gaClickItem }}} href="{{ vacancyLink }}">
																{{name}}
																{{#hot}}<i class="fi-hot" data-tooltip="#hot-tip"></i>{{/hot}}
														</a>
												</h3>
												<p class="f-vacancylist-companyname fd-merchant f-text-dark-bluegray">
														<a class="f-text-dark-bluegray f-visited-enable ga_recom" href="{{companyLink}}">
																{{companyName}} 
														</a>
												</p>
												<div class="f-vacancylist-characs-block fd-f-left-middle">
												{{#salary}}<p class="fd-beefy-soldier -price">
														{{.}} грн
												</p>{{/salary}}
												<p class="fd-merchant">
														<i class="fi-location"></i>
														{{cityName}}
														<span style="display: none;"></span>
												</p>
												</div>
												<p style="cursor: pointer;" onclick="javascript: window.location = '{{ vacancyLink }}'" class="f-vacancylist-shortdescr f-text-gray fd-craftsmen">
														{{shortDescription}}
												</p>
										</div>
										{{#isCompanyProfile}}
										<div class="f-vacancylist-companylogo fd-f-right-top">
												<a title="Все вакансии компании {{companyName}}" href="{{companyLink}}" rel="nofollow">
														<img alt="Все вакансии компании {{companyName}}" src="{{logoUrl}}">
												</a>
										</div>
										{{/isCompanyProfile}}
								</div>
								<div class="fd-f-left-middle fd-f1 f-vacancylist-bottomblock">
										<div class="fd-f1">
												
										</div>
								</div>
						</article>
        </td>
    </tr>
    {{/documents}}
    </tbody>
</table>
</div>
`


  const topVacancies = Recommendator({
    gaKey: userIsAuth ? 'recommended-search-without-key' : 'recommended-search-without-key-no-login',
    template: topTemplate,
    apiUrl: window['api'],
    cloudCompanyLogos: window['cloudCompanyLogos']
  })

  topVacancies.subscribe(html => {
    if( topVacancies.getTotalCount() === 0 ) {
      jQuery('.top-recommended-block').hide()
      return
    }

    topContainer.html(html)
  })

}


if( !isEmptySearchResults && hasNotEmptySearchParams ) {
	const mustacheTemplate = `
	<div class="f-vacancy-whitebox -without-side-offset -without-border -bottomvacs" style="background: transparent;">
	   {{#total}}
       <h2 class="f-vac-block-title fd-beefy-soldier">
          ${ ukrainian ? 'Рекомендовані для Вас' : 'Рекомендуемые для Вас' }
          <span class="fi-recomended"></span>
       </h2>
       {{/total}}
       
       {{#documents}}
       <div class="f-vac-block-item">
           <a {{{ gaClickItem }}} href="{{ vacancyLink }}" class="f-vac-block-item__title fd-merchant ga_recom_new ga_keyword">
                {{name}}
           </a>
           <div class="fd-f-left f-vac-block-item__flexline">
        
            {{#companyName}}
              <p class="f-vac-block-item__company fd-thin-craftsmen f-text-gray">{{.}}</p>
            {{/companyName}}
        
			{{#salary}}
				<p class="f-vac-block-item__salary fd-thin-craftsmen f-text-gray">{{.}} грн.</p>
			{{/salary}}
              
			{{#cityName}}
			  <p class="f-vac-block-item__region fd-thin-craftsmen f-text-gray">
			  	<i class="fi-location"></i>
			  	{{.}}
			  </p>
			{{/cityName}}
           </div>
       </div>
       {{/documents}}
    </div>
`
	const containerTemplate = `<div class="bottom-recommended-block"></div>`

	jQuery(document).ready(() => {
		jQuery('.f-vacancylist-tablewrap .last-item-set-border').after(containerTemplate)
		jQuery('.last-item-set-border').removeClass('last-item-set-border')
	})

	const bottomVacancies = Recommendator({
		gaKey: userIsAuth ? 'recommended-search-with-key' : 'recommended-search-with-key-no-login',
		template: mustacheTemplate,
		apiUrl: window['api']
	})

	bottomVacancies.subscribe(html => {
    if( bottomVacancies.getTotalCount() === 0 ) {
      jQuery('.bottom-recommended-block').hide()
      jQuery('.last-item-set-border').addClass('last-item-set-border')
      return
    }

    jQuery('.bottom-recommended-block').html(html)
	})

	window.bottomVacancies = bottomVacancies
}
