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
                        <!-- <a-select
                            ref="select"
                            show-search
                            :not-found-content="null"
                            :filter-option="true"
                            :allowClear="true"
                            @click="types(record)"
                            style="width: 180px; border-radius: 4px"
                            v-model:value="sensitiveTypeName"
                            placeholder="请输入(可新增也可下拉展示已有的敏感词分类)"
                        >
                            <a-select-option v-for="item in materialIdList" :key="item.sensitiveTypeId">
                                {{ item.sensitiveTypeName }}
                            </a-select-option>
                        </a-select> -->
                        <a-cascader
                            style="width: 180px; border-radius: 4px"
                            :field-names="{ label: 'sensitiveTypeName', value: 'sensitiveTypeId', children: 'childMenu' }"
                            change-on-select
                            v-model:value="sensitiveTypeId"
                            :options="materialIdList"
                            placeholder="请选择"
                        />
                    </a-col>
                    <!-- 敏感词名称 -->
                    <a-col :span="7" class="row">
                        <span>敏感词名称：</span>
                        <a-input style="width: 60%; border-radius: 4px" v-model:value="sensitiveName" placeholder="请输入" />
                    </a-col>
                    <!-- 更新时间 -->
                    <a-col :span="9" class="row">
                        <span>更新时间：</span>
                        <a-date-picker
                            style="width: 30%; border-radius: 4px; margin-right: 8px"
                            valueFormat="YYYY-MM-DD 00:00:00"
                            v-model:value="mdfStartDate"
                            :disabledDate="disabledDateStart"
                            placeholder="开始时间"
                        />
                        <span>至</span>
                        <a-date-picker
                            style="width: 30%; border-radius: 4px; margin-left: 8px"
                            valueFormat="YYYY-MM-DD 23:59:59"
                            v-model:value="mdfEndDate"
                            :disabled-date="disableEndTime"
                            placeholder="结束时间"
                        />
                    </a-col>
                    <!-- 查询重置 -->
                    <a-col style="margin-top: 20px">
                        <div style="flex-direction: row">
                            <a-button class="inquire" type="primary" @click="getList">查询</a-button>
                            <a-button class="reset" type="primary" @click="cancleBtn" style="margin-left: 5px">重置</a-button>
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
            <a-modal v-model:visible="showModal" title="新增敏感词" @ok="newModalOk" @cancel="addCancel" :maskClosable="false">
                <a-form :model="addFormState" @change="addChange" ref="addForm" labelAlign="left" :label-col="{ style: { width: '95px' } }" :wrapper-col="{ span: 17 }" >
                    <a-button type="dashed" :disabled="disabledAdd" block @click="addUser" style="float: right; width: 80px; height: 30px; margin-top: 32px">
                        <PlusOutlined />
                        子分类
                    </a-button>
                    <view>
                        <a-form-item name="sensitiveTypeName" :rules="[{ required: true, message: '敏感词分类不能为空', trigger: 'blur' }]">
                            <span style="margin-left: 5px">敏感词分类:</span>
                            <a-textarea
                                v-if="materialIdList.length<1"
                                v-model:value="addFormState.sensitiveTypeName"
                                showCount
                                :maxlength="10"
                                style="width: 368px; margin-top: 10px"
                                placeholder="请输入"
                            />
                            <a-select
                                v-else
                                ref="select"
                                :filter-option="filterOption"
                                :show-search="true"
                                :not-found-content="null"
                                :allowClear="true"
                                mode="combobox"
                                style="width: 368px; margin-top: 10px"
                                v-model:value="addFormState.sensitiveTypeName"
                                placeholder="请输入(可新增也可下拉展示已有的敏感词分类)"
                                @select="sensitiveSelect"
                            >
                                <a-select-option v-for="item in materialIdList" :key="item.sensitiveTypeId" :value="item.sensitiveTypeName">
                                    {{ item.sensitiveTypeName }}
                                </a-select-option>
                            </a-select>
                            <!-- <a-select
                                v-model:value="value"
                                style="width: 100%"
                                :token-separators="[',']"
                                placeholder="Automatic tokenization"
                                :options="options"
                                @change="handleChange"
                            ></a-select> -->
                        </a-form-item>
                    </view>
                    <view
                        v-for="(sensitive, index) in addFormState.sensitiveTypeDtoList"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 18 }"
                        :key="index"
                        style="margin-bottom: 8px; width: 100%"
                        align="baseline"
                    >
                        <a-form-item
                            v-if="index > 0"
                            :Name="['sensitives', index, 'first']"
                            :rules="{
                                required: true,
                                message: '请先选择敏感词分类再新建“子分类”',
                                trigger: 'blur',
                            }"
                            style="font-size: 12px; display: flex; margin-left: 4px; width: 377px"
                        >
                            <span style="margin-left: 5px">子分类名称:</span>
                            <a-textarea
                                v-model:value="sensitive.sensitiveTypeName" 
                                placeholder="请输入子分类名称" 
                                :maxlength="10"
                                showCount
                                style="width: 368px;height: 30px; margin-top: 10px; margin-left: -5px" 
                            />
                            <!-- <a-input v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称" style="width: 368px; margin-top: 10px; margin-left: -5px" /> -->
                        </a-form-item>
                        <button style="margin-right: 20px; float: right; margin-top: -55px" @click="removeUser(sensitive)" :disabled="disabledane">删除</button>
                    </view>
                    <a-form-item name="sensitiveName" :rules="[{ required: true, message: '敏感词名称不能为空', trigger: 'blur' }]">
                        <span style="margin-left: 5px">敏感词名称:</span>
                        <a-textarea
                            @click="sensi()"
                            v-model:value="addFormState.sensitiveName"
                            showCount
                            :maxlength="10"
                            style="width: 368px; margin-top: 10px"
                            placeholder="请输入敏感词名称"
                        />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
        <!-- 表格 -->
        <!-- :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" -->
        <div>
            <a-table
                class="table"
                :row-key="(record:any) => record.sensitiveId"
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                :data-source="userTableData"
                :columns="userTableColumns"
                :pagination="userTablePagination"
                :loading="userTableLoading"
                :locale="locale"
                @change="handleTableChange"
                bordered
            >
                <template #bodyCell="{ record, column }">
                    <template v-if="column.key === 'operation'">
                        <div class="newbtn">
                            <a-button type="link" @click="editWords(record)" style="color: #2443bc">编辑</a-button>
                            <a-button type="link" @click="sensitiveDelete(record)" style="color: #e8380d">删除</a-button>
                        </div>
                    </template>
                </template>
            </a-table>
            <a-modal v-model:visible="editModal" title="编辑敏感词" @ok="editModalOk" @cancel="editCancel" :maskClosable="false">
                <a-form :model="editFormState" ref="editForm" labelAlign="left" :label-col="{ style: { width: '95px' } }" :wrapper-col="{ span: 17 }">
                    <a-button type="dashed" block disabled="false" @click="editUser" style="float: right; width: 80px; height: 30px; margin-top: 32px">
                        <PlusOutlined />
                        子分类
                    </a-button>
                    <view>
                        <a-form-item name="sensitiveTypeName" :rules="[{ required: isCheck, message: '敏感词分类不能为空', trigger: 'blur' }]">
                            <span style="margin-left: 5px">敏感词分类:</span>
                            <a-select
                                disabled="false"
                                ref="select"
                                :show-search="true"
                                :not-found-content="null"
                                :allowClear="true"
                                @click="types(record)"
                                style="width: 368px; margin-top: 10px"
                                v-model:value="editFormState.sensitiveTypeName"
                                placeholder="请输入(可新增也可下拉展示已有的敏感词分类)"
                                @select="sensitiveEditSelect"
                                :filter-option="filterEditOption"
                            >
                                <a-select-option v-for="item in materialIdList" :key="item.sensitiveTypeId" :value="item.sensitiveTypeName" disabled="false">
                                    {{ item.sensitiveTypeName }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </view>
                    <view
                        v-for="(sensitive, index) in editFormState.sensitiveTypeDtoList"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 18 }"
                        :key="index"
                        style="margin-bottom: 8px; width: 100%"
                        align="baseline"
                    >
                        <a-form-item
                            v-if="index > 0"
                            :Name="['sensitives', index, 'first']"
                            :rules="{
                                required: false,
                                message: '请先选择敏感词分类再新建“子分类”',
                                trigger: 'blur',
                            }"
                            style="font-size: 12px; display: flex; margin-left: 4px; width: 472px"
                        >
                            <span style="margin-left: 3px">子分类名称:</span>
                            <a-input disabled="false" v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称" style="width: 368px; margin-top: 10px; margin-left: -5px" />
                        </a-form-item>
                        <button style="margin-right: 20px; float: right; margin-top: -55px" @click="removeEditUser(sensitive)" disabled="false">删除</button>
                    </view>
                    <a-form-item name="sensitiveName" :rules="[{ required: true, message: '敏感词名称不能为空', trigger: 'blur' }]">
                        <span style="margin-left: 5px">敏感词名称:</span>
                        <a-textarea
                            v-model:value="editFormState.sensitiveName"
                            showCount
                            :maxlength="10"
                            style="width: 368px; margin-top: 10px"
                            placeholder="请先选择“敏感词分类”再录入“敏感词名称”"
                        />
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
import { Ref, Watch } from 'vue-property-decorator';
import { createVNode, defineComponent, reactive, ref, computed } from 'vue';
import { FormInstance, message, Modal, Form } from 'ant-design-vue';
import { ExclamationCircleOutlined, MinusCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { global } from '@/libs/Global';
import moment from 'moment';
import store from '@/modules/operation/store';
import { ColumnProps } from 'ant-design-vue/es/table';
import { types } from 'util';
import { ids } from 'webpack';
import { Item } from 'ant-design-vue/lib/menu';
import type { ShowSearchType } from 'ant-design-vue/es/cascader';
import { max } from 'lodash';

type Key = ColumnProps['key'];

//分页
interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showQuickJumper: true;
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

//下拉框
interface ditchListType {
    sensitiveTypeName: string;
    parentId: string;
    sensitiveTypeId: string;
}

//新增表单数据
interface AddFormType {
    sensitiveTypeName: any;
    sensitiveName: any;
    sensitiveTypeDtoList: any;
}

//编辑表单数据
interface editFormType {
    sensitiveId: any;
    sensitiveTypeName: any;
    sensitiveName: string;
    sensitiveTypeDtoList: any;
    sensitiveTypeId: any;
}

interface sensitive {
    first: string;
    id: number;
    data: string;
}

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
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
        data() {
            list: []; //下拉数据列表
            value: ''; //选择下拉列表中选项后的值
        },
    },
});

