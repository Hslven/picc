import defaultsDeep from 'lodash/defaultsDeep';
import { LoggerLevel } from '@/libs/Logger';
import { VuexModule, Module, Mutation,Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {localStorage} from '@/libs/Storage';
import {baseApi,} from '@/libs/BaseApi';
import {tagsViewStore} from '@/libs/TagsView';
// import {getLanguage} from '@/libs/Utils';

@Module({ name: 'global', dynamic: true, store, namespaced: true })
export class Global extends VuexModule {
    // 当前请求后台的数据，<=0时取消Loading遮罩，如果未取消，可以自己手动点击取消。
    public pendingRequests = 0;
    public sessionToken = localStorage.get('token')||'';
    public appId=localStorage.get('appId')||''
    public user: User | undefined;
    public agent: any;
    // 日志级别
    public logLevel: LoggerLevel = LoggerLevel.INFO;
    // 请求是否加密
    public isEncrypt = 'N';
    public encryptKey = '';
    public language = 'zh-cn';
    public collapsed=localStorage.get('collapsed')?localStorage.get('collapsed'):false
    public userInfo={
        nickname: '',
        avatar: '',
        permsBtn: {}
    }
    @Mutation
    public setSessionToken(sessionToken: string) {
        if(!sessionToken){ return }
        this.sessionToken = sessionToken;
        localStorage.set('token',sessionToken)
    }
    @Mutation
    public setAppId(appId: string) {
        this.appId = appId;
        localStorage.set('appId',appId)
    }
    @Mutation
    public setLanguage(language: string) {
        this.language = language;
        localStorage.set('language', language);
    }

    @Mutation
    public setCollapsed() {
        this.collapsed=!this.collapsed
        if (this.collapsed) {
            localStorage.set('collapsed', true)
        } else {
            localStorage.set('collapsed', false)
        }
    }
    @Mutation
    public setEncrypt(isEncrypt: string) {
        this.isEncrypt = isEncrypt;
    }

    @Mutation
    public setEncryptKey(encryptKey: string) {
        this.encryptKey = encryptKey;
    }

    @Mutation
    public setLogLevel(logLevel: LoggerLevel) {
        this.logLevel = logLevel;
    }

    /**
     * 转圈+1，在BaseApi里请求开始时会调用。
     */
    @Mutation
    public pendingPlus(): void {
        this.pendingRequests = this.pendingRequests + 1;
    }

    /**
     * 转圈-1，在BaseApi里请求结束后会调用。
     */
    @Mutation
    public pendingMinus(): void {
        if (this.pendingRequests <= 0) {
            this.pendingRequests = 0;
            return;
        }
        // 延迟100毫秒减1，防止并发请求时，同时结束，取消Loading的back方法会返回多个页面
        setTimeout(() => {
            if (this.pendingRequests - 1 < 0) {
                this.pendingRequests = 0;
                return;
            }
            this.pendingRequests = this.pendingRequests - 1;
            if (this.pendingRequests < 0) {
                this.pendingRequests = 0;
            }
        }, 100);
    }

    public resetPending() {
        this.pendingRequests = 0;
    }

    public get isLoading(): boolean {
        return this.pendingRequests > 0;
    }

    @Mutation
    public setUser(user: User): void {
        defaultsDeep(this.user, user);
    }

    @Mutation
    public setAgent(agent: any): void {
        defaultsDeep(this.agent, agent);
    }

    @Mutation
    public clear(): void {
        this.sessionToken=''
        this.appId=''
        this.userInfo.nickname=''
        this.userInfo.avatar=''
        this.userInfo.permsBtn={}
        localStorage.clear()
        tagsViewStore.delAllViews()
    }
    @Mutation
    public setUserInfo(userInfo: any): void {
        this.userInfo=userInfo
    }

    @Action
    public getUserInfo(){
        const appId=global.appId
        baseApi.post('/menu/queryButtonLimit.do', {'app_id':appId}, 'sec').then((res: any) => {
            const per = res.defmap
            const permission:any = {}
            Object.keys(per).forEach((key) => {
                permission[key] = []
                per[key].map( (item:any) => {
                    permission[key].push(item.menu_url)
                })
            })
            const data={
                nickname: 'admin',
                avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                permsBtn: permission
            }
            this.setUserInfo(data)
        })
    }
}

interface User {
    /**
     * 唯一标识 pk_uuid<br>
     * 必须维护，在保存数据库时用到
     */
    pkUuid: string;

    /**
     * 所属机构 <br>
     * 必须维护，在获取数据库连接时用到
     */
    organId: string;

    /**
     * 机构名称
     */
    organName: string;

    /**
     * 渠道编码
     */
    branchID: string;

    /**
     * 渠道类型,个，团，银，互动
     */
    branchType: string;

    /**
     * 获取微信的openId
     */
    openId: string;

    /**
     * 获取微信的unionId
     */
    unionId: string;

    /**
     * 手机号
     */
    phoneNumber: string;

    /**
     * 操作员姓名
     */
    userName: string;

    /**
     * 操作员登录系统的账号
     */
    userCode: string;

    /**
     * 头像
     */
    profilePhoto: string;

    /**
     * 操作员性别。
     */
    sex: string;

    /**
     * 邮箱
     */
    mail: string;

    /**
     * 状态，可用/锁定/注销
     */
    status: string;

    /**
     * 操作员类型
     */
    optType: string;
    /**
     * 操作员所属部门编码
     */
    deptID: string;

    /**
     * 操作员所属部门名称
     */
    deptName: string;

    /**
     * 操作员所属部门类型，个/银/团/互/...
     */
    deptType: string;

    /**
     * 操作员所属部门级别
     */
    deptLevel: string;

    /**
     * 操作员所属团队编号
     */
    teamID: string;

    /**
     * 操作员所属团队名称
     */
    teamName: string;

    /**
     * 操作员可操作下级机构，使用','分割。
     * PC端系统可能会用到
     */
    deptList: string;

    /**
     * 操作员可授予角色，使用','分割。
     */
    roleList: string;

    /**
     * 当前操作可操作按钮集合
     */
    funcLis: Array<string>;

    /**
     * 操作员当前操作机构，使用','分割。
     */
    curOptDeptList: string;

    /**
     * 操作员当前操作部门名称
     */
    curOptDeptName: string;

    /**
     * 设备号，记录日志时会用到
     */
    deviceNumber: string;

    /**
     * 操作员职级编码
     */
    rankId: string;

    /**
     * 操作员职级名称
     */
    rankName: string;

    /**
     * 操作员职级序列
     */
    rankSeq: string;

    /**
     * 操作员主管pkUuid
     */
    mgrPkUuid: string;

    /**
     * 用户扩展信息
     */
    userExtendInfo: Map<string, string | Map<string, object>>;
}

export const global = getModule(Global);
