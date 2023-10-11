<template>
    <div />
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({})
export default class Redirect extends Vue {
    created() {
        const { params, query } = this.$route
        const { path } = params
        this.$router.replace({ path: '/' + path, query }).catch(err => {
        })
    }
}
</script>

<style scoped>

</style>
