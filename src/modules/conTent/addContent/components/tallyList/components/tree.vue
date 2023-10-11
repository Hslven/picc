<template>
	<div>
		<a-row :gutter="24">
			<a-col :xs="24" :sm="24" :xl="24" :xxl="24">
				<div class="tally-list-name" v-for="(item,index) in treeData" :key="item.id">
					<div v-if="item.children.length > 0">
						{{ item.name }}
						<tree :treeData="item.children" v-if="item.children.length > 0" @checkSureTreeList="checkSureTreeList"></tree>
					</div>
					<div v-if="item.children.length === 0">
						<span v-if="item.leafFlag === '0'">{{ item.name }}</span>
						<a-checkbox v-model:checked="item.checkAll" @change="onCheckAllChange(item,index)" v-if="item.leafFlag === '1'">
							{{ item.name }}
						</a-checkbox>
					</div>
				</div>
			</a-col>
		</a-row>
	</div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { contentApi } from '@/libs/api'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';
import store from '@/modules/conTent/store';

@Options({
	name:'Tree',
	components: {
		DownOutlined,
		UpOutlined,
	}
})
export default class tallyList extends Vue {
	public created(): void {
	}
	public states: any = store.state
	@Prop({ default: false }) public treeData!: any;
	public checkSureList:any = {}
	public onCheckAllChange(item:any,index:number){
		 
		// if(item.checkAll === true){
		// 	this.checkSureList = item
		// } else if(item.checkAll === true && (this.checkSureList.id === item.id)){
		// 	this.checkSureList.checkAll = false
		// }	else if(item.checkAll === false && (this.checkSureList.id === item.id)){
		// 	this.checkSureList.checkAll = true
		// }
		this.$emit('checkSureTreeList',item)
	}
	public checkSureTreeList(value:any){
		this.$emit('checkSureTreeList',value)
	}
}
</script>
<style lang="less">
.tally-list-name {
	// width: 656px;
	background: #F8F7F7;
	border-radius: 6px;
	padding: 10px;
	// display: flex;
	// justify-content: space-between;
	// align-items: center;
	margin-top: 10px;

	.tally-list-switch {
		border: solid 0px;
		background: #F8F7F7;
	}
}
</style>