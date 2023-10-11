<template>
    <div style="display: flex;align-items: center;justify-content: center;height: calc(100vh - 96px);font-size: 30px">
        首页
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    name:'home'
})
export default class Dashboard extends Vue {
}
</script>

<style lang="less" scoped>

</style>
