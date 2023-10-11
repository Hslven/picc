
<template>
    <div>
      <ChangeLeftFolder :menuListTiTle="menuListTiTle" @getDropdown="getDropdown" @addColumn="addColumn"
        :folderList="folderList" @getFolderName="getFolderName" @getsearchkey="getsearchkey" :closeMyModal="closeMyModal">
        <template #tabbar>
          <div class="content-right-tab">
            <div class="content-right-tab-list">
              <div v-for="item in titleList" :key="item.mark" :class="{ 'choose': titleIndex === item.index }"
                class="content-right-tab-item " @click="chooseTitle(item)">{{ item.name }}({{ item.number }})
              </div>
            </div>
          </div>
        </template>
        <template #content>
          <div class="content-right-content">
            <div class="content-right-content-form">
              <a-form :model="formData" :label-col="labelCol" labelAlign="left">
  
                <a-row :gutter="24">
  
                  <a-col class="gutter-row" :span="8">
                    <div class="gutter-box">
                      <a-form-item label="热度统计周期:">
                        <!-- 全部、7天、14天、30天、其他 -->
                        <a-select v-model:value="formData.statPeriod" placeholder="默认第一项">
                          <a-select-option value="">全部</a-select-option>
                          <a-select-option value="7">7天</a-select-option>
                          <a-select-option value="14">14天</a-select-option>
                          <a-select-option value="30">30天</a-select-option>
                          <a-select-option value="other">其他</a-select-option>
                        </a-select>
                      </a-form-item>
                    </div>
                  </a-col>
                  <a-col class="gutter-row" :span="8">
                    <div class="gutter-box">
                      <a-form-item label="标签名称:">
                        <a-input v-model:value="formData.labelName" />
                      </a-form-item>
                    </div>
                  </a-col>
                  <a-col class="gutter-row" :span="8">
                    <div class="gutter-box">
                      <a-form-item label="标签状态：">
                        <a-select v-model:value="formData.labelStart" placeholder="默认第一项">
                          <a-select-option v-for="item in lableStateList" :key="item" :value="item.itemCode">{{
                            item.itemName }}</a-select-option>
                        </a-select>
                      </a-form-item>
                    </div>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="8">
                    <div class="gutter-box">
                      <a-form-item label="起始时间:">
                        <a-row>
                          <a-col :span="11">
                            <a-date-picker v-model:value="formData.startDate" value-format="YYYY-MM-DD HH:ss:mm"
                              size="default" />
                          </a-col>
                          <a-col :span="2">
                            <div style="text-align: center;">至</div>
                          </a-col>
                          <a-col :span="11">
                            <a-date-picker v-model:value="formData.endDate" value-format="YYYY-MM-DD HH:ss:mm"
                              size="default" />
                          </a-col>
                        </a-row>
                      </a-form-item>
                    </div>
                  </a-col>
                </a-row>
                <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
                  <button class="solidColor" @click="onSubmit">查询</button>
                  <button class="ghostGrey" style="margin-left: 10px">重置</button>
                </a-form-item>
  
              </a-form>
  
            </div>
            <div class="content-right-content-tablebox">
              <div class="content-right-content-topbutton">
                <a-row>
                  <a-col :span="2"><button class="solidColor">新增内容</button></a-col>
                  <a-col :span="2"><button class="ghostGrey">上架</button></a-col>
                  <a-col :span="2"><button class="ghostColor">删除内容</button></a-col>
                </a-row>
              </div>
              <div class="content-right-content-table">
                <a-table :pagination="pagination"
                  :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :columns="columns"
                  :data-source="dataSource" :scroll="{ x: 1500, y: 300 }">
                  <template #action="{ record }">
                    <ChangeDropdown @getDropdown="getTableDropdown" :row="record" :menuList="record.menuTableList"
                      :showTableActive="showTableActive"></ChangeDropdown>
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
              <a-form-item v-if="modalDate.modalTitle === '修改标签类目'" ref="input" label="栏目名称">
                <a-input placeholder="请输入" v-model:value="formEditColumn.topicName"></a-input>
              </a-form-item>
              <!-- 删除栏目-->
              <div v-if="modalDate.modalTitle === '删除标签类目'">
                <div v-if="!modalDate.hasSonColumn">确认删除所选栏目吗？</div>
                <div v-else>将删除该栏目及其名下的所有子栏目，确认删除吗？</div>
              </div>
              <!-- 添加子栏目-->
              <a-form-item v-if="modalDate.modalTitle === '新增标签'" ref="input" label="子栏目名称">
                <a-input placeholder="请输入" v-model:value="formEditColumn.topicName"></a-input>
              </a-form-item>
            </a-form>
  
          </div>
          <div v-else>
            <a-form layout="vertical" ref="formRef" :model="formAddColumn" :rules="rules">
              <a-form-item ref="input" label="栏目名称" name="parentId">
                <a-row type="flex" align="middle" gutter="18">
                  <a-col :span="20">
                    <a-select v-model:value="formAddColumn.parentId" show-search placeholder="请输入(可新增也可下拉选择自己已有的栏目)"
                      style="width: 100%" :options="formAddColumnList">
                    </a-select>
  
                  </a-col>
                  <!-- <a-col :span="1"></a-col> -->
                  <a-col :span="4">
                    <div class="addSonColumn" @click="addSonColumn">
                      <div class="addSonColumn-img">
                        <img src="@/modules/assets/内容管理-新增栏目_slices/icon／增加子栏目@3x.png" alt="">
  
                        <!-- <img src="assets/内容管理-新增栏目_slices/icon／增加子栏目@3x.png" alt=""> -->
                      </div>
                      <div class="addSonColumn-text" label="子栏目名称" name="sonColumn">
                        子栏目
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
  
  
  
              <div v-if="modalDate.showSon">
                <a-form-item label="子栏目名称">
                  <a-row type="flex" align="middle" gutter="18">
                    <a-col :span="20">
                      <a-input placeholder="请输入(先选择'栏目名称'后，在新建其'子栏目')" v-model:value="formAddColumn.topicName"></a-input>
                    </a-col>
  
                    <a-col :span="4">
                      <div class="sonColumn" @click="deletesonColumn"><img
                          src="@/modules/assets/内容管理-新增栏目-新增子栏目_slices/icon／删除.png" alt="">
                      </div>
                    </a-col>
                  </a-row>
                </a-form-item>
              </div>
            </a-form>
          </div>
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
    </div>
  </template>
   
  <script lang="ts">
  import {baseApi, Header, ResponseData} from '@/libs/BaseApi';
  import {AxiosRequestHeaders} from 'axios';
  import { contentApi, systemManagementApi } from '@/libs/api'
  import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
  import addShelf from '@/modules/components/addShelf.vue'
  import { Options, Vue } from 'vue-class-component'
  import ChangeLeftFolder from '@/modules/components/changeLeftFolder.vue'
  import ChangeDropdown from '@/modules/components/changeDropdown.vue'
  import zmwModal from '@/modules/components/zmwModal.vue'
  
  import { message } from 'ant-design-vue';
  import { ColumnProps, } from 'ant-design-vue/es/table';
  import store from '@/modules/conTent/store';
  import { BookFilledIconType } from '@ant-design/icons-vue/lib/icons/BookFilled';
  import { number } from '@intlify/core-base';
  
  // import { Moment } from 'moment';
  type Key = ColumnProps['key'];
  
  interface titleListType {
    name: string;
    mark: string;
    index: number,
    number: any
  }
  interface formDataType {
    statPeriod: string,//	热度统计周期
    labelName: string,//	标签名称
    labelStart: string,//	标签状态
    startDate: string,//	开始时间
    endDate: string,//结束时间
    topicId: string,//分组id
    isUse: string//	查询是否使用(0-未使用，1-已使用）
  }
  @Options({
    components: {
      ChangeLeftFolder,
      ChangeDropdown,
      addShelf,
      zmwModal
    }
  })
  export default class contentManage extends Vue {
    created() {
      this.findDictListByCode()
      this.getFolderList()
      this.getCententList()
    }
    public menuTableList: any[] = []
    public lableStateList: any[] = []
    public findDictListByCode() {
      contentApi.findDictListByCode({ code: 'LABEL_STATUS' },{}).then(res => {
         
        this.lableStateList = res.data
      })
    }
    // 弹框start
    public formAddColumn = reactive({
      parentId: '',
      topicName: ''
    })
    public formEditColumn = reactive({
      id: '',
      topicName: ''
    })
    public menuListTiTle: string[] = [
      '修改标签类目',
      '删除标签类目',
      '新增标签',
    ]
    public modalDate = reactive({
      showModal: false,
      modalTitle: '',
      showSon: false,//展示新增子栏目
      showEdit: false,//右键点击时的内容
      hasSonColumn: false,//右键的删除时是否有子节点
    })
    public pagination = {
      defaultCurrent: 1, // 默认当前页数
      defaultPageSize: 10, // 默认当前页显示数据的大小
      total: 0, // 总数，必须先有
      showSizeChanger: true,
      // showQuickJumper: true,
      showTotal: (total:number) => `共 ${total} 条`, // 显示总
      pageSizeOptions: ['5', '10', '15', '20'],
    }
    public rules = {
      parentId: [
        { required: true, message: '请输入栏目', trigger: 'blur' },
      ]
    }
    public formAddColumnList: any[] = [{ label: '全部', value: '' }]
    public addColumn() {
      this.modalDate.showModal = true
      this.modalDate.showEdit = false
      this.modalDate.modalTitle = '新增栏目'
    }
    public addSonColumn() {
       
      this.modalDate.showSon = true
    }
    public deletesonColumn() {
       
      this.formAddColumn.topicName = ''
      this.modalDate.showSon = false
    }
    public closeModal(value:any) {
       
      this.modalDate.showModal = value
    }
    public handleOkModal() {
      if (this.modalDate.modalTitle === '修改标签类目') {
        this.editColumn()
      } else if (this.modalDate.modalTitle === '删除标签类目') {
        this.deleteColumn()
      } else if (this.modalDate.modalTitle === '新增标签') {
        this.editAddSonColumn()
      } else {
        this.addFolderTopic()
      }
  
    }
    //点击全部栏目 的逻辑
    public addFolderTopic() {
      contentApi.addFolderTopic({ topicName: this.formAddColumn.topicName, parentId: this.formAddColumn.parentId },{}).then(res => {
         
        const { flag, msg } = res
        if (flag === 'success') {
          this.getFolderList()
          message.success('添加成功');
          this.modalDate.showModal = false
          this.init()
  
        } else {
          message.success('添加失败');
        }
      })
    }
    // 弹框end
  
    public formData = reactive<formDataType>({
      statPeriod: '',//	热度统计周期
      labelName: '',//	标签名称
      labelStart: '',//	标签状态
      startDate: '',//	开始时间
      endDate: '',//	结束时间
      topicId: '',//分组id
      isUse: ''//
    })
  
    public showTableActive = ref<boolean>(true)
    public computed() {
       
    }
    public labelCol = { style: { width: '70px' } }
    public titleIndex = 0
    public dataSource: any[] = [];
    public titleList: titleListType[] = [
      {
        name: '总标签',
        mark: '',
        index: 0,
        number: 0
      },
      {
        name: '已使用',
        index: 1,
        mark: '1',
        number: 0
      },
      {
        index: 2,
        name: '未使用',
        mark: '0',
        number: 0
      }
    ]
  
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
    public start = () => {
      this.state.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        this.state.loading = false;
        this.state.selectedRowKeys = [];
      }, 1000);
    };
    // public states:any = store.state
    public folderList: any[] = []
    public states: any = store.state
    public getFolderList() {
  
      systemManagementApi.qrygrop({},{}).then((res) => {
        this.folderList = res.data
         
        // formAddColumnList
        res.data.forEach((item: any) => {
          this.formAddColumnList.push({
            label: item.name,
            value: item.id
          })
        })
         
      });
  
    }
    // 拿到左侧文件夹数据
    public getFolderName(value:any) {
      //  
      this.formData.topicId = value.id
    }
    // 拿到搜索的数据   优化时写一个防抖
    public getsearchkey(value:any) {
      if (value) {
        contentApi.findTopicEoByName({ topicName: value },{}).then(res => {
           
          this.folderList = res.data
          store.commit('getLeftFolderList', res.data)
        })
      } else {
        this.getFolderList()
      }
    }
    public recordsTotal = 0
    public recordsFiltered = 0
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
      // const that = this
      const param = {
        // nowPage: '1',//第几页，必传。header中参数
        // row4Page: '50',//	每页条数，必传。header中参数
        groupId: this.formData.topicId,//	所属分组ID，字符串类型
        // titleName: this.formData.titlename,//标题名称
        statPeriod: this.formData.statPeriod,//	热度统计周期
        labelName: this.formData.labelName,//	标签名称
        labelStart: this.formData.labelStart,//	标签状态
        startDate: this.formData.startDate,//	创建时间
        endDate: this.formData.endDate,//	创建时间
        isUse: this.formData.isUse,//查询是否使用(0-未使用，1-已使用）
        // isUse: '1',//查询是否使用(0-未使用，1-已使用）
      }
      
      const header: any = {
        request: (header: AxiosRequestHeaders) => {
          header.nowPage = '1';
          header.row4Page = '50';
        }
      }
      
      systemManagementApi.qrysysLabel(param,header).then((res: any) => {
         
        this.titleList[0].number = res.recordsTotal
        this.pagination.total = res.recordsTotal
        this.titleList[1].number = res.defmap.isUse
        this.titleList[2].number = res.defmap.notUse
        res.data.forEach((item: any) => {
          if (item.labelStater === '待审核') {
            item.menuTableList = [
              { title: '审核', index: 0, disabled: false },
              { title: '详情', index: 1, disabled: false },
              { title: '上架', index: 2, disabled: true },
              { title: '下架', index: 3, disabled: true },
              { title: '删除', index: 4, disabled: false },
            ]
          } else if (item.labelStater === '退回修改') {
            item.menuTableList = [
              { title: '编辑', index: 1, disabled: false },
              { title: '上架', index: 2, disabled: true },
              { title: '下架', index: 3, disabled: true },
              { title: '删除', index: 4, disabled: false },
            ]
          } else if (item.labelStater === '已上架') {
            item.menuTableList = [
              { title: '详情', index: 1, disabled: false },
              { title: '上架', index: 2, disabled: true },
              { title: '下架', index: 3, disabled: false },
              { title: '删除', index: 4, disabled: false },
            ]
          } else if (item.labelStater === '已下架') {
            item.menuTableList = [
              { title: '详情', index: 1, disabled: false },
              { title: '上架', index: 2, disabled: false },
              { title: '下架', index: 3, disabled: true },
              { title: '删除', index: 4, disabled: false },
            ]
          }
        })
        // res.data.forEach((item: any) => {
        //   // 查看数
        //   if (item.realReadNum == '') {
        //     item.realReadNum = 0
        //   }
        //   if (item.unrealReadNum == '') {
        //     item.unrealReadNum = 0
        //   }
        //   item.ReadNum = item.realReadNum + '/' + item.unrealReadNum
        //   // 分享数
        //   if (item.realShareNum == '') {
        //     item.realShareNum = 0
        //   }
        //   if (item.unrealShareNum == '') {
        //     item.unrealShareNum = 0
        //   }
        //   item.ShareNum = item.realShareNum + '/' + item.unrealShareNum
  
        //   // 点赞数
        //   if (item.realPraiseNum == '') {
        //     item.realPraiseNum = 0
        //   }
        //   if (item.unrealPraiseNum == '') {
        //     item.unrealPraiseNum = 0
        //   }
        //   item.PraiseNum = item.realPraiseNum + '/' + item.unrealPraiseNum
        //    
        // })
        this.dataSource = res.data
      })
    }
  
    public chooseTitle(item:any) {
       
      this.titleIndex = item.index
      this.formData.isUse = item.mark
       
    }
    public columns = [
      { title: '标签名称', width: 100, dataIndex: 'labelName', key: 'labelName', },
      { title: '覆盖人数', width: 100, dataIndex: 'coverPeople', key: 'coverPeople', },
      { title: '覆盖率', width: 100, dataIndex: 'coveRate', key: 'coveRate', },
      { title: '使用次数', width: 150, dataIndex: 'filterCount', key: 'filterCount', },
      { title: '标签状态', width: 150, dataIndex: 'labelStater', key: 'labelStater', },
      { title: '创建者', width: 150, dataIndex: 'creator', key: 'creator', },
      { title: '创建时间', width: 100, dataIndex: 'mkrDate', key: 'mkrDate', },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 70,
        slots: { customRender: 'action' },
      },
    ];
    onSubmit() {
       
      this.getCententList()
    }
    public init() {
      this.formEditColumn = {
        id: '',
        topicName: ''
      }
      this.formAddColumn = {
        parentId: '',
        topicName: ''
      }
    }
    public value1 = ref('')
    public options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))
    public handleChange = (value: string) => {
       
      this.titleList.forEach(item => {
        if (item.mark == value) {
          this.titleIndex = item.index
        }
      })
    };
    public dianji = () => {
       
    }
  
    //上架弹窗开关
    public addShelfBoolean = false
    //上架子组件传值
    public colseShelf(val:any) {
       
      this.addShelfBoolean = val
       
    }
    //上架
    public addShelf() {
      this.addShelfBoolean = true
    }
    // public getFather() {
    //    
    //   // this.folderList.forEach(item=>{
    //   //   // this.addlanmuList.push({id:item.id,name:item.name})
    //   // })
    // }
    public closeMyModal = false
  
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
  
    public getDropdown(value:any, row:any) {
      // this.$emit('getDropdown',value, row)
       
      this.modalDate.showModal = true
      this.modalDate.showEdit = true
      this.modalDate.showSon = false
      this.formEditColumn.id = row.id
      if (value.title === '修改标签类目') {
        this.modalDate.modalTitle = '修改标签类目'
        this.formEditColumn.topicName = row.name
      } else if (value.title === '删除标签类目') {
         
        this.modalDate.modalTitle = '删除标签类目'
        // this.modalDate.showModal = true
        // this.modalDate.showEdit = true
        // this.modalDate.showSon = false
        if (row.children === '') {
          this.modalDate.hasSonColumn = false
        } else {
          this.modalDate.hasSonColumn = true
        }
        //  this.modalDate.hasSonColumn=
      } else if (value.title === '新增标签') {
         
        this.modalDate.modalTitle = '新增标签'
        // this.modalDate.showModal = true
        // this.modalDate.showEdit = true
        // this.modalDate.showSon = false
        this.formEditColumn = {
          id: '',
          topicName: ''
        }
        this.formEditColumn.id = row.id
      }
    }
    public getTableDropdown(value:any, row:any) {
       
      if (value.title === '审核') {
         
      } else if (value.title === '详情') {
         
  
      } else if (value.title === '编辑') {
         
  
      } else if (value.title === '已上架') {
         
  
      } else if (value.title === '已下架') {
         
      }
    }
    // 修改接口
    public editColumn() {
      systemManagementApi.updategrop({ groupName: this.formEditColumn.topicName, id: this.formEditColumn.id },{}).then(res => {
         
        const { flag } = res
        if (flag === 'success') {
          message.success('保存成功')
          this.modalDate.showModal = false
          this.init()
          this.getFolderList()
        } else {
          message.error('保存失败')
        }
      })
  
    }
    public deleteColumn() {
       
  
      systemManagementApi.deletegrop({ id: this.formEditColumn.id },{}).then(res => {
        const { flag } = res
        if (flag === 'success') {
          message.success('删除成功')
          this.modalDate.showModal = false
          this.init()
          this.getFolderList()
        } else {
          message.error('删除失败')
        }
      })
    }
    public editAddSonColumn() {
       
      systemManagementApi.addgrop({ groupName: this.formEditColumn.topicName, parentId: this.formEditColumn.id },{}).then(res => {
         
        const { flag, msg } = res
        if (flag === 'success') {
          this.getFolderList()
          message.success('新增子栏目成功');
        } else {
          message.success('新增子栏目失败');
        }
        this.modalDate.showModal = false
        this.init()
  
      })
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
  }
  </script>
   
  <style lang="less" scoped>
  @import '@/modules/assets/contenTbase.css';
  @import '@/modules/style/button.css';
  
  .content-right-tab {
    height: 56px;
    padding-top: 10px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #F3C7BC;
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
        border-bottom: 2px solid #E8380D;
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
  </style>
  
  
  