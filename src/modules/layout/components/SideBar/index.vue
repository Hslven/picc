<template>
    <a-layout-sider :class="{'collapsed':collapsed}" v-model:collapsed="collapsed" :trigger="null" collapsible :width="200" style="background-color: #fff;">
        <logo :collapse="collapsed"/>
        <a-menu
                theme="light"
                :selectedKeys="[$route.path]"
                mode="inline"
                @openChange="onOpenChange"
        >
<!--          :openKeys="openKeys"-->
            <SidebarItem
                    v-for="route in routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                    :is-collapse="collapsed"
            />
        </a-menu>
    </a-layout-sider>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Watch} from 'vue-property-decorator';
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'
import {permissionStore} from '@/libs/Permission';
import {global} from '@/libs/Global';

@Options({components:{SidebarItem,Logo}})
export default class SideBar extends Vue {
    public openKeys:string[]=[]
    public rootSubmenuKeys:string[]= []
    get routes(){
        return permissionStore.routes
    }
    get dynamicRoutes(){
        return permissionStore.addRoutes
    }
    get collapsed(){
        return  global.collapsed
    }

    public onOpenChange(openKeys: string[]){
        const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            this.openKeys = openKeys;
        } else {
            this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
    }
    @Watch('$route')
    public onRouteChange(route:any){
        const latestOpenKey = route.matched[0].path;
        if (this.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            this.openKeys = [latestOpenKey];
        } else {
            this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
    }
    public created(){
        this.dynamicRoutes.forEach(item=>{
            this.rootSubmenuKeys.push(item.path)
        })
        const latestOpenKey = this.$route.matched[0].path;
        if (this.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            this.openKeys = [latestOpenKey];
        } else {
            this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
    }
}
</script>
<style lang="less">
.ant-menu-item-selected {
    color: red !important; 
}
</style>
