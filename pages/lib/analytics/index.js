export const EVENTS = {
	IDS_GENERATED: 'ids-generated'
};

export const logEvent = (action, params) => {
	window && window.gtag && typeof window.gtag === 'function' && window.gtag('event', action, params);
};
