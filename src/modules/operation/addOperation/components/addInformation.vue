<!--
    / * @FileDescription: 新增运营位基础信息
* @Author: Hjb
* @Date: 2023-03-28
* @LastEditors: 
* @LastEditTime:  -->

<template>
  <div>
		<a-row>
			<a-col :span="3" style="line-height: 32px;">
				<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
          *</span>
				所属渠道：</a-col>
			<a-col :span="20">
				<a-radio-group v-model:value="ditch">
					<a-radio style="margin-right:20px" :value="item.value" v-for="item in ditchList" :key="item.id" @click="changeDitch(item.value)">{{ item.label }}</a-radio>
				</a-radio-group>
			</a-col>
		</a-row>
		<a-row style="margin-top:2%">
			<a-col :span="3" style="line-height: 32px;">内容分发名称：</a-col>
			<a-col :span="15">
				<a-input
					v-model:value="operationName"
					@change="changeOperationName()"
					maxlength="60"
					:showCount="true"
					placeholder="请输入内容分发名称，支持中英文、数字、符号"
					style="width:594px;height:32px;border-radius: 4px;"
				></a-input>
			</a-col>
		</a-row>
		<a-row style="margin-top:2%">
			<a-col :span="3" style="line-height: 32px;">内容分发封面：</a-col>
			<a-col :span="5">
				<span style="margin-right:20px">长度</span>
				<a-input
					maxlength="8"
					v-model:value="coverLength"
					@change="changeCoverLength()"
					placeholder="请输入，单位px"
					style="width:134px;height:32px;border-radius: 4px;"
				></a-input>
			</a-col>
			<a-col :span="5">
				<span style="margin-right:20px">宽度</span>
				<a-input
					maxlength="8"
					v-model:value="coverWidth"
					@change="changeCoverWidth()"
					placeholder="请输入，单位px"
					style="width:134px;height:32px;border-radius: 4px;"
				></a-input>
			</a-col>
		</a-row>
		<a-button
			style="margin-top:2%;width:134px;height:32px;border-radius: 4px;"
			type="primary"
			@click="addTableList"
			danger>
			<span style="margin-right:6px">+</span>添加
		</a-button>

		<a-table :columns="columns" :data-source="tableList" bordered :pagination="false" style="margin-top:10px">
			<template #targetPopulation="{ text }">
				<div v-if="text.length === 0">
					<img src="../assets/edit.png" alt="" style="width:18px;height:18px"  @click="changeTargetPopulation()">
				</div>
				<div v-else-if="text !== ''" class="table-list-name">
					<p v-for="item in text" :key="item.id" >
						{{ item.names }}
					</p>
				</div>
			</template>

			<template #comparisonPopulation="{ text }">
				<div v-if="text.length === 0">
					<img src="../assets/edit.png" alt="" style="width:18px;height:18px"  @click="changeComparisonPopulation()">
				</div>
				<div v-else-if="text !== ''" class="table-list-name">
					<p v-for="item in text" :key="item.id" >
						{{ item.names }}
					</p>
				</div>
			</template>

			<template #contentPopulation="{ text,record,index }">
				<div v-if="text.key === ''">
					<img src="../assets/edit.png" alt="" style="width:18px;height:18px" @click="changeContentDescription(record,index)">
				</div>
				<div v-else-if="text.formData.name !== ''" class="table-list-name" @click="displayContentDescClick(text,record)">
					<p>
						{{ text.formData.name }}
					</p>
				</div>
			</template>

			<template #action="{action,record,index }">
				<div v-if="tableList.length !== 1" @click="deleteTableList(record,index)">
					<img src="../assets/delete.png" alt="">
				</div>
			</template>
		</a-table>

		<a-drawer
			:closable="false"
		  :keyboard="false"
		  :maskClosable="false"
			v-model:visible="showPeopleDrawer"
			class="custom-class"
			:title="DrawerTitle"
			placement="right"
			width="1000"
		>
			<people-drawer
				v-if="drawerType === '1' || drawerType === '2'"
			/>
			<content-describe
				v-if="drawerType === '3'"
				:formDataName="EditformDataName"
				@chooseFormData = "chooseFormData"
				@changeDrawer = "changeDrawer"
			/>
		</a-drawer>
		
		<a-drawer
			v-model:visible="showContentDesc"
			class="custom-class"
			title="反显内容"
			placement="right"
			width="1200"
		>
			<display-contentDesc
				:formDataName="EditformDataName"
				@increaseAgainFormData = "increaseAgainFormData"
				@showContentDescBoolean = "showContentDescBoolean"
			/>
		</a-drawer>
  </div>
</template>
  
