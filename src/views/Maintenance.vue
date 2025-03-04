<template>
	<div class="container-note">
		<div class="top">
			<div
				class="sort"
				:class="{ active: isActive }"
				@click="sorts">
				<svg
					data-v-a4e76a79=""
					fill="none"
					viewBox="0 0 24 24"
					height="24"
					width="24"
					xmlns="http://www.w3.org/2000/svg"
					alt="Toggle filters">
					<path
						xmlns="http://www.w3.org/2000/svg"
						d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"
						fill="#5C6067"></path>
				</svg>
				<span>按照井盖更新事件时间排序</span>
			</div>
			<div class="search">
				<div class="search_input">
					<el-select
						v-model="selectedValue"
						placeholder="请选择状态"
						size="small"
						clearable
						class="chocie">
						<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.label">
						</el-option>
					</el-select>
					<el-date-picker
						v-model="sdata"
						type="date"
						placeholder="选择日期"
						format="yyyy 年 MM 月 dd 日"
						value-format="yyyy-MM-dd"
						:picker-options="pickerOptions">
					</el-date-picker>
					<el-input
						@keyup.enter="() => Tosearch()"
						v-model="slocation"
						placeholder="请输入地点"
						style="width: 30%; height: 100%"
						size="small"></el-input>
				</div>
				<div class="operation">
					<el-button
						type="primary"
						icon="el-icon-search"
						class="but"
						size="small"
						@click="Tosearch"></el-button>
					<el-button
						type="primary"
						icon="el-icon-delete"
						class="but"
						size="small"
						@click="clear"></el-button>
				</div>
				<div class="AI">
					<button
						class="button2"
						@click="openAll">
						<span>AI数据查询助手</span>
					</button>
				</div>
			</div>
		</div>
		<div
			class="note-list"
			:class="{
				'note-list': currentPageData.length >= 6,
				'less-note-list': currentPageData.length < 6,
			}">
			<div
				class="outer"
				v-for="(item, index) in currentPageData"
				@click="Detial(item.id)">
				<div class="left">
					<div class="title">{{ item.updatedAt }}</div>

					<div class="content">{{ item.location }}</div>
					<div class="bottom">
						<div class="guess">{{ item.prediction }}</div>
						<div
							:class="{
								repaired: item.damageType === '已维修',
								norepaired: item.damageType === '待维修',
							}">
							{{ item.damageType }}
						</div>
					</div>
				</div>
				<div class="right">
					<img
						class="right_img"
						:src="item.predictedUrl"
						alt="" />
				</div>
			</div>
		</div>
		<div class="footers">
			<div
				class="steps"
				v-if="stepshow">
				<el-steps
					:active="active"
					finish-status="success">
					<el-step title="步骤 1"></el-step>
					<el-step title="步骤 2"></el-step>
					<el-step title="步骤 3"></el-step>
				</el-steps>
			</div>
			<div class="pagedivided">
				<el-pagination
					background
					layout="prev, pager, next"
					@current-change="handleCurrentChange"
					:total="totalPages"
					:page-size="6">
				</el-pagination>
			</div>
		</div>

		<div
			v-if="dialogVisible"
			class="overlay"
			@click="dialogVisible = false"></div>
		<div
			v-if="dialogVisible"
			class="dialog">
			<div class="dialog-content">
				<span
					class="close"
					@click="dialogVisible = false"
					>×</span
				>
				<h2>AI快捷服务</h2>
				<div class="messages">
					<div
						v-for="(message, index) in messages"
						:key="index"
						:class="['message', message.sender]">
						<div
							v-if="message.sender == 'photoB'"
							class="heads">
							<img
								src="https://www.chatmee.cn/wdd.svg"
								alt="" />
						</div>
						<div
							class="heads"
							v-else-if="message.sender == 'photoU'">
							<img
								src="https://images.meisa.dev/2024/04/13/5102a5fce70dde96425b0725f35d7a40.svg"
								alt="" />
						</div>
						<p v-else>{{ message.text }}</p>
					</div>
				</div>
				<div class="Aioperation">
					<input
						v-model="userInput"
						@keyup.enter="sendMessage"
						placeholder="输入你的消息" />
					<button
						class="dbut"
						@click="sendMessage">
						发送
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		ShowHistory,
		getRecordById,
		getRecordByRepairer,
	} from "../api/history.js";
	import Plotly from "plotly.js-dist";
	import { mapGetters, mapActions } from "vuex";
	import {
		uploadQuestion,
		runSql,
		generatePlotlyChart,
		generateResByAI,
	} from "../api/vannaAI";
	// import "../../public/font/NotoSansHK.css"
	export default {
		data() {
			return {
				data: [], // 完整的数据列表
				currentPage: 1, // 当前页码
				itemsPerPage: 6, // 每页显示的条目数
				totalPages: 0, // 总页数
				ifSort: false,
				sdata: "",
				slocation: "",
				currentPageData: [], // 当前页显示的数据
				currentData: [],
				options: [
					{
						value: "选项1",
						label: "已维修",
					},
					{
						value: "选项2",
						label: "待维修",
					},
				],
				selectedValue: "", // 选择的状态(已维修/待维修),
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [
						{
							text: "今天",
							onClick(picker) {
								picker.$emit("pick", new Date());
							},
						},
						{
							text: "昨天",
							onClick(picker) {
								const date = new Date();
								date.setTime(date.getTime() - 3600 * 1000 * 24);
								picker.$emit("pick", date);
							},
						},
						{
							text: "一周前",
							onClick(picker) {
								const date = new Date();
								date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit("pick", date);
							},
						},
					],
				},
				note_list: [
					{
						updatedAt: "2024-03-20T13:55:51.144Z",
						imgUrl: require("@/assets/ManholeCover_Picture/well3_0062.jpg"),
						damageType: "严重破损",
						repairer: "未维护",
						location: "桂林电子科技大学花江校区宿舍A区",
						info: "",
					},
					{
						updatedAt: "2024-03-20T13:55:51.144Z",
						imgUrl: require("@/assets/ManholeCover_Picture/well3_0063.jpg"),
						damageType: "部分缺失",
						repairer: "未维护",
						location: "桂林电子科技大学花江校区宿舍B区",
						info: "",
					},
				],
				arrayList: [],
				isActive: false,
				dialogVisible: false,
				newtip: "最近解决路障",
				Need: "",
				isLoading: false,
				userInput: "",
				response: "",
				messages: [],
				stepshow: false,
				active: 1,
			};
		},
		methods: {
			...mapActions(["updateScatterData"]),
			updateData(newData) {
				this.updateScatterData(newData);
			},
			...mapActions(["updateMsg"]),
			upMsg(newData) {
				this.updateMsg(newData);
			},
			Detial(id) {
				// console.log(id);
				this.$router.push(`/detial/${id}`);
			},
			clear() {
				this.value = "";
				this.sdata = "";
				this.slocation = "";
				this.totalPages = this.arrayList.length;
				this.currentData = this.arrayList;
				this.currentPageData = this.arrayList.slice(0, 6);
			},
			resetDialog() {
				this.userInput = "";
				this.response = "";
			},
			formatDate(dateStr) {
				const date = new Date(dateStr);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			},
			Tosearch() {
				this.currentPageData = this.arrayList.filter((item) => {
					// 创建条件数组
					const conditions = [];

					// 检查每个搜索条件是否存在，存在则添加到条件数组
					if (this.selectedValue) {
						conditions.push(item.damageType == this.selectedValue);
					}

					if (this.slocation) {
						conditions.push(item.location.includes(this.slocation));
					}

					if (this.sdata) {
						const formattedItemDate = this.formatDate(item.updatedAt);
						const formattedSearchDate = this.formatDate(this.sdata);
						conditions.push(formattedItemDate == formattedSearchDate);
					}

					// 如果没有任何搜索条件，返回true显示所有数据
					if (conditions.length === 0) {
						return true;
					}

					// 所有条件都满足才返回true
					return conditions.every((condition) => condition);
				});

				// 更新分页相关数据
				this.updatePageData();
			},
			updatePageData() {
				this.totalPages = this.currentPageData.length;
				this.currentData = this.currentPageData;
				this.currentPageData = this.currentData.slice(0, 6);
			},
			scrollToBottom() {
				const container = this.$el.querySelector(".messages");
				container.scrollTop = container.scrollHeight;
			},
			sorts() {
				if (this.ifSort) {
					this.arrayList.sort((a, b) => {
						const timeA = new Date(a.updatedAt);
						const timeB = new Date(b.updatedAt);
						return timeA - timeB;
					});
				} else {
					this.arrayList.sort((a, b) => {
						const timeA = new Date(a.updatedAt);
						const timeB = new Date(b.updatedAt);
						return timeB - timeA;
					});
				}
				// console.log(this.arrayList);
				this.handleCurrentChange(1);
				this.ifSort = !this.ifSort;
				this.isActive = !this.isActive;
			},
			handleCurrentChange(page) {
				// 当前页码变化时的处理逻辑
				this.currentPage = page;
				var start = (page - 1) * 6;
				var end = page * 6;
				this.currentPageData = this.currentData.slice(start, end);
			},
			getmes() {
				const tipsText = this.$refs.tips.innerText;
				this.Need = tipsText;
			},
			addMessage(identifiy, content) {
				this.messages.push({ sender: identifiy, text: content });
			},
			sendMessage() {
				let input = this.userInput;
				this.userInput = "";
				this.active = 1;
				let id;
				if (input.trim() !== "") {
					this.addMessage("photoU", "");
					this.addMessage("user", input.trim());
					setTimeout(() => {
						this.addMessage("photoB", "");
						this.addMessage("bot", "正在处理您的请求...");
					}, 50);
					uploadQuestion(input.trim()).then((res) => {
						let draw;
						const ans = res;
						// console.log(ans);
						// console.log("nmsl", this.messages);
						id = ans.id;
						runSql(id).then((res) => {
							// console.log("runsql", res);
							draw = res.should_generate_chart;
							generateResByAI(id).then((res) => {
								this.addMessage("bot", "AI分析" + res.text);
								this.updateMsg(this.messages);
								if (input.includes("图") || draw) {
									generatePlotlyChart(id).then((res) => {
										// console.log("图标", JSON.parse(res.fig));
										let temp = JSON.parse(res.fig);
										setTimeout(() => {
											this.updateData(temp.data);
											if (temp.data[0].type != "bar")
												this.addMessage("bot", "缺少数据，无法生成");
											else {
												this.addMessage("bot", "生成成功，进行跳转");
												setTimeout(() => {
													this.$router.push("/trends");
												}, 500);
											}
										}, 1000);
									});
								}
							});
						});
					});
					// 模拟机器人回复
				}

				// this.stepshow = true
				// this.incrementActive();
				// this.dialogVisible = false
			},
			openAll() {
				this.dialogVisible = true;
				this.stepshow = false;
				this.messages = this.getMsg;
			},
			incrementActive() {
				if (this.active <= 3) {
					const delay = Math.random() * 2500; // 0-2 秒随机数
					this.timer = setTimeout(() => {
						this.active++;
						this.incrementActive();
					}, delay);
				} else {
					clearTimeout(this.timer);
					this.timer = null;
				}
			},
		},
		watch: {
			messages() {
				this.$nextTick(() => {
					this.scrollToBottom();
				});
			},
		},
		computed: {
			...mapGetters(["getId"]),
			...mapGetters(["getMsg"]),
		},
		created() {
			// console.log(sessionStorage.getItem("token"));

			// console.log("sb2", this.messages);
			if (this.getId == "" || this.getId == "admin") {
				ShowHistory()
					.then((res) => {
						// console.log("admin");
						this.arrayList = res.data.histories;

						for (let i = 0; i < this.arrayList.length; i++) {
							let timestamp = this.arrayList[i].updatedAt;
							let date = new Date(timestamp);
							let year = date.getFullYear();
							let month = date.getMonth() + 1; // 月份从0开始，需要加1
							let day = date.getDate();
							this.arrayList[i].updatedAt = year + "-" + month + "-" + day; // 更改每个对象的时间戳字段
						}
						const predictionMap = {
							good: "井盖完好",
							broke: "井盖破损",
							lose: "井盖丢失",
							uncovered: "井盖未盖",
							circle: "井圈有问题",
							potholes: "坑洼",
							Transverse: "横向裂缝",
							Longitudinal: "纵向裂缝",
							Crocodile: "鳄鱼状裂缝",
						};

						this.arrayList.forEach((history) => {
							if (history.prediction in predictionMap) {
								history.prediction = predictionMap[history.prediction];
							}
						});
						// console.log(this.arrayList);
						this.currentData = this.arrayList;
						this.currentPageData = this.currentData.slice(0, 6);
						this.totalPages = this.arrayList.length;
					})
					.catch((error) => {
						// 处理错误
						// console.error(error);
					});
			} else if (this.getId == "checker") {
				// console.log("checker");
				// console.log(sessionStorage.getItem("userId"));
				var id = sessionStorage.getItem("userId");
				getRecordById(id)
					.then((res) => {
						// console.log("我真的是检查", res);
						// console.log(this.arrayList);
						this.arrayList = res.data.histories;

						for (var i = 0; i < this.arrayList.length; i++) {
							var timestamp = this.arrayList[i].updatedAt;
							var date = new Date(timestamp);
							var year = date.getFullYear();
							var month = date.getMonth() + 1; // 月份从0开始，需要加1
							var day = date.getDate();
							this.arrayList[i].updatedAt = year + "-" + month + "-" + day; // 更改每个对象的时间戳字段
						}
						const predictionMap = {
							good: "井盖完好",
							broke: "井盖破损",
							lose: "井盖丢失",
							uncovered: "井盖未盖",
							circle: "井圈有问题",
						};

						this.arrayList.forEach((history) => {
							if (history.prediction in predictionMap) {
								history.prediction = predictionMap[history.prediction];
							}
						});
						// console.log("checker", this.arrayList);
						this.currentData = this.arrayList;
						this.currentPageData = this.currentData.slice(0, 6);
						this.totalPages = this.arrayList.length;
					})
					.catch((error) => {
						// 处理错误
						// console.error(error);
					});
			} else {
				getRecordByRepairer()
					.then((res) => {
						this.arrayList = res.data.histories;
						// console.log("rper");
						for (var i = 0; i < this.arrayList.length; i++) {
							var timestamp = this.arrayList[i].updatedAt;
							var date = new Date(timestamp);
							var year = date.getFullYear();
							var month = date.getMonth() + 1; // 月份从0开始，需要加1
							var day = date.getDate();
							this.arrayList[i].updatedAt = year + "-" + month + "-" + day; // 更改每个对象的时间戳字段
						}
						const predictionMap = {
							good: "井盖完好",
							broke: "井盖破损",
							lose: "井盖丢失",
							uncovered: "井盖未盖",
							circle: "井圈有问题",
						};

						this.arrayList.forEach((history) => {
							if (history.prediction in predictionMap) {
								history.prediction = predictionMap[history.prediction];
							}
						});
						// console.log(this.arrayList);
						this.currentData = this.arrayList;
						this.currentPageData = this.currentData.slice(0, 6);
						this.totalPages = this.arrayList.length;
					})
					.catch((error) => {
						// 处理错误
						// console.error(error);
					});
			}
		},
	};
