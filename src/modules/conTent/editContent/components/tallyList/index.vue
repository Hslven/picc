<template>
	<!-- 选择标签抽屉 -->
	<div class="tally-list">
		<div class="tally-list-name" v-for="(item,index) in findLabelTreeData" :key="item.id">
			<div style="display: flex;justify-content:space-between;align-items: center;" v-if="item.children.length > 0">
				<div style="width: 100%">
					<div  @click="openTallySwitch(item)">{{ item.name }}</div>
					<tree :treeData="item.children" v-if="item.open === '0'" @checkSureTreeList="checkSureTreeList"></tree>
				</div>
				<div>
					<a-button v-if="item.open === undefined || item.open === '1'" class="tally-list-switch" @click="openTallySwitch(item)">
						<template #icon>
							<down-outlined />
						</template>
					</a-button>
					<a-button v-if="item.open === '0'" class="tally-list-switch" @click="closeTallySwitch(item)">
						<template #icon>
							<up-outlined />
						</template>
					</a-button>
				</div>
			</div>
			<div style="display: flex;justify-content:space-between;align-items: center;" v-if="item.children.length === 0">
				<span v-if="item.leafFlag === '0'">{{ item.name }}</span>
				<a-checkbox v-model:checked="item.checkAll" @change="onCheckAllChange(item,index)" v-if="item.leafFlag === '1'">
					{{ item.name }}
				</a-checkbox>
			</div>
		</div>
		<div class="tally-list-btn">
			<a-button type="primary" danger style="width:140px;height:32px;border-radius: 4px;" @click="addTallyIug">新增自定义标签</a-button>
			<div>
				<a-button style="width:84px;height:32px;border-radius: 4px;margin-right:10px" @click="colseTallyList">取消</a-button>
				<a-button type="primary" danger style="width:84px;height:32px;border-radius: 4px;" @click="sureTallyList">确定</a-button>
			</div>
		</div>
		<a-modal v-model:visible="makeAddTallyBoolean" style="padding: 20px 50px;" >
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;border-radius: 4px;" @click="cancleSureAddAdvertising">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="makeSureAddAdvertising">确定</a-button>
			</template>
			<p style="padding: 30px 50px 30px 30px;">确定添加选中标签吗？</p>
    </a-modal>
		<a-modal v-model:visible="makeAddTallyIug" style="padding: 20px 50px;">
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;border-radius: 4px;" @click="cancleSureAddIug">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="makeSureAddIug">确定</a-button>
			</template>
			<a-spin :spinning="labelLoading">
				<div style="padding: 30px 50px 30px 30px;">
					<p style="padding: 30px 50px 30px 30px;">添加自定义标签</p>
					<a-input v-model:value="addTallyIugInput"></a-input>
				</div>
			</a-spin>
    </a-modal>
		<a-modal v-model:visible="makeAddTallyIugBoolean" style="padding: 20px 50px;" >
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;border-radius: 4px;" @click="cancleSureAddIugCancle">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="makeSureAddIugBoolean">确定</a-button>
			</template>
			<p style="padding: 30px 50px 30px 30px;">确定添加选中标签吗？</p>
    </a-modal>
	</div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import { Prop } from 'vue-property-decorator';
import { computed } from 'vue';
import { message } from 'ant-design-vue';
import store from '@/modules/conTent/store';
import tree from './components/tree.vue'
import { contentApi } from '@/libs/api';
import { useRoute } from 'vue-router'

