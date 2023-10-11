<template>
    <div class="user-page" id="userPage">
        <!-- 新增标签 -->
        <div class="add">
            <div>
                <a-button class="newbtn" type="primary" @click="addbtn()">新增标签</a-button>
                <a-button class="deletebatch" type="dashed" @click="info">批量删除</a-button>
            </div>
            <a-modal v-model:visible="showModal" title="新增标签" @ok="handleModalOk">
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="标签名称" name="labelName" :rules="[{ required: true, message: '标签名称不能为空', trigger: 'blur' }]">
                        <a-textarea v-model:value="addFormState.labelName" showCount :maxlength="10" placeholder="请输入请输入标签名称" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
        <!-- 编辑标签 -->
        <div class="compile">
            <div>
                <a-button class="compilebtn" type="primary" @click="compilebtn()">编辑标签</a-button>
                <a-button class="deletesingle" type="dashed" @click="handleDeleteUser">删除</a-button>
            </div>
            <a-modal v-model:visible="compileModal" title="编辑标签" @ok="compileOk">
                <a-form :model="compileFormState" ref="compileForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="标签名称" name="labelName" :rules="[{ required: true, message: '标签名称不能为空', trigger: 'blur' }]">
                        <a-textarea v-model:value="compileFormState.labelName" showCount :maxlength="10" placeholder="购物达人" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>

        <!-- 删除标签 -->
        <!-- <div class="delete">
            <a-button class="deletesingle" type="dashed" @click="handleDeleteUser">删除</a-button>
        </div> -->
    </div>
</template>

