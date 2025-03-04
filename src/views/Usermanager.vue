<template>
	<div class="home-container">
		<div class="left">
			<div
				class="horizontal"
				ref="chartContainer"></div>
			<div
				class="normal"
				ref="chartContainer0"></div>
			<div
				class="normal"
				ref="chartContainer2"></div>
		</div>
		<div
			class="right"
			ref="chartContainer3"></div>
	</div>
</template>

<script>
	import * as echarts from "echarts";
	import { mapGetters, mapActions } from "vuex";
	import { getMonth, getDay, getWeek } from "../api/data.js";
	export default {
		data() {
			return {
				chartData: {}, // 存储图表数据的对象
				dayData: [],
				dayMsg: [],
				weekData: [],
				monthData: [],
				formattedDate: "",
				countArray: [],
				totalUploadCountArray: [],
				repairCountArray: [],
			};
		},
		computed: {
			...mapGetters(["getScatterData"]),
			scatterData() {
				return this.getScatterData;
			},
		},
		mounted() {
			// 创建一个Date对象来获取当前日期
			var currentDate = new Date();
			console.log(this.getScatterData);
			// 获取年、月、日
			var year = currentDate.getFullYear();
			var month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1
			var day = ("0" + currentDate.getDate()).slice(-2);

			// 格式化日期
			this.formattedDate = year + "-" + month + "-" + day;

			console.log(this.formattedDate); // 输出：2024-04-14

			getDay(this.formattedDate).then((res) => {
				console.log(res.data.damageTypeStats);
				var day = res.data.damageTypeStats;
				this.dayData = Object.values(res.data.damageTypeStats);
				console.log(this.dayData);
				this.dayMsg = Object.keys(day);
				if (this.getScatterData[0].type == "bar") this.renderScatterChart();
				else this.initChart2();
			});
			getMonth().then((res) => {
				console.log(res.data);
				var objArray = res.data;
				this.monthData = objArray.map((obj) => obj.year + "/" + obj.month);

				// 将count属性提取到一个单独数组
				this.countArray = objArray.map((obj) => obj.count);
				this.initChart();
			});
			getWeek(this.formattedDate).then((res) => {
				console.log(res.data);
				var daysOfWeek = [
					"星期一",
					"星期二",
					"星期三",
					"星期四",
					"星期五",
					"星期六",
					"星期日",
				];
				var objArray = res.data;
				// 提取totalUploadCount属性到一个单独数组
				this.totalUploadCountArray = daysOfWeek.map((day) => {
					var obj = objArray.find((item) => item.day === day);
					return obj ? obj.totalUploadCount : 0;
				});

				// 提取repairCount属性到一个单独数组
				this.repairCountArray = daysOfWeek.map((day) => {
					var obj = objArray.find((item) => item.day === day);
					return obj ? obj.repairCount : 0;
				});
				console.log("检查是否为空", this.getScatterData);
				this.higherChart();
				// if (this.getScatterData[0].type == 'bar') this.renderScatterChart()
				// else this.initChart3()这里是对AI输入的处理
			});
			this.initchart0();
		},
		methods: {
			higherChart() {
				const scatterChart = echarts.init(this.$refs.chartContainer3);
				const colors = ["#5470C6", "#91CC75", "#EE6666"];
				const option = {
					color: colors,
					tooltip: {
						trigger: "axis",
						axisPointer: {
							type: "cross",
						},
					},
					grid: {
						right: "27%", //grid 组件离容器右侧的距离
						bottom: "15%", //grid 组件离容器下侧的距离
						left: "15%",
					},
					toolbox: {
						feature: {
							dataView: { show: true, readOnly: false },
							restore: { show: true },
							saveAsImage: { show: true },
						},
					},
					legend: {
						data: ["发现道路故障", "维修道路故障", "平均投入人手"],
					},
					xAxis: [
						{
							type: "category",
							axisTick: {
								alignWithLabel: true,
							},
							// prettier-ignore
							data: ['一月', 'Feb', '三月', 'Apr', '五月', 'Jun', '七月', 'Aug', '九月', 'Oct', '十一月', 'Dec'],
						},
					],
					yAxis: [
						{
							type: "value",
							name: "发现道路故障",
							position: "right",
							alignTicks: true,
							axisLine: {
								show: true,
								lineStyle: {
									color: colors[0],
								},
							},
							axisLabel: {
								formatter: "{value} ",
							},
						},
						{
							type: "value",
							name: "维修道路故障",
							position: "right",
							alignTicks: true,
							offset: 80,
							axisLine: {
								show: true,
								lineStyle: {
									color: colors[1],
								},
							},
							axisLabel: {
								formatter: "{value}",
							},
						},
						{
							type: "value",
							name: "人流量",
							position: "left",
							alignTicks: true,
							axisLine: {
								show: true,
								lineStyle: {
									color: colors[2],
								},
							},
							axisLabel: {
								formatter: "{value} w",
							},
						},
					],
					series: [
						{
							name: "发现道路故障",
							type: "bar",
							data: [
								2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4,
								3.3,
							],
						},
						{
							name: "维修道路故障",
							type: "bar",
							yAxisIndex: 1,
							data: [
								2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
								2.3,
							],
						},
						{
							name: "平均投入人手",
							type: "line",
							yAxisIndex: 2,
							data: [
								2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 7.2, 5.1, 4.0, 1.2,
							],
						},
					],
				};
				scatterChart.setOption(option);
				// 窗口大小改变时，重绘图表
				window.addEventListener("resize", () => {
					scatterChart.resize();
				});
			},
			renderScatterChart() {
				const scatterChart = echarts.init(this.$refs.chartContainer2);
				// 将小写键转换为大写键
				// const needDates = {
				//   x: this.getScatterData[0].x, // 每个数据点的 X 值
				//   y: this.getScatterData[0].y, // 每个数据点的 Y 值
				//   hovertemplate: this.getScatterData[0].hovertemplate, // 鼠标悬停时显示的模板
				//   marker: {
				//     color: this.getScatterData[0].marker.color // 每个数据点的颜色
				//   }
				// }
				const option = {
					title: {
						text: "AI生产图表",
						x: "15px",
						y: "2px", //默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
						textStyle: {
							rich: {
								textPadding: {
									padding: [80, 0, 0, 0], // 上、右、下、左的边距
								},
							},
						},
					},
					xAxis: {
						type: "category",
						data: this.getScatterData[0].x,
					},
					yAxis: {
						type: "value",
					},
					series: [
						{
							data: this.getScatterData[0].y,
							type: "bar",
						},
					],
				};
				scatterChart.setOption(option);
				// 窗口大小改变时，重绘图表
				window.addEventListener("resize", () => {
					scatterChart.resize();
				});
			},
			initchart0() {
				let chart = echarts.init(this.$refs.chartContainer0);
				var option;

				option = {
					title: {
						text: "造成道路隐患的原因分析",
						x: "15px",
						y: "2px", //默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
						textStyle: {
							rich: {
								textPadding: {
									padding: [80, 0, 0, 0], // 上、右、下、左的边距
								},
							},
						},
					},
					legend: {
						top: "bottom",
					},
					toolbox: {
						show: true,
						feature: {
							mark: { show: true },
							restore: { show: true },
							saveAsImage: { show: true },
						},
					},
					series: [
						{
							name: "Nightingale Chart",
							type: "pie",
							radius: [5, 101],
							center: ["50%", "50%"],
							roseType: "area",
							itemStyle: {
								borderRadius: 4,
							},
							data: [
								{ value: 15, name: "外力破坏" },
								{ value: 23, name: "老化" },
								{ value: 11, name: "路面变形" },
								{ value: 19, name: "车辆超载" },
							],
						},
					],
				};

				chart.setOption(option);
				// 窗口大小改变时，重绘图表
				window.addEventListener("resize", () => {
					chart.resize();
				});
			},
			initChart() {
				// 创建图表实例
				let chart = echarts.init(this.$refs.chartContainer);

				// 设置图表配置项和数据
				let option = {
					tooltip: {
						trigger: "axis",
						position: function (pt) {
							return [pt[0], "10%"];
						},
					},
					title: {
						left: "center",

						y: "3px",
						text: "道路隐患历史记录",
						textStyle: {
							rich: {
								textPadding: {
									padding: [10, 0, 0, 0], // 上、右、下、左的边距
								},
							},
						},
					},
					toolbox: {
						feature: {
							dataZoom: {
								yAxisIndex: "none",
							},
							restore: {},
							saveAsImage: {},
						},
					},
					xAxis: {
						type: "category",
						boundaryGap: false,
						data: [
							"2023-07",
							"2023-08",
							"2023-09",
							"2023-10",
							"2023-11",
							"2023-12",
							"2024-01",
							"2024-02",
							"2024-03",
							"2024-04",
							"2024-05",
							"2024-06",
						],
						//this.monthData
					},
					yAxis: {
						type: "value",
						boundaryGap: [0, "100%"],
					},
					dataZoom: [
						{
							type: "inside",
							start: 0,
							end: 10,
						},
						{
							start: 0,
							end: 10,
						},
					],
					series: [
						{
							name: "发现数据",
							type: "line",
							symbol: "none",
							sampling: "lttb",
							itemStyle: {
								color: "rgb(255, 70, 131)",
							},
							areaStyle: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: "rgb(255, 158, 68)",
									},
									{
										offset: 1,
										color: "rgb(255, 70, 131)",
									},
								]),
							},
							data: [120, 330, 101, 134, 90, 230, 72, 182, 191, 65, 290, 119],
							//this.countArray
						},
					],
				};

				// 使用配置项和数据渲染图表
				chart.setOption(option);
				// 窗口大小改变时，重绘图表
				window.addEventListener("resize", () => {
					chart.resize();
				});
			},
			initChart2() {
				var option;
				let chart = echarts.init(this.$refs.chartContainer2);
				option = {
					title: {
						x: "15px",
						y: "2px",
						text: "道路隐患类型",
						textStyle: {
							rich: {
								textPadding: {
									padding: [10, 0, 0, 0], // 上、右、下、左的边距
								},
							},
						},
					},
					xAxis: {
						type: "category",
						data: [
							"井盖良好",
							"井盖破损",
							"井盖丢失",
							"路面坑洼",
							"路面横向裂缝",
							"路面纵向裂缝",
							"路面鳄鱼状裂缝",
						],
						axisLabel: {
							rotate: -45,
						},
					},
					yAxis: {
						type: "value",
					},
					series: [
						{
							data: [75, 133, 28, 48, 66, 52, 81],
							//this.dayData
							type: "bar",
						},
					],
				};
				chart.setOption(option);
				// 窗口大小改变时，重绘图表
				window.addEventListener("resize", () => {
					chart.resize();
				});
			},
			initChart3() {
				let chart = echarts.init(this.$refs.chartContainer3);
				var option;

				option = {
					title: {
						text: "道路检测与维修趋势分析",
						x: "15px",
						y: "2px",
						textStyle: {
							rich: {
								textPadding: {
									padding: [80, 0, 0, 0], // 上、右、下、左的边距
								},
							},
						},
					},
					tooltip: {
						trigger: "axis",
					},
					legend: { top: "bottom" },
					toolbox: {
						show: true,
						feature: {
							dataZoom: {
								yAxisIndex: "none",
							},
							dataView: { readOnly: false },
							magicType: { type: ["line", "bar"] },
							restore: {},
							saveAsImage: {},
						},
					},
					xAxis: {
						type: "category",
						boundaryGap: false,
						data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					},
					yAxis: {
						type: "value",
						axisLabel: {
							formatter: "{value} ",
						},
					},
					series: [
						{
							name: "维修数",
							type: "line",
							data: [90, 110, 130, 77, 63, 80, 103],
							//this.repairCountArray
							markPoint: {
								data: [
									{ type: "max", name: "Max" },
									{ type: "min", name: "Min" },
								],
							},
							markLine: {
								data: [{ type: "average", name: "Avg" }],
							},
						},

						{
							name: "检测数",
							type: "line",
							data: [66, 85, 53, 113, 92, 180, 67],
							//this.totalUploadCountArray
							markPoint: {
								data: [
									{ type: "max", name: "Max" },
									{ type: "min", name: "Min" },
								],
							},
							markLine: {
								data: [{ type: "average", name: "Avg" }],
							},
						},
					],
				};
				chart.setOption(option);
				// 窗口大小改变时，重绘图表
				window.addEventListener("resize", () => {
					chart.resize();
				});
			},
		},
	};
