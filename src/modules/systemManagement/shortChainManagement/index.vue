<template>
    <div class="user-page" id="userPage">
        <!-- 短链管理 -->
        <!-- 表单form -->
        <div class="form">
            <div class="choose-select">
                <a-row>
                    <a-col :span="5" class="row">
                        <span>短链名称：</span>
                        <a-input style="width:60%;border-radius: 4px;" v-model:value="shortChainName" placeholder="请输入" />
                    </a-col>
                    <a-col :span="5" class="row">
                        <span>原始链接：</span>
                        <a-input style="width:60%;border-radius: 4px;" v-model:value="originalLink" placeholder="请输入" />
                    </a-col>
                    <a-col :span="9" class="row">
                        <span>创建时间：</span>
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
                    <a-col class="row">
                        <div class="box">
                            <a-button class="inquire" @click="getList">查询</a-button>
                            <a-button class="reset" @click="cancleBtn"  style="margin-left: 10px">重置</a-button>
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>

        <!-- 创建button -->
        <div class="add">
            <div>
                <a-button class="newbtn" @click="createshort()">创建短链</a-button>
            </div>
            <a-modal v-model:visible="showModal" title="创建短链" @ok="shortModalOk">
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="短链名称" name="shortChainName" :rules="[{ required: true, message: '短链名称不能为空', trigger: 'blur' }]">
                        <a-textarea v-model:value="addFormState.shortChainName" showCount :maxlength="20" placeholder="请输入短链名称" />
                    </a-form-item>
                    <a-form-item label="原始链接" name="originalLink" :rules="[{ required: true, message: '原始链接不能为空', trigger: 'blur' }]">
                        <a-textarea v-model:value="addFormState.originalLink" showCount :maxlength="500" placeholder="请输入http:// 或https:// 开头的网址" />
                        <div class="tip">请确保原链接安全合法可跳转。</div>
                    </a-form-item>
                </a-form>
                <!-- <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="原始链接" name="originalLink" :rules="[{ required: true, message: '原始链接不能为空', trigger: 'blur' }]">
                        <a-textarea v-model:value="addFormState.originalLink" showCount :maxlength="500" placeholder="请输入http:// 或https:// 开头的网址" />
                        <div class="tip">请确保原链接安全合法可跳转。</div>
                    </a-form-item>
                </a-form> -->
            </a-modal>
        </div>
        <!-- 表格table -->
        <a-table
            class="table"
            :dataSource="userTableData"
            :columns="userTableColumns"
            :pagination="userTablePagination"
            :loading="userTableLoading"
            @change="handleTableChange($event)"
            :row-key="(record:any) => record.rn"
            :locale="locale"
            bordered
        >
            <template #bodyCell="{ record, column}">
                <template v-if="column.key === 'operation'">
                    <a-button 
                        type="success" 
                        size="small" 
                        @click="onCopy(record.short_link)" 
                        style="color: #2443BC;"
                    >
                        复制短链
                    </a-button>
                    <!-- <a-typography-paragraph :copyable="{ text: record.short_link }">
                        复制短链
                    </a-typography-paragraph> -->
                    <a-button type="link" @click="shortDeleteUser(record)" style="color: #E8380D;">删除</a-button>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts">
