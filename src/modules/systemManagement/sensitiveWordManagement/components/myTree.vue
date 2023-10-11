<!-- :class="{ 'active':(addclickId=== item.id)&&(!item.parentId)}" -->
<template>
    <div :class="{ 'active': item.remark1==0 }" class="treeList" @click.stop="dianji(item)" v-for="item in folderList"
        :key="item.id">
        <div class="content-left-tree-item">
            <div :class="{ 'marginclass': item.parentId }">{{ item.name }}</div>
            <div v-if="!item.parentId">
                <ChangeDropdown :showLeftFolder="showLeftFolder"></ChangeDropdown>
            </div>
        </div>
       
        <div>
            <myTree v-if="item.showchilderns" :folderList="item.children"></myTree>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { UserOutlined } from '@ant-design/icons-vue';
import ChangeDropdown from './changeDropdown.vue'
import { Prop } from 'vue-property-decorator';
import { Item } from 'ant-design-vue/lib/menu';

@Options({
    components: {
        UserOutlined,
        ChangeDropdown,
    },

})
export default class contentManage extends Vue {
    @Prop({ require: true }) public folderList!: any[];
    public showchilderns = ref<boolean>(false)
    public showLeftFolder = ref<boolean>(true)
    public activeClass = false 
    public addclassid = -1
    public parentId = -1
    public dianji = (item:any) => {
         
        item.showchilderns = !item.showchilderns
        // this.id = item.id
        // this.parentId=item.parentId
       
        //  
        //  

        // this.IsaddClass(item.id, item.parentId)
    }
    // public IsaddClass(id, parentId) {
    //      
        
    //     if (parentId == 0) {
    //        this.activeClass  = true 
    //          
    //     }
    // }
    created(): void {
         
        //  
    }
    // beforeUnmount(): void {
    //      
    //     this.id = -1
    //     this.parentId=-1
    // }
    
}
</script>

<style lang="less" scoped>
.treeList {
    .content-left-tree-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        // padding-right: 6px;
        padding: 0px 12px 0px 15px;
    }

    .content-left-tree-item:hover {
        background-color: #FAEEEB;
    }
    // .content-left-tree-item:active {
    //     color: red;
    // }
    .content-left-tree-item:active {
        color: red;
    }
    .active {
        color: red;
    }

    .marginclass {
        margin-left: 10px;
    }
}
</style>