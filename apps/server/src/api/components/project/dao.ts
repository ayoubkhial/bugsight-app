import Project, { IProjectDocument } from './model';
import DAO from '../../../shared/dao';

class ProjectDAO extends DAO<IProjectDocument> {
	constructor() {
		super(Project);
	}
}

export default ProjectDAO;
