<!-- 下载页列表页 -->
<template>
    <div>
        <div class="verbalchoose">
            <a-row class="dowlodChoseRow">
                
                <a-col>
                    <span class="chooseTitle displayTitle">话术标签:</span>
                    <a-select class="chooseSelect" v-model:value="displayStyle" ref="select">
                        <a-select-option v-for="item in displayStyleList" :key="item.id">{{ item.label }} </a-select-option>
                    </a-select>
                </a-col>
                <a-col>
                    <span class="chooseTitle"> 话术内容: </span>
                    <a-input class="downloadInput" v-model:value="promotionPage" placeholder="请输入关键字"></a-input>
                </a-col>
                <!-- <a-col>
                    <span class="chooseTitle displayTitle">话术内容:</span>
                    <a-select class="chooseSelect" v-model:value="promotionChannel" ref="select">
                        <a-select-option v-for="item in promotionChannelList" :key="item.id">{{ item.label }} </a-select-option>
                    </a-select>
                </a-col> -->
                <a-col>
                    <span class="chooseTitle">话术状态:</span>
                    <a-select class="chooseSelect" v-model:value="taskStatus" ref="select">
                        <a-select-option v-for="item in taskStatusList" :key="item.id">{{ item.label }} </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <a-row class="dowlodInptRow">
                <a-col>
                    <span>创建时间:</span>
                    <a-date-picker
                        class="validityPeriodDate validityDateStart"
                        valueFormat="YYYY-MM-DD 00:00:00"
                        v-model:value="startTime"
                        :disabledDate="disabledDateStart"
                        placeholder="开始时间"
                    />
                    <span class="to">至</span>
                    <a-date-picker class="validityPeriodDate" valueFormat="YYYY-MM-DD 23:59:59" v-model:value="endTime" :disabled-date="disableEndTime" placeholder="结束时间" />
                </a-col>
                <div class="downloadBtn">
                    <a-button type="primary" danger class="queryBtn" @click="queryBtn">查询 </a-button>
                    <a-button class="cancleBtn" @click="cancleBtn">重置 </a-button>
                </div>
            </a-row>
          
        </div>
        <div class="downloadTable">
            <div>
                <a-row class="tableBtn">
                    <a-col>
                        <a-button class="addAppBtn" type="primary" @click="addbtn()" danger>新增话术 </a-button>
                    </a-col>
                    <a-col>
                        <a-button class="addAppBtn" type="primary" @click="addbtn2()" danger>上架 </a-button>
                    </a-col>
                    <a-col>
                        <a-button class="deleteBtn" danger @click="delList">批量删除 </a-button>
                    </a-col>
                </a-row>
            </div>
            <div class="queryList">
                <a-table
                    :columns="columns"
                    :pagination="pagination"
                    @change="changeProPage($event)"
                    :data-source="dataList"
                    :row-key="(record:any) => record.download_page_promotion_id"
                    :row-selection="{ selectedRowKeys: userTableSelectedKeys, onChange: onSelectChange }"
                >
                    <template #date="{ record }">
                        <div>{{ record.channelValidtsartDate.split(' ')[0] }}</div>
                        <div>{{ record.channelValidEndDate.split(' ')[0] }}</div>
                    </template>
                    <template #action="{ record }">
                        <a-button @click="goDetail(record)" v-if="record.taskState == '已上架'">详情</a-button>
                        <a-button @click="goEdit(record)" v-if="record.taskState == '已下架'">编辑</a-button>
                        <a-button @click="goToGrounding(record)" v-if="record.taskState == '已下架'">上架</a-button>
                        <a-button @click="goToOff(record)" v-if="record.taskState == '已上架'">下架</a-button>
                        <a-button @click="deleteSingle(record)">删除</a-button>
                    </template>
                </a-table>
                <a-modal style="background: #ffffff; border-radius: 6px" v-model:visible="addSingleDeleteModal">
                    <template #footer>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="closeSingleDelete">取消</a-button>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="sureSingleDelete">确定</a-button>
                    </template>
                    <p style="width: 176px; font-size: 16px; font-weight: 500; color: #333333">确定删除所选数据吗？</p>
                </a-modal>
                <a-modal style="background: #ffffff; border-radius: 6px" v-model:visible="addListDeleteModal">
                    <template #footer>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="closeListDelete">取消</a-button>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="sureListDelete">确定</a-button>
                    </template>
                    <p style="width: 176px; font-size: 16px; font-weight: 500; color: #333333">确定删除所选数据吗？</p>
                </a-modal>
                <a-modal style="background: #ffffff; border-radius: 6px" v-model:visible="addOffShelfModal">
                    <template #footer>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="closeOffShelfModal">取消</a-button>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="sureOffShelfModal">确定</a-button>
                    </template>
                    <p style="width: 176px; font-size: 16px; font-weight: 500; color: #333333">确定下架所选内容吗？</p>
                </a-modal>
                <a-modal style="background: #ffffff; border-radius: 6px" v-model:visible="addGroundingModal">
                    <template #footer>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="closeGroundingModal">取消</a-button>
                        <a-button type="primary" danger style="width: 84px; background: #e8380d; border-radius: 4px" @click="sureGroundingModal">确定</a-button>
                    </template>
                    <p style="width: 176px; font-size: 16px; font-weight: 500; color: #333333">确定上架所选内容吗？</p>
                </a-modal>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import moment from 'moment';
