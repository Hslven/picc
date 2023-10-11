<template>
    <div v-if="!item.meta || !item.meta.hidden">
        <template v-if="!alwaysShowRootMenu && theOnlyOneChild&&!theOnlyOneChild.children">
            <sidebar-item-link
                    v-if="theOnlyOneChild.meta"
                    :to="resolvePath(theOnlyOneChild.path)"
            >
                <a-menu-item
                        :key="resolvePath(theOnlyOneChild.path)"
                >

                    <svg-icon
                            class="svg-icon"
                            v-if="theOnlyOneChild.meta && theOnlyOneChild.meta.icon"
                            :name="theOnlyOneChild.meta.icon"
                    />
                    <span v-if="theOnlyOneChild.meta.title">
<!--                      {{ $t('route.'+theOnlyOneChild.meta.title)}}-->
                     <a-tooltip v-if="theOnlyOneChild.meta.title.length>10" placement="left">
                      <template #title>
                        <span>{{ theOnlyOneChild.meta.title}}</span>
                      </template>
                      {{ theOnlyOneChild.meta.title}}
                    </a-tooltip>
                      <span v-else>{{ theOnlyOneChild.meta.title}}</span>

                    </span>

                </a-menu-item>
            </sidebar-item-link>
        </template>
        <a-sub-menu
                v-else
                :key="resolvePath(item.path)"
        >
            <template #title>
                <svg-icon
                        class="svg-icon"
                        v-if="item.meta && item.meta.icon"
                        :name="item.meta.icon"
                />
                <span  v-if="item.meta && item.meta.title" >
              <!-- {{ $t('route.'+item.meta.title) }} -->
                {{ item.meta.title }}
            </span>
            </template>
            <template v-if="item.children">
                <sidebar-item
                        v-for="child in item.children"
                        :key="child.path"
                        :item="child"
                        :is-collapse="isCollapse"
                        :base-path="resolvePath(child.path)"
                        class="nest-menu"
                />
            </template>
        </a-sub-menu>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import SidebarItemLink from './SidebarItemLink.vue';
import SvgIcon from '@/components/SvgIcon/index.vue'
import {RouteRecordRaw} from 'vue-router';
import path from 'path-browserify';
import { isExternal } from '@/libs/Utils';
@Options({
    components:{SidebarItemLink,SvgIcon}
})
export default class SidebarItem extends Vue {
    @Prop({ required: true }) public item!: RouteRecordRaw
    @Prop({ default: false }) public isCollapse!: boolean
    @Prop({ default: '' }) public basePath!: string
    get alwaysShowRootMenu() {
        if (this.item.meta && this.item.meta.alwaysShow) {
            return true
        }
        return false
    }
    get showingChildNumber() {
        if (this.item.children) {
            const showingChildren = this.item.children.filter((item) => {
                if (item.meta && item.meta.hidden) {
                    return false
                } else {
                    return true
                }
            })
            return showingChildren.length
        }
        return 0
    }
    get theOnlyOneChild() {
        if (this.showingChildNumber > 1) {
            return null
        }
        if (this.item.children) {
            for (const child of this.item.children) {
                if (!child.meta || !child.meta.hidden) {
                    return child
                }
            }
        }
        // If there is no children, return itself with path removed,
        // because this.basePath already conatins item's path information
        return { ...this.item, path: '' }
    }
    public resolvePath(routePath: string) {
        if (isExternal(routePath)) {
            return routePath
        }
        if (isExternal(this.basePath)) {
            return this.basePath
        }
        return path.resolve(this.basePath, routePath)
    }
}
</script>
<style lang="less" scoped>
.svg-icon{
    margin-right: 10px;
}

</style>
