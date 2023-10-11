/**
 * Created by cn.mashuai@gmail.com on 2022/3/18.
 */
'use strict';
import i18n from './i18n.json';
import { RouteRecordRaw } from 'vue-router';
import router from '@/router';

class index implements Module {
    i18n(): object {
        return i18n;
    }
}
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        component: () => import('@/modules/login/index.vue'),
        meta: { hidden: true }
    },
];
routes.forEach((aRoute) => {
    router.addRoute(aRoute);
});
export default new index();