import { AxiosRequestHeaders } from 'axios';
import { downloadPageManageApi } from '@/libs/api';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
@Options({
    components: {},
})
export default class example extends Vue {
    created() {
        this.getList();
    }
    public displayStyle: any = '';
    public promotionChannel: any = '';
    public targetChannel: any = '';
    public taskStatus: any = '';
    //确定单条删除弹窗
    public addSingleDeleteModal: boolean = false;
    //单条删除id
    public singleDeleteId: string = '';
    //确定批量删除弹窗
    public addListDeleteModal: boolean = false;
    //确定下架弹框
    public addOffShelfModal: boolean = false;
    //批量删除List
    public deleteObjList: any = [];
    //话术内容里输入的值
    public promotionPage: string = '';
    //话术标签下拉框
    public displayStyleList: any[] = [
        {
            label: '全部',
            value: '0',
            id: '全部',
        },
        {
            label: '哈哈哈',
            value: '1',
            id: '图片',
        },
        {
            label: '链接',
            value: '2',
            id: '链接',
        },
    ];
    public promotionChannelList: any[] = [
        {
            label: '全部',
            value: '0',
            id: '全部',
        },
        {
            label: 'App',
            value: '1',
            id: 'App',
        },
        {
            label: '百度小程序',
            value: '2',
            id: '百度小程序',
        },
        {
            label: '微信小程序',
            value: '3',
            id: '微信小程序',
        },
        {
            label: '支付宝小程序',
            value: '4',
            id: '支付宝小程序',
        },
        {
            label: '微信公众号',
            value: '5',
            id: '微信公众号',
        },
    ];
    public targetChannelList: any[] = [
        {
            label: '全部',
            value: '0',
            id: '全部',
        },
        {
            label: 'App',
            value: '1',
            id: 'App',
        },
        {
            label: '微信小程序',
            value: '2',
            id: '微信小程序',
        },
    ];
    public taskStatusList: any[] = [
        {
            label: '全部',
            value: '0',
            id: '全部',
        },
        {
            label: '已上架',
            value: '1',
            id: '已上架',
        },
        {
            label: '已下架',
            value: '2',
            id: '已下架',
        },
    ];
    public pagination = {
        current: 1,
        pageSize: 10,
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['5', '10', '15', '20'],
        showTotal: (total: number) => `共 ${total} 条`, // 显示总
    };
    //开始时间
    public startTime: string = '';
    public disabledDateStart(current: any) {
        if (this.endTime) {
            return current > moment(this.endTime).endOf('day');
        } else {
        }
    }
    //结束时间
    public endTime: string = '';
    public disableEndTime(current: any) {
        if (this.startTime) {
            return current && current < moment(this.startTime).subtract(1, 'days').endOf('day');
        }
    }
    // 查询按钮
    public async getList() {
        let params = {
            // displayFormat: this.displayStyle, //显示样式
            promotionChannel: this.promotionChannel, //话术标签
            // targetChannel: this.targetChannel, //目标渠道
            taskState: this.taskStatus, //话术状态
            promotionPageComponent: this.promotionPage, //话术内容
            channelValidEndDate: this.endTime, //上架时间
            channelValidStartDate: this.startTime, //创建时间 开始日期
        };
        const header: any = {
            request: (header: AxiosRequestHeaders) => {
                header.nowPage = this.pagination.current;
                header.row4Page = this.pagination.pageSize;
            },
        };
        if (params.taskState == '全部') {
            params.taskState = '';
        }
        downloadPageManageApi.getQueryDownloadPageList(params, header).then((res: any) => {
            // console.log('下载页列表',res)
            let showList = res.defmap.elementData.filter((item: any) => {
                return item;
            });
            // console.log(showList,'showList------');
            this.pagination.total = res.recordsTotal;
            this.dataList = showList;
        });
    }
    //点击查询按钮
    public queryBtn() {
        this.getList();
    }
    //重置按钮
    public cancleBtn() {
        this.displayStyle = '';
        this.promotionChannel = '';
        this.targetChannel = '';
        this.taskStatus = '';
        this.promotionPage = '';
        this.startTime = '';
        this.startTime = '';
        this.endTime = '';
        this.getList();
    }
    // 选中行的数据
    public selectRowsData: any = [];
    //列表页
    public userTableSelectedKeys: string[] = [];
    public onSelectChange(selectedRowKeys: string[], selectedRows: any[]) {
        this.userTableSelectedKeys = selectedRowKeys;
        this.selectRowsData = selectedRows;
        console.log('selectRowsData', this.selectRowsData);
    }
    //table列表数据
    public dataList: any = [];
    //新增话术跳转
    public addbtn() {
        this.$router.push('/marktingManagement/newVerbal');
    }
    public router = useRouter();
    //详情按钮  传递ID并跳转
    public goDetail(detailRow: any) {
        this.router.push({ path: '/downloadPageManage/downloadPageDetail', query: { downloadPagePromotionId: detailRow.download_page_promotion_id } });
        // this.$router.push('/downloadPageManage/downloadPageDetail')
    }
    //编辑按钮 传递ID并跳转
    public goEdit(editRow: any) {
        this.router.push({ path: '/downloadPageManage/editDownloadPage', query: { downloadPagePromotionId: editRow.download_page_promotion_id } });
    }
    public taskType: string = '1';
    public isCheck: boolean = false;
    public disabled: boolean = false;
    public changeProPage(value: any) {
        this.pagination.current = value.current;
        this.pagination.pageSize = value.pageSize;
        this.getList();
    }
    //上、下架按钮
    public changeTaskOperate(selectRow: any) {
        let taskOperate = '';
        if (selectRow.taskState == '已上架') {
            taskOperate = '已下架';
        } else if (selectRow.taskState == '已下架') {
            taskOperate = '已上架';
        }
        let param = {
            downloadPagePromotionId: selectRow.download_page_promotion_id,
            taskOperate: taskOperate,
        };
        downloadPageManageApi.getUpdateTaskState(param, {}).then((res: any) => {
            this.addOffShelfModal = false;
            this.addGroundingModal = false;
            if (res.flag == 'success') {
                message.success(taskOperate + '成功!');
                this.getList();
            }
        });
    }
    public selectOffRow = {};
    //下架按钮
    public goToOff(selectOffRow: any) {
        this.addOffShelfModal = true;
        this.selectOffRow = selectOffRow;
        console.log('下架按钮传过来的对象', this.selectOffRow);
    }
    //点击确定下架
    public sureOffShelfModal() {
        this.changeTaskOperate(this.selectOffRow);
    }
    //点击取消下架
    public closeOffShelfModal() {
        this.addOffShelfModal = false;
    }
    public addGroundingModal: boolean = false;
    public selectGroundingRow = {};
    //上架按钮
    public goToGrounding(selectGroundingRow: any) {
        this.addGroundingModal = true;
        this.selectGroundingRow = selectGroundingRow;
        console.log('下架按钮传过来的对象', this.selectGroundingRow);
    }
    //点击确定上架
    public sureGroundingModal() {
        this.changeTaskOperate(this.selectGroundingRow);
    }
    //点击取消上架
    public closeGroundingModal() {
        this.addGroundingModal = false;
    }
    //初始化table表头
    public columns = [
        // {
        //     title: '显示样式',
        //     dataIndex: 'displayFormat',
        //     // slots: { customRender: 'reachDitch' },
        //     align: 'center',
        // },
        {
            title: '话术标签',
            dataIndex: 'promotionChannel',
            align: 'center',
        },
        // {
        //     title: '目标渠道',
        //     dataIndex: 'targetChannel',
        //     align: 'center',
        // },
        {
            title: '话术内容',
            dataIndex: 'promotionPageComponent',
            align: 'center',
        },
        // {
        //     title: '应用说明',
        //     dataIndex: 'applicationDescription',
        //     align: 'center',
        // },
        {
            title: '话术状态',
            dataIndex: 'taskState',
            align: 'center',
        },
        // {
        //     title: '操作人',
        //     dataIndex: 'operatorName',==>显示的是admin
        //     align: 'center',
        // },
        {
            title: '创建时间',
            dataIndex: '',
            align: 'center',
            slots: { customRender: 'date' },
        },
        {
            title: '上架时间',
            dataIndex: '',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: '',
            align: 'center',
            slots: { customRender: 'action' },
        },
    ];
    //单条删除
    public deleteSingle(selectRow: any) {
        if (selectRow.taskState == '已下架') {
            this.addSingleDeleteModal = true;
            this.singleDeleteId = selectRow.download_page_promotion_id;
        } else {
            message.error('已下架状态才可以删除！');
        }
    }
    //单条删除确认
    public sureSingleDelete() {
        let param = {
            downloadPagePromotionId: this.singleDeleteId,
        };
        downloadPageManageApi.getDeleteDownloadPage(param, {}).then((res: any) => {
            this.addSingleDeleteModal = false;
            if (res.flag == 'success') {
                message.success('删除成功');
                this.getList();
            }
        });
    }
    //单条删除取消
    public closeSingleDelete() {
        this.addSingleDeleteModal = false;
    }
    //批量删除下载页
    public delList() {
        let flag = true;
        let isUp = true;
        if (this.userTableSelectedKeys.length == 0) {
            message.error('请勾选要删除的数据！');
            flag = false;
        }
        this.selectRowsData.some((item: any) => {
            if (item.taskState === '已上架') {
                // message.error('已下架状态才可以删除！');
                return (isUp = false);
            }
        });
    
        if (isUp) {
            if (flag) {
                this.addListDeleteModal = true;
            }
        } else {
            message.error('已下架状态才可以删除！');
        }
    }
    //批量删除取消
    public closeListDelete() {
        this.addListDeleteModal = false;
    }
    //批量删除确定
    public sureListDelete() {
        let params = {
            downloadPagePromotionIdList: this.userTableSelectedKeys,
        };
        downloadPageManageApi.getBatchDeleteDownloadPage(params, {}).then((res: any) => {
            this.addListDeleteModal = false;
            if (res.flag == 'success') {
                message.success('删除成功');
                this.getList();
            }
        });
    }
}
</script>
<style lang="less" scoped>
.dowlodChoseRow {
    margin-top: 30px;
}