</script>

<!-- 优化后的样式 -->
<style scoped lang="scss">
	/* 全局样式和重置 */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	.container-note {
		width: 100%;
		min-height: 100vh; /* 最小高度为视口高度 */
		overflow: auto;
		background-color: #f8f9fa;
		display: flex;
		flex-direction: column; /* 垂直布局 */
	}

	/* 顶部搜索和排序区域 */
	.top {
		width: 92%; /* 减少左右边距 */
		height: 10vh;
		margin: 1.8% auto 0; /* 使用 auto 实现水平居中 */
		display: flex;
		flex-wrap: wrap; /* 允许换行 */
		justify-content: space-between;
		align-items: center; /* 垂直居中 */
		padding: 0 5px; /* 添加内边距 */
	}

	.sort {
		width: 24px;
		height: 24px;
		cursor: pointer;
		margin-left: 10rem;
		display: flex; /* 使用 Flexbox 布局 */
		align-items: center; /* 垂直居中 */
		justify-content: center; /* 水平居中 */
		span {
			white-space: nowrap; /* Prevent text from wrapping */
			font-size: 1rem;
			color: #111f68;
			margin-left: 8px; /* Add some spacing between icon and text */
			display: inline-block; /* Better text alignment */
		}
	}

	.search {
		display: flex;
		flex-wrap: wrap; /* 允许换行 */
		width: 100%; /* 顶部搜索区域宽度 */
		justify-content: space-between;
		align-items: center;
		margin-top: 10px; /* 顶部间距 */
	}

	.search_input {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 10px; /* 元素间距 */
		width: 100%; /* 搜索输入区域宽度 */
		// 使用 ::v-deep (Vue 2)
		::v-deep .el-input__inner {
			height: 32px;
			line-height: 32px;
		}

		::v-deep .el-select {
			.el-input__inner {
				height: 32px;
			}
		}

		::v-deep .el-date-editor {
			.el-input__inner {
				height: 32px;
				line-height: 32px;
			}
		}
	}

	.search_input > * {
		flex: 1 1 30%; /* 弹性布局 */
		max-width: 30%; /* 最大宽度 */
	}
	.search_input > .chocie {
		flex: 1 1 20%; /* 弹性布局 */
		max-width: 20%; /* 最大宽度 */
	}

	.operation {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
		width: 100%;
		margin-top: 10px;
		margin-bottom: 1rem;
	}
	.operation > * {
		height: 32px;
		z-index: 1;
	}

	.AI {
		display: flex;
		justify-content: flex-end; /* AI按钮靠右 */
		width: 100%;
		margin-top: 10px;
	}

	.button2 {
		/* 按钮样式 */
		display: inline-flex; /* 修改为inline-flex */
		align-items: center;
		justify-content: center;
		padding: 0.4em 1em;
		font-size: 11px;
		border-radius: 0.5em;
		background: #e8e8e8;
		border: 1px solid #e8e8e8;
		box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
		color: #090909;
		cursor: pointer;
		transition: all 0.2s ease-in;
		position: relative;
		overflow: hidden;
		z-index: 1;
		height: 32px; /* 统一高度 */
	}

	.button2:active {
		color: #666;
		box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
	}

	.button2:before,
	.button2:after {
		content: "";
		position: absolute;
		left: 50%;
		transform: translateX(-50%) scaleY(1) scaleX(1.25);
		width: 140%;
		height: 180%;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 50%;
		transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
		z-index: -1;
	}

	.button2:after {
		transform: translateX(-50%) scaleY(1) scaleX(1.45);
		top: 180%;
		width: 160%;
		height: 190%;
		background-color: #409eff;
	}

	.button2:hover {
		color: #ffffff;
		border-color: #409eff;
	}

	.button2:hover:before {
		top: -35%;
		background-color: #409eff;
		transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
	}

	.button2:hover:after {
		top: -45%;
		background-color: #409eff;
		transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
	}

	/* 记录列表 */
	.note-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 16px; /* 卡片间距 */
		padding: 16px;
		width: 92%; /* 减少左右边距 */
		margin: 20px auto;
	}

	.less-note-list {
		justify-content: flex-start;
		/* 当数量少于6个时左对齐 */
	}

	/* 单个记录卡片 */
	.outer {
		width: calc(50% - 16px);
		/* 2列布局 */
		min-height: 150px;
		border-radius: 0.75rem;
		box-shadow: 2px 1px 7px 6px #0a113612;
		display: flex;
		border: 2px solid transparent;
		transition: border-color 0.3s ease;
		/* 平滑过渡效果 */
		overflow: hidden;
		/* 溢出隐藏 */
	}

	.outer:hover {
		border-color: #111f68;
	}

	.left {
		width: 68%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-family: "Noto Sans CJK", sans-serif;
		letter-spacing: 0.06em;
	}

	.right {
		width: 32%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}

	.right_img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 0.375rem;
	}

	.title {
		font-size: 1.1rem;
		color: #111f68;
		margin-bottom: 0.5rem;
	}

	.content {
		color: #111f68;
		margin-bottom: 0.5rem;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; /* 最多显示两行 */
		-webkit-box-orient: vertical;
	}

	.bottom {
		display: flex;
		align-items: center;
		flex-wrap: wrap; /* 允许换行 */
		gap: 8px; /* 元素之间的间距 */
	}

	.guess,
	.repaired,
	.norepaired {
		padding: 5px 10px;
		border-radius: 1.125rem;
		font-size: 0.8rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		text-align: center;
		flex-shrink: 0; /* 防止缩小 */
	}

	.guess {
		background-color: #c2c2c233;
		color: #888;
	}

	.repaired {
		background-color: #e1f3d8;
		color: #67c23a;
	}

	.norepaired {
		background-color: #f56c6c;
		color: #fff;
	}

	/* 页脚和分页 */
	.footers {
		display: flex;
		flex-wrap: wrap; /* 允许换行 */
		justify-content: space-between;
		align-items: center; /* 垂直居中 */
		width: 92%; /* 减少左右边距 */
		margin: 20px auto;
		padding: 0 10px;
	}

	.steps {
		width: 100%; /* 步骤条占据整行 */
		margin-bottom: 20px;
	}

	.pagedivided {
		width: 100%; /* 分页器占据整行 */
		text-align: center;
	}

	/* AI对话框 */
	.dialog {
		position: fixed;
		top: 7%;
		right: 3%;
		width: 90%; /* 移动端宽度 */
		max-width: 360px; /* 最大宽度限制 */
		height: auto; /* 高度自适应 */
		max-height: 90vh; /* 最大高度 */
		background-color: white;
		box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
		z-index: 1000;
		transition: transform 0.3s ease;
		overflow-y: auto; /* 允许滚动 */
		border-radius: 0.5rem; /* 圆角 */
	}

	.dialog-content {
		padding: 20px;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.close {
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 24px;
		cursor: pointer;
		z-index: 1001;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
		z-index: 999;
	}

	.messages {
		flex: 1;
		overflow-y: auto;
		padding-bottom: 20px; /* 底部留白 */
	}

	.message {
		margin: 10px 0;
		padding: 10px;
		border-radius: 5px;
		font-size: 0.9rem;
		word-wrap: break-word;
		max-width: 80%; /* 消息最大宽度 */
		display: flex; /* 使用 Flexbox */
		align-items: flex-start; /* 顶部对齐 */
	}
	.message > p {
		margin: 0; /* 移除默认边距 */
	}

	.user {
		background-color: #e0f7fa;
		align-self: flex-end;
		margin-left: auto; /* 用户消息右对齐 */
		flex-direction: row-reverse; /* 反转头像和文本 */
		text-align: right;
	}

	.bot {
		background-color: #ffe0b2;
		align-self: flex-start;
		margin-right: auto; /* 机器人消息左对齐 */
		text-align: left;
	}
	.heads {
		width: 24px; /* 头像大小 */
		height: 24px;
		border-radius: 50%; /* 圆形头像 */
		overflow: hidden;
		margin: 0 8px; /* 头像间距 */
		flex-shrink: 0; /* 防止头像缩小 */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.heads img {
		width: 100%;
		height: 100%;
		object-fit: cover; /* 保持纵横比并填充容器 */
	}

	.Aioperation {
		display: flex;
		align-items: center;
		gap: 10px; /* 元素间距 */
		padding-top: 10px; /* 顶部内边距 */
	}

	.Aioperation input {
		flex: 1; /* 输入框占据剩余空间 */
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 0.9rem;
	}

	.dbut {
		/* 发送按钮样式 */
		padding: 10px 15px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 0.9rem;
		flex-shrink: 0;
		height: auto; /* 高度自适应 */
		white-space: nowrap; /* 防止换行 */
	}

	.dbut:hover {
		background-color: #0056b3;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.outer {
			width: 100%;
			/* 移动端单列布局 */
		}
		.search_input {
			justify-content: space-between; /* 元素间距 */
		}
		.search_input > * {
			flex: 1 1 48%;
			max-width: 48%;
		}
		.operation {
			justify-content: center;
		}
		.search_input > .chocie {
			::v-deep {
				.el-select,
				.el-date-editor,
				.el-input {
					width: 100%;
					margin-bottom: 8px;
				}
			}
			& {
				flex: 1 1 100%;
				max-width: 100%;
			}
		}

		.dialog {
			right: 0; /* 全屏显示 */
			width: 100%;
			height: 85vh;
			top: 5%;
			border-radius: 0; /* 取消圆角 */
		}
		.el-input__inner {
			height: 32px;
			line-height: 32px;
		}
		.el-select {
			height: 32px;
		}
	}
</style>
