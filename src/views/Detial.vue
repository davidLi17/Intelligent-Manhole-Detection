<template>
	<div class="outer">
		<div class="top">
			<Return class="rbut"></Return>
		</div>
		<div class="bottom">
			<div class="left">
				<div class="image__preview">
					<el-image
						style="width: 100%; height: auto"
						:src="url"
						:preview-src-list="detials"
						fit="contain">
					</el-image>
				</div>
			</div>
			<div class="right">
				<div class="content">时间：{{ arrayList.updatedAt }}</div>
				<div class="content">地点：{{ arrayList.location }}</div>
				<div class="content">检修人员：{{ arrayList.repairer }}</div>
				<div class="content">维修状态：{{ arrayList.damageType }}</div>
				<div class="content">
					备注：
					<!-- <div  v-html="arrayList.info.replace(/\n/g, '<br>')" ></div> -->
				</div>
				<div class="contents">
					<el-card
						class="box-card"
						body-style="height:auto">
						<div
							slot="header"
							class="clearfix">
							<span>维修日志</span>
							<el-button
								class="box_card_button"
								type="text"
								@click="Torepairer"
								:disabled="!isWorker"
								>维修完毕
							</el-button>

							<el-button
								class="box_card_button"
								type="text"
								@click="addNewLog"
								:disabled="!isWorker"
								>提交日志
							</el-button>
						</div>
						<textarea
							class="text"
							v-model="info"
							:placeholder="pl"
							:disabled="!isWorker">
						</textarea>
					</el-card>
					<div class="timeline">
						<el-timeline>
							<el-timeline-item
								v-for="(item, index) in logs"
								key="index"
								:timestamp="formatDate(item.createdAt)"
								placement="top">
								<el-card>
									<h4>{{ item.description }}</h4>
								</el-card>
							</el-timeline-item>
						</el-timeline>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Return from "../components/Return.vue";
	import { getHistoryById, upDate } from "../api/history.js";
	import { getLogByHistoryId, addLog } from "../api/log.js";
	import { mapGetters } from "vuex";
	import dayjs from "dayjs";
	export default {
		name: "Detial",
		components: {
			Return,
		},
		data() {
			return {
				url: "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
				srcList: [
					"https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
					"https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
				],
				arrayList: {},
				detials: [],
				info: "",
				repairer: {},
				isWorker: true,
				pl: "",
				infos: "",
				active: 0,
				logs: [],
			};
		},
		methods: {
			addNewLog() {
				if (this.info == "") {
					this.$message({
						type: "warning",
						message: "请输入日志",
					});
					return;
				}
				addLog(this.info, this.$route.params.id).then((res) => {
					getLogByHistoryId(this.$route.params.id).then((res) => {
						this.logs = res.data;
						this.$message({
							type: "success",
							message: "数据更新成功",
						});
					});
				});
			},
			Torepairer() {
				if (this.info) {
					this.infos = this.arrayList.info;
					this.infos += "\n";
					this.infos += this.info;
				}

				const timestamp = dayjs().toISOString();
				this.repairer = {
					repairer: this.arrayList.repairer,
					updatedAt: timestamp,
					damageType: "已维修",
					location: this.arrayList.location,
					info: this.infos,
					isRepaired: "true",
				};

				upDate(this.$route.params.id, this.repairer).then((res) => {
					this.$message({
						type: "success",
						message: "数据更新成功",
					});
					this.info = "";
					this.fetchHistoryDetails();
				});
			},
			formatDate(isoTimestamp) {
				return dayjs(isoTimestamp).format("YYYY-MM-DD HH:mm:ss");
			},
			fetchHistoryDetails() {
				getHistoryById(this.$route.params.id).then((res) => {
					this.arrayList = res.data.History;
					this.arrayList.updatedAt = dayjs(this.arrayList.updatedAt).format(
						"YYYY-M-D"
					);
					this.url = this.arrayList.url;
					this.detials = [this.arrayList.url, this.arrayList.predictedUrl];
				});
			},
		},
		computed: {
			...mapGetters(["getId"]),
		},
		created() {
			if (this.getId === "checker") {
				this.isWorker = false;
				this.pl = "只有工作人员可更改";
			} else this.pl = "在此处输入日志";

			getLogByHistoryId(this.$route.params.id).then((res) => {
				this.logs = res.data;
			});

			this.fetchHistoryDetails();
		},
	};
</script>

<style scoped lang="scss">
	/* 全局样式 */
	.outer {
		position: relative;
		width: 100%;
		min-height: 100vh; /* 至少填满整个视口高度 */
		display: flex;
		flex-direction: column; /* 垂直布局 */
		padding: 10px; /* 添加内边距 */
		box-sizing: border-box; /* 避免内边距影响宽度 */
		overflow: auto;
	}

	.top {
		z-index: 1;
		display: flex;
		justify-content: flex-start; /* 返回按钮靠左 */
		margin-bottom: 1rem; /* 与下方内容隔开 */
		align-items: center; /* 垂直居中 */
	}

	.rbut {
		width: auto; /* 宽度自适应 */
		height: auto; /* 高度自适应 */
	}

	.bottom {
		display: flex;
		flex-direction: column; /* 垂直布局 */
		gap: 20px; /* 子元素间距 */
	}

	.left {
		width: 100%; /* 占据全部宽度 */
		order: 1; /* 在移动端显示在上方 */
	}

	.image__preview {
		width: 100%; /* 占据全部宽度 */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.right {
		width: 100%; /* 占据全部宽度 */
		order: 2; /* 在移动端显示在下方 */
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.content {
		padding: 0.6%;
		font-size: 1rem; /* 字体大小 */
	}

	.contents {
		width: 100%;
		margin-top: 1rem;
	}

	.box-card {
		width: 100%;
		.box_card_button {
			margin-left: 1rem;
			padding: 6px 15px;
			border: 2px solid #4466ee;
			border-radius: 25px;
			color: #4466ee;
			font-weight: 500;
			transition: all 0.3s ease;

			&:hover {
				background-color: #4466ee;
				color: white;
				transform: translateY(-2px);
				box-shadow: 0 3px 8px rgba(68, 102, 238, 0.3);
			}

			&:disabled {
				border-color: #cccccc;
				color: #999999;
				cursor: not-allowed;

				&:hover {
					background-color: transparent;
					transform: none;
					box-shadow: none;
				}
			}
		}
	}

	.text {
		font-size: 1rem;
		letter-spacing: 0.12em;
		width: 100%;
		min-height: 100px; /* 设置最小高度 */
		resize: vertical; /* 允许垂直调整大小 */
		border: none;
		outline: none;
		box-sizing: border-box; /* 避免内边距影响宽度 */
	}

	.timeline {
		margin-top: 20px;
		overflow-x: hidden; /* 隐藏水平滚动条 */
		overflow-y: auto;
		max-height: 350px; /* 设置最大高度，超出则显示滚动条 */
	}

	/* 响应式设计 */
	@media (min-width: 768px) {
		/* 平板/桌面端布局 */
		.bottom {
			flex-direction: row; /* 水平布局 */
			align-items: flex-start; /* 顶部对齐 */
		}

		.left {
			width: 50%; /* 左侧占据一半宽度 */
			padding-right: 20px; /* 右侧间距 */
			order: 0; /* 恢复原始顺序 */
		}

		.right {
			width: 50%; /* 右侧占据一半宽度 */
			order: 1; /* 恢复原始顺序 */
		}
		.image__preview {
			height: 70vh;
		}
	}
</style>
