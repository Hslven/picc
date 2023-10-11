<template>
	<div>
		<div class="head-box">评论列表({{ res.recordsTotal }}条)</div>
		<div class="content-box">
			<div v-for="(item, index) in data" :key="index">
				<div class="comment-on-item">
					<div class="comment-on-item-userImage">
						<img :src="item.userImage" alt="">
					</div>
					<div class="comment-on-item-right">
						<div v-if="item.status==='2'" class="comment-on-item-username">{{ item.remark1 ? item.remark1 : item.discusser }}</div>
						<div v-if="item.status==='3'" class="error-content">{{ item.remark1 ? item.remark1 : item.discusser }}</div>
						<div v-if="item.status==='1'" class="comment-on-item-username">{{ item.remark1 ? item.remark1 : item.discusser }}</div>

						<div  v-if="item.status==='2'" class="comment-on-item-content content-margin">{{ item.discussWord }}</div>
						<div  v-if="item.status==='3'" class="error-content content-margin">{{ item.discussWord }}</div>
						<div  v-if="item.status==='1'" class="comment-on-item-content content-margin">{{ item.discussWord }}</div>
						<div class="comment-on-item-sendtime">
							<span class="userSendTime"> {{ item.crt_date }}</span>
							<!-- <span>{{ item.area }}</span> -->
							<!-- <a-buttom class="replay"> 回复</a-buttom> -->
						</div>
					</div>
					<div class="comment-left">
						<div v-if="item.status ==='2'"  class="processor">{{ item.checkerName }}</div>
						<div v-if="item.status ==='3'"  class="error-processor">{{ item.checkerName }}</div>
						<div class="type-box">
							<div v-if="item.status === '2'" class="success-box status-box">审核通过</div>
							<div v-if="item.status === '3'" class="error-box" >
								<div class="error-button status-box">审核不通过</div>
								<a-tooltip placement="top">
									<template #title>
										<span>审核意见：</span>
										<p>{{ item.checkComments }}</p>
									</template>
									<div class="warn-tip">!</div>
								</a-tooltip>
							</div>
							<div class="wait-box status-box" v-if="item.status === '1'">待审核</div>
						</div>
						<div class="time-box"> {{ item.checkTime }}</div>

					</div>
				</div>
				<div>
					<div v-for="i in item.children">
						<div class="replay-on-item">
							<div class="replay-box">
								<div class="comment-on-item-userImage">
									<img :src="i.userImage" alt="">
								</div>
								<div class="comment-on-item-right">
									<div class="comment-on-item-username">{{ i.remark1 ? i.remark1 : i.discusser }} 
										<span class="author">{{ i.author }}</span> 
										<span class="fanhui-time">{{ i.crt_date }}</span>
										<span class="fanhui-ip" v-if="i.replyUser">回复 </span>
										<span class="fanhui-ip" v-if="i.replyUser">{{ i.replyUser }}</span>
									</div>
									<div class="comment-on-item-content">{{ i.discussWord }}</div>
								</div>
							</div>
							<div v-if="i.discusserIsOperator !== '1'" class="replay-right">
								<div v-if="i.status ==='2'"  class="processor">{{ item.checkerName }}</div>
								<div v-if="i.status ==='3'"  class="error-processor">{{ item.checkerName }}</div>
								<div class="type-box">
									<div v-if="i.status === '2'" class="success-box status-box">审核通过</div>
									<div v-if="i.status === '3'" class="error-box" >
										<div class="error-button status-box">审核不通过</div>
										<a-tooltip placement="top">
											<template #title>
												<span>审核意见：</span>
												<p>{{ i.checkComments }}</p>
											</template>
											<div class="warn-tip">!</div>
										</a-tooltip>
									</div>
									<div class="wait-box status-box" v-if="i.status === '1'">待审核</div>
								</div>
								<div class="time-box"> {{ i.checkTime }}</div>
							</div>
						</div>
					</div>
					<div v-if="item.showMore" class="moreReplay-box" @click="moreReply(item)">
							展开更多回复（共{{ item.replyTotal }}条）﹀ 
					</div>
				</div>
			</div>
		</div>
		<div v-if="moreStatus && res.recordsTotal > 0" class="more-box" @click="moreDiscuss">
			查看更多评论
		</div>
		<div style="width: 100%;display: flex;justify-content: end;align-items: center;">
			<a-button class="fanhui-btn" @click="back">返回</a-button>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { contentApi } from '@/libs/api'
