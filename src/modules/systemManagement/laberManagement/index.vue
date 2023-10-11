<template>
  <div>
    <ChangeLeftFolder :folderwightSpan="modalDate.folderwightSpan" :ontentWightSpan="modalDate.ontentWightSpan"
      folderName="全部标签" :menuListTiTle="menuListTiTle" menuTableList="menuTableList" @getDropdown="getDropdown"
      @addColumn="addColumn" :folderList="folderList" @allfolder="allfolder" @getsearchkey="getsearchkey"
      :closeMyModal="closeMyModal">
      <!-- <template #tabbar>
                <div class="content-right-tab">
                    <div class="content-right-tab-list">
                        <div v-for="item in titleList" :key="item.mark" :class="{ choose: titleIndex === item.index }"
                            class="content-right-tab-item" @click="chooseTitle(item)">
                            {{ item.name }}({{ item.number }})
                        </div>
                    </div>
                </div>
            </template> -->
      <template #content>
        <div class="content-right-content">
          <div class="content-right-content-top">
            <!-- <div @click="changeleft" class="content-right-content-left">
              <img src="../../../modules/assets/内容管理-列表_slices/icon_indent.png">
            </div> -->
            <div class="content-right-content-right">
              <topButtonGroup :isMore="true" :chooseTitleInfo="chooseTitleInfo" @blurInput="blurInput"
                :titleList="titleList" @addContent="addContent" @getTitle="getTitle" @chooseOperate="chooseOperate"
                @filtrate="filtrate" :changeMoreData="changeMoreData">
              </topButtonGroup>
            </div>
          </div>

          <!-- <div class="content-right-content-form">
                        <a-form :model="formData" :label-col="labelCol" labelAlign="left">
                            <a-row :gutter="24">
                                
                                <a-col class="gutter-row" :span="12">
                                    <div class="gutter-box">
                                        <a-form-item label="标签名称:">
                                            <a-input v-model:value="formData.labelName" />
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="12">
                                    <div class="gutter-box">
                                        <a-form-item label="标签状态:">
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
                    </div> -->
          <div class="content-right-content-tablebox">

            <div class="content-right-content-table">
              <a-table :pagination="false" :row-key="(record: any) => record.labelId"
                :row-selection="isRowSelected === true ? { onSelect: onSelect, selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange } : ''"
                :columns="columns" :data-source="dataSource" :scroll="{ x: 1500, y: 475 }" @change="handleTableChange">
                <template #labelName="{ record }">

                  <a-tooltip placement="topLeft">
                    <template #title>{{ record.labelName }}</template>
                    <a-button type="link" @click="getTableDropdown({title:'详情'},record)">
                      {{ record.labelName.length > 15 ? record.labelName.slice(0,15) + '...' : record.labelName}}
                    </a-button>
                  </a-tooltip>
                </template>
                <template #action="{ record }">
                  <ChangeDropdown @getDropdown="getTableDropdown" :row="record" :menuList="record.menuTableList"
                    :showTableActive="showTableActive">
                  </ChangeDropdown>
                </template>
              </a-table>
              <div class="laberManagement_page_content">
                <a-pagination
                :show-total="(total:any) => `共 ${pagination.total} 条`"
                v-model:pageSize="pagination.pageSize"
                v-model:current="pagination.current"
                show-quick-jumper
                :total="pagination.total"
                @change="handleTableChange($event)" />
              </div>
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
              <a-input showCount :maxlength="10" placeholder="请输入类目名称" v-model:value="formEditColumn.topicName"></a-input>
            </a-form-item>
            <!-- 删除栏目-->
            <div v-if="modalDate.modalTitle === '删除标签类目'">
              <div v-if="!modalDate.hasSonColumn">确认删除所选栏目吗？</div>
              <div v-else>将删除该栏目及其名下的所有子栏目，确认删除吗？</div>
            </div>
            <!-- 添加子栏目-->
            <a-form-item v-if="modalDate.modalTitle === '新增子类目'" ref="input" label="类目名称">
              <a-input showCount :maxlength="10" placeholder="请输入类目名称" v-model:value="formEditColumn.topicName"></a-input>
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
      <a-modal v-if="showaddLabelModal" class="add-tag-modal" v-model:visible="showaddLabelModal" centered title="新增标签"
        @ok="addLabel()" @cancel="showaddLabelModal = false" :getContainer="() => $refs.mountModal">
        <div class="add-tag-modal-label">标签名称</div>
        <a-form :model="addFormState" ref="addForm">
          <a-form-item name="labelName" :rules="[{ required: true, message: '标签名称不能为空', trigger: 'blur' }]">
            <a-input v-model:value="addFormState.labelName" showCount :maxlength="10" placeholder="请输入标签名称" />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 编辑标签 -->
      <a-modal v-if="showEditLabelModal" class="add-tag-modal" v-model:visible="showEditLabelModal" centered title="编辑标签"
        @ok="editLabel()" @cancel="showEditLabelModal = false" :getContainer="() => $refs.mountModal">
        <div class="add-tag-modal-label">标签名称</div>
        <a-form :model="editFormState" ref="editForm">
          <a-form-item name="labelName" :rules="[{ required: true, message: '标签名称不能为空', trigger: 'blur' }]">
            <a-input v-model:value="editFormState.labelName" showCount :maxlength="10" placeholder="请输入标签名称" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <a-drawer placement="right" :closable="false" v-model:visible="showfiltrateDrawer" :width="720"
      @close="filtrateDrawerClose">
      <template #title>
        <div class="ScreeningCondition_laberManagement_title">
          <div style="display: flex;justify-content: center;align-items: center;">
            <img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/addLeft.png" alt="">
            <span style="font-size: 16px;">筛选条件</span>
          </div>
          <a-button class="ScreeningCondition_title_btn" @click="filtrateDrawerClose">
            <img style="width: 15px;height: 10px;" src="../../../modules/assets/addBack.png" alt="">
          </a-button>
        </div>
      </template>
      <div class="content-right-content-form">
        <formList :formDataList="formDataList" @changeTimeFn="changeTimeFn"></formList>
        <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
          <button class="solidColor" @click="onSubmit">查询</button>
          <button class="ghostGrey" style="margin-left: 5%" @click="reset">重置</button>
        </a-form-item>
        <!-- <a-form :model="formData" :label-col="labelCol" labelAlign="left">
                    <a-row :gutter="24">
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <a-form-item label="标签名称:">
                                    <a-input v-model:value="formData.labelName" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col class="gutter-row" :span="12">
                            <div class="gutter-box">
                                <a-form-item label="标签状态:">
                                    <a-select @change="changeLabel" v-model:value="formData.labelStart" placeholder="默认第一项">
                                        <a-select-option v-for="item in lableStateList" :key="item"
                                            :value="item.itemCode">{{ item.itemName }}</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
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
                </a-form> -->
      </div>
    </a-drawer>
    <!-- 查看内容详情弹窗 -->
		<a-drawer
			v-model:visible="showLabelDetail"
			class="custom-class"
			placement="right"
			width="1000"
			:closable="false"
		>
    <template #title>
        <div class="ScreeningCondition_laberManagement_title">
          <div style="display: flex;justify-content: center;align-items: center;">
            <img style="width:20px;height:20px;margin-right: 16px;" src="@/modules/assets/addLeft.png" alt="">
            <span style="font-size: 16px;">标签详情</span>
          </div>
          <a-button class="ScreeningCondition_title_btn" @click="cancleShow">
            <img style="width: 15px;height: 10px;" src="@/modules/assets/addBack.png" alt="">
          </a-button>
        </div>
      </template>
      <titleOperateCheck
        :showLabelDetail="showLabelDetail"
        :labelId="showLabelId"
        :labelStater="showlabelStater"
        :labelAuitId="labelAuitId"
        :groupId="states.getFolderLeft.folderLeftInfo.id"
        @cancleShow="cancleShow"
      />
		</a-drawer>
  </div>
