import express from 'express';

const start = () => {
	const app = express();

	app.use('/', (req, res, next) => {
		return res.send('JavaScript is AWESOME');
	});

	app.listen(4000, () => {
		console.info(`Server running on port 4000...`);
	});
};

export { start };
