<template>
	<div class="addContent">
		<div class="basic">
			<p class="basic-information">基础信息</p>
			<hr class="basic-information-hr" />
		</div>
		<div class="addList">
			<a-form
				:model="formState"
				style="padding-top:20px"
				autocomplete="off"
				:label-col="{ span: 2 }"
				:wrapper-col="{ span: 24 }" 
				@finish="onFinish" 
				@finishFailed="onFinishFailed">
				<!-- 所属栏目： -->
				<a-row :gutter="24">
					<a-col
						:push="1"
						:xs="8"
						:sm="6"
						:xl="3"
						:xxl="6">
						所属栏目：
					</a-col>
					<a-col
						:xs="2"
						:sm="2"
						:xl="1"
						:xxl="1">
						<span
							style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
							*</span>
					</a-col>
					<a-col
						:xs="12"
						:sm="12"
						:xl="8"
						:xxl="6">
						<a-input
							disabled
							style="border-radius: 4px;"
							v-model:value="formState.affiliatedColumn"
							placeholder='人保头条'
							>
						</a-input>
					</a-col>
				</a-row>
				<!-- 标题名称： -->
				<a-row
					:gutter="24"
					style="margin-top:30px">
					<a-col
						:push="1"
						:xs="8"
						:sm="6"
						:xl="3"
						:xxl="6">
						标题名称：
					</a-col>
					<a-col
						:xs="2"
						:sm="2"
						:xl="1"
						:xxl="1">
						<span
							style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
					</a-col>
					<a-col
						:xs="12"
						:sm="12"
						:xl="8"
						:xxl="6">
						<a-input
							maxlength="100"
							:showCount="true"
							style="border-radius: 4px;"
							v-model:value="formState.titleName"
							placeholder='请输入标题名称'>
						</a-input>
					</a-col>
				</a-row>
				<!-- 所属标签： -->
				<a-row
					:gutter="24"
					style="margin-top:30px">
					<a-col
						:push="1"
						:xs="8"
						:sm="6"
						:xl="3"
						:xxl="6">
						所属标签：
					</a-col>
					<a-col
						:xs="2"
						:sm="2"
						:xl="1"
						:xxl="1">
						<span
							style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
							*</span>
					</a-col>
					<a-col
						:xs="12" 
						:sm="12" 
						:xl="8" 
						:xxl="6">
						<div
							style="display: flex;justify-content: left;align-items: start;">
							<a-tree-select
								v-model:value="labeTreeValue"
								style="width: 100%"
								:tree-data="labeTreeList"
								tree-checkable
								allow-clear
								@change="previewFormLink()"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								:treeCheckStrictly="true"
								:show-checked-strategy="SHOW_PARENT"
								placeholder="请选择内容标签"
								tree-node-filter-prop="label"
								>	
								</a-tree-select>
							<!-- <a-button
								@click="previewFormLink()"
								type="primary"
								shape="round"
								:ghost="true"
								style="color:#2443BC;border-color: #2443BC;padding: 0px 20px;">
								选择标签
							</a-button> -->
						</div>
					</a-col>
				</a-row>
				<!-- 内容分类组件 -->
				<content-type @contentClassification="contentClassification" :getEditDataList="editDataList"/>
				<!-- 摘要： -->
				<a-row
          v-if="contentClassificationList.contentType  !== 's'"
					:gutter="24"
					style="margin-top:30px">
					<a-col
						:push="1"
						:xs="8"
						:sm="6"
						:xl="3"
						:xxl="6">
						摘要：
					</a-col>
					<a-col
						:xs="2"
						:sm="2"
						:xl="1"
						:xxl="1">
					</a-col>
					<a-col
						:xs="12"
						:sm="12"
						:xl="11"
						:xxl="6">
						<a-input
							maxlength="100"
							:showCount="true"
							v-model:value="formState.abstractContent"
							size="large" 
							placeholder='请输入摘要内容'
							style="border-radius: 6px;height: 52px;">
						</a-input>
					</a-col>
				</a-row>
				<!-- 封面视频组件 -->
				<cover-type
          v-if="contentClassificationList.contentType  !== 's'"
          @coverPicture="coverPicture"
        />
				<!-- 查看初始值、可评论，点赞，分享组件 -->
				<initial-discuss v-if="contentClassificationList.contentType  !== 'pr'" @initialDiscussObject="initialDiscussObject" :getEditDataList="editDataList"/>
			</a-form>
			<div style="padding:0 20px">
				<a-divider />
			</div>
			<!-- 底部按钮 -->
			<a-row
				style="padding-bottom:20px">
				<a-col
					:span="16"
					:push="1">
					<a-button
						danger
						@click="preBrowse"
						style="width:84px;border-radius: 4px;">
						预览
					</a-button>
				</a-col>
				<a-col
					:span="8">
					<a-button
						style="width:84px;border-radius: 4px;margin-right: 10px;"
						@click="cancleAddContent">
						取消
					</a-button>
					<a-button
						type="primary"
						danger
						style="width:84px;border-radius: 4px;margin-right: 10px;"
						@click="saveAddContent">
						保存
					</a-button>
					<a-button
						danger
						style="width:84px;border-radius: 4px;margin-right: 10px;background-color: rgba(232,56,13,0.1);"
						@click="submitAddContent">
						提交
					</a-button>
				</a-col>
			</a-row>
		</div>

		<!-- 预览弹窗 -->
		<a-modal
			style="width: 610px;height: 200px;background: #FFFFFF;border-radius: 6px;"
			v-model:visible="preBrowseVisible">
				<template #footer>
					<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;color: #FFFFFF;" @click="colsePreBrowse">知道了</a-button>
				</template>
				<div style="padding:30px 0px 30px 30px">
					<p style="width: 176px;height: 22px;font-size: 16px;font-weight: 500;color: #333333;line-height: 22px;"
						>可通过链接预览内容效果</p>
					<div style="display: flex;justify-content: space-between;align-items: center;margin:10px 0px;height:32px;padding:10px 0px">
						<p>内容链接地址</p>
						<div
							style="width: 76px;height: 32px;background-color: rgba(232,56,13,0.14) ;border-radius: 4px;"
							v-if="copySuccess === true"
							>
							<p class="copy-success">复制成功</p>
						</div>
					</div>
					<div style="display: flex;justify-content: space-between;align-items: center;margin-top:10px">
						<a-input style="width: 456px;height: 32px;border-radius: 4px;border: 1px solid #979797;margin-right:8px" 
							:placeholder="PreBrowseLink"
							></a-input>
						<a-button
							style="width: 76px;height: 32px;background: #E8EDFF;border-radius: 4px;color: #2443BC;border:solid 0"
							@click="copyPreBrowseLink"
							>复制</a-button>
					</div>
				</div>
    </a-modal>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import contentType from './components/contentType/index.vue'
