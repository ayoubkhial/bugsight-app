import express, { Router } from 'express';
import { Module, getPaths, registerRoutes } from './helper';
import components from './components';

const COMPONENTS_DIRECTORY = '../../api/components';
const BASE_API_PATH = '/api';
const PORT = 4000;

const start = async () => {
	const app = express();
	const router = Router();
	const componentsPath = getPaths(components);
	try {
		const modulePromises: Promise<Module>[] = componentsPath?.map(
			(path) => import(`${COMPONENTS_DIRECTORY}/${path}`)
		);
		const modulesList = await Promise.all(modulePromises);
		for (const module of modulesList || []) {
			try {
				registerRoutes(router, module);
			} catch (error) {
				if (error instanceof Error) {
					// eslint-disable-next-line no-console
					console.log(error.message);
				}
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			// eslint-disable-next-line no-console
			console.log(error.message);
		}
	}

	app.use(BASE_API_PATH, router);
	app.listen(PORT, () => {
		// eslint-disable-next-line no-console
		console.info('Server running on port 4000...');
	});
};

export { start };
