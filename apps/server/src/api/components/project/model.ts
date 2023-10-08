import { Document, Schema, Types, model } from 'mongoose';
import environment from '../../../env/index';
const IS_DEV_MODE = environment.node.env === 'development';

export enum ProjectStatus {
	ACTIVE = 'Active',
	ARCHIVED = 'Archived',
	ON_HOLD = 'On hold',
	COMPLETED = 'Completed'
}

export interface ITagConfig {
	title: string;
	color?: string;
	icon?: string;
}

export interface IConfiguration {
	scopes?: Types.DocumentArray<ITagConfig>;
	labels?: Types.DocumentArray<ITagConfig>;
	priorities?: Types.DocumentArray<ITagConfig>;
	statuses?: Types.DocumentArray<ITagConfig>;
}

export interface IProject {
	name: string;
	description?: string;
	status: ProjectStatus;
	configuration?: IConfiguration;
}

export interface IProjectDocument extends IProject, Document {}

const tagSchema = new Schema<ITagConfig>({
	title: {
		type: String,
		required: true
	},
	color: String,
	icon: String
});

const projectSchema = new Schema<IProjectDocument>(
	{
		name: {
			type: String,
			required: [true, 'Project name is required.'],
			maxlength: [50, 'Project name length exceeded the 50 characters limit.'],
			index: {
				unique: true,
				collation: { locale: 'en', strength: 2 }
			}
		},
		description: String,
		status: {
			type: String,
			trim: true,
			set: (v: string) => v.charAt(0).toUpperCase() + v.slice(1).toLocaleLowerCase(),
			enum: Object.values(ProjectStatus),
			default: ProjectStatus.ACTIVE,
			required: [true, 'Project status is required.'],
			index: {
				collation: { locale: 'en', strength: 2 }
			}
		},
		configuration: {
			scopes: [tagSchema],
			labels: [tagSchema],
			priorities: [tagSchema],
			statuses: [tagSchema]
		}
	},
	{
		autoIndex: IS_DEV_MODE,
		autoCreate: IS_DEV_MODE,
		timestamps: true
	}
);

export default model<IProjectDocument>('Project', projectSchema);
