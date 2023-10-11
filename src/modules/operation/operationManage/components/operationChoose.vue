<!-- 运营位管理查询表 -->
<template>
	<div class="choose">
		<div class="choose-select">
			<a-row>
				<a-col :span="4">
					<span>渠道：</span>
					<a-select v-model:value="ditch" style="width: 60%;border-radius: 4px;">
						<a-select-option v-for="item in ditchList" :key="item.id">{{ item.label }}</a-select-option>
					</a-select>
				</a-col>
				<a-col :span="5">
					<span>内容分发名称：</span>
					<a-input style="width:50%;border-radius: 4px;" v-model:value="operationName"
						placeholder="请输入" />
				</a-col>
				<a-col :span="5">
					<span>内容分发状态：</span>
					<a-select ref="select" v-model:value="operationState" style="width: 50%;border-radius: 4px;">
						<a-select-option v-for="item in operationStateList" :key="item.id">{{ item.label}}</a-select-option>
					</a-select>
				</a-col>
				<a-col :span="10">
					<span>更新时间：</span>
					<a-date-picker
						style="width:30%;border-radius: 4px;margin-right: 8px;"
						valueFormat="YYYY-MM-DD 00:00:00"
						v-model:value="startTime"
						:disabledDate="disabledDateStart"
						placeholder="开始时间" />
					<span>至</span>
					<a-date-picker
						style="width:30%;border-radius: 4px;margin-left:8px"
						valueFormat="YYYY-MM-DD 23:59:59"
						v-model:value="endTime"
						:disabled-date="disableEndTime"
						placeholder="结束时间" />
				</a-col>
			</a-row>
		</div>
		<div class="choose-btn">
			<a-button type="primary" danger style="width:84px;border-radius: 4px;height: 32px;"
				@click="queryBtn">查询</a-button>
			<a-button style="width:84px;border-radius: 4px;height: 32px;margin-left: 20px;" @click="cancleBtn">重置</a-button>
		</div>
	</div>
</template>
  
<script lang="ts">
import { operaTionApi } from '@/libs/api/index';
import store from '@/modules/operation/store';
import moment from 'moment';
import { AxiosRequestHeaders } from 'axios';
import { Options, Vue } from 'vue-class-component';

// import { getReachContent } from '@/libs/request';

interface ditchListType {
	label:string,
	value:string,
	id:string
}
@Options({
	components: {
	}
})
export default class operation extends Vue {
	public created(): void {
		this.ditch = '0'
		this.operationState = '2'
	}
	//渠道v-model
	public ditch: string = ''
	//渠道下拉框列表数据
	public ditchList:ditchListType[] = [
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
	// 查询按钮
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
        header.nowPage = 1;
        header.row4Page = 10;
      }
    }
		await operaTionApi.getSelectReachMainInfo(params,header).then((res:any) => {
			const PaginationValue = {
				current:1,
				defaultCurrent: 1, // 默认当前页数
				defaultPageSize: 10, // 默认当前页显示数据的大小
				total: res.recordsTotal, // 总数，必须先有
				showSizeChanger: true,
				showQuickJumper: true,
				pageSizeOptions: ["5", "10", "15", "20"],
				showTotal: (total:number) => `共 ${total} 条`, // 显示总
			}
			store.commit('changeOperationList',res.data)
			store.commit('changeChooseType',params)
			store.commit('changePaginationValue',PaginationValue)
		}).catch(() => {

		})
	}
	// public store = useStore()
	public queryBtn() {
		this.getList()
		// this.getTest()
	}
	//重置按钮
	public cancleBtn() {
		this.ditch = '0'
		this.operationName = ''
		this.operationState = '2'
		this.startTime = ''
		this.endTime = ''
		this.getList()
	}
}
</script>
  
<style lang="less" scoped>
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
</style>