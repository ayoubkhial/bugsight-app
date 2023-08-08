type Task = {
	id: string;
	name: string;
	description: string;
	status: 'To Do' | 'In Progress' | 'Done';
};

export default Task;
