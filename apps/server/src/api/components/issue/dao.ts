import Issue, { IIssueDocument } from './model';
import DAO from '../../../shared/dao';

class IssueDAO extends DAO<IIssueDocument> {
	constructor() {
		super(Issue);
	}
}

export default IssueDAO;
