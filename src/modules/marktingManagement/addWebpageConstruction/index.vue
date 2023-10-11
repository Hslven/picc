<template>
  <div class="init_h">
    <div class="Webpage_content init_h">
      <a-row
        class="init_h"
        :gutter="[16, 16]"
      >
        <!-- 左侧区域 -->
        <a-col :span="10">
          <div
            class="left-area"
            ref="moulde_div"
          >
            <div class="webpage_moulde_div">
              <div
                class="icon_postion"
                v-for="(element, index) in newElements"
                :key="index"

              >
               <div
                  class="Webpage_moudle"
                  ref="webpageMoudleRefs"
                  :class="{ 'red-border': element.imgName === selectedImgName }"
                  @click="selectModule(element.imgName,element)"
                  :style="elementStyle(element)"
                >

                  <div
                    class="element-canvas" 
                    v-for="(listItem, listItemIndex) in element.elementsList" :key="listItemIndex"
                    v-html="elementTXT(listItem)"
                    @click.stop="selectModuleElement(listItem,element,listItemIndex)"
                    :style="getElementCanvasStyle(element,listItem)"
                  >
                
                </div>

                </div> 
                <div class="webpage_modle_icon_div">
                  <span
                    v-if="index !== 0"
                    @click="moveElementUp(index,newElements)"
                  >
                    <svg-icon
                      color="#999"
                      name="up"
                    />
                  </span>
                  <span
                    v-if="index !== newElements.length - 1"
                    @click="moveElementDown(index,newElements)"
                  >
                    <svg-icon
                      color="#999"
                      name="down"
                    />
                  </span>
                  <span
                    @click="deleteModule(index,newElements)"
                    v-if="index !== 0"
                  >
                    <svg-icon
                      color="#999"
                      name="del"
                    />
                  </span>

                </div>
              </div>
            

              <a-spin tip="Loading..." :spinning="spinning" >
              </a-spin>
              <div>

              </div>
              <div
                class="webpage_model_add"
                @click="changeUniqueValue"
              >
                <h5>新增模块</h5>
              </div>
            </div>
          </div>
        </a-col>

        <!-- 分隔栏 -->
        <a-col
          :span="1"
          class="init_h"
        >
          <div
            class="init_noColrdiv"
            style="background-color: #f1f1f1; height: 100%;"
          ></div>
        </a-col>

        <!-- 右侧区域 -->
        <a-col :span="13">
          <div class="right-area">
            <a-tabs v-model:activeKey="activeKey">
              <!-- 元素设置 Tab -->
              <a-tab-pane
                key="1"
                tab="元素设置"
              >
                <!-- 表单 -->
                <a-form
                  :model="formState"
                  ref="formRef"
                  :rules="rules"
                  :label-col="labelCol"
                  class="init_Form_Element"
                  :wrapper-col="wrapperCol"
                >
                  <!-- 上传底图 -->
                  <a-form-item
                    label="底图："
                    required
                  >
                    <a-space>
                      <a-upload
                        v-model:file-list="fileList"
                        name="file"
                        :multiple="false"
                        :before-upload="beforeUpload"
                        :showUploadList = "showUploadListData"
                        action="/dop/iug/zuul/content/file/m/upload.do"
                        :maxCount="1"
                        style="width: 120px"
                        :headers="headers"
                        @change="handleChange"
                      >
                        <a-button>
                          <upload-outlined>
                            <svg-icon
                                color="#999"
                                name="back-top"
                              />

                          </upload-outlined>
                          上传图片
                        </a-button>

                      </a-upload>
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>1.宽度要求大于750px的图片</p>
                          <p>2.格式：JPG、JPEG、PNG、GIF</p>
                        </template>
                        <svg-icon
                          color="#1890ff"
                          style="position: absolute;top: 9px;left: 125px;"
                          name="clarification"
                          class="svg-icon"
                        />
                      </a-tooltip>
                    </a-space>
                  </a-form-item>

                  <!-- 底图描述 -->
                  <a-form-item
                    label="底图描述："
                    name="fileDescription"
                  >
                    <a-space>
                      <a-textarea
                      placeholder="请输入底图描述内容"
                        :rows="1"
                        class="w-200"
                        showCount :maxlength="100"   
                        @change="fileDescriptionFc"                   
                       v-model:value="formState.fileDescription" />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到img标签的alt属性中</p>
                        </template>
                        <svg-icon
                          color="#1890ff"
                          name="clarification"
                          class="svg-icon"
                        />
                      </a-tooltip>
                    </a-space>

                  </a-form-item>

                  <!-- 帖子类型 -->
                  <a-form-item
                    label="底图位置："
                    name="resource"
                  >
                  <a-radio-group v-model:value="formState.resource"   @change="resourceFc">
                      <a-radio value="1">顺序</a-radio>
                      <a-radio value="2">吸顶</a-radio>
                      <a-radio value="3">吸底</a-radio>
                    </a-radio-group>
                  </a-form-item>

                  <!-- 元素按钮 -->
                  <a-form-item
                    label="元素："
                    name="elemental"
                  >
                    <a-button
                      type="text"
                      danger
                      @click="showModal"
                    >新增</a-button>
                  </a-form-item>
                </a-form>

                <!-- 表格及操作按钮 -->
                <div class="init_h">
                  <a-table
                    :columns="tableColumns"
                    :dataSource="currentelementsList"
                    :pagination="false"
                    :scroll="{ y: 140 }"
                  >
                    <template #indexkey="{index}">
                      <div>
                        <p class="init_txt_whitespace">{{ index+1 }}</p>
                      </div>
                    </template>
                    <template #elementType="{record}">
                      <div>
                        <p class="init_txt_whitespace" v-if="record.elementType=='1'">链接</p>
                        <p class="init_txt_whitespace" v-else>文字</p>
                      </div>
                    </template>
                    <template #elementContent="{record}">
                    <div>
                      <p class="init_txt_whitespace" :title="stripHtmlTags(record.elementContent)">{{ stripHtmlTags(record.elementContent) }}</p>
                    </div>
                  </template>

                    <template #action="{ record,index }">

                      <a
                        @click="deleteElement(index)"
                        class="deleteApp"
                      >删除</a>
                    </template>
                    <!-- 表格内容 -->
                  </a-table>

               
                </div>
                   <a-row class="submitdiv-bottom75">
                    <a-col
                      :span="12"
                      style="margin-top: 25px;"
                    >
                      <!-- <a-button
                      @click="clearElement"
                        style="margin-right: 20px;"
                      >取消</a-button> -->
                      <a-button
                        type="primary"
                        @click="SEOOK"
                        danger
                      >保存元素</a-button>
                    </a-col>
                  </a-row>
              </a-tab-pane>

              <!-- SEO设置 Tab -->

              <a-tab-pane
                key="2"
                tab="SEO设置"
                force-render
              >
                <!-- <a-tooltip placement="rightTop">
                <template #title>
                  <span>prompt text</span>
                </template>
                <a-button>RT</a-button>
              </a-tooltip> -->

                <a-form
                  :model="formStateSEO"
                  :rules='SEOrules'
                  ref="SEOformRefModel"
                  :label-col="labelCol"
                  class="init_form"
                  :wrapper-col="wrapperCol"
                >
                  <a-form-item
                    label="页面标题："
                    name="titleName"
                  >
                    <a-space>
                      <a-textarea
                        placeholder="请输入页面标题内容"
                        class="w-350"
                              :rows="1"
                        showCount :maxlength="200"
                        v-model:value="formStateSEO.titleName"
                      />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到head节点的title标签内</p>
                        </template>
                        <svg-icon
                          color="#1890ff"
                          name="clarification"
                          class="svg-icon"
                        />
                      </a-tooltip>
                    </a-space>
                  </a-form-item>
                  <a-form-item
                    label="页面关键字："
                    name="keywordsContent"
                  >
                    <a-space>
                      <a-textarea
                        placeholder="请输入页面关键字内容"
                        class="w-350"
                        :rows="1"
                        showCount :maxlength="200"
                        v-model:value="formStateSEO.keywordsContent"
                      />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到head节点的meta标签内，name为keywords，content为此处录入的值</p>
                        </template>
                        <svg-icon
                          color="#1890ff"
                          name="clarification"
                          class="svg-icon"
                        />
                      </a-tooltip>
                    </a-space>
                  </a-form-item>
                  <a-form-item
                    label="页面描述："
                    name="descriptionContent"
                  >

                    <a-space>
                      <a-textarea
                        v-model:value="formStateSEO.descriptionContent"
                        class="w-350"
                        placeholder="请输入页面描述内容"
                        :rows="6"
                        showCount :maxlength="1000"
                      />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到head节点的meta标签内，name为description，content为此处录入的值</p>
                        </template>
                        <svg-icon
                          color="#1890ff"
                          name="clarification"
                          class="svg-icon"
                        />
                      </a-tooltip>
                    </a-space>
                  </a-form-item> 
                </a-form>
                <a-row class="submitdiv-bottom75">
                    <a-col
                      :span="12"
                      style="margin-top: 25px;"
                    >
                      
                      <a-button
                        type="primary"
                        @click="SEOOK"
                        danger
                      >保存SEO</a-button>
                    </a-col>
                  </a-row>
              </a-tab-pane>
            </a-tabs>
            
          </div>
        </a-col>
        <!-- 提交按钮 -->
        <a-row class="init_flx_btn">
          <a-col :span="24">
            <div class="Webpage_submit">
              <a-button @click="cancels">取消</a-button>
              <a-button
                type="primary"
                @click="onSaveSeoSetting"
                danger
              >提交</a-button>
              <!-- <a-button>取消</a-button> -->
            </div>
          </a-col>
        </a-row>
      </a-row>

    </div>
  <!-- 新增元素弹窗 -->
  <a-drawer
    v-model:visible="visible"
    width="60%"
    title="新增元素"
    @close="cancel"
  >
    <!-- 元素视图区域 -->
    <div class="element_viewport_border" ref="viewportborders">
      <div class="bfc">
        <div class="element_viewport_content" ref="elementviewportcontent">
          <div
            class="element_viewport"
            ref="elementViewports"
          >
            <div
              class="selection-box"
              :style="selectionBoxStyle"
              draggable="true"
              @dragstart="onDragStart"
              @drag="onDrag"
              @dragend="onDragEnd"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 元素属性设置表单 -->
    <a-row>
      <a-col :span="24">
        <div class="element_form">
          <a-form
            :model="formState"
            :label-col="labelCol"
            :forceRender="true"
            :rules="rules"
            ref="formRefModel"
            :wrapper-col="wrapperCol"
          >
            <a-form-item
              label="元素类型："
              name="elementType"
            >
              <a-radio-group
                v-model:value="formState.elementType"
                @change="elementType"
              >
                <a-radio value="1">链接</a-radio>
                <a-radio value="2">文字</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="位置："
              required
            >
            <a-input-number 
            :formatter="value => `X ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            class="gray-x-input"

            :parser="value => value.replace(/\X\s?|(,*)/g, '')"

            placeholder="请输入大于0的数值" v-model:value="valueX" style="width: 165px;margin-right: 20px;" @blur="inputX" />
            <a-input-number suffix="Y"
            :formatter="value => `Y ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            class="gray-x-input"

            :parser="value => value.replace(/\Y\s?|(,*)/g, '')"
            placeholder="请输入大于0的数值" v-model:value="valueY" style="width: 165px;"  @blur="inputY" />
            </a-form-item>

            <a-form-item
              label="大小："
              required
            >
            <a-input-number 
            :formatter="value => `W ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            class="gray-x-input"
            :parser="value => value.replace(/W\s?|,/g, '')"

            placeholder="请输入大于0的数值" v-model:value="valueW" style="width: 165px;margin-right: 20px;"   @blur="inputW" />
            <a-input-number 
            :formatter="value => `H ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            class="gray-x-input"

            :parser="value => value.replace(/\H\s?|(,*)/g, '')"
             placeholder="请输入大于0的数值" v-model:value="valueH" style="width: 165px;"   @blur="inputH" />                         
            </a-form-item>
            <a-form-item
              label="元素内容："
              required
            >
              <a-input
              placeholder="请输入http://或https://开头的链接网址"
                v-model:value="formState.link"
                v-if="formState.elementType === '1'"
              />
              <div
                v-if="formState.elementType === '2'"
              >
                <Editor
                  :init="init"
                  v-model="myValue"
                  :id="tinymceId"
                  style="width: 100%;"
                />
                <!-- <p class="contentLength-p">{{ contentLength }}/100</p> -->

              </div>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 99,
      }"
    >
      <a-button style="margin-right: 8px" @click="cancel">取消</a-button>
      <a-button type="danger" @click="handleOk">保存</a-button>
    </div>

  </a-drawer>
  </div>



