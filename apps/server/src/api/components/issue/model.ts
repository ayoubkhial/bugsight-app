import { Document, Schema, Types, model } from 'mongoose';
import environment from '../../../env/index';

const IS_DEV_MODE = environment.node.env === 'development';

export enum ActivityAction {
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

export interface IIssue {
	number?: number;
	title: string;
	description: string;
	scopes?: {
		title: string;
		color: string;
		icon: string;
	}[];
	labels?: {
		title: string;
		color: string;
		icon: string;
	}[];
	priority?: {
		title: string;
		color: string;
		icon: string;
	};
	status?: {
		title: string;
		icon: string;
	};
	project: Types.ObjectId;
	assignee?: { _id: Types.ObjectId; name: string; picture: string };
	reporter: { _id: Types.ObjectId; name: string; picture?: string };
	sprint?: Types.ObjectId;
	dueDate?: Date;
	watchers?: Types.ObjectId[];
	comments?: {
		author: { _id: Types.ObjectId; name: string; picture: string };
		content: string;
		createdAt?: number;
		updatedAt?: number;
	}[];
	// TODO: Add old value and new value
	activities?: {
		action: ActivityAction;
		by: { _id: Types.ObjectId; name: string; picture: string };
		createdAt?: number;
		updatedAt?: number;
	}[];
	createdAt?: number;
	updatedAt?: number;
}

export interface IIssueDocument extends IIssue, Document {}

const activitySchema = new Schema(
	{
		action: {
			type: String,
			enum: ActivityAction,
			required: true
		},
		by: {
			type: Types.ObjectId,
			ref: 'User',
			required: true
		},
		createdAt: Number,
		updatedAt: Number
	},
	{ timestamps: { currentTime: () => Date.now() } }
);

const commentSchema = new Schema(
	{
		content: {
			type: String,
			required: true
		},
		author: {
			type: Types.ObjectId,
			ref: 'User',
			required: true
		},
		createdAt: Number,
		updatedAt: Number
	},
	{ timestamps: { currentTime: () => Date.now() } }
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
		priority: {
			title: {
				type: String,
				required: true
			},
			color: String,
			icon: String
		},
		status: {
			title: {
				type: String,
				required: true
			},
			icon: String
		},
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
			picture: String
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
			picture: String
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
		activities: [activitySchema],
		createdAt: Number,
		updatedAt: Number
	},
	{
		autoIndex: IS_DEV_MODE,
		autoCreate: IS_DEV_MODE,
		timestamps: { currentTime: () => Date.now() }
	}
);

issueSchema.index({ number: 1, project: 1 }, { unique: true });

export default model<IIssueDocument>('Issue', issueSchema);
