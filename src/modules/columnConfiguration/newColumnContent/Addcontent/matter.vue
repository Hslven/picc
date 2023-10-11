<template>
    <div>
        <!-- 表单 -->
        <div class="form">
            <div class="choose-select">
                <a-row :gutter="16">
                    <!-- 栏目分类 -->
                    <a-col :span="10" class="row">
                        <span style="margin-left: 30px;">栏目分类：</span>
                        <a-cascader
                            v-model:value="column"
                            :options="columnList"
                            @change="changeColumValue()"
                            :multiple="true"
                            style="width:210px;border-radius: 4px;"
                            :field-names="{ label: 'name', value: 'id', children: 'children' }"
                            placeholder="请选择" />
                    </a-col>
                     <!-- 标题名称 -->
                     <a-col :span="10" class="row">
                        <span>标题名称：</span>
                        <a-input style="width:53%;border-radius: 4px;" v-model:value="title" placeholder="请输入标题名称" />
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="10" class="row">
                        <span style="margin-left: 62px;">标签：</span>
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
                    <a-col :span="10" class="row">
                        <span>内容分类：</span>
                        <a-select @change="changeLabel" v-model:value="contentClassification" style="width:210px;border-radius: 4px;" placeholder="请选择">
                            <a-select-option  v-for="item in contentClassificationList" :key="item" :value="item.id">
                                {{item.label }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <!-- 查询重置 -->
                    <a-col class="box" :span="20">
                        <div style="flex-direction:row;">
                            <a-button class="inquire" type="primary" @click="getList">查询</a-button>
                            <a-button class="reset" type="primary" @click="cancleBtn" style="margin-left: 20px">重置</a-button>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <!-- 表格 -->
        <div>
            <a-table
                class="table"
                :row-key="(record:any) => record.content_id"
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange}"
                :dataSource="userTableData"
                :columns="userTableColumns"
                :pagination="userTablePagination"
                :loading="userTableLoading"
                :locale="locale"
                @change="handleTableChange"
                disabled
                bordered
                >
                <template #content="{ record }">
                    <div class="table-content">
                        <a-row>
                            <a-col :span="4">
                                <div class="table-content-left">
                                    <div class="table-content-img">
                                        <img v-if="record.horizontalCoverFile"
                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.horizontalCoverFile"
                                            alt="" />
                                        <img v-else-if="record.verticalCoverFile"
                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.verticalCoverFile"
                                            alt="" />
                                        <div v-else style="color: #66a1e8;font-size: 12px;width: 60px;padding-right: 20px;">待上传</div>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="20">
                                <div class="table-content-right">
                                    <div class="table-content-content line-clamp">
                                        {{ record.title_name }}
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </template>
                <template #bodyCell="{ record, column }">
                    <template v-if="column.key === 'operation'">
                        <div>
                            <a-button type="link" @click="editWords(record)" style="color: #2443bc;">详情</a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="info-btn">
            <a-button class="cancel" :ghost="false" @click="cancel">取消</a-button>
            <a-button class="submit" type="primary" :ghost="false" @click="onCheck">提交</a-button>
        </div>
        <a-modal v-model:visible="makeAddAdvertisingBoolean" >
			<template #footer>
				<a-button danger style="width: 84px;height: 32px;border-radius: 4px;" @click="cancleSureAddAdvertising">取消</a-button>
				<a-button type="primary" danger style="width: 84px;height: 32px;background: #E8380D;border-radius: 4px;" @click="makeSureAddAdvertising">确定</a-button>
			</template>
			<p style="padding: 30px 50px 30px 30px;">确定添加内容吗？</p>
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

