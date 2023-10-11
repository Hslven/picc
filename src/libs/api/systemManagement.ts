// 系统配置请求接口
import { baseApi } from '@/libs/BaseApi';
import { Header } from 'ant-design-vue/lib/layout/layout';
/**
 * 域名查询列表接口
 * @param data   
 * @returns 
 */
export const findRealmName = async (data: any, header: any) => baseApi.post('/content/realmName/findRealmName.do', data, 'lc', header);

/**
 * 域名新增接口
 * @param data  
 * @returns 
 */
export const addRealmName = async (data: any, header: any) => baseApi.post('/content/realmName/addRealmName.do', data, 'lc', header);

/**
 * 域名删除接口
 * @param data   
 * @returns 
 */
export const deleteRealmName = async (data: any, header: any) => baseApi.post('/content/realmName/deleteRealmName.do', data, 'lc', header);

/**
 * 域名启用停用接口
 * @param data   
 * @returns 
 */
export const updateRealmName = async (data: any, header: any) => baseApi.post('/content/realmName/updateRealmName.do', data, 'lc', header);


// 标签查询列表接口 /content/label/qrysysLabel
/**
 * 标签查询列表接口
 * @param data   
 * @returns 
 */
export const qrysysLabel = async (data: any, header: any) => baseApi.post('/content/label/qrysysLabel.do', data, 'lc', header);

// 新增标签接口 /content/label/addLabel
/**
 * 新增标签接口
 * @param data   
 * @returns 
 */
export const addLabel = async (data: any, header: any) => baseApi.post('/content/label/addLabel.do', data, 'lc', header);
// 编辑标签接口 /content/label/updateysysLabel
/**
 * 编辑标签接口
 * @param data   
 * @returns 
 */
export const updateysysLabel = async (data: any, header: any) => baseApi.post('/content/label/updateysysLabel.do', data, 'lc', header);

/**
 * 删除标签接口
 * @param data   
 * @returns 
 */
export const batchdeleteLabel = async (data: any, header: any) => baseApi.post('/content/label/batchdeleteLabel.do', data, 'lc', header);



/**
 * 标签管理-查询分组
 * @param data   
 * @returns 
 */
export const qrygrop = async (data: any, header: any) => baseApi.post('/content/labelgrop/qrygrop.do', data, 'lc', header);

/**
 * 标签管理-修改分组
 * @param data   
 * @returns 
 */
export const updategrop = async (data: any, header: any) => baseApi.post('/content/labelgrop/updategrop.do', data, 'lc', header);

/**
 * 标签管理-删除分组
 * @param data   
 * @returns 
 */
export const deletegrop = async (data: any, header: any) => baseApi.post('/content/labelgrop/deletegrop.do', data, 'lc', header);

/** 
 * 标签管理-新增分组
 * @param data   
 * @returns 
 */
export const addgrop = async (data: any, header: any) => baseApi.post('/content/labelgrop/addgrop.do', data, 'lc', header);


// 短链查询列表接口 /content/label/qrysysLabel
/**
 * 短链查询列表接口
 * @param data   
 * @returns 
 */
export const selectShortChainManagement = async (data: any, header: any) => baseApi.post('/content/shortChainManagement/selectShortChainManagement.do', data, 'lc', header);

// 新增短链接口 /content/label/addLabel
/**
 * 新增短链接口
 * @param data   
 * @returns 
 */
export const saveShortChain = async (data: any, header: any) => baseApi.post('/content/shortChainManagement/saveShortChain.do', data, 'lc', header);

// 重定向访问 /content/label/addLabel
/**
 * 新增短链接口
 * @param data   
 * @returns 
 */
export const redirect = async (data: any, header: any) => baseApi.post('/content/shortChainManagement/redirect.do', data, 'lc', header);


// 删除短链接口 /content/label/batchdeleteLabel
/**
 * 删除短链接口
 * @param data   
 * @returns 
 */
export const deleteShortChainById = async (data: any, header: any) => baseApi.post('/content/shortChainManagement/deleteShortChainById.do', data, 'lc', header);

// 查询敏感词列表接口 /content/label/batchdeleteLabel
/**
 * 查询敏感词接口
 * @param data   
 * @returns 
 */