</template>

<script lang = "ts"  setup>
    import {
        ref,
        Ref,
        UnwrapRef,
        reactive,
        watch,
        onMounted,
        defineEmits,
        defineProps,
        createVNode,
        computed,
    } from 'vue';

import {
    message
} from 'ant-design-vue';
import {
    webpageConstructionApi
} from '@/libs/api';

import {
    generateFullHTML
} from '@/libs/webpageConstruction/generateFullHTML';

import { useRouter } from 'vue-router'

//在js中引入所需的主题和组件
import tinymce from 'tinymce/tinymce';
// import 'tinymce/skins/content/default/content.css';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom'; 
//在TinyMce.vue中接着引入相关插件
import moment, { Moment } from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import {
    convertPxToRem,
    debounce
} from '@/libs/webpageConstruction/elementUtils';


import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/code'; // 源码
import {
    localStorage
} from '@/libs/Storage';
const generateUniqueValue = (): string => {
    return Math.random().toString(36).substring(2);
};

interface FormState {
    name: string;
    region: string | undefined;
    date1: Moment | undefined;
    elementType: string;
    delivery: boolean;
    type: string[];
    link: string;
    fileDescription?: string[];
    resource: string;
    desc: string;
}
interface FormStateSEO {
    buildingId: string;
    titleName: string;
    keywordsContent: string;
    descriptionContent: string;

}
interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
}

