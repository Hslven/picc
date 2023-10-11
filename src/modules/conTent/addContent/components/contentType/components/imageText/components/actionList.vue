<template>
	<div>
		<a-row :gutter="24">
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">栏目分类：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="5" :xxl="6">
				<a-cascader
					v-model:value="column"
					:options="columnList"
					:multiple="true"
					@change="changeColumValue()"
					:field-names="{ label: 'name', value: 'id', children: 'children' }"
					placeholder="请选择" />
			</a-col>
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">标题名称：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="5" :xxl="6">
				<a-input v-model:value="titleNameValue" placeholder="请输入标题名称"></a-input>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">筛选标签：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="5" :xxl="6">
				<a-tree-select
					v-model:value="tagValue"
					style="width: 100%"
					:tree-data="tagValueList"
					tree-checkable
					allow-clear
					@change="changeTagValue()"
					:field-names="{ label: 'name', value: 'id', children: 'children' }"
					:treeCheckStrictly="true"
					:show-checked-strategy="SHOW_PARENT"
					placeholder="请选择内容标签"
					tree-node-filter-prop="label"
					>	
					</a-tree-select>
			</a-col>
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">内容分类：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="5" :xxl="6">
				<a-select
					v-model:value="contentTypeValue"
					style="width: 100%"
					@change="changeContentType"
					placeholder="请选择内容分类"
				>
					<a-select-option v-for="(item) in contentList" :key="item.code" :value="item.value">{{ item.label }}</a-select-option>
				</a-select>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">上架时间：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="5" :xxl="6">
				<a-date-picker
						style="width:100%;border-radius: 4px;margin-right: 8px;"
						valueFormat="YYYY-MM-DD"
						v-model:value="startTime"
            @change="disabledDateStart"
						placeholder="请选择上架开始时间" />
			</a-col>
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">下架时间：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="5" :xxl="6">
				<a-date-picker
						style="width:100%;border-radius: 4px;margin-right: 8px;"
						valueFormat="YYYY-MM-DD"
						v-model:value="endTime"
            @change="disableEndTime"
						placeholder="请选择上架结束时间" />
			</a-col>
			<a-col :xs="8" :sm="6" :xl="6" :xxl="6">
				<a-button type="primary" danger style="width:84px;border-radius: 4px;margin-right: 30px;" @click="queryProList">查询</a-button>
				<a-button danger style="width:84px;border-radius: 4px;" @click="resetProList">重置</a-button>
			</a-col>
		</a-row>
		<a-row :gutter="24">
			<a-col :xs="24" :sm="24" :xl="24" :xxl="24">
				<a-table
					style="margin-top:16px;"
					:row-key="(record:any) => record.contentId"
					:row-selection="{ selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange}"
					:pagination="pagination"
					@change="changeProPage($event)"
					:columns="columns"
					:data-source="AdvertisingDataList">
					<template #titleName="{text,record}">
						<div style="display: flex;justify-content: left;align-items: center;">
							<img :src="record.horizontalCoverFile" alt="" v-if="record.horizontalCoverFile !== ''">
							<img :src="record.verticalCoverFile" alt="" v-if="record.horizontalCoverFile === ''">
							<span>{{ text }}</span>
						</div>
					</template>
					<template #action="{record}">
						<a-button style="color: blue;border:solid 0px" @click="lookContentDetail(record.contentId)">详情</a-button>
					</template>
				</a-table>
			</a-col>
		</a-row>
		<a-row :gutter="24">
			<a-col :xs="16" :sm="16" :xl="16" :xxl="16"></a-col>
			<a-col :xs="8" :sm="8" :xl="8" :xxl="8">
				<div style="display: flex;justify-content: right;align-items: center;">
					<a-button danger style="width: 84px;margin-right: 30px;border-radius: 4px;" @click="cancleAddPro">取消</a-button>
					<a-button type="primary" danger style="width:84px;border-radius: 4px;" @click="addPro">确认</a-button>
				</div>
			</a-col>
		</a-row>
		<a-modal
		  style="width: 400px;height: 160px;"
			:footer="null"
			v-model:visible="makeAddAdvertisingBoolean"
		>
			<a-row>
				<a-col :span="4">
					<img style="width: 32px;height: 32px;margin: 16px 0px;" src="@/modules/assets/addLeft.png" alt="">
				</a-col>
				<a-col :span="20">
					<p style="font-size: 18px;font-weight: 500;color: #000000;margin:18px 0px;">操作确认</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20">
					<p style="font-size: 14px;font-weight: 400;color: #666666;margin-bottom: 32px;">确定添加活动吗？?</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20" style="margin-bottom: 16px;display: flex;justify-content: end;align-items: center;">
					<a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="cancleSureAddAdvertising" >取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="makeSureAddAdvertising">确定</a-button>
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
				<div class="ScreeningCondition_title">
					<div>
						<img style="width:20px;height:20px;margin-right: 16px;" src="@/modules/assets/addLeft.png" alt="">
						<span style="font-size: 16px;">内容详情</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="cancleDetailContent">>></a-button>
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
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { TreeSelect } from 'ant-design-vue';
import { computed } from 'vue'
import moment from 'moment';
import { AxiosRequestHeaders } from 'axios';
import { contentApi } from '@/libs/api'
import { message } from 'ant-design-vue';
import contentDetail from '@/modules/conTent/contentDetail/index.vue'

