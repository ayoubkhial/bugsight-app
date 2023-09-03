import environment from '../../env';
import mongoose, { ConnectOptions, connect as mongoConnect } from 'mongoose';

const connect = async (): Promise<void> => {
	const {
		db: { username, password, cluster, name }
	} = environment;
	const URI = `mongodb+srv://${username}:${password}@${cluster}.0a5vkum.mongodb.net/${name}?retryWrites=true&w=majority`;
	const options: ConnectOptions = { writeConcern: { w: 'majority' }, retryWrites: true };

	mongoose.connection.on('connected', () => {
		console.log(`MongoDB connected: ${name}`);
	});

	mongoose.connection.on('error', (err) => {
		console.log(`Mongoose connection error: ${err?.message}`);
	});

	mongoose.connection.on('disconnected', () => {
		console.log('Mongoose disconnected');
	});

	try {
		await mongoConnect(URI, options);
	} catch (error) {
		if (error instanceof Error) {
			console.log(error);
		}
	}
};

export { connect };
