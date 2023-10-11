/**
 * Created by cn.mashuai@gmail.com on 2021/11/4.
 */
'use strict';
import config from '../../app.json';
import _ from 'lodash';
import { global } from '@/libs/Global';
import { themeStore } from '@/libs/Theme';

class Config {
    public constructor() {
        if (process.env.NODE_ENV === 'production') {
            _.assignIn(config, (window as any).uniapisConfig);
        }
        global.setLanguage(config.language);
        global.setEncrypt(config.isEncrypt);
        global.setEncryptKey(config.encryptKey);
        global.setLogLevel(config.logLevel);
        const themes: Map<string, Array<string>> = new Map();
        for (const key in config.theme) {
            themes.set(key, (config.theme as any)[key]);
        }
        themeStore.setThemes(themes);
    }

    get baseUrl(): string {
        return (config.url as any)[config.env];
    }

    public router(aRouter: string): string {
        const router = (config.router as any)[aRouter][config.env];
        if (!router) {
            return (config.router as any)[aRouter]['prd'];
        }
        return router;
    }
}

export default new Config();
