// 内容中心请求接口derListderList
import { baseApi } from '@/libs/BaseApi';
import MD5 from 'crypto-js/md5';
import Encrypts from '@/libs/Encrypts';
const timestamp: any = Date.now().toString()
//  
//  
/**
 * 1、标签分组查询接口
 * @param data  id 可有可无
 * @returns 
 */
export const getFolderLabel = async (data: any, header: any) => baseApi.post('/content/label/findLabelTree.do', data, 'lc', header);

/**
 * 1、标签查询接口
 * @param data  id 可有可无
 * @returns 
 */
export const qrysysLabel = async (data: any, header: any) => baseApi.post('/content/label/qrysysLabel.do', data, 'lc', header);


/**
 * 2、添加标签接口
 * @param data  labelName：标签名称    parentId：上级标签ID
 * @returns 
 */
export const addFolderLabel = async (data: any, header: any) => baseApi.post('/content/label/addLabel.do', data, 'lc', header);

/**
 * 3、删除标签接口
 * @param data  id  
 * @returns 
 */
export const delFolderLabel = async (data: any, header: any) => baseApi.post('/content/label/deleteLabel.do', data, 'lc', header);

/**
 * 4、查询栏目接口
 * @param data  id  可有可无
 * @returns 
 */
export const getFolderTopic = async (data: any, header: any) => baseApi.post('/content/topic/findTopicTree.do', data, 'lc', header);

/**
 * 5、添加栏目接口(子栏目)
 * @param data  topicName:栏目名称  parentId:上级栏目ID
 * @returns 
 */
export const addFolderTopic = async (data: any, header: any) => baseApi.post('/content/topic/addTopic.do', data, 'lc', header);

/**
 * 5、添加栏目接口(子栏目)
 * @param data  topicName:栏目名称  parentId:上级栏目ID
 * http://localhost:8021/content/labelgrop/addgrop.do
 * @returns 
 */
export const addgrop = async (data: any, header: any) => baseApi.post('/content/labelgrop/addgrop.do', data, 'lc', header);


/**
 * 6、修改栏目接口
 * @param data  id:栏目ID    topicName:栏目名称
 * @returns 
 */
export const updateFolderTopic = async (data: any, header: any) => baseApi.post('/content/topic/updateTopic.do', data, 'lc', header);

/**
 * 7、删除栏目接口
 * @param data  id  
 * @returns 
 */
export const delFolderTopic = async (data: any, header: any) => baseApi.post('/content/topic/deleteTopic.do', data, 'lc', header);

/**
 * 8、内容管理模块的内容列表查询接口 --------------图文海报视频
 * @param data  nowPage	第几页，必传。header中参数
                row4Page	每页条数，必传。header中参数
                topicId	所属栏目ID，字符串类型
                isUploadCover	封面，y表已上传，n表未上传
                titleName	标题名称
                contentType	内容分类，t表文本，p表图片，hv表横版视频，vv表竖版视频，b表海报
                labelId	所属标签ID，字符串类型。
                contentStatus	内容状态，0表暂存，1表待审核，3表审核不通过，4表已删除，5表已上架，6表已下架。字符串类型。
                startTimeStr	创建时间开始，字符串类型，格式yyyy-MM-dd
                endTimeStr	创建时间截止，字符串类型，格式yyyy-MM-dd
 * @returns 
 */
export const getCententList = async (data: any, header: any) => baseApi.post('/content/contentInfo/findCententVoList.do', data, 'lc', header);


/**
 * 8、内容管理模块的内容列表查询接口 --------------话题
 * @param data  nowPage	第几页，必传。header中参数
                row4Page	每页条数，必传。header中参数
                topicId	所属栏目ID，字符串类型
                isUploadCover	封面，y表已上传，n表未上传
                titleName	标题名称
                contentType	内容分类，t表文本，p表图片，hv表横版视频，vv表竖版视频，b表海报
                labelId	所属标签ID，字符串类型。
                contentStatus	内容状态，0表暂存，1表待审核，3表审核不通过，4表已删除，5表已上架，6表已下架。字符串类型。
                startTimeStr	创建时间开始，字符串类型，格式yyyy-MM-dd
                endTimeStr	创建时间截止，字符串类型，格式yyyy-MM-dd
subjectType 话题类型，p表PK类，d表讨论类 
 * @returns // localhost:8021/content/contentSubjectInfo/findSubjectContentInfos.do   
 */

