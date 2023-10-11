<template>
    <div class="resource-page">
      <div class="tool-wrap mb24">
        <a-row type="flex" align="middle" justify="space-between">
            <a-col :lg="7" :xl="6" class="mt24">
                <a-form ref="queryForm" :model="queryFormState" :label-col="{style: { width: '70px' }}">
                    <a-row>
                        <a-col :md="24" :lg="24" :xl="24">
                            <a-form-item label="资源名称" name="resource_name">
                                <a-input v-model:value="queryFormState.resource_name" placeholder="请输入资源名称" allowClear />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-col>
          <a-col class="mt24">
            <a-row>
              <a-col class="w90">
                <a-button type="primary" block @click="getResourceList">
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
                <a-button type="primary" block @click="addOrEdit('add')">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    新增
                </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <a-table
          :dataSource="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          :row-key="(record) => record.resource_type"
          bordered
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'operation'">
            <a v-if="permission.includes('edit')" class="btn-edit" style="margin-right: 10px" @click="addOrEdit('edit', record)">编辑</a>
            <a v-if="permission.includes('delete')" style="color: red" @click="handleDelete(record)">删除</a>
          </template>
        </template>
      </a-table>
      <a-drawer
              v-model:visible="addFormShow"
              :title="flag === 'add' ? '新增资源':'修改资源'"
              :closable="false"
              :maskClosable="false"
              width="80%"
      >
          <template #extra>
              <close-outlined @click="addFormShow = false" />
          </template>
            <a-form ref="resourceFormRef" :model="resourceFormState" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
              <a-form-item label="资源类型" name="resource_type" :rules="[{required:true,message:'资源类型不能为空',trigger: 'change'}]">
                <a-select ref="select" placeholder="请选择资源类型" v-model:value="resourceFormState.resource_type" allowClear>
                  <a-select-option v-for="item in resource_type" :key="item.enum_id" :value="item.enum_code">{{ item.enum_name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="资源名称" name="resource_name" :rules="[{required:true,message:'资源名称不能为空',trigger: 'blur'}]">
                  <a-input v-model:value="resourceFormState.resource_name" placeholder="请输入资源名称" allowClear />
              </a-form-item>
              <a-form-item label="资源来源" name="resource_source" :rules="[{required:true,message:'资源来源不能为空',trigger: 'change'}]">
                <a-select ref="select" placeholder="请选择资源来源" v-model:value="resourceFormState.resource_source" allowClear>
                  <a-select-option v-for="item in resource_source" :key="item.enum_id" :value="item.enum_code">{{ item.enum_name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="映射类型" name="mapping_type" :rules="[{required:true,message:'映射类型不能为空',trigger: 'change'}]">
                <a-select ref="select" placeholder="请选择映射类型" v-model:value="resourceFormState.mapping_type" allowClear>
                  <a-select-option v-for="item in mapping_type" :key="item.enum_id" :value="item.enum_code">{{ item.enum_name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="数据权限编码映射" name="mapping_id" :rules="[{required:true,message:'数据权限编码映射不能为空',trigger: 'blur'}]">
                    <a-input v-model:value="resourceFormState.mapping_id" placeholder="请输入数据权限编码映射" allowClear />
              </a-form-item>
              <a-form-item label="数据权限名称映射" name="mapping_name" :rules="[{required:true,message:'数据权限名称映射不能为空',trigger: 'blur'}]">
                    <a-input v-model:value="resourceFormState.mapping_name" placeholder="请输入数据权限名称映射" allowClear />
              </a-form-item>
              <a-form-item label="映射表" name="mapping_tab" :rules="[{required:true,message:'映射表不能为空',trigger: 'blur'}]">
                    <a-input v-model:value="resourceFormState.mapping_tab" placeholder="请输入映射表" allowClear />
              </a-form-item>
              <a-form-item label="映射父节点" name="mapping_parent">
                    <a-input v-model:value="resourceFormState.mapping_parent" placeholder="请输入映射父节点" allowClear />
              </a-form-item>
                <a-form-item label="映射排序字段" name="mapping_order">
                    <a-input v-model:value="resourceFormState.mapping_order" placeholder="请输入映射排序字段" allowClear />
                </a-form-item>
              <a-form-item label="映射规则" name="mapping_rule">
                  <a-textarea v-model:value="resourceFormState.mapping_rule" placeholder="请输入映射规则" :auto-size="{ minRows: 2, maxRows: 5 }" allowClear />
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
import {Options, Vue} from 'vue-class-component';
import {createVNode} from 'vue';
import {FormInstance, message, Modal} from 'ant-design-vue';
import {
    CloseOutlined,
    ExclamationCircleOutlined,
    LeftOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons-vue';
import {baseApi, Header, ResponseData} from '@/libs/BaseApi';
import {AxiosRequestHeaders} from 'axios';
import {Ref} from 'vue-property-decorator';
import {global} from '@/libs/Global';

@Options({
    components: {
        ExclamationCircleOutlined,
        LeftOutlined,
        CloseOutlined,
        SearchOutlined,
        PlusOutlined,
        ReloadOutlined
    }
})
export default class formSetList extends Vue {
    @Ref('queryForm') readonly queryForm!: FormInstance;
    @Ref('resourceFormRef') readonly resourceFormRef!: FormInstance;
    public pagination = {
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total: any) => `共 ${total} 条`,
        current: 1
    };
    public resourceFormState:any= {
        resource_type:undefined,
        resource_name:'',
        resource_source:undefined,
        mapping_type:undefined,
        mapping_id:'',
        mapping_name:'',
        mapping_tab:'',
        mapping_parent:'',
        mapping_order:'',
        mapping_rule:''
    };
    public flag = '';
    public loading = true;
    public addFormShow = false;
    public resource_type: any = [];
    public resource_source: any = [];
    public mapping_type: any = [];
    public permission: any = [];
    public queryFormState = {
        resource_name:''
    }
    public saveBtnLoading=false
    public dataSource: any = [];
    public columns = [
        {
            title: '序号',
            dataIndex: 'rn',
            align: 'center'
        },
        {
            title: '资源类型',
            dataIndex: 'resource_type',
            key: 'resource_type',
            align: 'center',
        },
        {
            title: '资源名称',
            dataIndex: 'resource_name',
            key: 'resource_name',
            align: 'center',
        },
        {
            title: '资源来源',
            dataIndex: 'resource_source_name',
            key: 'resource_source_name',
            align: 'center',
        },
        {
            title: '映射类型',
            dataIndex: 'mapping_type_name',
            key: 'mapping_type_name',
            align: 'center',
        },
        {
            title: '数据权限编码映射',
            dataIndex: 'mapping_id',
            key: 'mapping_id',
            align: 'center',
        },
        {
            title: '数据权限名称映射',
            dataIndex: 'mapping_name',
            key: 'mapping_name',
            align: 'center',
        },
        {
            title: '映射表',
            dataIndex: 'mapping_tab',
            key: 'mapping_tab',
            align: 'center',
        },
        {
            title: '映射父节点',
            dataIndex: 'mapping_parent',
            key: 'mapping_parent',
            align: 'center',
        },
        {
            title: '映射规则',
            dataIndex: 'mapping_rule',
            key: 'mapping_rule',
            align: 'center',
            ellipsis: true
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
        },
    ];
    public created(): void {
        this.getResourceList();
        this.getEnumList()
        this.getPermsBtn(); // 权限
    }

    public getPermsBtn() {
        let per:any={}
        if(global.userInfo){
            per = global.userInfo.permsBtn
        }
        this.permission = per['resource'] || []
    }
    public handleTableChange(pagination: any) {
        (this.pagination as any).current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getResourceList();
    }

    //查询列表
    public getResourceList() {
        const header: Header = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.pagination.current;
                header.row4Page = this.pagination.pageSize;
            }
        }
        this.loading = true;
        baseApi.post('/resource/queryResource.do', this.queryFormState, 'sec', header).then((res: ResponseData<any, any>) => {
            this.loading = false;
            this.pagination.total = (res as any).recordsTotal;
            this.dataSource = res.data;
        }).catch(()=>{
            this.loading=false
        })
    }
    public reset(){
        this.queryForm.resetFields()
    }
    //新增/修改
    public addOrEdit(flag: any, row?: any) {
        this.addFormShow = true;
        this.flag = flag
        this.$nextTick(() => {
            this.resourceFormRef.resetFields()
            if (flag == 'edit') {
                Object.keys(this.resourceFormState).forEach(key=>{
                    this.resourceFormState[key]=row[key]
                })
            }
        })
    }
    public save() {
        this.resourceFormRef.validate().then(() => {
            this.saveBtnLoading=true
            if (this.flag === 'add') {
                this.addFormOk()
            } else {
                this.editFormOk()
            }
        })
    }

    //新增确认按钮
    public addFormOk(): void {
        baseApi.post('/resource/addResource.do', this.resourceFormState, 'sec').then(() => {
            this.saveBtnLoading = false
            this.addFormShow = false;
            message.success('新增成功');
            this.getResourceList();
        }).catch(()=>{
            this.saveBtnLoading=false
        })
    }

    //修改确认按钮
    public editFormOk(): void {
        baseApi.post('/resource/mdfResource.do', this.resourceFormState, 'sec').then(() => {
            this.saveBtnLoading = false
            this.addFormShow = false;
            message.success('修改成功');
            this.getResourceList();
        }).catch(()=>{
            this.saveBtnLoading=false
        })
    }

    //删除
    public handleDelete(row: any) {
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                baseApi.post('/resource/delResource.do', {resource_type: row.resource_type}, 'sec').then(() => {
                    message.success('删除成功');
                    this.getResourceList();
                })
            }
        });
    }

    // 获取字典列表
    public getEnumList() {
        baseApi.post('/dic/queryDicList.do', {codes: ['resource_type', 'resource_source', 'mapping_type']}, 'sec').then((res: any) => {
            this.resource_type = res.defmap.resource_type || []
            this.resource_source = res.defmap.resource_source || []
            this.mapping_type = res.defmap.mapping_type || []
        });
    }
}
</script>
<style scoped lang="less">
.resource-page{
    .tool-wrap {
        .ant-form-item {
            margin-bottom: 0;
        }
    }

    .btn-edit {
        color: var(--custom-primary-color)
    }
}
</style>