export const selectSensitiveMainInfo = async (data: any, header: any) => baseApi.post('/content/sensitiveMain/selectSensitiveMainInfo.do', data, 'lc', header);
// 操作审批接口 /content/label/labelRecord
/**
 * 
 * @param data  
 *              labelId 标签id
 *              operateType 审批结果(0-同意，1，拒绝）
 *              note 审批备注
 * @returns 
 */
export const getlabelRecord = async (data: any, header: any) => baseApi.post('/content/label/labelRecord.do', data, 'lc', header);

//审批详情 /content/label/labelRecordInfo
/**
 * 
 * @param data  
 *              labelId 标签id
 * @returns 
 */
export const getlabelRecordInfo = async (data: any, header: any) => baseApi.post('/content/label/labelRecordInfo.do', data, 'lc', header);

//审批显示 /content/label/qrylabelRecord
/**
 * 
 * @param data  
 *              labelId 标签id
 *              groupId 分组id 
 * @returns 
 */
export const getqrylabelRecord = async (data: any, header: any) => baseApi.post('/content/label/qrylabelRecord.do', data, 'lc', header);



// 查询敏感词详情信息接口 /content/label/batchdeleteLabel
/**
 * 查询敏感词详情信息接口
 * @param data   
 * @returns 
 */
export const getInfo = async (data: any, header: any) => baseApi.post('/content/sensitiveMain/getInfo.do', data, 'lc', header);

// 批量删除敏感词接口 /content/label/batchdeleteLabel
/**
 * 批量删除敏感词接口
 * @param data   
 * @returns /content/sensitiveMain/removeByIds.do
 */
export const removeByIds = async (data: any, header: any) => baseApi.post('/content/sensitiveMain/removeByIds.do', data, 'lc', header);

// 新增编辑敏感词接口 /content/label/batchdeleteLabel
/**
 * 新增编辑敏感词接口
 * @param data   
 * @returns 
 */
export const saveSensitiveMain = async (data: any, header: any) => baseApi.post('/content/sensitiveMain/saveSensitiveMain.do', data, 'lc', header);

// 新增编辑敏感词选择接口 /content/label/batchdeleteLabel
/**
 * 新增编辑敏感词接口
 * @param data   
 * @returns 
 */
export const selectSensitive = async (data: any, header: any) => baseApi.post('/content/sensitiveMain/getSensitiveByTypeId.do', data, 'lc', header);

// 批量正常下架反馈接口 /content/label/batchdeleteLabel
/**
 * 批量正常下架反馈接口
 * @param data   
 * @returns 
 */
export const upStatus = async (data: any, header: any) => baseApi.post('/content/feedbackManagement/upStatus.do', data, 'lc', header);

// 反馈条件查询接口 /content/label/batchdeleteLabel
/**
 * 反馈条件查询接口
 * @param data   
 * @returns 
 */
export const selectFeedback = async (data: any, header: any) => baseApi.post('/content/feedbackManagement/selectFeedback.do', data, 'lc', header);

// 预览接口 /content/label/batchdeleteLabel
/**
 * 预览查询接口
 * @param data   
 * @returns 
 */
export const getReportInfo = async (data: any, header: any) => baseApi.post('/content/feedbackManagement/getReportInfo.do', data, 'lc', header);

// 素材查询接口 /content/label/batchdeleteLabel
/**
 * 素材查询接口
 * @param data   
 * @returns 
 */
export const queryMaterial = async (data: any, header: any) => baseApi.post('/content/material/queryMaterial.do', data, 'lc', header);

// 素材共享设置接口 /content/label/batchdeleteLabel
/**
 * 素材共享设置接口
 * @param data   
 * @returns 
 */
export const shareMaterial = async (data: any, header: any) => baseApi.post('/content/material/shareMaterial.do', data, 'lc', header);

// 删除素材接口 /content/label/batchdeleteLabel
/**
 * 删除素材接口
 * @param data   
 * @returns 
 */
export const deleteMaterial = async (data: any, header: any) => baseApi.post('/content/material/deleteMaterial.do', data, 'lc', header);

// 打标签接口 /content/label/batchdeleteLabel
/**
 * 打标签接口
 * @param data   
 * @returns 
 */
