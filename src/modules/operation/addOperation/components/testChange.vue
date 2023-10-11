<template>
	<div>
		<a-row>
			<a-col :span="3" style="line-height: 32px;">
				<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
					*</span>
				所属渠道：</a-col>
			<a-col :span="20">
				<a-radio-group v-model:value="ditch">
					<a-radio style="margin-right:20px" :value="item.value" v-for="item in ditchList" :key="item.id">{{ item.label
					}}</a-radio>
				</a-radio-group>
			</a-col>
		</a-row>
		<a-row style="margin-top:2%">
			<a-col :span="3" style="line-height: 32px;">内容分发名称：</a-col>
			<a-col :span="15">
				<a-input v-model:value="operationName" @change="changeOperationName()" maxlength="60" :showCount="true"
					placeholder="请输入内容分发名称，支持中英文、数字、符号" style="width:594px;height:32px;border-radius: 4px;"></a-input>
			</a-col>
		</a-row>
		<a-row style="margin-top:2%">
			<a-col :span="3" style="line-height: 32px;">内容分发封面：</a-col>
			<a-col :span="5">
				<span style="margin-right:20px">长度</span>
				<a-input maxlength="8" v-model:value="coverLength" placeholder="请输入，单位px"
					style="width:134px;height:32px;border-radius: 4px;"></a-input>
			</a-col>
			<a-col :span="5">
				<span style="margin-right:20px">宽度</span>
				<a-input maxlength="8" v-model:value="coverWidth" placeholder="请输入，单位px"
					style="width:134px;height:32px;border-radius: 4px;"></a-input>
			</a-col>
		</a-row>
		<a-button style="margin-top:2%;width:134px;height:32px;border-radius: 4px;" type="primary" @click="addTableList"
			danger>
			<span style="margin-right:6px">+</span>添加
		</a-button>

		<a-table :columns="columns" :data-source="tableList" bordered :pagination="false" style="margin-top:10px">
			<!-- <template #targetPopulation="{ text }">
				<div v-if="text.length === 0">
					<img src="../assets/edit.png" alt="" style="width:18px;height:18px" @click="changeTargetPopulation()">
				</div>
				<div v-else-if="text !== ''" class="table-list-name">
					<p v-for="item in text" :key="item.id">
						{{ item.names }}
					</p>
				</div>
			</template> -->

			<!-- <template #comparisonPopulation="{ text }">
				<div v-if="text.length === 0">
					<img src="../assets/edit.png" alt="" style="width:18px;height:18px" @click="changeComparisonPopulation()">
				</div>
				<div v-else-if="text !== ''" class="table-list-name">
					<p v-for="item in text" :key="item.id">
						{{ item.names }}
					</p>
				</div>
			</template> -->

			<template #contentPopulation="{ text, record, index }">
				<div v-if="record.name === '' || record.name === undefined">
					<img src="../assets/edit.png" alt="" style="width:18px;height:18px"
					@click="changeContentDescription(text,record,index)">
				</div>
				<div v-else-if="record.name !== '' || record.name !== undefined" class="table-list-name">
					<a-button v-if="record.name !== undefined" @click="displayContentDescClick(text,record)" class="table-list-name-btn">
						<span style="color:#2443BC;font-size: 14px;">{{ record.name }}</span>
					</a-button>
				</div>
			</template>

			<template #action="{ action, record, index }">
				<div v-if="tableList.length !== 1" @click="deleteTableList(record, index)">
					<img src="../assets/delete.png" alt="">
				</div>
			</template>
		</a-table>
		<p class="information-name">配置规则</p>
		<!-- 多样性规则单选框 -->
		<a-row style="display: flex;justify-content:start;align-items: center;margin-top:2%">
			<a-col :span="3">多样性规则：</a-col>
			<a-col :span="21" style="display: flex;justify-content: start;align-items: center;">
				<a-button type="text" danger @click="addContentTop($event)">
					<plus-outlined style="font-size:16px" />
					内容置顶
				</a-button>
				<a-radio-group v-model:value="diversity" style="margin-left:30px">
					<a-radio style="margin-right:20px" :value="item.value" v-for="item in diversityChooseList" :key="item.id"
						@click="chooseDiversityRule(item,item.value)">
						{{ item.label }}
					</a-radio>
				</a-radio-group>
			</a-col>
		</a-row>
		<!-- 多样性规则 -->
		<div v-if="DiversityRule" v-for="(item, index) in DiversityList" :key="item.id" :index="index">
			<div class="partition"></div>
			<div class="diversity-rule">
				<b>{{ diversity === '3' ? '内容体裁规则' : diversity === '1' ? '内容标签规则' : '' }}
					<span style="margin-left:10px">
						{{ diversity === '3' || diversity === '1' ? `(${index + 1}/4)` : '' }}
					</span>
				</b>
			</div>
			<div class="diversity-rule-choose" :style="diversityRuleChoose">
				<div class="diversity-rule-choose-input">
					<div class="diversity-rule-choose-input-content">
						<p>每</p>
						<a-input placeholder="请录入" v-model:value="item.contentNumber"
							style="width: 76px;height: 30px;border-radius: 4px;margin: 0px 6px;background: #F7F7F7;"></a-input>
						<p>篇内容中，</p>
						<a-select v-if="diversity === '3'" :bordered="false" :placeholder="chooseRulePlaceholder"
							v-model:value="item.chooseContentType"
							style="width: 160px;height: 32px;border-radius: 4px;border: solid 1px #E0E0E0;">
							<a-select-option v-for="(items, index) in contentType" :key="index" :value="items.value">
								{{ items.label }}
							</a-select-option>
						</a-select>
						<a-cascader
							v-if="diversity === '1'"
							v-model:value="item.chooseContentType"
							style="width: 160px;height: 32px;border-radius: 4px;border: solid 1px #E0E0E0;"
							:options="labelList"
							:field-names="{ label: 'name', value: 'id', children: 'children' }"
							@change="changeRegionType(item)"
							placeholder="请选择内容标签" />
						<p style="margin:0px 10px">最少展示</p>
						<a-input placeholder="请录入" v-model:value="item.minimumDisplay"
							style="width: 140px;height: 30px;border-radius: 4px;margin: 0px 6px;background: #F7F7F7;" @change="changeMinMum(item)"></a-input>
						<p style="margin:0px 10px">篇，最多展示</p>
						<a-input placeholder="请录入" v-model:value="item.maximumDisplay"
							style="width: 140px;height: 30px;border-radius: 4px;margin: 0px 6px;background: #F7F7F7;" @change="changeMinMum(item)"></a-input>
						<p>篇</p>
					</div>
					<div style="width: 18px;height: 18px;">
						<p style="width: 18px;height: 18px;background: #E8380D;color: #ffffff;border-radius: 50%;text-align:center;line-height: 18px;"
							@click="aloneCancleDiversity(item,index)">-</p>
					</div>
				</div>
				<div style="width: 100%;background-color: #E0E0E0;height: 1px;" v-if="diversity !== '2'"></div>
				<div>
					<p style="margin: 0;color: #E8380D;" @click="addDiversityRule" v-if="diversity !== '2'">
						<b style="font-size:20px;margin-right:6px;padding: 0;text-align: center;padding-left: 20px;">+</b>
						{{ diversity === '3' ? '体裁配置' : diversity === '1' ? '标签配置' : '' }}
					</p>
				</div>
			</div>
		</div>
		<!-- 置顶规则列表 -->
		<div v-if="contentTopRule" v-for="(item, index) in contentTopList" :key="item.id">
			<!-- <div class="partition"></div> -->
			<div class="diversity-rule" style="margin:10px 0px">
				<b>内容置顶规则
					<span style="margin-left:10px">
						{{ (index + 1) }}/4
					</span>
				</b>
			</div>
			<div class="diversity-rule-choose">
				<div class="diversity-rule-choose-input">
					<div style="display: flex;justify-content: start;align-items: center;">
						<p style="margin-right:10px">标题：</p>
						<a-button style="border-radius: 6px;width:300px;overflow: hidden;border:solid 0px;"
							@click="chooseContentTopIndex()">{{ item.titleName }}</a-button>
						<p style="margin:0px 10px">失效时间:</p>
						<a-date-picker
							:disabledDate="disabledDate"
							v-model:value="item.chooseTopTime"
							valueFormat="YYYY-MM-DD 00:00:00" />
					</div>
					<div style="width: 18px;height: 18px;">
						<p style="width: 18px;height: 18px;background: #E8380D;color: #ffffff;border-radius: 50%;text-align:center;line-height: 18px;"
							@click="aloneCancleTop(item,index)">-</p>
					</div>
				</div>
				<div style="width: 100%;background-color: #E0E0E0;height: 1px;"></div>
				<div>
					<p style="margin: 0;color: #E8380D;padding: 10px 0px;" @click="addContentTop(index);">
						<b style="font-size:20px;margin-right:6px;padding: 0;text-align: center;padding-left: 20px;">+</b>
						置顶配置
					</p>
				</div>
			</div>
		</div>
		<div class="addOperation" style="display: flex;justify-content: end;align-items: center;margin-top: 2%;margin-bottom:20px">
			<a-button middle @click="cancleForm">取消</a-button>
			<a-button style="margin-left:30px" middle type="primary" danger @click="submitForm">提交</a-button>
		</div>
		<!-- 添加内容描述弹窗 -->
		<a-drawer
			v-model:visible="showPeopleDrawer"
			class="custom-class"
			:title="DrawerTitle"
			placement="right"
			width="1000"
		>
			<operationDecribe
				:showPeopleDrawer="showPeopleDrawer"
				:coverLength="coverLength"
				:coverWidth="coverWidth"
				:listIndexOrContent="listIndexOrContent"
				:formDataAllreadyName="formDataAllreadyName"
				@changeDrawer = "changeDrawer"
				@chooseFormData = "chooseFormData"
				v-if="drawerType === '3'"
			/>
		</a-drawer>
		<!-- 查看反显内容弹窗 -->
		<a-drawer
			v-model:visible="showDisplayContent"
			class="custom-class"
			title="反显内容"
			placement="right"
			width="1000"
		>
			<displayContentDesc
				:showDisplayContent="showDisplayContent"
				:labelList="labelList"
				:columnList="columnList"
				:displayContentList="displayContentList"
				@changeDisplayContent="changeDisplayContent"
				@addDisplayContent="addDisplayContent"
			/>
		</a-drawer>
		<!-- 置顶规则弹窗 -->
		<a-modal v-model:visible="contentTop" title="添加置顶" style="width:1000px" :row-key="(record:any) => record.reachId"
			:footer="null">
			<div style="display: flex;justify-content: start;align-items: center;">
				<p style="margin:0px 10px" >标题：</p>
				<a-input style="width:120px;border-radius: 6px;" @change="chooseTopTitle" v-model:value="chooseTopTitleValue"></a-input>
				<p style="margin:0px 10px">内容分类：</p>
				<a-select style="width:120px;border-radius: 6px;margin-right:10px" v-model:value="contentTypeTopModel">
					<a-select-option v-for="(items, index) in contentTypeTop" :key="index" :value="items.value" @click="chooseContentTypeTop(items.value)">
						{{ items.label }}
					</a-select-option>
				</a-select>
				<a-button style="border-radius: 6px" type="primary" danger @click="saveContentTop">保存</a-button>
			</div>
			<div class="drawer-Table">
				<a-table :columns="columnsTop" :data-source="topDataListSearchAll" :pagination="paginationTop" @change="changeProPage($event)">
					<template #contentType="{ text, record, index }">
						<span>{{ record.contentType === 't' ? '图文' : record.contentType === 'b' ? '海报' : record.contentType === 'pr' ? '产品' : record.contentType === 's' ? '话题' : record.contentType === 'v' ? '视频' : ''}}</span>
					</template>
					<template #chooseTop="{ text, record, index }">
						<a-button class="blue" @click="chooseTopList(record)" :style="text">置顶</a-button>
					</template>
				</a-table>
			</div>
		</a-modal>
	</div>
