<template>
    <div>
        <div class="customer-top-area">
        <div class="left">
            <!-- <div class="export">导出</div>
            从不同的端进来的用户，需要合并到一个用户上 -->
        </div>
        <div class="right">
            <div class="filter-button" @click="showDrawer">
                <img class="image-icon" src="./filter-fill.png" alt="">
                筛选
            </div>
            <a-input class="search-form"
            @pressEnter="getRealNickName"
            v-model:value="realNickName"
            placeholder="请输入关键字回车搜索">
            <template #prefix>
                <img class="image-icon" src="./search-fill.png" alt="">
            </template>
            </a-input>

        </div>
        </div>
        <div class="grey-space"></div>
        <div class="customer-middle-area">
        <!-- :scroll="{x: 1000, y: windowHeight*0.565}" -->
        <a-table
            :dataSource="state.dataSource"
            :columns="columns"
            :pagination = false
            :scroll="{ x: 1200,  y: windowHeight*0.59}"
            >
            <template #headerCell="{ column }">
            <template v-if="column.key === 'people'">
                <span style="color:#bfbfbf;">
                所属人群
                </span>
            </template>
            </template>
            <template #entry_id="{ record }">
            <a-tooltip placement="topLeft">
                <template #title>{{ record.entry_id }}</template>
                <div class="content-text">{{ record.entry_id }}</div>
            </a-tooltip>
            </template>
            <template #iugNickName="{ record }">
            <a-tooltip placement="topLeft">
                <template #title>{{ record.iugNickName }}</template>
                <div @click="rowClick(record)" class="content-link">{{ record.iugNickName }}</div>
            </a-tooltip>
            </template>
            <template #mdf_date="{ record }">
            <a-tooltip placement="topRight">
                <template #title>{{ record.mdf_date }}</template>
                <div class="content-text">{{ record.mdf_date }}</div>
            </a-tooltip>
            </template>
            <template #regist_time="{ record }">
            <a-tooltip placement="topRight">
                <template #title>{{ record.regist_time }}</template>
                <div class="content-text">{{ record.regist_time }}</div>
            </a-tooltip>
            </template>
        </a-table>
        </div>
        <div class="pagination-area">
            <a-pagination
                show-quick-jumper
                @change="handleTableChange"
                v-model:current="customer.current"
                v-model:page-size="customer.pageSize"
                :total="customer.total"
                :show-total="total => `共 ${total} 条`"
                />
        <!-- <a-pagination v-model:current="customer.current" :total="customer.total" size="small"/> -->
        <!-- <a-pagination @change="handleTableChange" v-model:current="customer.current" :total="customer.total" size="small"
            :show-total="() => `共计 ${customer.total} 条`"
            show-quick-jumper
            >
            <template #itemRender="{ type, originalElement }">
            <a v-if="type === 'prev'">上一页</a>
            <a v-else-if="type === 'next'">下一页</a>
            <component :is="originalElement" v-else></component>
            </template>
        </a-pagination> -->

        </div>

        <a-drawer
        v-model:visible="visible"
        class="custom-class"
        title="筛选设置"
        placement="right"
        width="500px"
        @after-visible-change="afterVisibleChange"
        >
        <div class="form-layout">
            <div class="form-area">
            <div class="customer-form">
                <div class="left">性别</div>
                <div>
                <a-select
                    ref="select"
                    v-model:value="sexValue"
                    :options="sexList"
                    class="chooseSelect"
                ></a-select>
                </div>
            </div>
            <!-- <div class="customer-form">
                <div class="left-1">归属机构</div>
                <div>
                <a-select
                    ref="select"
                    disabled
                    v-model:value="institutionValue"
                    :options="institutionList"
                    class="chooseSelect"
                ></a-select>
                </div>
            </div> -->
            <div class="customer-form">
                <div class="left">来源渠道</div>
                <div>
                <a-select
                    ref="select"
                    v-model:value="channelValue"
                    :options="channelList"
                    class="chooseSelect"
                ></a-select>
                </div>
            </div>
            <div class="customer-form">
                <div class="left-1">所属人群</div>
                <div>
                <a-select
                    ref="select"
                    disabled
                    v-model:value="crowdValue"
                    :options="crowdOption"
                    class="chooseSelect"
                ></a-select>
                </div>
            </div>
            <div class="customer-form">
                <div class="left">
                是否实名认证
                </div>
                <div>
                <a-select
                    ref="select"
                    class="chooseSelect"
                    v-model:value="isRealNameValue"
                    :options="isRealNameOption"
                ></a-select>
                </div>
            </div>
            <div class="customer-form">
                <div class="left">是否高级用户</div>
                <div>
                <a-select
                    ref="select"
                    class="chooseSelect"
                    v-model:value="isAdvanceValue"
                    :options="isAdvanceOption"
                    
                ></a-select>
                </div>
            </div>
            <div class="customer-form">
                <div class="left">最后登录时间</div>
                <div>
                <a-date-picker
                    class="periodDate"
                    valueFormat="YYYY-MM-DD 00:00:00"
                    v-model:value="startTime"
                    :disabledDate="disabledDateStart"
                    placeholder="开始时间"
                />
                <span class="toReach">至</span>
                <a-date-picker
                    class="periodDate"
                    valueFormat="YYYY-MM-DD 23:59:59" 
                    v-model:value="endTime" 
                    :disabled-date="disableEndTime" placeholder="结束时间" />
                </div>
            </div>
            <div class="customer-form">
                <div class="left">注册时间</div>
                <div>
                <a-date-picker
                    class="periodDate"
                    valueFormat="YYYY-MM-DD 00:00:00"
                    v-model:value="registerStartTime"
                    :disabledDate="disablRegisterStart"
                    placeholder="开始时间"
                />
                <span class="toReach">至</span>
                <a-date-picker
                    class="periodDate"
                    valueFormat="YYYY-MM-DD 23:59:59" 
                    v-model:value="registerEndTime" 
                    :disabled-date="disableRegisterEnd" placeholder="结束时间" />
                </div>
            </div>

            </div>
            <div class="button-area">
            <div class="reset-button" @click="resetList">重置</div>
            <div class="query-button" @click="queryList">查询</div>
            </div>
        </div>

        </a-drawer>
        <a-drawer
        v-model:visible="detailVisible"
        size="large"
        class="custom-class"
        title="用户详情"
        placement="right"
        width="1000px"
        @close="detailsClose"
        >
        <div class="detail-layout">
            <div class="layout">
            <div class="layout-left">
                <!-- <div class="left-title">
                基本信息
                </div> -->
                <div class="item-layout">
                <div class="item-left">集团用户标识：</div>
                <div class="item-right">{{custoInfo.entryId}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">用户昵称：</div>
                <div class="item-right">{{custoInfo.nickName}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">性别：</div>
                <div class="item-right">{{custoInfo.sex}}</div>
                </div>
                <!-- <div class="item-layout">
                <div class="item-left">归属机构：</div>
                <div class="item-right"></div>
                </div> -->
                <div class="item-layout">
                <div class="item-left">星级：</div>
                <div class="item-right">{{custoInfo.star}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">是否实名认证：</div>
                <div class="item-right">{{custoInfo.isRealAuthCode}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">是否高级用户：</div>
                <div class="item-right">{{custoInfo.isAdvance}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">微信小程序OpenId：</div>
                <div class="item-right">{{custoInfo.weixinOpenId}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">百度用户OpenId：</div>
                <div class="item-right">{{custoInfo.baiduOpenId}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">百度用户UnionId：</div>
                <div class="item-right">{{custoInfo.baiduUnionId}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">微信用户UnionId：</div>
                <div class="item-right">{{custoInfo.weixinUnionId}}</div>
                </div>
                <div class="item-layout">
                <div class="item-left">支付宝用户UserId：</div>
                <div class="item-right">{{custoInfo.alipayUserId}}</div>
                </div>
            </div>
            <div class="layout-middle"></div>
            <div class="layout-right">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="1" tab="用户行为">
                    <div class="customer-behavior" v-if="behaviorList.length !== 0">
                        <div class="behavior-item" v-for="item in behaviorList">
                        <div class="line-up"></div>
                        <div class="line-down"></div>
                        <div class="behavior-item-left">
                            <div class="left-circle">
                            <div class="circle-center"></div>
                            </div>
                        </div>
                        
                        <div class="behavior-item-right" >
                            <div class="behavior-content">
                            {{item.behaviorDescription}}
                            </div>
                            <div class="behavior-time">{{item.clientTime}}</div>
                        </div>
                        </div>
                        <div class="loadMore" v-if="behaviorTotal > 0 && isShow"
                        @click="seeMore" >查看更多</div>
                    </div>
                    <a-empty v-if="behaviorList.length === 0" :image="simpleImage" />
                    </a-tab-pane>

                    <a-tab-pane key="2" tab="行为标签" force-render>
                        <div class="label-area">
                            <div v-if="label.dataSource.length !== 0" style="width: 450px;height: 450px;" id="behaviorLabelGraph"></div>
                        </div>
                        <a-empty v-if="label.dataSource.length === 0" :image="simpleImage" />
                    </a-tab-pane>
                </a-tabs>
            </div>
            </div>
            <div class="button-area">
            <div class="back-button" @click="goBack">返回</div>
            </div>
        </div>

        </a-drawer>
    </div>

</template>
  
<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { customerManage } from '../../../libs/api/index';
import { Empty, SelectProps, message } from 'ant-design-vue';
import { AxiosRequestHeaders } from 'axios';
import moment from 'moment';



// 生命周期钩子函数---挂载完成
onMounted(() => {
    window.onresize = () => {
        return (() => {
        windowHeight.value = document.documentElement.clientHeight;
        })()
    }

    getCustomerListInfo()
})

// 用户列表分页
const customer = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
})

const handleTableChange = (page:number, pageSize:number) => {
    console.log("分页啊", page,pageSize )
    customer.current = page;
    customer.pageSize = pageSize;
    getCustomerListInfo()

}


// 输入关键字回车搜索 --- 模糊匹配昵称
const realNickName = ref<string>('')
const getRealNickName = (e: { keyCode: number; }) => {
    if(e.keyCode === 13){
        getCustomerListInfo()

    }

}
watch(realNickName, (newValue) => {
    realNickName.value = newValue

    if(realNickName.value === ""){
        getCustomerListInfo()
    }

})

// 用户列表筛选 --- 性别/归属机构/来源渠道/所属人群/是否实名认证/是否高级用户/最后登录时间/注册时间
// 性别
const sexValue = ref<string>('')
const sexList = ref<SelectProps['options']>([
    {
        value: '',
        label: '全部',
    },
    {
        value: '1',
        label: '男',
    },
    {
        value: '2',
        label: '女',
    }
]);

// 归属机构
// const institutionValue = ref<string>('')
// const institutionList = ref<SelectProps['options']>([
//   {
//     value: '',
//     label: '全部',
//   }
// ]);

// 来源渠道
const channelValue = ref<string>('')
const channelList = ref<SelectProps['options']>([
    {
        value: '',
        label: '全部',
    },
    {
        value: '0',
        label: '微信小程序',
    },
    {
        value: '1',
        label: '百度小程序',
    },
    {
        value: '2',
        label: '支付宝小程序',
    },
    {
        value: 'APP',
        label: 'APP',
    }
]);
// 所属人群
const crowdValue = ref<string>('')
const crowdOption = ref<SelectProps['options']>([
    {
        value: '',
        label: '全部',
    }
]);
// 是否实名认证
const isRealNameValue = ref<string>('')
const isRealNameOption = ref<SelectProps['options']>([
    {
        value: '',
        label: '全部',
    },
    {
        value: '1|2',
        label: '是',
    },
    {
        value: '0',
        label: '否',
    },
]);
// 是否高级用户
const isAdvanceValue = ref<string>('')
const isAdvanceOption = ref<SelectProps['options']>([
    {
        value: '',
        label: '全部',
    },
    {
        value: '0',
        label: '是',
    },
    {
        value: '1',
        label: '否',
    }
]);
// 最后登录时间
const startTime = ref<string>('')
const disabledDateStart = (current: any) => {
    if (endTime.value) {
        return current > moment(endTime.value).endOf('day');
    }
}

const endTime = ref<string>('')
const disableEndTime = (current: any) => {
    if (startTime.value) {
        return current && current < moment(startTime.value).subtract(1, 'days').endOf('day');
    }
}

// 注册时间
const registerStartTime = ref<string>('')
const disablRegisterStart = (current: any) => {
    if (registerEndTime.value) {
        return current > moment(registerEndTime.value).endOf('day');
    }
}

const registerEndTime = ref<string>('')
const disableRegisterEnd = (current: any) => {
    if (registerStartTime.value) {
        return current && current < moment(registerStartTime.value).subtract(1, 'days').endOf('day');
    }
}


// 重置列表
const resetList = () => {
    sexValue.value = "";
    channelValue.value = "";
    isRealNameValue.value = "";
    isAdvanceValue.value = "";
    startTime.value = "";
    endTime.value = "";
    registerStartTime.value = "";
    registerEndTime.value = "";
    getCustomerListInfo()
    visible.value = false
}

// 查询列表
const queryList = () => {
    getCustomerListInfo()
    visible.value = false
}


// 获取用户列表信息
interface customerAttr {
    iugNickName: string
    star_level: string
    customer_info_id: string
    baidu_union_id: string
    sex: string
    alipay_user_id: string
    real_name: string
    baidu_open_id: string
    regist_time: string
    is_advance: string
    mdf_date: string
    is_realname_auth_code: string
    rn: number,
    entry_id: string
    weixin_union_id: string
    weixin_open_id: string
    env_type_code: string
}

const state = reactive({
    dataSource: [] as customerAttr[]
})
// const headers = {
//   // ['X-Auth-Token'] : localStorage.get('token')
// }
const getCustomerListInfo = async() => {

    let param = {
        name: realNickName.value,
        sex: sexValue.value,
        envTypeCode: channelValue.value,
        crowd: "", // 所属人群
        isRealNameAuthCode: isRealNameValue.value,
        isAdvance: isAdvanceValue.value,
        startTimeStr: startTime.value,
        endTimeStr: endTime.value,
        registerStartTimeStr: registerStartTime.value,
        registerEndTimeStr: registerEndTime.value
    };

    const header: any = {
        request: (header: AxiosRequestHeaders) => {
            header.nowPage = customer.current;
            header.row4Page = customer.pageSize;
        },
    };

    console.log("用户列表数据", param)
    await customerManage.getCustomerList(param, header)
    .then((res: any) => {

        if(res.flag === "success"){

            state.dataSource = res.data
            customer.total = res.recordsTotal;

        }

    })

}

// 点击列表某一行展示用户详情
const detailVisible = ref<boolean>(false)
const customerId = ref<string>("")
const rowClick = (record: customerAttr) => {

    detailVisible.value = true
    activeKey.value = "1"
    customerId.value = record.customer_info_id
    custoInfo.nickName = record.iugNickName
    custoInfo.sex = record.sex
    custoInfo.star = record.star_level
    custoInfo.isRealAuthCode = record.is_realname_auth_code
    custoInfo.isAdvance = record.is_advance
    custoInfo.weixinOpenId = record.weixin_open_id
    custoInfo.baiduOpenId = record.baidu_open_id
    custoInfo.baiduUnionId = record.baidu_union_id
    custoInfo.weixinUnionId = record.weixin_union_id
    custoInfo.alipayUserId = record.alipay_user_id
    custoInfo.entryId = record.entry_id
    behaveCurrent.value = 1
    behaviorList.length = 0
    getCustomerByIdInfo()
    getCustomerLabelInfo()
}


// 查询用户详情 --- 基本信息
const custoInfo = reactive({
    realName: "",
    nickName: "",
    birthday: "",
    age: "",
    sex: "",
    phone: "",
    star: "",
    isRealAuthCode: "",
    groupUser: "",
    isAdvance: "",
    weixinOpenId: "",
    baiduOpenId: "",
    baiduUnionId: "",
    weixinUnionId: "",
    alipayUserId: "",
    entryId: ""
})

// 查询用户详情 --- 行为标签
interface labelType {
    name: string,
    value: number
}
const label = reactive({
    dataSource: [] as labelType[]
})
const getCustomerLabelInfo = async() => {
    const param = {
        customerInfoId: customerId.value
    }

    await customerManage.getCustomerLabel(param, {})
    .then((res:any) => {
        label.dataSource = res.data;
        if(res.data && res.data.length > 0){
            nextTick(() => {
                drawBehaviorDiagram();
            })
        }

    })

}

// 查询用户详情 --- 用户行为
interface behaviorType {
    behaviorDescription: string,
    clientTime: string
}
const behaviorList:behaviorType[] = reactive([])
// 通过列表中 customerId 调后台接口查询用户详情
const getCustomerByIdInfo = async() => {
    const param = {
        customerInfoId: customerId.value
    }

    const header: any = {
        request: (header: AxiosRequestHeaders) => {
            header.nowPage = behaveCurrent.value;
            header.row4Page = 5;
        },
    };

    await customerManage.getCustomerById(param, header)
    .then((res: any) => {

        if(res.flag === "success"){

            res.data.forEach((item: behaviorType) => {
                behaviorList.push(item)
            })

            if(((behaveCurrent.value-1)*5 + res.data.length) >= res.recordsTotal){
                isShow.value =false;
            }
            behaviorTotal.value = res.recordsTotal
        }



    })

}

// 查看更多
const behaveCurrent = ref(1)
const seeMore = () => {
    behaveCurrent.value ++;
    getCustomerByIdInfo();
}

// 用户行为总数
const behaviorTotal = ref(0)
// 判断是否是用户行为数据列表的最后一页
const isShow = ref(true)


// Tabs标签页
const activeKey = ref<string>("1")

// 行为标签模块
const drawBehaviorDiagram = () => {

const myChart = echarts.init(document.getElementById("behaviorLabelGraph") as HTMLElement);

    myChart.setOption({
        grid: {
            top: 2,
            left: 2
        },
        tooltip: {},
        series: [
        {
            type: 'treemap',
            roam: false, //是否开启拖拽漫游（移动和缩放）
            nodeClick: false, //点击节点后的行为,false无反应
            breadcrumb: { show: false},
            data: label.dataSource
        }]
    });
}


// 抽屉
const visible = ref<boolean>(false);

const afterVisibleChange = (bool: boolean) => {
    console.log('visible', bool);
};

const showDrawer = () => {
    visible.value = true;
};

// a-table自适应页面高度
const windowHeight = ref(0)
windowHeight.value = document.documentElement.clientHeight;  //实时屏幕高度

watch(windowHeight, (newValue, oldValue) => {
    windowHeight.value = newValue
    console.log("是实时屏幕高度啊", newValue, oldValue)

})


const columns = [
{
    title: '序号',
    dataIndex: 'rn',
    key: 'rn',
    align:'center', 
    width:'50px'
},
{
    title: '集团用户标识',
    dataIndex: 'entry_id',
    key: 'entry_id',
    align:'center',
    Width: '500px',
    slots: { customRender: 'entry_id' }
},
{
    title: '用户昵称',
    dataIndex: 'iugNickName',
    key: 'iugNickName',
    align:'center',
    slots: { customRender: 'iugNickName' }
},
{
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    align:'center',
    width:'50px'
},
// {
//   title: '归属机构',
//   dataIndex: '',
//   key: '',
//   align:'center',
// },
{
    title: '来源渠道',
    dataIndex: 'env_type_code',
    key: 'env_type_code',
    align:'center',
},
{
    title: '所属人群',
    dataIndex: 'people',
    key: 'people',
    align:'center',
},
{
    title: '是否实名认证',
    dataIndex: 'is_realname_auth_code',
    key: 'is_realname_auth_code',
    align:'center',
},
{
    title: '是否高级用户',
    dataIndex: 'is_advance',
    key: 'is_advance',
    align:'center',
},
{
    title: '最后登录时间',
    dataIndex: 'mdf_date',
    key: 'mdf_date',
    align:'center',
    ellipsis: true,
    slots: { customRender: 'mdf_date' }
},
{
    title: '注册时间',
    dataIndex: 'regist_time',
    key: 'regist_time',
    align:'center',
    ellipsis: true,
    slots: { customRender: 'regist_time' }
},
]

// 详情页收回
// 返回
const goBack = () => {
    detailVisible.value = false
    isShow.value = true
}
const detailsClose = () => {
    isShow.value = true
};

// 数据为空时展示
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

</script>
<style lang="less" scoped>
.customer-top-area {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 13px;
    background-color: #FFFFFF;

    .left {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        
        .export {
            width: 75px;
            height: 29.5px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #E8380D;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            margin-right: 6px;
        }
    }

    .right {
        display: flex;
        align-items: center;
        height: 100%;

        .filter-button {
            width: 76px;
            height: 49.5%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 5px;
            border-radius: 4px;
            font-size: 13px;
            color: #262626;
            border: 1.5px solid #ABABAB;
            cursor: pointer;
        }

        .search-form {
            width: 253px;
            border-radius: 4px;
            font-size: 10px;
            border: 1.5px solid #ABABAB;


        }

    }
}

.customer-middle-area {
    padding: 13px;
}

:deep(.ant-input-affix-wrapper > input.ant-input) {
    font-size: 8px;
}

.periodDate {
    width: 124px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

.toReach {
    margin: 0 5px;
}

.inputSelect {
    margin-right: 24px;
    width: 208px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

.chooseSelect {
    margin-right: 24px;
    width: 208px;
    height: 32px;
    border-radius: 4px;
}
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border-radius: 4px;
    border: 1px solid #ababab;
}

:deep(.ant-picker-input > input ) {
    font-size: 10px;
    padding: 8px 0;
}

:deep(.ant-picker-small) {
    padding: 0px 2px 0px;
}

:deep(.ant-picker-range-separator) {
    padding: 0px;
}
// :deep(.ant-pagination-total-text) {
//     position: absolute;
//     left: 10px;
// }

// :deep(.ant-pagination-options-size-changer) {
//   position: absolute;
//   left: 93px;
//   top: 29%;
// }
.image-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
}

.grey-space {
    width: 100%;
    height: 10px;
    background-color: #F5F5F5;
}

.pagination-area {
    height: 45px;
    width: 100%;
    background-color: white;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
    padding-right: 27px;
}

.form-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .form-area {

        .customer-form {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
            
            .left {
                width: 112px;
                text-align: left;
                margin-right: 10px;
                color: black;
            }
            .left-1 {
                width: 112px;
                text-align: left;
                margin-right: 10px;
                color: #bfbfbf;
                
            }
        }
    }

    .button-area {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: end;
        border-top: 1px solid #f0f0f0;
        padding-top: 15px;

        .reset-button {
            width: 63px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            margin-right: 18px;
            color: #ABABAB;
            border: 1.5px solid #ABABAB;
            cursor: pointer;
        
        }
        .query-button {
            width: 70px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #E8380D;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            cursor: pointer;

        }
    }
}

.detail-layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .layout {
        width: 100%;
        display: flex;
        margin-bottom: 15px;

        .layout-left {
            width: 43%;
            height: 100%;
            padding-top: 15px;
            padding-right: 23px;

            .left-title {
                color: black;
                font-size: 18px;
                font-weight: 500;
                border-left: 2px solid blue;
                padding-left: 15px;
            }

            .item-layout {
                display: flex;
                margin-bottom: 20px;

                .item-left {
                    width: 140px;
                    font-size: 14px;
                    font-family: PingFang-SC-Regular, PingFang-SC;
                    font-weight: 400;
                    color: #999999;
                }

                .item-right {
                    margin-left: 13px;
                    font-size: 14px;
                    font-family: PingFang-SC-Regular, PingFang-SC;
                    font-weight: 400;
                    color: #333333;
                    word-break: break-all;
                }

            }
        }

        .layout-middle {
            background-color: #f1f1f1;
            width: 6px;
            height: 100%;
        }

        .layout-right {
            width: 57%;
            height: 100%;
            padding-left: 23px;

            .detail-top {
                display: flex;
                border-bottom: 1px solid #bfbfbf;

                .top-item {
                    color: black;
                    font-size: 18px;
                    font-weight: 500;
                    width: 100px;
                    text-align: center;
                    padding-bottom: 8px;
                    cursor: pointer;
                
                }

                .actived {
                    border-bottom: 2px solid blue;
                }
            }
        }
    }


    .button-area {
        width: 100%;
        height: 65px;
        display: flex;
        justify-content: end;
        align-items: center;
        padding: 45px 0;
        border-top: 1px solid #ABABAB;

        .back-button {
            width: 66px;
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #ABABAB;
            border: 1.5px solid #ABABAB;
            cursor: pointer;
        }

    }
}

.customer-behavior {
    margin-top: 10px;
    padding-left: 20px;

    .behavior-item {
        display: flex;
        padding-bottom: 20px;
        position: relative;

        .line-up {
            position: absolute;
            bottom: 3px;
            left: -1px;
            height: 50%;
            width: 2px;
            border-left: 1.5px dashed #dae0ed;
        }
        .line-down {
            position: absolute;
            left: -1px;
            top: -1px;
            height: 50%;
            width: 2px;
            border-left: 1.5px dashed #dae0ed;
        }

        .behavior-item-left {
            display: flex;
            align-items: center;
            position: absolute;
            top: 34%;
            left: -8.5px;

            .left-circle {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: #f7dcd4;
                display: flex;
                justify-content: center;
                align-items: center;

                .circle-center {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background-color: #ca3d20;
                }
            }
        }
        .behavior-item-right {
            border-radius: 10px;
            background-color: #fafafa;
            padding: 15px;
            margin-left: 20px;
            width: 100%;

            .behavior-content {
                font-size: 14px;
                font-weight: 500;
                word-break: break-all;
            }
            
            .behavior-time {
                font-size: 13px;
                margin-top: 10px;
                color: #7e7e7e;
            }

        }

    }

    .behavior-item:first-child {
        .line-down {
        display: none;
        }
    }
    .behavior-item:last-child {
        .line-up {
        display: none;
        }
    }


}

.loadMore {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #d5d5d5;
    border-radius: 8px;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;
}

.content-text {
    text-overflow :ellipsis;
    white-space :nowrap;
    overflow : hidden;
}
.content-link {
    text-overflow :ellipsis;
    white-space :nowrap;
    overflow : hidden;
    color: #1890ff;
    cursor: pointer;
    text-decoration: underline;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #e8380d;
}

:deep(.ant-tabs-ink-bar) {
    background: #e8380d;
}
.label-area {
    display: flex;
    justify-content: center; 
}
</style>
  