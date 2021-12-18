/**
 * Route data for service to remove some uploaded files.
 *
 * @namespace Demo_Shared_WAPI_Remove
 */
// MODULE'S VARS
const NS = 'Demo_Shared_WAPI_Remove';

// MODULE'S CLASSES
/**
 * @memberOf Demo_Shared_WAPI_Remove
 */
class Request {
    /** @type {string} */
    files;
}

/**
 * @memberOf Demo_Shared_WAPI_Remove
 */
class Response {
    /** @type {number} */
    removed;
}

/**
 * Factory to create new DTOs and get route address.
 * @implements TeqFw_Web_Back_Api_WAPI_IRoute
 * @memberOf Demo_Shared_WAPI_Remove
 */
class Factory {
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {Demo_Shared_Defaults} */
        const DEF = spec['Demo_Shared_Defaults$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfStr|function} */
        const castArrayOfStr = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfStr'];

        // DEFINE INSTANCE METHODS
        this.getRoute = () => `/${DEF.NAME}${DEF.WAPI_REMOVE}`;

        /**
         * @param {Request|null} data
         * @return {Demo_Shared_WAPI_Remove.Request}
         */
        this.createReq = function (data = null) {
            const res = new Request();
            res.files = castArrayOfStr(data?.files);
            return res;
        }

        /**
         * @param {Response|null} data
         * @return {Demo_Shared_WAPI_Remove.Response}
         */
        this.createRes = function (data = null) {
            const res = new Response();
            res.removed = castInt(data?.removed);
            return res;
        }
    }
}

// MODULE'S EXPORT
Object.defineProperty(Factory, 'name', {value: `${NS}.Factory`});
Object.defineProperty(Request, 'name', {value: `${NS}.Request`});
Object.defineProperty(Response, 'name', {value: `${NS}.Response`});
export {
    Factory,
    Request,
    Response,
};
