<template>
    <a-layout>
        <!--SideBar部分-->
        <SideBar />
        <a-layout class="main-container" :class="{'collapsed':collapsed}">
            <!--header部分-->
            <a-layout-header class="layout-header">
                <Navbar />
                <TagsView />
            </a-layout-header>
            <!--主体内容部分-->
            <a-layout-content class="container">
                <AppMain />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import AppMain from './components/AppMain.vue'
import Navbar from './components/NavBar/index.vue'
import SideBar from './components/SideBar/index.vue'
import TagsView from './components/TagsView/index.vue'
import {global} from '@/libs/Global';
@Options({
    components: {
        AppMain,
        Navbar,
        SideBar,
        TagsView
    }
})
export default class Layout extends Vue {
    get collapsed(){
        return  global.collapsed
    }
}
</script>

<style lang="less" scoped>
.main-container{
    margin-left: 200px;
    transition: margin-left .28s;
    .ant-layout-header{
        width: 100%;
        padding: 0;
        height: auto;
        line-height: initial;
        background: transparent;
    }
    .container{
        position: relative;
        width: 100%;
        margin-top: -3px;
        overflow: hidden;
        background: #f1f1f1;
        // margin-left: -10px;
    }
}
.main-container.collapsed{
    margin-left: 54px;
}
</style>

