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
                        <a-select 
                            ref="select"
                            show-search
                            :not-found-content="null"
                            :filter-option="true"
                            :allowClear="true"
                            @click="types(record)" 
                            style="width:180px;border-radius: 4px;"
                            v-model:value="sensitiveTypeName"  
                            placeholder="请输入(可新增也可下拉展示已有的敏感词分类)">
                            <a-select-option v-for="item in materialIdList" :key="item.sensitiveTypeId">
                                {{ item.sensitiveTypeName }}
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
                    <a-col style="margin-top: 20px;">
                        <div style="flex-direction:row;">
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
            <a-modal v-model:visible="showModal" title="新增敏感词" @ok="newModalOk">
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 18 }">
                    <a-button type="dashed" block @click="addUser"
                        style="float: right;width: 80px;height: 30px;margin-top: 32px;">
                        <PlusOutlined />
                        子分类
                    </a-button>
                    <view>
                        <a-form-item
                            :rules="[{ required: true, message: '敏感词分类不能为空', trigger: 'blur' }]">
                            <span style="margin-left:15px;">敏感词分类</span>
                            <a-select 
                                ref="select"
                                :show-search="true"
                                :not-found-content="null"
                                :filter-option="true"
                                :allowClear="true"
                                @click="types(record)"
                                style="width: 368px;padding-left: 10px;margin-top:10px"
                                v-model:value="addFormState.sensitiveTypeName"  
                                placeholder="请输入(可新增也可下拉展示已有的敏感词分类)">
                                <a-select-option v-for="item in materialIdList" :key="item.sensitiveTypeId">
                                    {{ item.sensitiveTypeName }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </view>
                    <view v-for="(sensitive, index) in addFormState.sensitiveTypeDtoList" 
                        :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }"
                        :key="sensitive.sensitiveTypeId" 
                        style="margin-bottom: 8px;width: 100%;" align="baseline">
                        <a-form-item label="子分类名称" :Name="['sensitives', index, 'first']" :rules="{
                            required: false,
                            message: '请先选择敏感词分类再新建“子分类”',
                            trigger: 'blur'
                        }" style="font-size: 12px;display: flex;margin-left: 4px;width: 377px;">
                            <a-input v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称"
                                style="margin-left: 10px;"/>
                        </a-form-item>
                        <button style="margin-right: 20px;float: right;margin-top: -55px;" @click="removeUser(sensitive)">删除</button>
                    </view>
                    <a-form-item name="sensitiveName" style="margin-left: 12px;"
                        :rules="[{ required: true, message: '敏感词名称不能为空', trigger: 'blur' }]">
                        <span style="margin-left:2px;">敏感词名称</span>
                        <a-textarea v-model:value="addFormState.sensitiveName" showCount :maxlength="10"
                            style="margin-left: 1px;width: 360px;margin-top:10px"
                            placeholder="请先选择“敏感词分类”再录入“敏感词名称”" />
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
                            <a-button type="link" @click="editWords(record)" style="color: #2443BC;">编辑</a-button>
                            <a-button type="link" @click="sensitiveDelete(record)" style="color: #E8380D;">删除</a-button>
                        </div>
                    </template>
                </template>
            </a-table>
            <a-modal v-model:visible="editModal" title="编辑敏感词" @ok="editModalOk">
                <a-form :model="editFormState" ref="editForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                    <a-button type="dashed" block @click="addUser"
                        style="float: right;width: 80px;height: 30px;margin-top: 32px;">
                        <PlusOutlined />
                        子分类
                    </a-button>
                    <view>
                        <a-form-item 
                            :rules="[{ required: true, message: '敏感词分类不能为空', trigger: 'blur' }]">
                            <span style="margin-left:15px;">敏感词分类</span>
                            <a-select 
                                ref="select"
                                :show-search="true"
                                :not-found-content="null"
                                :filter-option="true"
                                :allowClear="true"
                                @click="types(record)"
                                style="width: 368px;padding-left: 10px;margin-top:10px"
                                v-model:value="editFormState.sensitiveTypeName"  
                                placeholder="请输入(可新增也可下拉展示已有的敏感词分类)">
                                <a-select-option v-for="item in materialIdList" :key="item.sensitiveTypeId">
                                    {{ item.sensitiveTypeName }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </view>
                    <view v-for="(sensitive, index) in editFormState.sensitiveTypeDtoList" 
                        :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }"
                        :key="sensitive.sensitiveTypeId" 
                        style="margin-bottom: 8px;width: 100%;" align="baseline">
                        <a-form-item label="子分类名称" :Name="['sensitives', index, 'first']" :rules="{
                            required: false,
                            message: '请先选择敏感词分类再新建“子分类”',
                            trigger: 'blur'
                        }" style="font-size: 12px;display: flex;margin-left: 4px;width: 377px;">
                            <a-input v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称"
                                style="margin-left: 10px;"/>
                            <!-- <a-textarea v-model:value="sensitive.sensitiveTypeName" showCount :maxlength="10"
                                placeholder="请输入子分类名称" padding-left: 80px;second
                                style="margin-left: 70px;float: left;" /> -->
                            <!-- <a-input v-model:value="sensitive.sensitiveTypeName" placeholder="请输入子分类名称"
                                style="margin-left: 70px;float: left;" /> -->
                        </a-form-item>
                        <button style="margin-right: 20px;float: right;margin-top: -55px;" @click="removeUser(sensitive)">删除</button>
                        <!-- <MinusCircleOutlined @click="removeUser(user)" /> -->
                    </view>
                    <a-form-item name="sensitiveName" style="margin-left: 12px;"
                        :rules="[{ required: true, message: '敏感词名称不能为空', trigger: 'blur' }]">
                        <span style="margin-left:2px;">敏感词名称</span>
                        <a-textarea v-model:value="editFormState.sensitiveName" showCount :maxlength="10"
                            style="margin-left: 1px;width: 360px;margin-top:10px"
                            placeholder="请先选择“敏感词分类”再录入“敏感词名称”" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
        <!-- <a-modal
			style="background: #FFFFFF;border-radius: 6px;"
			v-model:visible="preBrowseVisible">
			<template #footer>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="colseShelf">取消</a-button>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureShelf">确定</a-button>
			</template>
			<p style="width: 176px;font-size: 16px;font-weight: 500;color: #333333;"
					>{{ popoverTypeName }}
			</p>
		</a-modal> -->
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
import { types } from 'util';
import { ids } from 'webpack';
import { Item } from 'ant-design-vue/lib/menu';

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
    sensitiveTypeName: string;
    parentId: string;
    sensitiveTypeId: string
}

