<template>
	<div class="add-drawer">
    <div class="drawer-Title"></div>
    <div class="drawer-From">
      <a-form :model="formData">
        <a-row>
          <a-col :span="8">
            <a-form-item label="内容描述：">
              <a-input v-model:value="formData.name" maxlength="60"/>
            </a-form-item>
          </a-col>
       	</a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item label="关联方式：">
              <a-radio-group v-model:value="formData.resource">
                <a-radio
									:value="item.value"
									v-for="(item,index) in resourceType" 
									:key="index" 
									@click="chooseRecource(item.value)"
								>{{ item.label }}
								</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
					<a-col :span="12">
            <a-form-item label="内容类型：" v-if="formData.resource === '1'">
              <a-checkbox-group v-model:value="formData.type">
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
							<a-input v-model:value="formData.filterHeading" placeholder="请输入标题" />
						</a-form-item>
					</a-col>
					<a-col :span="1"></a-col>
					<a-col :span="11">
						<a-form-item label="屏蔽标题：">
							<a-input v-model:value="formData.maskTitle" placeholder="请输入标题"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="11">
						<a-form-item label="上架时间：">
							<a-select v-model:value="formData.shelfTime" placeholder="请选择">
								<a-select-option
									:value="item.value"
									v-for="(item,index) in shelfTimeList"
									:key="index"
									@click="chooseShelfTime(item.value)"
								>{{ item.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="1"></a-col>
					<a-col :span="11">
						<a-form-item label="栏目分类：">
							<a-cascader
								v-model:value="formData.Column"
								:multiple="true"
								:options="columnList"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								@change="changecolumn(formData.Column)"
								placeholder="请选择" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="3">
						<a-button danger style="border-radius: 6px;width:84px;" @click="searchReset(true)">重置</a-button>
					</a-col>
					<a-col :span="4">
						<a-button type="primary" danger style="border-radius: 6px;width:84px;" @click="searchReset(false)">查询</a-button>
					</a-col>
				</a-row>
    	</a-form>
  	</div>
		<div class="drawer-Table">
      <a-table
				:columns="columns" 
				:row-key="(record:any) => record.contentId"
				:pagination="pagination"
				@change="changeProPage($event)"
				:data-source="dataList" 
				:row-selection=" formData.resource === '2' ? {selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange}  : ''">

			  <template #content="{text,record}">
          <div style="display: flex;justify-content: start;align-items: start;width: 234px;">
            <div style="width:34px;height:34px;margin-right:10px" v-if="record.isUploadCover === 'y'" >
              <img :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.coverFile" @error="imgError(record)" style="width:34px;height:34px">
            </div>
						<div style="width:34px;height:34px;margin-right:10px;background-color: #eee;border-radius: 4px;" v-if="record.isUploadCover === 'n'">
              <a-upload
								v-model:file-list="record.fileList"
								maxCount="1"
								name="file"
								accept=".jpg,.jpeg,.png,.gif"
								:headers="headers"
								class="avatar-uploader"
								:on-success="onSuccess"
								:show-upload-list="false"
								:before-upload="beforeUpload"
								action="/dop/iug/zuul/content/file/c/upload.do"
								@change="handleChange(text,record)"
							>
								<img style="width:34px;height:34px" v-if="record.coverFile" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+text.coverFile" alt="avatar" />
								<div v-else>
									<loading-outlined v-if="loading"></loading-outlined>
									<plus-outlined v-else></plus-outlined>
									<div class="ant-upload-text" style="font-size: 10px;width:34px;height:34px;">待上传</div>
								</div>
							</a-upload>
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
        <a-col :span="16"></a-col>
        <a-col :span="4">
          <a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="onCloseOrSure('1')">取消</a-button>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" class="solidColor" @click="onCloseOrSure('2')">确认</a-button>
        </a-col>
      </a-row>
    </div>
		<a-modal
		  style="width: 400px;height: 160px;"
			:footer="null"
			v-model:visible="appPeoPleBoolean"
		>
			<a-row>
				<a-col :span="4">
					<img style="width: 32px;height: 32px;margin: 16px 0px;" src="../../../assets/fail.png" alt="">
				</a-col>
				<a-col :span="20">
					<p style="font-size: 18px;font-weight: 500;color: #000000;margin:18px 0px;">操作确认</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20">
					<p style="font-size: 14px;font-weight: 400;color: #666666;margin-bottom: 32px;">确认添加所选内容吗？</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20" style="margin-bottom: 16px;display: flex;justify-content: end;align-items: center;">
					<a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="closeOrSureAdd('1')">取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="closeOrSureAdd('2')">确定</a-button>
				</a-col>
			</a-row>
		</a-modal>
		<a-drawer
			v-model:visible="showContentDetail"
			class="custom-class"
			placement="right"
			width="1000"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_contentDetail_title">
					<div style="display: flex;justify-content: center;align-items: center;">
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
const props = defineProps(['showPeopleDrawer', 'coverLength', 'coverWidth','listIndexOrContent','formDataAllreadyName'])
const emit = defineEmits(["changeDrawer","chooseFormData"]);
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
//校验图片是否符合规格
const beforeUpload = (file: any) => {
	return new Promise((resolve, reject) => {
		const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
		if (!isJpgOrPng) {
			message.error('只能上传jpg,jpeg,png,gif的图片')
			return reject(false)
		}
		let w = 0,
				h = 0
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			const image:any = new Image()
			image.src = reader.result
			image.onload = () => {
				w = image.width
				h = image.height
				if(w/h === props.coverLength/props.coverWidth){
					return resolve(true)
				}
				message.error(`请上传符合${props.coverLength}:${props.coverWidth}的相同比例图片`)
				return reject(false)
				}
			}
		return isJpgOrPng
	})
};
watchEffect(() => {
	const showPeopleDrawer = props.showPeopleDrawer
	console.log(showPeopleDrawer,'showPeopleDrawer')
	if (showPeopleDrawer) {
		console.log(123,'3213')
		getContentList()
		getLabelList()
		getcolumnList()
	}
})
let dataList:any = ref([])
//获取内容描述数据
async function getContentList() {
	userTableSelectedKeys.value = []
	formData.name = props.formDataAllreadyName
	formData.resource = ''
	formData.type = [],//内容分类
	formData.region = [],//选择标签
	formData.includeTag = [],//重置选择标签
	formData.masktag = [],//屏蔽标签
	formData.filterTag = [],//重置屏蔽标签
	formData.shelfTime = undefined,//选择时间
	formData.shelfTimeOther = '',//选择其他时间
	formData.filterHeading = '',//筛选标题
	formData.Column = [],//栏目分类
	formData.ColumnClassification = [],//重置栏目分类
	formData.maskTitle = '',//屏蔽标题
	formData.notTopicld = []//屏蔽栏目
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
//清空formData
function reserFormList(){
	formData.resource = ''
	formData.type = [],//内容分类
	formData.region = [],//选择标签
	formData.includeTag = [],//重置选择标签
	formData.masktag = [],//屏蔽标签
	formData.filterTag = [],//重置屏蔽标签
	formData.shelfTime = undefined,//选择时间
	formData.shelfTimeOther = '',//选择其他时间
	formData.filterHeading = '',//筛选标题
	formData.Column = [],//栏目分类
	formData.ColumnClassification = [],//重置栏目分类
	formData.maskTitle = '',//屏蔽标题
	formData.notTopicld = []//屏蔽栏目
}
//查询重置按钮
function searchReset(value:boolean){
	if(value === true){
		reserFormList()
	}
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
			// store.commit('changeIncludeTagList',checkResData)
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
      console.log('item.children',item.children);
      getNewTree(item.children)
    }
  })
  console.log('obj',obj);
  return obj
}
//选择标签
function changeRegionType(){
	let regionList:any = []
	formData.region.forEach((res:any) => {
		regionList.push(res.value)
	})
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
			// store.commit('changeColumnList',res.data)
		} else if (res.flag === 'fail') {
			res.msg.forEach(jes => {
				message.info(jes)
			})
		}
	})
}
//选择栏目分类
function changecolumn(value:any){
	console.log(formData.Column,'formData.Column')
	let columnTagList:any = []
	formData.Column.forEach((res:any) => {
		console.log(res,'res')
		columnTagList.push(res[res.length -1])
	})
	formData.ColumnClassification = columnTagList
}
//选择关联方式 1-内容分类 2-具体文章
function chooseRecource(value: string){
	formData.resource = value 
	if(value === '2'){
		formData.type = []
	}
}
//选择上架时间
function chooseShelfTime(value:any){
	if(value === '6'){
		formData.shelfTimeOther = '90'
	} else {
		formData.shelfTimeOther = ''
	}
}
//点击分页跳转
function changeProPage(value:any){
	pagination.current = value.current
	pagination.pageSize = value.pageSize
}
//具体文章选中
function onSelectChange(selectedRowKeys:string[]) {
  userTableSelectedKeys.value = selectedRowKeys;
};
//符合图片规格上传
let uploadText = ref<any>({})
function onSuccess(response:any){
	uploadText.value.coverFile = response.defmap.data
	let params = {
		contentId:uploadText.value.contentId,
		coverFileAddress:response.defmap.data,
		coverType:'0'
	}
	operaTionApi.getContentCoverFileImg(params,{}).then((res:any) => {
		dataList.value.forEach((kes:any) => {
			if(kes.contentId === uploadText.value.contentId){
				kes.isUploadCover = 'y'
				kes.coverFile = response.defmap.data
			}
		})
	})
}
let loading = ref<boolean>(false)
function imgError(record:any){
	record.isUploadCover = 'n'
	record.coverFile = ''
}
function handleChange(text:any,record:any){
	loading.value = true
	uploadText.value = record
}
//是否确认弹窗
let appPeoPleBoolean = ref<Boolean>(false)
let specificArticleList = ref<any>([])
let checkIamge = ref<Boolean>(true)
//确认按钮
function onCloseOrSure(value:string){
	//1取消，2确认
	if(value === '1'){
		emit('changeDrawer',false)
	} else {
		specificArticleList.value = []
		checkIamge.value = true
    if(formData.name === ''){
			message.info("请输入内容描述")
			return
		} else if(formData.resource === ''){
			message.info("请选择关联方式")
			return
		} else if(formData.resource === '1' && formData.type.length === 0 ){
			message.info("请选择内容类型")
			return
		} else if(formData.resource === '2' && userTableSelectedKeys.value.length === 0){
			message.info("请选择具体文章")
			return
		} else if(formData.resource === '2' && userTableSelectedKeys.value.length !== 0){
			dataList.value.map( (item:any) => {
				userTableSelectedKeys.value.map((items:any) => {
					if(items === item.contentId){
						specificArticleList.value.push(item)
					}
				})
			})
			specificArticleList.value.forEach((res:any) => {
				if(res.isUploadCover === 'n'){
					checkIamge.value = false
				}
			})
			if(checkIamge.value === false){
				message.info('请上传符合内容分发长宽的图片')
				return
			}
			appPeoPleBoolean.value = true
		} else if(formData.resource === '1' && formData.type.length !== 0){
			dataList.value.forEach((res:any) => {
				if(res.isUploadCover === 'n'){
					checkIamge.value = false
				}
			})
			if(checkIamge.value === false){
				message.info('请上传符合内容分发长宽的图片')
				return
			}
			appPeoPleBoolean.value = true
		}
	}
}
//取消确认弹窗按钮
function closeOrSureAdd(value:string){
	if(value === '1'){
		appPeoPleBoolean.value = false
	} else {
		//重新查询
		const chooseFormData = {
			formData: formData,
			dataList:formData.resource === '1' ? dataList.value : specificArticleList.value,
			listIndex:props.listIndexOrContent,
			name:formData.name
		}
		console.log(chooseFormData,'chooseFormData')
		appPeoPleBoolean.value = false
		// formData.name = ''
		// reserFormList()
		console.log(chooseFormData,'chooseFormData')
		emit('changeDrawer',false)
		emit('chooseFormData',chooseFormData)
	}
}
//查看内容详情
function lookContentDetail(contentId:string){
	console.log('查看内容详情')
	detailContentId.value = contentId
	showContentDetail.value = true
}
function cancleDetailContent(value:boolean){
	showContentDetail.value = false
}

</script>
<style lang="less">
// .add-drawer{
// 	position: relative;
// 	.ant-pagination{
// 		padding-top: 20px;
// 		width: 990px;
// 		height: 80px;
// 		position: absolute;
// 		right: 10px;
// 		bottom: 0;
// 		background:#FFF;
// 		// position: absolute;
// 		// right: 0;
// 		// bottom: 0;
// 	}
// 	.drawer-Button{
// 		width: 1000px	;
// 		position: absolute;
// 		right: 0;
// 		bottom: 0;
// 		background:#FFF;
// 	}
// }
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
