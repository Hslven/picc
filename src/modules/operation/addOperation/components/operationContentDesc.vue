<!-- 反显内容描述 -->
<template>
  <div>
    <a-table :columns="columns" :data-source="tableList" bordered :pagination="false" style="margin-top:10px">
      <template #columnClassification="{record}">
        <div v-if="record.resourceName === '内容分类'" style="display: flex;justify-content: left;align-items: center;">
          <span style="margin-left: 10px;">{{ record.resourceName }}</span>
					<!-- <span style="margin-left: 10px;">{{ (record.contentClassification !== '' || record.contentClassification) !== undefined ? '内容类型：' + record.contentClassification : ''}}</span> -->
          <span style="margin-left: 10px;">{{ record.columnClassification }}</span>
          <span style="margin-left: 10px;">{{ record.includeTag }}</span>
          <span style="margin-left: 10px;">{{ record.titleName }}</span>
          <span style="margin-left: 10px;">{{ record.contentClassification }}</span>
          <span style="margin-left: 10px;">{{ record.contentStatusName }}</span>
          <span style="margin-left: 10px;">{{ record.shelfTime }}</span>
        </div>
        <div v-if="record.resourceName === '具体文章'">
          <span>{{ record.columnClassification }}</span>
        </div>
      </template>
      <template #imageUrl="{record}">
        <div style="width:38px;height:38px;display: flex;justify-content: center;align-items: center;" v-if="record.imageUrl !== ''">
          <img style="width:38px;height:38px" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/'+record.imageUrl" />
        </div>
      </template>
			<template #titleName="{record}">
				<a-tooltip>
					<template #title>{{ record.titleName }}</template>
					<a-button type="link" @click="handleChoose(record)">
            {{ record.titleName.length > 10 ? record.titleName.slice(0,10) + '...' : record.titleName}}
          </a-button>
				</a-tooltip>
			</template>
      <template #action="{record}">
				<a-dropdown :trigger="['click']">
					<a class="ant-dropdown-link" @click.prevent>
			  		<p style="font-size: 26px;line-height: 30px;text-align: center;">···</p>
					</a>
					<template #overlay>
						<a-menu>
              <!-- <router-link v-if="record.resourceName === '具体文章'" :to="{path:'/content/contentDetail', query: { contentId: record.contentId }}" tag="a" target="_blank">
                <a-menu-item
								>详情
							  </a-menu-item>
              </router-link> -->
              <a-menu-item
								  @click="handleChoose(record)"
								>详情
							</a-menu-item>
              <a-menu-item
								v-if="addOrEditType !== '2'"
								@click="delChoose(record)"
								>删除
							</a-menu-item>
						</a-menu>
					</template>
				</a-dropdown>
			</template>
		</a-table>
		<div class="button-type" v-if="addOrEditType !== '2'">
      <a-button   
        style="width:84px;height:32px;border-radius: 4px;margin-right:2%;border:solid 1px #E8380D;background: rgba(232,56,13,0.1);"
        type="primary"
        @click="addTableList"
        danger>
        <span style="margin-right:6px;color:#E8380D ;">+</span>
        <span style="color:#E8380D ;">添加</span>
      </a-button>
      <a-button
        style="width:84px;height:32px;border-radius: 4px;margin-right:2%"
        @click="cancelShowContent()"
        >取消</a-button>
      <a-button
        type="primary"
        danger
        style="width:84px;height:32px;border-radius: 4px;margin-right:2%"
        @click="cancelShowContent()"
        >确定</a-button>
    </div>
		<div class="button-type" v-else>
      <a-button
        type="primary"
        danger
        style="width:84px;height:32px;border-radius: 4px;margin-right:2%"
        @click="cancelShowContent()"
        >确定</a-button>
    </div>
		<a-modal
		  style="width: 400px;height: 160px;"
			:footer="null"
			v-model:visible="preBrowseVisible"
		>
			<a-row>
				<a-col :span="4">
					<img style="width: 32px;height: 32px;margin: 16px 0px;" src="../../../assets/fail.png" alt="">
				</a-col>
				<a-col :span="20">
					<p style="font-size: 18px;font-weight: 500;color: #000000;margin:18px 0px;">操作确认</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20">
					<p style="font-size: 14px;font-weight: 400;color: #666666;margin-bottom: 32px;">确认删除所选内容吗？</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20" style="margin-bottom: 16px;display: flex;justify-content: end;align-items: center;">
					<a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="colseShelf">取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureShelf">确定</a-button>
				</a-col>
			</a-row>
		</a-modal>
		<!-- 查看内容详情弹窗 -->
		<a-drawer
			v-model:visible="showContentDetail"
			class="custom-class"
			placement="right"
			width="1000"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_contentDetail_title">
					<div>
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../../assets/addLeft.png" alt="">
						<span style="font-size: 16px;">{{ searChType === '1' ? '内容详情' : '内容分类详情' }}</span>
					</div>
					<!-- <a-button class="ScreeningCondition_title_btn" @click="cancleDetailContent">>></a-button> -->
				</div>
			</template>
			<contentDetail
				v-if="searChType === '1'"
				:showContentDetail="showContentDetail"
        :detailFlag="detailFlag"
        :detailContentId="detailContentId"
				@cancleDetailContent="cancleDetailContent"
			/>
			<viewContentType
				v-else
				:showContentDetail="showContentDetail"
				:coverLength="props.coverLength"
				:coverWidth="props.coverWidth"
        :detailFlag="detailFlag"
        :detailContentId="detailContentId"
				:displayContentList="displayContentList"
				@cancleDetailContent="cancleDetailContent"
			/>
		</a-drawer>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, watchEffect } from 'vue'