//新增表单数据
interface AddFormType {
    sensitiveTypeName: any;
    sensitiveName: string;
    sensitiveTypeDtoList: any;
}

//编辑表单数据
interface editFormType {
    sensitiveId: any;
    sensitiveTypeName: any;
    sensitiveName: string;
    sensitiveTypeDtoList: any;
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
        data(){
            list:[];//下拉数据列表
            value:'';//选择下拉列表中选项后的值
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

    
    // public handleSearch(value:any){
    //   this.handleChange(value);
    // }
    // public handleChange(value:any){
    //   this.value = value!=null && value !='' ? value : [];
    // }
    // public handleBlur(value:any){
    //   this.value = value;
    //   if(this.materialIdList.indexOf(value)==-1){
    //     this.materialIdList.push(value);
    //   }
    // }


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
        this.sensitiveTypeName = ''
        this.secsitiveTypeList()
    }

    //敏感词名称
   public sensitiveName: string = ''

    //敏感词分类
    public sensitiveTypeName: string = ''
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

    //selectSensitiveTypeInfo
    // public sensitiveTypeNameList : any[] = [];
    // public types(record:any){
    //     systemManagementApi.selectSensitiveTypeInfo({}, {}).then((res) => {
    //          
    //         res.data.forEach((item:any)=>{
    //             this.sensitiveTypeNameList.push({
    //                 sensitiveTypeName:item.sensitiveTypeName,
    //                 sensitiveTypeId:item.sensitiveTypeId
    //             })
    //              
    //              
    //         })
    //         // this.sensitiveTypeName = res.data.sensitiveTypeName
    //         // let sensitiveTypeNameList
    //     });
    // };
    public sensitiveTypeInfoList:any[] = []
    public materialIdList : any[] = [];
    public types(record:any){
         
        // systemManagementApi.selectSensitiveTypeInfo({}, {}).then((res) => {
        //      
        //     this.sensitiveTypeInfoList = res.data
        //     res.data.forEach((item:any)=>{
        //         //  
        //         //  
        //         this.materialIdList.push({
        //             sensitiveTypeName:item.sensitiveTypeName,
        //             sensitiveTypeId:item.sensitiveTypeId,
        //         })
        //         // item.children.forEach((item:any) =>{
        //         //      
        //         //      
        //         //     this.materialIdList.push({
        //         //         id:item.id,
        //         //         name:item.name,
        //         //     })
        //         //      
        //         // })
        //         //  
        //     })
        // })
    }
    public secsitiveTypeList(){
        systemManagementApi.selectSensitiveTypeInfo({}, {}).then((res) => {
             
            this.materialIdList = res.data
        })
    }
    public typesType(value:any){
         
    }



