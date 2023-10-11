<template>
    <div class="layout-iframe">
        <iframe
                :src="$route.meta.isLink"
                frameborder="0"
                height="100%"
                width="100%"
                ref="iframeRef"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({})
export default class Iframe extends Vue {
    created(){
        this.$route.query
    }

}
</script>

<style scoped>
.layout-iframe{
    height: calc(100vh - 109px);
}
</style>
