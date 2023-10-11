<!-- / * @FileDescription: 帖子审核
* @Author: ZMW
* @Date: 2023-07-17
* @LastEditors: 
* @LastEditTime:
*/ -->
<template>
    <div class="friendCircleAudit">
        <div>
            <a-form    :model="formData">
                <a-form-item ref="belongColumnRef" label="所属栏目" name="belongColumn">
                    <a-input v-model:value="formData.belongColumn" disabled />
                </a-form-item>
                <a-form-item ref="titleNameRef" label="标题名称" name="titleName" placeholder="请输入标题名称">
                    <a-input v-model:value="formData.titleName" disabled />
                </a-form-item>

                <a-form-item label="拟人" name="personiFication">
                    <a-input v-model:value="formData.personiFication" disabled />
                </a-form-item>
                <a-form-item label="长图上传">

                </a-form-item>
                <a-form-item label="资讯信息" name="shareofficial">
                    <a-textarea disabled v-model:value="formData.shareofficial" placeholder="请输入分享文案" :rows="4" />
                </a-form-item>
            </a-form>

        </div>

        <div>
            <div>帖子记录</div>
            <div>
                <a-form required ref="auditRef" :rules="rules" :model="auditData">
                    <a-form-item label="审核结论" >

                        <a-select @change="auditResultChange" name="auditResult" v-model:value="auditData.auditResult">
                            <a-select-option value="1">同意</a-select-option>
                            <a-select-option value="0">不同意</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="审核意见" name="auditPosition">
                        <a-textarea v-model:value="auditData.auditPosition" placeholder="请输入分享文案" :rows="4" />
                    </a-form-item>
                </a-form>
            </div>

        </div>
        <a-form-item :wrapper-col="{ span: 24, offset: 11 }">
            <button class="ghostGrey" @click="onClose">取消</button>
            <button class="solidColor" style="margin-left: 20px" @click="onSubmit">提交</button>
        </a-form-item>
    </div>
</template>

<script lang="ts">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message, FormInstance } from 'ant-design-vue';
import { reactive, defineComponent, ref, toRaw } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { Ref } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { routerKey } from 'vue-router';

interface FormStateType {
    belongColumn: string,//所属栏目
    titleName: string,//标题名称
    personiFication: string,//拟人
    // fileList: any[],
    region: string,
    shareofficial: string
}

interface auditDataType {
    auditResult: string,//审核结论
    auditPosition: string,// 审核意见

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
    @Ref('auditRef') readonly auditRef!: FormInstance;

    
    public router = useRouter();
    public route = useRoute()

    public formData = reactive<FormStateType>({
        belongColumn: '',//所属栏目
        titleName: '',//标题名称
        personiFication: '',//拟人
        region: '',
        shareofficial: ""
    });
    public auditData = reactive<auditDataType>({
        auditResult: '1',//审核结论
        auditPosition: '',// 审核意见
    });

    created() {

    }


    public state = reactive({
        loading: false,
        imageUrl: '',
        status: this.route.query.status//当前页面的状态   新增/编辑/详情
    })
    public rules = reactive({
        auditResult: [
            { required: true, message: '请选择审核结论', trigger: 'change' },
        ],
        auditPosition: [
            { required: false, message: '请输入审核意见', trigger: 'blur' },
        ]
    })
    public auditResultChange() {
         
        if (this.auditData.auditResult === '0') {
                this.rules.auditPosition[0].required = true
        } else {
            this.rules.auditPosition[0].required = false
        }

    }
    public onClose() {
        this.router.push({  path: 'friendManage' }); 
    }
    public onSubmit() {
        this.auditRef.validate().then(() => {
             

            //    
        })
        //  

    }
}

</script>

<style lang="less" scoped>
@import '~@/modules/assets/contenTbase.css';
@import '~@/modules/style/button.css';

.friendCircleAudit {
    padding: 20px 30px;


}
</style>