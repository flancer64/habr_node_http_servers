/**
 * Start web server in HTTP/1.1 mode. Read port number from process environment.
 *
 * @namespace Gae_Back_Cli_Start
 */
// DEFINE WORKING VARS
const NS = 'Gae_Back_Cli_Start';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @constructor
 * @memberOf Gae_Back_Cli_Start
 */
export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Logger} */
    const logger = spec['TeqFw_Core_Shared_Logger$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command#Factory$'];
    /** @type {TeqFw_Di_Shared_Api_IProxy} */
    const proxyServer = spec['TeqFw_Web_Back_Server@'];


    // DEFINE INNER FUNCTIONS
    /**
     * Command action.
     * @returns {Promise<void>}
     * @memberOf Gae_Back_Cli_Start
     */
    async function action() {
        logger.reset(false);
        try {
            const port = process.env.PORT || 8080;
            // create server from proxy then run it
            /** @type {TeqFw_Web_Back_Server} */
            const server = await proxyServer.create;
            await server.run({port, useHttp1: true});
        } catch (error) {
            logger.error(error);
        }
    }

    Object.defineProperty(action, 'name', {value: `${NS}.action`});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = 'app';
    res.name = 'server';
    res.desc = 'Start web server in Google AppEngine compatible mode.';
    res.action = action;
    return res;
}
