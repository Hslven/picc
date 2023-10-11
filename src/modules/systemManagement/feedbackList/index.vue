<template>
    <div>
        <!-- 反馈管理 -->
        <!-- 表单 -->
        <div class="form">
            <div class="choose-select">
                <a-row>
                    <!-- 标题名称 -->
                    <a-col :span="7" class="row">
                        <span>标题名称：</span>
                        <a-input style="width:65%;border-radius: 4px;" v-model:value="title" placeholder="请输入" />
                    </a-col>
                    <!-- 素材类型 -->
                    <a-col :span="7" class="row">
                        <span>内容分类：</span>
                        <a-select ref="select" v-model:value="contentClassification" style="width:180px;border-radius: 4px;">
                            <a-select-option v-for="item in contentClassificationList" :key="item.id">{{ item.label}}</a-select-option>
                        </a-select>
                    </a-col>
                    <!-- 内容类型 -->
                    <a-col :span="7" class="row">
                        <span>内容标签：</span>
                        <a-select @change="changeLabel" v-model:value="contentTags" style="width:180px;border-radius: 4px;" placeholder="默认第一项">
                            <a-select-option  v-for="item in tagsList" :key="item" :value="item.id">
                                {{item.name }}
                            </a-select-option>
                        </a-select>
                        <!-- <a-cascader 
                            v-model:value="contentTags"
                            placeholder="请选择内容标签" 
                            :show-search="{ filter }"
                            :field-names="{label:'labelName',value:'labelId',children:'children'}" 
                            :options="materialIdList"
                            @change="changeRegionType($event)"
                        /> -->
                        <!-- <a-select @change="changeLabel" v-model:value="formData.owntag" placeholder="默认第一项">
                            <a-select-option  v-for="item in tagsList" :key="item" :value="item.id">
                                {{item.name }}
                            </a-select-option>
                        </a-select> -->
                        <!-- <a-select ref="select" v-model:value="contentTags" style="width:180px;border-radius: 4px;">
                            <a-select-option v-for="item in contentTagsList" :key="item.id">{{ item.label}}</a-select-option>
                        </a-select> -->
                        <!-- <a-select ref="select" v-model:value="contentTags" style="width:180px;border-radius: 4px;">
                            <a-select-option v-for="item in materialIdList" :key="item.id">{{ item.label}}</a-select-option>
                        </a-select> -->
                    </a-col>
                    <!-- 处理状态 -->
                    <a-col :span="7" class="row">
                        <span>处理结果：</span>
                        <a-select ref="select" v-model:value="processingResults" style="width:180px;border-radius: 4px;">
                            <a-select-option v-for="item in processingResultsList" :key="item.id">{{ item.label}}</a-select-option>
                        </a-select>
                    </a-col>
                    <!-- 时间 -->
                    <a-col :span="11" class="box">
                        <span>反馈时间：</span>
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
                    <!-- 查询重置 -->
                    <a-col class="box">
                        <div style="flex-direction:row;">
                            <a-button class="inquire" type="primary" @click="getList">查询</a-button>
                            <a-button class="reset" type="primary" @click="cancleBtn" style="margin-left: 5px">重置</a-button>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>
        <!-- 按钮 -->
        <div>
            <div class="newbtn">
                <a-button class="normal" type="primary" @click="batchNormalUser">批量正常</a-button>
                <a-button class="soldOut" type="primary" @click="batchRemovalUser">批量下架</a-button>
            </div>
        </div>
        <!-- 表格 -->
        <div>
            <a-table
                class="table"
                :row-key="(record:any) => record.content_id"
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, getCheckboxProps:getCheckboxProps }"
                :dataSource="userTableData"
                :columns="userTableColumns"
                :pagination="userTablePagination"
                :loading="userTableLoading"
                :locale="locale"
                @change="handleTableChange"
                disabled
                bordered
                >
                <!-- <template #content="{ record }">
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
                                        {{ record.title_name }}
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </template> -->
                <template #reachDitch ="{ text }">
					<p>{{ text === 't' ? '文本' : text === 'b' ? '海报' : text === 'p' ? '图片' : text === 'hv' ? '横版视频' : text === 'vv' ? '竖版视频' : '' }}</p>
				</template>
                <template #status="{text}">
					<p>{{ text === '0' ? '待处理' : text === '6' ? '下架' : text === '1' ? '正常':''}}</p>
				</template>
                <template #action="{record}">
					<a-dropdown :trigger="['click']">
						<a class="ant-dropdown-link" @click.prevent>
							<p style="font-size: 26px;height: 30px;">···</p>
						</a>
						<template #overlay>
							<a-menu>
								<a-menu-item
                                    :key="item.key"
									v-for="item in handleList"
                                    :disabled="item.label === '下架' && record.feedback_status === '6' || item.label === '正常' && record.feedback_status === '1'"
                                    @click="handleChoose(record,item.value)"
									>
									{{ item.label }}
								</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown>
				</template>
            </a-table>
        </div>
    </div>
