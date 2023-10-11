<template>
	<div>
		<a-row :gutter="24">
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span>素材类型：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="12" :xxl="6">
				<a-radio-group v-model:value="materialTypeValue" button-style="solid">
					<a-radio-button
						style="margin-right: 20px;width:80px;text-align: center;border-radius: 6px;"
						v-for="(item) in materialTypeValueList" :key="item.code" :value="item.value">
						{{ item.label}}
					</a-radio-button>
				</a-radio-group>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top: 10px;">
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">是否授权：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="18" :xxl="6">
				<a-radio-group v-model:value="authorizationValue" button-style="solid">
					<a-radio-button
						style="margin-right: 20px;width:80px;text-align: center;border-radius: 6px;"
						v-for="(item) in authorizationValueList" :key="item.code" :value="item.value">
						{{ item.label}}
					</a-radio-button>
				</a-radio-group>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top: 10px;">
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">素材名称：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="5" :xxl="6">
				<a-input
					style="border-radius: 6px;"
					v-model:value="material_name"
					placeholder="请输入素材名称"
				></a-input>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top:10px">
			<a-col :xs="8" :sm="6" :xl="3" :xxl="6">
				<span style="text-align: center;">素材标签：</span>
			</a-col>
			<a-col :xs="12" :sm="12" :xl="6" :xxl="6">
				<a-tree-select
					v-model:value="tagValue"
					style="width: 100%"
					:tree-data="tagValueList"
					tree-checkable
					allow-clear
					@change="changeTagValue()"
					:field-names="{ label: 'name', value: 'id', children: 'children' }"
					:treeCheckStrictly="true"
					:show-checked-strategy="SHOW_PARENT"
					placeholder="请选择内容标签"
					tree-node-filter-prop="label"
					>	
					</a-tree-select>
				<!-- <a-cascader
					v-model:value="tagValue"
					:options="tagValueList"
					@change="changeTagValue()"
					:field-names="{ label: 'name', value: 'id', children: 'children' }"
					placeholder="请选择" /> -->
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top:10px">
			<a-col :xs="8" :sm="8" :xl="8" :xxl="8">
				<a-button type="primary" danger style="width:84px;border-radius: 4px;margin-right: 30px;" @click="searchMateria">查询</a-button>
				<a-button danger style="width:84px;border-radius: 4px;" @click="resetMateriaList">重置</a-button>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top:10px">
			<a-col :xs="24" :sm="24" :xl="24" :xxl="24">
				<a-list
					:grid="{ gutter: 16, column: 5 }"
					:row-key="(record:any) => record.material_id"
					:pagination="pagination"
					:data-source="AdvertisingDataList">
					<template #renderItem="{ item }">
						<a-list-item>
							<div class="card_list">
								<div class="card_list_imgList">
									<div class="card_list_img">
										<div class="card_list_ifMaturity" v-if="item.is_material_maturity==='0'">
											<span class="card_list_ifMaturity_name">已授权</span>
										</div>
										<div class="card_list_ifMaturity_No" v-else>
											<span class="card_list_ifMaturity_name">未授权</span>
										</div>
										<div class="card_list_img_checkbox">
											<a-checkbox v-model:checked="item.chooseMateriaValue" @click="chooseMateria(item)">
											</a-checkbox>
										</div>
										<p class="card_list_height">
											<span>{{ item.picture_height }} * {{ item.picture_width }}</span>
											<span>{{ item.material_file_type }} </span>
										</p>
										<div img v-if="item.material_file_type !== 'mp4'" :style="listImgStyle(item)"></div>
										<video v-if="item.material_file_type === 'mp4'" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + item.material_file_path" :controls = "true" preload="auto" style="width:100%;height:100%"></video>
									</div>
									<p class="card_list_name">{{ item.material_name }}</p>	
									<p class="card_list_source">
										<span style="color:#999999;font-size: 12px;">
											素材来源：
										</span>
										<span style="color:#333333;font-size: 12px;">
											{{ item.material_source }}
										</span>
									</p>
									<!-- <p class="card_list_name" v-if="item.is_material_maturity === '是'">是否有授权证书：<span>{{ item.is_material_maturity }}</span></p> -->
									<p class="card_list_count">
										<div>
											<span style="color:#999999;font-size: 12px;">引用次数：</span>
											<span style="color:#E8380D;font-size: 12px;font-weight: 600;">{{ item.cite_count }}</span>
										</div>
										<div>
											<a-button type="link" v-if="item.certificate_name !== ''" @click="previewCertificate(item)" style="font-size:12px;">预览授权证书</a-button>
										</div>
									</p>
								</div>
								<div class="card_list_title">
									<p class="card_list_title_name" v-if="item.label_ids.length !== 0">
										<span style="color:#999999;font-size: 12px;">标签：</span>
										<span v-for="(items) in item.label_ids" :key="items.label_id" :value="item.label_id" style="font-size: 12px;">
											{{ items.label_name }}、
										</span>
									</p>
									<p class="card_list_title_name" v-if="item.label_ids.length === 0">
										<span style="color:#999999;font-size: 12px;">暂无标签</span>
									</p>
								</div>
							</div>
						</a-list-item>
					</template>
				</a-list>
			</a-col>
		</a-row>
		<a-row :gutter="24" style="margin-top:30px">
			<a-col :xs="16" :sm="16" :xl="16" :xxl="16"></a-col>
			<a-col :xs="8" :sm="8" :xl="8" :xxl="8">
				<div style="display: flex;justify-content: right;align-items: center;">
					<a-button danger style="width: 84px;margin-right: 30px;border-radius: 4px;" @click="cancleAddPro">取消</a-button>
					<a-button type="primary" danger style="width:84px;border-radius: 4px;" @click="addPro">确认</a-button>
				</div>
			</a-col>
		</a-row>
		<a-modal
		  style="width: 400px;height: 160px;"
			:footer="null"
			v-model:visible="makeAddAdvertisingBoolean"
		>
			<a-row>
				<a-col :span="4">
					<!-- <img style="width: 32px;height: 32px;margin: 16px 0px;" src="@/modules/assets/addLeft.png" alt=""> -->
				</a-col>
				<a-col :span="20">
					<p style="font-size: 18px;font-weight: 500;color: #000000;margin:18px 0px;">操作确认</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20">
					<p style="font-size: 14px;font-weight: 400;color: #666666;margin-bottom: 32px;">确定添加素材吗？</p>
				</a-col>
			</a-row>
			<a-row>
				<a-col :push="4" :span="20" style="margin-bottom: 16px;display: flex;justify-content: end;align-items: center;">
					<a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="cancleSureAddAdvertising" >取消</a-button>
					<a-button type="primary" danger style="width: 84px;background: #E8380D;border-radius: 4px;" @click="makeSureAddAdvertising">确定</a-button>
				</a-col>
			</a-row>
		</a-modal>
		<a-drawer width="1100" v-model:visible="previewMaterial" class="custom-class" title="添加素材" placement="right">
			<iframe :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + previewMaterialLink"></iframe>
		</a-drawer>
		<!-- <iframe v-if="previewMaterial === true" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + previewMaterialLink" frameborder="0" style="width: 100%; height: 100%"></iframe> -->
	</div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { TreeSelect } from 'ant-design-vue';
