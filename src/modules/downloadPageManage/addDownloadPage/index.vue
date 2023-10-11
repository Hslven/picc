<!-- 新增下载页 -->
<template>
    <div class="down">
        <div class="down-item">
            <div class="item-left">显示样式：</div>
            <div class="item-right">
                <a-radio-group v-model:value="formState.displayFormat">
                    <a-radio value="图片">图片</a-radio>
                    <a-radio value="链接">链接</a-radio>
                </a-radio-group>
            </div>
        </div>
        <div class="down-item">
            <div class="item-left">推广渠道：</div>
            <div class="item-right">
                <a-radio-group v-model:value="formState.promotionChannel">
                    <a-radio value="APP">APP</a-radio>
                    <a-radio value="百度小程序">百度小程序</a-radio>
                    <a-radio value="微信小程序">微信小程序</a-radio>
                    <a-radio value="支付宝小程序">支付宝小程序</a-radio>
                    <a-radio value="微信公众号">微信公众号</a-radio>
                </a-radio-group>
            </div>
        </div>
        <div class="down-item">
            <div class="item-left">目标渠道：</div>
            <div class="item-right">
                <a-radio-group v-model:value="formState.targetChannel" @click="changeTargetRadio()">
                    <a-radio
                        :disabled="formState.promotionChannel === 'APP'" 
                        value="APP">
                    APP</a-radio>
                    <a-radio 
                        :disabled="formState.promotionChannel === '微信小程序'"
                        value="微信小程序">
                    微信小程序</a-radio>
                </a-radio-group>
            </div>
        </div>
        <div class="down-item-promot">
            <div class="item-left-promot">推广页组成：</div>
            <div class="item-right-promot">
                (图片格式：JPG、JPEG、PNG、GIF 图片或海报的大小均为10M以内)
                <div class="promot-area">
                    <div v-for="item in constituteList" style="margin-right: 17px;">
                        <div :class="[item.isCheck?'promot-button-selected':'promot-button-select']"
                        @click="checkPiece(item)">
                            <div class="promot-button-text">
                                <span v-if="item.required" class="required" >*</span>
                                {{item.name}}
                            </div>
                            <div :class="[item.isCheck?'tick-selected':'tick-select']">✔</div>
                        </div>
                        <div v-if="item.name !== '深度链接'">
                            <div v-if="item.isCheck && item.uploadType === 'local'">
                                <div class="promot-img">
                                    <a-upload
                                        :headers="headers"
                                        maxCount="1"
                                        class="downbox-imgLocal"
                                        accept=".jpg,.jpeg,.png,.gif"
                                        v-model:file-list="item.fileList"
                                        action="/dop/iug/zuul/content/file/d/upload.do"
                                        :beforeUpload="beforeUploadImg"
                                        @change="(fileObjRes: any) => handleUploadChange(fileObjRes, item)"
                                        @remove="handleUploadRemove(item)"
                                        @preview="handlePreview"
                                        list-type="picture-card"
                                    >
                                        <div v-if="item.fileList.length < 1"
                                            class="page-upload-center"
                                            >
                                            <img style="width: 40px;height: 40px;box-shadow: none;margin-bottom: 8px;" src="./upload-icon.png" alt="">
                                            <div class="upload-text-style"
                                                v-if="item.name === '宣传页'"
                                            >上传宣传页</div>
                                            <div class="upload-text-style"
                                                v-if="item.name === '下载页'"
                                            >上传下载页</div>
                                        </div>
                                    </a-upload>
                                    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                                        <img alt="example" style="width: 100%; height: 100%" :src="previewImage" />
                                    </a-modal>
                                </div>
                                <a-button class="downbox-sethotBtn" @click="showModal(item)">设置热区 </a-button>
                            </div>
                            <div v-if="item.isCheck && item.uploadType === 'dialog'">
                                <div class="promot-page">
                                    <img
                                        class="page_preview-content"
                                        v-if="item.src != ''"
                                        :src="item.src" alt="">
                                        <div @click="showDrawer(item)" v-if="item.src == ''" class="active-upload-center">
                                            <div class="upload-text-style" v-if="item.name === '注册页'">选择注册页</div>
                                            <div class="upload-text-style" v-if="item.name === '活动页'">选择活动</div>
                                            <div class="next-icon">></div>
                                        </div>
                                    <div v-if="item.src != ''" class="page-masks">
                                        <div @click="deletePage(item)" class="masks-button">删除</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="down-item">
            <div class="item-left">渠道有效期：</div>
            <div class="item-right">
                <a-date-picker
                    class="validityPeriodDate"
                    valueFormat="YYYY-MM-DD"
                    v-model:value="formState.channelValidStartDate"
                    :disabledDate="disabledDateStart"
                    placeholder="开始时间"
                />
                <!-- <span class="to">至</span> -->
                <span class="reach">至</span>
                <a-date-picker class="validityPeriodDate" valueFormat="YYYY-MM-DD" v-model:value="formState.channelValidEndDate" :disabled-date="disableEndTime" placeholder="结束时间" />
            </div>
        </div>
        <div class="down-item">
            <div class="item-left">应用说明：</div>
            <div class="item-right">
                <a-select
                    class="appDescrip"
                    v-model:value="formState.appNameAndVersion"
                    ref="select"
                    placeholder="请选择"
                    :options="appDescrpValueList"
                    :fieldNames="{ value: 'appNameAndVersion' }"
                ></a-select>
            </div>
        </div>
        <div class="button-area">
            <a-button class="cancelBtn" @click="cancel">取消</a-button>
            <a-button class="submitBtn" @click="requiredChecksum">提交</a-button>
        </div>
        <a-drawer
            width="866"
            v-model:visible="vailable"
            class="custom-class"
            :title="dialogInfo.title"
            placement="right"
            @after-visible-change="afterVisibleChange"
        >
            <div class="pop-bg" @click="chooseDialogImg()">
                <div class="page_preview-content">
                    <img
                        @click="chooseDialogImg()"
                        :src="dialogInfo.src" alt="">
                </div>
            </div>
        </a-drawer>
        <a-modal width="600px" v-model:visible="modalVisible" title="设置热区" @ok="handleOk()" @cancel="handlecancel()">
            <div class="hot-layout">
                <div class="hot-layout-right">
                    <div v-if="flyerShow && flyerWidthFlag != 0">{{flyerWidthFlag}}px</div>
                    <div v-if="downLoadShow && downWidthFlag != 0">{{downWidthFlag}}px</div>
                    <div class="image-layout">
                        <div v-if="flyerShow && flyerHeightFlag != 0" class="image-text" style="">{{flyerHeightFlag}}px</div>
                        <div v-if="downLoadShow && downHeightFlag != 0" class="image-text" style="">{{downHeightFlag}}px</div>
                        <div class="top">
                            <img v-if="flyerShow" class="img" :src="flyerImage" />
                            <img v-if="downLoadShow" class="img" :src="downLoadImage" />
                            <div v-if="flyerShow && flyerWidthFlag != 0" class="hot-area" :style="{ width: flyerWidth + 'px', height: flyerHeight + 'px' }">
                                <div :style="flyerHotStyle"></div>
                            </div>
                            <div v-if="downLoadShow && downWidthFlag != 0" class="hot-area" :style="{ width: downWidth + 'px', height: downHeight + 'px' }">
                                <div :style="downHotStyle"></div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="text">示意图：IphoneX仅供参考</div> -->
                </div>
                <div class="hot-layout-left">
                    <div class="left-item">
                        <div class="left-text">X横坐标：</div>
                        <div class="left-input">
                            <a-input-number
                                v-if="flyerShow"
                                v-model:value="flyer.hotspotXAxis"
                                class="input-border"
                                :min="1" 
                                :precision="0" 
                                placeholder="请输入正整数"
                                @change="setFlyerHotArea()"
                            >
                            </a-input-number>
                            <a-input-number
                                v-if="downLoadShow"
                                v-model:value="download.hotspotXAxis"
                                class="input-border"
                                :min="1" 
                                :precision="0" 
                                placeholder="请输入正整数"
                                @change="setDownHotArea"
                            >
                            </a-input-number>
                        </div>
                    </div>
                    <div class="left-item">
                        <div class="left-text">Y纵坐标：</div>
                        <div class="left-input">
                            <a-input-number
                                v-if="flyerShow"
                                v-model:value="flyer.hotspotYAxis"
                                class="input-border"
                                :min="1" 
                                :precision="0" 
                                placeholder="请输入正整数"
                                @change="setFlyerHotArea()"
                            >
                            </a-input-number>
                            <a-input-number
                                v-if="downLoadShow"
                                v-model:value="download.hotspotYAxis"
                                class="input-border"
                                :min="1" 
                                :precision="0" 
                                placeholder="请输入正整数"
                                @change="setDownHotArea"
                            >
                            </a-input-number>
                        </div>
                    </div>
                    <div class="left-item">
                        <div class="left-text">宽 度：</div>
                        <div class="left-input">
                            <a-input-number
                                v-if="flyerShow"
                                v-model:value="flyer.hotSpotWidth"
                                class="input-border"
                                :min="1"
                                :precision="0" 
                                placeholder="请输入正整数"
                                @change="setFlyerHotArea()"
                            >
                            </a-input-number>
                            <a-input-number
                                v-if="downLoadShow"
                                v-model:value="download.hotSpotWidth"
                                class="input-border"
                                :min="1" 
                                :precision="0" 
                                placeholder="请输入正整数"
                                @change="setDownHotArea"
                            >
                            </a-input-number>
                        </div>
                    </div>
                    <div class="left-item">
                        <div class="left-text">高 度：</div>
                        <div class="left-input">
                            <a-input-number
                                v-if="flyerShow"
                                v-model:value="flyer.hotSpotExtent"
                                class="input-border"
                                :min="1"
                                :precision="0"
                                placeholder="请输入正整数"
                                :disabled="formState.displayFormat === '图片'"
                                @change="setFlyerHotArea()"
                            >
                            </a-input-number>
                            <a-input-number
                                v-if="downLoadShow"
                                v-model:value="download.hotSpotExtent"
                                class="input-border"
                                :min="1" 
                                :precision="0" 
                                placeholder="请输入正整数"
                                @change="setDownHotArea"
                            >
                            </a-input-number>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>

