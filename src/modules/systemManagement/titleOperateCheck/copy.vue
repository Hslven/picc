<template>
    <div class="background">
        <div class="top">
            <div class="info-title info">
                <div class="margin">基础信息</div>
                <hr class="line">
            </div>
            <div class="info-content info">
                <a-form>
                    <a-row class="group">
                        <a-col class="name">标签分组:</a-col>
                        <a-col>{{ data.groupName }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col class="name">标签名称:</a-col>
                        <a-col>{{ data.labelName }}</a-col>
                    </a-row>
                </a-form>
            </div>
        </div>
        <div class="bottom">
            <div class="info-title info">
                <div class="margin">标签审核处理记录</div>
                <hr class="line">
            </div>
            <div v-if="operateCheck === 0" class="info">
                <a-form :model="formState" ref="formRef">
                    <a-row class="group">
                        <a-form-item label="审核结论:" name="operateType" :rules="[{ required: true, message: '请选择同意或不同意' }]">
                            <a-col class="yn">
                                <a-radio-group class="radio" v-model:value="formState.operateType">
                                    <a-radio value='0'>同意</a-radio>
                                    <a-radio value='1'>不同意</a-radio>
                                </a-radio-group>
                            </a-col>
                        </a-form-item>
                    </a-row>
                    <a-row>
                        <a-form-item label="审核意见:" name="note" class="sug-title"
                            :rules="[{ required: formState['operateType'] == '1', message: '请录入审核意见' }]">
                            <a-col class="sug-text">
                                <a-textarea class="suggest" v-model:value="formState.note" placeholder="请录入审核意见"
                                    showCount :maxlength="100" allowClear />
                            </a-col>
                            <a-row class="explanNote"><a-col>注：当[审核结论]选择“不同意”时，“审核意见”为必录项</a-col></a-row>
                        </a-form-item>
                    </a-row>
                    <a-form-item class="info-btn">
                        <a-button class="cancel" :ghost="false" @click="cancel">取消</a-button>
                        <a-button class="submit" type="primary" :ghost="false" @click="onCheck">提交</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div v-if="operateCheck === 1" class="info">
                <div>
                    <a-form>
                        <div class="steps">
                            <a-steps direction="vertical" size="small">
                                <a-step disabled="true" status="wait">
                                    <template #title>
                                        <span class="nam">{{ commitDetail.operatorname }}</span>
                                    </template>
                                    <template #subTitle>
                                        <span class="xiangqing">提交内容审核详情</span>
                                        <span class="time">{{ commitDetail.crtdate }}</span>
                                    </template>
                                </a-step>
                                <a-step disabled="true" status="finish">
                                    <template #title>
                                        <span class="nam">{{ checkDetail.operatorname }}</span>
                                    </template>
                                    <template #subTitle>
                                        <span class="xiangqing">审核结论:</span>
                                        <span class="tongyi">{{ checkDetail.operatortype }}</span>
                                        <span class="time">{{ checkDetail.crtdate }}</span>
                                    </template>
                                </a-step>
                            </a-steps>
                        </div>
                    </a-form>
                </div>
                <div>
                    <a-button class="back" :ghost="false">返回</a-button>
                </div>
            </div>
            <div v-if="operateCheck === 2" class="info">
                <div>
                    <a-form>
                        <div class="steps">
                            <a-steps direction="vertical" size="small">
                                <a-step disabled="true" status="wait">
                                    <template #title>
                                        <span class="nam">{{ commitDetail.operatorname }}</span>
                                    </template>
                                    <template #subTitle>
                                        <span class="xiangqing">提交内容审核详情</span>
                                        <span class="time">{{ commitDetail.crtdate }}</span>
                                    </template>
                                </a-step>
                                <a-step disabled="true" status="error">
                                    <template #title>
                                        <span class="nam">{{  checkDetail.operatorname }}</span>
                                    </template>
                                    <template #subTitle>
                                        <span class="xiangqing">审核结论:</span>
                                        <span class="butongyi">{{ checkDetail.operatortype }}</span>
                                        <span class="time">{{ checkDetail.crtdate }}</span>
                                        <a-row class="chek-suggest">
                                            <div class="chek-suggest">
                                                <div>
                                                    <p class="sug-content">审核意见:{{ checkDetail.note }}</p>
                                                </div>
                                            </div>
                                        </a-row>
                                    </template>
                                </a-step>
                            </a-steps>
                        </div>

                    </a-form>
                </div>
                <div>
                    <a-button class="back" :ghost="false">返回</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { systemManagementApi } from '@/libs/api';
import { Options, Vue } from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import { message } from 'ant-design-vue';
interface stateType {
    operateType: string,
    note: string,
    labelId:string,
    operatorName:string,
};

@Options({
    components: {

    }
})


export default class titleOperateCheck extends Vue {
    @Prop({default: ''}) public abc!: string
    created() {
        this.getDetail();
        this.getData();
    }
    //获取操作审批页面上半部分两个标签的接口
    public getData() {
        let param = {
            labelId: '243399197056294912',
            groupId:'5qD0rQdv',

        }
       
        systemManagementApi.getqrylabelRecord(param,{}).then((res)=>{
            this.data = res.defmap;
        }) 
    }

    //获取审批详情同意或不同意的具体页面数据
    //等后端补全接口字段
    public getDetail() {
        let param = {
            labelId: '237609670773923840',
        }
        systemManagementApi.getlabelRecordInfo(param, {}).then((res) => {
            this.commitDetail = res.data[0];//提交人  提交时间  
            this.checkDetail = res.data[1];//审核人  审核时间  审核意见
            
        })
    }
    public operateCheck: number = 0
    public formRef: any = '';
    public formState: stateType = {
        operateType: '',
        note: '',
        labelId:'',
        operatorName:''
    };
    public checkDetail:any = {}
    public res: any = {}
    public commitDetail: any = {}
    public data: any = {
        // suggest:'标签名称不准确，请核实修改后再重新提交。',
        // group: '行为标签',
        // name: '购物达人',
        // operateCheck: 2,
    };
    // public hasSelected = computed(() => this.state.selectedRowKeys.length > 0);

    public onCheck = async () => {
        try {
            const values = await this.formRef.validateFields();
            this.formState.labelId = '243399197056294912',
            this.formState.operatorName = 'admin',
            systemManagementApi.getlabelRecord(this.formState,{}).then((res) => {
                if(res.flag === 'success'){
                    res.msg.forEach(jes => {
					message.info(jes)
				})
                }else if(res.flag === 'fail'){
                    res.msg.forEach(jes => {
					message.info(jes)
				})
                }
        })
             
        } catch (errorInfo) {
             
        }
    };
    public cancel(){
        this.formState = {
            operateType: '',
            note: '',
            labelId:'',
            operatorName:'',
        }
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

<style lang="less" >
.background {
    width: 100%;
    height: 100%;
    background-color: #F9F9F9;

    // padding: 14px;
    .top {
        // margin-top: 14px;
        margin-left: 10px;
        margin-right: 14px;
        // padding: 0;
        height: 30%;
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

.info-title {
    width: 90%;
}

.margin {
    margin-top: 20px;
}

.name {
    margin-right: 45px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
}

.group {
    margin-top: 34px;
    margin-bottom: 20px;
}

.radio {
    margin-left: 29px;
}

.suggest {
    // margin-left: 30px;
    width: 606px;
    height: 79px;
    border-radius: 4px;
    border: 1px solid #ABABAB;
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
}

//返回按钮
.back {
    margin-top: 158px;
    margin-left: 1066px !important;
    width: 84px !important;
    height: 32px !important;
    background: white !important;
    color: black !important;
    border: 1px solid #BFBFBF !important;
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

// 改变对勾颜色
.ant-steps-item-finish .ant-steps-item-icon {
    background-color: #24BCB6;
    border-color: #24BCB6;
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
    background: #F2F0F0;
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
}

.ant-form-item-with-help .ant-form-item-explain {
    margin-left: 33px;
}</style>