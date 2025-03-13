<template>
	<div class="container">
		<div class="search-box">
			<div class="searchTool-box">
				<svg
					viewBox="0 0 24 24"
					aria-hidden="true"
					class="icon">
					<g>
						<path
							d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
					</g>
				</svg>
				<input
					v-model="searchKey"
					type="search"
					id="search"
					placeholder="搜索位置" />
				<!-- <button @click="searchByHand">搜索</button> -->
			</div>
			<div
				class="tip-box"
				id="searchTip"></div>
		</div>
		<div
			class="amap-box"
			:style="{ width: width + 'px', height: height + 'px' }">
			<!--
          amap-manager： 地图管理对象
          vid：地图容器节点的ID
          zooms： 地图显示的缩放级别范围，在PC上，默认范围[3,18]，取值范围[3-18]；在移动设备上，默认范围[3-19]，取值范围[3-19]
          center： 地图中心点坐标值
          plugin：地图使用的插件
          events： 事件
        -->
			<el-amap
				:amap-manager="amapManager"
				:vid="amap_id"
				:zoom="zoom"
				:plugin="plugin"
				:events="events">
				<!-- 标记 -->
				<el-amap-marker
					v-for="(marker, index) in markers"
					:position="marker"
					:key="index"></el-amap-marker>
			</el-amap>
		</div>
	</div>
</template>

<script>
	// 导入高德地图管理器和懒加载实例
	import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
	let amapManager = new AMapManager();

	export default {
		props: {
			width: {
				default: 700, // 地图默认宽度
			},
			height: {
				default: 600, // 地图默认高度
			},
		},
		data() {
			let self = this;
			return {
				amap_id: Math.random().toString(36).substr(2).toLocaleUpperCase(), // 生成随机地图容器ID
				address: null, // 存储地址信息
				searchKey: "", // 搜索关键词
				amapManager, // 地图管理器实例
				markers: [], // 地图标记点数组
				searchOption: {
					city: "全国", // 搜索范围为全国
					citylimit: true, // 限制在城市内搜索
				},
				center: [112.001771, 32.679353], // 地图初始中心点
				zoom: 17, // 地图缩放级别
				lng: 0, // 经度
				lat: 0, // 纬度
				loaded: false, // 地图加载状态
				events: {
					init() {
						// 地图初始化事件
						lazyAMapApiLoaderInstance.load().then(() => {
							self.initSearch();
						});
					},
					click(e) {
						// 地图点击事件
						self.markers = []; // 清空现有标记点
						let lng = 0;
						let lat = 0;
						if (e.lnglat) {
							lng = e.lnglat.lng;
							lat = e.lnglat.lat;
						}

						self.lng = lng;
						self.lat = lat;
						self.center = [lng, lat]; // 更新地图中心点

						self.markers[0] = [lng, lat]; // 添加新的标记点

						// 初始化地理编码服务
						let geocoder = new AMap.Geocoder({
							radius: 1000,
							extensions: "all",
						});

						// 获取地址信息
						geocoder.getAddress([lng, lat], function (status, result) {
							console.log(lng);
							if (status === "complete" && result.info === "OK") {
								if (result && result.regeocode) {
									self.address = result.regeocode.formattedAddress;
									self.searchKey = result.regeocode.formattedAddress;
									self.$emit("updateLocation", lng, lat, self.searchKey);
									self.$nextTick();
								}
							}
						});
					},
				},
				plugin: [
					{
						pName: "Geolocation", // 定位插件
						events: {
							init(o) {
								// 获取当前位置
								o.getCurrentPosition((status, result) => {
									if (result && result.position) {
										self.lng = result.position.lng; // 设置经度
										self.lat = result.position.lat; // 设置纬度
										self.center = [self.lng, self.lat]; // 设置地图中心点
										self.markers[0] = [self.lng, self.lat]; // 添加标记点
										self.loaded = true; // 标记加载完成
										self.$nextTick();
									}
								});
							},
						},
					},
					{
						pName: "ToolBar", // 工具栏插件
						events: {
							init(instance) {},
						},
					},
					{
						pName: "OverView", // 鹰眼插件
						events: {
							init(instance) {},
						},
					},
					{
						pName: "MapType", // 地图类型切换插件
						defaultType: 0,
						events: {
							init(instance) {},
						},
					},
					{
						pName: "PlaceSearch", // 地点搜索插件
						events: {
							init(instance) {},
						},
					},
				],
			};
		},
		methods: {
			initSearch() {
				// 初始化搜索功能
				let vm = this;
				let map = this.amapManager.getMap(); // 获取地图实例
				AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
					var poiPicker = new PoiPicker({
						input: "search", // 输入框ID
						placeSearchOptions: {
							map: map, // 地图实例
							pageSize: 10,
						},
						suggestContainer: "searchTip", // 提示框容器ID
						searchResultsContainer: "searchTip", // 搜索结果容器ID
					});
					vm.poiPicker = poiPicker; // 保存搜索实例

					// POI选择事件处理
					poiPicker.on("poiPicked", function (poiResult) {
						console.log(poiResult);
						let source = poiResult.source;
						let poi = poiResult.item;
						if (source !== "search") {
							poiPicker.searchByKeyword(poi.name);
						} else {
							poiPicker.clearSearchResults();
							vm.markers = []; // 清除标记点
							let lng = poi.location.lng;
							let lat = poi.location.lat;
							let address = poi.cityname + poi.adname + poi.name;
							vm.center = [lng, lat];
							vm.markers[0] = [lng, lat];
							vm.lng = lng;
							vm.lat = lat;
							vm.address = address;
							vm.searchKey = address;
							vm.$emit("updateLocation", lng, lat, vm.searchKey);
						}
					});
				});
			},
			searchByHand() {
				// 手动搜索方法
				if (this.searchKey !== "") {
					this.poiPicker.searchByKeyword(this.searchKey);
				}
			},
		},
		mounted() {},
		destroyed() {},
	};