    //selectSensitiveTypeInfo
    

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
    // public getCheckboxProps: (record: DataType) => ({
    //         disabled: record.name == r', // Column configuration not to be checked
    //         name: record.name,
    // });ertfgtrrgrrhrh

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
    // public addLabel() {
    //     // 发请求 调用新增接口
    //     //this.userTableLoading = true;
    //      
    //      
    //     let sensitiveTypeDtoList:any = []
    //     sensitiveTypeDtoList.push({
    //         integer:'0',
    //         sensitiveTypeId:'',
    //         sensitiveTypeName:this.addFormState.sensitiveName[0]
    //     })
    //     this.addFormState.sensitiveTypeDtoList.forEach((res:any) => {
    //         sensitiveTypeDtoList.push(res)
    //     })
    //     const params = {
    //         sensitiveTypeName: this.addFormState.sensitiveTypeName,
    //         sensitiveName: this.addFormState.sensitiveName,
    //         sensitiveTypeDtoList: sensitiveTypeDtoList
    //         // newlyName: '1234',
    //         // sensitiveName: '2345',
    //         //sensitiveTypeDtoList: []

    //         //this.addFormState.sensitiveTypeDtoList.sensitiveTypeName
    //         // this.sensitiveTypeName,
    //         // this.sensitiveTypeId,
    //         // this.parentId
    //         // users: [

    //         // ],
    //     }
    //      
    //      
    //      
    //     systemManagementApi.saveSensitiveMain(params, {}).then((res:any) => {
    //          
    //         this.showModal = false;
    //         message.success('新增成功');
    //         this.userTablePagination.current = 1;
    //         this.userTablePagination.pageSize = 10;
    //         this.getList();
    //     });
    // }

    public addLabel() {
        // 发请求 调用新增接口
        let sensitiveTypeDtoList:any = []
        sensitiveTypeDtoList.push({
            integer:'0',
            sensitiveTypeId:this.sensitiveTypeId,
            sensitiveTypeName:this.sensitiveTypeName
        })
        // this.addFormState.sensitiveTypeDtoList.forEach((res:any) => {
        //     sensitiveTypeDtoList.push(res)
        // })
        let sensitiveTypeNameTest:any = ''
        this.sensitiveTypeInfoList.forEach((res:any) => {
            if(res.sensitiveTypeId === this.addFormState.sensitiveTypeName){
                sensitiveTypeNameTest = res.sensitiveTypeName
            }
        })
        sensitiveTypeDtoList.push({
            integer:'0',
            sensitiveTypeId:'',
            sensitiveTypeName:sensitiveTypeNameTest
        })
        const params = {
            sensitiveTypeName: this.addFormState.sensitiveTypeName,
            sensitiveName: this.addFormState.sensitiveName,
            sensitiveTypeDtoList: sensitiveTypeDtoList
        }
        systemManagementApi.saveSensitiveMain(params, {}).then((res:any) => {
             
            this.showModal = false;
            message.success('新增成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    //打开新增弹框   
    public newSensitiveWords(record: any) {
        this.addFormState.sensitiveTypeName = []
        this.addFormState.sensitiveName =''
        this.addFormState.sensitiveTypeDtoList = []
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
            sensitiveId : record.sensitiveId,
            sensitiveTypeName: record.sensitiveTypeName,
            sensitiveName : record.sensitiveName,
            sensitiveTypeDtoList: record.sensitiveTypeName
        }
         
         
         
        systemManagementApi.getInfo(params,{}).then((data:any) => {
            // store.commit('changeEditInfo',res.defmap)
			// store.commit('changeEditTypeValue','1')
			// this.$router.push('/operation/addOperation')
            this.editFormState.sensitiveId = data.defmap.sensitive_id
            this.editFormState.sensitiveTypeName = data.defmap.sensitive_type_id
            this.editFormState.sensitiveName = data.defmap.sensitive_name
            this.editFormState.sensitiveTypeDtoList = data.defmap.sensitiveTypeDto_list
            //this.editFormState.sensitiveTypeDtoList = data.data
            //this.editFormState.sensitiveTypeName = data.data
             
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
        sensitiveId: '',
        sensitiveTypeName: '',
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
                content: '确认修改敏感词吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.editLabel()
                },
                onCancel:()=>{
                    this.editModal = false;
                }
            });
        });
    }

