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
					@change="changeColumValue()"
					:multiple="true"
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
				<span style="text-align: center;">起止时间：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="6" :xxl="6">
				<a-range-picker
					style="width:100%;border-radius: 4px;margin-right: 8px;"
					valueFormat="YYYY-MM-DD"
					v-model:value="addTime"
					@change="disabledDateStart"/>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :xs="8" :sm="8" :xl="8" :xxl="8">
				<a-button type="primary" danger style="width:84px;border-radius: 4px;margin-right: 30px;" @click="queryTopicList">查询</a-button>
				<a-button danger style="width:84px;border-radius: 4px;" @click="resetProList">重置</a-button>
			</a-col>
		</a-row>
		<a-row :gutter="24">
			<a-col :xs="24" :sm="24" :xl="24" :xxl="24">
				<a-table
					style="margin-top:16px"
					:row-key="(record:any) => record.contentId"
					:row-selection="{ selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange}"
					:pagination="pagination"
					@change="changeProPage($event)"
					:columns="columns"
					:data-source="AdvertisingDataList">
					<template #subjectDescription="{text,record}">
						<span :class="!record.showMore?'ellips1':''">{{ text }}</span>
						<span v-if="!record.showMore" class="cursor" @click="LookSearchTopicDescription(text)">......查看更多>></span>
					</template>
					<template #action="{text,record}">
						<router-link :to="{path:'/content/contentDetail', query: { contentId: record.contentId }}" tag="a" target="_blank">
              <span style="color:blue">详情</span>
            </router-link>
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
		<a-modal v-model:visible="makeAddAdvertisingBoolean" >
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;border-radius: 4px;" @click="cancleSureAddAdvertising">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="makeSureAddTopic">确定</a-button>
			</template>
			<p style="padding: 30px 50px 30px 30px;">确定添加话题吗？</p>
    </a-modal>
		<a-modal v-model:visible="searchTopicDescription" >
			<template #footer>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="cancleTopicDescription">关闭</a-button>
			</template>
			<p style="padding: 30px 50px 30px 30px;">{{ topicDescriptionValue }}</p>
    </a-modal>
	</div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { TreeSelect } from 'ant-design-vue';
import { Prop } from 'vue-property-decorator';
import { computed } from 'vue'
import moment from 'moment';
import { AxiosRequestHeaders } from 'axios';
import { contentApi } from '@/libs/api'
import { message } from 'ant-design-vue';


