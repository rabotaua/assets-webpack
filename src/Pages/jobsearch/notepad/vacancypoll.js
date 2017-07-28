import initializeCompareInfo from '../../../commons/compareInfo/compareInfo'
import '../../vacancy/vacancy_similar_fetch'

jQuery(document).ready(() => {
	initializeCompareInfo();
	$('.compare-info-skip-button').click(function () {
		$('.compare-info-container, .f-vacancy-afterapply__leftwrapper, .f-vacancy-afterapply__rightwrapper, .f-back-to-results')
			.toggleClass('hidden-after-apply-block');
	})
})
