<template>
        <svg
                aria-hidden="true"
                class="svg-icon"
                :style="'width:' + size + ';height:' + size"
        >
            <use :xlink:href="iconName" :fill="color"/>
        </svg>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

export default class SvgIcon extends Vue {
    @Prop({default: 'icon'}) public prefix!: string
    @Prop({required: false}) public name!: string
    @Prop() public color!: string
    @Prop({default: '1em'}) public size!: string

    get iconName() {
        return `#${this.prefix}-${this.name}`
    }
}
</script>

<style lang="less" scoped>
.svg-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    color: inherit;
    stroke: currentColor;
    vertical-align: -0.15em;
    overflow: hidden;
    fill: currentColor;
}
</style>
