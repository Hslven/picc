<template>
    <div class="background">
        <div class="top">
            <div class="info-content info">
                <!-- <a-form> -->
                    <a-row class="row-style">
						<a-col class="title">所属渠道：</a-col>
						<a-col class="content"></a-col>
                    </a-row>
                    <a-row class="row-style">
                        <a-col class="title">使用对象：</a-col>
                        <a-col class="content"></a-col>
                    </a-row>
                    <a-row class="row-style">
                        <a-col class="title">栏目名称：</a-col>
                        <a-col>
                            <a-input style="width:323px;border-radius: 4px;" v-model:value="columnName" placeholder="请输入栏目名称" />
                        </a-col>
                    </a-row>
                    <a-row class="row-style">
                        <a-col class="title">最高积分数：</a-col>
                        <a-col>
                            <a-input style="width:323px;border-radius: 4px;" v-model:value="integralNumber" placeholder="请输入" />
                        </a-col>
                    </a-row>
                    <!-- <a-row class="row-style">
                        <a-col class="title">得分规则：</a-col>
                        <a-col>
                            <a-select @change="changeLabel" v-model:value="contentTags" style="width:180px;border-radius: 4px;" placeholder="默认第一项">
                                <a-select-option  v-for="item in tagsList" :key="item" :value="item.id">
                                    {{item.name }}
                                </a-select-option>
                            </a-select>
                        </a-col>
                    </a-row> -->
                    <a-row class="row-style">
                        <!--  v-model:value="coverWidth"   @change="changeCoverWidth()" -->
                        <a-col class="title">封面：</a-col>
                        <a-col :span="5">
                            <span style="margin-right:20px">长度</span>
                            <a-input
                                maxlength="8"
                                v-model:value="coverLength"
                                placeholder="请输入数字"
                                style="width:134px;height:32px;border-radius: 4px;"
                            ></a-input>
                        </a-col>
                        <a-col :span="5">
                            <span style="margin-right:20px">宽度</span>
                            <a-input
                                maxlength="8"
                                v-model:value="coverWidth"
                                placeholder="请输入数字"
                                style="width:134px;height:32px;border-radius: 4px;"
                            ></a-input>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col style="margin-left: 55px;margin-bottom: 40px;color: #6C6C6C;">(图片像素单位：px)</a-col>
                    </a-row>
                <!-- </a-form> -->
            </div>
        </div>
        <div class="bottom">
            <!-- <div class="info">
					<p style="margin-bottom: 10px;border-left: 2px solid #0F40F5;margin-left: 20px;padding-left: 5px;">栏目审核</p>
                    <a-form :model="formState" ref="formRef" style="margin-left: 42px;margin-top: 34px;">
                        <span style="color: #EC1D0A;display: flex;width: 10px;height: 10px;">*</span>
                        <a-row style="margin-left: 10px;margin-top: -20px;">
                            <a-form-item label="审核结论:" name="operateType" :rules="[{ required: false, message: '请选择同意或不同意' }]">
                                <a-select
                                    ref="select"
                                    v-model:value="value1"
                                    style="width: 230px;margin-left: 30px;"
                                    @focus="focus"
                                    @change="handleChange"
                                    >
                                    <a-select-option value="jack">同意</a-select-option>
                                    <a-select-option value="lucy">不同意</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item label="审核意见:" name="note" class="sug-title" :rules="[{ required: formState['operateType'] == '1', message: '请录入审核意见' }]">
                                <a-col class="sug-text">
                                    <a-textarea class="suggest" v-model:value="formState.note" placeholder="请录入审核意见" showCount :maxlength="100" allowClear />
                                </a-col>
                                <a-row class="explanNote"><a-col>注：当[审核结论]选择“不同意”时，“审核意见”为必录项</a-col></a-row>
                            </a-form-item>
                        </a-row>
                    </a-form>
                </div>
            </div> -->
            <div class="info-btn">
                <a-button class="cancel" :ghost="false" @click="cancel">取消</a-button>
                <a-button class="submit" type="primary" :ghost="false" @click="onCheck">提交</a-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { systemManagementApi } from '../../../libs/api';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { baseApi, ResponseData } from '../../../libs/BaseApi';

