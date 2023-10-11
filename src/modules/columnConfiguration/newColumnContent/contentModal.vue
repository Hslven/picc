<template>
        <div style="border-left: 2px solid #0F40F5;margin-left: 10px;margin-top: -10px;padding-left: 10px;">添加内容</div>
        <hr style="margin-left: 10px;margin-top: 10px;"/>
        <a-tabs 
          v-model:activeKey="activeKey" 
          
          style="margin-left: 10px;"  
          class="menu-tabs">
          <a-tab-pane key="1" tab="海报">
            <poster>

            </poster>
          </a-tab-pane>
          <a-tab-pane key="2" tab="活动">
            <activity>

            </activity>
          </a-tab-pane>
          <a-tab-pane key="3" tab="内容" force-render>
            <matter>

            </matter>
          </a-tab-pane>
        </a-tabs>
</template>
<script lang="ts" setup>
import activity from '../newColumnContent/Addcontent/activity.vue';
import poster from '../newColumnContent/Addcontent/poster.vue';
import matter from '../newColumnContent/Addcontent/matter.vue';
import { ref } from 'vue';
import { Modal } from 'ant-design-vue';
import { Options, Vue } from 'vue-class-component';
const activeKey = ref('1');
// export default class User extends Vue {}
</script>

<style lang="less" scoped >

	//下划线修改
	:deep(.ant-tabs-ink-bar) {
		background-color: #E99D42;
	}

	//选中颜色修改
	:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
		color: #E99D42;
	}
	
	//悬浮颜色修改
	:deep(.ant-tabs-tab:hover) {
		color: #E99D42;
	}

  :deep(.ant-tabs-tab){
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 12px 0;
    font-size: 14px;
    background: transparent;
    border: 0;
    outline: none;
    cursor: pointer;
    width: 50px;
}
:deep(.ant-tabs-tab-btn) {
    outline: none;
    transition: all 0.3s;
    padding-left: 10px;
}

</style>
  
  