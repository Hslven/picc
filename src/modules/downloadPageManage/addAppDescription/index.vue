<!-- 新增应用说明页 -->
<template>
	<div>
		<div class="wrapper">
			<div class="box">
				<div class="up">
					<div>新增应用说明</div>
				</div>
				<div class="down">
					<div class="down-box">
						<a-form ref="formRef" :model="formState">
							<a-form-item class="label-box" label="应用名称:" name="appName"
								:rules="[{ required: true, message: '请输入应用名称' }]">
								<a-input class="short-input" v-model:value="formState.appName" autocomplete="off" placeholder="请输入应用名称">
								</a-input>
							</a-form-item>
							<a-form-item class="label-box" label="开发者:" name="appDeveloper"
								:rules="[{ required: true, message: '请输入开发者' }]">
								<a-input class="short-input" v-model:value="formState.appDeveloper" autocomplete="off" placeholder="请输入开发者">
								</a-input>
							</a-form-item>
							<a-form-item class="label-box" label="应用涉及权限:" name="appPermission"
								:rules="[{ required: true, message: '请输入应用涉及权限链接地址' }]">
								<a-input class="long-input" v-model:value="formState.appPermission" autocomplete="off"
									placeholder="请输入应用涉及权限链接地址">
								</a-input>
							</a-form-item>
							<a-form-item class="label-box" label="更新时间:" name="appMdfDate"
								:rules="[{ required: true, message: '请选择日期' }]">
								<a-date-picker class="short-input" valueFormat="YYYY-MM-DD 00:00:00" v-model:value="formState.appMdfDate">
								</a-date-picker>
							</a-form-item>
							<a-form-item class="label-box" label="版本号:" name="appVersion"
								:rules="[{ required: true, message: '请输入版本号: 如: 5.22.0以上' }]">
								<a-input class="short-input" v-model:value="formState.appVersion" autocomplete="off"
									placeholder="请输入版本号: 如: 5.22.0以上">
								</a-input>
							</a-form-item>
							<a-form-item class="label-box" label="App隐私政策:" name="appPrivacyPolicy"
								:rules="[{ required: true, message: '请输入App隐私政策链接地址' }]">
								<a-input class="long-input" v-model:value="formState.appPrivacyPolicy" autocomplete="off"
									placeholder="请输入App隐私政策链接地址">
								</a-input>
							</a-form-item>
						</a-form>
						<div class="down-btn">
							<a-button class="cancel" @click="cancel">取消
							</a-button>
							<a-button @click="submit">提交
							</a-button>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRoute } from 'vue-router';
import { downloadPageManageApi } from '@/libs/api';
import { message } from 'ant-design-vue';

@Options({
	components: {
	}
})
export default class addAppDescription extends Vue {
	created() {

	}
	//路由传参
	public route = useRoute()
	//表格校验
	public formRef: any = '';
	//表格里的字段
	public formState: any = {
		appName: '',
		appDeveloper: '',
		appPermission: '',
		appMdfDate: '',
		appVersion: '',
		appPrivacyPolicy: '',
	}
	//点击提交调接口将新增数据传给后台
	public submit= async () =>{
		try {
			const values = await this.formRef.validateFields();
			 
			 
	
			 downloadPageManageApi.getAddAppDesc(this.formState,{}).then((res) => {
				
			    if(res.flag === 'success'){
					message.info('提交成功')
			        history.go(-1)
			    }else if(res.flag === 'fail'){
			        message.info('提交失败')
			    }
			    })
			this.formState = {
				appName: '',
				appDeveloper: '',
				appPermission: '',
				appMdfDate: '',
				appVersion: '',
				appPrivacyPolicy: '',
			}
			 
			 
		} catch (errorInfo) {
			 
		}
	};
	public cancel() {
		this.formState = {
			appName: '',
			appDeveloper: '',
			appPermission: '',
			appMdfDate: '',
			appVersion: '',
			appPrivacyPolicy: '',
		}
		this.$router.go(-1)
	}
}
</script>
<style lang="less" scoped>
.wrapper {
	background-color: #f9f9f9;
	width: 100%;
	height: 800px;
	padding: 10px;

	.up {
		margin-left: 35px;
		width: 96px;
		height: 22px;
		font-size: 16px;
		font-family: PingFang-SC-Medium, PingFang-SC;
		font-weight: 500;
		color: #333333;
		line-height: 22px;
	}

	.down {
		margin-top: 10px;
		padding: 30px;
		background: #FFFFFF;
		width: 100%;
		height: 747px;

		.down-box {
			margin-left: 15px;
		}
	}
}

.short-input {
	width: 300px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #ABABAB;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
}

.long-input {
	width: 600px;
	height: 32px;
	border-radius: 4px;
	border: 1px solid #ABABAB;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
}

.ant-form-item-label>label {
	width: 98px;
	height: 32px;
	margin-right: 25px;
	font-size: 14px;
	font-family: PingFang-SC-Regular, PingFang-SC;
	font-weight: 400;
	color: #333333;
	line-height: 32px;
}

.down-btn {
	margin-top: 360px;
	margin-left: 685px;

	.cancel {
		margin-right: 15px;
	}
}
</style>