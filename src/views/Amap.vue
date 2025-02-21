<template>
    <div class="container" v-if="!loading">
        <div class="search-box">
            <div class="searchTool-box">
                <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
                    <g>
                        <path
                            d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                        </path>
                    </g>
                </svg>
                <input v-model="searchKey" type="search" id="search" placeholder="搜索位置">
            </div>
            <div class="tip-box" id="searchTip"></div>
        </div>


        <div class="amap-box">
            <!--
            amap-manager： 地图管理对象
            vid：地图容器节点的ID
            zooms： 地图显示的缩放级别范围，在PC上，默认范围[3,18]，取值范围[3-18]；在移动设备上，默认范围[3-19]，取值范围[3-19]
            center： 地图中心点坐标值
            plugin：地图使用的插件
            events： 事件
          -->
            <el-amap :amap-manager="amapManager" :vid="amap_id" :zoom="zoom" :plugin="plugin" 
                :events="events">
                <!-- 标记 -->
                <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :events="marker.events"
                    :icon="marker.icon" :key="index"></el-amap-marker>
                <el-amap-info-window v-if="window" :position="window.position" :visible="window.visible"
                    :content="window.content" :offset="window.offset"></el-amap-info-window>
            </el-amap>
        </div>
    </div>
</template>

<script>

import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
import { getRepairedCovers, getUnRepairedCovers } from "../api/history.js";
import location_red from '../assets/location_red.png'
import location_green from '../assets/location_green.png'
import g1 from '../assets/g1.png'
import r1 from '../assets/r1.png'
// import lred3 from '../assets/lred3.gif'



let amapManager = new AMapManager()


