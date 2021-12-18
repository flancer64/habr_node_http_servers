import {join} from "path";
import {existsSync} from "fs";
import {rm} from "fs/promises";

/**
 * Get info about hollow state (free or not).
 *
 * @namespace Demo_Back_WAPI_Remove
 */
// MODULE'S VARS
const NS = 'Demo_Back_WAPI_Remove';

/**
 * @implements TeqFw_Web_Back_Api_WAPI_IFactory
 */
export default class Demo_Back_WAPI_Remove {

    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Demo_Back_Defaults} */
        const DEF = spec['Demo_Back_Defaults$'];
        /** @type {TeqFw_Core_Back_Config} */
        const config = spec['TeqFw_Core_Back_Config$'];
        /** @type {Demo_Shared_WAPI_Remove.Factory} */
        const route = spec['Demo_Shared_WAPI_Remove#Factory$'];

        // DEFINE WORKING VARS / PROPS
        const _root = join(config.getBoot().projectRoot, DEF.MOD_WEB.DATA_DIR_UPLOAD);

        // DEFINE INSTANCE METHODS
        this.getRouteFactory = () => route;

        this.getService = function () {
            // DEFINE INNER FUNCTIONS

            /**
             * @param {TeqFw_Web_Back_Api_WAPI_Context} context
             * @return Promise<void>
             */
            async function service(context) {
                /** @type {Demo_Shared_WAPI_Remove.Request} */
                const req = context.getInData();
                /** @type {Demo_Shared_WAPI_Remove.Response} */
                const res = context.getOutData();
                //
                res.removed = 0;
                for (const filename of req.files) {
                    const fullPath = join(_root, filename);
                    if (fullPath.startsWith(_root) && existsSync(fullPath)
                    ) {
                        await rm(fullPath);
                        res.removed++;
                    }
                }
            }

            // MAIN FUNCTIONALITY
            Object.defineProperty(service, 'name', {value: `${NS}.service`});
            return service;
        }

    }
}