</template>
<script lang="ts">
import { localStorage } from '@/libs/Storage';
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import { downloadPageManageApi } from '@/libs/api';
import { message } from 'ant-design-vue';
import { Watch } from 'vue-property-decorator';
import { watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import { Item } from 'ant-design-vue/lib/menu';
import { imgUrl } from '@/libs/getImgUrl'

// interface AppType {
//     label: string,
//     id: string
// }

@Options({
    components: {
        PlusOutlined,
    },
    watch: {
        'formState.displayFormat'(data: any) {
            // To fetch post data when the id is changed.

            if (this.formState.displayFormat === '图片') {

                this.setFlyerHotArea();

                //图片
                this.formState.promoValue = '宣传页';
                this.constituteList.forEach((jes: any) => {
                    if (jes.name === '宣传页') {
                        jes.isCheck = true;
                        jes.disabled = true;
                        jes.promoValue = '宣传页';
                    }
                    // else if (jes.name === '深度链接') {
                    //   jes.isCheck = true;
                    //   jes.disabled = true;
                    //   jes.promoValue = '4'

                    // } else if (jes.name === '下载页') {
                    //   jes.isCheck = true;
                    //   jes.disabled = true;
                    //   jes.promoValue = '5'
                    // }
                });
                //链接
            } 
            // else if (this.formState.displayFormat === '链接') {
            //     this.formState.promoValue = '';
            //     this.constituteList.forEach((i: any) => {
            //         if (i.name === '宣传页') {
            //             i.isCheck = false;
            //             i.disabled = false;
            //             i.promoValue = '';
            //         } else if (i.name === '深度链接') {
            //             i.isCheck = false;
            //             i.disabled = false;
            //             i.promoValue = '';
            //         } else if (i.name === '下载页') {
            //             i.isCheck = false;
            //             i.disabled = false;
            //             i.promoValue = '';
            //         } else if (i.name === '活动页') {
            //             i.isCheck = false;
            //             i.disabled = false;
            //             i.promoValue = '';
            //         } else if (i.name === '注册页') {
            //             i.isCheck = false;
            //             i.disabled = false;
            //             i.promoValue = '';
            //         }
            //     });
            // }
        },

        // 'hotZoneStyle'() {}
    },
    // watch(
    //   () => this.formState,
    //   (newValue, oldValue) => {
    //     // newValue === oldValue
    //   },
    //   { deep: true }
    // )
})
//图片转base64
// function getBase64(img: Blob, callback: (base64Url: string) => void) {
// 	const reader = new FileReader();
// 	reader.addEventListener('load', () => callback(reader.result as string));
// 	reader.readAsDataURL(img);
// }
export default class example extends Vue {
    public headers: any = {
        ['X-Auth-Token']: localStorage.get('token'),
    };
    created() {
        this.getAppDescrpValueList();
        this.getAppDescrpValueList();
    }
    //获取图片地址的完整路径
    public getPhoto(data: any) {
        downloadPageManageApi.getPhoto(data.url).then((res: any) => {
            let blob = new Blob([res], { type: 'image/png' });
            const href = window.URL.createObjectURL(blob); //转成url格式
            data.url = href.slice(5); //全路径
            // console.log('调下载图片', href.slice(5));
        });
    }

    public iframeUrl = imgUrl + "/dop/iug/down/dist/#/loginModule/pages/upDownload/upDownload";
    public taskState = '';
    public drawValue: any = '';
    public current1: number = 1;
    public dialogList: any = [];
    public vailable: boolean = false;
    public dialogInfo: any = {
        title: '',
        name: '',
        src: '',
        select: [],
    };

    public modalVisible: boolean = false;
    public previewVisible: boolean = false;
    public previewImage: any = '';
    public previewTitle: any = '';
    public promotionPageName: any = '';
    public flyerHotStyle: string = '';
    public downHotStyle: string = '';
    public getPromotionPageName(data: any) {
        this.promotionPageName = data.name;

    }
    public getAppDescrpValueList() {
        let params = {};
        downloadPageManageApi.getQueryApplicationName(params, {}).then((res) => {
            // if(res.flag === "success"){
            //     res.data.forEach((item: any) => {
            //         this.appDescrpValueList.push(
            //             {
            //               label: item.appNameAndVersion,
            //               id: item.appNameAndVersion
            //             }
            //         )

            //     })

            // }

            this.appDescrpValueList = res.data;
            // this.appDescrpValueList.forEach((item: any) => {
            //     res.data.forEach((jes: any) => {
            //         item.label = jes.appName;
            //         item.id = jes.appName;
            //     });
            // });
            // array.forEach(element => {

            // });
        });
    }

    // 通过应用说明名称(版本号) 来查询当前ID
    public getAPPDescId(name: string){

        let value:string = "";

        this.appDescrpValueList.forEach((item:any)=> {

            if(item.appNameAndVersion === name){
                value = item.appId;
            } else {
                return "";
            }
        })
        return value;

    }

    // 设置热区相关
    public flyer = {
        hotspotXAxis: "",
        hotspotYAxis: "",
        hotSpotExtent: "",
        hotSpotWidth: "",
    };
    public download = {
        hotspotXAxis: "",
        hotspotYAxis: "",
        hotSpotExtent: "",
        hotSpotWidth: "",
    };

    public getHotspotXAxis( name: string) {
        if(name === "宣传页"){
            return parseInt(this.flyer.hotspotXAxis);
        } else if(name === "下载页"){
            return parseInt(this.download.hotspotXAxis);
        } else {
            return 0
        }
        
    }

    public getHotspotYAxis( name: string) {
        if(name === "宣传页"){
            return parseInt(this.flyer.hotspotYAxis);
        } else if(name === "下载页"){
            return parseInt(this.download.hotspotYAxis);
        } else {
            return 0
        }
        
    }

    public getHotSpotExtent( name: string) {
        if(name === "宣传页"){
            return parseInt(this.flyer.hotSpotExtent);
        } else if(name === "下载页"){
            return parseInt(this.download.hotSpotExtent);
        } else {
            return 0
        }
        
    }

    public getHotSpotWidth( name: string) {
        if(name === "宣传页"){
            return parseInt(this.flyer.hotSpotWidth)
        } else if(name === "下载页"){
            return parseInt(this.download.hotSpotWidth)
        } else {
            return 0
        }
        
    }


    public flyerShow:boolean = false
    public downLoadShow:boolean = false

    // 热区背景动态展示为上传的图片
    public flyerImage:string = ""
    public downLoadImage:string = ""


    public showModal = (item: typeof this.constituteList[0]) => {
        if(item.name === "宣传页"){
            this.flyerShow = true
            this.downLoadShow = false
        } else if(item.name === "下载页"){
            this.flyerShow = false
            this.downLoadShow = true
        }
        // this.axis.hotSpotExtent = item.hotSpotExtent;
        // this.axis.hotSpotWidth = item.hotSpotWidth;
        // this.axis.hotspotXAxis = item.hotspotXAxis;
        // this.axis.hotspotYAxis = item.hotspotYAxis;
        // this.hotZoneFlag = item.name
        this.modalVisible = true;

    };
    public handleOk = () => {
        // item.hotSpotExtent = this.axis.hotSpotExtent;
        // item.hotSpotWidth = this.axis.hotSpotWidth;
        // item.hotspotXAxis = this.axis.hotspotXAxis;
        // item.hotspotYAxis = this.axis.hotspotYAxis;
        this.modalVisible = false;

    };
    public handlecancel = () => {
        if(this.flyerShow && !this.downLoadShow){

            this.flyer.hotSpotExtent = "";
            this.flyer.hotSpotWidth = "";
            this.flyer.hotspotXAxis = "";
            this.flyer.hotspotYAxis = "";
            this.flyerHotStyle = "";
        }
        if(!this.flyerShow && this.downLoadShow){
            this.download.hotSpotExtent = "";
            this.download.hotSpotWidth = "";
            this.download.hotspotXAxis = "";
            this.download.hotspotYAxis = "";
            this.downHotStyle = "";
        }

        this.modalVisible = false;
    };
    public onChange = (pageNumber: number) => {
        // console.log('Page: ', pageNumber);
    };
    public afterVisibleChange = (bool: boolean) => {
        // console.log('visible', bool);
    };
    public showDrawer = (item: any) => {
        
        if (item.name == '注册页') {
            this.dialogInfo.title = '选择注册页';
            this.dialogInfo.name = '注册名称';
            this.dialogInfo.src = imgUrl + "/dop/iug/staticFile/smallAppLogin.jpg";
        } else if (item.name == '活动页') {
            this.dialogInfo.title = '选择活动页';
            this.dialogInfo.name = '活动名称';
            this.dialogInfo.src = imgUrl + "/dop/iug/staticFile/newUserGiftPack.jpg";
        }
        this.dialogInfo.select = item;
        this.vailable = true;
    };
    public chooseDialogImg() {

        this.vailable = false;

        this.constituteList.forEach((data: any) => {
            if (data.name == this.dialogInfo.select.name) {

                data.src = this.dialogInfo.src;
                data.h5Link = this.iframeUrl
                return;
            }
        });

    }

    // 宣传页-x坐标，宽度处理
    public dealFlyerX(val:number){
        return Math.round(this.flyerWidth/this.flyerWidthFlag * val) ;
    }

    // 宣传页-y坐标，高度处理
    public dealFlyerY(val:number){
        return Math.round(this.flyerHeight/this.flyerHeightFlag * val);
    }

    // 下载页-x坐标，宽度处理
    public dealDownX(val:number){
        return Math.round(this.downWidth/this.downWidthFlag * val) ;
    }

    // 下载页-y坐标，高度处理
    public dealDownY(val:number){
        return Math.round(this.downHeight/this.downHeightFlag * val);
    }

    public setFlyerHotArea() {
        if(this.formState.displayFormat === "图片"){
            this.flyer.hotSpotExtent = this.flyer.hotSpotWidth;
        }

        if(Number(this.flyer.hotspotXAxis) > this.flyerWidthFlag){
            message.error('X坐标轴只能在图片范围内');
            this.flyer.hotspotXAxis = "";

        }
        if(Number(this.flyer.hotspotYAxis) > this.flyerHeightFlag){
            message.error('Y坐标轴只能在图片范围内');
            this.flyer.hotspotYAxis = "";

        }
        if((Number(this.flyer.hotspotXAxis) + Number(this.flyer.hotSpotWidth)) > this.flyerWidthFlag){
            message.error('宽度加X轴坐标值只能在图片范围内');
            this.flyer.hotSpotWidth = "";
            if(this.formState.displayFormat === "图片"){
                this.flyer.hotSpotExtent = "";
            }

        }
        if((Number(this.flyer.hotspotYAxis) + Number(this.flyer.hotSpotExtent)) > this.flyerHeightFlag){
            message.error('高度加Y轴坐标值只能在图片范围内');
            this.flyer.hotSpotExtent = "";

        }
        let x = parseInt(this.flyer.hotspotXAxis);
        let y = parseInt(this.flyer.hotspotYAxis);
        let w = parseInt(this.flyer.hotSpotWidth);
        let h = parseInt(this.flyer.hotSpotExtent);

        this.flyerHotStyle = 'position: absolute;top: ' + this.dealFlyerY(y) + 'px;left: ' + this.dealFlyerX(x) + 'px;width: ' + this.dealFlyerX(w) + 'px;height: ' + this.dealFlyerY(h) + 
        'px;background: rgba(0, 0, 0, 0.1); border: 1px solid rgb(255, 255, 255);';
    }

    public setDownHotArea() {
        if(Number(this.download.hotspotXAxis) > this.downWidthFlag){
            message.error('X坐标轴只能在图片范围内');
            this.download.hotspotXAxis = "";

        }
        if(Number(this.download.hotspotYAxis) > this.downHeightFlag){
            message.error('Y坐标轴只能在图片范围内');
            this.download.hotspotYAxis = "";

        }
        if((Number(this.download.hotspotXAxis) + Number(this.download.hotSpotWidth)) > this.downWidthFlag){
            message.error('宽度加X轴坐标值只能在图片范围内');
            this.download.hotSpotWidth = "";

        }
        if((Number(this.download.hotspotYAxis) + Number(this.download.hotSpotExtent)) > this.downHeightFlag){
            message.error('高度加Y轴坐标值只能在图片范围内');
            this.download.hotSpotExtent = "";

        }


        let x = parseInt(this.download.hotspotXAxis);
        let y = parseInt(this.download.hotspotYAxis);
        let w = parseInt(this.download.hotSpotWidth);
        let h = parseInt(this.download.hotSpotExtent);

        this.downHotStyle = 'position: absolute;top: ' + this.dealDownY(y) + 'px;left: ' + this.dealDownX(x) + 'px;width: ' + this.dealDownX(w) + 'px;height: ' + this.dealDownY(h) +
        'px;background: rgba(0, 0, 0, 0.1); border: 1px solid rgb(255, 255, 255);';
    }
    public handleCancel() {
        this.previewVisible = false;
        this.previewTitle = '';
    }


    // 动态展示样式
    public sssssstyle(){
        if(this.flyerShow){
            return {
                width: this.flyerWidth + "px",
                height: this.flyerHeight + "px"
            }
        }

        if(this.downLoadShow){
            return {
                width: this.downWidth + "px",
                height: this.downHeight + "px"
            }
        }
        
    }

    // 动态展示宽高
    public flyerWidth: number = 0
    public flyerHeight: number = 0
    public downWidth: number = 0
    public downHeight: number = 0
    public widthFlag: number = 0
    public heightFlag: number = 0
    public useWidth: number = 0
    public useHeight: number = 0


    public beforeUploadImg(file: any, fileList: any) {
        return new Promise((resolve, reject) => {
            const isLt10M = Number(file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                
                const currIdx = fileList.indexOf(file)
                fileList.splice(currIdx, 1)
                message.error('文件大小不能超过10MB，请重新上传。');
                console.log("第一步")

                return reject(false)

            }
            // const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
            // if (!isJpgOrPng) {
            //     message.error('上传失败，封面尺寸或格式不满足要求')
            //     return reject(false)
            // }
            // console.log("第2步")
            let w = 0,
                h = 0
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const image:any = new Image()
                image.src = reader.result
                image.onload = () => {
                    w = image.width
                    h = image.height
                    this.widthFlag = w;
                    this.heightFlag = h;
                    console.log(w,'-----')
                    console.log(h,'====')
                    if(h >= 300 || w >= 300){
                        if(h >= w){
                            this.useHeight = Math.round((300/h)*h)
                            this.useWidth = Math.round((300/h)*w)

                        } else if(h < w){
                            this.useHeight = Math.round((300/w)*h)
                            this.useWidth = Math.round((300/w)*w)
                        }

                    } else if(h < 300 || w < 300) {
                        this.useHeight = h
                        this.useWidth = w
                    }
                    // if(this.flyerShow){

                    // }
                    // if(this.downLoadShow){
                    //     if(h > 300){
                    //         this.downHeight = Math.round(h*(h/300))
                    //         this.downWidth = Math.round(w*(h/300))
                    //     }

                    // }
                    // if(w/h === 900/383){
                    //     return resolve(true)
                    // }
                    // message.error('上传失败，封面尺寸或格式不满足要求')
                    // return reject(false)
                }
            }

            console.log("width", this.flyerWidth)
            console.log("heiht", this.flyerHeight)
            console.log(isLt10M,'isLt10M')
            return resolve(true)
        })
        // return new Promise((resolve, reject) => {
        //     const isLt10M = Number(file.size / 1024 / 1024) < 10;
        //     if (!isLt10M) {
                
        //         const currIdx = fileList.indexOf(file)
        //         fileList.splice(currIdx, 1)
        //         message.info('文件大小不能超过10MB，请重新上传。');

        //         return reject(false)

        //     }

        //     return resolve(true)

        // })

        // let isLt10M = Number(file.size / 1024 / 1024) < 10;
        // if (!isLt10M) {
            
        //     const currIdx = fileList.indexOf(file)
        //     fileList.splice(currIdx, 1)
        //     message.info('文件大小不能超过10MB，请重新上传。');

        // }
        // return isLt10M;
        
    }

    public flyerWidthFlag:number = 0
    public flyerHeightFlag:number = 0
    public downWidthFlag:number = 0
    public downHeightFlag:number = 0

    public handleUploadChange(fileObjRes: any, item: any) {

        //判断文件是否上传成功
        if (fileObjRes.file.status === 'done') {

            item.fileList[0] = {
                ...item.fileList[0],
                uid: fileObjRes.file.uid,
                name: fileObjRes.file.response.defmap.data,
                url: '/dop/iug/zuul/content/file/downloadImageOrVideo/d/' + fileObjRes.file?.response.defmap.data, //加问号是为了undefined.data报错  url是线上的地址
                // preview: fileObjRes.file.thumbUrl,
            };

            if(item.name === "宣传页"){
                this.flyerFlag = true;
                this.flyerWidth = this.useWidth;
                this.flyerHeight = this.useHeight;
                this.flyerWidthFlag = this.widthFlag;
                this.flyerHeightFlag = this.heightFlag;
                this.flyerImage = '/dop/iug/zuul/content/file/downloadImageOrVideo/d/' + fileObjRes.file?.response.defmap.data;
                this.flyer.hotSpotExtent = "";
                this.flyer.hotSpotWidth = "";
                this.flyer.hotspotXAxis = "";
                this.flyer.hotspotYAxis = "";
                this.flyerHotStyle = "";
            }

            if(item.name === "下载页"){
                this.downloadFlag = true;
                this.downWidth = this.useWidth;
                this.downHeight = this.useHeight;
                this.downWidthFlag = this.widthFlag;
                this.downHeightFlag = this.heightFlag;
                this.downLoadImage = '/dop/iug/zuul/content/file/downloadImageOrVideo/d/' + fileObjRes.file?.response.defmap.data;
                this.download.hotSpotExtent = "";
                this.download.hotSpotWidth = "";
                this.download.hotspotXAxis = "";
                this.download.hotspotYAxis = "";
                this.downHotStyle = "";
            }
            //    this.getPhoto(itemFileList[0]);
        } else if(fileObjRes.file.status === 'uploading') {
            // this.loading = true
            // item.fileList = []
        } else if(fileObjRes.file.status === 'error') {
            // this.loading = false
            item.fileList.length = 0;
            message.error(`${fileObjRes.file.name} 上传失败.`);

        } else {
            // this.loading = false
            item.fileList.length = 0;
            console.log("哈哈哈哈哈")
        }
    }
    public handleUploadRemove(item: any) {
        if(item.name === "宣传页"){
            this.flyerFlag = false;
            this.flyerImage = '';
            this.flyer.hotSpotExtent = "";
            this.flyer.hotSpotWidth = "";
            this.flyer.hotspotXAxis = "";
            this.flyer.hotspotYAxis = "";
            this.flyerHotStyle = "";
            this.flyerShow = false;
            this.flyerWidthFlag = 0;
            this.flyerHeightFlag = 0;
        }

        if(item.name === "下载页"){
            this.downloadFlag = false;
            this.downLoadImage = '';
            this.download.hotSpotExtent = "";
            this.download.hotSpotWidth = "";
            this.download.hotspotXAxis = "";
            this.download.hotspotYAxis = "";
            this.downHotStyle = "";
            this.downLoadShow = false;
            this.downWidthFlag = 0;
            this.downHeightFlag = 0;

        }

    }
    public handlePreview = async (file: any) => {

        this.previewImage = file.preview || file.url || file.response.data;
        this.previewVisible = true;
        this.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    };

    public constituteList: any = [
        {
            type: '0',
            isCheck: false,
            name: '宣传页',
            uploadType: 'local',
            disabled: false,
            promoValue: '宣传页',
            fileList: [],
            // linkPath: '/loginModule/pages/propagate/propagate',
            hotspotXAxis: '',
            hotspotYAxis: '',
            hotSpotExtent: '',
            hotSpotWidth: '',
            src: '',
            h5Link: this.iframeUrl,
            required: true
        },
        {
            type: '1',
            isCheck: false,
            name: '注册页',
            uploadType: 'dialog',
            disabled: false,
            promoValue: '注册页',
            fileList: [],
            // linkPath: '/loginModule/pages/login/login',
            hotspotXAxis: '',
            hotspotYAxis: '',
            hotSpotExtent: '',
            hotSpotWidth: '',
            src: '',
            h5Link: this.iframeUrl,
            required: false
        },
        {
            type: '2',
            isCheck: false,
            name: '活动页',
            uploadType: 'dialog',
            disabled: false,
            promoValue: '活动页',
            fileList: [],
            // linkPath: '/loginModule/pages/upAction/upAction',
            hotspotXAxis: '',
            hotspotYAxis: '',
            hotSpotExtent: '',
            hotSpotWidth: '',
            src: '',
            h5Link: this.iframeUrl,
            required: false
        },
        {
            type: '3',
            isCheck: false,
            name: '深度链接',
            uploadType: null,
            disabled: false,
            promoValue: '深度链接',
            fileList: [],
            // linkPath: '',
            hotspotXAxis: '',
            hotspotYAxis: '',
            hotSpotExtent: '',
            hotSpotWidth: '',
            src: '',
            h5Link: '',
            required: false
        },
        {
            type: '4',
            isCheck: false,
            name: '下载页',
            uploadType: 'local',
            disabled: false,
            promoValue: '下载页',
            fileList: [],
            linkPath: '/loginModule/pages/upDownload/upDownload',
            hotspotXAxis: '',
            hotspotYAxis: '',
            hotSpotExtent: '',
            hotSpotWidth: '',
            src: '',
            h5Link: this.iframeUrl,
            required: true
        },
    ];
    public formRef: any = '';
    public formState: any = {
        displayFormat: '',
        promotionChannel: '',
        targetChannel: '',
        channelValidStartDate: '',
        channelValidEndDate: '',
        appDescV: undefined,
        promoValue: '',
        appNameAndVersion: ''
    };

    public targetChannel: any = '';
    //开始和结束时间
    // public channelValidStartDate: string = '';
    // public channelValidEndDate: string = '';
    //开始时间
    public disabledDateStart(current: any) {
        if (this.formState.channelValidEndDate) {
            return current > moment(this.formState.channelValidEndDate).endOf('day');
        } else {
        }
    }
    //结束时间
    public disableEndTime(current: any) {
        if (this.formState.channelValidStartDate) {
            return current && current < moment(this.formState.channelValidStartDate).subtract(1, 'days').endOf('day');
        }
    }

    //目标渠道事件
    public changeTargetRadio() {}

    
    // 应用说明
    // public appDescrpValueList: AppType[] = [];
    public appDescrpValueList: any[] = [
        {
            label: '全部',

            id: '0',
        },
        {
            label: 'app',

            id: '1',
        },
        {
            label: '微信小程序',

            id: '2',
        },
    ];
    //点击选择推广页
    public checkPiece(data: any) {
        // this.publicituteList.forEach((i:any) => {

        // });
        this.getPromotionPageName(data);
        // this.formState.promoValue = item.value
        if (data.isCheck) {
            //取消勾选
            data.isCheck = false;
            data.promoValue = '1';
        } else {
            //勾选
            data.isCheck = true;
            data.promoValue = '1';
        }
    }
    //点击提交按钮
    public submit = async () => {
        try {
            // let values = await this.formRef.validateFields();

            let params = {
                displayFormat: this.formState.displayFormat,
                promotionChannel: this.formState.promotionChannel,
                targetChannel: this.formState.targetChannel,
                taskState: '已上架', //上下架状态
                channelValidStartDate: this.formState.channelValidStartDate,
                channelValidEndDate: this.formState.channelValidEndDate,
                appDesc: this.formState.appNameAndVersion,
                appDescId: this.getAPPDescId(this.formState.appNameAndVersion),

                promottionList: this.constituteList.map((item: any) => {

                    return {
                        promotionPageName: item.name,
                        promotionPageCode: item.type,
                        h5Link: item.h5Link ? item.h5Link : "",
                        photoType: item.fileList[0]?.type || '',
                        photo: item.fileList[0]?.name ? item.fileList[0]?.name : item.src,
                        hotspotXAxis: this.getHotspotXAxis(item.name) ? this.getHotspotXAxis(item.name) : 0,
                        hotspotYAxis: this.getHotspotYAxis(item.name) ? this.getHotspotYAxis(item.name) : 0,
                        hotSpotExtent: this.getHotSpotExtent(item.name) ? this.getHotSpotExtent(item.name) : 0,
                        hotSpotWidth: this.getHotSpotWidth(item.name) ? this.getHotSpotWidth(item.name) : 0,
                        check: item.isCheck ? '1' : '0',
                        originalPhotoFile: item.fileList[0]?.name ? item.fileList[0]?.name : ""
                    };
                }),
            };
            console.log(params, 'params');

            downloadPageManageApi.getAddDownloadPage(params, {}).then((res) => {

                if (res.flag === 'success') {
                    message.info('提交成功');
                    history.go(-1);
                } else if (res.flag === 'fail') {
                    message.info('提交失败');
                }
            });
            // this.formState.labelId = this.route.query.labelId,
            // this.formState.labelAuitId = this.route.query.labelAuitId

            // systemManagementApi.getlabelRecord(this.formState,{}).then((res) => {
            //     if(res.flag === 'success'){
            //         message.info('提交成功')
            //     }else if(res.flag === 'fail'){
            //         message.info('提交失败')
            //     }
            //     })
            // this.formState = {
            //     displayFormat: '',
            //     promotionChannel: '',
            //     targetChannel: '',
            //     channelValidStartDate: '',
            //     channelValidEndDate: '',
            //     appDescV: undefined,
            //     promoValue: '',
            //     appNameAndVersion: ''
            // };
            this.$router.go(-1);
        } catch (errorInfo) {

        }
    };
    public cancel() {
        this.formState = {
            displayFormat: '',
            promotionChannel: '',
            targetChannel: '',
            channelValidStartDate: '',
            channelValidEndDate: '',
            appDescV: undefined,
            promoValue: '',
            appNameAndVersion: ''
        };
        this.$router.go(-1);
    };

    // 必选校验
    public flyerFlag:boolean = false;
    public downloadFlag:boolean = false;

    public requiredChecksum() {

        if(this.formState.displayFormat === ""){
            message.info("请选择显示样式")
            return
        }

        if(this.formState.promotionChannel === "") {
            message.info("请选择推广渠道")
            return
        }

        if(this.formState.targetChannel === "") {
            message.info("请选择目标渠道")
            return
        }

        if(!this.flyerFlag) {
            message.info("请上传宣传页")
            return
        }

        if(this.flyer.hotspotXAxis === "") {
            message.info("请输入宣传页热区的 X 轴坐标")
            return
        }
        if(this.flyer.hotspotYAxis === "") {
            message.info("请输入宣传页热区的 Y 轴坐标")
            return
        }
        if(this.flyer.hotSpotWidth === "") {
            message.info("请输入宣传页热区的 宽度")
            return
        }
        if(this.flyer.hotSpotExtent === "") {
            message.info("请输入宣传页热区的 高度")
            return
        }

        if(!this.downloadFlag) {
            message.info("请上传下载页")
            return
        }

        if(this.download.hotspotXAxis === "") {
            message.info("请输入下载页热区的 X 轴坐标")
            return
        }
        if(this.download.hotspotYAxis === "") {
            message.info("请输入下载页热区的 Y 轴坐标")
            return
        }
        if(this.download.hotSpotWidth === "") {
            message.info("请输入下载页热区的 宽度")
            return
        }
        if(this.download.hotSpotExtent === "") {
            message.info("请输入下载页热区的 高度")
            return
        }

        if(this.formState.channelValidStartDate === "") {
            message.info("请选择渠道有效期中的开始时间")
            return
        }

        if(this.formState.channelValidEndDate === "") {
            message.info("请选择渠道有效期中的结束时间")
            return
        }

        if(this.formState.appNameAndVersion === "") {
            message.info("请选择应用说明")
            return
        }

        this.submit()

    }

    public deletePage( item: any ) {
        item.src = ""

    }
}
</script>

