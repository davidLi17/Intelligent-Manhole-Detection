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
	import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
	let amapManager = new AMapManager();

	export default {
		props: {
			width: {
				default: 700,
			},
			height: {
				default: 600,
			},
		},
		data() {
			let self = this;
			return {
				amap_id: Math.random().toString(36).substr(2).toLocaleUpperCase(),
				address: null,
				searchKey: "",
				amapManager,
				markers: [],
				searchOption: {
					city: "全国",
					citylimit: true,
				},
				center: [112.001771, 32.679353],
				zoom: 17,
				lng: 0,
				lat: 0,
				loaded: false,
				events: {
					init() {
						lazyAMapApiLoaderInstance.load().then(() => {
							self.initSearch();
						});
					},
					// 点击获取地址的数据
					click(e) {
						self.markers = []; // 清空现有标记点 (为点击位置的新标记点做准备)
						let lng = 0;
						let lat = 0;
						if (e.lnglat) {
							lng = e.lnglat.lng;
							lat = e.lnglat.lat;
						}

						//console.log(lng,lat)
						self.lng = lng;
						self.lat = lat;
						self.center = [lng, lat]; // 更新组件的 lng, lat 和 center 数据属性以反映点击位置。这将使地图中心位于点击点。
						//当前点击位置的经纬度
						//console.log('self.makers',self.markers);
						//self.markers.push([lng, lat])

						self.markers[0] = [lng, lat]; // 在点击的坐标添加新的标记点。此组件旨在一次只显示一个标记点。

						// 逆地理编码: 将经纬度转换为地址
						let geocoder = new AMap.Geocoder({
							radius: 1000,
							extensions: "all",
						});

						geocoder.getAddress([lng, lat], function (status, result) {
							console.log(lng);
							if (status === "complete" && result.info === "OK") {
								if (result && result.regeocode) {
									//地址打印测试语句
									// console.log('result.regeocode.formattedAddress'+result.regeocode.formattedAddress)
									self.address = result.regeocode.formattedAddress;
									self.searchKey = result.regeocode.formattedAddress;
									self.$emit("updateLocation", lng, lat, self.searchKey);
									self.$nextTick(); //确保 Vue 已经更新 DOM 之后再执行任何进一步的操作。
								}
							}
						});
					},
				},
				// 一些工具插件
				plugin: [
					// {
					//   pName: 'Geocoder',
					//   events: {
					//     init (o) {
					//       console.log(o.getAddress())
					//     }
					//   }
					// },
					{
						// 定位
						pName: "Geolocation",
						events: {
							init(o) {
								// o是高德地图定位插件实例
								o.getCurrentPosition((status, result) => {
									if (result && result.position) {
										// 设置经度
										self.lng = result.position.lng;
										// 设置维度
										self.lat = result.position.lat;
										// 设置坐标
										self.center = [self.lng, self.lat]; // 更新 self.lng, self.lat 和 self.center 以将地图中心定位到用户的位置。
										// self.markers.push([self.lng, self.lat])
										self.markers[0] = [self.lng, self.lat];
										// load
										self.loaded = true;
										// 页面渲染好后
										self.$nextTick();
									}
								});
							},
						},
					},
					{
						// 工具栏
						pName: "ToolBar",
						events: {
							init(instance) {
								// console.log(instance);
							},
						},
					},
					{
						// 鹰眼
						pName: "OverView",
						events: {
							init(instance) {
								// console.log(instance);
							},
						},
					},
					{
						// 地图类型
						pName: "MapType",
						defaultType: 0,
						events: {
							init(instance) {
								// console.log(instance);
							},
						},
					},
					{
						// 搜索
						pName: "PlaceSearch",
						events: {
							init(instance) {
								// console.log(instance)
							},
						},
					},
				],
			};
		},
		methods: {
			initSearch() {
				let vm = this;
				let map = this.amapManager.getMap(); // 从 amapManager 获取 AMap 实例
				AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
					var poiPicker = new PoiPicker({
						input: "search", // 要绑定到的输入字段的 ID (重要: 'search' 匹配 <input id="search">)
						placeSearchOptions: {
							map: map, //将 AMap 实例传递给 PoiPicker
							pageSize: 10,
						},
						suggestContainer: "searchTip", // 用于显示建议的 div 的 ID (重要: 'searchTip' 匹配 <div id="searchTip">)
						searchResultsContainer: "searchTip", // 搜索结果的 ID
					});
					vm.poiPicker = poiPicker; // 将 PoiPicker 实例存储在组件中

					// 监听poi选中信息
					poiPicker.on("poiPicked", function (poiResult) {
						console.log(poiResult);
						let source = poiResult.source;
						let poi = poiResult.item;
						if (source !== "search") {
							poiPicker.searchByKeyword(poi.name);
						} else {
							poiPicker.clearSearchResults();
							vm.markers = []; //清除现有标记点
							let lng = poi.location.lng;
							let lat = poi.location.lat;
							let address = poi.cityname + poi.adname + poi.name;
							vm.center = [lng, lat];
							// vm.markers.push([lng, lat])
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
				if (this.searchKey !== "") {
					this.poiPicker.searchByKeyword(this.searchKey);
				}
			},
		},
		mounted() {
			// console.log('small',this.amap_id)
		},
		destroyed() {
			//经过测试好像没啥用
			// let map = this.amapManager.getMap()
			// map.destroy();
		},
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
