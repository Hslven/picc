<template>
    <div>
        <!-- 表单 -->
        <div class="form">
            <div class="choose-select">
                <a-row :gutter="16">
                    <!-- 标题名称 -->
                    <a-col :span="10" class="row">
                        <span style="margin-left: 32px;">标题名称：</span>
                        <a-input style="width:63%;border-radius: 4px;" v-model:value="title" placeholder="请输入" />
                    </a-col>
                    <!-- 内容类型 -->
                    <a-col :span="10" class="row">
                        <span style="margin-left: 42px;">标签：</span>
                        <a-select @change="changeLabel" v-model:value="contentTags" style="width:260px;border-radius: 4px;" placeholder="默认第一项">
                            <a-select-option  v-for="item in tagsList" :key="item" :value="item.id">
                                {{item.name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="10" class="row">
                        <span>栏目内容分类：</span>
                        <a-select ref="select" v-model:value="contentClassification" style="width:260px;border-radius: 4px;">
                            <a-select-option v-for="item in contentClassificationList" :key="item.id">{{ item.label}}</a-select-option>
                        </a-select>
                    </a-col>
                    <!-- 时间 -->
                    <a-col :span="8" class="box">
                        <span>上架时间：</span>
                        <a-date-picker
                            style="width:30%;border-radius: 4px;margin-right: 8px;"
                            valueFormat="YYYY-MM-DD 00:00:00"
                            v-model:value="startTime"
                            :disabledDate="disabledDateStart"
                            placeholder="开始时间"
                        />
                        <span>至</span>
                        <a-date-picker
                            style="width:30%;border-radius: 4px;margin-left:8px"
                            valueFormat="YYYY-MM-DD 23:59:59"
                            v-model:value="endTime"
                            :disabled-date="disableEndTime"
                            placeholder="结束时间"
                        />
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
        <!-- 按钮 -->
        <div>
            <div class="newbtn">
                <a-button class="normal" type="primary" @click="addContent()">+添加栏目内容</a-button>
                <a-button class="soldOut" type="primary" @click="deleteInBatches(record)">批量删除</a-button>
            </div>
        </div>
        <a-drawer width="1000" :open="open" v-model:visible="contentModal" placement="right" :closable="false">
            <contentModal :choosePro="contentModal" @changeNewcolumn="changeNewcolumn"/>
        </a-drawer>
        <!-- 表格 -->                                                                                                                                  
        <div>
            <a-table
                class="table"
                :row-key="(record:any) => record.sensitiveId"
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                :dataSource="userTableData"
                :columns="userTableColumns"
                :pagination="userTablePagination"
                :loading="userTableLoading"
                :locale="locale"
                @change="handleTableChange"
                bordered
                >
                <template #content="{ record }">
                    <div class="table-content">
                        <a-row>
                            <a-col :span="4">
                                <div class="table-content-left">
                                    <div class="table-content-img">
                                        <img v-if="record.horizontalCoverFile"
                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/f/' + record.horizontalCoverFile"
                                            alt="" />
                                        <img v-else-if="record.verticalCoverFile"
                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/f/' + record.verticalCoverFile"
                                            alt="" />
                                        <div v-else class="upload">待上传</div>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="20">
                                <div class="table-content-right">
                                    <div class="table-content-content line-clamp">
                                        {{ record.sensitiveTypeName }}
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </template>
                <template #bodyCell="{ record, column }">
                    <template v-if="column.key === 'operation'">
                        <div class="newbtns">
                            <a-button type="link" @click="editWords(record)" style="color: #2443bc;float: left;">查看详情</a-button>
                            <a-button type="link" @click="sensitiveDelete(record)" style="color: #e8380d;float: right;">删除</a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>
<script lang="ts">
import { AxiosRequestHeaders } from 'axios';
import Encrypts from '../../../libs/Encrypts';
import { systemManagementApi,contentApi } from '../../../libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode, computed, reactive } from 'vue';
import contentModal from '../newColumnContent/contentModal.vue';
import { FormInstance, message, Modal, Form,} from 'ant-design-vue';
import { ExclamationCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { global } from '../../../libs/Global';
import moment from 'moment';
import { ColumnProps, } from 'ant-design-vue/es/table';
import { text } from 'stream/consumers';
import { Item } from 'ant-design-vue/lib/menu';
import { log } from 'console';
import { useRouter } from 'vue-router'
type Key = ColumnProps['key'];
import store from '../../../modules/conTent/store';

//表单
interface AddFormType {
    title: string;
    contentTags: string;
    contentClassification: string;
}

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
        contentModal,
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
            dataIndex: 'sensitiveTypeName',
            align: 'center',
        },
        {
            title: '栏目内容分类',
            dataIndex: 'sensitiveName',
            align: 'center',
        },
        {
            title: '最高积分数',
            dataIndex: 'sensitiveTypeName',
            align: 'center',
        },
        {
            title: '上架时间',
            dataIndex: 'mdfDate',
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
        // this.secsitiveTypeList();
		// this.contentClassification = '';
        // this.processingResults = '0';
        this.getLabelTree();
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
			label: '海报',
			value: 'b',
			id: 'b'
		},
        {
			label: '活动',
			value: 's',
			id: 's'
		},
        {
			label: '内容',
			value: 'v',
			id: 'v'
		},
	]

    //内容标签v-model
	//public contentTags: any = []
    public contentTags: string = ''

    public changeLabel() {
        this.state.selectedRowKeys = []
        //this.selectedRow = []
    }
	// //内容类型下拉框列表数据
	// public contentTagsList:ditchListType[] = [
	// 	{
	// 		label: '全部',
	// 		value: '0',
	// 		id: '0'
	// 	},
	// ]
    // public materialIdList: any = '';
    public tagsList: any[] = [{ name: '全部', id: '' }];
    public getLabelTree() {
        const params = {
            id: '',
        };
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = '1';
                header.row4Page = '50';
            },
        };

        contentApi.getFolderLabel(params, header).then((res) => {
            console.log('查询标签', res);
            this.tagsList.push(...res.data);
        });
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



    //查询列表-----
    public async getList() {
        //this.userTableLoading = true;
        let params = {
            //sensitiveTypeId: this.sensitiveTypeId[this.sensitiveTypeId.length - 1], //得到的是一个数组 取最后一个值
            sensitiveTypeId: this.sensitiveTypeId,
            sensitiveTypeName: this.sensitiveTypeName,
            sensitiveName: this.sensitiveName,
            mdfStartDate: this.mdfStartDate,
            mdfEndDate: this.mdfEndDate,
            // row4Page: this.userTablePagination.pageSize,
            // nowPage: this.userTablePagination.current,
        };
        console.log('aaa',params)
        console.log('999',)
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            },
        };
        systemManagementApi.selectSensitiveMainInfo(params, header).then((res: any) => {
                console.log('查询res', res.data);
                this.userTableLoading = false;
                this.userTablePagination.total = (res as any).recordsTotal;
                this.userTableData = res.data;
                console.log('userTableData', this.userTableData);
        })
        .catch(() => {
                this.userTableLoading = false;
        });

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
        this.contentTags = ''
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

    // 批量删除
    public deleteInBatches = (record: any) => {
        // row这一行数据
        // 未选中内容的
        if (!this.state.selectedRowKeys.length) {
            message.info('请先勾选需删除的敏感词');
            return;
        }
        //选中了内容的
        else {
            Modal.confirm({
                // title: '',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认删除所选敏感词吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.deleteInBatchesId(record);
                },
                onCancel() {
                    message.error('删除失败');
                },
            });
            return;
        }
    };
    public deleteInBatchesId(record: any) {
        console.log('this.state.selectedRowKeys', this.state.selectedRowKeys);
        // 发请求 调用批量删除接口
        // this.userTableLoading = true;
        let params: any = {
            ids: [],
        };
        //console.log('ids',ids)
        console.log(this.state.selectedRowKeys, 'this.state.selectedRowKeys');
        this.state.selectedRowKeys.forEach((res: any) => {
            params.ids.push(res);
        });
        // console.log(params)
        //let List= this.state.selectedRowKeys
        // console.log('ids',ids)
        systemManagementApi.removeByIds(params, {}).then(() => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
            this.secsitiveTypeList()
        });
    }

    // 单个删除用户
    public sensitiveDelete(record: any) {
        console.log('record5', record);
        //this.preBrowseVisible = true
        //this.popoverTypeName = '您确定要删除吗？'
        this.state.selectedRowKeys.push(record.sensitiveId);
        console.log('row', record);
        // this.selectSensitiveMainInfoId()
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.selectSensitiveMainInfoId();
                //发请求 调用删除接口
            },
        });
    }
    public selectSensitiveMainInfoId() {
        console.log('this.state.selectedRowKeys', this.state.selectedRowKeys);
        let params: any = {
            ids: [],
        };
        console.log(this.state.selectedRowKeys, 'this.state.selectedRowKeys');
        this.state.selectedRowKeys.forEach((res: any) => {
            params.ids.push(res);
        });
        // console.log(record.sensitiveId,'record.sensitiveId')
        // this.record.sensitiveId.forEach((res:any) => {
        // 	params.ids.push(res)
        // })
        console.log('ids', params.ids);
        systemManagementApi.removeByIds(params, {}).then(() => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
            this.secsitiveTypeList()
        });
    }
    public contentModal = false; //是否展示新增标签的弹出框
    // 新增内容
    public addContent() {
        console.log('添加栏目内容')
        // if (this.formData.topicId === '') {
        //     message.warning('未选择标签分组');
        // } else {
        //     console.log('新增内容按钮');
        //     //this.router.push('addContent')
        //     this.addFormState.labelName = '';
        //     this.contentModal = true;
        // }
        this.contentModal = true;
    }


    public changeNewcolumn(value:any){
		this.contentModal = value
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
    margin-left: 22px;
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
.newbtn{
    margin-left: 22px;
    margin-top: 42px;
}
.normal{
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    padding-left: 13px;
    margin-left: 17px;
    width: 122px;
    height: 32px;
    border-radius: 4px;
    background-color: #E8380D;
    border-color: #ffffff;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
}

.soldOut{
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    margin-left: 25px;
    padding-left: 13px;
    width: 122px;
    height: 32px;
    border-radius: 4px;
    background-color: #ffffff;
    border-color: #E8380D;
    color: #E8380D;
    font-size: 14px;
    text-align: center;
}
.table {
    // margin-left: 249px;
    margin-top: 22px;
    margin-left: 22px;
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

</style>