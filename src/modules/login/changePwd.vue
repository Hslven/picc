<template>
    <div>
        <a-form :model="changePwdForm" 
            name="normal_login" 
            class="login-form" 
            :label-col="{ style: { width: '120px' } }" 
            labelAlign="left"
            >
            <a-form-item style="margin: 40px auto;width: 500px;font-size: 20px;font-weight: 500;color: #333333;line-height: 28px;">
                <span v-if="pwdUpdateTime === ''">第一次登录，请修改密码，修改后使用新密码重新登录：</span>
                <span v-else-if="dayCount > 90">密码已过期，请修改密码，修改后使用新密码重新登录：</span>
            </a-form-item>
            <a-form-item class="login-form-input" has-feedback label="原密码" name="old_pwd" :rules="[{ required: true, message: ''},{validator: Oldpass}]">
                <!-- <a-input-password :bordered="false" v-model:value="changePwdForm.user_pwd">
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password> -->
                <a-input-password style="width: 320px;" type="password" v-model:value="changePwdForm.old_pwd" placeholder="请输入原密码" />
            </a-form-item>
            <!-- <a-form-item class="login-form-input" label="新密码" name="user_pwd"
                     :rules="[{ required: true, message: '新密码不能为空', trigger: 'blur' },{validator: handlePass, trigger: 'blur'}]">
                <a-input-password style="width: 320px;" v-model:value="changePwdForm.user_pwd" placeholder="请输入新密码" />
                <a-tooltip class="tooltip-icon" placement="right">
                    <template #title>
                    密码必须包含大写字母、小写字母、数字和特殊字符，长度不能小于八位
                    </template>
                    <question-circle-outlined />
                </a-tooltip>
            </a-form-item> -->
            <a-form-item class="login-form-input" has-feedback label="新密码" name="user_pwd" :rules="[{ required: true, message: ''},{validator: handlePass}]">
                <a-input-password style="width: 320px;" type="password" v-model:value="changePwdForm.user_pwd" placeholder="请输入新密码" />
            </a-form-item>
            <a-popover placement="right">
                <template #content>
                    <img
                        style="width: 240px; height: 50px; display: flex; position: absolute; margin-left: -25px; margin-top: -10px"
                        src="../systemManagement/uploadMaterial/uploadTag/icon／背景2.png"
                        alt=""
                    />
                    <div style="color: #ffffff; position: relative;">
                        <p style="height: 10px;width: 200px;;font-size: 4px;">密码必须包含大写字母，小写字母，</p>
                        <p style="height: 10px;width: 200px;font-size: 4px;">数字和特殊符号，长度不能小于八位</p>
                    </div>
                </template> 
                <img  class="hint" src="../assets/内容管理-列表_slices/icon＼问号.png" alt="" />
            </a-popover>
            <a-form-item class="login-form-input" has-feedback label="确定新密码：" name="set_pwd" :rules="[{ required: true, message: ''},{validator: handleConfirmPass}]">
                <a-input-password style="width: 320px;" type="password" v-model:value="changePwdForm.set_pwd" placeholder="请再次输入新密码" />
            </a-form-item>
            <a-form-item class="login-form-input" style="padding-left: 140px;margin-top: 40px;">
                <a-button class="but" @click="contio">
                    取消
                </a-button>
                <a-button class="but" style="color: #ffffff;background-color: #E8380D;" @click="confirm">
                    保存
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
 
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ref } from 'vue';
import { UserOutlined,LockOutlined, PlusCircleOutlined, SearchOutlined, FolderOutlined, EditOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { baseApi } from '@/libs/BaseApi';
import { message } from 'ant-design-vue';
import { global } from '@/libs/Global';
import MD5 from 'crypto-js/md5';
import { useRoute } from 'vue-router'
import moment from 'moment';


@Options({
    components: {
        UserOutlined,
        SearchOutlined,
        PlusCircleOutlined,
        FolderOutlined,
        EditOutlined,
        CloseOutlined,
        PlusOutlined,
    },
})
export default class Login extends Vue {
    public changePwdForm: any = {}; 
    public loading = false;

    public route = useRoute()


    public ISPWD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#%*?&-])[A-Za-z\d$@$!#%*?&-]{8,}/

    public pwdUpdateTime = this.route.query.pwdUpdateTime

    public daytime = new Date().toLocaleString(); //获取日期

    public day = new Date(this.daytime).getTime() - new Date(<string>this.pwdUpdateTime).getTime();
    public dayCount = Math.floor(this.day / 86400000)

    public created() {
        console.log(this.pwdUpdateTime,'--------------');
        console.log(this.daytime,'--------------');
        console.log(this.day,'--------------');
        console.log(this.dayCount,'--------------');
    }

    public confirm(){
        this.loading = true;
        const params = {
            // ...this.changePwdForm,
            old_pwd:this.changePwdForm.old_pwd,
            user_pwd:this.changePwdForm.user_pwd,

        }
        params.user_pwd = MD5(params.user_pwd).toString();
        params.old_pwd = MD5(params.old_pwd).toString();
        console.log('params',params)
        baseApi
            .post(
                '/user/updatePassword.do',  //地址
                params,
                'sec',
            )
            .then((res: any)=> {
                console.log(44444)
                this.loading = true;
                console.log('reswww',res);
                message.success('修改成功');
                global.clear()
                this.$router.push('/login')
            })
            .catch(() => {
                this.loading = false;
            });
    }


    public contio(){
        global.clear()
        this.$router.push('/login')
    }

    public Oldpass(rule:any,value:any,callback:any){
        if (!this.ISPWD.test(this.changePwdForm.old_pwd)) {
	        callback(new Error("用户密码必须包含大写字母、小写字母、数字和特殊符号"));
	    } else {
	        callback();
        }
    }

    public handlePass(rule:any,value:any,callback:any){
        this.changePwdForm.new_pwd = value
        if (!this.ISPWD.test(this.changePwdForm.user_pwd)) {
	        callback(new Error("用户密码必须包含大写字母、小写字母、数字和特殊符号"));
	    } else {
	        callback();
	    }
        callback()
    }
    public handleConfirmPass(rule:any,value:any, callback:any){
        if (this.changePwdForm.new_pwd && this.changePwdForm.new_pwd !== value) {
            callback('您输入的密码与新密码不一致！请重新输入')
        }
        if (!this.ISPWD.test(this.changePwdForm.user_pwd)) {
	        callback(new Error("用户密码必须包含大写字母、小写字母、数字和特殊符号"));
	    } else {
	        callback();
	    }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
    }

}


</script>

<style scoped>

.login-form-input {
    height: 56px;
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin: 0px auto;
    padding-right: 20px;
    /* opacity: 0.4; */
}

.but{
    margin-left: 20px;
}

.hint{
    display: flex;
    margin-top: -35px;
    margin-left: 65%;
    margin-bottom: 16px;
    position: relative;
}
.ant-form-item-explain-error {
    color: #ff4d4f;
    margin-left: 20px;
}

.ant-form-item-control-input-content {
    flex: auto;
    max-width: 80%;
}
</style>