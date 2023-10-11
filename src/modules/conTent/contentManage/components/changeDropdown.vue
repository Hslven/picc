<template>
    <div>
        <a-dropdown placement="bottom" :trigger="['click']">
            <div :style="{
                textAlign: 'center',
                background: '#ffffff',
                color: '#EF6A49',
            }">
                <div class="choosedown" v-if='showLeftFolder'>
                    <img src="../../assets/内容管理-列表_slices/icon／操作.png" alt="">
                </div>
                <div class="choosedown" v-if='showTableActive'>
                    <img src="../../assets/内容管理-列表_slices/icon／操作1.png" alt="">
                </div>
            </div>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="chooseDropdown(item)" v-for="item in menuList" :key="item" :disabled="item.disabled">
                        <div class="dropdown">
                            {{ item.title }}
                            <CheckOutlined style="margin-left: 20px;" class="dropdowndui" />
                        </div>

                    </a-menu-item>

                </a-menu>

            </template>
        </a-dropdown>


    </div>
</template>

<script lang="ts" >
import { CheckOutlined } from '@ant-design/icons-vue';
import { Options, Vue } from 'vue-class-component'
// import { Prop } from 'vue-property-decorator';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {
        CheckOutlined
    },

})

export default class changeDropdown extends Vue {
    @Prop({ default: false }) public row!: any;
    @Prop({ default: false }) public showLeftFolder!: boolean;
    @Prop({ default: false }) public showTableActive!: boolean;
    @Prop({ default: false }) public menuList!: any;

    // public menuList: menuItemType[] = [];
    created() {
        // if (this.showLeftFolder === true) {
        //     // 文件夹
        //     this.menuList = [{ title: '修改栏目', index: 0,disabled:false }, { title: '删除栏目', index: 1 }, { title: '新增子栏目', index: 2 }]
        // } else {
        //     // 表格
        //     this.menuList = [{ title: '审核', index: 0 }, { title: '详情', index: 1 }, { title: '上架', index: 2 }, { title: '下架', index: 3 }, { title: '删除', index: 4 }]
        // }
    }

    public chooseDropdown(item:any) {
        //  
        this.$emit('getDropdown', item, this.row)

        // this.$emit('getTitle',item.title)
        // 保存到vuex中
        // this.state.choosebutton=item.title
    }

}
</script>

<style lang="less" scoped>
a-menu-item {
    background-color: aquamarine;
}

.dropdown:hover {
    color: #E8380D;
    ;
}

.choosedown {
    padding: 0px 5px;
}
</style>