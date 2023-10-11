<template>
	<!-- 封面： -->
	<div>
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :push="1" :xs="6" :sm="6" :xl="3" :xxl="6">封面：</a-col>
			<a-col :xs="2" :sm="2" :xl="1" :xxl="1"></a-col>
			<a-col :xs="16" :sm="16" :xl="18" :xxl="14">
				<a-checkbox-group v-model:value="checkBoxModel" @change="changeCheckBoxModel(checkBoxModel)">
					<a-checkbox :value="item.value" v-for="item in formCoverClass" :key="item.code" @click="changeFormCover(item)">
					<div style="display: flex;justify-content: center;align-items: start;">
						<div style="margin-right:10px">
							<p style="font-size:14px;font-weight: 400;color: #333333;line-height: 20px;">{{ item.type }}</p>
							<p style="font-size:12px;font-weight:400;color:#999999;line-height: 17px;">尺寸：{{ item.dimension }}</p>
						</div>
						<div style="margin-right: 30px;">
							<a-upload
								accept=".jpg,.jpeg,.png,.gif"
								maxCount="1"
								:headers="headers"
								v-model:file-list="item.pictureInformation"
								name="file"
								action="/dop/iug/zuul/content/file/c/upload.do"
								list-type="picture-card"
								:before-upload="beforeUpload"
								:on-success="onSuccess"
								:show-upload-list="false"
								@change="handleChange">
								<img v-if="item.image" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + item.image" alt="avatar" style="width:100px;height: 100px;" />
								<div v-else style="width:80px;height: 80px;">
									<loading-outlined v-if="loading"></loading-outlined>
									<plus-outlined v-else></plus-outlined>
									<div class="ant-upload-text">
										<p style="font-size:30px;padding: 0;color: #999;">+</p>
										<p style="color: #999;padding: 0;">上传图片</p>
									</div>
								</div>
							</a-upload>
						</div>
					</div>
					</a-checkbox>
				</a-checkbox-group>
				<p style="margin-top:10px;color:#999999;font-size: 12px;">格式：JPG、JPEG、PNG、GIF</p>
			</a-col>
		</a-row>
	</div>
</template>

<script lang="ts">
import {localStorage} from '@/libs/Storage';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { Options, Vue } from 'vue-class-component';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { contentApi } from '@/libs/api'
import { computed } from 'vue';
import store from '@/modules/conTent/store';
import { useRoute } from 'vue-router'
import { baseApi, ResponseData } from '@/libs/BaseApi';


//图片分类接口
interface formCoverClassification {
	value: string;
	type: string;
	code: string;
	dimension: string
	pictureInformation: [];
	image:string
	horizontalCoverFile?:string
	verticalCoverFile?:string
}
//图片转base64
function getBase64(img: Blob, callback: (base64Url: string) => void) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
}
export default class coverType extends Vue {
	public route = useRoute()
	public state: any = store.state
	public headers:any = {
		['X-Auth-Token'] : localStorage.get('token')
	}
	public editContentList:any = computed(() => {
		 
		if(this.route.query.editType === '1'){
      let editContent = this.state.editContent.editContentList
			this.checkBoxModel = []
			this.formCoverClass.forEach((item:any) => {
				if((typeof(editContent.horizontalCoverFile) === 'string' && editContent.horizontalCoverFile !== '') && item.value === '1'){
					item.horizontalCoverFile = editContent.horizontalCoverFile
					item.image = editContent.horizontalCoverFile
					this.checkBoxModel.push('1')
				}
				if((typeof(editContent.verticalCoverFile) === 'string' && editContent.verticalCoverFile !== '') && item.value === '2'){
					item.verticalCoverFile = editContent.verticalCoverFile
					item.image = editContent.verticalCoverFile
					this.checkBoxModel.push('2')
				}
			})
	  }
		this.$emit('coverPicture',this.formCoverClass)
	})
	//图片组的v-model
	public checkBoxModel:any[] = []
	//选择图片 去掉图片
	public changeCheckBoxModel(value:any){
		 
		this.formCoverClass.forEach((res:formCoverClassification) => {
			if(value.findIndex((item:any) => item === '1') === -1 && res.code === '1'){
				res.value =  '1',
				res.type = '横板封面',
				res.code = '1',
				res.dimension =  '900*383px',
				res.pictureInformation = [],
				res.image = '',
				res.horizontalCoverFile = ''
			} else if(value.findIndex((item:any) => item === '2') === -1 && res.code === '2'){
				res.value =  '2',
				res.type = '竖版封面',
				res.code = '2',
				res.dimension =  '200*200px',
				res.pictureInformation = [],
				res.image = '',
				res.verticalCoverFile = ''
			}
		})
		this.$emit('coverPicture',this.formCoverClass)
	}
	public chooseImage:string = ''
	//选择图片 赋值 img
	public changeFormCover(item:any){
		 
		this.formCoverClassModel = item.code
		this.chooseImage = item.value
	}