import contentDetail from '@/modules/conTent/contentDetail/index.vue';
import viewContentType from './viewContentType.vue'
const props = defineProps(['addOrEditType','displayContentList','showDisplayContent','labelList','columnList','coverLength','coverWidth'])
const emit = defineEmits(['changeDisplayContent','addDisplayContent','delTableContent'])
const sharedOnCell = (_:any, index:any) => {
  if (_.resourceName === '内容分类') {
    return { colSpan: 7 };
  }
};
const sharedCancleCell = (_:any, index:any) => {
  if (_.resourceName === '内容分类') {
    return { colSpan: 0 };
  }
};
//查看内容详情的展示
let showContentDetail = ref<boolean>(false)
let detailFlag = ref<string>('1')
let detailContentId = ref<string>('')
let searChType = ref<string>('')
let displayContentList = ref<any>([])
const { labelList,columnList } = props
//表格dataList
let tableList = ref<any>([])
//监听每次打开抽屉，重新渲染数据
watchEffect(() => {
	const showDisplayContent = props.showDisplayContent
	if (showDisplayContent) {
		console.log(props.addOrEditType,'addOrEditType')
		console.log(props.displayContentList.content,'showDisplayContent')
		getdisplayContentList(props.displayContentList.content)
	}
})
function getTreeName(list:any,id:any){
	for (let i = 0; i < list.length; i++) {
    if(list[i].id===id){
      return list[i].name
    }else if(list[i].children && list[i].children.length>0){
      let nameList:any = getTreeName(list[i].children,id)
      if(nameList){
        return nameList
  		}  
    }
  }
}
//列表数据重新赋值
function getdisplayContentList(content:any){
	tableList.value = []
	const { specificArticleList, contentFormData } = content
	specificArticleList.forEach((item:any) => {
		if(item.topicName === '' || item.topicName === undefined){
      item.topicName = getTreeName(columnList,item.topicId)
		}
		tableList.value.push({
			resourceName:'具体文章',
			columnClassification:item.topicName,
			imageUrl:item.coverFile,
			// titleName:'qwertyuiopiuyrewtyusaidksadsajdiasoiqjdiqojdoiqjdijoisajkasdnksandsandwqiqoidqiksandksakjsadnwqoiwqdjqoiw',
			titleName:item.titleName,
			contentClassification:item.contentType === 't' ? '图文' : item.contentType === 'b' ? '海报' : item.contentType === 'pr' ? '产品' : item.contentType === 's' ? '话题' : '视频',
			contentStatusName:item.contentStatus === '0' ? '暂存' : item.contentStatus === '1' ? '待审核' : item.contentStatus === '3' ? '审核不通过' : item.contentStatus === '4' ? '已删除' : item.contentStatus === '5' ? '已上架' :'',
			shelfTime:item.publishTime,
			contentId:item.contentId
		})
	})
	contentFormData.forEach((item:any) => {
		//筛选标签
		let includeTag = []
		if(item.includeTag.length !== 0){
			for(let i=0;i<item.includeTag.length;i++){
        includeTag.push(getTreeName(labelList,item.includeTag[i]))
      }
		}
		//屏蔽标签
		let filterTag = []
    if(item.filterTag.length !== 0){
      for(let i=0;i<item.filterTag.length;i++){
        filterTag.push(getTreeName(labelList,item.filterTag[i]))
      }
    }
		//栏目
		let newArr = []
    if(item.ColumnClassification.length !== 0){
      for(let i=0;i<item.ColumnClassification.length;i++){
        newArr.push(getTreeName(columnList,item.ColumnClassification[i]))
      }
  	}
		tableList.value.push({
			resourceName:'内容分类',
			columnClassification:'内容类型：' + item.type.map((res:any) => {return res === 't' ? '图文' : res === 'b' ? '海报' : res === 'pr' ? '产品' : res === 's' ? '话题' : res === 'v' ? '视频' : ''}),
			includeTag:includeTag.length !== 0 ? '筛选标签:' + includeTag.map((res:string) => {return res}) : '',
			titleName:filterTag.length !== 0 ? '屏蔽标签:' + filterTag.map((res:string) => {return res}) : '',
			contentClassification:newArr.length !== 0 ? '栏目分类：' + newArr.map((res:string) => {return res}) : '',
			contentStatusName:item.filterHeading!=='' ? ('筛选标题：' + item.filterHeading) : '' + item.maskTitle !== '' ? '屏蔽标题：' +item.maskTitle : '',
			shelfTime:item.shelfTimeOther === '90' ? '上架时间：其他' : item.shelfTime === '' || item.shelfTime === undefined ? '' : '上架时间：近' +item.shelfTime +'天',
			value:item.value
		})
	})
}
//表头
const columns = [
	{
    title: '操作',
		dataIndex: 'action',
		align:'center',
    slots: { customRender: 'action' },
  },
  {
		title: '关联方式',
    dataIndex: 'resourceName',
		align:'center',
    customCell:sharedCancleCell,
  },
  {
    title: '栏目分类',
    dataIndex: 'columnClassification',
		align:'center',
    slots: { customRender: 'columnClassification' },
    customCell:sharedOnCell,
  },
  {
    title: '封面',
		dataIndex: 'imageUrl',
		align:'center',
    slots: { customRender: 'imageUrl' },
    width:'60px',
    customCell:sharedCancleCell,
  },
  {
    title: '标题名称',
		dataIndex: 'titleName',
		align:'left',
		width: 200,
		slots: { customRender: 'titleName' },
    customCell:sharedCancleCell,
  },
  {
    title: '内容分类',
		dataIndex: 'contentClassification',
		align:'center',
    customCell:sharedCancleCell,
  },
  {
    title: '内容状态',
		dataIndex: 'contentStatusName',
		align:'center',
    customCell:sharedCancleCell,
  },
  {
    title: '上架时间',
		dataIndex: 'shelfTime',
		align:'center',
    customCell:sharedCancleCell,
  },
]
//todo-详情
function handleChoose(record:any){
	if(record.resourceName == '具体文章'){
		searChType.value = '1'
		detailContentId.value = record.contentId
		showContentDetail.value = true
	} else {
		displayContentList.value = props.displayContentList
		detailContentId.value = record.value
		searChType.value = '2'
		showContentDetail.value = true
	}
}
//重新删除确认弹窗
let preBrowseVisible = ref<boolean>(false)
//赋值删除的record
let cancleOrSureDelContent = ref<any>('')
//删除
function delChoose(record:any){
	cancleOrSureDelContent.value = record
	preBrowseVisible.value = true
}
//取消删除
function colseShelf(){
	cancleOrSureDelContent.value = ''
	preBrowseVisible.value = false
}
//确认删除
function sureShelf(){
	const record = cancleOrSureDelContent.value
	const listIndex = props.displayContentList.listIndex
	emit('delTableContent',record,listIndex)
	preBrowseVisible.value = false
}
//新增内容描述
function addTableList(){
	emit('addDisplayContent',props.displayContentList)
}
//取消确认-关闭反显内容抽屉
function cancelShowContent(){
	emit('changeDisplayContent',false)
}
function cancleDetailContent(value:boolean){
	showContentDetail.value = false
}
</script>
  
<style lang="less" scoped>
.listTitleName{
	width:300px;
	overflow: hidden;
	display: -webkit-box;
	text-overflow: ellipsis;
	-wekbit-line-clamp:1;
}
.button-type{
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top:2%;
  margin-right:2%
}
.ScreeningCondition_contentDetail_title{
	display: flex;
	justify-content: space-between;
	align-items: center;
	// background-color: #EBF2F7;
	height: 40px;
	padding: 0px 16px;
	.ScreeningCondition_title_btn{
		border:solid 0px;
		width: 15px;
		height: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		// background-color: #EBF2F7;
	}
}
</style>