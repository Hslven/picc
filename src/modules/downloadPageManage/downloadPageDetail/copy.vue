<!-- 下载页详情 -->
<template>
    <div>
      <div class="wrapper">
        <a-row class="detailRow">
          <a-col class="detailTitle">显示样式：</a-col>
          <a-col class="detailContent">000</a-col>
        </a-row>
        <a-row class="detailRow">
          <a-col class="detailTitle">推广渠道：</a-col>
          <a-col class="detailContent">1111</a-col>
        </a-row>
        <a-row class="detailRow">
          <a-col class="detailTitle">目标渠道：</a-col>
          <a-col class="detailContent">2222</a-col>
        </a-row>
        <a-row class="detailRow">
          <a-col class="detailTitle">推广页组成：</a-col>
          <div class="promoBox">
            <div class="detailList" v-for="item in constituteList">
              <div class="dName">{{ item.name }}</div>
              <div v-if="item.uploadType === 'local'">
                  <img class="promo-img" 
                        src="https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF"
                        alt="">
                  <a-button class="downloadBtn">下载</a-button>
              </div>
            </div>
          </div>
        </a-row>
        <a-row class="detailRow">
          <a-col class="detailTitle">渠道有效期：</a-col>
          <a-col class="detailContent">{{  }}<span class="to">至</span>{{  }}</a-col>
        </a-row>
        <a-row class="detailRow">
          <a-col class="detailTitle">应用说明：</a-col>
          <a-col class="detailContent">{{  }}</a-col>
        </a-row>
        <a-row v-if="1===1" class="detailRow">
          <a-col class="detailTitle">长链接地址：</a-col>
          <a-col class="detailContent">{{  }}</a-col>
          <a-col>
            <a-button class="copyBtn" @click="copy">复制</a-button>
          </a-col>
        </a-row>
        <a-row v-if="1===1" class="detailRow">
          <a-col class="detailTitle">短链接地址：</a-col>
          <a-col class="detailContent">{{  }}</a-col>
          <a-col>
            <a-button class="copyBtn" @click="copy">复制</a-button>
          </a-col>
        </a-row>
      </div>
      <a-button class="backBtn" @click="back">返回</a-button>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({
	components:{
	}
})
export default class example extends Vue{
    created(){
        
    }
}

</script>
<style lang="less">
.wrapper{
  margin-left:40px;
  margin-top:40px;
  .detailRow{
    margin-bottom:32px;
  }
  .detailTitle{
    margin-right:20px;
    width:84px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
  .detailContent{
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }
  .to{
    margin-left:5px;
    margin-right:5px;
  }
}
.promoBox{
  display:flex;
}
.backBtn{
  margin-top: 60px;
  margin-left: 800px;
  width: 84px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #BFBFBF;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
.copyBtn{
  width: 57px;
  height: 20px;
  background: #EBEBEB;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #333333;
  line-height: 11px;
  text-align: center;
}
.downloadBtn{
  width: 84px;
  height: 32px;
  background: #E8380D;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 20px;
}
.dName{
  width: 105px;
  height: 60px;
  background: #F6F6F6;
  border-radius: 4px;
  border: 1px solid #CFCFCF;
  font-size: 14px;
  font-family: PingFang-SC-Semibold, PingFang-SC;
  font-weight: 600;
  color: #333333;
  line-height: 20px;
}

</style>