.chooseSelect {
    margin-left: 12px;
    margin-right: 24px;
    width: 208px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

.chooseTitle {
    height: 20px;
    font-size: 14px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
}

.displayTitle {
    margin-right: 16px;
}

.dowlodInptRow {
    margin-top: 14px;
}

.downloadInput {
    margin-left: 12px;
    margin-right: 24px;
    width: 208px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

.validityPeriodDate {
    width: 124px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #ababab;
}

.validityDateStart {
    margin-left: 27px;
}

.targetChannel {
    margin-right: 16px;
}

.to {
    margin-left: 4px;
    margin-right: 4px;
}

.downloadBtn {
    text-align: center;
 margin-left: 40px;
 
}

.queryBtn {
    margin-right: 16px;
    width: 84px;
    height: 32px;
    background: #e8380d;
    border-radius: 4px;
}

.cancleBtn {
    width: 84px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #bfbfbf;
}
.downloadTable {
    margin-top: 15px;
}
//新增按钮
.addAppBtn {
    margin-left: 16px;
    height: 32px;
    background: #e8380d;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
}
//删除按钮
.deleteBtn {
    margin-left: 16px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #e8380d;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #e8380d;
    line-height: 20px;
}
//列表按钮 包括新增及删除
.tableBtn {
    margin-bottom: 15px;
}
</style>