@Options({
	components: {
		DownOutlined,
		UpOutlined,
		tree
	}
})
export default class tallyList extends Vue {
	@Prop({ default: false }) public labeTreeList!: any[]
	public states: any = store.state
	public findLabelTreeData:any = computed(() => {
		const addContent = this.states.addContent
		return addContent.labeTreeList
	})
	//展开具体二级标签
	public openTallySwitch(item: any) {
		item.open = '0'
	}
	//关闭具体二级标签
	public closeTallySwitch(item: any) {
		item.open = '1'
	}
	public route = useRoute()
	//自定义标签弹窗
	public makeAddTallyIug:boolean = false
	public addTallyIugInput:string = ''
	// 添加自定义标签loading
	public labelLoading:boolean = false
	//添加自定义标签
	public addTallyIug(){
			// this.checkSureTallyListData = this.checkSureTallyEditListData.filter((res:any) => { return (res.checkAll === true); });
			//  
		this.makeAddTallyIug = true
	}
	public cancleSureAddIug(){
		this.makeAddTallyIug = false
		this.addTallyIugInput = ''
	}
	public makeSureAddIug(){
		if(this.addTallyIugInput === ''){
			message.info('请输入自定义标签名称')
			return
		} else {
			this.labelLoading = true
			this.makeSureAddIugBoolean()
			// this.makeAddTallyIugBoolean = true
		}
	}
	//添加自定义标签确认弹窗
	public makeAddTallyIugBoolean:boolean = false
	public cancleSureAddIugCancle(){
		this.makeAddTallyIugBoolean = false
	}
	public editDataList:any = {}
	public makeSureAddIugBoolean(){
		let params = {
			parentId:'CustomLabel',
			labelName:this.addTallyIugInput,
			groupId:'CustomLabel',
			customizeLabel:'true'
		}
		contentApi.getAddLabel(params,{}).then((res:any) => {
			let params = {
				id:''
			}
			 
			contentApi.getFolderLabel(params,{}).then(res => {
				 
				store.commit('getLabeTreeList',res.data)
				// this.findLabelTreeData = res.data
				 
				// if(this.route.query.editType === '0'){

				// } else {
				// 	let labelTreeList = res.data
				// 	let editContent = this.states.editContent.editContentList
				// 	this.editDataList = editContent
				// 	this.editDataList.labelIds = editContent.labelIds
				// 	this.editDataList.labelIds = this.editDataList.labelIds.split(',')
				// 	this.editDataList.labelIds.forEach((res:any) => {
				// 		this.getTreeId(labelTreeList,res)
				// 	})
				// 	 
				// 	store.commit('getLabeTreeList',labelTreeList)
				// 	this.checkSureTallyListData = this.checkSureTallyEditListData.filter((res:any) => { return (res.checkAll === true); });
				// 	this.$emit('checkSureTallyList',this.checkSureTallyListData)
				// }
				this.labelLoading = false
				this.makeAddTallyIugBoolean = false
				this.makeAddTallyIug = false
				this.addTallyIugInput = ''
				message.info('添加自定义标签成功')
				// this.labeTreeList = res.data
			})
			
		})
	}
	public checkSureTallyListData:any = []
	public checkSureTallyEditListData:any = []
	public getTreeId(list:any,id:any){
    for (let i = 0; i < list.length; i++) {
      if(list[i].id===id){
				list[i].checkAll = true
				this.checkSureTallyEditListData.push(list[i])
        return list[i]
      }else if(list[i].children && list[i].children.length>0){
      let nameList:any = this.getTreeId(list[i].children,id)
        if(nameList){
					 
					nameList.checkAll = true
					this.checkSureTallyEditListData.push(nameList)
          return nameList
        }  
      }
    }
  }
	//取消按钮，传值关闭
	public colseTallyList(){
		this.$emit('colseTallyListBoolean',false)
	}
	//确认按钮弹窗v-model
	public makeAddTallyBoolean:boolean = false
	//确认按钮
	public sureTallyList(){
		 
		let checkList:any = []
		if(this.checkSureList.length === 0){
			message.info('请选择标签')
			return
		} else {
			this.checkSureList.filter((res:any) => {if(res.checkAll === true){checkList.push(res)}})
			if(checkList.length === 0){
				message.info('请选择标签')
				return
			} else {
				this.makeAddTallyBoolean = true
			}
		}
	}
	//确认弹窗-取消
	public cancleSureAddAdvertising(){
		this.makeAddTallyBoolean = false
	}
	//确认弹窗-确认
	public makeSureAddAdvertising(){
		store.commit('getLabeTreeList',this.findLabelTreeData)
		this.makeAddTallyBoolean = false
		this.$emit('colseTallyListBoolean',false)
		this.$emit('checkSureTallyList',this.checkSureList)
	}
	//确认弹窗添加
	public checkSureTreeList(value:any){
		if(this.checkSureList.length === 0){
			this.checkSureList.push(value)
		} else {
			this.checkSureList.forEach((item:any,index:number) => {
				if(item.id === value.id){
					item = value
				}
				if(item.id !== value.id) {
					this.checkSureList.push(value)
				}
			})
		}
		let delArray = new Set(this.checkSureList)
		this.checkSureList = Array.from(delArray)
		 
	}
	public checkSureList:any[] = []
	public onCheckAllChange(item:any,index:number){
		 
		if(this.checkSureList.length === 0){
			this.checkSureList.push(item)
		} else {
				this.checkSureList.forEach((res:any) => {
				if(res.id === item.id){
					res.checkAll = item.checkAll
				} else {
					 
					this.checkSureList.push(item)
				}
			})
		}
		let delArray = new Set(this.checkSureList)
		this.checkSureList = Array.from(delArray)
		//  
		// if(item.checkAll === undefined){
		// 	item.checkAll = true
		// 	this.checkSureList.push(item)	
		// } else if(item.checkAll === true){
		// 	this.checkSureList.forEach((res:any) => {
		// 		if(item.id === res.id){
		// 			res.checkAll = false
		// 		}
		// 	})
		// } else if(item.checkAll === false){
		// 	this.checkSureList.forEach((res:any) => {
		// 		if(item.id === res.id){
		// 			res.checkAll = true
		// 		}
		// 	})
		// }
		 
	}
}
</script>
<style lang="less" scoped>
.tally-list {
	height: 100%;
	.tally-list-btn{
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}

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