<template>
	<a-tabs class="tabs" v-model:activeKey="activeKey">
		<a-tab-pane key="1" tab="基础信息">
			<div class="basic">
				<a-form>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">所属栏目：</a-col>
						<a-col class="content">{{ detail.topicName}}</a-col>
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
							<!-- 海报 -->
							<div v-if="detail.contentType === '海报' && contentFile.length !== 0">
								<div style="width: 551px;height: 180px;">
									<img style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+contentFile"/>
								</div>
							</div>
							<!-- 视频 -->
							<div v-if="detail.contentType === '视频' && contentFile.length !== 0">
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
					<a-row class="row-style" v-if="detail.contentType === '图文'">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">图文分类：</a-col>
						<a-col>
							<!-- 图文 -->
							<div v-if="detail.contentType === '图文'">
								<!-- 原先这里的高度是180px -->
								<div style="width: 555px;height: 364px;padding: 2px;border-radius: 4px;border:solid 1px #595959">
									<div v-html="text" style="width:100%;height:100%;overflow: auto;"></div>
								</div>
								<!-- <iframe :src="'/api/content/file/downloadHtml/c'+contentFile"></iframe> -->
							</div>
						</a-col>
					</a-row>
					<!-- 产品 -->		
					<a-row v-if="detail.contentType === '产品'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
						style="width: 42px;height: 20px;font-size: 14px;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #999999;line-height: 20px;">
						产品编码：
						</a-col>
						<a-col
						style="width: 551px;height: 20px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;">
						{{ detail.productCodes }}</a-col>
					</a-row>
					<a-row v-if="detail.contentType === '产品'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
						style="width: 42px;height: 20px;font-size: 14px;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #999999;line-height: 20px;">
						产品详情：
						</a-col>
						<div>
							<div v-html="text"></div>
						</div>
					</a-row>
					<a-row v-if="detail.contentType === '产品'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
						style="width: 42px;height: 20px;font-size: 14px;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #999999;line-height: 20px;">
						保费金额(元)：
						</a-col>
						<a-col
						style="width: 551px;height: 20px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;">
							<span style="color: red;font-size: 16px;font-weight: 600;">
								{{ detail.minPremium.slice(detail.minPremium.length - 3,detail.minPremium.length) === '/月起' || detail.minPremium.slice(detail.minPremium.length - 3,detail.minPremium.length) === '/年起' ? detail.minPremium.slice(0,detail.minPremium.length - 3 ) : detail.minPremium.slice(0,detail.minPremium.length - 1 )}}
							</span>
							<span>
								{{ detail.minPremium.slice(detail.minPremium.length - 3,detail.minPremium.length) === '/月起' || detail.minPremium.slice(detail.minPremium.length - 3,detail.minPremium.length) === '/年起' ? detail.minPremium.slice(detail.minPremium.length - 3,detail.minPremium.length) : detail.minPremium.slice(detail.minPremium.length - 1,detail.minPremium.length)}}
							</span>
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
						{{ detail.subjectType }}</a-col>
					</a-row>
					<a-row v-if="detail.contentType === '话题'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
						style="width: 42px;height: 20px;font-size: 14px;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #999999;line-height: 20px;">
						话题描述：
						</a-col>
						<a-col
						style="width: 551px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;">
						<div>
							<div>{{ topicText }}</div>
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
						{{ detail.subjectStartTime }}</a-col>
						<a-col
						style="width: 105px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;">
						结束时间:</a-col>
						<a-col
						style="height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;">
						{{ detail.subjectEndTime }}</a-col>
					</a-row>
					<a-row v-if="detail.contentType === '话题' && detail.subjectType ===  '话题pk类'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
						style="width: 42px;height: 20px;font-size: 14px;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #999999;line-height: 20px;margin-right: 30px;">
						请输入红方观点：
						</a-col>
						<a-col
						style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;margin-left: 30px;">
						{{ detail.redOpinion }}</a-col>
					</a-row>
					<a-row v-if="detail.contentType === '话题' && detail.subjectType ===  '话题pk类'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
						style="width: 42px;height: 20px;font-size: 14px;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #999999;line-height: 20px;margin-right: 30px;">
						请输入蓝方观点：
						</a-col>
						<a-col
						style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;margin-left: 30px;">
						{{ detail.blueOpinion }}</a-col>
					</a-row>
					<a-row v-if="detail.contentType === '话题' && detail.subjectType ===  '话题讨论类' "
						 class="row-style">
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
						font-weight: 400;color: #999999;line-height: 20px;margin-right: 20px;">
						是否提示真相：
						</a-col>
						<a-col
						style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #333333;line-height: 20px;margin-left: 20px;">
						{{ detail.isTipTruth }}</a-col>
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
						{{ detail.truthTitle }}</a-col>
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
						{{ detail.truthExplain }}</a-col>
					</a-row>
					<a-row v-if="detail.contentType === '话题' && detail.isTipTruth === '是' && pictureFile !== ''" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
						style="width: 42px;height: 20px;font-size: 14px;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;color: #999999;line-height: 20px;">
						上传图片：
						</a-col>
						<a-col>
							<div style="width: 551px;height: 180px;">
								<img  style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+pictureFile"/>
							</div>
						</a-col>
					</a-row>
					<!-- 话题 结束 -->
					<a-row v-if="detail.contentType !== '话题'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
							style="width: 42px;height: 20px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #999999;line-height: 20px;">摘要：</a-col>
						<a-col
							style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #333333;line-height: 20px;">{{ detail.summary }}</a-col>
					</a-row>
					<a-row  v-if="detail.contentType !== '话题'" class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">封面：</a-col>
						<a-col style="display: flex;flex-direction: column;">
							<a-col v-if="horizontalCoverFile !== ''" style="margin-bottom: 15px;">
								<div class="content">横版封面</div>
								<div style="margin-top: 26px;width: 551px;height: 200px;">
									<img  style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+horizontalCoverFile"/>
								</div>
							</a-col>
							<a-col v-if="verticalCoverFile !== ''">
								<div class="content">竖版封面</div>
								<div style="margin-top: 26px;width: 551px;height: 200px;">
									<img  style="width:100%;height:100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+verticalCoverFile"/>
								</div>
							</a-col>
						</a-col>
					</a-row>
					<a-row class="row-style" v-if="detail.contentType !== '产品'">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">查看初始值：</a-col>
						<a-col class="content">{{ detail.readInitValue }}</a-col>
					</a-row>
					<a-row class="row-style" v-if="detail.contentType !== '产品'">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可评论：</a-col>
						<a-col class="content">{{ detail.canDiscuss === '0' ? '否' : detail.canDiscuss }}</a-col>
					</a-row>
					<a-row class="row-style" v-if="detail.contentType !== '产品'">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可点赞：</a-col>
						<a-col class="content">{{ detail.canPraise === '0' ? '否' : detail.canPraise }}</a-col>
						<a-col class="title" id="top">点赞初始值：</a-col>
						<a-col class="content" style="margin-left: 10px;">{{detail.praiseInitValue}}</a-col>
					</a-row>
					<a-row class="row-style" v-if="detail.contentType !== '产品'">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可分享：</a-col>
						<a-col class="content">{{ detail.canShare === '0' ? '否' : detail.canShare }}</a-col>
						<a-col class="title" id="share">分享初始值：</a-col>
						<a-col class="content" style="margin-left: 10px;">{{ detail.shareInitValue }}</a-col>
					</a-row>
					<a-row class="row-style" v-if="detail.contentType !== '产品'">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">关联广告位：</a-col>
						<a-col class="content">{{ detail.isRelateAdvertSpace }}</a-col>
						<a-col class="title" id="operation" v-if=" detail.isRelateAdvertSpace !== '否'">广告位名称：</a-col>
						<a-col class="content"  v-if=" detail.isRelateAdvertSpace !== '否'" style="margin-left: 10px;">{{ detail.reachNames }}</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="4" :xxl="6">素材链接地址：</a-col>
						<a-col style="margin-left: 0px;" class="content">{{ detail.contentLink }}</a-col>
						<a-col v-if="detail.contentLink !== ''" style="margin-left: 20px;">
							<a-button @click="copyLink">复制</a-button>
						</a-col>
					</a-row>
				</a-form>
                <div class="info" v-if="detailFlag !== '1'">
					<p style="margin-bottom: 10px;">内容审核处理记录</p>
                    <div v-if="checkData.length > '0'">
						<div class="steps">
							<a-steps progress-dot direction="vertical" :current="1" size="small" 
							style="height: 20px; margin-top:10px;">
								<a-step v-for="item in checkData" :key="item.key" disabled="true"
								:status="item.operateType == '2'? 'finish' :item.operateType == '3'? 'error':'arrtr'">
									<!-- <div v-if="item.operatetype !=='6'"> -->
										<template #title>
											<span class="nam">{{ item.operatorName }}</span>
										</template>
										<template #subTitle>
											<span style="margin-left: 10px;color: #000;" v-if="item.operateType === '1'">提交标签审核详情</span>
											<span style="margin-left: 10px;color: #000;" v-else-if="item.operateType === '2' || item.operateType === '3'">
												审核结论:
												<span v-if='item.operateType === "2"' style="color: #24BCB6;">同意</span>
												<span v-else-if='item.operateType === "3"' style="color: #E8380D;">不同意</span>
											</span>
											<span style="margin-left: 20px;">{{ item.crt_date }}</span>
											<div v-if="item.operateType === '3'" style="margin-top: 5px;font-size: 12px;color: #00000073;margin-bottom: 5px;">
												不同意原因:
												<span>{{ item.note }}</span>
											</div>
										</template>
									<!-- </div> -->
								</a-step>
							</a-steps>
						</div>
					</div>
					<div class="null" v-else><p>暂无数据</p></div>
                </div>
				<div style="width:100%;display: flex;justify-content: end;align-items: center;padding: 16px 16px;">
					<a-button :ghost="false" @click="back">返回</a-button>
				</div>
			</div>
		</a-tab-pane>
		<a-tab-pane key="2" tab="评论详情" force-render>
			<commentDetail
				:detailContentId = 'detailContentId'
				:showContentDetail="showContentDetail"
				@cancleComment="cancleComment"
				></commentDetail>
		</a-tab-pane>

	</a-tabs>
