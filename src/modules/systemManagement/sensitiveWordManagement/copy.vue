<!-- :folderList="folderList" -->
<template>
    <div>
        <ChangeLeftFolder folderName="全部敏感词" :menuListTiTle="menuListTiTle" menuTableList="menuTableList"
            @getDropdown="getDropdown" @addColumn="addColumn" :folderList="folderList" @getFolderName="getFolderName"
            @allfolder="allfolder" @getsearchkey="getsearchkey" :closeMyModal="closeMyModal">
            <template #tabbar>
                <!-- <div class="content-right-tab">
                    <div class="content-right-tab-list">
                        <div v-for="item in titleList" :key="item.mark" :class="{ choose: titleIndex === item.index }"
                            class="content-right-tab-item" @click="chooseTitle(item)">
                            {{ item.name }}
                        </div>
                    </div>
                </div> -->
            </template>
            <template #content>
                <div class="content-right-content">
                    <div class="content-right-content-form">
                        <a-form :model="formData" :label-col="labelCol" labelAlign="left">
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="7">
                                    <div class="gutter-box">
                                        <a-form-item label="敏感词分类：">
                                            <a-cascader
                                                style="width: 180px; border-radius: 4px"
                                                :field-names="{ label: 'sensitiveTypeName', value: 'sensitiveTypeId', children: 'childMenu' }"
                                                change-on-select
                                                v-model:value="sensitiveTypeId"
                                                :options="materialIdList"
                                                placeholder="请选择"
                                            />
                                            <!-- <a-select @change="changeLabel" v-model:value="formData.cover" placeholder="默认第一项">
                                                <a-select-option value="">全部</a-select-option>
                                                <a-select-option value="y">已上传</a-select-option>
                                                <a-select-option value="n">待上传</a-select-option>
                                            </a-select> -->
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="7">
                                    <div class="gutter-box">
                                        <a-form-item label="敏感词名称：">
                                            <a-input placeholder="请输入标题名称" v-model:value="formData.titlename" />
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col :span="10" class="row">
                                    <span>更新时间：</span>
                                    <a-date-picker
                                        style="width: 30%; border-radius: 4px; margin-right: 8px"
                                        valueFormat="YYYY-MM-DD 00:00:00"
                                        v-model:value="formData.starttime"
                                        :disabledDate="disabledDateStart"
                                        placeholder="开始时间"
                                    />
                                    <span>至</span>
                                    <a-date-picker
                                        style="width: 30%; border-radius: 4px; margin-left: 8px"
                                        valueFormat="YYYY-MM-DD 23:59:59"
                                        v-model:value="formData.endtime"
                                        :disabled-date="disableEndTime"
                                        placeholder="结束时间"
                                    />
                                </a-col>
                            </a-row>
                            <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
                                <button class="solidColor" @click="onSubmit">查询</button>
                                <button class="ghostGrey" style="margin-left: 5%" @click="reset">重置</button>
                            </a-form-item>                                                                                                     
                        </a-form>
                    </div>
                    <div class="content-right-content-tablebox">
                        <div class="content-right-content-topbutton">
                            <!-- <a-row> -->
                            <a-button	
                              type="primary"
                              @click="addContent"
                              danger
                              class="operation-btn"
                              style="width: 100px; background: #E8380D;"
                              >新增敏感词</a-button>
                            <a-button style="background: #E8380D;color: #ffffff;" danger @click="deleteInBatches('')" class="operation-btn">批量删除</a-button>
                            <!-- <button class="solidColor" @click="addContent">新增内容</button>
                            <button style="margin-left: 5%" class="ghostGrey" @click="shelf">上架</button>
                            <button style="margin-left: 5%" class="ghostColor" @click="delContent">批量删除</button> -->
                            <!-- </a-row> -->
                        </div>
                        <div class="content-right-content-table">
                            <a-table
                                :pagination="pagination" 
                                :row-key="(record: any) => record.sensitiveId"
                                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                                :columns="columns" 
                                :data-source="dataSource" 
                                :loading="userTableLoading"
                                @change="handleTableChange"
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
                            <!-- <a-pagination size="small" :total="50" @change="handlerChange1" show-size-changer /> -->
                        </div>
                    </div>
                </div>
            </template>
        </ChangeLeftFolder>
        <!-- 全部栏目旁边的弹窗 -->
        <zmwModal @handleOkModal="handleOkModal" :showModal="modalDate.showModal" :modalTitle="modalDate.modalTitle"
            @closeModal="closeModal">
            <template #content>
                <div v-if="modalDate.showEdit">
                    <a-form :rules="rules1" :model="formEditColumn">
                        <!-- 编辑栏目-->
                        <a-form-item name="topicName" v-if="modalDate.modalTitle === '修改栏目'" ref="input" label="栏目名称">
                            <a-input showCount :maxlength="10" placeholder="请输入"
                                v-model:value="formEditColumn.topicName"></a-input>
                        </a-form-item>
                        <!-- 删除栏目-->
                        <div v-if="modalDate.modalTitle === '删除栏目'">
                            <div v-if="!modalDate.hasSonColumn">确认删除所选栏目吗？</div>
                            <div v-else>将删除该栏目及其名下的所有子栏目，确认删除吗？</div>
                        </div>
                        <!-- 添加子栏目-->
                        <a-form-item name="topicName" v-if="modalDate.modalTitle === '新增子栏目'" ref="input" label="子栏目名称">
                            <a-input showCount :maxlength="10" placeholder="请输入"
                                v-model:value="formEditColumn.topicName"></a-input>
                        </a-form-item>
                    </a-form>
                </div>
                <div v-else>
                    <a-form :rules="rules1" ref="formRef" :model="formAddColumn">
                        <a-form-item name="topicName" ref="input" label="栏目名称">
                            <a-row type="flex" align="middle" gutter="18">
                                <a-col :span="24">
                                    <a-input showCount :maxlength="10" v-model:value="formAddColumn.topicName"></a-input>
                                </a-col>
                            </a-row>
                        </a-form-item>
                    </a-form>
                </div>
            </template>
        </zmwModal>
        <!-- 上架 下架 删除-->
        <zmwModal @handleOkModal="handleOkModal" :showModal="modalDate.showOperateModal" :modalTitle="modalDate.modalTitle"
            @closeModal="closeModal">
            <template #content>
                <div>{{ addshelfMsg }}</div>
            </template>
        </zmwModal>

        <div v-if="showaddLabelModal || showEditLabelModal" ref="mountModal" class="class-modal">
            <!-- 新增标签 -->
            <!--如需新增的确认框，可使用handleModalAddOk()方法，方法已注释掉-->
            <a-modal
                v-if="showaddLabelModal"
                class="add-tag-modal"
                v-model:visible="showaddLabelModal"
                centered
                title="新增敏感词"
                @ok="addLabel()"
                @cancel="showaddLabelModal = false"
                :getContainer="() => $refs.mountModal"
            >
                <div class="add-tag-modal-label">敏感词名称</div>
                <a-form :model="addFormState" ref="addForm">
                    <a-form-item name="sensitiveName" :rules="[{ required: true, message: '敏感词名称不能为空', trigger: 'blur' }]">
                        <a-input v-model:value="addFormState.sensitiveName" showCount :maxlength="10" placeholder="请输入敏感词名称" />
                    </a-form-item>
                </a-form>
            </a-modal>
            <!-- 编辑标签 -->
            <a-modal
                v-if="showEditLabelModal"
                class="add-tag-modal"
                v-model:visible="showEditLabelModal"
                centered
                title="编辑敏感词"
                @ok="editLabel()"
                @cancel="showEditLabelModal = false"
                :getContainer="() => $refs.mountModal"
            >
                <div class="add-tag-modal-label">敏感词名称</div>
                <a-form :model="editFormState" ref="editForm">
                    <a-form-item name="sensitiveName" :rules="[{ required: true, message: '敏感词名称不能为空', trigger: 'blur' }]">
                        <a-input v-model:value="editFormState.sensitiveName" showCount :maxlength="10" placeholder="请输入敏感词名称" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
        <!-- relevance -->
    </div>
