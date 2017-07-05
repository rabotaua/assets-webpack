(function() {
	$(document).ready(function($) {
		$('#f_more_tags').on('click', (e) => {
			e.preventDefault();
			$('#f_more_wrap').addClass('-hidden');
			$('#f_tags_list li.-hidden').removeClass('-hidden');
		})
	});
})()