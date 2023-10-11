<!-- eslint-disable no-undef -->
/* eslint-disable vue/no-parsing-error */
<template>
    <div class="user-page" id="userPage">
        <!-- 素材管理 -->
        <div class="container" style="height: 10%;">
            <div class="padding_10" style="padding-left: 32px;">
                <a-row>
                    <a-col :span="16" style="display: flex;justify-content: start;align-items: center;">
                        <a-checkbox v-show="editable" v-model:checked="allChecked" class="checkbox"
                            @change="handelAllChange" :indeterminate="indeterminate">全选</a-checkbox>

                        <a-button type="primary"
                            @click="checkFeatureValue === '1' ? upload() : checkFeatureValue === '2' ? makeTag('', '') : checkFeatureValue === '4' ? download('', '') : deleteId('')"
                            danger style="height: 33px;background: #E8380D;border-radius: 4px;margin-right: 2%;">
                            <div style="display: flex;justify-content: center;align-items: center;">
                                <img v-if="checkFeatureValue === '1'" style="width:20px;height: 20px;margin-right: 7px;"
                                    src="../../assets/addWhite.png" alt="">
                                <img v-else-if="checkFeatureValue === '2' || checkFeatureValue === '4'"
                                    style="width:20px;height: 20px;margin-right: 7px;" src="../../assets/listingLogo.png"
                                    alt="">
                                <img v-else style="width:20px;height: 20px;margin-right: 7px;" src="../../assets/delAll.png"
                                    alt="">
                                {{ checkFeatureValue === '1' ? '新增' : checkFeatureValue === '2' ? '批量打标签' :
                                    checkFeatureValue === '4' ? '批量下载' : '批量删除' }}
                            </div>
                        </a-button>

                        <a-dropdown v-if="checkFeatureValue === '1'" :trigger="['click']"
                            style="width: 77px;height: 33px;border-radius: 4px;">
                            <template #overlay>
                                <a-menu @click="checkFeature($event)">
                                    <a-menu-item v-for="item in checkFeatureList" :key="item.key" :value="item.value">
                                        {{ item.name }}
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <a-button style="width: 77px;height: 33px;border-radius: 4px;">
                                <template #icon>
                                    <UnorderedListOutlined />
                                </template>
                                更多
                            </a-button>
                        </a-dropdown>
                        <a-button v-else @click="cancel" style="width: 77px;height: 33px;border-radius: 4px;">
                            <template #icon>
                                <CloseOutlined />
                            </template>
                            取消
                        </a-button>
                        <!-- <a-button	
						type="primary"
						@click="upload()"
						danger
						style="height: 33px;background: #E8380D;border-radius: 4px;margin-right: 2%;"
						>
                        <div style="display: flex;justify-content: center;align-items: center;">
							<img  style="width:20px;height: 20px;margin-right: 7px;" src="../../assets/addWhite.png" alt="">
							新增
						</div>
					</a-button>
                            <div class="btnDiv">
                                    <div v-if="editable">
                                        <div style="margin-left: 30px;">
                                            <a-checkbox v-model:checked="allChecked" class="checkbox" @change="handelAllChange" :indeterminate="indeterminate">全选</a-checkbox>
                                            <a-button class="tab1" @click="deleteId('')">删除</a-button>
                                            <a-button class="tab2" @click="makeTag('','')">打标签</a-button>
                                            <a-button 
                                                type="success" size="small"  class="tab4" @click="download('','')"
                                                >
                                                下载
                                            </a-button>
                                            <a-button class="span" type="primary" @click="cancel">取消</a-button>
                                        </div>
                                      
                                    </div>
                                    <div v-else class="editable-cell-text-wrapper1">
                                        <a-button
                                                style="width: 77px;height: 33px;border-radius: 4px;"
                                                theme="twoTone"  @click="edit"
                                                >
                                                <template #icon>
                                                    <UnorderedListOutlined />
                                                </template>
                                                更多
                                            </a-button>
                                    </div>
                            </div> -->

                    </a-col>
                    <a-col :span="8">
                        <div style="display: flex;justify-content: end;align-items: center;">
                            <a-button @click="search()"
                                style="width: 86px;height: 33px;border-radius: 4px;margin-right: 2%;display: flex;align-items: center;justify-content: space-between;">
                                <img style="width: 16px;height: 16px;" src="../../assets/Systems.png" alt="">
                                筛选1
                            </a-button>
                            <a-input @pressEnter="onSearch" style="width:200px;border-radius: 4px;font-size:12px;"
                                v-model:value="materialName" placeholder="请输入素材名称按回车搜索">
                                <template #prefix>
                                    <SearchOutlined />
                                </template>
                            </a-input>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <!-- 搜索 -->
            <div class="right">
                <!-- <a-button style="background: #4c7bff; color: #fff;margin-left: 24px;margin-top: 10px;margin-bottom: 10px;" @click="upload()">
                    <upload-outlined></upload-outlined>
                    +上传素材
                </a-button> -->
            </div>

        </div>

        <!-- 内容 -->
        <div class="gutter-example">
            <a-list item-layout="vertical" :dataSource="materialData" :pagination="false" :loading="materialLoading"
                :row-key="(record: any) => record.pk_uuid" :grid="{ gutter: 16, column: 6 }">
                <template #renderItem="{ item }">
                    <div class="conentCard">
                        <a-list-item style="padding: 0">
                            <div style="width: 100%;height: 120px;position: relative;overflow:hidden">
                                <!-- <div class="image-container" v-if="item.material_file_type !== 'mp4'"
                                    :style="listImgStyle(item)" @click="showModal"> -->
                                <div class="image-container" v-if="item.material_file_type !== 'mp4'"
                                    :style="listImgStyle(item)" @click="showDrawerPopup">
                                    <!-- <a-image width="100%" height="100%" :style="{ display: 'none' }" :preview="{
                                        visible: item.imageVisible,
                                        onVisibleChange: (isVisible) => { item.imageVisible = isVisible; }
                                    }"
                                        :src="imgUrl + '/dop/iug/staticFile/userFile/source/' + item.material_file_path" /> -->
                                </div>

                                <video v-else style="height: 120px;width: 100%;border-radius: 12px 12px 0px 0px;"
                                    :controls="true" preload="auto"
                                    :src="imgUrl + '/dop/iug/staticFile/userFile/source/' + item.material_file_path"></video>
                                <!-- <video v-else :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/s/'+item.material_file_path" class="pic"></video> -->
                                <div class="picture_info">
                                    <span v-if="item.picture_width">{{ item.picture_width }}*{{ item.picture_height
                                    }}</span>
                                    <span class="picture_info_size">{{ (item.file_size / 1024).toFixed(1) }}KB</span>
                                    <span v-if="item.material_file_type">{{ item.material_file_type.toUpperCase() }}</span>
                                </div>
                            </div>
                            <div style="display: flex;justify-content:space-between;margin:10px 10% 0px 10%;">
                                <a-checkbox v-model:checked="item.checked" class="pic-check"
                                    style="position: absolute;top: 1px;right: 11px;z-index: 99"></a-checkbox>
                                <span class="published-text" v-if="item.is_material_maturity"
                                    :class="item.is_material_maturity === '0' ? 'authorized' : 'unauthorized'">{{
                                        item.is_material_maturity === '0' ? '已授权' : '未授权' }}</span>
                                <!-- <span class="published-text" v-if="item.is_material_maturity === '1'">已授权</span>
                            <span class="published-text" v-else-if="item.is_material_maturity === '0'">未授权</span> -->
                            </div>
                        </a-list-item>
                        <a-list-item style="padding-left: 8px;">
                            <div class="eidtBox" v-if="nameEditable && (nameEditableId === item.material_id)">
                                <a-input v-model:value="item.material_name_copy"
                                    style="width: 45%;overflow:hidden; white-space:nowrap; text-overflow:ellipsis;" />
                                <check-circle-filled class="eidtBox-i"
                                    @click="nameChangeOk(item.material_id, item.material_name_copy)" />
                                <close-circle-filled class="eidtBox-i" @click="nameChangeCancel" />
                            </div>
                            <div v-else>
                                <span class="nameEditStyle">{{ item.material_name }}</span>
                                <edit-outlined @click="editName(item.material_id)" class="editLine" />
                                <a-button @click="deleteId(item.material_id)" type="link"
                                    style="display: inline-block;float: right;">删除</a-button>
                            </div>
                            <div class="clear"></div>

                        </a-list-item>
                        <!-- <a-list-item style="padding: 2px; height: 30px;"> -->
                        <!-- <span>{{ item.material_file_type }}</span> -->
                        <!-- <a-button @click="handelShare(item.material_id)" type="link" style="display: inline-block;">{{ item.is_share==='0' ? '共享': '不共享'}}</a-button> -->
                        <!-- <a-button @click="deleteId(item.material_id)" type="link" style="display: inline-block;">删除</a-button> -->
                        <!-- {{ record.realm_name_status === '0' ? '启用' : "停用"  }} -->
                        <!-- <a-button @click="handelShare(item.material_id)" type="link" style="float: right">{{ item.is_share==='0' ? '共享': '不共享'}}</a-button> -->
                        <!-- </a-list-item> -->
                        <a-list-item style="padding-left: 8px;">
                            素材来源:
                            <span class="source">{{ item.material_source }}</span>
                        </a-list-item>
                        <a-list-item style="padding-left: 8px;">
                            是否有授权证书:
                            <a-button v-if="item.is_material_maturity || item.certificate_name !== ''"
                                @click="openMaturity(item)" type="link" class="maturity">
                                {{ item.is_material_maturity === '0' ? '是' : '否' }}
                            </a-button>
                            <!-- <a-button type="link" v-if="item.certificate_name !== ''" @click="previewCertificate(item)" style="font-size:12px;">预览授权证书</a-button> -->
                            <!-- <span
                            v-if="item.is_material_maturity === '1' && item.certificate_name !== ''"
                            @click="openMaturity(item)"
                            class="maturity"
                        >{{ item.is_material_maturity }}</span>
                        <span v-else>{{ item.is_material_maturity }}</span> -->
                        </a-list-item>
                        <a-list-item style="padding-left: 8px;">
                            引用次数:
                            <a-button type="link" size="small" @click="showDrawer(item.material_id, item.cite_count)"
                                class="color_red">{{ item.cite_count }}</a-button>
                        </a-list-item>
                        <a-list-item
                            style="padding: 0;width:100%;background-color: #F4F4F4;padding-top: 5px;padding-left: 8px;">
                            <!-- <div v-if="item.label">{{ item.label }}</div> -->
                            <div v-if="item.label_ids && item.label_ids.length">
                                <span v-for="items in item.label_ids" :key="items.label_id"
                                    style="margin-right: 10px;color:#333333">{{ items.label_name }}</span>
                            </div>
                            <div v-else>
                                暂无标签:
                            </div>
                            <!-- <a-button @click="makeTag(item.material_id,item.label_ids)" type="link" class="color_red" :class="{ 'center_txt': !item.label_ids || !item.label_ids.length }">打标签</a-button> -->
                            <a-button @click="makeTag(item.material_id, item.label_ids)" type="link"
                                class="color_red center_txt">打标签</a-button>
                        </a-list-item>
                    </div>
                </template>
            </a-list>
            <paginations @changePage="changePage" :prop-name="pagination" />

            <!-- 共享设置弹框 -->
            <!-- <a-modal v-model:visible="shareModal" @ok="shareModalOk" :afterClose="shareAfterClose">
                <div style="display: flex">
                    <p style="font-size: 16px; margin-top: 20px; margin-bottom: 40px">共享设置</p>
                </div>
                <a-form :model="shareFormState" ref="shareForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="对选中的素材设置为" name="is_share" :rules="[{ required: true, message: '请勾选设置' }]">
                        <a-radio-group v-model:value="shareFormState.is_share" button-style="solid">
                            <a-radio-button :value="'0'">共享</a-radio-button>
                            <a-radio-button :value="'1'" style="margin-left: 10px">不共享</a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </a-modal> -->
            <!-- 打标签弹框 -->
            <a-modal v-model:visible="makeTagModal" title="打标签" @ok="makeTagModalOk">
                <a-form :model="makeTagFormState" ref="makeTagForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 26 }">
                    <a-form-item label="素材标签" name="labelIds" style="margin-left: -50px;margin-top: 40px;">
                        <!-- <a-select mode="tags" v-model:value="makeTagFormState.labelIds" placeholder="请选择素材标签" :max-tag-count="3" :field-names="{label:'name',value:'id'}" :options="materialIdList">
                        </a-select> -->
                        <a-cascader style="display: inline-block; width: 70%;" mode="tags" multiple
                            v-model:value="makeTagFormState.labelIds" placeholder="请选择素材标签" :max-tag-count="3"
                            :show-search="{ filter }"
                            :field-names="{ label: 'labelName', value: 'labelId', children: 'children' }"
                            :options="materialIdList" @change="changeRegionType($event)" />
                        <!-- <a-cascader
                            style="width: 100%; border-radius: 4px"
                            :field-names="{ label: 'sensitiveTypeName', value: 'sensitiveTypeId', children: 'childMenu' }"
                            change-on-select
                            v-model:value="makeTagFormState.labelIds"
                            :options="materialIdList"
                            placeholder="请选择"
                        /> -->
                        <a-button style="display: inline-block; margin-left: 20px;font-size: 10px;width: 22%;"
                            @click="addContent">
                            自定义标签
                        </a-button>
                    </a-form-item>
                    <!-- <a-form-item label="素材标签" name="labelIds">
                        <a-cascader 
                            mode="tags" 
                            multiple
                            v-model:value="addFormState.labelIds" 
                            placeholder="请选择素材标签" 
                            :show-search="{ filter }"
                            :field-names="{label:'labelName',value:'labelId',children:'children'}" 
                            :options="materialIdList"
                            @change="changeRegionType($event)"
                        />
                    </a-form-item> -->
                </a-form>
            </a-modal>

            <a-modal v-model:visible="showModal" title="新增标签" @ok="handleModalOk">
                <a-form :model="addFormState" ref="addForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="标签名称" name="labelName"
                        :rules="[{ required: true, message: '标签名称不能为空', trigger: 'blur' }]">
                        <a-textarea v-model:value="addFormState.labelName" showCount :maxlength="10"
                            placeholder="请输入请输入标签名称" />
                    </a-form-item>
                </a-form>
            </a-modal>
            <!-- <a-modal v-model:visible="makeTagModal" title="打标签" @ok="makeTagModalOk">
                <a-select 
                style="width: 100%;"
                mode="tags" v-model:value="makeTagFormState.labelIds" 
                placeholder="请选择素材标签" :max-tag-count="3" 
                :field-names="{label:'name',value:'id'}" :options="materialIdList">
                </a-select>
            </a-modal> -->
            <!-- 引用次数弹框 -->
            <!-- @ok="referenceDrawer" -->
            <a-drawer style="font-size: 12px;" v-model:visible="drawerModal" title="素材关联内容" width="900"
                :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }">
                <a-form :model="quoteForm" ref="quoteFormRef">
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="素材名称">
                                <a-input v-model:value="quoteForm.material_name" placeholder="请输入名称" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="栏目分类" name="column">
                                <!-- <a-select v-model:value="quoteForm.topic_id" placeholder="请选择">
                                    <a-select-option value="1">请选择</a-select-option>
                                </a-select> -->
                                <a-cascader v-model:value="column" :options="columnList" mode="tags"
                                    @change="changeColumValue()" :multiple="true"
                                    :field-names="{ label: 'name', value: 'id', children: 'children' }" placeholder="请选择" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <!-- <span style="margin-bottom: 20px; margin-left: 10px">内容类型：</span> -->
                        <a-col :span="16">
                            <a-form-item label="内容类型：">
                                <a-checkbox-group v-model:value="quoteForm.contentTypes">
                                    <a-checkbox :value="item.value" v-for="(item, index) in contentType" :key="index"
                                        @change="checkbox(item)">{{ item.label }}
                                    </a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="标题名称">
                                <a-input v-model:value="quoteForm.titleName" placeholder="请输入标题名称" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label="筛选标签" name="tagValue">
                                <a-cascader v-model:value="tagValue" :options="tagValueList" :multiple="true" mode="tags"
                                    @change="changeTagValue()"
                                    :field-names="{ label: 'name', value: 'id', children: 'children' }" placeholder="请选择" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item label="更新时间" name="dateTime">
                                <!-- <a-date-picker v-model:value="quoteForm.dateTime" style="width: 100%" /> -->
                                <a-date-picker style="width:100%;border-radius: 4px;margin-right: 8px;"
                                    valueFormat="YYYY-MM-DD 00:00:00" v-model:value="startTime"
                                    :disabledDate="disabledDateStart" placeholder="开始时间" />
                                <!-- <span>至</span>
                                <a-date-picker
                                    style="width:35%;border-radius: 4px;margin-left:8px"
                                    valueFormat="YYYY-MM-DD 23:59:59"
                                    v-model:value="startTime"
                                    :disabled-date="disableEndTime"
                                    placeholder="结束时间"
                                /> -->
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <div class="box" style="flex-direction: row">
                                <a-button class="inquire" type="primary" ghost @click="numberlist()">查询</a-button>
                                <a-button class="reset" type="primary" ghost @click="cancleBtn"
                                    style="margin-left: 5px">重置</a-button>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <div id="openProductBox" style="display: none; padding: 10px">
                                <table id="openProductTable" lay-filter="openProductTable">
                                    <h3 style="text-align: center">签到名单</h3>
                                </table>
                            </div>
                            <a-table item-layout="vertical" size="large" :columns="columns" :dataSource="userTableData"
                                :pagination="userTablePagination" :loading="userTableLoading"
                                :row-key="(record: any) => record.pk_uuid">
                                <template #content="{ record }">
                                    <div class="table-content">
                                        <a-row>
                                            <a-col :span="4">
                                                <div class="table-content-left">
                                                    <div class="table-content-img">
                                                        <a-image v-if="record.horizontalCoverFile"
                                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.horizontalCoverFile"
                                                            alt="" />
                                                        <a-image v-else-if="record.verticalCoverFile"
                                                            :src="'/dop/iug/zuul/content/file/downloadImageOrVideo/c/' + record.verticalCoverFile"
                                                            alt="" />
                                                        <div v-else style="color: #66a1e8;font-size: 12px;width: 60px;">待上传
                                                        </div>
                                                    </div>
                                                </div>
                                            </a-col>
                                            <a-col :span="20">
                                                <div class="table-content-right">
                                                    <div class="table-content-content line-clamp">
                                                        {{ record.titleName }}
                                                    </div>
                                                </div>
                                            </a-col>
                                        </a-row>
                                    </div>
                                </template>
                                <template #bodyCell="{ column, record }">
                                    <template v-if="column.key === 'operation'">
                                        <a-button type="link" @click="preview(record.contentId)">详情</a-button>
                                    </template>
                                </template>
                            </a-table>
                        </a-col>
                    </a-row>
                </a-form>
            </a-drawer>


        </div>
        <!-- 上传素材弹框 -->
        <!-- <uploadMaterial /> -->
        <!-- 新增 -->
        <a-drawer v-model:visible="showUploadMaterial" class="custom-class webpageConstructionEditDrawer " placement="right"
            :width="darwerWidth" title="上传素材" :closable="false">
            <uploadMaterial :isVisible="someData" @cancelAdd="cancelAdd" />
        </a-drawer>
        <!-- 筛选抽屉 -->
        <a-drawer v-model:visible="showScreeningCondition" class="custom-class webpageConstructionDrawer" placement="right"
            width="450" :closable="false">
            <template #title>
                <div class="ScreeningCondition_title">
                    <div>
                        <img style="width:20px;height:20px;margin-right: 16px;" src="../../assets/Systems.png" alt="">
                        <span style="font-size: 16px;">筛选设置</span>
                    </div>
                    <a-button class="ScreeningCondition_title_btn" @click="showScreeningCondition = false">
                        <img style="width: 15px;height: 10px;" src="../../assets/addBack.png" alt="">
                    </a-button>
                </div>
            </template>
            <div class="ScreeningCondition">

                <a-row style="margin: 24px 0px;">
                    <a-form :model="fliterForm" :label-col="{ style: { width: '100px' } }">
                        <a-form-item label="素材类型" name="material_file_type">
                            <a-radio-group v-model:value="fliterForm.materialFileType" button-style="solid">
                                <a-radio-button value class="radio" checked>全部</a-radio-button>
                                <a-radio-button value="0" class="radio">图片</a-radio-button>
                                <a-radio-button value="1" class="radio">视频</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                        <!-- <a-form-item label="素材来源" name="material_source" style="margin-top: -10px;">
                        <a-radio-group v-model:value="fliterForm.materialSource" button-style="solid">
                            <a-radio-button value="1" class="radio" checked>我上传的</a-radio-button>
                            <a-radio-button value="0" class="radio">共享素材</a-radio-button>
                        </a-radio-group>
                    </a-form-item> -->
                        <a-form-item label="是否授权" name="is_material_maturity" style="">
                            <a-radio-group v-model:value="fliterForm.isMaterialMaturity" button-style="solid">
                                <a-radio-button value class="radio" checked>全部</a-radio-button>
                                <a-radio-button value="0" class="radio">是</a-radio-button>
                                <a-radio-button value="1" class="radio">否</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item label="授权是否过期" name="is_maturity_date" style="">
                            <a-radio-group v-model:value="fliterForm.isMaturityDate" button-style="solid">
                                <a-radio-button value class="radio" checked>全部</a-radio-button>
                                <a-radio-button value="1" class="radio">是</a-radio-button>
                                <a-radio-button value="0" class="radio">否</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                    </a-form>

                </a-row>
            </div>
            <template #footer>
                <div style="display: flex;justify-content: end;align-items: center;height: 78px;">
                    <a-button style="width:76px;border-radius: 4px;height: 40px;margin-right: 20px;"
                        @click="cancleBtnInit">重置</a-button>
                    <a-button type="primary" danger style="width:76px;height: 40px;border-radius: 4px;background:#e81919"
                        @click="queryBtn()">查询</a-button>
                </div>
            </template>
        </a-drawer>

        <!-- showDrawerPopup -->
        <a-drawer :visible="drawerPopup" class="custom-class" root-class-name="root-class-name" :get-container="false"
            width="88vw" title="" placement="right" @after-open-change="afterOpenChange" @close="disabledDrawer">
            <a-row>
                <a-col :span="18">
                    <a-carousel :after-change="carouselOnChange">
                        <div>
                            <h3>1</h3>
                        </div>
                        <div>
                            <h3>2</h3>
                        </div>
                        <div>
                            <h3>3</h3>
                        </div>
                        <div>
                            <h3>4</h3>
                        </div>
                    </a-carousel>
                </a-col>
                <a-col :span="6">
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-card style="width: 100%">
                                <p>Card content</p>
                                <p>Card content</p>
                                <p>Card content</p>
                            </a-card>
                        </a-col>
                        <a-col :span="24">
                            <a-card style="width: 100%">
                                <p>Card content</p>
                                <p>Card content</p>
                                <p>Card content</p>
                            </a-card>
                        </a-col>
                    </a-row>

                </a-col>
            </a-row>
        </a-drawer>
    </div>
