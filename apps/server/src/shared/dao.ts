import mongoose, {
	Model,
	FilterQuery,
	QueryOptions,
	UpdateQuery,
	ClientSession,
	InsertManyOptions,
	SaveOptions,
	CreateOptions,
	PipelineStage,
	AggregateOptions,
	Document
} from 'mongoose';

export default class DAO<T extends Document> {
	private model: Model<T>;

	constructor(model: Model<T>) {
		this.model = model;
	}

	save(document: T, options?: SaveOptions) {
		return document.save(options);
	}

	saveMany(documents: T[], options?: CreateOptions) {
		return this.model.create(documents, options);
	}

	bulkInsert(documents: T[], options: InsertManyOptions = {}) {
		return this.model.insertMany(documents, options);
	}

	findOne(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.findOne(filter, null, options);
	}

	find(filter: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.find(filter, null, options);
	}

	updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions<T>) {
		return this.model.updateOne(filter, update, options);
	}

	updateMany(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions<T>) {
		return this.model.updateMany(filter, update, options);
	}

	updateAndFind(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions<T>) {
		return this.model.findOneAndUpdate(filter, update, options);
	}

	deleteOne(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.deleteOne(filter, options);
	}

	deleteAndFind(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.findOneAndDelete(filter, options);
	}

	deleteMany(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.deleteMany(filter, options);
	}

	count(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.countDocuments(filter, options);
	}

	countAll(options?: QueryOptions<T>) {
		return this.model.estimatedDocumentCount(options);
	}

	aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
		return this.model.aggregate(pipeline, options);
	}

	startSession(): Promise<ClientSession> {
		return mongoose.startSession();
	}
}
