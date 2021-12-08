/**
 * Functions to use in HTTP/1 & HTTP/2 servers.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {createReadStream, createWriteStream, existsSync, readdirSync, statSync} from 'fs';
import {dirname, join} from 'path';
import {pipeline} from 'stream';
import {rm} from "fs/promises";

// MODULE'S VARS
const {
    HTTP2_HEADER_CACHE_CONTROL,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
    HTTP_STATUS_METHOD_NOT_ALLOWED,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_OK,
} = H2;

const MIME = {
    'bin': 'application/octet-stream',
    'css': 'text/css',
    'gif': 'image/gif',
    'htm': 'text/html',
    'html': 'text/html',
    'ico': 'image/vnd.microsoft.icon',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'mjs': 'text/javascript',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'txt': 'text/plain',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'xml': 'text/xml',
};

const FILE_ICON = 'favicon.ico';
const FILE_INDEX = 'index.html';
const HEAD_FILENAME = 'upload-filename'; // HTTP header to get uploading filename
const SSE_CLOSE = 'close'; // SSE marker that connection is closed
const URL_REMOVE = '/remove/';
const URL_SSE = '/sse/';
const URL_UPLOAD = '/upload/';
const WEB_ROOT = getWebRoot(); // path to './pub/' folder

// MODULE'S FUNCTIONS

/**
 * Detect some MIME types.
 * @param {string} filename
 * @return {string}
 */
function getMimeType(filename) {
    const ext = filename.substring(filename.lastIndexOf(".") + 1);
    const norm = (typeof ext === 'string') ? ext.toLowerCase() : null;
    return MIME[norm] ?? MIME['bin'];
}

/**
 * Get root folder for static files (./pub/).
 * @return {string}
 */
function getWebRoot() {
    /* Resolve paths to main folders */
    const url = new URL(import.meta.url);
    const script = url.pathname;
    const root = dirname(script);
    return join(root, 'pub');
}

/**
 * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 */
function onRequest(req, res) {
    const {method, url} = req;
    console.log(`${(new Date()).toISOString()}: ${method} ${url}`);
    if (method === HTTP2_METHOD_GET)
        if (url === URL_SSE) processServerEvents(res, WEB_ROOT);
        else processStatic(res, url, WEB_ROOT);
    else if (method === HTTP2_METHOD_POST)
        if (url === URL_UPLOAD) processUpload(req, res, WEB_ROOT)
        else if (url === URL_REMOVE) processRemove(req, res, WEB_ROOT)
        else respond404(res);
    else respond405(res);
}

/**
 * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @param {string} root
 */
function processRemove(req, res, root) {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', async () => {
        const json = Buffer.concat(chunks).toString();
        const body = JSON.parse(json);
        let total = 0;
        for (const filename of body.files) {
            const fullPath = join(root, filename);
            if (
                fullPath.startsWith(root) && existsSync(fullPath) &&
                (filename !== FILE_INDEX) && (filename !== FILE_ICON)
            ) {
                await rm(fullPath);
                total++;
            }
        }
        res.writeHead(HTTP_STATUS_OK, {
            [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain'
        });
        res.end(`Total removed: ${total} files.`);
    });
}

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @param {string} root
 */
function processServerEvents(res, root) {
    res.writeHead(HTTP_STATUS_OK, {
        [HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
        [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
    });
    // get listing for files in './pub/' folder
    const list = readdirSync(root);
    const total = list.length;
    let i = 0;
    (function sendEvent() {
        if (i < total) {
            const name = list[i];
            res.write(`data: ${name}\n\n`);
            i++;
            setTimeout(sendEvent, 200);
        } else {
            res.end(`data: ${SSE_CLOSE}\n\n`);
        }
    })();
}

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @param {string} path
 * @param {string} root
 */
function processStatic(res, path, root) {
    const fullPath = join(root, path);
    if (fullPath.startsWith(root) && existsSync(fullPath) && statSync(fullPath).isFile()) {
        // return file content
        const readStream = createReadStream(fullPath);
        const mimeType = getMimeType(fullPath);
        res.writeHead(HTTP_STATUS_OK, {
            [HTTP2_HEADER_CONTENT_TYPE]: mimeType
        });
        pipeline(readStream, res, (err) => {if (err) console.dir(err)});
    } else {
        respond404(res);
    }
}

/**
 * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 * @param {string} root
 */
function processUpload(req, res, root) {
    /** @type {string} */
    const encoded = req.headers[HEAD_FILENAME];
    const filename = Buffer.from(encoded, 'base64').toString();
    const fullPath = join(root, filename);
    if (fullPath.startsWith(root) && (filename !== FILE_INDEX) && (filename !== FILE_ICON)) {
        const ws = createWriteStream(fullPath);
        req.pipe(ws);
    }
    res.writeHead(HTTP_STATUS_OK, {
        [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain'
    });
    res.end('Upload is done.');
}

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 */
function respond404(res) {
    res.writeHead(HTTP_STATUS_NOT_FOUND, {
        [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
    });
    res.end('Requested resource is not found.');
}

/**
 * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
 */
function respond405(res) {
    res.writeHead(HTTP_STATUS_METHOD_NOT_ALLOWED, {
        [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain',
    });
    res.end('Only GET and POST methods are allowed.');
}

export {
    onRequest
}
