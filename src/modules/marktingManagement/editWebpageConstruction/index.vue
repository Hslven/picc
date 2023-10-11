<template>
  <div class="init_h">
    <div class="Webpage_content init_h">
      <a-row class="init_h" :gutter="[16, 16]">
        <!-- 左侧区域 -->
        <a-col :span="10">
          <div class="left-area" ref="moulde_div">
            <div class="webpage_moulde_div">
              <div class="icon_postion" v-for="(element, index) in newElements" :key="index">
                <div class="Webpage_moudle" ref="webpageMoudleRefs"
                  :class="{ 'red-border': element.imgName === selectedImgName }"
                  @click="handleSelectModule(element.imgName, element)" :style="elementStyle(element)">

                  <div class="element-canvas" v-for="(listItem, listItemIndex) in element.elementsList"
                    :key="listItemIndex" v-html="elementTXT(listItem)" :style="getElementCanvasStyle(element, listItem)">

                  </div>

                </div>
                <div class="webpage_modle_icon_div">
                  <span v-if="index !== 0" @click="moveElementUp(index, newElements)">
                    <svg-icon color="#999" name="up" />
                  </span>
                  <span v-if="index !== newElements.length - 1" @click="moveElementDown(index, newElements)">
                    <svg-icon color="#999" name="down" />
                  </span>
                  <span @click="deleteModule(index, newElements)" v-if="index !== 0">
                    <svg-icon color="#999" name="del" />
                  </span>

                </div>
              </div>


              <a-spin tip="Loading..." :spinning="spinning">
              </a-spin>
              <div>

              </div>
              <div class="webpage_model_add" @click="changeUniqueValue">
                <h5>新增模块</h5>
              </div>
            </div>
          </div>
        </a-col>

        <!-- 分隔栏 -->
        <a-col :span="1" class="init_h">
          <div class="init_noColrdiv" style="background-color: #f1f1f1; height: 100%;"></div>
        </a-col>

        <!-- 右侧区域 -->
        <a-col :span="13">
          <div class="right-area">
            <a-tabs v-model:activeKey="activeKey">
              <!-- 元素设置 Tab -->
              <a-tab-pane key="1" tab="元素设置">
                <!-- 表单 -->
                <a-form :model="formState" ref="formRef" :rules="rules" class="init_Form_Element" :label-col="labelCol"
                  :wrapper-col="wrapperCol">
                  <!-- 上传底图 -->
                  <a-form-item label="底图：" required>
                    <a-space>
                      <a-upload v-model:file-list="fileList" name="file" :multiple="false" :before-upload="beforeUpload"
                        :showUploadList="showUploadListData" action="/dop/iug/zuul/content/file/m/upload.do" :maxCount="1"
                        style="width: 120px" :headers="headers" @change="handleChangeFc">
                        <a-button>
                          <upload-outlined>
                            <svg-icon color="#999" name="back-top" />

                          </upload-outlined>
                          上传图片
                        </a-button>

                      </a-upload>
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>1.宽度要求大于750px的图片</p>
                          <p>2.格式：JPG、JPEG、PNG、GIF</p>
                        </template>
                        <svg-icon color="#1890ff" style="position: absolute;top: 9px;left: 125px;" name="clarification"
                          class="svg-icon" />
                      </a-tooltip>
                    </a-space>
                  </a-form-item>

                  <!-- 底图描述 -->
                  <a-form-item label="底图描述：" name="fileDescription">
                    <a-space>
                      <a-textarea placeholder="请输入底图描述内容" :rows="1" class="w-200" showCount :maxlength="100"
                        @change="handleFileDescriptionFc" v-model:value="formState.fileDescription" />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到img标签的alt属性中</p>
                        </template>
                        <svg-icon color="#1890ff" name="clarification" class="svg-icon" />
                      </a-tooltip>
                    </a-space>

                  </a-form-item>

                  <!-- 帖子类型 -->
                  <a-form-item label="底图位置：" name="resource">
                    <a-radio-group v-model:value="formState.resource" @change="handleResourceFc">
                      <a-radio value="1">顺序</a-radio>
                      <a-radio value="2">吸顶</a-radio>
                      <a-radio value="3">吸底</a-radio>
                    </a-radio-group>
                  </a-form-item>

                  <!-- 元素按钮 -->
                  <a-form-item label="元素：" name="elemental">
                    <a-button type="text" danger @click="handleShowModal">新增</a-button>
                  </a-form-item>
                </a-form>

                <!-- 表格及操作按钮 -->
                <div class="init_h">
                  <a-table :columns="tableColumns" :dataSource="currentelementsList" :pagination="false"
                    :scroll="{ y: 140 }">
                    <template #bodyCell="{column,record,index}">
                      
                    
                    <template v-if="column.key == 'indexkey' ">
                      <div>
                        <p class="init_txt_whitespace">{{ index + 1 }}</p>
                      </div>
                    </template>
                    <template v-if="column.dataIndex == 'elementType'">
                      <div>
                        <p class="init_txt_whitespace" v-if="record.elementType == '1'">链接</p>
                        <p class="init_txt_whitespace" v-else>文字</p>
                      </div>
                    </template>
                    <template v-if="column.dataIndex == 'elementContent'">
                      <div>
                        <p class="init_txt_whitespace" :title="stripHtmlTags(record.elementContent)">{{
                          stripHtmlTags(record.elementContent) }}</p>
                      </div>
                    </template>

                    <template  v-if="column.dataIndex === 'action'">
                      <a @click="handleSelectModuleElement(record, index)" class="editApp">编辑</a>
                      <a @click="deleteElement(index)" class="deleteApp">删除</a>
                    </template>
                  </template>
                    <!-- 表格内容 -->
                  </a-table>


                </div>
                <a-row class="submitdiv-bottom75">
                  <a-col :span="12" style="margin-top: 25px;">
                    <!-- <a-button
                      @click="clearElement"
                        style="margin-right: 20px;"
                      >取消</a-button> -->
                    <a-button type="primary" @click="SEOOK" danger>保存元素</a-button>
                  </a-col>
                </a-row>
              </a-tab-pane>

              <!-- SEO设置 Tab -->

              <a-tab-pane key="2" tab="SEO设置" force-render>
                <!-- <a-tooltip placement="rightTop">
                <template #title>
                  <span>prompt text</span>
                </template>
                <a-button>RT</a-button>
              </a-tooltip> -->

                <a-form :model="formStateSEO" :rules='SEOrules' :label-col="labelCol" class="init_form"
                  :wrapper-col="wrapperCol">
                  <a-form-item label="页面标题：" name="titleName">
                    <a-space>
                      <a-textarea placeholder="请输入页面标题内容" class="w-350" :rows="1" showCount :maxlength="200"
                        v-model:value="formStateSEO.titleName" />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到head节点的title标签内</p>
                        </template>
                        <svg-icon color="#1890ff" name="clarification" class="svg-icon" />
                      </a-tooltip>
                    </a-space>
                  </a-form-item>
                  <a-form-item label="页面关键字：" name="keywordsContent">
                    <a-space>
                      <a-textarea placeholder="请输入页面关键字内容" class="w-350" :rows="1" showCount :maxlength="200"
                        v-model:value="formStateSEO.keywordsContent" />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到head节点的meta标签内，name为keywords，content为此处录入的值</p>
                        </template>
                        <svg-icon color="#1890ff" name="clarification" class="svg-icon" />
                      </a-tooltip>
                    </a-space>
                  </a-form-item>
                  <a-form-item label="页面描述：" name="descriptionContent">

                    <a-space>
                      <a-textarea v-model:value="formStateSEO.descriptionContent" class="w-350" placeholder="请输入页面描述内容"
                        :rows="6" showCount :maxlength="1000" />
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <p>放到head节点的meta标签内，name为description，content为此处录入的值</p>
                        </template>
                        <svg-icon color="#1890ff" name="clarification" class="svg-icon" />
                      </a-tooltip>
                    </a-space>
                  </a-form-item>
                </a-form>
                <a-row class="submitdiv-bottom75">
                  <a-col :span="12" style="margin-top: 25px;">

                    <a-button type="primary" @click="SEOOK" danger>保存SEO</a-button>
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
              <a-button type="primary" @click="onSaveSeoSetting" danger>提交</a-button>
              <!-- <a-button>取消</a-button> -->
            </div>
          </a-col>
        </a-row>
      </a-row>

    </div>
    <!-- 新增元素弹窗 -->
    <a-drawer v-model:visible="visible" width="60%" title="新增元素" @close="cancel">
      <!-- 元素视图区域 -->
      <div class="element_viewport_border" ref="viewportborders">
        <div class="bfc">
          <div class="element_viewport_content">
            <div class="element_viewport" ref="elementViewports">
              <div class="selection-box" :style="selectionBoxStyle" draggable="true" @dragstart="handleDragStart"
                @drag="handleOnDrag" @dragend="handleOnDragEnd"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 元素属性设置表单 -->
      <a-row>
        <a-col :span="24">
          <div class="element_form">
            <a-form :model="formState" :label-col="labelCol" :forceRender="true" :rules="rules" ref="formRefModel"
              :wrapper-col="wrapperCol">
              <a-form-item label="元素类型：" name="elementType">
                <a-radio-group v-model:value="formState.elementType" @change="elementType">
                  <a-radio value="1">链接</a-radio>
                  <a-radio value="2">文字</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item label="位置：" required>
                <a-input-number :formatter="value => `X ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\X\s?|(,*)/g, '')" class="gray-x-input" placeholder="请输入大于0的数值"
                  v-model:value="valueX" style="width: 165px;margin-right: 20px;" @blur="inputX" />
                <a-input-number suffix="Y" :formatter="value => `Y ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\Y\s?|(,*)/g, '')" class="gray-x-input" placeholder="请输入大于0的数值"
                  v-model:value="valueY" style="width: 165px;" @blur="inputY" />
              </a-form-item>

              <a-form-item label="大小：" required>
                <a-input-number :formatter="value => `W ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  class="gray-x-input" :parser="value => value.replace(/W\s?|,/g, '')" placeholder="请输入大于0的数值"
                  v-model:value="valueW" style="width: 165px;margin-right: 20px;" @blur="inputW" />
                <a-input-number :formatter="value => `H ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  class="gray-x-input" :parser="value => value.replace(/\H\s?|(,*)/g, '')" placeholder="请输入大于0的数值"
                  v-model:value="valueH" style="width: 165px;" @blur="inputH" />
              </a-form-item>
              <a-form-item label="元素内容：" required>
                <a-input placeholder="请输入http://或https://开头的链接网址" v-model:value="formState.link"
                  v-if="formState.elementType === '1'" />
                <div v-if="formState.elementType === '2'">
                  <Editor :init="init" v-model="myValue" :id="tinymceId" style="width: 100%;" />
                  <!-- <p class="contentLength-p">{{ contentLength }}/100</p> -->

                </div>
              </a-form-item>
            </a-form>
          </div>
        </a-col>
      </a-row>
      <div :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 99,
      }">
        <a-button style="margin-right: 8px" @click="cancel">取消</a-button>
        <a-button type="danger" @click="handleHandleOk">保存</a-button>
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
          onMounted,
          watch,
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
        import { imgUrl } from '@/libs/getImgUrl'

        import {
          addElementSubmit,
          resourceFc,
          handleChange,
          handleNumericInput,
          fileDescriptionFc,
          selectModule,
          handleOk,
          getElementCanvasStyle,
          elementTXT,
          elementStyle,
          selectModuleElement,
          showModal,
          debounce
        } from '@/libs/webpageConstruction/elementUtils';
        import {
          valueX,valueY,valueW,valueH,myValue,imageWidth,imageHeight,headers,
          tableColumns,spinning,Verification,mesg,elementViewports,viewportborders,
          formRef,formRefModel,changeElement,changeElementNumber,
          isDragging,activeKey,offsetX,offsetY,prevX,prevY,showUploadListData,imageWidthS,imageHeightS,
          webpageMoudleRefs,moulde_div,newElements,editorInstance,visible,selectedIndex,rules,SEOrules,
          initBuildingId
        } from '@/libs/webpageConstruction/constants'; 
        import { FormState, FormStateSEO, FileInfo, ElementInfo, FileItem, Element } from '@/libs/webpageConstruction/elementType';

        import {
          onDragStart, onDragEnd, onDrag
        } from '@/libs/webpageConstruction/dragUtils';
        import { getTinymceInit } from '@/libs/webpageConstruction/tinymceSetup';


        //在js中引入所需的主题和组件
        import tinymce from 'tinymce/tinymce';
        import Editor from '@tinymce/tinymce-vue';
        import 'tinymce/themes/silver';
        import 'tinymce/themes/silver/theme';
        import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
        import 'tinymce/models/dom';
        //在TinyMce.vue中接着引入相关插件
        import moment, { Moment } from 'moment';
        import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
        import { Modal } from 'ant-design-vue';

        import 'tinymce/icons/default/icons';
        import 'tinymce/plugins/table'; // 插入表格插件
        import 'tinymce/plugins/lists'; // 列表插件
        import 'tinymce/plugins/wordcount'; // 字数统计插件
        import 'tinymce/plugins/code'; // 
        // 自定义插件
        import '../../../../public/tinymce/plugin/letterspacing/plugin' // 字间距
        const generateUniqueValue = (): string => {
          return new Date().getTime().toString() + Math.random().toString(36).substring(2);
        };        
        const editBuildData = defineProps<{
          propName: string | any[];
        }>();
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
        const getDefaultFormState = (): FormStateSEO => ({
          buildingId: initBuildingId.value, // 这里确保 newWebPageId.propName 是已知的
          titleName: '',
          keywordsContent: '',
          descriptionContent: ''
        });
        const formState = reactive(getInitialFormValues());

  
        const labelCol = {
          span: 4
        }
        const wrapperCol = {
          span: 14
        }
        const formStateSEO: UnwrapRef<FormStateSEO> = reactive(getDefaultFormState());
          const uniqueValue: Ref<string> = ref(generateUniqueValue());
            const selectedImgName: Ref<string | null> = ref(uniqueValue.value);
              const fileList: Ref<FileItem[]> = ref([]);

        const emit = defineEmits();
          //拖拽视图逻辑
        const handleDragStart = (event: MouseEvent) => {
          onDragStart(event, fileList, selectionBoxStyle, offsetX, offsetY, isDragging);
        };
        const handleOnDrag = (event: MouseEvent) => {
          onDrag(event, fileList, selectionBoxStyle, offsetX, offsetY, isDragging, prevX, prevY);
        };
        const handleOnDragEnd = () => {
          onDragEnd(isDragging, valueX, valueY, prevX, prevY);
        };
        //上传图片
        const handleChangeFc = (info: any) => {
          handleChange(info, fileList, uniqueValue, formState, showUploadListData, initBuildingId, imageWidthS, imageHeightS, newElements, visible);
        };
        //点击模块
        const handleSelectModule = (imgName: string, element: string) => {
          selectModule(imgName, element, selectedImgName, newElements, selectedIndex, changeElement, uniqueValue, fileList, myValue, editorInstance, formState, showUploadListData)
        }
        //保存元素
        const handleHandleOk = (e: MouseEvent) => {
          handleOk(e, fileList, newElements, formState, myValue, valueX, valueY, valueW, valueH, changeElement, initBuildingId, visible, changeElementNumber, tinymce, tinymceId, formRefModel)
        }
               //图片规则
         const beforeUpload = (file: FileItem) => {
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
        //新增模块
        const changeUniqueValue = (): void => {
          if (newElements.value.length === 0 || (newElements.value[newElements.value.length - 1].filePath && newElements.value[newElements.value.length - 1].filePath.trim() !== '')) {
            uniqueValue.value = generateUniqueValue();
            const uniqueModule = {
              buildingId: initBuildingId.value,
              imgName: uniqueValue.value,
              elementsList: [
                {
                  hotspotXAxis: 0,
                  hotspotYAxis: 0,
                  hotspotWidth: 0,
                  hotspotHigh: 0,
                  elementType: '',
                  elementContent: '',
                }
              ],
              fileDescription: '',
              filePosition: '',
              imageWidth: '',
              imageHeight: '',
              name: '',
              filePath: '',
            };
            newElements.value.push(uniqueModule);
            Verification.value = false;
            selectModule(uniqueValue.value, uniqueModule, selectedImgName, newElements, selectedIndex, changeElement, uniqueValue, fileList, myValue, editorInstance, formState, showUploadListData)

          } else {
            message.error('请先设置上一个模块！')
            // console.log('请先设置上一个模块！');  
          }
        };
        //复文框框
        const tinymceId = ref('vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''));

        const init = reactive(getTinymceInit(tinymceId, editorInstance, formState))
        const stripHtmlTags = text => {
          if (!text) return '';

          // 使用浏览器的DOM来解析HTML实体
          const textarea = document.createElement('textarea');
          textarea.innerHTML = text;
          const decodedText = textarea.value;

          // 使用正则表达式删除HTML标签
          return decodedText.replace(/<\/?[^>]+(>|$)/g, '');
        };
        //清空方法
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
            emit('cancelAdd', false, '1')
        }
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
        //提交保存元素
        const SEOOK = (): void => {
              if (activeKey.value == '1') {
                mesg.value = true

                addElementSubmit(newElements, spinning, mesg, Verification);
    
              } else {
                if (!formStateSEO.titleName) {
                  message.error('请输入页面标题')
                  return
                }
                const params = {
                  buildingId: initBuildingId.value,
                  titleName: formStateSEO.titleName,
                  keywordsContent: formStateSEO.keywordsContent,
                  descriptionContent: formStateSEO.descriptionContent
                }
    
                webpageConstructionApi.saveSeoSetting(params, {}).then((res: any) => {
                  if (res.flag === 'success') {
                    message.success('保存SEO成功')
                    activeKey.value = '1'
                  }
                })
              }
            }
        //消息元素
        const cancel = (): void => {
          // formRefModel.value.resetFields();
          visible.value = false;
        }
        //提交生成页面
        const onSaveSeoSetting = (): void => {
          // const params = {
          //   buildingId: localStorage.get('newWebPageId'),
          //     buildingLink: '<p>232323</p>'.replace(/\s+/g, '')
          // }
          if (!formStateSEO.titleName) {
            message.error('请输入页面标题')
            return
          }else{
            const params = {
                  buildingId: initBuildingId.value,
                  titleName: formStateSEO.titleName,
                  keywordsContent: formStateSEO.keywordsContent,
                  descriptionContent: formStateSEO.descriptionContent
                }
    
                webpageConstructionApi.saveSeoSetting(params, {}).then((res: any) => {
                  if (res.flag === 'success') {
                    // message.success('保存SEO成功')
                    // activeKey.value = '1'
                  }
                })
          }
          if (newElements.value
            && newElements.value.length > 0
            && newElements.value[0]
            && newElements.value[0].filePath) {
            mesg.value = false
            addElementSubmit(newElements, spinning, mesg, Verification);
            addWebBuildingContentMethod()
          } else {
            // 
            message.error('请先设置和保存元素')
          }
        }
        const addWebBuildingContentMethod = (): void => {
          const fullHTML = generateFullHTML(newElements.value, formStateSEO);
          let params: any = {
              htmlString: fullHTML,
              buildingId: initBuildingId.value
            };

            if (editBuildData.propName.buildingId) {
              params.htmlFileName = editBuildData.propName.buildingLink;
            }


          webpageConstructionApi.addWebBuildingContent(params, {}).then(res => {
            // console.log(res)
            if (res.flag === 'success') {
              message.success('生成H5页面成功')
              setTimeout(() => {
                
                emit('cancelAdd', true, '1');
              }, 100)
            }
          })
        }
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
        // 使用防抖包装你的输入函数
        const debouncedHandleH = debounce((e: any) => handleNumericInput(valueH, 'valueH', 30, valueY, valueX, valueW, valueH), 300);
        const debouncedHandleW = debounce((e: any) => handleNumericInput(valueW, 'valueW', 40, valueY, valueX, valueW, valueH), 300);
        const debouncedHandleX = debounce((e: any) => handleNumericInput(valueX, 'valueX', 1, valueY, valueX, valueW, valueH), 300);
        const debouncedHandleY = debounce((e: any) => handleNumericInput(valueY, 'valueY', 1, valueY, valueX, valueW, valueH), 300);

        const inputH = (e: any) => debouncedHandleH(e);
        const inputW = (e: any) => debouncedHandleW(e);
        const inputX = (e: any) => debouncedHandleX(e);
        const inputY = (e: any) => debouncedHandleY(e);
        //修改元素
        const handleSelectModuleElement = (listItem: any, listItemIndex: any) => {
          selectModuleElement(listItem, listItemIndex, formState, valueX, valueY, valueW, valueH, myValue, changeElement, changeElementNumber, fileList, visible,viewportborders, elementViewports, imageWidth, imageHeight, editorInstance)
        }
        //点击新增元素
        const handleShowModal = () => {
          // visible.value =true
          // return
          // selectModule(imgName, element, selectedImgName, newElements, selectedIndex, changeElement, uniqueValue, fileList, myValue, editorInstance, formState, showUploadListData)
          formState.elementType = '1';
          valueX.value = 1;
          valueY.value = 1;
          valueW.value = 40;
          valueH.value = 30
          formState.link = '';
          myValue.value = '';
          showModal(fileList, visible,viewportborders, elementViewports, imageWidth, imageHeight, editorInstance, formState)
        }
        //判断底图名称是否重复
        const handleFileDescriptionFc = () => {
          fileDescriptionFc(fileList, newElements, formState)
        }
        //右侧模块位置切换
        const handleResourceFc = () => {
          resourceFc(newElements, fileList, formState, visible)

        }


        //视图选框
        const selectionBoxStyle = computed(() => {
          const fileValue = fileList.value[0] as any; // 使用 any 类型断言
          // console.log(fileValue)
          if (fileValue && fileValue.elementViewportW_ && fileValue.elementViewportH_) {
            const imageWidth = fileValue.elementViewportW_;
            const imageHeight = fileValue.elementViewportH_;
            const xPercent = imageWidth * (valueX.value / 100);
            const yPercent = imageHeight * (valueY.value / 100);
            const widthPercent = imageWidth * (valueW.value / 100);
            const heightPercent = imageHeight * (valueH.value / 100);
            return {
              left: `${valueX.value}%`,
              top: `${valueY.value}%`,
              width: `${valueW.value}%`,
              height: `${valueH.value}%`,
            };
          } else {
            return {}; // 返回空对象或其他默认样式
          }
        });
        const valuesAreNotEmpty = (valueX: any, valueY: any, valueW: any, valueH: any): boolean => {
          return valueX !== undefined && valueX !== null && valueX !== '' &&
            valueY !== undefined && valueY !== null && valueY !== '' &&
            valueW !== undefined && valueW !== null && valueW !== '' &&
            valueH !== undefined && valueH !== null && valueH !== '';
        }

        //切换类型
        const elementType = (): void => {
          if (valuesAreNotEmpty(valueX.value, valueY.value, valueW.value, valueH.value)) {
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
          } else {
            message.error('请设置元素位置信息');
            formState.elementType = '1'
          }
        };
        //删除模块
        const deleteModule = (index: number, elements: Element[]): void => {
          Modal.confirm({
            title: '确定删除?',
            icon: createVNode(ExclamationCircleOutlined),
            content: createVNode('div', { style: 'color:red;' }, ''),
            onOk() {
              // console.log(elements.length)
              if (elements.length <= 1) {
                elements.splice(0, 1)
              } else {
                elements.splice(index, 1);
              }
              mesg.value = false

              addElementSubmit(newElements, spinning, mesg, Verification);

            },
            onCancel() {
              // console.log('Cancel');
            },
            class: 'test',
          });
        };
        //左侧模块位置移动逻辑
        const moveElementUp = (index: number, elements: Element[]): void => {
          if (index > 0) {
            const temp = elements[index - 1];
            elements[index - 1] = elements[index];
            elements[index] = temp;
          }
          mesg.value = false

          addElementSubmit(newElements, spinning, mesg, Verification);
        };

        const moveElementDown = (index: number, elements: Element[]): void => {
          if (index < elements.length - 1) {
            const temp = elements[index + 1];
            elements[index + 1] = elements[index];
            elements[index] = temp;
          }
          mesg.value = false
          addElementSubmit(newElements, spinning, mesg, Verification);

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

            },
            onCancel() {
            },
            class: 'test',
          });
        };
        //异步执行图片加载按顺序
        const loadImageData = async (element) => {
          return new Promise((resolve, reject) => {
            // console.log(element)
            const imgUrls = `${imgUrl}/dop/iug/staticFile/userFile/market/${element.filePath}`;
            // console.log(imgUrls)
            // const imgUrls = 'http://b.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9ea5c0e3c23d139b6003bf3b374.jpg';
            if (!imgUrls) {
              reject(new Error('Invalid Image URL'));
              return;
            }

            const image = new Image();
            image.src = imgUrls;
            const uniqueValueForThisElement = generateUniqueValue();
            // console.log(uniqueValue.value)
            image.onload = () => {
              const elementsListTb = element.elementsList.map((ele) => ({
                elementType: ele.elementType,
                elementContent: ele.elementContent,
                hotspotXAxis: ele.hotspotXAxis,
                hotspotYAxis: ele.hotspotYAxis,
                hotspotHigh: ele.hotspotHigh,
                hotspotWidth: ele.hotspotWidth,
              }));

              resolve({
                buildingId: element.buildingId,
                elementsList: elementsListTb,
                fileDescription: element.fileDescription,
                filePosition: element.filePosition,
                imageWidth: image.width,
                imageHeight: image.height,
                imgName: uniqueValueForThisElement,
                fileName: element.fileName || element.filePath,
                name: element.fileName || element.filePath,
                changePath: element.filePath,
                filePath: imgUrls,
              });
            };
          });
        };
        //编辑网页搭建回显
        const fetchApiData = async () => {
          spinning.value = true;

          const { buildingId, titleContent, keywordsContent, descriptionContent } = editBuildData.propName || {};

          if (buildingId) {
            formStateSEO.titleName = titleContent;
            formStateSEO.keywordsContent = keywordsContent;
            formStateSEO.descriptionContent = descriptionContent;
          }

          try {
            const res = await webpageConstructionApi.queryElementByBuildingId({ buildingId }, {});
            if (res.flag !== 'success') {


              throw new Error('API returned with a non-success flag.');

            }
            const imagePromises = res.defmap.elementRequestLists.map(loadImageData);
            newElements.value = await Promise.all(imagePromises);
            // changeUniqueValue()
            if (newElements.value[0]) {
              selectModule(newElements.value[0].imgName, newElements.value[0],selectedImgName, newElements, selectedIndex, changeElement, uniqueValue, fileList, myValue, editorInstance, formState, showUploadListData)

            }
            // console.log(newElements.value)

          } catch (error) {
            console.error('Error:', error.message);
            changeUniqueValue()

          } finally {
            spinning.value = false;
          }
        };
        //传值变化触发
        watch(() => editBuildData.propName, (newValue, oldValue) => {
            if (newValue !== oldValue) {
              inits()
            }
            
        });
        const inits = () =>{
          restForm()
          resetAllStates()
          spinning.value = false;
          const moulde_divs = document.querySelector('.left-area') as HTMLElement ; // 获取 .element_viewport 元素

          if (moulde_divs) { 
            moulde_divs.style.height = moulde_divs.offsetHeight + 'px';

            // 其他操作...
          }
          tinymce.init({});

          if (editBuildData.propName.buildingId) {
            initBuildingId.value = editBuildData.propName.buildingId
            fetchApiData()

          } else {
            spinning.value = true
            // initBuildingId.value = editBuildData.propName
            const delSinParam = {
		        }
            webpageConstructionApi.addOrDelWebBuilding(delSinParam, {}).then((res:any) => {
              initBuildingId.value= res.defmap.data;

               changeUniqueValue()
               spinning.value = false


            })

          }
        }
        onMounted(() => {
          inits()
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

/deep/ .ant-spin-spinning {
  position: absolute;
  z-index: 9999;
  left: 40%;
  top: 38%;
}

/deep/ .tox-promotion {
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

.contentLength-p {
  text-align: right;
  line-height: 10px;
  padding: 0;
  margin: 0;
  padding-top: 10px;
  position: absolute;
  right: 10px;
  bottom: 35px;
}

.ant-col-1 {
  flex: 0 0 2.16666667%;
  max-width: 2.16666667%;
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

  p {
    line-height: normal;
  }
}
.selection-box {
  position: absolute;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #ffffff;
  overflow: hidden;
  /* 隐藏溢出内容 */
  text-overflow: ellipsis;
  /* 显示省略号 */
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

.submitdiv-bottom75 {
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
  margin-bottom: 0;
  white-space: nowrap;
}

.w-350 {
  width: 350px;
  position: relative;
}

.w-200 {
  width: 200px;
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

// /deep/ .element-canvas p{  
//     line-height: 15px;
// }
// /deep/ .selection-box p{
//   line-height: 15px;
// }
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

.ant-modal-body {
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
.deleteApp {
	width: 28px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #E8380D;
	line-height: 20px;
}
.editApp {
	margin-right: 10px;
	width: 28px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #3F64F5;
	line-height: 20px;
}
/deep/ .ant-drawer-header{
	padding: 16px 24px !important;
}
</style>