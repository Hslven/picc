/**
 * Created by cn.mashuai@gmail.com on 2021/11/22.
 */
'use strict';

import { global } from './Global';

export enum LoggerLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR,
}

class Logger {
    public debug(...args: any[]) {
        if (global.logLevel <= LoggerLevel.DEBUG) {
             
        }
    }

    public info(...args: any[]) {
        if (global.logLevel <= LoggerLevel.INFO) {
             
        }
    }

    public warn(...args: any[]) {
        if (global.logLevel <= LoggerLevel.WARN) {
            console.warn(JSON.stringify(args));
        }
    }

    public error(...args: any[]) {
        if (global.logLevel <= LoggerLevel.ERROR) {
            console.error(JSON.stringify(args));
        }
    }
}

export default new Logger();