import {ref} from 'vue'
import { AxiosRequestHeaders } from 'axios';
import { object } from 'vue-types';
import { Item } from 'ant-design-vue/lib/menu';
import { useRoute } from 'vue-router'//路由传参
import { Prop, Watch } from 'vue-property-decorator';

@Options({
    components: {
    }
})
export default class commentDetail extends Vue{
  @Prop({default: ''}) public commentId!: string //收参
	@Prop() public detailContentId:any
	@Prop() public showContentDetail:any
	public route = useRoute()//路由传参
	public children:any = [];
	public res: any = {};
	public data: any = [];
	public replyList: any = [];
	public fanhuiList: any = [];
	public moreStatus:boolean = true;
	created(){
		 this.showAddContentChange(this.showContentDetail)
	}
	@Watch('showContentDetail',{deep:true})
	public showAddContentChange(newVal:any){
		console.log(this.showContentDetail)
		if(newVal){
			this.getData();
		}
	}
	public abc=1
	// public replyPage = 2
	public getData(){
		let a = {
			nowPage:this.abc,
			row4Page:'10',
			// contentId:'20230301014',
			// contentId:'20230301003',
			contentId:this.detailContentId,

		};
		contentApi.findDiscussInfoByContentId(a,{}).then((res) =>{
			 
			this.res = res;
      		this.data = res.data;
			this.data.forEach((item:any) => {
				if (item.replyTotal > 10) {
					item.showMore = true;
				}
			})
		 });
		//  let b = {
		// 	nowPage:'1',
		// 	row4Page:'50',
		// 	contentId:'20230301014',
		// 	discussId:''
		//  }
		//  contentApi.findReplyListByDiscussId(b).then((r)=>{
		// 	 
		// 	this.replyList = r.data;
			 
		//  });
	}
	public nowPage = 1
	public moreReply(data:any){
		this.data.forEach((item:any) => {
			if (item.discussId === data.discussId) {
				//拿到这条评论的children（已加载的回复）的length，比如页面已经加载了三页回复，21<=length<=30
				//length除以10取余数，如果余数=0，当前页等于length除以10，当前页等于length除以10的整数结果+1
				if (item.children.length%10 === 0) {
					this.nowPage = item.children.length/10 + 1;
				}
			}
		});
	
		
		const header: any = {
			request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.nowPage;
        header.row4Page = '10';
      }
    }
	 
		let a = {
			contentId:data.contentId,
			discussId:data.discussId,
		}
		// this.data.forEach((item:any) => {
		// 	if (item.serno === data.serno) {
		// 		//拿到这条评论的children（已加载的回复）的length，比如页面已经加载了三页回复，21<=length<=30
		// 		//length除以10取余数，如果余数=0，当前页等于length除以10，当前页等于length除以10的整数结果+1
		// 		if (item.children.length%10 === 0) {
		// 			this.nowPage = item.children.length/10 + 1;
		// 		}
		// 	}
		// });
		//1.发送ajax请求，获取该评论的下一页回复
		contentApi.findReplyListByDiscussId(a,header).then((res) =>{
			this.children = res.data;
			 
			
			//2.遍历第一个接口返回的list
			this.data.forEach((item:any) => {
				//3.在this.data里找到回复所属的评论
				//  
				
				if (item.discussId === data.discussId) {
					//把查询到的该评论的第n页数据拼接到item.children里
					 
					item.children.push(...this.children);
					
					
					if (res.data.length%10 > 0) {
						//说明查到的就是最后一页了，不需要加载更多按钮了
						item.showMore = false;
					}
				}
			});
		 });
	}
	public moreDiscuss(){
		this.abc++;
		const header: any = {request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.abc;
        header.row4Page = '10';
      		}
    	}
		//  
		
		let a = {
			contentId:this.detailContentId,
		};
		contentApi.findDiscussInfoByContentId(a,header).then((res) =>{
			this.data.push(...res.data)
			 
			if(this.data.length %10 > 0){
				this.moreStatus=false;
			}
		 });
		
	}
	public back(){
		this.$emit('cancleComment',false)
	}
}

