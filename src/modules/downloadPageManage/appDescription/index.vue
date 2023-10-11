<!-- 应用说明列表页 -->
<template>
	<div class="down-list">
		<div>
			<div class="appChoose">
				<a-row class="chooseRow">
					<a-col>
						<span class="chooseSpan">
							应用名称:
						</span>
						<a-input class="input" v-model:value="appName" placeholder="请输入"></a-input>
					</a-col>
					<a-col>
						<span class="chooseSpan">
							版本号:
						</span>
						<a-input class="input" v-model:value="appVersion" placeholder="请输入"></a-input>
					</a-col>
					<a-col>
						<span class="chooseSpan updateTime">
							更新时间:
						</span>
						<a-date-picker class="datebox" valueFormat="YYYY-MM-DD 00:00:00" v-model:value="appMdfDateStart"
							:disabledDate="disabledDateStart" placeholder="开始时间" />
						<span class="chooseSpan">至</span>
						<a-date-picker class="datebox" valueFormat="YYYY-MM-DD 23:59:59" v-model:value="appMdfDateEnd"
							:disabled-date="disableEndTime" placeholder="结束时间" />
					</a-col>
					<a-col class="chooseBtn-box">
						<a-button class="addAppBtn" type="primary" danger @click="queryBtn">查询
						</a-button>
						<a-button class="chooseBtn cancleBtn" @click="cancleBtn">重置
						</a-button>
					</a-col>
				</a-row>
			</div>
		</div>
		<!-- 选择部分结束 -->
		<div>
			<div>
				<a-row class="tableBtn">
					<a-col>
						<a-button class="addAppBtn" type="primary" @click="addbtn()" danger>新增应用说明
						</a-button>
					</a-col>
					<a-col>
						<a-button class=" deleteBtn" danger @click="delList">批量删除
						</a-button>
					</a-col>
				</a-row>
			</div>
			<div class="queryList">
				<a-table :columns="columns" :pagination="pagination" @change="changeProPage($event)" :data-source="dataList"
					:row-key="(record: any) => record.appId"
					:row-selection="{ selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange, }">
					<template #action="{ record }">
						<a @click="editApp(record)" class="editApp">编辑</a>
						<a @click="deleteApp(record)" class="deleteApp">删除</a>
					</template>
				</a-table>
			</div>
		</div>
		<a-modal style="background: #FFFFFF;border-radius: 6px;" v-model:visible="addSingleDeleteModal">
			<template #footer>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;"
					@click="closeSingleDelete">取消</a-button>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;"
					@click="sureSingleDelete">确定</a-button>
			</template>
			<p style="width: 176px;font-size: 16px;font-weight: 500;color: #333333;">
				确定删除所选数据吗？
			</p>
		</a-modal>
		<a-modal
				style="background: #FFFFFF;border-radius: 6px;"
				v-model:visible="addListDeleteModal">
				<template #footer>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="closeListDelete">取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureListDelete">确定</a-button>
				</template>
				<p style="width: 176px;font-size: 16px;font-weight: 500;color: #333333;">
          			确定删除所选数据吗？
				</p>
			</a-modal>
		<!-- 列表部分结束 -->
	</div>
