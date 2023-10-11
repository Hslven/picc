<template>
    <div class="role-page" id="rolePage">
        <div class="tool-wrap mb24">
            <a-row type="flex" justify="space-between">
                <a-col :lg="14" :xl="14" class="mt24">
                    <a-form ref="queryForm" :model="queryFormState" :label-col="{style: { width: '70px' }}">
                        <a-row :gutter="20">
                            <a-col :md="8" :lg="12" :xl="10">
                                <a-form-item label="角色名称" name="role_name">
                                    <a-input v-model:value="queryFormState.role_name" placeholder="请输入角色名称" allowClear />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :lg="12" :xl="10">
                                <a-form-item label="所属应用" name="app_id">
                                    <a-select
                                            v-model:value="queryFormState.app_id"
                                            :options="appSelectOption"
                                            show-search
                                            :filter-option="filterOption"
                                            placeholder="请选择所属应用"
                                            allowClear
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-col>
                <a-col class="mt24">
                    <a-row>
                        <a-col class="w90">
                            <a-button type="primary" block @click="getRoleList">
                                <template #icon>
                                    <SearchOutlined />
                                </template>
                                查询
                            </a-button>
                        </a-col>
                        <a-col class="w90 ml10">
                            <a-button type="primary" block @click="reset">
                                <template #icon>
                                    <ReloadOutlined />
                                </template>
                                重置
                            </a-button>
                        </a-col>
                        <a-col v-if="permission.includes('add')" class="w90 ml10">
                            <a-button type="primary" block @click="openAddRoleDrawer">
                                <template #icon>
                                    <PlusOutlined />
                                </template>
                                新增
                            </a-button>
                        </a-col>
                        <a-col v-if="permission.includes('delete')" class="w90 ml10">
                            <a-button block danger @click="handleDeleteRole">
                                <template #icon>
                                    <DeleteOutlined />
                                </template>
                                删除
                            </a-button>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <a-table
                :dataSource="roleTableData"
                :columns="roleTableColumns"
                :loading="roleTableLoading"
                :pagination="roleTablePagination"
                @change="handleRoleTableChange"
                :row-key="(record) => record.role_id"
                :row-selection="{selectedRowKeys:roleTableSelectedKeys,onChange:onRoleTableSelectChange}"
                bordered
        >
            <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'operation'">
                    <a v-if="permission.includes('edit')" class="btn-edit" @click="edit(record)">编辑</a>
                </template>
            </template>
        </a-table>
        <a-drawer
                v-model:visible="showAddRoleDrawer"
                title="新增角色"
                placement="right"
                :closable="false"
                :maskClosable="false"
                width="80%"
        >
            <template #extra>
                <close-outlined @click="showAddRoleDrawer = false" />
            </template>
            <a-form ref="addRoleForm" :model="addRoleFormState" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
                <a-form-item label="所属应用" name="app_id" :rules="[{ required: true, message: '所属应用不能为空', trigger: 'change' }]">
                    <a-select
                            v-model:value="addRoleFormState.app_id"
                            :options="appSelectOption"
                            placeholder="请选择所属应用"
                            show-search
                            :filter-option="filterOption"
                            allowClear
                    />
                </a-form-item>
                <a-form-item label="角色类型" name="role_type" :rules="[{ required: true, message: '角色类型不能为空', trigger: 'change' }]">
                    <a-select v-model:value="addRoleFormState.role_type" placeholder="请选择角色类型" allowClear>
                        <a-select-option value="ADMIN">系统管理员</a-select-option>
                        <a-select-option value="USER">普通用户</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="角色名称" name="role_name" :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]">
                    <a-input v-model:value="addRoleFormState.role_name" placeholder="请输入角色名称" allowClear />
                </a-form-item>
                <!--            <a-form-item label="互斥角色" name="mutex_role" required :rules="[{ required: true, message: '互斥角色不能为空', trigger: 'change' }]">-->
                <!--                <a-input v-model:value="addRoleFormState.mutex_role" placeholder="请输入描述信息" allowClear  />-->
                <!--            </a-form-item>-->