</template>

<script lang="ts" setup>
import { AxiosRequestHeaders } from 'axios';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { systemManagementApi, contentApi } from '@/libs/api/index';
import { createVNode, reactive, ref, watch, onMounted, defineComponent } from 'vue';
import { message, Modal, SelectProps, FormInstance } from 'ant-design-vue';
import { CheckCircleFilled, CloseCircleFilled, EditOutlined, ExclamationCircleOutlined, UnorderedListOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { global } from '@/libs/Global';
import { PaginationType, FliterFormType, picList, materialDataType, userTableDataType, ditchListType } from './feedback';
import { useRouter } from 'vue-router'
import store from '@/modules/conTent/store';
import { Item } from 'ant-design-vue/lib/menu';
import { operaTionApi } from '@/libs/api/index';
import { CleanPlugin } from 'webpack';
import axios from 'axios';
import moment from 'moment';
import { baseApi } from '@/libs/BaseApi';
import uploadMaterial from '../uploadMaterial/index.vue'
import paginations from '@/modules/components/pagination.vue'
import { imgUrl } from '@/libs/getImgUrl'
import ModalComponent from './components/ModalComponent.vue';
// 抽离
import { showDrawerPopup, drawerPopup, afterOpenChange, disabledDrawer, carouselOnChange } from './index'


const router = useRouter()
const darwerWidth = window.innerWidth - 255

const label_ids = reactive(['111', '222', '333'])
const getInitialFliterForm = (): FliterFormType => ({
    materialName: '',
    materialSource: '',
    materialFileType: '',
    isMaterialMaturity: '',
    isMaturityDate: '',
    isShare: '',
});
// 筛选表单数据
const fliterForm = reactive<FliterFormType>(getInitialFliterForm());


// 素材名称
const materialName = ref<string>('');

// ========= 列表开始 ============
const materialData = ref([]);
// materialData.value! = picList.map(item => {
//     item.material_name_copy = item.material_name;
//     item.checked = false
//     return item
// });
const materialLoading = ref<boolean>(false);

const permission = ref<any>([]);
const showScreeningCondition = ref<boolean>(false) //抽屉
const showUploadMaterial = ref<boolean>(false)
const someData = ref<boolean>(true)
const checkFeatureValue = ref<string>('1')

// public checkFeatureValue:string = '1'
//切换新增-上架-批量删除按钮列表
const INITIAL_CHECK_FEATURE_LIST = [
    {
        key: '2',
        value: '2',
        name: '批量打标签'
    },
    {
        key: '4',
        value: '4',
        name: '批量下载'
    },
    {
        key: '3',
        value: '3',
        name: '批量删除'
    }
];

const checkFeatureList = ref<any>([...INITIAL_CHECK_FEATURE_LIST]);





//筛选抽屉
const search = () => {
    showScreeningCondition.value = true
}
//点击分页
const changePage = (event: any) => {
    // 需要从 event 对象中提取 page 和 pageSize

    // const { page, pageSize } = event;

    pagination.current = event;
    // pagination.pageSize = 12;
    // console.log(page,pageSize,event)
    getList();
}

//创建一个对象，判断如果满足条件就赋值，否者赋空
const getPermsBtn = () => {
    let per: any = {};
    if (global.userInfo) {
        per = global.userInfo.permsBtn;
    }
    permission.value = per['user'] || [];
}

//分页

const pagination = reactive({
    current: 1, //当前页数
    total: 0, //数据总数
    pageSize: 12, //每页中显示10条数据  每页条数
    onChange: (page: number, pageSize: number) => {
        pagination.current = page;
        pagination.pageSize = pageSize;
        console.log(pagination.current)
        getList();
    },
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['12', '24', '48', '96'], //每页中显示的数据 指定每页可以显示多少条
    showTotal: (total: number) => `共 ${total} 条`, //分页中显示总的数据 用于显示数据总量和当前数据顺序

});

// //用户列表上一页、下一页
// const handleTableChange = (value: PaginationType) =>{
//          
//         pagination.current = value.current;
//         pagination.pageSize = value.pageSize;
//         getList();
// }
// 查询素材
const getList = async () => {
    //materialLoading.value = true;
    const params = {
        ...fliterForm,
        materialName: materialName.value,
        // row4Page: pagination.pageSize,
        // nowPage: pagination.current,
    };
    const header: any = {
        request: (header: AxiosRequestHeaders) => {
            header.row4Page = pagination.pageSize;
            header.nowPage = pagination.current;
        }
    }
    systemManagementApi.queryMaterial(params, header).then((res: any) => {

        // 
        materialLoading.value = false;
        pagination.total = (res as any).recordsTotal;
        const arr = res.data || [];
        materialData.value = arr.map((item: materialDataType) => {
            item.material_name_copy = item.material_name;
            item.imageVisible = false;  // 新增的图片显示状态属性
            item.checked = false
            return item
        });

    })
        .catch((err: any) => {
            materialLoading.value = false;
        });
};
const queryBtn = () => {
    getList()
    // showScreeningCondition.value = false
}
// 重置
const cancleBtnInit = () => {
    Object.assign(fliterForm, getInitialFliterForm());
    getList()
    // showScreeningCondition.value = false

}
const cancelAdd = () => {
    getList()
    showUploadMaterial.value = false
}
const listImgStyle = (item: any): Record<string,
    string> | undefined => {
    const imgUrls = imgUrl + '/dop/iug/staticFile/userFile/source/' + item.material_file_path
    if (imgUrls) {
        return {
            backgroundImage: `url(${imgUrls})`,
            height: '100%',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPostion: 'center top',
            // transform:'scale(1.5)'
            // height = `${elementViewportH}px`;

        };
    }
    return undefined;
};
onMounted(() => {
    getList()
    //types()
    secsitiveTypeList()
})

// 名称搜索
const onSearch = () => {
    getList();
};

//上传素材跳转
const upload = () => {
    someData.value = !someData.value;
    showUploadMaterial.value = true
    // router.push({ path: 'uploadMaterial'})
    // this.$router.push('/feedbackResult')
}

// 监听筛选表单 有变化就刷新列表
// watch(fliterForm, () => {
//     pagination.current = 1;
//         pagination.pageSize = 12;
//     getList();
// });


// ========一排操作按钮切换=======
const editable = ref<boolean>(false);
const makeTagModal = ref<boolean>(false);
const allChecked = ref<boolean>(false);
const indeterminate = ref<boolean>(false);

// 全选
const handelAllChange = (e: any) => {

    if (e.target.checked) {
        // 全选
        materialData.value.forEach((item: any) => {
            item.checked = true;
        });
    } else {
        materialData.value.forEach((item: any) => {
            item.checked = false;
        });
    }
};

// 监听列表数据变化 改变全选状态
watch(
    materialData,
    (newvalue, oldvalue) => {
        newvalue.find(item => item.checked === false) ? allChecked.value = false : allChecked.value = true;
        indeterminate.value = newvalue.some((item: any) => item.checked) && !allChecked.value;
    }, {
    deep: true
}
);



// =============共享设置模块==================
// const shareFormState = reactive({
//     is_share: '',
// });
// const shareModal = ref<boolean>(false);
// const shareForm = ref<FormInstance>();

// // 共享的数据  
// const shareList = ref<string[]>([])
// // 单个共享
// const handelShare = (material_id: string) => {
//     shareModal.value = true
//     shareList.value = [material_id]
// };
// // 批量共享
// const handelShareAll = () => {
//     shareList.value = materialData.value.filter((item: any) => item.checked).map((item: any) => item.material_id)
//     if (shareList.value.length === 0) {
//         message.error('请选择素材');
//         return
//     }
//     shareModal.value = true
// };

// // 共享弹框确认按钮 发请求
// const shareModalOk = () => {
//      
//     shareForm.value!.validate().then(() => {
//         const arr: {
//             materialId: string; //素材id
//             isShare: string; //是否共享（0-是，1-否）
//         }[] = []
//         shareList.value.map(item => {
//             arr.push({
//                 'materialId': item, 
//                 'isShare': shareFormState.is_share
//             })
//              
//              
//         })
//         const params = {
//             requestDTOS: arr
//         }
//          

//         systemManagementApi.shareMaterial(params, {})
//             .then((res: any) => {
//                 const { flag } = res
//                 if (flag === 'success') {
//                     message.success('共享设置成功');
//                     getList();
//                 } else {
//                     message.success('共享设置失败');
//                 }
//                 shareModal.value = false
//             })
//             // .catch((err: any) => {
//             //     message.error(err.msg);
//             // });
//     });

// }

// 弹窗表单关闭后的回调事件，清空表单数据
// const shareAfterClose = () => {
//     shareForm.value!.resetFields();
// }
// =============批量编辑按钮模块==================

// 批量下载
// const download = (record: any) => {
//      
// };
//const material_file_path = ref<any>('');
let material_file_path: any = ''

//下载
const download = (id: any, item: any) => {
    //makeTagModal.value = true;
    let materialIds: any[] = []
    const fileNameList: any = []
    if (id) {
        // 如果有传参 就说明是单个删除
        materialIds = [id]
        material_file_path = item


    } else {
        // 如果没有传参 就说明是批量删除
        // let listItem:any = []
        // materialIds = materialData.value.filter((item: any) => item.checked).map((item: any) => item.material_id);
        // material_file_path = materialData.value.filter((item: any) => item.checked).map((item: any) => item.material_file_path);
        // materialName = materialData.value.filter((item: any) => item.checked).map((item: any) => item.material_name);
        materialData.value.filter((item: any) => item.checked).map(i => {
            fileNameList.push({
                materialIds: i.material_id,
                fileAddress: i.material_file_path,
                fileName: i.material_name
            })
        })
        if (fileNameList.length === 0) {
            message.error('请先勾选素材后，再做批量操作');
            return
        }

        //  
        //  
        //  
    }
    openMaturitys(fileNameList, '1')

};

// let fileNameList : any[] = []
const openMaturitys = (fileNameList: any, value: any) => {

    const params = {
        functionType: 's',
        fileNameList: fileNameList
    }

    systemManagementApi.zipFile(params, {}).then((item: any) => {


        openMaturitysw(item, value)
    })
}
// 导出文件的函数，采用白名单策略确保文件名只包含安全字符
function downloadBlob(blob: Blob | MediaSource, fileName: any) {
    const safeFileName = fileName.replace(/[^\w.]/g, '_'); // 只保留字母、数字、点和下划线

    const downloadElement = document.createElement('a');
    const href = URL.createObjectURL(blob);

    downloadElement.href = href;
    downloadElement.download = safeFileName ? safeFileName : '导出文件.pdf'; // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成后移除元素

    URL.revokeObjectURL(href); // 释放URL对象
}

const openMaturitysw = (item: any, value: any) => {
    // console.log('333', item);
    let material_file_path = '';

    // 从item对象中获取material_file_path，确保它是安全的
    if (typeof item === 'object' && item !== null && 'material_file_path' in item) {
        // 只允许字母、数字、点、下划线和斜杠
        material_file_path = item.material_file_path.replace(/[^\w\d\/\.]/g, '');
    }

    // console.log('material_file_path', material_file_path);

    axios({
        url: `/dop/iug/zuul/content/file/downloadImageOrVideo/s/${item.defmap.data}`,
        method: 'post',
        responseType: 'blob',
    }).then((res) => {
        const content = res.data;
        // console.log('content', content);
        const blob = value === '1' ? new Blob([content], { type: 'application/zip' }) : new Blob([content]);

        const fileName = material_file_path.split('/').pop(); // 获取文件名
        // console.log('fileName', fileName);

        // 错误处理
        if (res.status === 200) {
            // 调用下载文件的函数
            downloadBlob(blob, fileName);
        } else {
            // console.error('下载文件失败:', res.status, res.statusText);
            // 添加适当的错误处理
        }
    });
};
// const openMaturitysw = (item:any) =>{



//         // baseApi.post(`/content/file/downloadImageOrVideo/s/${item.defmap.data}`,{}, 'yjf',{})
//         axios({
//             url:`/dop/iug/zuul/content/file/downloadImageOrVideo/s/${item.defmap.data}`,
//             method:'get',
//             responseType: 'blob',
//         })
//         .then((res:any)=>{

//                 // if(res.data.size > 0){
//                     const content = res.data

//                     const blob = new Blob([content],{ type: 'application/zip' })openMaturity

//                     const fileName = item.defmap.data

//                         if ('download' in document.createElement('a')) { // 非IE下载
//                             const elink = document.createElement('a')
//                             elink.download = '素材材料-'+moment().format('YYYYMMDDHHMMSS')
//                             elink.style.display = 'none'
//                             // elink.href = `/dop/iug/zuul/content/file/downloadImageOrVideo/s/${item.defmap.data}`
//                             elink.href = URL.createObjectURL(blob)
//                             document.body.appendChild(elink)
//                             elink.click()
//                             // URL.revokeObjectURL(elink.href) // 释放URL 对象
//                             // document.body.removeChild(elink)
//                             document.body.removeChild(elink)//  释放URL 对象 防止内存泄漏
//                             URL.revokeObjectURL(elink.href) // 释放URL 对象
//                     }
//                 // }
//         })
// }

// 批量取消
const checkFeature = (e: any) => {
    checkFeatureValue.value = e.key

    // if(e === '2'){
    // 		checkFeatureValue.value = '1'

    // 	} else {
    // 	checkFeatureValue.value = e.key
    // 	}
    // userTableSelectedKeys = []
    editable.value = true;
};
const cancel = () => {
    checkFeatureValue.value = '1'
    checkFeatureList.value = [...INITIAL_CHECK_FEATURE_LIST];

    editable.value = false;

}
// 批量编辑
const edit = () => {
    editable.value = true;
};

// 列表里面授权
// const openMaturity = () => {
//     router.push({ path: 'uploadMaterial'})
//      

const openMaturity = (item: any) => {
    // console.log(item,'item')
    // console.log('333', item);
    let certificate_name = '';

    // 从item对象中获取material_file_path，确保它是安全的
    if (typeof item === 'object' && item !== null && 'certificate_name' in item) {
        // 只允许字母、数字、点、下划线和斜杠
        certificate_name = item.certificate_name.replace(/[^\w\d\/\.]/g, '');
    }

    // console.log('material_file_path', material_file_path);

    axios({
        url: `/dop/iug/zuul/content/file/downloadImageOrVideo/s/${item.certificate_name}`,
        method: 'post',
        responseType: 'blob',
    }).then((res) => {
        const content = res.data;
        // console.log('content', content);
        const blob = new Blob([content]);

        const fileName = certificate_name.split('/').pop(); // 获取文件名
        console.log('fileName', fileName);

        // 错误处理
        if (res.status === 200) {
            // 调用下载文件的函数
            downloadBlob(blob, fileName);
        } else {
            // console.error('下载文件失败:', res.status, res.statusText);
            // 添加适当的错误处理
        }
    });
};

// };
// const openMaturity = (item:any) =>{

// 		// this.previewMaterialLink = item.certificate_name
// 		// this.previewMaterial = true
//             axios({
//             url:`/dop/iug/zuul/content/file/downloadImageOrVideo/s/${item.certificate_name}`,
//             method:'post',
//             responseType: 'blob',
//         }).then((res:any)=>{
//             if(res.data.size > 0){
//             const content = res.data

//             const blob = new Blob([content])

//             const fileName = item.certificate_name

//                 if ('download' in document.createElement('a')) { // 非IE下载
//                     const elink = document.createElement('a')
//                     elink.download = fileName
//                     elink.style.display = 'none'
//                     elink.href = URL.createObjectURL(blob)
//                     document.body.appendChild(elink)
//                     elink.click()
//                     // URL.revokeObjectURL(elink.href) // 释放URL 对象
//                     // document.body.removeChild(elink)
//                     document.body.removeChild(elink)//  释放URL 对象 防止内存泄漏
//                     URL.revokeObjectURL(elink.href) // 释放URL 对象
//                 } 
//                 // else { // IE10+下载
//                 //   navigator.msSaveBlob(blob, fileName)
//                 // }
//             }
//         })
// }

// ==================删除模块========================
const deleteId = (id: string) => {
    //  
    let materialIds: any[] = []


    if (id) {
        // 如果有传参 就说明是单个删除
        materialIds = [id]
    } else {
        // 如果没有传参 就说明是批量删除
        materialIds = materialData.value.filter((item: any) => item.checked).map((item: any) => item.material_id);
        if (materialIds.length === 0) {
            message.error('请先勾选素材后，再做批量操作');
            return
        }
    }
    Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确认删除所勾选的素材吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
            deleteById(materialIds)
            //发请求 调用删除接口
        },
        onCancel() {
            // message.error('删除失败');
        },
    });
};


