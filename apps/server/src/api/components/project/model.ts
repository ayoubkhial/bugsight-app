import { Document, Schema, SchemaTimestampsConfig, Types, UpdateQuery, model } from 'mongoose';
import environment from '../../../env/index';
import SprintDAO from '../sprint/dao';
import UserDAO from '../user/dao';

const IS_DEV_MODE = environment.node.env === 'development';

export enum ProjectStatus {
	ACTIVE = 'Active',
	ARCHIVED = 'Archived',
	ON_HOLD = 'On hold',
	COMPLETED = 'Completed'
}

interface ITagConfig {
	title: string;
	color?: string;
	icon?: string;
}

interface IConfiguration {
	scopes?: Types.DocumentArray<ITagConfig>;
	labels?: Types.DocumentArray<ITagConfig>;
	priorities?: Types.DocumentArray<ITagConfig>;
	statuses?: Types.DocumentArray<ITagConfig>;
}

interface IProject {
	name: string;
	description?: string;
	status: ProjectStatus;
	configuration?: IConfiguration;
}

export interface IProjectDocument extends IProject, Document, SchemaTimestampsConfig {}

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

const getDuplicatedTitle = (entries: Types.DocumentArray<ITagConfig> | undefined) => {
	const titles = new Set<string>();
	for (const entry of entries || []) {
		const title = entry.title;
		if (titles.has(title)) {
			return { found: true, title };
		}
		titles.add(title);
	}
	return { found: false };
};

const getModifiedConfigurationPaths = (paths: string[]): (keyof IConfiguration)[] => {
	return paths
		.filter((path) => path.includes('configuration') && path.split('.').length === 2)
		.map((path) => path.split('.').pop() as keyof IConfiguration);
};

projectSchema.pre('validate', function (next) {
	const modifiedPaths = this.modifiedPaths({ includeChildren: true });
	const modifiedConfigurationPaths = getModifiedConfigurationPaths(modifiedPaths);
	for (const path of modifiedConfigurationPaths) {
		const entries = this.configuration?.[path];
		const { found, title } = getDuplicatedTitle(entries);
		if (found) {
			throw new Error(`The value ${title} is duplicated in the ${path} array.`);
		}
	}
	next();
});

projectSchema.pre('updateOne', async function (next) {
	const docToUpdate: IProjectDocument = (await this.model.findOne(this.getQuery()))!;
	const updateObject = this.getUpdate() as UpdateQuery<IProjectDocument>;
	const pushOp = updateObject?.$push;
	if (pushOp) {
		for (const [key, value] of Object.entries(pushOp)) {
			if (key.includes('configuration') && key.split('.').length === 2) {
				const path = key.split('.').pop() as keyof IConfiguration;
				const entries = docToUpdate.configuration?.[path];
				const index = entries?.findIndex((entry) => entry.title === value?.title);
				if (index !== -1) {
					throw new Error(`The value ${value?.title} is duplicated in the ${path} array.`);
				}
			}
		}
	}
	next();
});

projectSchema.post('deleteOne', async function () {
	const session = this.getOptions().session;
	const query = this.getQuery();
	const sprintDAO = new SprintDAO();
	await sprintDAO.deleteMany({ project: query._id }, { session });

	const userDAO = new UserDAO();
	await userDAO.updateMany(
		{ roles: { $elemMatch: { project: query._id } } },
		{ $pull: { roles: { project: query._id } } },
		{ session }
	);
});

export default model<IProjectDocument>('Project', projectSchema);
