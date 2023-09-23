import { Document, Schema, Types, model } from 'mongoose';
import environment from '../../../env/index';

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
	createdAt?: number;
	updatedAt?: number;
}

export interface ISprintDocument extends ISprint, Document {}

const sprintSchema = new Schema<ISprintDocument>(
	{
		name: {
			type: String,
			required: [true, 'Sprint name is required.']
		},
		description: String,
		startDate: Date,
		endDate: Date,
		status: {
			type: String,
			required: [true, 'Sprint status is required.'],
			enum: Object.values(SprintStatus),
			default: SprintStatus.ACTIVE
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: [true, 'Sprint project is required.']
		},
		createdAt: Number,
		updatedAt: Number
	},
	{
		autoIndex: IS_DEV_MODE,
		autoCreate: IS_DEV_MODE,
		timestamps: { currentTime: () => Date.now() }
	}
);

export default model<ISprintDocument>('Sprint', sprintSchema);
