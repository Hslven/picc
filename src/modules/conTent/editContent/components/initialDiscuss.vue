<template>
	<div class="initialDiscuss">
		<!-- 查看初始值： -->
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">阅读初始值：</a-col>
			<a-col :xs="2" :sm="2" :xl="1" :xxl="1">
				<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">*</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="11" :xxl="6">
				<a-input
					placeholder='请输入正整数'
					maxlength="8"
					:showCount="true"
					v-model:value="viewInitialValue"
					style="width:150px;border-radius: 4px;"
					@blur="changeViewInitialValue(viewInitialValue)"
					></a-input>
			</a-col>
		</a-row>
		<!-- 是否可评论： -->
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可评论：</a-col>
			<a-col :xs="2" :sm="2" :xl="1" :xxl="1">
				<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">*</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="11" :xxl="6">
				<a-radio-group v-model:value="discussValue" @change="changeDiscussValue()">
					<a-radio :value="'1'" >是</a-radio>
					<a-radio :value="'0'" style="margin-left: 20px;">否</a-radio>
				</a-radio-group>
			</a-col>
		</a-row>
		<!-- 是否可点赞： -->
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可点赞：</a-col>
			<a-col :xs="2" :sm="2" :xl="1" :xxl="1">
				<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">*</span>
			</a-col>
			<a-col :xs="12" :sm="14" :xl="11" :xxl="8" style="display: flex;justify-content: space-between;align-items: center;">
				<a-radio-group v-model:value="giveLike" @change="changeGiveLike()">
					<a-radio :value="'1'">是</a-radio>
					<a-radio :value="'0'" style="margin-left: 20px;">否</a-radio>
				</a-radio-group>
				<div v-if="giveLike === '1'">
					<span style="margin-right:20px">点赞初始值</span>
					<a-input
						placeholder='请输入正整数'
						maxlength="8"
						:showCount="true"
						v-model:value="giveLikeValue"
						style="width:150px;border-radius: 4px;"
						@change="changeGiveLikeValue(giveLikeValue)"
						></a-input>
				</div>
			</a-col>
		</a-row>
		<!-- 是否可分享： -->
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">是否可分享：</a-col>
			<a-col :xs="2" :sm="2" :xl="1" :xxl="1">
				<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">*</span>
			</a-col>
			<a-col :xs="12" :sm="14" :xl="11" :xxl="8" style="display: flex;justify-content: space-between;align-items: center;">
				<a-radio-group v-model:value="canShare" @change="changeCanShare()">
					<a-radio :value="'1'">是</a-radio>
					<a-radio :value="'0'" style="margin-left: 20px;">否</a-radio>
				</a-radio-group>
				<div v-if="canShare === '1'">
					<span style="margin-right:20px">分享初始值</span>
					<a-input
						placeholder='请输入正整数'
						maxlength="8"
						:showCount="true"
						style="width:150px;border-radius: 4px;"
						v-model:value="canShareValue"
						@change="changeCanShareValue(canShareValue)"
						></a-input>
				</div>
			</a-col>
		</a-row>
		<!-- 关联广告位 -->
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :push="1" :xs="8" :sm="6" :xl="3" :xxl="6">关联广告位：</a-col>
			<a-col :xs="2" :sm="2" :xl="1" :xxl="1">
				<span style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">*</span>
			</a-col>
			<a-col :xs="12" :sm="14" :xl="11" :xxl="8" style="display: flex;justify-content: space-between;align-items: center;">
				<a-radio-group v-model:value="canAdvertising" @change="changeCanAdvertising()">
					<a-radio :value="'1'">是</a-radio>
					<a-radio :value="'0'" style="margin-left: 20px;">否</a-radio>
				</a-radio-group>
				<div v-if="canAdvertising === '1'">
					<span style="margin-right:20px">选择广告位</span>
					<a-button @click="chooseAdvertising" style="width:150px;border-radius: 4px;">{{ canAdvertisingValue === '' ? '请选择广告位' : canAdvertisingValue }}</a-button>
				</div>
			</a-col>
		</a-row>
		<!-- 广告位抽屉 -->
		<a-drawer
			size="large"
			width="800"
			v-model:visible="advertisingBoolean"
			class="custom-class"
			title="添加广告位"
			placement="right"
			>
			<a-row :gutter="24">
				<a-col :push="1" :xs="1" :sm="3" :xl="4" :xxl="3" style="text-align: center;height: 30px;line-height: 30px;">渠道：</a-col>
				<a-col :xs="2" :sm="6" :xl="7" :xxl="6">
					<a-select
						v-model:value="advertisingDitch"
						style="width:200px"
						placeholder='请选择'
						@change="changeDitch"
					>
						<a-select-option v-for="item in ditchList" :key="item.id">{{ item.label }}</a-select-option>
					</a-select>
				</a-col>
				<a-col :push="1" :xs="2" :sm="4" :xl="5" :xxl="4" style="height: 30px;line-height: 30px;">广告位名称：</a-col>
				<a-col :xs="4" :sm="4" :xl="6" :xxl="4">
					<a-input
						v-model:value="advertisingName"
						style="width:200px;border-radius: 6px;"
						placeholder='请输入广告位名称'
						@change="changeAdvertisingName"
					></a-input>
				</a-col>
			</a-row>
			<a-row :gutter="24" style="margin-top:30px">
				<a-col :push="1" :xs="4" :sm="4" :xl="4" :xxl="3" style="height: 30px;line-height: 30px;">更新时间：</a-col>
				<a-col :xs="4" :sm="12" :xl="13" :xxl="12">
					<a-date-picker
						style="width:40%;border-radius: 4px;margin-right: 8px;"
						valueFormat="YYYY-MM-DD 00:00:00"
						v-model:value="advertisingStartTime"
						:disabledDate="disabledDateStart"
						placeholder="开始时间" />
					<span>至</span>
					<a-date-picker
						style="width:40%;border-radius: 4px;margin-left:8px"
						valueFormat="YYYY-MM-DD 23:59:59"
						v-model:value="advertisingEndTime"
						:disabled-date="disableEndTime"
						placeholder="结束时间" />
				</a-col>
				<a-col :xs="4" :sm="6" :xl="6" :xxl="6">
					<a-button @click="searchAdvertisingList" style="margin-right:20px">查询</a-button>
					<a-button @click="resetAdvertisingList">重置</a-button>
				</a-col>
			</a-row>
			<a-table
				style="margin-top:16px"
				:row-key="(record:any) => record.reachId"
				:row-selection="{ selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange ,type:'radio'}"
				:pagination="pagination"
				@change="changeAdvertisingPage($event)"
				:columns="columns"
				:data-source="AdvertisingDataList">
				<template #action="{record}">
					<span style="color: #2443BC;" @click="goAdvertisingAction(record)">详情</span>
				</template>
			</a-table>
			<div style="display: flex;justify-content: right;align-items: center;">
				<a-button style="margin-right: 30px;" @click="cancleAddAdvertising">取消</a-button>
				<a-button @click="makeAddAdvertising">确定</a-button>
			</div>
		</a-drawer>
		<!-- 广告位确认弹窗 -->
		<a-modal v-model:visible="makeAddAdvertisingBoolean" style="padding: 20px 50px;" >
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;border-radius: 4px;" @click="cancleSureAddAdvertising">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="makeSureAddAdvertising">确定</a-button>
			</template>
			<p style="padding: 30px 50px 30px 30px;">确定添加广告位吗？</p>
    </a-modal>
	</div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import { operaTionApi } from '@/libs/api/index';
