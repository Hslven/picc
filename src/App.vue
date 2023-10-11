<template>
    <a-config-provider :locale="getGlobalI18n">
        <router-view />
    </a-config-provider>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import 'dayjs/locale/zh-cn' //将antdesginVue英文组件转为中文(用于时间组件)
@Options({})
export default class AppView extends Vue {
    get getGlobalI18n(){
        return (this.$i18n as any).messages[this.$i18n.locale]
    }
}
</script>
