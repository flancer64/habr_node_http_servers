/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Demo_Back_Defaults {
    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    constructor(spec) {
        this.MOD_WEB = spec['TeqFw_Web_Back_Defaults$'];
        Object.freeze(this);
    }
}
