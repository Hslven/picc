<!-- 下载页详情 -->
<template>
    <div class="down">
        <div class="down-item">
            <div class="item-left">显示样式：</div>
            <div class="item-right">{{displayFormat}}</div>
        </div>
        <div class="down-item">
            <div class="item-left">推广渠道：</div>
            <div class="item-right">{{promotionChannel}}</div>
        </div>
        <div class="down-item">
            <div class="item-left">目标渠道：</div>
            <div class="item-right">{{targetChannel}}</div>
        </div>
        <div class="down-item-promot">
            <div class="item-left-promot">推广页组成：</div>
            <div class="item-right-promot">
                (图片格式：JPG、JPEG、PNG、GIF 图片或海报的大小均为10M以内)
                <div style="display: flex;margin-top: 20px;margin-bottom: 20px;">
                    <div v-for="item in constituteList" style="margin-right: 17px;">
                        <!-- <div :class="[item.isCheck?'promot-button-selected':'promot-button-select']"
                        @click="checkPiece(item)">
                            <div class="promot-button-text">
                                <span v-if="item.required" class="required" >*</span>
                                {{item.name}}
                            </div>
                            <div :class="[item.isCheck?'tick-selected':'tick-select']">✔</div>
                        </div> -->
                        <div class="promot-button">
                            <div class="promot-button-text">
                                {{item.promotionPageName}}
                            </div>
                            <div class="tick-selected">✔</div>
                        </div>
                        <div v-if="item.promotionPageName !== '深度链接'" class="promot-img">
                            <img v-if="item.promotionPageName === '宣传页' || item.promotionPageName === '下载页'"
                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/d/' + item.photo" alt="">
                            <img v-if="item.promotionPageName === '注册页' || item.promotionPageName === '活动页'"
                            :src="item.photo" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="down-item">
            <div class="item-left">渠道有效期：</div>
            <div class="item-right">
                {{channelValidStartDate}} 至 {{channelValidEndDate}}
            </div>
        </div>
        <div class="down-item">
            <div class="item-left">应用说明：</div>
            <div class="item-right">
                {{appDescV}}
            </div>
        </div>
        <div v-if="displayFormat === '链接'" class="down-item">
            <div class="item-left">长链接地址：</div>
            <div class="item-right">
                <a-input
                    id="longLink"
                    class="link-show"
                    :readonly="true"
                    v-model:value="longLink" />
                <button
                    class="copy-botton-long"
                    @click="copyText('long')"
                    data-clipboard-action="copy"
                    data-clipboard-target="#longLink">复制</button>
            </div>
        </div>
        <div v-if="displayFormat === '链接'" class="down-item">
            <div class="item-left">短链接地址：</div>
            <div class="item-right">
                <a-input
                    id="shortLink"
                    class="link-show"
                    :readonly="true"
                    v-model:value="shortLink" />
                <button
                    class="copy-botton-short"
                    @click="copyText('short')"
                    data-clipboard-action="copy"
                    data-clipboard-target="#shortLink">复制</button>
            </div>
        </div>
        <div class="button-area">
            <a-button @click="cancel">返回</a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { downloadPageManageApi } from '@/libs/api';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import Clipboard from 'clipboard'
import { baseApi } from '@/libs/BaseApi';

// 文件类型
interface fileType {
    type: string,
    name: string,
    url: string
}

// 推广页类型
interface promotType {
    promotionPageName: string,
    uploadType: string,
    photo: string,
    fileList: fileType[]
}

@Options({
    components: {
        PlusOutlined,
    }
})
export default class example extends Vue {
    created() {
        this.getQueryDownloadPageDetail();
    }

    public route = useRoute();
    public displayFormat:string = '';
    public promotionChannel:string = '';
    public targetChannel:string = '';
    public channelValidStartDate:string = '';
    public channelValidEndDate:string = '';
    public appDescV:string = '';
    public longLink:string = '';
    public shortLink:string = '';
    public constituteList: promotType[] = [];
    
    public qrcodeSrc:string = '';


    //根据ID获取回显的详情信息 ID是列表页传来的
    public getQueryDownloadPageDetail() {
        let param = {
            downloadPagePromotionId: this.route.query.downloadPagePromotionId,
        };

        this.constituteList = [];
        downloadPageManageApi.getQueryDownloadPageDetail(param, {}).then((res: any) => {
            
            this.displayFormat = res.defmap.displayFormat;
            this.promotionChannel = res.defmap.promotionChannel;
            this.targetChannel = res.defmap.targetChannel;
            this.channelValidStartDate = res.defmap.channelValidStartDate;
            this.channelValidEndDate = res.defmap.channelValidEndDate;
            this.appDescV = res.defmap.appDesc;
            this.longLink = res.defmap.longLink;
            this.shortLink = res.defmap.shortLink;

            res.defmap.promotionPageComponent.forEach((item: any) => {
                if(item.promotionPageName === "宣传页"){
                    // baseApi.post(
                    //     `/content/file/downloadImageOrVideo/d/${item.photo}`, {
                    //         responseType: 'blob',
                    //     })
                    downloadPageManageApi.getPhoto(item.photo, {responseType: 'blob'}).then((res: any) => {

                        // let binaryData = [];
                        // binaryData.push(res.data);
                        // let url = window.URL.createObjectURL(new Blob(binaryData));

                        
                        var  url = "data:image/png;base64,";
                        this.qrcodeSrc = url + res.data;

                        /* export const showImg = param => {
                            return axios.request({
                                url: '/api/v1/note/commodity/showImg',
                                method: 'get',
                                params: param,
                                
                            })
                            } */

                        //  = window.URL.createObjectURL(res.data);
                        // data.url = ''//接口不通  给全路径

                    });
                }

                this.constituteList.push(item)
            });
        });
    }

    public cancel() {
        this.$router.go(-1);
    }

    public copyText( param: string ) {
        let target = param === "long" ? ".copy-botton-long" : ".copy-botton-short";
        let clipboard = new Clipboard(target)
        clipboard.on('success', () => {
            message.info('复制链接成功');
            // 释放内存
            clipboard.destroy()
        })
        clipboard.on('error', () => {
            // 释放内存
            clipboard.destroy()
        })
    }

}
</script>

<style lang="less" scoped>
.down {
    padding: 20px;
    background: #ffffff;
    width: 100%;
    height: 99%;
}

.copy-botton-long,.copy-botton-short {
    width: 50px;
    height: 26px;
    background: #EBEBEB;
    border-radius: 4px;
    margin-left: 10px;
    border: none;
    cursor: pointer;
}

.down-item {
    display: flex;
    align-items: center;
    margin: 10px 15px 20px 15px;
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
    color: #999999;
    line-height: 20px;
}
.item-left-promot {
    width: 100px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #999999;
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

// .promot-button {
//     width: 105px;
//     height: 60px;
//     background: rgb(255, 246, 244);
//     color: rgb(232, 56, 13);
//     border-radius: 4px;
//     border: 1px solid #CFCFCF;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
.promot-button {
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
.promot-button::before {
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
// .tick-select {
//     width: 14px;
//     height: 14px;
//     background: linear-gradient(-45deg, #CFCFCF 50%, transparent 50%);
//     border-bottom-right-radius: 4px;
//     color: white;
//     text-align: end;
//     font-size: 4px;
// }
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
    // background: #333333;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.08);
    border-radius: 4px;
    margin-top: 20px;
    text-align: center;
}
.promot-img img {
    width: 108px;
    height: 227px;
    border-radius: 4px;
    object-fit: cover;
    object-position: top;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.08);
}
.preview-content {
    width: 105px;
    height: 130px;
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

</style>
