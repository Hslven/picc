import Axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosRequestTransformer, AxiosResponseHeaders } from 'axios';
import isEmpty from 'lodash/isEmpty';
import { global } from './Global';
import Config from '@/libs/Config';
import Logger from '@/libs/Logger';
import Encrypts from '@/libs/Encrypts';
import { gzip } from 'pako';
import {message} from 'ant-design-vue';
import router from '@/router';
import {localStorage} from '@/libs/Storage';
import { duration } from 'moment';
// import MD5 from 'crypto-js/md5';
class Url {
    public constructor(public url: string, public desc?: string, public timeout?: number) {}
}

type ResponseDataFlag = 'success' | 'fail' | 'warn';

export class ResponseData<D, M> {
    public data: Array<D>;
    public defmap: M;
    public flag: ResponseDataFlag;
    public msg: Array<any>;
    public dtildMsg: Array<Map<string, string>>;
    public recordsTotal: number
    public constructor(data: Array<D>, defmap: M, flag: ResponseDataFlag, msg: Array<any>, dtildMsg: Array<Map<string, string>>, recordsTotal: number) {
        this.data = data;
        this.defmap = defmap;
        this.flag = flag;
        this.msg = msg;
        this.dtildMsg = dtildMsg;
        this.recordsTotal = recordsTotal
    }
}

export interface Header {
    request?(header: AxiosRequestHeaders): void;

    response?(header: AxiosResponseHeaders): void;
}

interface LoadingFunc<D, M> {
    showLoading(): void;

    dismissLoading(): void;

    alertFailMsg(data: ResponseData<D, M>): void;
}

export default class BaseApi {
    private axios;

    constructor() {

        const tfReqArray = Axios.defaults.transformRequest;
        let strReqArray: AxiosRequestTransformer = (data: any) => data;
        const gzipReqArray: AxiosRequestTransformer = (data, headers) => {
            if (!headers) {
                return data;
            }
            // 如果已处理过数据，则跳过
            if (headers['Content-Encoding']) {
                return data;
            }
            // 如果数据长度1M，不压缩
            if (data.length < 1024 * 1024) {
                return data;
            }
            return gzip(encodeURIComponent(data));
        };
        if (Array.isArray(tfReqArray)) {
            strReqArray = tfReqArray[0];
        }
        this.axios = Axios.create({
            baseURL: Config.baseUrl,
            timeout: 1000 * 60,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            transformRequest: [strReqArray, gzipReqArray],
        });

        // const timestamp: any = Date.now().toString()
        // headers['timestamp'] = timestamp
        // headers['signature'] = Encrypts.aes(JSON.stringify(data),MD5(timestamp).toString())
        // 增加请求拦截器
        this.axios.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                //统一设置token
                (config.headers as any)['X-Auth-Token'] = localStorage.get('token');
                // 设置机构编码,对应调用非.do请求时用于分库
                // (config.headers as any)['organ_id'] = global.user?.organId;
                Logger.debug('请求headers:', config.headers);
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            },
        );
    }

    /**
     * 向后台发送post请求
     * @param url 请求路径
     * @param data 请求数据
     * @param baseRoute 请求项目
     * @param header 获取返回header信息
     * @returns Promise<ResponseData<P>>
     */
    async post<Q, L, M>(url: string | Url, data: Q, baseRoute = '', header?: Header): Promise<ResponseData<L, M>> {
      
        const loading: LoadingFunc<L, M> = {
            showLoading: () => {
                /**
                 * TODO 需要增加 Loading 页显示
                 */
                // Actions.showLoading();
            },
            dismissLoading: () => {
                /**
                 * TODO 需要增加 Loading 页显示
                 */
                // Actions.dismissLoading();
            },
            alertFailMsg: (data: ResponseData<L, M>) => {
                let msgText=''
                data.msg.forEach((item,idx)=>{
                    for(const key in item){
                        msgText+=item[key]
                        if(key==='99999'){
                            global.clear()
                            router.push('/login')
                        }
                    }
                    if(idx!==data.msg.length-1){
                        msgText+="\n"
                    }
                })
                message.error({
                    content:msgText,
                    duration:3,
                    style:{
                        'white-space': 'pre-line',
                        'display':'flex',
                        'justify-content':'center',
                        'text-align':'left'
                    }
                })
            },
        };
        return this.pubPost(url, data, baseRoute, header, loading);
    }

    /**
     * 静默后台发送post请求，不弹loading，不弹失败提示框
     * @param url 请求路径
     * @param data 请求数据
     * @param baseRoute 请求项目
     * @param header 获取返回header信息
     * @returns Promise<ResponseData<P>>
     */
    public async silentPost<Q, L, M>(url: string | Url, data: Q, baseRoute = '', header?: Header): Promise<ResponseData<L, M>> {
        return this.pubPost(url, data, baseRoute, header);
    }

    private async pubPost<Q, L, M>(url: string | Url, data: Q, baseRoute = '', header?: Header, loading?: LoadingFunc<L, M>): Promise<ResponseData<L, M>> {
        if (isEmpty(url)) {
            throw 'url不能为空';
        }

        if (typeof url === 'string') {
            url = new Url(url);
        }
       
        const desc = url.desc;
        if (global.isEncrypt === 'Y') {
            const strData = JSON.stringify(data);
            (data as any) = {
                data: Encrypts.aes(strData, Encrypts.md5(Encrypts.md5(global.encryptKey) + global.encryptKey)),
            };
        }
        const config: any = {};
        if (header?.request) {
            config.headers = {};
            header.request(config.headers);
        }
       
        const postUrl = Config.router(baseRoute) + url.url;
        Logger.info('请求URL:', postUrl, desc);
        Logger.info('请求数据:', data);
        if (url.timeout) {
            config.timeout = url.timeout * 1000;
        }
        if (loading && loading.showLoading) {
            loading.showLoading();
        }
        const resp = await this.axios.post(postUrl, data, config);
        if (loading && loading.dismissLoading) {
            loading.dismissLoading();
        }
        Logger.info('请求结果:', resp.data);
        if (header?.response) {
            header.response(resp.headers);
        }
        if (resp.data.flag === 'fail') {
            if (loading && loading.alertFailMsg) {
                loading.alertFailMsg(resp.data);
            }
            return Promise.reject(resp.data);
        }
        return Promise.resolve(resp.data);
    }

    public extractMsg(msgs: Array<Map<string, string>>): string {
        let concatStr = '';
        msgs.forEach((msg) => {
            Object.keys(msg).forEach((key) => {
                const msgConcat = msg.get(key);
                if (!msgConcat) {
                    return;
                }
                if ('' == concatStr) {
                    concatStr = concatStr.concat(msgConcat);
                } else {
                    concatStr = concatStr.concat('\n').concat(msgConcat);
                }
            });
        });
        return concatStr;
    }
}

//网络访问失败
// const netErrMsg = '无法访问网络，请尝试以下方法：\n 1.关闭飞行模式\n 2.开启移动数据网络或Wi-Fi\n 3.检查您所在区域的网络信号';
//访问超时失败
// const timeoutMsg = '访问网络超时，请尝试以下方法：\n 1.关闭飞行模式\n 2.开启移动数据网络或Wi-Fi\n 3.检查您所在区域的网络信号';
// const _formatNetMsg = (error: any) => {
//     const errorStr = error.message;
//
//     if (errorStr.includes('Network')) {
//         return netErrMsg;
//     }
//     if (errorStr.includes('timeout')) {
//         return timeoutMsg;
//     }
//
//     return errorStr;
// };

export const baseApi = new BaseApi();
