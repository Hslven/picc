<!-- :folderList="folderList" -->
<template>
    <div>
        <testChangeLeftFolder :folderwightSpan="modalDate.folderwightSpan" :ontentWightSpan="modalDate.ontentWightSpan" :titleList="titleList" folderName="全部栏目"
            :menuListTiTle="menuListTiTle" menuTableList="menuTableList" @getDropdown="getDropdown" @addColumn="addColumn"
            :folderList="folderList" @getFolderName="getFolderName" @allfolder="allfolder" @getsearchkey="getsearchkey"
            :closeMyModal="closeMyModal">
            <template #tabbar>
                <div class="content-right-tab">
                    <div class="content-right-tab-list">
                        <div v-for="item in titleList" :key="item.mark" :class="{ choose: titleIndex === item.index }"
                            class="content-right-tab-item" @click="chooseTitle(item)">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </template>
            <template #content>
                <div v-if="modalDate.showleft" @click="changeleft">收起</div>
                <div v-else @click="changeleft">展开</div>

                <div class="content-right-content">
                    <button class="operation-btn" @click="">筛选</button>
                    <a-button type="primary" @click="addContent" danger class="operation-btn"
                        style="width: 120px; background: #E8380D;">新增内容</a-button>
                    <a-button danger @click="more" class="operation-btn">更多</a-button>

                    <!-- <div class="content-right-content-form">
                        <a-form :model="formData" :label-col="labelCol" labelAlign="left">
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="标题名称：">
                                            <a-input placeholder="请输入标题名称" v-model:value="formData.titlename" />
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="封面：">
                                            <a-select @change="changeLabel" v-model:value="formData.cover"
                                                placeholder="默认第一项">
                                                <a-select-option value="">全部</a-select-option>
                                                <a-select-option value="y">已上传</a-select-option>
                                                <a-select-option value="n">待上传</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="所属标签：">
                                            <a-select @change="changeLabel" v-model:value="formData.owntag"
                                                placeholder="默认第一项">
                                                <a-select-option v-for="item in tagsList" :key="item" :value="item.id">{{
                                                    item.name }}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                </a-col>

                            </a-row>
                            <a-row :gutter="16">

                                <a-col class="gutter-row" :span="8">
                                    <div class="gutter-box">
                                        <a-form-item label="内容状态：">
                                            <a-select v-model:value="formData.contentstate" placeholder="默认第一项">
                                                <a-select-option v-for="item in contentstateList" :key="item"
                                                    :value="item.value">{{ item.name }}</a-select-option>

                                            </a-select>
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col class="gutter-row" :span="16">
                                    <div class="gutter-box">
                                        <a-form-item label="创建时间:">
                                            <a-row>
                                                <a-range-picker v-model:value="formData.searchTime" format="YYYY-MM-DD"
                                                    @change="searchTimeChange" />
                                            </a-row>
                                        </a-form-item>
                                    </div>
                                </a-col>
                            </a-row>
                            <a-row :gutter="16">
                                <a-col class="gutter-row" :span="8">
                                    <div v-if="showTopic">
                                        <a-form-item label="话题类型:">
                                            <a-select v-model:value="formData.topicType" placeholder="默认第一项">
                                                <a-select-option value="">全部</a-select-option>
                                                <a-select-option value="p">PK</a-select-option>
                                                <a-select-option value="d">讨论</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </div>
                                </a-col>
                            </a-row>

                            <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
                                <button class="solidColor" @click="onSubmit">查询</button>
                                <button class="ghostGrey" style="margin-left: 5%" @click="reset">重置</button>
                            </a-form-item> 
                        </a-form>
                    </div> -->
                    <div class="content-right-content-tablebox">
                        <div class="content-right-content-topbutton">

                            <a-button type="primary" @click="addContent" danger class="operation-btn"
                                style="width: 120px; background: #E8380D;">新增内容</a-button>
                            <a-button @click="shelf" class="operation-btn">上架</a-button>
                            <a-button danger @click="delContent" class="operation-btn">批量删除</a-button>

                        </div>
                        <div class="content-right-content-table">
                            <a-table :pagination="pagination" :row-key="(record: any) => record.contentId"
                                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                                :columns="columns" :data-source="dataSource" :scroll="{ x: 1500, y: 500 }"
                                @change="handleTableChange">
                                <template #content="{ record }">
                                    <div class="table-content">
                                        <a-row>
                                            <a-col :span="4">
                                                <div class="table-content-left">
                                                    <div class="table-content-img">

                                                        <img v-if="record.horizontalCoverFile"
                                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.horizontalCoverFile"
                                                            alt="" />
                                                        <img v-else-if="record.verticalCoverFile"
                                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.verticalCoverFile"
                                                            alt="" />
                                                        <div v-else class="upload">待上传</div>
                                                    </div>
                                                </div>
                                            </a-col>
                                            <a-col :span="20">
                                                <div class="table-content-right">
                                                    <div class="table-content-content line-clamp">
                                                        {{ record.titleName }}
                                                    </div>
                                                </div>
                                            </a-col>
                                        </a-row>
                                    </div>
                                </template>
                                <template #relevance="{ record }">
                                    <view style="color: #66a1e8" @click="handlerRelevance(record)">关联内容({{
                                        record.proRelContentNum }})</view>
                                </template>
                                <template #action="{ record }">
                                    <ChangeDropdown :menuList="record.menuTableList" :showTableActive="showTableActive"
                                        @getDropdown="getTableDropdown" :row="record"></ChangeDropdown>
                                </template>
                                <template #subjectDescription="{ record }">
                                    <span v-if="record.subjectDescriptionwidth > 39">
                                        <span ref="subjectDescriptionref">{{ record.subjectDescriptionslicetext }}...</span>
                                        <span style="color: #66a1e8;"
                                            @click="seemore(record.subjectDescription)">查看更多>></span>
                                    </span>
                                    <span v-else ref="subjectDescriptionref">{{ record.subjectDescription }}</span>

                                </template>

                                <template #truthTitle="{ record }">
                                    <span v-if="record.truthTitlewidth > 39">
                                        <span>{{ record.truthTitleslicetext }}...</span>
                                        <span style="color: #66a1e8;" @click="seemore(record.truthTitle)">查看更多>></span>
                                    </span>
                                    <span v-else>{{ record.truthTitle }}</span>

                                </template>

                                <template #truthExplain="{ record }">
                                    <span v-if="record.truthExplainwidth > 39">
                                        <span>{{ record.truthExplainslicetext }}...</span>
                                        <span style="color: #66a1e8;" @click="seemore(record.truthExplain)">查看更多>></span>
                                    </span>
                                    <span v-else>{{ record.truthExplain }}</span>

                                </template>
                            </a-table>
                        </div>
                    </div>
                </div>
            </template>
        </testChangeLeftFolder>
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
                                    <!-- <a-select v-model:value="formAddColumn.parentId" show-search placeholder="请输入(可新增也可下拉选择自己已有的栏目)"
                    style="width: 100%" :options="formAddColumnList">
                                            </a-select> -->
                                    <!-- <a-input v-model:value="formAddColumn.parentId" placeholder="请输入(可新增也可下拉选择自己已有的栏目)" style="width: 100%">
                    <template #addonAfter>
                      <a-select v-model:value="formAddColumn.parentId" style="width:100px">
                        <a-select-option v-for="item in formAddColumnList" :key="item" :value="item.value">{{ item.label
                        }}</a-select-option>
                      </a-select>
                                    </template></a-input> -->
                                    <a-input showCount :maxlength="10" v-model:value="formAddColumn.topicName"></a-input>
                                </a-col>
                            </a-row>
                        </a-form-item>
                        <!-- new -->
                        <!-- <div v-for="item in addSonColumnList" :key="item">
              <a-form-item :label="item.label">
                <a-row type="flex" align="middle" gutter="18">
                  <a-col :span="20">
                    <a-input placeholder="请输入(先选择'栏目名称'后，在新建其'子栏目')" v-model:value="item.a"></a-input>
                  </a-col>
                  <a-col :span="4">
                    <div class="sonColumn" @click="deletesonColumn">
                      <img src="../assets/内容管理-新增栏目-新增子栏目_slices/icon／删除.png" alt="" />
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
                            </div> -->
                        <!-- odd -->
                        <!-- <div v-for="item in addSonColumnList" :key="item">
          <a-form-item label="子栏目名称">
                <a-row type="flex" align="middle" gutter="18">
                  <a-col :span="20">
                    <a-input placeholder="请输入(先选择'栏目名称'后，在新建其'子栏目')" v-model:value="formAddColumn.topicName"></a-input>
                  </a-col>
                  <a-col :span="4">
                    <div class="sonColumn" @click="deletesonColumn">
                      <img src="../assets/内容管理-新增栏目-新增子栏目_slices/icon／删除.png" alt=""/>
                    </div>
                  </a-col>
                </a-row>
              </a-form-item>
                                </div> -->
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
        <!-- relevance -->
        <!--  -->

        <a-drawer :title="relevanceDrawerTitle" placement="right" :closable="false" v-model:visible="relevanceShowDrawer"
            width="70%">
            <!-- form -->
            <a-form :model="formData" :label-col="labelCol" labelAlign="left">
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="12">
                        <div class="gutter-box">
                            <a-form-item label="标题名称：">
                                <a-input placeholder="请输入标题名称" v-model:value="relevanceformData.titleName" />
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="12">
                        <div class="gutter-box">
                            <a-form-item label="所属标签：">
                                <a-select @change="changeLabel" v-model:value="relevanceformData.labelId">
                                    <a-select-option v-for="item in tagsList" :key="item" :value="item.id">{{ item.name
                                    }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="12">
                        <div class="gutter-box">
                            <a-form-item label="栏目分类：">
                                <a-select @change="changeLabel" v-model:value="relevanceformData.topicId">
                                    <a-select-option v-for="item in formAddColumnList" :key="item" :value="item.value">{{
                                        item.label }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                    </a-col>
                    <a-col class="gutter-row" :span="12">
                        <div class="gutter-box">
                            <a-form-item label="更新时间：">
                                <a-row>
                                    <a-range-picker v-model:value="relevanceformData.searchTime" format="YYYY-MM-DD"
                                        @change="relevanceSearchTimeChange" />
                                </a-row>
                            </a-form-item>
                        </div>
                    </a-col>
                </a-row>

                <button class="solidColor" @click="relevanceonSubmit">查询</button>
                <button class="ghostGrey" style="margin-left: 5%" @click="relevanceReset">重置</button>
                <!-- <button class="solidColor" @click="onSubmit">查询</button>
  <button class="ghostGrey" style="margin-left: 10px" @click="reset">重置</button> -->
            </a-form>
            <a-table :pagination="false" :columns="relevanceColumns" :data-source="relevanceDataSource">
                <template #content="{ record }">
                    <div class="table-content">
                        <a-row>
                            <a-col :span="4">
                                <div class="table-content-left">
                                    <div class="table-content-img">
                                        <img v-if="record.horizontalCoverFile"
                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.horizontalCoverFile"
                                            alt="" />
                                        <img v-else-if="record.verticalCoverFile"
                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.verticalCoverFile"
                                            alt="" />
                                        <div v-else class="upload">待上传</div>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="20">
                                <div class="table-content-right">
                                    <div class="table-content-content line-clamp">
                                        {{ record.titleName }}
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </template>

                <template #action="{ record }">
                    <div class="upload" @click="godetail(record)">详情</div>
                </template>
            </a-table>
        </a-drawer>
        <onButtonModal @closeOneButtonModel="closeOneButtonModel" :showtopicModal="topicMoreData.showtopicModal"
            buttonFooter="知道了">
            <template #content>
                <div v-html="topicMoreData.msg"></div>
            </template>
        </onButtonModal>
        <!-- <div ref="modaltopic" class="zmw-modal">

            <a-modal :visible="showtopicModal" centered :getContainer="() => $refs.modaltopic">
                
                <template #footer>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;">知道了</a-button>
				</template>
            </a-modal>
        </div> -->
    </div>
</template>

<script lang="ts">
import { Modal } from 'ant-design-vue';
import { contentApi } from '@/libs/api';
import { AxiosRequestHeaders } from 'axios';
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
// import testChangeLeftFolder from './components/testChangeLeftFolder.vue'
import testChangeLeftFolder from '@/modules/components/testchangeLeftFolder.vue';
// import ChangeDropdown from './components/changeDropdown.vue'
import ChangeDropdown from '@/modules/components/changeDropdown.vue';
// import zmwModal from './components/zmwModal.vue'
import zmwModal from '@/modules/components/zmwModal.vue';
import onButtonModal from '@/modules/components/onButtonModal.vue';


import { message } from 'ant-design-vue';
import { ColumnProps } from 'ant-design-vue/es/table';
import store from '@/modules/conTent/store';
import { BookFilledIconType } from '@ant-design/icons-vue/lib/icons/BookFilled';
import { useRouter } from 'vue-router';
import MD5 from 'crypto-js/md5';
import Encrypts from '@/libs/Encrypts';
import dayjs from 'dayjs';
import { Moment } from 'moment'
type Key = ColumnProps['key'];

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
    cover: string; //封面
    contentclassify: string; //内容分类
    owntag: string; //所属标签
    contentstate: string; //内容状态
    starttime: string; //开始时间
    endtime: string; //结束时间
    topicType: string; //话题类型
    searchTime: string[]; // 时间选择器时间
}
interface relevanceformDataType {
    productCodes: string; //产品编号
    titleName: string; //标题名称
    labelId: string; //所属标签：
    topicId: string; //栏目分类：
    startUpdateTimeStr: string; //开始时间
    endUpdateTimeStr: string; //结束时间
    searchTime: string[]; // 时间选择器时间
}
interface topicMoreDataType {
    msg: string,
    showtopicModal: Boolean
}

@Options({
    components: {
        testChangeLeftFolder,
        ChangeDropdown,
        onButtonModal,
        zmwModal,
    },
})
export default class contentManage extends Vue {
    public flag: Boolean = false;
    public hasList: any[] = [];
    // public showtopicModal: Boolean = false;


    public contentstateList = [{ value: '', name: '全部' }];

    public topicMoreData = reactive<topicMoreDataType>({
        msg: "",
        showtopicModal: false

    });
    created() {
        this.queryDictListByCodes();
        this.findDictListByCode();
        this.getFolderList();
        this.getCententList();
        this.getLabelTree();
    }

    mounted(): void {
        // const subjectDescriptionref: any = this.$refs.subjectDescriptionref // TODO: better typescript support for router-link
        // console.log(subjectDescriptionref, 'subjectDescriptionref-zmw');

        // console.log(subjectDescriptionref.offsetHeight, 'subjectDescriptionref-zmw');

    }

    public rules1 = {
        topicName: [{ required: true, message: '栏目名称不能为空', trigger: 'blur', whitespace: true }],
    };
    // public rules2 = {
    // }; 

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
    public tagsList: any[] = [{ name: '全部', id: '' }];
    public getLabelTree() {
        const params = {
            id: '',
        };
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = '1';
                header.row4Page = '50';
            },
        };

        contentApi.getFolderLabel(params, header).then((res) => {
            console.log('查询标签', res);
            this.tagsList.push(...res.data);
        });
    }
    public allfolder() {
        this.formData.topicId = '';
        this.getCententList();
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
        showleft: true,
        folderwightSpan: 3,
        ontentWightSpan: 21,
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
    public formAddColumnList: any[] = [{ value: '', label: '全部' }];
    public lableStateList: any[] = [];
    public findDictListByCode() {
        contentApi.findDictListByCode({ code: 'CONTENT_TYPE' }, {}).then((res) => {
            console.log('内容类型', res);
            this.lableStateList = res.data;
        });
        // contentApi.findDictListByCode({ code: 'CONTENT_STATUS' }, {}).then(res => {
        //   console.log('内容状态', res);
        //   this.lableStateList = res.data
        // })
        // contentApi.findDictListByCode({ code: 'YES_OR_NO' }, {}).then(res => {
        //   console.log('是否可点赞', res);
        //   this.lableStateList = res.data
        // })
    }
    public queryDictListByCodes() {
        contentApi.queryDictListByCodes({ codes: 'CONTENT_STATUS' }, {}).then((res: any) => {

            console.log('queryDictListByCodes', res);

            res.data[0].dictList.forEach((item: any, index: any) => {
                this.contentstateList.push({
                    value: item.itemCode,
                    name: item.itemName,
                });
            });
            console.log(this.contentstateList, 'contentstateList');
        });
    }
    public addColumn() {
        this.modalDate.showModal = true;
        this.modalDate.showEdit = false;
        this.modalDate.modalTitle = '新增栏目';
    }
    // public addSonColumn() {
    //   console.log('添加');
    //   this.modalDate.showSon = true
    //   // this.addSonColumnList.push({ label: '子栏目名称' })
    // }
    public deletesonColumn() {
        console.log('删除');
        this.formAddColumn.topicName = '';
        // this.modalDate.showSon = false
    }
    public closeModal(value: any) {
        console.log('首页取消', value);
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
        } else if (this.modalDate.modalTitle === '上架') {
            this.modalDate.showOperateModal = false;
            this.operateContent('5');
        } else if (this.modalDate.modalTitle === '下架') {
            this.modalDate.showOperateModal = false;
            this.operateContent('6');
        } else if (this.modalDate.modalTitle === '删除') {
            this.modalDate.showOperateModal = false;
            this.operateContent('4');
        } else if (this.modalDate.modalTitle === '批量上架') {
            this.modalDate.showOperateModal = false;
            if (this.state.selectedRowKeys.length) {
                this.operateContentChoose('5');
            }
        } else if (this.modalDate.modalTitle === '批量删除') {
            this.modalDate.showOperateModal = false;
            console.log('点击了删除3');
            if (this.state.selectedRowKeys.length) {
                this.operateContentChoose('4');
            }
        } else {
            this.addFolderTopic();
        }
    }
    // 上架、下架，删除
    public operateContent(operateType: any) {
        if (!this.modalDate.handleOk && operateType === '5') return
        contentApi.operateContent({ id: this.contentId, operateType }, {}).then((res) => {
            console.log('res', res);
            const { flag } = res;
            console.log('flag', flag);
            if (flag === 'success') {
                if (operateType === '4') {
                    message.success('删除成功');
                } else if (operateType === '5') {
                    message.success('上架成功');
                } else if (operateType === '6') {
                    message.success('下架成功');
                }
            } else {
                if (operateType === '4') {
                    message.error('删除失败');
                } else if (operateType === '5') {
                    message.error('上架失败');
                } else if (operateType === '6') {
                    message.error('下架失败');
                }
            }
            this.state.selectedRowKeys = [];
            this.selectedRow = [];
            this.modalDate.showOperateModal = false;
            this.getCententList();
        });
    }
    public operateContentChoose(operateType: any) {
        if (!this.modalDate.handleOk && operateType === '5') return
        const list: any[] = [];
        this.selectedRow.forEach((item: any, index: number) => {
            list.push(item.contentId);
        });

        contentApi.operateContentList({ contentIds: list, operateType }, {}).then((res) => {
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
            // this.getCententList();
            this.state.selectedRowKeys = [];
            this.selectedRow = [];
        });
    }
    // public addSonColumnList: any[] = [
    //   { label: '新增子栏目:', a: '第一个', index: 0 },
    //   { label: '新增子栏目:', a: '第二个', index: 1 },
    // ]//添加子栏目的数组
    //点击全部栏目 的逻辑
    public addFolderTopic() {
        console.log('新增栏目', this.hasList, this.formAddColumn.topicName);

        const list = this.getTreeName(this.hasList, this.formAddColumn.topicName);

        if (!list) {
            //       console.log('可以了,调用新增函数');
            // message.success('新增栏目成功');
            contentApi.addFolderTopic({ topicName: this.formAddColumn.topicName, parentId: '' }, {}).then((res) => {
                console.log('添加栏目res', res);
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

        // contentApi.getFolderTopic({ id: '' }, {}).then((res) => {
        //   console.log('内容管理文件', res);
        //   const { flag } = res
        //   if (flag === 'success') {
        //     const list = this.getTreeName(res.data, this.formAddColumn.topicName);
        //     if (!list) {
        //       console.log('可以了,调用新增函数');
        //
        //     } else {
        //       message.error('栏目名称重复，添加失败');
        //       // this.formAddColumn.topicName=''
        //     }
        //   }

        // })
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
        cover: '', //封面
        contentclassify: 't', //内容分类
        owntag: '', //所属标签
        contentstate: '', //内容状态
        starttime: '', //开始时间
        endtime: '', //结束时间
        topicType: '', //话题类型
        searchTime: [], // 时间选择器时间
    });
    public searchTimeChange = (value: Moment[], dateString: string[]) => {
        this.formData.starttime = dateString[0]
        this.formData.endtime = dateString[1]
    };
    public relevanceSearchTimeChange = (value: Moment[], dateString: string[]) => {
        this.relevanceformData.startUpdateTimeStr = dateString[0]
        this.relevanceformData.endUpdateTimeStr = dateString[1]
    };
    public relevanceformData = reactive<relevanceformDataType>({
        titleName: '', //标题名称
        productCodes: '', //
        labelId: '', //所属标签：
        topicId: '', //栏目分类：
        startUpdateTimeStr: '', //开始时间
        endUpdateTimeStr: '', //结束时间
        searchTime: [], // 时间选择器时间
    });
    public showTableActive = ref<boolean>(true);
    public computed() {
        console.log('');
    }
    public labelCol = { style: { width: '70px' } };
    public titleIndex = 0;

    public dataSource: any[] = [];
    //内容状态
    public titleList: titleListType[] = [
        {
            name: '图文',
            mark: 't',
            index: 0,
        },
        {
            name: '海报',
            index: 1,
            mark: 'b',
        },
        {
            index: 2,
            name: '产品',
            mark: 'pr',
        },
        {
            index: 3,
            name: '话题',
            mark: 's',
        },
        {
            index: 4,
            name: '视频',
            mark: 'v',
        },
    ];

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
        console.log('selectedRowKeys changed: ', selectedRowKeys);
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
            console.log('item----- this.selectedRow', this.selectedRow);
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

    public getFolderList() {
        contentApi.getFolderTopic({ id: this.modalDate.id }, {}).then((res) => {
            this.folderList = res.data;
            console.log('内容管理文件', res.data);

            this.hasList = res.data;
            // formAddColumnList
            this.getnewfolderList(this.folderList, 0)
            res.data.forEach((item: any) => {
                this.formAddColumnList.push({
                    label: item.name,
                    value: item.id,
                });
            });
            console.log('this.folderList', this.folderList);

            console.log(' this.formAddColumnList', this.formAddColumnList);
        });
    }

    public getnewfolderList(list: any, count: any) {
        list.forEach((item: any) => {
            item.showchilderns = false
            if (item.children) {
                console.log('有孩子')
                item.ceng = count
                item.left = count * 10 + 26
                this.getnewfolderList(item.children, item.ceng + 1)
            } else {
                item.ceng = count
                item.left = count * 10 + 26
                console.log('没孩子')
                return
            }
        })
        console.log(this.folderList, 'this.folderList---zmw');
    }
    // 拿到左侧文件夹数据
    public getFolderName(value: any) {
        console.log('文件夹数据', value);
        this.formData.topicId = value.id;
        this.getCententList();
    }
    // 拿到搜索的数据   优化时写一个防抖
    public getsearchkey(value: any) {
        if (value) {
            contentApi.findTopicEoByName({ topicName: value }, {}).then((res) => {
                console.log('res', res);
                this.folderList = res.data;
                store.commit('getLeftFolderList', res.data);
            });
        } else {
            this.getFolderList();
        }
    }
    public showpic = true;

    public relevanceDrawerTitle = '关联内容';
    public relevanceShowDrawer = false;

    public relevanceDataSource: any[] = [];
    public relevanceColumns = [
        { title: '栏目分类', width: 150, dataIndex: 'topicName', key: 'topicName' },
        { title: '标题名称', slots: { customRender: 'content' }, width: 260, dataIndex: 'name', key: 'name' },

        { title: '所属标签', width: 150, dataIndex: 'labelNames', key: 'labelNames' },
        { title: '内容分类', width: 150, dataIndex: 'contentTypeName', key: 'contentTypeName' },
        { title: '操作人', width: 150, dataIndex: 'crt_user', key: 'crt_user' },
        { title: '更新时间', width: 150, dataIndex: 'updateTime', key: 'updateTime' },
        {
            title: '操作',
            key: 'action',
            slots: { customRender: 'action' },
        },
    ];
    // 关联内容详情
    public godetail(row: any) {
        console.log('关联内容详情', row, row.contentId);

        this.router.push({ path: 'contentDetail', query: { contentId: row.contentId } });
        // message.success('需要跳转，但是需求目前没有说跳转到哪个地方')
    }
    // 查询
    public relevanceonSubmit() {
        // 多选清空
        this.selectedRow = [];
        this.findRelateContentList();
    }
    // 重置
    public relevanceReset() {
        this.relevanceformData = {
            titleName: '', //标题名称
            productCodes: this.productCodes, //
            labelId: '', //所属标签：
            topicId: '', //栏目分类：
            startUpdateTimeStr: '', //开始时间
            endUpdateTimeStr: '', //结束时间
            searchTime: [], // 时间选择器时间
        };
        this.findRelateContentList();
    }
    public getCententList() {
        const param = {
            topicId: this.formData.topicId, //	所属栏目ID，字符串类型
            isUploadCover: this.formData.cover, //	封面，y表已上传，n表未上传
            titleName: this.formData.titlename, //标题名称
            contentType: this.formData.contentclassify, //	内容分类， t表图文，b表海报，pr表产品，s表话题，v表视频
            labelId: this.formData.owntag, //	所属标签ID，字符串类型。
            contentStatus: this.formData.contentstate, //	内容状态，0表暂存，1表待审核，3表审核不通过，4表已删除，5表已上架，6表已下架。字符串类型。
            startTimeStr: this.formData.starttime, //	创建时间开始，字符串类型，格式yyyy- MM - dd
            endTimeStr: this.formData.endtime, //	创建时间截止，字符串类型，格式yyyy - MM - dd
            subjectType: this.formData.topicType, //话题类型
        };
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.pagination.current;
                // console.log(header.nowPage, '---------header.nowPage-------');
                header.row4Page = this.pagination.pageSize;
            },
        };
        this.dataSource = [];
        if (this.formData.contentclassify === 's') {
            this.findSubjectContentInfos(param, header);
        } else if (this.formData.contentclassify === 'pr') {
            this.findProductContentList(param, header);
        } else {
            this.findCententVoList(param, header);
        }
    }
    // 话题
    public findSubjectContentInfos(param: any, header: any) {
        contentApi.findSubjectContentInfos(param, header).then((res: any) => {
            console.log('res表格----话题', res.data);
            res.data.forEach((item: any) => {
                // 查看数
                if (item.realReadNum == '') {
                    item.realReadNum = 0;
                }
                if (item.horizontalCoverFile || item.verticalCoverFile) {
                    item.showpic = false;
                }
                if (item.unrealReadNum == '') {
                    item.unrealReadNum = 0;
                }
                item.ReadNum = item.realReadNum + '/' + item.unrealReadNum;
                // 分享数
                if (item.realShareNum == '') {
                    item.realShareNum = 0;
                }
                if (item.unrealShareNum == '') {
                    item.unrealShareNum = 0;
                }
                item.ShareNum = item.realShareNum + '/' + item.unrealShareNum;

                // 点赞数
                if (item.realPraiseNum == '') {
                    item.realPraiseNum = 0;
                }
                if (item.unrealPraiseNum == '') {
                    item.unrealPraiseNum = 0;
                }
                item.PraiseNum = item.realPraiseNum + '/' + item.unrealPraiseNum;
                // console.log('that', that);
                // 话题描述
                if (item.subjectDescription.length) {


                    let subjectDescriptionwidth: number = 0
                    for (let char1 of item.subjectDescription) {
                        if (/^[\u4e00-\u9fa5]*$/.test(char1)) {
                            console.log('是汉字');
                            subjectDescriptionwidth = subjectDescriptionwidth + 2
                        } else {
                            console.log('是字符');
                            subjectDescriptionwidth = subjectDescriptionwidth + 1
                        }
                    }
                    let subjectDescriptionslicenumber: number = 0
                    let subjectDescriptionslicetext: string = ''
                    if (subjectDescriptionwidth > 39) {

                        for (let char2 of item.subjectDescription) {
                            if (/^[\u4e00-\u9fa5]||\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01\u3010\u3011\uffe5]*$/.test(char2)) {
                                if (subjectDescriptionslicenumber < 24) {
                                    subjectDescriptionslicenumber = subjectDescriptionslicenumber + 2
                                    subjectDescriptionslicetext = subjectDescriptionslicetext + char2
                                }
                            } else {
                                if (subjectDescriptionslicenumber < 24) {
                                    subjectDescriptionslicenumber = subjectDescriptionslicenumber + 1
                                    subjectDescriptionslicetext = subjectDescriptionslicetext + char2
                                }
                            }
                        }
                    }
                    console.log(subjectDescriptionslicetext, 'subjectDescriptionslicetext');

                    console.log(subjectDescriptionwidth, 'subjectDescriptionwidth');
                    item.subjectDescriptionwidth = subjectDescriptionwidth
                    item.subjectDescriptionslicetext = subjectDescriptionslicetext

                }

                console.log(item.truthTitle, 'item.truthTitle.length1');

                // 话题真相
                if (item.truthTitle.length) {
                    console.log(item.truthTitle, 'item.truthTitle.length2');


                    let truthTitlewidth: number = 0
                    for (let char of item.truthTitle) {
                        if (/^[\u4e00-\u9fa5]*$/.test(char)) {
                            console.log('话题真相是汉字');
                            truthTitlewidth = truthTitlewidth + 2
                        } else {
                            console.log('话题真相是字符');
                            truthTitlewidth = truthTitlewidth + 1
                        }
                    }
                    let truthTitleslicenumber: number = 0
                    let truthTitleslicetext: string = ''
                    if (truthTitlewidth > 39) {

                        for (let char of item.truthTitle) {
                            if (/^[\u4e00-\u9fa5]||\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01\u3010\u3011\uffe5]*$/.test(char)) {
                                if (truthTitleslicenumber < 24) {
                                    truthTitleslicenumber = truthTitleslicenumber + 2
                                    truthTitleslicetext = truthTitleslicetext + char
                                }
                            } else {
                                if (truthTitleslicenumber < 24) {
                                    truthTitleslicenumber = truthTitleslicenumber + 1
                                    truthTitleslicetext = truthTitleslicetext + char
                                }
                            }
                        }
                    }
                    // console.log(subjectDescriptionslicetext, 'subjectDescriptionslicetext');

                    // console.log(subjectDescriptionwidth, 'subjectDescriptionwidth');
                    item.truthTitlewidth = truthTitlewidth
                    item.truthTitleslicetext = truthTitleslicetext

                }
                // 真相描述
                if (item.truthExplain.length) {


                    let truthExplainwidth: number = 0
                    for (let char of item.truthExplain) {
                        if (/^[\u4e00-\u9fa5]*$/.test(char)) {
                            console.log('是汉字');
                            truthExplainwidth = truthExplainwidth + 2
                        } else {
                            console.log('是字符');
                            truthExplainwidth = truthExplainwidth + 1
                        }
                    }
                    let truthExplainslicenumber: number = 0
                    let truthExplainslicetext: string = ''
                    if (truthExplainwidth > 39) {

                        for (let char of item.truthExplain) {
                            if (/^[\u4e00-\u9fa5]||\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01\u3010\u3011\uffe5]*$/.test(char)) {
                                if (truthExplainslicenumber < 24) {
                                    truthExplainslicenumber = truthExplainslicenumber + 2
                                    truthExplainslicetext = truthExplainslicetext + char
                                }
                            } else {
                                if (truthExplainslicenumber < 24) {
                                    truthExplainslicenumber = truthExplainslicenumber + 1
                                    truthExplainslicetext = truthExplainslicetext + char
                                }
                            }
                        }
                    }
                    console.log(truthExplainslicetext, 'truthExplainslicetext');

                    console.log(truthExplainwidth, 'truthExplainwidth');
                    item.truthExplainwidth = truthExplainwidth
                    item.truthExplainslicetext = truthExplainslicetext

                }

                // 待审核且有权限，一期不做权限故待审核就显示
                if (item.contentStatusName === '待审核') {
                    item.menuTableList = [
                        { title: '审核', index: 0, disabled: false },
                        // { title: '详情', index: 1, disabled: false },
                        { title: '上架', index: 2, disabled: true },
                        { title: '下架', index: 3, disabled: true },
                        { title: '删除', index: 4, disabled: false },
                    ];
                } else if (item.contentStatusName === '退回修改') {
                    item.menuTableList = [
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                } else if (item.contentStatusName === '已上架') {
                    item.menuTableList = [
                        { title: '详情', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: false },
                        { title: '删除', index: 3, disabled: true },
                    ];
                } else if (item.contentStatusName === '已下架') {
                    item.menuTableList = [
                        // { title: '详情', index: 0, disabled: false },
                        { title: '编辑', index: 1, disabled: false },
                        { title: '上架', index: 2, disabled: false },
                        { title: '下架', index: 3, disabled: true },
                        { title: '删除', index: 4, disabled: false },
                    ];
                } else if (item.contentStatusName === '暂存') {
                    item.menuTableList = [
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: false },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                }
            });
            res.data.forEach((item: any, index: number) => {
                this.dataSource.push({
                    key: item.rn - 1,
                    ...item,
                });
            });
            this.pagination.total = res.recordsTotal;
            console.log('this.dataSource话题', this.dataSource);

            console.log('state.selectedRowKeys话题', this.state.selectedRowKeys);
        });
    }
    // 产品
    public findProductContentList(param: any, header: any) {
        contentApi.findProductContentList(param, header).then((res: any) => {
            console.log('res表格----产品', res.data);
            res.data.forEach((item: any) => {
                // 查看数

                if (item.realReadNum == '') {
                    item.realReadNum = 0;
                }
                if (item.horizontalCoverFile || item.verticalCoverFile) {
                    item.showpic = false;
                }
                if (item.unrealReadNum == '') {
                    item.unrealReadNum = 0;
                }
                item.ReadNum = item.realReadNum + '/' + item.unrealReadNum;
                // 分享数
                if (item.realShareNum == '') {
                    item.realShareNum = 0;
                }
                if (item.unrealShareNum == '') {
                    item.unrealShareNum = 0;
                }
                item.ShareNum = item.realShareNum + '/' + item.unrealShareNum;

                // 点赞数
                if (item.realPraiseNum == '') {
                    item.realPraiseNum = 0;
                }
                if (item.unrealPraiseNum == '') {
                    item.unrealPraiseNum = 0;
                }
                item.PraiseNum = item.realPraiseNum + '/' + item.unrealPraiseNum;
                // console.log('that', that);

                // 待审核且有权限，一期不做权限故待审核就显示
                if (item.contentStatusName === '待审核') {
                    item.menuTableList = [
                        { title: '审核', index: 0, disabled: false },
                        // { title: '详情', index: 1, disabled: false },
                        { title: '上架', index: 2, disabled: true },
                        { title: '下架', index: 3, disabled: true },
                        { title: '删除', index: 4, disabled: false },
                    ];
                } else if (item.contentStatusName === '退回修改') {
                    item.menuTableList = [
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                } else if (item.contentStatusName === '已上架') {
                    item.menuTableList = [
                        { title: '详情', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: false },
                        { title: '删除', index: 3, disabled: true },
                    ];
                } else if (item.contentStatusName === '已下架') {
                    item.menuTableList = [
                        // { title: '详情', index: 0, disabled: false },
                        { title: '编辑', index: 1, disabled: false },
                        { title: '上架', index: 2, disabled: false },
                        { title: '下架', index: 3, disabled: true },
                        { title: '删除', index: 4, disabled: false },
                    ];
                } else if (item.contentStatusName === '暂存') {
                    item.menuTableList = [
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: false },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                }
            });
            res.data.forEach((item: any, index: number) => {
                this.dataSource.push({
                    key: item.rn - 1,
                    ...item,
                });
            });
            this.pagination.total = res.recordsTotal;
            console.log('state.selectedRowKeys产品', this.state.selectedRowKeys);
        });
    }
    // 图文海报视频
    public findCententVoList(param: any, header: any) {
        contentApi.getCententList(param, header).then((res: any) => {
            console.log('res表格----图文海报视频', res.data);

            console.log('this.dataSource1', this.dataSource);
            res.data.forEach((item: any) => {
                // 查看数
                if (item.realReadNum == '') {
                    item.realReadNum = 0;
                }
                if (item.horizontalCoverFile || item.verticalCoverFile) {
                    item.showpic = false;
                }
                if (item.unrealReadNum == '') {
                    item.unrealReadNum = 0;
                }
                item.ReadNum = item.realReadNum + '/' + item.unrealReadNum;
                // 分享数
                if (item.realShareNum == '') {
                    item.realShareNum = 0;
                }
                if (item.unrealShareNum == '') {
                    item.unrealShareNum = 0;
                }
                item.ShareNum = item.realShareNum + '/' + item.unrealShareNum;

                // 点赞数
                if (item.realPraiseNum == '') {
                    item.realPraiseNum = 0;
                }
                if (item.unrealPraiseNum == '') {
                    item.unrealPraiseNum = 0;
                }
                if (item.contentStatus === '3') {
                    console.log('zmw--------');
                    item.contentStatusName = '退回修改';
                }

                item.PraiseNum = item.realPraiseNum + '/' + item.unrealPraiseNum;
                // console.log('that', that);

                // 待审核且有权限，一期不做权限故待审核就显示
                if (item.contentStatusName === '待审核') {
                    item.menuTableList = [
                        { title: '审核', index: 0, disabled: false },
                        // { title: '详情', index: 1, disabled: false },
                        { title: '上架', index: 2, disabled: true },
                        { title: '下架', index: 3, disabled: true },
                        { title: '删除', index: 4, disabled: false },
                    ];
                } else if (item.contentStatus === '3') {
                    // item.contentStatusName === '退回修改'
                    item.menuTableList = [
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                } else if (item.contentStatusName === '已上架') {
                    item.menuTableList = [
                        { title: '详情', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: true },
                        { title: '下架', index: 2, disabled: false },
                        { title: '删除', index: 3, disabled: true },
                    ];
                } else if (item.contentStatusName === '已下架') {
                    item.menuTableList = [
                        // { title: '详情', index: 0, disabled: false },
                        { title: '编辑', index: 1, disabled: false },
                        { title: '上架', index: 2, disabled: false },
                        { title: '下架', index: 3, disabled: true },
                        { title: '删除', index: 4, disabled: false },
                    ];
                } else if (item.contentStatusName === '暂存') {
                    item.menuTableList = [
                        { title: '编辑', index: 0, disabled: false },
                        { title: '上架', index: 1, disabled: false },
                        { title: '下架', index: 2, disabled: true },
                        { title: '删除', index: 3, disabled: false },
                    ];
                }
            });
            res.data.forEach((item: any, index: number) => {
                this.dataSource.push({
                    key: item.rn - 1,
                    ...item,
                });
            });
            this.pagination.total = res.recordsTotal;
        });
    }

    public chooseTitle(item: any) {
        this.formData.contentclassify = item.mark;
        this.titleIndex = item.index;
        // console.log(' this.titleIndex-------', item, this.titleIndex);

        // t表图文，b表海报，pr表产品，s表话题，v表视频
        if (item.name === '图文' || item.name === '海报' || item.name === '视频') {
            this.getCententList();
            this.showTopic = false;
            this.columns = [
                { title: '标题名称', slots: { customRender: 'content' }, width: 260, dataIndex: 'name', key: 'name' },
                { title: '所属标签', width: 100, dataIndex: 'labelNames', key: 'labelNames' },
                { title: '查看数(真实数/虚拟数)', width: 150, dataIndex: 'ReadNum', key: 'ReadNum' },
                { title: '分享数(真实数/虚拟数)', width: 150, dataIndex: 'ShareNum', key: 'ShareNum' },
                { title: '点赞数(真实数/虚拟数)', width: 150, dataIndex: 'PraiseNum', key: 'PraiseNum' },
                { title: '内容状态', width: 100, dataIndex: 'contentStatusName', key: 'contentStatusName' },
                { title: '创建时间', width: 100, dataIndex: 'crt_date', key: 'crt_date' },
                { title: '上架时间', width: 100, dataIndex: 'publishTime', key: 'publishTime' },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 70,
                    slots: { customRender: 'action' },
                },
            ];
        } else if (item.name === '话题') {
            this.getCententList();
            this.showTopic = true;
            this.columns = [
                { title: '标题名称', slots: { customRender: 'content' }, width: 260, dataIndex: 'name', key: 'name', fixed: 'left' },
                { title: '话题描述', slots: { customRender: 'subjectDescription' }, width: 160, dataIndex: 'subjectDescription', key: 'subjectDescription' },
                { title: '话题真相', width: 160, slots: { customRender: 'truthTitle' }, dataIndex: 'truthTitle', key: 'truthTitle' },
                { title: '真相描述', width: 160, slots: { customRender: 'truthExplain' }, dataIndex: 'truthExplain', key: 'truthExplain', },
                { title: '红方观点 ', width: 100, dataIndex: 'redOpinion', key: 'redOpinion' },
                { title: '蓝方观点', width: 100, dataIndex: 'blueOpinion', key: 'blueOpinion' },
                { title: '红方人数', width: 100, dataIndex: 'redPeopleNum', key: 'redPeopleNum' },
                { title: '蓝方人数', width: 100, dataIndex: 'bluePeopleNum', key: 'bluePeopleNum' },
                { title: '开始时间', width: 100, dataIndex: 'subjectStartTime', key: 'subjectStartTime' },
                { title: '结束时间', width: 100, dataIndex: 'subjectEndTime', key: 'subjectEndTime' },
                { title: '所属标签', width: 100, dataIndex: 'labelNames', key: 'labelNames' },
                { title: '查看数(真实数/虚拟数)', width: 150, dataIndex: 'ReadNum', key: 'ReadNum' },
                { title: '分享数(真实数/虚拟数)', width: 150, dataIndex: 'ShareNum', key: 'ShareNum' },
                { title: '点赞数(真实数/虚拟数)', width: 150, dataIndex: 'PraiseNum', key: 'PraiseNum' },
                { title: '内容状态', width: 100, dataIndex: 'contentStatusName', key: 'contentStatusName' },
                { title: '创建时间', width: 100, dataIndex: 'crt_date', key: 'crt_date' },
                { title: '上架时间', width: 100, dataIndex: 'publishTime', key: 'publishTime' },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, slots: { customRender: 'action' } },
            ];
            // return
        } else if (item.name === '产品') {
            // this.state.selectedRowKeys = []
            // this.selectedRow = []

            this.getCententList();
            this.showTopic = false;
            this.columns = [
                { title: '标题名称', slots: { customRender: 'content' }, width: 260, dataIndex: 'name', key: 'name', fixed: 'left' },
                { title: '所属标签', width: 100, dataIndex: 'labelNames', key: 'labelNames' },
                { title: '查看数(真实数/虚拟数)', width: 150, dataIndex: 'ReadNum', key: 'ReadNum' },
                { title: '分享数(真实数/虚拟数)', width: 150, dataIndex: 'ShareNum', key: 'ShareNum' },
                { title: '点赞数(真实数/虚拟数)', width: 150, dataIndex: 'PraiseNum', key: 'PraiseNum' },
                // { title: '关联内容', width: 100, dataIndex: 'labelNames', key: 'labelNames', },

                {
                    title: '关联内容',
                    key: 'relevance',
                    width: 70,
                    slots: { customRender: 'relevance' },
                },

                { title: '内容状态', width: 100, dataIndex: 'contentStatusName', key: 'contentStatusName' },
                { title: '创建时间', width: 100, dataIndex: 'crt_date', key: 'crt_date' },
                { title: '上架时间', width: 100, dataIndex: 'publishTime', key: 'publishTime' },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 70,
                    slots: { customRender: 'action' },
                },
            ];

            // return
        }
    }
    public columns: any[] = [
        { title: '标题名称', slots: { customRender: 'content' }, width: 260, dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: '所属标签', width: 100, dataIndex: 'labelNames', key: 'labelNames' },
        { title: '查看数(真实数/虚拟数)', width: 150, dataIndex: 'ReadNum', key: 'ReadNum' },
        { title: '分享数(真实数/虚拟数)', width: 150, dataIndex: 'ShareNum', key: 'ShareNum' },
        { title: '点赞数(真实数/虚拟数)', width: 150, dataIndex: 'PraiseNum', key: 'PraiseNum' },
        { title: '内容状态', width: 100, dataIndex: 'contentStatusName', key: 'contentStatusName' },
        { title: '创建时间', width: 100, dataIndex: 'crt_date', key: 'crt_date' },
        { title: '上架时间', width: 100, dataIndex: 'publishTime', key: 'publishTime' },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 70,
            slots: { customRender: 'action' },
        },
    ];
    onSubmit() {
        console.log('submit!', this.formData);
        // this.pagination = {
        //   current: 1, // 默认当前页数
        //   PageSize: 10, // 默认当前页显示数据的大小
        //   total: 0, // 总数，必须先有
        //   showSizeChanger: true,
        //   // showQuickJumper: true,
        //   showTotal: (total: number) => `共 ${total} 条`, // 显示总
        //   pageSizeOptions: ['5', '10', '15', '20'],
        // }
        this.pagination.current = 1;
        this.getCententList();
    }
    public reset() {
        this.formData = {
            topicId: '', //栏目Id
            titlename: '', //标题名称
            cover: '', //封面
            contentclassify: 't', //内容分类
            owntag: '', //所属标签
            contentstate: '', //内容状态
            starttime: '', //开始时间
            endtime: '', //结束时间
            topicType: '', //话题类型
            searchTime: []
        };
        this.state.selectedRowKeys = [];
        this.selectedRow = [];
        // this.getCententList()
        this.chooseTitle({ mark: 't', index: 0, name: '图文' });
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
    // public handleChange = (value: string) => {
    //   console.log('改变了现在是', value);
    //   //
    //   if (value == '产品') {
    //     this.showTopic = false
    //   } else if (value == '话题') {
    //     this.showTopic = true
    //   } else {
    //     this.showTopic = false
    //   }
    //   this.titleList.forEach(item => {
    //     if (item.mark == value) {
    //       this.titleIndex = item.index
    //     }
    //   })
    // };
    public dianji = () => {
        console.log('点击了点击了');
    };

    //上架弹窗开关
    public addShelfBoolean = false;
    //上架子组件传值
    public colseShelf(val: any) {
        console.log(val);
        this.addShelfBoolean = val;
        console.log(this.addShelfBoolean, this.addShelfBoolean);
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
    public contentId = '';
    public async getTableDropdown(value: any, row: any) {
        console.log('表格编辑', value, row, row.contentStatus);
        this.contentId = row.contentId;
        if (value.title === '审核') {
            console.log('点击了审核', row);
            this.router.push({ path: 'operateCheck', query: { contentStatus: row.contentStatus, contentId: row.contentId } });
        } else if (value.title === '详情') {
            console.log('点击了详情', value, row);
            // this.router.push({name:'contentDetail', params: { userId: '123' }})
            this.router.push({ path: 'contentDetail', query: { contentId: row.contentId, flag: "1" } });
        } else if (value.title === '编辑') {
            console.log('点击了编辑');
            let params = {
                id: row.contentId,
            };
            await contentApi.getCententItem(params, {}).then((res: any) => {
                store.commit('getEditContentList', res.defmap);
            });
            await contentApi.getFolderLabel({ id: '' }, {}).then(res => {
                store.commit('getLabeTreeList', res.data)
                store.commit('getContentType', '')
                this.router.push({ path: 'editContent', query: { id: row.contentId, editType: '1' } })
            })
        } else if (value.title === '上架') {
            let flag = row.contentStatus === '0' || row.contentStatus === '1' || row.contentStatus === '3' || row.contentStatus === '5';

            // console.log('点击了已上架');
            this.modalDate.modalTitle = '上架';
            if (flag) {
                this.addshelfMsg = '请先去掉勾选暂存/待审核/退回修改/已上架的内容';
                this.modalDate.handleOk = false;
            } else {
                this.addshelfMsg = '确认上架所选内容吗？';
                this.modalDate.handleOk = true;
            }
            this.modalDate.showOperateModal = true;

            // this.addshelfMsg = '确认上架所选内容吗？';
            // this.modalDate.handleOk = true
            // this.modalDate.showOperateModal = false
        } else if (value.title === '下架') {
            // console.log('点击了已下架');
            this.modalDate.showOperateModal = true;
            this.modalDate.modalTitle = '下架';
            this.addshelfMsg = '确认下架所选内容吗？';
            // this.modalDate.handleOk = true
            // this.modalDate.showOperateModal = false
        } else if (value.title === '删除') {
            // console.log('点击了删除1');
            this.modalDate.showOperateModal = true;
            this.modalDate.modalTitle = '删除';
            this.addshelfMsg = '确认删除所选内容吗？';
        }
    }
    public getDropdown(value: any, row: any) {
        // this.$emit('getDropdown',value, row)
        console.log('编辑', value, row);
        this.modalDate.showModal = true;
        this.modalDate.showEdit = true;

        // this.modalDate.showSon = false
        this.formEditColumn.id = row.id;
        if (value.title === '修改栏目') {
            this.modalDate.modalTitle = '修改栏目';

            this.formEditColumn.topicName = row.name;
            // this.formEditColumn.id = row.id
        } else if (value.title === '删除栏目') {
            console.log('删除栏目', row.children);
            this.modalDate.modalTitle = '删除栏目';

            if (row.children === '') {
                this.modalDate.hasSonColumn = false;
            } else {
                this.modalDate.hasSonColumn = true;
            }
        } else if (value.title === '新增子栏目') {
            console.log('新增子栏目');
            this.modalDate.modalTitle = '新增子栏目';
        }
    }
    public editColumn() {
        contentApi.updateFolderTopic({ topicName: this.formEditColumn.topicName, id: this.formEditColumn.id }, {}).then((res) => {
            console.log('修改栏目', res);
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
        console.log('新增子栏目', this.hasList, this.formEditColumn.topicName);
        const list = this.getTreeName(this.hasList, this.formEditColumn.topicName);
        if (!list) {
            //       console.log('可以了,调用新增函数');
            // message.success('新增子栏目成功');
            contentApi.addFolderTopic({ topicName: this.formEditColumn.topicName, parentId: this.formEditColumn.id }, {}).then((res) => {
                console.log('新增子栏目res', res);
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

        // console.log('新增子栏目----zmw',this.hasList,this.formAddColumn.topicName);
        // contentApi.getFolderTopic({ id: '' }, {}).then((res) => {
        //   // this.folderList = res.data
        //   console.log('内容管理文件', res.data);
        //   const { } = res.data
        //   // this.hasList = res.data
        //   const list = this.getTreeName(res.data, this.formAddColumn.topicName);
        //   if (!list) {
        //     // console.log('可以了,调用新增函数');
        //     // message.success('可以了,调用新增函数');

        //     // contentApi.addFolderTopic({ topicName: this.formEditColumn.topicName, parentId: this.formEditColumn.id }, {}).then(res => {
        //     //   console.log('新增子栏目res', res);
        //     //   const { flag, msg } = res
        //     //   if (flag === 'success') {
        //     //     this.getFolderList()
        //     //     message.success('新增子栏目成功');
        //     //     this.modalDate.showModal = false
        //     //     this.formAddColumn.topicName = ''
        //     //   } else {
        //     //     message.success('新增子栏目失败');
        //     //     this.formAddColumn.topicName = ''
        //     //   }
        //     //   this.modalDate.showModal = false
        //     //   this.init()
        //     // })
        //   } else {
        //     message.error('栏目名称重复，添加失败');
        //     // this.formAddColumn.topicName=''
        //   }
        // });
    }
    public addContent() {
        console.log('新增内容按钮');
        if (!this.formData.topicId) {
            message.error('请先选择具体栏目名称');
        } else {
            this.router.push({ path: 'addContent', query: { topicId: this.formData.topicId, editType: '0' } })
        }
    }
    public addshelfMsg = '';
    public shelf() {
        console.log('上架按钮');
        // 先进行数据筛选
        this.handlerselectedRow();
        // var flag = this.selectedRow.some((item, index) => {
        //     return item.labelStater === '待审核' || item.labelStater === '退回修改' || item.labelStater === '已上架'
        // })
        let flag = this.selectedRow.some((item, index) => {
            return item.contentStatus === '0' || item.contentStatus === '1' || item.contentStatus === '3' || item.contentStatus === '5'
        })
        // this.selectedRow.forEach((item) => {
        //     if (item.contentStatusName === '暂存' || item.contentStatusName === '待审核' || item.contentStatusName === '退回修改' || item.contentStatusName === '已上架') {
        //         this.flag = true;
        //     } else {
        //         this.flag = false;
        //     }
        // });
        console.log('判断', this.flag);
        if (this.state.selectedRowKeys.length) {
            if (flag) {
                this.addshelfMsg = '请先去掉勾选暂存/待审核/退回修改/已上架的内容';
                this.modalDate.handleOk = false;
            } else {
                this.addshelfMsg = '确认上架所选内容吗？';
                this.modalDate.handleOk = true;
            }
        } else {
            this.addshelfMsg = '请先勾选内容';
            this.modalDate.handleOk = false;
        }
        this.modalDate.showOperateModal = true;
        this.modalDate.modalTitle = '批量上架';
        // this.router.push('addContent')
    }
    public delContent() {
        console.log('删除内容按钮');
        this.handlerselectedRow();
        // this.selectedRow.forEach((item) => {
        //     if (item.contentStatusName === '已上架') {
        //         this.flag = true;
        //     } else {
        //         this.flag = false;
        //     }
        // });
        var flag = this.selectedRow.some((item, index) => {
            return item.contentStatusName === '已上架'
        })
        if (this.state.selectedRowKeys.length) {
            if (flag) {
                this.modalDate.handleOk = false;
                this.addshelfMsg = '已上架内容不可删除，如需删除，请先下架。';
            } else {
                this.addshelfMsg = '请确认是否删除所选内容？';
                this.modalDate.handleOk = true;
            }
        } else {
            this.addshelfMsg = '请先勾选需要删除的内容';
            this.modalDate.handleOk = false;
        }
        this.modalDate.showOperateModal = true;
        this.modalDate.modalTitle = '批量删除';
    }
    public findRelateContentList() {
        this.relevanceDataSource = [];
        const pramas = {
            productCodes: this.productCodes, // 产品编码，多个则用英文逗号隔开
            titleName: this.relevanceformData.titleName, // 标题名称
            labelId: this.relevanceformData.labelId, //标签ID
            topicId: this.relevanceformData.topicId, //栏目ID
            startUpdateTimeStr: this.relevanceformData.startUpdateTimeStr, //更新时间开始
            endUpdateTimeStr: this.relevanceformData.endUpdateTimeStr, //更新时间截止
        };
        contentApi.findRelateContentList(pramas, {}).then((res) => {
            console.log('关联内容', res);
            res.data.forEach((item: any, index: any) => {
                this.relevanceDataSource.push({
                    contentId: item.contentId, //内容id
                    crt_user: item.crt_user, //操作人
                    contentTypeName: item.contentTypeName, //内容分类
                    topicName: item.topicName, //栏目分类
                    updateTime: item.updateTime, //更新时间
                    labelNames: item.labelNames, //标签名称
                    titleName: item.titleName, //标题名称
                    horizontalCoverFile: item.horizontalCoverFile, //图片
                    verticalCoverFile: item.verticalCoverFile, //图片
                });
            });
        });
    }
    public productCodes = '';
    public handlerRelevance(row: any) {
        console.log('关联内容', row);
        this.productCodes = row.productCodes;
        this.relevanceShowDrawer = true;
        this.findRelateContentList();
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


    public handleTableChange(pagination: PaginationType) {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getCententList();
    }
    public seemore(data: any) {
        this.topicMoreData.showtopicModal = true;
        this.topicMoreData.msg = data

        // Modal.info({
        //     getContainer: `{{$refs.modaltopic}}`,
        //     title: () => '',
        //     centered: true,
        //     onOk() {
        //         console.log('ok');
        //     },
        // });
    };
    public closeOneButtonModel() {
        this.topicMoreData.showtopicModal = false
    }
    // public seemore() {

    // let lineHeight = 27 * 2
    // const subjectDescriptionref: any = this.$refs.subjectDescriptionref // TODO: better typescript support for router-link
    // console.log(subjectDescriptionref.offsetHeight, 'this.$refs---zmw');

    // this.$nextTick(() => {
    //     if (lineHeight < subjectDescriptionref) {
    //         console.log('超过两行');
    //     } else {
    //         console.log('没超过两行');
    //     }
    // })


    // }

}
</script>

<style lang="less" scoped>
@import '../assets/contenTbase.css';
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

.modalbox {
    width: 100px;
    height: 100px;
    background-color: green;


}
</style>
