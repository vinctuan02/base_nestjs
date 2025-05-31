export const EXCLUDE_API = [
	{
		url: '/config/website',
		method: 'GET',
	},
	{
		url: '/notification',
		method: 'GET',
	},
	{
		url: /^\/channel\/[^/]+\/statistic$/,
		method: 'GET',
	},
	{
		url: /^\/channel\/[^/]+\/graph$/,
		method: 'GET',
	},
	{
		url: /^\/network\/[^/]+\/graph$/,
		method: 'GET',
	},
	{
		url: /^\/partner\/[^/]+\/graph$/,
		method: 'GET',
	},
	{
		url: /^\/project\/[^/]+\/graph$/,
		method: 'GET',
	},
];

export const NOT_SAVE_VALUE = [
	'password',
	'confirmPassword',
	'clientSecret',
	'telegramToken',
	'clientId',
	'apis',
];

export const NOT_SAVE_RES = ['/channel-log', '/log'];
