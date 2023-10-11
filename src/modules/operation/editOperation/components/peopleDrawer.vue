
<!--
    / * @FileDescription: 目标人群/对比组人群抽屉插件-----一期不做
* @Author: Hjb
* @Date: 2023-03-28
* @LastEditors: 
* @LastEditTime:  -->

<template>
	<div>
		<!-- <a-drawer :width="720" :body-style="{ paddingBottom: '80px' }" :closable="false" :visible="showPeopleDrawer"
				@close="onClose"> -->
		<div class="drawer-Title">添加人群</div>
		<div class="drawer-From">
			<a-row>
				<a-col :span="16">
					<a-form :label-col="labelCol" :wrapper-col="wrapperCol" :model="formData">
						<a-form-item label="人群名称">
							<a-input v-model:value="formData.name" />
						</a-form-item>
					</a-form>
				</a-col>
				<a-col :span="4">
					<button class="solidColor" @click="search">查询</button>
				</a-col>
				<a-col :span="4">
					<button class="ghostGrey" @click="reset">重置</button>
				</a-col>
			</a-row>
		</div>
		<div class="drawer-Table">
			<a-table :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" :columns="columns"
				:data-source="data" />
		</div>
		<div class="drawer-Button">
			<a-row>
				<a-col :span="16"></a-col>
				<a-col :span="4">
					<button class="ghostGrey" @click="cancel">取消</button>
				</a-col>
				<a-col :span="4">
					<button class="solidColor" @click="addPeople">添加人群</button>
				</a-col>
			</a-row>
		</div>
		<!-- </a-drawer> -->
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, UnwrapRef } from 'vue'
import { ColumnProps } from 'ant-design-vue/es/table';
type Key = ColumnProps['key'];
interface DataType {
	key: Key;
	mingcheng: string;
	guimo: string;
	chuangjianren: string;
	shijian: string;
};
const formData = reactive({
	name: ''
});
// const props = defineProps({
//     showPeopleDrawer: {
//         type: Boolean
//     },
// })
// const emit = defineEmits(['changePeopleDrawer'])
const labelCol = { span: 4, }
const wrapperCol = { span: 18, }
const columns: any[] = [
	{
		title: '人群名称',
		dataIndex: 'mingcheng',
	},
	{
		title: '人群规模',
		dataIndex: 'guimo',
	},
	{
		title: '创建人',
		dataIndex: 'chuangjianren',
	},
	{
		title: '创建时间',
		dataIndex: 'shijian',
	},
]
const data: DataType[] = [
	{
		key: 1,
		mingcheng: '123',
		guimo: 'weer',
		chuangjianren: 'sdfgh',
		shijian: 'dfghj'
	},
	{
		key: 2,
		mingcheng: '123',
		guimo: 'weer',
		chuangjianren: 'sdfgh',
		shijian: 'dfghj'
	},
	{
		key: 3,
		mingcheng: '123',
		guimo: 'weer',
		chuangjianren: 'sdfgh',
		shijian: 'dfghj'
	},
	{
		key: 4,
		mingcheng: '123',
		guimo: 'weer',
		chuangjianren: 'sdfgh',
		shijian: 'dfghj'
	}
]
const state = reactive<{
	selectedRowKeys: Key[];
	loading: boolean;
}>({
	selectedRowKeys: [], // Check here to configure the default column
	loading: false,
});
function onClose() {
	 
	
}
function cancel() {
	 

}
function addPeople() {
	 
}
function onSelectChange(selectedRowKeys: Key[]) {
	 
	state.selectedRowKeys = selectedRowKeys;
};
function search() {
	 
}
function reset() {
	 
}
</script>

<style lang="less" scoped>
@import '@/modules/style/button.css';

.drawer-From {
	margin-top: 44px;
}
</style>