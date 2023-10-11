
<template>
  <!-- ref="modal" 将用于挂载modal组件 -->
  <div ref="mountZmwModal" class="zmw-modal">
    <!-- / * @FileDescription:封装的弹框组件
    * @Author: ZMW
    * @Date: 2023-04-11
    * @LastEditors:
    * @LastEditTime:
    */ -->
    <div class="mymodal">
      <a-modal :visible="showModal" :footer="null" centered style="width: 400px;height: 160px;"
        :getContainer="() => $refs.mountZmwModal">
        <a-row>
          <a-col :span="4">
            <img v-if="modalTitle === '删除' || modalTitle === '上架'" style="width: 32px;height: 32px;margin: 16px 0px;" src="../assets/fail.png" alt="">
          </a-col>
          <a-col :span="20">
            <p style="font-size: 18px;font-weight: 500;color: #000000;margin:18px 0px;">操作确认</p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :push="4" :span="20">
            <p style="font-size: 14px;font-weight: 400;color: #666666;margin-bottom: 32px;">
              <slot name="content">
              </slot>
            </p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :push="4" :span="20" style="margin-bottom: 16px;display: flex;justify-content: end;align-items: center;">
            <a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="closeModal">取消</a-button>
            <a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="handleOk">确定</a-button>
          </a-col>
        </a-row>
      </a-modal>
    </div>
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
     console.log(this.modalTitle,'modalTitle')
    this.$emit('closeModal', false)
  }
}
</script>

<style lang="less">
// .mymodal {
.ant-modal-content {
  .ant-modal-header {
    border-bottom: 0 solid #f0f0f0 !important
  }

  .ant-modal-body {
    padding-top: 0;
    padding-bottom: 0;

  }

  .ant-modal-footer {
    border-top: 0 solid #f0f0f0;

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
      border: 0 solid #000000;
      background-color: #E8380D;
      color: #ffffff;
      width: 84px;
      border-radius: 4px;
      height: 32px;
    }
  }

}

.zmw-modal {
  /deep/.ant-modal {
    &.add-tag-modal {
      width: 540px !important;
      height: 200px;
      overflow: hidden;
      border-radius: 10px;
    }

    .ant-modal-content {
      height: 100%;

      .ant-modal-header {
        padding: 24px 26px 22px;

        .ant-modal-title {
          font-size: 14px;
          font-weight: bold;
        }
      }

      .ant-modal-body {
        padding: 0 26px;
        font-weight: bold;
      }

      .ant-modal-footer {
        .ant-btn {
          width: 74px;
          height: 28px;
          font-size: 12px;
        }
      }
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

// }</style>
