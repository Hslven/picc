import { ref } from 'vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { log } from 'console';

/* Props */
export const drawerPopup = ref<boolean>(true);
// 缩略图索引
export const scalePicIndex = ref<number>(0)
export const fileList = ref([]);
export const formRef = ref<FormInstance>()

// 增加同类素材
export const addSimMatPopup = ref<boolean>(false)
/* Event */
export const showDrawerPopup = () => {
  drawerPopup.value = true
  console.log(123)
}

export const disabledDrawer = () =>{
  drawerPopup.value = false
}

export const afterOpenChange = (bool: boolean) => {
  console.log('open', bool);
};

export const carouselOnChange = (current: number) => {
  console.log(current);
};

export const showAddSimMatPopup = () =>{
  addSimMatPopup.value = true
}
export const disabledAddSimMatPopup = () =>{
  addSimMatPopup.value = false
}

// 上传素材
export const handleChange = (info: UploadChangeParam) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};
// 取消操作
export const cleanForm = () => {
  
  // formRef.value.resetFields();
  formRef.value?.resetFields();
  // addSimMatPopup.value = false;
};