import { AxiosRequestHeaders } from 'axios';
import { message } from 'ant-design-vue';
import { computed,watch } from 'vue';
import { Prop } from 'vue-property-decorator';
import store from '@/modules/conTent/store';
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'


export default class initialDiscuss extends Vue {
	@Prop({ default: false }) public getEditDataList!: any
	public created(): void {
	}
	public mounted(): void{
	}
	public route = useRoute()
	public state: any = store.state
	public editContentList:any = computed(() => {
		 
		 
		let editContent = this.state.editContent.editContentList
		if(this.route.query.editType === '1'){
			this.viewInitialValue = editContent.readInitValue
			this.discussValue = editContent.canDiscuss
			this.giveLike = editContent.canPraise
			this.giveLikeValue = editContent.praiseInitValue
			this.canShare = editContent.canShare
			this.canShareValue = editContent.shareInitValue
			this.canAdvertising = editContent.isRelateAdvertSpace
			this.canAdvertisingValue = editContent.reachNames
			this.initialDiscussObject = {
				viewInitialValue:editContent.readInitValue,
				discussValue:editContent.canDiscuss,
				giveLike:editContent.canPraise,
				giveLikeValue:editContent.praiseInitValue,
				canShare:editContent.canShare,
				canShareValue:editContent.shareInitValue,
				canAdvertising:editContent.isRelateAdvertSpace,
				canAdvertisingValue:editContent.reachNames
			}
			this.$emit('initialDiscussObject',this.initialDiscussObject)
		}
		return editContent
	})
	//查看初始值input
	public viewInitialValue:number = 0
	//是否可评论
	public discussValue:string = ''
	//是否可点赞
	public giveLike:string = ''
	//点赞初始值
	public giveLikeValue:string = ''
	//是否可分享
	public canShare:string = ''
	//分享初始值
	public canShareValue:string = ''
	//是否选择广告位
	public canAdvertising:string = ''
	//广告位
	public canAdvertisingValue:string = ''
	//选择广告位抽屉
	public advertisingBoolean:boolean = false
	//确定添加广告位弹窗
	public makeAddAdvertisingBoolean:boolean = false

