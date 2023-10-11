<template>
    <div>
        <ChangeLeftFolder
            folderName="全部栏目"
            :menuListTiTle="menuListTiTle"
            menuTableList="menuTableList"
            @getDropdown="getDropdown"
            @addColumn="addColumn"
            :folderList="folderList"
            @getFolderName="getFolderName"
            @allfolder="allfolder"
            @getsearchkey="getsearchkey"
            :closeMyModal="closeMyModal"
        >
            <template #content>
                <content>

                </content>
            </template>
        </ChangeLeftFolder>
        <!-- 全部栏目旁边的弹窗 -->
        <zmwModal @handleOkModal="handleOkModal" :showModal="modalDate.showModal" :modalTitle="modalDate.modalTitle" @closeModal="closeModal">
            <template #content>
                <div v-if="modalDate.showEdit">
                    <a-form :model="formEditColumn">
                        <!-- 修改栏目-->
                        <a-form-item v-if="modalDate.modalTitle === '修改素材栏目'" ref="input" label="栏目名称">
                            <a-input showCount :maxlength="10" placeholder="请输入栏目名称" v-model:value="formEditColumn.topicName"></a-input>
                        </a-form-item>
                        <!-- 删除栏目-->
                        <div v-if="modalDate.modalTitle === '删除素材栏目'">
                            <div v-if="!modalDate.hasSonColumn">确认删除所选栏目吗？</div>
                            <div v-else>将删除该栏目及其名下的所有子栏目，确认删除吗？</div>
                        </div>
                        <!-- 添加子栏目-->
                        <a-form-item v-if="modalDate.modalTitle === '新增子栏目'" ref="input" label="栏目名称">
                            <a-input showCount :maxlength="10" placeholder="请输入栏目名称" v-model:value="formEditColumn.topicName"></a-input>
                        </a-form-item>
                    </a-form>
                </div>
                <div v-else>
                    <a-form ref="formRef" :model="formAddColumn" :rules="rules">
                        <a-form-item ref="input" label="栏目名称" name="parentId">
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
    </div>
</template>

<script lang="ts">
import { baseApi, Header, ResponseData } from '@/libs/BaseApi';
import { AxiosRequestHeaders } from 'axios';
import { contentApi, systemManagementApi } from '@/libs/api';
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import addShelf from '@/modules/components/addShelf.vue';
import { Options, Vue } from 'vue-class-component';
import ChangeLeftFolder from '@/modules/components/changeLeftFolder.vue';
import ChangeDropdown from '@/modules/components/changeDropdown.vue';
import zmwModal from '@/modules/components/zmwModal.vue';
import { useRouter } from 'vue-router';
import { FormInstance, message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ColumnProps } from 'ant-design-vue/es/table';
import store from '@/modules/conTent/store';
import { BookFilledIconType } from '@ant-design/icons-vue/lib/icons/BookFilled';
import { number } from '@intlify/core-base';
import dayjs from 'dayjs';
import { Ref } from 'vue-property-decorator';
import { createVNode } from 'vue';
import content from '@/modules/systemManagement/materialManagement/content.vue';

// 分页
interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

// import { Moment } from 'moment';
type Key = ColumnProps['key'];

interface formDataType {
    statPeriod: string; //	热度统计周期
    labelName: string; //	标签名称
    labelStart: string; //	标签状态
    startDate: string; //	开始时间
    endDate: string; //结束时间
    topicId: string; //分组id
    isUse: string; //	查询是否使用(0-未使用，1-已使用）
}
@Options({
    name: 'LaberManagement',
    components: {
        ChangeLeftFolder,
        ChangeDropdown,
        addShelf,
        zmwModal,
        content,
    },
})
export default class contentManage extends Vue {
[x: string]: any;
    // @Ref('addForm') readonly addForm!: FormInstance;
    created() {
        this.getFolderList();
    }
    public flag = false;

    public router = useRouter();
    public menuTableList: any[] = [];

