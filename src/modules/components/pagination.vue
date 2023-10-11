<template>
	<div class="operationManage_page">
		<div class="operationManage_page_content">
			<a-pagination :show-total="()  => `共 ${pagination.total} 条`" v-model:pageSize="pagination.pageSize"
				v-model:current="pagination.current" show-quick-jumper :total="pagination.total"
				@change="changePage($event)" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	ref,
	Ref,
	onMounted,
	watch,
	defineEmits,
	defineProps,

} from 'vue';
const emit = defineEmits<(event: string, ...args: any[]) => void>();
const paginationData = defineProps<{
  propName: string | any[] | Pagination;
}>();

interface Pagination {
	current: number;
	pageSize: number;
	defaultCurrent: number;
	defaultPageSize: number;
	total: number;
	showSizeChanger: boolean;
	showQuickJumper: boolean;
	pageSizeOptions: string[];
	showTotal: (total: number) => string;
}

const pagination: Ref<Pagination> = ref({
	current: 1,
	pageSize: 10,
	defaultCurrent: 1,
	defaultPageSize: 10,
	total: 0,
	showSizeChanger: true,
	showQuickJumper: true,
	pageSizeOptions: [],
	showTotal: (total: number) => `共 ${total} 条`,
});


const changePage = (e: any) => {
	emit('changePage', e)
}
const inits = () => {

  if (typeof paginationData.propName === 'object') {
    pagination.value = paginationData.propName as Pagination;
  }
}


//传值变化触发
watch(() => paginationData.propName, (newValue, oldValue) => {
	if (newValue !== oldValue) {
		inits()
	}

});
onMounted(() => {
	inits()
});

</script>
<style lang="less" scoped>
.operationManage_page {
	position: absolute;
	padding: 0px 16px 0px 16px;
	width: 100%;
	height: 6.6%;
	bottom: 10px;
	right: 2px;
	display: flex;
	justify-content: end;
	align-items: center;

}

.operationManage_page_content {
	width: 100%;
	background-color: #fff;
	display: flex;
	justify-content: end;
	align-items: center;
	padding-bottom: 10px;
}
</style>