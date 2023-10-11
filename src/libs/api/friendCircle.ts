// 朋友圈管理接口
import { baseApi } from '@/libs/BaseApi';


/**
 * 朋友圈管理-查询分组
 * @param data   
 * @returns 
 */
export const qrygrop = async (data: any, header: any) => baseApi.post('/content/assistant/qrygrop.do', data, 'yjf', header);

/** 
 * 朋友圈管理-新增分组
 * @param data   
 * @returns 
 */
export const addgrop = async (data: any, header: any) => baseApi.post('/content/assistant/addgrop.do', data, 'yjf', header);

/**
 * 朋友圈管理-修改分组
 * @param data   
 * @returns 
 */
export const updategrop = async (data: any, header: any) => baseApi.post('/content/assistant/updategrop.do', data, 'yjf', header);

/**
 * 朋友圈管理-删除分组
 * @param data   
 * @returns 
 */
export const deletegrop = async (data: any, header: any) => baseApi.post('/content/assistant/deletegrop.do', data, 'yjf', header);


/**
 * 朋友圈助手-新增帖子/编辑帖子
 * 
 * localhost:8021/content/assistant/addAndEditAssistant.do
 * @param data   
 * @returns 
 */
export const addandEditAssistant = async (data: any, header: any) => baseApi.post('/content/assistant/addAndEditAssistant.do', data, 'yjf', header);

/**
 * 朋友圈助手-营销模块公用的文件上传下载接口
 * 
 * localhost:8021/content/assistant/addAndEditAssistant.do
 * @param data   
 * @returns 
 */
export const upload = async (data: any, header: any) => baseApi.post('/content/file/m/upload.doo', data, 'yjf', header);

 