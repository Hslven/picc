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
export const personalRoutes: Array<RouteRecordRaw> = [
    {
        path: '/personal',
        component: Layout,
        redirect: '/personal/personal-index',
        meta: { hidden: true },
        children: [
            {
                path: 'personal-index',
                component: () => import('@/modules/personal/index.vue'),
                name: 'personal',
                meta: {
                    title: '个人中心',
                    icon: 'home',
                    hidden: true,
                },
            },
        ]
    },
];
personalRoutes.forEach((aRoute) => {
    router.addRoute(aRoute);
});
export default new index();