    //编辑敏感词
    public editLabel() {
        // 发请求 调用新增接口
        this.userTableLoading = true;
        let sensitiveTypeDtoList:any = []
        sensitiveTypeDtoList.push({
            integer:'0',
            sensitiveTypeId:'',
            sensitiveTypeName:'子分类'
        })
        // this.addFormState.sensitiveTypeDtoList.forEach((res:any) => {
        //     sensitiveTypeDtoList.push(res)
        // })
        let sensitiveTypeNameTest:any = ''
        this.sensitiveTypeInfoList.forEach((res:any) => {
            if(res.sensitiveTypeId === this.addFormState.sensitiveTypeName){
                sensitiveTypeNameTest = res.sensitiveTypeName
            }
        })
        sensitiveTypeDtoList.push({
            integer:'0',
            sensitiveTypeId:'',
            sensitiveTypeName:sensitiveTypeNameTest
        })
        const params = {
            sensitiveId:this.editFormState.sensitiveId,
            sensitiveTypeName: this.editFormState.sensitiveTypeName,
            sensitiveName: this.editFormState.sensitiveName,
            sensitiveTypeDtoList: sensitiveTypeDtoList
            //     sensitiveTypeName:this.editFormState.sensitiveTypeDtoList.map((item:any) => {return item.first}),
            //     sensitiveTypeId:'',
            //     integer:''
            // }
        }
         
        systemManagementApi.saveSensitiveMain(params, {}).then(() => {
            this.editModal = false;
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
        let params:any = {
			ids:[]
		}
        // 
         
		this.state.selectedRowKeys.forEach((res:any) => {
			params.ids.push(res)
		})
        //  
        //let List= this.state.selectedRowKeys
        //  
        systemManagementApi.removeByIds(params, {}).then(() => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    // 单个删除用户
    public sensitiveDelete(record: any) {
         
        //this.preBrowseVisible = true
		//this.popoverTypeName = '您确定要删除吗？'
		this.state.selectedRowKeys.push(record.sensitiveId)
         
        // this.selectSensitiveMainInfoId()
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.selectSensitiveMainInfoId()
                //发请求 调用删除接口
            },
        });
    }
    public selectSensitiveMainInfoId() {
         
        let params:any = {
			ids:[]
		}
         
        this.state.selectedRowKeys.forEach((res:any) => {
			params.ids.push(res)
		})
        //  
		// this.record.sensitiveId.forEach((res:any) => {
		// 	params.ids.push(res)
		// })
         
        systemManagementApi.removeByIds(params, {}).then(() => {
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
            integer: '0'
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

// .inquire {
//     // left: 1341px;
//     // top: 112px;
//     float: left;
//     width: 80px;
//     height: 35px;
//     //border-radius: 4px;
//     background-color: #fd8282;
//     color: #fefefe;
//     border-color: #fc0c0c;
//     font-size: 18px;
//     //text-align: center;
//     font-family: Microsoft Yahei;
// }

// .reset {
//     float: right;
//     width: 74px;
//     height: 35px;
//     background-color: #fbfbfb;
//     color: #030303;
//     border-color: #acabab;
//     font-size: 18px;
//     //margin-top: -35px;
//     //text-align: center;
//     font-family: Microsoft Yahei;
// }
.inquire {
    // left: 1341px;
    // top: 112px;
    width: 84px;
    height: 35px;
    //border-radius: 4px;
    background-color: #E8380D;
    color: #fefefe;
    border-color: #E8380D;
    font-size: 16px;
    //text-align: center;
    font-family: Microsoft Yahei;
}
.reset {
    width: 84px;
    height: 35px;
    background-color: #fbfbfb;
    color: #030303;
    border-color: #acabab;
    font-size: 16px;
    //text-align: center;
    font-family: Microsoft Yahei;
}

// .inquire {
//     width: 84px;
//     height: 35px;
//     background: #E8380D;
//     border-radius: 4px;
//     color: #ffffff;
//     //border-radius: 4px;
//     font-size: 16px;
//     //text-align: center;
//     font-family: Microsoft Yahei;
// }
// .reset {
//     width: 84px;
//     height: 35px;
//     background-color: #fbfbfb;
//     color: #030303;
//     border-color: #acabab;
//     border-radius: 4px;
//     font-size: 16px;
//     //text-align: center;
//     font-family: Microsoft Yahei;
// }
// .inquire {
//     // left: 1341px;
//     // top: 112px;
//     width: 84px;
//     height: 35px;
//     //border-radius: 4px;
//     background-color: #E8380D;
//     color: #fefefe;
//     border-color: #E8380D;
//     font-size: 18px;
//     //text-align: center;
// }
// .reset {
//     width: 84px;
//     height: 35px;
//     background-color: #fbfbfb;
//     color: #030303;
//     border-color: #acabab;
//     font-size: 18px;
//     margin-left: 40px;
//     //text-align: center;
// }

// .box .ant-btn-primary:hover {
//     background: #E8380D;
//     border-color: #0c0c0c;
//     color: #fff;
// }

.newbtn {
    margin-left: 22px;
}

.newly {
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    margin-left: 17px;
    width: 84px;
    height: 35px;
    border-radius: 4px;
    background-color: #E8380D;
    border-color: #ffffff;
    color: #ffffff;
    font-size: 14px;
    padding-left: 7px;
}

.delete {
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    margin-left: 25px;
    padding-left: 13px;
    width: 84px;
    height: 35px;
    border-radius: 4px;
    background-color: #E8380D;
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