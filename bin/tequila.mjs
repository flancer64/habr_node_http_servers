#!/usr/bin/env node
'use strict';
import {dirname, join} from 'path';
import Container from '@teqfw/di';

/* Resolve paths to main folders */
const url = new URL(import.meta.url);
const script = url.pathname;
const bin = dirname(script);  // current folder (./bin)
const root = join(bin, '..'); // project root (./)

try {
    /* Create and setup DI container */
    /** @type {TeqFw_Di_Shared_Container} */
    const container = new Container();
    const pathDi = join(root, 'node_modules/@teqfw/di/src');
    const pathCore = join(root, 'node_modules/@teqfw/core/src');
    container.addSourceMapping('TeqFw_Di', pathDi, true, 'mjs');
    container.addSourceMapping('TeqFw_Core', pathCore, true, 'mjs');

    /* Request Container to construct App then run it */
    /** @type {TeqFw_Core_Back_App} */
    const app = await container.get('TeqFw_Core_Back_App$');
    await app.init({path: root, version: '0.1.0'});
    await app.run();
} catch (e) {
    console.error('Cannot create or run TeqFW application.');
    console.dir(e);
}
