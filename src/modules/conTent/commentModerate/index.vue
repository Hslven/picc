<!-- :folderList="folderList" -->
<template>
  <div>
    <div class="content-right-content">
      <div class="content-right-content-top">
        <div class="content-right-content-left"></div>
        <div class="content-right-content-right">
          <topButtonGroup :isMore="false" :changeMoreData="changeMoreData" @blurInput="blurInput" @filtrate="filtrate">
          </topButtonGroup>
        </div>
      </div>
      <!-- 
      <div class="content-right-content-form">

        <a-form :model="formData" :label-col="labelCol" labelAlign="left">

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
              <div class="gutter-box">
                <a-form-item label="标题名称：">
                  <a-input v-model:value="formData.titlename" />
                </a-form-item>
              </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <div class="gutter-box">
                <a-form-item label="内容分类：">
                  <a-select @change="handleChange" v-model:value="formData.contentclassify" placeholder="默认第一项">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="t">图文</a-select-option>
                    <a-select-option value="b">海报</a-select-option>
                    <a-select-option value="pr">产品</a-select-option>
                    <a-select-option value="s">话题</a-select-option>
                    <a-select-option value="v">视频</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <div class="gutter-box">
                <a-form-item label="所属标签：">
                  <a-select v-model:value="formData.owntag" placeholder="默认第一项">
                    <a-select-option v-for="item in tagsList" :key="item" :value="item.labelId">{{ item.labelName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </a-col>

          </a-row>
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="8">
              <div class="gutter-box">
                <a-form-item label="更新时间：">
                  <a-row>
                    <a-range-picker v-model:value="formData.searchTime" format="YYYY-MM-DD" @change="searchTimeChange" />
                  </a-row>
                </a-form-item>
              </div>
            </a-col>

          </a-row>
        </a-form>
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">

          </a-col>
          <a-col class="gutter-row" :span="4">
            <button class="solidColor" @click="onSubmit">查询</button>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <button class="ghostGrey" ghost @click="reset">重置</button>
          </a-col>
          <a-col class="gutter-row" :span="8">
          </a-col>
        </a-row>
      </div> -->
      <div class="content-right-content-tablebox">

        <div class="content-right-content-table">
          <a-table :scroll="{ y: 440 }" :pagination="userTablePagination" :columns="columns" :data-source="dataSource"
            @change="handleTableChange($event)">
            <template #content="{ record }">
              <div class="table-content">
                <a-row>
                  <a-col :span="4">
                    <div class="table-content-left">
                      <div class="table-content-img" v-if="record.verticalCoverFile || record.horizontalCoverFile">
                        <img
                          :src="`/dop/iug/zuul/content/file/downloadImageOrVideo/c/${record.horizontalCoverFile || record.verticalCoverFile}`"
                          alt="">

                        <!-- horizontalCoverFile -->
                        <!-- <img :src="record.horizontalCoverFile || record.verticalCoverFile" alt=""> -->
                      </div>
                      <div v-else class="upload">待上传</div>
                    </div>
                  </a-col>
                  <a-col :span="20">
                    <div class="table-content-right">
                      <div class="table-content-content line-clamp">
                        {{ record.titleName }}

                      </div>
                      <div class="table-content-id">
                        <!-- ID:{{ record.contentId }} -->
                        <a style="color: #E8380D;margin-left: 30px;" @click="processAudit(record)">处理待审核评论>></a>
                      </div>
                    </div>
                  </a-col>
                </a-row>

              </div>
            </template>
            <template #action="{ record }">
              <div class="detial" @click="getdetail(record)">查看详情</div>
            </template>
          </a-table>
        </div>

      </div>

    </div>
    <!-- 
    <ChangeLeftFolder folderName="全部栏目" :menuListTiTle="menuListTiTle" menuTableList="menuTableList"
      @getDropdown="getDropdown" @addColumn="addColumn" :folderList="folderList" @getFolderName="getFolderName"
      @getsearchkey="getsearchkey" :closeMyModal="closeMyModal">
      <template #content>
        <div class="content-right-content">
          <div class="content-right-content-form">
            <a-form :model="formData" :label-col="labelCol" labelAlign="left">

              <a-row :gutter="16">
                <a-col class="gutter-row" :span="8">
                  <div class="gutter-box">
                    <a-form-item label="标题名称：">
                      <a-input v-model:value="formData.titlename" />
                    </a-form-item>
                  </div>
                </a-col>
                <a-col class="gutter-row" :span="8">
                  <div class="gutter-box">
                    <a-form-item label="内容分类：">
                      <a-select @change="handleChange" v-model:value="formData.contentclassify" placeholder="默认第一项">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option value="t">图文</a-select-option>
                        <a-select-option value="b">海报</a-select-option>
                        <a-select-option value="pr">产品</a-select-option>
                        <a-select-option value="s">话题</a-select-option>
                        <a-select-option value="v">视频</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-col>
                <a-col class="gutter-row" :span="8">
                  <div class="gutter-box">
                    <a-form-item label="所属标签：">
                      <a-select v-model:value="formData.owntag" placeholder="默认第一项">
                        <a-select-option v-for="item in tagsList" :key="item" :value="item.id">{{ item.name
                        }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                </a-col>

              </a-row>
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="8">
                  <div class="gutter-box">
                    <a-form-item label="更新时间：">
                      <a-row>
                        <a-col :span="11">
                          <a-date-picker v-model:value="formData.starttime" value-format="YYYY-MM-DD" size="default" />
                        </a-col>
                        <a-col :span="2">
                          <span>至</span>
                        </a-col>
                        <a-col :span="11">
                          <a-date-picker v-model:value="formData.endtime" value-format="YYYY-MM-DD" size="default" />
                        </a-col>
                      </a-row>
                    </a-form-item>
                  </div>
                </a-col>

              </a-row>
            </a-form>
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="10">

              </a-col>
              <a-col class="gutter-row" :span="2">
                <button class="solidColor" @click="onSubmit">查询</button>
              </a-col>
              <a-col class="gutter-row" :span="2">
                <button class="ghostGrey" ghost @click="reset">重置</button>
              </a-col>
              <a-col class="gutter-row" :span="10">
              </a-col>
            </a-row>
          </div>
          <div class="content-right-content-tablebox">

            <div class="content-right-content-table">
              <a-table :pagination="pagination1" :columns="columns" :data-source="dataSource">
                <template #content="{ record }">
                  <div class="table-content">
                    <a-row>
                      <a-col :span="4">
                        <div class="table-content-left">
                          <div class="table-content-img">

                            <img :src="record.horizontalCoverFile || record.verticalCoverFile" alt="">
                          </div>
                        </div>
                      </a-col>
                      <a-col :span="20">
                        <div class="table-content-right">
                          <div class="table-content-content line-clamp">
                            {{ record.titleName }}

                          </div>
                          <div class="table-content-id">
                            ID:{{ record.contentId }}
                            <a v-if="record.discussState === '待审核'" style="color: #E8380D;margin-left: 30px;"
                              @click="processAudit(record)">处理待审核评论>></a>
                          </div>
                        </div>
                      </a-col>
                    </a-row>

                  </div>
                </template>
                <template #action="{ record }">
                  <div class="detial" @click="getdetail(record)">查看详情</div>
                </template>
              </a-table>
            </div>

          </div>

        </div>
      </template>
    </ChangeLeftFolder> -->
    <!-- 全部栏目旁边的弹窗 -->
    <!-- <zmwModal @handleOkModal="handleOkModal" :showModal="modalDate.showModal" :modalTitle="modalDate.modalTitle"
      @closeModal="closeModal">
      <template #content>
        <div v-if="modalDate.showEdit">
          <a-form :model="formEditColumn">
             编辑栏目
            <a-form-item v-if="modalDate.modalTitle === '修改栏目'" ref="input" label="栏目名称">
              <a-input placeholder="请输入" v-model:value="formEditColumn.topicName"></a-input>
            </a-form-item>
            删除栏目 
            <div v-if="modalDate.modalTitle === '删除栏目'">
              <div v-if="!modalDate.hasSonColumn">确认删除所选栏目吗？</div>
              <div v-else>将删除该栏目及其名下的所有子栏目，确认删除吗？</div>
            </div>
            添加子栏目 
            <a-form-item v-if="modalDate.modalTitle === '新增子栏目'" ref="input" label="子栏目名称">
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
                
                <a-col :span="4">
                  <div class="addSonColumn" @click="addSonColumn">
                    <div class="addSonColumn-img">
                      <img src="../assets/内容管理-新增栏目_slices/icon／增加子栏目@3x.png" alt="">

                     
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
                        src="../assets/内容管理-新增栏目-新增子栏目_slices/icon／删除.png" alt="">
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
            </div>
          </a-form>
        </div>
      </template>
    </zmwModal> -->
    <a-drawer placement="right" :closable="false" v-model:visible="showDrawer" width="70%" @close="handlerCancel">
      <!-- :title="drawerTitle" -->
      <div class="drawer-header">
        <p class="drawer-header-title">{{ drawerTitle }}</p>
        <div class="drawer-header-btn">
          <a-button :disabled="!isdisable" @click="handlerPass">通过</a-button>
          <a-button :disabled="!isdisable" @click="handlerNoPass">不通过</a-button>
        </div>
      </div>
      <a-table :pagination="false" :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :columns="drawerColumns" :data-source="drawerDataSource">
        <template #AuditConclusion="{ record }">
          <!-- 审核结论 -->
          <a-radio-group v-model:value="record.auditconclusion">
            <a-radio value="2">通过</a-radio>
            <a-radio value="3">不通过</a-radio>
          </a-radio-group>
        </template>
        <!-- 审核意见 -->
        <template #AuditOpinion="{ record }">
          <a-input v-model:value="record.auditopinion" type="textarea" />
        </template>
        <!-- 回复评论 -->
        <template #ReplyComments="{ record }">
          <a-input v-model:value="record.replyComments" type="textarea" />
        </template>
      </a-table>
      <!-- <a-spin v-if="loadingMore" />
                                              <a-button v-else @click="loadMore">查看更多评论</a-button> -->
      <div class="bottom">
        <div @click="loadMore" class="more" v-if="recordsTotal == 0 || recordsTotal > drawerDataSource.length">查看更多评论
        </div>
        <div class="submit">
          <a-button style="margin-right: 5px;" class="ghostColor" @click="handlerCancel">取消</a-button>
          <a-button style="margin-left: 5px;" class="solidColor" :disabled="!isdisable"
            @click="handlerSubmit">提交</a-button>
        </div>
      </div>
    </a-drawer>
    <div v-if="addShelfBoolean == true">
      <add-shelf @colseShelf="colseShelf" />
    </div>
    <a-drawer placement="right" :closable="false" v-model:visible="showfiltrateDrawer" :width="720"
      @close="filtrateDrawerClose">
      <template #title>
        <div class="ScreeningCondition_title">
          <div>
            <span style="font-size: 16px;">筛选条件</span>
          </div>
          <a-button class="ScreeningCondition_title_btn" @click="cancleDetailContent">
            <img style="width: 15px;height: 10px;" src="../../../modules/assets/addBack.png" alt="">
          </a-button>
        </div>
      </template>
      <formList :formDataList="formDataList" @changeTimeFn="changeTimeFn"></formList>
      <template #footer>
				<div style="display: flex;justify-content: end;align-items: center;height: 78px;">
					<a-button style="width:76px;border-radius: 4px;height: 40px;margin-right: 20px;" @click="onSubmit">查询</a-button>
					<a-button type="primary" danger style="width:76px;height: 40px;border-radius: 4px;"
						@click="reset">重置</a-button>
				</div>
			</template>
    </a-drawer>
    <a-drawer v-model:visible="showContentDetail" class="custom-class" placement="right" width="1000">
      <template #title>
        <div class="ScreeningCondition_title">
          <div>
            <span style="font-size: 16px;">内容详情</span>
          </div>
          <a-button class="ScreeningCondition_title_btn" @click="cancleDetailContent">
            <img style="width: 15px;height: 10px;" src="../../../modules/assets/addBack.png" alt="">
          </a-button>
        </div>
      </template>
      <contentDetail :showContentDetail="showContentDetail" :detailFlag="detailFlag" :detailContentId="detailContentId"
        @cancleDetailContent="cancleDetailContent" />
    </a-drawer>
  </div>
</template>
 
<script lang="ts">
import topButtonGroup from '@/modules/components/topButtonGroup.vue';
import formList from '@/modules/components/formList.vue';
import { contentApi } from '@/libs/api'
import { AxiosRequestHeaders } from 'axios';
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import addShelf from '../../conTent/contentManage/components/addShelf.vue'
import { Options, Vue } from 'vue-class-component'
import ChangeLeftFolder from '@/modules/components/changeLeftFolder.vue'
import ChangeDropdown from '@/modules/components/changeDropdown.vue'
import zmwModal from '@/modules/components/zmwModal.vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';
import { ColumnProps, } from 'ant-design-vue/es/table';
import store from '@/modules/conTent/store';
import contentDetail from '../contentDetail/index.vue'
import { BookFilledIconType } from '@ant-design/icons-vue/lib/icons/BookFilled';

import { Moment } from 'moment';
type Key = ColumnProps['key'];

interface formDataType {
  topicId: string,//栏目Id
  titlename: string,//标题名称
  contentclassify: string,//内容分类
  owntag: string,//所属标签
  starttime: string,//开始时间
  endtime: string,//结束时间
  searchTime: string[], // 时间选择器时间
}
interface drawerDataSourceType {
  key: Key;
  serno: string,
  discussWord: string,
  auditconclusion: string;
  auditopinion: string;
  replyComments: string;
  discussId: string;
}
interface PaginationType {
  current: number;
  total: number;
  pageSize: number;
  showSizeChanger: boolean;
  pageSizeOptions: string[];
  showTotal: object;
}
// interface auditformDateType{
//   auditconclusion:string,
//   auditopinion:string
// }
@Options({
  components: {
    ChangeLeftFolder,
    ChangeDropdown,
    addShelf,
    zmwModal,
    topButtonGroup,
    formList,
    contentDetail
  }
})
export default class contentManage extends Vue {
  created() {
    this.getLabelTree()
    // this.findDictListByCode()
    // this.getFolderList()
    this.getCententList()
  }
  // public contentId = '';
  public showContentDetail: boolean = false
  public detailFlag: string = ''
  public detailContentId: string = ''
  //取消内容详情
  public cancleDetailContent(value: boolean) {
    this.showContentDetail = false
  }
  public router = useRouter()
  public changeMoreData = reactive({

    showMoreButton: true,
  })
  public blurInput(value: any) {
    if (this.formData.titlename !== value) {
        this.formData.titlename = value
        this.onSubmit()
    }
  }
  public showfiltrateDrawer = false
  public filtrate() {
    this.showfiltrateDrawer = !this.showfiltrateDrawer
  }
  public filtrateDrawerClose() {
    this.showfiltrateDrawer = false
  }
  public reset() {
    // this.formData = reactive<formDataType>({
    //   topicId: '',//栏目Id
    //   contentclassify: '',//内容分类
    //   owntag: '',//所属标签
    //   titlename: '',//标题名称
    //   starttime: '',//开始时间
    //   endtime: '',//结束时间
    //   searchTime: [], // 时间选择器时间
    // })
    this.formDataList.forEach((element: any) => {
      if (element.key === 'searchTime') {
        element.value = []
      } else {
        element.value = ''
      }
    })
    this.dataSource = []
    this.pagination1 = {
      defaultCurrent: 1, // 默认当前页数
      defaultPageSize: 10, // 默认当前页显示数据的大小
      total: 0, // 总数，必须先有
      showSizeChanger: true,
      // showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条`, // 显示总
      pageSizeOptions: ['5', '10', '15', '20'],
    }
    this.userTablePagination.current = 1;
    this.userTablePagination.pageSize = 10;
    this.getCententList();
  }
  public drawerTitle = ''
  public showDrawer = false
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
    '修改栏目',
    '删除栏目',
    '新增子栏目',
  ]
  public modalDate = reactive({
    showModal: false,
    modalTitle: '',
    showSon: false,//展示新增子栏目
    showEdit: false,//右键点击时的内容
    hasSonColumn: false,//右键的删除时是否有子节点
  })
  public rules = {
    parentId: [
      { required: true, message: '请输入栏目', trigger: 'blur' },
    ]
  }
  public formAddColumnList: any[] = [{ label: '全部', value: '' }]
  public conTentTypeList: any[] = [{ label: '全部', value: '' }]
  public findDictListByCode() {
    contentApi.findDictListByCode({ code: 'CONTENT_TYPE' }, {}).then(res => {

      // res.data.forEach(item:any=>{
      //   this.conTentTypeList.push({
      //     value :item.itemCode,
      //     label:item.itemName
      //   })
      // })
      res.data.forEach((item: any, index) => {
        this.conTentTypeList.push({
          value: item.itemCode,
          label: item.itemName
        })
      })
    })
  }

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
  public closeModal(value: any) {

    this.modalDate.showModal = value
  }
  // public handleOkModal() {
  //   if (this.modalDate.modalTitle === '修改栏目') {
  //     this.editColumn()
  //   } else if (this.modalDate.modalTitle === '删除栏目') {
  //     this.deleteColumn()
  //   } else if (this.modalDate.modalTitle === '新增子栏目') {
  //     this.editAddSonColumn()
  //   } else {
  //     this.addFolderTopic()
  //   }

  // }
  //点击全部栏目 的逻辑
  // public addFolderTopic() {
  //   contentApi.addFolderTopic({ topicName: this.formAddColumn.topicName, parentId: this.formAddColumn.parentId }, {}).then(res => {
  //      
  //     const { flag, msg } = res
  //     if (flag === 'success') {
  //       this.getFolderList()
  //       message.success('添加成功');
  //       this.modalDate.showModal = false
  //       this.init()

  //     } else {
  //       message.success('添加失败');
  //     }
  //   })
  // }
  public getdetail(row: any) {
    this.showContentDetail = true
      // this.detailFlag = '1'
      this.detailContentId = row.contentId
    // this.router.push({ path: 'contentDetail', query: { contentId: row.contentId } })

  }
  // 弹框end
  // 处理待审核
  public contentId = ''
  public recordsTotal = 0
  //分页
  public userTablePagination: PaginationType = {
    current: 1, //当前页数
    total: 0, //数据总数
    pageSize: 10, //每页中显示10条数据  每页条数
    //showLessItems   //是否显示较少页面内容
    //showQuickJumper  //是否可以快速跳转至某页
    //是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15', '20'], //每页中显示的数据 指定每页可以显示多少条
    showTotal: (total: number) => `共 ${total} 条`,//分页中显示总的数据 用于显示数据总量和当前数据顺序
  };
  public processAudit(value: any) {

    this.showDrawer = true
    this.contentId = value
    this.getWaitAuditDiscussList(this.contentId, 1)
  }

  public getWaitAuditDiscussList(value: any, nowPage: any) {
    this.loadingMore = true
    const param = {
      contentId: value.contentId
    }
    const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = nowPage;
        header.row4Page = 50;
      }
    }
    if (this.recordsTotal == 0 || this.recordsTotal > this.drawerDataSource.length) {
      contentApi.getWaitAuditDiscussList(param, header).then((res: any) => {

        this.recordsTotal = res.recordsTotal
        this.drawerTitle = '待审核评论列表' + '(' + res.recordsTotal + '条)'
        // this.drawerDataSource = res.data
        res.data.forEach((item: any, index: number) => {
          this.drawerDataSource.push(
            {
              key: item.rn - 1,
              serno: item.serno,
              discussWord: item.discussWord,
              auditconclusion: '',
              auditopinion: '',
              replyComments: '',
              discussId: item.discussId,
            }
          )
        })

      })
    }

    this.loadingMore = false
  }
  public tagsList: any[] = [{ name: '全部', value: '' }]
  public formData = reactive<formDataType>({
    topicId: '',//栏目Id
    contentclassify: '',//内容分类
    owntag: '',//所属标签
    titlename: '',//标题名称
    starttime: '',//开始时间
    endtime: '',//结束时间
    searchTime: [], // 时间选择器时间
  })
  public searchTimeChange = (value: Moment[], dateString: string[]) => {
    this.formData.starttime = dateString[0]
    this.formData.endtime = dateString[1]
  };
  public pagination1 = {
    defaultCurrent: 1, // 默认当前页数
    defaultPageSize: 10, // 默认当前页显示数据的大小
    total: 0, // 总数，必须先有
    showSizeChanger: true,
    // showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`, // 显示总
    pageSizeOptions: ['5', '10', '15', '20'],
  }

  public labelCol = { style: { width: '70px' } }
  public dataSource: any[] = [];
  public drawerDataSource: drawerDataSourceType[] = [];

  // 待审核数据表格多选
  public state = reactive<{
    selectedRowKeys: Key[];
    loading: boolean;
  }>({
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  });
  // 待审核数据表格多选
  public onSelectChange = (selectedRowKeys: Key[]) => {

    this.state.selectedRowKeys = selectedRowKeys;
  };
  public selectedRow: any[] = []//多选改变时的数据

  public handlerselectedRow() {
    this.state.selectedRowKeys.forEach((item: any) => {
      this.selectedRow.push(this.drawerDataSource[item])
    })

    // this.selectedRow=[]
  }
  // 通过/不通过按钮是否禁用
  public isdisable = computed(() => this.state.selectedRowKeys.length > 0);
  // public selectedRow = computed(() => this.state.selectedRowKeys.length > 0);
  // public start = () => {
  //   this.state.loading = true;
  //   // ajax request after empty completing
  //   setTimeout(() => {
  //     this.state.loading = false;
  //     this.state.selectedRowKeys = [];
  //   }, 1000);
  // };
  // public states:any = store.state
  public folderList: any[] = []

  public states: any = store.state
  // public getLabelTree() {
  //   contentApi.qrysysLabel({ id: '' }, {}).then(res => {
  //      
  //     this.tagsList.push(...res.data)
  //   })
  // }
  public lablerow4Page: number = 50

  public getLabelTree() {
    const params = {
      id: '',
      labelStart: "5"
    };
    const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = '1';
        header.row4Page = this.lablerow4Page;
      },
    };

    contentApi.qrysysLabel(params, header).then((res: any) => {
      const { recordsTotal, flag } = res
      if (this.lablerow4Page < recordsTotal) {
        this.lablerow4Page = recordsTotal
        contentApi.qrysysLabel(params, header).then((res: any) => {
          res.data.forEach((element: any) => {
            this.tagsList.push({
              name: element.labelName,
              value: element.labelId
            });

          })
        })
      } else {
        res.data.forEach((element: any) => {
          this.tagsList.push({
            name: element.labelName,
            value: element.labelId
          });

        })
      }
    });
  }
  // public getFolderList() {
  //   contentApi.getFolderTopic({ id: '' }, {}).then((res) => {
  //     this.folderList = res.data
  //      

  //     // formAddColumnList
  //     res.data.forEach((item: any) => {
  //       this.formAddColumnList.push({
  //         label: item.name,
  //         value: item.id
  //       })
  //     })
  //      
  //   });


  // }
  // 拿到左侧文件夹数据
  public getFolderName(value: any) {

    this.formData.topicId = value.id
  }
  // 拿到搜索的数据   优化时写一个防抖
  // public getsearchkey(value: any) {
  //   if (value) {
  //     contentApi.findTopicEoByName({ topicName: value }, {}).then(res => {
  //        
  //       this.folderList = res.data
  //       store.commit('getLeftFolderList', res.data)

  //     })
  //   } else {
  //     this.getFolderList()
  //   }
  // }
  // public audittotal = 0
  public auditTotal = 0
  // 测试引流
  public getCententList() {
    const param = {
      // topicId: this.formData.topicId,//	所属栏目ID，字符串类型
      contentType: this.formDataList[0].value,//	内容分类，t表文本，p表图片，hv表横版视频，vv表竖版视频，b表海报
      labelId: this.formDataList[1].value,//	所属标签ID，字符串类型。
      titleName: this.formData.titlename,//标题名称
      startTimeStr: this.formDataList[3].value,//	创建时间开始，字符串类型，格式yyyy- MM - dd
      endTimeStr: this.formDataList[4].value,//	创建时间截止，字符串类型，格式yyyy - MM - dd
    }
    const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.userTablePagination.current;
        header.row4Page = this.userTablePagination.pageSize;
      }
    }
    contentApi.findContentDiscussVos(param, header).then((res: any) => {

      this.userTablePagination.total = (res as any).recordsTotal;
      this.dataSource = res.data
      // this.auditTotal = res.recordsTotal  discussState
      this.dataSource.forEach((item: any) => {
        // item.discussState = (item.discussTotalNum - item.waitAuditDiscussNum) > 0 ? '待审核' : '已审核'
        if (item.subjectType === 'd') {
          item.subjectName = '话题讨论类'
        } else if (item.subjectType === 'p') {
          item.subjectName = '话题PK类'
        }
        // else if (item.contentStatus === '3') {
        //   item.discussState = '审核不通过'
        // } else if (item.contentStatus === '4') {
        //   item.discussState = '已删除'

        // } else if (item.contentStatus === '5') {
        //   item.discussState = '已上架'
        // }
      })




    })
  }

  public formDataList = reactive([

    { type: 2, name: '内容分类', width: '600', key: 'contentclassify', value: '', selectList: [{ name: '全部', value: '' }, { name: '图文', value: 't' }, { name: '海报', value: 'b' }, { name: '产品', value: 'pr' }, { name: '话题', value: 's' }, { name: '视频', value: 'v' }] }, //所属标签

    { type: 2, name: '所属标签', width: '600', key: 'owntag', value: '', selectList: this.tagsList }, //所属标签
    { type: 3, name: '更新时间', width: '600', key: 'searchTime', value: [] }, //时间选择器时间 
    { type: 0, name: '开始时间', key: 'starttime', value: '' }, //开始时间 
    { type: 0, name: '结束时间', key: 'endtime', value: '' }, //结束时间 

  ])
  // public getCententList() {

  //   const param = {

  //     topicId: this.formData.topicId,//	所属栏目ID，字符串类型
  //     contentType: this.formData.contentclassify,//	内容分类，t表文本，p表图片，hv表横版视频，vv表竖版视频，b表海报
  //     labelId: this.formData.owntag,//	所属标签ID，字符串类型。
  //     titleName: this.formData.titlename,//标题名称
  //     startTimeStr: this.formData.starttime,//	创建时间开始，字符串类型，格式yyyy- MM - dd
  //     endTimeStr: this.formData.endtime,//	创建时间截止，字符串类型，格式yyyy - MM - dd
  //   }
  //   if (this.auditTotal === 0) {
  //     const header: any = {
  //       request: (header: AxiosRequestHeaders) => {
  //         header.nowPage = '1';
  //         header.row4Page = '10';
  //       }
  //     }
  //     contentApi.findContentDiscussVos(param, header).then((res: any) => {
  //        
  //       this.auditTotal = res.recordsTotal
  //       // res.data.forEach((item: any) => {
  //       //   item.discussState = (item.discussTotalNum - item.waitAuditDiscussNum) > 0 ? '待审核' : '已审核'
  //       // })
  //       // this.dataSource = res.data
  //       //  
  //     })
  //     this.getCententList()
  //   } else{
  //     const header: any = {
  //       request: (header: AxiosRequestHeaders) => {
  //         header.nowPage = '1';
  //         header.row4Page = this.auditTotal;
  //       }
  //     }
  //     contentApi.findContentDiscussVos(param, header).then((res: any) => {
  //        
  //       // this.pagination1.total = res.recordsTotal
  //       res.data.forEach((item: any) => {
  //         item.discussState = (item.discussTotalNum - item.waitAuditDiscussNum) > 0 ? '待审核' : '已审核'
  //       })
  //       this.dataSource = res.data
  //        
  //     })
  //   }
  // }



  public columns = [
  { title: '操作', key: 'operation', slots: { customRender: 'action' }, },
    { title: '标题名称', slots: { customRender: 'content' }, width: 348, dataIndex: 'name', align: 'center', key: 'name', },
    { title: '内容分类', dataIndex: 'contentTypeName', align: 'center', key: 'contentTypeName', },
    { title: '话题类型', dataIndex: 'subjectName', align: 'center', key: 'subjectName', },
    { title: '所属标签', dataIndex: 'labelNames', align: 'center', key: 'labelNames', },
    { title: '待审核评论数', dataIndex: 'waitAuditDiscussNum', align: 'center', key: 'waitAuditDiscussNum', },
    { title: '更新时间', dataIndex: 'updateTime', align: 'center', key: 'updateTime', },
  ];
  public drawerColumns = [
    // { title: '内容', slots: { customRender: 'content' }, width: 348, dataIndex: 'name', key: 'name', },
    { title: '待审核评论', dataIndex: 'discussWord' },
    {
      title: '审核结论', key: 'operation', slots: { customRender: 'AuditConclusion' },
    },
    {
      title: '审核意见', key: 'operation', slots: { customRender: 'AuditOpinion' },
    },
    {
      title: '回复评论', key: 'operation', slots: { customRender: 'ReplyComments' },
    },
  ];
  onSubmit() {
    this.dataSource = []
    this.userTablePagination.current = 1;
    this.userTablePagination.pageSize = 10;
    this.getCententList()
  }
  public changeTimeFn(startTime: any, endTime: any) {
    this.formDataList[2].value = startTime
    this.formDataList[3].value = endTime
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
  public showTopic = false
  public handleChange = (value: string) => {


    this.formData.contentclassify = value
  };
  public dianji = () => {

  }

  //上架弹窗开关
  public addShelfBoolean = false
  //上架子组件传值
  public colseShelf(val: any) {

    this.addShelfBoolean = val

  }
  //上架
  public addShelf() {
    this.addShelfBoolean = true
  }

  public closeMyModal = false

  // 上架、删除、下架、编辑、详情
  public getTableDropdown(value: any, row: any) {

    if (value.title === '审核') {

    } else if (value.title === '详情') {


    } else if (value.title === '编辑') {


    } else if (value.title === '已上架') {

    } else if (value.title === '已下架') {


    } else if (value.title === '删除') {

    }
  }
  public handlerPass() {

    // this.handlerselectedRow()
    this.state.selectedRowKeys.forEach((item: any) => {
      this.drawerDataSource[item].auditconclusion = '2'
    })
    // this.selectedRow=[]
  }
  public handlerNoPass() {

    this.state.selectedRowKeys.forEach((item: any) => {
      this.drawerDataSource[item].auditconclusion = '3'
    })
  }
  public handlerCancel() {

    this.showDrawer = false
    this.waitAuditInit()
  }
  // 初始化待审核数据
  public waitAuditInit() {
    this.drawerDataSource = [];
    this.contentId = ''
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    }
    this.AuditDiscussnowPage = 1


  }
  public handlerSubmit() {

    this.handlerselectedRow()//auditDiscussDetailList
    this.auditDiscusSubmit(this.selectedRow)//
    // this.auditDiscussDetailList()// 批量评论审核接口
    // this.replyDiscussList()//回复多条评论
    this.selectedRow = []

  }
  // 待审核评论的提交
  public auditDiscusSubmit(selectedRowList: any) {

    const list: any[] = [];
    const check = selectedRowList.every((item: any) => item.auditconclusion)
    if (!check) {
      message.error('审核结论未填');
      return;
    };
    selectedRowList.forEach((item: any, index: any) => {
      list.push({
        id: item.discussId,
        operateType: item.auditconclusion || '',
        checkComments: item.auditopinion || ''
      })


      // if(item.auditconclusion){
      //   contentApi.auditDiscussDetail({
      //     id: item.discussId,
      //     operateType: item.auditconclusion || '',
      //     checkComments: item.auditopinion || ''
      //   }, {}).then(res => {
      //      
      //     const { flag } = res
      //     if (flag === 'success') {
      //       message.success('提交审核成功');
      //       this.showDrawer = false;
      //     } else if (flag === 'fail') {
      //       message.error('提交审核失败');
      //     }
      //   })
      // }else{
      //   message.error('审核结论未填');
      // }

      if (item.replyComments) {
        contentApi.replyDiscuss({ discussId: item.discussId, replyContent: item.replyComments }, {}).then(res => {

        })
      }
    })

    contentApi.auditDiscussDetailList({ list }, {}).then(res => {

      const { flag } = res
      if (flag === 'success') {
        message.success('提交审核成功');
        this.handlerCancel();
        this.getCententList();
      } else if (flag === 'fail') {
        message.error('提交审核失败');
      }
    })
  }
  public loadingMore = false
  public AuditDiscussnowPage = 1
  public loadMore() {
    this.AuditDiscussnowPage++
    this.getWaitAuditDiscussList(this.contentId, this.AuditDiscussnowPage)

  }
  public getDropdown(value: any, row: any) {
    // this.$emit('getDropdown',value, row)

    this.modalDate.showModal = true
    this.modalDate.showEdit = true
    this.modalDate.showSon = false
    this.formEditColumn.id = row.id
    if (value.title === '修改栏目') {
      this.modalDate.modalTitle = '修改栏目'
      this.formEditColumn.topicName = row.name
      // this.formEditColumn.id = row.id
    } else if (value.title === '删除栏目') {

      this.modalDate.modalTitle = '删除栏目'

      if (row.children === '') {
        this.modalDate.hasSonColumn = false
      } else {
        this.modalDate.hasSonColumn = true
      }
    } else if (value.title === '新增子栏目') {

      this.modalDate.modalTitle = '新增子栏目'

    }
  }
  // public editColumn() {
  //   contentApi.updateFolderTopic({ topicName: this.formEditColumn.topicName, id: this.formEditColumn.id }, {}).then(res => {
  //      
  //     const { flag } = res
  //     if (flag === 'success') {
  //       message.success('保存成功')
  //       this.modalDate.showModal = false
  //       this.init()
  //       this.getFolderList()
  //     } else {
  //       message.error('保存失败')
  //     }
  //   })
  // }
  // public deleteColumn() {
  //   contentApi.delFolderTopic({ id: this.formEditColumn.id }, {}).then(res => {
  //     const { flag } = res
  //     if (flag === 'success') {
  //       message.success('删除成功')
  //       this.modalDate.showModal = false
  //       this.init()

  //       this.getFolderList()
  //     } else {
  //       message.error('删除失败')
  //     }
  //   })
  // }
  // public editAddSonColumn() {
  //    
  //   contentApi.addFolderTopic({ topicName: this.formEditColumn.topicName, parentId: this.formEditColumn.id }, {}).then(res => {
  //      
  //     const { flag, msg } = res
  //     if (flag === 'success') {
  //       this.getFolderList()
  //       message.success('新增子栏目成功');
  //     } else {
  //       message.success('新增子栏目失败');
  //     }
  //     this.modalDate.showModal = false
  //     this.init()

  //   })
  // }

  //上一页、下一页
  public handleTableChange(value: any) {

    this.userTablePagination.current = value.current;
    this.userTablePagination.pageSize = value.pageSize;

    this.getCententList();
  }
}
</script>
 
