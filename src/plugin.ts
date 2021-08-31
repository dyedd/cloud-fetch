/********************************************************************************
 * Copyright (C) 2021 dyeddi All rights reserved.
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import * as cloudide from '@cloudide/plugin';
import { initNlsConfig, localize } from '@cloudide/nls';
import { WebviewOptions } from '@cloudide/core/lib/common/plugin-common';
import { Plugin } from '@cloudide/core/lib/node/plugin-api';
import { Backend } from './node/backend';

/**
 * Plugin activation entry point, this function is called when plugin is loaded.
 */
export function start(context: cloudide.ExtensionContext) {

    /**
     *  Initialize language settings.
     */
    initNlsConfig(context.extensionPath);

    const opts: WebviewOptions = {
        viewType: 'view_type_of_your_plugin_view',
        title: localize('plugin.index.title'),
        targetArea: 'right',
        iconPath: 'resources/icons/plugin.svg',
        viewUrl: 'local:resources/page/index.ejs',
        preserveFocus: true,
        templateEngine: 'ejs'
    };

    /**
     * The backend class that needs to be loaded, the classes in the array must inherit AbstractBackend.
     * Usually you only need to add the methods you want to expose to the frontend in the backen.ts and implement the plugin function in the run method.
     * If you want to define the backend class yourself, just refer to the implementation of the Backend class and add the type definition to the array.
     */
    const backends = [Backend];

    Plugin.create(context, opts, backends);
}

/**
 * The method that is called when the plugin is stopped. 
 * If you need to customize the clean-up action that the plug-in stops, you can add it to the method.
 */
export function stop(context: cloudide.ExtensionContext) {
    Plugin.getInstance().stop();
}