<style lang="less" scoped>
.down {
    padding: 20px;
    background: #ffffff;
    width: 100%;
    height: 100%;
}

.required {
    font-size: 20px;
    color: #e8380d;
    margin-right: 8px;
    position: absolute;
    top: 1px;
    left: 24px;

}

.down-item {
    display: flex;
    align-items: center;
    margin: 10px 15px 30px 15px;
}
.down-item-promot {
    display: flex;
    margin: 10px 15px;
}
.item-left {
    width: 100px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    position: relative;
}

.item-left::before {
    position: absolute;
    content: "*";
    font-size: 20px;
    color: #e8380d;
    top: 3px;
    left: -13px;
}
.item-left-promot {
    width: 100px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
}
.item-right {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
}
.item-right-promot {
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
}
.link-show{
    min-width: 300px;
    border-radius: 4px;
    border: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0;
    box-shadow: none;
}

.promot-button-select {
    width: 108px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #CFCFCF;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    cursor: pointer;
    position: relative;
    background: #F9F9F9;
    color: #333333;
}
.promot-button-select::before {
    content: "";
    display: block;
    position: absolute;
    left: 46px;
    top: 31px;
    border-width: 7px;
    border-style: solid dashed dashed dashed;
    border-color: #CFCFCF transparent transparent transparent;
}
.promot-button-selected {
    width: 108px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid red;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    cursor: pointer;
    position: relative;
    background: #FFF6F4;
    color: #E8380D;
}
.promot-button-selected::before {
    content: "";
    display: block;
    position: absolute;
    left: 46px;
    top: 31px;
    border-width: 7px;
    border-style: solid dashed dashed dashed;
    border-color: #E8380D transparent transparent transparent;
}
.promot-button-text {
    line-height: 32px;
    margin-right: 15px;
}
.tick-select {
    width: 14px;
    height: 14px;
    background: linear-gradient(-45deg, #CFCFCF 50%, transparent 50%);
    border-bottom-right-radius: 4px;
    color: white;
    text-align: end;
    font-size: 4px;
}
.tick-selected {
    width: 14px;
    height: 14px;
    background: linear-gradient(-45deg, red 50%, transparent 50%);
    border-bottom-right-radius: 4px;
    color: white;
    text-align: end;
    font-size: 4px;
}
.promot-img {
    width: 108px;
    height: 227px;
    background: white;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    text-align: center;
}
.promot-img img {
    width: 80px;
    height: 227px;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.08);
}
.promot-page {
    width: 108px;
    height: 227px;
    background: white;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.promot-page img {
    width: 108px;
    height: 227px;
    object-fit: cover;
    object-position: top;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.08);
}
.preview-content {
    width: 108px;
    height: 227px;
    overflow: auto;
    border-top: none;
    border-right: 1px solid rgb(247, 247, 247);
    border-bottom: 1px solid rgb(247, 247, 247);
    border-left: 1px solid rgb(247, 247, 247);
    border-image: initial;
    box-shadow: rgb(235 235 235) 0 2px 4px;
    border-radius: 4px;
}