<script lang="ts">
import { operaTionApi } from '@/libs/api/index';
import store from '@/modules/operation/store';
import { message, MessageArgsProps } from 'ant-design-vue';
import { Options, Vue } from 'vue-class-component';
import { computed } from 'vue'
import peopleDrawer from '../components/peopleDrawer.vue';
import contentDescribe from '../components/contentDescribe.vue'
import displayContentDesc from '../components/displayContentDesc.vue'
import { AxiosRequestHeaders } from 'axios';
import { VNode, RendererNode, RendererElement } from 'vue';

@Options({
  components:{
		peopleDrawer,
		contentDescribe,
		displayContentDesc
  }
})
export default class addInformation extends Vue {
	//渠道v-model
	public ditch:string = ''
	public changeDitch(value:any){
		store.commit('changeAddDitch',value)
	}
	public changeOperationName(){
		let pattern = /\s+/
		if(pattern.test(this.operationName)){
			message.info('内容分发名称不能包含空格，请重新输入')
      this.operationName = this.operationName.replace(/\s+/g,'')
      store.commit('changeAddOperationName',this.operationName)
		} else {
			store.commit('changeAddOperationName',this.operationName)
		}
	}
	public changeCoverLength(){
		// if(this.coverLength !== this.coverLength.replace(/[^0-9]/g, '')){
    //   message.info('请输入正整数')
    //   this.coverLength = this.coverLength.replace(/[^0-9]/g, '')
		// 	store.commit('changeAddCoverLength',this.coverLength)
    // } else {
      store.commit('changeAddCoverLength',this.coverLength)
    // }
	}
	public changeCoverWidth(){
		// if(this.coverWidth !== this.coverWidth.replace(/[^0-9]/g, '')){
    //   message.info('请输入正整数')
    //   this.coverWidth = this.coverWidth.replace(/[^0-9]/g, '')
    //   store.commit('changeAddCoverWidth',this.coverWidth)
    // } else {
      store.commit('changeAddCoverWidth',this.coverWidth)
    // }
	}
	//渠道下拉框列表数据
	public ditchList = [
			{
				label:'百度小程序',
				value:'1',
				id:'1'
			},
			{
				label:'微信小程序',
				value:'2',
				id:'2'
			},
			{
				label:'微信公众号',
				value:'3',
				id:'3'
			},
			{
				label:'抖音',
				value:'4',
				id:'4'
			},
			{
				label:'快手',
				value:'5',
				id:'5'
			},
			{
				label:'APP',
				value:'6',
				id:'6'
			},
	]
	//运营位名称v-model
	public operationName:string = ''
	//运营位封面长度
	public coverLength:string = ''
	//运营位封面宽度
	public coverWidth:string = ''
	public columns = [
      // {
			// 	title: '目标人群',
      //   dataIndex: 'target',
			// 	slots:{ customRender: 'targetPopulation' },
			// 	align:'center',
			// 	width:'240'
      // },
      // {
      //   title: '对比组人群',
      //   dataIndex: 'comparison',
			// 	slots:{ customRender: 'comparisonPopulation' },
			// 	align:'center',
			// 	width:'240'
      // },
      {
        title: '*内容描述',
        dataIndex: 'content',
				slots:{ customRender: 'contentPopulation' },
				align:'center',
				width:'240'
      },
      {
        title: '操作',
				dataIndex: 'action',
				slots:{ customRender: 'action' },
				align:'center'
      },
  ];
	public tableList:any = [
		{
			key: '1',
			target: [],
			comparison: [],
			content:{
				key:'',
				formData:{},
				dataList:[]
			},
			displayContent:[],
			contentDataList:[],
			contentIdList:[]
		},
	]
	//添加内容描述
	public addTableList(){
		this.tableList.push({
			key: `${this.tableList.length +1}`,
			target: [],
			comparison:[],
			content: {
				key:'',
				formData:{},
				dataList:[]
			},
			displayContent:[],
			contentDataList:[],
			contentIdList:[]
		})
	}
	//删除内容描述
	public deleteTableList(record:any,index:number){
		this.tableList.splice(index,1)
		this.changeContentDetailsIds.push(record.content.formData.contentDetailsId)
		store.commit('changeContentDetailsIds',this.changeContentDetailsIds)
		store.commit('changeTableContentList',this.tableList)
	}


	//弹窗类型 1-目标人群 2-对比组人群 3-内容描述
	public drawerType:string = ''
	public DrawerTitle:string = ''
	public showPeopleDrawer:boolean = false
	public changeDrawer(value:any){
		this.showPeopleDrawer = value
	}
	public chooseFormData(value:any){
		const map = new Map()
		this.tableList.forEach((res:any,index:number) => {
			if(res.key === this.contentDescriptionKey){
				res.content.key = res.key
				// if(res.displayContent.length !== 0){
				// 	res.displayContent.forEach((oes:any) => {
				// 		if(oes.formData.resource ==='2'){
				// 			 
				// 		}
				// 	})
				// }
				res.displayContent.push({
					key:res.key,
					contentDetailsId:res.content.formData.contentDetailsId,
					formData:value.formData,
					dataList:value.dataList,
					value:`${res.displayContent.length + 1}`,
					addValue:''
				})
				res.dataList = value.dataList
				res.content.formData = value.formData
				res.contentDataList.push(...value.dataList)
				res.contentIdList.push(...value.dataList.map((item: { contentId: any; }) => ({
					contentId : item.contentId
				})))
			}
		})
		 
		store.commit('changeTableContentList',this.tableList)
	}
	
