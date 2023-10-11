<template>
	<a-tabs class="tabs" v-model:activeKey="activeKey">
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
							<div v-if="detail.contentType === 't'"
								style="width: 551px;height: 120px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #333333;line-height: 20px;">
								{{ detail.contentText }}
							</div>
							<div v-if="detail.contentType !== 't'"
								style="width: 551px;height: 120px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #333333;line-height: 20px;">
								{{ detail.contentFile }}
							</div>
						</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6"
							style="width: 42px;height: 20px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #999999;line-height: 20px;">摘要：</a-col>
						<a-col
							style="width: 551px;height: 70px;font-size: 14px;font-family: PingFang-SC-Regular, PingFang-SC;font-weight: 400;color: #333333;line-height: 20px;">{{ detail.summary }}</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">封面：</a-col>
						<a-col v-if="detail.horizontalCoverFile">
							<div class="content">横版封面</div>
							<div style="margin-top: 26px;"><a-image style="width: 250px; height: 106px;"
									:src="detail.horizontalCoverFile" />
							</div>
						</a-col>
						<a-col v-if="detail.verticalCoverFile">
							<div class="content">竖版封面</div>
							<div style="margin-top: 26px;"><a-image style="width: 250px; height: 106px;"
									:src="detail.verticalCoverFile" />
							</div>
						</a-col>


					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">查看初始值：</a-col>
						<a-col class="content">{{ detail.readInitValue }}</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可评论：</a-col>
						<a-col class="content">{{ detail.canDiscuss }}</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可点赞：</a-col>
						<a-col class="content">{{ detail.canPraise }}</a-col>
						<a-col class="title" id="top">点赞初始值：</a-col>
						<a-col class="content" style="margin-left: 10px;">{{detail.praiseInitValue}}</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可分享：</a-col>
						<a-col class="content">{{ detail.canShare }}</a-col>
						<a-col class="title" id="share">分享初始值：</a-col>
						<a-col class="content" style="margin-left: 10px;">{{ detail.shareInitValue }}</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">关联运营位：</a-col>
						<a-col class="content">是</a-col>
						<a-col class="title" id="operation">运营位名称：</a-col>
						<a-col class="content" style="margin-left: 10px;">人保咨询</a-col>
					</a-row>
					<a-row class="row-style">
						<a-col class="title" :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">素材链接地址：</a-col>
						<a-col style="margin-left: 0px;" class="content">http://www.baidu.com</a-col>
					</a-row>
				</a-form>
				<div>
					<a-button class="back" :ghost="false" @click="back">返回</a-button>
				</div>
			</div>
		</a-tab-pane>
		<a-tab-pane key="2" tab="评论详情" force-render>
			<commentDetail></commentDetail>
		</a-tab-pane>

	</a-tabs>
</template>
<script lang="ts">
import { contentApi } from '@/libs/api'
import { Options, Vue } from 'vue-class-component';
import commentDetail from '../commentDetail/index.vue'
import {ref} from 'vue'
@Options({
    components: {
		commentDetail
    }
})
export default class contentDetail extends Vue{

	public id: string = '';
	// public activeKey: string = '1';
	public activeKey = ref('1');
	public btnArray:any[] = [];
	public detail: any = {
		// id:'',
		// contentType:'',
	};

	created(){
		this.getDetail();
	}

	public getDetail(){
		let a = {
			// id: this.id,
			id:'20230302001'
		};
		contentApi.getCententItem(a,{}).then((res) => {
      	 
      	this.detail = res.defmap;
		
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
    });
	}
	// 	//转换内容分类代码描述
	exchangeConentType(contentType: string) {
		if (contentType === 't') {
			return "文本"
		} else if (contentType === 'p') {
			return "图片"
		} else if (contentType === 'hv') {
			return "横版视频"
		} else if (contentType === 'vv') {
			return "竖版视频"
		} else if (contentType === 'b') {
			return "海报"
		} else{
			return contentType
		}
	}

	exchangeCanDiscuss(canDiscuss: string){
		if(canDiscuss === '1'){
			return "是"
		}else{
			return canDiscuss
		}
	}
	exchangeCanPraise(canPraise: string){
		if(canPraise === '1'){
			return "是"
		}else{
			return canPraise
		}
	}
	exchangeCanShare(canShare: string){
		if(canShare === '1'){
			return "是"
		}else{
			return canShare
		}
	}
	public back(){
		this.$router.push('/operationManage')
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
	margin-top: 24px;
	margin-left: 1180px !important;
	width: 84px !important;
	height: 32px !important;
	background: white !important;
	color: black !important;
	border: 1px solid #BFBFBF !important;
}
</style>
  
  