    // 弹框start
    public formAddColumn = reactive({
        parentId: '',
        topicName: '',
        module:'s',
    });
    public formEditColumn = reactive({
        id: '',
        topicName: '',
    });
    public menuListTiTle: string[] = ['修改素材栏目', '删除素材栏目', '新增子栏目'];
    public modalDate = reactive({
        showModal: false,
        modalTitle: '',
        showSon: false, //展示新增子栏目
        showEdit: false, //右键点击时的内容
        hasSonColumn: false, //右键的删除时是否有子节点
        showOperateModal: false,
        handleOk: false, //点击弹框的确认按钮是否进行下一步
    });

    public pagination = {
        current: 1, // 默认当前页数
        pageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        // showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`, // 显示总
        pageSizeOptions: ['5', '10', '15', '20'],
    };
    public rules = {
        topicName: [{ required: true, message: '请输入栏目', trigger: 'blur' }],
    };
    public formAddColumnList: any[] = [{ label: '全部', value: '' }];
    public addColumn() {
        this.modalDate.showModal = true;
        this.modalDate.showEdit = false;
        this.modalDate.modalTitle = '新增素材栏目';
    }
    public addSonColumn() {
         
        this.modalDate.showSon = true;
    }
    public deletesonColumn() {
         
        this.formAddColumn.topicName = '';
        this.modalDate.showSon = false;
    }
    public closeModal(value: any) {
         
        this.state.selectedRowKeys = [];
        this.selectedRow = [];
        this.modalDate.showModal = false;
        this.modalDate.showOperateModal = false;
    }
    public handleOkModal() {
        const list: any[] = [];
         
         
        if (this.modalDate.modalTitle === '修改素材栏目') {
            this.editColumn();
             
        } else if (this.modalDate.modalTitle === '删除素材栏目') {
            this.deleteColumn();
             
        } else if (this.modalDate.modalTitle === '新增子栏目') {
             
            this.editAddSonColumn();
        } else {
            this.addFolderTopic();
        }
         
    }
    
    public initData() {
         
    }
    //点击全部栏目 的逻辑
    public addFolderTopic() {
         

        const list = this.getTreeName(this.hasList, this.formAddColumn.topicName);

        if (!list) {
            systemManagementApi.addTopic({ topicName: this.formAddColumn.topicName, parentId: this.formAddColumn.parentId,module:'s' }, {}).then((res) => {
                 
                const { flag, msg } = res;
                if (flag === 'success') {
                    this.getFolderList();
                    message.success('素材栏目添加成功');

                    this.init();
                } else {
                    message.error('素材栏目添加失败');
                }
                this.modalDate.showModal = false;
                this.formAddColumn.topicName = '';
            });
        } else {
            message.error('素材栏目重复，添加失败');
        }
    }
    // 弹框end

    public formData = reactive<formDataType>({
        statPeriod: '', //	热度统计周期
        labelName: '', //	素材名称
        labelStart: '', //	素材状态
        startDate: '', //	开始时间
        endDate: '', //	结束时间
        topicId: '', //分组id
        isUse: '', //
    });

    public showTableActive = ref<boolean>(true);
    public computed() {
         
    }
    public titleIndex = 0;
    public dataSource: any[] = [];

    public state = reactive<{
        selectedRowKeys: Key[];
        loading: boolean;
    }>({
        selectedRowKeys: [], 
        loading: false,
    });