</script>

<style scoped>
	/* 全局样式 */
	.home-container {
		width: 100%;
		min-height: 100vh; /* 至少填满整个视口高度 */
		display: flex;
		flex-direction: column; /* 移动端默认垂直布局 */
		padding: 20px;
		box-sizing: border-box;
		background-color: #fff;
	}

	.left {
		width: 100%;
		display: flex;
		flex-direction: column; /* 移动端垂直布局 */
		gap: 20px; /* 图表之间的间距 */
	}

	.horizontal,
	.normal,
	.right {
		width: 100%; /* 移动端每个图表占据整行 */
		height: 250px; /* 适当调整高度 */
		box-shadow: 2px 1px 11px 6px #dcdfe6;
		border-radius: 20px;
		margin-bottom: 20px;
	}

	/* 桌面端样式 */
	@media (min-width: 768px) {
		.home-container {
			flex-direction: row; /* 桌面端水平布局 */
		}

		.left {
			width: 60%;
			flex-direction: row; /* 桌面端水平布局 */
			flex-wrap: wrap; /* 允许换行 */
			margin-left: 2vh;
			height: 81%;
		}

		.horizontal {
			width: 100%; /* 第一个图表占据整行 */
			height: 270px;
			margin-right: 20px;
		}

		.normal {
			width: calc(50% - 1rem); /* 两个图表各占一半宽度，并留有间距 */
			height: 270px;
			margin-right: 6px;
		}

		.right {
			width: calc(38% - 1rem); /* 右侧图表宽度，留有间距 */
			height: 76%;
			margin-right: 2vh;
			margin-bottom: 2.7%;
		}
	}
</style>
