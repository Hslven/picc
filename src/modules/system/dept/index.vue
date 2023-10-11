<template>
    <div class="dept-page">
        <a-row>
            <a-col :span="7" class="left-col">
                <a-spin :spinning="spinning">
                    <a-tree
                            v-if="treeData.length>0&&!spinning"
                            :tree-data="treeData"
                            draggable
                            show-line
                            :selectedKeys="selectedKeys"
                            :expandedKeys="expandedKeys"
                            :field-names="fieldNames"
                            @select="onNodeSelect"
                            @drop="onDrop"
                            @expand="onExpand"
                    >
                        <template #title="item">
                            <a-dropdown :trigger="['contextmenu']">
                                <span>{{ item.organ_name }}</span>
                                <template #overlay>
                                    <a-menu @click="({ key: menuKey }) => onContextMenuClick(item, menuKey)">
                                        <a-menu-item key="add">新增</a-menu-item>
                                        <a-menu-item key="delete">删除</a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </template>
                    </a-tree>
                    <a-empty :image="simpleImage" v-if="treeData.length===0&&!spinning"/>
                </a-spin>
            </a-col>
            <a-col :span="17" class="right-col">
                <div v-show="showRightCol">
                    <a-form
                            ref="formRef"
                            :labelCol="{span: 4}"
                            :wrapperCol="{ span: 12 }"
                            :model="organForm"
                            name="organForm"
                            autocomplete="off"
                            @finish="save">
                        <a-form-item label="机构名称" name="organ_name"
                                     :rules="[{required:true,message:'机构名称不能为空',trigger: 'blur'}]">
                            <a-input v-model:value="organForm.organ_name" placeholder="请输入机构名称"
                                     @blur="changMenuName" allowClear />
                        </a-form-item>
                        <a-form-item label="机构编码" name="organ_id"
                                     :rules="[{required:true,message:'机构编码不能为空',trigger: 'blur'}]">
                            <a-input v-model:value="organForm.organ_id" placeholder="请输入机构编码"
                                     :disabled="addOrEdit === 'edit'" allowClear />
                        </a-form-item>
                        <a-form-item label="上级机构" name="up_organ"
                                     :rules="[{required:true,message:'上级机构不能为空',trigger: 'change'}]">
                            <a-tree-select
                                    v-model:value="organForm.up_organ"
                                    show-search
                                    style="width: 100%"
                                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                    placeholder="请选择上级机构"
                                    allow-clear
                                    tree-default-expand-all
                                    :tree-data="treeData"
                                    :field-names="{
                                children: 'children',
                                label: 'organ_name',
                                value: 'organ_id',
                              }"
                            />
                        </a-form-item>
                        <a-form-item label="机构状态" name="organ_state"
                                     :rules="[{required:true,message:'机构状态不能为空',trigger: 'change'}]">
                            <a-select v-model:value="organForm.organ_state" placeholder="请选择菜单状态" allowClear>
                                <a-select-option v-for="item in organ_state" :key="item.enum_id"
                                                 :value="item.enum_code">{{ item.enum_name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <div class='btn_wrap'>
                            <a-button html-type="submit" type="primary" :loading="isLoading">保存</a-button>
                        </div>
                    </a-form>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import {Options, Vue,} from 'vue-class-component';
import {Ref} from 'vue-property-decorator';
import {baseApi, ResponseData} from '@/libs/BaseApi';
import { FormInstance,Empty, message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import {createVNode} from 'vue';
import {AntTreeNodeDropEvent, TreeProps} from 'ant-design-vue/es/tree';
import {global} from '@/libs/Global';
@Options({})
export default class Dept extends Vue {
    @Ref('formRef') readonly formRef!:FormInstance
    public spinning=false
    public simpleImage=Empty.PRESENTED_IMAGE_SIMPLE
    public fieldNames={
        title:'organ_name',
        key:'organ_id'
    }
    public treeData:Array<any> = []
    public selectedKeys:any[]=[]
    public expandedKeys:string[]=[]
    public permission:any = []
    public organ_state:any = []
    public showRightCol= false
    public organForm:any = {
        organ_name:'',
        organ_id:'',
        up_organ:undefined,
        organ_state:'',
        organ_seq:'',
        display_order:'',
        organ_level:''
    }
    public isLoading=false
    public addOrEdit=''
    public options:Array<any>=[]
    public created(){
        this.getOrganList()
        this.getEnum()
        this.getPermsBtn(); // 权限
      }
    public getPermsBtn() {
        let per:any={}
        if(global.userInfo){
            per = global.userInfo.permsBtn
        }
      this.permission = per['dept'] || []
    }
    //选择机构节点
    public onNodeSelect(selectedKeys:any,{selectedNodes}:any){
        this.showRightCol=true
        this.formRef.resetFields()
        this.selectedKeys=selectedKeys
        if(selectedNodes.length>0){
             
            const selectedNode=selectedNodes[0]
            if(selectedNode.isNewNode){
                this.addOrEdit='add'
                this.organForm.organ_name=selectedNode.organ_name
                this.organForm.organ_id=''
                this.organForm.up_organ=selectedNode.up_organ
                this.organForm.organ_state=selectedNode.organ_state
            }else {
                this.addOrEdit='edit'
                Object.keys(this.organForm).forEach(key=>{
                    this.organForm[key]=selectedNode[key]
                })
            }

        }
    }
    public loopFn (node:any, id:string, fn:any) {
        node.some((item:any,index:number) => {
            if (item.organ_id === id) {
                fn(node, item, index)
                return true;
            }
            if (item.children && item.children.length) {
                this.loopFn(item.children, id, fn);
            }
        });
    }
    //修改机构名称
    public changMenuName(){
        if(this.addOrEdit==='add'){
            this.loopFn(this.treeData, this.selectedKeys[0], (node:any, item:any, index:number) => {
                node[index].organ_name=this.organForm.organ_name
            });
        }
    }
    //新增
    public add(nodeInfo:any) {
         
        const organId=new Date().getTime()
        this.loopFn(this.treeData, nodeInfo.organ_id, (node:any, item:any, index:number) => {
            if(!node[index].children){
                node[index].children=[]
            }
            node[index].children.push({
                organ_name:'新增节点',
                organ_id:organId,
                children:[],
                organ_seq:nodeInfo.organ_seq,
                up_organ:nodeInfo.organ_id,
                organ_state:'EFCTIV',
                isNewNode:true
            })
        });
        this.selectedKeys=[organId]
        this.expandedKeys.push(nodeInfo.organ_id)
        this.showRightCol=true
        this.addOrEdit='add'
        this.organForm.up_organ = nodeInfo.organ_id
        this.organForm.organ_id = undefined
        this.organForm.organ_name = '新增节点'
        this.organForm.organ_state = 'EFCTIV'
        this.organForm.organ_level = nodeInfo.organ_level + 1
    }

    //删除
    public remove(nodeId:string) {
        Modal.confirm({
            title: '温馨提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '确定要删除吗？',
            cancelText:'取消',
            okText:'确定',
            onOk:() =>{
                baseApi.post('/organ/delOrgan.do',{organ_id:nodeId}, 'sec').then(() => {
                    this.showRightCol=false
                    message.success('删除成功')
                    this.getOrganList()
                })
            }
        });
    }

    //右键菜单点击
    public onContextMenuClick(nodeInfo: any, menuKey: string){
        if(menuKey==='add'){
            this.add(nodeInfo)
        }else {
            this.remove(nodeInfo.organ_id)
        }
    }

    //获取机构Tree列表
    public getOrganList(){
        this.spinning=true
        baseApi.post('/organ/queryOrgan.do',{}, 'sec').then((res: ResponseData<any, any>) => {
            this.spinning=false
            this.treeData=res.data
            if(this.expandedKeys.length===0){
                this.expandedKeys=[this.treeData[0].organ_id]
            }
        }).catch(()=>{
            this.spinning=false
        })
    }
    //节点拖拽
    public onDrop (info: AntTreeNodeDropEvent ){
         
        // 目标节点
        const dropKey = info.node.eventKey as string;
         
        // 拖动节点
        const dragKey = info.dragNode.eventKey as string;
         
        const dropPos:string[] = (info.node.pos as string).split('-');

        // 拖动的位置
        const dropPosition = info.dropPosition - Number(dropPos [dropPos.length - 1]);
         
        const loop = (data: any[], key: string, callback: any) => {
            data?.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.treeData];

        //拖动节点的对象
        let dragObj: any = {};

        if (!info.dropToGap) {
            return false;
        } else if ((info.node.children || []).length > 0 && info.node.expanded && dropPosition === 1) {
            return false;
        } else {
            let a: TreeProps['treeData'] = [];
            let ii = 0;
            loop(data, dragKey, (item: any, index: number, arr: TreeProps['treeData']) => {
                        a = arr;
                        ii = index;
                        dragObj = item;
                    }
            );
            // 只允许当前节点下的子节点拖动排序
            if (a.some((item) => item.key === dropKey)) {
                a.splice(ii, 1);
                let ar: TreeProps['treeData'] = [];
                let i = 0;
                loop(data, dropKey, (item: any, index: number, arr: TreeProps['treeData']) => {
                            ar = arr;
                            i = index;
                        }
                );
                if (dropPosition === -1) {
                    ar.splice(i, 0, dragObj);
                } else {
                    ar.splice(i + 1, 0, dragObj);
                }
            }

        }
        this.treeData = data;
        const param={
            dragKey:dragKey,
            targetKey:dropKey,
            parentKey:info.dragNode.up_organ
        }
        baseApi.post('/organ/updateOrganOrder.do',param, 'sec')
    }
    //节点展开/收起
    public onExpand(expandedKeys:string[]){
         
        this.expandedKeys=expandedKeys
    }
    //保存
    public save(){
        this.formRef.validate().then(() => {
            this.isLoading=true
            let requestUrl=''
            let msg=''
            if(this.addOrEdit==='edit'){
                requestUrl='/organ/mdfOrgan.do'
                msg='修改成功'
            }else {
                requestUrl='/organ/addOrgan.do'
                msg='保存成功'
            }
            baseApi.post(requestUrl,this.organForm, 'sec').then(() => {
                this.isLoading=false
                this.showRightCol=false
                message.success(msg)
                this.getOrganList()
            }).catch(()=>{
                this.isLoading=false
            })
        })
    }
    // 获取字典
    public getEnum() {
      baseApi.post('/dic/queryDicByCode.do', { enum_code: 'organ_state' }, 'sec').then((res: ResponseData<any, any>) => {
          this.organ_state = res.data
      });
    }
}
</script>
<style scoped lang="less">
.dept-page{
    padding-top: 20px;
    height: 100%;
    :deep(.ant-spin-nested-loading){
        height: 100%;
        .ant-spin-container{
            height: 100%;
            .ant-empty-normal{
                margin: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                translate: -50% -50%;
            }
        }
    }
    .ant-spin{
        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50%;
    }
    .left-col{
      height: calc(100vh - 150px);
      border: 1px solid #ccc;
      border-radius: 5px;
      overflow: auto;
    }
    .right-col{
        .btn_wrap{
            .ant-btn{
                margin-left: 380px;
            }
        }
    }
    .btn-edit{
        color:var(--custom-primary-color)
    }
}

</style>
