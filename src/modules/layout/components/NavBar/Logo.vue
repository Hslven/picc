<template>
    <div class="sidebar-logo-container">
            <transition name="sidebarLogoFade">
                <router-link v-if="collapse" class="sidebar-logo-link" to="/">
                    <!-- <img src="https://armour.github.io/vue-typescript-admin-template/favicon.ico" class="sidebar-logo" :class="{'collapse':collapse}" alt=""> -->
                   <img src="@/assets/layout/picclogo.png" class="sidebar-logo" :class="{ 'collapse': collapse }" alt="">
                </router-link>
                <router-link v-else class="sidebar-logo-link" to="/">
                    <!-- <img src="https://armour.github.io/vue-typescript-admin-template/favicon.ico" class="sidebar-logo" alt="">
                <h1 class="sidebar-title">{{ title }}</h1> -->
                   <img src="@/assets/layout/picclogo.png" alt="" style="width:70%;height:70%;display: block;margin:10px auto"/>
                </router-link>
            </transition>
        </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import SvgIcon from '@/components/SvgIcon/index.vue'
@Options({components:{SvgIcon}})
export default class Logo extends Vue {
    @Prop({ default: true }) public collapse! : boolean;
    @Prop({ default: 'Vue Antd Admin' }) public title! : string;
}
</script>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #fff;
    overflow: hidden;
    text-align: center;
    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 12px;
        }
        & .sidebar-logo.collapse{
            margin-right: 0;
        }
        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            font-weight: 600;
            line-height: 50px;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            vertical-align: middle;
        }
    }
}
</style>