<script lang="ts">
import { systemManagementApi } from '@/libs/api/index';
import { Options, Vue } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { createVNode } from 'vue';
import { FormInstance, message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { baseApi, Header, ResponseData } from '@/libs/BaseApi';
import { AxiosRequestHeaders } from 'axios';
import { global } from '@/libs/Global';

interface PaginationType {
    current: number;
    total: number;
    pageSize: number;
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showTotal: object;
}

interface AddFormType {
    labelName: string;
}
interface compileFormType {
    labelName: string;
}
@Options({
    components: {
        data: {
            // form: this.$form.createForm(this),
            // id:'',
            isok:'',//是否选中
            state:'',//标签状态  ...1-待审核，2-退回修改，3-已上架，4-已下架
            // type:'', //标签类目
        }
    },
})

export default class User extends Vue {
    [x: string]: any;
    @Ref('addForm') readonly addForm!: FormInstance;
    @Ref('compileForm') readonly compileForm!: FormInstance;
    
    public showModal: boolean = false;
    public compileModal: boolean = false;

    //分页
    public userTablePagination: PaginationType = {
        current: 1,
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total: number) => `共 ${total} 条`,//分页中显示总的数据
    };
    public userTableLoading = false;

    // 编辑的表单数据
    public compileFormState: compileFormType = {
        labelName: ''
    }

    // 新增的表单数据
    public addFormState: AddFormType = {
        labelName: ''
    }

    //创建一个对象，判断如果满足条件就赋值，否者赋空
    public getPermsBtn() {
        let per: any = {};
        if (global.userInfo) {
            per = global.userInfo.permsBtn;
        }
        this.permission = per['user'] || [];
    }

    //查询标签列表
    public async getList() {
        this.userTableLoading = true;
        const params = {
            nowPage : this.userTablePagination.current,
            row4Page : this.userTablePagination.pageSize,
        }
        const header={}
        await systemManagementApi.qrysysLabel(params,header)
            .then ( (res) => {
                this.userTableLoading = false;
                this.userTablePagination.total = (res as any).recordsTotal;
                this.userTableData = res.data;
                 
            })
            .catch ( () => {
                this.userTableLoading = false;
            })
    }

    //用户列表上一页、下一页
    public handleTableChange(pagination: PaginationType) {
        this.userTablePagination.current = pagination.current;
        this.userTablePagination.pageSize = pagination.pageSize;
        this.getList();
    }

       // 打开编辑
    public compilebtn() {
        this.compileModal = true
    }

    // 新增标签弹框确认
    public async handleModalOk() {
        this.addForm.validate().then(() => {
            Modal.confirm({
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认提交新增标签吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.addLabel()
                },
            });
        });
    }
    public addLabel(){
        // 发请求 调用新增接口
        this.userTableLoading = true;
        const params = {
            parentId: '123',
            //groupId: '1',
            ...this.addFormState
        }
        systemManagementApi.addLabel(params,{}).then((res) => {
            this.showModal = true;
            message.success('新增成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }
    
    // 编辑标签弹框确认
    public compileOk() {
        this.compileForm.validate().then(() => {
            Modal.confirm({
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认提交编辑标签吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.updateysysLabel()
                    // 发请求 调用编辑接口
                    // {}根据接口文档传的参数-一般是id之类的
                },
            });
        });
    }
    public updateysysLabel(){
        // 发请求 调用编辑接口
        this.userTableLoading = true;
        const params = {
            labelId: '1', 
            ...this.compileFormState
        }
        systemManagementApi.updateysysLabel(params,{}).then((res) => {
            this.compileModal = true;
            message.success('编辑成功');
            // compileModal-编译模式
            // 跳转到对应的页面
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            // 编辑成功后刷新table表格
            this.getList();
        });
    }

    // 批量删除用户
    public info = (row:any) => {
        if (row.state === 3) {
            message.info('请先下架所选标签后再操作删除');
            return;
        }
        if (!row.isok) {
            message.info('请先选择需删除的标签');
            return;
        }
        // message.info('请先下架所选标签后再操作删除');
        // message.info('请先选择需删除的标签');
        if ('已上架内容') {
            message.info('请先下架所选标签后再操作删除');
            return;
        } else { }
    };

    // 单个删除用户
    public handleDeleteUser = (row:any) => {
        // row这一行数据
        if (row.state === 3) {
            message.info('请先下架所选标签后再操作删除');
            return;
        }
        if (!row.isok) {
            Modal.confirm({
                // title: '',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认删除所选标签吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.batchdeleteLabel()
                },
                onCancel() {
                    message.error('删除失败');
                },
            });
            return;
        }
    };
    public batchdeleteLabel(){
        // 发请求 调用删除接口
        this.userTableLoading = true;
        const params = {
            "idList": ["237604619699445760", "111"] 
        }
        systemManagementApi.batchdeleteLabel(params,{}).then((res) => {
             
            
            if ('接口成功') {
                message.success('删除成功');
                // 删除成功之后需要刷新table
                // this.getList();
            } else {
                message.error('接口返回的报错信息')
            }
        });
    }

    //打开新增弹框   
    public addbtn() {
        // 先判断是否已选择对应的"标签类目/子类目"
        // key是写判断条件的
        // if('key'){
        //     message.info('请先选择具体标签类目/子类目名称');
        //     return;
        // }
        this.showModal = true
            this.$nextTick(() => {
        })
    }
}
</script>

<style lang="less" scoped>
.newbtn {
    left: 276px;
    top: 234px;
    width: 122px;
    height: 43px;
    border-radius: 4px;
    background-color: #177fdb;
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    // font-family: Microsoft Yahei;
}
.compilebtn {
    width: 68px;
    height: 31px;
    margin-top: 10px;
    margin-left: 18px;
    border-radius: 4px;
    background-color: #177fdb;
    color: #ffffff;
    font-size: 12px;
    text-align: center;
}
.deletebatch {
    left: 276px;
    top: 234px;
    width: 122px;
    height: 43px;
    margin-left: 145px;
    border-radius: 4px;
    background-color: #177fdb;
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    // font-family: Microsoft Yahei;
}
.deletesingle {
    // left: 1877px;
    // top: 454px;
    width: 68px;
    height: 31px;
    margin-top: 10px;
    margin-left: 18px;
    border-radius: 4px;
    background-color: #177fdb;
    color: #ffffff;
    font-size: 12px;
    text-align: center;
    // font-family: Microsoft Yahei;
}

.table{
    margin-left: 268px;
    margin-top: 180px;
    // left: 249px;
    // top: 169px;
    width: 958px;
    height: 605px;
    line-height: 20px;
    background-color: #ffffff;
    color: #000000;
    font-size: 14px;
    text-align: center;
    font-family: Microsoft Yahei;
}
.tip{
    color: #ccc;
}
</style>
