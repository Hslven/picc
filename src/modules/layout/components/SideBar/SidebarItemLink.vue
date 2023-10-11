<template>
    <a
            v-if="isExternal(to)"
            :href="to"
            target="_blank"
            rel="noopener"
    >
        <slot/>
    </a>
    <router-link
            v-else
            :to="to"
    >
        <slot/>
    </router-link>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator'
import {isExternal} from '@/libs/Utils'

@Options({})
export default class extends Vue {
    @Prop({required: true}) public to!: string
    public isExternal = isExternal
}
</script>
