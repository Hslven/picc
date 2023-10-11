<!-- 运营位管理列表 -->
<template>
  <div>
		<div class="partition"></div>
		<div class="partition-btn">
      <a-button	
        type="primary"
        @click="addbtn()"
        danger
        class="operation-btn"
        style="width: 120px; background: #E8380D;"
        >新增内容分发</a-button>
      <a-button @click="shelfBtn" class="operation-btn">上架</a-button>
      <a-button danger @click="delList" class="operation-btn">批量删除</a-button>
		</div>
		<div class="query-question">
			<a-table
				:row-key="(record:any) => record.reachId"
				:row-selection="{ selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange }"
				:pagination="pagination"
				@change="changePage($event)"
				:columns="columns"
				:data-source="dataList">
				<template #reachDitch ="{ text }">
					<p>{{ text === '1' ? '百度小程序' : text === '2' ? '微信小程序' : text === '3' ? '微信公众号' : text === '4' ? '抖音' : text === '5' ? '快手' : text === '6' ? 'APP' : '' }}</p>
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
									:disabled="item.label === '下架' && record.reachStatus === '1' || item.label === '删除' && record.reachStatus === '0' || item.label === '上架' && record.reachStatus === '0' || item.label === '编辑' && record.reachStatus === '0' || item.label === '详情' && record.reachStatus === '1'"
									@click="handleChoose(record,item.value)"
									>
									{{ item.label }}
								</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown>
				</template>
			</a-table>
			<!-- <a-pagination v-model:current="current1" show-quick-jumper :total="500" @change="onChange" /> -->
			<a-modal
				style="background: #FFFFFF;border-radius: 6px;"
				v-model:visible="preBrowseVisible">
				<template #footer>
					<a-button danger style="width: 84px;border-radius: 4px;" @click="colseShelf" v-if="(popoverType === '2' && userTableSelectedKeys.length !== 0) || popoverType === '1' || popoverType === '3' ">取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureShelf">确定</a-button>
				</template>
				<p style="font-size: 16px;font-weight: 500;color: #333333;padding: 30px 50px 30px 30px;"
						>{{ popoverTypeName }}
				</p>
			</a-modal>
		</div>
	</div>
</template>
  
<script lang="ts">
import { operaTionApi } from '@/libs/api/index';
import { computed, } from 'vue';
import { Options, Vue } from 'vue-class-component';
import store from '@/modules/operation/store';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import { AxiosRequestHeaders } from 'axios';

interface handleListType {
	key:string,
	value:string,
	label:string,
	disabled:boolean
}
@Options({
	components:{
	}
})
export default class operationTable extends Vue {
	public created(): void {
		this.getList()
		this.getLabel()
		store.commit('changeEditTypeValue','0')
	}
	public states:any = store.state
	//table列表数据
	public dataList:any = computed(() => {
		const testList = this.states.changeOperationList
		return testList.operationList
	});

