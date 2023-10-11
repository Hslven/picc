import { baseApi } from '@/libs/BaseApi';

//运营位-查看详情-内容
export const getReachContent = async (data: any,header:any) => baseApi.post('/content/reachContent/getReachContentInfo.do', data, 'lc',header);
// export const getReachContent = async (data: any,header:any) => baseApi.post('/content/reachContent/getReachContentInfo', data, 'lc',header);
export const getSelectReachMainInfo = async (data: any,header:any) => baseApi.post('/content/reachMain/selectReachMainInfo.do', data, 'lc',header);

//上架 下架
export const getChangeUpStatus = (data: any,header:any) => baseApi.post('/content/reachMain/upStatus.do', data, 'lc',header);

//批量删除
export const getDeleteByIds = (data: any,header:any) => baseApi.post('/content/reachMain/removeByIds.do', data, 'lc',header);

//获取内容描述列表
export const getContentList = (data: any,header:any) => baseApi.post('/content/contentInfoSearch/queryContentList.do', data, 'lc',header);

//查询内容标签列表
export const getLabelQuery = (data: any,header:any) => baseApi.post('/content/label/findLabelTree.do', data, 'lc',header);

//查询栏目分类列表
export const getClassIfication = (data: any,header:any) => baseApi.post('/content/topic/findTopicTree.do', data, 'lc',header);

//新增运营位提交接口
export const pushAddOperationPosition = (data: any,header:any) => baseApi.post('/content/reachMain/saveOperationPosition.do', data, 'lc',header);

//根据标签/作者/内容分类查询内容数量
export const getCountContentNumber = (data: any,header:any) => baseApi.post('/content/reachContent/countContent.do', data, 'lc');

//选择——标签/作者/内容分类
export const getSetRules = (data: any,header:any) => baseApi.post('/content/reachContent/setRules.do', data, 'lc')

//反显内容
export const getSelectReverse = (data: any,header:any) => baseApi.post('/content/reachContent/selectReverseContent.do', data, 'lc')

//反显内容
export const getContentDetailIdList = (data: any,header:any) => baseApi.post('/content/reachContent/selectContentIdByDetailsIds.do', data, 'lc')

//接口文档2  查询运营位详情
/**
 * 
 * @param data  reachId  运营位主键id
 * @returns 
 */
export const getInfo = (data: any,header:any) => baseApi.post('/content/reachMain/getInfo.do', data, 'lc',header);

//  查询运营位置顶规则内容列表
/**
 * 
 * @param data  reachId  运营位主键id
 * @returns 
 */
export const getContentTopList = (data: any,header:any) => baseApi.post('/content/reachContent/chooseContent.do', data, 'lc',header);

//  运营位不符合内容封面图片上传列表
/**
 * 
 * @param data  reachId  运营位主键id
 * @returns 
 */
export const getContentCoverFileImg = (data: any,header:any) => baseApi.post('/content/contentInfo/saveReachContentCoverFileAddress.do', data, 'lc',header);

//  数据查询字典接口
/**
 * 
 * @param data  reachId  运营位主键id
 * @returns 
 */
export const getQueryDicByCode = (data: any,header:any) => baseApi.post('/dic/queryDicByCode.do', data,'sec',header);