<!--                <a-form-item label="开始时间" name="start_date">-->
<!--                    <a-date-picker v-model:value="addRoleFormState.start_date" value-format="YYYY-MM-DD" placeholder="请选择开始时间" allowClear />-->
<!--                </a-form-item>-->
<!--                <a-form-item label="结束时间" name="end_date">-->
<!--                    <a-date-picker v-model:value="addRoleFormState.end_date" value-format="YYYY-MM-DD" placeholder="请选择结束时间" allowClear />-->
<!--                </a-form-item>-->
                <a-form-item label="备注" name="patch_memo">
                    <a-textarea v-model:value="addRoleFormState.patch_memo" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请输入描述信息" allowClear />
                </a-form-item>
            </a-form>
            <template #footer>
                <a-space :size="8">
                    <a-button @click="showAddRoleDrawer = false">取消</a-button>
                    <a-button type="primary" :loading="addRoleBtnLoading" @click="onAddRoleConfirm">保存</a-button>
                </a-space>
            </template>
        </a-drawer>
        <a-drawer
                v-model:visible="showEditRoleDrawer"
                title="编辑角色"
                placement="right"
                :closable="false"
                :maskClosable="false"
                getContainer="#rolePage"
                width="80%"
        >
            <template #extra>
                <close-outlined @click="showEditRoleDrawer = false" />
            </template>
            <a-row :gutter="32">
                <a-col :span="10">
                    <a-form
                            ref="editRoleForm"
                            :model="editRoleFormState"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 15 }"
                    >
                        <a-form-item label="所属应用" name="app_id" :rules="[{ required: true, message: '所属应用不能为空', trigger: 'change' }]">
                            <a-select
                                    v-model:value="editRoleFormState.app_id"
                                    :options="appSelectOption"
                                    placeholder="请选择所属应用"
                                    show-search
                                    :filter-option="filterOption"
                                    allowClear
                                    disabled
                            />
                        </a-form-item>
                        <a-form-item label="角色名称" name="role_name" :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]">
                            <a-input v-model:value="editRoleFormState.role_name" placeholder="请输入角色名称" allowClear />
                        </a-form-item>
                        <a-form-item label="角色类型" name="role_type" required>
                            <a-select v-model:value="editRoleFormState.role_type" placeholder="请选择角色类型" disabled>
                                <a-select-option value="ADMIN">系统管理员</a-select-option>
                                <a-select-option value="USER">普通用户</a-select-option>
                            </a-select>
                        </a-form-item>
