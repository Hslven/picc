
<!--
    / * @FileDescription: 内容描述抽屉插件
* @Author: Hjb
* @Date: 2023-03-28
* @LastEditors: 
* @LastEditTime:  -->

<template>
  <div>
    <div class="drawer-Title">添加内容</div>
      <div class="drawer-From">
        <a-form :model="formData">
          <a-row>
            <a-col :span="8">
              <a-form-item label="内容描述：">
                <a-input v-model:value="formData.name" maxlength="60"/>
              </a-form-item>
            </a-col>
          	<a-col :span="4" :push="1">
							<button class="ghostGrey" @click="reset">重置</button>
						</a-col>
						<a-col :span="4">
							<button class="solidColor" @click="search">查询</button>
						</a-col>
       		</a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="关联方式：">
              	<a-radio-group v-model:value="formData.resource">
                  <a-radio
										:value="item.value"
										v-for="(item,index) in resourceType" 
										:key="index" 
										@click="chooseRecource(item.value)"
									>{{ item.label }}
									</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="内容类型：" v-if="formData.resource === '1'">
              	<a-checkbox-group v-model:value="formData.type">
                  <a-checkbox
										:value="item.value" 
										v-for="(item,index) in contentType" 
										:key="index" 
										@change="chooseContentType()"
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
							 	v-model:value="formData.region"
								:multiple="true"
								:options="includeRegionList"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								@change="changeRegionType($event)"
								placeholder="请选择内容标签" />
            </a-form-item>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="11">
						<a-form-item label="屏蔽标签：">
							<a-cascader
								v-model:value="formData.masktag"
								:multiple="true"
								:options="filterRegionList"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								@change="changeMaskTag()"
								placeholder="请选择内容标签" />
						</a-form-item>
					</a-col>
        </a-row>
        <a-row>
					<a-col :span="11">
						<a-form-item label="筛选标题：">
							<a-input v-model:value="formData.filterHeading" placeholder="请输入标题" />
						</a-form-item>
					</a-col>
					<a-col :span="1"></a-col>
					<a-col :span="11">
						<a-form-item label="屏蔽标题：">
							<a-input v-model:value="formData.maskTitle" placeholder="请输入标题"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="11">
						<a-form-item label="上架时间：">
							<a-select v-model:value="formData.shelfTime" placeholder="请选择">
								<a-select-option
									:value="item.value"
									v-for="(item,index) in shelfTimeList"
									:key="index"
									@click="chooseShelfTime(item.value)"
								>{{ item.label }}
							</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="1"></a-col>
					<a-col :span="11">
						<a-form-item label="栏目分类：">
							<a-cascader
								v-model:value="formData.Column"
								:multiple="true"
								:options="columnList"
								:field-names="{ label: 'name', value: 'id', children: 'children' }"
								@change="changecolumn(formData.Column)"
								placeholder="请选择" />
            </a-form-item>
					</a-col>
        </a-row>
      </a-form>
    </div>
    <div class="drawer-Table">
      <a-table
				:columns="columns" 
				:pagination="pagination"
				:data-source="dataList" 
				:row-selection=" formData.resource === '2' ? {selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange}  : ''">
        <template #content="{text}">
          <div style="display: flex;justify-content: start;align-items: start;width: 234px;">
            <div style="width:34px;height:34px;margin-right:10px">
              <img :src="text.img" style="width:34px;height:34px">
            </div>
            <div style="display: flex;flex-direction: column;justify-content: start;align-items: start;">
              <p style="font-size:14px;width:234px;display: flex;justify-content: start;">{{text.name}}</p>
              <p style="font-size: 12px;margin-top: 10px">ID:{{ text.id }}</p>
            </div>
          </div>
        </template>
				<template #action="{text}">
          <div class="blue">{{ text }}</div>
        </template>
      </a-table>
    </div>
    <div class="drawer-Button">
      <a-row>
        <a-col :span="16"></a-col>
        <a-col :span="4">
          <button class="ghostGrey" @click="onClose">取消</button>
        </a-col>
        <a-col :span="4">
          <button class="solidColor" @click="addPeople">确认</button>
        </a-col>
      </a-row>
    </div>
		<a-modal
				style="background: #FFFFFF;border-radius: 6px;"
				v-model:visible="appPeoPleBoolean">
				<template #footer>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="closeAdd">取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="sureAddContent">确定</a-button>
				</template>
      <p style="width: 176px;font-size: 16px;font-weight: 500;color: #333333;"
				>确认添加所选内容吗？
			</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { operaTionApi } from '@/libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { computed,ref } from 'vue'
