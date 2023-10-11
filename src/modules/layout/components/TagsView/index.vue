<template>
    <!-- <div
            id="tags-view-container"
            class="tags-view-container"
    >
        <router-link
                v-for="tag in visitedViews"
                ref="tag"
                :key="tag.path"
                :class="{ 'active': isActive(tag)}"
                :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
                class="tags-view-item"
                @contextmenu.prevent="openMenu(tag, $event)"
        >
            {{ tag.meta?.title}}
            <close-outlined v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)" />
        </router-link>
        <ul
                v-show="visible"
                :style="{left: left+'px', top: top+'px'}"
                class="contextmenu"
        >
            <li @click="refreshSelectedTag(selectedTag)">
                {{ $t('tagsView.刷新') }}
            </li>
            <li
                    v-if="!isAffix(selectedTag)"
                    @click="closeSelectedTag(selectedTag)"
            >
                {{$t('tagsView.关闭') }}
            </li>
            <li @click="closeOthersTags">
                {{ $t('tagsView.关闭其他') }}
            </li>
            <li @click="closeAllTags(selectedTag)">
                {{ $t('tagsView.全部关闭') }}
            </li>
        </ul>
    </div> -->
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import { Watch } from 'vue-property-decorator'
import {tagsViewStore} from '@/libs/TagsView'
import path from 'path-browserify';
import {permissionStore} from '@/libs/Permission';
import {CloseOutlined} from '@ant-design/icons-vue';
@Options({components:{CloseOutlined}})
export default class TagsView extends Vue {
    public visible = false
    public top = 0
    public left = 0
    public selectedTag: any = {}
    public affixTags: any[] = []
    get visitedViews() {
        return tagsViewStore.visitedViews
    }
    get routes() {
        return permissionStore.routes
    }
    @Watch('$route')
    public onRouteChange() {
        this.addTags()
        this.moveToCurrentTag()
    }
    @Watch('visible')
    public onVisibleChange(value: boolean) {
        if (value) {
            document.body.addEventListener('click', this.closeMenu)
        } else {
            document.body.removeEventListener('click', this.closeMenu)
        }
    }
    public mounted() {
        this.initTags()
        this.addTags()
    }
    // 设置 tagsView 高亮
    public isActive(v: any) {
        return v.path === this.$route.path
    }
    public isAffix(tag: any) {
        return tag.meta && tag.meta.affix
    }
    public filterAffixTags(routes: any[], basePath = '/') {
        let tags: any[] = []
        routes.forEach(route => {
            if (route.meta && route.meta.affix) {
                const tagPath = path.resolve(basePath, route.path)
                tags.push({
                    fullPath: tagPath,
                    path: tagPath,
                    name: route.name,
                    meta: { ...route.meta }
                })
            }
            if (route.children) {
                const childTags = this.filterAffixTags(route.children, route.path)
                if (childTags.length >= 1) {
                    tags = [...tags, ...childTags]
                }
            }
        })
        return tags
    }
    public initTags() {
        this.affixTags = this.filterAffixTags(this.routes)
        for (const tag of this.affixTags) {
            // Must have tag name
            if (tag.name) {
                tagsViewStore.addVisitedView(tag)
            }
        }
    }
    public addTags() {
        const { name } = this.$route
        if (name) {
            tagsViewStore.addView(this.$route)
        }
        return false
    }
    public closeSelectedTag(view: any) {
        tagsViewStore.delView(view)
        if (this.isActive(view)) {
            this.toLastView(tagsViewStore.visitedViews, view)
        }
    }
    public refreshSelectedTag(view:any){
        const { fullPath } = view
        this.$nextTick(() => {
            this.$router.replace({
                path: '/redirect' + fullPath
            }).catch(err => {
                
            })
        })
    }
    public closeOthersTags(){
        if (this.selectedTag.fullPath !== this.$route.path && this.selectedTag.fullPath !== undefined) {
            this.$router.push(this.selectedTag.fullPath).catch(err => {
              
            })
        }
        tagsViewStore.delOthersViews(this.selectedTag)
        this.moveToCurrentTag()
    }
    public closeAllTags(view:any){
        tagsViewStore.delAllViews()
        if (this.affixTags.some(tag => tag.path === this.$route.path)) {
            return
        }
        this.toLastView(tagsViewStore.visitedViews, view)
    }
    public toLastView(visitedViews:any, view: any) {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView !== undefined && latestView.fullPath !== undefined) {
            this.$router.push(latestView.fullPath).catch(err => {
                
            })
        } else {
            // Default redirect to the home page if there is no tags-view, adjust it if you want
            if (view.name === 'Home') {
                // to reload home page
                this.$router.replace({ path: '/redirect' + view.fullPath }).catch(err => {
                    
                })
            } else {
                this.$router.push('/').catch(err => {
                    
                })
            }
        }
    }
    public moveToCurrentTag() {
        const tags = this.$refs.tag as any[] // TODO: better typescript support for router-link
        this.$nextTick(() => {
            for (const tag of tags) {
                if ((tag.to as any).path === this.$route.path) {
                    if ((tag.to as any).fullPath !== this.$route.fullPath) {
                        tagsViewStore.updateVisitedView(this.$route)
                    }
                    break
                }
            }
        })
    }
    //右键菜单
    public openMenu(tag: any, e: MouseEvent) {
        this.left=e.clientX
        this.top = e.clientY
        this.visible = true
        this.selectedTag = tag
    }
    public closeMenu() {
        this.visible = false
    }
}
</script>
<style lang="less" scoped>
.tags-view-container {
    //height: 34px;
    padding: 0 10px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #333;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;

        &:first-of-type {
            //margin-left: 15px;
        }

        &:last-of-type {
            //margin-right: 15px;
        }

        &.active {
            background-color: var(--custom-primary-color);
            color: var(--custom-primary-text-color);
            border-color: var(--custom-primary-color);

            &::before {
                content: '';
                background: #fff;
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: relative;
                margin-right: 2px;
            }
        }
        .anticon-close{
            width: 16px;
            height: 16px;
            margin-left: 5px;
            padding: 1px;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;
            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
            :deep(svg){
                transform: scale(0.8);
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }
}
</style>