@Options({
	components: {
		contentDetail
	}
})
export default class actionList extends Vue {
	public SHOW_PARENT = TreeSelect.SHOW_PARENT;
	@Prop({ default: false }) public actionForm!: boolean;
	public changePreviewForm =  computed(() => {
		this.getProList()
		this.getColumnList()
		this.getTagList()
  })
	//获取产品列表
	public async getProList(){
		let params = {
			isUploadCover:'',
			titleName:'',
			topicId:'',
			labelId:'',
			contentStatus:'',
			startTimeStr:'',
			endTimeStr:''
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
		await contentApi.getProductContentList(params,header).then((res:any) => {
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data
		})
	}
	//获取栏目列表
	public column:any = []
	public columnList:any[] = []
	public async getColumnList(){
		let params = {
			id:''
		}
		await contentApi.getFolderTopic(params,{}).then((res:any) => {
			this.columnList = res.data
		})
	}
	//选中栏目
	public columnSureList:any = []
	public changeColumValue(){
		this.columnSureList = []
		this.column.forEach((res:any) => {
			this.columnSureList.push(res[res.length -1])
		})
	}
	//标题名称
	public titleNameValue:string = ''
	//获取标签列表
	public tagValue:any = []
	public tagValueList:any[] = []
	public async getTagList(){
		let params = {
			id:''
		}
		await contentApi.getFolderLabel(params,{}).then((res:any) => {
			this.tagValueList = res.data
			this.tagValueList = this.getNewTree(this.tagValueList)
		})
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
	//筛选标签
	public tagSureList:any = []
	public changeTagValue(){
		this.tagSureList = []
		if(this.tagValue.length !== 0){
			this.tagValue.forEach((res:any) => {
				this.tagSureList.push(res.value)
			})
		}
	}
	//选中内容分类
	public contentTypeValue:any = undefined
	//内容分类列表数据
	public contentList = [
		{
			value:'t',
			code:'1',
			label:'图文'
		},
		{
			value:'b',
			code:'2',
			label:'海报'
		},
		{
			value:'pr',
			code:'3',
			label:'产品'
		},
		{
			value:'s',
			code:'4',
			label:'话题'
		},
		{
			value:'5',
			code:'v',
			label:'视频'
		}
	]
	//
	public changeContentType(){
		 
	}
	//上架时间
	public startTime:string = ''
	public disabledDateStart(current: any){
		if (this.endTime) {
      return current > moment(this.endTime).endOf('day');
    } else {
    }
	}
	public endTime:string = ''
	public disableEndTime(current:any) {
    if (this.startTime) {
      return (
        (current && current < moment(this.startTime).subtract(1, 'days').endOf('day'))
      );
    }
  }
	//产品列表表头
	public columns:any = [
		{
			title: '栏目分类',
			dataIndex: 'topicName',
			align: 'center'
		},
		{
			title: '内容',
			dataIndex: 'titleName',
			slots: { customRender: 'titleName' },
			align: 'center'
		},
		{
			title: '标签',
			dataIndex: 'labelNames',
			slots: { customRender: 'labelNames' },
			align: 'center'
		},
		{
			title: '操作人',
			dataIndex: 'crt_user',
			slots: { customRender: 'reachDitch' },
			align: 'center'
		},
		{
			title: '上架时间',
			dataIndex: 'publishTime',
			slots: { customRender: 'reachDitch' },
			align: 'center'
		},
		{
			title: '操作',
			dataIndex: 'action',
			slots: { customRender: 'action' },
			align: 'center'
		}
	]
	//产品列表数据
	public AdvertisingDataList:any = []
	public userTableSelectedKeys:any = []
	public TableSureList:any = []
	public onSelectChange  (selectedRowKeys:any) {
		this.TableSureList = []
    this.userTableSelectedKeys = selectedRowKeys;
		this.AdvertisingDataList.forEach((res:any) => {
			selectedRowKeys.forEach((item:any) => {
				if(res.contentId === item){
					this.TableSureList.push(res)
				}
			})
		})
  };
	public pagination = {
			current:1,
			pageSize:10,
			defaultCurrent: 1, // 默认当前页数
			defaultPageSize: 10, // 默认当前页显示数据的大小
			total:0, // 总数，必须先有
			showSizeChanger: true,
			showQuickJumper: true,
			pageSizeOptions: ["5", "10", "15", "20"],
			showTotal: (total:number) => `共 ${total} 条`, // 显示总
	}
	public changeProPage(value:any){
		 
		this.pagination.current = value.current
		this.pagination.pageSize = value.pageSize
		this.queryProList()
	}
	//查询产品列表
	public async queryProList(){
		let params = {
			topicId:this.columnSureList.toString(),
			labelId:this.tagSureList.toString(),
			titleName:this.titleNameValue,
			startTimeStr:this.startTime,
			endTimeStr:this.endTime,
			contentType:this.contentTypeValue === undefined ? '' : this.contentTypeValue
		}
		 
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
		await contentApi.getProductContentList(params,header).then((res:any) => {
			this.pagination.current = 1
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data
		})
	}
	//重置产品列表
	public resetProList(){
		this.pagination.current = 1
		this.pagination.pageSize = 10
		this.getProList()
		this.column = []
		this.columnSureList = []
		this.titleNameValue = ''
		this.tagValue = []
		this.tagSureList = []
		this.startTime = ''
		this.endTime = ''
		this.contentTypeValue = undefined
		this.userTableSelectedKeys = []
		this.TableSureList = []
	}
	//取消添加产品
	public cancleAddPro(){
		this.$emit('changeAction',false)
		this.column = []
		this.columnSureList = []
		this.titleNameValue = ''
		this.tagValue = []
		this.tagSureList = []
		this.startTime = ''
		this.endTime = ''
		this.contentTypeValue = undefined
		this.userTableSelectedKeys = []
		this.TableSureList = []
		this.userTableSelectedKeys = []
	}
	//确认添加产品弹窗
	public makeAddAdvertisingBoolean:boolean = false
	//确认添加产品
	public addPro(){
		if(this.userTableSelectedKeys.length === 0){
			message.info('请选择活动')
			return
		}
		this.makeAddAdvertisingBoolean = true
	}
	//取消确认
	public cancleSureAddAdvertising(){
		this.makeAddAdvertisingBoolean = false
	}
	//确认添加
	public makeSureAddAdvertising(){
		 
		this.$emit('changeActionList',this.TableSureList)
		this.makeAddAdvertisingBoolean = false
		this.$emit('changeAction',false)
		this.column = []
		this.columnSureList = []
		this.titleNameValue = ''
		this.tagValue = []
		this.tagSureList = []
		this.startTime = ''
		this.endTime = ''
		this.contentTypeValue = undefined
		this.userTableSelectedKeys = []
		this.TableSureList = []
	}
	//查看内容详情
	public showContentDetail:boolean = false
	public detailFlag:string = '1'
	public detailContentId:string = ''
	public lookContentDetail(contentId:string){
		this.detailContentId = contentId
		this.showContentDetail = true
	}
	public cancleDetailContent(value:boolean){
		this.showContentDetail = false
	}
}
</script>

<style lang="scss" scoped>

</style>