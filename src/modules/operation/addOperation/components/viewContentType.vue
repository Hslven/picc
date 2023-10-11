<template>
	<div class="add-drawer">
    <div class="drawer-Title"></div>
    <div class="drawer-From">
      <a-form :model="formData">
        <a-row>
          <a-col :span="8">
            <a-form-item label="内容描述：">
              <a-input v-model:value="formData.name" disabled maxlength="60"/>
            </a-form-item>
          </a-col>
       	</a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="关联方式：">
              <a-radio-group v-model:value="formData.resource" disabled>
                <a-radio
									:value="item.value"
									v-for="(item,index) in resourceType" 
									:key="index" 
								>{{ item.label }}
								</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-item label="内容类型：" v-if="formData.resource === '1'">
              <a-checkbox-group v-model:value="formData.type" disabled>
                <a-checkbox
									:value="item.value" 
									v-for="(item,index) in contentType" 
									:key="index" 
									>{{ item.label }}
								</a-checkbox>
							</a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
        	<a-col :span="11">
          	<a-form-item label="筛选标签：">
							<a-tree-select
								disabled
								v-model:value="formData.region"
								style="width: 100%"
								:tree-data="filterRegionList"
								tree-checkable
								allow-clear
								@change="changeRegionType()"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								:treeCheckStrictly="true"
								:show-checked-strategy="SHOW_PARENT"
								placeholder="请选择筛选标签"
								tree-node-filter-prop="label"
							>
							</a-tree-select>
          	</a-form-item>
        	</a-col>
        	<a-col :span="1"></a-col>
        	<a-col :span="11">
						<a-form-item label="屏蔽标签：">
							<a-tree-select
								disabled
								v-model:value="formData.masktag"
								style="width: 100%"
								:tree-data="filterRegionList"
								tree-checkable
								allow-clear
								@change="changeMaskTag()"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								:treeCheckStrictly="true"
								:show-checked-strategy="SHOW_PARENT"
								placeholder="请选择屏蔽标签"
								tree-node-filter-prop="label"
							>
							</a-tree-select>
						</a-form-item>
					</a-col>
     	  </a-row>
				<a-row>
					<a-col :span="11">
						<a-form-item label="筛选标题：">
							<a-input disabled v-model:value="formData.filterHeading" placeholder="请输入标题" />
						</a-form-item>
					</a-col>
					<a-col :span="1"></a-col>
					<a-col :span="11">
						<a-form-item label="屏蔽标题：">
							<a-input disabled v-model:value="formData.maskTitle" placeholder="请输入标题"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="11">
						<a-form-item label="上架时间：">
							<a-select v-model:value="formData.shelfTime" disabled placeholder="请选择">
								<a-select-option	
									:value="item.value"
									v-for="(item,index) in shelfTimeList"
									:key="index"
								>{{ item.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="1"></a-col>
					<a-col :span="11">
						<a-form-item label="栏目分类：">
							<a-cascader
								disabled
								v-model:value="formData.Column"
								:multiple="true"
								:options="columnList"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								@change="changecolumn(formData.Column)"
								placeholder="请选择" />
						</a-form-item>
					</a-col>
				</a-row>
    	</a-form>
  	</div>
		<div class="drawer-Table">
      <a-table
				:columns="columns" 
				:row-key="(record:any) => record.contentId"
				:pagination="pagination"
				:data-source="dataList" 
				>
			  <template #content="{text,record}">
          <div style="display: flex;justify-content: start;align-items: start;width: 234px;">
            <div style="width:34px;height:34px;margin-right:10px" v-if="record.isUploadCover === 'y'" >
              <img :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.coverFile" style="width:34px;height:34px">
            </div>
            <div style="display: flex;flex-direction: column;justify-content: start;align-items: start;">
							<div style="font-size:14px;width:234px;display: flex;justify-content: start;">
								<a-tooltip>
									<template #title>{{record.titleName}}</template>
									<a-button type="link" @click="lookContentDetail(record.contentId)">
                    {{ record.titleName.length > 10 ? record.titleName.slice(0,10) + '...' : record.titleName}}
                  </a-button>
								</a-tooltip>
							</div>
            </div>
          </div>
        </template>
				<template #contentType="{text,record}">
					<span>{{ text === 't' ? '图文' :  text === 'b' ? '海报' : text === 'pr' ? '产品' : text === 's' ? '话题' : text === 'v' ? '视频' :'' }}</span>
				</template>
      </a-table>
    </div>
    <div class="drawer-Button">
      <a-row>
        <a-col :span="20"></a-col>
        <a-col :span="4">
          <a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="cancleDetailContent('colseReturn')">返回</a-button>
        </a-col>
      </a-row>
    </div>
		<!-- 查看内容详情弹窗 -->
		<a-drawer
			v-model:visible="showContentDetail"
			class="custom-class"
			placement="right"
			width="1000"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_contentDetail_title">
					<div>
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../../assets/addLeft.png" alt="">
						<span style="font-size: 16px;">内容详情</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="cancleDetailContent">
						<img style="width: 15px;height: 10px;" src="../../../assets/addBack.png" alt="">
					</a-button>
				</div>
			</template>
			<contentDetail
				:showContentDetail="showContentDetail"
        :detailFlag="detailFlag"
        :detailContentId="detailContentId"
				@cancleDetailContent="cancleDetailContent"
			/>
		</a-drawer>
  </div>
</template>
<script lang="ts" setup>
import {localStorage} from '@/libs/Storage';
import { ref, reactive, watchEffect } from 'vue'
import { operaTionApi } from '@/libs/api/index';
import { AxiosRequestHeaders } from 'axios';
import { message, MessageArgsProps, TreeSelect } from 'ant-design-vue';
import contentDetail from '@/modules/conTent/contentDetail/index.vue';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const headers:any = {
	['X-Auth-Token'] : localStorage.get('token')
}
const props = defineProps(['displayContentList','showContentDetail', 'detailContentId','coverLength', 'coverWidth','listIndexOrContent','formDataAllreadyName'])
const emit = defineEmits(["changeDrawer","chooseFormData",'cancleDetailContent']);
//查看内容详情的展示
let showContentDetail = ref<boolean>(false)
let detailFlag = ref<string>('1')
let detailContentId = ref<string>('')
//筛选数据v-model
let formData:any = reactive({
	name:'',//内容描述
	resource: '',//关联方式
	type:[],//内容分类
	region:[],//选择标签
	includeTag:[],//重置选择标签
	masktag:[],//屏蔽标签
	filterTag:[],//重置屏蔽标签
	shelfTime:undefined,//选择时间
	shelfTimeOther:'',//选择其他时间
	filterHeading:'',//筛选标题
	Column:[],//栏目分类
	ColumnClassification:[],//重置栏目分类
	maskTitle:'',//屏蔽标题
	notTopicld:[],//屏蔽栏目
})
let userTableSelectedKeys = ref<any>([])
//标签列表数据
let filterRegionList:any = ref([])
//栏目列表数据
let columnList:any = ref([])
//内容类型
const contentType:any[] = [
	{
		label: '图文',
		value: 't',
	},
	{
		label: '海报',
		value: 'b'
	},
	{
		label: '产品',
		value: 'pr'
	},
	{
		label: '话题',
		value: 's'
	},
	{
		label: '视频',
		value: 'v'
	}
]
//选择上架时间列表 7-7 14-14 30-30 60-60 90-90 6-其他
const shelfTimeList:any[] = [
	{
		label:'最近7天',
		value:'7'
	},
	{
		label:'最近14天',
		value:'14'
	},
	{
		label:'最近30天',
		value:'30'
	},
	{
		label:'最近60天',
		value:'60'
	},
	{
		label:'最近90天',
		value:'90'
	},
	{
		label:'其他',
		value:'6'
	},
]
//关联方式
const resourceType:any[] = [
	{
		label:'内容分类',
		value:'1'
	},
	{
		label:'具体文章',
		value:'2'
	},
]
//table表头数据
const columns: any[] = [
  {
    title: '栏目分类',
    align:'center',
    dataIndex:'topicName'
  },
  {
    title: '标题名称',
    dataIndex: 'titleName',
    slots: { customRender: 'content' },
    align:'center'
  },
  {
    title: '标签',
    dataIndex: 'labelNames',
    align:'center'
  },
  {
    title: '内容分类',
    dataIndex: 'contentType',
		slots: { customRender: 'contentType' },
    align:'center'
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    align:'center'
  },
  {
    title: '上架时间',
    dataIndex: 'publishTime',
    align:'center'
  },
]
//分页
let pagination = reactive({
	current:1,
	pageSize:5,
	defaultCurrent: 1, // 默认当前页数
  defaultPageSize: 5, // 默认当前页显示数据的大小
  total: 0, // 总数，必须先有
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["5", "10", "15", "20"],
  showTotal: (total:number) => `共 ${total} 条`, // 显示总
})
watchEffect(() => {
	console.log(props.displayContentList,'displayContentList')
	const showContentDetail = props.showContentDetail
	console.log(showContentDetail,'showPeopleDrawer')
	if (showContentDetail) {
		getLabelList()
	}
})
let dataList:any = ref([])
//获取内容描述数据
async function getContentList() {
	const detailContentId = props.detailContentId
	const {contentFormData} = props.displayContentList.content
	let params = {
		topicId: [],//栏目id
		titleName: '',//筛选标题
		notTitleName: '',//屏蔽标题
		contentTypes: [],//内容分类
		labelId: [],//筛选标签
		notLabelId: [],//屏蔽标签
		days: '',//最近多少天
		other:'',
		reachCoverHeight: props.coverLength,
		reachCoverWidth: props.coverWidth
	}
	contentFormData.forEach((item:any) => {
		if(item.value === detailContentId){
			params.topicId = item.ColumnClassification,
			params.titleName = item.filterHeading,
			params.notTitleName = item.maskTitle,
			params.contentTypes = item.type,
			params.labelId = item.includeTag,
			params.notLabelId = item.filterTag,
			params.days = item.shelfTime,
			params.other = item.other
		}
	})
	const header: any = {
		request: (header: AxiosRequestHeaders) => {
			// header.nowPage = 1;
			// header.row4Page = 5;
		}
	}
	console.log(params,'params')
	await operaTionApi.getContentList(params, header).then((res: any) => {
		if (res.flag === 'success') {
			const headers: any = {
				request: (header: AxiosRequestHeaders) => {
					header.nowPage = 1;
					header.row4Page = res.recordsTotal;
				}
			}
			operaTionApi.getContentList(params, headers).then((kes: any) => {
				console.log(kes.data)
				dataList.value = kes.data
				pagination.total = kes.recordsTotal
				// console.log(dataList,'dataList')
			})
		}
	})
}
//查询重置内容描述数据
async function initGetContentList(){
	let days:string = ''
	if(formData.shelfTime === '6'){
		days = ''
	} else {
		days = formData.shelfTime !== undefined ? formData.shelfTime : ''
	}
	let params = {
		topicId: formData.ColumnClassification,//栏目id
		titleName: formData.filterHeading,//筛选标题
		notTitleName: formData.maskTitle,//屏蔽标题
		contentTypes: formData.type,//内容分类
		labelId: formData.includeTag,//筛选标签
		notLabelId: formData.filterTag,//屏蔽标签
		days: days,//最近多少天
		other:formData.shelfTimeOther,
		reachCoverHeight: props.coverLength,
		reachCoverWidth: props.coverWidth
	}
	const header: any = {
		request: (header: AxiosRequestHeaders) => {
			// header.nowPage = 1;
			// header.row4Page = 5;
		}
	}
	await operaTionApi.getContentList(params, header).then((res: any) => {
		if (res.flag === 'success') {
			const headers: any = {
				request: (header: AxiosRequestHeaders) => {
					header.nowPage = 1;
					header.row4Page = res.recordsTotal;
				}
			}
			operaTionApi.getContentList(params, headers).then((kes: any) => {
				dataList.value = kes.data
				pagination.total = kes.recordsTotal
				pagination.current = 1
				// console.log(dataList,'dataList')
			})
		}
	})
}
//查询重置按钮
function searchReset(value:boolean){
	initGetContentList()
}
//获取标签列表
async function getLabelList() {
	let checkResData: any = []
	let params = {
		id: ''
	}
	await operaTionApi.getLabelQuery(params, {}).then((res) => {
		if (res.flag === 'success') {
			checkResData = getNewTree(res.data)
			filterRegionList.value = checkResData
			getcolumnList()
		} else if (res.flag === 'fail') {
			res.msg.forEach(jes => {
				message.info(jes)
			})
		}
	})
}
function getNewTree(obj:any){
  obj.map((item:any)=>{
    if(item.leafFlag === '0'){
			item.disabled = true
    } else {
			item.disabled = false
		}
    if(item.children&&item.children.length>0){
      getNewTree(item.children)
    }
  })
  return obj
}
function getTreeId(list:any,id:any){
  for (let i = 0; i < list.length; i++) {
    if(list[i].id===id){
      return list[i]
    }else if(list[i].children && list[i].children.length>0){
    	let nameList:any = getTreeId(list[i].children,id)
      if(nameList){
        return nameList
      }  
    }
  }
}
//选择标签
function changeRegionType(){
	let regionList:any = []
	formData.region.forEach((res:any) => {
		regionList.push(res.value)
	})
	console.log(formData.region,'---')
	console.log('333',regionList)
	formData.includeTag = regionList
}
//屏蔽标签
function changeMaskTag(){
	let regionList:any = []
	formData.masktag.forEach((res:any) => {
		regionList.push(res.value)
	})
	console.log(regionList,'regionList')
	formData.filterTag = regionList
}
//获取栏目分类
async function getcolumnList() {
	let params = {
		id: ''
	}
	await operaTionApi.getClassIfication(params, {}).then((res) => {
		if (res.flag === 'success') {
			columnList.value = res.data
			const name = props.displayContentList.name
			const detailContentId = props.detailContentId
			const {contentFormData} = props.displayContentList.content
			let test:any = []
			formData.region = []
			formData.masktag = []
			formData.Column = []
			formData.ColumnClassification = []
			contentFormData.forEach((item:any) => {
				if(item.value === detailContentId){
					formData.resource = item.resource
					formData.type = item.type
					formData.filterHeading = item.filterHeading
					formData.maskTitle = item.maskTitle
					formData.shelfTime = item.shelfTime
					item.includeTag.forEach((include:any) => {
						formData.region.push(getTreeId(filterRegionList.value,include))
					})
					formData.region = formData.region.map((region:any) => {return {label:region.name,value:region.id}})
					item.filterTag.forEach((filterTag:any) => {
						formData.masktag.push(getTreeId(filterRegionList.value,filterTag))
					})
					formData.masktag = formData.masktag.map((masktag:any) => {return {label:masktag.name,value:masktag.id}})
					item.ColumnClassification.forEach((ColumnClassification:any) => {
						formData.Column.push(getTreeId(columnList.value,ColumnClassification))
					})
					formData.Column = formData.Column.map((Column:any) => {return Column.id})
					formData.Column.forEach((res:any) => {
						formData.ColumnClassification.push(res)
					})
					getContentList()
				}
			})
		formData.name = name
		} else if (res.flag === 'fail') {
			res.msg.forEach(jes => {
				message.info(jes)
			})
		}
	})
}
//选择栏目分类
function changecolumn(value:any){
	let columnTagList:any = []
	formData.Column.forEach((res:any) => {
		columnTagList.push(res[res.length -1])
	})
	formData.ColumnClassification = columnTagList
}
//点击分页跳转
function changeProPage(value:any){
	pagination.current = value.current
	pagination.pageSize = value.pageSize
}

//查看内容详情
function lookContentDetail(contentId:string){
	detailContentId.value = contentId
	showContentDetail.value = true
}
function cancleDetailContent(value:any){
	showContentDetail.value = false
	if(value === 'colseReturn'){
		emit('cancleDetailContent',false)
	}
}
</script>
<style lang="less">
p{
  margin: 0;
  padding: 0; 
}
.drawer-From {
    margin-top: 10px;
}

.drawer-Table {
    margin-top: 24px;
}
.ScreeningCondition_contentDetail_title{
	display: flex;
	justify-content: space-between;
	align-items: center;
	// background-color: #EBF2F7;
	height: 40px;
	padding: 0px 16px;
	.ScreeningCondition_title_btn{
		border:solid 0px;
		width: 15px;
		height: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		// background-color: #EBF2F7;
	}
}
</style>
