<template>
    <div class="flex">
        <img class="flex-img" src="../assets/loginBack.png" alt="" />
        <img class="flex-img-btn" src="../assets/loginLogo.png" alt="" />
        <div class="flex-login">
            <p class="flex-login-login" style="height:10px">登录</p>
        </div>
        <a-form :model="loginForm" name="normal_login" class="login-form" :label-col="{ style: { width: '80px' } }"
            @finish="handleSubmit">
            <a-form-item class="login-form-input" label="用户名" name="user_name"
                :rules="[{ required: true, message: '请输入用户名' }]">
                <a-input :bordered="false" v-model:value="loginForm.user_name" @blur="handleLoginForm">
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item class="login-form-input" label="密码" name="user_pwd"
                :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password :bordered="false" v-model:value="loginForm.user_pwd">
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
            </a-form-item>
            <div class="input-container">
                <a-form-item class="login-form-input-verify" label="验证码" name="verify_code"
                    :rules="[{ required: true, message: '请输入验证码' }]">
                    <a-input :bordered="false" v-model:value="loginForm.verify_code" autocomplete="off"></a-input>
                </a-form-item>
                <canvas ref="captchaCanvas" @click="refreshCaptcha" style="height:53px; margin-left: 12px;"
                    :width="canvasWidth" :height="canvasHeight" :id="canvasId"></canvas>
            </div>
            <a class="captcha-link" href="#" @click="refreshCaptcha">
                点击获取验证码
            </a>
            <a-form-item style="text-align: center">
                <a-button type="text" :disabled="disabled" :loading="loading" html-type="submit" class="login-form-button">
                    <img class="login-form-button-img" src="../assets/loginBtn.png" alt="" />
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ref } from 'vue';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { baseApi } from '@/libs/BaseApi';
import { message } from 'ant-design-vue';
import { global } from '@/libs/Global';
import MD5 from 'crypto-js/md5';

const captchaText = ref<string>('');
const code = ref();

@Options({ UserOutlined: UserOutlined, LockOutlined: LockOutlined })
export default class Login extends Vue {
    public loginForm: any = {};
    public loading = false;
    canvasId = 'verifyCodeId';
    canvasWidth = 100;
    canvasHeight = 60;

    generateCaptchaFromString(captchaText: string) {
        const c = document.getElementById(this.canvasId) as HTMLCanvasElement;
        const ctx = c.getContext('2d');
        if (!ctx) return;

        const canvasWidth = c.width;
        const canvasHeight = c.height;

        // 清除画布
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // 设置画布样式和验证码的字体
        ctx.font = 'bold 40px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        for (let i = 0; i < 10; i++) {
            const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            ctx.strokeStyle = randomColor;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
            ctx.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
            ctx.stroke();
        }

        // 添加一些随机点作为干扰元素
        for (let i = 0; i < 100; i++) {
            const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            const randomX = Math.random() * canvasWidth;
            const randomY = Math.random() * canvasHeight;
            const radius = Math.random() * 2 + 1; // 随机半径在1到3之间
            ctx.beginPath();
            ctx.arc(randomX, randomY, radius, 0, 1 * Math.PI);
            ctx.fillStyle = randomColor;
            ctx.fill();
        }

