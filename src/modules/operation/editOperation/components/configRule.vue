<!--
    / * @FileDescription: 配置规则
* @Author: Hjb
* @Date: 2023-03-28
* @LastEditors: 
* @LastEditTime:  -->
<template>
	<div>
		<!-- 多样性规则单选框 -->
		<a-row style="display: flex;justify-content:start;align-items: center;margin-top:2%">
			<a-col :span="3">多样性规则：</a-col>
			<a-col :span="21" style="display: flex;justify-content: start;align-items: center;">
				<p style="margin: 0;color: #E8380D;" @click="addContentTop($event)">
					<b style="font-size:20px;margin-right:6px;padding: 0;text-align: center;">+</b>
					内容置顶
				</p>
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
							:options="checkTagList"
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
		<!-- 置顶规则弹窗 -->
		<a-modal v-model:visible="contentTop" title="添加置顶" style="width:1000px" :row-key="(record:any) => record.reachId"
			:footer="null">
			<div style="display: flex;justify-content: start;align-items: center;">
				<p style="margin:0px 10px">标题：</p>
				<a-input style="width:120px;border-radius: 6px;"></a-input>
				<p style="margin:0px 10px">内容分类：</p>
				<a-select style="width:120px;border-radius: 6px;margin-right:10px" v-model:value="contentTypeTopModel">
					<a-select-option v-for="(items, index) in contentTypeTop" :key="index" :value="items.value" @click="chooseContentTypeTop(items.label)">
						{{ items.label }}
					</a-select-option>
				</a-select>
				<a-button style="border-radius: 6px" type="primary" danger @click="saveContentTop">保存</a-button>
			</div>
			<div class="drawer-Table">
				<a-table :columns="columns" :data-source="topDataListAll">
					<template #chooseTop="{ text, record, index }">
						<a-button class="blue" @click="chooseTopList(record)" :style="text">置顶</a-button>
					</template>
				</a-table>
			</div>
		</a-modal>
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
	</div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { computed } from 'vue'
import { operaTionApi } from '@/libs/api/index';
import store from '@/modules/operation/store';
import { message } from 'ant-design-vue';
import { debug } from 'console';
import { forEach } from 'lodash';

@Options({
	components: {
	}
})

export default class addoperation extends Vue {
	//接收vuex
	public states: any = store.state
	public dataListAll:any = computed(() => {
		const list = this.states.contentList
		return list.chooseContentListAll
	})
	public tableContentList: any = computed(() => {
		const list = this.states.contentList
		return list.tableContentList
	})
	// public operatorList: any = computed(() => {
	// 	const map = new Map()
	// 	const filterList = this.dataListAll.filter((key: { operator: any; }) => !map.has(key.operator) && map.set(key.operator, 1))
	// 	const filterNameList = filterList.map((item: { operator: any; }, index: number) => ({ label: item.operator, code: JSON.stringify(index + 1), value: item.operator }))
	// 	return filterNameList
	// })
	public checkTagList:any[] = []
	//获取标签列表
	public async getLabelList(){
		let params = {
			id:''
		}
		await operaTionApi.getLabelQuery(params,{}).then((res) => {
			if(res.flag === 'success'){
				this.checkTagList = res.data
				store.commit('changeIncludeTagList',res.data)
			} else if(res.flag === 'fail'){
				res.msg.forEach(jes => {
					message.info(jes)
				})
			}
		}).catch(() => {
		})
	}
	//打散规则下拉框输入框搜索校验
	public filterOption(input: string, option: { value: string; }) {
		return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
	}
	//多样性规则单选框v-model
	public diversity: string = ''
	//多样性规则单选框列表
	public diversityChooseList = [
		{
			label: '内容载体',
			value: '3',
			id: '2'
		},
		{
			label: '内容标签',
			value: '1',
			id: '3'
		},
	]
	//多样性规则默认不显示
	public DiversityRule: boolean = false

	//设置高度
	public diversityRuleChoose = {}

	//内容类型
	public contentType: any[] = [
		{
			label: '全部',
			value: 'all'
		},
		{
			label: '文本',
			value: 't',
		},
		{
			label: '图文',
			value: 'p'
		},
		{
			label: '横板视频',
			value: 'hv'
		},
		{
			label: '竖版视频',
			value: 'vv'
		},
		{
			label: '海报',
			value: 'b'
		}
	]

