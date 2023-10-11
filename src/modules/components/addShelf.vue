<template>
	<div>
		<a-modal style="width: 610px;height: 100px;background: #FFFFFF;border-radius: 6px;" v-model:visible="addShelfValue">
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;background: #FFFFFF;border-radius: 4px;"
					@click="colseAddShelf">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;"
					@click="sureAddShelf">确定</a-button>
			</template>
			<p style="width: 176px;height: 22px;font-size: 16px;font-weight: 500;color: #333333;line-height: 22px;">
				确定上架该文章吗？</p>
		</a-modal>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator';
export default class contentManage extends Vue {
	public addShelfValue = true
	//取消上架，关闭弹窗
	public colseAddShelf() {
		this.$emit('colseShelf', false)
	}
	//确定上架
	public sureAddShelf() {
		 

	}
}
</script>

<style lang="less" scoped></style>