<template>
    <div>
        <!-- 表单 -->
        <div class="form">
            <div class="choose-select">
                <a-row :gutter="16">
                     <!-- 标题名称 -->
                     <a-col :span="10" class="row">
                        <span style="margin-left: 30px;">标题名称：</span>
                        <a-input style="width:53%;border-radius: 4px;" v-model:value="title" placeholder="请输入标题名称" />
                    </a-col>
                    <!-- 所属标签 -->
                    <a-col :span="10" class="row">
                        <span>所属标签：</span>
                        <a-cascader
                            v-model:value="tagValue"
                            :options="tagValueList"
                            :multiple="true"
                            mode="tags" 
                            style="width:210px;border-radius: 4px;"
                            @change="changeTagValue()"
                            :field-names="{label:'name',value:'id',children:'children'}" 
                            placeholder="请选择" />
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <!-- 查询重置 -->
                    <a-col class="box" :span="20">
                        <div style="flex-direction:row;">
                            <a-button class="inquire" type="primary" @click="searchMateria">查询</a-button>
                            <a-button class="reset" type="primary" @click="cancleBtn" style="margin-left: 20px">重置</a-button>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <!-- 表格 -->
        <div class="gutter-example">
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
                                                <!-- <div class="card_list_ifMaturity" v-if="item.is_material_maturity==='0'">
                                                    <span class="card_list_ifMaturity_name">已授权</span>
                                                </div> -->
                                                <div class="card_list_img_checkbox">
                                                    <a-checkbox v-model:checked="item.chooseMateriaValue" @click="chooseMateria(item)">
                                                    </a-checkbox>
                                                </div>
                                                <!-- <p class="card_list_height">
                                                    <span>{{ item.picture_height }} * {{ item.picture_width }}</span>
                                                    <span>{{ item.material_file_type }} </span>
                                                </p> -->
                                                <img v-if="item.material_file_type !== 'mp4'" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + item.material_file_path" alt="" style="width:100%;height:100%">
                                                <video v-if="item.material_file_type === 'mp4'" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + item.material_file_path" :controls = "true" preload="auto" style="width:100%;height:100%"></video>
                                                <!-- <img :src="item.certificate_name" alt="" /> -->
                                            </div>
                                            <p class="card_list_name">{{ item.material_name }}</p>
                                            <!-- <p class="card_list_source">
                                                <span style="color:#999999;font-size: 12px;">
                                                    素材来源：
                                                </span>
                                                <span style="color:#333333;font-size: 12px;">
                                                    {{ item.material_source }}
                                                </span>
                                            </p> -->
                                            <!-- <p class="card_list_name" v-if="item.is_material_maturity === '是'">是否有授权证书：<span>{{ item.is_material_maturity }}</span></p> -->
                                            <!-- <p class="card_list_count">
                                                <div>
                                                    <span style="color:#999999;font-size: 12px;">引用次数：</span>
                                                    <span style="color:#E8380D;font-size: 12px;font-weight: 600;">{{ item.cite_count }}</span>
                                                </div>
                                                <div>
                                                    <a-button type="link" v-if="item.certificate_name !== ''" @click="previewCertificate(item)" style="font-size:12px;">预览授权证书</a-button>
                                                </div>
                                            </p> -->
                                        </div>
                                        <!-- <div class="card_list_title">
                                            <p class="card_list_title_name" v-if="item.label_ids.length !== 0">
                                                <span style="color:#999999;font-size: 12px;">标签：</span>
                                                <span v-for="(items) in item.label_ids" :key="items.label_id" :value="item.label_id" style="font-size: 12px;">
                                                    {{ items.label_name }}、
                                                </span>
                                            </p>
                                            <p class="card_list_title_name" v-if="item.label_ids.length === 0">
                                                <span style="color:#999999;font-size: 12px;">暂无标签</span>
                                            </p>
                                        </div> -->
                                    </div>
                                </a-list-item>
                            </template>
                        </a-list>
        </div>
        <div class="info-btn">
            <a-button class="cancel" :ghost="false" @click="cancleAddPro">取消</a-button>
            <a-button class="submit" type="primary" :ghost="false" @click="addPro">提交</a-button>
        </div>
        <a-modal v-model:visible="makeAddAdvertisingBoolean" >
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;border-radius: 4px;" @click="cancleSureAddAdvertising">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="makeSureAddAdvertising">确定</a-button>
			</template>
			<p style="padding: 30px 50px 30px 30px;">确定添加海报吗？</p>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { AxiosRequestHeaders } from 'axios';
