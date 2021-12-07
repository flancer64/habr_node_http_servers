// MODULE'S IMPORT
import {createServer} from 'http';
import {onRequest} from './lib.mjs';

// MODULE'S FUNCTIONALITY
const server = createServer();
server.listen(4010);
server.on('error', (err) => console.dir(err));
server.on('request', onRequest);