export default class User extends Vue {
    [x: string]: any;
    @Ref('addForm') readonly addForm!: FormInstance;
    @Ref('editForm') readonly editForm!: FormInstance;
    public showModal: boolean = false;
    public editModal: boolean = false;
    public permission: any = [];
    // public userTableData = [] as any[];
    public userTableData: any[] = [];

    public states: any = store.state;

    public computed() {
         
    }

    // 对输入敏感词分类输入过滤
    filter: ShowSearchType['filter'] = (inputValue, path) => {
        return path.some((option) => {
             
            option.sensitiveTypeName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        });
    };
    // 敏感词分类 传sensitiveTypeId
    public sensitiveTypeId: string[] = [];
    //初始化table表头
    public userTableColumns = [
        {
            title: '敏感词分类',
            dataIndex: 'sensitiveTypeName',
            align: 'center',
            key: 'sensitiveTypeName',
        },
        {
            title: '敏感词名称',
            dataIndex: 'sensitiveName',
            align: 'center',
            key: 'sensitiveName',
        },
        {
            title: '创建者',
            dataIndex: 'crtUserName',
            key: 'crtUserName',
            align: 'center',
        },
        {
            title: '触发次数',
            dataIndex: 'touchTimes',
            align: 'center',
            key: 'touchTimes',
        },
        {
            title: '更新时间',
            dataIndex: 'mdfDate',
            align: 'center',
            key: 'mdfDate',
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
        },
    ];

