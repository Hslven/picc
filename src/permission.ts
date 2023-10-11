import router from '@/router';
import {permissionStore} from '@/libs/Permission';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {localStorage} from '@/libs/Storage';
import {global} from '@/libs/Global';
import {isEmpty, pull} from 'lodash';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/login'];
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasToken = localStorage.get('token');
  if (hasToken) {
    // 登录成功，跳转到首页 
    if (to.path === '/login') {
      if(global.appId){
        next({ path: '/' });
      }else {
        next({ path: '/appSelect' });
      }
      NProgress.done();
    }else if (to.path === '/home') {
      if(global.appId){
        global.getUserInfo();
        const accessRoutes: any =await permissionStore.generateRoutes();
        accessRoutes.forEach((route: any) => {
          router.addRoute(route);
        });
        next();
      }else {
        next({ path: '/appSelect' });
      }
      NProgress.done();
    } else {
      const hasGetUserInfo =!isEmpty(global.userInfo.permsBtn) ;
      if (hasGetUserInfo) {
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name as any }) : next('/401');
        } else {
          next();
        }
      } else {
        try {
          if(global.appId){
            global.getUserInfo();
            const accessRoutes: any =await permissionStore.generateRoutes();
            accessRoutes.forEach((route: any) => {
              router.addRoute(route);
            });
            next({ ...to, replace: true });
          }else {
            next();
          }
        } catch (error) {
           
          // 移除 token 并跳转登录页
          global.clear();
          next('/login');
          NProgress.done();
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});