.button-area {
    display: flex;
    justify-content: end;
    border-top: 1px solid #F2F2F2;
    padding: 20px 0;
}

.cancelBtn {
    margin-left: 655px;
    margin-right: 20px;
    width: 84px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #bfbfbf;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
}

.submitBtn {
    width: 84px;
    height: 32px;
    background: #e8380d;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
}

.appDescrip {
    width: 274px;
    height: 32px;
    border-radius: 4px;
    // border: 1px solid #ababab;
}

.promot-area {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
}

.publicitute-downbox {
    display: flex;

    .downbox-piece {
        width: 108px;
        // height: 200px;
        // margin-bottom: 20px;
    }

    .downbox-imgLocal {
        width: 100%;
        // height: 100%;
        margin-top: 20px;
    }

    .downbox-sethotBtn {
        margin-top: 10px;
        margin-left: 9px;
        // margin-bottom: 20px;
        width: 84px;
        height: 32px;
        background: #e8380d;
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
    }
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border-radius: 4px;
    border: 1px solid #ababab;
}

.validityPeriodDate {
    width: 124px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

:deep(.ant-upload-select-picture-card) {
    width: 108px;
    height: 227px;
    text-align: center;
    vertical-align: top;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.3s;
    border: none;
}

:deep(.ant-upload-list-picture-card-container) {
    width: 108px;
    height: 227px;
    text-align: center;
    vertical-align: top;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.3s;
    border: none;
}

//上传之后的图片外边框
.ant-upload-list-picture-card .ant-upload-list-item {
    height: 200px;
}

.downbox-sethotBtn {
    margin-top: 10px;
    margin-left: 9px;
    // margin-bottom: 20px;
    width: 84px;
    height: 32px;
    background: #e8380d;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
}

.hot-layout {
    display: flex;
    // width: 520px;
    // height: 422px;
    background: #FFFFFF;
    border-radius: 6px;

    .hot-layout-right {
        /* text-align: center; */
        width: 310px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .image-layout {
            display: flex;

            .image-text{
                writing-mode:vertical-rl;
                text-align: center;
            }

            .top {
                position: relative;
                // background-color: pink;
                // width: 145px;
                // height: 300px;
    
                img {
                    max-width: 300px;
                    max-height: 300px;
                    // margin-bottom: 6px;
                }
    
                .hot-area{
                    // width: 112px;
                    // height: 243px;
                    // background-color: pink;
                    border: 1px dashed #ababab;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
        }

        .text {
            height: 16px;
            font-size: 10px;
            font-family: PingFang-SC-Regular, PingFang-SC;
            font-weight: 400;
            color: #333333;
            text-align: center;
            line-height: 16px;
        }
    }

    .hot-layout-left {
        margin-top: 40px;
        padding-left: 15px;

        .left-item {
            margin-bottom: 12px;
            display:flex;

            .left-text {
                width: 68px;
                margin-right: 5px;
                height: 20px;
                font-size: 14px;
                font-family: PingFang-SC-Regular, PingFang-SC;
                font-weight: 400;
                color: #333333;
                line-height: 32px;
            }
        }
    }

}

.reach {
    margin-left: 6px;
    margin-right: 6px;
}

.page-masks {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.page-masks:hover {
    opacity: 0.7;
    background-color: darkgray;
    border-radius: 4px;
}

.page-masks:hover .masks-button {
    width: 50px;
    height: 30px;
    background-color: #333333;
    color: white;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    display: block;

}

.masks-button {
    display:none;
}

.input-border {
    width: 120px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

.page-upload-center {
    width: 100px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.active-upload-center {
    width: 100px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /* color: #333333; */
    cursor: pointer;
}
.next-icon {
    width: 12px;
    height: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #2443BC;
    border-radius: 50%;
    background-color: #F2F4FF;
    margin-left: 7px;
    font-size: 3px;
}

.upload-text-style {
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #2443BC;
    line-height: 20px;
}

.wrapper {
    background-color: #f9f9f9;
    width: 100%;
    height: 100%;
    padding: 10px;

    .box {
        padding: 5px;

        .up {
            margin-left: 4px;
            width: 96px;
            height: 22px;
            font-size: 16px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #333333;
            line-height: 22px;
        }

        .down {
            margin-top: 10px;
            padding: 20px;
            background: #ffffff;
            width: 100%;
            height: 99%;

            .addDownlodTitle {
                margin-left: 5px;
                margin-bottom: 30px;
                height: 30px;
                font-size: 14px;
                font-family: PingFang-SC-Regular, PingFang-SC;
                font-weight: 400;
                color: #333333;
                line-height: 20px;
            }
        }
    }

    .ant-form-item-label > label {
        width: 84px;
        margin-right: 30px;
    }

    // .addValue{
    //     margin-left: 42px;
    // }
    .to {
        margin-left: 4px;
        margin-right: 4px;
    }

    // .addDateValue{
    //     margin-left: 18px;
    // }
    .appDescrip {
        width: 274px;
        height: 32px;
        border-radius: 4px;
        // border: 1px solid #ababab;
    }

    .addDowlodBtn {
        margin-top: 120px;
        margin-left: 5px;
    }

    .previewBtn {
        margin-right: 655px;
        width: 84px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #e8380d;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #e8380d;
        line-height: 24px;
    }

    .cancelBtn {
        margin-left: 655px;
        margin-right: 20px;
        width: 84px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #bfbfbf;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
    }

    .submitBtn {
        width: 84px;
        height: 32px;
        background: #e8380d;
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
    }

    .promopublicitute {
        height: 20px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
    }

    .publicitute-upbox {
        margin-top: 20px;
        margin-bottom: 10px;

        // display: flex;
        .publicitute-piece {
            margin-right: 10px;
            text-align: center;
            width: 105px;
            height: 60px;
            border-radius: 4px;
            border: 1px solid #ababab;
            font-size: 14px;
            font-family: PingFang-SC-Regular, PingFang-SC;
            font-weight: 400;
            color: #333333;
            line-height: 54px;
        }
    }

    .promopubliciteRow {
        margin-left: 5px;
        margin-bottom: 70px;
        height: 340px;
    }

    .publicitute-downbox {
        display: flex;

        // margin-bottom: 20px;
        // width: 592px;
        // height: 226px;
        // background: #F7F7F7;
        // border-radius: 8px;
        .downbox-piece {
            margin-right: 10px;
            width: 108px;
            height: 200px;
            // margin-bottom: 20px;
        }

        .downbox-imgLocal {
            width: 100%;
            height: 100%;
            margin-top: 20px;
        }

        .downbox-sethotBtn {
            margin-top: 10px;
            margin-left: 9px;
            // margin-bottom: 20px;
            width: 84px;
            height: 32px;
            background: #e8380d;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFang-SC-Regular, PingFang-SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 20px;
        }
    }

    .publiciPage-box {
        display: flex;
    }

    // .ant-upload-select-picture-card i {
    //   font-size: 32px;
    //   color: #999;
    // }

    // .ant-upload-select-picture-card .ant-upload-text {
    //   margin-top: 8px;
    //   color: #666;
    // }
    :deep(.ant-upload-select-picture-card) {
        width: 108px;
        height: 200px;
        margin-right: 8px;
        margin-bottom: 8px;
        text-align: center;
        vertical-align: top;
        background-color: #fff;
        border: 1px dashed #d9d9d9;
        border-radius: 2px;
        cursor: pointer;
        transition: border-color 0.3s;
    }

    :deep(.ant-upload-list-picture-card-container) {
        width: 108px;
        height: 200px;
        margin-right: 8px;
        margin-bottom: 8px;
        text-align: center;
        vertical-align: top;
        background-color: #fff;
        border: 1px dashed #d9d9d9;
        border-radius: 2px;
        cursor: pointer;
        transition: border-color 0.3s;
    }

    //上传之后的图片外边框
    .ant-upload-list-picture-card .ant-upload-list-item {
        height: 200px;
    }

    .dialogBtn {
        // line-height: 200px;
        // background: transparent;
        background: transparent;
        // border: 0.5px dashed #d9d9d9;
    }

    .dialogBtn-box {
        border: 0.5px dashed #d9d9d9;
        /* text-align: center; */
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .drawCol {
        margin-right: 24px;
    }

    .pagination {
        display: flex;
    }

    .ant-modal-title {
        width: 64px;
        height: 22px;
        font-size: 16px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }

    .ant-btn-primary {
        width: 84px;
        height: 32px;
        background: #e8380d;
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFang-SC-Regular, PingFang-SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 32px;
    }
}

.pop-bg {
    width: 100%;
    height: 100%;
    padding: 24px;
    background: #f4f4f4;
    border-radius: 8px;
}
.preview-content {
    width: 300px;
    height: 350px;
    overflow: auto;
    border-top: none;
    border-right: 1px solid rgb(247, 247, 247);
    border-bottom: 1px solid rgb(247, 247, 247);
    border-left: 1px solid rgb(247, 247, 247);
    border-image: initial;
    box-shadow: rgb(235 235 235) 0 2px 4px;
    border-radius: 4px;
}


.page_preview-content img {
    border-radius: 4px;
    width: 108px;
    height: 227px;
    object-fit: cover;
    object-position: top;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item-thumbnail img) {
    position: static;
    display: block;
    /* width: 100%; */
    /* height: 100%; */
    -o-object-fit: cover;
    /* object-fit: contain; */
    width: 108px;
    height: 227px;
    object-fit: cover;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item){
    padding: 0px;
}

</style>
