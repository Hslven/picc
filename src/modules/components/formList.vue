<!--
    / * @FileDescription: form表单封装
* @Author: ZMW
* @Date: 2023-08-23
* @LastEditors: 
* @LastEditTime: 

type取值
input----type=1
select----type=2
picker----type=3
 -->
<template>
  <a-form>
    <a-row :gutter="24" v-for="item in formDataList" :key="item.key">
      <a-col :span="4" v-if="item.type === 1">
        {{ item.name }}：
      </a-col>
      <a-col :span="16" v-if="item.type === 1">
        <a-form-item :style="{ '--width': `${item.width}px` }">
          <a-input :placeholder="item.placeholder" v-model:value="item.value" />
        </a-form-item>
      </a-col>
      <a-col :span="4" v-if="item.type === 2">
        {{ item.name }}：
      </a-col>
      <a-col :span="16" v-if="item.type === 2">
        <a-form-item :style="{ '--width': `${item.width}px` }">
          <a-select @change="changeFn(item)" v-model:value="item.value" :placeholder="item.placeholder">
            <a-select-option v-for="i in item.selectList" :key="i" :value="i.value">{{ i.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="4" v-if="item.type === 3">
        {{ item.name }}：
      </a-col>
      <a-col :span="16" v-if="item.type === 3">
        <a-form-item :style="{ '--width': `${item.width}px` }">
          <a-range-picker style="width:100%" v-model:value="item.value" format="YYYY-MM-DD" @change="changeTimeFn" />
        </a-form-item>
      </a-col>
    </a-row>
    <!-- <button class="solidColor" @click="onSubmit">瞅瞅</button> -->

  </a-form>

  <!-- <a-form-item label="封面：">
        <a-select @change="changeLabel" v-model:value="formData.cover" placeholder="默认第一项">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="y">已上传</a-select-option>
            <a-select-option value="n">待上传</a-select-option>
        </a-select>
    </a-form-item>

    <a-form-item label="所属标签：">
        <a-select @change="changeLabel" v-model:value="formData.owntag" placeholder="默认第一项">
            <a-select-option v-for="item in tagsList" :key="item" :value="item.labelId">{{
                item.labelName }}</a-select-option>
        </a-select>
    </a-form-item>

    <a-form-item label="内容状态：">
        <a-select v-model:value="formData.contentstate" placeholder="默认第一项">
            <a-select-option v-for="item in contentstateList" :key="item" :value="item.value">{{
                item.name }}</a-select-option>
        </a-select>
    </a-form-item>

    <a-form-item label="创建时间:">
        <a-row>
            <a-range-picker v-model:value="formData.searchTime" format="YYYY-MM-DD" @change="searchTimeChange" />
        </a-row>
    </a-form-item>

    <a-form-item label="话题类型:">
        <a-select v-model:value="formData.topicType" placeholder="默认第一项">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="p">PK</a-select-option>
            <a-select-option value="d">讨论</a-select-option>
        </a-select>
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
        <button class="solidColor" @click="onSubmit">查询</button>
        <button class="ghostGrey" style="margin-left: 5%" @click="reset">重置</button>
    </a-form-item> -->
</template>
<script lang="ts">

import { contentApi } from '@/libs/api';

import { Options, Vue } from 'vue-class-component';
import { FolderOutlined, } from '@ant-design/icons-vue';
import ChangeDropdown from './changeDropdown.vue';
// import zmwModal from '../components/zmwModal.vue';
// // import myTree from './myTree.vue'
import store from '@/modules/conTent/store';
import { ref, reactive } from 'vue';
import { Prop } from 'vue-property-decorator';
import { emit } from 'process';
import { log } from 'console';

import { Moment } from 'moment'
interface formDataType {
  [key: string]: string;
}
@Options({
  components: {
  },
})
export default class contentManage extends Vue {
  @Prop({ require: true }) public formDataList!: any;
  // public formDataList = reactive([
  //     { type: 1, name: '标题名称：', key: 'titlename', value: '', placeholder: '' }, //标题名称
  //     { type: 2, name: '封面', key: 'cover', value: '', selectList: [{ name: '全部', value: '' }, { name: '已上传', value: 'y' }, { name: '已上传', value: 'n' }] }, //封面
  //     { type: 2, name: '所属标签', key: 'owntag', value: '' }, //所属标签
  //     { type: 2, name: '内容状态', key: 'contentstate', value: '' }, //内容状态
  //     { type: 3, name: '创建时间', key: 'searchTime', value: '' }, //时间选择器时间 

  // ]);
  created() {
    // this.formDataList.forEach((item: any) => {
    //     this.formData[item.key] = item.value
    // })
    // console.log('初始化this.formData', this.formData);
    // console.log(this.formDataList, 'formList--created');

  }

  public formData = reactive<formDataType>({})
  // public onSubmit() {
  //     console.log(this.formDataList, 'formList---submit');
  //     console.log(this.formData, 'formList---formData');
  //     this.$emit('', this.formData)
  // }
  public changeFn(item: any) {
    console.log(item, item.key, item.value, 'formList--change');
    this.formData[item.key] = item.value
    // this.$emit('getformData', this.formData)
  }
  public changeTimeFn = (value: Moment[], dateString: string[]) => {
    console.log(dateString[0], dateString[1], 'formList--change');
    this.formData.starttime = dateString[0]
    this.formData.endtime = dateString[1]
    this.$emit('changeTimeFn', dateString[0], dateString[1])
  };

}
</script>

<style lang="less">
.formList-input {
  .ant-form-item-control-input-content {
    // width: 100%; 

    width: var(--width);

  }
}

.formList-select {
  .ant-form-item-control-input-content {
    // width: 100%; 
    width: var(--width);


  }

}

.formList-picker {
  .ant-form-item-control-input-content {
    // width: 100%; 


    width: var(--width);

    .ant-picker-range {
      width: 100%;
    }

  }
}
</style>