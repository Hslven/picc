import { baseApi } from '@/libs/BaseApi';
//  1、网页列表
/**
 * @param data   
 *               
 * @returns 
 */
export const queryWebBuildingByList = async (data: any,header:any) => baseApi.post('/content/WebBuilding/queryWebBuildingByList.do', data, 'lc',header);
//  2、删除&&添加网页
/**
 * @param data   
 *               
 * @returns 
 */
export const addOrDelWebBuilding = async (data: any,header:any) => baseApi.post('/content/WebBuilding/addOrDelWebBuilding.do', data, 'lc',header);

//  3、保存seo
/**
 * @param data   
 *               
 * @returns 
 */
export const saveSeoSetting = async (data: any,header:any) => baseApi.post('/content/WebBuilding/saveSeoSetting.do', data, 'lc',header);

//4、网页搭建-添加元素接口
/**
 * @param data   
 *               
 * @returns 
 */
export const addElement = async (data: any,header:any) => baseApi.post('/content/WebBuilding/addElement.do', data, 'lc',header);

//5、网页搭建-删除元素接口
/**
 * @param data   
 *               
 * @returns 
 */
export const delElement = async (data: any,header:any) => baseApi.post('/content/WebBuilding/delElement.do', data, 'lc',header);

//6、网页搭建-详情
/**
 * @param data   
 *               
 * @returns 
 */
export const queryElementByBuildingId = async (data: any,header:any) => baseApi.post('/content/WebBuilding/queryElementByBuildingId.do', data, 'lc',header);

//7、网页搭建-删除元素接口
/**
 * @param data   
 *               
 * @returns 
 */
export const addWebBuildingContent = async (data: any,header:any) => baseApi.post('/content/WebBuilding/addWebBuildingContent.do', data, 'lc',header);

//8、网页搭建-查询单个元素详情
/**
 * @param data   
 *               
 * @returns 
 */
export const queryElementOneByWebId = async (data: any,header:any) => baseApi.post('/content/WebBuilding/queryElementOneByWebId.do', data, 'lc',header);


//9、网页搭建-修改元素
/**
 * @param data   
 *               
 * @returns 
 */
export const updateElement = async (data: any,header:any) => baseApi.post('/content/WebBuilding/updateElement.do', data, 'lc',header);