const deleteById = (materialIds: any[]) => {

    // 发请求 调用删除接口
    const params = {
        materialIds
    }
    systemManagementApi.deleteMaterial(params, {}).then((res) => {
        const { flag } = res
        if (flag === 'success') {
            message.success('删除成功');
            getList();
        } else {
            message.success('删除失败');
        }
    });
}

// ==================打标签模块========================
// 打标签选择的数据
// const materialIdList = ref<SelectProps['options']>([]);
const makeTags = ref<any>([]);
// 下拉框假数据
// materialIdList.value = [
//     // {
//     //     labelIds: '风景',
//     //     material_id: 1,
//     // },
//     // {
//     //     labelIds: '头条',
//     //     material_id: 2,
//     // },
//     // {
//     //     labelIds: '可爱',
//     //     material_id: 3,
//     // },
// ];

let materialID: string[] = []

//打标签弹框开启
const makeTag = (id: any, labelId: any) => {
    //makeTagFormState.labelIds = []
    //makeTagModal.value = true;
    let materialIds: any[] = []



    if (id) {
        // 如果有传参 就说明是单个删除
        materialIds = [id]
        makeTagModal.value = true;

        // 
        const labelIds: any = []
        labelId.forEach((item: any) => {
            //this.labelIds.map(item)
            labelIds.push([item.label_id])

        })

        makeTagFormState.labelIds = labelIds || [];
    } else {
        // 如果没有传参 就说明是批量删除
        materialIds = materialData.value.filter((item: any) => item.checked).map((item: any) => item.material_id);
        if (materialIds.length === 0) {
            message.error('请先勾选素材后，再做批量操作');
            return
        }

        makeTagModal.value = true;
    }
    materialID = materialIds

};

