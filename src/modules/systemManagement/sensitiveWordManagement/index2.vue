<template>
    <div>
        <!-- 敏感词管理 -->
        <!-- 表单内容 -->
        <div class="form">
            <div class="choose-select">
                <a-row>
                    <!-- 敏感词分类 -->
                    <a-col :span="7" class="row">
                        <span>敏感词分类：</span>
                        <a-select ref="select" v-model:value="sensitiveTypeName" style="width:180px;border-radius: 4px;">
                            <a-select-option v-for="item in sensitiveTypeNameList" :key="item.id">
                                {{ item.label}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <!-- 敏感词名称 -->
                    <a-col :span="7" class="row">
                        <span>敏感词名称：</span>
                        <a-input style="width:60%;border-radius: 4px;" v-model:value="sensitiveName" placeholder="请输入" />
                    </a-col>
                    <!-- 更新时间 -->
                    <a-col :span="9" class="row">
                        <span>更新时间：</span>
                        <a-date-picker style="width:30%;border-radius: 4px;margin-right: 8px;"
                            valueFormat="YYYY-MM-DD 00:00:00" 
                            v-model:value="mdfStartDate" 
                            :disabledDate="disabledDateStart"
                            placeholder="开始时间" />
                        <span>至</span>
                        <a-date-picker style="width:30%;border-radius: 4px;margin-left:8px"
                            valueFormat="YYYY-MM-DD 23:59:59" v-model:value="mdfEndDate" :disabled-date="disableEndTime"
                            placeholder="结束时间" />
                    </a-col>
                    <!-- 查询重置 -->
                    <a-col :span="4" class="row">
                        <div style="flex-direction:row;">
                            <a-button class="inquire" type="primary" ghost @click="getList">查询</a-button>
                            <a-button class="reset" type="primary" ghost @click="cancleBtn"
                                style="margin-left: 5px">重置</a-button>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <!-- 按钮 -->
        <div>
            <div class="newbtn">
                <a-button class="newly" type="primary" @click="newSensitiveWords(record)">新增敏感词</a-button>
                <a-button class="delete" type="primary" @click="deleteInBatches(record)">批量删除</a-button>
            </div>
            <!-- <a-modal v-model:visible="showModal" title="新增敏感词" @ok="newModalOk">
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                    <a-button type="dashed" block @click="addUser"
                        style="float: right;width: 80px;height: 30px;margin-top: 2px;">
                        <PlusOutlined />
                        子分类
                    </a-button>
                    <a-form-item label="敏感词分类：" name="sensitiveTypeName"
                        :rules="[{ required: true, message: '敏感词分类不能为空', trigger: 'blur' }]">
                        <a-auto-complete
                            v-model:value="addFormState.sensitiveTypeName"
                            :options="sensitiveTypeNameList"
                            style="width: 292px"
                            placeholder="请输入(可新增也可下拉展示已有的敏感词分类)"
                            :filter-option="filterOption"
                        />
                    </a-form-item>
                    <a-space v-for="(sensitive, index) in addFormState.sensitiveTypeDtoList" 
                        :key="sensitive.sensitiveTypeId" 
                        style="margin-bottom: 8px;width: 100%;" align="baseline">
                        <a-form-item label="子分类名称" name="subclassName" :Name="['sensitives', index, 'first']" :rules="{
                            required: false,
                            message: '请先选择敏感词分类再新建“子分类”',
                            trigger: 'blur'
                        }" style="font-size: 12px;display: flex;">
                            <a-input v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称"
                                style="margin-left: 10px;
                                float: left;
                                padding-left: 80px;" />
                        </a-form-item>
                        <button style="margin-left: 20px;" @click="removeUser(sensitive)">删除</button>
                    </a-space>
                    <a-form-item style="float: right;width: 80px;height: 40px;margin-top: 10px;">
                    </a-form-item>
                    <a-form-item label="敏感词名称：" name="sensitiveName"
                        :rules="[{ required: true, message: '请先选择“敏感词分类”再录入“敏感词名称”', trigger: 'blur' }]">
                        <a-textarea v-model:value="addFormState.sensitiveName" showCount :maxlength="10"
                            placeholder="请输入敏感词名称" />
                    </a-form-item>
                </a-form>
            </a-modal> -->
            <a-modal v-model:visible="showModal" title="新增敏感词" @ok="newModalOk">
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-button type="dashed" block @click="addUserid"
                        style="float: right;width: 80px;height: 40px;margin-top: 5px;">
                        <PlusOutlined />
                        子分类
                    </a-button>
                    <a-form-item label="敏感词分类" name="sensitiveTypeName"
                        :rules="[{ required: true, message: '敏感词分类不能为空', trigger: 'blur' }]">
                        <a-auto-complete
                            v-model:value="addFormState.sensitiveTypeName"
                            style="width: 292px"
                            placeholder="请输入(可新增也可下拉展示已有的敏感词分类)"
                            :filter-option="filterOption"
                        />
                    </a-form-item>
                    <a-space v-for="(sensitive, index) in addFormState.sensitiveTypeDtoList"
                        :key="sensitive.sensitiveTypeId" 
                        style="margin-bottom: 8px" align="baseline">
                        <a-form-item label="子分类名称" name="subclassName" :Name="['sensitives', index, 'first']" :rules="{
                            required: false,
                            message: '请先选择敏感词分类再新建“子分类”',
                            trigger: 'blur'
                        }" style="font-size: 12px;display: flex;">
                            <a-input v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称"
                                style="margin-left: 10px;
                                float: left;
                                padding-left: 80px;" />
                        </a-form-item>
                        <button style="margin-left: 20px;" @click="removeUserid(sensitive)">删除</button>
                        <!-- <MinusCircleOutlined @click="removeUser(user)" /> -->
                    </a-space>
                    <a-form-item style="float: right;width: 80px;height: 40px;margin-top: 10px;">
                        <!-- <a-button @click="delete" :disabled="disabled" type="primary" html-type="submit">删除</a-button> -->
                    </a-form-item>
                    <a-form-item label="敏感词名称" name="sensitiveName"
                        :rules="[{ required: true, message: '请先选择“敏感词分类”再录入“敏感词名称”', trigger: 'blur' }]">
                        <a-textarea v-model:value="addFormState.sensitiveName" showCount :maxlength="10"
                            placeholder="请输入敏感词名称" />
                    </a-form-item>
                </a-form>
            </a-modal>

        </div>
        <!-- 表格 -->
        <!-- :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" -->
        <div>
            <a-table class="table" 
                :row-key="(record:any) => record.sensitiveId"
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                :data-source="userTableData" :columns="userTableColumns" :pagination="userTablePagination"
                :loading="userTableLoading" :locale="locale" @change="handleTableChange" bordered>
                <template #bodyCell="{ record, column }">
                    <template v-if="column.key === 'operation'">
                        <div class="newbtn">
                            <a-button type="link" @click="editWords(record)" style="color: #fc0c0c;">编辑</a-button>
                            <a-button type="link" @click="sensitiveDelete(record)" style="color: #fc0c0c;">删除</a-button>
                        </div>
                    </template>
                </template>
            </a-table>
            <a-modal v-model:visible="editModal" title="编辑敏感词" @ok="editModalOk">
                <a-form :model="editFormState" ref="editForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-button type="dashed" block @click="addUserid"
                        style="float: right;width: 80px;height: 40px;margin-top: 5px;">
                        <PlusOutlined />
                        子分类
                    </a-button>
                    <a-form-item label="敏感词分类" name="sensitiveTypeName"
                        :rules="[{ required: true, message: '敏感词分类不能为空', trigger: 'blur' }]">
                        <a-auto-complete
                            v-model:value="editFormState.sensitiveTypeName"
                            :options="sensitiveTypeNameList"
                            style="width: 292px"
                            placeholder="请输入(可新增也可下拉展示已有的敏感词分类)"
                            :filter-option="filterOption"
                        />
                    </a-form-item>
                    <a-space v-for="(sensitive, index) in editFormState.sensitiveTypeDtoList"
                        :key="sensitive.sensitiveTypeId" 
                        style="margin-bottom: 8px" align="baseline">
                        <a-form-item label="子分类名称" name="subclassName" :Name="['sensitives', index, 'first']" :rules="{
                            required: false,
                            message: '请先选择敏感词分类再新建“子分类”',
                            trigger: 'blur'
                        }" style="font-size: 12px;display: flex;">
                            <a-input v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称"
                                style="margin-left: 10px;
                                float: left;
                                padding-left: 80px;" />
                        </a-form-item>
                        <button style="margin-left: 20px;" @click="removeUserid(sensitive)">删除</button>
                        <!-- <MinusCircleOutlined @click="removeUser(user)" /> -->
                    </a-space>
                    <a-form-item style="float: right;width: 80px;height: 40px;margin-top: 10px;">
                        <!-- <a-button @click="delete" :disabled="disabled" type="primary" html-type="submit">删除</a-button> -->
                    </a-form-item>
                    <a-form-item label="敏感词名称" name="sensitiveName"
                        :rules="[{ required: true, message: '请先选择“敏感词分类”再录入“敏感词名称”', trigger: 'blur' }]">
                        <a-textarea v-model:value="editFormState.sensitiveName" showCount :maxlength="10"
                            placeholder="请输入敏感词名称" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </div>
