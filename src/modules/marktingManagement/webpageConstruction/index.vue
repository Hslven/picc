<template>
	<div >
		<div class="padding_10">
			<a-row>
				<a-col :span="12" style="display: flex;justify-content: start;align-items: center;">
					<a-button	
						type="primary"
						@click="addbtn()"
						danger
						style="height: 33px;background: #E8380D;border-radius: 4px;margin-right: 2%;"
						>
						<div style="display: flex;justify-content: center;align-items: center;">
							<img  style="width:20px;height: 20px;margin-right: 7px;" src="../../assets/addWhite.png" alt="">
							新增
						</div>
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
						v-model:value="titleName"
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
		<!-- 选择部分结束 -->
        <div class="undiv">
            
        </div>


		<div>
			<div class="queryList">
				<a-table :columns="columns" :pagination="false" :data-source="dataList" :bordered="false"
					:row-key="(record: any) => record.buildingId"
					@change="changePage($event)"
					>
					
					<template #bodyCell="{ column,record }">
					<template v-if="column.dataIndex === 'operate'">
						<a-dropdown :trigger="['click']">
							<a class="ant-dropdown-link" @click.prevent>
                            <p style="font-size: 26px;height: 30px;margin: 0;">···</p>
                            </a>
							<template #overlay>
                            <a-menu>
                                <a-menu-item
                                    :key="item.key"
									
									v-for="item in handleList.filter(item => ['链接', '下载', '删除'].includes(item.label))"
                                    @click="handleChooseFc(record,item.value)"   
									:class="{'copy-botton-short': item.label === '链接'}"    
									:data-clipboard-text="item.label === '链接' ? (imgUrl + '/dop/iug/zuul/content/file/preview/m/' + record.buildingLink) : null"
                                    >
                                    {{ item.label }}
                                </a-menu-item>
                            </a-menu>
                        </template>	
						</a-dropdown>
					</template>	
					<template v-if="column.dataIndex === 'titleContent'">
						
						<a  @click="editApp(record)" class="editApp" :title="record.titleContent">{{ record.titleContent }}</a>
					</template>	
				</template>
				</a-table>
				<paginations  @changePage="changePage"       :prop-name="pagination"
 />
			</div>
		</div>
		<a-modal style="background: #FFFFFF;border-radius: 6px;padding-bottom: 0px;" v-model:visible="addSingleDeleteModal">
			<template #footer>
				<a-button  style="width: 84px;border-radius: 4px;"
					@click="closeSingleDelete">取消</a-button>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;"
					@click="sureSingleDelete">确定</a-button>
			</template>
			<p style="width: 176px;font-size: 16px;font-weight: 500;color: #333333;">
				确定删除所选数据吗？
			</p>
		</a-modal>
		<a-modal
				style="background: #FFFFFF;border-radius: 6px;padding-bottom: 0px;"
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
		<a-drawer v-model:visible="showEditWebpageConstruction" class="custom-class webpageConstructionEditDrawer " placement="right" :width="darwerWidth"  :title="title" :closable="false">
			<editWebpageConstruction 
    @cancelAdd="cancelAdd"  
    :prop-name="showAddWebpageConstruction ? newWebPageId : editBuildData" />
        </a-drawer>


				<!-- 筛选搜索条件弹窗 -->
				<a-drawer
			v-model:visible="showScreeningCondition"
			class="custom-class webpageConstructionDrawer"
			placement="right"
			width="450"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_title">
					<div>
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/Systems.png" alt="">
						<span style="font-size: 16px;">筛选设置</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="showScreeningCondition=false">
						<img style="width: 15px;height: 10px;" src="../../assets/addBack.png" alt="">
					</a-button>
				</div>
			</template>
			<div class="ScreeningCondition">
				<a-row style="margin: 24px 0px;">
					<a-col :span="6" style="display: flex;justify-content: center;align-items: center;">开始时间</a-col>
					<a-col :span="18">
						<a-date-picker
							style="width: 70%;border-radius: 4px;"
							valueFormat="YYYY-MM-DD 00:00:00"
							v-model:value="startDate"
							:disabledDate="disabledDateStart"
							placeholder="开始时间" />
					</a-col>
				</a-row>
				<a-row style="margin: 24px 0px;">
					<a-col :span="6" style="display: flex;justify-content: center;align-items: center;">结束时间</a-col>
					<a-col :span="18">
						<a-date-picker
							style="width: 70%;border-radius: 4px;"
							valueFormat="YYYY-MM-DD 23:59:59"
							v-model:value="endDate"
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
	</div>
