<template>
	<div>
		<!-- 新增编辑 -->
		<div v-if="addOrEditType !== '2'">
			<p class="information-name">基础信息</p>
			<a-row>
				<a-col :span="3" style="line-height: 32px;">
					<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
					所属渠道：</a-col>
				<a-col :span="20" style="display: flex;justify-content: start;align-items: center;">
					<a-radio-group v-model:value="ditch">
						<a-radio @click="changeDitchValue(item)" style="margin-right:20px" :value="item.enum_type" v-for="item in ditchList" :key="item.enum_id">{{ item.enum_name
						}}</a-radio>
					</a-radio-group>
				</a-col>
			</a-row>
			<a-row style="margin-top:1%">
				<a-col :span="3" style="line-height: 32px;">内容分发名称：</a-col>
				<a-col :span="15">
					<a-input v-model:value="operationName" @change="changeOperationName()" maxlength="60" :showCount="true"
						placeholder="请输入内容分发名称，支持中英文、数字、符号" style="width:594px;height:32px;border-radius: 4px;"></a-input>
				</a-col>
			</a-row>
			<!-- <a-row style="margin-top:1%">
				<a-col :span="3" style="line-height: 32px;">内容分发编码</a-col>
				<a-col :span="15">
					<a-select 
						v-model:value="reachCode"
						placeholder="请选择"
						style="width: 160px;">
						<a-select-option v-for="(item, index) in reachCodeList" :key="item.enum_id" :value="item.enum_code">
							{{ item.enum_name }}
						</a-select-option>
					</a-select>
				</a-col>
			</a-row> -->
			<a-row style="margin-top:1%">
				<a-col :span="3" style="line-height: 32px;">内容分发封面：</a-col>
				<a-col :span="5">
					<a-input-number
						maxlength="8"
						prefix="W"
						max="99999999"
						min="0"
						stringMode="true"
						placeholder="请输入，单位px"
						v-model:value="coverLength"
						style="height:32px;width: 165px;margin-right: 20px;"
					/>
				</a-col>
				<a-col :span="5">
					<a-input-number
						maxlength="8"
						prefix="H"
						max="99999999"
						min="0"
						stringMode="true"
						placeholder="请输入，单位px"
						v-model:value="coverWidth"
						style="height:32px;width: 165px;margin-right: 20px;"
					/>
				</a-col>
			</a-row>
			<a-button style="margin-top:1%;width:134px;height:32px;border-radius: 4px;" type="primary" @click="addTableList"
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
						<img src="./assets/edit.png" alt="" style="width:18px;height:18px"
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
						<img src="./assets/delete.png" alt="">
					</div>
				</template>
			</a-table>
			<p class="information-name">配置规则</p>
			<!-- 多样性规则单选框 -->
			<a-row style="display: flex;justify-content:start;align-items: center;margin-top:1%">
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
			<div v-if="contentTopRule" v-for="(item, index) in contentTopList" :key="item.contentId">
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
			<div class="addOperation" style="display: flex;justify-content: end;align-items: center;margin-top: 1%;margin-bottom:20px">
				<a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="cancleForm">取消</a-button>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="submitForm">提交</a-button>
			</div>
		</div>
		<!-- 查看详情 -->
		<div v-else>
			<a-row>
				<a-col :span="3" style="line-height: 32px;color: #9f9b9b;">
					所属渠道：</a-col>
				<a-col :span="20" style="display: flex;justify-content: start;align-items: center;">
					{{ reachDitchName }}
				</a-col>
			</a-row>
			<a-row style="margin-top:1%">
				<a-col :span="3" style="line-height: 32px;color: #9f9b9b;">内容分发名称：</a-col>
				<a-col :span="15" style="display: flex;justify-content: start;align-items: center;">
					{{ operationName }}
				</a-col>
			</a-row>
			<a-row style="margin-top:1%">
				<a-col :span="3" style="line-height: 32px;color: #9f9b9b;">内容分发封面：</a-col>
				<a-col :span="3" style="display: flex;justify-content: start;align-items: center;">
					W：{{ coverLength }}
				</a-col>
				<a-col :span="3" style="display: flex;justify-content: start;align-items: center;">
					H：{{ coverWidth }}
				</a-col>
			</a-row>
			<a-table :columns="columns" :data-source="tableList" bordered :pagination="false" style="margin-top:10px">
				<template #contentPopulation="{ text, record, index }">
					<div v-if="record.name === '' || record.name === undefined">
						<img src="./assets/edit.png" alt="" style="width:18px;height:18px"
						@click="changeContentDescription(text,record,index)">
					</div>
					<div v-else-if="record.name !== '' || record.name !== undefined" class="table-list-name">
						<a-button v-if="record.name !== undefined" @click="displayContentDescClick(text,record)" class="table-list-name-btn">
							<span style="color:#2443BC;font-size: 14px;">{{ record.name }}</span>
						</a-button>
					</div>
				</template>

				<template #action="{ text, record, index }">
					<a-button type="link" @click="displayContentDescClick(text,record)">详情</a-button>
				</template>
			</a-table>
			<p class="information-name">配置规则</p>
			<!-- 多样性规则 -->
			<div v-if="DiversityRule" v-for="(item, index) in DiversityList" :key="item.id" :index="index">
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
							<p class="numb">{{ item.contentNumber }}</p>
							<p>篇内容中，包含</p>
							<p class="numb" v-if="diversity === '3'">{{ item.chooseContentType === 't' ? '图文' : item.chooseContentType === 'b' ? '海报' : item.chooseContentType === 'pr' ? '产品' : item.chooseContentType === 's' ? '话题' : item.chooseContentType === 'v' ? '视频' : '' }}</p>
							<p class="numb" v-if="diversity === '1'">{{ item.chooseContentTypeName }}</p>
							<!-- <a-cascader
								v-if="diversity === '1'"
								v-model:value="item.chooseContentType"
								style="width: 160px;height: 32px;border-radius: 4px;border: solid 1px #E0E0E0;"
								:options="labelList"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								@change="changeRegionType(item)"
								placeholder="请选择内容标签" /> -->
							<p>，最少展示</p>
							<p class="numb">{{ item.minimumDisplay }}</p>
							<p>篇，最多展示</p>
							<p class="numb">{{ item.maximumDisplay }}</p>
							<p>篇</p>
						</div>
					</div>
				</div>
			</div>
			<!-- 置顶规则列表 -->
			<div v-if="contentTopRule" v-for="(item, index) in contentTopList" :key="item.contentId">
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
							<p class="numb">{{ item.titleName }}</p>
							<p>，失效时间:</p>
							<p class="numb">{{ item.chooseTopTime }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="addOperation" style="display: flex;justify-content: end;align-items: center;margin-top: 1%;margin-bottom:20px">
				<a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="cancleForm">返回</a-button>
			</div>
		</div>
		<!-- 添加内容描述弹窗 -->
		<a-drawer
			v-model:visible="showPeopleDrawer"
			class="custom-class"
			placement="right"
			width="1000"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_Drawer_title">
					<div style="display: flex;justify-content: center;align-items: center;">
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/addLeft.png" alt="">
						<span style="font-size: 16px;">{{ DrawerTitle }}</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="changeDrawer(false)">
						<img style="width: 15px;height: 10px;" src="../../assets/addBack.png" alt="">
					</a-button>
				</div>
			</template>
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
			placement="right"
			:closable="false"
			width="1000"
		>	
			<template #title>
				<div class="ScreeningCondition_Drawer_title">
					<div style="display: flex;justify-content: center;align-items: center;">
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/addLeft.png" alt="">
						<span style="font-size: 16px;">反显内容</span>
					</div>
					<!-- <a-button class="ScreeningCondition_title_btn">>></a-button> -->
				</div>
			</template>
			<operationContentDesc
				:addOrEditType="addOrEditType"
				:showDisplayContent="showDisplayContent"
				:coverLength="coverLength"
				:coverWidth="coverWidth"
				:labelList="labelList"
				:columnList="columnList"
				:displayContentList="displayContentList"
				@changeDisplayContent="changeDisplayContent"
				@addDisplayContent="addDisplayContent"
				@delTableContent="delTableContent"
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
						<a-radio-group v-model:value="record.addTop" @change="chooseTopListRadio(record.addTop,record)">
							<a-radio :value="true">是</a-radio>
							<a-radio :value="false">否</a-radio>
						</a-radio-group>
					</template>
				</a-table>
			</div>
		</a-modal>
	</div>
</template>
<script lang="ts" setup>
import { ref,reactive,onMounted,watchEffect } from 'vue'
import { operaTionApi } from '@/libs/api/index';
import { message, MessageArgsProps } from 'ant-design-vue';
import operationDecribe from './components/operationDecribe.vue'
import operationContentDesc from './components/operationContentDesc.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { AxiosRequestHeaders } from 'axios';
import moment from 'moment';
const props = defineProps(['addOrEditType','showAddOperation','editReachId'])
const emit = defineEmits(['cancleAdd'])
//标签列表赋值
let labelList = ref<any>([])
//栏目列表数据
let columnList:any = ref([])
//所属渠道v-model
let ditch = ref<string>('')
//所属渠道名称v-model
let reachDitchName = ref<string>('')
//渠道下拉框列表数据
let ditchList = ref<any>([])
//内容分发名称
let operationName = ref<string>('')
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
	contentDetailsId:'',
	name:'',
}])
let listIndexOrContent = ref<number>()
//反显内容抽屉v-model
let showDisplayContent = ref<boolean>(false)
let displayContentList = ref({})
//内容描述弹窗
let showPeopleDrawer = ref<boolean>(false)
//弹窗名称
let DrawerTitle = ref<string>('')
//表格分类
let drawerType = ref<string>('')
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
//多样性列表初始化
let DiversityList = ref<any>([])
//设置高度
let diversityRuleChoose = ref<any>({})
//提示语
let chooseRulePlaceholder = ref<string>('')
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
//置顶规则弹窗
let contentTop = ref<boolean>(false)
//根据标签名称查询标签
let chooseTopTitleValue = ref<string>('')
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
//置顶规则列表数据
let contentTopList = ref<any>([])
//置顶规则列表
let contentTopRule = ref<any>(false)
//删除内容描述
let delTableListContent = ref<any>([])
//删除配置规则
let rulesIds = ref<any>([])
//内容分发-字典列表
let reachCodeList = ref<any>([])
let reachCode = ref<any>('')
//获取标签列表
async function getLabelList() {
	let params = {
		id: ''
	}
	await operaTionApi.getLabelQuery(params, {}).then((res:any) => {
		labelList.value = res.data
	})
}
//获取栏目分类
async function getcolumnList() {
	let params = {
		id: ''
	}
	await operaTionApi.getClassIfication(params, {}).then((res) => {
		columnList.value = res.data
	})
}
//获取内容分发唯一编码
function getQueryDicCode(){
	let params = {
		enum_code:'REACH_PAGE_CODE'
	}
	operaTionApi.getQueryDicByCode(params,{}).then((res:any) => {
		ditchList.value = res.data
	})
}
function changeDitchValue(item:any){
	console.log(item,'item')
	console.log(ditch.value,'value')
}
watchEffect(() => {
  const showAddOperation = props.showAddOperation
  if(showAddOperation){
		getLabelList()
	  getcolumnList()
		getQueryDicCode()
		init()
    if(props.addOrEditType === '0'){
      //新增
    } else {
      //编辑
			console.log(props.editReachId,'editReachId')
			getEditInfomation(props.editReachId.reachId)
    }
  }
})
//编辑查找父级标签
function findParent(list:any, id:any, arr:any){
	for (let item of list) {
		if (item.id=== id) {
			arr.push(item.id) //要id就push item.id, 要对象就push item
			return true
		}
		if (item.children&& item.children.length > 0) {
			let isFind = findParent(item.children, id, arr)
			if (isFind) {
				arr.push(item.id) //要id就push item.id, 要对象就push item
				return true
			}
		}
	}
	return false
}
//查找树名称
function getTreeName(list:any,id:any){
	for (let i = 0; i < list.length; i++) {
    if(list[i].id===id){
      return list[i].name
    }else if(list[i].children && list[i].children.length>0){
      let nameList:any = getTreeName(list[i].children,id)
      if(nameList){
        return nameList
  		}  
    }
  }
}
//编辑-获取内容分发详情
async function getEditInfomation(reachId:string){
	let params = {
		reachId:reachId
	}
	await operaTionApi.getInfo(params,{}).then((res:any) => {
		console.log(res.defmap,'defmap')
		const defmap = res.defmap
		ditch.value = defmap.reachDitchCode
		reachDitchName.value = defmap.reachDitchName
		operationName.value = defmap.reachName
		coverLength.value = defmap.reachPictureLong
		coverWidth.value = defmap.reachPictureLong
		reachCode.value = defmap.reachCode
		if(defmap.contentDetailsVoList.length !== 0){
			tableList.value = []
			let contentDetailsIdList:any = {
				ids:[]
			}
			defmap.contentDetailsVoList.forEach((item:any) => {
				contentDetailsIdList.ids.push(item.contentDetailsId)
				tableList.value.push({
					content:{
						specificArticleList:[],
						specificArticleFormData:{},
						contentTypeList:[],
						contentFormData:[]
					},
					listIndex:Math.round(Math.random() * 100000000),
					contentDetailsId:item.contentDetailsId,
					name:item.contentDetails,
				})
			})
			if(contentDetailsIdList.ids.length !== 0){
				operaTionApi.getContentDetailIdList(contentDetailsIdList,{}).then((res:any) => {
					console.log(res,'res')
				})
			}
		}
		if(defmap.rulesVoList.length !== 0){
			contentTopList.value = []
			defmap.rulesVoList.forEach((item:any) => {
				rulesIds.value.push(item.rulesId)
				if(item.rulesType === '4'){
					contentTopList.value.push({
						chooseTopTime:item.expirationTime,
						reachId:item.reachId,
						rulesId:'',
						rulesType:item.rulesType,
						contentId:item.contentId,
						titleName:item.titleName
					})
				}
				if(item.rulesType === '3' || item.rulesType === '1'){
					let arr:any = []
					if(item.rulesType === '1'){
						findParent(labelList.value,item.includeTopic,arr)
					}
					diversity.value = item.rulesType
					DiversityRule.value = true
					DiversityList.value.push({
						rulesId:'',
						reachId:item.reachId,
						contentNumber:item.each,
						chooseContentType:item.rulesType === '3' ? item.includeTopic : arr.reverse(),
						chooseContentTypeName:item.rulesType === '1' ? getTreeName(labelList.value,item.includeTopic) : '',
						minimumDisplay:item.eachMin,
						maximumDisplay:item.eachMax,
						diversityType:item.rulesType,
						contentId:'',
						expirationTime:'',
						id:Math.round(Math.random() * 100000000)
					})
				}
			})
		}
		if(contentTopList.value.length !== 0){
			contentTopRule.value = true
		}
	})
}
//内容分发名称校验空格
function changeOperationName() {
	let pattern = /\s+/
	if (pattern.test(operationName.value)) {
		message.info('内容分发名称不能包含空格，请重新输入')
		operationName.value = operationName.value.replace(/\s+/g, '')
	}
}
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
		listIndex:Math.round(Math.random() * 100000000),
		contentDetailsId:'',
	})
	console.log(tableList.value,'tableList')
}
//添加内容描述弹窗
function changeContentDescription(text:any,record:any,index:number){
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
//查看已添加内容描述-反显内容
async function displayContentDescClick(text:any,record:any){
	console.log(record,'record')
	let contentTypeValue = Math.round(Math.random() * 100000000)
	if(record.contentDetailsId === '' || record.contentDetailsId === undefined ){
		displayContentList.value = record
		showDisplayContent.value = true
	} else {
		let params = {
			contentDetailsId:record.contentDetailsId,
			reachCoverHeight:coverLength.value,
			reachCoverWidth:coverWidth.value
		}
		await operaTionApi.getSelectReverse(params,{}).then((res:any) => {
			const data = res.data
			if(record.already === '' || record.already === undefined){
				if(delTableListContent.value.length === 0){
					delTableListContent.value.push(record.contentDetailsId)
				} else {
					let checkDelContent = false
					delTableListContent.value.forEach((kes:any) => {
						if(kes === record.contentDetailsId){
							checkDelContent = true
						}
					})
					if(!checkDelContent){
						delTableListContent.value.push(record.contentDetailsId)
					}
				}
				tableList.value.forEach((item:any) => {
					if(item.contentDetailsId === record.contentDetailsId){
						item.already = '1'
						item.content.contentFormData = []
						item.content.specificArticleList = []
						data.forEach((oes:any) => {
							if(oes.relationWayCode === '0'){
								item.content.contentFormData.push({
									resource:'1',
									type:oes.contetTypeCode.split(','),
									filterHeading:oes.titleName,
									maskTitle:oes.notInTitleName,
									includeTag:oes.label.split(),
									filterTag:oes.notInLabel.split(),
									ColumnClassification:oes.topicId.split(),
									shelfTime:oes.day,
									shelfTimeOther:oes.other,
									value:Math.round(Math.random() * 100000000)
								})
							} else {
								item.content.specificArticleList.push({
									resource:'0',
									coverFile:oes.pictureFile,
									titleName:oes.titleName,
									contentType:oes.contetTypeCode,
									contentStatus:oes.contentStatus,
									contentId:oes.contentId,
									publishTime:oes.publishTime,
									topicId:oes.topicId,
									topicName:oes.topicName
								})
							}
						})
					}
				})
			}
			displayContentList.value = record
			showDisplayContent.value = true
		})
		console.log(Object.values(delTableListContent.value),'delTableListContent')
	}	
}
//关闭反显内容
function changeDisplayContent(value:any){
	showDisplayContent.value = value
}
//反显内容内新增内容描述
function addDisplayContent(value:any){
	console.log(value,'value')
	tableList.value.forEach((res:any) => {
		console.log(res,'res')
		if(res.listIndex === value.listIndex){
			console.log(456,'456')
			formDataAllreadyName.value = res.name
      listIndexOrContent.value = res.listIndex
		}
	})
	drawerType.value = '3'
	DrawerTitle.value = '内容描述'
	showDisplayContent.value = false
	showPeopleDrawer.value = true
}
//反显内容删除同步
function delTableContent(record:any,listIndex:any){
	tableList.value.forEach((res:any) => {
		if(res.listIndex === listIndex){
			if(record.resourceName === '具体文章'){
				res.content.specificArticleList = res.content.specificArticleList.filter((oes:any) => {
					return oes.contentId !== record.contentId
				})
			} else {
				res.content.contentFormData = res.content.contentFormData.filter((oes:any) => {
					return oes.value !== record.value
				})
				res.content.contentTypeList = res.content.contentTypeList.filter((oes:any) => {
					return oes.value !== record.value
				})
			}
		}
	})
}
//删除内容描述
function deleteTableList(record:any,index:number){
	tableList.value = tableList.value.filter((res:any) => {
		return res.listIndex !== record.listIndex
	})
	if(record.contentDetailsId !== '' || record.contentDetailsId !== undefined){
		let checkDelContent = false
		delTableListContent.value.forEach((res:any) => {
			if(res === record.contentDetailsId){
				checkDelContent = true
			}
		})
		if(!checkDelContent){
			delTableListContent.value.push(record.contentDetailsId)
		}
	}
}
//关闭新增内容描述抽屉
function changeDrawer(value:boolean){
	showPeopleDrawer.value = value
}
//子组件传值
function chooseFormData(value:any){
	console.log(value,'value')
	const newValue:any = JSON.parse(JSON.stringify(value))
	const map = new Map()
	let contentTypeValue = Math.round(Math.random() * 100000000)
	tableList.value.forEach((res:any,index:number) => {
		if(value.listIndex === res.listIndex){
			if(newValue.formData.resource === '1'){
				res.content.contentTypeList.push({
					dataList:newValue.dataList,
					value:contentTypeValue
				})
				res.content.contentFormData.push({
					...newValue.formData,
					value:contentTypeValue
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
function changeProPage(value:any){
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
//搜索内容类型
function chooseContentTypeTop(value:any){
	console.log(value,'value')
	if(value !== 'all'){
		topDataListSearchAll.value = topDataListAll.value.filter((item:any) => item.contentType === value)
	} else {
		topDataListSearchAll.value = topDataListAll.value
	}
}
function initialization() {
	DiversityList.value = [
		{
			id: Math.round(Math.random() * 100000000),
			contentNumber: '',
			diversityType:diversity.value,
			minimumDisplay: '',
			maximumDisplay: '',
			breakingNumberList:[],
		}
	]
}
//选择多样性规则
function chooseDiversityRule(item:any,value:string){
	DiversityRule.value = true
	if(props.addOrEditType !== '2'){
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
}
function changeRegionType(item:any){
	console.log(item,'item')
	let regionList:any = []
	regionList.push(item.chooseContentType[item.chooseContentType.length -1])
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
				id: Math.round(Math.random() * 100000000),
				contentNumber: '',
				diversityType:diversity.value,
				minimumDisplay: '',
				maximumDisplay: '',
				breakingNumberList:[],
			})
		}
	}
}
function chooseTopTitle(){
	topDataListSearchAll.value = (topDataListAll.value && topDataListAll.value.length) ? topDataListAll.value.filter((item:any) => {
    return item.titleName.indexOf(chooseTopTitleValue.value) !== -1 // 这里是根据name进行模糊查询
  }) : []  
  return topDataListSearchAll.value
}
function chooseTopListRadio(addTop:any,record:any){
	if(chooseTopListSure.value.length > 3){
		if(record.addTop === true){
			record.addTop = undefined
			message.info('一次最多配置四条内容')
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
//保存选中置顶
function saveContentTop(){
	contentTopList.value = chooseTopListSure.value.filter( (item:any) => item.addTop === true)
	contentTopList.value.map((item:any) => {
		if(item.chooseTopTime === undefined){
			item.chooseTopTime = ''
		}
	})
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
//重置数据
function init(){
  ditch.value = ''
  operationName.value = ''
  coverLength.value = ''
  coverWidth.value = ''
  tableList.value = [
    {
      content:{
        specificArticleList:[],
        specificArticleFormData:{},
        contentTypeList:[],
        contentFormData:[]
      },
      listIndex:Math.round(Math.random() * 100000000),
      name:'',
    }
  ]
  topDataListSearchAll.value = []
  topDataListAll.value = []
  chooseTopListSure.value = []
  contentTopList.value = []
	delTableListContent.value = []
	diversity.value = ''
	DiversityList.value = [],
	DiversityRule.value = false,
	rulesIds.value = [],
	reachCode.value = ''
}
//取消新增
function cancleForm(){
  init()
  emit('cancleAdd',false,'1')
}
//提交新增
function submitForm(){
	console.log(reachCode.value,'reachCode')
  let submitAdd = true
  let DiversityListType = ''
  if(ditch.value === ''){
    submitAdd = false
    message.error('请选择渠道')
    return
  }
  if(operationName.value === ''){
    submitAdd = false
    message.error('请输入名称')
		return
  }
  if(coverLength.value === ''){
    submitAdd = false
    message.error('请输入内容分发长度')
    return
  }
  if(coverWidth.value === ''){
    submitAdd = false
    message.error('请输入内容分发宽度')
    return
  }
  if(tableList.value.length !== 0){
    tableList.value.map((item:any) => {
      if(item.name === ''){
        submitAdd = false
      }
    })
    if(!submitAdd){
      message.error('请添加内容描述')
      return
    }
  }
  if(DiversityList.value.length !== 0){
    DiversityList.value.map((item:any) => {
      if(item.contentNumber === ''){
        submitAdd = false
        DiversityListType = '1'
      } else if(item.chooseContentType === '' || item.chooseContentType === undefined){
        if(item.diversityType === '2'){
          submitAdd = false
          DiversityListType = '2'
        } else if(item.diversityType === '3'){
          submitAdd = false
          DiversityListType = '3'
        } else if(item.diversityType === '1'){
          submitAdd = false
          DiversityListType = '4'
        }
      } else if(item.minimumDisplay === undefined || item.minimumDisplay === ''){
        submitAdd = false
        DiversityListType = '5'
				return
      } else if(item.maximumDisplay === undefined || item.maximumDisplay === ''){
        submitAdd = false
        DiversityListType = '6'
      }
    })
    console.log(DiversityList.value,'DiversityList')
    if(DiversityListType === '1' && !submitAdd){
      message.error('请输入每几篇内容')
			return
    }
    if(DiversityListType === '2' && !submitAdd){
      message.error('请选择作者')
			return
    }
    if(DiversityListType === '3' && !submitAdd){
      message.error('请选择体裁内容类型')
			return
    }
    if(DiversityListType === '4' && !submitAdd){
      message.error('请选择标签')
			return
    }
    if(DiversityListType === '5' && !submitAdd){
      message.error('请选择最少展示多少篇')
			return
    }
    if(DiversityListType === '6' && !submitAdd){
      message.error('请选择最多展示多少篇')
			return
    }
  }
  if(contentTopList.value.length !== 0){
    contentTopList.value.map((item:any) => {
      if(item.chooseTopTime === ''){
        submitAdd = false
      }
    })
    if(!submitAdd){
      message.error('请添加置顶规则失效时间')
      return
    }
  }
  if(DiversityListType === '' && submitAdd){
    submitFormAdd()
  }
}
//提交新增接口
async function submitFormAdd(){
  let contentDetailsList:any = []
  tableList.value.forEach((item:any) => {
		if(item.content.contentFormData.length !== 0 || item.content.specificArticleList.length !== 0){
			contentDetailsList.push({
				contentDetails:item.name,
				listIndex:item.listIndex,
				contentDetailsList:[],
				contentDetailsId:''
			})
		}
  })
  tableList.value.forEach((item:any) => {
    item.content.contentFormData.forEach((res:any) => {
			contentDetailsList.forEach((con:any) => {
				con.contentDetailsList.push({
					relationWayCode:res.resource === '1' ? '0' : '1',
          notInLabel:res.filterTag === undefined ? '' : typeof res.filterTag === 'string' ? res.filterTag : res.filterTag.toString(),
          titleName:res.filterHeading,//标题名称
          notInTitleName:res.maskTitle,//屏蔽标题
          topicId:res.ColumnClassification === undefined ? '' : typeof res.ColumnClassification === 'string' ? res.ColumnClassification : res.ColumnClassification.toString(),//栏目
          day:res.shelfTime === '6' ? '' : res.shelfTime,
          label:res.includeTag === undefined ? '' : typeof res.includeTag === 'string' ? res.includeTag : res.includeTag.toString(),
          contetTypeCode:res.type === undefined ? '' : typeof res.type === 'string' ? res.type : res.type.toString(),
				})
			})
    })
  })
  tableList.value.forEach((item:any) => {
    console.log(item,'item')
    contentDetailsList.forEach((con:any) => {
      console.log(con,'con')
      if(item.listIndex === con.listIndex){
        item.content.specificArticleList.forEach((res:any) => {
          const specificArticleFormData = item.content.specificArticleFormData
          con.contentDetailsList.push({
            relationWayCode:specificArticleFormData.resource === '1' ? '0' : '1',
            notInLabel:specificArticleFormData.filterTag === undefined ? '' : typeof specificArticleFormData.filterTag === 'string' ? specificArticleFormData.filterTag : specificArticleFormData.filterTag.toString(),
            titleName:specificArticleFormData.filterHeading,//标题名称
            notInTitleName:specificArticleFormData.maskTitle,//屏蔽标题
            topicId:specificArticleFormData.ColumnClassification === undefined ? '' : typeof specificArticleFormData.ColumnClassification === 'string' ? specificArticleFormData.ColumnClassification : specificArticleFormData.ColumnClassification.toString(),//栏目
            day:specificArticleFormData.shelfTime === '6' || specificArticleFormData.shelfTime === undefined ? '' : specificArticleFormData.shelfTime,
            label:specificArticleFormData.includeTag === undefined ? '' : typeof specificArticleFormData.includeTag === 'string' ? specificArticleFormData.includeTag : specificArticleFormData.includeTag.toString(),
            contetTypeCode:specificArticleFormData.type === undefined ? '' : typeof specificArticleFormData.type === 'string' ? specificArticleFormData.type : specificArticleFormData.type.toString(),
            contentId:res.contentId,
            listingTime:res.publishTime
          })
        })
      }
    })
  })
  //多样性规则和置顶规则列表
  let rulesList:any = []
  //添加的多样性规则和置顶规则列表赋值
  if(DiversityList.value.length !== 0 || contentTopList.value.length !== 0){
    //多样性规则
    if(DiversityList.value.length !== 0){
      DiversityList.value.map((item:any) => {
        rulesList.push({
					rulesId:'',
					reachId:item.reachId,
					each:item.contentNumber,
					includeTopic:item.diversityType === '1' ? item.chooseContentType[item.chooseContentType.length -1] : item.diversityType === '3' ? item.chooseContentType : '',
					eachMin:item.minimumDisplay,
					eachMax:item.maximumDisplay,
					rulesType:item.diversityType,
					contentId:'',
					expirationTime:'',
				})
      })
    }
    //置顶规则
		console.log(contentTopList.value,'contentTopList')
    if(contentTopList.value.length !== 0){
      contentTopList.value.map((item:any) => {
				rulesList.push({
					rulesId:'',
					reachId:item.reachId === undefined ? '' : item.reachId,
					each:'',
					includeTopic:'',
					eachMin:'',
					eachMax:'',
					rulesType:'4',
					contentId:item.contentId,
					expirationTime:item.chooseTopTime
				})
			})
    }
  }
	contentDetailsList = contentDetailsList.map((item:any) => {
		return {
			contentDetails:item.contentDetails,
			contentDetailsId:item.contentDetailsId,
			contentInfoList:item.contentDetailsList
		}
	})
  let params = {
    reachId:props.editReachId.reachId === '' || props.editReachId.reachId === undefined ? '' : props.editReachId.reachId,
		reachDitchCode: ditch.value,
		reachName:operationName.value,
		reachPictureLong: parseInt(coverLength.value),
		reachPictureWide: parseInt(coverWidth.value),
		contentDetailsList:contentDetailsList,
		detailsIds:Object.values(delTableListContent.value),
		rulesList:rulesList,
		rulesIds:rulesIds.value,
		reachStatus:props.editReachId.reachStatus === '' || props.editReachId.reachStatus === undefined ? '' : props.editReachId.reachStatus
  }
  await operaTionApi.pushAddOperationPosition(params,{}).then((res:any) => {
		if(res.successflag === false){
			message.info(`${res.msgList[0].msgRemark}`)
		} else {
			if(props.addOrEditType === '0'){
				message.info('新增成功')
			} else {
				message.info('编辑成功')
			}
			emit('cancleAdd',false,'0')
			init()
		}
  })
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
  // padding-top:1%;
  width: 64px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  padding-bottom:6px;
  border-bottom: solid 2px red;
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
.ScreeningCondition_Drawer_title{
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
.numb {
	margin: 0px 4px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 600;
  color: #E8380D;
}
</style>