<!--                        <a-form-item label="互斥角色" name="mutex_role">-->
<!--                            <a-input v-model:value="editRoleFormState.mutex_role" placeholder="请选择互斥角色" />-->
<!--                        </a-form-item>-->
<!--                        <a-form-item label="开始时间" name="start_date">-->
<!--                            <a-date-picker v-model:value="editRoleFormState.start_date" value-format="YYYY-MM-DD" placeholder="请选择开始时间" allowClear />-->
<!--                        </a-form-item>-->
<!--                        <a-form-item label="结束时间" name="end_date">-->
<!--                            <a-date-picker v-model:value="editRoleFormState.end_date" value-format="YYYY-MM-DD" placeholder="请选择结束时间" allowClear />-->
<!--                        </a-form-item>-->
                        <a-form-item label="备注" name="patch_memo">
                            <a-textarea v-model:value="editRoleFormState.patch_memo" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请输入描述信息" allowClear />
                        </a-form-item>
                    </a-form>
                    <a-row justify="center">
                        <a-col class="w90">
                            <a-button block type="primary" :loading="editRoleSaveBtnLoading" @click="editRoleSave">保存</a-button>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="14">
                    <div class="tab-container">
                        <a-tabs v-model:activeKey="activeKey" type="card" @change="changeTab">
                            <a-tab-pane key="1" tab="用户">
                                <div class="user-tab-con">
                                    <a-row style="margin-bottom: 16px;">
                                        <a-col class="w90">
                                            <a-button type="primary" block @click="openAddUserDrawer">添加</a-button>
                                        </a-col>
                                        <a-col class="w90" :offset="1">
                                            <a-button block danger @click="handleDeleteAssignedUser">删除</a-button>
                                        </a-col>
                                    </a-row>
                                    <a-table
                                            :dataSource="assignedUserTableData"
                                            :columns="assignedUserTableColumns"
                                            :loading="assignedUserTableLoading"
                                            :pagination="assignedUserTablePagination"
                                            @change="handleAssignedUserTableChange"
                                            :scroll="{y: 500 }"
                                            :row-key="(record) => record.pk_uuid"
                                            :row-selection="{ selectedRowKeys: assignedUserTableSelectedKeys, onChange: onAssignedUserTableSelectChange }"
                                    >
                                    </a-table>
                                </div>
                            </a-tab-pane>
                            <a-tab-pane v-for="item in tabList" :key="item.enum_code" :tab="item.enum_name" >
                                <div class="tree-tab-con">
                                    <a-spin :spinning="spinning">
                                        <template v-if="treeData.length>0&&!spinning">
                                            <a-tree
                                                    :tree-data="treeData"
                                                    :field-names="fieldNames"
                                                    checkable
                                                    :checkedKeys="checkedKeys"
                                                    :expandedKeys="expandedKeys"
                                                    @check="onTreeCheckedChange"
                                                    @expand="onExpand"
                                                    style="max-height: 67vh;overflow: auto;"
                                            >
                                            </a-tree>
                                            <a-row class="btn-wrap">
                                                <a-col class="w90">
                                                    <a-button type="primary" block @click="menuPermissionSave" :loading="addMenuPermissionBtnLoading">保存</a-button>
                                                </a-col>
                                            </a-row>
                                        </template>
                                        <a-empty :image="simpleImage" v-if="treeData.length===0&&!spinning" />
                                    </a-spin>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </a-col>
            </a-row>
        </a-drawer>
        <a-drawer
                v-model:visible="showAddUserDrawer"
                title="添加角色的用户"
                width="80%"
                getContainer="#rolePage"
                placement="right"
                :closable="false"
                :maskClosable="false"
        >
            <template #extra>
                <close-outlined @click="showAddUserDrawer = false" />
            </template>
            <a-row type="flex" justify="space-between">
                <a-col>
                    <a-form ref="queryForm" :model="userListQueryParams">
                        <a-row :gutter="20">
                            <a-col :md="6" :lg="5" :xl="5">
                                <a-form-item label="角色名称">
                                    <a-input v-model:value="editRoleFormState.role_name" placeholder="请输入角色名称" disabled/>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :lg="5" :xl="5">
                                <a-form-item label="角色类型">
                                    <a-input v-model:value="editRoleFormState.role_type" placeholder="请选择角色类型" disabled/>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :lg="7" :xl="8">
                                <a-form-item label="用户登录账号">
                                    <a-input v-model:value="userListQueryParams.user_id" placeholder="请输入用户登录账号" allowClear/>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :lg="6" :xl="6">
                                <a-form-item label="用户名称">
                                    <a-input v-model:value="userListQueryParams.user_name" placeholder="请输入用户名称" allowClear/>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
            <a-row justify="center">
                <a-col class="w90 mb24">
                    <a-button type="primary" block @click="getUserList">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        查询
                    </a-button>
                </a-col>
            </a-row>
            <a-table
                    :dataSource="userTableData"
                    :columns="userTableColumns"
                    :loading="userTableLoading"
                    :pagination="userTablePagination"
                    @change="handleUserTableChange"
                    :scroll="{y: 300 }"
                    :row-key="(record) => record.pk_uuid"
                    :row-selection="{ selectedRowKeys: userTableSelectedKeys, onChange: onUserTableSelectChange }"
            >

            </a-table>
            <template #footer>
                <a-space :size="8">
                    <a-button @click="showAddUserDrawer = false">取消</a-button>
                    <a-button type="primary" :loading="addUserBtnLoading" @click="addUserSave">保存</a-button>
                </a-space>
            </template>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode } from 'vue';
