<template>
    <div class="content">
        <a-row>
            <a-col class="gutter-row" :span="4">
                <div class="gutter-box">
                    <div class="content-left">
                        <div class="content-left-search">
                            <a-input @change="changeKey" v-model:value="searchkey" placeholder="搜索">
                                <template #prefix>
                                    <div class="content-left-search-img">
                                        <img @click="addColumn" src="@/modules/assets/内容管理-列表_slices/icon／搜索@2x.png"
                                            alt="" />
                                    </div>
                                </template>
                            </a-input>
                        </div>
                        <div class="content-left-tree">
                            <div class="content-left-tree-title">
                                <div @click="allfolder" style="font-size: 14px" :class="isAllCheck ? 'red' : ''">
                                    {{folderName}}
                                </div>
                                <!-- <img @click="addColumn" src="@/modules/assets/内容管理-列表_slices/icon／新增栏目@2x.png" alt="" /> -->
                                <a-select v-model:value="Classification" style="width:100px;border-radius: 4px;" placeholder="选择渠道">
                                    <a-select-option v-for="item in ClassificationList" :key="item.id">{{ item.label}}</a-select-option>
                                </a-select>
                            </div>
                            <div class="content-left-tree-list">
                                <!-- <div style="font-size: 14px;margin-left: 10px;">
                                    <img style="" src="@/modules/assets/内容管理-新增栏目_slices/icon＼用户洞察平台@2x.png" alt="">
                                    <span>客户</span>
                                    <img @click="allfolder" style="" src="@/modules/assets/内容管理-新增栏目_slices/icon／展开@2x(1).png" alt="">
                                    <img style="float: right;margin-right: 30px;margin-top: 10px;" src="@/modules/assets/内容管理-新增栏目_slices/icon／增加子栏目@2x.png" alt="">
                                </div>
                                <div style="font-size: 14px;margin-left: 10px;">
                                    <img style="" src="@/modules/assets/内容管理-新增栏目_slices/icon＼用户洞察平台@2x.png" alt="">
                                    <span>代理人</span>
                                    <img @click="allfolder" style="" src="@/modules/assets/内容管理-新增栏目_slices/icon／展开@2x(1).png" alt="">
                                    <img style="float: right;margin-right: 30px;margin-top: 10px;" src="@/modules/assets/内容管理-新增栏目_slices/icon／增加子栏目@2x.png" alt="">
                                </div> -->
                                <a-menu 
                                    v-model:activeKey="activeKey"
                                    mode="inline">
                                    <a-sub-menu key="1">
                                        <template #title>
                                            <span>
                                                <img style="margin-left: 20px;" src="@/modules/assets/内容管理-新增栏目_slices/icon＼用户洞察平台@2x.png" alt="">
                                                <span style="margin-left: 10px;">客户</span>
                                                <img style="padding-right: 10px;margin-left: 5px;" src="@/modules/assets/内容管理-新增栏目_slices/icon／展开@2x(1).png" alt="">
                                                <img @click="addColumn" style="margin-left: 34px;margin-top: -5px;" src="@/modules/assets/内容管理-新增栏目_slices/icon／增加子栏目@2x.png" alt="">
                                            </span>
                                        </template>
                                        <p>
                                            <div v-for="item in folderList" :key="item.id" @click.stop="sanGrandpa(item)"
                                                class="cursor">
                                                <div class="san-grandpa" :class="{ active: item.remark1 === 1 }">
                                                    <div style="cursor: pointer;"> 
                                                        <FolderOutlined style="margin-right: 5px" />{{ item.name }}
                                                    </div>
                                                    <ChangeDropdown :menuList="menuList" @getDropdown="getDropdown" :row="item"
                                                        :showLeftFolder="showLeftFolder"> </ChangeDropdown>
                                                </div>
                                                <div v-if="item.showchilderns">
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
                                                                            <ChangeDropdown :menuList="menuSonList"
                                                                                @getDropdown="getDropdown" :row="l"
                                                                                :showLeftFolder="showLeftFolder">
                                                                            </ChangeDropdown>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </p>
                                    </a-sub-menu>
                                    <a-sub-menu key="2">
                                        <template #title>
                                            <span>
                                                <img style="margin-left: 20px;" src="@/modules/assets/内容管理-新增栏目_slices/icon＼用户洞察平台@2x.png" alt="">
                                                <span style="margin-left: 10px;">代理人</span>
                                                <img style="padding-right: 10px;margin-left: 5px;" src="@/modules/assets/内容管理-新增栏目_slices/icon／展开@2x(1).png" alt="">
                                                <img @click="addColumn" style="margin-left: 20px;margin-top: -5px;" src="@/modules/assets/内容管理-新增栏目_slices/icon／增加子栏目@2x.png" alt="">
                                            </span>
                                        </template>
                                        <p>
                                            <div v-for="item in folderList" :key="item.id" @click.stop="sanGrandpa(item)"
                                                class="cursor">
                                                <div class="san-grandpa" :class="{ active: item.remark1 === 1 }">
                                                    <div style="cursor: pointer;">
                                                        <FolderOutlined style="margin-right: 5px" />{{ item.name }}
                                                    </div>
                                                    <ChangeDropdown :menuList="menuList" @getDropdown="getDropdown" :row="item"
                                                        :showLeftFolder="showLeftFolder"> </ChangeDropdown>
                                                </div>
                                                <div v-if="item.showchilderns">
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
                                                                            <ChangeDropdown :menuList="menuSonList"
                                                                                @getDropdown="getDropdown" :row="l"
                                                                                :showLeftFolder="showLeftFolder">
                                                                            </ChangeDropdown>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </p>
                                    </a-sub-menu>
                                </a-menu>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="20">
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
import { UserOutlined, PlusCircleOutlined, SearchOutlined, FolderOutlined, EditOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Modals from '../configuration/Modals.vue';
// import myTree from './myTree.vue'
import { ref, reactive, VueElement, h,  } from 'vue';
import { Prop } from 'vue-property-decorator';
import { emit } from 'process'

import ChangeDropdown from './changeDropdown.vue';



const activeKey = ref([]);

interface menuItemType {
    title: string;
    index: number;
    disabled: boolean;
    iconName?: any;
}

//下拉框
interface ditchListType {
    label: string,
    value: string,
    id: string
}


@Options({
    components: {
        UserOutlined,
        SearchOutlined,
        PlusCircleOutlined,
        FolderOutlined,
        EditOutlined,
        CloseOutlined,
        PlusOutlined,
        ChangeDropdown,
        Modals,
    },
})
export default class contentManage extends Vue {
    @Prop({ require: true }) public folderList!: any[];
    @Prop({ require: true }) public closeMyModal!: boolean;
    @Prop({ require: true }) public menuListTiTle!: string[];
    @Prop({ require: true }) public folderName!: string;
    activeKey: any;
    created(): void {
         
        this.initMenuList();
    }

    //渠道
    public Classification: string = '0'
	//渠道下拉框列表数据
	public ClassificationList:ditchListType[] = [
        {
            label: '微信小程序',
			value: '0',
			id: '0'
		},
		{
            label: 'app',
			value: '1',
			id: '1'
		},
		{
			label: '百度小程序',
			value: '2',
			id: '2'
		},
        {
			label: '支付宝小程序',
			value: '3',
			id: '3'
		},
	]

    public initMenuList() {
        const iconList = [EditOutlined, CloseOutlined, PlusOutlined]
        this.menuListTiTle.forEach((item, index) => {
            this.menuList.push({ title: item, index: index, disabled: false, iconName: iconList[index] });
        });
        this.menuListTiTle.forEach((item, index) => {
            if (index < this.menuListTiTle.length - 1) {
                 
                this.menuSonList.push({ title: item, index: index, disabled: false, iconName: iconList[index] });
            } else {
                this.menuSonList.push({ title: item, index: index, disabled: true, iconName: iconList[index] });
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
    // public dianjiFather(item: any) {
    //   //  
    //   item.showchilderns = !item.showchilderns
    //   this.folderList.forEach(item => {
    //     item.remark1 = 0
    //     if (item.children) {
    //       item.children.forEach((i: any) => {
    //         i.remark1 = 0
    //       })
    //     }
    //   })
    //   item.remark1 = 1
    //   this.$emit('getFolderName', item)
    // }
    // public dianjiSon(i: any) {
    //   //  
    //   this.folderList.forEach(item => {
    //     item.remark1 = 0
    //     if (item.children) {
    //       item.children.forEach((i: any) => {
    //         i.remark1 = 0
    //       })
    //     }
    //   })
    //   i.remark1 = 1
    //   this.$emit('getFolderName', i)
    // }
    public fatherColumnList: any[] = [];
    public addColumn() {
        this.$emit('addColumn');
    }
    public isAllCheck: boolean = true
    public allfolder() {
        this.initremark()
        this.isAllCheck = true
        this.$emit('allfolder');
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
        this.isAllCheck = false
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
.red {
    color: #e8380d;
}

.cursor {
    cursor: pointer;
}

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

                .content-left-search-img {
                    display: flex;
                    width: 12px;
                    height: 12px;

                    img {
                        flex: 1;
                        width: 100%;
                        height: 100%;
                    }
                }

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
                cursor: pointer;

                img {
                    width: 16px;
                    height: 16px;
                }
            }

            .content-left-tree-list {
                max-height: 100%;
                overflow-y: auto;
                padding-bottom: 10px;

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
        // padding: 0px 16px;
    }
}

.san-grandpa {
    padding: 10px 16px 10px 40px;
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
    padding: 10px 16px 10px 60px;
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
    padding: 10px 16px 10px 80px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    // background-color: yellow;
}

.san-son:hover {
    background-color: #fff2ee;
    color: #e8380d;
}

.ant-menu-submenu-arrow{
    margin-left: -50px;
}

::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}


/*使用sass*/
 
.ant-menu-submenu-title {
    .ant-menu-submenu-arrow::before, .ant-menu-submenu-arrow::after {
        display: none;
    }
}
 
 
.ant-menu-submenu-title:hover {
    .ant-menu-submenu-arrow::before, .ant-menu-submenu-arrow::after {
        display: none;
    }
}


</style>