export const findSubjectContentInfos = async (data: any, header: any) => baseApi.post('/content/contentSubjectInfo/findSubjectContentInfos.do', data, 'lc', header);
// localhost:8021/content/contentProductInfo/findRelateContentList.do   关联内容
export const findRelateContentList = async (data: any, header: any) => baseApi.post('/content/contentProductInfo/findRelateContentList.do', data, 'lc', header);


/**
* 8、内容管理模块的内容列表查询接口 ------------- 产品
* @param data  nowPage	第几页，必传。header中参数
               row4Page	每页条数，必传。header中参数
               productCodes   产品编码，多个则用英文逗号隔开 
isUploadCover 封面，y表已上传，n表未上传

titleName 标题名称  
topicId 栏目ID，字符串类型

labelId 标签ID,字符串类型

contentStatus 内容状态，0表暂存，1表待审核，3表审核不通过，4表已删除，5表已上架，6表已下架。字符串类型。数据字典大类代码CONTENT_STATUS 。

startTimeStr 创建时间开始，字符串类型，格式yyyy-MM-dd

endTimeStr 创建时间结束，字符串类型，格式yyyy-MM-dd
* @returns 
*/
export const findProductContentList = async (data: any, header: any) => baseApi.post('/content/contentProductInfo/findProductContentList.do', data, 'lc', header);


/**
 * 9、单条内容查询接口
 * @param data  id  11位的那个
 * @returns 
 */
export const getCententItem = async (data: any, header: any) => baseApi.post('/content/contentInfo/getContentInfoVoById.do', data, 'lc', header);

/**
 * 10、内容保存提交接口
        id	内容ID，11位的那个，空则会新增内容，非空则会修改内容。字符串类型。
        operateType	操作类型，0表保存，1表提交。若是提交操作，内容状态变成“待审核”。字符串类型。
        topicId	栏目ID，字符串类型。
        labelIds	标签ID，多个则用英文逗号隔开。
        titleName	标题名称
        contentType	内容分类
        contentText	内容文本，若内容分类为“文本”则此字段不能为空。
        contentFile	内容文件地址，若内容分类为图文、横版视频、竖版视频、海报，则此字段不能为空。
        summary	摘要
        horizontalCoverFile	横版封面文件地址
        verticalCoverFile	竖版封面文件地址
        canDiscuss	是否可评论，1表是，0表否
        canPraise	是否可点赞，1表是，0表否
        canShare	是否可分享，1表是，0表否
        praiseInitValue	点赞初始值
        shareInitValue	分享初始值
        readInitValue	查看初始值
 * @param data  id  
 * @returns 
 */
export const addContentInfo = async (data: any, header: any) => baseApi.post('/content/contentInfo/addContentInfo.do', data, 'lc', header);

/**
 * 11、内容审核操作接口
 * @param data  findTopicEoByName
            id	内容ID，11位的那个。字符串类型。后来应需求改成了8位
            operateType	操作类型，2表审核通过，3表审核不通过，4表删除，5表上架，6表下架
            note	审核意见
 * @returns 
 */
export const operateContent = async (data: any, header: any) => baseApi.post('/content/contentInfo/operateContent.do', data, 'lc', header);

/**
 * 11、批量删除内容
 * @param data  findTopicEoByName
            contentIds	内容ID，11位的那个。字符串类型。后来应需求改成了8位
            operateType	 操作类型，5表上架，4表删除
           
            localhost:8021/content/contentInfo/operateContentList.do
 * @returns 
 */
export const operateContentList = async (data: any, header: any) => baseApi.post('/content/contentInfo/operateContentList.do', data, 'lc', header);


