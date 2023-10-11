<!-- / * @FileDescription: 朋友圈管理列表页
* @Author: ZMW
* @Date: 2023-07-17
* @LastEditors: 
* @LastEditTime:
*/ -->
<template>
    <div>
        <ChangeLeftFolder folderName="全部标签" :menuListTiTle="menuListTiTle" menuTableList="menuTableList"
            @getDropdown="getDropdown" @addColumn="addColumn" :folderList="folderList" @getFolderName="getFolderName"
            @allfolder="allfolder" @getsearchkey="getsearchkey" :closeMyModal="closeMyModal">

            <template #content>
                <div class="content-right-content">
                    <div class="content-right-content-form">
                        <a-form :model="formData" :label-col="labelCol" labelAlign="left">
                            <a-row :gutter="24">
                                <!-- <a-col class="gutter-row" :span="8">
                  <div class="gutter-box">
                    <a-form-item label="热度统计周期:">
                       全部、7天、14天、30天、其他
                      <a-select v-model:value="formData.statPeriod" placeholder="默认第一项">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option value="7">7天</a-select-option>
                        <a-select-option value="14">14天</a-select-option>
                        <a-select-option value="30">30天</a-select-option>
                        <a-select-option value="other">其他</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-col> -->
                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="标题名称:">
                                            <a-input v-model:value="formData.labelName" />
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="拟人:">
                                            <a-select @change="changeLabel" v-model:value="formData.labelStart"
                                                placeholder="默认第一项">
                                                <a-select-option v-for="item in lableStateList" :key="item"
                                                    :value="item.itemCode">{{ item.itemName }}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="资讯信息:">
                                            <a-select @change="changeLabel" v-model:value="formData.labelStart"
                                                placeholder="默认第一项">
                                                <a-select-option v-for="item in lableStateList" :key="item"
                                                    :value="item.itemCode">{{ item.itemName }}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="帖子状态:">
                                            <a-select @change="changeLabel" v-model:value="formData.labelStart"
                                                placeholder="默认第一项">
                                                <a-select-option v-for="item in lableStateList" :key="item"
                                                    :value="item.itemCode">{{ item.itemName }}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="16">
                                    <div class="gutter-box">
                                        <a-form-item label="创建时间:">
                                            <a-row>
                                                <a-date-picker style="width: 45%; border-radius: 4px"
                                                    :disabled-date="disableStartTime" v-model:value="formData.startDate"
                                                    value-format="YYYY-MM-DD" size="default" />
                                                <div style="text-align: center; line-height: 30px">&nbsp;至</div>
                                                <a-date-picker style="width: 45%; border-radius: 4px; margin-left: 4px"
                                                    :disabled-date="disableEndTime" v-model:value="formData.endDate"
                                                    value-format="YYYY-MM-DD" size="default" />
                                            </a-row>
                                        </a-form-item>
                                    </div>
                                </a-col>
                            </a-row>
                            <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
                                <button class="solidColor" @click="onSubmit">查询</button>
                                <button class="ghostGrey" style="margin-left: 10px" @click="reset">重置</button>
                            </a-form-item>
                        </a-form>
                    </div>
                    <div class="content-right-content-tablebox">
                        <div class="content-right-content-top-button">
                            <button class="solidColor" @click="addPost">新增帖子</button>
                            <button class="ghostGrey" @click="shelf">批量上架</button>
                            <button class="ghostColor" @click="delContent">批量删除</button>
                        </div>
                        <div class="content-right-content-table">
                            <a-table :pagination="pagination" :row-key="(record: any) => record.labelId"
                                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                                :columns="columns" :data-source="dataSource" :scroll="{ x: 1500, y: 300 }"
                                @change="handleTableChange">
                                <template #action="{ record }">
                                    <ChangeDropdown @getDropdown="getTableDropdown" :row="record"
                                        :menuList="record.menuTableList" :showTableActive="showTableActive">
                                    </ChangeDropdown>
                                </template>
                            </a-table>
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
                    <a-form :model="formEditColumn">
                        <!-- 编辑栏目-->
                        <a-form-item v-if="modalDate.modalTitle === '修改标签类目'" ref="input" label="类目名称">
                            <a-input showCount :maxlength="10" placeholder="请输入类目名称"
                                v-model:value="formEditColumn.topicName"></a-input>
                        </a-form-item>
                        <!-- 删除栏目-->
                        <div v-if="modalDate.modalTitle === '删除标签类目'">
                            <div v-if="!modalDate.hasSonColumn">确认删除所选栏目吗？</div>
                            <div v-else>将删除该栏目及其名下的所有子栏目，确认删除吗？</div>
                        </div>
                        <!-- 添加子栏目-->
                        <a-form-item v-if="modalDate.modalTitle === '新增子类目'" ref="input" label="类目名称">
                            <a-input showCount :maxlength="10" placeholder="请输入类目名称"
                                v-model:value="formEditColumn.topicName"></a-input>
                        </a-form-item>
                    </a-form>
                </div>
                <div v-else>
                    <a-form ref="formRef" :model="formAddColumn" :rules="rules">
                        <a-form-item ref="input" label="类目名称" name="parentId">
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
        <!-- 修改栏目、编辑栏目，删除栏目的弹窗 -->
        <!-- <zmwModal @handleOkModal="changeOkModal" :showModal="chooseModalDate.showModal"
      :modalTitle="chooseModalDate.modalTitle" @closeModal="changeCloseModal">
    <template #content>
        <a-form layout="vertical" ref="formRef" :model="formChangeColumn" :rules="rules">
          <a-form-item></a-form-item>
        </a-form>
        </template>
                                                        </zmwModal> -->
        <!--  <zmwModal @handleOkModal="changeOkModal" :showModal="chooseModalDate.showModal"
          :modalTitle="chooseModalDate.modalTitle" @closeModal="changeCloseModal">
          <template #content>
            <a-form layout="vertical" ref="formRef" :model="formChangeColumn" :rules="rules">
              <a-form-item></a-form-item>
            </a-form>
          </template>
          </zmwModal> -->
        <div v-if="addShelfBoolean == true">
            <add-shelf @colseShelf="colseShelf" />
        </div>
        <!-- ref="modal" 将用于挂载modal组件 -->
        <div v-if="showaddLabelModal || showEditLabelModal" ref="mountModal" class="class-modal">
            <!-- 新增标签 -->
            <!--如需新增的确认框，可使用handleModalAddOk()方法，方法已注释掉-->
            <a-modal v-if="showaddLabelModal" class="add-tag-modal" v-model:visible="showaddLabelModal" centered
                title="新增标签" @ok="addLabel()" @cancel="showaddLabelModal = false" :getContainer="() => $refs.mountModal">
                <div class="add-tag-modal-label">标签名称</div>
                <a-form :model="addFormState" ref="addForm">
                    <a-form-item name="labelName" :rules="[{ required: true, message: '标签名称不能为空', trigger: 'blur' }]">
                        <a-input v-model:value="addFormState.labelName" showCount :maxlength="10" placeholder="请输入标签名称" />
                    </a-form-item>
                </a-form>
            </a-modal>
            <!-- 编辑标签 -->
            <a-modal v-if="showEditLabelModal" class="add-tag-modal" v-model:visible="showEditLabelModal" centered
                title="编辑标签" @ok="editLabel()" @cancel="showEditLabelModal = false" :getContainer="() => $refs.mountModal">
                <div class="add-tag-modal-label">标签名称</div>
                <a-form :model="editFormState" ref="editForm">
                    <a-form-item name="labelName" :rules="[{ required: true, message: '标签名称不能为空', trigger: 'blur' }]">
                        <a-input v-model:value="editFormState.labelName" showCount :maxlength="10" placeholder="请输入标签名称" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </div>