</template>

<script lang="ts">
import { AxiosRequestHeaders } from 'axios';
import Encrypts from '@/libs/Encrypts';
import { systemManagementApi } from '@/libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode, defineComponent, reactive, ref, computed } from 'vue';
import { FormInstance, message, Modal, Form } from 'ant-design-vue';
import { ExclamationCircleOutlined, MinusCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { global } from '@/libs/Global';
import moment from 'moment';
import store from '@/modules/operation/store';
import { ColumnProps, } from 'ant-design-vue/es/table';

type Key = ColumnProps['key'];


//分页
interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showQuickJumper: true,
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}


//下拉框
interface ditchListType {
    label: string,
    value: string,
    id: string
}

//新增表单数据
interface AddFormType {
    sensitiveTypeName: any;
    sensitiveName: string;
    sensitiveTypeDtoList: any;
}

//编辑表单数据
interface editFormType {
    sensitiveTypeName: any;
    sensitiveName: string;
    sensitiveTypeDtoList: any;
}

interface sensitive {
    first: string;
    id: number;
    data: string;
}
//子分类表单数据
// interface sonFormType {
//     sonChainName: string;
// }

Options({
    components: {
        MinusCircleOutlined,
        PlusOutlined,
        // ExclamationCircleOutlined,
        // CloseOutlined,
        // SearchOutlined,
        // DeleteOutlined,
        // PlusOutlined,
        // ReloadOutlined,
        data :{

        }
    },
})