interface ElementInfo {
    name: string;
    imgName: string;
    filePath: string;
    hotspotXAxis: number;
    hotspotYAxis: number;
    hotspotWidth: number;
    hotspotHigh: number;
    fileDescription: string;
    elementType: string;
    filePosition: string;
    elementContent: string;
}
interface FileItem extends File {
    uid: string;
    imageWidth?: number;
    imageHeight?: number;
    elementViewportW_?: number;
    elementViewportH_?: number;
    filePath?: string;
    imgName?: string;

}
interface Element {
  buildingId: string | number;
  imgName: string;
  elementsList: {
    hotspotXAxis: number;
    hotspotYAxis: number;
    hotspotWidth: number;
    hotspotHigh: number;
    elementType: string;
    elementContent: string;
  }[];
  fileDescription: string;
  filePosition: string;
  imageWidth: string;
  imageHeight: string;
  name: string;
  fileName: string;
  filePath: string;
}
interface Element {
  // 定义元素的类型
  // 根据实际情况进行修改
} 
    const newWebPageId = defineProps<{
            propName: string | number;  // 假设 newWebPageId 可以是字符串或数字
          }>();
        const valueX: Ref < number > = ref(1);
        const valueY: Ref < number > = ref(1);
        const valueW: Ref < number > = ref(40);
        const valueH: Ref < number > = ref(30);
        const contentLength: Ref < number > = ref(0);
        const changeElement: Ref < boolean > = ref(false);
        const changeElementNumber:Ref < number > = ref();
        const activeKey:Ref < string | undefined > = ref('1')
        const imageWidthS:Ref < number | undefined > = ref()
        const imageHeightS:Ref < number | undefined > = ref()
        const fileList: Ref < FileItem[] > = ref([]);
        const myValue: Ref < string | undefined > = ref(); // 假设 myValue 可能为字符串或 undefined
        let imageWidth = 0;
        let imageHeight = 0;
        const emit = defineEmits();

        const headers=  {
                  ['X-Auth-Token']: localStorage.get('token'),
              }
              const tableColumns= [
                // 表格列配置
                {
                    title: '序号',
                    dataIndex: 'key',
                    align: 'center',
                    slots: {
                        customRender: 'indexkey'
                    },

                },
                {
                    title: '元素类型',
                    dataIndex: 'elementType',
                    align: 'center',
                    slots: {
                        customRender: 'elementType'
                    },
                },
                {
                    title: '元素内容',
                    dataIndex: 'elementContent',
                    align: 'center',
                    ellipsis: true,
                     slots: {
                        customRender: 'elementContent'
                    },

                },
                {
                    title: 'X坐标',
                    dataIndex: 'hotspotXAxis',
                    align: 'center',
                },
                {
                    title: 'Y坐标',
                    dataIndex: 'hotspotYAxis',
                    align: 'center',
                },
                {
                    title: '宽度',
                    dataIndex: 'hotspotWidth',
                    align: 'center',
                },
                {
                    title: '高度',
                    dataIndex: 'hotspotHigh',
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    align: 'center',
                    slots: {
                        customRender: 'action'
                    },
                },
            ]
            const labelCol = {
                  span: 4
              }
             const wrapperCol = {
                  span: 14
              }
              const getDefaultElements = (): Element[] => [{
                buildingId: newWebPageId.propName,
                imgName: uniqueValue.value,
                elementsList: [{
                  hotspotXAxis: 0,
                  hotspotYAxis: 0,
                  hotspotWidth: 0,
                  hotspotHigh: 0,
                  elementType: '',
                  elementContent: ''
                }],
                fileDescription: '',
                filePosition: '',
                imageWidth: '',
                imageHeight: '',
                name: '',
                fileName: '',
                filePath: ''
              }];
         
        const spinning = ref<boolean>(false);
        const Verification = ref<boolean>(false);
        const Seoification = ref<boolean>(false);
        const  mesg = ref<boolean>(true);
        const elementViewports: Ref < HTMLElement | null > = ref(null);
        const viewportborders: Ref < HTMLElement | null > = ref(null);
        const elementviewportcontent: Ref < HTMLElement | null > = ref(null);
        const Webpage_moudle: Ref < any > = ref(null); // 替换 any 为适当的类型
        const formRef: Ref < any > = ref(); // 替换 any 为适当的类型
        const formRefModel: Ref < any > = ref(); // 替换 any 为适当的类型
        const SEOformRefModel:Ref < any > = ref(); // 替换 any 为适当的类型
        const selectedElement = ref(null); // 存储当前选择的模块
        const isDragging: Ref < boolean > = ref(false);
        const offsetX: Ref < number > = ref(0);
        const offsetY: Ref < number > = ref(0);
        const uniqueValue: Ref<string> = ref(generateUniqueValue());
        const prevX: Ref < number > = ref(0);
        const prevY: Ref < number > = ref(0);
        const showUploadListData = ref<boolean>(false);
        const webpageMoudleRefs: Ref < any[] > = ref([]); // 替换 any 为适当的类型
        const moulde_div: Ref < HTMLElement | null > = ref(null);
        const currentIndex: Ref < number | null > = ref(null);
        const selectedImgName: Ref<string | null> = ref(uniqueValue.value);
        const router = useRouter();
        const newElements: Ref<Element[]> = ref(getDefaultElements());
        const editorInstance = ref < any > (null); // 引用 TinyMCE 编辑器实例
        const visible = ref < boolean > (false);
        const value2 = ref < number > (100);
        const selectedIndex = ref(0); // 默认选中第一个元素
        const getInitialFormValues = () => ({
          name: '',
          region: undefined,
          date1: undefined,
          delivery: false,
          elementType: '1',
          type: [],
          link: '',
          fileDescription: '', // 修改为一个空字符串
          resource: '1',
          desc: '',
      });


         const formState = reactive(getInitialFormValues());

          const getDefaultFormState = (): FormStateSEO => ({
            buildingId: newWebPageId.propName, // 这里确保 newWebPageId.propName 是已知的
            titleName: '',
            keywordsContent: '',
            descriptionContent: ''
          });
          const formStateSEO: UnwrapRef<FormStateSEO> = reactive(getDefaultFormState());
        const rules: Record < string, any > = {
            resource: [{
                required: true,
                message: '请选择帖子类型',
                trigger: 'change'
            }],
            elementType: [{
                required: true,
                message: '请选择元素类型',
                trigger: 'change'
            }]
        };

        const SEOrules: Record < string, any > = {
            titleName: [{
                required: true,
                message: '请输入页面标题',
                trigger: 'blur'
            }]
        };
        // const hosts = 'https://mptst.picclife.cn/dop/iug/zuul/content/file/preview/m/'
        const changeUniqueValue = (): void => {
          if (newElements.value.length === 0 || (newElements.value[newElements.value.length - 1].filePath && newElements.value[newElements.value.length - 1].filePath.trim() !== '')) {
            uniqueValue.value = generateUniqueValue();
            const uniqueModule = {
                buildingId: newWebPageId.propName,
                imgName:uniqueValue.value,
                elementsList:[
                  {
                hotspotXAxis:  0,
                hotspotYAxis:  0,
                hotspotWidth:  0,
                hotspotHigh:  0,
                elementType:  '',
                elementContent:  '',
                  }
                ],
                fileDescription:  '',
                filePosition:  '',
                imageWidth:  '',
                imageHeight:  '',
                name:  '',
                fileName:'',
                changePath:'',
                filePath: '',
            };
            newElements.value.push(uniqueModule);
            
            Verification.value = false
            selectModule(uniqueValue.value,uniqueModule)
          } else {
            message.error('请先设置上一个模块！')
            // console.log('请先设置上一个模块！');  
       }
        };
        watch(() => newWebPageId.propName, (newValue, oldValue) => {
          if (newValue !== oldValue) {
            changeUniqueValue()
            
          }
      });
        const selectModuleElement =  (listItem: any,element:any,listItemIndex:any) => {
          selectModule(element.imgName,element)
          formState.elementType = listItem.elementType;
          valueX.value = listItem.hotspotXAxis;
          valueY.value = listItem.hotspotYAxis;
          valueW.value = listItem.hotspotWidth;
          valueH.value = listItem.hotspotHigh;
          if(listItem.elementType=='2'){
            myValue.value = listItem.elementContent
          }else{
            formState.link = listItem.elementContent
          }

          changeElement.value = true
          changeElementNumber.value = listItemIndex
        }
        const stripHtmlTags = text => {
                  if (!text) return '';

                  // 使用浏览器的DOM来解析HTML实体
                  const textarea = document.createElement('textarea');
                  textarea.innerHTML = text;
                  const decodedText = textarea.value;

                  // 使用正则表达式删除HTML标签
                  return decodedText.replace(/<\/?[^>]+(>|$)/g, '');
              };

        //清空表单
        const restForm = (): void => {
                myValue.value = '';
                  const editorInstance = tinymce.get(tinymceId.value);
                  const selectionBox = document.querySelector('.selection-box') as HTMLElement;
                  if (editorInstance) {
                      editorInstance.setContent('');
                      selectionBox.innerHTML = ''; // Clear content
                      selectionBox.style.fontSize = '';
                      selectionBox.style.fontWeight = 'normal';
                      selectionBox.style.fontStyle = 'normal';
                  }
                  // if (formRef.value) {
                  //     formRef.value.resetFields();
                  // }
                  if (formRefModel.value) {
                      formRefModel.value.resetFields();
                  }
                  formState.link = '';
        }


        const handleNumericInput = (valueRef: { value: any }, variableName: string, defaultValue: number) => {
    const numericValue = Number(valueRef.value);
    
    let isValid = false;
    switch (variableName) {
        case 'valueH':
            isValid = isValidValue(numericValue) && (numericValue + Number(valueY.value) <= 100);
            break;
        case 'valueW':
            isValid = isValidValue(numericValue) && (numericValue + Number(valueX.value) <= 100);
            break;
        case 'valueX':
            isValid = isValidValue(numericValue) && (numericValue + Number(valueW.value) <= 100);
            break;
        case 'valueY':
            isValid = isValidValue(numericValue) && (numericValue + Number(valueH.value) <= 100);
            break;
        default:
            isValid = isValidValue(numericValue);
    }

    if (isValid) {
        console.log('选框在图片内');
    } else {
        valueRef.value = defaultValue;  // 使用默认值
        message.error('选框超出图片范围');
    }
}
          // 使用防抖包装你的输入函数
          const debouncedHandleH = debounce((e: any) => handleNumericInput(valueH, 'valueH', 30), 300);
          const debouncedHandleW = debounce((e: any) => handleNumericInput(valueW, 'valueW', 40), 300);
          const debouncedHandleX = debounce((e: any) => handleNumericInput(valueX, 'valueX', 1), 300);
          const debouncedHandleY = debounce((e: any) => handleNumericInput(valueY, 'valueY', 1), 300);

          const inputH = (e: any) => debouncedHandleH(e);
          const inputW = (e: any) => debouncedHandleW(e);
          const inputX = (e: any) => debouncedHandleX(e);
          const inputY = (e: any) => debouncedHandleY(e);

          const isValidValue = (value: number): boolean => {
            const isNumber = typeof value === 'number' && !isNaN(value);
            const isInRange = value >= 0 && value <= 100;
            return isNumber && isInRange;
        }

        const fileDescriptionFc = () =>{
          const imgNameToCheck = (fileList.value[0] as any).imgName; // 使用 any 类型断言
          const existingIndex: number = newElements.value.findIndex((element: any) => element.imgName === imgNameToCheck);
          newElements.value[existingIndex].fileDescription = formState.fileDescription
        }
      
                      
        //点击模块
        const selectModule = (imgName: string,element:any) => {
          selectedImgName.value = imgName;
          changeElement.value = false
          console.log(imgName)
          const index = newElements.value.findIndex(e => e.imgName === imgName);
          selectedIndex.value = index;
          uniqueValue.value = imgName
          fileList.value = [{
                // uid: element.imgName,
                name: element.name,
                imgName: element.imgName,
                fileName:element.fileName,
                filePath: element.filePath,
                changePath: element.changePath,

            }]as any;
            console.log(fileList.value)
            uniqueValue.value = element.imgName
            myValue.value = '';
            formState.fileDescription = element.fileDescription;
            formState.resource = element.filePosition || '1';
            if(element.filePath){
            showUploadListData.value = true
            }
        };
   
        const resetObjectState = (obj: Record<string, any>, defaultState: Record<string, any>) => {
              for (const key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) {
                  obj[key] = defaultState[key];
                }
              }
            };

            // 清空数组的函数
            const clearArray = (arr: any[]) => {
              arr.length = 0;
            };
            // 使用上述函数进行重置
            const resetAllStates = () => {
              clearArray(fileList.value);
              clearArray(newElements.value);
              activeKey.value = '1';                     
              resetObjectState(formStateSEO, getDefaultFormState());
              resetObjectState(formState, getInitialFormValues());
            };

        const cancels = (): void => {
          restForm()
          resetAllStates()

          emit('cancelAdd',false,'0');

          // router.go(-1); // 后退一步
        }
        //筛选table
                //筛选table
        const currentelementsList = computed(() => {
              // 检查是否已选择了一个元素
              if (selectedIndex.value !== null) {
                // 检查选择的元素是否存在，并且是否包含elementsList属性
                if (
                  newElements.value[selectedIndex.value] && 
                  newElements.value[selectedIndex.value].hasOwnProperty('elementsList')
                ) {
                  // 返回经过过滤的数组，只包含那些具有elementType属性的元素
                  return newElements.value[selectedIndex.value].elementsList.filter(item => item.elementType);
                }
              }
              // 如果上述条件都不满足，则返回空数组
              return [];
            });
        //消息元素
        const cancel = (): void => {
             formRefModel.value.resetFields();
            visible.value = false;
        }
        //提交生成页面
        const onSaveSeoSetting = (): void => {
            // const params = {
            //   buildingId: localStorage.get('newWebPageId'),
            //     buildingLink: '<p>232323</p>'.replace(/\s+/g, '')
            // }
            if(!formStateSEO.titleName){
              message.error('请输入页面标题')
              return
            }
            // if(!formStateSEO.keywordsContent){
            //   message.error('请输入页面关键字')
            //   return
            // }
            // if(!formStateSEO.descriptionContent){
            //   message.error('请输入页面描述')
            //   return
            // }
            if (newElements.value 
    && newElements.value.length > 0 
    && newElements.value[0] 
    && newElements.value[0].filePath) {
              mesg.value = false

              addElementSubmit();
              addWebBuildingContentMethod()
          } else {
              // 
              message.error('请先设置和保存元素')
          }
        }
        const addWebBuildingContentMethod = (): void => {
          const fullHTML = generateFullHTML(newElements.value, formStateSEO);
            const params = {
              htmlString:fullHTML,
              buildingId: newWebPageId.propName
            //  buildingId: '2323'
            }
            webpageConstructionApi.addWebBuildingContent(params, {}).then(res => {
                // console.log(res)
                 if(res.flag==='success'){
                  message.success('生成H5页面成功')
                  setTimeout(() => {
                    restForm()
                    resetAllStates()
                    emit('cancelAdd',true,'0');

                    // router.go(-1); // 后退一步
                  },100)
                }
            })
        }
        //图片切换
        const handleChange = (info: any): void => {
              
            if (info.file.status === 'done') {
                fileList.value = [{
                    uid: info.file.uid,
                    name:info.file.name,
                    fileName: `${info.file?.response.defmap.data}`,
                    imgName: uniqueValue.value,
                    changePath: `${info.file?.response.defmap.data}`,
                    filePath: `/dop/iug/staticFile/userFile/market/${info.file?.response.defmap.data}`,
                }] as any;
                formState.fileDescription = ''
                showUploadListData.value = true
                const currentFile = fileList.value[0] as any; // 使用 any 类型断言
                console.log(info)
                const newElement: any  = {
                buildingId: newWebPageId.propName,
                elementsList:[],
                fileDescription: formState.fileDescription,
                filePosition: formState.resource,
                imageWidth: imageWidthS,
                imageHeight: imageHeightS,
                imgName: currentFile.imgName,
                name: currentFile.name,
                fileName:currentFile.fileName,
                changePath:currentFile.changePath,
                filePath: currentFile.filePath,
                // filePath: 'https://images.weserv.nl/?url=https://mptst.picclife.cn/dop/iug/staticFile/mytravelinsurance.png',
                // 其他信息
            };
            // debugger
            const imgNameToCheck = (fileList.value[0] as any).imgName; // 使用 any 类型断言
            const existingIndex: number = newElements.value.findIndex((element: any) => element.imgName === imgNameToCheck);
            const positionHandlers = {
                '1': () => existingIndex !== -1 ? existingIndex : newElements.value.length,  // 如果存在，则保持位置；否则放在最后。
                '2': () => 0,  // 变为第一个
                '3': () => newElements.value.length // 变为最后一个
            };

            const getPosition = (resource: string): number => {
                if(positionHandlers[resource]) {
                    return positionHandlers[resource]();
                } else {
                    console.error('Unexpected resource value:', resource);
                    return newElements.value.length; // 默认插入到末尾
                }
            }

            // 如果imgName已经存在，则先移除
            if (existingIndex !== -1) {
                newElements.value.splice(existingIndex, 1);
            }

            // 根据formState.resource确定新元素的位置并插入
            const position = getPosition(formState.resource);
            newElements.value.splice(position, 0, newElement);


            visible.value = false;
            console.log(newElements.value)
            message.success(`${info.file.name} 上传服务器成功`);

            } else if (info.file.status === 'error') {
                // fileList.value = [];
                // showUploadListData.value = false
                showUploadListData.value = true

                // fileList.value = [{
                //     uid: info.file.uid,
                //     name:info.file.name,
                //     fileName: '22',
                //     imgName: uniqueValue.value,
                //     filePath: 'http://b.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9ea5c0e3c23d139b6003bf3b374.jpg'
                // }] as any;
                message.error(`${info.file.name} 上传服务器失败`);
            }
        };

        const checkIfImageUploaded = (imageName: string, elements: ElementInfo[]) => {
            // 遍历已上传元素数组，判断是否存在相同图片名的元素
            return elements.some(element => element.name === imageName);
        };
        //图片填充
        const imgFill = () => {
            setTimeout(() => {
              const Webpage_moudles = document.querySelector('.Webpage_moudle') as HTMLElement | null; // 获取 .element_viewport 元素
              const viewportborder = viewportborders.value; // 获取 .element_viewport 元素
              const elementViewportW = Webpage_moudles.offsetWidth;
                console.log(elementViewportW)
                const elementViewport = elementViewports.value;
                elementViewport.style.width =  `${elementViewportW}px`;
                if (elementViewport && viewportborder) {
                    const image = new Image();
                    // const imgUrl = 'https://images.weserv.nl/?url=https://mptst.picclife.cn/dop/iug/staticFile/mytravelinsurance.png';
                    const imgUrl = fileList.value[0].filePath;

                    if (imgUrl) {
                    const imgName = fileList.value[0].imgName;
                    image.src = imgUrl;
                    image.onload = function() {
                        imageWidth = image.width; // 更新 imageWidth
                        imageHeight = image.height; // 更新 imageHeight
                        const aspectRatio = image.width / image.height; // 计算宽高比例
                        console.log(elementViewportW)
                        const elementViewportW = elementViewport.offsetWidth;
                        const elementViewportH = elementViewportW / aspectRatio;
                        // 图片宽度大于高度，设置宽度为100%
                        elementViewport.style.backgroundImage = `url(${imgUrl})`;
                        elementViewport.style.backgroundSize = '100% auto';
                        elementViewport.style.backgroundRepeat = 'no-repeat';
                        elementViewport.style.height = `${elementViewportH}px`;
                        const element = document.querySelector('.element_viewport_content'); // 替换为正确的选择器

                        if (element.offsetHeight < elementViewportH) {
                          element.style.flexWrap = 'inherit';
                          // element.style.height = `${elementViewportH}px`;
                      } else {
                          element.style.flexWrap = 'wrap';
                      }

                        fileList.value[0] = {
                            imageWidth: imageWidth,
                            imageHeight: imageHeight,
                            elementViewportW_: elementViewportW,
                            elementViewportH_: elementViewportH,
                            filePath: imgUrl,
                            name: fileList.value[0].name,
                            changePath: fileList.value[0].changePath,
                            fileName:fileList.value[0].fileName,
                            imgName: imgName,
                        } as any;
                        setTimeout(() => {
                        if(editorInstance.value){
                          Promise.resolve().then(updateSelectionBox);
                        }
                        }, 50);
                    };
                  }
                }
            }, 100); 
        };
        const onDragStart = (event: MouseEvent) => {
              const imageWidth = (fileList.value[0] as any).elementViewportW_;
              const imageHeight = (fileList.value[0] as any).elementViewportH_;
              const element = document.querySelector('.element_viewport');
              const displayedImageWidth = element ? element.offsetWidth : 0;
              const displayedImageHeight = displayedImageWidth ? displayedImageWidth / (imageWidth / imageHeight) : 0;
              const scaleFactorX = imageWidth / displayedImageWidth;
              const scaleFactorY = imageHeight / displayedImageHeight;

              if (selectionBoxStyle.value.left && typeof selectionBoxStyle.value.top === 'string') {
                  offsetX.value = event.clientX - parseFloat(selectionBoxStyle.value.left) * scaleFactorX; 
                  offsetY.value = event.clientY - parseFloat(selectionBoxStyle.value.top) * scaleFactorY;
                  isDragging.value = true;
              }
};