<style lang="less">
@import '../assets/contenTbase.css';
@import '../../style/button.css';

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
.ScreeningCondition_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #EBF2F7;
  height: 20px;
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
.content-right-content {
  background-color: #f8f8f8;

  .content-right-content-top {
    // padding-left: 50%;
    padding: 6px 12px;
    background-color: #ffffff;
    display: flex;
    align-items: center;

    .content-right-content-left {
      flex: 4;
    }

    .content-right-content-right {
      flex: 3;
    }
  }

  .content-right-content-form {
    margin-top: 16px;
    background-color: #ffffff;
    padding: 20px 30px;
  }

  .content-right-content-tablebox {
    margin-top: 16px;
    background-color: #ffffff;
    padding: 4px 16px 0px 16px;

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

.bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .more {
    background-color: #EFEFEF;
    width: 100%;
    height: 34px;
    border-radius: 4px;
    color: #333333;
    font-size: 14px;
    line-height: 34px;
    text-align: center;
    margin-bottom: 34px;
    // .submit{
    //   display: flex;

    // }

  }
}

.upload {
  color: #66A1E8;
  font-size: 12px;
  flex: 1;
  margin-right: 10px;
  width: 34px;
  height: 34px;
}

.drawer-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

p.drawer-header-title {
  margin: 0;
}

.drawer-header-btn {
  :deep(.ant-btn) {
    margin-left: 10px;
  }
}

.detial {
  cursor: pointer;
}

.submit {
  margin-top: 10px;
}
</style>
