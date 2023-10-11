<template>
  <div>
    <a-row :gutter="24">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>话题分类：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <a-radio-group v-model:value="topicTypeValue" v-for="(item, index) in topicTypeValueList" :key="item.code"
          :index="index" name="radioGroup">
          <a-radio :value="item.value" @click="changeTopicType(item)">
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
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
					<span>话题描述：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="16" :xl="16" :xxl="12">
        <div style="width:400px">
          <a-textarea v-model:value="topicDescription" placeholder="请输入话题描述" :rows="4" maxlength="200" :showCount="true" @change="changeTopicDescripion" />
        </div>
      </a-col>
    </a-row>
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
					<span>Banner图：</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <div style="display: flex;align-items: center;justify-content: left;">
          <div>
            <a-upload
              accept=".jpg,.jpeg,.png,.gif"
              name="file"
              :headers="headers"
              action="/dop/iug/zuul/content/file/c/upload.do"
              list-type="picture-card"
              class="avatar-uploader"
              v-model:file-list="pictureBannerInformation"
              :on-success="onBannerSuccess"
              :show-upload-list="false"
              @change="uploadBannerPictures">
              <img v-if="imageBannerUrl" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + imageBannerUrl" alt="avatar" style="width:100px;height: 100px;" />
              <div v-else style="width:80px;height: 80px;">
                <loading-outlined v-if="bannerLoading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div>
                  <p style="font-size:24px;padding: 0;color: #999;">+</p>
                  <p style="color: #999;">上传图片</p>
                </div>
              </div>
            </a-upload>
          </div>
          <div>
            <p style="font-size: 12px;	color: #999999;">尺寸：宽1065px*高264px</p>
            <p style="font-size: 12px;	color: #999999;">大小：不超过500k</p>
            <p style="font-size: 12px;	color: #999999;">格式：.jpg,.jpeg,.png,.gif</p>
          </div>
        </div>
      </a-col>
    </a-row>
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
					<span>开始时间：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="6" :sm="6" :xl="5" :xxl="6">
        <a-date-picker
						style="width:100%;border-radius: 4px;margin-right: 8px;"
						valueFormat="YYYY-MM-DD HH:mm:ss"
            show-time
						v-model:value="startTime"
						:disabledDate="disabledDateStart"
            @change="chooseStartTime"
						placeholder="请选择开始时间" />
      </a-col>
      <a-col
				:push="1"
				:xs="3"
				:sm="3"
				:xl="3"
				:xxl="3">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>结束时间：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="6" :sm="6" :xl="5" :xxl="4">
        <a-date-picker
						style="width:100%;border-radius: 4px;margin-left:8px"
						valueFormat="YYYY-MM-DD HH:mm:ss"
            show-time
						v-model:value="endTime"
						:disabled-date="disableEndTime"
            @change="chooseEndTime"
						placeholder="请选择结束时间" />
      </a-col>
    </a-row>
    <!-- 红蓝方观点-pk类 -->
    <a-row :gutter="24" style="margin-top:24px" v-if="topicTypeValue === 'p'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>请输入红方观点：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <a-input
          v-model:value="redViewpointValue"
          style="border-radius: 4px;width:190px"
          placeholder='请输入红方观点'
          @change="changeRedViewpoint"
        ></a-input>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top:24px" v-if="topicTypeValue === 'p'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>请输入蓝方观点：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <a-input
          v-model:value="blueViewpointValue"
          style="border-radius: 4px;width:190px"
          placeholder='请输入蓝方观点'
          @change="changeBlueViewpoint"
        ></a-input>
      </a-col>
    </a-row>
    <!-- 话题讨论类-话题结果选项 -->
    <a-row :gutter="24" style="margin-top:24px" v-if="topicTypeValue === 'd'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>话题结果选项：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <a-radio-group v-model:value="topicResultValue" v-for="(item, index) in topicResultValueList" :key="item.code"
          :index="index" name="radioGroup">
          <a-radio :value="item.value" @click="changeTopicResultType(item)">
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-col>
      <a-col :xs="3" :sm="3" :xl="3" :xxl="2">
        <a-button danger style="border-radius: 4px;" @click="addTitleResult">新增话题结果选项</a-button>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top:24px" v-if="topicTypeValue === 'd'">
      <a-col :push="4" :xs="14" :sm="14" :xl="14" :xxl="14">
        <a-table
          :rowKey="(record:any) => record['orderNum']"
          :columns="columns"
          :data-source="dataSource"
          bordered
          :pagination="false"
        >
          <template #resultContent="{text,record}">
            <a-input v-if="record.inputBoolean === true" v-model:value="editTableData[record.orderNum].resultContent" />
              <template v-else>
                {{ text }}
              </template>
          </template>    
          <template #action="{record}">
            <a-button type="link" @click="editRow(record,record.orderNum)" v-if="record.inputBoolean === false">修改</a-button>
            <a-button type="link" v-if="record.inputBoolean === true" @click="saveRow(record,record.orderNum)">完成</a-button>
            <a-button type="link" @click="delRow(record.orderNum)">删除</a-button>
          </template>                
        </a-table>
      </a-col>
    </a-row>
    <!-- 是否提示真相 -->
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
					<span>是否提示真相：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <a-radio-group v-model:value="promptTruthValue" v-for="(item, index) in promptTruthValueList" :key="item.code"
          :index="index" name="radioGroup">
          <a-radio :value="item.value" @click="changePromptTruth(item)">
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <!-- 真相标题 -->
    <a-row :gutter="24" style="margin-top:24px" v-if="promptTruthValue === '1'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>真相标题：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <a-input
          v-model:value="truchTitle"
          style="border-radius: 4px;width:190px"
          placeholder='请输入真相标题'
          @change="changeTruchTitle"
        ></a-input>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top:24px" v-if="promptTruthValue === '1'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>真相说明：</span>
					<span
						style="color:#E8380D;height:6px;line-height: 6px;text-align: center;">
						*</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <a-textarea
          v-model:value="truthExplain"
          style="border-radius: 4px;width:300px;height: 100px;"
          placeholder='请输入真相说明'
          @change="changeTruthExplain"
        ></a-textarea>
      </a-col>
    </a-row>
    <!-- 上传图片 -->
    <a-row :gutter="24" style="margin-top:24px" v-if="promptTruthValue === '1'">
      <a-col
				:push="1"
				:xs="4"
				:sm="4"
				:xl="4"
				:xxl="4">
				<div
					style="display: flex;justify-content: start;align-items: center;"
				>
					<span>上传图片：</span>
				</div>
			</a-col>
      <a-col :xs="12" :sm="12" :xl="8" :xxl="6">
        <div style="display: flex;align-items: center;justify-content: left;">
          <div>
            <a-upload
              accept=".jpg,.jpeg,.png,.gif"
              maxCount="1"
              name="file"
              :headers="headers"
              action="/dop/iug/zuul/content/file/c/upload.do"
              list-type="picture-card" class="avatar-uploader" v-model:file-list="pictureTruchInformation" :on-success="onTruchSuccess"
              :show-upload-list="false" @change="uploadTruchPictures">
              <img v-if="imageTruchUrl" :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + imageTruchUrl" alt="avatar" style="width:100px;height: 100px;" />
              <div v-else style="width:80px;height: 80px;">
                <loading-outlined v-if="truchLoading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div>
                  <p style="font-size:30px;padding: 0;color: #999;">+</p>
                  <p style="color: #999;">上传图片</p>
                </div>
              </div>
            </a-upload>
          </div>
          <div>
            <p>尺寸：宽1065px*高264px</p>
            <p>大小：不超过500k</p>
            <p>格式：.jpg,.jpeg,.png,.gif</p>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import {localStorage} from '@/libs/Storage';