Options({
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

    //初始化table表头
    public userTableColumns = [
        // {
        //     title: '内容ID',
        //     dataIndex: 'content_id',
        //     align: 'center',
        // },
        {
            title: '栏目分类',
            dataIndex: 'topicName',
            align: 'center',
        },
        {
            title: '标题名称',
            slots: { customRender: 'content' },
            dataIndex: 'name', 
            key: 'name',
            width:'30%',
            // dataIndex: 'title_name',
            align: 'center',
        },
        {
            title: '标签',
            dataIndex: 'labelNames',
            align: 'center',
        },
        {
            title: '最高积分值',
            dataIndex: 'feedback_count',
            align: 'center',
            customCell: () => {
                return {
                    style: {
                        'color': '#BEBEBE'
                    }
                }
            }
        },
        {
            title: '内容分类',
            dataIndex: 'content_type_name',
            align: 'center',
        },
        {
            title: '活动时间',
            dataIndex: 'feedback_time',
            align: 'center',
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
        },
    ];

    //表单内容
    public created(): void {
        this.getList()
	    this.getTagList()
        this.getColumnList();
	}
    
    //标题名称
    public title: string = ''

    //内容分类
    public contentClassification: string = ''
    
    public horizontalCoverFile:any = ''
	public verticalCoverFile:any = ''
	//素材类型下拉框列表数据
	public contentClassificationList:ditchListType[] = [
        {
            label: '全部',
			value: '',
			id: ''
		},
		{
            label: '图文',
			value: 't',
			id: 't'
		},
		{
			label: '海报',
			value: 'b',
			id: 'b'
		},
		{
			label: '产品',
			value: 'pr',
			id: 'pr'
		},
        {
			label: '话题',
			value: 's',
			id: 's'
		},
        {
			label: '视频',
			value: 'v',
			id: 'v'
		},
	]

    //获取栏目列表
	public column:any = []
	public columnList:any[] = []
	public async getColumnList(){
		let params = {
			id:''
		}
		await contentApi.getFolderTopic(params,{}).then((res:any) => {
			this.columnList = res.data
		})
	}
	//选中栏目
	public columnSureList:any = []
	public changeColumValue(){
		this.columnSureList = []
		this.column.forEach((res:any) => {
			this.columnSureList.push(res[res.length -1])
		})
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

    //时间选择器
    //开始时间
    public startTime: string = ''
    public disabledDateStart(current:any) {
        if (this.endTime) {
            return current > moment(this.endTime).endOf('day');
        } else {

        }
    }
    //结束时间
    public endTime: string = ''
    public disableEndTime(current:any) {
        if (this.startTime) {
            return (
                (current && current < moment(this.startTime).subtract(1, 'days').endOf('day'))
            );
        }
    }

    //查询反馈列表-----
    public async getList() {
        this.userTableLoading = true;
        let params = {
            title: this.title,
            contentClassification: this.contentClassification,
            contentTags: this.contentTags,
            // processingResults: this.processingResults,
            startTime: this.startTime,
            endTime: this.endTime,
        }
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            }
        }
        systemManagementApi.selectFeedback(params,header).then((res: any) => {
            console.log('查询res', res.data);
            this.userTableLoading = false;
            this.userTablePagination.total = (res as any).recordsTotal;
            //this.userTableData = res.data || [];
            this.userTableData = res.data

            res.data.forEach((item: any) => {
                console.log('123',item.feedback_status)
                if(item.feedback_status === 1|| item.feedback_status === 6){
                    //this.disabled === true
                }
            })
            console.log('userTableData', this.userTableData);

            this.userTableData.forEach((item:any)=>{
                if(item.content_type ==='t'){
                    item.content_type_name='图文'
                }else if(item.content_type ==='b'){
                    item.content_type_name='海报'
                }else if(item.content_type ==='pr'){
                    item.content_type_name='产品'
                }else if(item.content_type ==='s'){
                    item.content_type_name='话题'
                }else if(item.content_type ==='v'){
                    item.content_type_name='视频'
                }
            })

        }).catch((_err: any) => {
                this.userTableLoading = false;
        })
        console.log('this.userTableData', this.userTableData);
    }
    public state = reactive<{
        selectedRowKeys: Key[];
        loading: boolean;
    }>({
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    });
    public hasSelected = computed(() => this.state.selectedRowKeys.length > 0);

    public onSelectChange = (selectedRowKeys: Key[],record:any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.state.selectedRowKeys = selectedRowKeys;
        console.log('this.state.selectedRowKeys',this.state.selectedRowKeys)
    };


    //重置按钮
    public cancleBtn() {
        this.title = ''
        this.contentClassification = ''
        this.column = ''
        this.tagValue = ''
        // this.processingResults = ''
        this.startTime = ''
        this.endTime = ''
        this.userTablePagination.current = 1
        this.getList()
    }

    //分页
    public userTablePagination: PaginationType = {
        current: 1, //当前页数
        total: 0, //数据总数
        pageSize: 10, //每页中显示10条数据  每页条数
        //showLessItems   //是否显示较少页面内容
        //showQuickJumper  //是否可以快速跳转至某页
        //是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
        showSizeChanger: true, 
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '15', '20'], //每页中显示的数据 指定每页可以显示多少条
        showTotal: (total: number) => `共 ${total} 条`,//分页中显示总的数据 用于显示数据总量和当前数据顺序
    };
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
        this.userTablePagination.current = pagination.current;
        this.userTablePagination.pageSize = pagination.pageSize;
        this.getList();
        // return record.reachId;
    }

    public contentId = ''

    public async handleChoose(record:any,item:any){
		console.log('item',item)
        //:disabled="item.label === '下架' && record.feedback_statusname === '1' || item.label === '预览' && record.feedback_statusname === '1' || item.label === '查看详情' && record.feedback_statusname === '0'"
        console.log('handleList',this.handleList)
        console.log('表格编辑', record);
        this.contentId = record.contentId
    }


    public open:boolean = true


    //取消添加活动
	public cancel(){
        console.log(6666)
        this.state.selectedRowKeys = []
        this.open = false
		// this.$emit('changePro',false)
	}
	//确认添加活动弹窗
	public makeAddAdvertisingBoolean:boolean = false
	//确认添加活动
	public onCheck(){
        console.log(this.state.selectedRowKeys,'this.state.selectedRowKeys')
		if(this.state.selectedRowKeys.length === 0){
			message.info('请选择内容')
			return
		}
		this.makeAddAdvertisingBoolean = true
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
		this.$emit('changePro',false)
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



    //查看详情
    public editWords (record:any){
        console.log('点击了详情', record);
        this.contentId = record.contentId
        console.log('contentId',record.content_id)
        this.router.push({ path: '/conTent/contentDetail', query: { contentId: record.content_id } })
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
}
.cancel {
    margin-right: 20px;
}


</style>