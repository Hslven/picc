<!--
    / * @FileDescription: 页面顶端新增与更多按钮组件
* @Author: ZMW
* @Date: 2023-08-23
* @LastEditors: 
* @LastEditTime: 
使用方法:
传入changeMoreData，上层组件中changeMoreData格式如下
  public changeMoreData = reactive({
        addName: '新增标签',//单独的按钮
        
        moreList: [{//更多里放置的按钮
           name: '批量删除',//按钮名称
            state: false,//按钮状态（是否展示）
           click: 'delContent',//该按钮在上层组件中的方法名
        }, {
            name: '上架',
            state: false,
            click: 'shelf',
        }],
        showMoreButton: true, //传true
    })

 -->
<template>
  <div>
    <div class="content-right-content-top-button" v-if="changeMoreData.showMoreButton">
      <!-- <button @click="addContent">{{ changeMoreData.addName }}</button> -->
      <a-button style="width: 100px; height: 36px;background: #E8380D;border-radius: 4px;margin-right: 4%;" type="primary"
        danger @click="addContent">
        <div style="display: flex;justify-content: center;align-items: center;">
          <img style="width:20px;height: 20px;margin-right: 7px;" src="../../modules/assets/addWhite.png" alt="">
          {{ changeMoreData.addName }}
        </div>
      </a-button>
      <!-- <div @click.stop="addContent" class="content-right-content-top-addbutton">
                <img src="../../modules/assets/内容管理-列表_slices/icon_add.png" alt="">
                <div class="text">{{ changeMoreData.addName }}</div>
            </div> -->
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <a-menu-item v-for="item in changeMoreData.moreList" key="item" @click="clickFn(item)">{{ item.name
            }}</a-menu-item>
					</a-menu>
        </template>
			  <a-button
					style="width: 77px;height: 36px;border-radius: 4px;"
				>
				  <template #icon>
					  <UnorderedListOutlined />
					</template>
					更多
				</a-button>
			</a-dropdown>
      <!-- <a-dropdown>
        <div class="content-right-content-top-morebutton">
          <img src="../../modules/assets/内容管理-列表_slices/icon_more.png" alt="">
          <div class="text">更多</div>
        </div> -->
        <!-- <button style="margin-left: 3%;">更多</button> -->
        <!-- <template #overlay>
          <a-menu>
            <a-menu-item v-for="item in changeMoreData.moreList" key="item" @click="clickFn(item)">{{ item.name
            }}</a-menu-item> -->

            <!-- <a-menu-item key="1" @click="moreshelf">上架</a-menu-item>
                        <a-menu-item key="2" @click="moredelContent">批量删除</a-menu-item> -->
          <!-- </a-menu>
        </template>
      </a-dropdown> -->
    </div>
    <div v-else>
      <div v-if="operationInfo.state" class="content-right-content-top-button">
        <a-button style="width: 100px; height: 36px;background: #E8380D;border-radius: 4px;margin-right: 4%;" type="primary"
          danger @click="chooseOperate">
          <div style="display: flex;justify-content: center;align-items: center;">
            <img v-if="operationInfo.name === '上架'" style="width:20px;height: 20px;margin-right: 7px;" src="../../modules/assets/listingLogo.png" alt="">
            <img v-if="operationInfo.name === '批量删除'" style="width:20px;height: 20px;margin-right: 7px;" src="../../modules/assets/delAll.png" alt="">
            {{ operationInfo.name }}
          </div>
        </a-button>
        <!-- <div @click="chooseOperate" class="content-right-content-top-addbutton">
          <img :src="'https://mptst.picclife.cn/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + operationInfo.icon"
            alt="">
          <div class="text">{{ operationInfo.name }}</div>
        </div> -->
        <!-- <button class="ghostGrey" @click="chooseOperate">{{ operationInfo.name }}</button> -->
        <div @click="close" style="margin-left: 3%;" class="content-right-content-top-morebutton">
          <img src="../../modules/assets/内容管理-列表_slices/icon_close.png" alt="">
          <div class="text">取消</div>
        </div>
        <!-- <button class="ghostGrey" @click="close" style="margin-left: 3%;">取消</button> -->
      </div>
      <!-- <div v-if="changeMoreData.showshelf">
                <button class="ghostGrey" @click="shelf">上架</button>
                <button class="ghostGrey" @click="close" style="margin-left: 3%;">取消</button>
            </div>
            <div v-if="changeMoreData.showdelContent">
                <button class="ghostColor" @click="delContent">批量删除</button>
                <button class="ghostColor" @click="close" style="margin-left: 3%;">取消</button>
            </div> -->
    </div>

  </div>
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
import { UnorderedListOutlined } from '@ant-design/icons-vue';


@Options({
  components: {
    UnorderedListOutlined
  },
})
export default class contentManage extends Vue {
  @Prop({ require: true }) public changeMoreData!: any;
  // public changeMoreData = reactive({
  //     showMoreButton: true,
  //     showshelf: false,
  //     showdelContent: false,
  // })
  public moreDataList = reactive([])
  created() {

  }
  public src = ref('@/modules/assets/内容管理-列表_slices/')

  public operationInfo = reactive({
    name: '',
    state: false,
    click: '',
    icon: ''
  })
  public clickFn(item: any) {
    this.changeMoreData.showMoreButton = false
    item.state = true
    this.operationInfo = item
    // this.src += item.icon
    console.log(this.operationInfo, item, 'clickFn');
    // this.$emit('chooseDropdownMore',item)
    store.commit('isTableRowSelected', item.isRowSelected)

  }
  public moreshelf() {
    this.changeMoreData.showMoreButton = false
    this.changeMoreData.showshelf = true
  }
  public moredelContent() {
    this.changeMoreData.showMoreButton = false
    this.changeMoreData.showdelContent = true
  }
  public addContent() {
    console.log("addContent1");

    this.$emit('addContent')
  }
  // public shelf() {
  //     this.$emit('shelf')
  // }
  // public delContent() {
  //     this.$emit('delContent')
  // }
  public close() {
    this.changeMoreData.showMoreButton = true
    this.operationInfo.state = false
    store.commit('isTableRowSelected', false)

    // this.changeMoreData.showshelf = false
    // this.changeMoreData.showdelContent = false
  }
  public chooseOperate() {
    console.log(this.operationInfo,'operationInfo')
    // console.log('chooseOperate1', this.operationInfo.click);
    this.$emit('chooseOperate', this.operationInfo)
  }
}
</script>

<style lang="less">
.content-right-content-top-button {
  display: flex;
  justify-content: center;
  align-items: center;

  .content-right-content-top-addbutton {
    padding: 7px 10px;
    background-color: #E8380D;
    border-radius: 4px;
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
    }

    .text {
      color: #ffffff;
      // font-size: 14px;

    }
  }

  .content-right-content-top-morebutton {
    margin-left: 16px;
    padding: 7px 10px;
    background-color: #ffffff;
    border: 1px #ABABAB solid;
    border-radius: 4px;
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
    }

    .text {
      font-size: 14px;
      color: #666666;
    }
  }
}
</style>