        // 使用随机颜色绘制验证码文本，并随机旋转0~30度
        for (let i = 0; i < captchaText.length; i++) {
            const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            ctx.fillStyle = randomColor;

            // 随机旋转角度（弧度制）
            const angle = (Math.random() * 60 * Math.PI) / 180;

            // 计算文本位置以及旋转
            const x = canvasWidth / 8 + (i * canvasWidth) / 4;
            const y = canvasHeight / 2;
            ctx.translate(x, y);
            ctx.rotate(angle);

            // 绘制验证码文本
            ctx.fillText(captchaText[i], 0, 0);

            // 恢复旋转和位置
            ctx.rotate(-angle);
            ctx.translate(-x, -y);
        }
    }

    // 发送请求获取验证码字符串
    fetchCaptchaText = () => {
        try {
            captchaText.value = code.value;//

        } catch (error) {
            console.error('获取验证码失败：', error);
        }
    };
    //失去焦点事件
    handleLoginForm = () => {
        console.log('失去焦点事件');
        //失去焦点且用户名不为空时获取验证码
        if (this.loginForm.user_name) {
            this.refreshCaptcha();
        }
    }
    //点击验证码区域事件
    refreshCaptcha = async () => {
        //用户名为空时结束函数
        if (!this.loginForm.user_name) {
            return;
        }

        //点击后获取验证码
        await baseApi.post('/verificationCode/gain.controller', { flog: 'pc', phoneNumber: this.loginForm.user_name }, 'sec').then((res: any) => {
            const {
                defmap: { verifyCode },
            } = res;
            code.value = verifyCode;

        });
        // 获取新的验证码字符串
        this.fetchCaptchaText();

        // 生成验证码图片
        if (captchaText.value) {
            this.generateCaptchaFromString(captchaText.value);
        }

    };
    //登录方法
    public handleSubmit() {

        this.loading = true;
        const params = { ...this.loginForm };
        params.user_pwd = MD5(params.user_pwd).toString();
        console.log('params', params);
        baseApi
            .post('/user/userLogin4Pwd.controller', params, 'sec')
            .then((res: any) => {
                this.loading = false;
                console.log('res11', res)
                console.log(res.defmap.updatePasswordFlag, 'yyyuuu')
                if (res.defmap.accessToken) {
                    message.success('登录成功');
                    global.setSessionToken(res.defmap.accessToken);
                    if (res.defmap.updatePasswordFlag === true) {
                        console.log(res.defmap.updatePasswordFlag, 'yyyuuu')
                        this.$router.push({
                            path: '/changePwd', query: { pwdUpdateTime: res.defmap.pwdUpdateTime }
                            // this.router.push({ path: '/systemManagement/feedbackResult', query: { contentId: record.content_id } })
                        });
                    }
                    else
                        if (res.defmap.directLogin) {
                            global.setAppId(res.defmap.appId);
                            this.$router.push({
                                path: '/',
                            });
                        } else {
                            global.setAppId(res.defmap.appId);
                            this.$router.push({
                                path: '/appSelect',
                            });
                        }
                }
            })
            .catch(() => {
                this.loading = false;
            });
    }

    get disabled() {
        return !(this.loginForm.user_name && this.loginForm.user_pwd);

    }
}
</script>

<style scoped>
.flex {
    width: 100%;
    height: 100%;
    /* display: flex;
  align-items: center;
  justify-content: center; */
    /* background-image: url('../assets/loginBack.png');
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative; */
}

.flex-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.flex-img-btn {
    width: 8%;
    height: 4%;
    position: absolute;
    top: 18%;
    left: 74%;
}

.flex-login {
    width: 7%;
    height: 5%;
    position: absolute;
    top: 28%;
    left: 66%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.flex-login-login {
    font-size: 34px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 48px;
}

.login-form-input {
    height: 56px;
    background: #ffeae5;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
    margin-bottom: 20px;
    /* opacity: 0.4; */
}

.login-form-input-verify {
    height: 56px;
    background: #ffeae5;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 32px;
    margin-bottom: 10px;
    width: 280px;
    /* opacity: 0.4; */
}

.ant-form {
    width: 450px;
    padding: 30px 30px;
    position: absolute;
    top: 33%;
    left: 55%;
    /* border: 1px solid dodgerblue; */
}


.login-form-button {
    width: 90%;
    height: 3%;
}

.login-form-button-img {
    width: 100%;
    height: 100%;
    margin-top: 30px;
}

.input-container {
    display: flex;

}

.login-form-input-verify {
    align-self: flex-start;
}

.captcha-link {
    margin-top: 100px;
}</style>
