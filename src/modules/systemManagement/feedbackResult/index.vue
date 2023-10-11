<template>
    <div>
        <!-- 处理反馈结果 -->
        <a-tabs class="tabs" v-model:activeKey="activeKey" :tabBarGutter="365">
        <!-- 左边内容 -->
            <a-tab-pane key="1" tab="基础信息">
                <div class="basic">
                    <a-form>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">所属栏目：</a-col>
                            <a-col class="content">{{ detail.topicName }}</a-col>
                        </a-row>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">标题名称：</a-col>
                            <a-col class="content">{{detail.titleName}}</a-col>
                        </a-row>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">所属标签：</a-col>
                            <a-col>
                                <a-button v-for="item in btnArray" class="label" type="primary" shape="round" :ghost="true">
                                    {{ item }}
                                </a-button>

                            </a-col>
                        </a-row>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">内容分类：</a-col>
                            <a-col>
                                <div class="content" style="margin-bottom: 10px;">{{ detail.contentType}}</div>
                                <!-- 图文 -->
                                <div v-if="detail.contentType === '图文'">
                                    <!-- 原先这里的高度是180px -->
                                    <div style="width: 551px;height: 360px;">
                                        <div v-html="text" style="width:100%;height:100%;overflow: auto;"></div>
                                    </div>
                                    <!-- <iframe :src="'/api/content/file/downloadHtml/c'+contentFile"></iframe> -->
                                </div>
                                <!-- 海报 -->
                                <div v-if="detail.contentType === '海报'">
                                    <div style="width: 551px;height: 180px;">
                                        <img style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+contentFile"/>
                                    </div>
                                </div>
                                <!-- 视频 -->
                                <div v-if="detail.contentType === '视频'">
                                    <div style="width: 551px;height: 180px;">
                                        <video
                                        style="height: 100%;width: 100%;"
                                        :controls = "true"
                                        preload="auto" 
                                        :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+contentFile"></video>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row class="row-style" v-if="detail.contentType !== '话题'">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #999999;line-height: 20px;">摘要：</a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #333333;line-height: 20px;">{{ detail.summary }}</a-col>
                        </a-row>
                        <a-row class="row-style" v-if="detail.contentType !== '话题'">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">封面：</a-col>
                            <a-col style="display: flex;flex-direction: column;">
                                <a-col v-if="detail.horizontalCoverFile !== ''" style="margin-bottom: 15px;">
                                    <div class="content">横版封面</div>
                                    <div style="margin-top: 26px;width: 551px;">
                                        <img  style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+detail.horizontalCoverFile"/>
                                    </div>
                                </a-col>
                                <a-col v-if="detail.verticalCoverFile !== ''">
                                    <div class="content">竖版封面</div>
                                    <div style="margin-top: 26px;width: 551px;">
                                        <img  style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+detail.verticalCoverFile"/>
                                    </div>
                                </a-col>
                            </a-col>
                        </a-row>
                        <!-- 话题  v-if="detail.contentType === '话题'"-->
                        <a-row v-if="detail.contentType === '话题'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    话题分类：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    {{ detail.subjectType }}
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    话题描述：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                <div>
                                    <div v-html="topicText"></div>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题'&& bannerPictureFile !== ''" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    Banner图：
                            </a-col>
                            <a-col>
                                <div style="width: 551px;height: 180px;">
                                    <img  style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+bannerPictureFile"/>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    开始时间：
                            </a-col>
                            <a-col
                                style="width: 300px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    {{ detail.subjectStartTime }}
                            </a-col>
                            <a-col
                                style="width: 105px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    结束时间:
                            </a-col>
                            <a-col
                                style="height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    {{ detail.subjectEndTime }}
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题' && detail.subjectType ===  '话题pk类'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;margin-left: 20px;">
                                    请输入红方观点：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    {{ detail.redOpinion }}
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题' && detail.subjectType ===  '话题pk类'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    请输入蓝方观点：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;margin-left: 20px;">
                                    {{ detail.blueOpinion }}
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题' && detail.subjectType ===  '话题讨论类' " class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    话题结果选项：
                            </a-col>
                            <a-col
                                style="width: 551px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;margin-left: 20px;">
                                <span>{{ detail.optionType }}</span>
                                <div>
                                    <a-table
                                    :columns="columns"
                                    :data-source="dataList"
                                    >
                                    </a-table>
                                </div>
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    是否提示真相：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;margin-left: 20px;">
                                    {{ detail.isTipTruth }}
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题'&& detail.isTipTruth === '是'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    真相标题：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    {{ detail.truthTitle }}
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题' && detail.isTipTruth === '是'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    真相说明：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    {{ detail.truthExplain }}
                            </a-col>
                        </a-row>
                        <a-row v-if="detail.contentType === '话题' && detail.isTipTruth === '是' && detail.pictureFile !== ''" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    上传图片：
                            </a-col>
                            <a-col>
                                <div style="width: 551px;height: 180px;" v-if="pictureFile !== ''">
                                    <img  style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/f/'+pictureFile"/>
                                </div>
                                <div v-if="pictureFile === ''"></div>
                            </a-col>
                        </a-row>
                        <!-- 话题 结束 -->
                        <!-- 产品 -->		
                        <a-row v-if="detail.contentType === '产品'" class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
                                style="width: 42px;height: 20px;font-size: 14px;
                                font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #999999;line-height: 20px;">
                                    产品编码：
                            </a-col>
                            <a-col
                                style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
                                font-weight: 400;color: #333333;line-height: 20px;">
                                    {{ detail.productCodes }}
                            </a-col>
                        </a-row>
                        <!-- 判断 -->
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">阅读初始值：</a-col>
                            <a-col class="content" style="margin-left: 10px;">{{detail.readInitValue}}</a-col>
                        </a-row>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可评论：</a-col>
                            <a-col class="content">{{ detail.canDiscuss === '0'?'是':'否'}}</a-col>
                        </a-row>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可点赞：</a-col>
                            <a-col class="content">{{ detail.canPraise === '0'?'是':'否'}}</a-col>
                            <a-col class="title" id="top">点赞初始值：</a-col>
                            <a-col class="content" style="margin-left: 10px;">{{detail.praiseInitValue}}</a-col>
                        </a-row>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可分享：</a-col>
                            <a-col class="content">{{ detail.canShare === '0'?'是':'否'}}</a-col>
                            <a-col class="title" id="share">分享初始值：</a-col>
                            <a-col class="content" style="margin-left: 10px;">{{ detail.shareInitValue }}</a-col>
                        </a-row>
                        <!-- <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">关联运营位：</a-col>
                            <a-col class="content">{{ detail.isRelateAdvertSpace }}</a-col>
                            <a-col class="title" id="operation">运营位名称：</a-col>
                            <a-col class="content" style="margin-left: 10px;">{{ detail.reachNames }}</a-col>
                        </a-row> -->
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">关联广告位：</a-col>
                            <a-col class="content">{{ detail.isRelateAdvertSpace }}</a-col>
                            <a-col class="title" id="operation" v-if=" detail.isRelateAdvertSpace !== '否'">广告位名称：</a-col>
                            <a-col class="content"  v-if=" detail.isRelateAdvertSpace !== '否'" style="margin-left: 10px;">{{ detail.reachNames }}</a-col>
                        </a-row>
                        <a-row class="row-style">
                            <a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">素材链接地址：</a-col>
                            <a-col style="margin-left: 20px;" class="content">{{ detail.contentLink }}</a-col>
                            <a-col v-if="detail.contentLink !== ''" style="margin-left: 20px;margin-top: -5px;">
                                <a-button @click="copyLink">复制</a-button>
                            </a-col>
                        </a-row>
                        <!-- 反馈历史记录 -->
                        <a-row class="row-style" style="margin-top: 53px;">
                            <a-col :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">
                                <span class="record">
                                    反馈历史记录
                                </span>
                                <hr class="underline" />
                            </a-col>
                        </a-row>
                        <!-- 表格 -->
                        <a-row class="row-style">
                            <a-col class="table" :push="1">
                                <a-table
                                    style="width: 900px;margin-right: 40px;margin-left: 5px;"
                                    :dataSource="userTableData"
                                    :columns="userTableColumns"
                                    :loading="userTableLoading"
                                    :locale="locale"
                                    :pagination="userTablePagination"
                                    @change="handleTableChange"
                                    bordered
                                    >
                                </a-table>
                            </a-col>
                        </a-row>
                        <!-- 底部按钮 -->
                        <a-row :gutter="16">
                            <a-col class="gutter-row" :span="16">
                                <a-button class="gutter-box"
                                    @click="cancleAddContent">
                                    返回
                                </a-button>
                            </a-col>
                            <!-- <a-col class="gutter-row" :span="6">
                                <a-button class="gutter-box"
                                    style="background-color: #177FDB;color: #ffffff;"
                                    @click="saveAddContent">
                                    正常
                                </a-button>
                            </a-col>
                            <a-col class="gutter-row" :span="6">
                                <a-button class="gutter-box"
                                    style="background-color: #177FDB;color: #ffffff;"
                                    @click="saveAddContent2">
                                    下架
                                </a-button>
                            </a-col> -->
                        </a-row>
                    </a-form>
                </div>
            </a-tab-pane>
            <!-- 右边内容 -->
            <a-tab-pane key="3" force-render>
                <a-radio v-model:checked="checked">Radio</a-radio>
                <!-- <commentDetail></commentDetail> -->
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script lang="ts">
import { systemManagementApi } from '@/libs/api/index';
import { AxiosRequestHeaders } from 'axios';
import { contentApi } from '@/libs/api/index';
import Encrypts from '@/libs/Encrypts';
import { Options, Vue } from 'vue-class-component';
//import { Ref } from 'vue-property-decorator';
import { createVNode, ref , reactive} from 'vue';
import { message, Modal,} from 'ant-design-vue';
import { ExclamationCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
//import { global } from '@/libs/Global';
//import moment from 'moment';
import { useRoute } from 'vue-router'


interface UserTableType {
    feedback_person_id: string;
    specific_types_of_feedback: string;
    feedback_specific_type_name: string;
    problem_description : string;
	feedback_time: string;

    // short_link_id: string;
    // short_link_status: string;
}

interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

interface DataType {
    //key: Key;
    mubiaorenqun: string;
    biduizurenqun: string;
    neirongmiaoshu: string;
};
@Options({
    components: {

    }
})
export default class feedbackResult extends Vue{
    [x: string]: any;
    // public router = useRouter()
    //@Ref('addForm') readonly addForm!: FormInstance;
    public userTableData = [] as any [];
    public route = useRoute()
	// public detail: any = {
	// 	sourceLinks:'http://www.dahsgdsf.dsgahdfweuyo25/?',//素材链接复制
    //     topicName:'',//栏目
    //     title_name:'',//标题
    //     labelNames:'',//标签
    //     abstractContent:'',//摘要
    //     initialValue:'',//初始值
    //     likeValue:'',//点赞
    //     sharedValue:'',//分享
    //     associatedValue:'',//关联
    //     content_type_name:'4321',
    //     //content_type_name:'1234',//内容分类
	// };
    public permission: any = [];
    //初始化table表头
    public userTableLoading = false;

    // //表单内容
    public created() {
        this.getList();
        this.getDetail();
         
    }
    public columns = [
		{
			title: '序号',
			dataIndex: 'orderNum',
			// slots: { customRender: 'reachDitch' },
			align: 'center'
		},
		{
			title: '话题结果内容',
			dataIndex: 'resultContent',
			align: 'center'
		},
	];

    //话题里的表格数据
	public dataList:any = []
	public contentLink:any = ''
	public horizontalCoverFile:any = ''
	public verticalCoverFile:any = ''
	public text:any =''
	public topicText:any = ''
	public contentFile:any =''
	public pictureFile:any =''
	public bannerPictureFile:any = ''
	public subjectDescription:any = ''
	public topicId:any =''
	public name:any =''
	public commentId = this.route.query.contentId//传给评论详情子组件的ID

    //创建一个对象，判断如果满足条件就赋值，否者赋空
	public id: string = '';
	// public activeKey: string = '1';
	public activeKey = ref('1');
	public btnArray:any[] = [];
	public detail: any = {}

    //public contentId = this.route.query.content_id
    public async getDetail(){
        const params ={
            id:this.route.query.contentId
        }
         
         
        await contentApi.getCententItem(params,{}).then((res:any) => {
             
            this.detail = res.defmap;
            this.contentFile = res.defmap.contentFile
            this.contentLink = res.defmap.contentLink
            this.horizontalCoverFile = res.defmap.horizontalCoverFile
            this.verticalCoverFile = res.defmap.verticalCoverFile
            this.subjectDescription = res.defmap.subjectDescription
            this.dataList = res.defmap.resultList
            if(res.defmap.contentType === 't'){
                    systemManagementApi.downloadHtml(this.contentFile).then((res:any)=>{
                    this.text = res
                    //  
		        })
		    }
            //当内容分类为话题时
            if(res.defmap.contentType === 's'){
                 
                this.topicText = this.subjectDescription
                this.bannerPictureFile =  res.defmap.bannerPictureFile
                this.pictureFile = res.defmap.pictureFile
            // 	contentApi.getDownloadHtml(this.subjectDescription).then((res:any)=>{
            // 	 
            // 	this.toplicText = res
            // 	 
                
            // })
            }
		
            
            if (this.detail.labelNames) {
                this.btnArray = this.detail.labelNames.split(',')
            }
                if (this.detail.contentType) {
                     
                this.detail.contentType = this.exchangeConentType(this.detail.contentType)
            }
                if(this.detail.canDiscuss){
                     
                this.detail.canDiscuss = this.exchangeCanDiscuss(this.detail.canDiscuss)
            }
                if(this.detail.canPraise){
                     
                this.detail.canPraise = this.exchangeCanPraise(this.detail.canPraise)
            }
                if(this.detail.canShare){
                     
                this.detail.canShare = this.exchangeCanShare(this.detail.canShare)
            }
                if(this.detail.isRelateAdvertSpace){
                     
                this.detail.isRelateAdvertSpace = this.exchangeisRelateAdvertSpace(this.detail.isRelateAdvertSpace)
            }
                if(this.detail.subjectType){
                     
                this.detail.subjectType = this.exchangePkOrd(this.detail.subjectType)
            }
                if(this.detail.isTipTruth){
                     
                this.detail.isTipTruth = this.exchangeTruth(this.detail.isTipTruth)
            }
                if(this.detail.optionType){
                     
                this.detail.optionType = this.exchangeOptionType(this.detail.optionType)
            }
        });
	}


	//转换内容分类代码描述
	exchangeConentType(contentType:string) {
		if (contentType === 't') {
			return "图文"
		} else if (contentType === 'b') {
			return "海报"
		} else if (contentType === 'pr') {
			return "产品"
		} else if (contentType === 's') {
			return "话题"
		} else if (contentType === 'v') {
			return "视频"
		} else{
			return contentType
		}
	}


    //转换话题类的字段
	exchangePkOrd(subjectType:any){
		if(subjectType === 'p'){
			return "话题pk类"
		}else if(subjectType === 'd'){
			return "话题讨论类"
		}
	}
	//转换是否提示真相
	exchangeTruth(isTipTruth:any){
		if(isTipTruth === '1'){
			return "是"
		}else if(isTipTruth === '0'){
			return "否"
		}
	}
	//转换话题讨论单选还是多选
	exchangeOptionType(optionType:any){
		if(optionType === 's'){
			return "单选"
		}else if(optionType === 'm'){
			return "多选"
		}
	}


    exchangeCanDiscuss(canDiscuss:any){
		if(canDiscuss === '1'){
			return "是"
		}else{
			return canDiscuss
		}
	}
	exchangeCanPraise(canPraise:any){
		if(canPraise === '1'){
			return "是"
		}else{
			return canPraise
		}
	}
	exchangeCanShare(canShare:any){
		if(canShare === '1'){
			return "是"
		}else{
			return canShare
		}
	}
	exchangeisRelateAdvertSpace(isRelateAdvertSpace:any){
		if(isRelateAdvertSpace === '1'){
			return "是"
		}else if(isRelateAdvertSpace === '0'){
			return "否"
		}else{
			return isRelateAdvertSpace
		}
	}

    public copyLink(){
		const input = document.createElement('input')
		input.value = this.contentLink
		if (input.value) {
			 
			document.body.appendChild(input)
			input.select()
			document.execCommand('copy')
			document.body.removeChild(input)
			message.info('复制成功！')
		} else {
			message.info('内容链接地址为空！')
		}
	}

	public back(){
		this.$router.go(-1)
	}
	
    //按钮
	//返回
    // public back(){
	// 	this.$router.push({path:'contentManage'})
	// }
	public cancleAddContent(){
         
        //this.router.push({ path: './systemManagement/feedbackList' })
		this.$router.push('/systemManagement/feedbackList')
	}
	//批量正常
	public saveAddContent(record:any){
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '确认正常吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.underdeleteageId(record)
                this.router.push({ path: '/systemManagement/feedbackList' })
            },
        });
	}

    //批量下架
	public saveAddContent2(record:any){
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '确认下架吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.undercarriageId(record)
                this.router.push({ path: '/systemManagement/feedbackList'})
            },
        });
	}

    //正常
    public underdeleteageId(record:any) {
        let params:any = {
            operateType:'1',
            contentIds: [this.typenameId]
		}
         
         
        systemManagementApi.upStatus(params,{}).then((_res) => {
            this.showModal = true;
            message.success('操作成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
             
            this.getList();
        });
        //this.router.push({ path: '/systemManagement/feedbackList' })
    }

    //下架
    public undercarriageId(record:any) {
        let params:any = {
            operateType:'6',
            contentIds:[this.typenameId]
		}
         
         
        systemManagementApi.upStatus(params,{}).then((_res) => {
            this.showModal = true;
            message.success('操作成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
             
            this.userTableLoading = true;
            this.getList();
        });
    }

	
    //初始化table表头
    public userTableColumns= [
        {
            title: '反馈人ID',
            dataIndex: 'feedback_person_id',
            align: 'center',
        },
        {
            title: '反馈分类',
            dataIndex: 'specific_types_of_feedback',
            align: 'center',
        },
        {
            title: '分类名称',
            dataIndex: 'feedback_specific_type_name',
            align: 'center',
        },
        {
            title: '反馈原因',
            dataIndex: 'problem_description',
            align: 'center',
        },
        {
            title: '反馈时间',
            dataIndex: 'feedback_time',
            align: 'center',
        },
    ]

    //分页
    public userTablePagination: PaginationType = {
        current: 1, //当前页数
        total: 0, //数据总数
        pageSize: 10, //每页中显示10条数据  每页条数
        //showLessItems   //是否显示较少页面内容
        //showQuickJumper  //是否可以快速跳转至某页
        //是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '15', '20'], //每页中显示的数据 指定每页可以显示多少条
        showTotal: (total: number) => `共 ${total} 条`,//分页中显示总的数据 用于显示数据总量和当前数据顺序
    };
    //public userTableLoading = false;  // 用户表加载

    //用户列表上一页、下一页
    public handleTableChange(value: PaginationType) {
         
        this.userTablePagination.current = value.current;
        this.userTablePagination.pageSize = value.pageSize;
        this.getList();
    }

    public typenameId: any = '';    

    //查询反馈历史记录
    public async getList() {
        //this.userTableLoading = true;
        let params = {
            contentId:this.route.query.contentId,
        }
         
         
        this.typenameId = this.route.query.contentId
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            }
        }
        await systemManagementApi.getReportInfo(params,header).then((res: any) => {
             
            this.userTableLoading = false;
            this.userTablePagination.total = (res as any).recordsTotal;
            this.userTableData = res.data;
            this.userTableData.forEach((item:any)=>{
                let realm_name_id= item.realm_name_id
                 
            })

            this.userTableData.forEach((item:any)=>{
                 
                if(item.specific_types_of_feedback ==='0'){
                    item.specific_types_of_feedback='举报'
                    if(item.feedback_specific_type_name === '1'){
                        item.feedback_specific_type_name = '含有色情、淫秽、低俗等内容'
                    }else if(item.feedback_specific_type_name === '2'){
                        item.feedback_specific_type_name = '涉嫌违法犯罪行为'
                    }else if(item.feedback_specific_type_name === '3'){
                        item.feedback_specific_type_name = '含有不实时政信息'
                    }else if(item.feedback_specific_type_name === '4'){
                        item.feedback_specific_type_name = '存在欺诈行为'
                    }else if(item.feedback_specific_type_name === '5'){
                        item.feedback_specific_type_name = '含有反社会、血腥暴力等内容'
                    }else if(item.feedback_specific_type_name === '6'){
                        item.feedback_specific_type_name = '存在隐私信息收集行为'
                    }else if(item.feedback_specific_type_name === '7'){
                        item.feedback_specific_type_name = '含有侵权 (冒名、诽谤、抄袭) 信息'
                    }else if(item.feedback_specific_type_name === '8'){
                        item.feedback_specific_type_name = '含有赌博内容'
                    }else if(item.feedback_specific_type_name === '9'){
                        item.feedback_specific_type_name = '其他情况'
                    }
                }else if(item.specific_types_of_feedback ==='1'){
                    item.specific_types_of_feedback='功能异常'
                    if(item.feedback_specific_type_name === '1'){
                        item.feedback_specific_type_name = '无法打开小程序'
                    }else if(item.feedback_specific_type_name === '2'){
                        item.feedback_specific_type_name = '小程序闪退'
                    }else if(item.feedback_specific_type_name === '3'){
                        item.feedback_specific_type_name = '小程序卡顿'
                    }else if(item.feedback_specific_type_name === '4'){
                        item.feedback_specific_type_name = '黑屏、白屏'
                    }else if(item.feedback_specific_type_name === '5'){
                        item.feedback_specific_type_name = '死机'
                    }else if(item.feedback_specific_type_name === '6'){
                        item.feedback_specific_type_name = '界面错位'
                    }else if(item.feedback_specific_type_name === '7'){
                        item.feedback_specific_type_name = '界面加载慢'
                    }else if(item.feedback_specific_type_name === '8'){
                        item.feedback_specific_type_name = '添加到桌面相关异常'
                    }else if(item.feedback_specific_type_name === '9'){
                        item.feedback_specific_type_name = '其他异常'
                    }
                }
            })
             
        })
    }
}
</script> 