	//内容描述弹窗按钮
	public contentDescriptionKey:string = ""
	public changeContentDescription(record:any,index:number){
		if(this.coverLength === '' ){
			message.info('请先添加内容分发封面长度')
			return 
		} else if(this.coverWidth === ''){
			message.info('请先添加内容分发封面宽度')
			return
		} else {
			this.drawerType = '3'
			this.DrawerTitle = '添加内容'
			this.contentDescriptionKey = record.key
			this.getContentList()
			// store.commit('changeFormDataName','')
			this.EditformDataName = ''
			this.showPeopleDrawer = true
		}
	}
	//获取内容描述数据
	public async getContentList(){
		let params = {
			topicId:[],//栏目id
			titleName:'',//筛选标题
			notTitleName:'',//屏蔽标题
			contentTypes:[],//内容分类
			labelId:[],//筛选标签
			notLabelId:[],//屏蔽标签
			days:'',//最近多少天

			// type:[],//内容分类
			// region:[],//选择标签
			// includeTag:[],//重置选择标签
			// masktag:[],//屏蔽标签
			// filterTag:[],//重置屏蔽标签
			// shelfTime:'',//选择时间
			// shelfTimeOther:'',//选择其他时间
			// filterHeading:'',//筛选标题
			// Column:[],//栏目分类
			// ColumnClassification:[],//重置栏目分类
			// maskTitle:'',//屏蔽标题
			// notTopicld:[],//屏蔽栏目
			reachCoverHeight:this.coverLength,
			reachCoverWidth:this.coverWidth
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        // header.nowPage = 1;
        // header.row4Page = 5;
      }
    }
		await operaTionApi.getContentList(params,header).then((res:any) => {
			if(res.flag === 'success'){
				const headers:any = {
					request: (header: AxiosRequestHeaders) => {
						header.nowPage = 1;
						header.row4Page = res.recordsTotal;
					}
				}
				operaTionApi.getContentList(params,headers).then((kes:any) => {
					 
					store.commit('changeContentAllNumber',kes.recordsTotal)
					store.commit('changeContentList',kes.data)
				})
			} else if(res.flag === 'fail'){
				res.msg.forEach((jes: string | number | boolean | void | VNode<RendererNode, RendererElement, { [key: string]: any; }> | (string | number | boolean | void | VNode<RendererNode, RendererElement, { [key: string]: any; }> | null | undefined)[] | JSX.Element | MessageArgsProps | null | undefined) => {
					message.info(jes)
				})
			}
		}).catch(() => {

		})
	}
	
	//查看已添加内容描述
	public showContentDesc:boolean = false
	public changeContentDetailsIds:any[] = []
	public EditformDataName:string = ''
	public async displayContentDescClick(text: any,record: any){
		// store.commit('changeFormDataName',record.content.formData.name)
		this.EditformDataName = record.content.formData.name
		this.contentDescriptionKey = record.key
		let displayContentData:any = []
		if(text.formData.contentDetailsId === '' || text.formData.contentDetailsId === undefined){	
			this.tableList.forEach((res:any) => {
				if(res.key === this.contentDescriptionKey){
					 
					store.commit('changeDisplayContentList',res)
			}})
			this.showContentDesc = true
		}
		else{
			let params = {
				contentDetailsId:text.formData.contentDetailsId,
				reachCoverHeight:this.coverLength,
				reachCoverWidth:this.coverWidth
			}
			if(this.changeContentDetailsIds.length === 0){
				this.changeContentDetailsIds.push(text.formData.contentDetailsId)
			} else {
				this.changeContentDetailsIds.forEach((res:any) => {
					if(res !== text.formData.contentDetailsId){
						this.changeContentDetailsIds.push(text.formData.contentDetailsId)
					}
				})
			}
			const map = new Map()
			this.changeContentDetailsIds = this.changeContentDetailsIds.filter((key:any) => !map.has(key) && map.set(key, 1))
			store.commit('changeContentDetailsIds',this.changeContentDetailsIds)
			await operaTionApi.getSelectReverse(params,{}).then((res:any) => {
				this.tableList.forEach((item:any) => {
					// item.displayContent = []
					if(item.key === this.contentDescriptionKey){
						item.displayContent = []
						item.dataList = res.data
						res.data.forEach((oes:any,index:number) => {
							item.displayContent.push({
									key:item.key,
									formData :{
										resourceName:oes.relationWayCode === '0' ? '内容分类' : '具体文章',
										resource:oes.relationWayCode === '0' ? '1' : '2',
										type:oes.contetTypeCode,
										filterHeading:oes.topicName,
										maskTitle:oes.notlnTitleName,
										shelfTime:oes.day,
										ColumnClassification:oes.topicId!== '' ? oes.topicId.split(',') : [],
										filterTag:oes.notInLabel !== '' ? oes.notInLabel.split(',') : [],
										includeTag:oes.label !== '' ? oes.label.split(',') : [],
										// type:eval('(' + oes.contetTypeCode+ ')'),
										contentId:oes.contentId,
									},
									contentDetailsId:item.contentDetailsId,
									dataList :[
										{
											contentId:oes.contentId,
											contetTypeCode:oes.contetTypeCode,
											contentDetailsId:oes.contentDetailsId,
											contentClassification:oes.contentTypeName,
											shelfTime:oes.publishTime,
											titleName:oes.titleName,
											topicId:oes.topicId,
											columnClassification:oes.topicName,
											contentStatus:oes.contentStatus,
											imageUrl:oes.pictureFile,
											isUploadCover:oes.isUploadCover
										}
									],
									value:`${index + 1}`,
									addValue:`${index + 1}`
							})
						})
						// item.dataList.push(res.data)
					}
				})
				this.tableList.forEach((item:any) => {
					if(item.key === this.contentDescriptionKey){
						// item.dataList.push(res.data)
						store.commit('changeDisplayContentList',item)
					}
				})
				this.showContentDesc = true
			}).catch(() => {})
		}

	}
	//反显内容后再次添加
	public increaseAgainFormData(value:any){
		 
		this.drawerType = '3'
		this.DrawerTitle = '内容描述'
		this.showContentDesc = false
		this.showPeopleDrawer = true
		this.getContentList()
	}
	//关闭反显内容
	public showContentDescBoolean(value:any){
		this.showContentDesc = value
	}
	//一期不做，目标人群 对比组人群
	public changeTargetPopulation(){
		// this.drawerType = '1'
		// this.DrawerTitle = '目标人群'
		// this.showPeopleDrawer = true
	}
	public changeComparisonPopulation(){
		// this.drawerType = '2'
		// this.DrawerTitle = '对比组人群'
		// this.showPeopleDrawer = true
	}
	
	public state:any = store.state
	public editTypeValue = '0'
	public contentDetailsIdList:any = []
	public created(): void {
  }
	//编辑
	public editTest:any = computed(() =>{
		this.editTypeValue = this.state.editOperation.editTypeValue
		 
		const chooseEditInfo = this.state.editOperation.chooseEditInfo
		if(this.editTypeValue === '1'){
			this.tableList = []
			this.ditch = chooseEditInfo.reachDitchCode
			store.commit('changeAddDitch',chooseEditInfo.reachDitchCode)
			this.operationName = chooseEditInfo.reachName
			store.commit('changeAddOperationName',chooseEditInfo.reachName)
			this.coverLength = chooseEditInfo.reachPictureLong.toString()
			store.commit('changeAddCoverLength',chooseEditInfo.reachPictureLong)
			this.coverWidth = chooseEditInfo.reachPictureWide.toString()
			store.commit('changeAddCoverWidth',chooseEditInfo.reachPictureWide)
			if(chooseEditInfo.contentDetailsVoList !== undefined){
				chooseEditInfo.contentDetailsVoList.map((item: any,index: number) => {
					this.tableList.push({
						key: `${index +1}`,
						target: [],
						comparison:[],
						content: {
							key:`${index +1}`,
							formData:{
								name:item.contentDetails,
								contentDetailsId:item.contentDetailsId
							},
							dataList:[]
						},
						contentDetailsId:item.contentDetailsId,
						displayContent:[{
							key:`${index +1}`,
							formData:{
								name:item.contentDetails,
							},
							contentDetailsId:item.contentDetailsId,
							dataList:[],
							value:`${index + 1}`
						}],
						contentDataList:[],
						contentIdList:[]
					})
					this.contentDetailsIdList.push(item.contentDetailsId)
					store.commit('changeTableContentList',this.tableList)
					store.commit('changeContentDetailsIdList',this.contentDetailsIdList)
					store.commit('changeAddDitch',this.ditch)
					this.changeCoverLength()
					this.changeCoverWidth()
					this.changeOperationName()
				})
			}
		}
		return 
	})
}


</script>
  
<style lang="less" scoped>
p{
	padding: 0;
	margin: 0;
}
.table-list-name{
	display: flex;
	justify-content: center;
	align-items: center;
}
:global(.ant-table-thead > tr > th){
text-align: center !important;
}
</style>