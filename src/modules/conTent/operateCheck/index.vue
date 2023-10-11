<template>
	<div>
		<a-tabs v-model:activeKey="activeKey">
		<a-tab-pane key="1" tab="基础信息">
			<contDetail :showoperateCheck="showoperateCheck" :operateCheckContentStatus="operateCheckContentStatus" :operateCheckContentId="operateCheckContentId"></contDetail>
			<div class="check" v-if="operateCheckContentStatus === '1'">
				<a-form :model="formState" ref="formRef">
					<a-row>
						<a-col class="checkTitle">内容审核</a-col>
					</a-row>
					<a-row class="jielun">
						<a-form-item label="审核结论：" name="operateType" :rules="[{ required: true, message: '请选择同意或不同意' }]">
							<a-col class="yn">
								<a-radio-group v-model:value="formState.operateType">
									<a-radio value="2">同意</a-radio>
									<a-radio value="3">不同意</a-radio>
								</a-radio-group>
							</a-col>

						</a-form-item>
					</a-row>

					<a-row class="yijian">
						<a-form-item label="审核意见：" name="note"
							:rules="[{ required: formState['operateType'] == '3', trigger: true, blur: true, message: '请录入审核意见' }]">
							<a-col>
								<a-textarea
								class="wenben" 
								v-model:value="formState.note" 
								showCount
								:maxlength="100"
								placeholder="请录入审核意见" 
								allowClear />
							</a-col>
							<a-row class="explanNote"><a-col>注：当[审核结论]选择“不同意”时，“审核意见”为必录项</a-col></a-row>
						</a-form-item>
					</a-row>
				</a-form>
			</div>
			<div class="addList_btn_content" v-if="operateCheckContentStatus === '1'">
				<a-button
					style="width: 76px;height: 40px;border-radius: 4px;margin-right: 10px;"
					@click="cancel">
					取消
				</a-button>
				<a-button
					danger
					type="primary"
					style="width: 76px;height: 40px;border-radius: 4px;margin-right: 10px;"
					@click="onCheck">
					提交
				</a-button>
			</div>
			
			<!-- operateCheckContentStatus  1表示待审核  2表示审核通过 3表示审核不通过 -->
			<!-- operateType  表示提交此条审核的提交人对应的状态 1表申请提交，2表审核通过，3表审核不通过 -->
			<div class="agree" v-if="operateCheckContentStatus === '2'||operateCheckContentStatus ==='3'">
				<div class="agr" v-for="item in checkData">
					<a-form>
						<a-row>
							<div v-if="item.operateType ===  '1'||item.operateType ===  '2' || item.operateType ==='3'" class="noteTitle">内容审核处理记录</div>
						</a-row>
						<div class="steps">
							<a-steps  progress-dot :current="-1" direction="vertical" size="small">
								<a-step disabled="true" >
									<template #title>
										<span v-if="item.operateType === '1'" class="nam">{{ item.operatorName }}</span>
									</template>
									<template #subTitle>
										<span 
											v-if="item.operateType === '1'"
											class="xiangqing"
											>
											提交内容审核详情
										</span>
										<span v-if="item.operateType === '1'" class="time">{{ item.crt_date }} </span>
									</template>
								</a-step>
								<a-step disabled="true" >
									<template #title>
										<span v-if="item.operateType === '2'|| item.operateType ==='3'" class="nam">{{ item.operatorName }}</span>
									</template>
									<template #subTitle>
										<span v-if="item.operateType ===  '2'|| item.operateType ==='3' " class="xiangqing">审核结论:</span>
										<span v-if="item.operateType === '2'" class="tongyi">同意</span>
										<span v-if="item.operateType === '3'" class="tongyi">不同意</span>
										<span v-if="item.operateType === '2'|| item.operateType === '3'" class="time">{{ item.crt_date }}</span>
										<div v-if="item.operateType === '2'|| item.operateType === '3'" class="check-note">
											不同意原因:{{ item.note }}
										</div>
									</template>
								</a-step>
							</a-steps>
						</div>
					</a-form>
				</div>
				<div>
					<a-button class="back" :ghost="false" @click="back">返回</a-button>
				</div>
			</div>

		</a-tab-pane>
		<a-tab-pane key="2" tab="评论详情" force-render>
			<commentDetail :commentId = 'operateCheckContentId'></commentDetail>
			{{  }}
		</a-tab-pane>
	</a-tabs>
	</div>
</template>
<script lang="ts">
import { contentApi } from '@/libs/api'
import { Options, Vue } from 'vue-class-component';
import commentDetail from '../commentDetail/index.vue'
import contDetail from './contDetail.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { Prop, Watch } from 'vue-property-decorator';
import { message } from 'ant-design-vue';