</template>

<script lang="ts">
import { contentApi } from '@/libs/api';
// import ChangeLeftFolder from './components/changeLeftFolder.vue'
import ChangeLeftFolder from '@/modules/components/changeLeftFolder.vue';
// import ChangeDropdown from './components/changeDropdown.vue'
import ChangeDropdown from '@/modules/components/changeDropdown.vue';
// import zmwModal from './components/zmwModal.vue'
import zmwModal from '@/modules/components/zmwModal.vue';

import { BookFilledIconType } from '@ant-design/icons-vue/lib/icons/BookFilled';
import { useRouter } from 'vue-router';
import MD5 from 'crypto-js/md5';
import dayjs from 'dayjs';
import { Moment } from 'moment'
type Key = ColumnProps['key'];
import { AxiosRequestHeaders } from 'axios';
import Encrypts from '@/libs/Encrypts';
import { systemManagementApi } from '@/libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref, Watch } from 'vue-property-decorator';
import { createVNode, defineComponent, reactive, ref, computed,toRefs } from 'vue';
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


interface titleListType {
    name: string;
    mark: string;
    index: number;
}
interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

interface formDataType {
    topicId: string; //栏目Id
    titlename: string; //标题名称
    // cover: string; //封面
    starttime: string; //开始时间
    endtime: string; //结束时间
    searchTime: string[]; // 时间选择器时间
}

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

