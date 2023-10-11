<template>
  <!-- 内容分类 -->
  <div>
    <a-row :gutter="24" style="margin-top:24px">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>内容分类：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="14" :xl="12" :xxl="12">
        <!-- 内容分类 -->
        <a-radio-group v-model:value="formContentClassModel"
          v-for="(item, index) in formContentClass" :key="item.code" :index="index" name="radioGroup">
          <a-radio :value="item.value" @click="changeContentClass(item)">
            {{ item.type }}
          </a-radio>
        </a-radio-group>
        <!-- 文字、图片：富文本框 -->
        <div v-if="formContentClassModel === '1'" style="width:583px;margin-top:24px">
          <image-text
            :showAddContent="showAddContent"
            :addOrEditType="addOrEditType"
            @posterImgTextData="posterImgTextData"/>
          <!-- <vue-ueditor-wrap @ready="ready" v-model="content" :config="editorConfig" editor-id="editor-demo-01" mode="observer"
			      @beforeInit="addCustomButtom"></vue-ueditor-wrap> -->
        </div>
        <!-- 分类海报 -->
        <div class="poster-classification" style="margin-top:24px;display: flex;justify-content: start;align-items: end;"
          v-if="formContentClassModel === '2'">
          <poster
            :showAddContent="showAddContent"
            :addOrEditType="addOrEditType"
            @posterImgUrlData="posterImgUrlData"
            :cancleImgUrl="cancleImgUrlData"/>
        </div>
        <!-- 分类视频 -->
        <div v-if="formContentClassModel === '5'" style="margin-top:24px">
          <video-type
            :showAddContent="showAddContent"
            :addOrEditType="addOrEditType"
            @videoTypeData="videoTypeData" 
            :cancleVideoType="cancleVideoTypeData"/>
        </div>
      </a-col>
    </a-row>
    <!-- 话题分类 -->
    <a-row :gutter="24" style="margin-top:24px" v-if="formContentClassModel === '4'" >
      <a-col :xs="24" :sm="24" :xl="24" :xxl="24">
        <topic-type
          :showAddContent="showAddContent"
          :addOrEditType="addOrEditType"
          @topicTypeData="topicTypeData"
          :cancleTitleType="cancleTitleTypeData"/>
      </a-col>
    </a-row>
    <!-- 分类产品 -->
    <a-row :gutter="24" style="margin-top:24px" v-if="formContentClassModel === '3'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>产品编码：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col>
        <div style="width:300px;">
          <a-input
            v-model:value="productCoding"
            style="border-radius: 4px;"
            @change="changeProductCoding"
            placeholder='请输入产品编码，如：6112230'>
          </a-input>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top:24px" v-if="formContentClassModel === '3'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>产品详情：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col>
        <div style="width:600px;">
          <image-text @posterImgTextData="posterImgTextData"/>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top:24px" v-if="formContentClassModel === '3'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>保费金额(元)：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col>
        <div
          style="display: flex;align-items: center;justify-content: start;"
        >
          <a-tooltip color="#FFF">
            <question-circle-outlined />
            <template #title>
              <p style="color:#000;padding:0;margin:0">
                需填写“保费金额和交费方式”，如：填写“保费金额”为“100元/月起”，移动端保费金额和单位需标红放大显示为“<span style="color: red;font-size: 16px;font-weight: 600;">100元</span>/月起”。
              </p>
              <p style="color:#000;padding:0;margin:0">注：</p>
              <p style="color:#000;padding:0;margin:0">1、交费方式包含：月、年；</p>
              <p style="color:#000;padding:0;margin:0">2、若为趸交产品则无需填写“交费方式”，如：<span style="color: red;font-size: 16px;font-weight: 600;">100元</span>起</p>
            </template>
          </a-tooltip>
          <div style="width:200px;margin-left:10px;">
            <a-input
              v-model:value="minPremium"
              style="border-radius: 4px;"
              @change="changeMinPremium"
              placeholder='请输入保费金额(元)'>
            </a-input>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { PlusOutlined, LoadingOutlined, UploadOutlined, ApiOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { Options, Vue } from 'vue-class-component';
import imageText from './components/imageText/index.vue'
import poster from './components/poster.vue'
import videoType from './components/videoType.vue'
import topicType from './components/topicType.vue'
import { computed } from 'vue';
import store from '@/modules/conTent/store';
import { useRoute } from 'vue-router'
import { Prop,Watch } from 'vue-property-decorator';


//内容分类选择接口
interface formContentClassification {
  value: string;
  type: string;
  code: string
}

@Options({
  components: {
    UploadOutlined,
    ApiOutlined,
    imageText,
    poster,
    videoType,
    topicType,
    QuestionCircleOutlined
    // QuillEditor
  }
})
export default class contentType extends Vue {
  @Prop() public addOrEditType:any
	@Prop() public showAddContent:any
  public route = useRoute()
  public mounted(): void{
	}
  //初始化富文本
	public editorConfig = {
		initialFrameHeight: 200,
		// themePath: "/UEditor/themes/",
		UEDITOR_HOME_URL: 'UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
		// serverUrl: '//ueditor.zhenghaochuan.com/cos', // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
	}
  	//富文本v-model
	public content: any = ''
  //自定义富文本按钮
	// public window:any = window
	public editor:any = ''
	public ready(editorInstance:any){
		 
		this.editor = editorInstance
		this.editor.addListener('contentChange',() => {
			this.content = this.editor.getContent()
			this.$emit('posterImgTextData',this.content)
		})
	}
  public addCustomButtom(editorId: any) {
	}
	public state: any = store.state
  @Watch('showAddContent',{deep:true})
  private onTableListChange(newVal: any) {
		if(newVal){
      let editContent:any = ''
      let addState = this.state.addContent
      editContent = this.state.editContent.editContentList
      if(this.addOrEditType === '1'){
        this.formContentClassModel = editContent.contentType === 't' ? '1' : editContent.contentType === 'b' ? '2' : editContent.contentType === 'pr' ? '3' : editContent.contentType === 's' ? '4' : editContent.contentType === 'v' ? '5' :''
        this.contentClassificationList.contentType = editContent.contentType
        this.$emit('contentClassification',this.contentClassificationList)
      }
      if(this.addOrEditType === '1' && addState.contentType === ''){
        if(editContent.contentType === 'pr'){
          //赋值产品编码
          this.productCoding = editContent.productCodes
          this.contentClassificationList.productCodes = this.productCoding
          this.contentClassificationList.contentText = editContent.contentFile
          this.minPremium = editContent.minPremium
          this.contentClassificationList.minPremium = this.minPremium
          this.$emit('contentClassification',this.contentClassificationList)
        }
      }
		} else {
      this.serAddList()
    }
  }
  public created(): void {
    this.onTableListChange(this.showAddContent)
  }
  //关闭抽屉重置
  public serAddList(){
    this.formContentClassModel = ''
    this.contentClassificationList = {
			contentType:'',//内容分类
			subjectType:'',//话题类型
			bannerPictureFile:'',//banner图地址
			subjectStartTimeStr:'',//话题开始时间
			subjectEndTimeStr:'',//话题结束时间
			redOpinion:'',//红方观点
			blueOpinion:'',//蓝方观点
			optionType:'',//话题结果-单选多选
			resultList:[],//话题结果-列表
			isTipTruth:'',//是否提示真相
			truthTitle:'',//真相标题
			truthExplain:'',//真相说明
			pictureFile:'',//话题图片上传地址
			productCodes:'',//产品编码
			contentFile:'',//海报视频文件地址
      videoTimeLength:'',//视频时长
      contentText:''//图文富文本地址
		}
    this.$emit('contentClassification',this.contentClassificationList)
  }
  //内容分类-传值列表
  public contentClassificationList:any = {
    contentType:'',//内容分类
		subjectType:'',//话题类型
    bannerPictureFile:'',//banner图地址
    subjectStartTimeStr:'',//话题开始时间
    subjectEndTimeStr:'',//话题结束时间
    redOpinion:'',//红方观点
    blueOpinion:'',//蓝方观点
    optionType:'',//话题结果-单选多选
    resultList:[],//话题结果-列表
    isTipTruth:'',//是否提示真相
    truthTitle:'',//真相标题
    truthExplain:'',//真相说明
    pictureFile:'',//话题图片上传地址
    productCodes:'',//产品编码
		contentFile:'',//海报视频文件地址
    minPremium:'',//产品保费金额
  }
	//重置
	public resetContentClassList(){
		this.contentClassificationList = {
			contentType:'',//内容分类
			subjectType:'',//话题类型
			bannerPictureFile:'',//banner图地址
			subjectStartTimeStr:'',//话题开始时间
			subjectEndTimeStr:'',//话题结束时间
			redOpinion:'',//红方观点
			blueOpinion:'',//蓝方观点
			optionType:'',//话题结果-单选多选
			resultList:[],//话题结果-列表
			isTipTruth:'',//是否提示真相
			truthTitle:'',//真相标题
			truthExplain:'',//真相说明
			pictureFile:'',//话题图片上传地址
			productCodes:'',//产品编码
			contentFile:'',//海报视频文件地址
      videoTimeLength:'',//视频时长
      contentText:''//图文富文本地址
		}
	}
  //内容分类 分类选项
  public formtest: any[] = []
  //超链接组列表
  public hrpetlink: string = ''
  public hyperlinkList: any[] = [
    {
      value: '0',
      name: '新增地址链接',
      code: '0'
    },
    {
      value: '1',
      name: '选择已有链接',
      code: '1'
    },
  ]
  //raio按钮列表
  public formContentClass: formContentClassification[] = [
    {
      code: '1',
      value: '1',
      type: '图文'
    },
    {
      value: '2',
      code: '2',
      type: '海报'
    },
    {
      value: '3',
      code: '3',
      type: '产品'
    },
    {
      value: '4',
      code: '4',
      type: '话题'
    },
    {
      value: '5',
      code: '5',
      type: '视频'
    }
  ]
  //radio按钮
  public formContentClassModel: string = ''
  //选择内容分类-不选择海报
  public cancleImgUrlData:boolean = true
  //选择内容分类-不选择视频
  public cancleVideoTypeData:boolean = true
	//选择内容分类-不选择话题
	public cancleTitleTypeData:boolean = true
  //内容分类 v-model 默认1选项
  public window:any = window
  public changeContentClass(item: formContentClassification) {  
     
     
    if(this.formContentClassModel === '2'){
      //跳出海报
      this.cancleImgUrlData = false
    } else if(this.formContentClassModel === '3'){
      //跳出产品
    } else if(this.formContentClassModel === '5'){
      //跳出视频
      this.cancleVideoTypeData = false
    } else if(this.formContentClassModel === '4'){
			//跳出话题
			this.cancleTitleTypeData = false
		}
		this.resetContentClassList()
    this.formContentClassModel = item.value
    this.contentClassificationList.contentType = item.value === '1' ? 't' : item.value === '2' ? 'b' : item.value === '3' ? 'pr' : item.value === '4' ? 's' :'v'
    store.commit('getContentType',this.contentClassificationList.contentType)
    this.$emit('contentClassification',this.contentClassificationList)
  }
  //内容分类-图文传值/产品富文本传值
  public posterImgTextData(value:string) {
     
    if(this.formContentClassModel === '1' || this.formContentClassModel === '3'){
      this.contentClassificationList.contentText = value
    } 
    this.$emit('contentClassification',this.contentClassificationList)
  }
  //内容分类-海报传值
  public posterImgUrlData(value: string) {
		this.contentClassificationList.contentFile = value
		this.$emit('contentClassification',this.contentClassificationList)
  }
	//内容分类-话题传值
	public topicTypeData(value:any) {
     
		this.contentClassificationList.subjectType = value.subjectType
		this.contentClassificationList.bannerPictureFile = value.bannerPictureFile
		this.contentClassificationList.subjectStartTimeStr = value.subjectStartTimeStr
		this.contentClassificationList.subjectEndTimeStr = value.subjectEndTimeStr
		this.contentClassificationList.redOpinion = value.redOpinion
		this.contentClassificationList.blueOpinion = value.blueOpinion
		this.contentClassificationList.optionType = value.optionType
		this.contentClassificationList.resultList = value.resultList
		this.contentClassificationList.isTipTruth = value.isTipTruth
		this.contentClassificationList.truthTitle = value.truthTitle
		this.contentClassificationList.truthExplain = value.truthExplain
		this.contentClassificationList.pictureFile = value.pictureFile
		this.contentClassificationList.productCodes = value.productCodes
    // this.contentClassificationList.contentText = value.subjectDescription
    this.contentClassificationList.subjectDescription = value.subjectDescription
		this.$emit('contentClassification',this.contentClassificationList)
	}
  //内容分类-视频传值
  public videoTypeData(value:any){
		this.contentClassificationList.contentFile = value.defmapData
    this.contentClassificationList.videoTimeLength = value.showTimeOut
		this.$emit('contentClassification',this.contentClassificationList)
  }
  //内容分类-产品编码
  public productCoding:string = ''
  //改变产品编码-向上传值
  public changeProductCoding(){
    this.contentClassificationList.productCodes = this.productCoding
    this.$emit('contentClassification',this.contentClassificationList)
  }
  //产品-保费金额
  public minPremium:string = ''
  //改变保费金额-向上传值
  public changeMinPremium(){
    this.contentClassificationList.minPremium = this.minPremium
    this.$emit('contentClassification',this.contentClassificationList)
  }
}
</script>

<style lang="less" scoped>
.poster-classification {
  .ant-upload-picture-card-wrapper {
    width: 150px
  }

  .poster-classification-p {
    padding: 0;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
  }

}

.ql-snow {
  width: 100px !important;
}

.ant-modal {
  padding: 0;
}
</style>