export default class User extends Vue {
    [x: string]: any;
    @Ref('addForm') readonly addForm!: FormInstance;
    @Ref('editForm') readonly editForm!: FormInstance;
    public showModal: boolean = false
    public editModal: boolean = false
    public permission: any = [];
    // public userTableData = [] as any[];
    public userTableData: any[] = [
        // {
        //     content_type_name:'p',
        //     sensitiveTypeName : '1',
        //     sensitiveName:'234',
        //     crtUser:'erw',
        //     feedback_status:'0'
        // },
        // {
        //     content_type_name:'b',
        //     sensitiveTypeName : '2',
        //     sensitiveName:'234',
        //     crtUser:'erw',
        //     feedback_status:'1'
        // },
        // {
        //     content_type_name:'t',
        //     sensitiveTypeName : '2',
        //     sensitiveName:'234',
        //     crtUser:'erw',
        //     feedback_status:'6'
        // }
    ];
    public states:any = store.state

    public computed() {
         
    }

    //初始化table表头
    public userTableColumns = [
        {
            title: '敏感词分类',
            dataIndex: 'sensitiveTypeName',
            align: 'center',
            key: 'sensitiveTypeName'
        },
        {
            title: '敏感词名称',
            dataIndex: 'sensitiveName',
            align: 'center',
            key: 'sensitiveName'

        },
        {
            title: '创建者',
            dataIndex: 'crtUser',
            key: 'crtUser',
            align: 'center',
        },
        {
            title: '触发次数',
            dataIndex: 'touchTimes',
            align: 'center',
            key: 'touchTimes'

        },
        {
            title: '更新时间',
            dataIndex: 'crtDate',
            align: 'center',
            key: 'crtDate'

        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',

        },
    ];

    //表单内容
    public created(): void {
        this.getList()
        this.sensitiveType = '0'
    }

    //敏感词名称
   public sensitiveName: string = ''

