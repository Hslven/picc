import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { webpageConstructionApi } from '@/libs/api';
import { imgUrl } from '@/libs/getImgUrl'

import {
  message
} from 'ant-design-vue';

interface Element {
  // 定义元素的类型
  // 根据实际情况进行修改
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
// const editorInstance = ref < any > (null); // 引用 TinyMCE 编辑器实例
// const formState = reactive(getInitialFormValues());

const updateSelectionBox = (editorInstance: any, formState: any) => {
  const selectionBox: HTMLElement | null = document.querySelector('.selection-box') as HTMLElement;
  if (editorInstance.value) {
    const content = editorInstance.value.getContent();
    // const fontSize = editorInstance.value.queryCommandValue('FontSize');
    if (formState.elementType == '2') {
      if (content) {
        selectionBox.innerHTML = convertPxToRem(content);
      }
    } else {
      selectionBox.innerHTML = formState.link
    }

  }
};
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
const moveElementUp = (index: number, elements: Element[]): void => {
  if (index > 0) {
    const temp = elements[index - 1];
    elements[index - 1] = elements[index];
    elements[index] = temp;
  }
};

const moveElementDown = (index: number, elements: Element[]): void => {
  if (index < elements.length - 1) {
    const temp = elements[index + 1];
    elements[index + 1] = elements[index];
    elements[index] = temp;
  }
};
// 防抖函数
const debounce = (func: Function, wait: number) => {
  let timeout: any;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
const convertPxToRem = (content: string): string => {
  const pxToRem = (match: string, p1: string): string => {
    const pxValue = parseFloat(p1);
    const remValue = (pxValue / 16).toFixed(2); // 16px为1rem
    return `${remValue}rem`;
  };
  return content.replace(/(\d+)px/g, pxToRem);
};

//元素提交 ！！修改
const addElementSubmit = (newElements: any, spinning: any, mesg: any, Verification: any): void => {
  const param = newElements.value
    .filter((element: any) => element.name)
    .map((element: any) => ({
      buildingId: element.buildingId,
      elementsList: element.elementsList || [],
      fileDescription: element.fileDescription,
      filePosition: element.filePosition,
      fileName: element.name,
      filePath: element.changePath
    }));
  console.log(param)
  const params: any = {
    'elementRequestLists': param
  }

  spinning.value = true;
  webpageConstructionApi.addElement(params, {}).then((res: any) => {
    if (res.flag === 'success') {
      if (mesg.value) {
        message.success('保存元素成功');
        mesg.value = true
      }
      spinning.value = false;
      Verification.value = true
    } else {
      spinning.value = false;
    }
  })
};
const fileDescriptionFc = (fileList: any, newElements: any, formState: any) => {
  const imgNameToCheck = (fileList.value[0] as any).imgName; // 使用 any 类型断言
  const existingIndex: number = newElements.value.findIndex((element: any) => element.imgName === imgNameToCheck);
  newElements.value[existingIndex].fileDescription = formState.fileDescription
}
const resourceFc = (newElements: any, fileList: any, formState: any, visible: any) => {
  if (newElements.value.length > 1) {
    const imgNameToCheck = (fileList.value[0] as any).imgName; // 使用 any 类型断言
    const existingIndex: number = newElements.value.findIndex((element: any) => element.imgName === imgNameToCheck);
    //  console.log(imgNameToCheck,existingIndex)
    const currentFile = fileList.value[0] as any; // 使用 any 类型断言

    newElements.value[existingIndex].elementsList = newElements.value[existingIndex].elementsList.filter((item: any) => item.elementType !== '');
    // console.log(newElements.value[existingIndex].elementsList,333)
    // console.log(newElements.value[existingIndex])
    // newElements.value[imgNameToCheck]
    const newElement: any = {
      buildingId: newElements.value[existingIndex].buildingId,
      elementsList: newElements.value[existingIndex].elementsList,
      fileDescription: formState.fileDescription,
      filePosition: formState.resource,
      imageWidth: newElements.value[existingIndex].imageWidth,
      imageHeight: newElements.value[existingIndex].imageHeight,
      imgName: newElements.value[existingIndex].imgName,
      name: newElements.value[existingIndex].name,
      fileName: newElements.value[existingIndex].fileName,
      changePath: newElements.value[existingIndex].changePath,
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
      if (positionHandlers[resource as keyof typeof positionHandlers]) {
        return positionHandlers[resource as keyof typeof positionHandlers]();
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
    // console.log(newElements.value)
  }
}


//图片切换
const handleChange = (info: any, fileList: any, uniqueValue: any, formState: any, showUploadListData: any, initBuildingId: any, imageWidthS: any, imageHeightS: any, newElements: any, visible: any): void => {

  if (info.file.status === 'done') {
    fileList.value = [{
      uid: info.file.uid,
      name: info.file.name,
      fileName: `${info.file?.response.defmap.data}`,
      imgName: uniqueValue.value,
      changePath: `${info.file?.response.defmap.data}`,
      filePath: `${imgUrl}/dop/iug/staticFile/userFile/market/${info.file?.response.defmap.data}`,
    }] as any;
    formState.fileDescription = ''
    showUploadListData.value = true
    const currentFile = fileList.value[0] as any; // 使用 any 类型断言
    console.log(info)
    const newElement: any = {
      buildingId: initBuildingId.value,
      elementsList: [],
      fileDescription: formState.fileDescription,
      filePosition: formState.resource,
      imageWidth: imageWidthS,
      imageHeight: imageHeightS,
      imgName: currentFile.imgName,
      name: currentFile.name,
      fileName: currentFile.fileName,
      changePath: currentFile.changePath,
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
      if (positionHandlers[resource as keyof typeof positionHandlers]) {
        return positionHandlers[resource as keyof typeof positionHandlers]();
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

    showUploadListData.value = true

    message.error(`${info.file.name} 上传服务器失败`);
  }
};
const handleNumericInput = (valueRef: { value: any }, variableName: string, defaultValue: number,valueY:any,valueX:any,valueW:any,valueH:any) => {
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
      message.error(`选框超出图片范围`);
  }
}
const isValidValue = (value: number): boolean => {
  const isNumber = typeof value === 'number' && !isNaN(value);
  const isInRange = value > 0 && value <= 100;
  return isNumber && isInRange;
}

const selectModuleElement =  (listItem: any,listItemIndex:any,formState:any,valueX:any,valueY:any,valueW:any,valueH:any,myValue:any,changeElement:any,changeElementNumber:any,fileList:any,visible:any,viewportborders:any,elementViewports:any,imageWidth:any,imageHeight:any,editorInstance:any) => {
  // selectModule(element.imgName,element)
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
  showModal(fileList,visible,viewportborders,elementViewports,imageWidth,imageHeight,editorInstance,formState)
}
const showModal = (fileList:any,visible:any,viewportborders:any,elementViewports:any,imageWidth:any,imageHeight:any,editorInstance:any,formState:any) => {
  if (fileList.value[0] ) {
    if (fileList.value[0]  && (fileList.value[0] as any).filePath) {
          visible.value = true;
          imgFill(viewportborders,elementViewports,fileList,imageWidth,imageHeight,editorInstance,formState);
      } else {
          message.error('还在获取图片地址，稍等一下～～');
      }
  } else {
      message.error('请先上传底图和输入底图描述');
  }
};
const imgFill = (viewportborders:any,elementViewports:any,fileList:any,imageWidth:any,imageHeight:any,editorInstance:any,formState:any) => {
  setTimeout(() => {
    const Webpage_moudles = document.querySelector('.Webpage_moudle') as HTMLElement ; // 获取 .element_viewport 元素
    const viewportborder = document.querySelector('.element_viewport_border') as HTMLElement ; // 获取 .element_viewport 元素
    const elementViewportW = Webpage_moudles.offsetWidth;

      const elementViewport = document.querySelector('.element_viewport') as HTMLElement;
      elementViewport.style.width =  `${elementViewportW}px`;
      if (elementViewport && viewportborder) {
          const image = new Image();
          // const imgUrl = 'https://images.weserv.nl/?url=https://mptst.picclife.cn/dop/iug/staticFile/mytravelinsurance.png';
          const imgUrls = fileList.value[0].filePath;
          const Webpage_moudles = document.querySelector('.webpage_moulde_div') as HTMLElement ; // 获取 .element_viewport 元素

          if (imgUrls) {
          const imgName = fileList.value[0].imgName;
          image.src = imgUrls;
          image.onload = function() {
              imageWidth = image.width; // 更新 imageWidth
              imageHeight = image.height; // 更新 imageHeight
              const aspectRatio = image.width / image.height; // 计算宽高比例
              const elementViewportW = Webpage_moudles.offsetWidth - 40;
              const elementViewportH = elementViewportW / aspectRatio;
              // 图片宽度大于高度，设置宽度为100%
              elementViewport.style.backgroundImage = `url(${imgUrls})`;
              elementViewport.style.backgroundSize = '100% auto';
              elementViewport.style.backgroundRepeat = 'no-repeat';
              elementViewport.style.height = `${elementViewportH}px`;
              // viewportborder.style.height = `${elementViewportH}px`;
              const element = document.querySelector('.element_viewport_content') as HTMLElement ;  // 替换为正确的选择器
              if (element.offsetHeight < elementViewportH) {
                element.style.flexWrap = 'inherit';
            } else {
                element.style.flexWrap = 'wrap';
            }
              fileList.value[0] = {
                  imageWidth: imageWidth,
                  imageHeight: imageHeight,
                  elementViewportW_: elementViewportW,
                  elementViewportH_: elementViewportH,
                  filePath: imgUrls,
                  name: fileList.value[0].name,
                  changePath: fileList.value[0].changePath,                            
                  fileName:fileList.value[0].fileName,
                  imgName: imgName,
              } as any;
              setTimeout(() => {
                if(editorInstance.value){
                  updateSelectionBox(editorInstance,formState)
                  // Promise.resolve().then(() => updateSelectionBox(editorInstance,formState));
                }else{
                  const selectionBox: HTMLElement | null = document.querySelector('.selection-box') as HTMLElement;
                  if (selectionBox) {
                    selectionBox.innerHTML = formState.link

                  }
                }
              }, 500);

          };
        }
        updateSelectionBox(editorInstance,formState)
      }
  }, 100); 
};
        //点击模块
        const selectModule = (imgName: string,element:any,selectedImgName:any,newElements:any,selectedIndex:any,changeElement:any,uniqueValue:any,fileList:any,myValue:any,editorInstance:any,formState:any,showUploadListData:any) => {
          selectedImgName.value = imgName;
          console.log(imgName)
          const index = newElements.value.findIndex((e: { imgName: string; }) => e.imgName === imgName);
          selectedIndex.value = index;
          changeElement.value = false
          uniqueValue.value = imgName
          fileList.value = [{
                // uid: element.imgName,
                name: element.name,
                imgName: element.imgName,
                fileName:element.fileName,
                filePath: element.filePath,
                changePath: element.changePath,

            }]as any;
            myValue.value = '';
            editorInstance.value = null;
            formState.link = ''
            formState.elementType ='1'
            const selectionBox = document.querySelector('.selection-box') as HTMLElement;
            if (selectionBox) {
              selectionBox.innerHTML = ''; // Clear content
              selectionBox.style.fontSize = '';
              selectionBox.style.fontWeight = 'normal';
              selectionBox.style.fontStyle = 'normal';
            }
                
            console.log(fileList.value)
            uniqueValue.value = element.imgName
            formState.fileDescription = element.fileDescription;
            formState.resource = element.filePosition || '1';
            if(element.filePath){
            showUploadListData.value = true
            }
        };
                  //保存元素
                  const handleOk = (e: MouseEvent,fileList:any,newElements:any,formState:any,myValue:any,valueX:any,valueY:any,valueW:any,valueH:any,changeElement:any,initBuildingId:any,visible:any,changeElementNumber:any,tinymce:any,tinymceId:any,formRefModel:any) => {

                    const imgNameToCheck = (fileList.value[0] as any).imgName; // 使用 any 类型断言
                      const existingIndex: number = newElements.value.findIndex((element: any) => element.imgName === imgNameToCheck);
                      //  console.log(imgNameToCheck,existingIndex)
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
                      // console.log(newElements.value[existingIndex].elementsList,333)
                      newElements.value[existingIndex].elementsList.push(newElementItem)
          
                      // newElements.value[imgNameToCheck]
                      const newElement: any  = {
                          buildingId: initBuildingId.value,
                          elementsList:newElements.value[existingIndex].elementsList,
                          fileDescription: formState.fileDescription,
                          filePosition: formState.resource,
                          imageWidth: currentFile.elementViewportW_,
                          imageHeight: currentFile.elementViewportH_,
                          imgName: currentFile.imgName,
                          name: currentFile.name,
                          fileName:currentFile.fileName,
                          changePath: currentFile.changePath,
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
                        if (positionHandlers[resource as keyof typeof positionHandlers]) {
                          return positionHandlers[resource as keyof typeof positionHandlers]();
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
          
                      restForm(myValue,tinymce,tinymceId,formRefModel,formState)
          
                      visible.value = false;
                      // console.log(newElements.value)
                  };
                  const restForm = (myValue:any,tinymce:any,tinymceId:any,formRefModel:any,formState:any): void => {
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
                     width: `${elementsList.hotspotWidth}%`,
                     height: `${elementsList.hotspotHigh}%`,
                     position: 'absolute',
                     left: `${elementsList.hotspotXAxis}%`,
                     top: `${elementsList.hotspotYAxis}%`,
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


   
             //保存元素前先保存seo

export { moveElementUp, moveElementDown, debounce, convertPxToRem, getInitialFormValues, updateSelectionBox, addElementSubmit, resourceFc, fileDescriptionFc, handleChange,handleNumericInput,selectModuleElement,showModal,selectModule,handleOk,getElementCanvasStyle,elementTXT,elementStyle };
