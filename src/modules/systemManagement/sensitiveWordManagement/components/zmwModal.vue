/ * @FileDescription:封装的弹框组件
* @Author: ZMW
* @Date: 2023-04-11
* @LastEditors: 
* @LastEditTime: 
*/
<template>
    <div class="mymodal">
        <a-modal :visible="showModal" :title="modalTitle" @ok="handleOk" @cancel="closeModal">
            <slot name="content">
            </slot>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator';

export default class zmwModal extends Vue {
    @Prop({ require: true }) public showModal!: boolean;
    @Prop({ require: true }) public modalTitle!: string;

    public handleOk() {
         
        this.$emit('handleOkModal', false)
    }
    public closeModal() {
         
        this.$emit('closeModal', false)
    }
}
</script>

<style lang="less">
// .mymodal {
.ant-modal-content {
    .ant-modal-header {
        border-bottom: 0px solid #f0f0f0 !important
    }

    .ant-modal-body {
        padding-top: 0;
        padding-bottom: 0;

    }

    .ant-modal-footer {
        border-top: 0px solid #f0f0f0;

        button:first-child {
            // color: red;
            border: 1px solid #BFBFBF;
            background-color: #FFFFFF;
            color: #333333;
            width: 84px;
            border-radius: 4px;
            height: 32px;
        }

        button:nth-child(2) {
            // color: red;
            border: 0px solid #000000;
            background-color: #E8380D;
            color: #ffffff;
            width: 84px;
            border-radius: 4px;
            height: 32px;
        }
    }

}

// // display: flex;
// .addSonColumn {
//     border: 1px solid #d9d9d9;
//     border-radius: 2px;
//     width: 100%;
//     height: 32px;
//     line-height: 32px;
//     display: flex;
//     align-items: center;
//     justify-content: space-around;

//     .addSonColumn-img {
//         line-height: 32px;

//         img {
//             width: 12px;
//             height: 12px;
//         }
//     }

//     .addSonColumn-text {
//         font-size: 14px;
//     }
// }

// .sonColumn {
//     text-align: center;
// }

// }
</style>