interface stateType {
	'radioState': string,
	checkSuggestion: string,
};
@Options({
	components: {
		commentDetail,
		contDetail,
	}
})
export default class operateCheck extends Vue {
	@Prop() public showoperateCheck:any
	@Prop() public operateCheckContentStatus:any
	@Prop() public operateCheckContentId:any
	public router = useRouter()
	public id: string = '';
	// public activeKey: string = '1';
	public activeKey = ref('1');
	public btnArray: any[] = [];
	public detail: any = {};
	// public contentCheck: number = 1;
	public checkText: string = '';
	public value: number = 1;
	public formRef: any = '';
	public formState: any = {
		operateType: '',
		note: '',
		id:'',
	};
	public checkData: any = {};
	public sourceLinks: any = ""
	public route = useRoute()
	public agree:any = ''
	public disagree:any = ''

	created(){
		 this.showAddContentChange(this.showoperateCheck)
	}
	@Watch('showContentDetail',{deep:true})
	public showAddContentChange(newVal:any){
		if(newVal){
			this.getDetail();
		}
	}
	// public contentCheck: any = this.route.query.contentStatus
	// public commentId = this.route.query.contentId//传给评论详情子组件的ID
	//接口调用
	public getDetail() {
		//内容详情接口
		let a = {
			// id: this.id,
			id: this.operateCheckContentId
		};
		console.log(a,'a')
		contentApi.getCententItem(a, {}).then((res) => {
			 
			this.detail = res.defmap;
			this.sourceLinks = this.detail.sourceLinks
			// this.sourceLinks = '123345'

			 

			if (this.detail.labelNames) {
				this.btnArray = this.detail.labelNames.split(',')//以逗号为分割数组
			}
			if (this.detail.contentType) {
				 
				this.detail.contentType = this.exchangeConentType(this.detail.contentType)
			}
			if (this.detail.canDiscuss) {
				 
				this.detail.canDiscuss = this.exchangeCanDiscuss(this.detail.canDiscuss)
			}
			if (this.detail.canPraise) {
				 
				this.detail.canPraise = this.exchangeCanPraise(this.detail.canPraise)
			}
			if (this.detail.canShare) {
				 
				this.detail.canShare = this.exchangeCanShare(this.detail.canShare)
			}
			if (this.detail.isRelateAdvertSpace) {
				 
				this.detail.isRelateAdvertSpace = this.exchangeisRelateAdvertSpace(this.detail.isRelateAdvertSpace)
			}
		});

		//内容审核详情包含同意或不同意两种情况的接口    即cotentCheck（contentStatus）是2/3的时候
		let d = {
			contentId: this.operateCheckContentId,
		}
		console.log(d,'d')
		contentApi.findReqAuditRecordsByContentId(d, {}).then((res) => {
			 
			this.checkData = res.data;
			// this.checkData.forEach((i:any) => {
			// 	if(i.operateType === '2'){
			// 		this.agree = '同意'
			// 	}else if(i.operateType === '3'){
			// 		this.disagree = '不同意'
			// 	}
			// });
			 

		})

	};//getDetail结束

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
		} else {
			return contentType
		}
	}

	exchangeCanDiscuss(canDiscuss: any) {
		if (canDiscuss === '1') {
			return "是"
		} else {
			return canDiscuss
		}
	}
	exchangeCanPraise(canPraise: any) {
		if (canPraise === '1') {
			return "是"
		} else {
			return canPraise
		}
	}
	exchangeCanShare(canShare: any) {
		if (canShare === '1') {
			return "是"
		} else {
			return canShare
		}
	}
	exchangeisRelateAdvertSpace(isRelateAdvertSpace: any) {
		if (isRelateAdvertSpace === '1') {
			return "是"
		} else if (isRelateAdvertSpace === '0') {
			return "否"
		} else {
			return isRelateAdvertSpace
		}
	}
	public back() {
		this.$emit('cancleOperateCheck',false)
	}
	public copy() {
		const input = document.createElement('input')
		input.value = this.sourceLinks
		if (input.value) {
			 
			document.body.appendChild(input)
			input.select()
			document.execCommand('copy')
			document.body.removeChild(input)
			alert("复制成功");
		} else {
			alert("素材链接地址为空！")
		}
	}
	//提交按钮事件：onCheck
	public onCheck(){
		this.formState.id = this.operateCheckContentId;
		contentApi.operateContent(this.formState,{}).then((res)=>{
			if(res.flag === 'success'){
				message.info('提交成功')
				this.formState = {
					operateType: '',
					note: '',
					id:'',
				}
				// this.$router.push('/content/contentManage')
				this.$emit('cancleOperateCheck',false,'0')		
			}else if(res.flag === 'fail'){
				message.info('提交失败')
			}
		})
	};
	public cancel() {
    this.formState = {
      operateType: '',
      note: '',
      id:'',
    }
		this.$emit('cancleOperateCheck',false)
	}
}
</script> 

