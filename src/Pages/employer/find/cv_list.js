/* CURRENTLY NOT USED */



// let newCvNotify = null
//
// try { newCvNotify = localStorage.getItem('newCvNotify') }
// catch(e) { console.log(e) }
//
//
// function notificationPosition() {
// 	setTimeout(() => {
// 		$('.newcvdb-notification').css('top', $('.f-header').height() + 20)
// 	}, 200)
// }
//
// $(document).ready(() => {
// 	if( !newCvNotify && $('form.authorized').length > 0 ) {
//
// 		const localization = {
// 			russian: {
// 				title: 'Мы обновили наш поиск резюме.',
// 				descr1: 'Изменения сделаны на основе предложений пользователей, чтобы повысить удобство и продуктивность нашего сайта.',
// 				descr2: 'Просим оценить изменения и поделиться своими впечатлениями. Чтобы это сделать, кликните по кнопке в правом нижнем углу.',
// 				close: 'ЗАКРЫТЬ'
// 			},
// 			ukrainian: {
// 				title: 'Ми оновили наш пошук резюме',
// 				descr1: 'Зміни зроблені на основі пропозицій користувачів, щоб підвищити зручність і продуктивність нашого сайту.',
// 				descr2: 'Просимо оцінити зміни і поділитися своїми враженнями. Щоб це зробити, клікніть по кнопці в правому нижньому кутку. ',
// 				close: 'ЗАКРИТИ'
// 			}
// 		}
//
// 		const { title, descr1, descr2, close } = localization[ukrainian ? 'ukrainian' : 'russian' ]
//
// 		const notificationTemplate = `
// 			<div class="fd-f-left newcvdb-notification -show">
// 				<div class="fd-f-left-middle newcvdb-notification__left fd-p20">
// 					<img src="https://" + ruavars.cloudImages + "2017/05/newcvdb-warning.svg" alt="New CVDB">
// 				</div>
//
// 				<div class="newcvdb-notification__right">
// 					<span class="newcvdb-notification__close-icon js-newcvdb-close">&times;</span>
// 					<h3 class="fd-beefy-gunso" style="margin-bottom: 20px">${title}</h3>
// 					<p class="newcvdb-notification__descr fd-merchant"">
// 						${descr1}
// 					</p>
//
// 					<p class="newcvdb-notification__descr fd-merchant" style="margin-bottom: 25px;">
// 						${descr2}
// 					</p>
//
// 					<a class="js-newcvdb-close newcvdb-notification__closebtn fd-beefy-soldier" href="#">${close}</a>
// 				</div>
// 			</div>
// 		`
//
// 		$('body').append(notificationTemplate)
// 		notificationPosition()
//
// 		$('.js-newcvdb-close').on('click', (e) => {
// 			e.preventDefault()
// 			$('.newcvdb-notification').removeClass('-show').addClass('-hide')
// 			localStorage.setItem('newCvNotify', Date.now())
// 		})
//
// 		$(window).resize(() => notificationPosition)
// 		$(window).on('scroll', notificationPosition)
// 	}
// })
//