</template>

<script lang="ts">
import { baseApi, Header, ResponseData } from '@/libs/BaseApi';
import { AxiosRequestHeaders } from 'axios';
import { contentApi, systemManagementApi ,friendCircleApi} from '@/libs/api';
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
    topicName:string;//分组id的名称

}
@Options({
    name: 'LaberManagement',
    components: {
        ChangeLeftFolder,
        ChangeDropdown,
        addShelf,
        zmwModal,
    },
})
export default class contentManage extends Vue {
    @Ref('addForm') readonly addForm!: FormInstance;
    created() {
        this.findDictListByCode();
        this.getFolderList();
        this.getCententList();
    }
    public flag = false;

    public router = useRouter();
    public menuTableList: any[] = [];
    public lableStateList: any[] = [{ itemCode: '', itemName: '全部' }];
    public findDictListByCode() {
        contentApi.findDictListByCode({ code: 'LABEL_STATUS' }, {}).then((res) => {
             
            res.data.forEach((item: any, index: any) => {
                this.lableStateList.push({
                    ...item,
                });
            });
        });
    }
    // 不可选择时间
    disableStartTime(startTime: any) {
        const endTime = this.formData.endDate;
        if (endTime) {
            return startTime > dayjs(endTime).endOf('day');
        }
    }
    disableEndTime(endTime: any) {
        const startTime = this.formData.startDate;
        if (startTime) {
            return endTime < dayjs(startTime).startOf('day');
        }
    }
    