const onDrag = (event: MouseEvent) => {
  if (event.clientX === 0 && event.clientY === 0) return;

    requestAnimationFrame(() => {
        if (!isDragging.value) return;

        const element = document.querySelector('.element_viewport');
        if (!element) return;

        // 获取滚动的位移
        const scrollX = element.scrollLeft;
        const scrollY = element.scrollTop;

        // 图片的边界和尺寸
        const imageWidth = (fileList.value[0] as any).elementViewportW_;
        const imageHeight = (fileList.value[0] as any).elementViewportH_;

        // 获取容器的尺寸
        const displayedImageWidth = element.offsetWidth;
        const displayedImageHeight = displayedImageWidth / (imageWidth / imageHeight);

        // 计算缩放因子
        const scaleFactorX = imageWidth / displayedImageWidth;
        const scaleFactorY = imageHeight / displayedImageHeight;

        // 在计算新位置时加上滚动的位移和缩放因子
        const adjustedX = (event.clientX - offsetX.value + scrollX) * scaleFactorX;
        const adjustedY = (event.clientY - offsetY.value + scrollY) * scaleFactorY;

        // 确保选择框保持在图片内
        let newLeft = Math.max(0, adjustedX);
        let newTop = Math.max(0, adjustedY);
        newLeft = Math.min(newLeft, imageWidth - parseFloat(selectionBoxStyle.value.width));
        newTop = Math.min(newTop, imageHeight - parseFloat(selectionBoxStyle.value.height));

        // 设置选择框的位置
        selectionBoxStyle.value.left = `${newLeft}px`;
        selectionBoxStyle.value.top = `${newTop}px`;

        // 记录日志
        console.log('event.clientX:', event.clientX, 'event.clientY:', event.clientY);
        console.log('scrollX:', scrollX, 'scrollY:', scrollY);
        console.log('scaleFactorX:', scaleFactorX, 'scaleFactorY:', scaleFactorY);
        console.log('adjustedX:', adjustedX, 'adjustedY:', adjustedY);
        console.log('newLeft:', newLeft, 'newTop:', newTop);

        // 更新lastX和lastY的值
        prevX.value = Math.round((parseFloat(selectionBoxStyle.value.left) / imageWidth) * 100);
        prevY.value = Math.round((parseFloat(selectionBoxStyle.value.top) / imageHeight) * 100);
    });
};






        const onDragEnd = () => {
            isDragging.value = false;
            valueX.value = prevX.value;
            valueY.value = prevY.value;
            // valueX.value = prevX.value;
        };

        const selectionBox: HTMLElement | null = document.querySelector('.selection-box') as HTMLElement;
            if (editorInstance.value) {
                const content = editorInstance.value.getContent();
                const fontSize = editorInstance.value.queryCommandValue('FontSize');
                if(formState.elementType=='2'){
                if (content) {
                    selectionBox.innerHTML = convertPxToRem(content);
                }

                // if (fontSize !== null && fontSize !== undefined) {
                //     selectionBox.style.fontSize = `${fontSize}px`;
                // }
                const isBold = editorInstance.value.queryCommandState('Bold');
                selectionBox.style.fontWeight = isBold ? 'bold' : 'normal';

                const isItalic = editorInstance.value.queryCommandState('Italic');
                selectionBox.style.fontStyle = isItalic ? 'italic' : 'normal';
            }else{
              selectionBox.innerHTML = ''
            }

          }

        //设置左边选框
        const getElementCanvasStyle = (element: any,listItem:any): Record < string,
            string > | undefined => {
                const Webpage_moudles = document.querySelector('.webpage_moulde_div') as HTMLElement | null; // 获取 .element_viewport 元素
                if (Webpage_moudles) {
                    const elementsList = listItem
                    const aspectRatio = element.imageWidth / element.imageHeight; // 计算宽高比例
                    const elementViewportW = Webpage_moudles.offsetWidth - 40;
                    const elementViewportH = elementViewportW / aspectRatio;
                    const imageWidth = elementViewportW;
                    const imageHeight = elementViewportH;
                    const xPercent = imageWidth * (elementsList.hotspotXAxis / 100);
                    const yPercent = imageHeight * (elementsList.hotspotYAxis / 100);
                    const widthPercent = imageWidth * (elementsList.hotspotWidth / 100);
                    const heightPercent = imageHeight * (elementsList.hotspotHigh / 100);                   
                    elementTXT(elementsList);      
                    return {
                        width: `${widthPercent}px`,
                        height: `${heightPercent}px`,
                        position: 'absolute',
                        left: `${xPercent}px`,
                        top: `${yPercent}px`,
                        background: 'rgba(0, 0, 0, 0.1)', // 根据需要设置背景样式
                        border: '1px solid #FFFFFF', // 根据需要设置边框样式
                        // 更多样式属性...
                    };
                }
                return undefined;
            };
            //左边文本
        const elementTXT = (element: any): string => {
          const editorInstance = convertPxToRem(element.elementContent);
            if (element.elementType === '2') return editorInstance;
            return editorInstance;
        };
        //左边模块图片
        const elementStyle = (element: {
                imageWidth: number;
                imageHeight: number;
                filePath: string;
            }): Record < string,
            string > => {
                const Webpage_moudles = document.querySelector('.webpage_moulde_div') as HTMLElement | null; // 获取 .element_viewport 元素
                if (Webpage_moudles && element.imageWidth) {
                    const aspectRatio = element.imageWidth / element.imageHeight; // 计算宽高比例
                    const elementViewportW = Webpage_moudles.offsetWidth - 40;
                    const elementViewportH = elementViewportW / aspectRatio;

                    return {
                        height: `${elementViewportH}px`,
                        backgroundImage: `url(${element.filePath})`, // 设置背景图
                    };
                }
                return {};
            };


        //富文本初始化
        const tinymceId = ref('vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''));
        //定义一个对象 init初始化
        const init = reactive({
            selector: '#' + tinymceId.value, //富文本编辑器的id,
            language_url: process.env.BASE_URL + 'tinymce/langs/zh-Hans.js', // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
            language: 'zh-Hans', //语言
            skin_url: process.env.BASE_URL + 'tinymce/skins/ui/oxide', // skin路径，具体路径看自己的项目
            height: 300, //编辑器高度
            branding: false, //是否禁用“Powered by TinyMCE”
            menubar: true, //顶部菜单栏显示
            plugins: ['letterspacing'],
            toolbar: ' undo redo  | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent   ｜ customLineHeight |  letterspacing | fontsizeinput ',
            font_family_formats: `
            宋体=SimSun;
            黑体=SimHei;
            微软雅黑=Microsoft YaHei;
            等线=DengXian;
            仿宋=FangSong;
            楷体=KaiTi;        
            Arial=Arial;
            Calibri=Calibri;
            Times New Roman=新罗马时代;
            Verdana=Verdana;
            Tahoma=Tahoma;
            Georgia=Georgia;
            Cambria=Cambria;
            Courier New=新宋体;
            Trebuchet MS=Trebuchet MS;
            Lucida Sans Unicode=Lucida Sans Unicode;
            Constantia=Constantia;
            Corbel=Corbel;
            Segoe UI=Segoe UI;
            Palatino Linotype=Palatino Linotype;
            Garamond=Garamond;
`,
            font_size_formats:'10px 11px 12px 13px 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 48px 56px 72px',
            font_size_input_default_unit: 'px',
            line_height_formats:'1 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2',
            letterspacing_val: '1px 2px 3px 4px 5px 6px 7px 8px 9px 10px',
            // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
            paste_webkit_styles: 'all',
            paste_preprocess: function(plugin, args) {
                // 使用正则表达式去除样式中的背景图
                const strippedContent = args.content.replace(/background[^;]+;/g, '');
                args.content = strippedContent;
            },
            paste_merge_formats: true,
            nonbreaking_force_tab: false,
            paste_auto_cleanup_on_paste: false,
            file_picker_types: 'file',
            formats: {
                setLineHeight: {
                    inline: 'span',
                    styles: { 'line-height': '%value' }
                }
            },
            content_css: '/tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
            setup: (editor: any) => {
              console.log(editor);
              editor.on('init', function(e) {
                var ps = editor.getBody().getElementsByTagName('p');
                for (var i = 0; i < ps.length; i++) {
                    ps[i].style.fontSize = '12px';
                }
            });

              editor.ui.registry.addButton('customLineHeight', {
                    text: '自定义行高',
                    onAction: function () {
                        // 打开弹窗，让用户输入行高
                        editor.windowManager.open({
                            title: '自定义行高',
                            body: {
                                type: 'panel',
                                items: [
                                    {
                                        type: 'input',
                                        name: 'lineHeight',
                                        label: 'Line Height',
                                        inputMode: 'numeric'
                                    }
                                ]
                            },
                            buttons: [
                                {
                                    type: 'cancel',
                                    text: '取消'
                                },
                                {
                                    type: 'submit',
                                    text: '确定',
                                    primary: true
                                }
                            ],
                                  onSubmit: function (api) {
                                      const data = api.getData();
                                      console.log(data);  // 这将显示弹窗中输入的数据
                                      editor.formatter.apply('setLineHeight', {value: data.lineHeight + 'px'}); // 记得添加 'px' 或其他单位
                                      api.close();
                                  }
                              });
                          }
                      });

              editorInstance.value = editor;
              
                  editor.on('change', () => {
                      const maxLength = 100;
                      const currentContent = editor.getContent({ format: 'text' });
                      updateSelectionBox();
                    });
                    editor.on('input', () => {
                      const currentContent = editor.getContent({ format: 'text' });
                    });
                     
                
                    editor.on('keydown', (event: KeyboardEvent) => {
                      const currentContentLength = editor.getContent({ format: 'text' }).length;
                      const maxLength = 100;
                      updateSelectionBox();
                    });

                    editor.on('paste', (event: ClipboardEvent) => {
                      // const maxLength = 100;
                      updateSelectionBox();
                    });
            },
        });
                //更新富文本框
                const updateSelectionBox = () => {
        const selectionBox: HTMLElement | null = document.querySelector('.selection-box') as HTMLElement;
            if (editorInstance.value) {
                const content = editorInstance.value.getContent();
                const fontSize = editorInstance.value.queryCommandValue('FontSize');
                if(formState.elementType=='2'){
                if (content) {
                    selectionBox.innerHTML = convertPxToRem(content);
                }

                // if (fontSize !== null && fontSize !== undefined) {
                //     selectionBox.style.fontSize = `${fontSize}px`;
                // }
                const isBold = editorInstance.value.queryCommandState('Bold');
                selectionBox.style.fontWeight = isBold ? 'bold' : 'normal';

                const isItalic = editorInstance.value.queryCommandState('Italic');
                selectionBox.style.fontStyle = isItalic ? 'italic' : 'normal';
            }else{
              selectionBox.innerHTML = ''
            }

          }
        };
        const showModal = () => {
            if (fileList.value[0]) {
              if (fileList.value[0]  && (fileList.value[0] as any).filePath) {
                    visible.value = true;
                    imgFill();
                } else {
                    message.error('还在获取图片地址，稍等一下～～');
                }
            } else {
                message.error('请先上传底图');
            }
        };
        //图片规则
        const beforeUpload = (file: FileItem) => {
            // const isUploaded = checkIfImageUploaded(file.name, newElements.value);
            // if (isUploaded) {
            //     message.error(`${file.name} 图片在其他模块上传过了`);
            //     return false;
            // }
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
            if (!isJpgOrPng) {
                message.error('只能上传 jpg、jpeg、png、gif 格式');
                showUploadListData.value = false
                return false;
            }
            const isLt10M = file.size / 1024 / 1024 <= 10;
            if (!isLt10M) {
                showUploadListData.value = false
                message.error('图片大小不能超过10MB!');
                return false;
            }
            const image = new Image();
            image.src = window.URL.createObjectURL(file);
            return new Promise((resolve, reject) => {
                image.onload = function() {
                  imageWidthS.value = image.width;
                  imageHeightS.value = image.height;
                    if (image.width > 750) {
                        resolve(isJpgOrPng && isLt10M);
                    } else {
                      showUploadListData.value = false
                        message.error('图片宽度应大于750px');
                        reject();
                    }
                    window.URL.revokeObjectURL(image.src);
                };

                image.onerror = function() {
                  
                    message.error('无法加载图片');
                    reject();
                };
            });
        };
          //元素提交 ！！修改
        const addElementSubmit = (): void => {
        //   const hasInvalidElementContent = newElements.value.some((element: any) => 
        //     !element.elementsList || 
        //     element.elementsList.some((el: any) => !el.elementContent)
        // );
        //   console.log(hasInvalidElementContent)
        // if (hasInvalidElementContent) {
        //     message.error('请确保所有元素的内容都已设置');
        //     return; 
        // }
          const param =  newElements.value
    .filter((element: any) => element.name)
    .map((element: any) => ({
        buildingId: element.buildingId,
        elementsList: element.elementsList || [],
        fileDescription: element.fileDescription,
        filePosition: element.filePosition,
        fileName: element.name,
        filePath: element.changePath
    }));
          const params:any = {
            'elementRequestLists':param
          }
          // spinning.value = true;             
            webpageConstructionApi.addElement(params, {}).then((res:any) => {
                if(res.flag==='success'){
                  if(mesg.value){
                  message.success('保存元素成功');
                  mesg.value = true
                  }
                  // spinning.value = false;
                  Verification.value = true
                }else{
                  // spinning.value = false;
                }
                // spinning.value = false;

              })
        };
          //保存元素前先保存seo
        const SEOOK =  (): void => {



            if(activeKey.value=='1'){
              addElementSubmit()

            }else{
              if(!formStateSEO.titleName){
              message.error('请输入页面标题')
              return
            }
              const params = {
                buildingId:formStateSEO.buildingId,
                titleName:formStateSEO.titleName,
                keywordsContent:formStateSEO.keywordsContent,
                descriptionContent:formStateSEO.descriptionContent
            }

            webpageConstructionApi.saveSeoSetting(params, {}).then((res:any) => {
                    if(res.flag === 'success'){
                      message.success('保存SEO成功')
                      Seoification.value = true
                      activeKey.value = '1'                     
                    }
            })
            }
              
        }
        const valuesAreNotEmpty = (valueX: any, valueY: any, valueW: any, valueH: any): boolean => {
    return valueX !== undefined && valueX !== null && valueX !== '' &&
           valueY !== undefined && valueY !== null && valueY !== '' &&
           valueW !== undefined && valueW !== null && valueW !== '' &&
           valueH !== undefined && valueH !== null && valueH !== '';
   }

        //切换类型
        const elementType = (): void => {
          if(valuesAreNotEmpty(valueX.value,valueY.value,valueW.value,valueH.value)){
            if (formState.elementType === '1') {
                const editorInstance = tinymce.get(tinymceId.value);
                const selectionBox = document.querySelector('.selection-box') as HTMLElement;
                if (editorInstance) {
                    editorInstance.setContent('');
                    selectionBox.innerHTML = ''; // Clear content
                    selectionBox.style.fontSize = '';
                    selectionBox.style.fontWeight = 'normal';
                    selectionBox.style.fontStyle = 'normal';
                }
            }
            if (formState.elementType === '2') {
              
                formState.link = '';
            }
          }else{
            message.error('请设置元素位置信息');
            formState.elementType = '1'
          }
        };
        //删除模块
        const deleteModule = (index: number, elements: Element[]): void => {
          // if (elements.length<=1) {
          //   elements.splice(0, 1)
          // }else{
          //   elements.splice(index, 1);
          // }
  Modal.confirm({
    title: '确定删除?',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:red;' }, ''),
    onOk() {
        // console.log(elements.length)
      if (elements.length<=1) {
        elements.splice(0, 1)
      }else{
        elements.splice(index, 1);
      }
      mesg.value = false

      addElementSubmit();
    },
    onCancel() {
      // console.log('Cancel');
    },
    class: 'test',
  });
};
      const moveElementUp = (index: number, elements: Element[]): void => {
        if (index > 0) {
          const temp = elements[index - 1];
          elements[index - 1] = elements[index];
          elements[index] = temp;
        }
        mesg.value = false

        addElementSubmit();
      };

      const moveElementDown = (index: number, elements: Element[]): void => {
        if (index < elements.length - 1) {
          const temp = elements[index + 1];
          elements[index + 1] = elements[index];
          elements[index] = temp;
        }
        mesg.value = false

        addElementSubmit();

      };
        //删除元素
        const deleteElement = (index: number): void => {
          Modal.confirm({
            title: '确定删除?',
            icon: createVNode(ExclamationCircleOutlined),
            content: createVNode('div', { style: 'color:red;' }, ''),
            onOk() {
              const currentModule = newElements.value[selectedIndex.value];
              if (currentModule && currentModule.elementsList) {
                currentModule.elementsList.splice(index, 1);

                // 如果删除了选中的元素，并且元素列表为空，则尝试选择其他模块
                if (index === selectedIndex.value && newElements.value.length > 0) {
                  selectedIndex.value = index > 0 ? index - 1 : 0; // 选择上一个或第一个
                } else if (newElements.value.length === 0) {
                  selectedIndex.value = null; // 如果没有元素，不选择任何东西
                }
              }
              // if (elements.length<=1) {
              //   elements.splice(0, 1)
              // }else{
              //   elements.splice(index, 1);

              // }

            },
            onCancel() {
            },
            class: 'test',
          });
          };
        const resourceFc =() =>{
          if(newElements.value.length>1){
            const imgNameToCheck = (fileList.value[0] as any).imgName; // 使用 any 类型断言
            const existingIndex: number = newElements.value.findIndex((element: any) => element.imgName === imgNameToCheck);
             console.log(imgNameToCheck,existingIndex)
             const currentFile = fileList.value[0] as any; // 使用 any 类型断言

            newElements.value[existingIndex].elementsList = newElements.value[existingIndex].elementsList.filter((item: any) => item.elementType !== '');
            console.log(newElements.value[existingIndex].elementsList,333)
            console.log(newElements.value[existingIndex])
            // newElements.value[imgNameToCheck]
            const newElement: any  = {
                buildingId: newWebPageId.propName,
                elementsList:newElements.value[existingIndex].elementsList,
                fileDescription: formState.fileDescription,
                filePosition: formState.resource,
                imageWidth: newElements.value[existingIndex].imageWidth,
                imageHeight: newElements.value[existingIndex].imageHeight,
                imgName: newElements.value[existingIndex].imgName,
                name: newElements.value[existingIndex].name,
                changePath: newElements.value[existingIndex].changePath,
                fileName: newElements.value[existingIndex].fileName,
                filePath: newElements.value[existingIndex].filePath,
                // filePath: 'https://images.weserv.nl/?url=https://mptst.picclife.cn/dop/iug/staticFile/mytravelinsurance.png',
                // 其他信息
            };
            // debugger
            
            const positionHandlers = {
                '1': () => existingIndex !== -1 ? existingIndex : newElements.value.length,  // 如果存在，则保持位置；否则放在最后。
                '2': () => 0,  // 变为第一个
                '3': () => newElements.value.length // 变为最后一个
            };

            const getPosition = (resource: string): number => {
                if(positionHandlers[resource]) {
                    return positionHandlers[resource]();
                } else {
                    console.error('Unexpected resource value:', resource);
                    return newElements.value.length; // 默认插入到末尾
                }
            }

            // 如果imgName已经存在，则先移除
            if (existingIndex !== -1) {
                newElements.value.splice(existingIndex, 1);
            }

            // 根据formState.resource确定新元素的位置并插入
            const position = getPosition(formState.resource);
            newElements.value.splice(position, 0, newElement);


            visible.value = false;
            console.log(newElements.value)
          }
        }
        //判断底图描述
        const hasDuplicateFileDescription = (): boolean => {
            const descriptionsSet = new Set();

            for (const element of newElements.value) {
                if (descriptionsSet.has(element.fileDescription)) {
                    return true; // 发现重复的 fileDescription
                }
                descriptionsSet.add(element.fileDescription);
            }
            return false; // 没有发现重复
        }

          //保存元素
        const handleOk = (e: MouseEvent) => {

          const imgNameToCheck = (fileList.value[0] as any).imgName; // 使用 any 类型断言
            const existingIndex: number = newElements.value.findIndex((element: any) => element.imgName === imgNameToCheck);
             console.log(imgNameToCheck,existingIndex)
            let elementContent = '';
            const currentFile = fileList.value[0] as any; // 使用 any 类型断言
            if (formState.elementType === '1') {
                if (/^https?:\/\//.test(formState.link)) {
                    elementContent = formState.link;
                } else {
                    message.error('元素内容格式不正确');
                    return
                }

            }
            if (formState.elementType === '2') {
                 elementContent = myValue.value!;
            }
            if (!elementContent) {
                message.error('请填写元素内容');
                return
            }
            const newElementItem = {
              hotspotXAxis: valueX.value,
              hotspotYAxis: valueY.value,
              hotspotWidth: valueW.value,
              hotspotHigh: valueH.value,
              elementType: formState.elementType,
              elementContent: elementContent,
            }
            newElements.value[existingIndex].elementsList = newElements.value[existingIndex].elementsList.filter((item: any) => item.elementType !== '');
            if(changeElement.value){
              newElements.value[existingIndex].elementsList.splice(changeElementNumber.value,1)
             }
            console.log(newElements.value[existingIndex].elementsList,333)
            newElements.value[existingIndex].elementsList.push(newElementItem)

            // newElements.value[imgNameToCheck]
            const newElement: any  = {
                buildingId: newWebPageId.propName,
                elementsList:newElements.value[existingIndex].elementsList,
                fileDescription: formState.fileDescription,
                filePosition: formState.resource,
                imageWidth: currentFile.elementViewportW_,
                imageHeight: currentFile.elementViewportH_,
                imgName: currentFile.imgName,
                name: currentFile.name,
                fileName:currentFile.fileName,
                changePath:currentFile.changePath,
                filePath: currentFile.filePath,
                // filePath: 'https://images.weserv.nl/?url=https://mptst.picclife.cn/dop/iug/staticFile/mytravelinsurance.png',
                // 其他信息
            };
            // debugger
            
            const positionHandlers = {
                '1': () => existingIndex !== -1 ? existingIndex : newElements.value.length,  // 如果存在，则保持位置；否则放在最后。
                '2': () => 0,  // 变为第一个
                '3': () => newElements.value.length // 变为最后一个
            };

            const getPosition = (resource: string): number => {
                if(positionHandlers[resource]) {
                    return positionHandlers[resource]();
                } else {
                    console.error('Unexpected resource value:', resource);
                    return newElements.value.length; // 默认插入到末尾
                }
            }

            // 如果imgName已经存在，则先移除
            if (existingIndex !== -1) {
                newElements.value.splice(existingIndex, 1);
            }

            // 根据formState.resource确定新元素的位置并插入
            const position = getPosition(formState.resource);
            newElements.value.splice(position, 0, newElement);

            restForm()

            visible.value = false;
            console.log(newElements.value)
        };

        onMounted(() => {
          if (moulde_div.value) { // 检查 moulde_div.value 是否存在
        moulde_div.value.style.height = moulde_div.value.offsetHeight + 'px';
        // 其他操作...
    }
            tinymce.init({});
        });
        //视图选框
        const selectionBoxStyle = computed(() => {
          const fileValue = fileList.value[0] as any; // 使用 any 类型断言
            if (fileValue && fileValue.elementViewportW_ && fileValue.elementViewportH_) {
                const imageWidth = fileValue.elementViewportW_;
                const imageHeight = fileValue.elementViewportH_;
                const xPercent = imageWidth * (valueX.value / 100);
                const yPercent = imageHeight * (valueY.value / 100);
                const widthPercent = imageWidth * (valueW.value / 100);
                const heightPercent = imageHeight * (valueH.value / 100);
                return {
                    left: `${xPercent}px`,
                    top: `${yPercent}px`,
                    width: `${widthPercent}px`,
                    height: `${heightPercent}px`,
                };
            } else {
                return {}; // 返回空对象或其他默认样式
            }
        });
</script>
<style lang="less" scoped>
/deep/ .Webpage_submit {
    text-align: right;
}
/deep/ .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #e8380d;
}
/deep/ .ant-tabs-ink-bar {
    background: #e8380d;
}
/deep/ .ant-radio-checked::after {
    border: 1px solid #e8380d;
}
/deep/ .ant-radio-checked .ant-radio-inner {
    border-color: #e8380d;
}
/deep/ .ant-radio-inner::after {
    background-color: #e8380d;
}
/deep/ .ant-spin-spinning{
  position: absolute;
  z-index: 9999;
  left: 40%;
  top: 38%;
}
/deep/  .tox-promotion{
  display: none !important;
}
.red-border {
    border: 1px solid red !important;
  }
 


