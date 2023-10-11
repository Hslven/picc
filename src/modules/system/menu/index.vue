<template>
    <div class="menu-page" id="menuPage">
        <a-spin :spinning="appSpinning">
            <a-row>
                <a-col :span="5">
                    <a-form-item label="所属应用">
                        <a-select v-model:value="queryParam.appId" :options="appSelectOption" placeholder="请选择所属应用"
                            @change="onAppSelectChange" show-search :filter-option="filterOption" allowClear />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row v-if="!isShowEmpty">
                <a-col :span="4" class="left-col">
                    <a-spin :spinning="spinning">
                        <a-tree v-if="treeData.length > 0 && !spinning" :tree-data="treeData" draggable show-line
                            :selectedKeys="selectedKeys" :expandedKeys="expandedKeys" :field-names="fieldNames"
                            @select="onNodeSelect" @drop="onDrop" @expand="onExpand">
                            <template #title="item">
                                <a-dropdown :trigger="['contextmenu']">
                                    <span>{{ item.menu_name }}</span>
                                    <template #overlay>
                                        <a-menu @click="({ key: menuKey }) => onContextMenuClick(menuKey, item)">
                                            <a-menu-item key="add">新增</a-menu-item>
                                            <a-menu-item key="delete">删除</a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </template>
                        </a-tree>
                        <a-empty :image="simpleImage" v-if="treeData.length === 0 && !spinning" />
                    </a-spin>
                </a-col>
                <a-col :span="20" class="right-col">
                    <div v-show="showRightCol">
                        <a-form ref="menuFormRef" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12 }" :model="menuForm"
                            name="menuForm" autocomplete="off" @finish="save">
                            <a-form-item label="菜单名称" name="menu_name"
                                :rules="[{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]">
                                <a-input v-model:value="menuForm.menu_name" placeholder="请输入菜单名称" @blur="changMenuName"
                                    allowClear />
                            </a-form-item>
                            <a-form-item label="菜单类型" name="menu_type"
                                :rules="[{ required: true, message: '菜单类型不能为空', trigger: 'change' }]">
                                <a-select v-model:value="menuForm.menu_type" placeholder="请选择菜单类型"
                                    @change="onMenuTypeChange" allowClear>
                                    <a-select-option value="MENU">菜单</a-select-option>
                                    <a-select-option value="BUTTON">按钮</a-select-option>
                                    <!-- <a-select-option value="ROUTER">路由</a-select-option> -->
                                </a-select>
                                <span  style="    position: absolute;right: -20px;top: 4px;"  ><a-tooltip class="tooltip" placement="right">
                                            <template #title>菜单类型：选择新增的是系统菜单还是菜单下的按钮</template>
                                                <question-circle-outlined />
                                        </a-tooltip></span>
                            </a-form-item>
                            <template v-if="menuForm.menu_type === 'BUTTON'">
                                <a-form-item label="菜单地址" name="menu_url">
                                    <a-input v-model:value="menuForm.menu_url"
                                        oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" placeholder="请输入菜单地址"
                                        allowClear />
                                        <span  style="    position: absolute;right: -20px;top: 4px;"  ><a-tooltip class="tooltip" placement="right">
                                            <template #title>菜单地址：<br/>
                                                1、输入点击菜单后的跳转的路由地址（注：如果是系统下的一级菜单需要以/开头），如果菜单
                                                是云表单页面，需要配置网站的访问地址加formId=xxx<br/> 
                                                2、如果配置的是按钮的话，就是页面上按钮的唯一标识。云表单会自动生成按钮的ID
                                               </template>
                                                <question-circle-outlined />
                                        </a-tooltip></span>
                                </a-form-item>
                            </template>
                            <template v-else>
                                <a-form-item label="菜单地址" name="menu_url"
                                    :rules="[{ required: true, message: '菜单地址不能为空', trigger: 'blur' }]">
                                    <a-input v-model:value="menuForm.menu_url"
                                        oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')" placeholder="请输入菜单地址"
                                        allowClear />
                                        <span  style="    position: absolute;right: -20px;top: 4px;"  ><a-tooltip class="tooltip" placement="right">
                                            <template #title>菜单地址：<br/>
                                                1、输入点击菜单后的跳转的路由地址（注：如果是系统下的一级菜单需要以/开头），如果菜单
                                                是云表单页面，需要配置网站的访问地址加formId=xxx<br/> 
                                                2、如果配置的是按钮的话，就是页面上按钮的唯一标识。云表单会自动生成按钮的ID
                                               </template>
                                                <question-circle-outlined />
                                        </a-tooltip></span>
                                </a-form-item>
                            </template>
                            <a-form-item label="路由名称" name="router_name"
                                :rules="[{ required: true, message: '路由名称不能为空', trigger: 'blur' }]">
                                <a-input v-model:value="menuForm.router_name" oninput="value=value.replace(/[^A-Za-z]/g,'')"
                                    placeholder="请输入路由名称" allowClear />
                                    <span  style="    position: absolute;right: -20px;top: 4px;"  ><a-tooltip class="tooltip" placement="right">
                                            <template #title>
                                                路由名称是系统菜单的名称区分，不要重复
                                                </template>
                                                <question-circle-outlined />
                                        </a-tooltip></span>
                            </a-form-item>
                            <a-form-item label="上级菜单名称" name="up_menu_name">
                                <a-input v-model:value="menuForm.up_menu_name" disabled />
                            </a-form-item>
                            <a-form-item label="菜单状态" name="menu_status"
                                :rules="[{ required: true, message: '菜单状态不能为空', trigger: 'change' }]">
                                <a-select v-model:value="menuForm.menu_status" placeholder="请选择菜单状态" allowClear>
                                    <a-select-option value="EFCTIV">有效</a-select-option>
                                    <a-select-option value="INVLD">无效</a-select-option>
                                </a-select>
                            </a-form-item>

                            <a-form-item label="菜单图标" name="menu_icon" v-if="menuForm.menu_type === 'MENU'">
                                <a-popover v-model:visible="showIconSelectPopover" trigger="click"
                                    :overlayStyle="{ width: '34%' }">
                                    <template #content>
                                        <div class="icon-list">
                                            <div class="icon-list_item" v-for="(item, index) in iconList" :key="index"
                                                @click="handleSelectedIcon(item)">
                                                <svg-icon color="#999" :name="item" size="18" />
                                                <span>{{ item }}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <a-input v-model:value="menuForm.menu_icon" placeholder="点击选择图标" allowClear>
                                        <template v-if="menuForm.menu_icon" #prefix>
                                            <svg-icon color="#999" :name="menuForm.menu_icon" />
                                        </template>
                                    </a-input>
                                </a-popover>
                            </a-form-item>
                            <a-form-item label="菜单中展示状态" name="menu_show"
                                :rules="[{ required: true, message: '展示状态不能为空', trigger: 'change' }]">
                                <a-radio-group v-model:value="menuForm.menu_show">
                                    <a-radio :value="1">展示</a-radio>
                                    <a-radio :value="0">隐藏</a-radio>
                                    
                                </a-radio-group>
                                <span><a-tooltip class="tooltip" placement="right">
                                            <template #title>
                                                菜单中展示状态： 默认都是展示，当需要设置的菜单不需要前端展示的时候选择隐藏。</template>
                                                <question-circle-outlined />
                                        </a-tooltip></span>
                            </a-form-item>
                            <div class='btn_wrap'>
                                <a-button html-type="submit" type="primary" :loading="saveBtnLoading">保存</a-button>
                            </div>
                        </a-form>
                    </div>
                </a-col>
            </a-row>
            <a-row justify="center" align="middle" style="height: calc(100vh - 210px)" v-if="isShowEmpty && !appSpinning">
                <a-col>
                    <a-empty :image="simpleImage" />
                </a-col>
            </a-row>
        </a-spin>
    </div>
