import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory('/'),
    routes: [
        {
            path:'/addContent',
            component:() => import('../src/modules/conTent/addContent/index.vue'),
        },
        // {
        //     path:'/content',
        //     component:() => import('../src/modules/conTent/contentManage/index.vue'),
        // },
        {
            path:'/contentManage',
            component:() => import('../src/modules/conTent/contentManage/index.vue'),
        },
        {
            path:'/commentModerate',
            component:() => import('../src/modules/conTent/commentModerate/index.vue'),
        },
        {
            path:'/addOperation',
            component:() => import('../src/modules/operation/addOperation/index.vue'),
        },
        {
            path:'/operationDetail',
            component:() => import('../src/modules/operation/operationDetail/index.vue'),
        },
        {
            path:'/operationManage',
            component:() => import('../src/modules/operation/operationManage/index.vue'),
        },
        {
            path:'/feedbackList',
            component:() => import('../src/modules/systemManagement/feedbackList/index.vue'),
        },
        {
            path:'/feedbackResult',
            component:() => import('../src/modules/systemManagement/feedbackResult/index.vue'),
        },
        {
            path:'/domainName',
            component:() => import('../src/modules/systemManagement/domainName/index.vue'),
        },
        {
            path:'/uploadMaterial',
            component:() => import('../src/modules/systemManagement/uploadMaterial/index.vue'),
        },
        {
            path:'/laberManagement',
            component:() => import('../src/modules/systemManagement/laberManagement/index.vue'),
        },
        {
            path:'/addAppDescription',
            component:() => import('../src/modules/downloadPageManage/addAppDescription/index.vue'),
        },
        {
            path:'/editAppDescription',
            component:() => import('../src/modules/downloadPageManage/editAppDescription/index.vue'),
        },
        {
            path:'/addDownloadPage',
            component:() => import('../src/modules/downloadPageManage/addDownloadPage/index.vue'),
        },
        {
            path:'/editDownloadPage',
            component:() => import('../src/modules/downloadPageManage/editDownloadPage/index.vue'),
        },
        // {
        //     path:'/materialManagement',
        //     component:() => import('../src/modules/systemManagement/materialManagement/index.vue'),
        // },
        {
            path:'/materialManagement',
            component:() => import('../src/modules/systemManagement/materialManagement/content.vue'),
        },
        {
            path:'/shortChainManagement',
            component:() => import('../src/modules/systemManagement/shortChainManagement/index.vue'),
        },
        {
            path:'/sensitiveWordManagement',
            component:() => import('../src/modules/systemManagement/sensitiveWordManagement/copy.vue'),
        },
        {
            path:'/downloadPageDetail',
            component:() => import('../src/modules/downloadPageManage/downloadPageDetail/index.vue'),
        },
        {
            path:'/downloadPage',
            component:() => import('../src/modules/downloadPageManage/downloadPage/index.vue'),
        },
        {
            path:'/uploadMaterial',
            component:() => import('../src/modules/systemManagement/uploadMaterial/index.vue'),
        },
        {
            path:'/contentDetail',
            component:() => import('../src/modules/conTent/contentDetail/index.vue'),
        },
        {
            path:'/configuration',
            component:() => import('../src/modules/columnConfiguration/configuration/index.vue'),
        },
        {
            path:'/newColumnContent',
            component:() => import('../src/modules/columnConfiguration/newColumnContent/contentModal.vue'),
        },
        {
            path:'/newColumnEdit',
            component:() => import('../src/modules/columnConfiguration/newColumnEdit/copy.vue'),
        },
        {
            path:'/testLeftFolder',
            component:() => import('../src/modules/conTent/test/testLeftFolder.vue'),
        },
        {
            path:'/changePwd',
            component:() => import('../src/modules/login/changePwd.vue'),
        },
        {
            path:'/login',
            component:() => import('../src/modules/login/index.vue'),
        }
    ],
});

export default router;
