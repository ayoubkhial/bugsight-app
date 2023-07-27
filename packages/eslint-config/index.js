module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
	rules: {
		'no-console': 1,
		'@typescript-eslint/no-explicit-any': 'warn'
	}
};