<style lang="less" scoped>
.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap,.ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-wrap{
	margin-left: 27px;
    margin-top: 10px;
}

/* 被选中样式 ::v-deep*/
.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
	text-align: center;
	width: 74px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
	line-height: 20px;
}

/* 未被选中样式 */
.ant-tabs-tab-btn {
	width: 74px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
	line-height: 20px;
}

.ant-tabs-ink-bar {
	background: #E8380D;
}

.title {
	// margin-right: 40px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #999999;
	line-height: 20px;
}

.row-style {
	margin-top: 30px;
}
.table{
    //margin-left: 249px;
    margin-top: 22px;
    //width: 980px;
    //height: 810px;
    line-height: 20px;
    background-color: #fcfcfd;
    color: #000000;
    font-size: 14px;
    text-align: center;
    font-family: Microsoft Yahei;
}

.content {
	// margin-left: 40px;	
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
	line-height: 20px;
}

#top,
#share,
#operation {
	margin-left: 60px;
}

.label {
	margin-right: 18px;
	color: #2443BC !important;
	background: #EDEFF9 !important;

}

.ant-btn-background-ghost.ant-btn-primary {
	background: #EDEFF9;
	color: #2443BC;
}
.back{
	margin-top: 24px;
	margin-left: 933px !important;
	width: 84px !important;
	height: 32px !important;
	background: white !important;
	color: black !important;
	border: 1px solid #BFBFBF !important;
}