    public onSelectChange = (selectedRowKeys: Key[]) => {
         
        this.state.selectedRowKeys = selectedRowKeys;
    };
    public selectedRow: any[] = []; //多选改变时的数据
    public handlerselectedRow() {
         
        this.state.selectedRowKeys.forEach((item: any) => {
            this.dataSource.forEach((i) => {
                if (i.labelId === item) {
                    this.selectedRow.push(i);
                }
            });
        });
    }
    public start = () => {
        this.state.loading = true;
        setTimeout(() => {
            this.state.loading = false;
            this.state.selectedRowKeys = [];
        }, 1000);
    };
    public folderList: any[] = []; //素材分组列
    public states: any = store.state;
    public getFolderList() {
        const params={
            id:'',
            module:'s'
        }
        systemManagementApi.findTopicTree(params, {}).then((res) => {
             
            this.folderList = res.data;
             
            // formAddColumnList
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
            
            systemManagementApi.findGropByName({ groupName: value }, {}).then((res) => {
                 
                this.folderList = res.data;
            });
        } else {
            this.getFolderList();
        }
    }
    
    public init() {
        this.formEditColumn = {
            id: '',
            topicName: '',
        };
        this.formAddColumn = {
            parentId: '',
            topicName: '',
            module:'s',
        };
    }
    public value1 = ref('');
    public options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }));
    public handleChange = (value: string) => {
         
    };
    public dianji = () => {
         
    };
    
    public closeMyModal = false;


    public allfolder() {
        this.formData.topicId = '';
    }
    public getDropdown(value: any, row: any) {
        if (row.id === 'CustomLabel' && value.title === '删除素材栏目') {
            message.error('自定义素材类名不可删除');
            return;
        }
         
        this.modalDate.showModal = true;
        this.modalDate.showEdit = true;
        this.modalDate.showSon = false;
        this.formEditColumn.id = row.id;
        if (value.title === '修改素材栏目') {
            this.modalDate.modalTitle = '修改素材栏目';
            this.formEditColumn.topicName = row.name;
        } else if (value.title === '删除素材栏目') {
             
            this.modalDate.modalTitle = '删除素材栏目';
            if (row.children === '') {
                this.modalDate.hasSonColumn = false;
            } else {
                this.modalDate.hasSonColumn = true;
            }
            //  this.modalDate.hasSonColumn=
        } else if (value.title === '新增子栏目') {
             
            this.modalDate.modalTitle = '新增子栏目';
            this.formEditColumn = {
                id: '',
                topicName: '',
            };
            this.formEditColumn.id = row.id;
        }
    }
    public labelId = '';
   
    // 修改接口
    public editColumn() {
        systemManagementApi.updateTopic({ topicName: this.formEditColumn.topicName, id: this.formEditColumn.id }, {}).then((res) => {
             
            const { flag } = res;
            if (flag === 'success') {
                message.success('修改素材栏目成功');
                this.modalDate.showModal = false;
                this.init();
                this.getFolderList();
            } else {
                message.error('修改素材栏目失败');
            }
        });
    }
    public deleteColumn() {
         

        systemManagementApi.deleteTopic({ id: this.formEditColumn.id }, {}).then((res) => {
            const { flag } = res;
            if (flag === 'success') {
                message.success('删除素材栏目成功');
                this.modalDate.showModal = false;
                this.init();
                this.getFolderList();
            } else {
                message.error('删除素材栏目失败');
            }
        });
    }
    public hasList: any[] = [];
    public editAddSonColumn() {
         
        const list = this.getTreeName(this.hasList, this.formEditColumn.topicName);
        if (!list) {
            systemManagementApi.addTopic({ topicName: this.formEditColumn.topicName, parentId: this.formEditColumn.id, module:'s' }, {}).then((res) => {
                //  
                const { flag, msg } = res;
                if (flag === 'success') {
                    this.getFolderList();
                    message.success('新增子栏目成功');
                } else {
                    message.error('新增子栏目失败');
                }
                this.formAddColumn.topicName = '';
                this.modalDate.showModal = false;
                this.init();
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
                const nameList: any = this.getTreeName(list[i].children, name);
                if (nameList) {
                    this.test.push(nameList);
                    return nameList;
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/modules/assets/contenTbase.css';
@import '~@/modules/style/button.css';

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
            width: 74px;
            border-bottom: 2px solid transparent;
        }

        .choose {
            border-bottom: 2px solid #e8380d;
        }
    }
}

.content-right-content {
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
    .content-right-content-top-button {
        margin-bottom: 8px;
        > button {
            font-size: 13px;
            margin-right: 15px;
        }
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
/deep/.ant-modal {
    &.add-tag-modal {
        width: 540px !important;
        height: 200px;
        overflow: hidden;
        border-radius: 10px;
    }
    .ant-modal-content {
        height: 100%;
        .ant-modal-header {
            padding: 24px 26px 22px;
            .ant-modal-title {
                font-size: 14px;
                font-weight: bold;
            }
        }
        .ant-modal-body {
            padding: 0 26px;
            .add-tag-modal-label {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 7px;
            }
        }
        .ant-modal-footer {
            .ant-btn {
                width: 74px;
                height: 28px;
                font-size: 12px;
            }
        }
    }
}
</style>