	public async getLabel(){
		let paramsLabel = {
				id:''
			}
			await operaTionApi.getLabelQuery(paramsLabel,{}).then((res) => {
				if(res.flag === 'success'){
					store.commit('changeIncludeTagList',res.data)
				} else if(res.flag === 'fail'){
					res.msg.forEach(jes => {
						message.info(jes)
					})
				}
			}).catch(() => {
			})
	}
	//初始化table表头
	public columns = [
		{
			title: '渠道',
			dataIndex: 'reachDitchName',
			slots: { customRender: 'reachDitchName' },
			align: 'center'
		},
		{
			title: '内容分发名称',
			dataIndex: 'reachName',
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
			dataIndex: 'mdfUser',
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
	public userTableSelectedKeys:string[] = []
	public onSelectChange  (selectedRowKeys:string[]) {
    this.userTableSelectedKeys = selectedRowKeys;
  };
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
	public router = useRouter()
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
			 
			this.router.push({ path:'operationDetail', query: { reachId: record.reachId }})
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
			let paramsClass = {
				id:''
			}
			await operaTionApi.getClassIfication(paramsClass,{}).then((res) => {
				if(res.flag === 'success'){
					store.commit('changeColumnList',res.data)
				}
			}).catch(() => {
			})
			let params = {
				reachId:record.reachId
			}
			await operaTionApi.getInfo(params,{}).then((res:any) => {
				store.commit('changeEditInfo',res.defmap)
				store.commit('changeEditTypeValue','1')
				this.$router.push('/operation/addOperation')
			})
		}
	}
	//分页
	public pagination:any = computed(() => {
		const testList = this.states.changeOperationList
		return testList.paginationValue
	})
	//监听点击分页
	public chooseParams = computed(() => {
		const testList = this.states.changeOperationList
		return testList.chooseType
	})
	//点击上一页下一页，重新查询数据
	public async changePage(e:any){
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = e.current;
        header.row4Page = e.pageSize;
      }
    }
		this.pagination.current = e.current
		await operaTionApi.getSelectReachMainInfo(this.chooseParams,header).then((res:any) => {
			 
			this.pagination.total = res.recordsTotal
			store.commit('changeOperationList',res.data)
		}).catch(() => {

		})
	}
	//新增
	public addbtn(){
		store.commit('changeTableContentList',[])
		store.commit('changeTableContentEditList','1')
		 
		store.commit('changeEditTypeValue','0')
		this.$router.push({
			path:'/operation/addOperation'
		})
		// setTimeout(function () {
		// 	window.location.reload();
		// }, 100);
	}
	public preBrowseVisible:boolean = false
	public dataSureList:any = {
		reachStatus:'',
		reachIds:[]
	}
	public reachIdsList:any = []
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
						message.info('请先去掉勾选已上架内容分发')
						return
					}
				}
			})
		})
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

	public popoverType:string = ''
	public popoverTypeName:string = ''
	
	//上架、删除、下架取消弹窗
	public colseShelf(){
		this.preBrowseVisible = false
	}
	//上架、删除、下架确认弹窗
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
							message.info('请先去掉勾选已上架内容分发')
							return
						}
					}
				})
			})
		}
		if(reachStatusType === true){
			this.preBrowseVisible = true
			this.popoverTypeName = '确认删除所选内容分发吗？'
		}
		// else {
		// 	this.preBrowseVisible = true
		// 	this.popoverTypeName = '确认删除所选运营位吗？'
		// }
	}

	//上架、下架
	public async changeUpStatus() {
		let params:any = this.dataSureList
		await operaTionApi.getChangeUpStatus(params,{}).then((res) => {
			message.info('操作成功')
			this.preBrowseVisible = false
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
				this.getList()
				message.info('删除成功')
			}
		}).catch(() => {

		})
	}
	public totalNumber:number = 10
	//查询列表数据
	public async getList() {
		let params = {
			reachDitchCode : '',
			reachName: '',
			reachStatus: '',
			mdfStartDate:'',
			mdfEndDate:''
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = this.pagination.total === 0 ? 10 : this.pagination.total;
      }
    }
		this.pagination.current = 1
		await operaTionApi.getSelectReachMainInfo(params,header).then((res:any) => {
			 
			this.pagination.total = res.recordsTotal
			this.userTableSelectedKeys = []
			store.commit('changeOperationList',res.data)
			store.commit('changePaginationValue',this.pagination)
		}).catch(() => {

		})
	}
}
</script>
  
<style lang="less">
.query-question{
	width: 100%;
	// height: 140px;
	background: #FFFFFF;
}
.partition-btn{
	margin: 20px 0;
}
.partition{
	width: 100%;
	height: 20px;
	background: #eee;
}
// .ant-checkbox-checked .ant-checkbox-inner{
// 	background-color: #E8380D;
// 	border-color: #E8380D
// }
:global(.ant-table-thead > tr > th){
text-align: center !important;
}
.ant-modal-content{
	box-shadow:
		0 0 0 0 rgba(0, 0, 0, 0.12),
		0 0 0 0 rgba(0, 0, 0, 0.08), 
		0 0 0 0 rgba(0, 0, 0, 0.05);
}
.operation-btn {
  margin-right: 20px;
  width: 100px;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
}
</style>