import { computed } from 'vue'
import { AxiosRequestHeaders } from 'axios';
import { contentApi } from '@/libs/api'
import { message } from 'ant-design-vue';
import axios from 'axios';
import { Prop,Watch } from 'vue-property-decorator';


export default class materialList extends Vue {
	@Prop() public choosePro:any;
	public changePreviewForm =  computed(() => {
		// this.getProList()
		this.getTagList()
		this.getMateriaList()
  })
	@Watch('choosePro',{deep:true})
  private onTableListChange(newVal: any) {
		if(newVal){
			this.getTagList()
			this.getMateriaList()
		} else {
			this.material_name = ''
			this.materialTypeValue = '2'
			this.authorizationValue = '2'
			this.tagSureValue = []
			this.tagValue = []
			this.chooseMateriaList = []
		}
  }
  public created(): void {
    this.onTableListChange(this.choosePro)
  }

	public value4:any = ''
	//素材类型
	public materialTypeValue:string = '2'
	//素材类型列表
	public materialTypeValueList = [
		{
			value:'2',
			code:'2',
			label:'全部'
		},
		{
			value:'0',
			code:'0',
			label:'图片'
		},
		{
			value:'1',
			code:'1',
			label:'视频'
		},
	]
	//是否授权
	public authorizationValue:string = '2'
	//授权类型列表
	public authorizationValueList = [
	{
			value:'2',
			code:'2',
			label:'全部'
		},
		{
			value:'0',
			code:'0',
			label:'是'
		},
		{
			value:'1',
			code:'1',
			label:'否'
		},
	]
	//获取素材列表
	//素材名称
	public material_name:string = ''
	//获取标签列表
	public tagValueList:any[] = []
	public tagValue:any = []
	public tagSureValue:any = [] 
	public async getTagList(){
		let params = {
			id:''
		}
		await contentApi.getFolderLabel(params,{}).then((res:any) => {
			this.tagValueList = res.data
			this.tagValueList = this.getNewTree(this.tagValueList)
		})
	}
	public getNewTree(obj:any){
    obj.map((item:any)=>{
    	if(item.leafFlag === '0'){
				item.disabled = true
      } else {
				item.disabled = false
			}
      if(item.children&&item.children.length>0){
        this.getNewTree(item.children)
      }
    })
    return obj
  }
	public SHOW_PARENT = TreeSelect.SHOW_PARENT;
	//选中标签
	public changeTagValue(){
		// this.tagValue.forEach((res:any) => {
		// 	console.log(res,'res')
			// this.tagSureValue = this.tagValue[this.tagValue.length -1]
		// })
		this.tagSureValue = []
		if(this.tagValue.length !== 0){
			this.tagValue.forEach((res:any) => {
				this.tagSureValue.push(res.value)
			})
		}
	}
	public AdvertisingDataList:any[] = []
	//获取素材列表
	public async getMateriaList(){
		let params = {
			materialName:this.material_name,
			materialFileType:this.materialTypeValue === '2' ? '' : this.materialTypeValue,
			isMaterialMaturity:this.authorizationValue === '2' ? '' : this.authorizationValue,
			// isMaturityDate:this.authorizationValue === '0' ? '1' :'',
			// isShare:'',
			labelId:this.tagSureValue
		}
		const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
		await contentApi.getMaterialList(params,header).then((res:any) => {
			this.pagination.total = res.recordsTotal
			this.AdvertisingDataList = res.data	
		})
	}
	public listImgStyle = (item: any) => {
    const imgUrls ='/dop/iug/zuul/content/file/downloadImageOrVideo/s/'+item.material_file_path
    if (imgUrls) {
      return {
        backgroundImage:`url(${imgUrls})`,
        height:'100%',
        backgroundSize:'100%',
        backgroundRepeat: 'no-repeat',
        backgroundPostion:'center top',
      };
    }
    return undefined;
  };
	public pagination = {
		current:1,
		defaultCurrent: 1, // 默认当前页数
		defaultPageSize: 10, // 默认当前页显示数据的大小
		pageSize:10,
		total:10, // 总数，必须先有
		showSizeChanger: true,
		showQuickJumper: true,
		pageSizeOptions: ["5", "10", "15", "20"],
		showTotal: (total:number) => `共 ${total} 条`, // 显示总
		onChange:(page:any,pageSize:any)=>{
			this.pagination.current = page
			this.pagination.pageSize = pageSize
			this.getMateriaList()
		}
	}
	//查询
	public testImgTest:any = ''
	public test:any = ''
	public searchMateria(){
		console.log(this.choosePro,'choosePro')
		this.pagination.onChange(1,10)
	}
	//重置
	public resetMateriaList(){
		console.log(this.tagValueList,'tagValueList')
		console.log(this.tagValue)
		this.material_name = ''
		this.materialTypeValue = '2'
		this.authorizationValue = '2'
		this.tagSureValue = []
		this.tagValue = []
		console.log(this.tagValue)
		this.pagination.onChange(1,10)
	}
	//选择素材
	public chooseMateriaList:any = []
	public chooseMateria(item:any){
		console.log(item,'item')
		if(item.is_maturity_date === '1' && item.is_material_maturity === '0'){
			setTimeout(() => {
				item.chooseMateriaValue = false
			},50)
			console.log(item,'item')
			message.info('素材授权已过期，请选择其他素材')
			return
		}
		console.log(this.AdvertisingDataList,'AdvertisingDataList')
		if(this.chooseMateriaList.length === 0){
			this.chooseMateriaList.push(item)
		} else {
			this.chooseMateriaList.forEach((res:any) => {
				if(res.material_id === item.material_id){
					if(item.chooseMateriaValue === true){
						res.chooseMateriaValue = false
					} else if(item.chooseMateriaValue === false){
						res.chooseMateriaValue = true
					}
				}
			})		
		}
		const map = new Map()
    this.chooseMateriaList = this.chooseMateriaList.filter((key:any) => !map.has(key.material_id) && map.set(key.material_id, 1)) // 这里对name属性进行去重
	}
	//取消添加素材
	public cancleAddPro(){
		this.$emit('changeMaterial',false)
		this.authorizationValue = ''
		this.materialTypeValue = ''
		this.material_name = ''
		this.tagValue = []
	}
	//确认添加素材弹窗
	public makeAddAdvertisingBoolean:boolean = false
	//确认添加
	public addPro(){
		let addAdvertisinglength:boolean = false
		this.AdvertisingDataList.forEach((res:any) => {
			if(res.chooseMateriaValue === true){
				addAdvertisinglength = true
			}
		})
		if(addAdvertisinglength === false){
			message.info('请选择素材')
      return
		} else {
      this.makeAddAdvertisingBoolean = true
    }
	}
	//取消确认
	public cancleSureAddAdvertising(){
		this.makeAddAdvertisingBoolean = false
	}
	//确认添加
	public makeSureAddAdvertising(){
		let chooseMateriaList = this.AdvertisingDataList.filter((res:any) => {return res.chooseMateriaValue === true})
		console.log(chooseMateriaList,'chooseMateriaList')
		this.$emit('changeMaterialList',chooseMateriaList)
		this.$emit('changeMaterial',false)
		this.makeAddAdvertisingBoolean = false
		this.authorizationValue = ''
		this.materialTypeValue = ''
		this.material_name = ''
		this.tagValue = []
	}
	//预览证书
	public previewCertificate(item:any){
		
		// this.previewMaterialLink = item.certificate_name
		// this.previewMaterial = true
		axios({
        url:`/dop/iug/zuul/content/file/downloadImageOrVideo/s/${item.certificate_name}`,
        method:'post',
        responseType: 'blob',
      }).then((res:any)=>{
		console.log('res======',res)
        if(res.data.size > 0){
          const content = res.data
		  console.log('content',content)
          const blob = new Blob([content])
		  console.log('blob',blob)
          const fileName = item.certificate_name
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } 
            // else { // IE10+下载
            //   navigator.msSaveBlob(blob, fileName)
            // }
          }
      })
	}
	public previewMaterialLink:string = ''
	public previewMaterial:boolean =false
}
</script>

