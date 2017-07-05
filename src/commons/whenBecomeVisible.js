const isInViewPort = (el) => {
	if( !$(el).is(':visible') ) return false

	const win = $(window)
	const viewport = {
		top : win.scrollTop(),
		left : win.scrollLeft()
	}

	viewport.right = viewport.left + win.width()
	viewport.bottom = viewport.top + win.height()

	const bounds = $(el).offset()
	bounds.right = bounds.left + $(el).outerWidth()
	bounds.bottom = bounds.top + $(el).outerHeight()

	return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom))
}

const whenBecomeVisible = (selector, callback) => {
	let elemFound = false

	const onScroll = () => {
		if( elemFound ) return

		const elements = document.querySelectorAll(selector)
		if (elements.length === 0) return

		const visibleElements = [].filter.call(elements, isInViewPort)

		if (visibleElements.length) {
			elemFound = true
			window.removeEventListener('scroll', onScroll)
			callback(visibleElements[0])
		}
	}

	$(document).ready(() => { setTimeout(onScroll, 300) })
	window.addEventListener('scroll', onScroll)
}

window.whenBecomeVisible = whenBecomeVisible

export default whenBecomeVisible