    public showaddLabelModal = false; //是否展示新增标签的弹出框
    public showEditLabelModal = false; //是否展示编辑标签的弹出框
    // 新增帖子
    public addPost() {

         
        
        if (this.formData.topicId === '') {
            message.warning('未选择栏目分组');
        } else {
             
             this.router.push({ path: 'friendCircleReadOrAdd', query: { status:'新增',parentId:'',topicName:this.formData.topicName,assistantId:'' } })
        }
      
    }

    // // 新增的表单数据
    public addFormState = {
        labelName: '',
    };
    // 编辑的表单数据
    public editFormState = {
        labelId: '',
        labelName: '',
    };

    // 新增标签弹框确认
    // public async handleModalAddOk() {
    //   this.addForm.validate().then(() => {
    //     Modal.confirm({
    //       icon: createVNode(ExclamationCircleOutlined),
    //       content: '确认提交新增标签吗？',
    //       okText: '确定',
    //       cancelText: '取消',
    //       onOk: () => {
    //         this.addLabel()
    //       },
    //       onCancel: () => {
    //         this.showaddLabelModal = false;
    //       }
    //     });
    //   });
    // }
    public addLabel() {
        // 发请求 调用新增接口
        const params = {
            parentId: this.formData.topicId,
            // groupId: '1',
            //...this.addFormState,
            labelName: this.addFormState.labelName,
        };
         
         
        systemManagementApi.addLabel(params, {}).then((res) => {
            this.showaddLabelModal = false;
            message.success('新增成功');
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.getCententList();
        });
    }
    //编辑标签
    public editLabel() {
        const params = {
            labelId: this.editFormState.labelId,
            labelName: this.editFormState.labelName,
        };
         
        systemManagementApi.updateysysLabel(params, {}).then((res) => {
            this.showEditLabelModal = false;
            message.success('编辑成功');
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.getCententList();
        });
    }
    // 弹框start
    public formAddColumn = reactive({
        parentId: '',
        topicName: '',
    });
    public formEditColumn = reactive({
        id: '',
        topicName: '',
    });
    public menuListTiTle: string[] = ['修改标签类目', '删除标签类目', '新增子类目'];
    public modalDate = reactive({
        showModal: false,
        modalTitle: '',
        showSon: false, //展示新增子栏目
        showEdit: false, //右键点击时的内容
        hasSonColumn: false, //右键的删除时是否有子节点

        // showModal: false,
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
        this.modalDate.modalTitle = '新增标签类目';
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
        if (this.modalDate.modalTitle === '修改标签类目') {
            this.editColumn();
        } else if (this.modalDate.modalTitle === '删除标签类目') {
            this.deleteColumn();
        } else if (this.modalDate.modalTitle === '新增子类目') {
             
            this.editAddSonColumn();
        } else if (this.modalDate.modalTitle === '上架') {
            this.batchupshelf('5');
        } else if (this.modalDate.modalTitle === '下架') {
            this.batchupshelf('6');
        } else if (this.modalDate.modalTitle === '删除') {
            this.batchupshelf('4');
        } else if (this.modalDate.modalTitle === '批量上架') {
            // 处理
            if (this.modalDate.handleOk) {
                this.batchupshelfList('5');
            } else {
                this.modalDate.showOperateModal = false;
                this.state.selectedRowKeys = [];
                this.selectedRow = [];
            }
        } else if (this.modalDate.modalTitle === '批量删除') {
            // 处理
            if (this.modalDate.handleOk) {
                this.batchupshelfList('4');
            } else {
                // 不处理 仅执行关闭弹框逻辑
                this.modalDate.showOperateModal = false;
                this.state.selectedRowKeys = [];
                this.selectedRow = [];
            }
        } else {
            this.addFolderTopic();
        }
    }
    public batchupshelf(operateType: any) {
        systemManagementApi.batchupshelf({ batchupshelfList: [{ id: this.labelId, operateType }] }, {}).then((res) => {
            const { flag } = res;
            if (flag === 'success') {
                if (operateType === '4') {
                    message.success('删除成功');
                } else if (operateType === '5') {
                    message.success('上架成功');
                } else if (operateType === '6') {
                    message.success('下架成功');
                }
                this.getCententList();
            } else {
                if (operateType === '4') {
                    message.error('删除失败');
                } else if (operateType === '5') {
                    message.error('上架失败');
                } else if (operateType === '6') {
                    message.success('下架失败');
                }
            }
            this.modalDate.showOperateModal = false;
            this.state.selectedRowKeys = [];
            this.selectedRow = [];
        });
    }

    public batchupshelfList(operateType: any) {
        const batchupshelfList: any[] = [];
        this.state.selectedRowKeys.forEach((item: any, index: number) => {
            batchupshelfList.push({ id: item, operateType });
        });
         

        systemManagementApi.batchupshelf({ batchupshelfList }, {}).then((res) => {
            const { flag } = res;
            if (flag === 'success') {
                if (operateType === '4') {
                    message.success('批量删除成功');
                } else if (operateType === '5') {
                    message.success('批量上架成功');
                }
                this.getCententList();
            } else {
                if (operateType === '4') {
                    message.error('批量删除失败');
                } else if (operateType === '5') {
                    message.error('批量上架失败');
                }
            }
            this.modalDate.showOperateModal = false;
            this.state.selectedRowKeys = [];
            this.selectedRow = [];
        });
    }
    // public batchupshelf(operateType: string, type: string) {
    //   //  
    //   const batchupshelfList: any[] = []
    //   if (type === '批量') {
    //     this.selectedRow.forEach((item: any) => {
    //        
    //       batchupshelfList.push({
    //         id: item.id, operateType
    //       })
    //     })
    //   } else {
    //     batchupshelfList.push({
    //       id: type,
    //       operateType
    //     })
    //   }
    //   systemManagementApi.batchupshelf({ batchupshelfList }, {}).then(res => {
    //     //  
    //     const { flag } = res
    //     if (flag === 'success') {
    //       message.success('操作成功');
    //       this.getCententList()
    //       this.dataSource = []
    //       this.initData()
    //     }
    //   })
    // }
    public initData() {
         
    }
    //点击全部栏目 的逻辑
    public addFolderTopic() {
         

        const list = this.getTreeName(this.hasList, this.formAddColumn.topicName);
        if (this.formAddColumn.topicName.trim().length) {
            if (!list) {
                friendCircleApi.addgrop({ groupName: this.formAddColumn.topicName, parentId: this.formAddColumn.parentId }, {}).then((res) => {
                     
                    const { flag, msg } = res;
                    if (flag === 'success') {
                        this.getFolderList();
                        message.success('标签类目添加成功');

                        this.init();
                    } else {
                        message.error('标签类目添加失败');
                    }
                    this.modalDate.showModal = false;
                    this.formAddColumn.topicName = '';
                });
            } else {
                message.error('标签类目重复，添加失败');
            }
        } else {
            message.error('类目名称不能为空');
        }

    }
    // 弹框end

    public formData = reactive<formDataType>({
        statPeriod: '', //	热度统计周期
        labelName: '', //	标签名称
        labelStart: '', //	标签状态
        startDate: '', //	开始时间
        endDate: '', //	结束时间
        topicId: '', //分组id
        isUse: '', //
         topicName:'',//分组id的名称
    });

    public showTableActive = ref<boolean>(true);
    public computed() {
         
    }
    public labelCol = { style: { width: '70px' } };
    public titleIndex = 0;
    public dataSource: any[] = [];

    public state = reactive<{
        selectedRowKeys: Key[];
        loading: boolean;
    }>({
        selectedRowKeys: [], // Check here to configure the default column
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
        // ajax request after empty completing
        setTimeout(() => {
            this.state.loading = false;
            this.state.selectedRowKeys = [];
        }, 1000);
    };
    // public states:any = store.state
    public folderList: any[] = []; //标签分组列
    public states: any = store.state;
    public getFolderList() {
        friendCircleApi.qrygrop({}, {}).then((res) => {
             
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
        this.formData.topicName = value.name;

        this.getCententList();
    }
    // 拿到搜索的数据   优化时写一个防抖
    public getsearchkey(value: any) {
        if (value) {
            // /content/labelgrop/updategrop.do
            // systemManagementApi.updategrop
            // contentApi.findTopicEoByName({ topicName: value }, {}).then(res => {
            //    
            //   this.folderList = res.data
            //   store.commit('getLeftFolderList', res.data)
            // })
            systemManagementApi.findGropByName({ groupName: value }, {}).then((res) => {
                 
                this.folderList = res.data;
            });
        } else {
            this.getFolderList();
        }
    }
    public recordsTotal = 0;
    public recordsFiltered = 0;
    // public getUserList() {
    //   const param = {
    //     groupId: this.formData.topicId,//	所属分组ID，字符串类型
    //     // titleName: this.formData.titlename,//标题名称
    //     statPeriod: this.formData.statPeriod,//	热度统计周期
    //     labelName: this.formData.labelName,//	标签名称
    //     labelStart: this.formData.labelStart,//	标签状态
    //     startDate: this.formData.startDate,//	创建时间
    //     endDate: this.formData.endDate,//	创建时间
    //     isUse: this.formData.isUse,//查询是否使用(0-未使用，1-已使用）
    //     // isUse: '1',//查询是否使用(0-未使用，1-已使用）
    //   }
    //   const header: any = {
    //     request: (header: AxiosRequestHeaders) => {
    //       header.nowPage = '1';
    //       header.row4Page = '50';
    //     }
    //   }
    //   // systemManagementApi.qrysysLabel(param),header
    //   baseApi.post('/content/label/qrysysLabel.do', param, 'lc', header).then((res) => {
    //      
    //   })
    // }
    public getCententList() {
        const param = {
            groupId: this.formData.topicId, //	所属分组ID，字符串类型
            statPeriod: this.formData.statPeriod, //	热度统计周期
            labelName: this.formData.labelName, //	标签名称
            labelStart: this.formData.labelStart, //	标签状态
            startDate: this.formData.startDate && this.formData.startDate + ' 00:00:00', //	创建时间
            endDate: this.formData.endDate && this.formData.endDate + ' 23:59:59', //	创建时间
            isUse: this.formData.isUse, //查询是否使用(0-未使用，1-已使用）
            // isUse: '1',//查询是否使用(0-未使用，1-已使用）
        };

        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.pagination.current;
                header.row4Page = this.pagination.pageSize;
            },
        };
        this.dataSource = [];
        systemManagementApi.qrysysLabel(param, header).then((res: any) => {
             
            this.pagination.total = res.recordsTotal;
            res.data.forEach((item: any, index: number) => {
                if (item.labelStater === '待审核') {
                    item.menuTableList = [
                        { title: '审核', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                } else if (item.labelStater === '退回修改') {
                    item.menuTableList = [
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                } else if (item.labelStater === '已上架') {
                    item.menuTableList = [
                        { title: '详情', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: false },
                        { title: '删除', index: 3, disabled: false },
                    ];
                } else if (item.labelStater === '已下架') {
                    item.menuTableList = [
                        // { title: '详情', index: 0, disabled: false },
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: false },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                }
                this.dataSource.push({
                    // key: item.rn - 1,
                    key: index,
                    ...item,
                });
                //  
            });
        });
    }

    public chooseTitle(item: any) {
         
        this.titleIndex = item.index;
        this.formData.isUse = item.mark;
         
    }
    public columns = [
        { title: '标题名称', width: 100, dataIndex: 'labelName', key: 'labelName' },
        // { title: '覆盖人数', width: 100, dataIndex: 'coverPeople', key: 'coverPeople', },
        // { title: '覆盖率', width: 100, dataIndex: 'coveRate', key: 'coveRate', },
        // { title: '使用次数', width: 150, dataIndex: 'filterCount', key: 'filterCount', },
        { title: '拟人', width: 150, dataIndex: 'labelStater', key: 'labelStater' },
        { title: '资讯信息', width: 150, dataIndex: 'userName', key: 'userName' },
        { title: '帖子状态', width: 100, dataIndex: 'crt_date', key: 'crt_date' },
        { title: '创建时间', width: 100, dataIndex: 'crt_date', key: 'crt_date' },
        { title: '修改时间', width: 100, dataIndex: 'crt_date', key: 'crt_date' },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 70,
            slots: { customRender: 'action' },
        },
    ];
    public onSubmit() {
         
        this.pagination.current = 1;
        this.getCententList();
    }
    public reset() {
        this.formData = reactive<formDataType>({
            statPeriod: '', //	热度统计周期
            labelName: '', //	标签名称
            labelStart: '', //	标签状态
            startDate: '', //	开始时间
            endDate: '', //	结束时间
            topicId: '', //分组id
            isUse: '', //
         topicName:'',//分组id的名称

        });
        this.dataSource = [];
        this.pagination = {
            current: 1, // 默认当前页数
            pageSize: 10, // 默认当前页显示数据的大小
            total: 0, // 总数，必须先有
            showSizeChanger: true,
            // showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条`, // 显示总
            pageSizeOptions: ['5', '10', '15', '20'],
        };
        this.getCententList();
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

    public dianji = () => {
         
    };

    //上架弹窗开关
    public addShelfBoolean = false;
    //上架子组件传值
    public colseShelf(val: any) {
         
        this.addShelfBoolean = val;
         
    }
    //上架
    public addShelf() {
        this.addShelfBoolean = true;
    }
    // public getFather() {
    //    
    //   // this.folderList.forEach(item=>{
    //   //   // this.addlanmuList.push({id:item.id,name:item.name})
    //   // })
    // }
    public closeMyModal = false;

    // public changeOkModal() {
    //   this.modalDate.showModal = false
    //    

    // }
    // public changeCloseModal() {
    //   this.modalDate.showModal = false
    //    

    // }
    // public modalDate = reactive({
    //   showModal: false,
    //   modalTitle: '',
    // })
    public allfolder() {
        this.formData.topicId = '';
        this.getCententList();
    }
    public getDropdown(value: any, row: any) {
        // this.$emit('getDropdown',value, row)
        if (row.id === 'CustomLabel' && value.title === '删除标签类目') {
            message.error('自定义标签类名不可删除');
            return;
        }
         
        this.modalDate.showModal = true;
        this.modalDate.showEdit = true;
        this.modalDate.showSon = false;
        this.formEditColumn.id = row.id;
        if (value.title === '修改标签类目') {
            this.modalDate.modalTitle = '修改标签类目';
            this.formEditColumn.topicName = row.name;
        } else if (value.title === '删除标签类目') {
             
            this.modalDate.modalTitle = '删除标签类目';
            // this.modalDate.showModal = true
            // this.modalDate.showEdit = true
            // this.modalDate.showSon = false
            if (row.children === '') {
                this.modalDate.hasSonColumn = false;
            } else {
                this.modalDate.hasSonColumn = true;
            }
            //  this.modalDate.hasSonColumn=
        } else if (value.title === '新增子类目') {
             
            this.modalDate.modalTitle = '新增子类目';
            this.formEditColumn = {
                id: '',
                topicName: '',
            };
            this.formEditColumn.id = row.id;
        }
    }
    public labelId = '';
    public getTableDropdown(value: any, row: any) {
        //  
         
        this.labelId = row.labelId;
        if (value.title === '审核') {
             
            this.router.push({  path: 'friendCircleAudit',  query: { status: '审核' },  });
        } else if (value.title === '详情') {
             
            this.router.push({ path: 'friendCircleReadOrAdd', query: { status: '详情',parentId:'',assistantId:'' } });
            // this.router.push({ path: 'friendCircleReadOrAdd', query: { labelId: row.labelId, labelStater: row.labelStater, groupId: this.formData.topicId } });
        } else if (value.title === '编辑') {
             
            this.router.push({ path: 'friendCircleReadOrAdd', query: { status: '编辑',parentId:'',assistantId:'' } });
            // this.editFormState.labelId = row.labelId;
            // this.editFormState.labelName = row.labelName;
            // this.showEditLabelModal = true;
        } else if (value.title === '上架') {
            this.modalDate.modalTitle = '上架';
            this.modalDate.showOperateModal = true;

            this.addshelfMsg = '确认上架所选内容吗？';
             
        } else if (value.title === '下架') {
            this.modalDate.showOperateModal = true;
            this.modalDate.modalTitle = '下架';
            this.addshelfMsg = '确认下架所选内容吗？';
             
        } else if (value.title === '删除') {
            this.modalDate.showOperateModal = true;
            this.modalDate.modalTitle = '删除';
            this.addshelfMsg = '确认删除所选内容吗？';
             
        }
    }
    public getbatchdeleteLabels(list: any) {
        systemManagementApi.getbatchdeleteLabel(list, {}).then((res) => {
             
        });
    }
    public getbatchdeleteLabel(labelId: string) {
        systemManagementApi.getbatchdeleteLabel([labelId], {}).then((res) => {
             
        });
    }
    // 修改接口
    public editColumn() {
        friendCircleApi.updategrop({ groupName: this.formEditColumn.topicName, id: this.formEditColumn.id }, {}).then((res) => {
             
            const { flag } = res;
            if (flag === 'success') {
                message.success('修改标签类目成功');
                this.modalDate.showModal = false;
                this.init();
                this.getFolderList();
            } else {
                message.error('修改标签类目失败');
            }
        });
    }
    public deleteColumn() {
         

        friendCircleApi.deletegrop({ id: this.formEditColumn.id }, {}).then((res) => {
            const { flag } = res;
            if (flag === 'success') {
                message.success('删除标签类目成功');
                this.modalDate.showModal = false;
                this.init();
                this.getFolderList();
            } else {
                message.error('删除标签类目失败');
            }
        });
    }
    public hasList: any[] = [];
    public editAddSonColumn() {
        //  
        // this.formEditColumn.topicName = ''
         
        const list = this.getTreeName(this.hasList, this.formEditColumn.topicName);

        if (this.formEditColumn.topicName.trim().length) {
            if (!list) {
                friendCircleApi.addgrop({ groupName: this.formEditColumn.topicName, parentId: this.formEditColumn.id }, {}).then((res) => {
                    //  
                    const { flag, msg } = res;
                    if (flag === 'success') {
                        this.getFolderList();
                        message.success('新增子类目成功');
                    } else {
                        message.error('新增子类目失败');
                    }
                    this.formAddColumn.topicName = '';
                    this.modalDate.showModal = false;
                    this.init();
                });
            } else {
                message.error('类目名称重复，添加失败');
            }
        } else {
            message.error('类目名称不能为空');

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
    public addshelfMsg = '';

    // 批量上架
    public shelf() {
        // 先进行数据筛选
        this.handlerselectedRow();
         

        const flag = this.selectedRow.some((item, index) => {
            return item.labelStater === '待审核' || item.labelStater === '退回修改' || item.labelStater === '已上架';
        });
         
        if (this.state.selectedRowKeys.length) {
            if (flag) {
                this.addshelfMsg = '请先去掉勾选待审核/退回修改/已上架标签';
                this.modalDate.handleOk = false;
            } else {
                this.addshelfMsg = '确认上架所选标签吗？';
                this.modalDate.handleOk = true;
            }
        } else {
            this.addshelfMsg = '请先勾选需要上架的标签';
            this.modalDate.handleOk = false;
        }
        this.modalDate.showOperateModal = true;
        this.modalDate.modalTitle = '批量上架';
    }
    public changeLabel() {
        //  
        this;
    }
    // 批量删除
    public delContent() {
         

        this.handlerselectedRow();
        const flag = this.selectedRow.some((item, index) => {
            return item.labelStater === '已上架';
        });
        // this.selectedRow.forEach(item => {
        //   if (item.labelStater === '已上架') {
        //     this.flag = true
        //   } else {
        //     this.flag = false
        //   }
        // })
        if (this.state.selectedRowKeys.length) {
            if (flag) {
                this.addshelfMsg = '已上架标签不可删除，如需删除，请先下架。';
                this.modalDate.handleOk = false;
            } else {
                this.addshelfMsg = '请确认是否删除所选标签？';
                this.modalDate.handleOk = true;
            }
        } else {
            this.addshelfMsg = '请先勾选需要删除的标签';
            this.modalDate.handleOk = false;
        }
        this.modalDate.showOperateModal = true;
        this.modalDate.modalTitle = '批量删除';
    }

    // public addson(value) {
    //    
    //   contentApi.addFolderTopic({ topicName: value.topicName, parentId: value.parentId }).then(res => {
    //      
    //     const { flag, msg } = res
    //     if (flag === 'success') {
    //       this.getFolderList()
    //       this.closeMyModal = false
    //     }
    //   })
    // }
    //用户列表上一页、下一页
    public handleTableChange(pagination: PaginationType) {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getCententList();
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

        >button {
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