</template>
<script lang="ts">
import { contentApi } from '@/libs/api'
import { Options, Vue } from 'vue-class-component';
import commentDetail from '../commentDetail/index.vue'
import {ref} from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { Prop, Watch } from 'vue-property-decorator';
@Options({
    components: {
		commentDetail
    }
})
export default class contentDetail extends Vue{
	@Prop() public showContentDetail:any
	@Prop() public detailFlag:any
	@Prop() public detailContentId:any
	public route = useRoute()
	public id: string = '';
	// public activeKey: string = '1';
	public activeKey = ref('1');
	public btnArray:any[] = [];
	public detail: any = {
		// id:'',
		// contentType:'',
	};
	created(){
		 this.showAddContentChange(this.showContentDetail)
	}
	@Watch('showContentDetail',{deep:true})
	public showAddContentChange(newVal:any){
		console.log(this.showContentDetail)
		if(newVal){
			console.log(this.detailContentId,'detailContentId')
			this.getDetail();
      this.examine();
		}
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
	// public commentId = this.detailContentId//传给评论详情子组件的ID
	public getDetail(){
		let a = {
			// id: this.id,
			id:this.detailContentId,
		};
		contentApi.getCententItem(a,{}).then((res:any) => {
      	 
      	this.detail = res.defmap;
		this.contentFile = res.defmap.contentFile
		this.contentLink = res.defmap.contentLink
		this.horizontalCoverFile = res.defmap.horizontalCoverFile
		this.verticalCoverFile = res.defmap.verticalCoverFile
		this.subjectDescription = res.defmap.subjectDescription
		this.dataList = res.defmap.resultList
		//当内容分类为图文时
		if(res.defmap.contentType === 't' || res.defmap.contentType === 'pr'){
			contentApi.getDownloadHtml(this.contentFile).then((res:any)=>{
			 
			this.text = res
			 
			
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
	// 	//转换内容分类代码描述
	exchangeConentType(contentType:any) {
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
		this.$emit('cancleDetailContent',false)
	}
	public cancleComment(value:boolean){
		this.back()
	}


    public checkData: any = [];
    public examine() {
        let param = {
            contentId: this.detailContentId,
        };
        contentApi.findReqAuditRecordsByContentId(param, {}).then((res) => {
             
			// res.data.forEach((value:any,array:any)=>{

			// 	if(value.operateType =='6'){

			// 		array.splice(value,1)

			// 	}  
			// })
			var data:any=[];

			res.data.forEach((value:any,index,array)=>{

				if(value.operateType !=='6' && value.operateType !=='5' && value.operateType !=='4'){

					data.push(value);

				}  
			})
            this.checkData = data;
			 

        });
    }

}
</script> 

<style lang="less" >
.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap,.ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-wrap{
	margin-left: 27px;
  margin-top: 10px;
}

/* 被选中样式 */
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
	margin-top: 10px;
	margin-left: 933px !important;
	width: 84px !important;
	height: 32px !important;
	background: white !important;
	color: black !important;
	border: 1px solid #BFBFBF !important;
}
.info {
    padding-left: 20px;
	padding-top: 20px;
	margin-top: 20px;
	margin-left: 40px;
	background-color:#F9F9F9;
}

.steps {
    margin-top: 20px;
    .ant-steps-item-container > .ant-steps-item-tail::after {
        background-color: #d8d8d8;
    }
    .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
        background-color: #d8d8d8;
    }
    .ant-steps-item-icon .ant-steps-icon {
        top: -3px;
    }
    .ant-steps-vertical.ant-steps-dot .ant-steps-item > .ant-steps-item-container > .ant-steps-item-tail {
        top: 4px;
    }
}
// 改变对勾颜色
.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
    background-color: #24bcb6;
    border-color: #24bcb6;
}
.ant-steps-item-error .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
    background-color: #E8380D;
    border-color: #E8380D;
}
.ant-steps-item-arrtr .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
    background-color: #d8d8d8;
    border-color: #d8d8d8;
}
.ant-steps-item-error > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
    color:#000000d9;
}
</style>
  
  