<style lang="less" scoped>
//.ant-tabs>.ant-tabs-nav .ant-tabs-nav-wrap,
.ant-tabs>div>.ant-tabs-nav .ant-tabs-nav-wrap {
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

// 内容审核的样式
// 内容审核整块div
.check {
	margin-left: 34px;
	margin-top: 21px;
	width: 1116px;
	height: 260px;
	background: #F6F6F6;
	border-radius: 8px;
}

// 内容审核标题样式
.checkTitle {
	margin-left: 30px;
	margin-top: 26px;
	width: 64px;
	height: 22px;
	font-size: 16px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
	line-height: 22px;
}

// 审核结论和意见公共部分样式
.colIdea {
	width: 70px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
	line-height: 20px;
}

//审核结论位置
.col {
	margin-left: 30px;
	margin-top: 26px;
}

//审核意见位置
.Idea {
	margin-left: 30px;
	margin-top: 42px;
}

//审核意见文本框
.ideText {
	margin-left: 29px;
	width: 836px;
	height: 79px;
	border-radius: 4px;
	border: 1px solid #ABABAB;
}

//注释
.explanNote {
	margin-left: 34px;
	margin-top: 10px;
	height: 17px;
	font-size: 12px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
	line-height: 17px;
}

//复制按钮
.copy {
	margin-left: 12px;
	// width: 50px;
	// height:26px;
	line-height: 26px;
	background: #EBEBEB;
	border-radius: 4px;
	color: #333333;
	text-align: center;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-size: 12px;
}

//操作审核中取消和提交按钮的整体位置
.addList_btn_content{
	margin-top: 24px;
	display: flex;
	align-items: center;
	justify-content: end;
	width:100%;
}

//取消按钮
.cancel {
	margin-left: 817px !important;
	width: 84px !important;
	height: 32px !important;
	background: white !important;
	color: black !important;
	border: 1px solid #BFBFBF !important;
}

//提交按钮
.submit {
	margin-left: 16px !important;
	border-radius: 4px !important;
	width: 84px !important;
	height: 32px !important;
	background: #E8380D !important;
	color: white !important;
	border: 1px solid #E8380D !important;
}

// 内容审核样式
//审核区整块div
.agr {
	margin-left: 34px;
	margin-top: 21px;
	width: 1116px;
	height: 195px;
	background: #f9f9f9;
	border-radius: 8px;
}

//内容审核记录标题
.noteTitle {
	margin-left: 30px;
	margin-top: 26px;
	height: 22px;
	font-size: 16px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
	line-height: 22px;
}

//步骤条区域位置
.steps {
	margin-left: 30px;
	margin-top: 25px;
}

//返回按钮
.back {
	margin-top: 24px;
	margin-left: 920px !important;
	width: 84px !important;
	height: 32px !important;
	background: white !important;
	color: black !important;
	border: 1px solid #BFBFBF !important;
}

//同意框颜色
.ant-steps-item-finish .ant-steps-item-icon {
	background-color: rgba(36, 188, 182, 1);
	border: rgba(36, 188, 182, 1)
}

//对勾颜色
.anticon {
	color: white;
}

//同意页面第一个原点
// .ant-steps-item-wait .ant-steps-item-icon .ant-steps-icon{
// 	rgba(210, 210, 210, 0.5000)
// }
.nam {
	font-size: 14px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
	line-height: 20px;
}

.xiangqing {
	font-size: 14px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
	line-height: 20px;
}

.time {
	margin-left: 20px;
	font-size: 12px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #999999;
	line-height: 18px;
}

// .tongyiTime{
// 	margin-left: 20px;
// }

.tongyi {
	margin-left: 10px;
	color: rgba(36, 188, 182, 1);
	font-size: 14px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	line-height: 20px;
}

.butongyi {
	margin-left: 10px;
	color: rgba(232, 56, 13, 1);
}

.ant-steps-item-error .ant-steps-item-icon {
	background-color: rgba(232, 56, 13, 1);
	border-color: rgba(232, 56, 13, 1);
}

.jielun {
	margin-left: 30px;
	margin-top: 26px;
}

.yn {
	margin-left: 29px;
}

.yijian {
	margin-left: 39px;
}

.wenben {
	margin-left: 14px;
	width: 736px;
	height: 79px;
}

//复制按钮样式
.ant-btn {
	padding: 0;
}

//提示审核意见必录提示信息位置
.ant-form-item-explain-error {
	margin-left: 28px;
}

//提示是否同意按钮必录提示信息位置
// .ant-form-item-explain-error {
// 	margin-left: 3px;
// }

.check-note {

	width: 890px;
	height: 18px;
	font-size: 12px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #999999;
	line-height: 18px;
}
</style>
  
  