</template>
<script lang="ts">
import { Options, Vue, } from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { baseApi, ResponseData } from '@/libs/BaseApi';
import { message, Modal, Empty } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { ExclamationCircleOutlined,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import type {
    AntTreeNodeDropEvent,
    TreeProps,
} from 'ant-design-vue/es/tree';

@Options({ components: { SvgIcon ,QuestionCircleOutlined} })
export default class Menu extends Vue {
    @Ref('menuFormRef') readonly menuFormRef!: FormInstance
    public spinning = false
    public appSpinning = false
    public queryParam = {
        appId: undefined
    }
    public isShowEmpty = true
    public appSelectOption: Array<any> = []
    public fieldNames = {
        title: 'menu_name',
        key: 'menu_id'
    }
    public selectedKeys: any[] = []
    public expandedKeys: string[] = []
    public showMenuTree = false
    public treeData: Array<any> = []
    public showRightCol = false
    public menuForm: any = {
        menu_id: '',
        menu_name: '',
        menu_type: '',
        menu_url: '',
        router_name: '',
        up_menu: '',
        up_menu_name: '',
        menu_status: '',
        menu_icon: '',
        menu_show: '',
        menu_seq: '',
        menu_order: ''
    }
    public saveBtnLoading = false
    public simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
    public addOrEdit = ''
    public options: Array<any> = []
    public showIconSelectPopover = false
    public iconList: string[] = []
    public created() {
        this.getAppList()
        const files = require.context('@/icons/svg', false, /\.svg$/)
        files.keys().forEach(key => {
            this.iconList.push(key.replace(/(\.\/|\.svg)/g, ''))
        })
    }
    //获取应用列表
    public getAppList() {
        this.appSpinning = true
        this.appSelectOption = []
        baseApi.post('/app/queryAppIdAndName.do', {}, 'sec').then((res: ResponseData<any, any>) => {
             
            this.appSpinning = false
            res.data.forEach(item => {
                const option = {
                    label: item.app_name,
                    value: item.app_id
                }
                this.appSelectOption.push(option)
                 
            })
        }).catch(() => {
            this.appSpinning = false
        })
    }
    public onAppSelectChange(appId: string) {
        if (appId) {
            this.getTreeList(appId)
        } else {
            this.isShowEmpty = true
        }
    }
    public filterOption(input: string, option: any) {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    //选择菜单节点
    public onNodeSelect(selectedKeys: any, { selectedNodes }: any) {
        this.selectedKeys = selectedKeys
        this.showRightCol = true
        if (selectedNodes.length > 0) {
             
            const selectedNode = selectedNodes[0]
            if (selectedNode.isNewNode) {
                this.addOrEdit = 'add'
                this.menuFormRef.resetFields()
                this.menuForm.menu_name = selectedNode.menu_name
                this.menuForm.menu_id = ''
                this.menuForm.menu_seq = selectedNode.menu_seq
                this.menuForm.up_menu = selectedNode.up_menu
                this.menuForm.up_menu_name = selectedNode.up_menu_name
            } else {
                this.addOrEdit = 'edit'
                Object.keys(this.menuForm).forEach(key => {
                    this.menuForm[key] = selectedNode[key]
                })
            }
        }
    }
    public loopFn(node: any, id: string, fn: any) {
        node.some((item: any, index: number) => {
            if (item.menu_id === id) {
                fn(node, item, index)
                return true;
            }
            if (item.children && item.children.length) {
                this.loopFn(item.children, id, fn);
            }
        });
    }
    //修改菜单名称
    public changMenuName() {
        if (this.addOrEdit === 'add') {
            this.loopFn(this.treeData, this.selectedKeys[0], (node: any, item: any, index: number) => {
                 
                 
                node[index].menu_name = this.menuForm.menu_name
            });
        }
    }
    //新增菜单节点
    public add(nodeInfo: any) {
         
        const menuId = new Date().getTime()
        this.loopFn(this.treeData, nodeInfo.menu_id, (node: any, item: any, index: number) => {
            if (!node[index].children) {
                node[index].children = []
            }
            node[index].children.push({
                menu_name: '新增节点',
                menu_id: menuId,
                children: [],
                menu_seq: nodeInfo.menu_seq,
                up_menu: nodeInfo.menu_id,
                up_menu_name: nodeInfo.menu_name,
                isNewNode: true
            })
        });
        this.selectedKeys = [menuId]
        this.expandedKeys.push(nodeInfo.menu_id)
        this.showRightCol = true
        this.addOrEdit = 'add'
        this.$nextTick(() => {
            this.menuFormRef.resetFields()
            this.menuForm.menu_name = '新增节点'
            this.menuForm.menu_id = ''
            this.menuForm.menu_seq = nodeInfo.menu_seq
            this.menuForm.up_menu = nodeInfo.menu_id
            this.menuForm.up_menu_name = nodeInfo.menu_name
        })
    }

    //删除
    public remove(nodeId: string) {
         
        Modal.confirm({
            title: '温馨提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '确定要删除吗？',
            cancelText: '取消',
            okText: '确定',
            onOk: () => {
                this.showRightCol = false
                baseApi.post('/menu/delMenu.do', { menu_id: nodeId }, 'sec').then(() => {
                    message.success('删除成功')
                    this.getTreeList(this.queryParam.appId)
                })
            }
        });
    }

    //右键菜单点击
    public onContextMenuClick(menuKey: string, nodeInfo: any) {
        if (menuKey === 'add') {
            this.add(nodeInfo)
        } else {
            this.remove(nodeInfo.menu_id)
        }
    }

    //获取MenuTree列表
    public getTreeList(appId: string | undefined) {
        this.isShowEmpty = false
        this.spinning = true
        baseApi.post('/menu/queryMenu.do', { app_id: appId }, 'sec').then((res: ResponseData<any, any>) => {
            this.spinning = false
            this.showMenuTree = true
            this.treeData = res.data
             
            if (this.expandedKeys.length === 0) {
                this.expandedKeys = [this.treeData[0].menu_id]
            }
        }).catch(() => {
            this.spinning = false
        })
    }
    //节点拖拽
    public onDrop(info: AntTreeNodeDropEvent) {
         
        // 目标节点
        const dropKey = info.node.eventKey as string;
         
        // 拖动节点
        const dragKey = info.dragNode.eventKey as string;
         
        const dropPos: string[] = (info.node.pos as string).split('-');

        // 拖动的位置
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
         
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
        const param = {
            dragKey: dragKey,
            targetKey: dropKey,
            parentKey: info.dragNode.up_menu
        }
        baseApi.post('/menu/updateMenuOrder.do', param, 'sec')
    }
    //Tree展开/收起
    public onExpand(expandedKeys: string[]) {
         
        this.expandedKeys = expandedKeys
    }
    public onMenuTypeChange(val: any) {
        if (val === 'MENU') {
            this.menuForm.menu_icon = ''
        }
    }
    //图标选择
    public handleSelectedIcon(iconName: string) {
        this.menuForm.menu_icon = iconName
        this.showIconSelectPopover = false
    }
    //保存
    public save() {
         
        this.saveBtnLoading = true
        let requestUrl = ''
        let msg = ''
        if (this.addOrEdit === 'edit') {
            requestUrl = '/menu/mdfMenu.do'
            msg = '修改成功'
        } else {
            requestUrl = '/menu/addMenu.do'
            msg = '保存成功'
        }
        baseApi.post(requestUrl, this.menuForm, 'sec').then(() => {
            this.saveBtnLoading = false
            this.showRightCol = false
            message.success(msg)
            this.getTreeList(this.queryParam.appId)
        }).catch(() => {
            this.saveBtnLoading = false
        })
    }
}
</script>
<style scoped lang="less">
.menu-page {
    padding-top: 20px;
    height: 100%;

    :deep(.ant-spin-nested-loading) {
        height: 100%;

        .ant-spin-container {
            height: 100%;

            .ant-empty-normal {
                margin: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                translate: -50% -50%;
            }

            .ant-spin {
                position: absolute;
                top: 50%;
                left: 50%;
                translate: -50%;
            }
        }
    }

    .left-col {
        min-height: 450px;
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
    }

    .right-col {
        .btn_wrap {
            .ant-btn {
                margin-left: 380px;
            }
        }
    }

}

.icon-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    height: 200px;
    overflow-y: scroll;

    .icon-list_item {
        display: flex;
        align-items: center;
        flex: 0 1 33%;
        height: 28px;
        cursor: pointer;
    }

    .svg-icon {
        margin-right: 5px;
    }

}
</style>
