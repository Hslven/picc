<template>
    <section class="app-main">
        <transition
                name="fade-transform"
                mode="out-in"
        >
            <router-view :key="key" />
        </transition>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({})
export default class AppMain extends Vue {
    get key() {
        return this.$route.path
    }
}
</script>

<style lang="less" scoped>
.app-main {
    margin: 10px;
    // padding: 0 16px;
    height: calc(100vh - 80px);
    background: #fff;
    // border-radius: 8px;
    overflow-y: auto;
    overflow-x: hidden;
}
// fade-transform
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.5s;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