.record{
    border-left: 2px solid #2443bc; 
    margin-left: 8px;padding: 0 5px;
}
.underline{
    border-bottom: 1px solid #999999; 
    margin-left: 8px; 
    width: 1150px;
    margin-right: 40px;
}
.gutter-row{
    margin-bottom: 170px;
    margin-top: 75px; 
    // text-align: center;
    // margin-left: 40px;
    margin-right: 40px;
}
.gutter-box{
    width: 122px; 
    height: 43px; 
    border-radius: 4px; 
    margin-left: 95px;
}
.ant-table-thead > tr > th{
    background: #E1EBF9 100%;
}

</style>

<!-- <style lang="less" >

//push-位置

/* 被选中样式 */
// .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
// 	text-align: center;
// 	width: 74px;
// 	height: 20px;
// 	font-size: 14px;
// 	font-family: PingFang-SC-Medium, PingFang-SC;
// 	font-weight: 500;
// 	color: #333333;
// 	line-height: 20px;
// }

/* 未被选中样式 */
// .ant-tabs-tab-btn {
// 	width: 74px;
// 	height: 20px;
// 	font-size: 14px;
// 	font-family: PingFang-SC-Regular, PingFang-SC;
// 	font-weight: 400;
// 	color: #333333;
// 	line-height: 20px;
// }