import Encrypts from '../../../../libs/Encrypts';
import { systemManagementApi,contentApi } from '../../../../libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode, computed, reactive } from 'vue';
import { FormInstance, message, Modal, Form,} from 'ant-design-vue';
import { ExclamationCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { global } from '../../../../libs/Global';
import moment from 'moment';
import { ColumnProps, } from 'ant-design-vue/es/table';
import { text } from 'stream/consumers';
import { Item } from 'ant-design-vue/lib/menu';
import { log } from 'console';
import { useRouter } from 'vue-router'
type Key = ColumnProps['key'];
import store from '../../../../modules/conTent/store';
import { Prop } from 'vue-property-decorator';


//表格
interface UserTableType {
    //content_id: string;
    title_name: string;
    content_type_name: string;
    problem_description: string;
    labelNames: string;
    feedback_count: string;
    feedback_statu: string;
    feedback_time: string;
    // short_link_id: string;
    // short_link_status: string;
}

//分页
interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showQuickJumper: true,
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

//操作
interface handleListType {
	key:string,
	value:string,
	label:string,
	disabled:boolean
}

//下拉框
interface ditchListType {
    label: string,
    value: string,
    id: string
}

@Options({
    components: {
        ExclamationCircleOutlined,
        CloseOutlined,
        SearchOutlined,
        DeleteOutlined,
        PlusOutlined,
        ReloadOutlined,
        // data: {
        //     inputVal: "", // 输入框的输入值
        //     monitorData: [], // 整个表数据
        //     total: 0, // 总条数，分页时有用
        // }
    },
})
export default class User extends Vue {
    @Prop({ default: false }) public choosePro!: boolean;
[x: string]: any;
// [x: string]: any;
//     @Ref('addForm') readonly addForm!: FormInstance;
    public showModal: boolean = false
    public permission: any = [];
    // public userTableData = [] as any[];
    public router = useRouter()
    public userTableData: any[] = [
        // {
        //     content_type_name:'p',
        //     sensitiveTypeName : '1',
        //     sensitiveName:'234',
        //     crtUser:'erw',
        //     feedback_status:'0'
        // },
        // {
        //     content_type_name:'b',
        //     sensitiveTypeName : '2',
        //     sensitiveName:'234',
        //     crtUser:'erw',
        //     feedback_status:'1'
        // },
        // {
        //     content_type_name:'t',
        //     sensitiveTypeName : '2',
        //     sensitiveName:'234',
        //     crtUser:'erw',
        //     feedback_status:'6'
        // }
    ];

    //表单内容
    public created(): void {
	    // this.getList()
        // this.secsitiveTypeList();
		// this.contentClassification = '';
        // this.processingResults = '0';
        this.getTagList();
        // this.searchMateria();
        this.getMateriaList();
	}

    //获取标签列表
	public tagValue:any = []
	public tagValueList:any[] = []
	public async getTagList(){
		let params = {
			id:''
		}
		await contentApi.getFolderLabel(params,{}).then((res:any) => {
			this.tagValueList = res.data
		})
	}
	//选中标签
	public tagSureList:any = []
	public changeTagValue(){
		this.tagSureList = []
		this.tagValue.forEach((res:any) => {
			this.tagSureList.push(res[res.length -1])
		})
	}


    //获取素材列表



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

    //获取素材列表
	// public async getMateriaList(){
	// 	let params = {
	// 		materialName:this.material_name,
	// 		materialFileType:this.materialFileType,
	// 		isMaterialMaturity:this.isMaterialMaturity,
	// 		labelId:this.tagSureValue
	// 	}
    //     console.log('paramswerwer',params)
	// 	const header: any = {
    //         request: (header: AxiosRequestHeaders) => {
    //             header.nowPage = this.pagination.current;
    //             header.row4Page = this.pagination.pageSize;
    //         }
    //     }
	// 	await contentApi.getMaterialList(params,header).then((res:any) => {
    //         console.log('reswerwer',res)
	// 		this.pagination.total = res.recordsTotal
	// 		this.AdvertisingDataList = res.data	
	// 	})
	// }

    //查询
	public testImgTest:any = ''
	public test:any = ''
	public searchMateria(){
		console.log(this.choosePro,'choosePro')
		this.pagination.onChange(1,10)
	}
    
    //重置按钮
    public cancleBtn() {
        this.title = ''
        this.contentClassification = ''
        this.tagValue = ''
        // this.processingResults = ''
        this.startTime = ''
        this.endTime = ''
        this.pagination.current = 1
        this.getMateriaList()
    }

    //分页
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



    public userTableLoading = false;  // 用户表加载

    //创建一个对象，判断如果满足条件就赋值，否者赋空
    public getPermsBtn() {
        let per: any = {};
        if (global.userInfo) {
            per = global.userInfo.permsBtn;
        }
        this.permission = per['user'] || [];
    }

    //用户列表上一页、下一页
    public handleTableChange(pagination: PaginationType) {
        console.log(pagination,'pagination')
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.getMateriaList();
        // return record.reachId;
    }


	//取消添加海报
	public cancleAddPro(){
		this.$emit('changeNewcolumn',false)
        this.contentModal = false
	}
    
	//确认添加海报弹窗
	public makeAddAdvertisingBoolean:boolean = false
	//确认添加海报
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
		console.log(this.TableSureList,'this.state.selectedRowKeys')
		// this.$emit('changeProList',this.TableSureList)
		// this.makeAddAdvertisingBoolean = false
		this.$emit('changeNewcolumn',false)
		// this.column = []
		// this.columnSureList = []
		// this.titleNameValue = ''
		// this.tagValue = []
		// this.tagSureList = []
		// this.startTime = ''
		// this.endTime = ''
		// this.userTableSelectedKeys = []
		// this.TableSureList = []
	}
    
}