const makeTagForm = ref<FormInstance>();
//打标签弹框确认
const makeTagModalOk = () => {
    makeTagForm.value!.validate().then(() => {
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '确认提交打标签吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                makeTagRealmNameId();
            },
        });
    });
}

// 打标签接口
const makeTagRealmNameId = () => {
    // userTableLoading.value = true;
    const params = {
        // requestDTOS,this.sensitiveTypeId[this.sensitiveTypeId.length - 1]
        labelId: regionList,
        materialId: materialID
    };

    systemManagementApi.saveMaterialLabelRelation(params, {}).then((res) => {
        const { flag } = res
        if (flag === 'success') {
            message.success('添加成功');
            makeTagModal.value = false;
            getList();
        } else {
            message.success('添加失败');
        }
    });
};

const formData = reactive({
    region: [],//选择标签
});

let regionList: any = []

const changeRegionType = (value: any) => {

    regionList = []
    makeTagFormState.labelIds.forEach((res: any) => {
        regionList.push(res[res.length - 1])
    })

    //formData.includeTag = regionList
}

const makeTagFormState = reactive({
    labelIds: [],
    materialId: '',
});

const materialIdList = ref<any[]>([]);

const secsitiveTypeList = () => {
    // systemManagementApi.getFolderLabel({}, {}).then((res) => {
    // ifPage  是否分页   0不分页  1分页
    const params = { ifPage: '0' }
    systemManagementApi.qrysysLabel(params, {}).then((res) => {

        materialIdList.value = res.data;

    });
}
const filter = (inputValue: any, path: any) => {
    return path.some((option: any) => option.labelName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}
const showModal = ref<boolean>(false)
const makes = () => {

}

// 新增内容
const addContent = () => {

    //this.router.push('addContent')
    //addFormState.parentId = 
    addFormState.labelName = ''
    showModal.value = true
    //           this.$nextTick(() => {
    //   })
}


// 新增的表单数据
const addFormState = reactive({
    labelName: ''
})
const addForm = ref<FormInstance>();
// 新增标签弹框确认
const handleModalOk = async () => {
    addForm.value!.validate().then(() => {
        Modal.confirm({
            icon: createVNode(ExclamationCircleOutlined),
            content: '确认提交新增标签吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                addLabel()
            },
            onCancel: () => {
                showModal.value = false;
            }
        });
    });
}
const addLabel = () => {
    // 发请求 调用新增接口
    const params = {
        parentId: 'CustomLabel',
        groupId: 'CustomLabel',
        customizeLabel: 'true',
        labelName: addFormState.labelName,
    }


    systemManagementApi.addLabel(params, {}).then((res) => {
        showModal.value = false;
        message.success('新增成功');
        secsitiveTypeList()
        // materialIdList
    });
}