interface stateType {
    operateType: string;
    note: string;
    labelId: string;
    // operatorName:string,
}

// @Options({
//     components: {},
// })
export default class titleOperateCheck extends Vue {
    //@Prop({ default: '' }) public abc!: string; //父子组件收参

    //栏目名称v-model
	public columnName:string = ''
    //积分数
    public integralNumber:string = ''
	//栏目封面长度
	public coverLength:string = ''
	//栏目封面宽度
	public coverWidth:string = ''


    created() {
        this.getDetail();
        this.getData();
    }
    public route = useRoute();

    //获取操作审批页面上半部分两个标签的接口
    public getData() {
         

        let param = {
            // labelAuitId:this.route.query.labelAuitId,//新添加的必传字段
            labelId: this.route.query.labelId,
            groupId: this.route.query.groupId,
        };
        systemManagementApi.getqrylabelRecord(param, {}).then((res) => {
            this.data = res.defmap;
        });
    }

    //获取审批详情同意或不同意的具体页面数据
    public getDetail() {
        let param = {
            //labelId: this.route.query.labelId,
            labelId: '237609670773923840',
        };
        systemManagementApi.getlabelRecordInfo(param, {}).then((res) => {
             
            this.checkData = res.data;
        });
    }
    public operateCheck: any = this.route.query.labelStater;
    public formRef: any = '';
    public formState: any = {
        operateType: '',
        note: '',
        labelId: '',
        labelAuitId: '',
    };
    // 审核数据
    public checkData: any = [];
    public commitDetail: any = {};
    public checkDetail: any = {};
    public res: any = {};
    public rsponseList: any = [];
    public data: any = {
        // suggest:'标签名称不准确，请核实修改后再重新提交。',
        // group: '行为标签',
        // name: '购物达人',
        // operateCheck: 2,
    };
    public onCheck = async () => {
        try {
            //获取用户名字的接口
            // baseApi.post('/user/queryUser.do', {}, 'sec').then((res:any) => {
            //      
            //     // res.user_name
            // });
            const values = await this.formRef.validateFields();
             

            (this.formState.labelId = this.route.query.labelId), (this.formState.labelAuitId = this.route.query.labelAuitId);
            // this.formState.operatorName = 'admin',
            systemManagementApi.getlabelRecord(this.formState, {}).then((res) => {
                if (res.flag === 'success') {
                    message.info('提交成功');
                    history.go(-1);
                } else if (res.flag === 'fail') {
                    message.info('提交失败');
                }
            });
            this.formState = {
                operateType: '',
                note: '',
                labelId: '',
                labelAuitId: '',
            };
        } catch (errorInfo) {
             
        }
    };
    public cancel() {
        this.formState = {
            operateType: '',
            note: '',
            labelId: '',
            labelAuitId: '',
        };
        this.$router.go(-1);
    }
    public back() {
        // this.$router.push('/laberManagement');
        this.$router.go(-1);
    }

    // public copy = async () => {
    //     // 获取需要复制的元素以及元素内的文本内容
    //     const url = window.location.href;
    //     // 添加一个input元素放置需要的文本内容
    //     const input = document.createElement('input')
    //     input.value = url
    //     document.body.appendChild(input)
    //     // 选中并复制文本到剪切板
    //     input.select()
    //     document.execCommand('copy')
    //     // 移除input元素
    //     document.body.removeChild(input)
    //     alert("success");
    // };
}
</script>

