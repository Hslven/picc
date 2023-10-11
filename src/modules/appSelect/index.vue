<template>
    <div class="app-select-page">
        <div class="app-list">
            <template v-for="(value, key,index) in processedData" :key="key">
                <div v-if="key==='全部应用'" style="display: flex;justify-content: space-between">
                  <div class="title">{{key}}</div>
                  <div class="title" v-if="key==='全部应用'" style="cursor: pointer;color: red" >
                    <div @click="logout"  >退出登录</div></div>
                </div>
              <div v-else>
                <div class="title">{{key}}</div>
              </div>
                <div class="grid">
                    <template v-for="item in value" :key="item.app_id">
                        <div class="grid-item" @click="onSelect(item)">
                            <div class="grid-item__content">
                                <svg-icon style="width:30px;height:30px" class="svg-icon" :name="item.app_headpic" />
<!--                                <img width="30" height="30" :src="item.app_headpic" alt="" v-if="item.app_headpic">-->
<!--                                <svg-icon-->
<!--                                        v-else-->
<!--                                        class="svg-icon"-->
<!--                                        name="app"-->
<!--                                        :size="30"-->
<!--                                        color="#d000ff"-->
<!--                                />-->
                                <span class="grid-item__text">{{ item.app_name }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { baseApi, ResponseData } from '@/libs/BaseApi';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { global } from '@/libs/Global';
import { Modal } from 'ant-design-vue';

@Options({ components: { SvgIcon } })
export default class AppSelect extends Vue {
    public appList: any[] = []
    public processedData: any = {}
    public created() {
        this.getAppList()
    }
    public getAppList() {
        baseApi.post('/app/queryAppIdAndName.do', {}, 'sec').then((res: ResponseData<any, any>) => {
            this.appList = res.data
            this.appList.reduce((acc, item) => {
                if (acc[item.app_group]) {
                    acc[item.app_group].push(item);
                } else {
                    acc[item.app_group] = [item];
                }

                return acc;
            }, this.processedData);
        });
    }
    public onSelect(app: any) {
        if (app.app_status) {
            // global.setAppId(app.app_id)
            // window.open(app.app_url)
          global.setAppId(app.app_id)
          if(app.app_url.indexOf('#') === 0) {
            window.history.pushState('', '', window.location.origin + window.location.pathname + app.app_url);
            window.location.reload()
          } else {
            window.open(app.app_url, '_self')
          }
        } else {
            Modal.warning({
                title: '温馨提示',
                content: '该应用暂不可用',
            });
        }
    }
  public logout() {
    global.clear()
    this.$router.push('/login')
  }
}
</script>

<style lang="less" scoped>
.app-select-page {
    height: 100%;
    background: #f1f1f1;
    overflow-y: auto;

    .app-list {
        width: 1200px;
        margin: 0 auto;

        .title {
            padding: 20px 0 16px
        }

        .grid {
            display: flex;
            flex-flow: wrap;
            background: #fff;

            .grid-item {
                position: relative;
                flex-basis: 16.667%;
                box-sizing: border-box;
                cursor: pointer;

                &__content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    height: 100%;
                    padding: 36px 8px;

                    &:after {
                        position: absolute;
                        box-sizing: border-box;
                        content: "";
                        top: -50%;
                        right: -50%;
                        bottom: -50%;
                        left: -50%;
                        z-index: 1;
                        border-width: 0 1px 1px 0;
                        border-color: #edebf0;
                        border-style: solid;
                        transform: scale(.5);
                    }
                }

                &__text {
                    margin-top: 10px;
                    color: #323233;
                    line-height: 1.5;
                    word-break: break-all;
                }
            }
        }
    }

}</style>
