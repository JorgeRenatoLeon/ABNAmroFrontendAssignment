interface MetaOptions {
  title: string
  description?: string
  image?: string
}

function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
	let el = document.querySelector<HTMLMetaElement>(selector)
	if (!el) {
		el = document.createElement('meta')
		el.setAttribute(attrName, attrValue)
		document.head.appendChild(el)
	}
	el.setAttribute('content', content)
}

export function useMeta(options: MetaOptions) {
	const fullTitle = `${options.title} | Show Explorer`
	const description = options.description ?? 'Discover top-rated TV shows by genre, timeline, and country.'

	document.title = fullTitle

	setMetaTag('meta[name="description"]', 'name', 'description', description)
	setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle)
	setMetaTag('meta[property="og:description"]', 'property', 'og:description', description)

	if (options.image) {
		setMetaTag('meta[property="og:image"]', 'property', 'og:image', options.image)
	}
}