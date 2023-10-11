import _ from 'lodash';
// ↓↓↓↓增加内容在此处增加引入↓↓↓↓
import login from '@/modules/login/router';
import home from '@/modules/home/router';
import appSelect from '@/modules/appSelect/router';
import redirect from '@/modules/redirect/router';
import layout from '@/modules/layout/i18n';
import system from '@/modules/system/i18n';
import personal from '@/modules/personal/router'
// ↑↑↑↑增加内容在此处增加引入↑↑↑↑
import { LocaleMessages, VueMessageType } from 'vue-i18n';

const i18n: LocaleMessages<VueMessageType> = {};
// ↓↓↓↓增加内容在此处增加引入↓↓↓↓
_.defaultsDeep(i18n, login.i18n(),home.i18n(),appSelect.i18n(),redirect.i18n(),layout.i18n(),system.i18n(),personal.i18n());
// ↑↑↑↑增加内容在此处增加引入↑↑↑↑

export default i18n;