	public initialDiscussObject = {
		viewInitialValue: 0 ,//阅读初始值
		discussValue:'',//是否可评论
		giveLike:'',//是否可点赞
		giveLikeValue:0,//点赞初始值
		canShare:'',//是否可分享
		canShareValue:0,//分享初始值
		canAdvertising:'',//是否关联广告位
		canAdvertisingValue:''
	}
	//改变阅读初始值
	public changeViewInitialValue(value:any){
		if(value !== value.replace(/[^0-9]/g, '')){
      message.info('请输入正整数，最大支持8位')
      this.viewInitialValue=value.replace(/[^0-9]/g, '')
      return
    } else {
      this.initialDiscussObject.viewInitialValue = parseInt(value)
      this.$emit('initialDiscussObject',this.initialDiscussObject)
    }
	}
	//是否可评论
	public changeDiscussValue(){
		this.initialDiscussObject.discussValue = this.discussValue
		this.$emit('initialDiscussObject',this.initialDiscussObject)
	}
	//是否可点赞
	public changeGiveLike(){
		this.initialDiscussObject.giveLike = this.giveLike
		if(this.giveLike === '0'){
			this.giveLikeValue = ''
			this.initialDiscussObject.giveLikeValue = 0
		}
		this.$emit('initialDiscussObject',this.initialDiscussObject)
	}
	//点赞初始值
	public changeGiveLikeValue(value:any){
		if(value !== value.replace(/[^0-9]/g, '')){
      message.info('请输入正整数，最大支持8位')
      this.giveLikeValue=value.replace(/[^0-9]/g, '')
      return
    } else {
      this.initialDiscussObject.giveLikeValue = value === '' ? 0 : parseInt(value)
      this.$emit('initialDiscussObject',this.initialDiscussObject)
    }
	}
	//是否可分享
	public changeCanShare(){
		 
		this.initialDiscussObject.canShare = this.canShare
		if(this.canShare === '0'){
			this.canShareValue = ''
			this.initialDiscussObject.canShareValue = 0
		} 
		this.$emit('initialDiscussObject',this.initialDiscussObject)
	}
	//分享初始值
	public changeCanShareValue(value:any){
		if(value !== value.replace(/[^0-9]/g, '')){
      message.info('请输入正整数，最大支持8位')
      this.canShareValue=value.replace(/[^0-9]/g, '')
      return
    } else {
      this.initialDiscussObject.canShareValue = value === '' ? 0 : parseInt(value)
      this.$emit('initialDiscussObject',this.initialDiscussObject)
    }
	}
	//是否关联广告位
	public changeCanAdvertising(){
		this.initialDiscussObject.canAdvertising = this.canAdvertising
		if(this.canShare === '0'){
			this.canAdvertisingValue = ''
			this.initialDiscussObject.canAdvertisingValue = ''
		}
		this.canAdvertisingValue = ''
		this.$emit('initialDiscussObject',this.initialDiscussObject)
	}
	//选择广告位
	public async chooseAdvertising(){
		this.advertisingBoolean = true
		let params = {
			reachDitchCode: '',
			reachName:'',
			reachStatus: '',
			mdfStartDate:'',
			mdfEndDate:''
		}
		//调取广告位列表接口
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = 10;
      }
    }
		await operaTionApi.getSelectReachMainInfo(params,header).then((res:any) => {
			 
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data
			this.advertisingBoolean = true
		}).catch(() => {

		})
	}
	//广告位-渠道v-model
	public advertisingDitch = undefined
	//渠道下拉框列表数据
	public ditchList:any[] = [
		{
			label: '全部',
			value: '0',
			id: '0'
		},
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
	//广告位-选择渠道
	public changeDitch(){

	}
	//广告位-名称
	public advertisingName:string = ''
	//广告位-广告位名称
	public changeAdvertisingName(){
		
	}
	//广告位-开始时间
	public advertisingStartTime: string = ''
	public disabledDateStart(current: any){
		if (this.advertisingEndTime) {
      return current > moment(this.advertisingEndTime).endOf('day');
    } else {
       
    }
	}
	//广告位-结束时间
	public advertisingEndTime: string = ''
	public disableEndTime(current:any) {
    if (this.advertisingStartTime) {
      return (
        (current && current < moment(this.advertisingStartTime).subtract(1, 'days').endOf('day'))
      );
    }
  }
	//广告位-列表v-model
	public AdvertisingDataList:any[] = []
	//广告位-查询广告位
	public async searchAdvertisingList(){
		let params = {
			reachDitchCode: this.advertisingDitch === '0' ? '' : this.advertisingDitch,
			reachName:this.advertisingName,
			reachStatus: '',
			mdfStartDate:this.advertisingStartTime,
			mdfEndDate:this.advertisingEndTime
		}
		//调取广告位列表接口
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = 10;
      }
    }
		this.pagination.current = 1
		await operaTionApi.getSelectReachMainInfo(params,header).then((res:any) => {
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data
		}).catch(() => {

		})
	}
	//广告位-重置广告位
	public async resetAdvertisingList(){
		let params = {
			reachDitchCode: '',
			reachName:'',
			reachStatus: '',
			mdfStartDate:'',
			mdfEndDate:''
		}
		//调取广告位列表接口
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = 10;
      }
    }
		this.pagination.current = 1
		await operaTionApi.getSelectReachMainInfo(params,header).then((res:any) => {
			 
			this.pagination.total = res.recordsTotal
			this.advertisingName = ''
			this.advertisingStartTime = ''
			this.advertisingEndTime = ''
			this.advertisingDitch = undefined
			this.AdvertisingDataList = res.data
		}).catch(() => {

		})
	}
	//广告位-初始化table表头
	public columns = [
		{
			title: '渠道',
			dataIndex: 'reachDitchName',
			slots: { customRender: 'reachDitch' },
			align: 'center'
		},
		{
			title: '广告位名称',
			dataIndex: 'reachName',
			align: 'center'
		},
		{
			title: '更新时间',
			dataIndex: 'mdfDate',
			align: 'center'
		},
		{
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			key:'operation',
			fixed: 'right',
			slots: { customRender: 'action' },
		},
	];
	//广告位-点击多选
	public userTableSelectedKeys:string = ''
	public onSelectChange  (selectedRowKeys:string) {
    this.userTableSelectedKeys = selectedRowKeys;
  };
	//广告位-选择列表
	public async changeAdvertisingPage(e:any){
		let params = {
			reachDitchCode: this.advertisingDitch === '0' ? '' : this.advertisingDitch,
			reachName:this.advertisingName,
			reachStatus: '',
			mdfStartDate:this.advertisingStartTime,
			mdfEndDate:this.advertisingEndTime
		}
		//调取广告位列表接口
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = e.current;
        header.row4Page = e.pageSize;
      }
    }
		this.pagination.current = e.current
		await operaTionApi.getSelectReachMainInfo(params,header).then((res:any) => {
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data
		}).catch(() => {

		})
	}
	//广告位-列表页脚
	public pagination = {
			current:1,
			defaultCurrent: 1, // 默认当前页数
			defaultPageSize: 10, // 默认当前页显示数据的大小
			total:0, // 总数，必须先有
			showSizeChanger: true,
			showQuickJumper: true,
			pageSizeOptions: ["5", "10", "15", "20"],
			showTotal: (total:number) => `共 ${total} 条`, // 显示总
	}
	//广告位-查看详情
	public router = useRouter()
	public goAdvertisingAction(record:any){
		 
		this.router.push({ path:'/operation/operationDetail', query: { reachId: record.reachId }})
	}
	//广告位-取消添加
	public cancleAddAdvertising(){
		this.advertisingName = ''
		this.advertisingStartTime = ''
		this.advertisingEndTime = ''
		this.advertisingDitch = undefined
		this.advertisingBoolean = false
	}
	//广告位-确定添加
	public makeAddAdvertising(){
		if(this.userTableSelectedKeys.toString() === ''){
			message.info('请选择广告位')
			return
		}
		this.makeAddAdvertisingBoolean = true 
	}
	//广告位-弹窗-取消添加
	public cancleSureAddAdvertising(){
		this.makeAddAdvertisingBoolean = false
	}
	//广告位-弹窗-确定添加
	public makeSureAddAdvertising(){
		this.initialDiscussObject.canAdvertisingValue = this.userTableSelectedKeys.toString()
		this.$emit('initialDiscussObject',this.initialDiscussObject)
		this.AdvertisingDataList.forEach((res:any) => {
			if(res.reachId === this.initialDiscussObject.canAdvertisingValue){
				this.canAdvertisingValue = res.reachName
			}
		})
		message.info('添加广告位成功')
		this.makeAddAdvertisingBoolean = false
		this.advertisingBoolean = false
	}
}
</script>
<style lang="less">
.initialDiscuss{
	margin-bottom: 20px;
}
.ant-select-selector {
	border-radius: 6px !important;
}
</style>