<template>
	<div>
		<!-- <a-button @click="showPeople">目标人群</a-button>
		<a-button @click="showComparison">对比组人群</a-button>
		<a-button @click="showcontentDescribe">内容描述</a-button> -->
		<div>
			<a-button @click="showDrawer">标签审核</a-button>
			<a-drawer
			:width="866"
            placement="right"
            :closable="false"
            v-model:visible="visible"
            :after-visible-change="afterVisibleChange"
			>
				<titleOperateCheck></titleOperateCheck>
			</a-drawer>
		</div>
		<!-- <peopleDrawer @changePeopleDrawer="changePeopleDrawer" :showPeopleDrawer="showPeopleDrawer"></peopleDrawer>
		<contentDescribe @changeContentDescribe="changeContentDescribe" :showContentDescribe="showContentDescribe"></contentDescribe> -->
	</div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import titleOperateCheck from '@/modules/systemManagement/titleOperateCheck/index.vue';

@Options({
    components: {
		titleOperateCheck,
    }
})
export default class test extends Vue{
	public afterVisibleChange = (bool: boolean) => {
         
    };
	public visible:boolean = false;
	public showDrawer = () => {
        this.visible = true;
    };
}

// const visible =ref<boolean>(false)
// public showPeopleDrawer = ref<boolean>(false)

// public showContentDescribe = ref<boolean>(false)

// function showPeople() {
// 	showPeopleDrawer.value = true
// }
// function showComparison() {
// 	showPeopleDrawer.value = true
// }
// function showcontentDescribe() {
// 	showContentDescribe.value = true
// }
// function changePeopleDrawer(value){
// 	showPeopleDrawer.value = value
// }
// function changeContentDescribe(value){
// 	showContentDescribe.value = value
// }

</script>
  
<style lang="less"></style>



