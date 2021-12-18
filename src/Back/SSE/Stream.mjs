/**
 * Events stream from server to client.
 */
// MODULE'S IMPORT
import {constants as H2} from 'http2';
import {readdirSync} from 'fs';
import {join} from "path";

// MODULE'S VARS
const SSE_CLOSE = 'close'; // SSE marker that connection is closed
const {
    HTTP2_HEADER_CACHE_CONTROL,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP_STATUS_OK,
} = H2;


export default class Demo_Back_SSE_Stream {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Demo_Back_Defaults} */
        const DEF = spec['Demo_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];

        // DEFINE WORKING VARS / PROPS
        const _root = join(config.getBoot().projectRoot, DEF.MOD_WEB.DATA_DIR_UPLOAD);

        // DEFINE INNER FUNCTIONS


        // DEFINE INSTANCE METHODS
        this.act = function (req, res) {
            return new Promise((resolve) => {
                res.writeHead(HTTP_STATUS_OK, {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/event-stream',
                    [HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
                });
                // get listing for files in UPLOAD-folder
                const list = readdirSync(_root);
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
                        resolve();
                    }
                })();
            });
        }
    }
}
