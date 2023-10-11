<template>
    <div class="user-page" id="userPage">
        <!-- 上传素材 -->
        <div>
            <div>
                <h2 style="display: inline-block;">上传素材</h2> 
                <a-button style="background: #4c7bff; color: #fff; margin: 20px 0; margin-left: 16px" @click="addbtn()">
                    <upload-outlined></upload-outlined>
                    +新增
                </a-button>
                <!-- <a-button class="add" type="primary" @click="addbtn()" danger>+上传素材</a-button> -->
                <a-divider style="height: 2px; background-color: #cecece 100%; margin-top: 5px" />
            </div>
            <!-- 新增域名弹框 -->
            <!-- <a-modal v-model:visible="showModal" :maskClosable="false" @ok="handleModalOk" @cancel="onCancel"> -->
            <a-modal v-model:visible="showModal" @ok="handleModalOk" @cancel="onCancel" okText="暂存" :maskClosable="false">
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" @finish="onFinish">
                    <div style="display: flex">
                        <p style="font-size: 16px; margin-top: 20px; margin-left: 5px; padding-left: 5px; margin-bottom: 10px">上传素材</p>
                        <!-- <div @click="warning" class="warning">
                            <ExclamationCircleOutlined/>!
                        </div> -->
                        <a-popover>
                            <template #content>
                                <img
                                    style="width: 260px; height: 190px; display: flex; position: absolute; margin-left: -20px; margin-top: -20px"
                                    src="./uploadTag/icon／背景.png"
                                    alt=""
                                />
                                <div style="color: #ffffff; position: relative; font-size: 8px">
                                    <span>上传素材要求说明：</span>
                                    <p>1.素材类型：图片、视频</p>
                                    <p>&nbsp&nbsp&nbsp&nbsp(1).图片：GIF、JPG、JPEG、PNG格式,</p>
                                    <p>若大小在2MB~10MB,上传后将被压缩。</p>
                                    <p>&nbsp&nbsp&nbsp&nbsp(2).视频：MP4格式。</p>
                                    <p>2.授权证书：PDF格式，大小10MB以内。</p>
                                </div>
                            </template>
                            <!-- <template #title>
                                <span>上传素材要求说明：</span>
                            </template> -->
                            <img src="./uploadTag/icon／审核.png" alt="" style="width: 16px; height: 16px; margin-top: 26px; margin-left: 10px" />
                        </a-popover>
                    </div>
                    <!-- <a-form-item style="margin-left: 100px;">
                        <p style="margin-left: -70px;color: #E7390D 100%;">素材栏目：</p>
                        <a-input style="margin-top: -40px;width: 85px;display: block;" v-model:value="addFormState.materialSource" placeholder="请输入"/>
                    </a-form-item> -->
                    <a-form-item label="上传素材" name="materialFilePath" :rules="[{ required: true, message: '上传素材不能为空', trigger: 'blur' }]">
                        <a-upload
                            name="file"
                            :file-list="addFormState.fileList"
                            action="/dop/iug/zuul/content/file/s/upload.do"
                            v-model:value="addFormState.materialFilePath"
                            :before-upload="beforeUpload"
                            :maxCount="1"   
                            :headers="headers"
                            @change="upChange"
                        >
                            <a-button>
                                <upload-outlined></upload-outlined>
                                上传素材
                            </a-button>
                        </a-upload>
                    </a-form-item>
                    <a-form-item label="授权证书" name="certificateNames">
                        <a-upload
                             v-model:file-list="fileList2"
                            action="/dop/iug/zuul/content/file/s/upload.do"
                            :headers="headers"
                            :show-upload-list="{  showRemoveIcon: true }"
                            :before-upload="beforeUpload2"
                            @remove="handleRemove"
                            @change="upChange2"
                            accept=".pdf"
                        >
                            <a-button>
                                <upload-outlined></upload-outlined>
                                上传证书
                            </a-button>
                        </a-upload>
                    </a-form-item>
                </a-form>
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <!-- <a-form-item label="素材名称">
                        <a-input v-model:value="addFormState.materialName" placeholder="请输入素材名称" />
                    </a-form-item> -->
                    <a-form-item label="素材来源">
                        <a-input v-model:value="addFormState.materialSource" placeholder="请输入素材的来源，如：摄图网" />
                    </a-form-item>
                    <a-form-item label="素材标签" name="labelIds">
                        <a-cascader 
                            mode="tags" 
                            multiple
                            v-model:value="addFormState.labelIds" 
                            placeholder="请选择素材标签" 
                            :show-search="{ filter }"
                            :field-names="{label:'labelName',value:'labelId',children:'children'}" 
                            :options="materialIdList"
                            @change="changeRegionType($event)"
                        />
                    </a-form-item>
                    <a-form-item label="素材到期日" name="materialMaturityDate" :rules="[{ required: true, message: '素材到期日不能为空', trigger: 'blur' }]">
                        <a-date-picker 
                            v-model:value="addFormState.materialMaturityDate" 
                            :disabled-date="disabledDate" 
                            show-time format="YYYY-MM-DD HH:mm:ss" 
                            value-format="YYYY-MM-DD HH:mm:ss" />
                    </a-form-item>
                    <!-- <a-form-item label="开启共享" name="isShare">
                        <a-radio-group v-model:value="addFormState.isShare">
                            <a-radio :value="'0'" name="type">是</a-radio>
                            <a-radio :value="'1'" name="type">否</a-radio>
                        </a-radio-group>
                    </a-form-item> -->
                    <!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }" style="text-align:center;">
                        <a-button style="margin-left: 10px" @click="resetFields">取消</a-button>
                        <a-button type="primary" @click.prevent="onSubmit" style="margin-left: 70px;">确认</a-button>
                    </a-form-item> -->
                </a-form>
            </a-modal>
        </div>
        <!-- 标签选择抽屉 -->
        <a-modal 
            style="height: 200px;width: 500px;"
            v-model:visible="previewVisible" 
            title="" 
            :footer="null"
           >
            <a-spin :spinning="picSpinning"/>
            <img v-if="materialFileType !== 'mp4'" style="width: 100%" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + path" />
            <video v-else :controls = "true" preload="auto"  style="width: 100%;height: 20%;" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/' + path"></video>
        </a-modal>
        <!-- 素材table -->
        <div class="contents">
            <!-- :dataSource="userTableData" -->
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
                <template #bodyCell="{ record, column }">
                    <template v-if="column.dataIndex == 'certificateName'" slot="actions" slot-scope="text">
                        <div v-if="record.certificateName">
                                <a
                                v-for="(name, index) in record.certificateName.split(',')"
                                :key="index"
                                style="color: #3f64f5;"
                                v-on:click="openPdf(name.trim())"
                                >
                                {{ name.trim() }}
                                </a>
                            </div>

                        <!-- <a style="color: #3f64f5;"  v-on:click="openPdf(record)"> {{ record.certificateName }}</a> -->
                    </template>
                    <template v-if="column.key === 'operation'" >
                        <a  
                            style="color: #3f64f5;margin-right: 10px;
                                    width: 28px;
                                    height: 20px;
                                    font-size: 14px;" 
                            @click="compilebtn(record)">
                            编辑
                        </a>
                        <a v-on:click="handlePreview(record)" 
                            style="color: #3f64f5;margin-right: 10px;
                                    width: 28px;
                                    height: 20px;
                                    font-size: 14px;"> 
                            预览
                        </a>
                        <a  @click="handleDeleteUser(record)" 
                        style="color: #e8380d;margin-right: 10px;
                                    width: 28px;
                                    height: 20px;
                                    font-size: 14px; ">
                            删除
                        </a>
                       
                        <!-- <a-button type="link" v-if="item.certificate_name !== ''" @click="previewCertificate(item)" style="font-size:12px;">预览授权证书</a-button> -->
                        
                    </template>
                </template>
            </a-table>
        </div>
        <!-- 底部按钮 -->
        <div class="but" style="background-color: #efefef 100%">
            <a-button class="cancel" @click="getBacksd">取消</a-button>
            <a-button class="affirm" @click="getSubmit">提交</a-button>
        </div>
    </div>