	//图片分类 分类选项
	public formCoverClass: formCoverClassification[] = [
		{
			value: '1',
			type: '横板封面',
			code: '1',
			dimension: '900*383px',
			pictureInformation: [],
			image:'',
			horizontalCoverFile:''
		},
		{
			value: '2',
			type: '竖版封面',
			code: '2',
			dimension: '200*200px',
			pictureInformation: [],
			image:'',
			verticalCoverFile:''
		},
	]
	//图片分类 v-model 默认1选项
	public formCoverClassModel:string = ''
	

	//上传图片成功返回
	public onSuccess(response:any){
		this.onSuccessDefmap = response
		this.formCoverClass.forEach((res:formCoverClassification) => {
			if(this.formCoverClassModel === res.code && this.formCoverClassModel === '1'){
				 
				res.horizontalCoverFile = response.defmap.data
				res.image = response.defmap.data
				 
			} else if(this.formCoverClassModel === res.code && this.formCoverClassModel === '2'){
				res.verticalCoverFile = response.defmap.data
				res.image = response.defmap.data
			}
		})
		 
		this.$emit('coverPicture',this.formCoverClass)
	}
	//上传图片成功返回v-model
	public onSuccessDefmap:any = {}
	// public fileList = ref([]);
	public loading: boolean = false;
	//点击上传图片，转换base64
	public handleChange = (info: UploadChangeParam) => {
		const information1: any = info.file.originFileObj
		if (info.file.status === 'uploading') {
			this.loading = true;
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(information1, (base64Url: string) => {
				// this.imageUrl = base64Url;
				this.loading = false;
			});
		}
		if (info.file.status === 'error') {
			this.loading = false;
			message.error('upload error');
		}
	};
	public beforeUpload = (file: any) => {
		 
		if(this.chooseImage === '1'){
			return new Promise((resolve, reject) => {
				const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
				if (!isJpgOrPng) {
					message.error('上传失败，封面尺寸或格式不满足要求')
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
							 
							 
							if(w/h === 900/383){
								return resolve(true)
							}
							message.error('上传失败，封面尺寸或格式不满足要求')
							return reject(false)
						}
					}
					 
					return isJpgOrPng
			})
		} else {
			return new Promise((resolve, reject) => {
				const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
				if (!isJpgOrPng) {
					message.error('上传失败，封面尺寸或格式不满足要求')
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
							 
							 
							if(w/h === 200/200){
								return resolve(true)
							}
							message.error('上传失败，封面尺寸或格式不满足要求')
							return reject(false)
						}
					}
					return isJpgOrPng
			})
		}
		// 上传之前的回调
  };
}
</script>

<style lang="less" scoped>
.ant-btn {
	padding: 0;
}

.ant-upload-list {
	width: 60px;
}

.ant-upload-list-item-info {
	width: 80px;
}
.ant-upload.ant-upload-select-picture-card {
	width: 100px;
	height: 100px;
}
</style>