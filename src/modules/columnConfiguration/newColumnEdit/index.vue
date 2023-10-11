<template>
    <xzModal class="background">
        <div class="top">
            <div class="info-content info">
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
                            <a-input v-model:value="columnName" style="width:323px;border-radius: 4px;" placeholder="请输入栏目名称" />
                        </a-col>
                    </a-row>
                    <a-row class="row-style">
                        <span class="fields2">*</span>
                        <a-col class="title"><span style="color:#F61111;">最高</span>积分数：</a-col>
                        <a-col>
                            <a-input v-model:value="integralNumber" style="width:323px;border-radius: 4px;" placeholder="请输入数字" />
                        </a-col>
                    </a-row>
                    <!-- <a-row class="row-style">
                        <span class="fields3">*</span>
                        <a-col class="title">得分规则：</a-col>
                        <a-col>
                            <a-select v-model:value="scoringRule" style="width:180px;border-radius: 4px;" placeholder="请选择">
                                <a-select-option  v-for="item in scoringRuleList" :key="item.id" :value="item.value">
                                    {{item.label }}
                                </a-select-option>
                            </a-select>
                        </a-col>
                    </a-row> -->
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
                        <a-col style="margin-left: 55px;margin-bottom: 40px;color: #6C6C6C;">(图片像素单位：px)</a-col>
                    </a-row>
            </div>
        </div>
        <div class="bottom">
            <div class="info-btn">
                <a-button class="cancel" :ghost="false">取消</a-button>
                <a-button class="submit" type="primary" :ghost="false">提交</a-button>
            </div>
        </div>
    </xzModal>
</template>

<script lang="ts">
import { systemManagementApi,contentApi } from '../../../libs/api';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Modal, message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { baseApi, ResponseData } from '../../../libs/BaseApi';
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';


interface ditchListType {
    label: string,
    value: string,
    id: string
}

Options({
    components: {},
})
export default class titleOperateCheck extends Vue {
    //栏目名称v-model
	public columnName:string = ''
    //积分数
    public integralNumber:string = ''
	//栏目封面长度
	public coverLength:string = ''
	//栏目封面宽度
	public coverWidth:string = ''

    // //得分规则
    // public scoringRule:string = ''
    // //得分规则下拉框列表数据
	// public scoringRuleList:ditchListType[] = [
    //     {
    //         label: '全部',
	// 		value: '',
	// 		id: ''
	// 	},
	// 	{
    //         label: '图文',
	// 		value: 't',
	// 		id: 't'
	// 	},
	// 	{
	// 		label: '海报',
	// 		value: 'b',
	// 		id: 'b'
	// 	},
	// 	{
	// 		label: '产品',
	// 		value: 'pr',
	// 		id: 'pr'
	// 	},
    //     {
	// 		label: '话题',
	// 		value: 's',
	// 		id: 's'
	// 	},
    //     {
	// 		label: '视频',
	// 		value: 'v',
	// 		id: 'v'
	// 	},
	// ]

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

// .info-title {
//     width: 90%;
// }

// .margin {
//     margin-top: 20px;
// }

// .radio {
//     margin-left: 29px;
// }

// .suggest {
//     // margin-left: 30px;
//     width: 606px;
//     height: 79px;
//     border-radius: 4px;
//     border: 1px solid #ababab;
// }

// // .ant-input :placeholder-shown{
// //  height: 79px;
// //  width: 836px;
// // }
// .sug-title {
//     margin-left: 11px;
// }

// .sug-text {
//     margin-left: 30px;
// }

// .explanNote {
//     margin-left: 35px;
//     margin-top: 10px;
//     // width: 314px;
//     height: 17px;
//     font-size: 12px;
//     font-family: PingFang-SC-Regular, PingFang-SC;
//     font-weight: 400;
//     color: #333333;
//     line-height: 17px;
// }

.info-btn {
    margin-bottom: 30px;
    margin-left: 580px;
    // padding-top: 70px;
}

.cancel {
    margin-right: 20px;
}

</style>

