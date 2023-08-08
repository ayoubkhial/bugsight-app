import { Request, Response } from 'express';
import * as controller from './controller';

const routes = [
	{
		path: '/tasks',
		method: 'get',
		handler: (req: Request, res: Response) => {
			const data = controller.getTasks();
			res.status(200).json(data);
		}
	},
	{
		path: '/tasks/:id',
		method: 'get',
		handler: (req: Request, res: Response) => {
			const { id } = req.params;
			const data = controller.getTask(id);
			res.status(200).json(data);
		}
	},
	{
		path: '/tasks/status/:status',
		method: 'get',
		handler: (req: Request, res: Response) => {
			const { status } = req.params;
			const data = controller.getTasksByStatus(status!);
			res.status(200).json(data);
		}
	}
];

export default routes;
