import { Document, Schema, Types, model } from 'mongoose';
import environment from '../../../env/index';

const IS_DEV_MODE = environment.node.env === 'development';

enum ActivityAction {
	CREATED = 'Created',
	UPDATED = 'Updated',
	COMMENTED = 'Commented',
	ASSIGNED = 'Assigned',
	UNASSIGNED = 'Unassigned',
	CLOSED = 'Closed',
	REOPEN = 'Reopened',
	LABELED = 'Labeled',
	UNLABELED = 'Unlabeled',
	MOVED = 'Moved'
}

interface ITagConfig {
	title: string;
	color?: string;
	icon?: string;
}

interface IComment {
	author: { _id: Types.ObjectId; name: string; picture: string };
	content: string;
}

// TODO: Add old value and new value
interface IActivity {
	action: ActivityAction;
	by: { _id: Types.ObjectId; name: string; picture: string };
}

export interface IIssue {
	number?: number;
	title: string;
	description: string;
	scopes?: Types.DocumentArray<ITagConfig>;
	labels?: Types.DocumentArray<ITagConfig>;
	priority?: ITagConfig;
	status?: ITagConfig;
	project: Types.ObjectId;
	assignee?: { _id: Types.ObjectId; name: string; picture?: { url: string } };
	reporter: { _id: Types.ObjectId; name: string; picture?: { url: string } };
	sprint?: Types.ObjectId;
	dueDate?: Date;
	watchers?: Types.ObjectId[];
	comments?: Types.DocumentArray<IComment>;
	activities?: Types.DocumentArray<IActivity>;
}

export interface IIssueDocument extends IIssue, Document {}

const tagSchema = new Schema<ITagConfig>({
	title: {
		type: String,
		required: true
	},
	color: String,
	icon: String
});

const activitySchema = new Schema(
	{
		action: {
			type: String,
			enum: ActivityAction,
			required: true
		},
		by: {
			type: {
				_id: {
					type: Types.ObjectId,
					ref: 'User',
					required: true
				},
				name: {
					type: String,
					required: true
				},
				picture: String
			},
			required: true
		}
	},
	{ timestamps: true, _id: false }
);

const commentSchema = new Schema(
	{
		content: {
			type: String,
			required: true
		},
		author: {
			type: {
				_id: {
					type: Types.ObjectId,
					ref: 'User',
					required: true
				},
				name: {
					type: String,
					required: true
				},
				picture: String
			},
			required: true
		}
	},
	{ timestamps: true, _id: false }
);

const issueSchema = new Schema<IIssueDocument>(
	{
		number: {
			type: Number,
			required: true
		},
		title: {
			type: String,
			required: [true, 'Issue title is required.']
		},
		description: {
			type: String,
			required: [true, 'Issue description is required.']
		},
		priority: tagSchema,
		status: tagSchema,
		labels: [tagSchema],
		scopes: [tagSchema],
		project: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: true
		},
		assignee: {
			_id: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			name: {
				type: String,
				required: true
			},
			picture: {
				url: String
			}
		},
		reporter: {
			_id: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			name: {
				type: String,
				required: true
			},
			picture: {
				url: String
			}
		},
		sprint: {
			type: Schema.Types.ObjectId,
			ref: 'Sprint'
		},
		dueDate: {
			type: Date,
			min: [new Date(), 'Due date must be at or after the current date.']
		},
		watchers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true
			}
		],
		comments: [commentSchema],
		activities: [activitySchema]
	},
	{
		autoIndex: IS_DEV_MODE,
		autoCreate: IS_DEV_MODE,
		timestamps: true
	}
);

issueSchema.index({ number: 1, project: 1 }, { unique: true });

export default model<IIssueDocument>('Issue', issueSchema);
