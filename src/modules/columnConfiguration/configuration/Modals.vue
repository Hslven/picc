
<template>
    <div ref="mountZmwModal" class="modal">
      <div class="mymodal">
        <a-modal :visible="showModal" centered :title="modalTitle" @ok="handleOk" @cancel="closeModal"
          :getContainer="() => $refs.mountZmwModal">
          <slot name="content">
          </slot>
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
  
  .modal {
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
  </style>
  