<template>
  <div>
    <div>
      <a-upload
        name="file"
        accept=".mp4"
        action="/dop/iug/zuul/content/file/c/upload.do"
        v-model:file-list="pictureInformation"
        :on-success="onSuccess"
        :max-count="1"
        :headers="headers"
        :before-upload="beforeUpload"
        @change="uploadPictures($event)"
        >
        <a-button style="margin-top:20px" type="primary" ghost>
          <a-spin v-if="loading === true"/>
          <upload-outlined v-else></upload-outlined>
          上传视频
        </a-button>
      </a-upload>
    </div>
    <div>
      <p style="padding:10px 0px;font-size: 12px;	color: #999999;">比例：9:16、16:9&nbsp;&nbsp;格式：MP4
      </p>
      <a-input
        style="width: 190px;height: 32px;border-radius: 4px;margin: 20px 0px;"
        v-model:value="showTimeOut"
        maxlength="4"
        :showCount="true"
        @change="changeShowTiemOut(showTimeOut)"
        placeholder='输入视频时长(分钟)'>
      </a-input>
    </div>
  </div>
</template>
<script lang="ts">
import {localStorage} from '@/libs/Storage';
import { Options, Vue } from 'vue-class-component';
import { PlusOutlined, LoadingOutlined, UploadOutlined, ApiOutlined } from '@ant-design/icons-vue';
import { message, UploadChangeParam, UploadProps } from 'ant-design-vue';
import { Prop } from 'vue-property-decorator';
import { computed } from 'vue';
import store from '@/modules/conTent/store';
import { useRoute } from 'vue-router'
import { baseApi, ResponseData } from '@/libs/BaseApi';
@Options({
  components: {
		UploadOutlined
	}
})
export default class videoType extends Vue {
  @Prop({ default: false }) public cancleVideoTypeData!: boolean;
  public route = useRoute()
  public headers:any = {
		['X-Auth-Token'] : localStorage.get('token')
	}
	public state: any = store.state
	public editContentList:any = computed(() => {
    let addState = this.state.addContent
     
    let editContent:any = this.state.editContent.editContentList
		if(this.route.query.editType === '1' && addState.contentType === ''){
			if(editContent.contentType === 'v'){
				// this.getFileHtml(editContent.contentFile)
        this.showTimeOut = editContent.videoTimeLength
        this.videoTypeDataList = {
          showTimeOut : editContent.videoTimeLength,
          defmapData : editContent.contentFile
        }
        this.pictureInformation.push({
          name:editContent.contentFile
        })
			} else {
        this.showTimeOut = ''
        this.videoTypeDataList = {
          showTimeOut : '',
          defmapData : ''
        }
        this.pictureInformation = []
      }
      this.$emit('videoTypeData',this.videoTypeDataList)
	  }
    return editContent
	})
  public pictureInformation: any[] = []
  //传值
  public videoTypeDataList = {
    showTimeOut : '',
    defmapData : ''
  }
  public loading:boolean = false
  public onSuccess(response:any){
    this.videoTypeDataList.defmapData = response.defmap.data
    this.loading = false
    message.info('上传成功')
    this.$emit('videoTypeData',this.videoTypeDataList)
	}
  //视频时长
  public showTimeOut:string = ''
  //修改视频时长
  public changeShowTiemOut(value:string){
    if(value !== value.replace(/[^0-9]/g, '')){
      message.info('请输入正整数，最大支持4位')
      this.showTimeOut=value.replace(/[^0-9]/g, '')
      return
    } else {
      this.videoTypeDataList.showTimeOut = value
      this.$emit('videoTypeData',this.videoTypeDataList)
    }
  }
  public uploadPictures= (info: UploadChangeParam) => {
     
     
    if(info.file.status === undefined){
      this.pictureInformation = []
    }
    if (info.file.status === 'uploading') {
      this.loading = true
      info.file.status = 'done'
    }
    if (info.file.status === 'done') {
    } 
    if (info.file.status === 'removed') {
      this.videoTypeDataList.defmapData = ''
      this.loading = false
      this.$emit('videoTypeData',this.videoTypeDataList)
    }
  }
  public beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'video/mp4';
    if (!isJpgOrPng) {
      message.error('请上传mp4格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 200;
    if (!isLt2M) {
      message.error('视频大小不能超过200M，请重新上传');
    }
    return isJpgOrPng && isLt2M;
  };
  // public beforeUpload = (file:any,fileList:any) => {
  //    
  //    
    
  //   let that = this
  //   return new Promise((resolve, reject) => {
  //     const isLt200Mb = file.size / 10240 / 10240 <= 200
  //     if (!isLt200Mb) {
  //       message.error('上传文件大于200MB,请重新上传')
  //       return reject(false)
  //     }
  //     fileList.value = [...fileList.value, file];
  //     resolve(true);
  //     return true;
  //   })
  // }
}
</script>

<style lang="scss"></style>