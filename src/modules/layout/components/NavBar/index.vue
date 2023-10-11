<template>
    <div class="navbar-container" id="navbarContainer">
        <div class="navbar-left">
            
        </div>
        <div class="navbar-right">
            <div style="display: flex;">
                <div class="hamburger-container" :class="{'collapsed':collapsed}" @click="toggleClick">
                    <svg-icon class="hamburger" name="hamburger" size="20" />
                </div>
                <Breadcrumb />
            </div>
            <div style="display: flex;">
                <a-dropdown class="right-menu-item" :trigger="['click']">
                    <div class="right-menu-item">
                        <svg-icon class="theme" name="theme" size="18" />
                    </div>
                    <template #overlay>
                        <a-menu @click="onSelectTheme">
                            <a-menu-item :key="item" v-for="item in themesOptions">
                                <span>{{$t('theme.'+item)}}</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-dropdown class="right-menu-item" :trigger="['click']">
                    <div>
                        <svg-icon class="language" name="language" size="18" />
                    </div>
                    <template #overlay>
                        <a-menu @click="onSelectLanguage">
                            <a-menu-item key="zh-cn" :disabled="language==='zh-cn'">
                                <span>简体中文</span>
                            </a-menu-item>
                            <a-menu-item key="en" :disabled="language==='en'">
                                <span>English</span>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <a-dropdown class="right-menu-item user-container" :trigger="['click']">
                    <div class="avatar-wrapper">
                        <a-avatar>
                            <template #icon>
                                <img :src="avatar+'?imageView2/1/w/80/h/80'" />
                            </template>
                        </a-avatar>
                    </div>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="jumpToPage('/home')">
                                {{$t('navbar.首页')}}
                            </a-menu-item>
                            <a-menu-item @click="jumpToPage('/personal')">
                                {{$t('navbar.个人中心')}}
                            </a-menu-item>
                             <a-menu-item @click="switchApp">
                                {{$t('切换应用')}}
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item @click="logout">
                                {{$t('navbar.退出登录')}}
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
    <!-- <div class="bread-crumb-style">
        <Breadcrumb />
    </div> -->
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.vue';
import TagsView from '../../components/TagsView/index.vue';
import { global } from '@/libs/Global';
import { ConfigProvider } from 'ant-design-vue';
import { themeStore } from '@/libs/Theme';
import Logo from './Logo.vue'

@Options({ components: { Breadcrumb,TagsView,Logo } })
export default class NavBar extends Vue {
    public get collapsed(){
        return  global.collapsed
    }
    public get avatar() {
        return global.userInfo.avatar
    }
    public get language(){
        return global.language
    }
    public get themesOptions(){
        return themeStore.themesOptions
    }
    public toggleClick(){
        global.setCollapsed()
    }
    public onSelectTheme({key}:any){
        themeStore.chooseTheme(key);
        ConfigProvider.config({
            theme: {
                primaryColor: themeStore.mColor,
            },
        })
        document.documentElement.style.setProperty('--custom-primary-color', themeStore.mColor);
    }
    public onSelectLanguage({key}:any){
        global.setLanguage(key)
        this.$i18n.locale=key
    }
    public logout() {
        global.clear()
        this.$router.push('/login')
    }
    public switchApp() {
        this.$router.push('/appSelect')
    }
    public jumpToPage(path:string){
        this.$router.push(path);
    }
}
</script>

<style lang="less" scoped>
.navbar-container{
    width: 100%;
    position: relative;
    height: 56px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    .navbar-left{
        // display: flex;
        // align-items: center;
        float: left;
        height: 100%;
        // width: 220px;
    }
    .navbar-right{
        display: flex;
        height: 100%;
        justify-content: space-between;

        .hamburger-container{
            display: flex;
            align-items: center;
            padding: 0 15px;
            height: 100%;
            cursor: pointer;
            transition: background 0.3s;
            &:hover{
                background: rgba(0, 0, 0, 0.025);
            }
            .hamburger{
                transform: rotate(180deg);
            }
        }
        .hamburger-container.collapsed{
            .hamburger{
                transform: rotate(360deg);
            }
        }
        .right-menu-item{
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 8px;
            color: #5a5e66;
            cursor:pointer;
            transition: background .3s;
            &:hover{
                background: rgba(0, 0, 0, .025)
            }
        }
        .user-container{
            margin-right: 30px;
        }
    }
    .drawer-wrap{
        .close-icon{
            cursor:pointer;
        }
        .setting-bar-item{
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            .label{
                flex: 1;
            }
            :deep(.vc-color-wrap){
                width: 24px;
            }
        }
    }
}
.bread-crumb-style {
    // margin: 6px 0 0 5px;
    font-weight: 900;
    margin-left: 10px;
    padding-top: 3px;
}
</style>