    //敏感词分类
    public sensitiveTypeName: string = ''
    //敏感词分类下拉框列表数据
    public sensitiveTypeNameList: ditchListType[] = [
        {
            label: '全部',
            value: '全部',
            id: ''
        },
        {
            label: '一',
            value: '一',
            id: '0'
        },
        {
            label: '二',
            value: '二',
            id: '1'
        },
    ]

    //时间选择器
    //开始时间
    public mdfStartDate: string = ''
    public disabledDateStart(current: any) {
        if (this.mdfEndDate) {
            return current > moment(this.mdfEndDate).endOf('day');
        } else {

        }
    }
    //结束时间
    public mdfEndDate: string = ''
    public disableEndTime(current: any) {
        if (this.mdfStartDate) {
            return (
                (current && current < moment(this.mdfStartDate).subtract(1, 'days').endOf('day'))
            );
        }
    }

    //查询敏感词列表
    public async getList() {
        //this.userTableLoading = true;
        let params = {
            sensitiveTypeName: this.sensitiveTypeName,
            sensitiveName: this.sensitiveName,
            mdfStartDate: this.mdfStartDate,
            mdfEndDate: this.mdfEndDate,
            // row4Page: this.userTablePagination.pageSize,
            // nowPage: this.userTablePagination.current,
        }
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            }
        }
        systemManagementApi.selectSensitiveMainInfo(params, header).then((res: any) => {
             

            this.userTableLoading = false;
            this.userTablePagination.total = (res as any).recordsTotal;
            this.userTableData = res.data
            // this.userTableData = res.data || [];
            // res.data.forEach((item: any) => {
            //     this.userTableData.push({
            //         key: item.sensitiveId,
            //         ...item
            //     })
            // })
             

            // res.data.forEach((item: any, index: number) => {
            //     this.userTableData.push({
            //         key:index,
            //         // item.sensitiveId
            //         ...item
            //     })

            // })
        }).catch(() => {
            this.userTableLoading = false;
        })

         

    }

    public state = reactive<{
        selectedRowKeys: Key[];
        loading: boolean;
    }>({
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    });
    public hasSelected = computed(() => this.state.selectedRowKeys.length > 0);

    public onSelectChange = (selectedRowKeys: Key[]) => {
         
        this.state.selectedRowKeys = selectedRowKeys;
    };
    //重置按钮
    public cancleBtn() {
        this.sensitiveName = ''
        this.sensitiveTypeName = ''
        this.mdfStartDate = ''
        this.mdfEndDate = ''
        this.userTablePagination.current = 1
        this.getList()
    }

    //分页
    public userTablePagination: PaginationType = {
        current: 1, //当前页数
        total: 0, //数据总数
        pageSize: 10, //每页中显示10条数据  每页条数
        //showLessItems   //是否显示较少页面内容
        //showQuickJumper  //是否可以快速跳转至某页
        //是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据 指定每页可以显示多少条
        showTotal: (total: number) => `共 ${total} 条`,//分页中显示总的数据 用于显示数据总量和当前数据顺序
    };
    public userTableLoading = false;  // 用户表加载

    //创建一个对象，判断如果满足条件就赋值，否者赋空
    public getPermsBtn() {
        let per: any = {};
        if (global.userInfo) {
            per = global.userInfo.permsBtn;
        }
        this.permission = per['user'] || [];
    }

    //用户列表上一页、下一页
    public handleTableChange(pagination: PaginationType) {
         
        this.userTablePagination.current = pagination.current;
        this.userTablePagination.pageSize = pagination.pageSize;
        this.getList();
        // return record.reachId;
    }

    // 新增敏感词弹框确认
    public async newModalOk() {
        this.addForm.validate().then(() => {
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认提交敏感词吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.addLabel()
                },
                onCancel:()=>{
                    this.showModal = false;
                }
            });
        });
    }
    public addLabel() {
        // 发请求 调用新增接口
        //this.userTableLoading = true;
        const params = {
            sensitiveTypeName: this.addFormState.sensitiveTypeName,
            sensitiveName: this.addFormState.sensitiveName,
            // newlyName: '1234',
            // sensitiveName: '2345',
            sensitiveTypeDtoList: this.addFormState.sensitiveTypeDtoList
            // this.sensitiveTypeName,
            // this.sensitiveTypeId,
            // this.parentId
            // users: [

            // ],
        }
        systemManagementApi.saveSensitiveMain(params, {}).then(() => {
            this.showModal = false;
            message.success('新增成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    //打开新增弹框   
    public newSensitiveWords(record: any) {
        this.addFormState.sensitiveTypeName = ''
        this.addFormState.sensitiveName =''
        this.addFormState.sensitiveTypeDtoList =''
        this.showModal = true
        // this.$nextTick(() => {
        //     //   this.addFormState.resetFields()
        // })
    }

    //新增的表单数据
    public addFormState: AddFormType = {
        sensitiveTypeName: '',
        sensitiveName: '',
        sensitiveTypeDtoList: [
            // this.sensitiveTypeName,
            // this.sensitiveTypeId,
            // this.parentId
        ],
    }

    //打开编辑弹框   
    public editWords(record: any) {
         
        // const sensitiveId = this.record
        // sensitiveId
        let params = {
            sensitiveTypeName : record.sensitiveTypeName,
            sensitiveName : record.sensitiveName,
            sensitiveTypeDtoList: record.sensitiveTypeDtoList
        }
        systemManagementApi.getInfo(params,{}).then((data:any) => {
            // store.commit('changeEditInfo',res.defmap)
			// store.commit('changeEditTypeValue','1')
			// this.$router.push('/operation/addOperation')
            this.editFormState.sensitiveTypeName = data.defmap.sensitive_id
            this.editFormState.sensitiveName = data.defmap.sensitive_name
            this.editFormState.sensitiveTypeDtoList = data.defmap.sensitiveTypeDto_list
            this.editFormState.sensitiveTypeDtoList = data.data
            this.editFormState.sensitiveTypeName = data.data
             
        })
        this.editModal = true
        // this.$nextTick(() => {
        //     //   this.addFormState.resetFields()
        // })
    }

    // public data = reactive<{
    //     // selectedRowKeys: Key[];
    //     // loading: boolean;
    // }>

    //编辑的表单数据
    public editFormState: editFormType = {
        sensitiveTypeName: [],
        sensitiveName: '',
        sensitiveTypeDtoList: [
            // this.sensitiveTypeName,
            // this.sensitiveTypeId,
            // this.parentId
        ],
    }

    //编辑弹框
    public async editModalOk() {
        this.editForm.validate().then(() => {
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认提交敏感词吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.editLabel()
                },
            });
        });
    }

    //编辑敏感词
    public editLabel() {
        // 发请求 调用新增接口
        this.userTableLoading = true;
        const params = {
            sensitiveTypeName: this.editFormState.sensitiveTypeName,
            sensitiveName: this.editFormState.sensitiveName,
            sensitiveTypeDtoList: this.editFormState.sensitiveTypeDtoList
            // {
            //     sensitiveTypeName:this.editFormState.sensitiveTypeDtoList.map((item:any) => {return item.first}),
            //     sensitiveTypeId:'',
            //     integer:''
            // }
        }
         
        systemManagementApi.saveSensitiveMain(params, {}).then(() => {
            this.editModal = true;
            message.success('编辑成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    // 批量删除
    public deleteInBatches = (record: any) => {
        // row这一行数据
        // 未选中内容的
        if (!this.state.selectedRowKeys.length) {
            message.info('请先勾选需删除的敏感词');
            return;
        }
        //选中了内容的
        else{
            Modal.confirm({
                // title: '',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认删除所选敏感词吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.deleteInBatchesId(record)
                },
                onCancel() {
                    message.error('删除失败');
                },
            });
            return;
        }
    };
    public deleteInBatchesId(record: any) {
        // 发请求 调用批量删除接口
        // this.userTableLoading = true;
        // const params = {
        //     this.state.selectedRowKeys
        // }
        //  
        let list= this.state.selectedRowKeys
        systemManagementApi.removeByIds(list, {}).then(() => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    // 单个删除用户
    public sensitiveDelete(record: string) {
         
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.selectSensitiveMainInfoId(record)
                //发请求 调用删除接口
            },
        });
    }
    public selectSensitiveMainInfoId(record: any) {
        // 发请求 调用删除接口
        // this.userTableLoading = true;
        // const params = {
        //     // text:'1',
        //     // plain:'2'
        // }
        //  

        systemManagementApi.removeByIds([record.sensitiveId], {}).then(() => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }


    // 增加子分类
    public addUser() {
        this.addFormState.sensitiveTypeDtoList.push({
            sensitiveTypeName: '',
            sensitiveTypeId: '',
            parentId: '0'
        });
    };

    // 删除子分类
    public removeUser(item: sensitive) {
        let index = this.addFormState.sensitiveTypeDtoList.indexOf(item);
        if (index !== -1) {
            this.addFormState.sensitiveTypeDtoList.splice(index, 1);
        }
    };

    //增加编辑子分类
    public addUserid() {
        this.editFormState.sensitiveTypeDtoList.push({
            sensitiveTypeName: '',
            sensitiveTypeId: Date.now(),
            integer: ''
        });
    };

    //删除编辑子分类
    public removeUserid(item: sensitive) {
        let index = this.editFormState.sensitiveTypeDtoList.indexOf(item);
        if (index !== -1) {
            this.editFormState.sensitiveTypeDtoList.splice(index, 1);
        }
    };
}

</script>

<style lang="less" scoped>
::v-deep .ant-table-thead>tr>th {
    background: #E1EBF9 100%;
    color: #000;
}

.form {
    // left: 585px;
    // top: 116px;
    // margin-top: 115px;
    // margin-left: 255px;
    //width: 1452px;
    height: 100px;
    color: rgba(16, 16, 16, 1);
    font-size: 18px;
    text-align: left;
    margin-left: 22px;
}

.row {
    // left: 675px;
    margin-top: 20px;
    margin-left: 26px;
    width: 140px;
    height: 40px;
    //border-radius: 6px 6px 6px 6px;
    color: rgb(112, 112, 112);
    font-size: 16px;
    text-align: left;
    margin-right: 80px;
}

// .box{
//     margin-top: 20px;
//     width: 120px;
//     height: 40px;
//     //border-radius: 6px 6px 6px 6px;
//     color: rgb(112, 112, 112);
//     font-size: 16px;
//     text-align: left;
//     margin-left: -60px;
// }

.inquire {
    // left: 1341px;
    // top: 112px;
    float: left;
    width: 80px;
    height: 35px;
    //border-radius: 4px;
    background-color: #fd8282;
    color: #fefefe;
    border-color: #fc0c0c;
    font-size: 18px;
    //text-align: center;
    font-family: Microsoft Yahei;
}

.reset {
    float: right;
    width: 74px;
    height: 35px;
    background-color: #fbfbfb;
    color: #030303;
    border-color: #acabab;
    font-size: 18px;
    margin-top: -35px;
    //text-align: center;
    font-family: Microsoft Yahei;
}

.box .ant-btn-primary:hover {
    background: #ff0202;
    border-color: #0c0c0c;
    color: #fff;
}

.newbtn {
    margin-left: 22px;
}

.newly {
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    margin-left: 17px;
    width: 122px;
    height: 43px;
    border-radius: 4px;
    background-color: #f95c73;
    border-color: #ffffff;
    color: #ffffff;
    font-size: 16px;
    text-align: center;
}

.delete {
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    margin-left: 25px;
    width: 122px;
    height: 43px;
    border-radius: 4px;
    background-color: #f95c73;
    border-color: #ffffff;
    color: #ffffff;
    font-size: 16px;
    text-align: center;
}

.table {
    // margin-left: 249px;
    margin-top: 22px;
    margin-left: 22px;
    margin-right: 22px;
    //width: 1452px;
    //height: 810px;
    line-height: 20px;
    background-color: #fcfcfd;
    color: #000000;
    font-size: 14px;
    text-align: center;
    font-family: Microsoft Yahei;
}

// .ant-btn-primary{
//     background: #ff1212;
//     border-color: #2f43fa;
//     box-shadow: 0 2px 0 rgba(0,0,0,.045);
//     color: #fff;
//     text-shadow: 0 -1px 0 rgba(0,0,0,.12);
// }

.son {
    text-align: right;
}

.tip {
    color: #cccccc;
}

.maskStyle {
    background-origin: 'rgba(0,0,0,.45)'
}
.ant-form label {
    font-size: 12px;
}
</style>