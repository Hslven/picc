import { Moment } from 'moment';  // 确保你已经安装并引入了 'moment'

//元素接口
interface FormState {
    name: string;
    region: string | undefined;
    date1: Moment | undefined;
    elementType: string;
    delivery: boolean;
    type: string[];
    link: string;
    fileDescription?: string[];
    resource: string;
    desc: string;
  }
  //seo表单接口
  interface FormStateSEO {
    buildingId: string;
    titleName: string;
    keywordsContent: string;
    descriptionContent: string;

  }
  //图片
  interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
  }
  //元素详情

  interface ElementInfo {
    name: string;
    imgName: string;
    filePath: string;
    hotspotXAxis: number;
    hotspotYAxis: number;
    hotspotWidth: number;
    hotspotHigh: number;
    fileDescription: string;
    elementType: string;
    filePosition: string;
    elementContent: string;
  }
  //图片接口
  interface FileItem extends File {
    uid: string;
    imageWidth?: number;
    imageHeight?: number;
    elementViewportW_?: number;
    elementViewportH_?: number;
    filePath?: string;
    imgName?: string;

  }
  interface Element {
    // 定义元素的类型
    // 根据实际情况进行修改
  }