import coverType from './components/coverType.vue'
import initialDiscuss from './components/initialDiscuss.vue'
import { contentApi } from '@/libs/api'
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router'
import store from '@/modules/conTent/store';
import { TreeSelect } from 'ant-design-vue';
import { imgUrl } from '@/libs/getImgUrl'
//表单数据接口
interface formState {
	affiliatedColumn: string;//所属栏目
	topicId:string;
	titleName:string;//标题名称
	abstractContent:string;//摘要
}
interface initialDiscussData{
	viewInitialValue: number ,//阅读初始值
	discussValue:string,//是否可评论
	giveLike:string,//是否可点赞
	giveLikeValue:number,//点赞初始值
	canShare:string,//是否可分享
	canShareValue:number,//分享初始值
	canAdvertising:string,//是否关联广告位
	canAdvertisingValue:string
}
interface formCoverClassification {
	value: string;
	type: string;
	code: string;
	dimension: string
	pictureInformation: [];
	image:string
	horizontalCoverFile?:string
	verticalCoverFile?:string
}

@Options({
	components: {
		contentType,
		coverType,
		initialDiscuss
	}
})
export default class addContent extends Vue {
	public SHOW_PARENT = TreeSelect.SHOW_PARENT;
	public route = useRoute()
	public created(): void {
		let params = {
			id:''
		}
		 
		contentApi.getFolderLabel(params,{}).then(res => {
			store.commit('getLabeTreeList',res.data)
			this.labeTreeList = this.getNewTree(res.data)
			if(this.route.query.editType === '0'){
				this.getFolderTopic()
			} else {
				let editContent = this.state.editContent.editContentList
				let labelTreeList = this.state.addContent.labeTreeList
				let test:any = []
				this.editDataList = editContent
				this.formState.topicId = editContent.topicId
				this.formState.affiliatedColumn = editContent.topicName
				this.formState.titleName = editContent.titleName
				this.formState.abstractContent = editContent.summary
				this.editDataList.labelIds = editContent.labelIds
				this.PreBrowseLink = editContent.contentLink
				this.editDataList.labelIds = this.editDataList.labelIds.split(',')
				this.editDataList.labelIds.forEach((res:any) => {
					test.push(this.getTreeId(labelTreeList,res))
				})
				this.labeTreeValue = test.map((item:any) => {return {label:item.name,value:item.id,disabled:false,halfchecked:undefined}})
				store.commit('getLabeTreeList',labelTreeList)
			}
		})
	}
	public checkSureTallyEditListData:any = []
	public getTreeId(list:any,id:any){
    for (let i = 0; i < list.length; i++) {
      if(list[i].id===id){
        return list[i]
      }else if(list[i].children && list[i].children.length>0){
      let nameList:any = this.getTreeId(list[i].children,id)
        if(nameList){
          return nameList
        }  
      }
    }
  }
	public getNewTree(obj:any){
    obj.map((item:any)=>{
    	if(item.leafFlag === '0'){
				item.disabled = true
      } else {
				item.disabled = false
			}
      if(item.children&&item.children.length>0){
        this.getNewTree(item.children)
      }
    })
    return obj
  }
	public state: any = store.state
	//获取栏目接口
	public async getFolderTopic(){
		let params = {
			id:this.route.query.editType === '0' ? this.route.query.topicId : '' 
		}
		await contentApi.getFolderTopic(params,{}).then(res => {
			res.data.map((item:any) => {
				this.formState.affiliatedColumn = item.name
				this.formState.topicId = item.id
			})
		})
	}
	//获取标签列表
	public labeTreeList:any[] = []
	public async getLabelTree(){
		let params = {
			id:''
		}
		 
		await contentApi.getFolderLabel(params,{}).then(res => {
			store.commit('getLabeTreeList',res.data)
			this.labeTreeList = res.data
		})
	}
	public editDataList:any = ''
	//编辑-获取内容详情信息
	public async getContentEdit(){
		let params = {
			id:this.route.query.editType === '1' ? this.route.query.id : ''
		}
		await contentApi.getCententItem(params,{}).then((res:any) => {
			store.commit('getEditContentList',res.defmap)
			this.editDataList = res.defmap
			this.formState.topicId = res.defmap.topicId
			this.formState.affiliatedColumn = res.defmap.topicName
			this.formState.titleName = res.defmap.titleName
			this.formState.abstractContent = res.defmap.summary
			this.initialDiscussData = {
				viewInitialValue:res.defmap.viewInitialValue,
				discussValue:res.defmap.discussValue,
				giveLike:res.defmap.giveLike,
				giveLikeValue:res.defmap.giveLikeValue,
				canShare:res.defmap.canShare,
				canShareValue:res.defmap.canShareValue,
				canAdvertising:res.defmap.canAdvertising,
				canAdvertisingValue:res.defmap.canAdvertisingValue
			}
		})
	}
	//表单数据
	public formState: formState = {
		affiliatedColumn: '',
		topicId:'',
		titleName:'',
		abstractContent:''
	}
	//表单成功回调
	public onFinish = (values: any) => {
		 
	};
	//表单失败回调
	public onFinishFailed = (errorInfo: any) => {
		 
	};
	//标签v-model
	public labeTreeValue:any[] = []
	//打开标签抽屉
	public previewFormLink(){
		 
		// this.getLabelTree()
		// this.previewForm = true
	}
	public getTreeName(list:any,id:any){
    for (let i = 0; i < list.length; i++) {
      if(list[i].id===id){
				 
        return list[i]
      }else if(list[i].children && list[i].children.length>0){
      let nameList:any = this.getTreeName(list[i].children,id)
        if(nameList){
					 
					nameList.checkAll = false
          return nameList
        }  
      }
    }
  }
	//预览开关
	public preBrowseVisible:boolean = false
	//打开预览弹窗
	public preBrowse(){
		 
		if(this.route.query.id === undefined || this.PreBrowseLink === ''){
			message.info('请点击保存后再查看预览内容')
			return
		} else {
			this.preBrowseVisible = true;
			this.copySuccess = false
		}
	}
	//复制链接地址
	public PreBrowseLink:string = ''
	//复制成功提示
	public copySuccess:boolean = false
	//预览点击复制
	public copyPreBrowseLink(){
		let url = this.PreBrowseLink
		let oInput = document.createElement('input');
		oInput.value = url;
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象;
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.remove()
		this.copySuccess = true
		setTimeout(() => {
			this.copySuccess = false
		},2000)
	}
	//关闭预览弹窗
	public colsePreBrowse(){
		this.preBrowseVisible = false
	}
	//取消新增
	public cancleAddContent(){
		store.commit('getContentType','')
		this.$router.go(-1)
	}
	//接收封面图片
	public coverPicture(value:any){
		this.coverPictureData = value
	}
	public coverPictureData:any = [
		{
			value: '1',
			type: '横板封面',
			code: '1',
			dimension: '900*383px',
			pictureInformation: [],
			image:'',
			horizontalCoverFile:''
		},
		{
			value: '2',
			type: '竖版封面',
			code: '2',
			dimension: '200*200px',
			pictureInformation: [],
			image:'',
			verticalCoverFile:''
		},
	]
	//接收阅读-是否-广告
	public initialDiscussData:initialDiscussData = {
		viewInitialValue: 0 ,//阅读初始值
		discussValue:'',//是否可评论
		giveLike:'',//是否可点赞
		giveLikeValue:0,//点赞初始值
		canShare:'',//是否可分享
		canShareValue:0,//分享初始值
		canAdvertising:'',//是否关联广告位
		canAdvertisingValue:''
	}
	public initialDiscussObject(value:any){
		this.initialDiscussData = value
	}
  //接收内容分类的v-model
  public contentClassificationList:any = {
    contentType:'',
    productCodes:'',
		contentFile:'',
		subjectType:'',//话题类型
		bannerPictureFile:'',//banner图地址
		subjectStartTimeStr:'',//话题开始时间
		subjectEndTimeStr:'',//话题结束时间
		redOpinion:'',//红方观点
		blueOpinion:'',//蓝方观点
		optionType:'',//话题结果-单选多选
		resultList:[],//话题结果-列表
		isTipTruth:'',//是否提示真相
		truthTitle:'',//真相标题
		truthExplain:'',//真相说明
		pictureFile:'',//话题图片上传地址
  }
  //接收内容分类
  public contentClassification(value:any){
    this.contentClassificationList = value
  }
	//保存新增
	public saveAddContent(){
		let operateType = '0'
		this.saveAddRequest(operateType)
	}
	//提交新增
	public submitAddContent(){
		 
		let minPremiumNumber = this.contentClassificationList.minPremium
		if(this.formState.titleName === ''){
			message.info('请添加标题名称')
			return
		} else if(this.labeTreeValue.length === 0){
			message.info('请添加标签')
			return
		} else if(this.contentClassificationList.contentType === ''){
			message.info('请选择内容分类')
			return
		} else if(this.contentClassificationList.contentType === 'b' && this.contentClassificationList.contentFile === ''){
			message.info('请添加海报图片')
      return
		} else if(this.contentClassificationList.contentType === 'pr' && this.contentClassificationList.productCodes === ''){
      message.info('请添加产品编码')
      return
    } else if(this.contentClassificationList.contentType === 'pr' && this.contentClassificationList.contentText === ''){
      message.info('请添加产品详情')
      return
    } else if(this.contentClassificationList.contentType === 'pr' && this.contentClassificationList.minPremium === ''){
      message.info('请添加产品保费金额')
      return
    } else if(minPremiumNumber !== '' && this.contentClassificationList.contentType === 'pr'){
			if(minPremiumNumber.slice(minPremiumNumber.length - 4,minPremiumNumber.length) === '元/月起' || minPremiumNumber.slice(minPremiumNumber.length - 4,minPremiumNumber.length) === '元/年起' || minPremiumNumber.slice(minPremiumNumber.length - 2,minPremiumNumber.length) === '元起'){
				if(minPremiumNumber.slice(minPremiumNumber.length - 4,minPremiumNumber.length) === '元/月起' || minPremiumNumber.slice(minPremiumNumber.length - 4,minPremiumNumber.length) === '元/年起'){
					let premiumNumber = this.contentClassificationList.minPremium.slice(0,this.contentClassificationList.minPremium.length - 4)
					if(premiumNumber !== premiumNumber.replace(/[^0-9]/g, '')){
						message.warn('保费金额请输入正整数及交费方式')
						return
					}
				}
				if(minPremiumNumber.slice(minPremiumNumber.length - 2,minPremiumNumber.length) === '元起'){
					let premiumNumber = minPremiumNumber.slice(0,minPremiumNumber.length - 2)
					if(premiumNumber !== premiumNumber.replace(/[^0-9]/g, '')){
						message.warn('保费金额请输入正整数及交费方式')
						return
					}
				}
			} else {
				message.warn('保费金额请输入正整数及交费方式')
				return
			}
		} else if(this.contentClassificationList.contentType === 's' && this.contentClassificationList.subjectType === ''){
			message.info('请选择话题分类')
      return
		} else if(this.contentClassificationList.contentType === 's' && this.contentClassificationList.subjectDescription === ''){
			message.info('请添加话题描述')
      return
		} else if(this.contentClassificationList.contentType === 's' && this.contentClassificationList.subjectStartTimeStr === ''){
			message.info('请选择话题开始时间')
      return
		} else if(this.contentClassificationList.contentType === 's' && this.contentClassificationList.subjectEndTimeStr === ''){
			message.info('请选择话题结束时间')
      return
		} else if(this.contentClassificationList.contentType === 's' && this.contentClassificationList.isTipTruth === ''){
			message.info('请选择是否提示真相')
      return
		} else if((this.contentClassificationList.contentType === 's' && this.contentClassificationList.isTipTruth === '1') && this.contentClassificationList.truthTitle === ''){
			message.info('请添加话题真相标题')
      return
		} else if((this.contentClassificationList.contentType === 's' && this.contentClassificationList.isTipTruth === '1') && this.contentClassificationList.truthExplain === ''){
			message.info('请添加话题真相说明')
      return
		} else if((this.contentClassificationList.contentType === 's' && this.contentClassificationList.subjectType === 'p') && this.contentClassificationList.redOpinion === ''){
			message.info('请添加红方观点')
      return
		}	else if((this.contentClassificationList.contentType === 's' && this.contentClassificationList.subjectType === 'p') && this.contentClassificationList.blueOpinion === ''){
			message.info('请添加蓝方观点')
      return
		} else if(this.contentClassificationList.contentType === 'v' && this.contentClassificationList.contentFile === ''){
			message.info('请添加视频')
      return
		} else if(isNaN(this.initialDiscussData.viewInitialValue) === true && this.contentClassificationList.contentType !== 'pr'){
			message.info('请添加阅读初始值')
			return
		} else if(this.initialDiscussData.discussValue === '' && this.contentClassificationList.contentType !== 'pr'){
			message.info('请选择是否可评论')
			return
		} else if(this.initialDiscussData.giveLike === '' && this.contentClassificationList.contentType !== 'pr'){
			message.info('请选择是否可点赞')
			return
		} else if(this.initialDiscussData.canShare === '' && this.contentClassificationList.contentType !== 'pr'){
			message.info('请选择是否可分享')
			return
		} else if(this.initialDiscussData.canAdvertising === '' && this.contentClassificationList.contentType !== 'pr'){
			message.info('请选择是否关联广告位')
			return
		} else if((this.initialDiscussData.canAdvertising === '1' && this.initialDiscussData.canAdvertisingValue === '') && this.contentClassificationList.contentType !== 'pr'){
			message.info('请选择广告位')
			return
		} 
		let operateType = '1'
		this.saveAddRequest(operateType)
	}
	//保存提交接口
	public async saveAddRequest(value:string){
		 
		let horizontalCoverFile = ''
		let verticalCoverFile = ''
		this.coverPictureData.forEach((res:any) => {
			if(res.value === '1'){
				horizontalCoverFile = res.horizontalCoverFile
			} else if(res.value === '2'){
				verticalCoverFile= res.verticalCoverFile
			}
		})
		let contentHtml:any = ''
		let contentHtmlLabels:any = []
		this.labeTreeValue.forEach((res:any) => {
			if(res.checkAll === true){
				contentHtmlLabels.push(`<span style="font-size: 12px;margin-right: 4px;color: #2443BC;opacity: 0.8">${res.name}</span>`)
			}
		})
		contentHtmlLabels = contentHtmlLabels.toString().replace(/,/g, "")
		if(this.contentClassificationList.contentType === 't'){
			contentHtml = `<div style="position:absolute;top:20%;left:35%;width:375px;border-radius: 10px;padding:10px">
											<div style="font-size: 16px;font-weight: 600;">${this.formState.titleName}</div>
											<div style="width:365px">
												${this.contentClassificationList.contentText}
											</div>
											<div style="margin-top:10px;">
												${contentHtmlLabels !== '' ? contentHtmlLabels :''}
											</div>
										</div>`
		} else if(this.contentClassificationList.contentType === 'y'){
			contentHtml = `<div style="position:absolute;top:20%;left:35%;width:375px;border-radius: 10px;padding:10px">
											<video src="${imgUrl}/dop/iug/zuul/content/file/downloadImageOrVideo/c/${this.contentClassificationList.contentFile}" style="width:100%;" preload="auto" autoplay controls="controls">
											</video>
											<div style="font-size: 16px;font-weight: 600;">${this.formState.titleName}</div>
											<div style="margin-top:10px;">
												${contentHtmlLabels !== '' ? contentHtmlLabels :''}
											</div>
										</div>`
		}
		let params = {
			contentId:this.route.query.editType === '1' ? this.route.query.id : '',
			operateType:value,
			topicId:this.formState.topicId,
			labelIds:this.labeTreeValue.map((item:any) => {return item.value}).toString(),
			// labelIds:this.checkSureTallyListData.map((item:any) => {if(item.checkAll === true){return item.id}}).toString(),
			titleName:this.formState.titleName,//标题名称
			contentType:this.contentClassificationList.contentType,
      productCodes:this.contentClassificationList.productCodes,
			contentText:this.contentClassificationList.contentType === 't' || this.contentClassificationList.contentType === 'pr' ?  this.contentClassificationList.contentText : '',
			contentFile:this.contentClassificationList.contentFile,
			summary:this.formState.abstractContent,
			horizontalCoverFile:horizontalCoverFile,
			verticalCoverFile:verticalCoverFile,
			canDiscuss:this.initialDiscussData.discussValue,
			canPraise:this.initialDiscussData.giveLike,
			canShare:this.initialDiscussData.canShare,
			praiseInitValue:this.initialDiscussData.giveLikeValue,
			shareInitValue:this.initialDiscussData.canShareValue,
			readInitValue:this.initialDiscussData.viewInitialValue,
			isRelateAdvertSpace:this.initialDiscussData.canAdvertising,
			reachId:this.initialDiscussData.canAdvertisingValue,
			subjectType:this.contentClassificationList.subjectType,
			bannerPictureFile:this.contentClassificationList.bannerPictureFile,//banner图地址
			subjectStartTimeStr:this.contentClassificationList.subjectStartTimeStr,//话题开始时间
			subjectEndTimeStr:this.contentClassificationList.subjectEndTimeStr,//话题结束时间
			redOpinion:this.contentClassificationList.redOpinion,//红方观点
			blueOpinion:this.contentClassificationList.blueOpinion,//蓝方观点
			optionType:this.contentClassificationList.optionType,//话题结果-单选多选
			resultList:this.contentClassificationList.resultList,//话题结果-列表
			isTipTruth:this.contentClassificationList.isTipTruth,//是否提示真相
			truthTitle:this.contentClassificationList.truthTitle,//真相标题
			truthExplain:this.contentClassificationList.truthExplain,//真相说明
			pictureFile:this.contentClassificationList.pictureFile,//话题图片上传地址
			subjectDescription:this.contentClassificationList.contentType === 's' ?  this.contentClassificationList.subjectDescription : '',
			contentHtml:contentHtml,//页面html文件
			videoTimeLength:this.contentClassificationList.videoTimeLength,
			minPremium:this.contentClassificationList.minPremium//保费金额
		}
		 
		await contentApi.addContentInfo(params,{}).then(res => {
			if(value === '0' ){
				message.info('保存成功')
				this.$router.go(-1)
			} else if(value === '1' && this.route.query.editType === '0'){
				message.info('新增成功')
				this.$router.go(-1)
			} else if(value === '1' && this.route.query.editType !== '0'){
				message.info('修改成功')
				this.$router.go(-1)
			}
			store.commit('getContentType','')
		})
	}
}
</script>

<style lang="less" scoped>
p{
	padding: 0px;
	margin: 0px;
}
.basic {
	width: 100%;
	height: 40px;

	.basic-information {
		width: 64px;
		padding: 0;
		padding-bottom: 6px;
		margin: 0px;
		// height: 22px;
		font-size: 16px;
		font-weight: 500;
		color: #333333;
		line-height: 22px;
		border-bottom: solid 2px #E8380D;
	}

	.basic-information-hr {
		width: 100%;
		margin: 0;
		height: 1px;
		background-color: #E8380D;
		border: none
	}
}
.copy-success{
	width: 76px;
	height: 32px;
	text-align: center;
	font-size: 14px;
	font-weight: 400;
	color: #E8380D;
	line-height: 32px;
	opacity:1 !important;
}
.checkSureList{
	margin-right: 10px;
	background: rgba(36,67,188,0.08);
	border-radius: 16px;
	padding: 2px 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	.checkSureList_name{
		color:#2443BC;
		opacity: 1 !important
	}
	.checkSureList_x{
		padding: 4px;
		font-size: 12px;
	}
}
</style>