@Options({
    components: {
        MinusCircleOutlined,
        PlusOutlined,
        ChangeLeftFolder,
        ChangeDropdown,

        zmwModal,
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
})

export default class contentManage extends Vue {
    public flag: Boolean = false;
    public hasList: any[] = [];

    public contentstateList = [{ value: '', name: '全部' }];
    created() {
        //this.queryDictListByCodes();
        this.getFolderList();
        this.getList();
        this.secsitiveTypeList();
    }

    public userTableLoading = false; // 用户表加载
    public sensitiveTypeName: string = '';
    // 对输入敏感词分类输入过滤
    filter: ShowSearchType['filter'] = (inputValue, path) => {
        return path.some((option) => {
             
            option.sensitiveTypeName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        });
    };
    // 敏感词分类 传sensitiveTypeId
    public sensitiveTypeId: string[] = [];

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

    //查询敏感词列表
    public async getList() {
        //this.userTableLoading = true;
        let params = {
            //sensitiveTypeId: this.sensitiveTypeId[this.sensitiveTypeId.length - 1], //得到的是一个数组 取最后一个值
            topicId: this.formData.topicId,
            // sensitiveTypeId: this.sensitiveTypeId,
            sensitiveTypeName: this.sensitiveTypeName,
            // sensitiveTypeName: this.formData.cover,
            sensitiveName: this.formData.titlename,
            mdfStartDate: this.formData.starttime,
            mdfEndDate: this.formData.endtime,
            // row4Page: this.userTablePagination.pageSize,
            // nowPage: this.userTablePagination.current,
        };
         
         
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.pagination.current;
                header.row4Page = this.pagination.pageSize;
            },
        };
        systemManagementApi
            .selectSensitiveMainInfo(params, header)
            .then((res: any) => {
                 
                this.userTableLoading = false;
                this.pagination.total = (res as any).recordsTotal;
                this.dataSource = res.data;
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

    //时间选择器
    //开始时间
    public starttime: string = '';
    public disabledDateStart(current: any) {
        if (this.formData.endtime) {
            return current > moment(this.formData.endtime).endOf('day');
        } else {
        }
    }

    //结束时间
    public endtime: string = '';
    public disableEndTime(current: any) {
        if (this.formData.starttime) {
            return current && current < moment(this.formData.starttime).subtract(1, 'days').endOf('day');
        }
    }


    public rules1 = {
        topicName: [{ required: true, message: '栏目名称不能为空', trigger: 'blur', whitespace: true }],
    };
    
    public allfolder() {
        this.formData.topicId = '';
    }
    public pagination = {
        current: 1, // 默认当前页数
        pageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        // showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`, // 显示总
        pageSizeOptions: ['5', '10', '15', '20'],
    };
    // 弹框start
    public formAddColumn = reactive({
        parentId: '',
        topicName: '',
    });
    public formEditColumn = reactive({
        id: '',
        topicName: '',
    });
    public menuListTiTle: string[] = ['修改栏目', '删除栏目', '新增子栏目'];

    public modalDate = reactive({
        id: '', //当前id
        showModal: false,
        showOperateModal: false,
        modalTitle: '',
        // showSon: false,//展示新增子栏目
        showEdit: false, //右键点击时的内容
        hasSonColumn: false, //右键的删除时是否有子节点
        handleOk: false, //点击弹框的确认按钮是否进行下一步
    });
    public rules = {
        topicName: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
    };
    public changeLabel() {
    this.state.selectedRowKeys = []
    this.selectedRow = []
  }
    // public formAddColumnList: any[] = [{ value: '', label: '全部' }];
    
    // public queryDictListByCodes() {
    //     contentApi.queryDictListByCodes({ codes: 'CONTENT_STATUS' }, {}).then((res: any) => {

    //          

    //         res.data[0].dictList.forEach((item: any, index: any) => {
    //             this.contentstateList.push({
    //                 value: item.itemCode,
    //                 name: item.itemName,
    //             });
    //         });
    //          
    //     });
    // }
    public addColumn() {
        this.modalDate.showModal = true;
        this.modalDate.showEdit = false;
        this.modalDate.modalTitle = '新增栏目';
    }
    // public addSonColumn() {
    //    
    //   this.modalDate.showSon = true
    //   // this.addSonColumnList.push({ label: '子栏目名称' })
    // }
    public deletesonColumn() {
         
        this.formAddColumn.topicName = '';
        // this.modalDate.showSon = false
    }
    public closeModal(value: any) {
         
        this.modalDate.showModal = value;
        this.formAddColumn.topicName = '';
        this.formEditColumn.topicName = '';
        this.modalDate.showOperateModal = value;
        this.state.selectedRowKeys = [];
        this.selectedRow = [];
    }
    public handleOkModal() {
        if (this.modalDate.modalTitle === '修改栏目') {
            this.editColumn();
        } else if (this.modalDate.modalTitle === '删除栏目') {
            this.deleteColumn();
        } else if (this.modalDate.modalTitle === '新增子栏目') {
            this.editAddSonColumn();
        } else {
            this.addFolderTopic();
        }
    }
    
    // public addSonColumnList: any[] = [
    //   { label: '新增子栏目:', a: '第一个', index: 0 },
    //   { label: '新增子栏目:', a: '第二个', index: 1 },
    // ]//添加子栏目的数组
    //点击全部栏目 的逻辑
    public addFolderTopic() {
         

        const list = this.getTreeName(this.hasList, this.formAddColumn.topicName);

        if (!list) {
            //        
            // message.success('新增栏目成功');
            contentApi.addFolderTopic({ topicName: this.formAddColumn.topicName, parentId: '' }, {}).then((res) => {
                 
                const { flag, msg } = res;
                if (flag === 'success') {
                    this.getFolderList();
                    message.success('新增栏目成功');
                    this.modalDate.showModal = false;
                    this.formAddColumn.topicName = '';
                    this.init();
                } else {
                    message.success('添加栏目失败');
                    this.formAddColumn.topicName = '';
                }
            });
        } else {
            message.error('栏目名称重复，添加失败');
        }
    }
    // 去重函数
    public test: any = [];
    public getTreeName(list: any, name: any) {
         
        this.test = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === name) {
                this.test.push(list[i]);
                return list[i];
            } else if (list[i].children && list[i].children.length > 0) {
                let nameList: any = this.getTreeName(list[i].children, name);
                if (nameList) {
                    this.test.push(nameList);
                    return nameList;
                }
            }
        }
    }
    // 弹框end
    public formData = reactive<formDataType>({
        topicId: '', //栏目Id
        titlename: '', //标题名称
        // cover: '', //封面
        starttime: '', //开始时间
        endtime: '', //结束时间
        searchTime: [], // 时间选择器时间
    });

    public showTableActive = ref<boolean>(true);
    public computed() {
         
    }
    public labelCol = { style: { width: '80px' } };
    public titleIndex = 0;

    public dataSource: any[] = [];

    public state = reactive<{
        selectedRowKeys: Key[];
        loading: boolean;
    }>({
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    });
    public topicName = '';
    // public hasSelected = computed(() => this.state.selectedRowKeys.length > 0);
    public onSelectChange = (selectedRowKeys: Key[]) => {
         
        this.state.selectedRowKeys = selectedRowKeys;
    };
    public selectedRow: any[] = []; //多选改变时的数据
    public handlerselectedRow() {
        this.state.selectedRowKeys.forEach((item: any) => {
            // this.selectedRow.push(this.dataSource[item])
            this.dataSource.forEach((i) => {
                if (i.contentId === item) {
                    this.selectedRow.push(i);
                }
            });
             
        });
    }
    public start = () => {
        this.state.loading = true;
        // ajax request after empty completing
        setTimeout(() => {
            this.state.loading = false;
            this.state.selectedRowKeys = [];
        }, 1000);
    };
    // public states:any = store.state
    public folderList: any[] = [];

    public states: any = store.state;

    public formAddColumnList: any[] = [{ value: '', label: '全部' }];

    public getFolderList() {
        contentApi.getFolderTopic({ id: this.modalDate.id }, {}).then((res) => {
            this.folderList = res.data;
             

            this.hasList = res.data;
            res.data.forEach((item: any) => {
                this.formAddColumnList.push({
                    label: item.name,
                    value: item.id,
                });
            });
             
        });
    }
    // 拿到左侧文件夹数据
    public getFolderName(value: any) {
         
        this.formData.topicId = value.id;
    }
    // 拿到搜索的数据   优化时写一个防抖
    public getsearchkey(value: any) {
        if (value) {
            contentApi.findTopicEoByName({ topicName: value }, {}).then((res) => {
                 
                this.folderList = res.data;
                store.commit('getLeftFolderList', res.data);
            });
        } else {
            this.getFolderList();
        }
    }
    public showpic = true;
    
    public columns: any[] = [
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
        // {
        //     title: '操作',
        //     key: 'operation',
        //     fixed: 'right',
        //     width: 70,
        //     slots: { customRender: 'action' },
        // },
    ];
    
    onSubmit() {
         
        this.pagination.current = 1;
        this.getList();
    }
    public reset() {
        this.formData = {
            topicId: '', //栏目Id
            titlename: '', //标题名称
            // cover: '', //封面
            starttime: '', //开始时间
            endtime: '', //结束时间
            searchTime: []
        };
        this.sensitiveTypeId = [];
        this.sensitiveTypeName = '';
        this.state.selectedRowKeys = [];
        this.selectedRow = [];
        this.getList();
    }
    public init() {
        this.formEditColumn = {
            id: '',
            topicName: '',
        };
        this.formAddColumn = {
            parentId: '',
            topicName: '',
        };
    }
    public value1 = ref('');
    public options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }));
    public showTopic = false;
    
    public dianji = () => {
         
    };

    //上架弹窗开关
    public addShelfBoolean = false;
    //上架子组件传值
    public colseShelf(val: any) {
         
        this.addShelfBoolean = val;
         
    }

   
    public closeMyModal = false;

    
    public contentId = '';
    
    public getDropdown(value: any, row: any) {
        // this.$emit('getDropdown',value, row)
         
        this.modalDate.showModal = true;
        this.modalDate.showEdit = true;

        // this.modalDate.showSon = false
        this.formEditColumn.id = row.id;
        if (value.title === '修改栏目') {
            this.modalDate.modalTitle = '修改栏目';

            this.formEditColumn.topicName = row.name;
            // this.formEditColumn.id = row.id
        } else if (value.title === '删除栏目') {
             
            this.modalDate.modalTitle = '删除栏目';

            if (row.children === '') {
                this.modalDate.hasSonColumn = false;
            } else {
                this.modalDate.hasSonColumn = true;
            }
        } else if (value.title === '新增子栏目') {
             
            this.modalDate.modalTitle = '新增子栏目';
        }
    }
    public editColumn() {
        contentApi.updateFolderTopic({ topicName: this.formEditColumn.topicName, id: this.formEditColumn.id }, {}).then((res) => {
             
            const { flag } = res;
            if (flag === 'success') {
                message.success('保存成功');
                this.modalDate.showModal = false;
                this.init();
                this.getFolderList();
            } else {
                message.error('保存失败');
            }
        });
    }
    public deleteColumn() {
        contentApi.delFolderTopic({ id: this.formEditColumn.id }, {}).then((res) => {
            const { flag } = res;
            if (flag === 'success') {
                message.success('删除成功');
                this.modalDate.showModal = false;
                this.init();

                this.getFolderList();
            } else {
                message.error('删除失败');
            }
        });
    }

    public router = useRouter();
    public editAddSonColumn() {
         
        const list = this.getTreeName(this.hasList, this.formEditColumn.topicName);
        if (!list) {
            contentApi.addFolderTopic({ topicName: this.formEditColumn.topicName, parentId: this.formEditColumn.id }, {}).then((res) => {
                 
                const { flag, msg } = res;
                if (flag === 'success') {
                    this.getFolderList();
                    message.success('新增子栏目成功');
                    this.modalDate.showModal = false;
                    this.formAddColumn.topicName = '';
                } else {
                    message.success('新增子栏目失败');
                    this.formAddColumn.topicName = '';
                }
                this.modalDate.showModal = false;
                this.init();
            });
        } else {
            message.error('栏目名称重复，添加失败');
        }
    }
    public showaddLabelModal = false; //是否展示新增标签的弹出框
    public showEditLabelModal = false; //是否展示编辑标签的弹出框
    public addContent() {
         
        if (this.formData.topicId === '') {
            message.warning('未选择敏感词分组');
        } else {
             
            //this.router.push('addContent')
            this.addFormState.sensitiveName = '';
            this.showaddLabelModal = true;
        }
    }

    public addFormState = {
        sensitiveName: '',
    };
    // 编辑的表单数据
    public editFormState = {
        labelId: '',
        sensitiveName: '',
    };
    public addLabel() {
        // 发请求 调用新增接口
        const params = {
            parentId: this.formData.topicId,
            // groupId: '1',
            //...this.addFormState,
            sensitiveName: this.addFormState.sensitiveName,
        };
         
         
        systemManagementApi.saveSensitiveMain(params, {}).then((res) => {
            this.showaddLabelModal = false;
            message.success('新增成功');
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.getList();
        });
    }
    //编辑标签
    public editLabel() {
        const params = {
            labelId: this.editFormState.labelId,
            sensitiveName: this.editFormState.sensitiveName,
        };
         
        systemManagementApi.saveSensitiveMain(params, {}).then((res) => {
            this.showEditLabelModal = false;
            message.success('编辑成功');
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.getList();
        });
    }




    public addshelfMsg = '';

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
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.getList();
            //this.secsitiveTypeList()
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
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.getList();
            //this.secsitiveTypeList()
        });
    }


    public productCodes = '';
    public handlerRelevance(row: any) {
         
        this.productCodes = row.productCodes;
    }
    
    public handleTableChange(pagination: PaginationType) {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getList();
    }
}
</script>

