<template>
  <div>
    <editor v-model="myValue" :init="init" :disabled="disabled" :id="tinymceId"></editor>
    <!-- //选择产品抽屉 -->
		<a-drawer width="1100" v-model:visible="previewForm" class="custom-class" title="添加产品" placement="right">
			<pro-list :choosePro="previewForm" @changePro="changePro" @changeProList="changeProList"/>
		</a-drawer>
		<!-- 选择活动 -->
		<a-drawer width="1100" v-model:visible="actionForm" class="custom-class" title="添加活动" placement="right">
			<action-list :choosePro="actionForm" @changeAction="changeAction" @changeActionList="changeActionList"/>
		</a-drawer>
		<!-- 选择话题 -->
		<a-drawer width="1100" v-model:visible="topicForm" class="custom-class" title="添加话题" placement="right">
			<topic-list :choosePro="topicForm" @changeTopic="changeTopic" @changeTopicList="changeTopicList"/>
		</a-drawer>
		<!-- 选择素材 -->
		<a-drawer width="1100" v-model:visible="materialForm" class="custom-class" title="添加素材" placement="right">
			<material-list :choosePro="materialForm" @changeMaterial="changeMaterial" @changeMaterialList="changeMaterialList"/>
		</a-drawer>
  </div>
  <!-- <editor v-model="myValue" :init="init" :disabled="disabled" :id="tinymceId"></editor> -->
</template>


<script setup lang="ts">
//JS部分
//在js中引入所需的主题和组件
import tinymce from 'tinymce/tinymce'
import 'tinymce/skins/content/default/content.css'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom' // 这里是个坑 一定要引入
//在TinyMce.vue中接着引入相关插件
import "tinymce/icons/default/icons"
// import "tinymce/plugins/image" // 插入上传图片插件
// import "tinymce/plugins/media" // 插入视频插件
import "tinymce/plugins/table" // 插入表格插件
import "tinymce/plugins/lists" // 列表插件
import "tinymce/plugins/wordcount" // 字数统计插件
import "tinymce/plugins/code" // 源码
// import "tinymce/plugins/fullscreen" //全屏

