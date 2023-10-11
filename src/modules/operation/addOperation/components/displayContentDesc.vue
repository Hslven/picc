<!-- 反显内容描述 -->
<template>
  <div>
    <a-table :columns="columns" :data-source="tableList" bordered :pagination="false" style="margin-top:10px">
      <template #columnClassification="{record}">
        <div v-if="record.resourceName === '内容分类'" style="display: flex;justify-content: left;align-items: center;">
          <span style="margin-left: 10px;">{{ record.resourceName }}</span>
          <span style="margin-left: 10px;">{{ record.columnClassification }}</span>
          <span style="margin-left: 10px;">{{ record.verticalCoverFile }}</span>
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
      <template #action="{record}">
				<a-dropdown :trigger="['click']">
					<a class="ant-dropdown-link" @click.prevent>
			  		<p style="font-size: 26px;line-height: 30px;text-align: center;">···</p>
					</a>
					<template #overlay>
						<a-menu>
              <router-link v-if="record.resourceName === '具体文章'" :to="{path:'/content/contentDetail', query: { contentId: record.contentId }}" tag="a" target="_blank">
                <a-menu-item
								>详情
							  </a-menu-item>
              </router-link>
              <a-menu-item
                  v-if="record.resourceName === '内容分类'"
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
    <a-modal
			style="background: #FFFFFF;border-radius: 6px;"
			v-model:visible="preBrowseVisible">
			<template #footer>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="colseShelf">取消</a-button>
				<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureShelf">确定</a-button>
			</template>
			<p style="font-size: 16px;font-weight: 500;color: #333333;padding: 30px 50px 30px 30px;"
			  >确认删除所选内容吗？
			</p>
		</a-modal>
    <a-drawer
			v-model:visible="showContentDesc"
			class="custom-class"
			title="内容分类-详情"
			placement="right"
			width="900"
		>
      <div>
        <div class="drawer-Title"></div>
          <div class="drawer-From">
            <a-form :model="contentDeatailList">
              <a-row>
                <a-col :span="8">
                  <a-form-item label="内容描述：">
                    <a-input v-model:value="contentDeatailList.name" maxlength="60" disabled/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-item label="关联方式：">
                    <a-radio-group v-model:value="contentDeatailList.resource" disabled>
                      <a-radio
                        :value="item.value"
                        v-for="(item,index) in resourceType" 
                        :key="index"
                      >{{ item.label }}
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col>
                  <a-form-item label="内容类型：" v-if="contentDeatailList.resource === '1'">
                    <a-checkbox-group v-model:value="contentDeatailList.type" disabled>
                      <a-checkbox
                        :value="item.value" 
                        v-for="(item,index) in contentType" 
                        :key="index"
                        >{{ item.label }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
              <a-col :span="11">
                <a-form-item label="筛选标签：">
                  <a-cascader
                    disabled
                    v-model:value="contentDeatailList.region"
                    :multiple="true"
                    :options="includeRegionList"
                    :field-names="{ label: 'name', value: 'id', children: 'children' }"
                    placeholder="请选择内容标签" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="11">
                <a-form-item label="屏蔽标签：">
                  <a-cascader
                    disabled
                    v-model:value="contentDeatailList.masktag"
                    :multiple="true"
                    :options="filterRegionList"
                    :field-names="{ label: 'name', value: 'id', children: 'children' }"
                    placeholder="请选择内容标签" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="11">
                <a-form-item label="筛选标题：">
                  <a-input disabled v-model:value="contentDeatailList.filterHeading" placeholder="请输入标题" />
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="11">
                <a-form-item label="屏蔽标题：">
                  <a-input disabled v-model:value="contentDeatailList.maskTitle" placeholder="请输入标题"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="11">
                <a-form-item label="上架时间：">
                  <a-select v-model:value="contentDeatailList.shelfTime" placeholder="请选择" disabled>
                    <a-select-option
                      :value="item.value"
                      v-for="(item,index) in shelfTimeList"
                      :key="index"
                    >{{ item.label }}
                  </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="1"></a-col>
              <a-col :span="11">
                <a-form-item label="栏目分类：">
                  <a-cascader
                    disabled
                    v-model:value="contentDeatailList.Column"
                    :multiple="true"
                    :options="columnList"
                    :field-names="{ label: 'name', value: 'id', children: 'children' }"
                    placeholder="请选择" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="drawer-Table">
          <a-table
            :columns="columnContent" 
            :row-key="(record:any) => record.contentId"
            :pagination="paginationContent"
            @change="changeProPage($event)"
            :data-source="contentDeatailList.contentDeatailList" >
            <template #content="{text,record}">
              <div style="display: flex;justify-content: start;align-items: start;width: 234px;">
                <div style="width:34px;height:34px;margin-right:10px" v-if="record.isUploadCover === 'y'" >
                  <img :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.coverFile" style="width:34px;height:34px">
                </div>
                <div style="width:34px;height:34px;margin-right:10px;background-color: #eee;border-radius: 4px;" v-if="record.isUploadCover === 'n'">
                  <div class="ant-upload-text" style="font-size: 10px;width:34px;height:34px;">待上传</div>
                </div>
                <div style="display: flex;flex-direction: column;justify-content: start;align-items: start;">
                  <p style="font-size:14px;width:234px;display: flex;justify-content: start;">{{record.titleName}}</p>
                </div>
              </div>
            </template>
            <template #contentClassification="{record}">
              <span>{{ record.contentType === 't' ? '图文' :  record.contentType === 'b' ? '海报' : record.contentType === 'pr' ? '产品' : record.contentType === 's' ? '话题' : record.contentType === 'v' ? '视频' :'' }}</span>
            </template>
            <template #action="{text,record}">
              <router-link :to="{path:'/content/contentDetail', query: { contentId: record.contentId }}" tag="a" target="_blank">
                <div class="blue" style="color: blue;">{{ text }}</div>
              </router-link>
            </template>
          </a-table>
        </div>
        <div class="drawer-Button">
          <a-row>
            <a-col :span="8"></a-col>
            <a-col :span="8">
              <button class="ghostGrey" @click="onClose">返回</button>
            </a-col>
          </a-row>
        </div>
      </div>
		</a-drawer>
  </div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import store from '@/modules/operation/store';
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { operaTionApi } from '@/libs/api/index';
import { AxiosRequestHeaders } from 'axios';

interface formListType {
	label:string,
	value:string
}
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
  public sharedOnCell = (_:any, index:any) => {
    if (_.resourceName === '内容分类') {
      return { colSpan: 7 };
    }
  };
  public sharedCancleCell = (_:any, index:any) => {
    if (_.resourceName === '内容分类') {
      return { colSpan: 0 };
    }
  };
  //表头
  public columns = [
    {
			title: '关联方式',
      dataIndex: 'resourceName',
			align:'center',
      customCell:this.sharedCancleCell,
    },
    {
      title: '栏目分类',
      dataIndex: 'columnClassification',
			align:'center',
      slots: { customRender: 'columnClassification' },
      customCell:this.sharedOnCell,
    },
    {
      title: '封面',
			dataIndex: 'imageUrl',
			align:'center',
      slots: { customRender: 'imageUrl' },
      width:'60px',
      customCell:this.sharedCancleCell,
    },
    {
      title: '标题名称',
			dataIndex: 'titleName',
			align:'left',
      customCell:this.sharedCancleCell,
    },
    {
      title: '内容分类',
			dataIndex: 'contentClassification',
			align:'center',
      customCell:this.sharedCancleCell,
    },
    {
      title: '内容状态',
			dataIndex: 'contentStatusName',
			align:'center',
      customCell:this.sharedCancleCell,
    },
    {
      title: '上架时间',
			dataIndex: 'shelfTime',
			align:'center',
      customCell:this.sharedCancleCell,
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
    let saveTableList:any[] = []
    const displayContentList = this.state.contentList.displayContentList
    const columnList = this.state.chooseTopicList.columnList
    const includeTagList = this.state.contentList.includeTagList
    displayContentList.displayContent.forEach((item: { formData: any; dataList: any; value:string;addValue:string},index:number) => {
      if(item.formData.resource === '1'){
        //栏目
        let newArr = []
        if(item.formData.ColumnClassification.length !== 0){
          for(let i=0;i<item.formData.ColumnClassification.length;i++){
            newArr.push(this.getTreeName(columnList,item.formData.ColumnClassification[i]))
          }
        }
        //屏蔽标签
        let filterTag = []
        if(item.formData.filterTag.length !== 0){
          for(let i=0;i<item.formData.filterTag.length;i++){
            filterTag.push(this.getTreeName(includeTagList,item.formData.filterTag[i]))
          }
        }
        //筛选标签
        let includeTag = []
        if(item.formData.includeTag.length !== 0){
          for(let i=0;i<item.formData.includeTag.length;i++){
            includeTag.push(this.getTreeName(includeTagList,item.formData.includeTag[i]))
          }
        }
        let itemFormDataType:any = ''
        if(typeof item.formData.type === 'object'){
          itemFormDataType = item.formData.type.map((res: string) => {return res === 't' ? '图文' : res === 'b' ? '海报' : res === 'pr' ? '产品' : res === 's' ? '话题' : res === 'v' ? '视频' :'' })
        } else if(typeof item.formData.type === 'string'){
          itemFormDataType = item.formData.type.split(',').map((res: string) => {return res === 't' ? '图文' : res === 'b' ? '海报' : res === 'pr' ? '产品' : res === 's' ? '话题' : res === 'v' ? '视频' :'' })
        }
        saveTableList.push({
          resourceName:'内容分类' ,
          // columnClassification:'',
          columnClassification:'内容类型:' + itemFormDataType  ,
          contentId:'',
          contentList:item.dataList,
          verticalCoverFile:includeTag.length !== 0 ? '筛选标签:' + includeTag.map((res:string) => {return res}) : '',
          titleName:filterTag.length !== 0 ? '屏蔽标签:' + filterTag.map((res:string) => {return res}) : '',
          contentClassification:newArr.length !== 0 ? '栏目分类：' + newArr.map((res:string) => {return res}) : '',
          contentStatusName:item.formData.filterHeading!=='' ? ('筛选标题：' + item.formData.filterHeading) : '' + item.formData.maskTitle !== '' ? '屏蔽标题：' +item.formData.maskTitle : '',
          shelfTime:item.formData.shelfTimeOther === '90' ? '上架时间：其他' : item.formData.shelfTime !== '' ? '上架时间：近' +item.formData.shelfTime +'天' : '',
          value:item.value,
          addValue:item.addValue,
          formData:item.formData
        })
      }
      else if(item.formData.resource === '2'){
        item.dataList.forEach((oes: any) => {
          saveTableList.push({
            resourceName:'具体文章',
            columnClassification: oes.columnClassification,
            contentId:oes.contentId,
            verticalCoverFile:oes.verticalCoverFile,
            titleName:oes.titleName,
            contentClassification:oes.contentClassification === 't' ? '图文' : oes.contentClassification === 'b' ? '海报' : oes.contentClassification === 'pr' ? '产品' : oes.contentClassification === 's' ? '话题' : oes.contentClassification === 'v' ? '视频' : '',
            contentStatusName:oes.contentStatus === '0' ? '暂存' : oes.contentStatus === '1' ? '待审核' : oes.contentStatus === '3' ? '审核不通过' : oes.contentStatus === '4' ? '已删除' : oes.contentStatus === '5' ? '已上架' :'',
            shelfTime:oes.shelfTime,
            value:item.value,
            addValue:item.addValue,
            imageUrl: oes.imageUrl
          })
        })
      }
    })
    const map = new Map()
    saveTableList = saveTableList.filter((key:any) => !map.has(key.contentId) && map.set(key.contentId, 1)) // 这里对name属性进行去重
    return saveTableList
  })
  //新增
  public addTableList(){
    const displayContentList = this.state.contentList
     
    this.$emit('increaseAgainFormData',false)
  }
  public getTreeName(list:any,id:any){
    for (let i = 0; i < list.length; i++) {
      if(list[i].id===id){
        return list[i].name
      }else if(list[i].children && list[i].children.length>0){
      let nameList:any = this.getTreeName(list[i].children,id)
        if(nameList){
          return nameList
        }  
      }
    }
  }

  //取消
  public cancelShowContent(){
    this.$emit('showContentDescBoolean',false)
  }

  public router = useRouter()
  public delContentId:string = ''
  //删除弹窗
  public preBrowseVisible:boolean = false
  //删除指定项
  public delTableValue:string = ''
  public addValue:string = ''
  public delResoureName:string = ''
  //删除
  public delChoose(record:any){
     
    this.delResoureName = record.resourceName
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
    if(this.delResoureName === '具体文章'){
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
    } else {
      displayContentList.displayContent = displayContentList.displayContent.filter((item:any) => {
         
        if(item.value !== this.delTableValue){
           
          return item
        }
      })
    }
     
    this.preBrowseVisible = false 
  }
  //跳转详情
  //内容分类详情
  public showContentDesc:boolean = false
  public contentDeatailList:any = ''
  public async handleChoose(record:any){
     
    let itemFormDataType:any = ''
    if(typeof record.formData.type === 'object'){
      record.formData.type = record.formData.type.map((res: string) => {return res  })
    } else if(typeof record.formData.type === 'string'){
      record.formData.type = record.formData.type.split(',').map((res: string) => {return res })
    }
    let days:string = ''
		if(record.formData.shelfTime === '6'){
			days = ''
		} else {
			days = record.formData.shelfTime
		}
		let params = {
			topicId:record.formData.ColumnClassification,
			labelId:record.formData.includeTag,
			notLabelId:record.formData.filterTag,
			titleName:record.formData.filterHeading,//maskTitle
			notTitleName:record.formData.maskTitle,
			contentTypes:record.formData.type,
			days:days,
			other:record.formData.shelfTimeOther,
			reachCoverHeight:this.state.contentList.coverLength,
			reachCoverWidth:this.state.contentList.coverWidth
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = 5;
      }
    }
		await operaTionApi.getContentList(params,header).then((res:any) => {
			if(res.flag === 'success'){
				const headers:any = {
					request: (header: AxiosRequestHeaders) => {
						header.nowPage = 1;
						header.row4Page = res.recordsTotal;
            this.contentDetailTotal = res.recordsTotal
					}
				}
				operaTionApi.getContentList(params,headers).then((kes:any) => {
					this.contentDeatailList = record.formData
          this.contentDeatailList.contentDeatailList = kes.data
          this.showContentDesc = true
				})
			} else if(res.flag === 'fail'){
			}
			// this.dataList = res.data
		}).catch(() => {

		})
    // this.router.push({path:'/content/contentDetail', query: { contentId: record.contentId }})
  }
  public contentDetailTotal:any = 0
  public includeRegionList:any = this.state.contentList.includeTagList
	public filterRegionList:any = this.state.contentList.includeTagList
	//栏目分类列表定义
	public columnList:any[] = this.state.chooseTopicList.columnList
	//关联方式
	public resourceType:formListType[] = [
		{
			label:'内容分类',
			value:'1'
		},
		{
			label:'具体文章',
			value:'2'
		},
	]
	//内容类型
	public contentType:formListType[] = [
	{
			label: '图文',
			value: 't',
		},
		{
			label: '海报',
			value: 'b'
		},
		{
			label: '产品',
			value: 'pr'
		},
		{
			label: '话题',
			value: 's'
		},
		{
			label: '视频',
			value: 'v'
		}
	]
	//日期
	public shelfTimeList:formListType[] = [
		{
			label:'最近7天',
			value:'7'
		},
		{
			label:'最近14天',
			value:'14'
		},
		{
			label:'最近30天',
			value:'30'
		},
		{
			label:'最近60天',
			value:'60'
		},
		{
			label:'最近90天',
			value:'90'
		},
		{
			label:'其他',
			value:'6'
		},
	]
	//table表头数据
	public columnContent: any[] = [
    {
        title: '栏目分类',
        align:'center',
        dataIndex:'topicName'
    },
    {
        title: '标题名称',
        dataIndex: 'content',
        slots: { customRender: 'content' },
        align:'center'
    },
    {
        title: '标签',
        dataIndex: 'topicName',
        align:'center'
    },
    {
        title: '内容分类',
        dataIndex: 'contentType',
				slots: { customRender: 'contentClassification' },
        align:'center'
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        align:'center'
    },
    {
        title: '上架时间',
        dataIndex: 'publishTime',
        align:'center'
    },
    {
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        align:'center'
    },
  ]
  public loading:boolean = false
  //分页
	public paginationContent = {
		current:1,
		pageSize:5,
		defaultCurrent: 1, // 默认当前页数
    defaultPageSize: 5, // 默认当前页显示数据的大小
    total: this.contentDetailTotal, // 总数，必须先有
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["5", "10", "15", "20"],
    showTotal: (total:number) => `共 ${total} 条`, // 显示总
	}
  public changeProPage(value:any){
		 
		this.paginationContent.current = value.current
		this.paginationContent.pageSize = value.pageSize
	}
	public onClose(){
		this.showContentDesc = false
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