.tabs{
    margin-left: 80px;
}

.row-style{
    margin-top: 30px;
}
.cover{
    height: 40px;
    line-height: 40px;
}
.label{
    width: 80px;
    height: 30px;
    margin-left: 40px;
}
.text{
    // width: 551px;
    // height: 120px;
    // font-size: 14px;
    // font-family: PingFang-SC-Regular, PingFang-SC;
    // font-weight: 400;
    // color: #333333;
    // line-height: 20px;
    // background-color: #999999;
    margin-top: 26px;
    background-color: #EFEFEF; 
    width: 250px; 
    height: 106px;
}

.title{
    height: 40px;
    line-height: 40px;
}
.choice{
    width: 166px;
    height: 40px;
    line-height: 40px;
}
.content{
    margin-left: 0px; 
    background-color: #EFEFEF;
    height: 40px;
    line-height:40px;
    //text-align: center;
    padding: 0 10px;
}
.record{
    border-left: 2px solid #2443bc; 
    margin-left: 8px;padding: 0 5px;
}
.underline{
    border-bottom: 1px solid #999999; 
    margin-left: 8px; 
    width: 1150px;
    margin-right: 40px;
}
.gutter-row{
    margin-bottom: 170px;
    margin-top: 75px; 
    text-align: center;
    margin-left: 40px;
}
.gutter-box{
    width: 122px; 
    height: 43px; 
    border-radius: 4px; 
    margin-left: 95px;
}
.ant-table-thead > tr > th{
    background: #E1EBF9 100%;
}
</style>
  
   -->