// ==================重命名模块========================
const nameEditable = ref<boolean>(false);
const nameEditableId = ref<string>('');
// 编辑名称
const editName = (materialId: string) => {
    nameEditable.value = true;
    nameEditableId.value = materialId;
};
const nameChangeCancel = () => {
    nameEditable.value = false;
};
const nameChangeOk = (materialId: string, materialName: string) => {
    nameEditable.value = false;
    const params = {
        materialId,
        materialName
    }
    systemManagementApi.changeNameMaterial(params, {})
        .then((res: any) => {

            materialName = materialName
            const { flag } = res
            if (flag === 'success') {
                message.success('修改成功');
                getList();
            } else {
                message.success('修改失败');
            }
        })


};

//  ==================引用次数模块========================
const drawerModal = ref<boolean>(false)
const quoteFormRef = ref<FormInstance>()
const userTableData = ref([]);
const userTableLoading = ref<boolean>(false)
const quoteForm = reactive({
    materialId: '',
    material_name: '',
    titleName: '',
    approver: '',
    description: '',
    dateTime: '',
    contentTypes: [],
})

const columns = [
    {
        title: '栏目分类',
        dataIndex: 'topicName',
        align: 'center',
    },
    {
        title: '内容',
        slots: { customRender: 'content' },
        dataIndex: 'material_name',
        align: 'center',
        width: '35%',
    },
    {
        title: '标签',
        dataIndex: 'labelNameList',
        align: 'center',
        ellipsis: true,
    },
    {
        title: '内容分类',
        dataIndex: 'contentType',
        align: 'center',
    },
    {
        title: '操作人',
        dataIndex: 'crt_user',
        align: 'center',
    },
    {
        title: '更新时间',
        dataIndex: 'crt_date',
        align: 'center',
    },
    {
        title: '操作',
        key: 'operation',
        align: 'center',
    },
];

