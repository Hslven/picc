<!-- / * @FileDescription: 新增帖子/编辑帖子/查看详情
* @Author: ZMW
* @Date: 2023-07-17
* @LastEditors: 
* @LastEditTime:
*/ -->

 

<template>
    <div class="friendCircleReadOrAdd">
        <div>
            <a-form required ref="formRef" :model="formData" :rules="rules">
                <a-form-item ref="belongColumnRef" label="所属栏目" name="belongColumn">
                    <a-input readonly v-model:value="formData.belongColumn" />
                </a-form-item>
                <a-form-item ref="titleNameRef" label="标题名称" name="titleName" placeholder="请输入标题名称">
                    <a-input v-model:value="formData.titleName" />
                </a-form-item>

                <a-form-item label="拟人" name="personiFication">
                    <a-select v-model:value="formData.personiFication">
                        <a-select-option value="正能量">正能量</a-select-option>
                        <a-select-option value="beijing">Zone two</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="长图上传" name="fileList">
                    <a-upload v-model:file-list="formData.fileList" name="avatar" list-type="picture-card" :headers="headers"
                        class="avatar-uploader" :show-upload-list="true" action="/dop/iug/zuul/content/file/m/upload.do"
                        :before-upload="beforeUpload" @change="handleChange">
                        <!-- 上传多个图片  :show-upload-list="true"-->
                        <div v-if="formData.fileList.length < 2">
                            <plus-outlined />
                            <div class="ant-upload-text">
                                <div>上传图片</div>
                            </div>
                        </div>
                        <!-- 上传一张图片  :show-upload-list="false" -->
                        <!-- <img v-if="state.imageUrl" style="height: 100%;" :src="state.imageUrl" alt="avatar" />
                    <div v-else>
                        <loading-outlined v-if="state.loading"></loading-outlined>
                        <plus-outlined v-else></plus-outlined>
                        <div class="ant-upload-text">上传图片</div>
                    </div> -->
                    </a-upload>
                    <div class="uploadText">只能上传jpg/png文件，尺寸宽度为1125px，高度不限，大小10M以内。</div>
                </a-form-item>
                <a-form-item label="分享文案" name="shareofficial">
                    <a-textarea @blur="shareofficialBlur" :maxlength="200" showCount v-model:value="formData.shareofficial"
                        placeholder="请输入分享文案" :rows="4" />
                </a-form-item>
            </a-form>
            <a-form-item :wrapper-col="{ span: 24, offset: 11 }">
                <button class="ghostGrey" @click="onClose">取消</button>
                <button class="solidColor" style="margin-left: 20px" @click="onSubmit">提交</button>
            </a-form-item>
        </div>
        <!-- 当查看详情的时候才会出现下面的部分 -->
        <div v-if="state.status === '详情'">
            <div>帖子审核记录</div>
            <div>

            </div>

        </div>

    </div>
</template>

<script lang="ts">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message, FormInstance } from 'ant-design-vue';
import { reactive, defineComponent, ref, toRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { contentApi, systemManagementApi, friendCircleApi } from '@/libs/api';
import {localStorage} from '@/libs/Storage';

import { Ref } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { routerKey } from 'vue-router';

interface FormStateType {
    belongColumn: string,//所属栏目
    titleName: string,//标题名称
    personiFication: string,//拟人
    fileList: any[],
    region: string,
    shareofficial: string
}

interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    type?: string;
    size: number;
    originFileObj: any;
}

interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
}
// function getBase64(img: Blob, callback: (base64Url: string) => void) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result as string));
//   reader.readAsDataURL(img);
// }
@Options({
    name: 'LaberManagement',
    components: {
        PlusOutlined
    },
})

export default class friendCircleReadOrAdd extends Vue {
    @Ref('formRef') readonly formRef!: FormInstance;
    public router = useRouter();
    public route = useRoute()
    public headers:any = {
		['X-Auth-Token'] : localStorage.get('token')
	}
    public formData = reactive<FormStateType>({
        belongColumn: this.route.query.topicName as string,//所属栏目
        titleName: '',//标题名称
        personiFication: '',//拟人
        fileList: [],
        region: '',
        shareofficial: ""
    });
    created() {

    }
    public getBase64(img: Blob, callback: (base64Url: string) => void) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    }

    public state = reactive({
        // fileList: [],
        loading: false,
        imageUrl: '',
        status: this.route.query.status//当前页面的状态   新增/编辑/详情
    })
    public rules = {
        titleName: [
            { required: true, message: '请输入标题名称', trigger: 'blur' },
        ],
        personiFication: [
            { required: true, message: '请选择', trigger: 'change' },
        ],
        fileList: [
            { required: true, message: '请上传图片', trigger: 'change' },
        ],
        shareofficial: [
            { required: true, message: '请输入分享文案', trigger: 'blur' },
        ]
    }
    public handleChange = (info: FileInfo) => {
        if (info.file.status === 'uploading') {
            this.state.loading = true;
            return;
        }
        if (info.file.status === 'done') {


            this.getBase64(info.file.originFileObj, (base64Url: string) => {
                this.state.imageUrl = base64Url;
                this.state.loading = false;
            });
        }
        if (info.file.status === 'error') {
            this.state.loading = false;
            message.error('upload error');
        }
    };

    public beforeUpload = (file: any) => {
        const isLt10M = file.size / 1024 / 1024 < 10;

        const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
        let w = 0, h = 0
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return new Promise((resolve, reject) => {
            if (!isJpgOrPng) {
                message.error('上传失败,图片格式不满足要求');
                // return reject
            }
            if (!isLt10M) {
                message.error('上传失败,图片大小超过10M,不满足要求');
                // return reject
            }

            //  
            reader.onload = () => {
                const image: any = new Image()
                image.src = reader.result
                image.onload = () => {
                    w = image.width
                    h = image.height
                     
                     
                    if (w === 1125) {
                        message.success('上传成功')
                        return resolve(true)
                    } else {
                        message.error('上传失败，图片尺寸不满足要求')
                        // return reject(false)
                    }

                }
            }


        })
        // return isJpgOrPng;

    };
    public onClose() {
        this.router.push({ path: 'friendManage' });

    }
    public onSubmit() {
        this.formRef.validate().then(() => {
             
            const params = {
                parentId: this.route.query.parentId, //类目id
                assistantTitleName: this.formData.titleName,//标题名称
                assistantUploadPictures: this.formData.fileList,  //上传的图片(jpg,png)
                assistantShareCopyWriting: this.formData.shareofficial,  //分享文案/资讯信息
                assistantPersonify: this.formData.personiFication, //拟人
                assistantId: this.route.query.assistantId,//帖子id,如果传则为编辑
            }

             
            
            // friendCircleApi.addandEditAssistant(params, {}).then((res) => {
            //      

            // })
            //    
        })
        //  

    }

    public shareofficialBlur() {
         
        if (/^[\u4e00-\u9fa5]||[0-9]*$/.test(this.formData.shareofficial)) {
             

        } else {
             

        }

    }
}

</script>

<style lang="less" scoped>
@import '~@/modules/assets/contenTbase.css';
@import '~@/modules/style/button.css';

.friendCircleReadOrAdd {
    padding: 20px 30px;

    .uploadText {
        color: #999999;
        font-size: 12px;
    }
}
</style>