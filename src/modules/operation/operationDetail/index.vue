<template>
  <div>
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
            <a-col class="title">内容分发名称：</a-col>
            <a-col class="content">{{ data.reachName }}</a-col>
          </a-row>
          <a-row class="row-style">
            <a-col class="title">内容分发封面：</a-col>
            <a-col class="content"> <span class="long-span">长度</span>{{ data.reachPictureLong }}px</a-col>
            <a-col class="content"><span class="long-span">宽度</span>{{ data.reachPictureWide }}px</a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table">
        <a-table :columns="columns" :data-source="contentDetailsVoList" :pagination="false" bordered>
          <template #mb="{ text }">
            <a-button>{{ text }}</a-button>
          </template>
          <template #action="{ record }">
            <a-button type="link" @click="showDrawer(record)">
              详情
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <div class="basic-box" v-if="rulesVoList.length > 0">
      <div class="title-box">
        <div class="basic-title">配置规则</div>
        <hr class="title-hr">
      </div>
      <div v-if="rulesVoListLabel.length > 0 || rulesVoListTop.length > 0" class="dasan-title">多样性规则:
        <hr class="dasan-hr">
        <div v-if="rulesVoListLabel.length > 0" v-for="(item, index) in rulesVoListLabel" class="dasan-rulebox">
          <!-- <div class="dasan-title">多样性规则:</div> -->
          <div>
            <div class="ticai-title">{{ item.rulesType }}{{ index + 1 }}</div>
            <div class="background-box">
              <div class="dasan-rule">
                每<span class="numb">{{ item.each }}</span>篇内容中，
                包含<span class="numb">{{ item.includeTopic }}</span>最少展示<span class="numb">{{ item.eachMin
                }}</span>篇，
                最多展示<span class="numb">{{ item.eachMax }}</span>篇
              </div>
            </div>
          </div>
        </div>
        <div v-if="rulesVoListTop.length > 0" class="dasan-rulebox">
          <div v-for="(item, index) in rulesVoListTop">
            <div>
              <div class="ticai-title">{{ item.rulesType }}{{ index + 1 }}</div>
              <div class="background-box">
                <div class="dasan-rule">
                  标题:<span class="numb">{{ item.titleName }}</span>
                  失效时间:<span class="numb">{{ item.expirationTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="width:800px;display: flex;justify-content: end;align-items: center;padding: 20px 0px;">
          <a-button style="width: 84px;border-radius: 4px;margin-right: 10px;" @click="cancleDetail">返回</a-button>
        </div>
      </div>
      <div v-for="(item, index) in rulesVoList" class="dasan-rulebox">
        <div v-if="item.rulesType === 0">
          <div class="dasan-title">打散规则:</div>
          <hr class="dasan-hr">
          <div class="background-box">
            <div class="dasan-rule">连续<span class="numb">{{ item.each }}</span>篇内容中，不出现重复的作者</div>
          </div>
        </div>

      </div>
    </div>

    <!-- 抽屉开始 -->
    <a-drawer :width="920" placement="right" :closable="false" :destroyOnClose="true" v-model:visible="visible"
      :maskClosable="true" :after-visible-change="afterVisibleChange">
      <template #title>
        <div class="ScreeningCondition_desc_title">
          <div>
            <img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/addLeft.png" alt="">
            <span style="font-size: 16px;">内容描述:{{ contentDetails }}</span>
          </div>
          <a-button class="ScreeningCondition_title_btn" @click="cancleDetail">>></a-button>
        </div>
      </template>
      <!-- 抽屉弹出页面 start-->
      <div class="wrapper">
        <!-- <div class="target">
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
              </div> -->
        <!-- <div class="match">
                  <a-form>
                      <a-row class="target-title">内容</a-row>
                      <hr class="target-hr">
                      <a-row class="label-box">
                          <a-col class="label">内容描述:</a-col>
                          <a-col class="zixun-content">{{ contentDetails }}</a-col>
                      </a-row>
                  </a-form> -->
        <!-- </div> -->
        <div class="drawerList-box">
          <a-table :columns="drawer" :data-source="drawerData" :pagination="pagination" @change="changeProPage($event)">
            <template #content="{ text }">
              <div class="drawer-flex">
                <div class="drawer-left" v-if="text.verticalCoverFile || text.horizontalCoverFile">
                  <img
                    :src="`/dop/iug/zuul/content/file/downloadImageOrVideo/c/${text.verticalCoverFile || text.horizontalCoverFile}`">
                  <!-- <img :src="text.verticalCoverFile || text.horizontalCoverFile"
                                  style="width:50px;height:50px"> -->
                </div>

                <div v-else class="upload">待上传</div>

                <div class="drawer-right">
                  <a-tooltip>
                    <template #title>{{ text.titleName }}</template>
                    <a-button type="link" @click="contentDetail(text.contentId)">
                      {{ text.titleName.length > 15 ? text.titleName.slice(0,15) + '...' : text.titleName}}
                    </a-button>
                  </a-tooltip>
                  <!-- <div>{{ text.contentId }}</div> -->
                </div>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </a-drawer>
    <!-- 查看内容详情弹窗 -->
		<a-drawer
			v-model:visible="showContentDetail"
			class="custom-class"
			placement="right"
			width="1000"
			:closable="false"
		>
			<template #title>
				<div class="ScreeningCondition_contentDetail_title">
					<div>
						<img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/addLeft.png" alt="">
						<span style="font-size: 16px;">内容详情</span>
					</div>
					<a-button class="ScreeningCondition_title_btn" @click="cancleDetailContent">
						<img style="width: 15px;height: 10px;" src="../../assets/addBack.png" alt="">
					</a-button>
				</div>
			</template>
			<contentDetail
				:showContentDetail="showContentDetail"
        :detailFlag="detailFlag"
        :detailContentId="detailContentId"
				@cancleDetailContent="cancleDetailContent"
			/>
		</a-drawer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { contentApi, operaTionApi } from '@/libs/api'
import { ColumnProps } from 'ant-design-vue/es/table';
import { AxiosRequestHeaders } from 'axios';
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { Prop, Watch } from 'vue-property-decorator';
import contentDetail from '@/modules/conTent/contentDetail/index.vue';

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
interface DrawerType {
  key: Key;
  topicId: string;
  neirong: any;
  biaoqian: string;
  neirongfenlei: string;
  caozuoren: string;
  shangjiashijian: string;
  caozuo: string;
};

@Options({
  components: {
    contentDetail
  }
})
export default class operationDetail extends Vue {
  @Prop() public addOrEditType: any
  @Prop() public detailReachId: any
  @Prop() public showDetailOperation: any
  public showContentDetail = false
  public detailFlag = '1'
  public detailContentId = ''
  public cancleDetailContent(value:any){
	  this.showContentDetail = false
  }
  public route = useRoute()
  //内容类型
  public contentType: any[] = [
    {
      label: '图文',
      value: 't',
    },
    {
      label: '海报',
      value: 'b'
    },
    {
      label: '产品',
      value: 'pr'
    },
    {
      label: '话题',
      value: 's'
    },
    {
      label: '视频',
      value: 'v'
    }
  ]
  created() {
    this.showAddContentChange(this.showDetailOperation)
  }
  @Watch('showDetailOperation', { deep: true })
  public showAddContentChange(newVal: any) {
    if (newVal) {
      this.getData();
    }
  }
  public cancleDetail() {
    this.$emit('cancleDetail', false)
  }
  public exchangeCode(Code: any) {
    if (Code === '1') {
      return "百度小程序"
    } else if (Code === '2') {
      return "微信小程序"
    } else if (Code === '3') {
      return "微信公众号"
    } else if (Code === '4') {
      return "抖音"
    } else if (Code === '5') {
      return "快手"
    } else if (Code === '6') {
      return "APP"
    } else {
      return Code
    }
  };
  public exchangeRulesType(type: any) {
    if (type === '1') {
      return "内容标签规则"
    } else if (type === '2') {
      return "内容作者规则"
    } else if (type === '3') {
      return "内容体裁规则"
    } else if (type === '4') {
      return "内容置顶规则"
    } else {
      return type
    }
  };

  public onClose() {
    this.visible = false;
  }
  public contentDetailsId: any = ''
  public rulesType: any = ''
  public rulesVoList: any = []
  public data: any = {};
  public rulesVoListTop: any = []
  public rulesVoListLabel: any = []
  //数据交互
  public getData() {
    let inParam = {
      reachId: this.detailReachId.reachId,
      // reachId: 'bxzaTJMM',
    };
    this.rulesVoListTop = []
    this.rulesVoListLabel = []
    operaTionApi.getInfo(inParam, {}).then((res) => {
      this.data = res.defmap;
      this.contentDetailsVoList = this.data.contentDetailsVoList;
      this.rulesVoList = this.data.rulesVoList;
      if (this.data.reachDitchCode) {
        this.data.reachDitchCode = this.exchangeCode(this.data.reachDitchCode);
        // 取数组里的某个值
        this.rulesVoList.forEach((item: any) => {
          this.rulesType = item.rulesType
          if (item.rulesType === 1 || 2 || 3 || 4) {
            item.rulesType = this.exchangeRulesType(item.rulesType);
          }
          if (item.rulesType === '内容体裁规则') {
            this.contentType.forEach((i: any) => {
              if (item.includeTopic === i.value) {
                item.includeTopic = i.label
                }
            })
          } else {
            let params = {
              id: item.includeTopic
            }
            //调取树形接口 
            operaTionApi.getLabelQuery(params, {}).then((res: any) => {
              if (res.flag == 'success' && res.data.length === 1) {
                item.includeTopic = res.data[0].name;
              }
            })
          }
          if (item.rulesType === "内容置顶规则") {
            this.rulesVoListTop.push(item)
          }
          if (item.rulesType !== '内容置顶规则') {
            this.rulesVoListLabel.push(item)
          }
        });
      };
    });//operationapi  end
  }//getdata end
  public contentId: string = ''
  public visible: boolean = false;
  public afterVisibleChange = (bool: boolean) => {

  };
  public contentDetails: string = '';
  public showDrawer = (record: any) => {
    console.log(record,'record')
    this.contentDetails = record.contentDetails;
    this.drawerData = [];//每次打开时初始化数据
    this.visible = true;
    let param = {
      contentDetailsId: record.contentDetailsId,
    }
    const header: any = {
      request: (header: AxiosRequestHeaders) => {
        header.nowPage = this.pagination.current;
        header.row4Page = this.pagination.pageSize;
      }
    }
    operaTionApi.getReachContent(param, header).then((res) => {
      // this.drawerData = res.data;
      console.log(res.data,'data')

      res.data.forEach((item: any) => {
        // this.contentId = item.contentId;
        this.drawerData.push({ ...item, neirong: { verticalCoverFile: item.verticalCoverFile, horizontalCoverFile: item.horizontalCoverFile, titleName: item.titleName, contentId: item.contentId } })
      })

    });


  };


  public columns: any[] = [
    // {
    //     title: '目标人群',
    //     dataIndex: 'mubiaorenqun',
    //     align: 'center',
    //     slots: { customRender: 'mb' },
    // },
    // {
    //     title: '比对组人群',
    //     dataIndex: 'biduizurenqun',
    //     align: 'center',
    // },
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
  public drawer: any[] = [
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
  ];
  public router = useRouter()
  public contentDetail(contentId: any) {
    this.detailContentId = contentId
    console.log(contentId,'contentId')
	  this.showContentDetail = true
    // this.$router.push('/conTent/contentDetail?id=')

  }

  public contentDetailsVoList: DataType[] = [
    // {
    //     key: 1,
    //     mubiaorenqun: '123',
    //     biduizurenqun: 'weer',
    //     contentDetails: '',

    // },
  ];

  public drawerData: any[] = [
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
  public targetList: string[] = [
    // '妈妈群',
    // '购物达人'
  ];

  public matchList: string[] = [
    // '职场精英'
  ];
  public pagination = {
    current: 1,
    pageSize: 10,
    defaultCurrent: 1, // 默认当前页数
    defaultPageSize: 5, // 默认当前页显示数据的大小
    total: 0, // 总数，必须先有
    showSizeChanger: true,
    // showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`, // 显示总条数
    pageSizeOptions: ['5', '10', '15', '20'],
  }

  //点击上一页下一页，重新查询数据
  public changeProPage(value: any) {
    this.pagination.current = value.current;
    this.pagination.pageSize = value.pageSize;
    this.getData();
  }

}
</script>


<style lang="less" scoped>
.basic-box {
  // margin-left: 34px;
  // margin-top: 21px;
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
  width: 100px;
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
  width: 800px;
}

.dasan-hr {
  width: 800px;
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
  width: 800px;
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

.table {
  width: 800px;
  margin-top: 42px;
}

.mb {

  height: 32px;
  background: #EDEFF9;
  border-radius: 16px;
  opacity: 0.08;
  color: #2443BC;
}

.label {
  margin-right: 30px;
  height: 20px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #333333;
  line-height: 32px;
}

.label-content {

  margin-right: 10px;
  min-width: 76px;
  background: #EDEFF9;
  border-radius: 16px;
  height: 32px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #2443BC;
  line-height: 32px;
  text-align: center;
}

.label-box {
  margin-bottom: 24px;
}

.target-title {

  height: 22px;
  font-size: 16px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}

.target-hr {
  margin-top: 10px;
  width: 866px;
  // height: 1px;
  background: #EFEFEF;
}

.match {
  margin-top: 15px;
}

.zixun-content {

  height: 20px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #333333;
  line-height: 32px;
}

.form-style {
  width: 866px;
}

.drawerList-box {
  margin-top: 25px;
}

.blue {

  height: 20px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #2443BC;
  line-height: 20px;
}

.title-name {
  height: 40px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
}

.long-span {
  margin-right: 10px;
}

.drawer-flex {
  margin-top: 10px;
  display: flex;

  .drawer-left {
    margin-right: 10px;
    flex: 1;

    img {
      width: 34px;
      height: 34px;
    }
  }

  .upload {
    flex: 1;
    margin-right: 10px;
    color: #66a1e8;
    font-size: 12px;
    width: 34px;
    height: 34px;
  }

  .drawer-right {
    flex: 5;
    display: flex;
    flex-direction: column;
    align-items: start;
  }
}

.ScreeningCondition_desc_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #EBF2F7;
  height: 40px;
  padding: 0px 16px;

  .ScreeningCondition_title_btn {
    border: solid 0px;
    width: 15px;
    height: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    // background-color: #EBF2F7;
  }
}</style>