export const saveMaterialLabelRelation = async (data: any, header: any) => baseApi.post('/content/material/saveMaterialLabelRelation.do', data, 'lc', header);

/**
 * 1、标签查询接口
 * @param data  id 可有可无
 * @returns 
 */
export const getFolderLabel = async (data: any, header: any) => baseApi.post('/content/label/findLabelTree.do', data, 'lc', header);


// 重命名接口 /content/label/batchdeleteLabel
/**
 * 重命名接口
 * @param data   
 * @returns 
 */
export const changeNameMaterial = async (data: any, header: any) => baseApi.post('/content/material/changeNameMaterial.do', data, 'lc', header);


// 上架  下架 删除 /content/label/batchupshelf
/**
 * 上架  下架 删除
 * @param data   
 * @returns 
 */
export const batchupshelf = async (data: any, header: any) => baseApi.post('/content/label/batchupshelf.do', data, 'lc', header);

// 上传素材接口 /content/label/batchdeleteLabel
/**
 * 上传素材接口
 * @param data   
 * @returns 
 */

export const uploadMaterial = async (data: any, header: any) => baseApi.post('/content/material/uploadMaterial.do', data, 'lc', header);

// 引用次数查询接口 /content/label/batchdeleteLabel
/**
 * 引用次数查询接口
 * @param data   
 * @returns 
 */
export const queryMaterialciteCount = async (data: any, header: any) => baseApi.post('/content/material/queryMaterialciteCount.do', data, 'lc', header);

// 上传素材列表查询接口 /content/label/batchdeleteLabel
/**
 * 上传素材列表查询接口
 * @param data   
 * @returns 
 */
export const queryUploadMaterialList = async (data: any, header: any) => baseApi.post('/content/material/queryUploadMaterialList.do', data, 'lc', header);
// 上传素材列表查询接口 /content/label/batchdeleteLabel
/**
 * 更新上传素材列表查询接口
 * @param data   
 * @returns 
 */
export const uploadMaterials = async (data: any, header: any) => baseApi.post('/content/material/uploadMaterials.do', data, 'lc', header);

// 查询敏感词类别树形列表接口 /content/label/batchdeleteLabel
/**
 * 上传素材列表查询接口
 * @param data   
 * @returns 
 */
export const selectSensitiveTypeInfo = async (data: any, header: any) => baseApi.post('/content/sensitiveType/selectSensitiveTypeInfo.do', data, 'lc', header);



// 批量删除列表接口 http://localhost:8021/content/label/deleteLabel.do
/**
 * 上传素材列表查询接口
 * @param data   
 * @returns 
 */
export const getbatchdeleteLabel = async (data: any, header: any) => baseApi.post('/content/label/deleteLabel.do', data, 'lc', header);


// http://localhost:8022/reach/homePage/getCommentInfo.controller

export const getCommentInfo = async (data: any,header:any) => baseApi.post('/reach/homePage/getCommentInfo.controller', data, 'lc',header);

 

// 查询接口
export const findGropByName = async (data: any,header:any) => baseApi.post('/content/labelgrop/findGropByName.do', data, 'lc',header);

export const downloadHtml = (file:any) =>baseApi.post('/content/file/downloadHtml/c/'+file,'','lc');


// 查询栏目接口
export const findTopicEoByName = async (data: any,header:any) => baseApi.post('/content/topic/findTopicEoByName.do', data, 'yjf',header);

// 新增栏目接口
export const addTopic = async (data: any,header:any) => baseApi.post('/content/topic/addTopic.do',data, 'yjf',header);


// 修改栏目接口
export const updateTopic = async (data: any,header:any) => baseApi.post('/content/topic/updateTopic.do',data, 'yjf',header);


// 删除栏目接口
export const deleteTopic = async (data: any,header:any) => baseApi.post('/content/topic/deleteTopic.do',data, 'yjf',header);


// 查询栏目树的接口
export const findTopicTree = async (data: any,header:any) => baseApi.post('/content/topic/findTopicTree.do',data, 'yjf',header);

///content/file/zipFile.do
export const zipFile = async (data: any,header:any) => baseApi.post('/content/file/zipFile.do',data, 'yjf',header);


