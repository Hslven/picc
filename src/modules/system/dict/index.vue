<template>
    <div class="dict-page">
        <div class="tool-wrap mb24">
            <a-row type="flex" justify="space-between">
                <a-col :lg="24" :xl="16" class="mt24">
                    <a-form ref="queryForm" :model="queryFormState" :label-col="{style: { width: '100px' }}">
                        <a-row>
                            <a-col :md="8" :lg="8" :xl="8">
                                <a-form-item label="一级字典名称" name="enum_name">
                                    <a-input v-model:value="queryFormState.enum_name" placeholder="请输入字典名称" allowClear/>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :lg="8" :xl="8">
                                <a-form-item label="字典编码" name="enum_code">
                                    <a-input v-model:value="queryFormState.enum_code" placeholder="请输入字典编码" allowClear/>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :lg="8" :xl="8">
                                <a-form-item label="字典类型" name="enum_type">
                                    <a-input v-model:value="queryFormState.enum_type" placeholder="请输入字典类型" allowClear/>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-col>
                <a-col class="mt24">
                    <a-row>
                        <a-col class="w90">
                            <a-button type="primary" block @click="getDictList">
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
                            <a-button  type="primary" block @click="handleOpenDrawer('add')">
                                <template #icon>
                                    <PlusOutlined />
                                </template>
                                新增
                            </a-button>
                        </a-col>
                        <a-col v-if="permission.includes('delete')" class="w90 ml10">
                            <a-button block danger @click="handleDelete">
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
                :dataSource="dataSource"
                :columns="columns"
                :loading="tableLoading"
                :pagination="pagination"
                @change="handleTableChange"
                :row-key="(record) => record.enum_id"
                bordered
                :row-selection="{selectedRowKeys:userTableSelectedKeys,onChange:onUserTableSelectChange}"
        >
            <template #bodyCell="{ record, column }">
                <template v-if="column.key === 'operation'">
                    <a v-if="permission.includes('edit')" class="btn-edit" style="margin-right: 10px" @click="handleOpenDrawer('edit', record)">编辑</a>
                </template>
            </template>
        </a-table>
        <a-drawer
                v-model:visible="addFormShow"
                :title="flag === 'add' ? '新增字典':'修改字典'"
                :closable="false"
                :maskClosable="false"
                width="80%"
        >
            <template #extra>
                <close-outlined @click="addFormShow = false" />
            </template>
            <a-form ref="dictFormRef" :model="dictFormState" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
                <a-form-item label="字典编码" name="enum_code" :rules="[{required:true,message:'字典编码不能为空',trigger: 'blur'}]">
                    <a-input v-model:value="dictFormState.enum_code" placeholder="请输入字典编码" allowClear :disabled="flag === 'edit'" />
                </a-form-item>
                <a-form-item label="字典名称" name="enum_name" :rules="[{required:true,message:'字典名称不能为空',trigger: 'blur'}]">
                    <a-input v-model:value="dictFormState.enum_name" placeholder="请输入字典名称" allowClear />
                </a-form-item>
                <a-form-item label="上级节点" name="up_enum" :rules="[{required:true,message:'上级节点不能为空',trigger: 'change'}]">
                  <a-tree-select
                      v-model:value="dictFormState.up_enum"
                      show-search
                      :tree-line="{ showLeafIcon:true }"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      placeholder="请选择上级节点"
                      allow-clear
                      :tree-data="parentTreeData"
                      :treeExpandedKeys="treeExpandedKeys"
                      :field-names="{
                        children: 'children',
                        label: 'enum_name',
                        value: 'enum_id',
                      }"
                      @click="getParentDic()"
                      @select="onSelectNode"
                      @treeExpand="onTreeExpand"
                      :disabled="flag === 'edit'"
                  >
                  </a-tree-select>
                </a-form-item>
                <a-form-item label="字典类型" name="enum_type" >
                    <a-input v-model:value="dictFormState.enum_type" placeholder="请输入字典类型" allowClear />
                </a-form-item>
                <a-form-item label="字典排序" name="enum_order" :rules="[{required:true,validator: validatorNum,trigger: 'blur'}]">
                    <a-input v-model:value="dictFormState.enum_order" placeholder="请输入排序序号" allowClear />
                </a-form-item>
            </a-form>
            <template #footer>
                <a-space :size="8">
                    <a-button @click="addFormShow = false">取消</a-button>
                    <a-button type="primary" :loading="saveBtnLoading" @click="save">保存</a-button>
                </a-space>
            </template>
        </a-drawer>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {Ref} from 'vue-property-decorator';