    //表单内容
    public created(): void {
        this.getList();
        this.sensitiveTypeName = '';
        this.secsitiveTypeList();
    }
    
    

    //敏感词名称
    public sensitiveName: string = '';

    //敏感词分类
    public sensitiveTypeName: string = '';
    //敏感词分类下拉框列表数据
    // public sensitiveTypeNameList: ditchListType[] = [
    //     {
    //         sensitiveTypeName: '全部',
    //         parentId: '全部',
    //         sensitiveTypeId: ''
    //     },
    //     {
    //         sensitiveTypeName: '一',
    //         parentId: '一',
    //         sensitiveTypeId: '0'
    //     },
    //     {
    //         sensitiveTypeName: '二',
    //         parentId: '二',
    //         sensitiveTypeId: '1'
    //     },
    // ]

    public sensitiveTypeInfoList: any[] = [];
    public materialIdList: any[] = [];
    public types(record: any) {
         
    }
    public secsitiveTypeList() {
        systemManagementApi.selectSensitiveTypeInfo({}, {}).then((res) => {
             
            this.materialIdList = res.data;
        });
    }
    public typesType(value: any) {
         
    }

    //selectSensitiveTypeInfo

    //时间选择器
    //开始时间
    public mdfStartDate: string = '';
    public disabledDateStart(current: any) {
        if (this.mdfEndDate) {
            return current > moment(this.mdfEndDate).endOf('day');
        } else {
        }
    }