// const data = reactive({
// 	total: 18,
// 	tableList: [{
// 		userName: '二毛',
// 		userImage: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
// 		content: "虽然内容很不错，但是还是广告太多了，广告减少一点肯定还有很多人会给高分的。",
// 		fanhui: {
// 			conTentUser: "中国人保",
// 			userImage: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
// 			cotent: "尊敬的用户，感谢您对中国人保的关注及反馈，我们非常重视您的意见，目前已经在减少文中广告出现的概率，也将根据用户的使用情况进一步调整后续广告策略，再次感谢您对中国人保的使用和反馈。",
// 			fanhuiTime: '昨天',
// 			author: '开发者',
// 			ip: '北京',
// 		},
// 		type: 1,
// 		userSendTime: "02-22 18:24",
// 		ip: "四川",
// 		selectName: "刘宇",
// 		time: "2023-01-01 12:03:12",
	
// 	}, {
// 		userName: '二毛',
// 		userImage: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
// 		content: "虽然内容很不错，但是还是广告太多了，广告减少一点肯定还有很多人会给高分的。",
// 		type: 2,
// 		errorTips: "内容包含敏感词",
// 		selectName: "系统",
// 		time: "2023-01-01 12:03:12",
// 		userSendTime: "2小时前",
// 		ip: '江苏',
// 	}, {
// 		userName: '二毛',
// 		userImage: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
// 		content: "虽然内容很不错，但是还是广告太多了，广告减少一点肯定还有很多人会给高分的。",
// 		fanhui: null,
// 		type: 3,
// 		selectName: "",
// 		time: "2023-01-01 12:03:12",
// 		userSendTime: "2小时前",
// 		ip: '江苏',
// 	}]
// })
</script>
<style lang="less" scoped>
// .ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap,.ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-wrap{
// 	margin-left: 27px;
//     margin-top: 10px;
// }
.head-box {
	font-size: 16px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
	line-height: 22px;
	margin-left: 28px;
	margin-top: 10px;
}