/**
 * 12、评论审核的主页面的查询按钮的接口
 * @param data  
            nowPage	第几页，必传。header中参数
            row4Page	每页条数，必传。header中参数
            topicId	栏目ID，字符串类型。
            contentType	内容分类，t表文本，p表图片，hv表横版视频，vv表竖版视频，b表海报
            labelId	标签ID，字符串类型。
            titleName	标题名称
            startTimeStr	更新时间开始，字符串类型，格式yyyy-MM-dd
            endTimeStr	更新时间截止，字符串类型，格式yyyy-MM-dd
 * @returns 
 */
export const findContentDiscussVos = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/findContentDiscussVos.do', data, 'lc', header);

/**
 *13、查询某内容的评论列表的接口
 * @param data  
            nowPage	第几页，必传。header中参数
            row4Page	每页条数，必传。header中参数
            contentId	内容ID，11位的那个
 * @returns 
 */
export const findDiscussInfoByContentId = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/findDiscussInfoByContentId.do', data, 'lc', header);

/**
 * 14、查询某内容的待审核评论列表接口
 * @param data  
            nowPage	第几页，必传。header中参数
            row4Page	每页条数，必传，header中参数
            contentId	内容ID，11位的那个
 * @returns 
 */
export const getWaitAuditDiscussList = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/getWaitAuditDiscussList.do', data, 'lc', header);

/**
 * 15、单条评论查询接口
 * @param data  id  评论ID
 * @returns 
 */
export const getDiscussEoById = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/getDiscussEoById.do', data, 'lc', header);

/**
 *16、内容中心单条评论审核接口
 * @param data   id  评论ID，即discussId，注意不是serno
 *               operateType   操作类型，2表审核通过，3表审核不通过
 *               checkComments   审核意见
 * @returns 
 */
export const auditDiscussDetail = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/auditDiscussDetail.do', data, 'lc', header);



/**
 * 17、批量评论审核接口
 * @param data  
            list	数组	
                    数组中的对象的属性	说明
                    id	评论ID
                    operateType	操作类型，2表审核通过，3表审核不通过
                    checkComments	审核意见
 * @returns 
 */
export const auditDiscussDetailList = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/auditDiscussDetailList.do', data, 'lc', header);

/**
 * 18、保存封面文件地址接口
 * @param data
            id	内容ID，11位的那个
            verticalCoverFile	横版封面文件地址
            horizontalCoverFile	竖版封面文件地址
 * @returns 
 */
export const saveCoverFileAddress = async (data: any, header: any) => baseApi.post('/content/contentInfo/saveCoverFileAddress.do', data, 'lc', header);

/**
 * 19、运营位管理模块的内容查询接口
 * @param data 
            nowPage	第几页，必传。header中参数
            row4Page	每页条数，必传。header中参数
            topicId	栏目ID，字符串类型
            labelId	标签ID，字符串类型
            titleName	标题名称
            contentType	内容分类，t表文本，p表图片，hv表横版视频，vv表竖版视频，b表海报
            startPublishTime	发布时间开始，字符串类型，格式yyyy-MM-dd
            endPublishTime	发布时间截止，字符串类型，格式yyyy-MM-dd
 * @returns 
 */
export const queryContentList = async (data: any, header: any) => baseApi.post('/content/contentInfoSearch/queryContentList.do', data, 'lc', header);

/**
* 20、根据栏目名称查询栏目的接口
* @param topicName   栏目名称
* @returns 
*/
export const findTopicEoByName = async (data: any, header: any) => baseApi.post('/content/topic/findTopicEoByName.do', data, 'lc', header);

/**
 * 21、查询某内容的待审核评论列表接口
 * @param data  
            nowPage	 第几页，必传。header中参数
            row4Page	 每页条数，必传，header中参数
            contentId 内容ID，11位的那个
            discussId 评论ID，字符串类型，必传。
 * @returns 
 */
export const findReplyListByDiscussId = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/findReplyListByDiscussId.do', data, 'lc')

