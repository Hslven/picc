<!--
    / * @FileDescription: 左侧文件夹部分
* @Author: ZMW
* @Date: 2023-03-28
* @LastEditors: 
* @LastEditTime:  -->
<template>
    <div class="content">
        <a-row>
            <a-col class="gutter-row" :span="3">
                <div class="gutter-box">
                    <div class="content-left">
                        <div class="content-left-search">
                            <a-input @change="changeKey" v-model:value="searchkey" placeholder="Basic usage">
                                <template #prefix>
                                    <user-outlined type="user" />
                                </template>
                            </a-input>
                        </div>
                        <div class="content-left-tree">
                            <div class="content-left-tree-title">
                                <div style="font-size: 14px">全部栏目</div>
                                <!-- <PlusCircleOutlined @click="addFolder" /> -->
                                <img @click="addColumn" src="../../assets/内容管理-列表_slices/icon／新增栏目@2x.png" alt="" />
                                <!-- <user-outlined type="user" @click="dianji" /> -->
                            </div>
                            <div class="content-left-tree-list">
                                <!-- 用双层循环 -->
                                <!-- <div v-for="item in folderList" :key="item.id" @click.stop="dianjiFather(item)">
                  <div :class="{ 'active': item.remark1 === 1 }" class="content-left-tree-item">
                    {{ item.name }}
                    <ChangeDropdown @getDropdown="getDropdown" :row="item" :showLeftFolder="showLeftFolder">
                    </ChangeDropdown>
                  </div>
                  <div v-if="item.showchilderns">
                    <div v-if="item.children">
                                                              <div :class="{ 'active': i.remark1 === 1 }" class="sonTree" @click.stop="dianjiSon(i)"
                                                                v-for="i in item.children" :key="i.id">
                                                                {{ i.name }}
                                                              </div>
                                                            </div>
                                      </div>
                                                        </div> -->
                                <!-- 三层循环 star -->
                                <div v-for="item in folderList" :key="item.id" @click.stop="sanGrandpa(item)">
                                    <div class="san-grandpa" :class="{ active: item.remark1 === 1 }">
                                        <div>{{ item.name }}</div>
                                        <ChangeDropdown :menuList="menuList" @getDropdown="getDropdown" :row="item" :showLeftFolder="showLeftFolder"> </ChangeDropdown>
                                    </div>
                                    <div v-if="item.showchilderns">
                                        <div v-if="item.children">
                                            <div @click.stop="sanFather(i)" v-for="i in item.children" :key="i.id">
                                                <div :class="{ active: i.remark1 === 1 }" class="san-father">
                                                    <div>{{ i.name }}</div>
                                                    <ChangeDropdown :menuList="menuList" @getDropdown="getDropdown" :row="i" :showLeftFolder="showLeftFolder"> </ChangeDropdown>
                                                </div>
                                                <div v-if="i.showchilderns">
                                                    <div v-if="i.children">
                                                        <div @click.stop="sanSon(l)" v-for="l in i.children" :key="l.id">
                                                            <div :class="{ active: l.remark1 === 1 }" class="san-son">
                                                                <div>{{ l.name }}</div>
                                                                <ChangeDropdown :menuList="menuSonList" @getDropdown="getDropdown" :row="l" :showLeftFolder="showLeftFolder">
                                                                </ChangeDropdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 三层循环end -->
                                <!-- 用递归，没调好 -->
                                <!-- <myTree :showLeftFolder="showLeftFolder" :folderList="folderList"></myTree> -->
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="21">
                <div class="gutter-box">
                    <div class="content-right">
                        <slot name="tabbar"> </slot>

                        <slot name="content"> </slot>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { UserOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';
import ChangeDropdown from './changeDropdown.vue';
import zmwModal from '../components/zmwModal.vue';
// import myTree from './myTree.vue'
import { ref, reactive } from 'vue';
import { Prop } from 'vue-property-decorator';
import { emit } from 'process';
interface menuItemType {
    title: string;
    index: number;
    disabled: boolean;
}
@Options({
    components: {
        UserOutlined,
        PlusCircleOutlined,
        ChangeDropdown,
        zmwModal,
    },
})
export default class contentManage extends Vue {
    @Prop({ require: true }) public folderList!: any[];
    @Prop({ require: true }) public closeMyModal!: boolean;
    @Prop({ require: true }) public menuListTiTle!: string[];

    created(): void {
         
        this.initMenuList();
    }
    public initMenuList() {
        this.menuListTiTle.forEach((item, index) => {
            this.menuList.push({ title: item, index: index, disabled: false });
        });
        this.menuListTiTle.forEach((item, index) => {
            if (index < this.menuListTiTle.length - 1) {
                 
                this.menuSonList.push({ title: item, index: index, disabled: false });
            } else {
                this.menuSonList.push({ title: item, index: index, disabled: true });
            }
        });
        //  
    }
    public showchildren = false;
    public showLeftFolder = ref<boolean>(true);
    public menuList: menuItemType[] = [
        // { title: '修改栏目', index: 0, disabled: false },
        // { title: '删除栏目', index: 1, disabled: false },
        // { title: '新增子栏目', index: 2, disabled: false }
    ];
    public menuSonList: menuItemType[] = [
        // { title: '修改栏目', index: 0, disabled: false },
        // { title: '删除栏目', index: 1, disabled: false },
        // { title: '新增子栏目', index: 2, disabled: true }
    ];

    public FolderId = ref<number>();
    public showchildrenFn(item: any) {
         
        this.FolderId = item.id;
         
    }
    public addFolder = () => {
         
    };
    public dianjiFather(item: any) {
        //  
        item.showchilderns = !item.showchilderns;
        this.folderList.forEach((item) => {
            item.remark1 = 0;
            if (item.children) {
                item.children.forEach((i: any) => {
                    i.remark1 = 0;
                });
            }
        });
        item.remark1 = 1;
        this.$emit('getFolderName', item);
    }
    public dianjiSon(i: any) {
        //  
        this.folderList.forEach((item) => {
            item.remark1 = 0;
            if (item.children) {
                item.children.forEach((i: any) => {
                    i.remark1 = 0;
                });
            }
        });
        i.remark1 = 1;
        this.$emit('getFolderName', i);
    }
    public fatherColumnList: any[] = [];
    public addColumn() {
        this.$emit('addColumn');
    }
    public searchkey = ref<string>('');
    public changeKey() {
        this.$emit('getsearchkey', this.searchkey);
    }
    public test = {
        item: 'item',
        b: '',
    };
    public getDropdown(value: any, row: any) {
         

        this.$emit('getDropdown', value, row);
    }
    // 三层
    public sanGrandpa(item: any) {
         
        item.showchilderns = !item.showchilderns;
        // this.folderList.forEach(item => {
        //   item.remark1 = 0
        //   if (item.children) {
        //     item.children.forEach(i => {
        //       i.remark1 = 0
        //     })
        //   }
        // })
        this.initremark();
        item.remark1 = 1;
        this.$emit('getFolderName', item);
    }
    public sanFather(i: any) {
         
        i.showchilderns = !i.showchilderns;

        this.initremark();
        i.remark1 = 1;
        this.$emit('getFolderName', i);
    }
    public sanSon(l: any) {
         

        this.initremark();
        l.remark1 = 1;
        this.$emit('getFolderName', l);
    }
    public initremark() {
        this.folderList.forEach((item) => {
            item.remark1 = 0;
            if (item.children) {
                item.children.forEach((i: any) => {
                    i.remark1 = 0;
                    if (i.children) {
                        i.children.forEach((l: any) => {
                            l.remark1 = 0;
                        });
                    }
                });
            }
        });
         
    }
}
</script>
<style lang="less">
.content {
    // display: flex;

    .content-left {
        // flex: 1;
        background-color: #ffffff;

        .content-left-search {
            padding: 24px 9px 10px 9px;

            .ant-input-affix-wrapper {
                border-radius: 16px;
                background-color: #efefef;
                border: 0px solid;

                .ant-input {
                    background-color: transparent;
                }
            }

            .ant-input-affix-wrapper-focused {
                border: 0px solid transparent !important;
                box-shadow: 0px 0px 0px 0px;
            }

            .ant-input-affix-wrapper:hover {
                border: 0px solid transparent !important;
            }
        }

        .content-left-tree {
            .content-left-tree-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                margin: 0px 16px;
                height: 40px;

                img {
                    width: 16px;
                    height: 16px;
                }
            }

            .content-left-tree-list {
                max-height: 870px;
                overflow-y: auto;

                // margin: 0px 14px 0px 30px;
                // background-color: #FAEEEB;
                .content-left-tree-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 40px;
                    // padding-right: 6px;
                    padding: 0px 12px 0px 15px;
                }

                .content-left-tree-item:hover {
                    background-color: #faeeeb;
                }

                .sonTree {
                    margin-left: 30px;
                    height: 40px;
                    // color: #000000;
                    line-height: 40px;
                }

                .active {
                    color: red;
                }
            }
        }
    }

    .content-right {
        // flex: 7;
        background-color: #f8f8f8;
        padding: 16px;
    }
}

.san-grandpa {
    padding: 10px 16px 10px 26px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    // background-color: aqua;
}

.san-grandpa:hover {
    background-color: #fff2ee;
    color: #e8380d;
}

.san-father {
    padding: 10px 16px 10px 36px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    // background-color: red;
}

.san-father:hover {
    background-color: #fff2ee;
    color: #e8380d;
}

.san-son {
    padding: 10px 16px 10px 46px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    // background-color: yellow;
}

.san-son:hover {
    background-color: #fff2ee;
    color: #e8380d;
}
</style>
