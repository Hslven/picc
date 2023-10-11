<!-- <template>
	<div>
		<div class="head-box">评论列表({{ res.recordsTotal }}条)</div>
		<div class="content-box">
			<div v-for="(item, index) in data" :key="index">
				<div class="comment-on-item">
					<div class="comment-on-item-userImage">
						<img :src="item.userImage" alt="">
					</div>
					<div class="comment-on-item-right">
						<div v-if="item.status==='2'" class="comment-on-item-username">{{ item.discusser }}</div>
						<div v-if="item.status==='3'" class="error-content">{{ item.discusser }}</div>
						<div v-if="item.status==='1'" class="comment-on-item-username">{{ item.discusser }}</div>

						<div  v-if="item.status==='2'" class="comment-on-item-content content-margin">{{ item.discussWord }}</div>
						<div  v-if="item.status==='3'" class="error-content content-margin">{{ item.discussWord }}</div>
						<div  v-if="item.status==='1'" class="comment-on-item-content content-margin">{{ item.discussWord }}</div>
						<div class="comment-on-item-sendtime">
							<span class="userSendTime"> {{ item.crt_date }}</span>
							<span>{{ item.area }}</span>
							<a-buttom class="replay" @click="reply(item.serno,item.contentId)"> 回复</a-buttom>
						</div>
						<div>
							<div v-for="i in item.replyList">
								<div class="replay-box">
									<div class="comment-on-item-userImage">
										<img :src="i.userImage" alt="">
									</div>
									<div class="comment-on-item-right">
										<div class="comment-on-item-username">{{ i.discusser }} 
											<span class="author">{{ i.author }}</span> 
											<span class="fanhui-tips">{{ i.crt_date }}</span>
											<span class="fanhui-ip">{{ i.area }}</span>
										</div>
										<div class="comment-on-item-content">{{ i.discussWord }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-if="item.status ==='2'"  class="processor">{{ item.checkerName }}</div>
					<div v-if="item.status ==='3'"  class="error-processor">{{ item.checkerName }}</div>
					<div class="type-box">
						<div v-if="item.status === '2'" class="success-box status-box">审核通过</div>
						<div v-if="item.status === '3'" class="error-box status-box">
							审核不通过
							<a-tooltip placement="top">
								<template #title>
									<span> {{ item.checkComments }}</span>
								</template>
								<span class="tips">
									<InfoCircleOutlined />
								</span>
							</a-tooltip>
						</div>
						<div class="wait-box status-box" v-if="item.status === '1'">待审核</div>
					</div>
					<div class="time-box"> {{ item.checkTime }}</div>
				</div>
			</div>
		</div>
		<div class="more-box" @click="moreDiscuss">
			查看更多评论
		</div>
		<div>
			<a-button class="fanhui-btn" @click="back">返回</a-button>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { contentApi } from '@/libs/api'
import {ref} from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { object } from 'vue-types';
@Options({
    components: {

    }
})
export default class commentDetail extends Vue{
	public res: any = {};
	public data: any = [];
	public replyList: any = [];
	public fanhuiList: any = [];
	created(){
		this.getData();
	}
	public getData(){
		let a = {
			nowPage:'1',
			row4Page:'50',
			// contentId:'20230301014',
			contentId:'20230301003',
		};
		contentApi.findDiscussInfoByContentId(a).then((res) =>{
			 
			this.res = res;
      		this.data = res.data;
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
	public moreDiscuss(){
		
	}
	public back(){
		this.$router.push('/operationManage');
	}
	public reply(serno,contentId){
	 
	let b = {
			nowPage:'1',
			row4Page:'50',
			contentId:contentId,
			discussId:serno,
		 }
		 contentApi.findReplyListByDiscussId(b).then((r)=>{
			 
			this.fanhuiList = r.data;
			if (r.data && r.data.length > 0) {
				let c = false;
				for(let key in this.data){
					for(let k in this.fanhuiList){
						if (this.data[key].serno === this.fanhuiList[k].serno) {
							this.data[key].replyList =this.fanhuiList;
							c = true;
						}
						break;
					}
					if (c) {
						break;
					}
				}
			}
		 });
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
			max-width: 580px;
			// width: 684px;
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
				cursor:pointer;
				font-size: 14px;
				font-weight: 400;
				color: #333333;
				margin-left: 20px;
			}
		}

		.success-box {
			color: #24BCB6;
			background-color: #EDF9F9;
		}

		.error-box {
			max-width: 580px;
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
			color: #2443BC;
			background-color: #EDEFF9;
		}

		.status-box {
			margin-top: 15px;
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
			margin-left: 20px;
			width: 38px;
			height: 20px;
			font-size: 14px;
			font-weight: 500;
			color: #333333;
			line-height: 61px;
		}

		.type-box {
			width: 160px;
		}

		.time-box {
			margin-top: 15px;
			width: 128px;
			font-size: 12px;
			font-weight: 400;
			color: #999999;
			line-height: 32px;
		}

		.replay-box {
			margin-top: 10px;
			width: 620px;
			background: #F3F5F7;
			border-radius: 8px;
			display: flex;
			padding: 12px;
		}

		.fanhui-tips {
			margin-left: 25px;
			font-size: 12px;
			font-weight: 400;
			color: #999999;
		}
	}
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


.comment-on-item-content {
	max-width: 400px;
}
.error-processor{
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #2443BC;
	line-height: 61px;
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
	margin-left: 1180px;
	width: 84px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #BFBFBF;
}
.content-margin{
	margin-top: 10px;
	margin-bottom: 10px;
}

</style>
  
  
   -->