import store from '@/modules/operation/store';
import { message } from 'ant-design-vue';
import { AxiosRequestHeaders } from 'axios';
interface formListType {
	label:string,
	value:string
}
interface formData {
	name:string,
	resource:string,
	type:[],
	region:[],
	includeTag:[],
	masktag:[],
	filterTag:[],//重置屏蔽标签
	shelfTime:string,//选择时间
	shelfTimeOther:string,//选择其他时间
	filterHeading:string,//筛选标题
	Column:[],//栏目分类
	ColumnClassification:[],//重置栏目分类
	maskTitle:string,//屏蔽标题
	notTopicld:[],//屏蔽栏目
}
export default class addInformation extends Vue {
  public created(): void {
		this.getLabelList()
		this.getcolumnList()
		this.reserFormList()
  }
  //table表头数据
  public columns: any[] = [
    {
        title: '栏目分类',
        align:'center',
        dataIndex:'columnClassification'
    },
    {
        title: '内容',
        dataIndex: 'content',
        slots: { customRender: 'content' },
        align:'center'
    },
    {
        title: '标签',
        dataIndex: 'tags',
        align:'center'
    },
    {
        title: '内容分类',
        dataIndex: 'contentClassification',
        align:'center'
    },
    {
        title: '操作人',
        dataIndex: 'operator',
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
        slots: { customRender: 'action' },
        align:'center'
    },
  ]
	public changeFormDataName = computed(() => {
		this.formData.name = this.states.contentList.formDataName
	})
	//具体文章选择
	public specificArticleList:any[] = []
	public userTableSelectedKeys:string[] = []
	// public testChange:any = { selectedRowKeys: this.userTableSelectedKeys, onChange: this.onSelectChange}
	public onSelectChange(selectedRowKeys:string[]) {
    this.userTableSelectedKeys = selectedRowKeys;
  };
  //确认
	public appPeoPleBoolean:boolean = false
  public addPeople() {
		 
    if(this.formData.name === ''){
			message.info("请输入内容描述")
			return
		} else if(this.formData.resource === ''){
			message.info("请选择关联方式")
			return
		} else if(this.formData.resource === '1' && this.formData.type.length === 0 ){
			message.info("请选择内容分类")
			return
		} else if(this.formData.resource === '2' && this.userTableSelectedKeys.length === 0){
			message.info("请选择具体文章")
			return
		} else if(this.formData.resource === '2' && this.userTableSelectedKeys.length !== 0){
			this.dataList.map( (item: { key: string; }) => {
				this.userTableSelectedKeys.map(items => {
					if(items === item.key){
						this.specificArticleList.push(item)
					}
				})
			})
		}
		this.appPeoPleBoolean = true
  }
	//关闭确认弹窗
	public closeAdd(){
		this.appPeoPleBoolean = false
	}
	//确认选择内容
	public sureAddContent(){
		let chooseFormData  = {}
		//重新查询
		let days:string = ''
		if(this.formData.shelfTime === '6'){
			days = ''
		} else {
			days = this.formData.shelfTime
		}
		let params = {
			topicId:this.formData.ColumnClassification,
			notTopicId:[],
			labelId:this.formData.includeTag,
			notLabelId:this.formData.filterTag,
			titleName:this.formData.filterHeading,//maskTitle
			notTitleName:this.formData.maskTitle,
			contentTypes:this.formData.type,
			startPublishTime:'',
			endPublishTime:'',
			days:days,
			other:this.formData.shelfTimeOther
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = this.states.contentList.contentAllNumber;
      }
    }
		operaTionApi.getContentList(params,header).then((res) => {
			if(res.flag === 'success'){
				store.commit('changeContentList',res.data)
				if(this.formData.resource === '1'){
					chooseFormData = {
						formData: this.formData,
						dataList: this.dataList
					}
				} else {
					chooseFormData = {
						formData: this.formData,
						dataList: this.specificArticleList
					}
				}
				this.appPeoPleBoolean = false
				this.reserFormList()
				this.$emit('changeDrawer',this.changeDrawerBoolean)
				this.$emit('chooseFormData',chooseFormData)
			} else if(res.flag === 'fail'){
				res.msg.forEach(jes => {
					message.info(jes)
				})
			}
		}).catch(() => {

		})
	}
  //查询按钮
  public search() {
		this.getContentList()
  }
  //重置按钮
  public reset(){
		this.reserFormList()
		this.getContentList()
  }
	public formData:formData = {
		name:'',//内容描述
		resource: '',//关联方式
		type:[],//内容分类
		region:[],//选择标签
		includeTag:[],//重置选择标签
		masktag:[],//屏蔽标签
		filterTag:[],//重置屏蔽标签
		shelfTime:'',//选择时间
		shelfTimeOther:'',//选择其他时间
		filterHeading:'',//筛选标题
		Column:[],//栏目分类
		ColumnClassification:[],//重置栏目分类
		maskTitle:'',//屏蔽标题
		notTopicld:[],//屏蔽栏目
	}
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
	
	//选择关联方式 1-内容分类 2-具体文章
	public chooseRecource(value: string){
		this.formData.resource = value 
		if(value === '2'){
			this.formData.type = []
		} else {
		}
	}
	//内容类型
	public contentType:formListType[] = [
		{
			label:'文本',
			value:'t',
		},
		{
			label:'图文',
			value:'p'
		},
		{
			label:'横板视频',
			value:'hv'
		},
		{
			label:'竖版视频',
			value:'vv'
		},
		{
			label:'海报',
			value:'b'
		},
	]
	//选择内容类型 1-文本 2-图文 3-横板视频 4-竖版视频 5-海报
	public chooseContentType(){
	}
	//定义标签列表
	public includeRegionList:any['options'] = [
		{
			id:'1',
			name:'1',
			children:[
				{
					id:'2',
					parentId:'1',
					name:'2',
					children:[
						{
							id:'3',
							parentId:'2',
							name:'3'
						},
						{
							id:'4',
							parentId:'2',
							name:'4'
						}
					]
				}
			]
		}
	]
	public filterRegionList:any['options'] = []
	//获取标签列表
	public async getLabelList(){
		let params = {
			id:''
		}
		await operaTionApi.getLabelQuery(params,{}).then((res) => {
			if(res.flag === 'success'){
				this.includeRegionList = res.data
				this.filterRegionList = res.data
				store.commit('changeIncludeTagList',res.data)
			} else if(res.flag === 'fail'){
				res.msg.forEach(jes => {
					message.info(jes)
				})
			}
		}).catch(() => {
		})
	}
	//选择标签
	public changeRegionType(value:any){
		let regionList:any = []
		this.formData.region.forEach((res:any) => {
			regionList.push(res[res.length -1])
		})
		this.formData.includeTag = regionList
		// let params = {
		// 	id:''
		// }
		// await operaTionApi.getLabelQuery(params,{}).then((res) => {
		// 	if(res.flag === 'success'){
		// 		this.includeRegionList = res.data
		// 		this.filterRegionList = res.data
		// 		store.commit('changeIncludeTagList',res.data)
		// 	} else if(res.flag === 'fail'){
		// 		res.msg.forEach(jes => {
		// 			message.info(jes)
		// 		})
		// 	}
		// }).catch(() => {
		// })
	}
	//
	public testList:any[] = []
	public test(){
		// this.testList.map(item => {
		this.includeRegionList.map((res: { id: any; name: any; children: any[]; }) => {
			this.formData.region.map(oes => {
				if(oes[0] === res.id){
						this.testList.push({
							id:res.id,
							name:res.name,
							children:res.children
						})
						if(oes[1] !==undefined){
								res.children.map((jes: { id: any; parentId: any; children: any[]; }) => {
									if(oes[1] === jes.id){
										this.testList.map(item => {
											if(item.id === jes.parentId){
												item.children = jes
												if(oes[2] !== undefined){
													jes.children.map((kes: { id: any; }) => {
														this.testList.map(qes => {
															qes.children.map((wes: { id: any; children: any; }) => {
																if(wes.id === kes.id){
																	wes.children = kes
																}
															})
														})
													})
												}
											}
										}
									)
								}
							})
					}
				}
			})
		})
	}
	//屏蔽标签
	public changeMaskTag(){
		let regionList:any = []
		this.formData.masktag.forEach(res => {
			if(res[2] !== undefined){
				regionList.push(res[2])
			} else {
				regionList.push(res[0])
			}
		})
		this.formData.filterTag = regionList
	}
	//选择上架时间列表 7-7 14-14 30-30 60-60 90-90 6-其他
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
	//选择上架时间
	public chooseShelfTime(value:any){
		if(value === '6'){
			this.formData.shelfTimeOther = '90'
		} else {
			this.formData.shelfTimeOther = ''
		}
	}
	//栏目分类列表定义
	public columnList:any[] = []
	//获取栏目分类
	public async getcolumnList(){
		let params = {
			id:''
		}
		await operaTionApi.getClassIfication(params,{}).then((res) => {
			if(res.flag === 'success'){
				this.columnList = res.data
			} else if(res.flag === 'fail'){
				res.msg.forEach(jes => {
					message.info(jes)
				})
			}
		}).catch(() => {
		})
	}
	//选择栏目分类
	public changecolumn(value:any){
		let columnTagList:any = []
		this.formData.Column.forEach(res => {
			if(res[2] !== undefined){
				columnTagList.push(res[2])
			} else {
				columnTagList.push(res[0])
			}
		})
		this.formData.ColumnClassification = columnTagList
	}
  //接收vuex
  public states:any = store.state
	//table列表数据
	public dataList:any = computed(() => {
		const testList = this.states.contentList
		return testList.contentList.map((item: { contentStatus: any; serno: any; topicName: any; verticalCoverFile: any; titleName: any; contentId: any; horizontalCoverFile: any; labelNames: any; contentTypeName: any; operator: any; publishTime: any; }) => ({
			contentStatus:item.contentStatus,
      key:item.serno,
      columnClassification:item.topicName,
      content:{
        img:item.verticalCoverFile,
        name:item.titleName,
        id:item.contentId,
      },
			crossImg:item.horizontalCoverFile,
			verticalImg:item.verticalCoverFile,
      tags:item.labelNames,
      contentClassification:item.contentTypeName,
      operator:item.operator,
      shelfTime:item.publishTime,
			contentId:item.contentId,
			titleName:item.titleName,
      action:'详情',
			chooseTop:{
				color:'blue'
			},
			addTop:false,
    }))
	});
	//分页
	public pagination = {
		defaultCurrent: 1, // 默认当前页数
    defaultPageSize: 5, // 默认当前页显示数据的大小
    total: this.states.contentList.contentAllNumber, // 总数，必须先有
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["5", "10", "15", "20"],
    showTotal: (total:number) => `共 ${total} 条`, // 显示总
	}
	//获取列表数据
	public async getContentList(){
		let days:string = ''
		if(this.formData.shelfTime === '6'){
			days = ''
		} else {
			days = this.formData.shelfTime
		}
		let params = {
			topicId:this.formData.ColumnClassification,
			notTopicId:[],
			labelId:this.formData.includeTag,
			notLabelId:this.formData.filterTag,
			titleName:this.formData.filterHeading,//maskTitle
			notTitleName:this.formData.maskTitle,
			contentTypes:this.formData.type,
			startPublishTime:'',
			endPublishTime:'',
			days:days,
			other:this.formData.shelfTimeOther
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = 1;
        header.row4Page = this.states.contentList.contentAllNumber;
      }
    }
		await operaTionApi.getContentList(params,header).then((res:any) => {
			if(res.flag === 'success'){
				store.commit('changeContentList',res.data)
			} else if(res.flag === 'fail'){
			}
			// this.dataList = res.data
		}).catch(() => {

		})
	}
  //关闭弹窗
	public changeDrawerBoolean:boolean = false
  public onClose(){
		this.reserFormList()
		this.$emit('changeDrawer',this.changeDrawerBoolean)
  }
	//重置表单数据
	public reserFormList(){
		this.formData = {
			name:this.states.contentList.formDataName ==='' ? '' : this.states.contentList.formDataName,//内容描述
			resource: '',//关联方式
			type:[],//内容分类
			region:[],//选择标签
			includeTag:[],//重置选择标签
			masktag:[],//屏蔽标签
			filterTag:[],//重置屏蔽标签
			shelfTime:'',//选择时间
			shelfTimeOther:'',//选择其他时间
			filterHeading:'',//筛选标题
			Column:[],//栏目分类
			ColumnClassification:[],//重置栏目分类
			maskTitle:'',//屏蔽标题
			notTopicld:[],//屏蔽栏目
		}
		this.userTableSelectedKeys = []
	}
}
</script>

<style lang="less">
p{
  margin: 0;
  padding: 0;
}
.ant-modal-content{
	box-shadow:
		0 0 0 0 rgba(0, 0, 0, 0.12),
		0 0 0 0 rgba(0, 0, 0, 0.08), 
		0 0 0 0 rgba(0, 0, 0, 0.05);
}
.drawer-From {
    margin-top: 44px;
}

.drawer-Table {
    margin-top: 24px;
}
</style>