<template>
    <div class="breadcrumb-container">
        <a-breadcrumb>
            <transition-group name="breadcrumb">
                <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path" class="breadcrumb-item">
                    <router-link v-if="index === 0 && breadcrumbList.length > 1" :to="item.path">{{ item.meta.title }}</router-link>
                    <span v-else>{{ item.meta.title }}</span>
                </a-breadcrumb-item>
            </transition-group>
        </a-breadcrumb>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

@Options({})
export default class Breadcrumb extends Vue {
    public breadcrumbList:any =[]
    public getBreadCrumb() {
        const matched = this.$route.matched.filter(item => item.meta && item.meta.title);
        const home = {
            path: '/home',
            meta: {
                title: this.locale==='zh-cn'?'首页':'Home Page'
            }
        };
     
        if (matched[0].path == '/home') {
            this.breadcrumbList = [home];
        } else {

            // this.breadcrumbList = [matched[1]];
            this.breadcrumbList = [ home, ...matched];
        }
        // const agreement = {
        //     path: '/agreement',
        //     meta: {
        //         title: this.locale==='zh-cn'?'协议':'Agreement Page'
        //     }
        // };
        // if (matched[0].path == '/home') {
        //     this.breadcrumbList = [home];
        // } else if (matched[1].path == '/agreement') {
        //     this.breadcrumbList = [home, agreement];
        // } else {
        //     this.breadcrumbList = [home, agreement, ...matched];
        // }
    }
    public created(){
        this.getBreadCrumb()
    }
    @Watch('$route')
    public onRouteChange(route: any) {
        // if you go to the redirect page, do not update the breadcrumbs
        if (route.path.startsWith('/redirect/')) {
            return
        }
        this.getBreadCrumb()
    }
    get locale(){
        return this.$i18n.locale
    }
   @Watch('locale')
   public onLocaleChange() {
       this.getBreadCrumb()
   }
}
</script>

<style lang="less" scoped>
.breadcrumb-container{
    display: flex;
    align-items: center;
    height: 100%;
    .breadcrumb-item{
        float: left;
        display: flex;
        align-items: center;
    }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
    transition: all 0.5s ease;
}
.breadcrumb-enter-from,
.breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
}
.breadcrumb-leave-active {
    position: absolute;
    z-index: -1;
}
</style>