<style lang="less">
.background {
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;

    // padding: 14px;
    .top {
        // margin-top: 14px;
        margin-left: 10px;
        margin-right: 14px;
        margin-top: 30px;
        // padding: 0;
        // height: 50%;
        background-color: #ffffff;
        margin-bottom: 14px;
    }

    .bottom {
        margin-left: 10px;
        margin-right: 14px;
        margin-bottom: 14px;
        padding-top: 7px;
        height: 68%;
        background-color: #ffffff;
    }

    .info {
        margin-left: 34px;
    }
}
.row-style{
    margin-top: 16px;
}
.title{
    width: 100px;
    text-align: right;
    margin-right: 20px;
}

.info-title {
    width: 90%;
}

.margin {
    margin-top: 20px;
}

.radio {
    margin-left: 29px;
}

.suggest {
    // margin-left: 30px;
    width: 606px;
    height: 79px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

// .ant-input :placeholder-shown{
//  height: 79px;
//  width: 836px;
// }
.sug-title {
    margin-left: 11px;
}

.sug-text {
    margin-left: 30px;
}

.explanNote {
    margin-left: 35px;
    margin-top: 10px;
    // width: 314px;
    height: 17px;
    font-size: 12px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 17px;
}

.info-btn {
    margin-bottom: 30px;
    margin-left: 580px;
    // padding-top: 70px;
}

.cancel {
    margin-right: 20px;
}

//同意步骤条区域位置
.steps {
    margin-top: 38px;
    .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
        background-color: #d8d8d8;
    }
    .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
        background-color: #d8d8d8;
    }
    .ant-steps-item-icon .ant-steps-icon {
        top: -3px;
    }
    .ant-steps-vertical.ant-steps-dot .ant-steps-item > .ant-steps-item-container > .ant-steps-item-tail {
        top: 4px;
    }
}

//返回按钮
.back {
    margin-top: 100px;
    margin-left: 666px !important;
    width: 84px !important;
    height: 32px !important;
    background: white !important;
    color: black !important;
    border: 1px solid #bfbfbf !important;
}

// //同意框颜色
// .ant-steps-item-finish .ant-steps-item-icon {
// 	background-color: rgba(36, 188, 182, 1);
// 	border: rgba(36, 188, 182, 1)
// }

// //对勾颜色
// .anticon {
// 	color: white;
// }

//同意页面第一个原点
// .ant-steps-item-wait .ant-steps-item-icon .ant-steps-icon{
// 	rgba(210, 210, 210, 0.5000)
// }
.nam {
    font-size: 14px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
}

.xiangqing {
    font-size: 14px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
}

.time {
    margin-left: 20px;
    font-size: 12px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
}

.tongyi {
    margin-left: 10px;
    color: rgba(36, 188, 182, 1);
    font-size: 14px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    line-height: 20px;
}
.butongyi {
    margin-left: 10px;
    color: #ea4720;
    font-size: 14px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    line-height: 20px;
}
.note {
    margin-top: 15px;
    background: #f2f0f0;
    height: 44px;
    padding: 0 14px;
    border-radius: 4px;
    line-height: 44px;
}
.null {
    margin-top: 30px;
}

// 改变对勾颜色
.ant-steps-item-finish .ant-steps-item-icon {
    background-color: #24bcb6;
    border-color: #24bcb6;
}

.anticon svg {
    color: #ffffff;
}

.butongyi {
    margin-left: 10px;
    color: rgba(232, 56, 13, 1);
}

.ant-steps-item-error .ant-steps-item-icon {
    background-color: rgba(232, 56, 13, 1);
    border-color: rgba(232, 56, 13, 1);
}

.chek-suggest {
    margin-top: 12px;
    width: 1093px;
    height: 44px;
    background: #f2f0f0;
    border-radius: 4px;
}

.sug-content {
    margin-left: 14px;
    width: 1065px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    .note {
        margin-left: 10px;
    }
}

.ant-form-item-with-help .ant-form-item-explain {
    margin-left: 33px;
}
//输入框叉掉符号的颜色
.anticon svg {
    color: #c7c3c3;
}
</style>
