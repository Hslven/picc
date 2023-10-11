<template>
    <div class="user-page" id="userPage">
        <!-- 域名管理 -->
        <div>
            <a-button class="add" @click="addbtn()">新增域名</a-button>
        </div>
        <!-- 域名table -->
        <div class="content">
            <a-table
                class="table"
                :dataSource="userTableData"
                :columns="userTableColumns"
                :pagination="userTablePagination"
                :loading="userTableLoading"
                @change="handleTableChange"
                :locale="locale"
                :row-key="(record:any) => record.rn"
                bordered
            >
                <template #bodyCell="{ record, column}">
                    <template v-if="column.key === 'operation'">
                        <!-- <a-button type="link" @click="handleUsing(record)" >{{ record.realm_name_status === '0' ? '停用' : "启用"  }}</a-button> -->
                        <a-button type="link" @click="handleDeleteUser(record)" style="color: #E8380D;"> 删除</a-button>
                    </template>
                </template>
                <!-- <template #status="{realm_name_status}">
                    <p>{{ record.realm_name_status === '0' ?  '启用' : '停用' }}</p>
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
									:disabled="item.label === '启用' && record.realm_name_status === '1' || item.label === '停用' && record.realm_name_status === '0'"
									@click="handleChoose(record,item.value,text)"
									>
									{{ item.label }}
								</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown>
				</template> -->
                <!-- <template #bodyCell="{ record, column}">
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleUsing(record)" >{{ record.realm_name_status === '0' ?  '启用' : '停用' }}</a-button>
                        <a-button type="link" @click="handleDeleteUser(record)"> 删除</a-button>
                    </template>
                </template> -->
            </a-table>
        </div>
        <!-- 新增域名弹框 -->
        <a-modal v-model:visible="showModal" title="新增域名" @ok="handleModalOk">
            <a-form :model="addFormState" ref="realmForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                <a-form-item label="域名" name="realmName" :rules="[{ required: true, message: '域名不能为空', trigger: 'blur' }]">
                    <a-textarea v-model:value="addFormState.realmName" showCount :maxlength="50" placeholder="请输入域名 如：example.picc.com" />
                    <div class="tip"> 域名需要完成备案,暂不支持添加泛域名</div>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { AxiosRequestHeaders } from 'axios';
