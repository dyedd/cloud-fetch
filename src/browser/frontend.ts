/********************************************************************************
 * Copyright (C) 2021 dyeddi All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { LogLevel } from '@cloudide/core/lib/common/plugin-common';
import { PluginPage, AbstractFrontend } from '@cloudide/core/lib/browser/plugin-api';
import { exposable, expose } from '@cloudide/messaging';

/**
 * Adding your fronted api in this class
 * Using '@expose' to expose your function to backend
 */
@exposable
class Frontend extends AbstractFrontend {

    /**
     * function call to the frontend will wait until init() to be resolved
     */
    async init(): Promise<void> {

    }

    /**
     * Entry of your plugin frontend
     * In this function your can call function exposed by backend
     */
    run(): void {
        document.getElementById('send')?.addEventListener('click', async () => {
            let baseUrl: string = (document.getElementById('baseUrl') as HTMLInputElement).value;
            let url: string = (document.getElementById('url') as HTMLInputElement).value;
            let method: string = (document.getElementById('method') as HTMLInputElement).value;
            let bodyJson: string = (document.getElementById('bodyJson') as HTMLTextAreaElement).value;
            let hideHeaders: string = (document.getElementById('hideHeaders') as HTMLInputElement).value;
            let authorization: string = (document.getElementById('authorization') as HTMLInputElement).value;
            let config = {
                body: bodyJson ? JSON.parse(bodyJson) : {},
                method,
                m: method,
                token: authorization,
                headers: hideHeaders ? JSON.parse(hideHeaders) : {}
            }
            // console.log(config)
            this.plugin.call('get_apiurl', baseUrl);
            // console.log('----')
            this.plugin.call('postData', url, config).then(
                ret => {
                    document.getElementById('response')?.appendChild(document.createElement('pre').appendChild(document.createTextNode(`${JSON.stringify(ret, null, "\t")}`)));
                    this.plugin.call('logs', JSON.stringify({ baseUrl, url, config, data: ret }))
                    // console.log(JSON.stringify(ret))
                }
            );
            // console.log('++++')
        })
    }

    stop(): void {

    }

    /**
     * this function can be called from plugin backend as below:
     * @example
     * ```
     * plugin.call('myplugin.page.myApi', 'this is a function call from backend').then(ret => {
     *     console.log(ret);
     * });
     * 
     * ```
     */
    // @expose('myplugin.page.myApi')
    // public myApi(message: string): string {
    //     console.log(message);
    //     return 'this is a return value from frontend function';
    // }

}

document.addEventListener('DOMContentLoaded', function() {
    PluginPage.create([Frontend]);
});