export default {
    props: {
        width: {

            default: 700
        },
        height: {

            default: 600
        }
    },
    data() {
        let self = this
        return {
            amap_id: Math.random().toString(36).substr(2).toLocaleUpperCase(),
            loading: true,
            RepairedCovers: [],
            UnRepairedCovers: [],

            address: null,
            searchKey: '',
            amapManager,
            markers: [],
            windows: [],
            window: '',
            searchOption: {
                city: '全国',
                citylimit: true
            },
            center: [120.978008, 31.083667],
            zoom: 17,
            lng: 0,
            lat: 0,
            loaded: false,
            events: {
                init() {
                    lazyAMapApiLoaderInstance.load().then(() => {
                        self.initSearch()
                    })
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
                    pName: 'Geolocation',
                    events: {
                        init(o) {
                            // o是高德地图定位插件实例
                            // o.getCurrentPosition((status, result) => {
                            //     if (result && result.position) {
                            //         // 设置经度
                            //         self.lng = result.position.lng
                            //         // 设置维度
                            //         self.lat = result.position.lat
                            //         // 设置坐标
                            //         self.center = [self.lng, self.lat]
                            //         // self.markers.push([self.lng, self.lat])
                            //         self.markers[0] = [lng, lat];
                            //         // load
                            //         self.loaded = true
                            //         // 页面渲染好后
                            //         self.$nextTick()
                            //     }
                            // })
                        }
                    }
                },
                {
                    // 工具栏
                    pName: 'ToolBar',
                    events: {
                        init(instance) {
                            // console.log(instance);
                        }
                    }
                },
                {
                    // 鹰眼
                    pName: 'OverView',
                    events: {
                        init(instance) {
                            // console.log(instance);
                        }
                    }
                },
                {
                    // 地图类型
                    pName: 'MapType',
                    defaultType: 0,
                    events: {
                        init(instance) {
                            // console.log(instance);
                        }
                    }
                },
                {
                    // 搜索
                    pName: 'PlaceSearch',
                    events: {
                        init(instance) {
                            // console.log(instance)
                        }
                    }
                }
            ]
        }
    },
    methods: {
        initSearch() {
            let vm = this
            let map = this.amapManager.getMap()
            let icon_red = new AMap.Icon({
                image: r1,
                size: new AMap.Size(30, 30),
                imageSize: new AMap.Size(30, 30),
                // offset: new AMap.Pixel(-10, -10),
                // anchor: "bottom-center",

            });
            let icon_green = new AMap.Icon({
                image: g1,
                size: new AMap.Size(30, 30),
                imageSize: new AMap.Size(30, 30),
                // offset: new AMap.Pixel(-10, -10),
                // anchor: "bottom-center",

            });

            // let content = '<div style="background: white;width: 400px;padding: 10px;">\n' +
            //     '      <div style="width: 400px;height: 20px;line-height: 20px;">\n' +
            //     '        <span style="display: inline-block; vertical-align: middle;">方恒假日酒店  <span style="color:#F00;">价格:318</span></span>\n' +

            //     '      </div>\n' +
            //     '      <hr>\n' +
            //     '      <div style="float: left;height: 100px;margin: 5px 10px">\n' +
            //     '        <img src="http://tpc.googlesyndication.com/simgad/5843493769827749134">\n' +
            //     '      </div>\n' +
            //     '      <div style="font-size: 12px;width: 360px;">\n' +
            //     '        <div>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里</div>\n' +
            //     '        <div style="margin: 5px 10px;">电话：010-64733333</div>\n' +
            //     '        <div style="margin: 5px 10px;color: #20a0ff"><a href=\'https://ditu.amap.com/detail/B000A8URXB?citycode=110105\'>详细信息</a></div>\n' +
            //     '      </div>\n' +
            //     '    </div>';

            let markers = [];
            let windows = [];
            let that = this;
            let pointMarker = [];

            if (this.RepairedCovers.length === 0)
                pointMarker = this.UnRepairedCovers.concat();
            else if (this.UnRepairedCovers.length === 0)
                pointMarker = this.RepairedCovers.concat();
            else
                pointMarker = this.UnRepairedCovers.concat(this.RepairedCovers);

            console.log('get', pointMarker)
            pointMarker.forEach((item, index) => {

                markers.push({
                    position: [parseFloat(item.longitude), parseFloat(item.latitude)],
                    icon: item.isRepaired === "true" ? icon_green : icon_red, //自定义标点
                    events: {
                        click() {
                            that.windows.forEach(window => {
                                window.visible = false; //关闭窗体
                            });
                            that.window = that.windows[index];
                            that.$nextTick(() => {
                                that.window.visible = true;//点击点坐标，出现信息窗体
                            });
                        }
                    }
                })

                let date = this.timestampToDate(item.updatedAt);
                let type = item.isRepaired === 'false' ? '未维修' : '已维修';
                let predictedUrl = item.predictedUrl;
                let location = item.location;
                let position = '[' + item.longitude + ' , ' + item.latitude + ']';

                let webUrl = window.location.href;
                let hashIndex = webUrl.indexOf('#');
                let baseUrl = webUrl.substring(0, hashIndex !== -1 ? hashIndex + 1 : webUrl.length);
                let path = baseUrl + '/detial/' + item.id

                // 根据type的值设置不同的文字颜色
                let textColor = item.isRepaired === 'false' ? '#F56C6C' : '#67C23A';

                let content = '<div style="background: white; width: 400px; padding: 10px;">\n' +
                    '      <div style="width: 400px; height: 20px; line-height: 20px;">\n' +
                    '        <span style="display: inline-block; vertical-align: middle;"> ' + date + ' <span style="color:' + textColor + ';"> （' + type + '） </span></span>\n' +
                    '      </div>\n' +
                    '      <hr>\n' +
                    '      <div style="float: left; height: 100px; margin: 5px 10px;">\n' +
                    '        <img style="width:90px !important; height:100px !important;" src="' + predictedUrl + '">\n' +
                    '      </div>\n' +
                    '      <div style="font-size: 15px; width: 360px;">\n' +
                    '        <div>地址： ' + location + ' </div>\n' +
                    '        <div style="margin: 5px 10px;">经纬度：' + position + '</div>\n' +
                    '        <div style="margin: 5px 10px; color: #20a0ff;"><a href="'+ path +'">查看详情</a></div>\n' +
                    '      </div>\n' +
                    '    </div>';

                windows.push({
                    position: [parseFloat(item.longitude), parseFloat(item.latitude)],
                    content: content,
                    offset: [6, -40],//窗体偏移
                    visible: false//初始是否显示
                })
            })
            //添加点标注
            this.markers = markers;
            //生成弹窗
            this.windows = windows;



            AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
                var poiPicker = new PoiPicker({
                    input: 'search',
                    placeSearchOptions: {
                        map: map,
                        pageSize: 10
                    },
                    suggestContainer: 'searchTip',
                    searchResultsContainer: 'searchTip'
                })
                vm.poiPicker = poiPicker

                // 监听poi选中信息
                poiPicker.on('poiPicked', function (poiResult) {
                    console.log(poiResult)
                    let source = poiResult.source
                    let poi = poiResult.item
                    if (source !== 'search') {
                        poiPicker.searchByKeyword(poi.name)
                    } else {
                        poiPicker.clearSearchResults()
                        vm.markers = []
                        let lng = poi.location.lng
                        let lat = poi.location.lat
                        let address = poi.cityname + poi.adname + poi.name
                        vm.center = [lng, lat]
                        // vm.markers.push([lng, lat])
                        // vm.markers[0] = [lng, lat];
                        vm.lng = lng
                        vm.lat = lat
                        vm.address = address
                        vm.searchKey = address
                        vm.$emit("updateLocation", lng, lat, vm.searchKey);
                    }
                })
            })
        },
        timestampToDate(timestamp) {
            let date = new Date(timestamp);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份从0开始，需要加1
            let day = date.getDate();

            return `${year}年${month}月${day}日`;
        },
        handleLinkClick() {

            return false;
        },
        searchByHand() {
            if (this.searchKey !== '') {
                this.poiPicker.searchByKeyword(this.searchKey)
            }
        },

        getpoint() {
            // 设置 loading 变量为 true，表示请求正在进行中
            this.loading = true;

            // 使用 Promise.all() 等待两个请求都完成后执行下一步操作
            Promise.all([getRepairedCovers(), getUnRepairedCovers()])
                .then(responses => {

                    // 处理第一个请求的响应
                    const response1 = responses[0];
                    if (response1.data.status === "获取成功") {
                        this.RepairedCovers = response1.data.repairedCovers;
                    }
                    else {
                        this.$message({
                            message: "已井盖信息获取失败,请稍后重试！",
                            type: 'warning',
                            center: true,
                        });
                    }

                    // 处理第二个请求的响应
                    const response2 = responses[1];
                    if (response2.data.status === "获取成功") {
                        this.UnRepairedCovers = response2.data.unrepairedCovers;
                    } else {
                        this.$message({
                            message: "未井盖信息获取失败,请稍后重试！",
                            type: 'warning',
                            center: true,
                        });
                    }

                    // 当所有请求都完成时，将 loading 变量设置为 true
                    this.loading = false;
                    this.window.lazyAMapApiLoaderInstance.load().then(() => {
                        // self.getpoint()
                        this.initSearch()
                    })
                })
                .catch(error => {
                    // 处理任何可能的错误
                    console.error('Error fetching data:', error);
                    // 如果出现错误，也将 loading 变量设置为 false
                    this.loading = false;
                });
        }



    },
    created() {
        this.getpoint()


    },
    mounted() {
        // console.log('big',this.amap_id)

        // this.initSearch();

    }
}
</script>

<style lang="css" scoped>
* {
    margin: 0px;
    padding: 0px;
}

.container {
    /* 父容器如果设置了固定大小那么el-map的大小就不能跟随变化了 */
    width: 100%;
    height: 100%;
    position: relative;
    /* left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0); */
    border: 1px solid #999;
}

.amap-box {
    /* width: 700px ;
    height: 600px;
    min-height: 500px; */
    height: 100%;
    width: 100%;
}

.search-box {

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: absolute;
    z-index: 5;
    width: 65%;
    left: 13%;
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

:deep(.amap-info-outer) {
    /* 高德地图本身的组件样式 */
    border: 2px solid #ccc !important;
    border-radius: 20px !important;
}



</style>