//接下来定义编辑器所需要的插件数据
import { reactive, ref, computed } from "vue"
import { onMounted, defineEmits, watch } from "@vue/runtime-core"
import axios from 'axios'
import proList from './components/proList.vue'
import topicList from './components/topicList.vue'
import materialList from './components/materialList.vue'
import actionList from './components/actionList.vue'
import store from '@/modules/conTent/store';
import { useRoute } from 'vue-router'
import { baseApi, ResponseData } from '@/libs/BaseApi';
import { imgUrl } from '@/libs/getImgUrl'
// import { updateImg } from '@/api/order/order'
let route = useRoute()
let state:any = store.state
//获取html
function getFileHtml(value:any) {
  baseApi.post('/content/file/downloadHtml/c/' + value, {}, 'lc').then((res:any) => {
    myValue.value = res
  });
}
let previewForm = ref(false)
let actionForm = ref(false)
let topicForm = ref(false)
let materialForm = ref(false)
const emits = defineEmits(["getContent","posterImgTextData"])
//这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
const props = defineProps({
  value: {
    type: String,
    default: () => {
      return ""
    },
  },
  baseUrl: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  plugins: {
    type: [String, Array],
    default: "code lists",
  },//必填
  toolbar: {
    type: [String, Array],
    default:
      "undo redo | formatselect | fontselect | fontsizeselect | forecolor backcolor | bullist numlist outdent indent | removeformat | titleButton materialButton acitonButton proButton",
  },//必填
})
//用于接收外部传递进来的富文本
const myValue = ref(props.value)
const tinymceId = ref("vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""))
//定义一个对象 init初始化
const init = reactive({
  selector: '#' + tinymceId.value, //富文本编辑器的id,
  language_url: process.env.BASE_URL + "tinymce/langs/zh-Hans.js", // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
  language: "zh-Hans", //语言
  skin_url: process.env.BASE_URL + "tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
  height: 400, //编辑器高度
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: true, //顶部菜单栏显示
  image_dimensions: false, //去除宽高属性
  plugins: props.plugins,  //这里的数据是在props里面就定义好了的
  toolbar: props.toolbar, //这里的数据是在props里面就定义好了的
  font_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', //字体
  fontsize_formats: '11px 12px 14px 16px 18px 24px 36px 48px 64px 72px', //文字大小
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  paste_webkit_styles: "all",
  paste_merge_formats: true,
  promotion: false,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  file_picker_types: 'file',
  content_css: '/tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  //图片上传
  // images_upload_handler: (file:any,blobInfo:any, progress:any) => new Promise((resolve, reject) => {
	// 	console.log(myValue.value,'value')
	// 	console.log(blobInfo,'blobInfo')
	// 	console.log(file,'file')
  //   if (blobInfo.blob().size / 1024 / 1024 > 2) {
  //     reject({ message: '上传失败，图片大小请控制在 2M 以内', remove: true })
  //     return
  //   } else {
  //     const ph = import.meta.env.VITE_BASE_PATH + ":" + import.meta.env.VITE_SERVER_PORT + "/"
  //     let params = new FormData()
  //     params.append('file', blobInfo.blob())

  //     let config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",

  //       }
  //     }

  //     axios.post('xxxx', params, config).then(res => {
  //       if (res.data.code == 200) {
  //         resolve(ph + res.data.msg)  //上传成功，在成功函数里填入图片路径
  //       } else {
  //         reject('HTTP Error: 上传失败' + res.data.code);
  //         return
  //       }
  //     }).catch(() => {
  //       reject('上传出错，服务器开小差了呢')
  //       return
  //     })
  //   }
  // }),

  //自定义按钮-编辑获取富文本内容
  setup: (editor:any) => {
    editor.ui.registry.addButton("titleButton", {
      text: "话题",
      onAction: function() {
        topicForm.value = true
      }
    });
    editor.ui.registry.addButton("materialButton", {
      text: "素材",
      onAction: function() {
        materialForm.value = true
      }
    });
    editor.ui.registry.addButton("acitonButton", {
      text: "活动",
      onAction: function() {
        actionForm.value = true
      }
    });
    editor.ui.registry.addButton("proButton", {
      text: "产品",
      onAction: function() {
        previewForm.value = true
      }
    });
		if(route.query.editType === '1'){
      let editContent = state.editContent.editContentList
      if(editContent.contentType === 't' || editContent.contentType === 'pr'){
        getFileHtml(editContent.contentFile)
      }
    }
  },
})
//添加产品确定后关闭抽屉
function changePro(value:any){
	previewForm.value = value
}
//添加产品赋值富文本
function changeProList(value:any){
	let proList:any = []
	console.log(value,'value')
	value.forEach((res:any) => {
		proList.push(`<p>产品：${res.titleName}:</p><img style="width:300px;height:200px" src="/dop/iug/zuul/reach/file/downloadImageOrVideo/c/${res.horizontalCoverFile}">`)
	})
  myValue.value = myValue.value + proList
	emits('posterImgTextData',myValue.value)
}
//选择活动抽屉
function changeAction(value:any){
	actionForm.value = value
}
function changeActionList(value:any){
	let actionList:any = []
	value.forEach((res:any) => {
		actionList.push(`<p>活动：${res.titleName}:</p><img style="width:300px;height:200px" src="/dop/iug/zuul/reach/file/downloadImageOrVideo/c/${res.horizontalCoverFile}">`)
	})
  myValue.value = myValue.value + actionList
	emits('posterImgTextData',myValue.value)
}
//选择话题抽屉
function changeTopic(value:any){
  topicForm.value = value
}
function changeTopicList(value:any){
	let topicList:any = []
	value.forEach((res:any) => {
		topicList.push(`<p>话题：${res.contentLink}</p>`)
	})
	myValue.value = myValue.value + topicList
	emits('posterImgTextData',myValue.value)
}
//选择素材抽屉
function changeMaterial(value:any){
	materialForm.value = value
}
function changeMaterialList(value:any){
	console.log(process.env.NODE_ENV)
	let materialList:any = []
	value.forEach((res:any) => {
		console.log(res,'res')
		if(res.chooseMateriaValue === true){
			if(res.material_file_type === 'mp4'){
				materialList.push(`<video style="width:100%" src='${imgUrl}/dop/iug/zuul/reach/file/downloadImageOrVideo/s/${res.material_file_path}' controls preload="auto"></video>`)
			} else if(res.material_file_type !== 'mp4') {
				materialList.push(`<img style="width:100%" src='${imgUrl}/dop/iug/zuul/reach/file/downloadImageOrVideo/s/${res.material_file_path}'>`)
			}
		}
	})
	myValue.value = myValue.value + materialList
	emits('posterImgTextData',myValue.value)
}
//监听外部传递进来的的数据变化
watch(
  () => props.value,
  () => {
    myValue.value = props.value
    emits("getContent", myValue.value)
    emits("posterImgTextData", myValue.value)
  }
)
//监听富文本中的数据变化
watch(
  () => myValue.value,
  () => {
    emits("getContent", myValue.value)
    emits("posterImgTextData", myValue.value)
  }
)
//在onMounted中初始化编辑器
onMounted(() => {
  tinymce.init({})
})
</script>