import { AxiosRequestHeaders } from 'axios';
import Encrypts from '@/libs/Encrypts';
import { systemManagementApi } from '@/libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode,computed } from 'vue';
import { FormInstance, message, Modal, Form } from 'ant-design-vue';
import { ExclamationCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { global } from '@/libs/Global';
import moment from 'moment';
import store from '@/modules/conTent/store';

interface UserTableType {
    short_chain_name: string;
    original_link: string;
    short_link: string;
    crtDate: string;
    short_link_id: string;
    short_link_status: string;
}

interface Option {
    label: string;
    value: string;
}

interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showQuickJumper: true,
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

interface AddFormType {
    shortChainName: string;
    originalLink: string;
}

interface ditchListType {
    label: string,
    value: string,
    id: string,
}

Options({
    components: {
        ExclamationCircleOutlined,
        CloseOutlined,
        SearchOutlined,
        DeleteOutlined,
        PlusOutlined,
        ReloadOutlined,
        data: {
            // inputVal: "", // 输入框的输入值
            // monitorData: [], // 整个表数据
            // total: 0, // 总条数，分页时有用
            original_link_id: 0 //0未配置 ，1配置了 
        }
    },
})

//const useForm = Form.useForm;

export default class User extends Vue {
    [x: string]: any;
    @Ref('addForm') readonly addForm!: FormInstance;
    public showModal: boolean = false
    public permission: any = [];
    public userTableData = [] as any[];

    //表格内容
    //table列表数据
    // public dataList:any = computed(() => {
    // 	const testList = this.states.changeOperationList
    // 	return testList.operationList
    // });
    //初始化table表头
    public userTableColumns = [
        {
            title: '短链名称',
            dataIndex: 'short_chain_name',
            align: 'center',
        },
        {
            title: '原始链接',
            dataIndex: 'original_link',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '短链接',
            dataIndex: 'short_link',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '创建时间',
            dataIndex: 'crtDate',
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
        this.getPermsBtn(); // 权限
        this.getList()
    }

    //创建一个对象，判断如果满足条件就赋值，否者赋空
    public getPermsBtn() {
        let per: any = {};
        if (global.userInfo) {
            per = global.userInfo.permsBtn;
        }
        this.permission = per['user'] || [];
    }

    //短链名称
    public shortChainName: string = ''
    // public name: string = ''

    //原始链接
    //public titleName: string = ''
    public originalLink: string = ''

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


    //查询短链列表
    public async getList() {
        //this.userTableLoading = true;
        let params = {
            shortChainName: this.shortChainName,
            originalLink: this.originalLink,
            startTime: this.startTime,
            endTime: this.endTime,
            // row4Page: this.userTablePagination.pageSize,
            // nowPage: this.userTablePagination.current,
        }
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            }
        }
         
        systemManagementApi.selectShortChainManagement(params,header).then((res: any) => {
             
            this.userTableLoading = false;
            this.userTablePagination.total = (res as any).recordsTotal;
            this.userTableData = res.data
        }).catch((err: any) => {
            this.userTableLoading = false;
        })
    }

    //重置按钮
    public cancleBtn() {
        this.shortChainName = '',
        this.originalLink = '',
        this.startTime = '',
        this.endTime = '',
        this.userTablePagination.current = 1,
        this.userTablePagination.pageSize = 10,
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
    //public userTableLoading = false;  // 用户表加载

    //用户列表上一页、下一页
    public handleTableChange(value: PaginationType) {
         
        this.userTablePagination.current = value.current;
        this.userTablePagination.pageSize = value.pageSize;
        this.getList();
    }

    //新增的表单数据
    public addFormState: AddFormType = {
        shortChainName: '',
        originalLink: ''
    }


    // 新增短链弹框确认
    public shortModalOk(record: any) {
         
        //判断原链接的域名是否已配置，original_link
        if ('') {
            Modal.warning({
                content: '请选配置原链接的域名后再新增短链',
            });
        }else{
            this.addForm.validate().then(() => {
                Modal.confirm({
                    icon: createVNode(ExclamationCircleOutlined),
                    content: '确认提交新增短链吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.saveShortChainId()
                        // 发请求 调用新增接口
                    },
                    onCancel: () =>{
                        this.showModal = false;
                    }
                });
            });
        }
    }


    //新增
    public saveShortChainId() {
        // 发请求 调用新增接口
        //this.userTableLoading = true;
        let params = {
            shortChainName: this.addFormState.shortChainName,
            originalLink: this.addFormState.originalLink
            // shortChainName: 'abc',
            // originalLink: '666'
        }
         
        systemManagementApi.saveShortChain(params,{}).then((res:any) => {
             
            this.showModal = false;
            message.success('新增成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    //打开新增弹框 
    public createshort() {
        this.showModal = true
        this.addFormState.shortChainName = ''
        this.addFormState.originalLink = ''
        //     this.$nextTick(() => {
        // })
    }

    // 删除
    public shortDeleteUser(record:string) {
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '确认删除所选短链吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.deleteShortChainById(record)
                //发请求 调用删除接口
            },
        });
    }
    public deleteShortChainById(record:any) {
        // 发请求 调用删除接口
        this.userTableLoading = true;
        const params = {
            id: record.short_link_id
        }
         
        systemManagementApi.deleteShortChainById(params,{}).then((res) => {
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }


    //复制链接
    //复制地址的操作
    // public copyText() {
    //     var input = document.createElement("input");   // js创建一个input输入框
    //     input.value = this.text;  // 将需要复制的文本赋值到创建的input输入框中
    //     document.body.appendChild(input);    // 将输入框暂时创建到实例里面
    //     input.select();   // 选中输入框中的内容
    //     document.execCommand("Copy");   // 执行复制操作
    //     document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
    // }

    //复制链接
    public onCopy(value:string){
        let oInput = document.createElement('input')
        oInput.value = value;
         
        message.success('复制成功');
        document.body.appendChild(oInput);
        oInput.select();   // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        //this.$message.success("复制成功");
        oInput.remove();
    }
}
</script>

<style lang="less" scoped>

// ::v-deep .ant-table-thead > tr > th {
//     background: #E1EBF9 100%;
//     color: #000;
// }
// .user-page {
//     width: 1350px;
// }
.form {
    // left: 585px;
    // top: 116px;
    margin-top: 38px;
    margin-left: 20px;
    //margin-left: 255px;
    width: 100%;
    height: 26px;
    color: rgba(16, 16, 16, 1);
    font-size: 18px;
    text-align: left;
}
.row {
    // left: 675px;
    // top: 110px;
    width: 140px;
    height: 40px;
    //border-radius: 6px 6px 6px 6px;
    color: rgb(112, 112, 112);
    font-size: 16px;
    text-align: left;
    margin-right: 10px;
}
// .but{
//     width: 195px;
//     height: 35px;
// }
.box{
    display: flex;
}
.inquire {
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
    //text-align: center;
    font-family: Microsoft Yahei;
}

.newbtn {
    //margin-left: 255px;
    margin-top: 32px;
    margin-left: 20px;
    // width: 90px;
    // height: 32px;
    border-radius: 4px;
    background: #E8380D;
    border-color: #ffffff;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    font-family: Roboto;
}
.table {
    //margin-left: 249px;
    width: 98%;
    margin-top: 22px;
    margin-left: 10px;
    //width: 980px;
    //height: 810px;
    line-height: 20px;
    background-color: #fcfcfd;
    color: #000000;
    font-size: 14px;
    text-align: center;
    font-family: Microsoft Yahei;
}
.tip {
    color: #cccccc;
}




</style>