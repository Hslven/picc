<template>
	<div>
		<a-upload
			accept=".jpg,.jpeg,.png,.gif"
			name="file"
			action="/dop/iug/zuul/content/file/c/upload.do"
			list-type="picture-card"
			class="avatar-uploader"
			:max-count="1"
			:headers="headers"
			v-model:file-list="pictureInformation"
			:on-success="onSuccess"
			:before-upload="beforeUpload"
			:show-upload-list="false"
			@change="uploadPictures">
			<img v-if="imageUrl" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+imageUrl" alt="avatar" style="width:100px;height: 100px;" />
			<div v-else style="width:80px;height: 80px;">
				<loading-outlined v-if="loading"></loading-outlined>
				<plus-outlined v-else></plus-outlined>
				<div>
					<p style="font-size:30px;padding: 0;color: #999;">+</p>
					<p style="color: #999;">上传图片</p>
				</div>
			</div>
		</a-upload>
		<div>
			<p class="poster-classification-p" style="font-size: 12px;	color: #999999;">比例：9:16</p>
			<p class="poster-classification-p" style="font-size: 12px;	color: #999999;">格式：JPG、JPEG、PNG、GIF</p>
		</div>
	</div>
</template>
<script lang="ts">
import {localStorage} from '@/libs/Storage';
import { message } from 'ant-design-vue';
import { Options, Vue } from 'vue-class-component';
import { PlusOutlined, LoadingOutlined, UploadOutlined, ApiOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { computed } from 'vue';
import store from '@/modules/conTent/store';
import { useRoute } from 'vue-router'
import { Prop,Watch } from 'vue-property-decorator';


//图片转base64
function getBase64(img: Blob, callback: (base64Url: string) => void) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
}
@Options({
  components: {
		UploadOutlined
	}
})
export default class poster extends Vue {
  @Prop({ type: Boolean,default: false }) readonly cancleImgUrl!: false;
	@Prop() public addOrEditType:any
	@Prop() public showAddContent:any
  public cancleChoosePoster =  computed(() => {
		 
    if(this.cancleImgUrl === false){
      this.imageUrl = ''
      this.pictureInformation = []
    }
  })
	public headers:any = {
		['X-Auth-Token'] : localStorage.get('token')
	}
	public route = useRoute()
	public state: any = store.state
	@Watch('showAddContent',{deep:true})
  private onTableListChange(newVal: any) {
		if(newVal){
			let editContent:any  = ''
			let addState = this.state.addContent
			this.imageUrl = ''
			if(this.addOrEditType === '1' && addState.contentType === ''){
				editContent = this.state.editContent.editContentList
				if(editContent.contentType === 'b'){
					this.imageUrl = editContent.contentFile
					this.$emit('posterImgUrlData',editContent.contentFile)
				}
			}
		} else {
			this.setAddList()
		}
  }
  public created(): void {
    this.onTableListChange(this.showAddContent)
  }
	//关闭抽屉重置
	public setAddList(){
		this.imageUrl = ''
    this.pictureInformation = []
		this.$emit('posterImgUrlData','')
	}
	// base64转图片
  public base64ImgtoFile(dataurl:any, filename = 'file') {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime
    })
  }
	public pictureInformation: any[] = []
	public imageUrl: any = ''
	public loading: boolean = false
	//上传图片成功返回
	public onSuccess(response:any){
		this.imageUrl = response.defmap.data
		 
    this.$emit('posterImgUrlData',response.defmap.data)
	}
	//点击上传图片，转换base64
	public uploadPictures = (info: UploadChangeParam) => {
		const information1: any = info.file.originFileObj
		if (info.file.status === 'uploading') {
			this.loading = true;
			return;
		}
		if (info.file.status === 'done') {
		}
		if (info.file.status === 'error') {
			this.loading = false;
			message.error('upload error');
		}
	};
	public beforeUpload = (file: any) => {
		// 上传之前的回调
  return new Promise((resolve, reject) => {
    const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('只能上传jpg,jpeg,png,gif的图片')
      return reject(false)
    }
    let w = 0,
      	h = 0
    	const reader = new FileReader()
    	reader.readAsDataURL(file)
    	reader.onload = () => {
      	const image:any = new Image()
      	image.src = reader.result
      	image.onload = () => {
        	w = image.width
        	h = image.height
					 
					 
					if(w/h === 9/16){
						return resolve(true)
					}
        	message.error('请上传符合9:16的图片')
        	return reject(false)
      	}
    	}
    	return isJpgOrPng
  	})
  };
}
</script>

<style lang="scss" scoped></style>