const contentType = [
    {
        label: '图文',
        value: 't',
    },
    {
        label: '海报',
        value: 'b'
    },
    {
        label: '产品',
        value: 'pr'
    },
    {
        label: '话题',
        value: 's'
    },
    {
        label: '视频',
        value: 'v'
    }
]


const startTime = ref<string>('');

const disabledDateStart = (current: any) => {
    if (startTime.value) {
        return (
            (current && current < moment(startTime.value).subtract(1, 'days').endOf('day'))
        );
    }
}

const userTablePagination = reactive<PaginationType>({
    current: 1, //当前页数
    total: 0, //数据总数
    pageSize: 10, //每页中显示10条数据  每页条数
    onChange: (page: number, pageSize: number) => {
        userTablePagination.current = page;
        userTablePagination.pageSize = pageSize;
    },
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据 指定每页可以显示多少条
    showTotal: (total: number) => `共 ${total} 条`, //分页中显示总的数据 用于显示数据总量和当前数据顺序
});

let materialId = ''

//const drawerlist = ref<string[]>([])
const showDrawer = (material_id: any, cite_count: any) => {
    if (cite_count === '0') {
        drawerModal.value = false
    } else {
        column.value = []
        columnSureList.value = []
        tagValue.value = []
        tagSureList.value = []
        contentTypeList = []
        //contentTypes = ''
        quoteForm.contentTypes = []
        quoteForm.materialId = '',
            quoteForm.material_name = '',
            quoteForm.titleName = '',
            quoteForm.approver = '',
            quoteForm.dateTime = '',
            quoteForm.description = '',
            //let material_id: any[] = []

            materialId = material_id
        // materialIds.push(()=>{
        //     material_id
        // })

        drawerlist(materialId)
        getTagList()
        getColumnList()
        drawerModal.value = true
    }
}

