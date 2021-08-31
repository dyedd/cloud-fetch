/********************************************************************************
 * Copyright (C) 2021 dyeddi All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import * as cloudide from '@cloudide/plugin';
import * as qs from "qs";
import { exposable, expose } from '@cloudide/messaging';
import { LogLevel } from '@cloudide/core/lib/common/plugin-common';
import { AbstractBackend } from '@cloudide/core/lib/node/plugin-api';

/**
 * Add your backend api in this class
 * Using '@expose' to expose your function to frontend
 */
@exposable
export class Backend extends AbstractBackend {

    /**
     * function call to the backend will wait until init() to be resolved
     */
    async init(): Promise<void> {

    }

    /**
     * Entry of your plugin backend
     * In this function you can call function exposed by frontend 
     */
    public async run(): Promise<void> {
        const retValue = await this.plugin.call('myplugin.page.myApi', 'this is a function call from backend');
        this.plugin.log(LogLevel.INFO, retValue);
    }

    public stop(): void {

    }

    /**
     * this function can be called from plugin frontend as below:
     * @example
     * ```
     * plugin.call('your_backend_function_identifier', 'world').then(ret => {
     *     console.log(ret);
     * });
     * 
     * ```
     */
    // @expose('your_backend_function_identifier')
    // public doSomething(name: string): boolean {
    //     cloudide.window.showInformationMessage(`hello ${name}!`);
    //     return true;
    // }
    public apiUrl = ''
    @expose('get_apiurl')
    public getapiUrl(url: string): void {
        this.apiUrl = url;
    }
    @expose('postData')
    public postData(endpoint: string, { data, token, headers, ...customConfig }: Config = {}) {
        const config = {
            method: "GET",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": data ? "application/json" : "",
            },
            ...customConfig,
        };
        if (config.method.toUpperCase() === "GET") {
            endpoint += `?${qs.stringify(data)}`;
        } else {
            config.body = JSON.stringify(data || {});
        }
        return window
            .fetch(`${this.apiUrl}/${endpoint}`, config)
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    return data;
                } else {
                    return Promise.reject(data);
                }
            });
    }

}
interface Config extends RequestInit {
    token?: string;
    data?: object;
}