</template>
<script lang="ts">
import { reactive, createVNode, computed, } from 'vue';
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import store from '@/modules/operation/store';
import { AxiosRequestHeaders } from 'axios';
import { downloadPageManageApi } from '@/libs/api';
import { useRouter } from 'vue-router'
import { ColumnProps, } from 'ant-design-vue/es/table';
import { message } from 'ant-design-vue';
type Key = ColumnProps['key'];
@Options({
	components: {
	}
})
export default class appDescription extends Vue {
	created() {
		this.getQueryAppDesc()
	}
	public getQueryAppDesc() {
		let param = {
			appName: '',
			appVersion: '',
			appMdfDateStart: '',
			appMdfDateEnd: '',
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
		downloadPageManageApi.getQueryAppDesc(param, header).then((res:any) => {
			 
			this.pagination.total = res.recordsTotal
			this.dataList = res.data
		})
	}

	public state = reactive<{
		selectedRowKeys: Key[];
		loading: boolean;
	}>({
		selectedRowKeys: [], // Check here to configure the default column
		loading: false,
	});


	public onSelectChange = (selectedRowKeys: string[]) => {
		this.userTableSelectedKeys = selectedRowKeys;
	};
	public router = useRouter()
	//应用名称
	public appName: string = '';
	//版本号
	public appVersion: string = '';
	//开始和结束时间
	public appMdfDateStart: string = '';
	public appMdfDateEnd: string = '';
	public pagination = {
		current: 1,
		pageSize: 10,
		defaultCurrent: 1, // 默认当前页数
		defaultPageSize: 10, // 默认当前页显示数据的大小
		total: 0, // 总数，必须先有
		showSizeChanger: true,
		showQuickJumper: true,
		pageSizeOptions: ["5", "10", "15", "20"],
		showTotal: (total: number) => `共 ${total} 条`, // 显示总
	}
	public changeProPage(value: any) {
		this.pagination.current = value.current;
		this.pagination.pageSize = value.pageSize;
		this.getQueryAppDesc();
	}
	//开始时间
	public disabledDateStart(current: any) {
		if (this.appMdfDateEnd) {
			return current > moment(this.appMdfDateEnd).endOf('day');
		} else {
		}
	}
	//结束时间
	public disableEndTime(current: any) {
		if (this.appMdfDateStart) {
			return (
				(current && current < moment(this.appMdfDateStart).subtract(1, 'days').endOf('day'))
			);
		}
	}
	//查询按钮
	public queryBtn() {
		this.getList()
	}
	//查询按钮里的方法
	public async getList() {
		let params = {
			appName: this.appName,
			appVersion: this.appVersion,
			appMdfDateStart: this.appMdfDateStart,
			appMdfDateEnd: this.appMdfDateEnd
		}
		 
		const header: any = {
			request: (header: AxiosRequestHeaders) => {
				header.nowPage = '1';
				header.row4Page = '10';
			}
		}
		 
		// debugger
		await downloadPageManageApi.getQueryAppDesc(params, {}).then((res) => {
			 
			this.dataList = res.data
		})
	}
	//重置按钮
	public cancleBtn() {
		this.appName = ''
		this.appVersion = ''
		this.appMdfDateStart = ''
		this.appMdfDateEnd = ''
		this.getQueryAppDesc()
	}

	public userTableSelectedKeys: string[] = [];
	//确定单条删除弹窗
	public addSingleDeleteModal: boolean = false
	//单条删除id
	public singleDeleteId: string = '';
	//确定批量删除弹窗
	public addListDeleteModal: boolean = false;
	//批量删除List
	public deleteObjList: any = [];
	//table列表数据
	public dataList: any = []
	//新增按钮
	public addbtn() {
		this.$router.push('/downloadPageManage/addAppDescription')
	}
	public preBrowseVisible: boolean = false
	public colseShelf() {
		this.preBrowseVisible = false
	}
	//初始化table表头
	public columns = [
		// {
		// 	title: '',
		// 	dataIndex: 'appId',
		// 	// slots: { customRender: 'reachDitch' },
		// 	align: 'center'
		// },
		{
			title: '应用名称',
			dataIndex: 'appName',
			align: 'center'
		},
		{
			title: '版本号',
			dataIndex: 'appVersion',
			align: 'center'
		},
		{
			title: '操作人',
			dataIndex: 'appDeveloper',
			align: 'center'
		},
		{
			title: '更新时间',
			dataIndex: 'appMdfDate',
			align: 'center'
		},
		{
			title: '操作',
			dataIndex: 'operate',
			align: 'center',
			slots: { customRender: 'action' }
		},
	];
	//点编辑按钮跳编辑页
	public editApp(record: any) {
		 

		// this.router.push({ path: 'operateCheck', query: { contentStatus: row.contentStatus, contentId: row.contentId } })
		// /downloadPageManage/editAppDescription
		this.router.push({ path: 'editAppDescription', query: { appId: record.appId } })
	}
	//单条删除按钮  根据appId删除对应内容
	public deleteApp(record: any) {
		this.addSingleDeleteModal = true;
		this.singleDeleteId = record.appId;
	}
	//单条删除确认
	public sureSingleDelete() {
		let delSinParam = {
			appId: this.singleDeleteId,//上面调接口查表数据里有的APPID
		}
		downloadPageManageApi.getDeleteAppDesc(delSinParam, {}).then((res) => {
			this.dataList = res.data;
			message.success('删除成功');
			this.addSingleDeleteModal = false;
      		this.getQueryAppDesc();
		})
	}
	//单条删除取消
	public closeSingleDelete() {
		this.addSingleDeleteModal = false;
	}
	//批量删除下载页
	public delList() {
		let flag = true;
		if (this.userTableSelectedKeys.length == 0) {
			message.error("请勾选要删除的数据！");
			flag = false;
		}
		if (flag) {
			this.addListDeleteModal = true;
		}
	}
	//批量删除取消
	public closeListDelete() {
		this.addListDeleteModal = false;
	}
	//批量删除确定
	public sureListDelete() {
		let params = {
			appIdList: this.userTableSelectedKeys
		}
		downloadPageManageApi.getBatchDeleteAppDesc(params,{}).then((res: any) => {
			this.addListDeleteModal = false;
			if (res.flag == "success") {
				message.success('删除成功');
				this.getList();
			} else {
				message.success('删除失败');
			}
			this.userTableSelectedKeys.length = 0
		})
	}

}

</script>
<style lang="less" scoped>

.down-list {
    padding: 0 13px;
}
//输入框
.input {
	margin-left: 3px;
	margin-right: 12px;
	width: 174px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #ABABAB;
}

//日期框
.datebox {
	margin-left: 5px;
	margin-right: 5px;
	width: 124px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #ABABAB;
}

//选择按钮整个框
.chooseBtn-box {
	margin-left: 10px;
}

//查询及重置按钮公共样式
.chooseBtn {
	width: 84px;
	height: 32px;
	border-radius: 4px;
}

//重置按钮
.cancleBtn {
	margin-left: 5px;
	border: 1px solid #BFBFBF;
}

//选择项一整行
.chooseRow {
	margin-top: 26px;
	margin-bottom: 26px;
}

//选择项中每个选择名称的span
.chooseSpan {
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Medium, PingFang-SC;
	font-weight: 500;
	color: #333333;
	line-height: 20px;
}

//更新时间的span
.updateTime {
	margin-right: 5px;
}

//新增按钮
.addAppBtn {
	height: 32px;
	background: #E8380D;
	border-radius: 4px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #FFFFFF;
	line-height: 20px;
}

//删除按钮
.deleteBtn {
	margin-left: 16px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #E8380D;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #E8380D;
	line-height: 20px;
}

//列表按钮 包括新增及删除
.tableBtn {
	margin-bottom: 15px;
}

//编辑按钮
.editApp {
	margin-right: 26px;
	width: 28px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #3F64F5;
	line-height: 20px;
}

//删除按钮
.deleteApp {
	width: 28px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #E8380D;
	line-height: 20px;
}
</style>