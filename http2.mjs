// MODULE'S IMPORT
import {createSecureServer} from 'http2';
import {readFileSync} from 'fs';
import {onRequest} from './lib.mjs';


// MODULE'S FUNCTIONALITY
/** @type {module:http2.Http2SecureServer} */
const server = createSecureServer({
    key: readFileSync('key.pem'),
    cert: readFileSync('cert.pem')
});
server.listen(4020);
server.on('error', (err) => console.dir(err));
server.on('request', onRequest);
