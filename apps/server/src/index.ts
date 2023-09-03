import * as server from './providers/server';
import * as database from './providers/database';

(async () => {
	await Promise.all([database.connect(), server.start()]);
})();