<style lang="less" scoped>
p{
	padding: 0px;
	margin:0;
}
.card_list{
	background-color: #eee;
	border-radius:10px;
	.card_list_imgList{
		border-radius: 10px;
		padding: 10px;
		background-color: #fff;
		.card_list_img{
			width:184px;
			height:154px;
			position: relative;
			.card_list_ifMaturity{
				width: 44px;
				height: 20px;
				background: #2ED0CA;
				border-radius: 2px;
				opacity: 0.9;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				left: 10px;
				top:5px;
				.card_list_ifMaturity_name{
					width: 36px;
					height: 16px;
					font-size: 12px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 16px;
				}
			}
			.card_list_ifMaturity_No{
				width: 44px;
				height: 20px;
				background: #E8380D;
				border-radius: 2px;
				opacity: 0.9;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				left: 10px;
				top:5px;
				.card_list_ifMaturity_name{
					width: 36px;
					height: 16px;
					font-size: 12px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 16px;
				}
			}
			.card_list_img_checkbox{
				position: absolute;
				left: 160px;
				top:5px;
			}
			.card_list_height{
				width: 100%;
				font-size:12px;
				font-weight: 400;
				position: absolute;
				// left: 10px;
				bottom:0px;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				color: #D8D8D8;	
				background: rgba(0,0,0,.4);
			}
		}
	}
	.card_list_name{
		font-size: 14px;
		font-weight: 600;
    display: block;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    color: #333333;
	}
	.card_list_source{
		font-size:12px;
		font-weight: 400;
	}
	.card_list_count{
		font-size:12px;
		font-weight: 400;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.card_list_title{
		padding: 10px;
	}
}
::v-deep(.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)){
        background: #e81919;
        border-color: #e81919;
    }
</style>