</script>

<style lang="less" scoped>

::v-deep .ant-table-thead > tr > th {
    background: #E1EBF9 100%;
    color: #000;
}
.form {
    height: 100px;
    color: rgba(16, 16, 16, 1);
    font-size: 18px;
    text-align: left;
    margin-left: -22px;
}
.row {
    // left: 675px;
    margin-top: 20px;
    width: 140px;
    height: 40px;
    //border-radius: 6px 6px 6px 6px;
    color: rgb(112, 112, 112);
    font-size: 16px;
    text-align: left;
    margin-right: 30px;
}
.box{
    margin-top: 20px;
    height: 40px;
    //border-radius: 6px 6px 6px 6px;
    color: rgb(112, 112, 112);
    font-size: 16px;
    text-align: center;
    margin-left: 4px;
}

.inquire {
    // width: 84px;
    // height: 35px;
    // background: #E8380D;
    // border-radius: 4px;
    // color: #ffffff;
    // //border-radius: 4px;
    // font-size: 16px;
    // //text-align: center;
    // font-family: Microsoft Yahei;
    border: 0px solid #000000;
    background-color: #E8380D;
    color: #ffffff;
    //width: 84px;
    border-radius: 4px;
    //height: 32px;
}
.reset {
    // width: 84px;
    // height: 32px;
    background-color: #fbfbfb;
    color: #030303;
    border-color: #acabab;
    border-radius: 4px;
    font-size: 16px;
    padding-top: 2px;
    //text-align: center;
    font-family: Microsoft Yahei;
}
// .box .ant-btn-primary:hover{
//     background: #ff0202;
//     border-color: #0c0c0c;
//     color: #fff;
// }
.table {
    // margin-left: 249px;
    margin-top: 100px;
    margin-right: 12px;
    //width: 1452px;
    //height: 810px;
    line-height: 20px;
    background-color: #fcfcfd;
    color: #000000;
    font-size: 12px;
    text-align: center;
    font-family: Microsoft Yahei;
}
// .ant-btn-primary{
//     background: #ff1212;
//     border-color: #2f43fa;
//     box-shadow: 0 2px 0 rgba(0,0,0,.045);
//     color: #fff;
//     text-shadow: 0 -1px 0 rgba(0,0,0,.12);
// }
.tip {
    color: #cccccc;
}

.newbtns {
    text-align: center;
    display: flex;
}

.info-btn {
    margin-bottom: 30px;
    // padding-top: 70px;
    float: right;
    margin-right: 100px;
    margin-top: 20px;
}
.cancel {
    margin-right: 20px;
}

.card_list{
	background-color: #eee;
	border-radius:10px;
    margin-top: 30px;
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
			.card_list_img_checkbox{
				position: absolute;
				left: 10px;
				top:5px;
			}
			.card_list_height{
				width: 100%;
				font-size:12px;
				font-weight: 400;
				position: absolute;
				left: 10px;
				top:130px;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				color: #D8D8D8;	
			}
		}
	}
	.card_list_name{
		font-size: 14px;
		color: #333333;
		font-weight: 600;
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



</style>