let contentId = ''
let labelName: any = []
//  
// 获取引用次数列表
const drawerlist = async (materialId: any) => {

    // this.userTableLoading = true;
    const params = {
        ...quoteForm,
        materialId,
        topicId: '',
        labelId: '',
        startTimeStr: '',
        // endTimeStr:'',
        // row4Page: userTablePagination.pageSize,
        // nowPage: userTablePagination.current,
    }
    const header: any = {
        request: (header: AxiosRequestHeaders) => {
            header.row4Page = userTablePagination.pageSize;
            header.nowPage = userTablePagination.current;
        }
    }


    systemManagementApi.queryMaterialciteCount(params, header).then((res: any) => {

        res.data.forEach((item: any) => {




            contentId = item.contentId

            item.labelNameList.forEach((item: any) => {
                labelName = item.labelName
            })
        })
        userTableLoading.value = false;
        const arr = res.data || [];
        // userTablePagination.total = (res as any).recordsTotal;labelNameList
        userTableData.value = res.data;
        userTableData.value.forEach((item: any) => {
            if (item.contentType === 't') {
                item.contentType = '图文'
            } else if (item.contentType === 'b') {
                item.contentType = '海报'
            } else if (item.contentType === 'pr') {
                item.contentType = '产品'
            } else if (item.contentType === 's') {
                item.contentType = '话题'
            } else if (item.contentType === 'v') {
                item.contentType = '视频'
            }
        })

        // userTableData.value = arr.map((item: userTableDataType) => {
        //     // item.material_name_copy = item.material_name;
        //     // item.checked = false
        //     if('contentTypeList === []'){
        //         item.checked = false
        //     }
        //     return item
        // })
        // .catch((err: any) => {
        //     materialLoading.value = false;
        // });

    })
}

//引用次数弹框的查询
const numberlist = () => {
    //drawerlist(materialId)
    const params = {
        topicId: columnSureList.value.join(','),
        labelId: tagSureList.value.join(','),
        ...quoteForm,
        startTimeStr: startTime.value,
        // endTimeStr:endTime.value,
        contentTypes: quoteForm.contentTypes.join(','),
        materialId,
        // row4Page: userTablePagination.pageSize,
        // nowPage: userTablePagination.current,
    }

    const header: any = {
        request: (header: AxiosRequestHeaders) => {
            header.row4Page = userTablePagination.pageSize;
            header.nowPage = userTablePagination.current;
        }
    }

    systemManagementApi.queryMaterialciteCount(params, header).then((res: any) => {
        pagination.current = 1
        pagination.total = res.recordsTotal
        userTableData.value = res.data
        userTableData.value.forEach((item: any) => {
            if (item.contentType === 't') {
                item.contentType = '图文'
            } else if (item.contentType === 'b') {
                item.contentType = '海报'
            } else if (item.contentType === 'pr') {
                item.contentType = '产品'
            } else if (item.contentType === 's') {
                item.contentType = '话题'
            } else if (item.contentType === 'v') {
                item.contentType = '视频'
            }
        })
    })
}


//内容类型
// let contentType = ref<string>('')
//let contentTypes = ref<any>('');

const checkbox = (item: any) => {

    contentTypeList.push(item.value)

    //这个只改变了复选框的内容数据变化，
    //并没有改变复选框的是否选中的状态,
    //而且删除选中之后的一个复选框List里面的数据并没有减少反而增加了
}
let contentTypeList: any = []


// const contentTypeList = reactive<any>('')

//获取标签列表
const tagValue: any = ref([])

const tagValueList: any = ref([])
const getTagList = async () => {
    const params = {
        id: ''
    }
    await contentApi.getFolderLabel(params, {}).then((res) => {

        res.data.forEach((item: any) => {
            tagValueList.value.push(item)
        })
        //tagValueList.value = res.data;

    });
}
//筛选标签
const tagSureList: any = []
const changeTagValue = () => {
    tagSureList.value = []
    tagValue.value.forEach((res: any) => {
        tagSureList.value.push(res[res.length - 1])
        //tagSureList = tagSureList.value
    })

    // 
}

//获取栏目列表
const column: any = ref([])
const columnList: any = ref([])
const getColumnList = async () => {
    const params = {
        id: ''
    }
    await contentApi.getFolderTopic(params, {}).then((res: any) => {
        //columnList.value = res.data
        res.data.forEach((item: any) => {
            columnList.value.push(item)
        })

    })
}
//选中栏目
const columnSureList: any = []
const changeColumValue = () => {
    columnSureList.value = []
    column.value.forEach((res: any) => {
        columnSureList.value.push(res[res.length - 1])
        //columnSureList = columnSureList.value
    })

}

const value = ref([]);

const cancleBtn = () => {
    quoteForm.material_name = '';
    quoteForm.titleName = '';
    quoteForm.contentTypes = []
    column.value = []
    columnSureList.value = []
    tagValue.value = []
    tagSureList.value = []
    contentTypeList = []
    quoteFormRef.value!.resetFields();



    drawerlist(materialId)
}

// 详情
const preview = (contentId: any) => {

    //router.push({ path: 'uploadMaterial', query: { userId: '123' } })
    router.push({ path: '/content/contentDetail', query: { contentId: contentId } })
}

// =============模块结束==================


// function $nextTick(arg0: () => void) {
//     throw new Error('Function not implemented.');
// }
</script>

<style lang="less" scoped>
.picture_info {
    width: 100%;
    height: 20px;
    font-size: 13px;
    background: rgba(0, 0, 0, .2);
    position: absolute;
    bottom: 0;
    // left: 5%;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .picture_info_size {
        margin-left: 5px;
        margin-right: 5px;
    }
}

.container {
    // display: flex;
    justify-content: space-between;
    // height: 200px;
    background: #efefef 70%;
    //margin-top: 1px;
    margin-left: -20px;
    background-color: #ffffff;
    border-bottom: 1px solid #E9E9E9;
}

.center_txt {
    display: inline-block;
    margin: 0 auto;
    text-align: center;
    width: 100%;
    margin-left: -8px;
}

//padding-left: 20px;
::v-deep(.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
    background: #e81919;
    border-color: #e81919;
}


.right {
    // margin-top: 5px;
    // width: 100%;
    // display: flex;
    // margin-right: 30px;
    // border-bottom: 1px solid #E9E9E9;

    height: 10px;
    width: 100%;
    position: relative;
    clear: both;
    background-color: #F5F5F5;

}

// .item {
//     margin-bottom: 25px;
//     margin-left: 40px;
// }

.input {
    width: 450px;
    height: 35px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 610px;
}

.upload {
    width: 136px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-left: 10px;
    margin-top: -15px;
}

