<!-- 应用说明页管理 -->
<template>
    <div>
      <div>
        <appChoose />
      </div>
      <div>
        <appTable />
      </div>
    </div>
    </template>
      
    <script lang="ts">
    import { Options, Vue } from 'vue-class-component';
    import appChoose from './components/appChoose.vue'
    import appTable from './components/appTable.vue'
    
    @Options({
      components:{
          appTable,
          appChoose
      }
    })
    export default class appDescription extends Vue {
    
    }
    </script>
      
    <style lang="less" scoped>
    </style>