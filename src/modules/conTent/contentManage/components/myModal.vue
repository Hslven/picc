/ * @FileDescription:自定义的添加对话框组件
* @Author: ZMW
* @Date: 2023-03-29
* @LastEditors: 
* @LastEditTime: 
*/
<template>
    <div class="mymodal">
        <a-modal :visible="showModal" title="新增栏目" @ok="handleOk" @cancel="handleCancel">
            <a-form layout="vertical" ref="formRef" :model="formState" :rules="rules">
                <a-form-item ref="input" label="栏目名称" name="parentId">
                    <a-row type="flex" align="middle" gutter="18">
                        <a-col :span="20">
                            <a-select v-model:value="formState.parentId" show-search placeholder="请输入(可新增也可下拉选择自己已有的栏目)"
                                style="width: 100%" :options="fatherColumnList">
                            </a-select>

                        </a-col>
                        <!-- <a-col :span="1"></a-col> -->
                        <a-col :span="4">
                            <div class="addSonColumn" @click="addSonColumn">
                                <div class="addSonColumn-img">
                                    <img src="../../assets/内容管理-新增栏目_slices/icon／增加子栏目@3x.png" alt="">
                                </div>
                                <div class="addSonColumn-text" label="子栏目名称" name="sonColumn">
                                    子栏目
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-form-item>
                <div v-if="showSon">
                    <a-form-item label="子栏目名称">
                        <a-row type="flex" align="middle" gutter="18">
                            <a-col :span="20">
                                <a-input placeholder="请输入(先选择'栏目名称'后，在新建其'子栏目')"
                                    v-model:value="formState.topicName"></a-input>
                            </a-col>

                            <a-col :span="4">
                                <div class="sonColumn" @click="deletesonColumn"><img
                                        src="../../assets/内容管理-新增栏目-新增子栏目_slices/icon／删除.png" alt="">
                                </div>
                            </a-col>
                        </a-row>
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import {
    BorderInnerOutlined
} from '@ant-design/icons-vue';
import { reactive, UnwrapRef, onMounted, ref } from 'vue';
import { string } from 'vue-types';
interface FormState {
    parentId: string;
    topicName: string,

};
// const labelCol = { span: 4 }
// const wrapperCol = { span: 24 }
const options = ref([
    {
        value: 'jack',
        label: 'Jack',
    },
    {
        value: 'lucy',
        label: 'Lucy',
    },
    {
        value: 'tom',
        label: 'Tom',
    },
]);
const value1 = ref('');
const formState: UnwrapRef<FormState> = reactive({
    parentId: '',
    topicName: ''
});
const rules = {
    parentId: [
        { required: true, message: '请输入栏目', trigger: 'blur' },
    ]
}
const props = defineProps({
    showModal: {
        type: Boolean
    },
    fatherColumnList: {
        type: Array<any>,
        default: [{ label: '全部', value: '' }],
    }
});
const showSon = ref(false)
const emit = defineEmits(['closeModal', 'addson'])
// onMounted(() => {
//     // emit('getFather')
//     getFather()
// })

function handleOk() {
     

    emit('addson', formState)
}
function addSonColumn() {
     
    showSon.value = true
}
function deletesonColumn() {
     
    formState.topicName = ''
    showSon.value = false
}
function handleCancel() {
    emit('closeModal', false)
}
</script>

<style lang="less">
// .mymodal {
.ant-modal-content {
    .ant-modal-header {
        border-bottom: 0px solid #f0f0f0 !important
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

// display: flex;
.addSonColumn {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .addSonColumn-img {
        line-height: 32px;

        img {
            width: 12px;
            height: 12px;
        }
    }

    .addSonColumn-text {
        font-size: 14px;
    }
}

.sonColumn {
    text-align: center;
}

// }
</style>
