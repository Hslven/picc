<template>
    <div ref="modaltopic" class="oneButton-modal">

        <a-modal :visible="showtopicModal" :closable="false" centered :getContainer="() => $refs.modaltopic">
            <slot name="content">
            </slot>
            <template #footer>
                <a-button class="footer-button" @click="closeOneButtonModel">{{ buttonFooter }}</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator';

export default class zmwModal extends Vue {
    @Prop({ require: true }) public showtopicModal!: boolean;
    @Prop({ require: true }) public modalTitle!: string;
    @Prop({ require: true }) public buttonFooter!: string;


    public closeOneButtonModel() {
        this.$emit('closeOneButtonModel', false)
    }
}
</script>
<style lang="less">
.oneButton-modal {
    .ant-modal-content {
        padding: 30px;

        .ant-modal-header {
            border-bottom: 0 solid #f0f0f0 !important
        }

        .ant-modal-body {
            padding-top: 0;
            padding-bottom: 0;
            padding: 0px;
        }
    }

    .ant-modal-footer {
        padding: 0px;
margin-top: 10px;
        button:first-child {
            background-color: #E8380D;
            border: 0px solid #BFBFBF;
            //   background-color: #FFFFFF;
            color: #ffffff;
            width: 84px;
            border-radius: 4px;
            height: 32px;
        }
    }

}
</style>