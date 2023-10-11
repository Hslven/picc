<template>
    <div class="background">
        <div class="top">
            <div class="info-content info">
                <!-- <a-form :model="formData"> -->
                    <a-row class="row-style">
						<a-col class="title" style="margin-left: 10px">所属渠道：</a-col>
						<a-col class="content"></a-col>
                    </a-row>
                    <a-row class="row-style">
                        <a-col class="title" style="margin-left: 10px;">使用对象：</a-col>
                        <a-col class="content"></a-col>
                    </a-row>
                    <a-row class="row-style">
                        <span class="fields1">*</span>
                        <a-col class="title">栏目名称：</a-col>
                        <a-col>
                            <a-input v-model:value="columnName" style="width:60%;border-radius: 4px;" placeholder="请输入栏目名称" />
                        </a-col>
                    </a-row>
                    <a-row class="row-style">
                        <span class="fields2">*</span>
                        <a-col class="title"><span style="color:#F61111;">最高</span>积分数：</a-col>
                        <a-col>
                            <a-input v-model:value="integralNumber" style="width:60%;border-radius: 4px;" placeholder="请输入数字" />
                        </a-col>
                    </a-row>
                    <a-row class="row-style">
                        <span class="fields3">*</span>
                        <a-col class="title">得分规则：</a-col>
                        <a-col>
                            <a-select v-model:value="scoringRule" style="width:180px;border-radius: 4px;" placeholder="请选择">
                                <a-select-option>

                                </a-select-option>
                            </a-select>
                        </a-col>
                    </a-row>
                    <a-row class="row-style">
                        <span class="fields4">*</span>
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
                        <a-col style="margin-left: 55px;margin-bottom: 40px;">(图片像素单位：px)</a-col>
                    </a-row>
                <!-- </a-form> -->
            </div>
        </div>
        <div class="bottom">
            <div class="info-btn">
                <a-button class="cancel" :ghost="false">取消</a-button>
                <a-button class="submit" type="primary" :ghost="false">提交</a-button>
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
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';


// interface stateType {
//     operateType: string;
//     note: string;
//     labelId: string;
//     // operatorName:string,
// }

// interface formDataType {
//     columnName: string; //	栏目名称
//     integralNumber: string; //	积分数
//     scoringRule: string; //	得分规则
// }
// @Options({
//     components: {},
// })
export default class titleOperateCheck extends Vue {
    // public formData = reactive<formDataType>({
    //     columnName: '', //	栏目名称
    //     integralNumber: '', //	积分数
    //     scoringRule: '', //	得分规则
    // });
    //栏目名称v-model
	public columnName:string = ''
    //积分数
    public integralNumber:string = ''
    //得分规则
    public scoringRule:string = ''
	//栏目封面长度
	public coverLength:string = ''
	//栏目封面宽度
	public coverWidth:string = ''
    
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

.fields1{
    color: #F61111;
    position: relative;
    left: 25px;
}
.fields2{
    color: #F61111;
    position: relative;
    left: 10px;
}
.fields3{
    color: #F61111;
    position: relative;
    left: 25px;
}
.fields4{
    color: #F61111;
    position: relative;
    left: 50px;
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
