import { Document, Schema, Types, model } from 'mongoose';
import environment from '../../../env/index';

const IS_DEV_MODE = environment.node.env === 'development';

export enum UserRole {
	DEVELOPER = 'Developer',
	LEADER = 'Leader',
	ADMINISTRATOR = 'Administrator'
}

interface IRole {
	title: UserRole;
	project: Types.ObjectId;
}

export interface IUser {
	name: string;
	username: string;
	email: string;
	password?: string;
	picture?: {
		url: string;
	};
	roles?: Types.DocumentArray<IRole>;
	isActive?: boolean;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
	{
		name: {
			type: String,
			required: [true, 'User name is required.'],
			index: {
				collation: { locale: 'en', strength: 2 }
			},
			trim: true
		},
		username: {
			type: String,
			required: [true, 'username is required.'],
			index: {
				unique: true,
				collation: { locale: 'en', strength: 2 }
			},
			minlength: [6, 'Username must at least be 6 characters.'],
			lowercase: true,
			trim: true
		},
		email: {
			type: String,
			required: [true, 'User email is required.'],
			index: {
				unique: true,
				collation: { locale: 'en', strength: 2 }
			},
			validate: {
				validator(v: string): boolean {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
				},
				message: 'Please enter a valid email.'
			},
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			select: false
		},
		picture: {
			type: {
				url: {
					type: String,
					required: true
				}
			},
			_id: false
		},
		roles: [
			{
				title: {
					type: String,
					enum: Object.values(UserRole),
					required: true
				},
				project: {
					type: Schema.Types.ObjectId,
					ref: 'Project',
					required: true
				},
				_id: false
			}
		],
		isActive: {
			type: Boolean,
			default: false
		}
	},
	{
		autoIndex: IS_DEV_MODE,
		autoCreate: IS_DEV_MODE,
		timestamps: true
	}
);

export default model<IUserDocument>('User', userSchema);