import {Empty, FormInstance, message, Modal} from 'ant-design-vue';
import {
    ExclamationCircleOutlined,
    CloseOutlined,
    SearchOutlined,
    DeleteOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons-vue';
import { baseApi, Header, ResponseData } from '@/libs/BaseApi';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {AxiosRequestHeaders} from 'axios';
import {global} from '@/libs/Global';
dayjs.locale('zh-cn');
interface RoleTableType {
    role_name: string;
    role_type: string;
    role_id: string;
    start_date: string;
    end_date: string;
}
interface PaginationType{
    current:number;
    total: number;
    pageSize: number;
    showSizeChanger: boolean,
    pageSizeOptions:string[],
    showTotal:object
}

@Options({
    components: {
        ExclamationCircleOutlined,
        CloseOutlined,
        SearchOutlined,
        DeleteOutlined,
        PlusOutlined,
        ReloadOutlined
    }
})
export default class Role extends Vue {
    @Ref('queryForm') readonly queryForm!: FormInstance;
    @Ref('addRoleForm') readonly addRoleForm!: FormInstance;
    @Ref('editRoleForm') readonly editRoleForm!: FormInstance;
    public queryFormState={
        role_name:'',
        app_id:undefined
    }
    public appSelectOption:Array<any>=[]
    public addRoleFormState = {
        app_id:undefined, //所属应用
        role_name: '', //角色名称
        role_type: undefined, //角色类型
        role_id: '', //角色编码
        mutexRole: '', //互斥角色
        start_date:'', //开始时间
        end_date:'', //结束时间
        patch_memo:'' //备注
    };
    public addRoleBtnLoading=false
    public editRoleFormState:any={
        app_id:'', //所属应用
        role_id: '', //角色编码
        role_name: '', //角色名称
        role_type: '', //角色类型
        mutexRole: '', //互斥角色
        start_date:'', //开始时间
        end_date:'', //结束时间
        patch_memo:'' //备注
    }
    public editRoleSaveBtnLoading=false
    public activeKey='1'
    public tabList:any = [];
    public roleTableLoading = false;
    public showAddRoleDrawer = false
    public showEditRoleDrawer = false
    public roleTableData: RoleTableType[]=[]
    public roleTableColumns = [
        {
            title: '序号',
            dataIndex: 'rn',
            align: 'center'
        },
        {
            title: '角色名称',
            dataIndex: 'role_name',
            align: 'center'
        },
        {
            title: '角色类型',
            dataIndex: 'role_type_name',
            align: 'center'
        },
        {
            title: '所属应用',
            dataIndex: 'app_name',
            align: 'center'
        },
        {
            title: '开始时间',
            dataIndex: 'start_date',
            align: 'center'
        },
        {
            title: '结束时间',
            dataIndex: 'end_date',
            align: 'center'
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center'
        },
    ]
    public roleTablePagination:PaginationType = {
        current:1,
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total: number) => `共 ${total} 条`,
    }
    public roleTableSelectedKeys:string[]=[]
    public assignedUserListQueryParams={
        role_id:''
    }
    public assignedUserTableData:any=[]
    public assignedUserTableColumns=[
        {
            title: '序号',
            dataIndex: 'rn',
            align: 'center'
        },
        {
            title: '用户登录账号',
            dataIndex: 'user_id',
            align: 'center'
        },
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            align: 'center'
        },
    ]
    public assignedUserTableLoading=false
    public assignedUserTablePagination:PaginationType={
        current:1,
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total: number) => `共 ${total} 条`,
    }
    public assignedUserTableSelectedKeys:string[]=[]
    public treeData:Array<any>=[]
    public fieldNames={
        title:'data_name',
        key:'data_id'
    }
    public spinning=false
    public simpleImage=Empty.PRESENTED_IMAGE_SIMPLE
    public checkedKeys:string[]=[] //前端回显被选中的节点id
    public expandedKeys:string[]=[]
    public menuIdList:string[]=[] //传给后端被选中的节点id
    public addMenuPermissionBtnLoading=false
    public showAddUserDrawer=false
    public addUserBtnLoading=false
    public userListQueryParams={
        role_id:this.editRoleFormState.role_id,
        user_id:'',
        user_name:''
    }
    public userTableData:any=[]
    public permission:any = []
    public userTableColumns=[
        {
            title: '序号',
            dataIndex: 'rn',
            align: 'center'
        },
        {
            title: '用户登录账号',
            dataIndex: 'user_id',
            align: 'center'
        },
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            align: 'center'
        },
    ]
    public userTableLoading=false
    public userTablePagination:PaginationType={
        current:1,
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total: number) => `共 ${total} 条`,
    }
    public userTableSelectedKeys:string[]=[]
    public created() {
      this.getAppList()
      this.getRoleList();
      this.getEnum()
      this.getPermsBtn(); // 权限
    }
    public getPermsBtn() {
        let per:any={}
        if(global.userInfo){
            per = global.userInfo.permsBtn
        }
      this.permission = per['role'] || []
    }
    //获取应用列表
    public getAppList(){
        this.appSelectOption=[]
        baseApi.post('/app/queryAppIdAndName.do', {}, 'sec').then((res: ResponseData<any, any>) => {
             
            res.data.forEach(item=>{
                const option={
                    label:item.app_name,
                    value:item.app_id
                }
                this.appSelectOption.push(option)
            })
        });
    }
    public filterOption(input: string, option: any){
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    //获取角色列表
    public getRoleList() {
        const header:Header= {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.roleTablePagination.current;
                header.row4Page = this.roleTablePagination.pageSize;
            }
        }
        this.roleTableLoading = true;
        baseApi.post('/role/queryRole.do', this.queryFormState, 'sec',header).then((res: ResponseData<any, any>) => {
            this.roleTableLoading = false;
            this.roleTablePagination.total = (res as any).recordsTotal;
            this.roleTableData = res.data;
        }).catch(()=>{
            this.roleTableLoading = false;
        })
    }
    //角色Table上一页、下一页
    public handleRoleTableChange(pagination: PaginationType) {
        this.roleTablePagination.current = pagination.current;
        this.roleTablePagination.pageSize = pagination.pageSize;
        this.getRoleList();
    }
    //角色Table选中项改变
    public onRoleTableSelectChange (selectedRowKeys: string[]) {
         
        this.roleTableSelectedKeys = selectedRowKeys;
    };
    //重置查询条件
    public reset(){
        this.queryForm.resetFields()
    }
    //打开新增角色抽屉
    public openAddRoleDrawer(){
        this.showAddRoleDrawer=true
        this.$nextTick(()=>{
            this.addRoleForm.resetFields()
        })
    }
    //新增角色保存
    public onAddRoleConfirm() {
        this.addRoleForm.validate().then(() => {
            this.addRoleBtnLoading=true
            baseApi.post('/role/addRole.do', this.addRoleFormState, 'sec').then(() => {
                this.addRoleBtnLoading=false
                message.success('新增成功');
                this.showAddRoleDrawer = false;
                this.getRoleList();
            }).catch(()=>{
                this.addRoleBtnLoading=false
            })
        })
    }
    //角色编辑
    public edit(row:any){
         
        this.showEditRoleDrawer=true
        Object.keys(this.editRoleFormState).forEach(key=>{
            this.editRoleFormState[key]=row[key]
        })
        this.activeKey='1'
        this.getAssignedUserList()
    }
    public editRoleSave(){
        this.editRoleForm.validate().then(() => {
            this.editRoleSaveBtnLoading=true
            baseApi.post('/role/mdfRole.do', this.editRoleFormState, 'sec').then(() => {
                this.editRoleSaveBtnLoading=false
                message.success('修改成功');
                this.showEditRoleDrawer = false;
                this.getRoleList();
            }).catch(()=>{
                this.editRoleSaveBtnLoading=false
            })
        })
    }
    //删除角色
    public handleDeleteRole() {
        if(this.roleTableSelectedKeys.length>0){
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '您确定要删除吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    baseApi.post('/role/delRole.do', {roleIds:this.roleTableSelectedKeys  }, 'sec').then(() => {
                        message.success('删除成功');
                        this.roleTableSelectedKeys=[]
                        this.roleTablePagination.current=1
                        this.roleTablePagination.pageSize=10
                        this.getRoleList();
                    })
                },
            });
        }else {
            message.error('请至少选择一条记录!');
        }
    }
    //获取已分配角色用户的列表
    public getAssignedUserList(){
        const header:Header= {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.assignedUserTablePagination.current;
                header.row4Page = this.assignedUserTablePagination.pageSize;
            }
        }
        this.assignedUserTableLoading=true
        this.assignedUserTableData=[]
        this.assignedUserListQueryParams.role_id=this.editRoleFormState.role_id
        baseApi.post('/role/queryUser.do',this.assignedUserListQueryParams, 'sec',header).then((res: ResponseData<any, any>) => {
            this.assignedUserTableLoading=false
            this.assignedUserTableData=res.data
            this.assignedUserTablePagination.total = (res as any).recordsTotal;
        }).catch(()=>{
            this.assignedUserTableLoading=false
        })
    }
    //已分配角色用户列表选中项改变
    public onAssignedUserTableSelectChange(selectedRowKeys: string[]){
         
        this.assignedUserTableSelectedKeys = selectedRowKeys;
    }
    //已分配角色用户Table上一页、下一页
    public handleAssignedUserTableChange(pagination: PaginationType) {
        this.assignedUserTablePagination.current = pagination.current;
        this.assignedUserTablePagination.pageSize = pagination.pageSize;
        this.getAssignedUserList();
    }
    //添加角色用户弹窗
    public openAddUserDrawer(){
        this.showAddUserDrawer=true
        this.userListQueryParams.user_id=''
        this.userListQueryParams.user_name=''
        this.getUserList()
    }
    //删除已分配角色的用户
    public handleDeleteAssignedUser() {
        if(this.assignedUserTableSelectedKeys.length>0){
            const param={
                role_id:this.editRoleFormState.role_id,
                pkUuidIdList:this.assignedUserTableSelectedKeys
            }
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '您确定要删除吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    baseApi.post('/role/delUser.do', param, 'sec').then(() => {
                        message.success('删除成功');
                        this.assignedUserTableSelectedKeys=[]
                        this.assignedUserTablePagination.current=1
                        this.assignedUserTablePagination.pageSize=10
                        this.getAssignedUserList();
                    })
                },
            });
        }else {
            message.error('请至少选择一条记录!');
        }
    }
    public changeTab(activeKey:any) {
       
      if(activeKey !== '1') {
        this.getTreeList()
      }
    }
    //获取菜单权限tree
    public getTreeList(){
        this.spinning=true
        baseApi.post('/role/queryDataAuth.do',{role_id:this.editRoleFormState.role_id,resource_type:this.activeKey}, 'sec').then((res: ResponseData<any, any>) => {
            this.spinning=false
            this.treeData=res.data
            this.checkedKeys=res.defmap.checkedKeys
        }).catch(()=>{
            this.spinning=false
        })
    }
    //菜单树选中节点的改变
    public onTreeCheckedChange(checkedKeys:string[],{halfCheckedKeys}:any){
         
         
        this.checkedKeys=checkedKeys
        this.menuIdList=checkedKeys.concat(halfCheckedKeys)
         
    }
    //Tree展开/收起
    public onExpand(expandedKeys:string[]){
         
        this.expandedKeys=expandedKeys
    }
    //添加菜单权限保存
    public menuPermissionSave(){
        if(this.menuIdList.length>0){
            this.addMenuPermissionBtnLoading=true
            const param={
                role_id:this.editRoleFormState.role_id,
                dataList:this.menuIdList,
                resource_type: this.activeKey
            }
            baseApi.post('/role/addDataAuth.do',param, 'sec').then(() => {
                this.addMenuPermissionBtnLoading=false
                message.success('保存成功')
            }).catch(()=>{
                this.addMenuPermissionBtnLoading=false
            })
        }else {
            message.info('数据没有变更，无需保存')
        }
    }

    //获取未分配角色的用户列表
    public getUserList(){
        const header:Header= {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            }
        }
        this.userTableLoading=true
        this.userListQueryParams.role_id=this.editRoleFormState.role_id
        baseApi.post('/role/queryExclusionUser.do',this.userListQueryParams, 'sec',header).then((res: ResponseData<any, any>) => {
            this.userTableLoading=false
            this.userTableData=res.data
            this.userTablePagination.total = (res as any).recordsTotal;
        }).catch(()=>{
            this.userTableLoading=false
        })
    }
    //未分配角色用户Table选中项改变
    public onUserTableSelectChange(selectedRowKeys: string[]){
         
        this.userTableSelectedKeys = selectedRowKeys;
    }
    //未分配角色用户Table上一页、下一页
    public handleUserTableChange(pagination: PaginationType){
        this.userTablePagination.current = pagination.current;
        this.userTablePagination.pageSize = pagination.pageSize;
        this.getUserList();
    }
    //添加角色用户
    public addUserSave(){
        if(this.userTableSelectedKeys.length>0){
            this.addUserBtnLoading=true
            const param={
                role_id:this.editRoleFormState.role_id,
                pkUuidIdList:this.userTableSelectedKeys
            }
            baseApi.post('/role/addUser.do',param, 'sec').then(() => {
                this.addUserBtnLoading=false
                this.userTableSelectedKeys=[]
                this.showAddUserDrawer=false
                message.success('保存成功');
                this.getAssignedUserList()
            }).catch(()=>{
                this.addUserBtnLoading=false
            })
        }else {
            message.error('请至少选择一条记录!');
        }

    }

    // 获取字典
    public getEnum() {
      baseApi.post('/dic/queryDicByCode.do', { enum_code: 'role_resource_type' }, 'sec').then((res: ResponseData<any, any>) => {
        if (res.flag == 'success') {
          this.tabList = res.data
        }
      });
    }
}
</script>