    //结束时间
    public mdfEndDate: string = '';
    public disableEndTime(current: any) {
        if (this.mdfStartDate) {
            return current && current < moment(this.mdfStartDate).subtract(1, 'days').endOf('day');
        }
    }

    //查询敏感词列表
    public async getList() {
        //this.userTableLoading = true;
        let params = {
            //sensitiveTypeId: this.sensitiveTypeId[this.sensitiveTypeId.length - 1], //得到的是一个数组 取最后一个值
            sensitiveTypeId: this.sensitiveTypeId,
            sensitiveTypeName: this.sensitiveTypeName,
            sensitiveName: this.sensitiveName,
            mdfStartDate: this.mdfStartDate,
            mdfEndDate: this.mdfEndDate,
            // row4Page: this.userTablePagination.pageSize,
            // nowPage: this.userTablePagination.current,
        };
         
         
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            },
        };
        systemManagementApi
            .selectSensitiveMainInfo(params, header)
            .then((res: any) => {
                 
                this.userTableLoading = false;
                this.userTablePagination.total = (res as any).recordsTotal;
                this.userTableData = res.data;
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
            })
            .catch(() => {
                this.userTableLoading = false;
            });

         
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
    // public getCheckboxProps: (record: DataType) => ({
    //         disabled: record.name == r', // Column configuration not to be checked
    //         name: record.name,
    // });ertfgtrrgrrhrh

    //重置按钮
    public cancleBtn() {
        this.sensitiveTypeId = [];
        this.sensitiveName = '';
        this.sensitiveTypeId = [];
        this.sensitiveTypeName = '';
        this.mdfStartDate = '';
        this.mdfEndDate = '';
        this.userTablePagination.current = 1;
        this.getList();
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
        showTotal: (total: number) => `共 ${total} 条`, //分页中显示总的数据 用于显示数据总量和当前数据顺序
    };
    public userTableLoading = false; // 用户表加载

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
    //新增的表单数据
    public addFormState: any = {
        sensitiveTypeName: '', //敏感词分类
        sensitiveName: '', //敏感词名称
        sensitiveTypeDtoList: [{ parentId: '', sensitiveTypeId: '', sensitiveTypeName: '' }],
        // { parentld: '', sensitiveTypeId: '', sensitiveTypeName: '' }
    };

    // 关闭弹框重置表单
    public addCancel() {
        this.addForm.resetFields();
        this.disabledAdd = true;
    }
    // 关闭编辑弹框重置表单
    public editCancel() {
        this.editForm.resetFields();
        this.disabledAdd = true;
    }

    // 新增敏感词弹框确认
    public async newModalOk() {
        this.isChecked = true;
        // if(!this.addFormState.sensitiveTypeName){
        //     message.info('请先选择“敏感词分类”再录入“敏感词名称”');
        //     return;
        // }else{
            this.addForm.validate().then(() => {
                Modal.confirm({
                    title: '提示',
                    icon: createVNode(ExclamationCircleOutlined),
                    content: '确认提交敏感词吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        // this.sensitiveTypeName: '', //敏感词分类
                        // this.sensitiveName: '', //敏感词名称
                        this.addLabel();
                    },
                    onCancel: () => {
                        this.showModal = false;
                    },
                });
            });   
        //}
    }

    // public typename: any[] = [];    

    public sensi(){
        // 
         
        if(this.addFormState.sensitiveTypeName.value=[] || this .addFormState.sensitiveTypeName.value === undefined){
            message.info('请先选择“敏感词分类”再录入“敏感词名称”');
            return;
        }
    }


    // 选择敏感词分类
    public sensitiveSelect(val: any, option: any) {
         
        this.addFormState.sensitiveTypeDtoList = [
            {
                parentId: '',
                sensitiveTypeId: '',
                sensitiveTypeName: '',
            },
        ];
        this.changeClasssfication(option.key, this.addFormState.sensitiveTypeDtoList);
        this.addFormState.sensitiveTypeDtoList[0].sensitiveTypeName = option.value;
        this.addFormState.sensitiveTypeDtoList[0].sensitiveTypeId = option.key;
         
         
        //  
    }
    // 编辑弹框选择敏感词分类
    public sensitiveEditSelect(val: any, option: any) {
         
        this.editFormState.sensitiveTypeDtoList = [{ parentId: '', sensitiveTypeId: '', sensitiveTypeName: '' }];
        this.changeClasssfication(option.key, this.editFormState.sensitiveTypeDtoList);
        this.editFormState.sensitiveTypeName = option.value;
        this.editFormState.sensitiveTypeId = option.key;
    }

    public addLabel() {
        // 发请求 调用新增接口
        const sensitiveTypeName = this.addFormState.sensitiveTypeName;
        //const sensitiveTypeId = this.addFormState.sensitiveTypeId;
        //  
        this.addFormState.sensitiveTypeDtoList[0].sensitiveTypeName = sensitiveTypeName;
        //this.addFormState.sensitiveTypeDtoList.sensitiveTypeId = sensitiveTypeId;
        // let sensitiveTypeDtoList: any = [];
        // this.addFormState.sensitiveTypeDtoList.push({
        //     parentld: '',
        //     sensitiveTypeId: '',
        //     sensitiveTypeName: sensitiveTypeName,
        // });

        


         
        systemManagementApi.saveSensitiveMain(this.addFormState, {}).then((res: any) => {
             
            this.showModal = false;
            message.success('新增成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
            this.secsitiveTypeList()
        });
    }

    //打开新增弹框
    public newSensitiveWords(record: any) {
        this.isCheck = false;
        this.showModal = true;
        this.addFormState.sensitiveId = '';
        this.addFormState.sensitiveTypeName = [];
        this.addFormState.sensitiveName = '';
        this.addFormState.sensitiveTypeDtoList = [
            {
                parentId: '',
                sensitiveTypeId: '',
                sensitiveTypeName: '',
            },
        ];

        // this.$nextTick(() => {
        //     //   this.addFormState.resetFields()
        // })
    }

    //打开编辑弹框
    public editWords(record: any) {
        this.isCheck = false;
        this.editModal = true;
        // 打开弹窗先清空数据
        this.editFormState.sensitiveId = '';
        this.editFormState.sensitiveTypeName = '';
        this.editFormState.sensitiveName = '';
        this.editFormState.sensitiveTypeDtoList = [
            {
                parentld: '',
                sensitiveTypeId: '',
                sensitiveTypeName: '',
            },
        ];
         
        // const sensitiveId = this.record
        // sensitiveId
        let params = {
            sensitiveId: record.sensitiveId,
        };
        systemManagementApi.getInfo(params, {}).then((data: any) => {
            // store.commit('changeEditInfo',res.defmap)
            // store.commit('changeEditTypeValue','1')
            // this.$router.push('/operation/addOperation')
            const res: any = data.defmap;
            this.editFormState.sensitiveId = res.sensitiveId;
            this.editFormState.sensitiveTypeName = res.sensitiveTypeNameList[0];
            this.editFormState.sensitiveTypeId = res.sensitiveTypeId;
            this.editFormState.sensitiveName = res.sensitiveName;
            if (res.sensitiveTypeNameList.length > 1) {
                for (let i in res.sensitiveTypeNameList) {
                    if (Number(i) > 0) {
                        this.editFormState.sensitiveTypeDtoList.push({ sensitiveTypeName: res.sensitiveTypeNameList[i] });
                    }
                }
            }
            //this.editFormState.sensitiveTypeDtoList = data.data
            //this.editFormState.sensitiveTypeName = data.data
             
             
        });

        // this.$nextTick(() => {
        //     //   this.addFormState.resetFields()
        // })
    }

    //编辑的表单数据
    public editFormState: editFormType = {
        sensitiveId: '',
        sensitiveTypeName: '',
        sensitiveName: '',
        sensitiveTypeId: '',
        sensitiveTypeDtoList: [{ parentId: '', sensitiveTypeId: '', sensitiveTypeName: '' }],
    };

    //编辑弹框
    public async editModalOk() {
        this.isCheck = true;
        this.editForm.validate().then(() => {
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认修改敏感词吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.editLabel();
                },
                onCancel: () => {
                    this.editModal = false;
                },
            });
        });
    }

    //编辑敏感词
    public editLabel() {
        // 发请求 调用新增接口
        //this.userTableLoading = true;
        const sensitiveTypeName = this.editFormState.sensitiveTypeName;
        this.editFormState.sensitiveTypeDtoList[0].sensitiveTypeName = sensitiveTypeName;

        //  
        systemManagementApi.saveSensitiveMain(this.editFormState, {}).then(() => {
            this.editModal = false;
            message.success('编辑成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
            this.secsitiveTypeList()
        });
    }

    public addname: any = '';

    // 新增/编辑敏感词 选择父类 子类随之改变
    public changeClasssfication(id: string, formState: any) {
        let params = {
            sensitiveTypeId: id,
        };
        systemManagementApi.selectSensitive(params, {}).then((res: any) => {
             
            const defmap = res.defmap.typeVos;
             
             
            this.addname = res.defmap.sensitiveNames
            if (defmap) {
                for (let key in defmap) {
                    if (Number(key) > 0) {
                        formState.push({ sensitiveTypeName: defmap[key].sensitiveTypeName, sensitiveTypeId: defmap[key].sensitiveTypeId });
                    }
                }
            }
             
            // if(!this.addname){
            //     message.info('该分类下有敏感词暂不可删除')
            //     this.disabledane = false
            // }else{
            //     this.disabledane = true
            // }
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
        else {
            Modal.confirm({
                // title: '',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认删除所选敏感词吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.deleteInBatchesId(record);
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
        let params: any = {
            ids: [],
        };
        // 
         
        this.state.selectedRowKeys.forEach((res: any) => {
            params.ids.push(res);
        });
        //  
        //let List= this.state.selectedRowKeys
        //  
        systemManagementApi.removeByIds(params, {}).then(() => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
            this.secsitiveTypeList()
        });
    }

    // 单个删除用户
    public sensitiveDelete(record: any) {
         
        //this.preBrowseVisible = true
        //this.popoverTypeName = '您确定要删除吗？'
        this.state.selectedRowKeys.push(record.sensitiveId);
         
        // this.selectSensitiveMainInfoId()
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.selectSensitiveMainInfoId();
                //发请求 调用删除接口
            },
        });
    }
    public selectSensitiveMainInfoId() {
         
        let params: any = {
            ids: [],
        };
         
        this.state.selectedRowKeys.forEach((res: any) => {
            params.ids.push(res);
        });
        //  
        // this.record.sensitiveId.forEach((res:any) => {
        // 	params.ids.push(res)
        // })
         
        systemManagementApi.removeByIds(params, {}).then(() => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
            this.secsitiveTypeList()
        });
    }
    // 监听敏感词类型 如果为空 子类型按钮置灰
    @Watch('addFormState.sensitiveTypeName')
    public onchange(val: any) {
         
        this.typename = val
        if (val) {
            this.disabledAdd = false;
        } else {
            this.disabledAdd = true;
            this.addFormState.sensitiveTypeDtoList = [
                {
                    parentId: '',
                    sensitiveTypeId: '',
                    sensitiveTypeName: '',
                },
            ];
        }
         
    }
    @Watch('editFormState.sensitiveTypeName')
    public onEditchange(val: any) {
        if (val) {
            this.disabledAdd = false;
        } else {
            this.disabledAdd = true;
            this.editFormState.sensitiveTypeDtoList = [
                {
                    parentId: '',
                    sensitiveTypeId: '',
                    sensitiveTypeName: '',
                },
            ];
        }
    }


    // 增加子分类按钮是否可用

    public disabledAdd = true;
    // 增加子分类
    public addUser() {
        this.addFormState.sensitiveTypeDtoList.push({
            sensitiveTypeName: '',
        });
         
    }
    // 编辑添加子分类
    public editUser() {
        this.editFormState.sensitiveTypeDtoList.push({
            sensitiveTypeName: '',
        });
         
    }

    // 删除子分类
    public removeUser(item: sensitive) {
        let index = this.addFormState.sensitiveTypeDtoList.indexOf(item);
         
         
        if(this.addname){
            message.info('该分类下有敏感词暂不可删除')
        }else if(index !== -1){
            this.addFormState.sensitiveTypeDtoList.splice(index, 1);
        }
        // if (index !== -1) {
        //     this.addFormState.sensitiveTypeDtoList.splice(index, 1);
        // }
        // if(!this.addname){
        //     message.info('该分类下有敏感词暂不可删除')
        //     this.disabledane = false
        // }else{
        //     this.disabledane = true
        // }
    }
    // 删除子分类
    public removeEditUser(item: sensitive) {
        let index = this.editFormState.sensitiveTypeDtoList.indexOf(item);
        if (index !== -1) {
            this.editFormState.sensitiveTypeDtoList.splice(index, 1);
        }
    }

    //删除编辑子分类
    public removeUserid(item: sensitive) {
        let index = this.editFormState.sensitiveTypeDtoList.indexOf(item);
        if (index !== -1) {
            this.editFormState.sensitiveTypeDtoList.splice(index, 1);
        }
    }
    public filterOption(input: any, option: any) {
        // 
        //  
        // 重要的一步，可以 
        if (input) {
            this.addFormState.sensitiveTypeName = input;
        } else {
            this.addFormState.sensitiveTypeName = '';
        }
        return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    public filterEditOption(input: any, option: any) {
        // 
        //  
        // 重要的一步，可以 
        if (input) {
            this.editFormState.sensitiveTypeName = input;
            this.editFormState.sensitiveTypeId = '';
        } else {
            this.editFormState.sensitiveTypeName = '';
            this.editFormState.sensitiveTypeId = '';
        }
        return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    // 新增编辑是否校验
    public isCheck = true;
}
</script>

<style lang="less" scoped>
// ::v-deep .ant-table-thead > tr > th {
//     background: #e1ebf9 100%;
//     color: #000;
// }

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

.inquire {
    // left: 1341px;
    // top: 112px;
    // width: 84px;
    // height: 35px;
    // //border-radius: 4px;
    // background-color: #e8380d;
    // color: #fefefe;
    // border-color: #e8380d;
    // font-size: 16px;
    // //text-align: center;
    // font-family: Microsoft Yahei;
    border: 0px solid #000000;
    background-color: #e8380d;
    color: #ffffff;
    //width: 84px;
    border-radius: 4px;
    //height: 32px;
}
.reset {
    background-color: #fbfbfb;
    color: #030303;
    border-color: #acabab;
    border-radius: 4px;
    font-size: 16px;
    padding-top: 2px;
    //text-align: center;
    // width: 84px;
    // height: 35px;
    // background-color: #fbfbfb;
    // color: #030303;
    // border-color: #acabab;
    // font-size: 16px;
    // //text-align: center;
    // font-family: Microsoft Yahei;
}

.newbtn {
    margin-left: 22px;
}

.newly {
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    margin-left: 17px;
    // width: 94px;
    // height: 35px;
    border-radius: 4px;
    background-color: #e8380d;
    border-color: #ffffff;
    color: #ffffff;
    font-size: 14px;
    padding-left: 12px;
}

.delete {
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    margin-left: 25px;
    // width: 94px;
    // height: 35px;
    border-radius: 4px;
    background-color: #e8380d;
    border-color: #ffffff;
    color: #ffffff;
    font-size: 14px;
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

.son {
    text-align: right;
}

.tip {
    color: #cccccc;
}

.maskStyle {
    background-origin: 'rgba(0,0,0,.45)';
}
.ant-form label {
    font-size: 12px;
}
</style>
