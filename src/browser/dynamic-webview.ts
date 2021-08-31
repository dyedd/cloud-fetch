/********************************************************************************
 * Copyright (C) 2021 dyeddi All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { PluginPage, AbstractFrontend } from '@cloudide/core/lib/browser/plugin-api';
import { LogLevel } from '@cloudide/core/lib/common/plugin-common';
import { exposable, expose } from '@cloudide/messaging';

@exposable
class MyDynamicWebviewPageAPI extends AbstractFrontend {

    /**
     * function call to the frontend will wait until init() to be resolved
     */
    async init(): Promise<void> {

    }

    run(): void {
        this.plugin.log(LogLevel.INFO, 'dynamic webview page loaded!');
    }

    stop(): void {

    }

    @expose('myplugin.dynamic.page.print')
    public print(message: string): string {
        document.body.appendChild(document.createElement('pre')!.appendChild(document.createTextNode(`print function called, param: ${message}`)));
        return "myplugin.dynamic.page.print called";
    }

}

document.addEventListener('DOMContentLoaded', async function() {
    PluginPage.create([MyDynamicWebviewPageAPI]);
});
