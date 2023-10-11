<template>
    <div class="content-right-content-top">
        <changeMore v-if="isMore" @chooseDropdownMore="chooseDropdownMore" :changeMoreData="changeMoreData"
            class="content-right-content-top-changeMore" @addContent="addContent" @chooseOperate="chooseOperate">
        </changeMore>
        <div class="content-right-content-top-kong"></div>
        <div class="content-right-content-top-filtrategroup">
            <div v-if="titleList" class="content-right-content-top-title">
                <div class="content-right-content-top-filtratetitle" v-for="item in titleList">
                    <a-button @click="chooseTitle(item)" :type="chooseTitleInfo.mark === item.mark ? 'link' : 'text'" :danger="chooseTitleInfo.mark === item.mark ? true : false " size="small">{{ item.name }}</a-button>
                    <div class="content-right-content-top-filtratetitle-xian">
                    </div>
                </div>
                <div class="content-right-content-top-filtrate" @click="filtrate">
                    <img src="../../modules/assets/内容管理-列表_slices/icon_filtrate.png" alt="">
                </div>
            </div>
            <div class="content-right-content-top-title" v-else @click="filtrate">
                <div class="content-right-content-top-notitleList">
                    <img src="../../modules/assets/内容管理-列表_slices/icon_filtrate.png" alt="">
                </div>
                <div style="margin-right: 11px">筛选</div>
            </div>

        </div>
        <!-- <div > -->
        <a-input class="content-right-content-top-input" placeholder="请输入标题名称" @blur="blurInput" v-model:value="inputDate">
            <template #prefix>
                <img src="../../modules/assets/内容管理-列表_slices/icon_search.png" alt="">
            </template></a-input>
        <!-- </div> -->
    </div>
</template>
<script lang="ts">
import changeMore from '@/modules/components/changeMore.vue';
import { Options, Vue } from 'vue-class-component';
import { ref, reactive } from 'vue';
import { Prop } from 'vue-property-decorator';
import { emit } from 'process';

@Options({
    components: {
        changeMore
    },
})
export default class contentManage extends Vue {
    @Prop({ require: true }) public changeMoreData!: any;
    // @Prop({ require: true }) public formData!: any;
    @Prop({ require: false }) public titleList!: any;
    @Prop({ require: false }) public chooseTitleInfo!: any;
    @Prop({ require: false }) public isMore!: boolean;

    // @Prop({ require: false }) public inputDate!: string;



    created() {

    }
    public inputDate = ref('')

    // public chooseTitleInfo = reactive({
    //     name: '', index: 0, mark: ''
    // })
    public addContent() {
        this.$emit('addContent')
    }
    public filtrate() {
        this.$emit('filtrate')
    }
    public chooseOperate(value: any) {
        this.$emit('chooseOperate', value)
        // this.$emit(value)
    }
    public chooseDropdownMore(value: any) {
        this.$emit('chooseDropdownMore', value)
    }
    public blurInput() {
        this.$emit('blurInput', this.inputDate)
    }
    public chooseTitle(value: any) {
        console.log(value,'value')
        this.chooseTitleInfo.mark = value.mark;
        this.chooseTitleInfo.index = value.index;
        this.chooseTitleInfo.name = value.name;

        this.$emit('getTitle', this.chooseTitleInfo)
        // console.log(value, 'choose');

    }
}
</script>

<style lang="less">
.content-right-content-top {
    // padding-left: 50%;
    display: flex;
    align-items: center;

    .content-right-content-top-changeMore {
        flex: 1;
    }

    .content-right-content-top-kong {
        flex: 1;
    }

    .content-right-content-top-filtrategroup {
        // flex: 3;
        margin-left: 16px;
        padding: 3px 0px; 
        text-align: center;
        background-color: #ffffff;
        border: 1px #ABABAB solid;
        border-radius: 4px;
        display: flex;
        font-size: 14px;
        // align-items: center;

        .content-right-content-top-title {
            display: flex;
            align-items: center;

            .content-right-content-top-filtratetitle {
                // padding: 7px 0px 7px 12px;
                display: flex;
                align-items: center;

                // 为解决粗细不均的问题，先放大2倍，再缩小2倍
                .content-right-content-top-filtratetitle-xian {
                    height: 16px;
                    width: 2px;
                    // margin: 0px 6px;
                    background-color: #ABABAB;
                    transform: scale(0.5) // }
                }

            }

            .content-right-content-top-notitleList {
                margin: 5px 6px 9px 12px; 
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }


        .content-right-content-top-filtrate {
            margin: 5px 12px;
            width: 20px;
            height: 20px;

            img {
                width: 100%;
                height: 100%;
            }
        }




    }

    .content-right-content-top-input {
        margin-left: 3%;
        margin-right: 1%;
        flex: 1;
        display: flex;
        align-items: center;
        padding: 7px 10px;
        border: 1px #ABABAB solid;
        border-radius: 4px;

        img {
            width: 20px;
            height: 20px;
        }



    }
}

.choose {
    color: #e8380d;
    // border-bottom: 2px solid #e8380d;
}
</style>