</template>
<script lang="ts" setup>
import { ref,reactive,onMounted } from 'vue'
import { operaTionApi } from '@/libs/api/index';
import { message, MessageArgsProps } from 'ant-design-vue';
import operationDecribe from './operationDecribe.vue'
import displayContentDesc from './testdisplayContentDesc.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { AxiosRequestHeaders } from 'axios';
import moment from 'moment';
//标签列表赋值
let labelList = ref<any>([])
//获取标签列表
async function getLabelList() {
	let params = {
		id: ''
	}
	await operaTionApi.getLabelQuery(params, {}).then((res:any) => {
		labelList.value = res.data
	})
}
//栏目列表数据
let columnList:any = ref([])
//获取栏目分类
async function getcolumnList() {
	let params = {
		id: ''
	}
	await operaTionApi.getClassIfication(params, {}).then((res) => {
		columnList.value = res.data
	})
}
onMounted(() => {
	getLabelList()
	getcolumnList()
})
//所属渠道v-model
let ditch = ref<string>('')
//渠道下拉框列表数据
const ditchList = [
	{
		label: '百度小程序',
		value: '1',
		id: '1'
	},
	{
		label: '微信小程序',
		value: '2',
		id: '2'
	},
	{
		label: '微信公众号',
		value: '3',
		id: '3'
	},
	{
		label: '抖音',
		value: '4',
		id: '4'
	},
	{
		label: '快手',
		value: '5',
		id: '5'
	},
	{
		label: 'APP',
		value: '6',
		id: '6'
	},
]
//内容分发名称
let operationName = ref<string>('')
//内容分发名称校验空格
function changeOperationName() {
	let pattern = /\s+/
	if (pattern.test(operationName.value)) {
		message.info('内容分发名称不能包含空格，请重新输入')
		operationName.value = operationName.value.replace(/\s+/g, '')
	}
}
//内容分发长度v-model
let coverLength = ref<string>('')
//内容分发宽度v-model
let coverWidth = ref<string>('')
//再次添加内容描述反显名称
let formDataAllreadyName = ref<string>('')
//添加内容表格表头
const columns = [
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
		slots: { customRender: 'contentPopulation' },
		align: 'center',
		width: '240',
	},
	{
		title: '操作',
		dataIndex: 'action',
		slots: { customRender: 'action' },
		align: 'center'
	},
];
//添加内容表格列表
let tableList = ref<any>([{
	content:{
		specificArticleList:[],
		specificArticleFormData:{},
		contentTypeList:[],
		contentFormData:[]
	},
	listIndex:Math.round(Math.random() * 100000000),
	name:'',
}])
//添加内容描述
function addTableList(){
	tableList.value.push({
		content:{
			specificArticleList:[],
			specificArticleFormData:{},
			contentTypeList:[],
			contentFormData:[]
		},
		name:'',
		listIndex:Math.round(Math.random() * 100000000)
	})
}
let listIndexOrContent = ref<number>()
//添加内容描述弹窗
function changeContentDescription(text:any,record:any,index:number){
	console.log(record,'record')
	if(coverLength.value === ''){
		message.info('请先添加内容分发封面长度')
		return
	} else if(coverWidth.value === ''){
		message.info('请先添加内容分发封面宽度')
		return
	} else {
		drawerType.value = '3'
		DrawerTitle.value = '内容描述'
		listIndexOrContent.value = record.listIndex
		formDataAllreadyName.value = ''
		showPeopleDrawer.value = true
	}
}
//反显内容抽屉v-model
let showDisplayContent = ref<boolean>(false)
let displayContentList = ref({})
//查看已添加内容描述-反显内容
function displayContentDescClick(text:any,record:any){
	console.log(record,'record')
	displayContentList.value = record
	console.log(displayContentList.value,'displayContentList')
	console.log(tableList.value,'tableList')
	showDisplayContent.value = true
}
//关闭反显内容
function changeDisplayContent(value:any){
	showDisplayContent.value = value
}
//反显内容内新增内容描述
function addDisplayContent(value:any){
	console.log(value,'value')
	tableList.value.forEach((res:any) => {
		if(res.listIndex === value.listIndex){
			formDataAllreadyName.value = res.name
		}
	})
	showDisplayContent.value = false
	showPeopleDrawer.value = true
}
//删除内容描述
function deleteTableList(record:any,index:number){
	tableList.value = tableList.value.filter((res:any) => {
		return res.listIndex !== record.listIndex
	})
}
//内容描述弹窗
let showPeopleDrawer = ref<boolean>(false)
//弹窗名称
let DrawerTitle = ref<string>('')
//表格分类
let drawerType = ref<string>('')
//关闭新增内容描述抽屉
function changeDrawer(value:boolean){
	showPeopleDrawer.value = value
}
//子组件传值
function chooseFormData(value:any){
	const newValue:any = JSON.parse(JSON.stringify(value))
	console.log(newValue,'newValue')
	const map = new Map()
	tableList.value.forEach((res:any,index:number) => {
		if(value.listIndex === res.listIndex){
			if(newValue.formData.resource === '1'){
				res.content.contentTypeList.push({
					dataList:newValue.dataList,
					value:newValue.listIndex
				})
				res.content.contentFormData.push({
					...newValue.formData,
					value:newValue.listIndex
				})
			} else {
				res.content.specificArticleList.push(
					...newValue.dataList
				)
				res.content.specificArticleList = res.content.specificArticleList.filter((key:any) => !map.has(key.contentId) && map.set(key.contentId, 1))
				res.content.specificArticleFormData = newValue.formData
			}
			res.listIndex = newValue.listIndex
			console.log(res.listIndex,'tableList.value[index].listIndex')
			res.name = newValue.name
		}
	})
	console.log(tableList.value,'tableList')
}
//多样性规则单选框v-model
let diversity = ref<string>('')
//多样性规则单选框列表
const diversityChooseList = [
	{
		label: '内容体裁',
		value: '3',
		id: '2'
	},
	{
		label: '内容标签',
		value: '1',
		id: '3'
	},
]
//置顶规则table-list
let topDataListSearchAll = ref<any>([])
//存储置顶规则获取接口后全部数据
let topDataListAll = ref<any>([])
//置顶规则弹窗内容分类v-model
let contentTypeTopModel = ref<string>('')
//table置顶规则表头数据
const columnsTop: any[] = [
	{
		title: '标题',
		dataIndex: 'titleName',
		align: 'center',
		width: '400px'
	},
	{
		title: '作者',
		dataIndex: 'crtUserName',
		align: 'center'
	},
	{
		title: '内容分类',
		dataIndex: 'contentType',
		slots: { customRender: 'contentType' },
		align: 'center'
	},
	{
		title: '操作',
		dataIndex: 'chooseTop',
		slots: { customRender: 'chooseTop' },
		align: 'center'
	},
]
//置顶规则分页
let paginationTop = reactive({
	current:1,
	pageSize:10,
	defaultCurrent: 1, // 默认当前页数
	defaultPageSize: 10, // 默认当前页显示数据的大小
	total:0, // 总数，必须先有
	showSizeChanger: true,
	showQuickJumper: true,
	pageSizeOptions: ["5", "10", "15", "20"],
	showTotal: (total:number) => `共 ${total} 条`, // 显示总
})
function changeProPage(value:any){
	console.log(value)
	paginationTop.current = value.current
	paginationTop.pageSize = value.pageSize
}
//添加置顶规则
async function addContentTop(event:any){
	contentTypeTopModel.value = 'all'
	//获取tableList全部已选中的内容
	let addTopList:any = []
	//存储已选中的内容的contentId调取接口
	let addTopListContent:any = []
	const tableListTop = tableList.value
	tableListTop.forEach((res:any) => {
		console.log(res.content,'content')
		res.content.contentTypeList.forEach((oes:any) => {
			addTopList.push(...oes.dataList)
		})
		addTopList.push(...res.content.specificArticleList)
	})
	console.log(addTopList,'addTopList')
	//过滤重复数据
	const newMap = new Map();
  addTopList = addTopList.filter((key:any) => !newMap.has(key.contentId) && newMap.set(key.contentId, 1));
	addTopList.forEach((res:any) => {
		addTopListContent.push(res.contentId)
	})
	//调取接口
	let params:any = {
		ids:addTopListContent
	}
	console.log(params,'params')
	const header: any = {
    request: (header: AxiosRequestHeaders) => {
      header.nowPage = 1;
      header.row4Page = 10;
    }
  }
	if(params.ids.length === 0){
		message.info('请先添加内容描述')
		return
	} else {
		await operaTionApi.getContentTopList(params,header).then((res:any) => {
			paginationTop.total = res.recordsTotal
			const headers: any = {
				request: (header: AxiosRequestHeaders) => {
					header.nowPage = 1;
					header.row4Page = paginationTop.total;
				}
			}
			operaTionApi.getContentTopList(params,headers).then((res:any) => {
				topDataListSearchAll.value = res.data
				topDataListAll.value = res.data
				paginationTop.total = res.recordsTotal
				contentTopList.value.forEach((item:any) => {
					topDataListAll.value.forEach((kes:any) => {
						if(item.contentId === kes.contentId){
							kes.addTop = true
							kes.chooseTop = {
								color:'blue'
							}
						}
					})
				})
			})
		})
	}
	if (contentTopList.value.length < 4) {
		contentTop.value = true
		contentTopRule.value = true
	}
}
let topDataListAllSure = ref<any>([])
//搜索内容类型
function chooseContentTypeTop(value:any){
	console.log(value,'value')
	if(value !== 'all'){
		topDataListSearchAll.value = topDataListAll.value.filter((item:any) => item.contentType === value)
	} else {
		topDataListSearchAll.value = topDataListAll.value
	}
}
//多样性列表初始化
let DiversityList = ref<any>([])
function initialization() {
	DiversityList.value = [
		{
			id: '1',
			contentNumber: '',
			diversityType:diversity.value,
			minimumDisplay: '',
			maximumDisplay: '',
			breakingNumberList:[],
		}
	]
}
//设置高度
let diversityRuleChoose = ref<any>({})
//提示语
let chooseRulePlaceholder = ref<string>('')
//选择多样性规则
function chooseDiversityRule(item:any,value:string){
	console.log('123')
	DiversityRule.value = true
	if (value === '3' && diversity.value !== '3') {
		diversityRuleChoose.value = {
			height: '100px'
		}
		diversity.value = value
		initialization()
		chooseRulePlaceholder.value = '图文'
	} else if (value === '1' && diversity.value !== '1') {
		diversityRuleChoose.value = {
			height: '100px'
		}
		diversity.value = value
		initialization()
		chooseRulePlaceholder.value = '请选择标签'
	}
}
//内容类型
const contentType: any[] = [
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
//多样性是否展示
let DiversityRule = ref<boolean>(false)
function changeRegionType(item:any){
	console.log(item.chooseContentType,'item')
	let regionList:any = []
	regionList.push(item.chooseContentType[item.chooseContentType.length -1])
	console.log(item,'item')
}
//配置规则 最多 最少
function changeMinMum(item:any){
	if(item.contentNumber === ''){
		message.info('请先输入每多少篇内容')
		item.minimumDisplay = ''
		item.maximumDisplay = ''
		return
	}
	if(parseInt(item.minimumDisplay) > parseInt(item.contentNumber)){
		message.info('最少展示不得大于每多少篇内容')
		item.minimumDisplay = ''
	}
	if(parseInt(item.maximumDisplay) > parseInt(item.contentNumber)){
		message.info('最少展示不得大于每多少篇内容')
		item.maximumDisplay = ''
	}
}
//删除多样性规则
function aloneCancleDiversity(item:any,index:number) {
	if (diversity.value === '2' || diversity.value === '3' || diversity.value === '1') {
		DiversityList.value.splice(index, 1)
		if (DiversityList.value.length === 0) {
			diversity.value = ''
		}
	}
}
//多样性规则弹出表单左下角增加按钮
function addDiversityRule() {
	if (diversity.value === '2') {
		DiversityList.value.length = 1
	} else {
		if (DiversityList.value.length < 4) {
			DiversityList.value.push({
				id: JSON.stringify(DiversityList.value.length + 1),
				contentNumber: '',
				diversityType:diversity.value,
				minimumDisplay: '',
				maximumDisplay: '',
				breakingNumberList:[],
			})
		}
	}
}
//置顶规则弹窗
let contentTop = ref<boolean>(false)
//根据标签名称查询标签
let chooseTopTitleValue = ref<string>('')
function chooseTopTitle(){
	topDataListSearchAll.value = (topDataListAll.value && topDataListAll.value.length) ? topDataListAll.value.filter((item:any) => {
    return item.titleName.indexOf(chooseTopTitleValue.value) !== -1 // 这里是根据name进行模糊查询
  }) : []  
  return topDataListSearchAll.value
}
//置顶规则弹窗下拉框
const contentTypeTop: any[] = [
	{
		label: '全部',
		value: 'all',
	},
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
//选中置顶规则
let chooseTopListSure = ref<any>([])
function chooseTopList(record:any){
	if(chooseTopListSure.value.length > 3){
		if(record.addTop === true){
			record.addTop = false
			record.chooseTop = {
				color:'black'
			}
		} else if(record.addTop === false){
			message.info('一次最多配置四条内容')
		}else if( record.addTop === undefined){
			message.info('一次最多配置四条内容')
		}
	} else {
		if(record.addTop === undefined){
			record.addTop = true
			record.chooseTop = {
				color:'blue'
			}
		} else if(record.addTop === false){
			record.addTop = true
			record.chooseTop = {
				color:'blue'
			}
		} else if (record.addTop === true){
			record.addTop = false
			record.chooseTop = {
				color:'black'
			}
		}
	}
	let chooseTopMakeSure:any = []
	topDataListAll.value.map((items:any) => {
		if(items.addTop === true){
			chooseTopMakeSure.push(items)
		}
	})
	chooseTopListSure.value = chooseTopMakeSure
}
//置顶规则列表数据
let contentTopList = ref<any>([])
//置顶规则列表
let contentTopRule = ref<any>(false)
//保存选中置顶
function saveContentTop(){
	contentTopList.value = chooseTopListSure.value.filter( (item:any) => item.addTop === true)
	contentTopList.value.map((item:any) => {
		if(item.chooseTopTime === undefined){
			item.chooseTopTime = ''
		}
	})
	console.log(contentTopList,'contentTopList')
	contentTop.value = false
}
//修改选中置顶规则
async function chooseContentTopIndex(){
	contentTypeTopModel.value = 'all'
	//获取tableList全部已选中的内容
	let addTopList:any = []
	//存储已选中的内容的contentId调取接口
	let addTopListContent:any = []
	const tableListTop = tableList.value
	tableListTop.forEach((res:any) => {
		console.log(res.content,'content')
		res.content.contentTypeList.forEach((oes:any) => {
			addTopList.push(...oes.dataList)
		})
		addTopList.push(...res.content.specificArticleList)
	})
	console.log(addTopList,'addTopList')
	//过滤重复数据
	const newMap = new Map();
  addTopList = addTopList.filter((key:any) => !newMap.has(key.contentId) && newMap.set(key.contentId, 1));
	addTopList.forEach((res:any) => {
		addTopListContent.push(res.contentId)
	})
	//调取接口
	let params:any = {
		ids:addTopListContent
	}
	console.log(params,'params')
	const header: any = {
    request: (header: AxiosRequestHeaders) => {
      header.nowPage = 1;
      header.row4Page = 10;
    }
  }
	if(params.ids.length === 0){
		message.info('请先添加内容描述')
		return
	} else {
		await operaTionApi.getContentTopList(params,header).then((res:any) => {
			paginationTop.total = res.recordsTotal
			const headers: any = {
				request: (header: AxiosRequestHeaders) => {
					header.nowPage = 1;
					header.row4Page = paginationTop.total;
				}
			}
			operaTionApi.getContentTopList(params,headers).then((res:any) => {
				topDataListSearchAll.value = res.data
				topDataListAll.value = res.data
				paginationTop.total = res.recordsTotal
				contentTopList.value.forEach((item:any) => {
					topDataListAll.value.forEach((kes:any) => {
						if(item.contentId === kes.contentId){
							kes.addTop = true
							kes.chooseTop = {
								color:'blue'
							}
						}
					})
				})
				contentTop.value = true
				contentTopRule.value = true
			})
		})
	}
}
//删除置顶规则-单一
function aloneCancleTop(item: { key: any; },index: number) {
	contentTopList.value.splice(index,1)
	topDataListAll.value.map((res:any) => {
		if(res.key === item.key){
			res.chooseTop = {
				color:'blue'
			},
			res.addTop = false
		}
	})
}
//失效时间限制
function disabledDate(current: any){
	return current && current < moment().subtract(1, 'days').endOf('day')
}
//取消新增
function cancleForm(){

}
//提交新增
function submitForm(){
	
}
</script>
<style lang="less" scoped>
.table-list-name-btn{
	width: 132px;
	height: 32px;
	background-color: rgba(36,67,188,0.08);
	border-radius: 16px;
	border:solid 0px;
	.table-list-name-btnFont{
		width: 98px;
		height: 18px;
		font-size: 14px;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: #2443BC;
		line-height: 18px
	}
}
.information-name{
  padding-top:1%;
  width: 64px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  padding-bottom:6px;
  border-bottom: solid 2px #E8380D;
}
p {
	padding: 0;
	margin: 0;
}

.partition {
	width: 100%;
	height: 1px;
	background: #D8D8D8;
	border-radius: 4px;
	margin-top: 10px;
	margin-bottom: 20px;
}

.scatter-rule {
	width: 100%;
	height: 50px;
	background: #F7F7F7;
	border-radius: 4px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.scatter-rule-add {
		display: flex;
		justify-content: start;
		align-items: center;
	}
}

.diversity-rule {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	font-weight: 500;
	color: #333333;
	margin-bottom: 6px;
}

.diversity-rule-choose {
	height: auto;
	background: #F7F7F7;
	border-radius: 4px;

	.diversity-rule-choose-input {
		padding: 10px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.diversity-rule-choose-input-content {
			display: flex;
			justify-content: start;
			align-items: center;
		}
	}
}

.img-del {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20px;
	width: 12px;
	height: 14px;
}

.ant-select-selector {
	border-radius: 10px !important;
	background-color: #d9d9d9 !important;
}
.ant-select:not(.ant-select-customize-input) .ant-select-selector{
	background-color: #d9d9d9 !important;
}
</style>