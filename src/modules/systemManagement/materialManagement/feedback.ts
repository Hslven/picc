// ts申明

//表格
export interface UserTableType {
    content_id: string;
    title_name: string;
    content_classification: string;
    content_tag: string;
    feedback_reason: string;
    feedback_number: string;
    treament_state: string;
    feedback_time: string;
    label_ids:any;
}

//分页
export interface PaginationType {
    pageSize: any;
    total?: any;
    current?: any;
    pageSizeOptions?: string[];
    onChange?: (page: number, pageSize: number) => void;
    showTotal?: (total: number) => void;
    showSizeChanger?: boolean;
    hideOnSinglePage?: boolean;
    showQuickJumper?: boolean;
}

//操作
export interface handleListType {
    key: string,
    value: string,
    label: string,
    disabled: boolean
}

//下拉框
export interface ditchListType {
    label: string,
    value: string,
    id: string
}

export interface formData {
	region:[],//选择标签
}

export interface AddFormType {
    labelName: string;
}

//筛选
export interface FliterFormType {
    materialName: string;
    materialSource: string;
    materialFileType: string;
    isMaterialMaturity: string;
    isMaturityDate: string;
    isShare: string;
}

// 勾选
export class rowSelectionType {
    type?: string;
    fixed?: boolean;
    onChange?: Function;
    selectedRowKeys?: string[];
    getCheckboxProps?: Function;
}


// 素材列表
export class materialDataType {
    is_material_maturity?: string; //是否授权
    material_file_type?: string; //素材文件类型
    material_id?: string; //素材id
    material_source?: string; //素材来源
    rn?: number;
    material_name?: string; //素材名称
    cite_count?: string; //引用次数
    crt_date?: string;
    picUrl?: string;
    material_name_copy?: string;
    checked?: boolean;
    label_ids:any;
}

//引用次数抽屉表格
export class userTableDataType {
    topicName?: string; // 栏目分类名称
    crt_date?: string; //更新时间
    labelNameList?: any; //标签名
    contentType?: string; //内容分类
    crt_user?: string; //操作人
    material_id: any;
    material_name?: string; //素材名称
    picUrl?: string;
    material_name_copy?: string;
    checked?: boolean;
}

//下拉框
export interface ditchListType {
    labelIds: string[];
    material_id: any;
}

export interface formContentClassification {
    value: string;
    type: string;
    code: string
}
  

// mock的假数据
export const picList = [
    {
        'is_material_maturity': '是', //是否授权
        'material_file_type': 'png', //素材文件类型
        'material_id': 'a4NnkPK0', //素材id
        'material_source': '搜图网', //素材来源
        'rn': 1,
        'material_name': '夏天', //素材名称
        'cite_count': '12', //引用次数
        'crt_date': '2023-04-25 17:27:28',
        'picUrl': 'https://img1.doubanio.com/view/status/s/public/181532806-5b85e4606eab78b.jpg',
    },
    {
        'is_material_maturity': '否', //是否授权
        'material_file_type': 'jpg', //素材文件类型
        'material_id': 'p8gIii5Y', //素材id
        'material_source': '豆瓣网', //素材来源
        'rn': 2,
        'material_name': '雨后', //素材名称
        'cite_count': '35', //引用次数
        'crt_date': '2023-04-28 11:21:08',
        'picUrl': 'https://img1.doubanio.com/view/status/s/public/182100683-17c2f0cf9743c08.jpg',
    }
]