import { Options, Vue } from 'vue-class-component';
import { message } from 'ant-design-vue';
import { computed } from 'vue'
import { PlusOutlined, LoadingOutlined, UploadOutlined, ApiOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import moment from 'moment';
import store from '@/modules/conTent/store';
import { useRoute } from 'vue-router'
import imageText from './imageText/index.vue'
import { Prop,Watch } from 'vue-property-decorator';

//图片转base64
function getBase64(img: Blob, callback: (base64Url: string) => void) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result as string));
	reader.readAsDataURL(img);
}

@Options({
  components: {
    imageText
  }
})

export default class topicType extends Vue {
  @Prop({ default: false }) public cancleTitleTypeData!: boolean;
  @Prop() public addOrEditType:any
	@Prop() public showAddContent:any
  public route = useRoute()
  public created(): void {
    this.onTableListChange(this.showAddContent)
  }

  public mounted(): void {
	}
  public headers:any = {
		['X-Auth-Token'] : localStorage.get('token')
	}
  public state: any = store.state
  @Watch('showAddContent',{deep:true})
  private onTableListChange(newVal: any) {
		if(newVal){
      let editContent:any = this.state.editContent.editContentList
      let addState = this.state.addContent
      if(this.addOrEditType === '1' && addState.contentType === ''){
        this.topicTypeValue = editContent.subjectType
        this.startTime = editContent.subjectStartTime
        this.endTime = editContent.subjectEndTime
        this.promptTruthValue = editContent.isTipTruth
        this.imageBannerUrl = editContent.bannerPictureFile
        this.topicDescription = editContent.subjectDescription
        if( editContent.isTipTruth === '1'){
          this.truchTitle = editContent.truthTitle
          this.truthExplain = editContent.truthExplain
          this.imageTruchUrl = editContent.pictureFile
        }
        if(editContent.subjectType === 'p'){
          this.redViewpointValue = editContent.redOpinion
          this.blueViewpointValue = editContent.blueOpinion
        } else {
          this.topicResultValue = editContent.optionType
          if(editContent.resultList.length !== 0){
            this.dataSource = editContent.resultList.map((item:any) => {return {resultContent:item.resultContent,orderNum:item.orderNum,inputBoolean:false}})
          }
        }
        this.topicTypeList = {
          subjectType:editContent.subjectType,//话题类型
          bannerPictureFile:editContent.bannerPictureFile,//banner图地址
          subjectStartTimeStr:editContent.subjectStartTime,//话题开始时间
          subjectEndTimeStr:editContent.subjectEndTime,//话题结束时间
          redOpinion:editContent.redOpinion,//红方观点
          blueOpinion:editContent.blueOpinion,//蓝方观点
          optionType:editContent.optionType,//话题结果-单选多选
          resultList:editContent.resultList,//话题结果-列表
          isTipTruth:editContent.isTipTruth,//是否提示真相
          truthTitle:editContent.truthTitle,//真相标题
          truthExplain:editContent.truthExplain,//真相说明
          pictureFile:editContent.pictureFile,//话题图片上传地址
          subjectDescription:editContent.subjectDescription//话题描述
        }
        this.$emit('topicTypeData',this.topicTypeList)
      } else {
        this.setAddList()
      }
		} else {
      this.setAddList()
    }
  }
  //重置
  public setAddList(){
    this.topicTypeValue = ''
    this.pictureBannerInformation = []
    this.imageBannerUrl = ''
    this.startTime = ''
    this.endTime = ''
    this.redViewpointValue = ''
    this.blueViewpointValue = ''
    this.topicResultValue = ''
    this.dataSource = []
    this.promptTruthValue = ''
    this.truchTitle = ''
    this.truthExplain = ''
    this.pictureTruchInformation = []
    this.imageTruchUrl = ''
    this.topicDescription = ''
    this.topicTypeList = {
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
      subjectDescription:''
    }
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //向上传值list
  public topicTypeList:any = {
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
    subjectDescription:''//话题描述
  }
  //话题类型v-model
  public topicTypeValue: string = ''
  //话题类型列表
  public topicTypeValueList: any[] = [
    {
      code: '1',
      value: 'p',
      label: '话题pk类'
    },
    {
      code: '2',
      value: 'd',
      label: '话题讨论类'
    }
  ]
  //话题结果单选多选列表
  public topicResultValueList:any[] = [
    {
      code: '1',
      value: 's',
      label: '单选'
    },
    {
      code: '2',
      value: 'm',
      label: '多选'
    }
  ]
  //是否提示真相列表
  public promptTruthValueList:any[] = [
    {
      code: '1',
      value: '1',
      label: '是'
    },
    {
      code: '2',
      value: '2',
      label: '否'
    },
  ]
  //选择话题分类
  public changeTopicType(item: any) {
    this.topicTypeValue = item.value
    this.topicTypeList.subjectType = item.value
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //话题描述-文本框
  public topicDescription:any = ''
  //话题描述
  public changeTopicDescripion(){
    // this.topicDescription = this.topicDescription.replace(/\s+/g,'')
    this.topicTypeList.subjectDescription = this.topicDescription
    this.$emit('topicTypeData',this.topicTypeList)
  }
  public pictureBannerInformation: any[] = []
  public imageBannerUrl: string = ''
	public bannerLoading: boolean = false
  //banner图片成功返回
	public onBannerSuccess(response:any){
    this.topicTypeList.bannerPictureFile = response.defmap.data
    this.imageBannerUrl = response.defmap.data
    this.$emit('topicTypeData',this.topicTypeList)
	}
  //点击上传banner图片，转换base64
	public uploadBannerPictures = (info: UploadChangeParam) => {
		const information1: any = info.file.originFileObj
		if (info.file.status === 'uploading') {
			this.bannerLoading = true;
			return;
		}
		if (info.file.status === 'done') {
		}
		if (info.file.status === 'error') {
			this.bannerLoading = false;
			message.error('upload error');
		}
	};
  //话题开始时间
  public startTime:string = ''
	public disabledDateStart(current: any){
		if (this.endTime) {
      return current > moment(this.endTime).endOf('day');
    }
	}
  public chooseStartTime(){
     
    this.topicTypeList.subjectStartTimeStr = this.startTime
    this.$emit('topicTypeData',this.topicTypeList)
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
  public chooseEndTime(){
    this.topicTypeList.subjectEndTimeStr = this.endTime
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //红方观点v-model
  public redViewpointValue:string = ''
  //红方观点传值
  public changeRedViewpoint(){
    this.topicTypeList.redOpinion = this.redViewpointValue
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //蓝方观点v-model
  public blueViewpointValue:string = ''
  //蓝方观点传值
  public changeBlueViewpoint(){
    this.topicTypeList.blueOpinion = this.blueViewpointValue
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //选择话题v-model
  public topicResultValue:string = ''
  //选择话题结果-单选多选
  public changeTopicResultType(item:any){
    this.topicResultValue = item.value
    this.topicTypeList.optionType = item.value
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //话题结果列表 表头
  public columns:any[] = [
    {
      title:'序号',
      dataIndex:'orderNum',
      align:'center', 
      width:'50px'
    },
    {
      title:'话题结果内容',
      dataIndex:'resultContent',
      align:'center',
      width:'200px',
      slots: { customRender: "resultContent" }
    },
    {
      title:'操作',
      dataIndex:'action',
      slots: { customRender: "action" },
      width:'80px',
      align:'center'
    },
  ]
  //话题结果列表数据
  public dataSource:any[] = []
  //新增话题结果
  public addTitleResult(){
    this.dataSource.push({
      orderNum:JSON.stringify(this.dataSource.length + 1),
      resultContent:'',
      inputBoolean:false
    })
    this.topicTypeList.resultList = this.dataSource.map((item:any,index:number) => {return {orderNum:JSON.stringify(index + 1),resultContent:item.resultContent}})
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //话题结果列表修改行数据
  public editTableData:any = {}
  // 点击编辑
  public editRow(record:any,orderNum: any){
    record.inputBoolean = true
    this.editTableData[orderNum] = JSON.parse(JSON.stringify(this.dataSource.filter((item: any) => item.orderNum === orderNum)[0]))
  }
  //点击编辑完成
  public saveRow(record:any,orderNum: any){
    record.inputBoolean = false
    this.dataSource.forEach((res:any) => {
      if(res.orderNum === orderNum){
        res.resultContent = this.editTableData[orderNum].resultContent
      }
    })
     
    this.topicTypeList.resultList = this.dataSource.map((item:any,index:number) => {return {orderNum:JSON.stringify(index + 1),resultContent:item.resultContent}})
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //点击删除行数据
  public delRow(orderNum: any){
    this.dataSource = this.dataSource.filter((item:any) => item.orderNum !== orderNum)
    this.dataSource = this.dataSource.map((item:any,index:number) => {return {orderNum:JSON.stringify(index + 1),resultContent:item.resultContent,inputBoolean:item.inputBoolean}})
    this.topicTypeList.resultList = this.dataSource.map((item:any,index:number) => {return {orderNum:JSON.stringify(index + 1),resultContent:item.resultContent}})
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //提示真相类型v-model
  public promptTruthValue:string = ''
  // 选择是否提示真相
  public changePromptTruth(item:any){
    this.promptTruthValue = item.value
    this.topicTypeList.isTipTruth = item.value
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //真相标题
  public truchTitle:string = ''
  //真相标题传值
  public changeTruchTitle(){
    this.topicTypeList.truthTitle = this.truchTitle
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //真相说明
  public truthExplain:string = ''
  //真相说明传值
  public changeTruthExplain(){
    this.topicTypeList.truthExplain = this.truthExplain
    this.$emit('topicTypeData',this.topicTypeList)
  }
  //真相-上传图片
  public pictureTruchInformation: any[] = []
  public imageTruchUrl: string = ''
	public truchLoading: boolean = false
  //图片成功返回
	public onTruchSuccess(response:any){
    this.topicTypeList.pictureFile = response.defmap.data
    this.imageTruchUrl = response.defmap.data
    this.$emit('topicTypeData',this.topicTypeList)
	}
  //点击上传图片，转换base64
	public uploadTruchPictures = (info: UploadChangeParam) => {
		const information1: any = info.file.originFileObj
		if (info.file.status === 'uploading') {
			this.truchLoading = true;
			return;
		}
		if (info.file.status === 'done') {
		}
		if (info.file.status === 'error') {
			this.truchLoading = false;
			message.error('upload error');
		}
	};
}
</script>

<style lang="scss"></style>