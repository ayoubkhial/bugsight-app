import * as dao from './dao';

const getTasks = () => {
	return dao.find();
};

const getTaskById = (id: string) => {
	return dao.findById(id);
};

const getTasksByStatus = (status: 'To Do' | 'In Progress' | 'Done') => {
	return dao.findByStatus(status);
};

export { getTasks, getTaskById, getTasksByStatus };
