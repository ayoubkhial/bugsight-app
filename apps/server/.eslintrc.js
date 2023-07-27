module.exports = {
	extends: ['@bugsight/eslint-config-shared'],
	env: {
		es2023: true,
		node: true
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	}
};
