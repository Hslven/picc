<!-- 新增下载页 -->
<template>
    <div>
        <div class="wrapper">
            <div class="box">
                <div class="up">
                    <div>新增下载页</div>
                </div>
                <div class="down">
                    <div class="down-box">
                        <a-form :model="formState" ref="formRef">
                            <a-form-item label="显示样式：" 
                                class="addDownlodTitle" 
                                name="displayValue" 
                                :rules="[{ required: true, 
                                message: '请选择显示样式' }]">
                                    <a-radio-group class="addValue" v-model:value="formState.displayValue" >
                                        <a-radio value='1'>图片</a-radio>
                                        <a-radio value='2'>链接</a-radio>
                                    </a-radio-group>
                            </a-form-item>
                            <a-form-item label="推广渠道：" 
                                class="addDownlodTitle" 
                                name="promoChannelsValue" 
                                :rules="[{ required: true, 
                                message: '请选择推广渠道' }]">
                                    <a-radio-group class="addValue" v-model:value="formState.promoChannelsValue" >
                                        <a-radio value='1'>APP</a-radio>
                                        <a-radio value='2'>百度小程序</a-radio>
                                        <a-radio value='3'>微信小程序</a-radio>
                                        <a-radio value='4'>支付宝小程序</a-radio>
                                        <a-radio value='5'>微信公众号</a-radio>
                                    </a-radio-group>
                            </a-form-item>
                            <a-form-item label="目标渠道：" 
                                class="addDownlodTitle" 
                                name="targetChanlValue" 
                                :rules="[{ required: true, 
                                message: '请选择目标渠道' }]">
                                    <a-radio-group class="addValue" 
                                    v-model:value="formState.targetChanlValue"
                                     >
                                        <a-radio value='1'>APP</a-radio>
                                        <a-radio value='2'>微信小程序</a-radio>
                                    </a-radio-group>
                            </a-form-item>
                            <a-form-item 
                             class="promoConstiteRow" 
                             name="promoValue" 
                             :rules="[{ required: true, message: '请选择推广页组成' }]"
                             label="推广页组成：">
                                <span class="promoConstitute">(图片比例：9:16   图片格式：JPG、JPEG、PNG、GIF   图片或海报的大小均为10M以内)</span>
                                <div class="constiPage-box">
                                    <div class="constitute-upbox" v-for="item in constituteList" > 
                                    <a-button class="constitute-piece" 
                                    :style="[{background:(item.isCheck ? 'greenyellow':'white')}]"
                                    :key="item.name"
                                    @click="checkPiece(item)"
                                    :disabled = "item.disabled"
                                    >{{ item.name }}
                                    </a-button>
                                    <div class="constitute-downbox">
                                        <div class="downbox-piece" v-if="item.isCheck && item.uploadType==='local'">
                                            <img class="downbox-img" src="https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF"
                                             alt="">
                                             <a-button class="downbox-sethot">设置热区</a-button>
                                        </div>
                                        <div v-if="item.isCheck && item.uploadType==='dialog'">
                                            <dialog></dialog>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                                </div>

                            </a-form-item>
                            <a-form-item class="addDownlodTitle"  label="渠道有效期：" name="startTime"  :rules="[{ required: true, message: '请选择渠道有效期' }]">
                                <a-col class="addDateValue">
                                    <a-date-picker 
                                    valueFormat="YYYY-MM-DD 00:00:00"
                                    v-model:value="formState.startTime"
                                    :disabledDate="disabledDateStart"
                                    placeholder="开始时间" />
					            <span class="to">至</span>
                                <a-date-picker 
                                    valueFormat="YYYY-MM-DD 23:59:59"
                                    v-model:value="formState.endTime"
                                    :disabled-date="disableEndTime"
                                    placeholder="结束时间" />
                                </a-col>
                            </a-form-item>
                            <a-form-item 
                            class="addDownlodTitle"  
                            label="应用说明:" 
                            name="appDescrpValue" 
                            :rules="[{ required: true, message: '请选择应用说明' }]"
                            >
                                <a-select class="addValue appDescrip" v-model:value="formState.appDescrpValue" ref="select"
                                placeholder="请选择"
                                >
                                    <a-select-option v-for="item in appDescrpValueList" :key="item.id">{{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <div class="addDowlodBtn">
                            <a-button class="previewBtn" @click="preview">预览</a-button>
                            <a-button class="cancelBtn" @click="cancel">取消</a-button>
                            <a-button class="submitBtn" @click="submit">提交</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import { message } from 'ant-design-vue';
import Component from 'vue-class-component'
@Options({
	components:{
	}
})

// @Component({
//   watch: {
//     postId(formState: any) {
//       // To fetch post data when the id is changed.
//        
//   }
// })

export default class example extends Vue{
    created(){

    }


public constituteList:any =[
    {
        value:'1',
        isCheck:false,
        name:'宣传页',
        uploadType: 'local',
        backColor: 'green',
        disabled: false,
    },
    {
        value:'2',
        isCheck:false,
        name:'注册页',
        uploadType: 'dialog',
        disabled: false,
    },
    {
        value:'3',
        isCheck:false,
        name:'活动页',
        uploadType: 'dialog',
        disabled: false,
    },
    {
        value:'4',
        isCheck:false,
        name:'深度链接',
        uploadType: null,
        disabled: false,
    },
    {
        value:'5',
        isCheck:false,
        name:'下载页',
        uploadType: 'local',
        disabled: false,
    }
]
public formRef: any = '';
public formState:any = {
    displayValue:'',
    promoChannelsValue:'',
    targetChanlValue:'',
    appDescrpValue:undefined,
    promoValue:'',

};
//开始和结束时间
public startTime:string = '';
public endTime:string = '';
//开始时间
public disabledDateStart(current: any){
	if (this.endTime) {
    return current > moment(this.endTime).endOf('day');
        } else {
    }
}
//结束时间
public disableEndTime(current:any) {
if (this.startTime) {
    return (
    (current && current < moment(this.startTime).subtract(1, 'days').endOf('day'))
            );
        }
    }
//目标渠道事件
public changeTargetRadio() {
    if(this.formState.targetChanlValue === '1'){
        //APP
        this.constituteList.forEach((jes:any) => {
            if(jes.name === '宣传页'){
                jes.isCheck = true;
                jes.disabled = true;
            }
        });
    }
}

public appDescrpValueList:any[] = [
        {
        label: '全部',
        value: '0',
        id: '0'
        },
        {
        label: 'app',
        value: '1',
        id: '1'
        },
        {
        label: '微信小程序',
        value: '2',
        id: '2'
        },
    ]
//点击选择推广页
public checkPiece(data:any){
    // this.constituteList.forEach((i:any) => {
        
    // });
    // this.formState.promoValue = item.value
    if (data.isCheck) {
        //取消勾选
        data.isCheck = false;

    } else {
        //勾选
        data.isCheck = true;
        
    }

}
public submit = async () => {
    try {
        const values = await this.formRef.validateFields();
         

        // this.formState.labelId = this.route.query.labelId,
        // this.formState.labelAuitId = this.route.query.labelAuitId
   

        // systemManagementApi.getlabelRecord(this.formState,{}).then((res) => {
        //     if(res.flag === 'success'){
        //         message.info('提交成功')
        //     }else if(res.flag === 'fail'){
        //         message.info('提交失败')
        //     }
        //     })
            // this.formState = {
            //     operateType: '',
            //     note: '',
            //     labelId:'',
            //     labelAuitId:'',
            // }
        } catch (errorInfo) {
         
        }
    };
public cancel(){
    this.formState = {
        displayValue:'',
        promoChannelsValue:'',
        targetChanlValue:'',
        appDescrpValue:'',
        }
    }
public preview(){
    //跳转到预览页
}

}

</script>
<style lang="less">
.wrapper{
   background-color: #f9f9f9;
   width: 100%;
   height: 100%;
   padding: 10px;
   .box{
    padding: 5px;
        .up{
        margin-left: 4px;
        width: 96px;
        height: 22px;
        font-size: 16px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
        }
        .down{
        margin-top: 10px;
        padding: 20px;
        background: #FFFFFF;
        width: 100%;
        height:99%;
            .addDownlodTitle{
                margin-left: 5px;
                margin-bottom: 30px;
                height: 30px;
                font-size: 14px;
                font-family: PingFang-SC-Regular, PingFang-SC;
                font-weight: 400;
                color: #333333;
                line-height: 20px;
            }
        }
    }
    .ant-form-item-label > label {
        width: 84px;
        margin-right: 30px;
    }
    // .addValue{
    //     margin-left: 42px;
    // }
    .to{
        margin-left: 4px;
        margin-right: 4px;
    }
    // .addDateValue{
    //     margin-left: 18px;
    // }
    .appDescrip{
        width: 274px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #ABABAB;
    }
    .addDowlodBtn{
        margin-top: 120px;
        margin-left: 5px;
    }
    .previewBtn{
        margin-right: 655px;
        width: 84px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #E8380D;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #E8380D;
        line-height: 24px;
    }
    .cancelBtn{
        margin-right: 20px;
        width: 84px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #BFBFBF;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
    }
    .submitBtn{
        width: 84px;
        height: 32px;
        background: #E8380D;
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
    }
    .promoConstitute{
        height: 20px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
    }
    .constitute-upbox{
        margin-top: 20px;
        margin-bottom: 10px;
        // display: flex;
        .constitute-piece{
            margin-right: 10px;
            text-align: center;
            width: 105px;
            height: 60px;
            border-radius: 4px;
            border: 1px solid #ABABAB;
            font-size: 14px;
            font-family: PingFang-SC-Regular, PingFang-SC;
            font-weight: 400;
            color: #333333;
            line-height: 54px;
        }
    }
    .promoConstiteRow{
        margin-left: 5px;
        margin-bottom: 30px;
        height: 340px;
    }
    .constitute-downbox{
        display: flex;

        // width: 592px;
        // height: 226px;
        // background: #F7F7F7;
        // border-radius: 8px;
        .downbox-piece{
            margin-right: 10px;
            width: 108px;
            height: 200px;
        }
        .downbox-img{
            width: 100%;
            height: 100%;
        }
        .downbox-sethot{
            margin-top: 20px;
        }
    }
    .constiPage-box{
        display: flex;
    }
}

</style>