import { createVNode } from 'vue';
import {FormInstance,message, Modal} from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import {
    CloseOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    LeftOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from '@ant-design/icons-vue';
import {baseApi, Header, ResponseData} from '@/libs/BaseApi';
import { UploadOutlined } from '@ant-design/icons-vue';
import {global} from '@/libs/Global';
import {AxiosRequestHeaders} from 'axios';

@Options({
    components: {
        ExclamationCircleOutlined,
        LeftOutlined,
        UploadOutlined,
        CloseOutlined,
        SearchOutlined,
        DeleteOutlined,
        PlusOutlined,
        ReloadOutlined
    }
})
export default class Dict extends Vue {
    @Ref('dictFormRef') readonly dictFormRef!: FormInstance;
    @Ref('queryForm') readonly queryForm!: FormInstance;
    public pagination = {
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total: any) => `共 ${total} 条`,
        current: 1
    };
    public dictFormState:any = {
        enum_id:'',
        enum_code:'',
        enum_name:'',
        up_enum:undefined,
        enum_type:'',
        enum_order:''
    };
    public treeExpandedKeys:string[]=[]
    public enumTypeDisabled=false
    public flag = '';
    public tableLoading = true;
    public addFormShow = false;
    public userTableSelectedKeys:string[]=[]
    public treeData:any=[]
    public parentTreeData:any=[]
    public queryFormState = {
        enum_name:'',
        enum_code:'',
        enum_type:'',
    }
    public permission:any = []
    public saveBtnLoading=false
    public dataSource: any = [];
    public columns = [
        {
            title: '序号',
            dataIndex: 'rn',
            align: 'center'
        },
        {
            title: '字典编码',
            dataIndex: 'enum_code',
            align: 'center',
        },
        {
            title: '字典名称',
            dataIndex: 'enum_name',
            align: 'center',
        },
        {
            title: '字典类型',
            dataIndex: 'enum_type',
            key: 'enum_type',
            width: 150,
            ellipsis:true
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
        },
    ];
    public created(): void {
        this.getDictList();
        this.getPermsBtn(); // 权限
    }
    public getPermsBtn() {
        let per:any={}
        if(global.userInfo){
            per = global.userInfo.permsBtn
        }
        this.permission = per['dict'] || []
    }
    public handleTableChange(pagination: any) {
        (this.pagination as any).current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getDictList();
    }
    //查询列表
    public getDictList() {
        const header:Header= {
          request: (header: AxiosRequestHeaders) => {
            header.nowPage = this.pagination.current;
            header.row4Page = this.pagination.pageSize;
          }
        }
        this.tableLoading = true;
        baseApi.post('/dic/queryDic.do', this.queryFormState, 'sec',header).then((res: ResponseData<any, any>) => {
            this.tableLoading = false;
            this.pagination.total = (res as any).recordsTotal;
            this.dataSource = res.data;
            this.treeData = [{
                'enum_code': 'root',
                'enum_id': 'root',
                'enum_name': '根节点',
                'up_enum': '0',
                'title': 'root',
                'children': [...res.data]
            }]
        }).catch(()=>{
            this.tableLoading=false
        })
    }
    //重置查询条件
    public reset(){
        this.queryForm.resetFields()
    }
    //新增/修改
    public handleOpenDrawer(flag: any, row?: any) {
        this.addFormShow = true;
        this.flag = flag
        this.$nextTick(()=>{
            this.dictFormRef.resetFields()
            if (flag == 'edit') {
                 
                Object.keys(this.dictFormState).forEach(key=>{
                    this.dictFormState[key]=row[key]
                })
                if(row.up_enum!=='root'){
                    this.enumTypeDisabled=true
                }else {
                    this.enumTypeDisabled=false
                }
                this.treeExpandedKeys=[row.enum_id]
                 
            }else {
                this.enumTypeDisabled=false
                this.treeExpandedKeys=[this.treeData[0].enum_id]
            }
        })
    }
    public validatorNum(_rule: Rule, value: string){
        if(!value){
            return Promise.reject('字典排序不能为空');
        }
        if (!(/(^[1-9]\d*$)/.test(value))) {
            return Promise.reject('仅可输入正整数');
        } else {
            return Promise.resolve();
        }
    }
    public save() {
        this.dictFormRef.validate().then(()=>{
            if(this.flag === 'add') {
                this.addFormOk()
            }else {
                this.editFormOk()
            }
        })
    }
    //上级节点选择
    public onSelectNode(value:string, node:any){
         
        if(node.up_enum!=='root'){
            this.dictFormState.enum_type=node.enum_type
            this.enumTypeDisabled=true
        }else {
            this.dictFormState.enum_type=''
            this.enumTypeDisabled=false
        }
    }
    public onTreeExpand(expandedKeys:string[]){
        this.treeExpandedKeys=expandedKeys
    }
    //新增确认按钮
    public addFormOk(): void {
        this.saveBtnLoading=true
        baseApi.post('/dic/addDic.do', this.dictFormState, 'sec').then(() => {
            this.saveBtnLoading=false
            this.addFormShow = false;
            message.success('新增成功');
            this.getDictList();
        }).catch(()=>{
            this.saveBtnLoading=false
        })
    }
    //修改确认按钮
    public editFormOk(): void {
        this.saveBtnLoading=true
        baseApi.post('/dic/mdfDic.do', this.dictFormState, 'sec').then(() => {
            this.saveBtnLoading=false
            this.addFormShow = false;
            message.success('修改成功');
            this.getDictList();
        }).catch(()=>{
            this.saveBtnLoading=false
        })
    }
    //删除
    public handleDelete() {
        if(this.userTableSelectedKeys.length > 0){
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '您确定要删除吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    baseApi.post('/dic/delDicList.do', {ids:this.userTableSelectedKeys  }, 'sec').then(() => {
                        message.success('删除成功');
                        this.userTableSelectedKeys = []
                        this.pagination.current=1
                        this.pagination.pageSize=10
                        this.getDictList();
                    })
                },
            });
        } else {
            message.error('请至少选择一条记录!');
        }
    }

    //列表选中项
    public onUserTableSelectChange (selectedRowKeys: string[]) {
         
        this.userTableSelectedKeys = selectedRowKeys;
    };

  public getParentDic(): void {
    baseApi.post('/dic/queryDicNoPage.do', {}, 'sec').then((res: ResponseData<any, any>) => {
      this.parentTreeData = [{
        'enum_code': 'root',
        'enum_id': 'root',
        'enum_name': '根节点',
        'up_enum': '0',
        'title': 'root',
        'children': [...res.data]
      }]
    }).catch(()=>{
       
    })
  }

}
</script>
<style scoped lang="less">
.dict-page{
    .tool-wrap {
        .ant-form-item{
            margin-bottom: 0;
        }
    }
    .btn-edit{
        color:var(--custom-primary-color)
    }
}

</style>
