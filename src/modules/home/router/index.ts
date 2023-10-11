/**
 * Created by cn.mashuai@gmail.com on 2022/3/18.
 */
'use strict';
import i18n from './i18n.json';
import { RouteRecordRaw } from 'vue-router';
import router from '@/router';
import Layout from '@/modules/layout/index.vue';

class index implements Module {
    i18n(): object {
        return i18n;
    }
}
export const homeRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                component: () => import('@/modules/home/index.vue'),
                name: 'Home',
                meta: {
                    title: '首页',
                    icon: 'home',
                    affix: true
                }
            }
        ]
    },
];
homeRoutes.forEach((aRoute) => {
    router.addRoute(aRoute);
});
export default new index();