import Encrypts from '@/libs/Encrypts';
import { systemManagementApi } from '@/libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode } from 'vue';
import { FormInstance, Empty, message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { global } from '@/libs/Global';
import { text } from 'stream/consumers';
import { log } from 'console';
interface UserTableType {
    realm_name: string;
    crt_user_name: string;
    crt_date: string;
    realm_name_id: string;
    realm_name_status: string;
}
interface Option {
    label: string;
    value: string;
}
interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showQuickJumper: true,
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

//操作
interface handleListType {
	key:string,
	value:string,
	label:string,
	disabled:boolean
}

interface AddFormType {
    realmName: string;
}
@Options({
    components: {
        ExclamationCircleOutlined,
        CloseOutlined,
        SearchOutlined,
        DeleteOutlined,
        PlusOutlined,
        ReloadOutlined,
        // data:{
        //     btnStatus: 0, 
        // }
    },
})
export default class User extends Vue {
[x: string]: any;
    @Ref('realmForm') readonly realmForm!: FormInstance;
    public showModal:boolean=false
    public permission: any = [];
    public userTableData = [] as any[];
    //初始化table表头
    public userTableColumns = [
        {
            title: '域名',
            dataIndex: 'realm_name',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '创建者',
            dataIndex: 'crt_user_name',
            align: 'center',
        },
        {
            title: '创建时间',
            dataIndex: 'crt_date',
            align: 'center',
        },
        {
            title: '操作',
			dataIndex: '操作',
			align: 'center',
            key: 'operation',
			// key:'operation',
			// fixed: 'right',
			// slots: { customRender: 'action' },
        },
    ];
    //分页
    // public userTablePagination: PaginationType = {
    //     current: 1,
    //     total: 0,
    //     pageSize: 10, //每页中显示10条数据
    //     showSizeChanger: true,
    //     showQuickJumper: true,
    //     pageSizeOptions: ['5', '10', '15', '20'], //每页中显示的数据
    //     showTotal: (total: number) => `共 ${total} 条`,//分页中显示总的数据
    // };

    public userTablePagination: PaginationType = {
        current: 1, //当前页数
        total: 0, //数据总数
        pageSize: 10, //每页中显示10条数据  每页条数
        //showLessItems   //是否显示较少页面内容
        //showQuickJumper  //是否可以快速跳转至某页
        //是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
        showSizeChanger: true, 
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '15', '20'], //每页中显示的数据 指定每页可以显示多少条
        showTotal: (total: number) => `共 ${total} 条`,//分页中显示总的数据 用于显示数据总量和当前数据顺序
    };
    public userTableLoading = false;

    //表单内容
    public created() {
        this.getPermsBtn(); // 权限
        this.getList();
    }

    //创建一个对象，判断如果满足条件就赋值，否者赋空
    public getPermsBtn() {
        let per: any = {};
        if (global.userInfo) {
            per = global.userInfo.permsBtn;
        }
        this.permission = per['user'] || [];
    }

    //查询域名列表
    public async getList(){
        //this.userTableLoading = true;
        // const params = {
        //     row4Page: this.userTablePagination.pageSize,
        //     nowPage: this.userTablePagination.current,
        // }
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            }
        }
        await systemManagementApi.findRealmName({},header).then((res: any) => {
            console.log('res',res.data)
            this.userTableLoading = false;
            this.userTablePagination.total = (res as any).recordsTotal;
            this.userTableData = res.data || [];
            this.userTableData.forEach((item:any)=>{
                let realm_name_id= item.realm_name_id
                console.log('23',realm_name_id)
            })
            console.log(res)
        })
    }

    //用户列表上一页、下一页
    public handleTableChange(pagination: PaginationType) {
        this.userTablePagination.current = pagination.current;
        this.userTablePagination.pageSize = pagination.pageSize;
        this.getList();
    }

    // 新增域名弹框确认
    public handleModalOk(record:any) {
        this.realmForm.validate().then(() => {
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认提交新增域名吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.addRealmName(record)
                    console.log('成功')
                },
                onCancel: () => {
                    this.showModal = false;
                }
            });
        });
    }

    public addRealmName(record:any){
        // 发请求 调用新增接口
        //this.userTableLoading = true;
        const params = {
            realmName: this.addFormState.realmName
            // id: record.short_link_id
        }
        console.log('211',params.realmName)
        systemManagementApi.addRealmName(params,{}).then((res) => {
            console.log('res',res.data)
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            message.success('新增成功');
            this.showModal = false;
            //this.destroyOnClose = false
            //this.getform.resetFields()//getform是创建的form实例
            this.getList();
        });
    }

    //打开新增弹框   
    public addbtn(){
        this.showModal=true
        this.addFormState.realmName = ''
        // this.$nextTick(()=>{
        //     this.realmName = '';
        //     //   this.addFormState.resetFields()
        // })
    }

    //新增的表单数据
    public addFormState:AddFormType={
        realmName:''
    }
    
    //删除用户
    public handleDeleteUser(record:any) {
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                //发请求 调用删除接口
                this.deleteRealmName(record)
            },
        });
    }
    public deleteRealmName(record:any){
        console.log('record',record)
        // 发请求 调用删除接口
        //this.userTableLoading = true;
        const params = {
            id: record.realm_name_id
        }
        console.log('123',params.id)
        systemManagementApi.deleteRealmName(params,{}).then((res) => {
            console.log(res,'res')
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    //启用、停用
    // public handleUsing(record:any) {
    //     let text = record.realm_name_status === '0' ?  '停用' : '启用';
    //     if(record.realm_name_status === '0'){
    //         Modal.confirm({
    //             title: '提示',
    //             icon: createVNode(ExclamationCircleOutlined),
    //             content: `您确定要停用吗？`,
    //             okText: '确定',
    //             cancelText: '取消',
    //             onOk: () => {
    //                 // this.btnStatus = this.btnStatus === 0 ? 1 : 0;
    //                 //启动的接口
    //                 this.updateRealmName(record)
    //             },
    //         });
    //     }else{
    //         Modal.confirm({
    //             title: '提示',
    //             icon: createVNode(ExclamationCircleOutlined),
    //             content: `您确定要启用吗？`,
    //             okText: '确定',
    //             cancelText: '取消',
    //             onOk: () => {
    //                 // this.btnStatus = this.btnStatus === 0 ? 1 : 0;
    //                 //启动的接口
    //                 this.updateRealmName(record)
    //             },
    //         });
    //     }
    // }
    // public updateRealmName(record:any){
    //     // 发请求 调用启用接口
    //     this.userTableLoading = true;
    //     const params = {
    //         realmNameStatus: record.realm_name_status === '0' ? '1' : '0' ,
    //         //realmNameStatus:'0',
    //         id : record.realm_name_id
    //         //id:'244884922922229760'
    //     }
    //     console.log(params)
    //     systemManagementApi.updateRealmName(params,{}).then((res) => {
    //         message.success('设置成功');
    //         this.userTablePagination.current = 1;
    //         this.userTablePagination.pageSize = 10;
    //         this.getList();
    //     });
    // }
}
</script>

<style lang="less" scoped>
.content{
    width: 99%;
	// height: 140px;
    margin-left: 6px;
	background: #FFFFFF;
}
.add{
    // width: 84px;
    // height: 32px;
    background: #E8380D;
    border-radius: 4px;
    margin-left: 16px;
    margin-top: 18px;
    margin-bottom: 13px;
    color: #ffffff;
}
// .table{
//     width: 958px;
//     height: 605px;
//     line-height: 20px;
//     background-color: rgba(225, 235, 249, 1);
//     color: rgba(0, 0, 0, 0.01);
//     font-size: 14px;
//     text-align: center;
//     font-family: Microsoft Yahei;
// }
.tip{
    color: #000;
}

/deep/.ant-table-pagination.ant-pagination {
    margin: 16px 0;
    margin-right: 10px;
}
</style>



