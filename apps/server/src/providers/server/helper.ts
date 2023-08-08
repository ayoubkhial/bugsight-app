import { Request, Response, Router } from 'express';
import { NestedComponents } from './components';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type Module = { default: Route[] };

interface Route {
	path: string;
	method: HttpMethod;
	handler: (req: Request, res: Response) => void;
}

const validMethods: HttpMethod[] = ['get', 'post', 'put', 'delete', 'patch'];

const getPaths = (components: NestedComponents, parentKey = ''): string[] => {
	return Object.keys(components).reduce((acc, key) => {
		const fullPath = parentKey ? `${parentKey}/${key}` : key;
		const value = components[key];
		if (typeof value === 'object' && value) {
			acc.push(...getPaths(value, fullPath));
		} else {
			acc.push(fullPath);
		}
		return acc;
	}, [] as string[]);
};

const registerRoutes = (router: Router, module: Module) => {
	if (!Array.isArray(module.default)) {
		throw new Error(`Invalid module`);
	}
	const routes = module.default;
	for (const route of routes) {
		const method = route.method.toLowerCase() as HttpMethod;
		if (validMethods.includes(method)) {
			router[method](route.path, route.handler);
		} else {
			throw new Error(`Invalid method: ${method}`);
		}
	}
};

export { getPaths, registerRoutes };