export default class topicList extends Vue {
	public SHOW_PARENT = TreeSelect.SHOW_PARENT;
	@Prop({ default: false }) public topicForm!: boolean;
	public changePreviewForm =  computed(() => {
		this.getTopicList()
		this.getColumnList()
		this.getTagList()
  })
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
	public addTime:any = {}
	//开始时间
	public startTime: string = ''
	public disabledDateStart(current: any){
		this.startTime = this.addTime[0]
		this.endTime = this.addTime[1]
		 
		// if (this.endTime) {
    //   return current > moment(this.endTime).endOf('day');
    // } else {
    // }
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
	//获取话题列表
	public async getTopicList(){
		let params = {
			topicId:'',
			titleName:'',
			labelId:'',
			startTimeStr:'',
			endTimeStr:''
		}
		 
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
		await contentApi.getTopicContentList(params,header).then((res:any) => {
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data.map((item:any) => {
				if (item.subjectDescription.length > 15) {
					item.showMore = false
				} else {
					item.showMore = true
				}
				return item
			})
			 
		})
	}
	//产品列表表头
	public columns:any = [
		{
			title: '栏目分类',
			dataIndex: 'topicName',
			align: 'center',
			width:'100px'
		},
		{
			title: '标题名称',
			dataIndex: 'titleName',
			slots: { customRender: 'titleName' },
			align: 'center'
		},
		{
			title: '话题类型',
			dataIndex: 'subjectTypeName',
			slots: { customRender: 'subjectTypeName' },
			align: 'center',
			width:'100px'
		},
		{
			title: '话题描述',
			dataIndex: 'subjectDescription',
			slots: { customRender: 'subjectDescription' },
			align: 'center',
			width:'200px'
		},
		{
			title: '开始时间',
			dataIndex: 'subjectStartTime',
			slots: { customRender: 'subjectStartTime' },
			align: 'center',
			width:'150px'
		},
		{
			title: '结束时间',
			dataIndex: 'subjectEndTime',
			slots: { customRender: 'subjectEndTime' },
			align: 'center',
			width:'150px'
		},
		{
			title: '操作',
			dataIndex: 'action',
			slots: { customRender: 'action' },
			align: 'center',
			width:'80px'
		},
	]
	//产品列表数据
	public TableSureList:any = []
	public AdvertisingDataList:any[] = []
	public userTableSelectedKeys:any = []
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
			total:10, // 总数，必须先有
			showSizeChanger: true,
			showQuickJumper: true,
			pageSizeOptions: ["5", "10", "15", "20"],
			showTotal: (total:number) => `共 ${total} 条`, // 显示总
	}
	//查询产品列表
	public async queryTopicList(){
		let params = {
			topicId:this.columnSureList.toString(),
			labelId:this.tagSureList.toString(),
			titleName:this.titleNameValue,
			startTimeStr:this.startTime,
			endTimeStr:this.endTime
		}
		 
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = this.pagination.total;
      }
    }
		await contentApi.getTopicContentList(params,header).then((res:any) => {
			this.pagination.current = 1
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data.map((item:any) => {
				if (item.subjectDescription.length > 15) {
					item.showMore = false
				} else {
					item.showMore = true
				}
				return item
			})
		})
	}
	public async changeProPage(value:any){
		 
		this.pagination.current = value.current
		this.pagination.pageSize = value.pageSize
		let params = {
			topicId:this.columnSureList.toString(),
			labelId:this.tagSureList.toString(),
			titleName:this.titleNameValue,
			startTimeStr:this.startTime,
			endTimeStr:this.endTime
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
		await contentApi.getTopicContentList(params,header).then((res:any) => {
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data.map((item:any) => {
				if (item.subjectDescription.length > 15 && item.subjectDescription.length !== undefined) {
					item.showMore = false
				} else {
					item.showMore = true
				}
				return item
			})
		})
		
	}
	//重置产品列表
	public resetProList(){
		this.pagination.current = 1
		this.pagination.pageSize = 10
		this.getTopicList()
		this.column = []
		this.columnSureList = []
		this.titleNameValue = ''
		this.tagValue = []
		this.tagSureList = []
		this.startTime = ''
		this.endTime = ''
		this.userTableSelectedKeys = []
		this.TableSureList = []
	}
	//取消添加产品
	public cancleAddPro(){
		this.$emit('changeTopic',false)
		this.userTableSelectedKeys = []
	}
	//确认添加产品弹窗
	public makeAddAdvertisingBoolean:boolean = false
	//确认添加产品
	public addPro(){
		if (!this.userTableSelectedKeys.length) {
			message.info('请选择话题')
			return
		}
		this.makeAddAdvertisingBoolean = true
	}
	//取消确认
	public cancleSureAddAdvertising(){
		this.makeAddAdvertisingBoolean = false
	}
	//确认
	public makeSureAddTopic(){
		 
		this.$emit('changeTopicList',this.TableSureList)
		this.makeAddAdvertisingBoolean = false
		this.$emit('changeTopic',false)
		this.column = []
		this.columnSureList = []
		this.titleNameValue = ''
		this.tagValue = []
		this.tagSureList = []
		this.startTime = ''
		this.endTime = ''
		this.userTableSelectedKeys = []
		this.TableSureList = []
	}
	//查看话题描述详情
	public searchTopicDescription:boolean = false
	public topicDescriptionValue:any = ''
	public LookSearchTopicDescription(value:any){
		this.searchTopicDescription = true
		this.topicDescriptionValue = value
	}
	public cancleTopicDescription(){
		this.searchTopicDescription = false
	}
}
</script>

<style  scoped>
	.ellips1 {
		overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
	}
	.cursor {
		cursor: pointer;
		color: blue;
	}
</style>