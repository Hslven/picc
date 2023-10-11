<template>
    <div v-for="item in folderList" :key="item.id" @click.stop="sanGrandpaNew(item)" class="cursor">
        <div class="leftItem" style="margin-left: 10px" :class="{ active: item.click }">
            <div style="cursor: pointer;" class="leftItem-name">
                {{ item.name }}
                <!-- <a-tooltip>
                    <FolderOutlined style="margin-right: 5px" />
                    <template #title> {{ item.name }}</template>
                    {{ item.name }}
                </a-tooltip> -->
            </div>

            <ChangeDropdown :menuList="menuList" :row="item" :showLeftFolder="showLeftFolder" @getDropdown="getDropdown">
            </ChangeDropdown>
        </div>

        <div v-if="item.showchilderns">
            <!-- <div v-if="item.children"> -->
            <testChangeLeftFolderItem :folderList="item.children" :menuList="menuList" @getDropdown="getDropdown"
                :showLeftFolder="showLeftFolder">
            </testChangeLeftFolderItem>
            <!-- <div @click.stop="sanFather(i)" v-for="i in item.children" :key="i.id">
                    <div :class="{ active: i.remark1 === 1 }" class="san-father">
                        <div style="cursor: pointer;">
                            <FolderOutlined style="margin-right: 5px" />{{ i.name }}
                        </div>
                        <ChangeDropdown :menuList="menuList" @getDropdown="getDropdown" :row="i"
                            :showLeftFolder="showLeftFolder"> </ChangeDropdown>
                    </div>
                    <div v-if="i.showchilderns">
                        <div v-if="i.children">
                            <div @click.stop="sanSon(l)" v-for="l in i.children" :key="l.id">
                                <div :class="{ active: l.remark1 === 1 }" class="san-son">
                                    <div style="cursor: pointer;">
                                        <FolderOutlined style="margin-right: 5px" />{{ l.name }}
                                    </div>
                                    <ChangeDropdown :menuList="menuSonList" @getDropdown="getDropdown" :row="l"
                                        :showLeftFolder="showLeftFolder">
                                    </ChangeDropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> -->
            <!-- </div> -->
        </div>
    </div>
    <!-- <div v-if="item.showchilderns">
        <div v-if="item.children">
            <div @click.stop="sanFather(i)" v-for="i in item.children" :key="i.id">
                <div :class="{ active: i.remark1 === 1 }" class="san-father">
                    <div style="cursor: pointer;">
                        <FolderOutlined style="margin-right: 5px" />{{ i.name }}
                    </div>
                    <ChangeDropdown :menuList="menuList" @getDropdown="getDropdown" :row="i"
                        :showLeftFolder="showLeftFolder"> </ChangeDropdown>
                </div>
                <div v-if="i.showchilderns">
                    <div v-if="i.children">
                        <div @click.stop="sanSon(l)" v-for="l in i.children" :key="l.id">
                            <div :class="{ active: l.remark1 === 1 }" class="san-son">
                                <div style="cursor: pointer;">
                                    <FolderOutlined style="margin-right: 5px" />{{ l.name }}
                                </div>
                                <ChangeDropdown :menuList="menuSonList" @getDropdown="getDropdown" :row="l"
                                    :showLeftFolder="showLeftFolder">
                                </ChangeDropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
</template>
<script lang="ts">

import { contentApi } from '@/libs/api';

import { Options, Vue } from 'vue-class-component';
import { FolderOutlined, } from '@ant-design/icons-vue';
import ChangeDropdown from './changeDropdown.vue';
// import zmwModal from '../components/zmwModal.vue';
// // import myTree from './myTree.vue'
import store from '@/modules/conTent/store';
import { ref, reactive } from 'vue';
import { Prop } from 'vue-property-decorator';
import { emit } from 'process';
// import { emit } from 'process';
interface childrenListType {
    children: childrenListType,
    id: string,
    leafFlag: string,
    module: string,
    name: string,
    parentId: string,
    remark1: string,
}

@Options({
    components: {
        ChangeDropdown,
        FolderOutlined
    },
})
export default class contentManage extends Vue {
    @Prop({ require: true }) public folderList!: any[];
    @Prop({ require: true }) public menuList!: any[];
    @Prop({ require: true }) public showLeftFolder!: boolean;

    // console.log(this.faterItemb, 'faterItemffffffff');
    public states: any = store.state;
    public childrenList: childrenListType[] = []
    public childrenInfo = reactive({
        ceng: 0,
        // children: "",
        id: "",
        leafFlag: "",
        left: 0,
        module: "",
        name: "",
        parentId: "",
        remark1: "",
        showchilderns: false
    })

    public sanGrandpaNew(item: any) {
        console.log('点击了111', item);
        store.commit('getfolderLeftInfo', item)

        console.log('点击了1112', this.states, this.states.getFolderLeft, this.states.getFolderLeft.folderLeftInfo);
        this.childrenInfo = { ...item }
        item.showchilderns = !item.showchilderns;
        this.$emit('getFolderName', this.states.getFolderLeft.folderLeftInfo);
    }

    public getDropdown(value: any, row: any) {
        console.log('子组件编辑', value, row);

        this.$emit('getDropdown', value, row);
    }

}
</script>

<style lang="less">
.leftItem {
    padding: 10px 16px 10px 0px;
    padding-left: var(--left);
    font-size: 14px;
    display: flex;
    justify-content: space-between;

    // background-color: aqua;
    .leftItem-name { 
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}

.leftItem:hover {
    background-color: #fff2ee;
    color: #e8380d;
}
</style>