</template>

<script lang="ts">
import formList from '@/modules/components/formList.vue';
import topButtonGroup from '@/modules/components/topButtonGroup.vue';
import { baseApi, Header, ResponseData } from '@/libs/BaseApi';
import { AxiosRequestHeaders } from 'axios';
import { contentApi, systemManagementApi } from '@/libs/api';
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import addShelf from '@/modules/components/addShelf.vue';
import { Options, Vue } from 'vue-class-component';
import ChangeLeftFolder from '@/modules/components/changeLeftFolder.vue';
import changeMore from '@/modules/components/changeMore.vue';
import ChangeDropdown from '@/modules/components/changeDropdown.vue';
import zmwModal from '@/modules/components/zmwModal.vue';
import { useRouter } from 'vue-router';
import { Watch } from 'vue-property-decorator';
import { FormInstance, message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ColumnProps } from 'ant-design-vue/es/table';
import store from '@/modules/conTent/store';
import { BookFilledIconType } from '@ant-design/icons-vue/lib/icons/BookFilled';
import { number } from '@intlify/core-base';
import dayjs from 'dayjs';
import { Ref } from 'vue-property-decorator';
import { createVNode } from 'vue';
import titleOperateCheck from '../titleOperateCheck/index.vue'
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

interface titleListType {
  name: string;
  mark: string;
  index: number;
  number: any;
}
interface formDataType {
  // statPeriod: string; //	热度统计周期
  labelName: string; //	标签名称
  // labelStart: string; //	标签状态
  // startDate: string; //	开始时间
  // endDate: string; //结束时间
  // topicId: string; //分组id
  isUse: string; //	查询是否使用(0-未使用，1-已使用）
}
@Options({
  name: 'LaberManagement',
  components: {
    ChangeLeftFolder,
    ChangeDropdown,
    addShelf,
    zmwModal,
    changeMore,
    topButtonGroup, formList,
    titleOperateCheck
  },
})
export default class lableManage extends Vue {
  @Ref('addForm') readonly addForm!: FormInstance;
  created() {
    store.commit('getfolderLeftInfo', { id: '' })
    this.findDictListByCode();
    this.getFolderList();
    this.getCententList();
  }
  public flag = false;