</script>

<style lang="css" scoped>
	* {
		margin: 0px;
		padding: 0px;
	}

	.container {
		/* 父容器如果设置了固定大小那么el-map的大小就不能跟随变化了 */
		/* width: 700px;
  height: 500px; */
		position: relative;
	}

	/* .amap-box {
  width: 700px ;
  height: 600px;
  min-height: 500px;
} */

	.search-box {
		display: flex;
		/* justify-content: center;
align-items: center; */
		position: absolute;
		z-index: 5;
		width: 65%;
		left: 50%;
		transform: translateX(-50%);
		top: 10px;
		height: 30px;
	}

	.searchTool-box {
		/* display: flex;
position: relative; */
		display: flex;

		line-height: 28px;
		align-items: center;
		position: relative;
		width: 100%;
	}

	.search-box input {
		width: 70% !important;
		max-width: 600px;
		height: 40px;
		line-height: 28px;
		padding: 0 1rem;
		padding-left: 2.5rem;
		border-radius: 10px;
		border: 1px solid #a6a6a7;
		outline: none;
		/* background-color: #f3f3f4; */
		transition: 0.3s ease;
	}

	.search-box input:focus {
		box-shadow: 0px 0px 0px 1px #042aff;
	}

	.search-box .icon {
		position: absolute;
		left: 1rem;
		fill: #9e9ea7;
		width: 1rem;
		height: 1rem;
		transform: scale(1.5);
	}

	.search-box button {
		width: 20%;
		height: 30px;
		background: #30ccc1;
		border: 1px solid #30ccc1;
		color: #fff;
		outline: none;
	}

	.tip-box {
		width: 95% !important;
		max-width: 600px;
		max-height: 260px;

		position: absolute;
		top: 45px !important;
		overflow-y: auto;
		background-color: #fff;
	}
</style>
