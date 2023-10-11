<!-- 内容分发管理 -->
<template>
  <div class="operationManage">
		<div style="height: 65px;padding: 16px 16px;">
			<a-row>
				<a-col :span="12" style="display: flex;justify-content: start;align-items: center;">
					<a-button	
						type="primary"
						@click="checkFeatureValue === '1' ? addbtn() : checkFeatureValue === '2' ? shelfBtn() : delList() "
						danger
						style="height: 33px;border-radius: 4px;margin-right: 2%;"
						>
						<div style="display: flex;justify-content: center;align-items: center;">
							<img v-if="checkFeatureValue === '1'" style="width:20px;height: 20px;margin-right: 7px;" src="../../assets/addWhite.png" alt="">
							<img v-else-if="checkFeatureValue === '2'" style="width:20px;height: 20px;margin-right: 7px;" src="../../assets/listingLogo.png" alt="">
							<img v-else style="width:20px;height: 20px;margin-right: 7px;" src="../../assets/delAll.png" alt="">
							{{ checkFeatureValue === '1' ? '新增' : checkFeatureValue === '2' ? '批量上架' : '批量删除' }}
						</div>
					</a-button>
					<a-dropdown
					  v-if="checkFeatureValue === '1'"
						:trigger="['click']"
						style="width: 77px;height: 33px;border-radius: 4px;"
					>
						<template #overlay>
							<a-menu @click="checkFeature($event)">
								<a-menu-item v-for="item in checkFeatureList" :key="item.key" :value="item.value">
									{{ item.name }}
								</a-menu-item>
							</a-menu>
						</template>
						<a-button
							style="width: 77px;height: 33px;border-radius: 4px;"
							>
							<template #icon>
								<UnorderedListOutlined />
							</template>
							更多
						</a-button>
					</a-dropdown>
					<a-button	
						v-else
						@click="checkFeature('2')"
						style="width: 77px;height: 33px;border-radius: 4px;"
						>
						<template #icon>
							<CloseOutlined />
						</template>
						取消
					</a-button>
				</a-col>
				<a-col :span="12">
					<div style="display: flex;justify-content: end;align-items: center;">
						<a-button	
							@click="search()"
							style="width: 86px;height: 33px;border-radius: 4px;margin-right: 2%;display: flex;align-items: center;justify-content: space-between;"
							>
							<img style="width: 16px;height: 16px;" src="../../assets/Systems.png" alt="">
							筛选
					</a-button>
					<a-input
						@pressEnter="queryBtn"
						style="width:200px;border-radius: 4px;font-size:12px;"
						v-model:value="operationName"
            placeholder="输入关键字回车搜索"
					>
						<template #prefix>
							<SearchOutlined />
						</template>
					</a-input>
					</div>
				</a-col>
			</a-row>
		</div>
		<div class="operationManage_hr"></div>
		<div class="query-question">
			<a-table
				style="padding-bottom: 24px;"
				:scroll="{ y: 475 }"
				:row-key="(record:any) => record.reachId"
				:row-selection="checkFeatureValue !== '1' ? { selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange } : ''"
				:pagination="false"
				@change="changePage($event)"
				:columns="columns"
				:data-source="dataList">
				<template #reachDitchName="{ text }">
					<a-tooltip>
						<template #title>{{ text }}</template>
						{{ text.length > 10 ? text.slice(0,10) + '...' : text}}
					</a-tooltip>
				</template>
				<template #reachName="{ text,record }">
					<a-tooltip>
						<template #title>{{ text }}</template>
						<a-button type="link" @click="record.reachStatus === '1' ? handleChoose(record,'1') :  handleChoose(record,'0')">
              {{ text.length > 15 ? text.slice(0,15) + '...' : text}}
            </a-button>
					</a-tooltip>
				</template>
				<template #status="{text}">
					<p>{{ text }}</p>
				</template>
				<template #action="{record}">
					<a-dropdown :trigger="['click']">
						<a class="ant-dropdown-link" @click.prevent>
							<p style="font-size: 26px;height: 30px;">···</p>
						</a>
						<template #overlay>
							<a-menu>
								<a-menu-item
									:key="item.key"
									v-for="item in handleList"
									:disabled="item.label === '下架' && record.reachStatus === '1' || item.label === '删除' && record.reachStatus === '0' || item.label === '上架' && record.reachStatus === '0' || item.label === '详情' && record.reachStatus === '1'"
									@click="handleChoose(record,item.value)"	
									>
									{{ item.label }}
								</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown>
				</template>
			</a-table>
			<div class="operationManage_page">
				<div class="operationManage_page_content">
					<a-pagination
					:show-total="(total:any) => `共 ${pagination.total} 条`"
					v-model:pageSize="pagination.pageSize"
					v-model:current="pagination.current"
					show-quick-jumper
					:total="pagination.total"
					@change="changePage($event)" />
				</div>
			</div>
		</div>
		<!-- <div class="operationManage_page">
			<div style="width: 100%;height: 100%;color: #fff;background-color: red;">123</div>
		</div> -->
		<a-modal
		  style="width: 400px;height: 160px;"
			:footer="null"
			v-model:visible="preBrowseVisible"
		>
			<a-row>
				<a-col :span="4">
					<img style="width: 32px;height: 32px;margin: 16px 0px;" src="../../assets/fail.png" alt="">
				</a-col>
				<a-col :span="20">
					<p style="font-size: 18px;font-weight: 500;color: #000000;margin:18px 0px;">操作确认</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20">
					<p style="font-size: 14px;font-weight: 400;color: #666666;margin-bottom: 32px;">{{ popoverTypeName }}</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20" style="margin-bottom: 16px;display: flex;justify-content: end;align-items: center;">
					<a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="colseShelf" v-if="(popoverType === '2' && userTableSelectedKeys.length !== 0) || popoverType === '1' || popoverType === '3' ">取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureShelf">确定</a-button>
				</a-col>
			</a-row>
		</a-modal>
		<!-- 筛选搜索条件弹窗 -->
		<a-drawer
			v-model:visible="showScreeningCondition"
			class="custom-class"
			placement="right"
			width="450"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_operation_title">
					<div style="display: flex;justify-content: center;align-items: center;">
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/Systems.png" alt="">
						<span style="font-size: 16px;">筛选设置</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="cancleSearch">
						<img style="width: 15px;height: 10px;" src="../../assets/addBack.png" alt="">
					</a-button>
				</div>
			</template>
			<div class="ScreeningCondition">
				<a-row style="margin: 24px 0px;">
					<a-col :span="6">渠道</a-col>
					<a-col :span="18">
						<a-select v-model:value="ditch" style="width: 70%;border-radius: 4px;">
							<a-select-option :value="item.enum_type" v-for="item in ditchList" :key="item.enum_id">{{ item.enum_name }}</a-select-option>
						</a-select>
					</a-col>
				</a-row>
				<a-row style="margin: 24px 0px;">
					<a-col :span="6">内容分发状态</a-col>
					<a-col :span="18">
						<a-select ref="select" v-model:value="operationState" style="width: 70%;border-radius: 4px;">
							<a-select-option v-for="item in operationStateList" :key="item.id">{{ item.label}}</a-select-option>
						</a-select>
					</a-col>
				</a-row>
				<a-row style="margin: 24px 0px;">
					<a-col :span="6">开始时间</a-col>
					<a-col :span="18">
						<a-date-picker
							style="width: 70%;border-radius: 4px;"
							valueFormat="YYYY-MM-DD 00:00:00"
							v-model:value="startTime"
							:disabledDate="disabledDateStart"
							placeholder="开始时间" />
					</a-col>
				</a-row>
				<a-row style="margin: 24px 0px;">
					<a-col :span="6">结束时间</a-col>
					<a-col :span="18">
						<a-date-picker
							style="width: 70%;border-radius: 4px;"
							valueFormat="YYYY-MM-DD 00:00:00"
							v-model:value="endTime"
							:disabledDate="disableEndTime"
							placeholder="结束时间" />
					</a-col>
				</a-row>
			</div>
			<template #footer>
				<div style="display: flex;justify-content: end;align-items: center;height: 78px;">
					<a-button style="width:76px;border-radius: 4px;height: 40px;margin-right: 20px;" @click="cancleBtn">重置</a-button>
					<a-button type="primary" danger style="width:76px;height: 40px;border-radius: 4px;"
						@click="queryBtn">查询</a-button>
				</div>
			</template>
		</a-drawer>
		<!-- 新增内容分发弹窗 -->
		<a-drawer
			v-model:visible="showAddOperation"
			class="custom-class"
			placement="right"
			width="1100"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_operation_title">
					<div style="display: flex;justify-content: center;align-items: center;">
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/addLeft.png" alt="">
						<span style="font-size: 16px;">{{ addOrEditType === '0' ? '新增内容分发' : addOrEditType === '1' ? '编辑内容分发' : addOrEditType === '2' ? '内容分发详情' : '' }}</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="cancleAdd">
						<img style="width: 15px;height: 10px;" src="../../assets/addBack.png" alt="">
					</a-button>
				</div>
			</template>
			<addOperation
				:addOrEditType="addOrEditType"
				:editReachId="editReachId"
				:showAddOperation="showAddOperation"
				@cancleAdd="cancleAdd"
			/>
		</a-drawer>
		<!-- 内容分发详情弹窗 -->
		<a-drawer
			v-model:visible="showDetailOperation"
			class="custom-class"
			placement="right"
			width="850"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_operation_title">
					<div style="display: flex;justify-content: start;align-items: center;">
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/addLeft.png" alt="">
						<span style="font-size: 16px;">内容分发详情</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="cancleDetail">
						<img style="width: 15px;height: 10px;" src="../../assets/addBack.png" alt="">
					</a-button>
				</div>
			</template>
			<operationDetail
				:addOrEditType="addOrEditType"
				:detailReachId="detailReachId"
				:showDetailOperation="showDetailOperation"
				@cancleDetail="cancleDetail"
			/>
		</a-drawer>
  </div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import { AxiosRequestHeaders } from 'axios';
