<template>
  <div class="app-select-page">
    <div class="app-list">

      <div class="title">基本信息</div>
      <div class="grid">
        <!-- <div>{{ userInfo }}</div> -->
        <div class="inforow">
          <span class="infotitle"> 组织机构</span>
          <span> {{ userInfo.organ_name }}</span>
        </div>
        <a-divider />
        <div class="inforow">
          <span class="infotitle"> 用户登录账号</span>
          <span> {{ userInfo.user_id }}</span>
        </div>
        <a-divider />
        <div class="inforow">
          <span class="infotitle"> 用户姓名</span>
          <span> {{ userInfo.user_name }}</span>
        </div>
        <a-divider />
        <div class="inforow">
          <span class="infotitle"> 备注</span>
          <span> {{ userInfo.patch_memo }}</span>
        </div>
        <a-divider />
        <div class="inforow">
          <span class="infotitle"> 用户角色</span>
          <span> {{ userInforoles }}</span>
        </div>
      </div>
      <div class="title">账号安全</div>
      <div class="grid">
        <div class="inforow">
          <span class="infotitle"> 密码</span>
          <span class="updatepw"   @click="openModal('modify')">修改</span>
        </div>
      </div>
    </div>
    <!-- 底部按钮 开始 -->
    <div class="bot-button">
      <a-row type="flex" justify="center" align="middle">
        <a-col :span="2">
          <a-button type="primary" @click="goback">返回</a-button>
        </a-col>
      </a-row>
    </div>
    <a-modal
        v-model:visible="showModal"
        :title="modalTitle"
        :confirmLoading="modalConfirmLoading"
        @ok="handleModalOk"
    >
      <a-form
          :model="pwdFormState"
          ref="pwdForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 15 }">
        <a-form-item label="原密码" name="old_pwd" :rules="[{ required: true, message: '原密码不能为空', trigger: 'blur' }]">
          <a-input-password v-model:value="pwdFormState.oldCcdduu" placeholder="请输入原密码" />
        </a-form-item>
        <a-form-item class="tooltip" label="新密码" name="user_pwd" :rules="[{ required: true, message: '新密码不能为空', trigger: 'blur' },{
                  validator: compareToFirstPassword},{validator: validatePwd, trigger: 'blur'}]">
          <a-input-password v-model:value="pwdFormState.userCcdduupp" placeholder="请输入新密码" />
          <a-tooltip class="tooltip-icon" placement="right">
            <template #title>
              密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位
            </template>
            <question-circle-outlined />
          </a-tooltip>
        </a-form-item>
        <a-form-item label="确认密码" name="confirm_pwd" :rules="[{ required: true, message:'确认密码不能为空', trigger: 'blur' },{
                  validator: compareTosecondPassword,
                }]">
          <a-input-password v-model:value="pwdFormState.confirmDdffCcc" placeholder="请输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { baseApi, ResponseData } from '@/libs/BaseApi';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { FormInstance,message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import MD5 from 'crypto-js/md5';

interface PwdParamType{
  pk_uuid:string;
  oldCcdduu:string;  
  userCcdduupp:string;
  confirmDdffCcc?:string
}
@Options({ components: { SvgIcon, QuestionCircleOutlined } })
export default class AppSelect extends Vue {
  @Ref('pwdForm') readonly pwdForm!: FormInstance;
  public userInfo: any[] = []
  public role_name_text: any[] = []  //用户角色数组
  public userInforoles: any = '' //用户角色数组拼接后的字符串
  public pk_uuid='' //用户ID
  public showModal=false
  public modalConfirmLoading=false
  public modalTitle=''
  public pwdFormState:PwdParamType={
    pk_uuid:this.pk_uuid,
    oldCcdduu:'',
    userCcdduupp:'',
    confirmDdffCcc:''
  }
  public created() {
    this.getUserInfo()
  }
  public getUserInfo() {
    baseApi.post('/user/getUserInfo.do', {}, 'sec').then((res: ResponseData<any, any>) => {
      this.userInfo = res.defmap
      this.pk_uuid= res.defmap.pk_uuid
      res.defmap.rolesList.forEach((item: any) => {
        this.role_name_text.push(item.role_name)
      })
      this.userInforoles = this.role_name_text.join('，')
    });
  }
  openModal(type:string){
    if(type==='modify'){
      this.modalTitle='修改密码'
    }
    this.showModal=true
    this.$nextTick(()=>{
       
      this.pwdForm.resetFields()
    })
  }
  public handleModalOk(){
    let requestUrl=''
    let param={
      pk_uuid:this.pk_uuid,
      user_pwd:this.pwdFormState.userCcdduupp,
      old_pwd:this.pwdFormState.oldCcdduu
    }
    requestUrl='/user/mdfPassword.do'
    param.user_pwd = MD5(param.user_pwd).toString()
    param.old_pwd = MD5(param.old_pwd).toString()
    this.pwdForm.validate().then(()=>{
      this.modalConfirmLoading=true
      baseApi.post(requestUrl, param, 'sec').then(() => {
        this.modalConfirmLoading=false
        message.success('保存成功');
        this.showModal=false
      }).catch(()=>{
        this.modalConfirmLoading=false
      })
    })
  }
  public goback() {
    window.history.back()
  }

  public validatePwd(rule:any,value:any,callback:any) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#%*?&-])[A-Za-z\d$@$!#%*?&-]{8,}/
    if (!pattern.test(value)) {
      // Promise.reject('密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位')
      callback('密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位')
    } else {
      // Promise.resolve()
      callback()
    }
  }
  // 密码确认
  compareToFirstPassword(rule:any,value:any, callback:any) {
    if (value && (value !== this.pwdFormState.confirmDdffCcc)&&this.pwdFormState.confirmDdffCcc) {
      callback('两次输入密码不一致')
    } else {
      callback()
    }
  }
  compareTosecondPassword(rule:any,value:any, callback:any) {
    if (value && (value !== this.pwdFormState.oldCcdduu)&&this.pwdFormState.oldCcdduu) {
      callback('两次输入密码不一致')
    } else {
      callback()
    }
  }

}



</script>

<style lang="less" scoped>
.app-select-page {
  height: 100%;
  background: #f1f1f1;
  overflow-y: auto;

  .app-list {
    width: 60%;
    margin: 0 auto;
    margin-bottom: 20px;


    .title {
      padding: 16px 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px
    }

    .grid {

      background: #fff;
      padding: 20px;
      border-radius: 5px;



    }

    .updatepw {
      color: #1890ff;
      cursor: pointer;
    }

    .infotitle {
      display: inline-block;
      width: 120px;
      color: #525967
    }

  }

  .bot-button {
    margin-bottom: 20px;
  }

}

.tooltip {
  position: relative;
  .tooltip-icon {
    position: absolute;
    margin-left: 10px;
    margin-top: 8px;
  }
}
</style>