.content-box {
	display: flex;
	flex-direction: column;
	margin-left: 28px;

	.comment-on-item {
		display: flex;
		min-height: 100px;
		justify-content: space-between;
		margin-top: 20px;

		&-username {
			font-size: 14px;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #555555;
			line-height: 20px;
		}

		&-userImage {
			width: 37px;
			height: 37px;

			img {
				max-width: 100%;
				max-height: 100%;
				border-radius: 50%;
			}
		}

		&-content {
			max-width: 560px;
			// width: 684px;
			font-size: 14px;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #333333;
			line-height: 20px;
		}

		&-right {
			flex: 1;
			min-width: 500px;
			font-size: 14px;
			font-weight: 500;
			color: #333333;
			margin-left: 12px;
		}

		&-sendtime {
			font-size: 12px;
			font-weight: 400;
			color: #999999;

			.replay {
				// cursor:pointer;//鼠标移上去会变小手
				font-size: 14px;
				font-weight: 400;
				color: #333333;
				margin-left: 10px;
			}
		}

		.success-box {
			// margin-top: 15px;
			color: #24BCB6;
			background-color: #EDF9F9;
		}

		.error-box {
			display: flex;
			align-items: center;
			// padding-bottom: 35px;
		}

		.error-button {
			color: #E8380D;
			background: #FDEFEB;
			position: relative;
		}

		.tips {
			position: absolute;
			right: -30px;
			cursor: pointer;
			color:  #E8380D;;
		}

		.wait-box {
			// margin-top: 15px;
			color: #2443BC;
			background-color: #EDEFF9;
		}

		.status-box {
			text-align: center;
			margin-left: 15px;
			font-weight: 500;
			font-size: 14px;
			line-height: 32px;
			height: 32px;
			width: 94px;
			border-radius: 16px;
		}

		.processor {
			width: 120px;
			height: 60px;
			font-size: 14px;
			font-weight: 500;
			color: #333333;
			line-height: 61px;
			padding-left: 40px;
			margin-right: -20px;
		}

		.type-box {
			display: flex;
			justify-content: flex-start;
			min-width: 130px;
			align-items: center;
		}

		.time-box {
			// margin-top: 15px;
			font-size: 12px;
			font-weight: 400;
			color: #999999;
			line-height: 32px;
			min-width: 110px;
		}

		.fanhui-time {
			margin-left: 10px;
			font-size: 12px;
			font-weight: 400;
			color: #999999;
		}
	}
	.replay-on-item {
		display: flex;
		justify-content: space-between;

		&-username {
			font-size: 14px;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #555555;
			line-height: 20px;
		}

		&-userImage {
			width: 37px;
			height: 37px;

			img {
				max-width: 100%;
				max-height: 100%;
				border-radius: 50%;
			}
		}

		&-content {
			max-width: 580px;
			font-size: 14px;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: #333333;
			line-height: 20px;
		}

		&-right {
			flex: 1;
			min-width: 620px;
			font-size: 14px;
			font-weight: 500;
			color: #333333;
			margin-left: 12px;
		}

		&-sendtime {
			font-size: 12px;
			font-weight: 400;
			color: #999999;

			.replay {
				font-size: 14px;
				font-weight: 400;
				color: #333333;
				margin-left: 10px;
			}
		}

		.success-box {
			// margin-top: 15px;
			color: #24BCB6;
			background-color: #EDF9F9;
		}

		.error-box {
			display: flex;
			align-items: center;
			// padding-bottom: 10px;
		}

		.error-button {
			color: #E8380D;
			background: #FDEFEB;
			position: relative;
		}

		.tips {
			position: absolute;
			right: -30px;
			cursor: pointer;
			color:  #E8380D;;
		}

		.wait-box {
			// margin-top: 15px;
			color: #2443BC;
			background-color: #EDEFF9;
		}

		.status-box {
			text-align: center;
			margin-left: 15px;
			font-weight: 500;
			font-size: 14px;
			line-height: 32px;
			height: 32px;
			width: 94px;
			border-radius: 16px;
		}

		.processor {
			width: 50px;
			height: 60px;
			font-size: 14px;
			font-weight: 500;
			color: #333333;
			/* line-height: 61px;*/
		}

		.type-box {
			display: flex;
			justify-content: flex-start;
			min-width: 130px;
			align-items: center;
		}

		.time-box {
			// margin-top: 15px;
			font-size: 12px;
			font-weight: 400;
			color: #999999;
			line-height: 32px;
			min-width: 110px;
		}

		.replay-box {
			width: 560px;
			background: #F3F5F7;
			border-radius: 8px;
			display: flex;
			padding: 12px;
			margin: 3px 0 3px 48px;
		}

		.fanhui-time {
			margin-left: 10px;
			font-size: 12px;
			font-weight: 400;
			color: #999999;
		}
	}
}

.comment-left {
	display: flex;
	align-items: center;
}

.more-box {
	cursor:pointer;//鼠标移上去变小手
	width: 100%;
	text-align: center;
	height: 34px;
	line-height: 34px;
	background: #EFEFEF;
	border-radius: 4px;
}
.moreReplay-box{
	cursor:pointer;//鼠标移上去变小手
	text-align: center;
	font-size: small;
	color:rgb(127,126,134);
	height: 34px;
	line-height: 34px;
}


.comment-on-item-content {
	max-width: 400px;
}
.error-processor{
	height: 60px;
	font-size: 14px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #2443BC;
	// line-height: 61px;
}
.error-content{

height: 20px;
font-size: 14px;
font-family: PingFang-SC-Medium, PingFang-SC;
font-weight: 500;
color: #999999;
line-height: 20px;
}
.userSendTime{
	margin-right: 10px;
}
.author{
	margin-left: 5px;
	width: 44px;
	height: 20px;
	background: #E8380D;
	border-radius: 4px;
	font-size: 12px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #FFFFFF;
	line-height: 18px;
}
.comment-on-item-userImage{
	width: 15px;
	height: 15px;
}
.fanhui-ip{
			margin-left: 10px;
			font-size: 12px;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #999999;
			line-height: 17px;
}
.fanhui-btn{
	margin-top: 10px;
	width: 84px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #BFBFBF;
}
.content-margin{
	margin-top: 10px;
	margin-bottom: 10px;
}
.warn-tip {
    width: 16px;
    height: 16px;
    color: red;
    border: 1px solid red;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
	margin: 0 3px;
}
.replay-right {
	display: flex;
    min-width: 150px;
    align-items: center;
}

</style>
  
  
  