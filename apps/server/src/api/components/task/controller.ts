import * as service from './service';

const getTasks = () => {
	const tasks = service.getTasks();
	return tasks;
};

const getTask = (id: string | undefined) => {
	if (!id) {
		// you can do whatever process you like, ex: throw an error
		return;
	}
	const task = service.getTaskById(id!);
	return task;
};

const getTasksByStatus = (status: string) => {
	if (!status || !['To Do', 'In Progress', 'Done'].includes(status)) {
		// you can do whatever process you like, ex: throw an error
		return;
	}
	const tasks = service.getTasksByStatus(status as 'To Do' | 'In Progress' | 'Done');
	return tasks;
};

export { getTasks, getTask, getTasksByStatus };