  public router = useRouter();
  public menuTableList: any[] = [];
  public lableStateList: any[] = [{ value: '', name: '全部' }];
  public findDictListByCode() {
    contentApi.findDictListByCode({ code: 'LABEL_STATUS' }, {}).then((res) => {
      console.log('状态1', res);
      res.data.forEach((item: any, index: any) => {
        this.lableStateList.push({
          ...item,
          name: item.itemName,
          value: item.itemCode,

        });
      });
    });
  }
  // 不可选择时间
  disableStartTime(startTime: any) {
    const endTime: any = this.formDataList[3].value
    if (endTime) {
      return startTime > dayjs(endTime).endOf('day');
    }
  }
  disableEndTime(endTime: any) {
    const startTime: any = this.formDataList[2].value
    if (startTime) {
      return endTime < dayjs(startTime).startOf('day');
    }
  }
  // 新增内容
  // public addContent() {
  //   console.log('新增内容按钮');

  // }
  public showaddLabelModal = false; //是否展示新增标签的弹出框
  public showEditLabelModal = false; //是否展示编辑标签的弹出框
  // 新增内容
  public addContent() {
    if (this.states.getFolderLeft.folderLeftInfo.id === '') {
      message.warning('未选择标签分组');
    } else {
      console.log('新增内容按钮');
      //this.router.push('addContent')
      this.addFormState.labelName = '';
      this.showaddLabelModal = true;
      // this.$nextTick(() => {
      // })
    }
    // this.router.push({ path: 'addContent', query: { id: this.formData.topicId } })
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
  public formDataList = [
    { type: 2, name: '标签状态', width: '600', key: 'labelStart', value: '', selectList: this.lableStateList },
    { type: 3, name: '创建时间', width: '600', key: 'searchTime', value: [] }, //时间选择器时间 
    { type: 0, name: '开始时间', key: 'starttime', value: '' }, //开始时间 
    { type: 0, name: '结束时间', key: 'endtime', value: '' }, //结束时间 
  ]
  public changeTimeFn(startTime: any, endTime: any) {
    this.formDataList[2].value = startTime
    this.formDataList[3].value = endTime
  }
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
  public changeleft() {
    this.modalDate.showleft = !this.modalDate.showleft
    if (this.modalDate.showleft) {

      this.modalDate.folderwightSpan = 3
      this.modalDate.ontentWightSpan = 21
    } else {
      this.modalDate.folderwightSpan = 0
      this.modalDate.ontentWightSpan = 24
    }
  }
  public addLabel() {
    // 发请求 调用新增接口
    const params = {
      parentId: this.states.getFolderLeft.folderLeftInfo.id,
      // groupId: '1',
      //...this.addFormState,
      labelName: this.addFormState.labelName,
    };
    console.log('params', params);
    console.log('params', params.labelName);
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
    console.log('editLabelParams', params);
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
    showleft: true,
    folderwightSpan: 3,
    ontentWightSpan: 21,
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
    console.log('添加');
    this.modalDate.showSon = true;
  }
  public deletesonColumn() {
    console.log('删除');
    this.formAddColumn.topicName = '';
    this.modalDate.showSon = false;
  }
  public closeModal(value: any) {
    console.log('首页取消', value);
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
      // console.log('新增子类目---zmw');
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
    console.log('batchupshelfList', batchupshelfList);

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
  //   // console.log('operateType',operateType);
  //   const batchupshelfList: any[] = []
  //   if (type === '批量') {
  //     this.selectedRow.forEach((item: any) => {
  //       console.log(item);
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
  //     // console.log('批量操作', res);
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
    console.log('数据初始化');
  }
  //点击全部栏目 的逻辑
  public addFolderTopic() {
    console.log('新增栏目', this.hasList, this.formAddColumn.topicName);

    const list = this.getTreeName(this.hasList, this.formAddColumn.topicName);
    if (this.formAddColumn.topicName.trim().length) {
      if (!list) {
        contentApi.addgrop({ groupName: this.formAddColumn.topicName, parentId: this.formAddColumn.parentId }, {}).then((res) => {
          console.log('添加栏目res', res);
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
    // statPeriod: '', //	热度统计周期
    labelName: '', //	标签名称
    // labelStart: '', //	标签状态
    // startDate: '', //	开始时间
    // endDate: '', //	结束时间
    // topicId: '', //分组id
    isUse: '', //
  });

  public showTableActive = ref<boolean>(true);
  public computed() {
    console.log('');
  }
  public labelCol = { style: { width: '70px' } };
  public titleIndex = 0;
  public dataSource: any[] = [];
  public titleList: titleListType[] = [
    {
      name: '总标签',
      mark: '',
      index: 0,
      number: 0,
    },
    // {
    //   name: '已使用',
    //   index: 1,
    //   mark: '1',
    //   number: 0
    // },
    // {
    //   index: 2,
    //   name: '未使用',
    //   mark: '0',
    //   number: 0
    // }
  ];
  public isRowSelected = false
  public state = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
  }>({
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  });

  public onSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.state.selectedRowKeys = selectedRowKeys;
  };
  public onSelect(record: any, selected: any, selectedRows: any, nativeEvent: any) {
    console.log('record, selected, selectedRows, nativeEvent', record, selected, selectedRows, nativeEvent);

  }
  public chooseOperate(value: any) {
    if (value.name === '批量删除') {
      this.delContent()
    } else if (value.name === '上架') {
      this.shelf()
    }
  }

  @Watch('states.getTableIfo.tableInfo.isRowSelected')
  public changeIsRowSelected() {
    console.log('isTableRowSelected', this.states.getTableIfo.tableInfo.isRowSelected
    );

    this.isRowSelected = this.states.getTableIfo.tableInfo.isRowSelected
  }
  public selectedRow: any[] = []; //多选改变时的数据
  public handlerselectedRow() {
    console.log();
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
    systemManagementApi.qrygrop({}, {}).then((res) => {
      console.log('qrygrop.res', res);
      this.folderList = res.data;
      console.log('this.folderList', this.folderList);
      this.getnewfolderList(this.folderList, 0)
      // store.commit('getfolderLeftList', this.folderList)

      // formAddColumnList
      res.data.forEach((item: any) => {
        this.formAddColumnList.push({
          label: item.name,
          value: item.id,
        });
      });
      console.log(' this.formAddColumnList', this.formAddColumnList);
    });
  }
  public getnewfolderList(list: any, count: any) {
    list.forEach((item: any) => {
      item.click = false
      if (item.id === this.states.getFolderLeft.folderLeftInfo.id) {
        item.click = true
      }
      if (item.children) {
        item.ceng = count
        item.left = count * 10 + 26
        this.getnewfolderList(item.children, item.ceng + 1)
      } else {
        item.ceng = count
        item.left = count * 10 + 26
        return
      }
    })
    console.log(this.folderList, 'this.folderList---zmw');
  }
  // 拿到左侧文件夹数据
  // public getFolderName(value: any) {
  //     this.formData.topicId = value.id;
  //     this.getCententList();
  // }
  // 拿到搜索的数据   优化时写一个防抖
  public getsearchkey(value: any) {
    if (value) {
      // /content/labelgrop/updategrop.do
      // systemManagementApi.updategrop
      // contentApi.findTopicEoByName({ topicName: value }, {}).then(res => {
      //   console.log('res', res);
      //   this.folderList = res.data
      //   store.commit('getLeftFolderList', res.data)
      // })
      systemManagementApi.findGropByName({ groupName: value }, {}).then((res) => {
        console.log('res', res);
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
  //     console.log(res.data)
  //   })
  // }

  public getCententList() {
    const param = {
      groupId: this.states.getFolderLeft.folderLeftInfo.id, //	所属分组ID，字符串类型
      // statPeriod: this.formData.statPeriod, //	热度统计周期--- 需求变更_没了
      labelName: this.formData.labelName, //	标签名称
      labelStart: this.formDataList[0].value, //	标签状态
      startDate: this.formDataList[2].value && this.formDataList[2].value + ' 00:00:00', //	创建时间
      endDate: this.formDataList[3].value && this.formDataList[3].value + ' 23:59:59', //	创建时间
      isUse: this.formData.isUse, //查询是否使用(0-未使用，1-已使用）
      // isUse: '1',//查询是否使用(0-未使用，1-已使用）
    };
    console.log(param, 'param查询');

    const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      },
    };
    this.dataSource = [];
    systemManagementApi.qrysysLabel(param, header).then((res: any) => {
      console.log('res表格', res);
      this.titleList[0].number = res.recordsTotal;
      this.pagination.total = res.recordsTotal;
      // this.titleList[1].number = res.defmap.isUse
      // this.titleList[2].number = res.defmap.notUse
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
        // console.log(' this.dataSource', this.dataSource);
      });
    });
  }
  public chooseTitleInfo = reactive({
    name: '', index: 0, mark: ''
  })
  public getTitle(value: any) {
    this.chooseTitle(value)

  }
  public chooseTitle(item: any) {
    // this.formData.contentclassify = item.mark;
    this.chooseTitleInfo.mark = item.mark;
    this.chooseTitleInfo.index = item.index;
    // console.log('itemchooseTitle', item);
    // this.titleIndex = item.index;
    // this.formData.isUse = item.mark;
    // console.log(' this.titleIndex', this.titleIndex);
  }
  public columns = [
    {
      title: '操作',
      key: 'operation',
      // fixed: 'right',
      width: 70,
      slots: { customRender: 'action' },
    },
    { title: '标签名称', dataIndex: 'labelName', key: 'labelName', slots: { customRender: 'labelName' }, },
    // { title: '覆盖人数', width: 100, dataIndex: 'coverPeople', key: 'coverPeople', },
    // { title: '覆盖率', width: 100, dataIndex: 'coveRate', key: 'coveRate', },
    // { title: '使用次数', width: 150, dataIndex: 'filterCount', key: 'filterCount', },
    { title: '标签状态', dataIndex: 'labelStater', key: 'labelStater' },
    { title: '创建者', dataIndex: 'userName', key: 'userName' },
    { title: '创建时间', dataIndex: 'crt_date', key: 'crt_date' },

  ];
  public changeMoreData = reactive({
    addName: '新增',
    moreList: [{
      name: '批量删除',
      state: false,
      click: 'delContent',
      icon: 'PX643MtY_20230829095455519_s.png',//存到素材里的删除图标
      isRowSelected: true,//是否多选，为true需要多选，false不需要
    }, {
      name: '上架',
      state: false,
      click: 'shelf',
      icon: 'PX643MtY_20230829103310716_s.png',//存到素材里的加号图标
      isRowSelected: true,//是否多选

    }],
    showMoreButton: true,
  })
  public onSubmit() {
    console.log('submit!', this.formData);
    this.pagination.current = 1;
    this.getCententList();
    this.filtrateDrawerClose()
  }
  @Watch('states.getFolderLeft.folderLeftInfo.id')
  public changeLeftId(val: any) {
    // console.log(val, 'change-zmw');
    this.onSubmit();
    this.getnewfolderList(this.folderList, 0)
    console.log(this.folderList, 'this.folderList');

  }
  // @Watch('folderList')
  // public changeLeftList(val: any) {
  //     console.log(val, 'change-zzz');
  // }

  public reset() {
    // this.formData = reactive<formDataType>({
    //     // statPeriod: '', //	热度统计周期
    //     labelName: '', //	标签名称
    //     // labelStart: '', //	标签状态
    //     // startDate: '', //	开始时间
    //     // endDate: '', //	结束时间
    //     topicId: '', //分组id
    //     // isUse: '', //
    // });
    // store.commit('getfolderLeftInfo', { id: '' })
    this.formDataList.forEach((element: any) => {
      if (element.key === 'searchTime') {
        element.value = []
      } else {
        element.value = ''
      }
    })
    // this.formData = {
    //     labelName: '',
    //     isUse: '',
    // }
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
  public handleChange = (value: string) => {
    console.log('改变了现在是', value);
    this.titleList.forEach((item) => {
      if (item.mark == value) {
        this.titleIndex = item.index;
      }
    });
  };
  public dianji = () => {
    console.log('点击了点击了');
  };
  public showfiltrateDrawer = false
  public filtrate() {
    this.showfiltrateDrawer = !this.showfiltrateDrawer
  }
  public blurInput(value: any) {
    if (this.formData.labelName !== value) {
      this.formData.labelName = value
      this.onSubmit()
    }
  }

  public filtrateDrawerClose() {
    this.showfiltrateDrawer = false
  }
  //上架弹窗开关
  public addShelfBoolean = false;
  //上架子组件传值
  public colseShelf(val: any) {
    console.log(val);
    this.addShelfBoolean = val;
    console.log(this.addShelfBoolean, this.addShelfBoolean);
  }
  //上架
  public addShelf() {
    this.addShelfBoolean = true;
  }
  // public getFather() {
  //   console.log('新增栏目-得到父级栏目');
  //   // this.folderList.forEach(item=>{
  //   //   // this.addlanmuList.push({id:item.id,name:item.name})
  //   // })
  // }
  public closeMyModal = false;

  // public changeOkModal() {
  //   this.modalDate.showModal = false
  //   console.log('确定11', this.modalDate.showModal);

  // }
  // public changeCloseModal() {
  //   this.modalDate.showModal = false
  //   console.log('取消11', this.modalDate.showModal);

  // }
  // public modalDate = reactive({
  //   showModal: false,
  //   modalTitle: '',
  // })
  public allfolder() {
    // this.formData.topicId = '';
    store.commit('getfolderLeftInfo', { id: '' })
    this.getCententList();
  }
  public getDropdown(value: any, row: any) {
    // this.$emit('getDropdown',value, row)
    if (row.id === 'CustomLabel' && value.title === '删除标签类目') {
      message.error('自定义标签类名不可删除');
      return;
    }
    if (row.id === 'CustomLabel' && value.title === '修改标签类目') {
      message.error('自定义标签类名不可修改');
      return;
    }
    console.log('编辑', value, row);
    this.modalDate.showModal = true;
    this.modalDate.showEdit = true;
    this.modalDate.showSon = false;
    this.formEditColumn.id = row.id;
    if (value.title === '修改标签类目') {
      this.modalDate.modalTitle = '修改标签类目';
      this.formEditColumn.topicName = row.name;
      this.formEditColumn.topicName = row.name;
    } else if (value.title === '删除标签类目') {
      console.log('删除栏目', row.children);
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
      console.log('新增子类目');
      this.modalDate.modalTitle = '新增子类目';
      this.formEditColumn = {
        id: '',
        topicName: '',
      };
      this.formEditColumn.id = row.id;
    }
  }
  public labelId = '';
  public showLabelDetail: boolean = false;
  public showLabelId:string = ''
  public showlabelStater:string = ''
  public labelAuitId:string = ''
  public getTableDropdown(value: any, row: any) {
    // console.log('getTableDropdown',value,row)
    // console.log('表格编辑----zmw', value, row.labelId);
    this.labelId = row.labelId;
    if (value.title === '审核') {
      console.log('点击了审核');
      this.labelAuitId = row.labelAuitId
      this.showLabelId = row.labelId
      this.showlabelStater = row.labelStater
      this.showLabelDetail = true
      // this.router.push({
      //   path: 'titleOperateCheck',
      //   query: { labelId: row.labelId, labelStater: row.labelStater, groupId: this.states.getFolderLeft.folderLeftInfo.id, labelAuitId: row.labelAuitId },
      // });
    } else if (value.title === '详情') {
      console.log('点击了详情');
      console.log(row.labelId, 'row.labelId')
      console.log(row.labelStater, 'row.labelStater')
      console.log(this.states.getFolderLeft.folderLeftInfo.id, 'this.states.getFolderLeft.folderLeftInfo.id')
      this.showLabelId = row.labelId
      this.showlabelStater = row.labelStater
      this.showLabelDetail = true
      // this.router.push({path:'titleOperateCheck', query: { labelId: row.id }})
      // this.router.push({ path: 'titleOperateCheck', query: { labelId: row.labelId, labelStater: row.labelStater, groupId: this.states.getFolderLeft.folderLeftInfo.id } });
    } else if (value.title === '编辑') {
      console.log('点击了编辑');
      this.editFormState.labelId = row.labelId;
      this.editFormState.labelName = row.labelName;
      this.showEditLabelModal = true;
    } else if (value.title === '上架') {
      this.modalDate.modalTitle = '上架';
      this.modalDate.showOperateModal = true;

      this.addshelfMsg = '确认上架所选内容吗？';
      console.log('点击了上架');
    } else if (value.title === '下架') {
      this.modalDate.showOperateModal = true;
      this.modalDate.modalTitle = '下架';
      this.addshelfMsg = '确认下架所选内容吗？';
      console.log('点击了下架');
    } else if (value.title === '删除') {
      this.modalDate.showOperateModal = true;
      this.modalDate.modalTitle = '删除';
      this.addshelfMsg = '确认删除所选内容吗？';
      console.log('点击了删除');
    }
  }
  public cancleShow(value:boolean,type:string){
    if(type === '1'){
      this.getCententList()
    }
    this.showLabelDetail = false
  }
  public getbatchdeleteLabels(list: any) {
    systemManagementApi.getbatchdeleteLabel(list, {}).then((res) => {
      console.log('删除', res);
    });
  }
  public getbatchdeleteLabel(labelId: string) {
    systemManagementApi.getbatchdeleteLabel([labelId], {}).then((res) => {
      console.log('删除', res);
    });
  }
  // 修改接口
  public editColumn() {
    systemManagementApi.updategrop({ groupName: this.formEditColumn.topicName, id: this.formEditColumn.id }, {}).then((res) => {
      console.log('修改标签类目', res);
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
    console.log('删除标签类目', this.formEditColumn);

    systemManagementApi.deletegrop({ id: this.formEditColumn.id }, {}).then((res) => {
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
    // console.log('新增子类目---zmw', this.formEditColumn);
    // this.formEditColumn.topicName = ''
    console.log('新增子栏目', this.hasList, this.formEditColumn.topicName);
    const list = this.getTreeName(this.hasList, this.formEditColumn.topicName);

    if (this.formEditColumn.topicName.trim().length) {
      if (!list) {
        systemManagementApi.addgrop({ groupName: this.formEditColumn.topicName, parentId: this.formEditColumn.id }, {}).then((res) => {
          // console.log('新增子栏目res', res);
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
    console.log('list', list, name);
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
    console.log('this.selectedRow', this.selectedRow);

    const flag = this.selectedRow.some((item, index) => {
      return item.labelStater === '待审核' || item.labelStater === '退回修改' || item.labelStater === '已上架';
    });
    console.log('zzzzz', flag);
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
    // console.log(value, 'value');
    this;
  }
  // 批量删除
  public delContent() {
    console.log('删除内容按钮');

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
  //   console.log('新增栏目-提交栏目', value);
  //   contentApi.addFolderTopic({ topicName: value.topicName, parentId: value.parentId }).then(res => {
  //     console.log('添加栏目res', res);
  //     const { flag, msg } = res
  //     if (flag === 'success') {
  //       this.getFolderList()
  //       this.closeMyModal = false
  //     }
  //   })
  // }
  //用户列表上一页、下一页
  public handleTableChange(pagination: any) {
    this.pagination.current = pagination;
    // this.pagination.pageSize = pagination.pageSize;
    this.getCententList();
  }
}
</script>

<style lang="less">
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
  .content-right-content-top {
    // padding-left: 50%;
    display: flex;
    align-items: center;

    .content-right-content-left {
      flex: 1;

      img {
        width: 20px;
        height: 20px;
      }
    }

    .content-right-content-right {
      flex: 23;

    }

    // .content-right-content-top-changeMore {
    //     flex: 2;
    // }

    // .content-right-content-top-kong {
    //     flex: 4;
    // }

    // .content-right-content-top-filtrate {
    //     flex: 3;
    //     display: flex;

    //     .content-right-content-top-input {
    //         margin-left: 3%;
    //     }
    // }
  }

  .content-right-content-form {
    margin-top: 16px;
    background-color: #ffffff;
    // padding: 20px 30px;
  }

  .content-right-content-tablebox {
    width: 100%;
    margin-top: 16px;
    height: 100%;
    background-color: #ffffff;
    // padding: 10px 0px 0px 0px;
    .laberManagement_page_content{
      margin-top: 10px;
      width: 100%;
      height: 100%;
			background-color: #fff;
			display: flex;
			justify-content: end;
			align-items: center;
    }
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

.leftItem-name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/deep/.ant-table-pagination {
  padding-bottom: 20px;
  padding-right: 62px;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  right: 0;

  ul {
    background-color: #e8380d;
  }
}
.ScreeningCondition_laberManagement_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #EBF2F7;
  height: 40px;
  padding: 0px 16px;

  .ScreeningCondition_title_btn {
    border: solid 0px;
    width: 15px;
    height: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    background-color: #fff;
  }
}
.ScreeningCondition_laberManagement_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #EBF2F7;
  height: 40px;
  padding: 0px 16px;

  .ScreeningCondition_title_btn {
    border: solid 0px;
    width: 15px;
    height: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    background-color: #fff;
  }
}
</style>
