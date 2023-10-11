import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import './registerServiceWorker';
import App from './App.vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import localeLanguage from './i18n';
const enLocale:any=localeLanguage['en']
const zhLocale:any=localeLanguage['zh-cn']
const messages = {
    en: {
        ...enLocale,
        ...enUS
    },
    'zh-cn': {
        ...zhLocale,
        ...zhCN
    }
}
import { global } from '@/libs/Global';
import store from '@/store';
import router from '@/router';
import 'ant-design-vue/dist/antd.variable.min.css';
import '@/styles/index.less';
import '@/permission';
import './icons'; //icon
import svgIcon from '@/components/SvgIcon/index.vue';
const i18n = createI18n({
    locale: global.language,
    messages: messages,
});
createApp(App).use(store).use(router).use(i18n).component('svg-icon', svgIcon).mount('#app');
