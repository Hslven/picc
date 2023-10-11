<!-- 反显内容描述 -->
<template>
  <div>
    <a-table :columns="columns" :data-source="tableList" bordered :pagination="false" style="margin-top:10px">
      <template #action="{record}">
				<a-dropdown :trigger="['click']" v-if="record.resourceName === '具体文章'">
					<a class="ant-dropdown-link" @click.prevent>
			  		<p style="font-size: 26px;line-height: 30px;text-align: center;">···</p>
					</a>
					<template #overlay>
						<a-menu>
							<a-menu-item
								@click="handleChoose(record)"
								>详情
							</a-menu-item>
              <a-menu-item
								@click="delChoose(record)"
								>删除
							</a-menu-item>
						</a-menu>
					</template>
				</a-dropdown>
			</template>
		</a-table>
    <div class="button-type">
      <a-button
        style="height:32px;border-radius: 4px;margin-right:2%;border:solid 1px #E8380D;background: rgba(232,56,13,0.1);"
        type="primary"
        @click="addTableList"
        danger>
        <span style="margin-right:6px;color:#E8380D ;">+</span>
        <span style="color:#E8380D ;">添加</span>
      </a-button>
      <a-button
        style="height:32px;border-radius: 4px;margin-right:2%"
        @click="cancelShowContent()"
        >取消</a-button>
      <a-button
        type="primary"
        danger
        style="height:32px;border-radius: 4px;margin-right:2%"
        @click="cancelShowContent()"
        >确定</a-button>
    </div>
    <a-modal
				style="background: #FFFFFF;border-radius: 6px;"
				v-model:visible="preBrowseVisible">
				<template #footer>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="colseShelf">取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureShelf">确定</a-button>
				</template>
				<p style="width: 176px;font-size: 16px;font-weight: 500;color: #333333;"
						>确认删除所选内容吗？
				</p>
			</a-modal>
  </div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import store from '@/modules/operation/store';
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';

interface tableListType {
  resourceName:string
  columnClassification:string
  contentId:string
  verticalCoverFile:string
  titleName:string
  contentClassification:string
  contentStatusName:string
  shelfTime:string
  value:string
  addValue:string
}
@Options({
  components:{
  }
})
export default class displayContentDesc extends Vue {
  public state:any = store.state
  //表头
  public columns = [
    {
			title: '关联方式',
      dataIndex: 'resourceName',
			align:'center',
    },
    {
      title: '栏目分类',
      dataIndex: 'columnClassification',
			align:'center',
    },
    {
      title: '封面',
			dataIndex: 'verticalCoverFile',
			align:'center'
    },
    {
      title: '标题名称',
			dataIndex: 'titleName',
			align:'left'
    },
    {
      title: '内容分类',
			dataIndex: 'contentClassification',
			align:'center'
    },
    {
      title: '内容状态',
			dataIndex: 'contentStatusName',
			align:'center'
    },
    {
      title: '上架时间',
			dataIndex: 'shelfTime',
			align:'center'
    },
    {
      title: '操作',
			dataIndex: 'action',
			align:'center',
      slots: { customRender: 'action' },
    },
  ]
  //反显内容列表
  public changeType = true
  public tableList:any = computed(() => {
    let saveTableList:tableListType[] = []
     
    const displayContentList = this.state.contentList.displayContentList
     
    displayContentList.displayContent.forEach((item: { formData: any; dataList: any; value:string;addValue:string},index:number) => {
      if(typeof item.formData.type === 'string'){
        item.formData.type = JSON.parse(item.formData.type)
      }
      if(item.formData.resource === '1'){
        saveTableList.push({
          resourceName:'内容分类',
          // columnClassification:'',
          columnClassification:'内容类型:' +  item.formData.type.map((res: string) => {return res === 't' ? '文本' : res === 'p' ? '图文' : res === 'hv' ? '横板视频' : res === 'vv' ? '竖版视频' : res === 'b' ? '海报' :'' }),
          contentId:'筛选标签:',
          verticalCoverFile:'',
          titleName:'',
          contentClassification:'',
          contentStatusName:'',
          shelfTime:'',
          value:item.value,
          addValue:item.addValue
        })
      } 
      else {
        item.dataList.forEach((oes: any) => {
          saveTableList.push({
            resourceName:'具体文章',
            columnClassification: oes.columnClassification,
            contentId:oes.contentId,
            verticalCoverFile:oes.verticalCoverFile,
            titleName:oes.titleName,
            contentClassification:oes.contentClassification,
            contentStatusName:oes.contentStatus === '0' ? '暂存' : oes.contentStatus === '1' ? '待审核' : oes.contentStatus === '3' ? '审核不通过' : oes.contentStatus === '4' ? '已删除' : oes.contentStatus === '5' ? '已上架' :'',
            shelfTime:oes.shelfTime,
            value:item.value,
            addValue:item.addValue
          })
        })
      }
    })
    return saveTableList
  })
  //新增
  public addTableList(){
    this.$emit('increaseAgainFormData',false)
  }

  //取消
  public cancelShowContent(){
    this.$emit('showContentDescBoolean',false)
  }

  public router = useRouter()
  //跳转详情
  public handleChoose(record:any){
    this.router.push({path:'/content/contentDetail', query: { contentId: record.contentId }})
  }
  public delContentId:string = ''
  //删除弹窗
  public preBrowseVisible:boolean = false
  //删除指定项
  public delTableValue:string = ''
  public addValue:string = ''
  //删除
  public delChoose(record:any){
    this.addValue = record.addValue
    this.delTableValue = record.value
    this.delContentId = record.contentId
    this.preBrowseVisible = true
  }
  //取消删除
  public colseShelf(){
    this.preBrowseVisible = false
  }
  //确认删除
  public sureShelf(){
    let displayContentList = this.state.contentList.displayContentList
    displayContentList.displayContent.forEach((item:any) => {
      if(item.addValue === '' && item.value === this.delTableValue){
        item.dataList = item.dataList.filter((res:any) => {
          return res.contentId !== this.delContentId
        })
      } else if(item.addValue === this.addValue && item.value === this.delTableValue){
        item.dataList = item.dataList.filter((res:any) => {
          return res.contentId !== this.delContentId
        })
      }
    })
    displayContentList.displayContent = displayContentList.displayContent.filter((item:any) => {
      return item.dataList.length !== 0
    })
    this.preBrowseVisible = false
  }
}
</script>
  
<style lang="less" scoped>
.button-type{
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top:2%;
  margin-right:2%
}
</style>