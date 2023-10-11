<template>
    			<div class="check" v-if="contentCheck === 0">
				<a-form>
					<a-row>
						<a-col class="checkTitle">内容审核</a-col>
					</a-row>
					<a-row class="jielun">
						<a-form-item label="审核结论：">
							<a-col class="yn">
								<a-radio-group v-model:value="operateContent.operateType">
									<a-radio value="2" @click="isAgree">同意</a-radio>
									<a-radio value="3" @click="isAgree">不同意</a-radio>
								</a-radio-group>
							</a-col>

						</a-form-item>
					</a-row>

					<a-row class="yijian">
						<a-form-item label="审核意见：" name="check_text" 
							:rules="[{ required: true, message: '审核意见不能为空', trigger: 'change' }]">
							<a-col>
								<a-textarea class="wenben" v-model:value="operateContent.note" showCount :maxlength="100"
									placeholder="请录入审核意见" allowClear />
							</a-col>
							<a-row class="explanNote"><a-col>注：当[审核结论]选择“不同意”时，“审核意见”为必录项</a-col></a-row>
						</a-form-item>
					</a-row>
				</a-form>
			</div>
			<div class="btn" v-if="contentCheck === 0">
				<a-button class="cancel" :ghost="false">取消</a-button>
				<a-button class="submit" type="primary" :ghost="false">提交</a-button>
			</div>

			<div class="agree" v-if="contentCheck === 1">
				<div class="agr">
					<a-form>
						<a-row>
							<div class="noteTitle">内容审核处理记录</div>
						</a-row>
						<div class="steps">
							<a-steps direction="vertical" size="small">
								<a-step disabled="true" status="wait">
									<template #title>
										<span class="nam">刘伊</span>
									</template>
									<template #subTitle>
										<span class="xiangqing">提交内容审核详情</span>
										<span class="time">2023-02-01 20:46 </span>
									</template>
								</a-step>
								<a-step  disabled="true" status="finish">
									<template #title>
										<span class="nam">王一惠</span>
									</template>
									<template #subTitle>
										<span class="xiangqing">审核结论:</span>
										<span class="tongyi">同意</span>
										<span class="time">2023-02-01 20:46</span>
									</template>
								</a-step>
							</a-steps>
							<!-- <a-steps direction="vertical" size="small" v-for="item in test " :key="item.id">
								<a-step disabled="true" :status="item.status" :style="item.style">
									<template #title>
										<span class="nam">刘伊{{ item.name }}</span>
									</template>
									<template #subTitle>
										<span class="xiangqing">提交内容审核详情 {{ item.content }}</span>
										<span class="time">2023-02-01 20:46 {{ item.time }}</span>
									</template>
								</a-step> -->
							<!-- </a-steps> -->
						</div>
					</a-form>
				</div>
				<div>
					<a-button class="back" :ghost="false">返回</a-button>
				</div>
			</div>
			<div class="agree" v-if="contentCheck === 2">
				<div class="agr">
					<a-form>
						<a-row>
							<div class="noteTitle">内容审核处理记录</div>
						</a-row>
						<div class="steps">
							<a-steps direction="vertical" size="small">
								<a-step disabled="true" status="wait">
									<template #title>
										<span class="nam">刘伊</span>
									</template>
									<template #subTitle>
										<span class="xiangqing">提交内容审核详情</span>
										<span class="time">2023-02-01 20:46</span>
									</template>
								</a-step>
								<a-step disabled="true" status="error">
									<template #title>
										<span class="nam">王一惠</span>
									</template>
									<template #subTitle>
										<span class="xiangqing">审核结论:</span>
										<span class="butongyi">不同意</span>
										<span class="time">2023-02-01 20:46</span>
									</template>
								</a-step>
							</a-steps>

						</div>

					</a-form>
				</div>
				<div>
					<a-button class="back" :ghost="false">返回</a-button>
				</div>
			</div>
</template>