.init_h {
    height: 100%;
    
}
.init_h9 {
    height: 90%;
}
.init_noColrdiv {
    background-color: #f1f1f1;
    height: 100%;
}
.contentLength-p{
  text-align: right;
  line-height: 10px;
    padding: 0;
    margin: 0;
    padding-top: 10px;
    position: absolute;
    right: 10px;
    bottom: 35px;
  }
.left-area {
    height: 100%;
    overflow-y: auto;
    // padding-bottom: 75px;
}
.element_viewport {
    background-color: transparent;
    width: 60%;
    margin: 0 auto;
    position: relative;
}
// .element_viewport {
//     position: relative;
//     background-color: transparent;
//     width: 100%;
//     height: 100%;
//     overflow: hidden;
// }
.element-canvas {
    position: absolute;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #1e0f0f;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
    word-wrap: break-word;
    z-index: 102;
    p{
      line-height: normal;
    }
}

.selection-box {
    position: absolute;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #ffffff;
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 显示省略号 */
    z-index: 9999;

}

.left-area::-webkit-scrollbar {
    width: 0;
    background: transparent;
}
.webpage_moulde_div {
    // height: 100%;
    padding-bottom: 75px;
}
.svg-icon {
    fill: red;
    margin-left: 10px;
    cursor: pointer;
}
.ant-input-number input::placeholder {
    opacity: 1;
}
.ant-col-1{
  flex: 0 0 2.16666667%;
  max-width: 2.16666667%;
}
.Webpage_moudle {
    width: 100%;
    background-color: #f6f6f6;
    border-radius: 4px;
    height: 80px;
    border: 1px dashed #bcbcbc;
    margin-top: 10px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    z-index: 100;
    cursor: pointer;
}
.tox .tox-notification--in {
  display: none !important;
}