// 22、数据字典查询接口 /content/dictionary/findDictListByCode
/**
 * @param data   code   CONTENT_STATUS  内容状态、评论状态等数据字典
 *                      YES_OR_NO   是否可评论、是否可点赞、是否可分析等数据字典
 *                      CONTENT_TYPE   内容类型的数据字典
 * @returns 
 */
export const findDictListByCode = async (data: any, header: any) => baseApi.post('/content/dictionary/findDictListByCode.do', data, 'lc', header);

// 22、数据字典查询接口 localhost:8021/content/dictionary/queryDictListByCodes.do
/**
 * @param data   code   CONTENT_STATUS  内容状态、评论状态等数据字典
 *                      YES_OR_NO   是否可评论、是否可点赞、是否可分析等数据字典
 *                      CONTENT_TYPE   内容类型的数据字典
 * @returns 
 */
export const queryDictListByCodes = async (data: any, header: any) => baseApi.post('/content/dictionary/queryDictListByCodes.do', data, 'lc', header);


//  23、内容申请审批记录查询接口
/**
 * @param data   contentId	内容ID（11位的那个）。必传
 * @returns 
 */
export const findReqAuditRecordsByContentId = async (data: any, header: any) => baseApi.post('/content/contentReqAuditRecord/findReqAuditRecordsByContentId.do', data, 'lc', header);



//  24、后台管理系统的回复单个评论的接口
/**
 * @param data   discussId	评论ID
 *               replyContent	回复
 * @returns 
 */
export const replyDiscuss = async (data: any, header: any) => baseApi.post('/content/contentDiscussDetail/replyDiscuss.do', data, 'lc', header);

//  25、内容中心-上传图片公共接口
/**
 * @param data   discussId	评论ID
 *               replyContent	回复
 * @returns 
 */
export const getFileAddress = async (data: any, header: any) => baseApi.post('/content/file/c/upload.do', data, 'lc', header);

//  26、内容中心-富文本弹窗-产品、活动列表查询
/**
 * @param data   discussId	评论ID
 *               replyContent	回复
 * @returns 
 */
export const getProductContentList = async (data: any, header: any) => baseApi.post('/content/contentInfoQuery/findContentInfoForQuote.do', data, 'lc', header);

//  27、内容中心-富文本弹窗-产品列表查询
/**
 * @param data   discussId	评论ID
 *               replyContent	回复
 * @returns 
 */
export const getTopicContentList = async (data: any, header: any) => baseApi.post('/content/contentInfoQuery/findSubjectInfoForQuote.do', data, 'lc', header);

//  28、内容中心-获取html查询
/**
 * @param data   discussId	评论ID
 *               replyContent	回复
 * @returns 
 */
export const getHtmlFile = async (data: any, header: any) => baseApi.post('/content/file/downloadHtml/c/', data, 'lc', header);

//  29、内容中心-获取html查询
/**
 * @param data   discussId	评论ID
 *               replyContent	回复
 * @returns 
 */
export const getMaterialList = async (data: any, header: any) => baseApi.post('/content/material/queryMaterial.do', data, 'lc', header);

//  29、内容中心-下载图片查询
/**
 * @param data   discussId	评论ID
 *               replyContent	回复
 * @returns 
 */
export const getImgFile= async (url:any,data: any,header:any) => baseApi.post('/content/file/downloadImageOrVideo/c/'+ url, data, 'lc',header);
//  29、内容详情-所属栏目字段查询
/**
 * @param data   topicId	调接口来的ID
 *               
 * @returns 
 */
export const getTopicName= async (data: any,header:any) => baseApi.post( 'content/topic/findTopicTree.do', data, 'lc',header);
/**
 * 内容详情-图文的html文件接口
 *@param data 
 * @returns 
 */
 export const getDownloadHtml = (file:any) =>baseApi.post('/content/file/downloadHtml/c/'+file,'','lc');

 /**
 * 选择标签-添加自定义标签
 *@param data 
 * @returns 
 */
 export const getAddLabel = (data:any,header:any) =>baseApi.post('/content/label/addLabel.do',data,'lc');
