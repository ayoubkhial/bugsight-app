import { Document, Schema, model } from 'mongoose';
import environment from '../../../env/index';

const IS_DEV_MODE = environment.node.env === 'development';

enum ProjectStatus {
	ACTIVE = 'Active',
	ARCHIVED = 'Archived',
	ON_HOLD = 'On hold',
	COMPLETED = 'Completed'
}

interface ILabelConfig {
	title: string;
	color?: string;
	icon?: string;
}

interface IStatusConfig {
	title: string;
	icon?: string;
}

interface IConfiguration {
	scopes?: ILabelConfig[];
	labels?: ILabelConfig[];
	priorities?: ILabelConfig[];
	status?: IStatusConfig[];
}

export interface IProject {
	name: string;
	description?: string;
	status: ProjectStatus;
	configuration?: IConfiguration;
	createdAt?: number;
	updatedAt?: number;
}

export interface IProjectDocument extends IProject, Document {}

const projectSchema = new Schema<IProjectDocument>(
	{
		name: {
			type: String,
			required: [true, 'Project name is required.'],
			maxlength: [50, 'Project name length exceeded the 50 characters limit.'],
			unique: true
		},
		description: String,
		status: {
			type: String,
			enum: Object.values(ProjectStatus),
			default: ProjectStatus.ACTIVE,
			required: [true, 'Project status is required.']
		},
		configuration: {
			scopes: [
				{
					title: {
						type: String,
						required: true
					},
					color: String,
					icon: String
				}
			],
			labels: [
				{
					title: {
						type: String,
						required: true
					},
					color: String,
					icon: String
				}
			],
			priorities: [
				{
					title: {
						type: String,
						required: true
					},
					color: String,
					icon: String
				}
			],
			status: [
				{
					title: {
						type: String,
						required: true
					},
					icon: String
				}
			]
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

export default model<IProjectDocument>('Project', projectSchema);
