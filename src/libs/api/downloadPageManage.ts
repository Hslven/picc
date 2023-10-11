import { baseApi } from '@/libs/BaseApi';
//  1、新增应用说明页
/**
 * @param data   
 *               
 * @returns 
 */
export const getAddAppDesc = async (data: any,header:any) => baseApi.post('/content/appdescription/addAppDesc.do', data, 'lc',header);
//  2、编辑应用说明页
/**
 * @param data   
 *               
 * @returns 
 */
export const getUpdateAppDesc = async (data: any,header:any) => baseApi.post('/content/appdescription/updateAppDesc.do', data, 'lc',header);

//  3、查询应用说明页
/**
 * @param data   
 *               
 * @returns 
 */
export const getQueryAppDesc = async (data: any,header:any) => baseApi.post('/content/appdescription/queryAppDesc.do', data, 'lc',header);
//  4、删除单条应用说明
/**
 * @param data   
 *               
 * @returns 
 */
export const getDeleteAppDesc = async (data: any,header:any) => baseApi.post('/content/appdescription/deleteAppDesc.do', data, 'lc',header);


//  5、删除批量应用说明
/**
 * @param data   
 *               
 * @returns 
 */
export const getBatchDeleteAppDesc = async (data: any,header:any) => baseApi.post('/content/appdescription/batchDeleteAppDesc.do', data, 'lc',header);
//  6、查询应用说明名称
/**
 * @param data   
 *               
 * @returns 
 */
export const getQueryApplicationName = async (data: any,header:any) => baseApi.post('/content/appdescription/queryApplicationName.do', data, 'lc',header);

//  7、新增下载页
/**
 * @param data   
 *               
 * @returns 
 */

export const getAddDownloadPage = async (data: any,header:any) => baseApi.post('/content/downloadPage/addDownloadPage.do', data, 'lc',header);

//  8、查询下载页列表
/**
 * @param data   
 *               
 * @returns 
 */

export const getQueryDownloadPageList = async (data: any,header:any) => baseApi.post('/content/downloadPage/queryDownloadPageList.do', data, 'lc',header);
/** 9、编辑下载页
 * @param data   
 *               
 * @returns 
 */
export const getUpdateDownloadPage = async (data: any,header:any) => baseApi.post('/content/downloadPage/updateDownloadPage.do', data, 'lc',header);
/** 10、下载页详情
 * @param data   
 *               
 * @returns 
 */

export const getQueryDownloadPageDetail = async (data: any,header:any) => baseApi.post('/content/downloadPage/queryDownloadPageDetail.do', data, 'lc',header);
/** 11、更新下载页上下架状态的接口
 * @param data   
 *               
 * @returns 
 */

export const getUpdateTaskState = async (data: any,header:any) => baseApi.post('/content/downloadPage/updateTaskState.do', data, 'lc',header);
/** 12、单条删除下载页
 * @param data   
 *               
 * @returns 
 */

export const getDeleteDownloadPage = async (data: any,header:any) => baseApi.post('/content/downloadPage/deleteDownloadPage.do', data, 'lc',header);
/** 13、批量删除下载页
 * @param data   
 *               
 * @returns 
 */

export const getBatchDeleteDownloadPage = async (data: any,header:any) => baseApi.post('/content/downloadPage/batchDeleteDownloadPage.do', data, 'lc',header);
/** 14、获取图片
 * @param data   
 *               
 * @returns 
 */

export const getPhoto = async (url:string,data: any={},header:any={}) => baseApi.post(`/content/file/downloadImageOrVideo/d/${url}`, data, 'lc',header);