.submitdiv-bottom75 {
    // padding-bottom: 90px;
    position: fixed;
    bottom: 90px;
}
.icon_postion {
    position: relative;
    margin-left: 20px;
    margin-right: 20px;
}
.init_txt_whitespace {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
}
.w-350 {
    width: 350px;
    position: relative;
}
.w-200 {
  width:200px;
  position: relative;
}
/deep/ .init_form .ant-form-item .ant-input-textarea-show-count::after {
    font-size: 11px;
    margin-bottom: -22px;
    position: absolute;
    bottom: 26px;
    right: 11px;
}
/deep/ .init_Form_Element .ant-form-item .ant-input-textarea-show-count::after {
    font-size: 11px;
    margin-bottom: -22px;
    position: absolute;
    bottom: 26px;
    right: 11px;
}
.w-360 {
    width: 360px;
}
.w-380 {
    width: 380px;
}
.webpage_modle_icon_div {
    position: absolute;
    right: -33px;
    top: 3%;
    z-index: 99;
    width: 25px;
    margin-right: 12px;
    span {
        display: inline-block;
        width: 100%;
        text-align: right;
    }
}

.input-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(0, 0, 0, 0.45);
}
.ant-modal-body{
  overflow-y: auto; 
}
.webpage_model_add {
    // width: 100%;
    background-color: #ffffff;
    border-radius: 4px;
    height: 40px;
    border: 1px dashed #bcbcbc;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    line-height: 40px;
    // margin-bottom: 300px;
    cursor: pointer;
    h5 {
        color: #999999;
    }
}