<style lang="less" scoped>
.role-page {
    .tool-wrap {
        .ant-form-item{
            margin-bottom: 0;
        }

    }
    .btn-edit{
        color:var(--custom-primary-color)
    }

    .tab-container{
        background: #fff;
        border: 1px solid #dcdfe6;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);

        :deep(.ant-tabs-card) {
            .ant-tabs-nav-wrap{
                background: #f5f5f5;
            }
            .ant-tabs-tab{
                background: transparent;
                border-color: transparent;
            }
            .ant-tabs-tab-active{
                background: #fff;
                border-color: #fff;
            }
            .ant-tabs-content {
                .ant-tabs-tabpane{
                    position: relative;
                    padding: 0 16px 16px;
                    //height: 300px;
                    overflow: hidden;
                    .tree-tab-con{
                        height: 100%;
                        .ant-spin-nested-loading{
                            height: 100%;
                            .ant-spin-container{
                                height: 100%;
                                .ant-empty-normal{
                                    margin: 0;
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    translate: -50% -50%;
                                }
                                .ant-tree-list-scrollbar{
                                    width: 6px!important;
                                    .ant-tree-list-scrollbar-thumb{
                                        background-color: rgba(144,147,153,.3)!important;
                                    }
                                }
                            }
                        }
                        .ant-spin{
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            translate: -50% -50%;
                        }
                        .btn-wrap{
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            translate: -50%;
                        }
                    }
                }
            }
        }
    }
}

:deep(.ant-tabs-content) {
  height: 75vh;
}
</style>
