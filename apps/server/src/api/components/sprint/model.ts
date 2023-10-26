import { Document, Schema, Types, model } from 'mongoose';
import environment from '../../../env/index';
import IssueDAO from '../issue/dao';

const IS_DEV_MODE = environment.node.env === 'development';

export enum SprintStatus {
	ACTIVE = 'Active',
	SCHEDULED = 'Scheduled',
	ARCHIVED = 'archived',
	ON_HOLD = 'On hold'
}

export interface ISprint {
	name: string;
	description?: string;
	startDate?: Date;
	endDate?: Date;
	status: SprintStatus;
	project: Types.ObjectId;
}

export interface ISprintDocument extends ISprint, Document {}

const sprintSchema = new Schema<ISprintDocument>(
	{
		name: {
			type: String,
			required: [true, 'Sprint name is required.'],
			index: {
				collation: { locale: 'en', strength: 2 }
			}
		},
		description: String,
		startDate: Date,
		endDate: Date,
		status: {
			type: String,
			required: [true, 'Sprint status is required.'],
			enum: Object.values(SprintStatus),
			default: SprintStatus.ACTIVE,
			index: {
				collation: { locale: 'en', strength: 2 }
			}
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: [true, 'Sprint project is required.']
		}
	},
	{
		autoIndex: IS_DEV_MODE,
		autoCreate: IS_DEV_MODE,
		timestamps: true
	}
);

sprintSchema.index({ name: 1, project: 1 }, { unique: true });

sprintSchema.post('deleteMany', async function () {
	const session = this.getOptions().session;
	const query = this.getQuery();
	const issueDAO = new IssueDAO();
	await issueDAO.deleteMany({ project: query.project }, { session });
});

export default model<ISprintDocument>('Sprint', sprintSchema);
