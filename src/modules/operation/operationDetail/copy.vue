<template>
    <div class="basic-box">
        <div class="title-box">
            <div class="basic-title">基础信息</div>
            <hr class="title-hr">
        </div>
        <div class="three-content">
            <a-form>
                <a-row class="row-style">
                    <a-col class="title">所属渠道：</a-col>
                    <a-col class="content">{{ data.reachDitchCode }}</a-col>
                </a-row>
                <a-row class="row-style">
                    <a-col class="title">运营位名称：</a-col>
                    <a-col class="content">{{ data.reachName }}</a-col>
                </a-row>
                <a-row class="row-style">
                    <a-col class="title">运营位封面：</a-col>
                    <a-col class="content"> <span class="long-span">长度</span>{{ data.reachPictureLong }}</a-col>
                    <a-col class="content"><span class="long-span">宽度</span>{{ data.reachPictureWide }}</a-col>
                </a-row>
            </a-form>
        </div>
        <div class="table">
            <a-table :columns="columns" 
                     :data-source="contentDetailsVoList" 
                     :pagination="false"
                      bordered>
                <template #mb="{text}">
                    <a-button >{{text}}</a-button>
                </template>
                <template #action="{record}">
                    <!-- <div>{{ record }}</div> -->
                    <a @click="showDrawer(record)">详情</a>
                    <a-drawer
                        :width="866"
                        placement="right"
                        :closable="false"
                        v-model:visible="visible"
                        :after-visible-change="afterVisibleChange"
                    >   
                        <!-- 抽屉弹出页面 start-->
                        <div class="wrapper">
                            <div class="target">
                                <a-form class="form-style">
                                    <a-row class="target-title">目标人群</a-row>
                                    <hr class="target-hr">
                                    <a-row class="label-box">
                                        <a-col class="label">人群标签:</a-col>
                                        <a-col class="label-content" v-for="item in targetList">
                                         {{ item }}
                                        </a-col>
                                    </a-row>
                                </a-form>
                            </div>
                            <div class="match">
                                <a-form>
                                    <a-row class="target-title">比对组人群</a-row>
                                    <hr class="target-hr">
                                    <a-row class="label-box">
                                        <a-col class="label">人群标签:</a-col>
                                        <a-col class="label-content" v-for="item in matchList">
                                         {{ item }}
                                        </a-col>
                                    </a-row>
                                </a-form>
                            </div>
                            <div class="match">
                                <a-form>
                                    <a-row class="target-title">内容</a-row>
                                    <hr class="target-hr">
                                    <a-row class="label-box">
                                        <a-col class="label">内容描述:</a-col>
                                        <a-col class="zixun-content">{{record.contentDetails}}</a-col>
                                    </a-row>
                                </a-form>
                            </div>
                            <div class="drawerList-box">
                                <a-table
                                :columns="drawer" 
                                :data-source="drawerData" 
                                :pagination="pagination"
                                >
                                    <template #content="{text}">
                                        <img :src="text.verticalCoverFile || text.horizontalCoverFile"
                                             style="width:50px;height:50px">
                                        <div class="title-name">{{text.titleName}}</div>
                                        <div>{{ text.contentId }}</div>
                                    </template>
                                    <template #contentInfo>
                                        <a class="blue">详情</a>
                                        <!-- 抽屉弹出页面end -->
                                    </template>
                                </a-table>
                            </div>   
                        </div>
                    </a-drawer>
                </template>
            </a-table>
        </div>
    </div>
    <div class="basic-box">
        <div class="title-box">
            <div class="basic-title">配置规则</div>
            <hr class="title-hr">
        </div>
        <div v-if="rulesType === 1 || 2 || 3" class="dasan-title">多样性规则:
            <hr class="dasan-hr">
            <div v-for="(item,index) in rulesVoList" class="dasan-rulebox">
                <!-- <div class="dasan-title">多样性规则:</div> -->
                <div v-if="item.rulesType === 1 || 2 || 3">
                    <div class="ticai-title">{{item.rulesType}}{{ index + 1 }}</div>
                    <div class="background-box">
                        <div class="dasan-rule">
                            每<span class="numb">{{ item.each }}</span>篇内容中，
                            包含<span class="numb">{{ item.includeTopic }}</span>最少展示<span class="numb">{{ item.eachMin }}</span>篇，
                            最多展示<span class="numb">{{ item.eachMax  }}</span>篇
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="rulesType === 4" class="dasan-rulebox">内容置顶规则:
            <div v-for="(item,index) in rulesVoList">
                <div v-if="item.rulesType === 4">
                    <div class="dasan-title">{{item.rulesType}}{{ index + 1 }}</div>
                    <div class="background-box">
                        <div class="dasan-rule">
                            标题:<span class="numb">{{ item.includeTopic }}</span>
                            失效时间:<span class="numb">{{ item.expirationTime }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-for="(item,index) in rulesVoList"  class="dasan-rulebox">
            <div v-if="item.rulesType === 0">
                <div class="dasan-title">打散规则:</div>
                <hr class="dasan-hr">
                <div class="background-box">
                <div class="dasan-rule">连续<span class="numb">{{ item.each }}</span>篇内容中，不出现重复的作者</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { operaTionApi } from '@/libs/api'
import { ColumnProps } from 'ant-design-vue/es/table';
import { AxiosRequestHeaders } from 'axios';
type Key = ColumnProps['key'];
interface DataType {
    key: Key;
    mubiaorenqun: any;
    biduizurenqun: string;
    contentDetails: string;
};
// interface neirongType{
//             img:string,
//             name:string,
//             id:string   
// };
interface DrawerType{
    key: Key;
    topicId:string;
    neirong:any;
    biaoqian:string;
    neirongfenlei:string;
    caozuoren:string;
    shangjiashijian:string;
    caozuo:string;
};

@Options({
    components: {
    }
})
export default class operationDetail extends Vue{

    created(){
        this.getData();
    }
    public exchangeCode(Code:any){
        if(Code==='1'){
            return "百度小程序"
        }else if(Code==='2'){
            return "微信小程序"
        }else if(Code==='3'){
            return "微信公众号"
        }else if(Code==='4'){
            return "抖音"
        }else if(Code==='5'){
            return "快手"
        }else if(Code==='6'){
            return "APP"
        } else{
			return Code
		}    
    };
    public exchangeRulesType(type:any){
        if(type==='1'){
            return "内容标签规则"
        }else if(type==='2'){
            return "内容作者规则"
        }else if(type==='3'){
            return "内容体裁规则"
        }else if(type==='4'){
            return "内容置顶规则"
        }else{
            return type
        }
    };
    
    public contentDetailsId:any=''
    public rulesType:any=''
    public rulesVoList:any = []
    public data:any = {};
//数据交互
    public getData(){
        let inParam = {
            reachId:'bxzaTJMM',
        };
        operaTionApi.getInfo(inParam,{}).then((res)=>{
             
            this.data = res.defmap;
           
            this.contentDetailsVoList = this.data.contentDetailsVoList;
            this.rulesVoList = this.data.rulesVoList;
             
            if(this.data.reachDitchCode){
            this.data.reachDitchCode = this.exchangeCode(this.data.reachDitchCode);
// 取数组里的某个值
            this.rulesVoList.forEach((item:any) => {
                if(item.rulesType === 1 || 2 || 3 || 4){
                    item.rulesType = this.exchangeRulesType(item.rulesType);
                }
            });

            this.rulesVoList.forEach((i:any) => {
                this.rulesType = i.rulesType
            });    
        };
        });//operationapi  end
    }//getdata end
    public visible: boolean = false;
    public afterVisibleChange = (bool: boolean) => {
         
    };
    public showDrawer = (record: any) => {
         
        this.visible = true;
        let param = {
            contentDetailsId: record.contentDetailsId,
        }
        const header:any = {
            request: (header: AxiosRequestHeaders) => {
            header.nowPage = '1';
            header.row4Page = '4';
      }
        }
        operaTionApi.getReachContent(param,header).then((res)=>{
            // this.drawerData = res.data;
             
            res.data.forEach((item:any)=>{
                // this.drawerData.push(item)
                this.drawerData.push({...item,neirong:{verticalCoverFile:item.verticalCoverFile,horizontalCoverFile:item.horizontalCoverFile,titleName:item.titleName,contentId:item.contentId}})
            })
             
        })
       
        
    };


    public columns:any[] = [
    {
        title: '目标人群',
        dataIndex: 'mubiaorenqun',
        align: 'center',
        slots: { customRender: 'mb' },
    },
    {
        title: '比对组人群',
        dataIndex: 'biduizurenqun',
        align: 'center',
    },
    {
        title: '内容描述',
        dataIndex: 'contentDetails',
        align: 'center',
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        slots: { customRender: 'action' },
    },
    ];
    public drawer:any[] = [
    {
        title: '栏目分类',
        dataIndex: 'topicName',
        align: 'center', 
    },
    {
        title: '内容',
        dataIndex: 'neirong',
        align: 'center',  
        slots: { customRender: 'content' },
    },
    {
        title: '标签',
        dataIndex: 'labelNames',
        align: 'center',    
    },
    {
        title: '内容分类',
        dataIndex: 'contentTypeName',
        align: 'center',  
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        align: 'center',  
    },
    {
        title: '上架时间',
        dataIndex: 'publishTime',
        align: 'center',  
    },
    {
        title: '操作',
        dataIndex: 'caozuo',
        align: 'center', 
        slots: { customRender: 'contentInfo' }, 
    }
    ];
    
    public contentDetailsVoList: DataType[] = [
    {
        key: 1,
        mubiaorenqun: '123',
        biduizurenqun: 'weer',
        contentDetails  : '',
      
    },
    ];
    
    public drawerData:any[] = [
    // { 
    //     key: 1,
    //     topicName:'人保头条',
    //     neirong:
    //         {
    //             verticalCoverFile:'https://uploadfile.bizhizu.cn/up/df/a6/33/dfa63332188a07b6d7f0ca562761b52d.jpg.source.jpg',
    //             horizontalCoverFile:'',
    //             titleName:'神兽回笼别光顾着高兴！这些“危机地带要当',
    //             contentId:'ID:22020419897890' 
    //         }
    //     ,
    //     labelIds:'儿童、安全',
    //     contentTypeName:'竖版视频',
    //     operator:'二毛',
    //     publishTime:'2023-03-24 18:12:30',
    //     caozuo:'详情',
    // },
    // { 
    //     key: 2,
    //     topicId:'人保头条',
    //     neirong:
    //         {
    //             img:'https://c-ssl.dtstatic.com/uploads/blog/202101/11/20210111220519_7da89.thumb.1000_0.jpeg',
    //             name:'神兽回笼别光顾着高兴！这些“危机地带要当',
    //             id:'ID:22020419897890' 
    //         }
    //     ,
    //     biaoqian:'儿童、安全',
    //     neirongfenlei:'竖版视频',
    //     caozuoren:'二毛',
    //     shangjiashijian:'2023-03-24 18:12:30',
    //     caozuo:'详情',
    // },
    // { 
    //     key: 3,
    //     topicId:'人保头条',
    //     neirong:
    //         {
    //             img:'https://c-ssl.dtstatic.com/uploads/blog/202101/11/20210111220519_7da89.thumb.1000_0.jpeg',
    //             name:'神兽回笼别光顾着高兴！这些“危机地带要当',
    //             id:'ID:22020419897890' 
    //         }
    //     ,
    //     biaoqian:'儿童、安全',
    //     neirongfenlei:'竖版视频',
    //     caozuoren:'二毛',
    //     shangjiashijian:'2023-03-24 18:12:30',
    //     caozuo:'详情',
    // },
    // { 
    //     key: 4,
    //     topicId:'人保头条',
    //     neirong:
    //         {
    //             img:'https://c-ssl.dtstatic.com/uploads/blog/202101/11/20210111220519_7da89.thumb.1000_0.jpeg',
    //             name:'神兽回笼别光顾着高兴！这些“危机地带要当',
    //             id:'ID:22020419897890' 
    //         }
    //     ,
    //     biaoqian:'儿童、安全',
    //     neirongfenlei:'竖版视频',
    //     caozuoren:'二毛',
    //     shangjiashijian:'2023-03-24 18:12:30',
    //     caozuo:'详情',
    // },
    ];
    public targetList:string[] = [
    '妈妈群',
    '购物达人'
    ];
    
    public matchList:string[] = [
    '职场精英'
    ];
    public pagination = {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 5, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        // showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`, // 显示总条数
        pageSizeOptions: ['5', '10', '15', '20'],
    }
 
}
</script>


<style lang="less" scoped>
.basic-box {
    margin-left: 34px;
    margin-top: 21px;
}

.title-box {
    width: 64px;
}

.basic-title {
    width: 64px;
    height: 22px;
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
}

.title-hr {
    width: 64px;
    height: 2px;
    background: #E8380D;
}

.row-style {
    margin-top: 25px;
}

.title {
    width: 85px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
}

.content {
    margin-left: 51px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
}

.dasan-rulebox {
    margin-top: 41px;
    width: 1116px;
}

.dasan-hr {
    width: 1116px;
    height: 1px;
    background: #D8D8D8;
    border-radius: 4px;
}

.dasan-title {
    margin-top: 30px;
    width: 84px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
}

.background-box {
    margin-top: 20px;
    width: 1116px;
    height: 50px;
    background: #F7F7F7;
    border-radius: 4px;
}

.dasan-rule {
    margin-left: 15px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 50px;

    .numb {
        margin: auto 5px;
        width: 15px;
        height: 20px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #E8380D;
        line-height: 20px;
    }

}

.ticai-title {
    margin-top: 31px;
    width: 100px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 550;
    color: #333333;
    line-height: 20px;
}
.table{
    margin-top: 42px;
}
.mb{
   
    height: 32px;
    background: #EDEFF9;
    border-radius: 16px;
    opacity: 0.08;
    color: #2443BC;
}
.label{
    margin-right: 30px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 32px;
}
.label-content{
  
    margin-right: 10px;
    min-width: 76px;
    background:#EDEFF9;
    border-radius: 16px;
    height: 32px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #2443BC;
    line-height: 32px;
    text-align: center;
}
.label-box{
    margin-top: 24px;
}
.target-title{
    
    height: 22px;
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
}
.target-hr{
    margin-top: 10px;
    width: 866px;
    // height: 1px;
    background: #EFEFEF;
}
.match{
    margin-top: 15px;
}
.zixun-content{
  
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 32px;
}
.form-style{
    width: 866px;
}
.drawerList-box{
    margin-top: 25px;
}
.blue{
   
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #2443BC;
    line-height: 20px;
}
.title-name{
    height: 40px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
}
.long-span{
    margin-right: 10px;
}
</style>