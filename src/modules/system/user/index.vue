<template>
  <div class="user-page" id="userPage">
    <div class="tool-wrap mb24">
      <a-row type="flex" justify="space-between">
        <a-col :lg="24" :xl="16" class="mt24">
          <a-form ref="queryForm" :model="queryFormState" :label-col="{style: { width: '100px' }}">
            <a-row>
              <a-col :md="8" :lg="8" :xl="8">
                <a-form-item :label="$t('user.用户登录名')" name="user_id">
                  <a-input v-model:value="queryFormState.user_id" :placeholder="$t('user.请输入用户登录名')" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="8" :lg="8" :xl="8">
                <a-form-item :label="$t('user.用户姓名')" name="user_name">
                  <a-input v-model:value="queryFormState.user_name" :placeholder="$t('user.请输入用户姓名')" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="8" :lg="8" :xl="8">
                <a-form-item :label="$t('user.组织机构')" name="organ_id">
                  <a-tree-select
                      v-model:value="queryFormState.organ_id"
                      :placeholder="$t('user.请选择组织机构')"
                      :tree-line="{ showLeafIcon:true }"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :treeExpandedKeys="treeExpandedKeys"
                      allow-clear
                      :fieldNames="{label:'organ_name',value: 'organ_id'}"
                      :tree-data="organTreeData"
                      @change="onTreeSelectChange"
                      @treeExpand="onTreeExpand"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col class="mt24">
          <a-row>
            <a-col class="w90">
              <a-button type="primary" block @click="search">
                <template #icon>
                  <SearchOutlined />
                </template>
                {{ $t('user.查询') }}
              </a-button>
            </a-col>
            <a-col class="w90 ml10">
              <a-button type="primary" block @click="reset">
                <template #icon>
                  <ReloadOutlined />
                </template>
                {{ $t('user.重置') }}
              </a-button>
            </a-col>
            <a-col v-if="permission.includes('add')" class="w90 ml10">
              <a-button type="primary" block @click="openAddUserDrawer">
                <template #icon>
                  <PlusOutlined />
                </template>
                {{ $t('user.新增') }}
              </a-button>
            </a-col>
            <a-col v-if="permission.includes('delete')" class="w90 ml10">
              <a-button block danger @click="handleDeleteUser">
                <template #icon>
                  <DeleteOutlined />
                </template>
                {{ $t('user.删除') }}
              </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <a-table
        :dataSource="userTableData"
        :columns="userTableColumns"
        :loading="userTableLoading"
        :pagination="userTablePagination"
        @change="handleTableChange"
        :row-key="(record) => record.pk_uuid"
        :row-selection="{selectedRowKeys:userTableSelectedKeys,onChange:onUserTableSelectChange}"
        bordered
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.key === 'operation'">
          <a-button type="link" v-if="permission.includes('edit')" @click="handleEdit(record)">{{ $t('user.编辑') }}</a-button>
        </template>
      </template>
    </a-table>
    <a-drawer
        v-model:visible="showAddUserDrawer"
        title="新增用户"
        placement="right"
        :closable="false"
        :maskClosable="false"
        width="80%"
    >
      <template #extra>
        <close-outlined @click="showAddUserDrawer = false" />
      </template>
      <a-form
          ref="addUserForm"
          :model="addUserFormState"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 10 }"
      >
        <a-form-item label="组织机构" name="organ_id" :rules="[{ required: true, message: '组织机构不能为空', trigger: 'change' }]">
          <a-tree-select
              v-model:value="addUserFormState.organ_id"
              placeholder="请选择组织机构"
              :tree-line="{ showLeafIcon:true }"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :treeExpandedKeys="treeExpandedKeys"
              allow-clear
              :fieldNames="{label:'organ_name',value: 'organ_id'}"
              :tree-data="organTreeData"
              @change="onTreeSelectChange"
              @treeExpand="onTreeExpand"
          />
        </a-form-item>
        <a-form-item label="用户登录账号" name="user_id" :rules="[{ required: true, message: '用户登录账号不能为空', trigger: 'blur' }]">
          <a-input v-model:value="addUserFormState.user_id" placeholder="请输入用户登录账号" allowClear />
        </a-form-item>
        <a-form-item label="用户姓名" name="user_name" :rules="[{ required: true, message: '用户姓名不能为空', trigger: 'blur' }]">
          <a-input v-model:value="addUserFormState.user_name" placeholder="请输入用户姓名" allowClear />
        </a-form-item>
        <a-form-item class="tooltip" label="用户密码" name="user_pwd" :rules="[{ required: true, message: '用户密码不能为空', trigger: 'blur' },{validator: validatePwd, trigger: 'blur'}]">
          <a-input v-model:value="addUserFormState.user_pwd" placeholder="请输入用户密码" allowClear />
          <a-tooltip class="tooltip-icon" placement="right">
            <template #title>
              密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位
            </template>
            <question-circle-outlined />
          </a-tooltip>
        </a-form-item>
        <a-form-item label="备注" name="patch_memo">
          <a-textarea v-model:value="addUserFormState.patch_memo" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请输入描述信息" allowClear />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space :size="8">
          <a-button @click="showAddUserDrawer = false">取消</a-button>
          <a-button type="primary" :loading="addUserBtnLoading" @click="onAddUserSave">保存</a-button>
        </a-space>
      </template>
    </a-drawer>
    <a-drawer
        v-model:visible="showEditUserDrawer"
        title="用户编辑"
        placement="right"
        :closable="false"
        :maskClosable="false"
        getContainer="#userPage"
        width="80%"
    >
      <template #extra>
        <close-outlined @click="showEditUserDrawer = false" />
      </template>
      <a-row :gutter="32">
        <a-col :span="11">
          <a-form
              ref="editUserForm"
              :model="editUserFormState"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 15 }"
          >
            <a-form-item label="组织机构" name="organ_id" :rules="[{ required: true, message: '组织机构不能为空', trigger: 'change' }]">
              <a-tree-select
                  v-model:value="editUserFormState.organ_id"
                  placeholder="请选择组织机构"
                  :treeExpandedKeys="treeExpandedKeys"
                  :tree-line="{ showLeafIcon:true }"
                  allow-clear
                  :fieldNames="{label:'organ_name',value: 'organ_id'}"
                  :tree-data="organTreeData"
                  @change="onTreeSelectChange"
                  @treeExpand="onTreeExpand"
                  disabled
              />
            </a-form-item>
            <a-form-item label="用户登录账号" name="user_id" :rules="[{ required: true, message: '用户登录账号不能为空', trigger: 'blur' }]">
              <a-input v-model:value="editUserFormState.user_id" placeholder="请输入用户登录账号" allowClear />
            </a-form-item>
            <a-form-item label="用户姓名" name="user_name" :rules="[{ required: true, message: '用户姓名不能为空', trigger: 'blur' }]">
              <a-input v-model:value="editUserFormState.user_name" placeholder="请输入用户姓名" allowClear />
            </a-form-item>
            <a-form-item label="备注" name="patch_memo">
              <a-textarea v-model:value="editUserFormState.patch_memo" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="请输入描述信息" allowClear />
            </a-form-item>
            <a-row justify="center">
              <!-- <a-col class="w90">
                  <a-button block type="primary" @click="openModal('modify')">修改密码</a-button>
              </a-col> -->
              <a-col class="w90" :offset="1">
                <a-button block type="primary" @click="openModal('reset')">重置密码</a-button>
              </a-col>
              <a-col class="w90" :offset="1">
                <a-button block type="primary" :loading="editUserSaveBtnLoading" @click="editUserSave">保存</a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col :span="13">
          <div class="tab-container">
            <a-tabs v-model:activeKey="activeKey" type="card" @change="onTabChange">
              <a-tab-pane key="role" tab="角色">
                <div class="tab-role-con">
                  <a-row style="margin-bottom: 16px;">
                    <a-col class="w90">
                      <a-button type="primary" block @click="openAddRoleDrawer">添加</a-button>
                    </a-col>
                    <a-col class="w90" :offset="1">
                      <a-button block danger @click="handleDeleteAssignedRole">删除</a-button>
                    </a-col>
                  </a-row>
                  <a-table
                      :dataSource="assignedRoleTableData"
                      :columns="assignedRoleTableColumns"
                      :loading="assignedRoleTableLoading"
                      :pagination="assignedRoleTablePagination"
                      @change="handleAssignedRoleTableChange"
                      :scroll="{y: 500 }"
                      :row-key="(record) => record.role_id"
                      :row-selection="{ selectedRowKeys: assignedRoleSelectedKeys, onChange: onAssignedRoleSelectChange }"
                  >
                  </a-table>
                </div>
              </a-tab-pane>
              <a-tab-pane v-for="tabItem in tabList" :key="tabItem.enum_code" :tab="tabItem.enum_name">
                <div class="tab-tree-con">
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
                      />
                      <a-row class="btn-wrap">
                        <a-col class="w90">
                          <a-button type="primary" block :loading="addOrganBtnLoading" @click="handleAddOrganSave">保存</a-button>
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
        v-model:visible="showAddRoleDrawer"
        title="为用户添加角色"
        placement="right"
        :closable="false"
        :maskClosable="false"
        getContainer="#userPage"
        width="80%"
    >
      <template #extra>
        <close-outlined @click="showAddRoleDrawer = false" />
      </template>
      <a-row type="flex" justify="space-between">
        <a-col :lg="20" :xl="18">
          <a-form ref="queryForm" :model="roleListQueryParams" :label-col="{style: { width: '100px' }}">
            <a-row>
              <a-col :md="8" :lg="8" :xl="8">
                <a-form-item label="用户登录账号">
                  <a-input v-model:value="editUserFormState.user_id" placeholder="请输入字典名称" disabled/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :lg="8" :xl="8">
                <a-form-item label="用户姓名">
                  <a-input v-model:value="editUserFormState.user_name" placeholder="请输入字典编码" disabled/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :lg="8" :xl="8">
                <a-form-item label="角色名称" name="role_name">
                  <a-input v-model:value="roleListQueryParams.role_name" placeholder="请输入字典类型" allowClear/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col>
          <a-row>
            <a-col class="w90">
              <a-button type="primary" block @click="getRoleList">
                <template #icon>
                  <SearchOutlined />
                </template>
                查询
              </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-table
          :dataSource="roleTableData"
          :columns="roleTableColumns"
          :loading="roleTableLoading"
          :pagination="roleTablePagination"
          :scroll="{y: 400 }"
          @change="handleRoleTableChange"
          :row-key="(record) => record.role_id"
          :row-selection="{ selectedRowKeys: roleTableSelectedKeys, onChange: onRoleTableSelectChange }"
      >

      </a-table>
      <template #footer>
        <a-space :size="8">
          <a-button @click="showAddRoleDrawer = false">取消</a-button>
          <a-button type="primary" :loading="addRoleBtnLoading" @click="addRoleSave">保存</a-button>
        </a-space>
      </template>
    </a-drawer>
    <a-modal
        v-model:visible="showModal"
        :title="modalTitle"
        :confirmLoading="modalConfirmLoading"
        @ok="handleModalOk"
    >
      <a-form
          :model="pwdFormState"
          ref="pwdForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 15 }">
        <a-form-item label="旧密码" v-if="modalTitle==='修改密码'" name="old_pwd" :rules="[{ required: true, message: '旧密码不能为空', trigger: 'blur' }]">
          <a-input-password v-model:value="pwdFormState.old_pwd" placeholder="请输入旧密码" />
        </a-form-item>
        <a-form-item class="tooltip" label="新密码" name="user_pwd"
                     :rules="[{ required: true, message: '新密码不能为空', trigger: 'blur' },{validator: validatePwd, trigger: 'blur'}]">
          <a-input-password v-model:value="pwdFormState.user_pwd" placeholder="请输入新密码" />
          <a-tooltip class="tooltip-icon" placement="right">
            <template #title>
              密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位
            </template>
            <question-circle-outlined />
          </a-tooltip>
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode } from 'vue';
import {FormInstance,Empty, message, Modal} from 'ant-design-vue';
import { QuestionCircleOutlined, ExclamationCircleOutlined, CloseOutlined,SearchOutlined,DeleteOutlined,PlusOutlined,ReloadOutlined } from '@ant-design/icons-vue';
import {baseApi, Header, ResponseData} from '@/libs/BaseApi';
import {AxiosRequestHeaders} from 'axios';
import {global} from '@/libs/Global';
import MD5 from 'crypto-js/md5';
interface UserTableType {
  pk_uuid: string;
  organ_id: string;
  organ_name: string;
  rn:number;
  roles:string;
  user_id:string;
  user_name: string;
}
interface Option {
  label:string;
  value:string;
}
interface PaginationType{
  current:number;
  total: number;
  pageSize: number;
  showSizeChanger: boolean,
  pageSizeOptions:string[],
  showTotal:object
}
interface PwdParamType{
  pk_uuid:string;
  old_pwd?:string;
  user_pwd:string;
}
@Options({
  components: {
    QuestionCircleOutlined,
    ExclamationCircleOutlined,
    CloseOutlined,
    SearchOutlined,
    DeleteOutlined,
    PlusOutlined,
    ReloadOutlined
  }
})
export default class User extends Vue {
  @Ref('queryForm') readonly queryForm!: FormInstance;
  @Ref('addUserForm') readonly addUserForm!: FormInstance;
  @Ref('editUserForm') readonly editUserForm!: FormInstance;
  @Ref('pwdForm') readonly pwdForm!: FormInstance;
  public queryFormState={
    user_name:'',
    user_id:'',
    organ_id:undefined
  }
  public permission:any = []
  public userTableData: UserTableType[]=[]
  public userTableColumns = [
    {
      title: '序号',
      dataIndex: 'rn',
      align: 'center'
    },
    {
      title: '用户登录名',
      dataIndex: 'user_id',
      align: 'center'
    },
    {
      title: '用户姓名',
      dataIndex: 'user_name',
      align: 'center'
    },
    {
      title: '机构名称',
      dataIndex: 'organ_name',
      align: 'center'
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center'
    },
  ]
  public userTablePagination:PaginationType = {
    current:1,
    total: 0,
    pageSize: 10, //每页中显示10条数据
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
    showTotal: (total: number) => `共 ${total} 条`,
  }
  public userTableSelectedKeys:string[]=[]
  public userTableLoading = false;
  public showAddUserDrawer = false
  public organSelectOption:Array<Option>=[]
  public organTreeData:Array<any>=[]
  public addUserFormState = {
    organ_id: undefined, //机构编码
    organ_name:'', //机构名称
    user_id: '', //用户登录名
    user_name: '', //用户姓名
    user_pwd:'', //用户密码
    patch_memo:'' //备注
  };
  public addUserBtnLoading=false
  public showEditUserDrawer = false
  public editUserFormState:any={
    pk_uuid:'',
    organ_id: undefined, //机构编码
    organ_name:'', //机构名称
    user_id: '', //用户登录名
    user_name: '', //用户姓名
    patch_memo:'' //备注
  }
  public treeExpandedKeys:string[]=[]
  public editUserSaveBtnLoading=false
  public showModal=false
  public modalConfirmLoading=false
  public modalTitle=''
  public pwdFormState:PwdParamType={
    pk_uuid:'',
    old_pwd:'',
    user_pwd:''
  }
  public activeKey='role'
  public tabList:any=[]
  public spinning=false
  public simpleImage=Empty.PRESENTED_IMAGE_SIMPLE
  public assignedRoleListQueryParams={
    pk_uuid:''
  }
  public assignedRoleTableData:any=[]
  public assignedRoleTableColumns=[
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
      dataIndex: 'role_type',
      align: 'center',
      customRender: ({record}:any) => {
        return record.role_type==='ADMIN'?'系统管理员':'普通用户'
      }
    }
  ]
  public assignedRoleTableLoading=false
  public assignedRoleTablePagination:PaginationType={
    current:1,
    total: 0,
    pageSize: 10, //每页中显示10条数据
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
    showTotal: (total: number) => `共 ${total} 条`,
  }
  public assignedRoleSelectedKeys:string[]=[]
  public showAddRoleDrawer=false
  public treeData:any=[]
  public fieldNames={
    title:'data_name',
    key:'data_id'
  }
  public checkedKeys:string[]=[]
  public halfCheckedKeys:string[]=[]
  public expandedKeys:string[]=[]
  public organIdList:string[]=[]
  public flag=false
  public addOrganBtnLoading=false
  public roleListQueryParams={
    pk_uuid:'',
    role_id:'',
    role_name:''
  }
  public roleTableData:any[]=[]
  public roleTableColumns=[
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
      dataIndex: 'role_type',
      align: 'center',
      customRender: ({record}:any) => {
        return record.role_type==='ADMIN'?'系统管理员':'普通用户'
      }
    }
  ]
  public roleTableLoading=false
  public roleTablePagination:PaginationType={
    current:1,
    total: 0,
    pageSize: 10, //每页中显示10条数据
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
    showTotal: (total: number) => `共 ${total} 条`,
  }
  public roleTableSelectedKeys:string[]=[]
  public addRoleBtnLoading=false
  public created() {
    this.getUserList()
    this.getOrganList()
    this.getPermsBtn(); // 权限
  }
  public getPermsBtn() {
    let per:any={}
    if(global.userInfo){
      per = global.userInfo.permsBtn
    }
    this.permission = per['user'] || []
  }
  //查询用户列表
  public getUserList() {
    const header:Header= {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.userTablePagination.current;
        header.row4Page = this.userTablePagination.pageSize;
      }
    }
    this.userTableLoading = true;
    baseApi.post('/user/queryUser.do', this.queryFormState, 'sec',header).then((res: ResponseData<any, any>) => {
      this.userTableLoading = false;
      this.userTablePagination.total = (res as any).recordsTotal;
      this.userTableData = res.data;
    }).catch(()=>{
      this.userTableLoading = false;
    })
  }

  //用户列表上一页、下一页
  public handleTableChange(pagination: PaginationType) {
    this.userTablePagination.current = pagination.current;
    this.userTablePagination.pageSize = pagination.pageSize;
    this.getUserList();
  }

  // 查询按钮
  public search() {
    this.userTablePagination.current = 1;
    this.userTablePagination.pageSize = 10;
    this.getUserList();
  }

  //用户列表选中项
  public onUserTableSelectChange (selectedRowKeys: string[]) {
     
    this.userTableSelectedKeys = selectedRowKeys;
  };
  //重置查询条件
  public reset(){
    this.queryForm.resetFields()
  }
  //打开新增用户抽屉
  public openAddUserDrawer(){
    this.showAddUserDrawer=true
    this.$nextTick(()=>{
      this.addUserForm.resetFields()
       
      this.treeExpandedKeys=[this.organTreeData[0].organ_id]
    })
  }
  //机构选择
  public onTreeSelectChange(value:string, label:string){
     
    this.addUserFormState.organ_name=label[0]
    this.editUserFormState.organ_name=label[0]
  }
  public onTreeExpand(expandedKeys:string[]){
    this.treeExpandedKeys=expandedKeys
  }
  //新增用户保存
  public onAddUserSave() {
    const param = {...this.addUserFormState}
    param.user_pwd = MD5(param.user_pwd).toString()
    this.addUserForm.validate().then(() => {
      this.addUserBtnLoading=true
      baseApi.post('/user/addUser.do', param, 'sec').then(() => {
        this.addUserBtnLoading=false
        message.success('新增成功');
        this.showAddUserDrawer = false;
        this.getUserList();
      }).catch(()=>{
        this.addUserBtnLoading=false
      })
    })
  }
  //删除用户
  public handleDeleteUser() {
    if(this.userTableSelectedKeys.length>0){
      Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您确定要删除吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          baseApi.post('/user/delUserByIds.do', {pkUuids:this.userTableSelectedKeys  }, 'sec').then(() => {
            message.success('删除成功');
            this.userTableSelectedKeys=[]
            this.userTablePagination.current=1
            this.userTablePagination.pageSize=10
            this.getUserList();
          })
        },
      });
    }else {
      message.error('请至少选择一条记录!');
    }
  }
  public loopFn (node:any, id:string,fn:any):any {
     
    node.forEach((item:any) => {
      if (item.organ_id === id) {
        fn(item)
        return true
      }
      if (item.children && item.children.length) {
        this.loopFn(item.children, id,fn);
      }
    });
  }
  //用户编辑
  public handleEdit(row:any){
    this.showEditUserDrawer=true
    Object.keys(this.editUserFormState).forEach(key=>{
      this.editUserFormState[key]=row[key]
    })
    this.activeKey='role'
    this.getAssignedRoleList()
    this.getTabList()
    this.loopFn(this.organTreeData, row.organ_id,(node:any)=>{
      this.expandedKeys=[node.up_organ]
    })
  }
  public getOrganList(){
    this.organSelectOption=[]
    baseApi.post('/organ/queryOrganIdAndName.do', {}, 'sec').then((res: ResponseData<any, any>) => {
      this.organTreeData=res.data
      const loop=(node:any)=>{
        node.forEach((item:any) => {
          if (item.isDisable==='Y') {
            item.disabled=true
            loop(item.children);
          }
        });
      }
      loop(this.organTreeData)
      if(this.treeExpandedKeys.length===0){
        this.treeExpandedKeys=[res.data[0].organ_id]
      }
    })
  }
  //用户编辑保存
  public editUserSave(){
    this.editUserForm.validate().then(() => {
      this.editUserSaveBtnLoading=true
      baseApi.post('/user/mdfUser.do', this.editUserFormState, 'sec').then(() => {
        this.editUserSaveBtnLoading=false
        message.success('修改成功');
        this.showEditUserDrawer = false;
        this.getUserList();
      }).catch(()=>{
        this.editUserSaveBtnLoading=false
      })
    })
  }
  openModal(type:string){
    if(type==='modify'){
      this.modalTitle='修改密码'
    }else {
      this.modalTitle='重置密码'
    }
    this.pwdFormState.pk_uuid=this.editUserFormState.pk_uuid
    this.showModal=true
    this.$nextTick(()=>{
       
      this.pwdForm.resetFields()
    })
  }

  public handleModalOk(){
    let requestUrl=''
    const param:PwdParamType={
      pk_uuid:this.pwdFormState.pk_uuid,
      user_pwd:this.pwdFormState.user_pwd
    }
    param.user_pwd = MD5(param.user_pwd).toString()
    if(this.modalTitle==='修改密码'){
      requestUrl='/user/mdfPassword.do'
      param.old_pwd=this.pwdFormState.old_pwd
    }
    if(this.modalTitle==='重置密码'){
      requestUrl='/user/resetPassword.do'
    }
    this.pwdForm.validate().then(()=>{
      this.modalConfirmLoading=true
      baseApi.post(requestUrl, param, 'sec').then(() => {
        this.modalConfirmLoading=false
        message.success('保存成功');
        this.showModal=false
      }).catch(()=>{
        this.modalConfirmLoading=false
      })
    })
  }
  //打开为用户增加角色的抽屉
  public openAddRoleDrawer(){
    this.showAddRoleDrawer=true
    this.getRoleList()
  }
  //查询用户添加了哪些角色
  public getAssignedRoleList(){
    const header:Header= {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.assignedRoleTablePagination.current;
        header.row4Page = this.assignedRoleTablePagination.pageSize;
      }
    }
    this.assignedRoleTableLoading=true
    this.assignedRoleListQueryParams.pk_uuid=this.editUserFormState.pk_uuid
    baseApi.post('/user/queryRole.do',this.assignedRoleListQueryParams, 'sec',header).then((res: ResponseData<any, any>) => {
      this.assignedRoleTableLoading=false
      this.assignedRoleTableData=res.data
    }).catch(()=>{
      this.assignedRoleTableLoading=false
    })
  }
  public handleAssignedRoleTableChange(pagination: PaginationType){
    this.assignedRoleTablePagination.current = pagination.current;
    this.assignedRoleTablePagination.pageSize = pagination.pageSize;
    this.getAssignedRoleList();
  }
  //删除已添加的角色
  public handleDeleteAssignedRole(){
    if(this.assignedRoleSelectedKeys.length>0){
      const param={
        pk_uuid:this.editUserFormState.pk_uuid,
        roleIdList:this.assignedRoleSelectedKeys
      }
      Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '您确定要删除吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          baseApi.post('/user/delRole.do', param, 'sec').then(() => {
            message.success('删除成功');
            this.assignedRoleSelectedKeys=[]
            this.assignedRoleTablePagination.current=1
            this.assignedRoleTablePagination.pageSize=10
            this.getAssignedRoleList();
          })
        },
      });
    }else {
      message.error('请至少选择一条记录!');
    }
  }
  //已为用户增加角色的列表的选中项
  public onAssignedRoleSelectChange(selectedRowKeys:string[]){
     
    this.assignedRoleSelectedKeys=selectedRowKeys
  }
  // 获取Tab
  public getTabList() {
    baseApi.post('/dic/queryDicByCode.do', { enum_code: 'user_resource_type' }, 'sec').then((res: ResponseData<any, any>) => {
      this.tabList = res.data
    });
  }
  //Tab切换
  public onTabChange(){
    if(this.activeKey!=='role'){
      this.getTreeList()
    }
  }
  //获取机构tree
  public getTreeList(){
    this.spinning=true
    baseApi.post('/user/queryDataAuth.do',{pk_uuid:this.editUserFormState.pk_uuid,resource_type:this.activeKey}, 'sec').then((res: ResponseData<any, any>) => {
      this.spinning=false
      this.treeData=res.data
      this.checkedKeys=res.defmap.checkedKeys
      if(this.expandedKeys.length===0){
        this.expandedKeys=[this.treeData[0].organ_id]
      }
    }).catch(()=>{
      this.spinning=false
    })
  }
  //树选中节点的改变
  public onTreeCheckedChange(checkedKeys:string[],{halfCheckedKeys}:any){
     
     
    this.flag=true
    this.halfCheckedKeys=halfCheckedKeys
    this.checkedKeys=checkedKeys
    this.organIdList=checkedKeys.concat(halfCheckedKeys)
  }
  //Tree展开/收起
  public onExpand(expandedKeys:string[]){
     
    this.expandedKeys=expandedKeys
  }
  //添加机构保存
  public handleAddOrganSave(){
    if(this.flag){ //操作过
      if(this.organIdList.length>0){
        this.addOrganBtnLoading=true
        const param={
          pk_uuid:this.editUserFormState.pk_uuid,
          dataList:this.organIdList,
          resource_type: this.activeKey,
          halfCheckList:this.halfCheckedKeys
        }
        baseApi.post('/user/addDataAuth.do',param, 'sec').then(() => {
          this.addOrganBtnLoading=false
          message.success('保存成功')
        }).catch(()=>{
          this.addOrganBtnLoading=false
        })
      }else {
        message.warning('请至少选择一条记录!')
      }
    }else { //没有操作过
      if(this.checkedKeys.length>0){ //初始化有数据
        this.addOrganBtnLoading=true
        setTimeout(()=>{
          this.addOrganBtnLoading=false
          message.success('保存成功')
        },500)
      }else { //初始化有数据没有数据
        message.warning('请至少选择一条记录!')
      }
    }
  }
  //查询用户还未添加的角色列表
  public getRoleList(){
    const header:Header= {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.roleTablePagination.current;
        header.row4Page = this.roleTablePagination.pageSize;
      }
    }
    this.roleListQueryParams.pk_uuid=this.editUserFormState.pk_uuid
    this.roleTableLoading = true;
    baseApi.post('/user/queryExclusionRole.do', this.roleListQueryParams, 'sec',header).then((res: ResponseData<any, any>) => {
      this.roleTableLoading = false;
      this.roleTablePagination.total = (res as any).recordsTotal;
      this.roleTableData = res.data;
    }).catch(()=>{
      this.roleTableLoading = false;
    })
  }
  //用户未添加角色的角色列表的上一页、下一页
  public handleRoleTableChange(pagination: PaginationType){
    this.roleTablePagination.current = pagination.current;
    this.roleTablePagination.pageSize = pagination.pageSize;
    this.getRoleList();
  }
  //用户已添加角色列表选中项
  public onRoleTableSelectChange(selectedRowKeys: string[]){
    this.roleTableSelectedKeys=selectedRowKeys
  }
  //给用户添加角色
  public addRoleSave(){
    if(this.roleTableSelectedKeys.length>0){
      this.addRoleBtnLoading=true
      const param={
        pk_uuid:this.editUserFormState.pk_uuid,
        roleIdList:this.roleTableSelectedKeys
      }
      baseApi.post('/user/addRole.do',param, 'sec').then(() => {
        this.addRoleBtnLoading=false
        this.roleTableSelectedKeys=[]
        this.showAddRoleDrawer=false
        message.success('保存成功');
        this.getAssignedRoleList()
      }).catch(()=>{
        this.addRoleBtnLoading=false
      })
    }else {
      message.error('请至少选择一条记录!');
    }
  }
  public validatePwd(rule:any,value:any,callback:any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#%*?&-])[A-Za-z\d$@$!#%*?&-]{8,}/
    //  
    if (!pattern.test(value)) {
      // Promise.reject('密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位')
      callback('密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位')
    } else {
      // Promise.resolve()
      callback()
    }
  }
}
</script>

<style lang="less" scoped>
.user-page {
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
          padding: 0 16px 16px;
          //height: 260px;
          overflow: hidden;
          .tab-tree-con{
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
              translate: -50%;
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
.tooltip {
  position: relative;
  .tooltip-icon {
    position: absolute;
    margin-left: 10px;
    margin-top: 8px;
  }
}
</style>