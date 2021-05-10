export const EVENTS = {
	IDS_GENERATED: 'ids-generated',
	CONFIGURATION_RESET: 'configuration-reset',
	CODE_COPIED: 'code-copied',
	URL_COPIED: 'url-copied',
	ONE_ID_COPIED: 'one-id-copied',
	ALL_IDS_COPIED: 'all-ids-copied'
};

export const logEvent = (action, params) => {
	window && window.gtag && typeof window.gtag === 'function' && window.gtag('event', action, params);
};
