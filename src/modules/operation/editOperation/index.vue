<!-- 新增运营位 -->
<template>
  <div>
    <div class="addOperation">
      <p class="information-name">基础信息</p>
      <div>
        <addInformation></addInformation>
      </div>
    </div>
    <div class="partition"></div>
    <div class="addOperation">
      <p class="information-name">配置规则</p>
      <configRule
        style="margin-top:10px"
      ></configRule>
    </div>
  </div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import addInformation from './components/addInformation.vue'
import configRule from './components/configRule.vue'

@Options({
  components:{
    addInformation,
    configRule
  }
})
export default class addoperation extends Vue {

}
</script>
  
<style lang="less" scoped>
.addOperation{
  margin: 0 auto;
  width: 94%;
}
.information-name{
  padding-top:1%;
  width: 64px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  padding-bottom:6px;
  border-bottom: solid 2px #E8380D;
}
.partition{
	width: 100%;
	height: 20px;
	background: #eee;
  margin-top:30px
}
</style>