	//
	public contentTypeForm: any[] = []
	//提示语
	public chooseRulePlaceholder: string = ''
	//初始化
	public DiversityList:any = []
	public initialization() {
		this.DiversityList = [
			{
				id: '1',
				contentNumber: '',
				diversityType:this.diversity,
				minimumDisplay: '',
				maximumDisplay: '',
				breakingNumberList:[],
			}
		]
	}
	public breakingMaxNumber:string = '可输入数量0'
	//选择多样性规则
	public chooseDiversityRule(item:any,value:any) {
		this.DiversityRule = true
		this.DiversityList.forEach((res:any) => {
			if(res.rulesId !== undefined || res.rulesId !== ''){
				this.rulesIds.push(res.rulesId)
			}
		})
		 
		 
		if (value === '3' && this.diversity !== '3') {
			this.diversityRuleChoose = {
				height: '100px'
			}
			this.diversity = value
			this.initialization()
			this.chooseRulePlaceholder = '图文'
		} else if (value === '1' && this.diversity !== '1') {
			this.diversityRuleChoose = {
				height: '100px'
			}
			this.diversity = value
			this.initialization()
			this.chooseRulePlaceholder = '请选择标签'
		}
	}
	//多样性规则--请录入x篇内容
	//多样性规则--选择作者--图文--选择标签-下拉框
	//多样性规则--最少展示多少篇
	//多样性规则列表内容
	//多样性规则弹出表单左下角增加按钮
	public addDiversityRule() {
		if (this.diversity === '2') {
			this.DiversityList.length = 1
		} else {
			if (this.DiversityList.length < 4) {
				this.DiversityList.push({
					id: JSON.stringify(this.DiversityList.length + 1),
					contentNumber: '',
					diversityType:this.diversity,
					minimumDisplay: '',
					maximumDisplay: '',
					breakingNumberList:[],
				})
			}
		}
	}
	//配置规则 最多 最少
	public changeMinMum(item:any){
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
	public changeRegionType(item:any){
		let regionList:any = []
		item.chooseContentType.forEach((res:any) => {
			if(res[2] !== undefined){
				regionList.push(res[2])
			} else if(res[1] !== undefined && res[2] === undefined){
				regionList.push(res[1])
			} else {
				regionList.push(res[0])
			}
		})
		//  
		// item.contentNumber = regionList
		 
	}
	//多样性规则/置顶规则-弹出表单指定删除
	public rulesIds:any[] = []
	public aloneCancleDiversity(item:any,index:number) {
		if (this.diversity === '2' || this.diversity === '3' || this.diversity === '1') {
			this.DiversityList.splice(index, 1)
			if (this.DiversityList.length === 0) {
				this.diversity = ''
			}
			if(item.rulesId !== undefined || item.rulesId !== ''){
				this.rulesIds.push(item.rulesId)
			}
		}
	}
	//置顶规则弹窗
	public contentTop: boolean = false
	//置顶规则列表
	public contentTopRule = false
	//
	public topDataListAll:any[] = []
	//添加内容置顶
	public addContentTop(index:any) {
		let test = []
		this.contentTypeTopModel = 'all'
		const res = new Map();
    test = this.dataListAll.filter((arr: { key: any; }) => !res.has(arr.key) && res.set(arr.key, 1));
		this.topDataListAll = test
		if (this.contentTopList.length < 4) {
			this.contentTop = true
			this.contentTopRule = true
		}
	}
	//table置顶规则表头数据
	public columns: any[] = [
		{
			title: 'ID',
			align: 'center',
			dataIndex: 'contentId',
			width: '150px'
		},
		{
			title: '标题',
			dataIndex: 'titleName',
			align: 'start',
			width: '400px'
		},
		{
			title: '作者',
			dataIndex: 'operator',
			align: 'center'
		},
		{
			title: '内容分类',
			dataIndex: 'contentClassification',
			align: 'center'
		},
		{
			title: '操作',
			dataIndex: 'chooseTop',
			slots: { customRender: 'chooseTop' },
			align: 'center'
		},
	]
	public chooseTopList(record: any) {
		let test:any = []
		this.dataListAll.map((items:any) => {
			if(items.addTop === true){
				test.push(items)
			}
		})
		if(record.addTop === true){
			record.chooseTop = {
					color: 'blue'
			}
			record.addTop = false
		} else if(test.length > 3){
			message.info('一次最多配置四条内容')
		} else if(record.addTop === false){
			record.chooseTop = {
				color: 'black'
			}
			record.addTop = true
		}
	}
	//保存置顶规则
	public saveContentTop() {
		this.contentTopList = this.dataListAll.filter( (item:any) => item.addTop === true)
		this.contentTopList.map((item:any) => {
			if(item.chooseTopTime === undefined){
				item.chooseTopTime = ''
			}
		})
		this.contentTop = false
	}
	//修改置顶规则
	public chooseContentTopIndex() {
		this.contentTop = true
	}
	//删除置顶规则-单一
	public aloneCancleTop(item: { key: any; },index: number) {
		this.contentTopList.splice(index,1)
		this.topDataListAll.map(res => {
			if(res.key === item.key){
				res.chooseTop = {
					color:'blue'
				},
				res.addTop = false
			}
		})
	}
	//置顶规则弹窗table数据
	public contentTopList: any = []
	//置顶规则弹窗内容分类v-model
	public contentTypeTopModel:string = ''
	public contentTypeTop: any[] = [
		{
			label: '全部',
			value: 'all',
		},
		{
			label: '文本',
			value: 't',
		},
		{
			label: '图文',
			value: 'p'
		},
		{
			label: '横板视频',
			value: 'hv'
		},
		{
			label: '竖版视频',
			value: 'vv'
		},
		{
			label: '海报',
			value: 'b'
		}
	]
	//搜索内容类型
	public chooseContentTypeTop(value:any){
		if(value !== '全部'){
			this.topDataListAll = this.dataListAll.filter((item:any) => item.contentClassification === value)
		} else {
			this.topDataListAll = this.dataListAll
		}
	}
	//取消新增、编辑
	public cancleForm(){
		this.topDataListAll = []
		store.commit('changeTableContentList',[])
		this.$router.go(-1)
	}
	//提交新增校验
	public submitForm(){
		let submitAdd:boolean = true
		if(this.DiversityList.length !== 0){
			this.DiversityList.map((item:any )=> {
				if(item.contentNumber === ''){
					submitAdd = false
					message.error('请输入每几篇内容')
					return
				} else if(item.chooseContentType === ''){
					if(item.diversityType === '2'){
						submitAdd = false
						message.error('请选择作者')
						return
					} else if(item.diversityType === '3'){
						message.error('请选择载体内容类型')
						submitAdd = false
						return
					} else if(item.diversityType === '1'){
						message.error('请选择标签')
						submitAdd = false
						return
					}
				} else if(item.minimumDisplay === undefined){
					message.error('请选择最少展示多少篇')
					submitAdd = false
					return
				} else if(item.maximumDisplay === undefined){
					message.error('请选择最少展示多少篇')
					submitAdd = false
					return
				}
			})
		}
		if(this.contentTopList.length !== 0){
			this.contentTopList.map((item:any) => {
				if(item.chooseTopTime === ''){
					submitAdd = false
					message.error('请添加置顶规则失效时间')
					return
				}
			})
		}
		if(submitAdd === true){
			this.submitFormAdd()
		}
	}
	//提交新增接口
	public async submitFormAdd(){
		let contentDetailsList:any = []
		let rulesList:any = []
		let contentDescriptionList:any = []
		let displayContentList:any = []
		let state = this.states.contentList
		let editState = this.states.editOperation
		state.tableContentList.map((item:any) => {
			 
			displayContentList.push(item.displayContent)
			item.displayContent.forEach((res:any) => {
				contentDescriptionList.push({
					key:res.key,
					resource:res.formData.resource === '1' ? '0' : '1',
					notInLabel:JSON.stringify(res.formData.filterTag),//屏蔽标签
					titleName:res.formData.filterHeading,//标题名称
					notInTitleName:res.formData.maskTitle,//屏蔽标题
					topicId:[],//栏目
					day:res.formData.shelfTime === '6' ? '' : res.formData.shelfTime,
					name: (res.contentDetailsId !== undefined && res.dataList.length === 0) ? '' : (editState.editTypeValue !== '0') ? item.content.formData.name : item.content.formData.name,
					contentDetailsId:(res.contentDetailsId !== undefined && res.dataList.length !== 0) ? res.contentDetailsId : '',
					label:JSON.stringify(res.formData.includeTag),
					contetTypeCode:JSON.stringify(res.formData.type),
					contentId:res.dataList.map((oes:any) => (oes.contentId))
				})
			})
		})
		contentDetailsList = displayContentList.map((item:any) => ({contentDetails:'',contentInfoList:[]}))
		contentDetailsList.map((res: {contentInfoList:any[],contentDetails:string,contentDetailsId:string },index: number) => {
			contentDescriptionList.map((oes:any) => {
				if(JSON.stringify(index+1) === oes.key){
					res.contentDetailsId = oes.contentDetailsId
					res.contentDetails = oes.name
					oes.contentId.map((kes:any) => {
						res.contentInfoList.push({
							contentId:kes,
							relationWayCode:oes.resource,
							contetTypeCode:oes.contetTypeCode,
							label:oes.label,
							notInLabel:oes.notInLabel,
							titleName:oes.titleName,
							notInTitleName:oes.notInTitleName,
							topicId:oes.topicId,
							day:oes.day,
						})
					})
				}
			})
		})
		//多样性规则
		let regionList:any = []
		if(this.DiversityList.length !== 0){
			this.DiversityList.map((item:any) => {
				rulesList.push({
					rulesId:item.rulesId,
					reachId:item.reachId,
					each:item.contentNumber,
					includeTopic:item.diversityType === '1' && item.chooseContentType[2] !== undefined 
											? item.chooseContentType[2] 
											: item.diversityType === '1' && (item.chooseContentType[1] !== undefined && item.chooseContentType[2] === undefined) 
											? item.chooseContentType[1] : item.diversityType === '1' && item.chooseContentType[1] === undefined 
											? item.chooseContentType[0] : item.chooseContentType,
					eachMin:item.minimumDisplay,
					eachMax:item.maximumDisplay,
					rulesType:item.diversityType,
					contentId:'',
					expirationTime:'',
				})
			})
		}
		//置顶规则
		if(this.contentTopList.length !== 0){
			this.contentTopList.map((item:any) => {
				rulesList.push({
					rulesId:item.rulesId,
					reachId:item.reachId,
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
		let params = {
			reachId:editState.editTypeValue === '0' ? '' : editState.chooseEditInfo.reachId,
			reachDitchCode: state.ditch,
			reachName:state.operationName,
			reachPictureLong: parseInt(state.coverLength),
			reachPictureWide: parseInt(state.coverWidth),
			contentDetailsList:contentDetailsList,
			// detailsIds:[],
			detailsIds:(editState.editTypeValue === '0' && state.contentDetailsIds.length !== 0) ? [] : state.contentDetailsIds.map((res:any) => {return res}),
			rulesList:rulesList,
			rulesIds:editState.editTypeValue === '0' ? [] : this.rulesIds
		}
		 
		//  
		await
		operaTionApi.pushAddOperationPosition(params,{}).then((res:any) => {
			if(res.successflag === true){
				res.msgList.forEach((jes:any) => {
					message.success(jes.msgRemark)
					this.topDataListAll = []
					this.$router.go(-1)
				})
			} else {
				res.msgList.forEach((jes:any) => {
					message.warn(jes.msgRemark)
				})
			}
		}).catch(() => {
		})
	}


	public editTypeValue = '0'
	public created(): void {
		this.getLabelList()
		if(this.states.editOperation.editTypeValue === '1'){
			const contentDetailsIdList = this.states.editOperation.contentDetailsIdList
			if(contentDetailsIdList.length !== 0){
				let contentIdsList = []
					operaTionApi.getContentDetailIdList(contentDetailsIdList,{}).then((res:any) => {
						contentIdsList = res.defmap.elementData
				})
			}
		}
  }
	//编辑
	public editTest:any = computed(() =>{
		this.editTypeValue = this.states.editOperation.editTypeValue
		const chooseEditInfo = this.states.editOperation.chooseEditInfo
		if(this.editTypeValue === '1'){
			if(chooseEditInfo.rulesVoList!==undefined){
				chooseEditInfo.rulesVoList.map((res:any,index:number) => {
					if(res.rulesType === '1' || res.rulesType === '3'){
						 
						this.DiversityRule = true
						this.diversity = res.rulesType
						this.DiversityList.push({
							id:`${index + 1}`,
							contentId:'',
							contentNumber:res.each,
							chooseContentType:res.includeTopic,
							minimumDisplay:res.eachMin,
							maximumDisplay:res.eachMax,
							diversityType:res.rulesType,
							expirationTime:'',
							includeTopic:res.includeTopic,
							reachId:res.reachId,
							rulesId:res.rulesId,
							rulesType:res.rulesType
						})
					}
					if(res.rulesType === '4'){
						this.contentTopRule = true
						this.contentTopList.push({
							contentId:res.contentId,
							each:'',
							eachMax:'',
							eachMin:"",
							chooseTopTime:res.expirationTime,
							includeTopic:'',
							reachId:res.reachId,
							rulesId:res.rulesId,
							rulesType:res.rulesType
						})
					}
				})
			}
			if(this.diversity !== ''){
			}
		}
	})
}
</script>
  
<style lang="less" scoped>
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