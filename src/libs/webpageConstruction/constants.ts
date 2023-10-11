import {
    ref,
    Ref,
  } from 'vue';
  import {
    localStorage
  } from '@/libs/Storage';
  export const valueX: Ref<number> = ref(1);
  export const valueY: Ref<number> = ref(1);
  export const valueW: Ref<number> = ref(40);
  export const valueH: Ref<number> = ref(30);
  export const myValue: Ref<string | undefined> = ref(); // 假设 myValue 可能为字符串或 undefined
  export let imageWidth = 0;
  export let imageHeight = 0;
  export const headers = {
  ['X-Auth-Token']: localStorage.get('token'),
}
export const tableColumns = [
  // 表格列配置

  {
    title: '序号',
    dataIndex: 'indexkey',
    align: 'center',
    key: 'indexkey',
    // dataIndex:'indexkey'
    // slots: {
    //   customRender: 'indexkey'
    // },

  },
  {
    title: '元素类型',
    dataIndex: 'elementType',
    align: 'center',
    key: 'elementType',
    ellipsis: true,
    // slots: {
    //   customRender: 'elementType'
    // },
  },
  {
    title: '元素内容',
    dataIndex: 'elementContent',
    align: 'center',
    key: 'elementContent',

    // slots: {
    //   customRender: 'elementContent'
    // },
    ellipsis: true,
  },
  {
    title: 'X坐标',
    dataIndex: 'hotspotXAxis',
    align: 'center',
  },
  {
    title: 'Y坐标',
    dataIndex: 'hotspotYAxis',
    align: 'center',
  },
  {
    title: '宽度',
    dataIndex: 'hotspotWidth',
    align: 'center',
  },
  {
    title: '高度',
    dataIndex: 'hotspotHigh',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    key: 'action',
    width: 100,
  },

]
export const spinning = ref<boolean>(false);
export const Verification = ref<boolean>(false);
export const mesg = ref<boolean>(true);
export const elementViewports: Ref<HTMLElement | null> = ref(null);
export const viewportborders: Ref<HTMLElement | null> = ref(null);
export const Webpage_moudle: Ref<any> = ref(null); // 替换 any 为适当的类型
export const initBuildingId: Ref<any> = ref(null); // 替换 any 为适当的类型
export const formRef: Ref<any> = ref(); // 替换 any 为适当的类型
export const formRefModel: Ref<any> = ref(); // 替换 any 为适当的类型
export const selectedElement = ref(null); // 存储当前选择的模块
export const changeElement: Ref<boolean> = ref(false);
export const changeElementNumber: Ref<number> = ref(0);
export const isDragging: Ref<boolean> = ref(false);
export const activeKey: Ref<string | undefined> = ref('1')
export const offsetX: Ref<number> = ref(0);
export const offsetY: Ref<number> = ref(0);
export const prevX: Ref<number> = ref(0);
export const prevY: Ref<number> = ref(0);
export const showUploadListData = ref<boolean>(false);
export const imageWidthS: Ref<number | undefined> = ref()
export const imageHeightS: Ref<number | undefined> = ref()
export const webpageMoudleRefs: Ref<any[]> = ref([]); // 替换 any 为适当的类型
export const moulde_div: Ref<HTMLElement | null> = ref(null);
export const newElements: Ref<any> = ref([
]);
export const editorInstance = ref<any>(null); // 引用 TinyMCE 编辑器实例
export const visible = ref<boolean>(false);
export const selectedIndex = ref(); // 默认选中第一个元素
export const userTableSelectedKeys: Ref<any[]> = ref([]); //select元素选择
export const checkFeatureValue = ref<boolean>(false); //是否显示check
export const featureValue: Ref<string | undefined> = ref('1') 
export const copyElement: Ref<any> = ref([])//复制的元素信息

export const rules: Record<string, any> = {

    resource: [{
      required: true,
      message: '请选择帖子类型',
      trigger: 'change'
    }],
    elementType: [{
      required: true,
      message: '请选择元素类型',
      trigger: 'change'
    }]
  };

  export const SEOrules: Record<string, any> = {
    titleName: [{
      required: true,
      message: '请输入页面标题',
      trigger: 'blur'
    }]
  };