import Sprint, { ISprintDocument } from './model';
import DAO from '../../../shared/dao';

class SprintDAO extends DAO<ISprintDocument> {
	constructor() {
		super(Sprint);
	}
}

export default SprintDAO;
