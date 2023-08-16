interface NodeEnvironment {
	node: {
		env: string;
		port: number;
	};
}

const env = process.env;

const environment: NodeEnvironment = {
	node: {
		env: env.NODE_ENV!,
		port: Number(process.env.NODE_PORT)
	}
};

export default environment;