import { operaTionApi } from '@/libs/api/index';
import store from '@/modules/operation/store';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import addOperation from '../addOperation/index.vue';
import { UnorderedListOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons-vue';
import operationDetail from '../operationDetail/index.vue';

interface ditchListType {
	label:string,
	value:string,
	id:string
}
interface handleListType {
	key:string,
	value:string,
	label:string,
	disabled:boolean
}
@Options({
  components:{
		addOperation,
		operationDetail,
		UnorderedListOutlined,
		SearchOutlined,
		CloseOutlined
  }
})

export default class operation extends Vue {
  public states:any = store.state
  public router = useRouter()
  public created(): void {
		this.ditch = '0'
		this.operationState = '2'
    this.getList()
	}
  //渠道v-model
	public ditch: string = ''
  //渠道下拉框列表数据
	public ditchList:any[] = []
  //运营位名称
	public operationName: string = ''
	//运营位状态v-model
	public operationState: string = ''
  //运营位状态list
	public operationStateList:ditchListType[] = [
		{
			label: '全部',
			value: '2',
			id: '2'
		},
		{
			label: '已上架',
			value: '0',
			id: '0'
		},
		{
			label: '已下架',
			value: '1',
			id: '1'
		},
	]
  //开始时间
	public startTime: string = ''
	public disabledDateStart(current: any){
		if (this.endTime) {
      return current > moment(this.endTime).endOf('day');
    } else {
    }
	}
	//结束时间
	public endTime: string = ''
	public disableEndTime(current:any) {
    if (this.startTime) {
      return (
        (current && current < moment(this.startTime).subtract(1, 'days').endOf('day'))
      );
    }
  }
	public getQueryDicCode(){
		let params = {
			enum_code:'REACH_PAGE_CODE'
		}
		operaTionApi.getQueryDicByCode(params,{}).then((res:any) => {
			this.ditchList = res.data
		})
	}
	//筛选搜索条件抽屉展示
	public showScreeningCondition:boolean = false
	//点击筛选条件按钮
	public search(){
		this.getQueryDicCode()
		this.showScreeningCondition = true
	}
  // 查询按钮
  public queryBtn() {
    this.pagination.current = 1
    this.pagination.pageSize = 10
		this.getList()
		// this.getTest()
	}
  //请求列表接口
	public async getList() {
		let params = {
			reachDitchCode: this.ditch === '0' ? '' : this.ditch,
			reachName: this.operationName,
			reachStatus: this.operationState === '2' ? '' : this.operationState,
			mdfStartDate:this.startTime,
			mdfEndDate:this.endTime
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
		await operaTionApi.getSelectReachMainInfo(params,header).then((res:any) => {
			this.dataList = res.data
      this.pagination.total = res.recordsTotal
		}).catch(() => {

		})
	}
  //重置按钮
	public cancleBtn() {
		this.ditch = '0'
		this.operationName = ''
		this.operationState = '2'
		this.startTime = ''
		this.endTime = ''
    this.pagination.current = 1
    this.pagination.pageSize = 10
		this.getList()
	}
  //选择数据
  public userTableSelectedKeys:string[] = []
	public onSelectChange  (selectedRowKeys:string[]) {
    this.userTableSelectedKeys = selectedRowKeys;
  };
  //分页
  public pagination:any = {
    current:1,
    pageSize:10,
		defaultCurrent: 1, // 默认当前页数
		defaultPageSize: 10, // 默认当前页显示数据的大小
		total: 0, // 总数，必须先有
		showSizeChanger: true,
		showQuickJumper: true,
		pageSizeOptions: ["5", "10", "15", "20"],
		showTotal: (total:number) => `共 ${total} 条`, // 显示总
  }
  //初始化table表头
	public columns = [
		{
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			key:'operation',
			slots: { customRender: 'action' },
		},
		{
			title: '渠道',
			dataIndex: 'reachDitchName',
			slots: { customRender: 'reachDitchName' },
			align: 'center'
		},
		{
			title: '内容分发名称',
			dataIndex: 'reachName',
			slots: { customRender: 'reachName' },
			width: 300,
			align: 'center'
		},
		{
			title: '内容分发状态',
			dataIndex: 'reachStatusName',
			slots: { customRender: 'status' },
			align: 'center'
		},
		{
			title: '操作人',
			dataIndex: 'mdfUserName',
			align: 'center'
		},
		{
			title: '更新时间',
			dataIndex: 'mdfDate',
			align: 'center'
		}
	];
  //点击上一页下一页，重新查询数据
	public async changePage(e:any){
		console.log(e,'e')
		// const header: any = {
    //   request: (header: AxiosRequestHeaders) => {
    //     header.nowPage = e.current;
    //     header.row4Page = e.pageSize;
    //   }
    // }
		this.pagination.current = e
    // this.pagination.pageSize = e.pageSize
    this.getList()
	}
  //列表数据
  public dataList:any = []
  //初始化table操作按钮
	public handleList:handleListType [] = [
		{
			key:'0',
			value:'0',
			label:'详情',
			disabled:false
		},
		{
			key:'1',
			value:'1',
			label:'编辑',
			disabled:false
		},
		{
			key:'2',
			value:'2',
			label:'上架',
			disabled:false
		},
		{
			key:'3',
			value:'3',
			label:'下架',
			disabled:false
		},
		{
			key:'4',
			value:'4',
			label:'删除',
			disabled:false
		},
	]

  public dataSureList:any = {
		reachStatus:'',
		reachIds:[]
	}
	//编辑传reachId
	public editReachId:string = ''
	//详情传reachId
	public detailReachId:string = ''
	//详情抽屉
	public showDetailOperation:boolean = false
  //操作按钮点击
	public async handleChoose(record:any,item:any){
		this.dataSureList = {
			reachStatus:'0',
			reachIds:[]
		}
		if(item === '2' || item === '3'){
			this.popoverType = '3'
			this.preBrowseVisible = true
			this.dataSureList.reachIds.push(record.reachId) 
			if(record.reachStatus === '0'){
				this.dataSureList.reachStatus = '1'
			} else{
				this.dataSureList.reachStatus = '0'
			}
			if(item === '2'){
				this.popoverTypeName = '确认上架所选内容分发吗？'
			} else {
				this.popoverTypeName = '确认下架所选内容分发吗？'
			}
		}
		if(item === '0'){
			//详情
			// this.detailReachId = record
			// this.addOrEditType = '2'
			// this.showDetailOperation = true
			this.editReachId = record
			this.addOrEditType = '2'
			this.showAddOperation = true
			console.log(123,'21321321')
			// console.log(record)
			// this.router.push({ path:'operationDetail', query: { reachId: record.reachId }})
		}
		//删除
		if(item === '4'){
			this.popoverType = '2'
			this.preBrowseVisible = true
			this.popoverTypeName = '确认删除所选内容分发吗？'
			this.userTableSelectedKeys.push(record.reachId)
		}
		if(item === '1'){
			//编辑
			this.editReachId = record
			this.addOrEditType = '1'
			this.showAddOperation = true
		}
	}

  public preBrowseVisible:boolean = false
  //上架、删除、下架取消弹窗
	public colseShelf(){
		this.preBrowseVisible = false
	}
  public popoverType:string = ''
	public popoverTypeName:string = ''
  //上架、删除、下架确认弹窗
  public reachIdsList:any = []
	public sureShelf(){
		if(this.popoverType === '1'){
			this.reachIdsList.forEach((res:any) => {
				this.dataSureList.reachIds.push(res.reachIds)
			})
			this.changeUpStatus()
		}
		if(this.popoverType === '2' && this.userTableSelectedKeys.length === 0){
			this.preBrowseVisible = false
		} else if(this.popoverType === '2' && this.userTableSelectedKeys.length !== 0){
			this.DelListIds()
			this.preBrowseVisible = false
		}
		if(this.popoverType === '3'){
			this.changeUpStatus()
		}
	}
  //上架、下架
	public async changeUpStatus() {
		let params:any = this.dataSureList
		await operaTionApi.getChangeUpStatus(params,{}).then((res) => {
			message.info('操作成功')
			this.preBrowseVisible = false
      this.pagination.current = 1
      this.pagination.pageSize = 10
			this.getList()
		}).catch(() => {

		})
	}
  //批量删除
	public async DelListIds() {
		let params:any = {
			ids:[]
		}
		this.userTableSelectedKeys.forEach((res:any) => {
			params.ids.push(res)
		})
		await operaTionApi.getDeleteByIds(params,{}).then((res:any) => {
			if(res.successflag === true){
        this.pagination.current = 1
        this.pagination.pageSize = 10
				this.getList()
				message.info('删除成功')
			}
		}).catch(() => {

		})
	}
	//取消新增或编辑
	public cancleAdd(value:boolean,type:string){
		if(type === '0'){
			//新增或编辑，需重置列表
			this.cancleBtn()
		}
		this.showAddOperation = false
	}
	//关闭筛选条件
	public cancleSearch(){
		this.showScreeningCondition = false
	}
	//取消详情
	public cancleDetail(value:boolean){
		this.showDetailOperation = false
	}
	//新增或编辑(0新增，1编辑)
	public addOrEditType:string = ''
	//新增弹窗
	public showAddOperation:boolean = false
	//切换新增-上架-批量删除-展示名称
	public checkFeatureValue:string = '1'
	//切换新增-上架-批量删除按钮列表
	public checkFeatureList:any = [
		{
			key:'2',
			value:'2',
			name:'批量上架'
		},
		{
			key:'3',
			value:'3',
			name:'批量删除'
		}
	]
	//切换新增-上架-批量删除
	public checkFeature(e:any){
		if(e === '2'){
			this.checkFeatureValue = '1'
			this.checkFeatureList = [
				{
					key:'2',
					value:'2',
					name:'批量上架'
				},
				{
					key:'3',
					value:'3',
					name:'批量删除'
				}
			]
		} else {
			this.checkFeatureValue = e.key
		}
		this.userTableSelectedKeys = []
	}
  //新增
	public addbtn(){
		this.editReachId = ''
		this.addOrEditType = '0'
		this.showAddOperation = true
		// store.commit('changeTableContentList',[])
		// store.commit('changeTableContentEditList','1')
		// store.commit('changeEditTypeValue','0')
		// this.$router.push({
		// 	path:'/operation/addOperation'
		// })
	}
  //批量上架
	public shelfBtn(){
		this.dataSureList = {
			reachStatus:'0',
			reachIds:[]
		}
		this.reachIdsList = []
		let reachStatusType:boolean = true
		if(this.userTableSelectedKeys.length === 0){
			message.info('请先选择需上架的内容分发数据')
			reachStatusType = false
			return
		}
		if(this.userTableSelectedKeys.length !== 0){
			this.dataList.forEach((res:any) => {
        this.userTableSelectedKeys.forEach(jes => {
          if(res.reachId === jes){
            if(res.reachStatus === '0'){
              reachStatusType = false
            }
          }
        })
		  })
		}
    if(!reachStatusType){
      message.info('请先去掉勾选已上架内容分发')
      return
    }
		if(reachStatusType === true){
			this.dataList.forEach((res:any) => {
				this.userTableSelectedKeys.forEach(jes => {
					if(res.reachId === jes){
						this.reachIdsList.push({
							reachIds:res.reachId
						})
						this.popoverTypeName = '确认上架所选内容分发吗？'
						this.preBrowseVisible = true
						this.popoverType = '1'
					}
				})
			})
		}
	}
  //批量删除
	public delList(){
     
		this.popoverType = '2'
		let reachStatusType:boolean = true
		if(this.userTableSelectedKeys.length === 0){
			this.popoverTypeName = '请先选择需删除的内容分发数据'
			reachStatusType = false
			this.preBrowseVisible = true
			return
		}
		if(this.userTableSelectedKeys.length !== 0){
			this.dataList.forEach((res:any) => {
				this.userTableSelectedKeys.forEach((item:any) => {
					if(res.reachId === item){
						if(res.reachStatus === '0'){
							reachStatusType = false
							// message.info('请先去掉勾选已上架内容分发')
							// return
						}
					}
				})
			})
		}
    if(!reachStatusType){
      message.info('请先去掉勾选已上架内容分发')
			return
    }
		if(reachStatusType === true){
			this.preBrowseVisible = true
			this.popoverTypeName = '确认删除所选内容分发吗？'
		}
	}
}
</script>
  
<style lang="less">
.choose {
	height: 140px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.choose-select {
		width: 94%;
		margin: 0 auto;
		margin-bottom: 20px
	}
}
.ant-drawer-header{
	padding: 0px;
}
.ScreeningCondition_operation_title{
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
.operationManage{
	// padding: 0px 16px;
	width:100%;
	// height: 100%;
	// position: relative;
	overflow: auto;
	.operationManage_hr{
		height: 12px;
		background-color: #F5F5F5;
		// background-color: #000;
		width: 100%;
	}
	.query-question{
		padding: 16px 16px 0px 16px;
		// position: relative;
		overflow: auto;
		width: 100%;
		.operationManage_page{
			position: absolute;
			padding: 0px 16px 0px 16px;
			width: 100%;
			bottom: 4px;
			right: 2px;
			display: flex;
			justify-content: end;
			align-items: center;
			.operationManage_page_content{
				width: 100%;
				background-color: #fff;
				display: flex;
				justify-content: end;
				align-items: center;
				padding:10px 0px;
			}
		}
		// .ant-pagination{
		// 	position: absolute;
		// 	padding: 0px 16px 0px 16px;
		// 	width: 100%;
		// 	height: 6.6%;
		// 	bottom: 2px;
		// 	right: 2px;
		// 	background-color: #fff;
		// }
	}
	// .ant-pagination{
	// 	position: absolute;
	// 	width: 100%;
	// 	bottom: 0px;
	// 	right: 3%;
	// 	height: 48px;
	// 	background-color: #fff;
	// 	display: flex;
	// 	align-items: center;
	// 	justify-content: center;
	// }
}

</style>