/********************************************************************************
 * Copyright (C) 2021 dyeddi All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import * as cloudide from '@cloudide/plugin';
import * as qs from "qs";
import { exposable, expose } from '@cloudide/messaging';
import { LogLevel } from '@cloudide/core/lib/common/plugin-common';
import { AbstractBackend } from '@cloudide/core/lib/node/plugin-api';
// import fetch, { RequestInit } from 'node-fetch';
import axios, { AxiosRequestConfig } from 'axios'
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
        // const retValue = await this.plugin.call('myplugin.page.myApi', 'this is a function call from backend');
        // this.plugin.log(LogLevel.INFO, retValue);
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
        // cloudide.window.showInformationMessage(`hello ${this.apiUrl}!`)
    }
    @expose('postData')
    public postData(endpoint: string, { m, body, token, headers, ...customConfig }: Config = {}) {
        const config = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": body ? "application/json" : "",
            },
            url: `${this.apiUrl}/${endpoint}`,
            ...customConfig,
        };
        m = config.method as string;
        if (m.toUpperCase() === "GET") {
            if (JSON.stringify(body) !== '{}')
                config.url += `?${qs.stringify(body)}`;
        } else {
            config.data = body || {};
        }
        // return new Promise((resolve, reject) => {
        //     axios(config).then(res => {
        //         cloudide.window.showInformationMessage(`${JSON.stringify(res.data)}`)
        //         return res.data;
        //         // resolve(res)
        //     }).catch((response) => {
        //         return reject(response)
        //     })
        // })
        return axios(config).then(res => {
            // cloudide.window.showInformationMessage(`${JSON.stringify(res.data)}`)
            return res.data;
            // resolve(res)
        })
        // axios(config).then((res) => {
        //     cloudide.window.showInformationMessage(`hello ${JSON.stringify(res)}!`)
        //     return res.data
        // });
        // const res = await fetch(`${this.apiUrl}/${endpoint}`, config)
        // return await res.json();
    }

}
// interface Config extends RequestInit {
//     token?: string;
//     data?: object;
// }
interface Config extends AxiosRequestConfig {
    m?: string;
    token?: string;
    body?: object;
}