</template>

<script lang="ts">
import { systemManagementApi } from '@/libs/api/index';
import { AxiosRequestHeaders } from 'axios';

import Encrypts from '@/libs/Encrypts';
import { Options, Vue } from 'vue-class-component';
import { Ref,Watch,Prop } from 'vue-property-decorator';

import { createVNode, computed, reactive, h } from 'vue';

import { FormInstance, Empty, message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, CloseOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { global } from '@/libs/Global';
import store from '@/modules/conTent/store';
import { ColumnProps } from 'ant-design-vue/es/table';

import {localStorage} from '@/libs/Storage';
import axios from 'axios';

import dayjs, { Dayjs } from 'dayjs';


type Key = ColumnProps['key'];

//表格
interface UserTableType {
    rn: string;
    materialName: string; //素材名称
    certificateName: string;
    materialSource: string;
    labelName: string;
    materialMaturityDate: string;
    isShare: string;
    material_ids: string;
}
interface Option {
    label: string;
    value: string;
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
//表单
interface AddFormType {
    materialName: string;
    materialFilePath: string;
    certificateNames: any;
    materialSource: string;
    labelIds: any;
    materialMaturityDate: string;
    isShare: string;
    materialId: string;
    fileList:any,
    updategMaterialId:string,
}

//下拉框
interface ditchListType {
    id: any;
    name: any;
    children: any;
}

// interface ditchListType {
//     label: string,
//     value: string,
//     id: string
// }
@Options({
    components: {
        // ExclamationCircleOutlined,
        // CloseOutlined,
        // SearchOutlined,
        // DeleteOutlined,
        // PlusOutlined,
        // ReloadOutlined,
        data: {
            isShow: true,
        },
    },
})
export default class User extends Vue {
    [x: string]: any;
    @Ref('addForm') readonly addForm!: FormInstance;
    public showModal = false;
    public permission: any = [];
    public userTableData = [] as any[];
    // public isVisible:boolean = false;

    @Prop(Boolean) isVisible!: boolean
    @Watch('isVisible')
    onIsVisibleChanged(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      this.getPermsBtn();
      this.getList();
      this.secsitiveTypeList();
    }
  }
    //public makeTags : any = [];

    // public data: any = [] = [
    //     //填写具体多少数据
    //     '1',
    //     '2',
    //     '3',
    //     '4',
    // ];
    // data :function(){
    //     return {
    //         rules: {
    //             company: [{ required: isShow, message: '请选单位', trigger: 'blur' },
    //         }
    //     }
    // }

    public headers:any = {
        ['X-Auth-Token'] : localStorage.get('token')
      }


    public disabledDate = (current: Dayjs) => {
      // Can not select days before today and today
    //   return current && current < dayjs().endOf(1,'day');
      return current && current <dayjs().subtract(1, 'days');
    };




    //表格内容
    public userTableColumns = [
        {
            title: '序号',
            dataIndex: 'rn',
            align: 'center',
            width:60,
        },
        {
            title: '素材名称',
            dataIndex: 'materialName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '授权证书',
            dataIndex: 'certificateName',
            align: 'center',
            scopedSlots: { customRender: 'actions'},
            width:260,
            //width: '27%',
            //ellipsis: true,
            //width: 260,
            //scopedSlots: { customRender: 'certificateName' },
        },
        {
            title: '素材来源',
            dataIndex: 'materialSource',
            align: 'center',
            width:100,
        },
        {
            title: '素材标签',
            dataIndex: 'labelName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '授权到期日',
            dataIndex: 'materialMaturityDate',
            align: 'center',
            ellipsis: true,
        },
        // {
        //     title: '开启共享',
        //     dataIndex: 'isShare',
        //     align: 'center',
        //     width:80,
        // },
        {
            title: '操作',
            dataIndex: '操作',
            align: 'center',
            key: 'operation',
        },
    ];

    public userTableLoading = false;

    //表单内容
    public created() {
        this.getPermsBtn(); // 权限
        this.getList();
        this.secsitiveTypeList();
    }

    //创建一个对象，判断如果满足条件就赋值，否者赋空
    public getPermsBtn() {
        let per: any = {};
        if (global.userInfo) {
            per = global.userInfo.permsBtn;
        }
        this.permission = per['user'] || [];
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

    public handleRemove(file:any) {
      // 在这里处理文件删除逻辑
      this.materialNamess = this.materialNamess.filter((name: string) => name !== file.name);
      console.log(this.materialNamess)
    //   this.materialNamess.push(item.response.defmap.data)

      // 如果你想阻止文件被删除，你可以返回一个Promise并在其中reject它
      // return new Promise((resolve, reject) => {
      //   reject(); // 这会阻止文件删除
      // });
    }

    //素材上传
    public beforeUpload = (file: any) => {
		 
        const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'video/mp4';
        let isCheck = true
        if (!isJpgOrPng) {
            isCheck = false
            message.error('请上传jpg,jpeg,png,gif格式');
        }

        // const isLt10M = file.size / 1024 / 1024 <= 10;
        // const isLt200M = file.size / 1024 / 1024 <= 200;

        if(file.type === 'video/mp4'){
            const isLt200M = file.size / 1024 / 1024 <= 200;
            if (!isLt200M) {
                message.error('上传失败，格式/大小不满足要求，请核实!');
            }
            return isCheck && isLt200M;
        }else{
            const isLt10M = file.size / 1024 / 1024 <= 10;
            if (!isLt10M) {
                message.error('上传失败，格式/大小不满足要求，请核实!');
            }
            return isCheck && isLt10M;
        }
        // return isCheck && isLt10M && isLt200M;
    };


    //证书上传
    public beforeUpload2 = (file: any) => {
		 
        const isJpgOrPng = file.type === 'application/pdf';
        let isCheck = true
        if (!isJpgOrPng) {
            isCheck = false
            message.error('请上传pdf格式');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传失败，格式/大小不满足要求，请核实!');
        }
        return isCheck && isLt10M;
    };


    public materialId  = '';

    //查询素材列表
    public async getList() {
        //this.userTableLoading = true;
        // const params = {
        //     row4Page: this.userTablePagination.pageSize,
        //     nowPage: this.userTablePagination.current,
        // };
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.userTablePagination.current;
                header.row4Page = this.userTablePagination.pageSize;
            }
        }
        systemManagementApi.queryUploadMaterialList({}, header).then((res) => {
             
            // res.data.forEach((item:any) =>{
            //     //item.materialId
            // })
            // 
            this.userTableLoading = false;
            this.userTablePagination.total = (res as any).recordsTotal;
            //this.userTableData = res.data || [];
            this.userTableData = res.data;
             
            this.userTableData.forEach((item: any) => {
                this.materialId = item.materialId;
                if (item.isShare === '0') {
                    item.isShare = '共享';
                } else if (item.isShare === '1') {
                    item.isShare = '不共享';
                }
                 
            });
        });
    }

    public state = reactive<{
        selectedRowKeys: Key[];
        loading: boolean;
    }>({
        selectedRowKeys: [], 
        loading: false,
    });
    public hasSelected = computed(() => this.state.selectedRowKeys.length > 0);

    public onSelectChange = (selectedRowKeys: Key[], record: any) => {
         
        this.state.selectedRowKeys = selectedRowKeys;
         
    };

    public materialNames  = '';
    //let materialName = ''

    public onSuccess(response: any) {
         
         
         
        this.materialNames = response.defmap.data
         
    }

    public openPdf (record:any) {
        window.open(`/dop/iug/pdfjs/web/viewer.html?file=${window.location.origin}/dop/iug/zuul/content/file/downloadImageOrVideo/s/${record}`,'_blank');
    }
    public materialNamess :any = [];
    //let materialName = ''
    
    public onSuccess2(response: any) {
         
         
         
         
        this.materialNamess = []
        this.materialNamess.push(response.defmap.data)
        //this.materialNamess = response.defmap.data
        // this.addFormState.certificateNames.forEach((res:any) => {
        //      
		// 	this.materialNamess.push(response.defmap.data)
		// })
         
    }

    public fileList :any = ''
    public fileList2 :any = []

    public upChange ( obj:any ){
         
        this.addFormState.fileList = obj.fileList;
        this.addFormState.materialName = obj.file.name
        if(obj.file.status === 'done'){
            this.materialNames = obj.file.response.defmap.data
        }
    }
    public upChange2 ( obj:any ){
         
        this.fileList2 = obj.fileList;
        //this.addFormState.materialName = obj.file.name
         
        //this.fileList2 = obj.fileList;
        if(obj.file.status === 'done'){
            this.materialNamess = []
            this.fileList2.forEach((item:any)=>{
                if (item.response) {
            this.materialNamess.push(item.response.defmap.data)
                }
            })
            console.log(this.materialNamess)

        }
         
    }

    //public name : string = '';

    public materialName = '';
    //this.materialName = response.defmap.data

    //新增素材弹框确认
    public handleModalOk() {
        this.addForm.validate().then(() => {
            Modal.confirm({
                title: '提示',
                icon: createVNode(ExclamationCircleOutlined),
                content: '确认提交素材吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    // this.addFormState.labelIds = []
                    //  
                    this.addRealmNameId();
                    // this.addForm.resetFields();
                    // this.addFormState.fileList= []
                    // this.fileList2=[]
                    // this.addFormState.materialFilePath = ''
                    // this.addFormState.materialSource = ''
                    //  
                    //  
                    //  
                    //  
                    //  
                },
                onCancel() {
                    // message.error('上传失败');
                },
            });
        });
    }

    public addRealmNameId() { 
        // 发请求 调用新增接口
        // this.userTableLoading = true;
        
                let certificateNamesValue = this.materialNamess;
                 // 如果证书名称数组只包含一个空字符串，则清空数组
                    if (certificateNamesValue.length === 1 && certificateNamesValue[0] === "") {
                        certificateNamesValue = [];
                    }

                    const params = {
                        materialId: this.addFormState.materialId,
                        updategMaterialId: this.addFormState.updategMaterialId,
                        materialName: this.addFormState.materialName, // 上传素材的名称
                        materialSource: this.addFormState.materialSource, //素材来源
                        materialFilePath: this.materialNames, //上传素材
                        certificateNames: certificateNamesValue, //上传证书
                        labelIds: this.regionList,
                        materialMaturityDate: this.addFormState.materialMaturityDate, //素材到期日
                        isShare: this.addFormState.isShare || '0', //是否共享
                        status: '0'
                    };

         
         
        
        systemManagementApi.uploadMaterial(params, {}).then((res) => {
            this.showModal = false;
            message.success('添加成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList(); 
            
        });
    }

    //打开新增弹框
    public addbtn() {
        this.addFormState.materialFilePath = ''; //上传素材
        this.addFormState.certificateNames = []; //上传证书
        this.addFormState.fileList = []; 
        this.fileList2 = []; 
        this.addFormState.materialName = '';
        this.addFormState.materialSource = ''; //素材来源
        this.addFormState.labelIds = [];
        this.addFormState.materialMaturityDate = ''; //素材到期日
        this.addFormState.isShare = ''; //是否共享
        this.addFormState.materialId = ''; 
        this.addFormState.updategMaterialId = ''; 
        this.showModal = true;
        // this.$nextTick(() => {
        //     //   this.addFormState.resetFields()
        // });
    }

    //新增的表单数据
    public addFormState: AddFormType = {
        fileList:[],
        materialFilePath: '',
        certificateNames: [],
        materialName: '',
        materialSource: '',
        labelIds: [],
        materialMaturityDate: '',
        isShare: '',
        materialId: '',
        updategMaterialId:''
    };

    //打开编辑
    public compilebtn(record: any) {
         
         
         
         
         
         

        this.addFormState.fileList = [
            {
                uid: '-1',
                name: record.materialName,
                status: 'done',
                url: ''
            }
        ]


        this.materialNamess = record.certificateName.split(',') 
         
        this.fileList2 = this.materialNamess.map((item:any)=>{
             return {
                    uid: item,
                    name: item,
                    status: 'done',
                    url: ''
             }
        })
         
        console.log(this.fileList2,this.materialNamess)
        // 
        const labelIds :any = []
        //let labelIds =  []
        this.addFormState.labelIds = record.labelId.split(',')
         
        // this.regionList = this.addFormState.labelIds
        //  
        this.addFormState.labelIds.forEach((item:any)=>{
            //this.labelIds.map(item)
            labelIds.push([item])
             
        })
         
        // this.addFormState.materialFilePath = record.materialFilePath;
        this.materialNames = record.materialFilePath;
        this.addFormState.certificateNames = [record.certificateName];
        this.addFormState.materialName = record.materialName;
        this.addFormState.materialId = record.materialId;
        this.addFormState.updategMaterialId = record.materialId;
        this.addFormState.materialSource = record.materialSource;
        this.addFormState.labelIds = labelIds || [];
        //this.fileList2 = materialNameis || [];
        //this.addFormState.labelIds = record.labelName || [];
        //this.editFormState.materialIdList = [];
        //this.addFormState.labelIds = this.regionList,
        // this.addFormState.labelIds = record.regionList;
        this.addFormState.materialMaturityDate = record.materialMaturityDate;
        this.addFormState.isShare = record.isShare === '共享' ? '0' : '1';
        this.showModal = true
    }

    //删除用户
    public handleDeleteUser(record: any) {
         
        this.state.selectedRowKeys.push(record.materialId);
         
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                this.deleteShortChainById();
                // 
                //发请求 调用删除接口
            },
        });
    }
    public deleteShortChainById() {
         
        // 发请求 调用批量删除接口
        // this.userTableLoading = true;
        const params: any = {
            //operateType:'6',   //操作类型
            //contentIds:this.content_id,  // 内容id
            materialIds: [],
        };
        // 
         
        this.state.selectedRowKeys.forEach((res: any) => {
            params.materialIds.push(res);
        });
         
        // 
        // 发请求 调用删除接口
        //this.userTableLoading = true;
        // const params = {
        //     //id:record.materialIds
        // }
        // 
        systemManagementApi.deleteMaterial(params, {}).then((res) => {
             
            message.success('删除成功');
            this.userTablePagination.current = 1;
            this.userTablePagination.pageSize = 10;
            this.getList();
        });
    }

    public materialIdList: any = ''

    //标签查询
    public secsitiveTypeList(){
            // systemManagementApi.getFolderLabel({}, {}).then((res) => {
                // ifPage  是否分页   0不分页  1分页
                const params = {ifPage:'0'}
                systemManagementApi.qrysysLabel(params, {}).then((res) => {
                // 
                this.materialIdList = res.data;
                // 
            });
        }
        public filter  (inputValue:any, path:any)  {
             
            return path.some((option:any) => option.labelName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        };

    public regionList:any = []

    public changeRegionType(value:any){
         
        this.regionList = []
        this.addFormState.labelIds.forEach((res:any) => {
			this.regionList.push(res[res.length -1])
		})
         
		//formData.includeTag = regionList
	}

    public getBacksd(){
        this.userTableData = []
        this.$emit('cancelAdd')
        // this.$emit('getDropdown', item, this.row)

        // cancelAdd()
        // this.$router.push('./materialManagement');
    }

    path:any
    materialFileType:any
    public previewVisible=false;
    public picSpinning=true;
    public handlePreview(record: any) {
         
        this.previewVisible = true;
        this.picSpinning=true
        //this.path=[record.certificateName];
        this.materialFileType = record.materialFileType
        this.path=[record.materialFilePath];
         
        axios.get(`/dop/iug/zuul/content/file/downloadImageOrVideo/s/${this.path}`).then(res=>{
            this.previewImage = res.data;
             
            this.picSpinning= false
        }).catch(err=>{
             
        })
        // axios({
        //     url:`/dop/iug/zuul/content/file/downloadImageOrVideo/s/${this.path}`,
        //     method:'post',
        //     responseType: 'blob',
        // }).then((res:any)=>{
        //     if(res.data.size > 0){
        //     const content = res.data
        //     const blob = new Blob([content])
        //     const fileName = this.path
        //         if ('download' in document.createElement('a')) { // 非IE下载
        //         const elink = document.createElement('a')
        //         elink.download = fileName
        //         elink.style.display = 'none'
        //         elink.href = URL.createObjectURL(blob)
        //         document.body.appendChild(elink)
        //         elink.click()
        //         URL.revokeObjectURL(elink.href) // 释放URL 对象
        //         document.body.removeChild(elink)
        //         } 
        //         // else { // IE10+下载
        //         //   navigator.msSaveBlob(blob, fileName)
        //         // }
        //     }
        // })
        ///content/file/downloadImageOrVideo/s/文件名参数.do  config
        //this.$router.push('./materialManagement');
        //router.push({ path: 'materialManagement'})
    }
    //关闭预览
    public handleClosePic(){
        this.previewVisible = false;
    }

    public getSubmit(){
        systemManagementApi.uploadMaterials({},{}).then((res)=>{
            this.userTableData = []
            this.$emit('cancelAdd')

            // this.$router.push('./materialManagement');
        })
    }
    // 表单完成
    public onFinish() {
         
    }
    public onCancel() {
        this.addForm.resetFields();
        this.addFormState.fileList= []
        this.fileList2=[]
        this.addFormState.materialId =''
        this.addFormState.materialSource = ''
    }
}
</script>

<style lang="less" scoped>
.contents {
    width: 100%;
    // height: 140px;
    margin-left: 2px;
    background: #ffffff;
    //display: flex;
}
.add {
    margin: 20px 0;
    margin-left: 16px;
    background-color: #3f64f5;
}
.tip {
    color: #ccc;
}
.but {
    // position: relative;
    // bottom: 40px;
    width: 100%;
    height: 95px;
    margin: auto;
    // background: #efefef 100%;
    margin-top: 40px;
    padding-top: 20px;
    padding-bottom: 30px;
    text-align: center;
}
.cancel {
    width: 84px;
    height: 32px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
    text-align: center;
    font-family: Microsoft Yahei;
    border: 1px solid #bbbbbb;
}
.affirm {
    width: 84px;
    height: 32px;
    margin-left: 100px;
    background-color: #e8380d;
    border-color: #e8380d;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    font-family: Microsoft Yahei;
}

// element.style {
//     table-layout:initial;
// }
</style>