.gutter-example {
    margin-top: 5px;
    padding-left: 10px;
    overflow-y: auto;
    padding-right: 10px;
    height: 90%;
    padding-bottom: 50px;
}

.picture {
    border: 2px solid #e81919;
    margin-bottom: 20px;
    padding-left: 20px;
    background-color: #4f4f4f 100%;
}

.published-text {
    font-size: 12px;
    color: #fcca00;
    position: absolute;
    top: 8px;
    line-height: 20px;
    background-color: red;
    width: 44px;
    height: 20px;
    left: 15px;
    color: #ffffff;
    text-align: center;
    /* transform: translateZ(0); */
    -webkit-font-smoothing: auto;
}

.conentCard {
    background: #ffffff;
    margin: 7px;
    border-radius: 12px;
    border: 1px solid #F9F9F9;
    overflow: hidden;

    /deep/ .ant-col {
        padding-left: 0px !important;
        padding-right: 0px !important;
    }
}

.authorized {
    background-color: #2ED0CA;
    /* 已授权的背景颜色 */
}

.unauthorized {
    background-color: #E8380D;
    /* 未授权的背景颜色 */
}

.color_red {
    color: #E8380D;
    padding: 0px;
}


.tab {
    width: 84px;
    height: 33px;
    margin-left: 10px;
    background-color: #ffffff;
    border: 1px solid #E8380D;
    color: #E8380D;
    margin-top: 0px;
    padding: 0;

}

.tab1 {
    width: 84px;
    height: 33px;
    margin-top: 0px;
    border-radius: 4px;
    background-color: #ffffff;
    border: 1px solid #E8380D;
    color: #E8380D;
}

.tab2 {
    width: 84px;
    height: 33px;
    margin-top: 0px;
    color: #000000;
    margin-left: 16px;
    background: #F2F2F2;
    border-radius: 4px;
    border: 1px solid #BFBFBF;
}

.tab3 {
    width: 84px;
    height: 33px;
    margin-top: 0px;
    color: #ffffff;
    margin-left: 16px;
    background: #3F64F5;
    border-radius: 4px;
    border: 1px solid #3F64F5;
}

.tab4 {
    width: 84px;
    height: 33px;
    margin-top: 0px;
    color: #ffffff;
    margin-left: 16px;
    background: #E8380D;
    border-radius: 4px;
    border: 1px solid #E8380D;
}

.user-page {
    height: 100%;
    overflow: hidden;
}

.span {
    width: 84px;
    height: 33px;
    margin-top: 0px;
    margin-left: 10px;
    color: #000000;
    margin-right: 20px;
    background: #F2F2F2;
    border-radius: 4px;
    border: 1px solid #BFBFBF;
    // width: 116px;
    // height: 34px;
    // margin-left: 20px;
    // background-color: #fff;
    // color: #4c7bff;
    // border: 1px solid #4c7bff;
}

.checkbox {
    //float: left;
    width: 60px;
    height: 25px;
    margin-top: 0px;
    margin-left: 10px;
}

.source {
    color: #333333;
    font-size: 14px;
}

/deep/ .ant-image-mask {
    z-index: 2;
}

.pic {
    width: 90%;
    height: 100%;
    border-radius: 12px 12px 0px 0px;
    // border-radius: 20px 20px 0 0;
    // position: absolute;
}

// .pic-check {
//     // position: absolute;
//     // left: 20px;
//     // top: 10px;
// }

.eidtBox {
    display: flex;
    width: 100%;
    align-items: center;

    .eidtBox-i {
        margin-left: 12px;
        color: #4c7bff;
        font-size: 18px;
    }
}

.editLine {
    color: #E8380D;
    font-size: 1.2em;
    width: 20px;
    float: left;
    margin-top: 6px;
    margin-left: 6px;
}

.nameEditStyle {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    float: left;
    font-size: 16px;
    max-width: 80px;
    color: #333333;
}

/deep/ .ant-list-grid .ant-col>.ant-list-item {
    margin-bottom: 0px;
    font-size: 12px;
    color: #999999;
}

.maturity {
    color: #333333;
    cursor: pointer;
    padding-left: 0px;
    padding-right: 0px;
}

.table-content {
    padding: 4px;
    margin-top: 20px;

    .table-content-left {
        .table-content-img {
            width: 34px;
            height: 34px;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .table-content-right {
        margin-left: 5px;
        margin-top: -5px;

        .table-content-content {
            font-size: 14px;
            color: #333333;
        }

        .table-content-id {
            font-size: 12px;
            color: #666666;
        }
    }
}

.btnRed {
    //background: red;
    margin-left: 20px;
    padding: 0px 0px;
    width: 64px;
    height: 32px;
    text-align: center;
    font-size: 12px;
    line-height: 24px;
    background-color: #E8380D;
    border-color: #E8380D;
    color: #ffffff;
    margin: 0px 10px 10px;
    border-radius: 4px;
}

.btnBlue {
    margin-left: 20px;
    padding: 0px 0px;
    width: 64px;
    height: 32px;
    text-align: center;
    font-size: 12px;
    line-height: 24px;
    border-color: #666666;
    margin: 0px 10px 10px;
    border-radius: 4px;
}

.radio {
    margin-left: 20px;
    width: 80px;
    height: 32px;
    text-align: center;
    font-size: 10px;
    line-height: 32px;
}

.clear {
    clear: both
}

// .ant-btn {
//     padding: 0px 0px;
// }
span.ant-input-affix-wrapper {
    width: 32px;
}

.a-list-item {
    margin-top: 10px;
}

.number {
    margin-bottom: 20px;
    border: 1px solid #BFBFBF;
}

//.....重制复选框.....//
/deep/ .ant-spin-container {

    background: #F9F9F9;

    .ant-checkbox {
        /* 为复选框外部添加边框和一些内边距 */
        border: none;
        padding: 5px;
    }

    input[type="checkbox"] {
        display: none;
    }

    .ant-checkbox-checked::after {
        border: none;
    }

    .ant-checkbox-checked .ant-checkbox-inner::after {
        border: none
    }

    .ant-checkbox-input {
        /* 修改复选框的外观 */
        border-radius: 0px;
    }

    .ant-checkbox-inner {
        /* 修改复选框的背景颜色和边框颜色 */
        background-color: transparent;
        border: none;
        background-image: url('../../../icons/image/unchecked.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 18px;
        height: 18px
    }

    .ant-checkbox-checked .ant-checkbox-inner {
        /* 修改被选中的复选框的背景颜色 */
        background-image: url('../../../icons/image/sketch.png');
    }
}

.ScreeningCondition_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0px 16px;

    .ScreeningCondition_title_btn {
        border: solid 0px;
        width: 15px;
        height: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
    }
}

.operationManage {
    // padding: 0px 16px;
    width: 100%;
    // height: 100%;
    // position: relative;
    overflow: auto;

    .operationManage_hr {
        height: 12px;
        background-color: #F5F5F5;
        // background-color: #000;
        width: 100%;
    }

}

.queryList {
    padding: 16px 16px 0px 16px;
    // position: relative;
    overflow: auto;
    width: 100%;
}

.operationManage_page {
    position: absolute;
    padding: 0px 16px 0px 16px;
    width: 100%;
    height: 6.6%;
    bottom: 10px;
    right: 2px;
    display: flex;
    justify-content: end;
    align-items: center;

}

.operationManage_page_content {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: end;
    align-items: center;
    padding-bottom: 10px;
    padding-top: 10px;
}

//重置按钮
.cancleBtn {
    margin-left: 5px;
    border: 1px solid #BFBFBF;
}

/deep/ .custom-class .ant-drawer-wrapper-body {
    background-color: #f6f6f6 !important;
}

/deep/ .custom-class .ant-drawer-header {
    background-color: #f6f6f6 !important;
}

// .image-container::after {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: rgba(0, 0, 0, 0.1999); /* 黑色蒙版，可以根据需要调整颜色和透明度 */
// }
</style>