</template>
<script lang="ts">
import { reactive, createVNode, computed,ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import store from '@/modules/operation/store';
import { AxiosRequestHeaders } from 'axios';
import { webpageConstructionApi } from '@/libs/api';
import { useRouter } from 'vue-router'
import { ColumnProps, } from 'ant-design-vue/es/table';
import { localStorage } from '@/libs/Storage';
import { message } from 'ant-design-vue';
import Clipboard from 'clipboard'
import { imgUrl } from '@/libs/getImgUrl'
import addWebpageConstruction from '../addWebpageConstruction/index.vue'
import editWebpageConstruction from '../editWebpageConstruction/index.vue'
import { UnorderedListOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { handleChoose,handleList,getFilteredList } from '@/libs/webpageConstruction/operate';
import paginations from '@/modules/components/pagination.vue'
const generateUniqueValue = (): string => {
          return new Date().getTime().toString() + Math.random().toString(36).substring(2);
};        
type Key = ColumnProps['key'];
@Options({
	components: {
		addWebpageConstruction,
		SearchOutlined,
		paginations,
		editWebpageConstruction
	}
})
export default class webDescription extends Vue {
	created() {
		this.getQuerywebDesc()
		this.darwerWidth = window.innerWidth - 255
		// console.log(handleList,3333333)

	}
    public handleChooseFc = (record:any,item:any) => {
		// handleChoose(record,item,{deleteApp: this.deleteApp})
		if(item === '4'){
			this.deleteApp(record);
		}
		if(item === '6'){
			this.openPage(record);
		}	
		if(item === '5'){
		this.copyText('short');
	}	    
    };
	public getQuerywebDesc() {
		const param = {
			titleName:'',
			startDate:'',
			endDate:'',
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
	webpageConstructionApi.queryWebBuildingByList(param, header).then((res:any) => {
			console.log('查询列表数据', res)
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
		console.log(selectedRowKeys)
		this.userTableSelectedKeys = selectedRowKeys;
	};
	public router = useRouter()
	public handleList = handleList;
	//网页名称
	public titleName = '';
	//版本号
	public appVersion = '';
	//开始和结束时间
	public startDate = '';
	public darwerWidth = 0;
	public showAddWebpageConstruction = false;
	public showEditWebpageConstruction = false;
	public title = this.showAddWebpageConstruction ? "网页搭建" : "网页搭建";

	public endDate = '';
	public pagination = {
		current: 1,
		pageSize: 10,
		defaultCurrent: 1, // 默认当前页数
		defaultPageSize: 10, // 默认当前页显示数据的大小
		total: 0, // 总数，必须先有
		showSizeChanger: true,
		showQuickJumper: true,
		pageSizeOptions: ['5', '10', '15', '20'],
		showTotal: (total: number) => `共 ${total} 条`, // 显示总
	}
	public changePage(e: any) {
		// this.pagination.current = value.current;
		// this.pagination.pageSize = value.pageSize;
		this.pagination.current = e
    // this.pagination.pageSize = e.pageSize
    // this.getList()
		this.getQuerywebDesc();
	}
	//开始时间
	public disabledDateStart(current: any) {
		if (this.endDate) {
			return current > moment(this.endDate).endOf('day');
		} else {
		}
	}
	//结束时间
	public disableEndTime(current: any) {
		if (this.startDate) {
			return (
				(current && current < moment(this.startDate).subtract(1, 'days').endOf('day'))
			);
		}
	}
	//查询按钮
	public queryBtn() {
		this.getList()
	}
	//查询按钮里的方法
	public async getList() {
		const params = {
			titleName: this.titleName,
			startDate: this.startDate,
			endDate: this.endDate

		}
		console.log('查询入参', this.titleName)
		const header: any = {
			request: (header: AxiosRequestHeaders) => {
				header.nowPage = '1';
				header.row4Page = '10';
			}
		}
		console.log(params, 'params')
		// debugger
		await webpageConstructionApi.queryWebBuildingByList(params, {}).then((res:any) => {
			console.log('按条件查询列表数据', res)
			this.dataList = res.data
		})
	}
	//重置按钮
	public cancleBtn() {
		this.titleName = ''
		this.startDate = ''
		this.endDate = ''
		this.getQuerywebDesc()
	}

	public userTableSelectedKeys: string[] = [];
	//确定单条删除弹窗
	public addSingleDeleteModal = false
	//单条删除id
	public buildingId: string[] = [];
	public imgUrl = imgUrl;

	//确定批量删除弹窗
	public addListDeleteModal = false;
	//批量删除List
	public deleteObjList: any = [];
	//table列表数据
	public dataList: any = []

	public newWebPageId = ref<any>('');

	public showScreeningCondition = false;
	
	public editBuildData = ref<Array<any>>([
    ]);

	//新增网页id
	//新增按钮
	public addbtn() {
		// this.$router.push('/marktingManagement/addWebpageConstruction')
		this.newWebPageId = generateUniqueValue()
		this.showAddWebpageConstruction = true
		this.showEditWebpageConstruction = true
		
	}
	public preBrowseVisible = false
	public colseShelf() {
		this.preBrowseVisible = false
	}
	public search(){
		this.showScreeningCondition = true
	}
	//初始化table表头
	public columns = [
	   {
			title: '操作',
			dataIndex: 'operate',
			align: 'center',
			width: 100,
			// slots: { customRender: 'action' }
		},	
		{
			title: '页面标题',
			dataIndex: 'titleContent',
			align: 'center',
			ellipsis: true,
		},
		{
			title: '更新时间',
			dataIndex: 'mdf_date',
			align: 'center',
			width: 220,

		},

	];
	//点编辑按钮跳编辑页
	public editApp(record: any) {
		// console.log('传入的record对象', record);
		// localStorage.set('editBuildData',record)
		this.editBuildData = record
		this.showAddWebpageConstruction = false

		// console.log(this.editBuildData)
		this.showEditWebpageConstruction = true
		// this.$router.push('/marktingManagement/editWebpageConstruction')
	}
	// public openPage(record: any) {
	// 	const link = document.createElement('a');
	// 	const url = this.imgUrl+'/dop/iug/zuul/content/file/preview/m/' + record.buildingLink
    //     // 这里是将链接地址url转成blob地址，
    //     fetch(url).then(res => res.blob()).then(blob => { 
    //         link.href = URL.createObjectURL(blob)
    //         // 下载文件的名称及文件类型后缀
    //         link.download = url; 
    //         document.body.appendChild(link)
    //         link.click()
    //         //在资源下载完成后 清除 占用的缓存资源
    //         window.URL.revokeObjectURL(link.href);
    //         document.body.removeChild(link);
    //     });

    //   // 释放创建的 URL 对象
    //   URL.revokeObjectURL(url);
	// }

   public async openPage(record: any) {
    try {
        const link = document.createElement('a');
        const url = this.imgUrl + '/dop/iug/zuul/content/file/preview/m/' + record.buildingLink;
		// console.log(url,'url')
        // 使用fetch从URL获取blob
        const response = await fetch(url);
        const blob = await response.blob();

        // 获取页面标题
        const pageTitle = record.titleContent;

        // 使用moment.js格式化当前日期时间
        const formattedDate = moment().format('YYYYMMDD HH:mm:ss');

        // 创建下载文件名
        const filename = `${pageTitle}-${formattedDate.replace(/[:\s]/g, '')}`; // 移除冒号和空格

        // 从blob创建一个临时URL
        const blobUrl = URL.createObjectURL(blob);
        
        // 设置下载链接和下载文件名
        link.href = blobUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        // 清理
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);

			} catch (error) {
				console.error('Error downloading the file:', error);
				message.error('下载文件时发生错误。请重试。');
				// alert('下载文件时发生错误。请重试。');
			}
		}

	public copyText( param: string ) {
        // const target = param === 'long' ? '.copy-botton-long' : '.copy-botton-short';
        const clipboard = new Clipboard('.copy-botton-short')
		// console.log(clipboard,'clipboard')
        clipboard.on('success', () => {
            message.info('复制链接成功');
            // 释放内存
            clipboard.destroy()
        })
        clipboard.on('error', () => {
            // 释放内存
			message.info('没有链接');
	
            clipboard.destroy()
        })
    }
	//单条删除按钮  根据appId删除对应内容
	public deleteApp(record: any) {
		this.addSingleDeleteModal = true;
		this.buildingId = record.buildingId;
	}
	//单条删除确认
	public sureSingleDelete() {
		const buildingIdArray = [this.buildingId]; // 创建一个包含 buildingId 的数组

		const delSinParam = {
			buildingIds:buildingIdArray,//上面调接口查表数据里有的APPID
		}
		
		webpageConstructionApi.addOrDelWebBuilding(delSinParam, {}).then((res:any) => {
			this.dataList = res.data;
			message.success('删除成功');
			this.getQuerywebDesc();
			this.addSingleDeleteModal = false;
		})
	}
	public sureListDelete() {
		
		const params = {
			buildingIds: this.userTableSelectedKeys
		}
	
		webpageConstructionApi.addOrDelWebBuilding(params,{}).then((res: any) => {
			this.addListDeleteModal = false;
			if (res.flag == 'success') {
				message.success('删除成功');
				this.getList();
			} else {
				message.error('删除失败');
			}
			this.userTableSelectedKeys.length = 0
		})
	}
	public closeListDelete() {
		this.addListDeleteModal = false;
	}
	//单条删除取消
	public closeSingleDelete() {
		this.addSingleDeleteModal = false;
	}
	public cancelAdd(value: boolean, type: string) {

			this.getQuerywebDesc()
		
		this.showEditWebpageConstruction = false
        this.showAddWebpageConstruction = false

		// if(type=='0'){
        // this.showAddWebpageConstruction = false
		// }else{
		// this.showEditWebpageConstruction = false
		// }

    }
	public delList() {
		let flag = true;
		if (this.userTableSelectedKeys.length == 0) {
			message.error('请勾选要删除的数据！');
			flag = false;
		}
		if (flag) {
			this.addListDeleteModal = true;
		}
	}

	

}

</script>
<style lang="less" scoped>
//输入框
/deep/ .ant-modal{
	padding-bottom: 0px;
}

/deep/ .ant-table-tbody > tr > td{

}
.input {
	margin-left: 3px;
	margin-right: 12px;
	width: 225px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #ABABAB;
    margin-right: 225px;
}
.undiv{
    height: 10px;
    width: 100%;
    position: relative;
    clear: both;
	background-color: #F5F5F5;

}
.padding_10{
	padding:10px
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
.ScreeningCondition_title{
	display: flex;
	justify-content: space-between;
	align-items: center;

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

}
.queryList{
		padding: 16px 16px 0px 16px;
		// position: relative;
		overflow: auto;
		width: 100%;
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
.normal{
	background: #E8380D;

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
	margin-bottom: 20px;
}

//编辑按钮
.editApp {
	margin-right: 26px;
	width: 28px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	// color: #3F64F5;
	line-height: 20px;
}
.editApp:active,.editApp:hover {
	color: #3F64F5;
	text-decoration: underline;
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