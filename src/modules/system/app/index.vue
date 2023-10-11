<template>
    <div class="app-page">
      <div class="tool-wrap mb24">
        <a-row type="flex" justify="space-between">
          <a-col :lg="7" :xl="6" class="mt24">
              <a-form ref="queryForm" :model="queryFormState" :label-col="{style: { width: '70px' }}">
                  <a-row>
                      <a-col :md="24" :lg="24" :xl="24">
                          <a-form-item label="应用名称" name="app_name">
                              <a-input v-model:value="queryFormState.app_name" placeholder="请输入应用名称" allowClear />
                          </a-form-item>
                      </a-col>
                  </a-row>
              </a-form>
          </a-col>
          <a-col class="mt24">
            <a-row>
              <a-col class="w90">
                <a-button type="primary" block @click="getAppList">
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
          :row-key="(record) => record.app_id"
          bordered
      >
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'operation'">
            <a v-if="permission.includes('edit')" class="btn-edit" style="margin-right: 10px" @click="addOrEdit('edit', record)">编辑</a>
            <a v-if="permission.includes('delete')" style="color: red" @click="deleteApp(record)">删除</a>
          </template>
        </template>
      </a-table>
      <a-drawer
              v-model:visible="addFormShow"
              :title="flag === 'add' ? '新增应用':'修改应用'"
              :closable="false"
              :maskClosable="false"
              width="80%"
      >
          <template #extra>
              <close-outlined @click="addFormShow = false" />
          </template>
            <a-form ref="appFormRef" :model="appFormState" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
              <a-form-item label="应用名称" name="app_name" :rules="[{required:true,message:'应用名称不能为空',trigger: 'blur'}]">
                <a-input v-model:value="appFormState.app_name" placeholder="请输入应用名称" allowClear />
              </a-form-item>
              <a-form-item label="应用描述" name="app_description" :rules="[{required:true,message:'应用描述不能为空',trigger: 'blur'}]">
                <a-input v-model:value="appFormState.app_description" placeholder="请输入应用描述" allowClear />
              </a-form-item>
              <!-- <a-form-item name="upload" label="应用图标" extra="">
                <a-upload
                    v-model:file-list="fileList"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    list-type="picture"
                    :max-count="1"
                    :customRequest="uploadMethod"
                    @preview="previewHandle"
                >
                  <a-button><upload-outlined></upload-outlined>点击上传</a-button>
                </a-upload>
              </a-form-item> -->

              <a-form-item label="应用图标" name="app_headpic">
                                <a-popover v-model:visible="showIconSelectPopover" trigger="click"
                                           :overlayStyle="{width:'34%'}">
                                    <template #content>
                                        <div class="icon-list">
                                            <div
                                                    class="icon-list_item"
                                                    v-for="(item, index) in iconList"
                                                    :key="index"
                                                    @click="handleSelectedIcon(item)"
                                            >
                                                <svg-icon
                                                        color="#999"
                                                        :name="item"
                                                        size="18"
                                                />
                                                <span>{{ item }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <a-input v-model:value="appFormState.app_headpic" placeholder="点击选择图标" allowClear
                                    >
                                        <template v-if="appFormState.app_headpic" #prefix>
                                            <svg-icon color="#999" :name="appFormState.app_headpic"/>
                                        </template>
                                    </a-input>
                                </a-popover>
                            </a-form-item>

              







              <a-form-item label="应用地址" name="app_url" :rules="[{required:true,message:'应用地址不能为空',trigger: 'blur'}]">
                  <a-input v-model:value="appFormState.app_url" placeholder="请输入应用地址" allowClear />
              </a-form-item>
              <a-form-item label="应用分组" name="app_group" :rules="[{required:true,message:'应用分组不能为空',trigger: 'change'}]">
                <a-select placeholder="请选择应用分组" v-model:value="appFormState.app_group" allowClear>
                  <a-select-option v-for="item in app_group" :key="item.enum_id" :value="item.enum_code">{{ item.enum_name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="应用是否开放" name="app_open">
                <a-select ref="select" placeholder="请选择应用是否开放" v-model:value="appFormState.app_open" allowClear>
                  <a-select-option :value="1">是</a-select-option>
                  <a-select-option :value="0">否</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="应用是否可用" name="app_status" :rules="[{required:true,message:'应用是否可用不能为空',trigger: 'change'}]">
                <a-select ref="select" placeholder="请选择应用是否可用" v-model:value="appFormState.app_status" allowClear>
                  <a-select-option :value="1">是</a-select-option>
                  <a-select-option :value="0">否</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="应用是否显示" name="app_show" :rules="[{required:true,message:'应用是否显示不能为空',trigger: 'change'}]">
                <a-select ref="select" placeholder="请选择应用是否显示" v-model:value="appFormState.app_show" allowClear>
                  <a-select-option :value="1">是</a-select-option>
                  <a-select-option :value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
            <template #footer>
                <a-space :size="8">
                    <a-button @click="addFormShow = false">取消</a-button>
                    <a-button type="primary" :loading="saveBtnLoading" @click="save">保存</a-button>
                </a-space>
            </template>
        </a-drawer>
        <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="previewVisible=false">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>
<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Ref} from 'vue-property-decorator';
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
import Axios, {AxiosRequestHeaders} from 'axios';
import Config from '@/libs/Config';
import {global} from '@/libs/Global';
import {UploadOutlined} from '@ant-design/icons-vue';

@Options({
    components: {
        ExclamationCircleOutlined,
        LeftOutlined,
        UploadOutlined,
        CloseOutlined,
        SearchOutlined,
        PlusOutlined,
        ReloadOutlined
    }
})
export default class App extends Vue {
    @Ref('queryForm') readonly queryForm!: FormInstance;
    @Ref('appFormRef') readonly appFormRef!: FormInstance;
    public pagination = {
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total: any) => `共 ${total} 条`,
        current: 1
    };
    public appFormState: any = {
        app_id:'',
        app_name:'',
        app_description:'',
        app_headpic:'', 
        app_url:'',
        app_group:undefined,
        app_open:undefined,
        app_status:1,
        app_show:1,
    };
    public flag = '';
    public loading = true;
    public addFormShow = false;
    public fileList: any[] = [];
    public permission: any[] = [];
    public previewImage = '';
    public previewTitle = '';
    public previewVisible = false;
    public queryFormState = {
        app_name:''
    }
    public saveBtnLoading = false
    public dataSource: any = [];
    public app_group: any = [];
    public columns = [
        {
            title: '序号',
            dataIndex: 'rn',
            align: 'center'
        },
        {
            title: '应用名称',
            dataIndex: 'app_name',
            align: 'center',
        },
        {
            title: '应用描述',
            dataIndex: 'app_description',
            align: 'center',
            ellipsis: true
        },
        {
            title: '应用图标',
            dataIndex: 'app_headpic',
            align: 'center',
            ellipsis: true
        },
        {
            title: '应用地址',
            dataIndex: 'app_url',
            align: 'center',
            ellipsis: true
        },
        {
            title: '应用分组',
            dataIndex: 'app_group',
            align: 'center',
        },
        {
            title: '应用是否开放',
            dataIndex: 'app_open_name',
            align: 'center'
        },
        {
            title: '应用是否可用',
            dataIndex: 'app_status_name',
            align: 'center'
        },
        {
            title: '应用是否显示',
            dataIndex: 'app_show_name',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center'
        },
    ];
    public showIconSelectPopover=false
    public iconList:string[]=[]




    public created(): void {
        this.getAppList();
        this.getEnum()
        this.getPermsBtn(); // 权限
        const files=require.context('@/icons/svg',false,/\.svg$/)
        files.keys().forEach(key => {
            this.iconList.push(key.replace(/(\.\/|\.svg)/g, ''))
        })
    }

     //图标选择
     public handleSelectedIcon(iconName:string){
        this.appFormState.app_headpic=iconName
        this.showIconSelectPopover=false
    }







    public getPermsBtn() {
        let per:any={}
        if(global.userInfo){
            per = global.userInfo.permsBtn
        }
        this.permission = per['app'] || []
    }
    public handleTableChange(pagination: any) {
        (this.pagination as any).current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getAppList();
    }

    //查询列表
    public getAppList() {
        const header: Header = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.pagination.current;
                header.row4Page = this.pagination.pageSize;
            }
        }
        this.loading = true;
        baseApi.post('/app/queryApp.do', this.queryFormState, 'sec', header).then((res: ResponseData<any, any>) => {
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
            this.appFormRef.resetFields()
            if (flag == 'edit') {
                 
                Object.keys(this.appFormState).forEach(key=>{
                    if(row[key]){
                        this.appFormState[key]=row[key]
                    }
                })
                if (row.app_headpic) {
                    this.fileList = [{
                        name:row.app_name,
                        status:'done',
                        thumbUrl:row.app_headpic
                    }]
                    this.appFormState.app_headpic=row.app_headpic
                } else {
                    this.fileList = []
                }
            } else {
                this.fileList = []
            }
        })
    }

    save() {
        this.appFormRef.validate().then(() => {
            this.saveBtnLoading = true
            if (this.flag === 'add') {
                this.addFormOk()
            } else {
                this.editFormOk()
            }
        })
    }

    //新增确认按钮
    public addFormOk(): void {
         
        for(const key in this.appFormState){
             
        }
        baseApi.post('/app/addApp.do', this.appFormState, 'sec').then(() => {
            this.saveBtnLoading = false
            this.addFormShow = false;
            message.success('新增成功');
            this.getAppList();
        }).catch(()=>{
            this.saveBtnLoading=false
        })
    }

    //修改确认按钮
    public editFormOk(): void {
         
        for(const key in this.appFormState){
            if(this.appFormState[key]===undefined){
                this.appFormState[key]=''
            }
        }
        baseApi.post('/app/mdfApp.do', this.appFormState, 'sec').then(() => {
            this.saveBtnLoading = false
            this.addFormShow = false;
            message.success('修改成功');
            this.getAppList();
        }).catch(()=>{
            this.saveBtnLoading=false
        })
    }

    //删除
    public deleteApp(item: any): void {
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                baseApi.post('/app/delApp.do', {app_id: item.app_id}, 'sec').then(() => {
                    message.success('删除成功');
                    this.getAppList();
                })
            }
        });
    }

    public uploadMethod(params: any) {
        const axios = Axios.create({
            baseURL: Config.baseUrl,
            timeout: 1000 * 60,
        });
        const formData = new FormData();
        formData.append('file', params.file);
        axios.interceptors.request.use((config) => {
            (config.headers as any)['X-Auth-Token'] = global.sessionToken;
            (config.headers as any)['Accept'] = 'multipart/form-data';
            return config;
        });
        const postUrl = '/form/sysData/uploadImage';
        axios.post(postUrl, formData).then((res) => {
             
            this.appFormState.app_headpic=res.data
            const finRes = {
                status: 'success',
                url: res.data,
            };
            params.file.status = 'success';
            params.onSuccess(finRes);
        }).catch(() => {
            message.error('上传失败')
            this.fileList=[]
        });
    }

    public previewHandle(file: any) {
         
        this.previewImage = file.thumbUrl;
        this.previewVisible = true;
        this.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    }

    // 获取字典
    public getEnum() {
        baseApi.post('/dic/queryDicByCode.do', {enum_code: 'app_group'}, 'sec').then((res: ResponseData<any, any>) => {
            this.app_group = res.data
        });
    }
}
</script>
<style scoped lang="less">
.app-page{
    .tool-wrap {
        .ant-form-item {
            margin-bottom: 0;
        }
    }

    .btn-edit {
        color: var(--custom-primary-color)
    }
}
.icon-list{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 200px;
    overflow-y: scroll;

    .icon-list_item {
        display: flex;
        align-items: center;
        flex: 0 1 33%;
        height: 28px;
        cursor: pointer;
    }
    .svg-icon{
        margin-right: 5px;
    }
}
</style>