// /deep/ .element-canvas p{  
//     line-height: 15px;
// }
// /deep/ .selection-box p{
//   line-height: 15px;
// }
.element_viewport_border {
    height: 60%;
    background-color: #f2f0f0;
    position: relative;
    .bfc {
        position: absolute;
        top: 0px;
        height: 100%;
        width: 100%;
    }
}
.element_viewport_content {
    display: flex;
    justify-content: center;
    align-content: center;
    // flex-wrap: wrap;
    // overflow-y: auto;
    // overflow: hidden;
    overflow-y: auto;
    height: 95%;
    padding: 5px 0px;
}

.init_flx_btn {
    height: 75px;
    row-gap: 0px;
    // position: absolute;
    bottom: 0px;
    width: 100%;
    left: 9px;
    padding-right: 30px;
    // padding-top: 10px;
    position: fixed;
    margin-left: 250px;
    padding-right: 285px;
    line-height: 75px;
    z-index: 999;
    background-color: #f9f9f9;
}
.Webpage_submit {
    // background-color: #f9f9f9;
    // margin-right: 30px;
    // padding-top: 24px;
    // padding-bottom: 20px;
    height: 100%;
    // margin-right: 267px;

    .ant-btn {
        margin-left: 10px;
        margin-right: 10px;
    }
}
</style>