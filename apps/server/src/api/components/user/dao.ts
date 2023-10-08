import User, { IUserDocument } from './model';
import DAO from '../../../shared/dao';

class UserDAO extends DAO<IUserDocument> {
	constructor() {
		super(User);
	}
}

export default UserDAO;
