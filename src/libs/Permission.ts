import {Action, getModule, Module, Mutation, VuexModule,config} from 'vuex-module-decorators';
config.rawError = true
import {RouteRecordRaw} from 'vue-router';
import {homeRoutes} from '@/modules/home/router';
import store from '@/store';
import {baseApi, Header, ResponseData} from '@/libs/BaseApi';
import { global } from '@/libs/Global';
import {isValidURL} from '@/libs/Utils';
import { AxiosResponseHeaders} from 'axios';
const Layout = () => import('@/modules/layout/index.vue')
const handleImport= (path:string) =>{
  return () => import('@/modules/' + path + '/index.vue')
}
export const filterAsyncRoutes = (routes: RouteRecordRaw[]) => {
  const res: RouteRecordRaw[] = [];
  const appId=global.appId
  routes.forEach(route => {
    const r:any = { ...route }
    if(r.component==='layout'){
      if(r.up_menu == appId) {
        r.component = Layout
        if(r.component&&r.children.length===1){
          r.meta.alwaysShow=true
        }
      } else {
        r.component =handleImport('iframe')
        r.meta.alwaysShow=true
      }
    }else {
      if(isValidURL(r.path)){
        const url=r.path
        if(r.up_menu===appId){
          r.path='/'+r.name
          r.component=Layout
          r.redirect=r.name+'/index'
          if(!r.children){
            r.children=[]
            r.children.push({
              path: 'index',
              component: 'iframe',
              name: r.name,
              meta: {
                title: r.meta.title,
                icon: r.meta.icon,
                hidden:r.meta.hidden,
                isLink:url
              }
            })
            delete r.meta
          }
        }else {
          r.meta.isLink=url
          r.component =handleImport('iframe')
          r.path=r.name
        }
      }else {
        let tempArr: any[]
        if(r.path.indexOf('/')!==0){
          tempArr=r.path.split('/')
          r.path=tempArr[tempArr.length-1]
          r.component =handleImport(r.component)
        }else {
          tempArr=r.component.split('/')
          if(!r.children){
            r.children=[]
            r.children.push({
              path: 'index',
              component: tempArr[tempArr.length-1],
              name: r.name,
              meta: {
                title: r.meta.title,
                icon: r.meta.icon,
                hidden:r.meta.hidden
              }
            })
            r.redirect=r.name+'/index'
            r.component=Layout
            delete r.meta
          }
        }
      }
    }
    if (r.children&&r.children instanceof Array) {
      r.children = filterAsyncRoutes(r.children)
    }
    res.push(r)
  })
  return res;
};
@Module({ dynamic: true, store, name: 'permission' })
export default class Permission extends VuexModule {
  public routes: RouteRecordRaw[]=[]
  public addRoutes: RouteRecordRaw[]=[]
  @Mutation
  private SET_ROUTES(routes: RouteRecordRaw[]) {
    this.addRoutes = routes;
    this.routes = homeRoutes.concat(routes);
  }
  @Action
  public generateRoutes() {
    const appId=global.appId
    return new Promise((resolve, reject) => {
      const header:Header= {
        response:(header: AxiosResponseHeaders)=> {
          global.setSessionToken(header['X-Auth-Token'])
        }
      }
      baseApi.post('/menu/queryRouterMenu.do',{app_id:appId},'sec',header).then((res: ResponseData<any, any>)=>{
         
        const asyncRoutes=res.data as RouteRecordRaw[]
        const accessedRoutes=filterAsyncRoutes(asyncRoutes)
        this.SET_ROUTES(accessedRoutes)
        resolve(accessedRoutes);
      }).catch(error=>{
        reject(error);
      })
    })
  }
}

export const permissionStore = getModule(Permission)
