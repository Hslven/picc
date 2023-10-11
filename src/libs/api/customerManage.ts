import { baseApi } from '@/libs/BaseApi';
//  1、查询客户管理列表
/**
 * @param data   
 *               
 * @returns
 */
export const getCustomerList = async (data: any,header:any) => baseApi.post('/content/customerManagement/selectCustomer.do', data, 'lc',header);

//  2、查询客户详情
/**
 * @param data   
 *  
 * @returns
 */
export const getCustomerById = async (data: any,header:any) => baseApi.post('/content/customerManagement/selectCustomerById.do', data, 'lc',header);

//  3、行为标签
/**
 * @param data   
 *  
 * @returns
 */
export const getCustomerLabel = async (data: any,header:any) => baseApi.post('/content/customerManagement/selectCustomerLabelById.do', data, 'lc',header);