</template>
<script lang="ts">
import { AxiosRequestHeaders } from 'axios';
import Encrypts from '@/libs/Encrypts';
import { systemManagementApi,contentApi } from '@/libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode, computed, reactive } from 'vue';
import { FormInstance, message, Modal, Form,} from 'ant-design-vue';
import { ExclamationCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { global } from '@/libs/Global';
import moment from 'moment';
import { ColumnProps, } from 'ant-design-vue/es/table';
import { text } from 'stream/consumers';
import { Item } from 'ant-design-vue/lib/menu';
import { log } from 'console';
import { useRouter } from 'vue-router'
type Key = ColumnProps['key'];
import store from '@/modules/conTent/store';

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
    @Ref('addForm') readonly addForm!: FormInstance;
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
            // slots: { customRender: 'content' },
            // dataIndex: 'name', 
            // key: 'name',
            dataIndex: 'title_name',
            align: 'center',
            ellipsis: true,
            width:200,
        },
        {
            title: '内容分类',
            dataIndex: 'content_type_name',
            align: 'center',
        },
        {
            title: '内容标签',
            dataIndex: 'labelNames',
            align: 'center',
        },
        {
            title: '被反馈原因',
            dataIndex: 'problem_description',
            align: 'center',
        },
        {
            title: '被反馈次数',
            dataIndex: 'feedback_count',
            align: 'center',
        },
        {
            title: '处理结果',
            dataIndex: 'feedback_status',
            align: 'center',
            key: 'contentStatus',
            slots: { customRender: 'status' },
        },
        {
            title: '反馈时间',
            dataIndex: 'feedback_time',
            align: 'center',
        },
        {
            title: '操作',
			dataIndex: '操作',
			align: 'center',
			key:'operation',
			fixed: 'right',
			slots: { customRender: 'action' },
        },
    ];

    //选择框userTableSelectedKeys-单选的key值对应的数据
    // public userTableSelectedKeys:string[] = []
	// public onSelectChange(selectedRowKeys:string[]) {
	// 	this.userTableSelectedKeys = selectedRowKeys;
	// };

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

    //内容标签v-model
	//public contentTags: any = []
    public contentTags: string = ''

    public changeLabel() {
        this.state.selectedRowKeys = []
        this.selectedRow = []
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
    // public filter (inputValue:any, path:any)  {
    //     console.log(inputValue,path)
    //     return path.some((option:any) => option.labelName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    // };

    // public regionList:any = []
    // public changeRegionType(value:any){
    //     console.log('321',this.contentTags)
    //     this.regionList = []
    //     this.contentTags.forEach((res:any) => {
	// 		this.regionList.push(res[res.length -1])
	// 	})
    //     console.log('222',this.regionList)
	// 	//formData.includeTag = regionList
	// }

    //处理状态v-model
	public processingResults: string = ''
	//处理状态下拉框列表数据
	public processingResultsList:ditchListType[] = [
        {
			label: '全部',
			value: '',
			id: ''
		},
        {
			label: '待处理',
			value: '0',
			id: '0'
		},
        {
			label: '正常',
			value: '1',
			id: '1'
		},
        {
			label: '下架',
			value: '6',
			id: '6'
		},
	]

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
            processingResults: this.processingResults,
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
                    this.disabled === true
                }
            })
            console.log('userTableData', this.userTableData);

            //操作的对应
            this.userTableData.forEach((item:any)=>{
                if(item.feedback_status ==='0'){
                    item.feedback_statusname='待处理'
                }else if(item.feedback_status ==='1'){
                    item.feedback_statusname='正常'
                    //this.state.selectedRowKeys.style.disabled = false
                }else if(item.feedback_status ==='6'){
                    item.feedback_statusname='下架'
                }
                
                // systemManagementApi.qrysysLabel({groupId:item.label_ids},{}).then(res=>{
                //     console.log('标签详情',res);
                    
                // })
            })
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

            // this.userTableData.forEach((item:any)=>{
            //     if (item.feedback_statusname === '待处理') {
            //         item.menuTableList = [
            //             { title: '预览', index: 0, disabled: false },
            //             { title: '上架', index: 2, disabled: false },
            //             { title: '下架', index: 3, disabled: false  },
            //         ]
            //     } else if (item.feedback_statusname === '下架') {
            //         item.menuTableList = [
            //             { title: '查看详情', index: 0, disabled: false },
            //         ]
            //     } else if (item.feedback_statusname === '上架') {
            //         item.menuTableList = [
            //             { title: '查看详情', index: 0, disabled: false },
            //         ]
            //     }
            // })

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
    // public getCheckboxProps(record:any) {
    //     console.log('record',record)
    //     console.log(record.feedback_status, 'feedback_status');
    //     if(record.feedback_status === '1' || record.feedback_status === '6'){
    //         return ({disabled: true});
    //     }
    //     // return ({
    //     //      props: {
    //     //         //当状态是1或者6的时候执行disable
    //     //         disabled: record.feedback_status === '1' || record.feedback_status === '6'
    //     //     }
    //     // })
    // };

    //重置按钮
    public cancleBtn() {
        this.title = ''
        this.contentClassification = ''
        this.contentTags = ''
        this.processingResults = ''
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

    // 批量正常
    public batchNormalUser = (record: any) => {
        if (!this.state.selectedRowKeys.length) {
            message.info('请先勾选内容');
            return;
        }
        else 
        {   
            Modal.confirm({
                // title: '',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认所选内容反馈问题均正常吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.batchdeleteLabels(record)
                }
            });
            return;
        }
    };

    public batchdeleteLabels(record: any){
        // 发请求 调用正常/下架接口
        console.log('this.state.selectedRowKeys',this.state.selectedRowKeys)
        // 发请求 调用批量删除接口
        // this.userTableLoading = true;
        let params:any = {
			operateType:'1',   //操作类型
            //contentIds:this.content_id,  // 内容id
            contentIds:[]
		}
        console.log(this.state.selectedRowKeys,'this.state.selectedRowKeys')
		this.state.selectedRowKeys.forEach((res:any) => {
			params.contentIds.push(res)
		})
        console.log('7',params.contentIds)
        console.log('6',params.operateType)
        systemManagementApi.upStatus(params,{}).then((res) => {
            this.userTableLoading = true;
            console.log('选择res',res);
            message.success('操作成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }


    // 批量下架
    public batchRemovalUser = (record: any) => {
        if (!this.state.selectedRowKeys.length) {
            message.info('请先勾选内容');
            return;
        }
        else 
        {   
            Modal.confirm({
                // title: '',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认所选内容反馈问题均下架吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.batchdeleteLabel(record)
                }
            });
            return;
        }
    };

    public batchdeleteLabel(record: any){
        // 发请求 调用正常/下架接口
        //console.log('record',record)
        console.log('this.state.selectedRowKeys',this.state.selectedRowKeys)
        // 发请求 调用批量删除接口
        // this.userTableLoading = true;
        let params:any = {
			operateType:'6',   //操作类型
            //contentIds:this.content_id,  // 内容id
            contentIds:[]
		}
        //console.log('ids',ids)
        console.log(this.state.selectedRowKeys,'this.state.selectedRowKeys')
		this.state.selectedRowKeys.forEach((res:any) => {
			params.contentIds.push(res)
		})
        console.log('8',params.contentIds)
        console.log('9',params.operateType)
        systemManagementApi.upStatus(params,{}).then((res) => {
            this.userTableLoading = true;
            console.log('选择res',res);
            message.success('操作成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    //初始化table操作按钮
	public handleList:handleListType [] = [
		{
			key:'0',
			value:'0',
			label:'正常',
            disabled:false
		},
		{
			key:'1',
			value:'1',
			label:'查看详情',
            disabled:false
		},
		{
			key:'0',
			value:'2',
			label:'下架',
            disabled:false
		},
	]

    public contentId = ''

    public async handleChoose(record:any,item:any){
		console.log('item',item)
        //:disabled="item.label === '下架' && record.feedback_statusname === '1' || item.label === '预览' && record.feedback_statusname === '1' || item.label === '查看详情' && record.feedback_statusname === '0'"
        console.log('handleList',this.handleList)
        console.log('表格编辑', record);
        this.contentId = record.contentId
		if(item === '2' ){
            //this.preBrowseVisible = true
            //this.popoverTypeName = '确认下架所选内容吗？'
            this.state.selectedRowKeys.push(record.content_id)
            //this.undercarriageId(record)
            Modal.confirm({
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认所选内容下架吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    //调用下架的接口
                    this.undercarriageId(record)
                },
            });
		}
		if(item === '0'){
            //正常
            this.state.selectedRowKeys.push(record.content_id)
            //this.undercarriageId(record)
            Modal.confirm({
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认所选内容正常吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    //调用下架的接口
                    this.underdeleteageId(record)
                },
            });
		}
		if(item === '1'){
            //查看详情
            console.log('点击了详情', item, record);
            console.log('contentId',record.content_id)
            this.router.push({ path: '/systemManagement/feedbackResult', query: { contentId: record.content_id } })
            // this.state.selectedRowKeys.push(record.content_id)
            // console.log('233', record);
            // console.log('der', record.content_id);
            // console.log('点击了详情', record.content_id);
            // this.$router.push({ path: 'feedbackResult', query: { content_id:record.content_id } })
            // this.$router.push('/feedbackResult')
		}
	}



    //下架
    public undercarriageId(record:any) {
        //this.userTableLoading = true;
        console.log('this.state.selectedRowKeys',this.state.selectedRowKeys)
        let params:any = {
            //operateType:record.feedback_status,   //操作类型
            //contentIds:this.content_id,  // 内容id
            operateType:'6',
            contentIds:[]
		}
        console.log(this.state.selectedRowKeys,'this.state.selectedRowKeys')
        this.state.selectedRowKeys.forEach((res:any) => {
			params.contentIds.push(res)
		})
        console.log('1',params.contentIds)
        console.log('2',params.operateType)
        // let list= this.state.selectedRowKeys
        // console.log('122',list)
        // console.log('121',params.id)
        // console.log('121',list)
        systemManagementApi.upStatus(params,{}).then((_res) => {
            this.showModal = true;
            message.success('操作成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            //console.log('211',this.item.label)
            this.userTableLoading = true;
            this.getList();
        });
    }

    //正常
    public underdeleteageId(record:any) {
        //this.userTableLoading = true;
        console.log('this.state.selectedRowKeys',this.state.selectedRowKeys)
        let params:any = {
            //operateType:'1',   //操作类型
            //contentIds:this.content_id,  // 内容id
            operateType:'1',
            contentIds:[]
		}
        console.log(this.state.selectedRowKeys,'this.state.selectedRowKeys')
        this.state.selectedRowKeys.forEach((res:any) => {
			params.contentIds.push(res)
		})
        console.log('3',params.contentIds)
        console.log('4',params.operateType)
        // let list= this.state.selectedRowKeys
        // console.log('122',list)
        // console.log('121',params.id)
        // console.log('121',list)
        systemManagementApi.upStatus(params,{}).then((_res) => {
            this.showModal = true;
            message.success('操作成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            //console.log('2222',this.item.label)
            this.userTableLoading = true;
            this.getList();
        });
    }

    //查看详情
    // public viewDetails(){
    //     this.$router.push('/feedbackResult')
    // }

    // //预览
    // public preview(){
    //     this.$router.push('/feedbackResult')
    // }

    //针对按“处理结果”状态展示对应按钮，如：“待处理：预览、上架、下架；上架/下架：查看详情”。
    // if (item.contentStatusName === '待审核') {
    //       item.menuTableList = [
    //         { title: '审核', index: 0, disabled: false },
    //         { title: '详情', index: 1, disabled: false },
    //         { title: '上架', index: 2, disabled: true },
    //         { title: '下架', index: 3, disabled: true },
    //         { title: '删除', index: 4, disabled: false },
    //       ]
    //     } else if (item.contentStatusName === '退回修改') {
        
    
}

</script>

<style lang="less" scoped>

// ::v-deep .ant-table-thead > tr > th {
//     background: #E1EBF9 100%;
//     color: #000;
// }
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
    text-align: left;
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
}
.normal{
    // left: 276px;
    // top: 234px;
    margin-top: 62px;
    padding-left: 13px;
    margin-left: 17px;
    width: 84px;
    height: 35px;
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
    width: 84px;
    height: 35px;
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

</style>