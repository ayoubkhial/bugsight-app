interface NodeEnvironment {
	node: {
		env: string;
		port: number;
	};
	db: {
		username: string;
		password: string;
		cluster: string;
		name: string;
	};
}

const env = process.env;

const environment: NodeEnvironment = {
	node: {
		env: env.NODE_ENV!,
		port: Number(env.NODE_PORT)
	},
	db: {
		username: env.DB_USERNAME!,
		password: env.DB_PASSWORD!,
		cluster: env.DB_CLUSTER!,
		name: env.DB_NAME!
	}
};

export default environment;
