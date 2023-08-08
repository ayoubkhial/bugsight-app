import Task from './model';

const tasks: Task[] = [
	{
		id: 'task-001',
		name: 'Implement Authentication',
		description: 'Create the authentication module with JWT for user login.',
		status: 'In Progress'
	},
	{
		id: 'task-002',
		name: 'Design Database Schema',
		description: 'Design the database schema for the product catalog and user profiles.',
		status: 'To Do'
	},
	{
		id: 'task-003',
		name: 'Fix Navigation Bug',
		description: 'Resolve the navigation bug that occurs on mobile devices in landscape mode.',
		status: 'Done'
	}
];

const find = (): Task[] => {
	return tasks;
};

const findById = (id: string): Task | undefined => {
	return tasks.find((task) => task.id === id);
};

const findByStatus = (status: 'To Do' | 'In Progress' | 'Done'): Task[] => {
	return tasks.filter((task) => task.status === status);
};

export { find, findById, findByStatus };