<style lang="less" scoped>
@import '../../assets/contenTbase.css';
@import '../../style/button.css';

.content-right-tab {
    height: 56px;
    padding-top: 10px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #f3c7bc;
    line-height: 44px;

    .content-right-tab-list {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 14px;
        color: #333333;

        .content-right-tab-item {
            cursor: pointer;
            width: 74px;
            border-bottom: 2px solid transparent;
            cursor: pointer;
        }

        .choose {
            border-bottom: 2px solid #e8380d;
        }
    }
}

.content-right-content {
    margin-top: -20px;
    .content-right-content-form {
        margin-top: 16px;
        background-color: #ffffff;
        padding: 20px 30px;
    }

    .content-right-content-tablebox {
        margin-top: 16px;
        background-color: #ffffff;
        padding: 20px 30px;
    }
}

.table-content {
    padding: 4px;

    .table-content-left {
        .table-content-img {
            width: 34px;
            height: 34px;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .table-content-right {
        margin-left: 4px;

        .table-content-content {
            font-size: 14px;
            color: #333333;
        }

        .table-content-id {
            font-size: 12px;
            color: #666666;
        }
    }
}

.upload {
    color: #66a1e8;
    font-size: 12px;
}
.content-right-content-topbutton {
  margin-bottom: 20px;
}
.operation-btn {
  margin-right: 20px;
  width: 100px;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
