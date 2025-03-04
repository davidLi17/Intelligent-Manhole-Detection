<template>
  <div class="home-container">
    <div class="box-all">

      <div class="box-left">

        <div class="box-picture" v-if="imageUrl !== ''">
          <img :src="imageUrl"></img>
        </div>

        <div class="box-picrure-upload" v-else>
          <el-upload ref="upload" id="loading_dom" class="upload-demo" drag action=" " multiple :auto-upload="false"
            :name="uploadId" v-loading="loading" :on-change="getFile" :show-file-list="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处或<em>点击上传</em></div>
          </el-upload>
        </div>


      </div>
      <div class="box-right">
        <div class="card">
          <label>
            <div class="form-title">
              <span class="el-icon-picture" style="text-align: center; color: blue; font-size: 35px;"></span>
                照片信息
            </div>
          </label>
          <label>
            <div class="label">拍摄时间</div>
            <input id="1" v-model="record_form.title" class="input_field" type="text" name="input-time" title="拍摄时间"
              placeholder="请输入照片拍摄时间">
          </label>
          <label>
            <div class="label">拍摄地点<el-button type="text" @click="dialogVisible = true">（点击此处选择地点）</el-button></div>

            <input id="2" v-model="record_form.location" class="input_field" type="text" name="input-address"
              title="拍摄地点" placeholder="请输入照片拍摄地点">

          </label>
          <label>
            <div class="label">备注</div>
            <input id="3" v-model="record_form.info" class="input_field" type="text" name="input-info" title="备注"
              placeholder="可在此处填写备注信息">
          </label>
          <label v-if="imageUrl" class="photo_info_box">
            <div class="label">检测信息</div>
            <div class="photo_info">
              <span>所属公司：{{ this.type_list[selectedIndex].class_name == 'lose' ? '中国移动' : results[selectedIndex]
                }}</span>
              <span>损坏类型：{{ this.predictionMap[this.type_list[selectedIndex].class_name] }}</span>
              <span>准确度：{{ this.type_list[selectedIndex].confidence.toFixed(3) }}</span>
            </div>
          </label>
          <div class="submitbtn-box">
            <button class="submit-btn" @click.prevent.stop="submitRecord">添加记录</button>
          </div>


        </div>

        <div class="photo-list">
          <el-carousel :autoplay="false" height="130px" trigger="click">
            <el-carousel-item class="el-car" v-for="(list, index1) in imgShow" :key="index1">
              <template v-for="(imgbase64, index2) in list">
                <div class="img-box">
                  <img ref="imglist" :key="index2" :src="imgbase64" alt="" @click="changePhoto(index1, index2)"
                    :class="{ 'top-img': true, 'img-selected': index1 * 4 + index2 === selectedIndex }" />
                  <div class="el-icon-close icon-delete" @click="deletePhoto(index1, index2)"></div>
                </div>
              </template>
            </el-carousel-item>
          </el-carousel>

          <el-progress :text-inside="true" :percentage="percentage" :color="customColorMethod" :stroke-width="18"
            v-show="percentage !== 0"></el-progress>
          <div>{{ progress }}</div>
        </div>

      </div>

    </div>
    <el-dialog title="" :visible.sync="dialogVisible" width="900px">
      <!-- <span>当前选择位置：{{ location.lng }},{{ location.lat }}</span> -->
      <div class="map-container">
        <amap @updateLocation="getLocation" width="800" height="550"></amap>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import { Upload, UploadMoreImages } from "../api/upload.js";
  import { AddToHistory } from "../api/history.js";
  import amap from "../components/amap.vue"
  import "../../public/font/NotoSansHK.css"
  import axios from "axios";
  const serverURL = '101.126.18.51';
  export default {
    name: 'HomeView',
    components: {
      amap
    },
    computed: {

    },
    data() {
      return {
        progress: '',
        loading: false,
        uploadId: Math.random().toString(36).substr(2).toLocaleUpperCase(),
        fileTotal: 0,
        count: 0,
        imageUrl: '',
        img_index: 0,
        img_list: [], //检测图url
        originalImg_list: [], //原图url
        type_list: [], //损坏类型
        imgFile_list: [],
        imgShow: [], //轮播图展示中的图片数组
        location: {
          lng: 0,
          lat: 0,
        },
        record_form: {
          userId: sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : '',
          location: '',
          title: '', //目前用于储存拍摄日期
          info: '',
          longitude: 0,
          latitude: 0,
          url: '',
          predictedUrl: '',
          repairer: '未分配', //维修员名字
          damageType: '待维修',
          isRepaired: 'false', //后端参数类型基本全是字符串
          prediction: '',
          confidence: ''
        },
        historyId: '',
        selectedIndex: 0,
        dialogVisible: false,
        results: [],
        access_token: "24.627ce188f1833010853867e9439ed770.2592000.1719722643.282335-76776680",
        percentage: 0,
        predictionMap: {
          "good": "井盖完好",
          "broke": "井盖破损",
          "lose": "井盖丢失",
          "uncovered": "井盖未盖",
          "circle": "井圈有问题",
          "potholes": "坑洼",
          "Transverse": "横向裂缝",
          "Longitudinal": "纵向裂缝",
          "Crocodile": "鳄鱼状裂缝",
        },

      }
    },
    mounted() {
    },
    methods: {
      uploadSEE() {
        this.percentage = 0;
        // 初始化 SSE
        const eventSource = new EventSource(`http://${serverURL}:5000/progress`);
        eventSource.addEventListener("open", function (event) {
        });
        eventSource.addEventListener("message", (event) => {
          const data = JSON.parse(event.data);

          this.percentage = data.progress;
          this.progress = data.status
          if (data.progress === 100) {
            this.progress = "图片处理完毕！"
            eventSource.close();
          }
        });

        // 上传文件
        this.uploadPhotos()
      },
      customColorMethod(percentage) {
        if (percentage < 30) {
          return '#909399';
        } else if (percentage < 70) {
          return '#e6a23c';
        } else {
          return '#67c23a';
        }
      },
      increase() {
        this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
      },
      decrease() {
        this.percentage -= 10;
        if (this.percentage < 0) {
          this.percentage = 0;
        }
      },
      getFile(file, fileList) {
        // this.getBase64(file.raw).then(res => {
        //   this.img_list.push(res);
        //   this.imageUrl = this.img_list[0];
        //   this.resetImg_List()
        // });


        this.imgFile_list.push(file.raw)
        this.fileTotal = document.getElementsByName(this.uploadId)[0].files.length
        if (this.imgFile_list.length === 1) {
          this.$notify({
            title: '提示',
            message: '图片分析操作较为耗时，请耐心等待',
            type: 'warning',
            showClose: false,
          });
        }
        if (this.imgFile_list.length === this.fileTotal) {
          this.progress = "正在上传至服务器......"
          this.percentage = 5//设置进度条初始值
          // this.ocrAll()
          this.uploadSEE()
          this.uploadPhotos()
        }
      },
      async ocrAll() {
        this.results = [];
        for (let file of this.imgFile_list) {
          try {
            const base64Image = await this.getBase64(file);
            const ocrResult = await this.sendToOCR(base64Image.split(',')[1]); // 移除前缀
            this.results.push(this.processOCRResult(ocrResult));
          } catch (error) {
            this.results.push('Error: ' + (error.response ? error.response.data.error_msg : error.message));
          }
        }
      },
      async sendToOCR(base64Image) {
        const accessToken = this.access_token; // 替换为您的access_token
        const axiosInstance = axios.create({
          baseURL: 'https://aip.baidubce.com', // 重新指定baseURL
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const url = `/rest/2.0/ocr/v1/accurate_basic?access_token=${accessToken}`;
        const data = new FormData();
        data.append('image', base64Image);
        data.append('detect_direction', 'false');
        data.append('paragraph', 'false');
        data.append('probability', 'false');

        try {
          const response = await axiosInstance.post(url, data);
          let result = response.data.words_result.map(word => word.words).join('\n');
          return result
        } catch (error) {
        }
      },
      processOCRResult(ocrResult) {
        if (!ocrResult) {
          return '未知';
        }
        const keywords = ['中', '国', '移', '动'];
        for (let keyword of keywords) {
          if (ocrResult.includes(keyword)) {
            return '中国移动';
          }
        }
        return '其他公司';
      },

      async uploadPhotos() {
        const loadingInstance = this.$loading({ target: document.querySelector("#loading_dom") })
        this.loading = true;

        let formData = new FormData();
        const files = this.imgFile_list;

        Array.from(files).forEach((file) => {
          formData.append("file", file);
        })

        try {
          const response = await UploadMoreImages(formData);
          const { info, dataBase, multiDetections } = response.data;

          if (info === "success") {
            // Process image URLs
            this.img_list = dataBase.map(item => {
              const url = item.predictedUrl;
              return url.startsWith('https') ? url.replace('https', 'http') : url;
            });

            this.originalImg_list = dataBase.map(item => {
              const url = item.url;
              return url.startsWith('https') ? url.replace('https', 'http') : url;
            });

            // Process detection results
            this.type_list = multiDetections.map(item => item[0]);

            // Update UI
            this.imageUrl = this.img_list[0];
            this.resetImg_List();

            this.$notify({
              title: '提示',
              message: '图片分析完毕！',
              type: 'success',
              showClose: false,
              duration: 3000
            });
          } else {
            throw new Error('图片分析失败');
          }
        } catch (error) {
          this.$notify({
            title: '错误',
            message: '图片分析失败，请稍后重试！',
            type: 'error',
            showClose: false,
            duration: 3000
          });
        } finally {
          loadingInstance?.close();
          this.imgFile_list = [];
          this.loading = false;
        }

      },

      getBase64(file) {
        return new Promise(function (resolve, reject) {
          let reader = new FileReader();
          let imgResult = "";
          reader.readAsDataURL(file);
          reader.onload = function () {
            imgResult = reader.result;
          };
          reader.onerror = function (error) {
            reject(error);
          };
          reader.onloadend = function () {
            resolve(imgResult);
          };
        });
      },

      resetImg_List() {
        const newArray = this.img_list.reduce((result, value, index) => {
          // 如果是新组的第一个元素，则创建一个新的子数组
          if (index % 4 === 0) {
            result.push([value]);
          } else {
            // 否则，将当前值添加到当前组中
            result[result.length - 1].push(value);
          }
          return result;
        }, []);
        this.imgShow = newArray;
      },
      changePhoto(index1, index2) {
        //index1是0,index2=1
        this.imageUrl = this.imgShow[index1][index2];
        this.$refs.imglist[this.selectedIndex].classList.remove('img-selected')
        this.selectedIndex = index1 * 4 + index2;
        this.$refs.imglist[this.selectedIndex].classList.add('img-selected')
      },
      deletePhoto(index1, index2) {
        let index = index1 * 4 + index2;
        this.img_list.splice(index, 1);
        this.originalImg_list.splice(index, 1);
        this.type_list.splice(index, 1);
        if (this.img_list.length === 0) {
          this.imageUrl = '';
          this.progress = '';
          this.percentage = 0;
        }
        this.resetImg_List();
      },

      submitRecord() {
        let index = this.selectedIndex;
        this.record_form.url = this.originalImg_list[index];
        this.record_form.predictedUrl = this.img_list[index];
        this.record_form.prediction = this.type_list[index].class_name;
        this.record_form.confidence = this.type_list[index].confidence;
        AddToHistory(this.record_form)
          .then((response) => {
            if (response.data.success == "添加成功") {

              // this.historyId = response.data.history.id;
              this.$message({
                message: "添加成功！",
                type: 'success',
                center: true,
              });

            } else {
              this.$message({
                message: "添加失败！",
                type: 'warning',
                center: true,
              });

            }
          })
      },

      getLocation(lng, lat, searchKey) {
        this.record_form.location = searchKey
        this.record_form.longitude = lng;
        this.record_form.latitude = lat;
      },

    },

  }
</script>

<style scoped lang="scss">
/* 全局样式 */
* {
  font-family: "Source Han Sans K Normal", sans-serif;
  box-sizing: border-box;
}

.home-container {
  width: 100%;
  min-height: 100vh; /* 至少填满整个视口高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  padding: 20px; /* 添加内边距 */
}

.box-all {
  display: flex;
  flex-direction: column; /* 移动端默认垂直布局 */
  width: 95%;
  max-width: 1200px; /* 最大宽度 */
  background-color: #ffffff;
  border-radius: 1.75rem;
  box-shadow: 0 0 30px #0a113612;
  padding: 20px; /* 添加内边距 */
}

.box-left {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px; /* 底部间距 */
}

.box-picture {
    width: 100%; /* 调整图片容器宽度 */
    max-width: 600px;  /* 限制最大宽度 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-picture img {
    max-width: 100%;  /* 图片最大宽度为容器的100% */
    max-height: 70vh; /* 设置最大高度，例如视口高度的70% */
    border-radius: 0.75rem;
    object-fit: contain; /* 保持纵横比并适应容器 */
}

.box-picrure-upload {
  width: 100%; /* 调整上传区域宽度 */
  .upload-demo{
    display: flex;
    justify-content: center;
  }
}

:deep(.el-upload .el-upload-dragger) {
  width: 100% !important; /* 调整上传区域宽度 */
  /* height: auto !important; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* min-height: 200px; */

}

.box-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
}

.card {
  width: 100%; /* 调整卡片宽度 */
  max-width: 650px; /* 限制卡片最大宽度 */
  display: flex;
  flex-direction: column;
  gap: 10px; /* 调整间距 */
  padding: 1.5rem;
  border-radius: 0.75rem;
  transition: border 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.form-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 1.5rem; /* 调整字体大小 */
    margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.label {
    width: 100%;
    text-align: left;
    margin-bottom: 0.5rem;
    color: #111f68;
    font-size: 1rem; /* 调整字体大小 */
}

.label .el-button{
    font-size: 0.9rem;
}

input {
    width: 100%;
    height: auto;
    padding: 0.5rem 1rem;
    font-size: 1rem; /* 调整字体大小 */
    color: #111f68;
    background-color: #fff;
    border: 0.0625rem solid #d2d2d2;
    border-radius: 0.625rem;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    outline: none;
    box-sizing: border-box;
}

input:focus {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 1px #042aff;
  background-color: transparent;
}

.photo_info_box {
    margin-top: 1rem;
}

.photo_info {
    display: flex;
    flex-wrap: wrap; /* 允许换行 */
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
    color: #111f68;
    font-size: 0.9rem; /* 调整字体大小 */
}
.photo_info > span {
    width: 48%; /* 或者根据需要调整 */
    margin-bottom: 0.5rem;
}

.submitbtn-box {
  width: 100%;
  padding: 0.5rem 0; /* 调整内边距 */
  display: flex;
  justify-content: center; /*水平居中*/
}

.submit-btn {
  height: 45px;
  width: 100%; /* 调整按钮宽度 */
  max-width: 300px; /* 限制按钮最大宽度 */
  background: #0b3fe9;
  border-radius: 1.875rem;
  border: 0;
  outline: none;
  color: #ffffff;
  font-size: 1rem; /* 调整字体大小 */
  font-weight: 700;
  box-shadow: 0px 0px 0px 0px #FFFFFF, 0px 0px 0px 0px #000000;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.submit-btn:hover {
  box-shadow: 0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0000003a;
}

.photo-list {
    width: 100%;
    margin-top: 1rem;
    /* height: auto; */
    display: flex;
    flex-direction: column;
    align-items: center;

}

:deep(.el-carousel) {
    width: 100%; /* 调整轮播图宽度 */
    max-width: 600px; /* 设置最大宽度 */
}

.el-car {
  width: 100%;
  display: flex;
  flex-wrap: nowrap; /* 不换行 */
  overflow-x: auto;  /* 允许水平滚动 */
}


.img-box {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 0.5rem;
  flex-shrink: 0;
  display: inline-block;
  
  &:first-child {
    margin-left: 2.6rem;
  }
}
 .top-img {
    width: 100%; /* 调整图片大小 */
    height: 100%; /* 调整图片大小 */
    object-fit: cover; /* 保持纵横比并填充容器 */
    cursor: pointer;
    border: 3px solid transparent;
    border-radius: 0.75rem;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.top-img:hover {
  border: 3px solid #0d1ce6;
}

.img-selected {
  border: 3px solid #0d1ce6 !important;
}

.icon-delete {
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 5px;
    border: 1px solid rgb(107, 106, 106);
    border-radius: 50%;
    color: #000; /* 设置颜色为黑色 */
    background-color: rgba(255, 255, 255, 0.7); /* 设置半透明背景 */
    display: flex; /* 使用 flex 布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    width: 20px; /* 设置固定宽度 */
    height: 20px; /* 设置固定高度 */
    font-size: 14px; /* 设置合适的字体大小 */
}

.icon-delete:hover {
    background-color: #918f8f;
    color: #fff; /* 悬停时颜色 */
}
:deep(.el-progress){
    width: 100%;
    max-width: 600px;
}


.map-container {
  width: 100%; /* 调整地图宽度 */
  height: 300px; /* 调整地图高度 */
  /* margin: auto; */
}
 :deep(.el-dialog) {
    box-shadow: none !important;
    border-radius: .75rem;
     width: 90% !important; /* 调整对话框宽度 */
    max-width: 900px; /* 设置对话框最大宽度 */
    background-color: white !important;
  }

:deep(.el-dialog__headerbtn .el-dialog__close) {
  padding: 6px !important;
  border-radius: 50% !important;
  background-color: #646464 !important;
  font-size: 25px !important;
  color: #fff !important;
}
  :deep(.el-carousel__arrow) {
    background-color: rgba(31, 45, 61, 0.6);
     height: 30px; /* 设置箭头按钮的高度 */
    width: 30px; /* 设置箭头按钮的宽度 */
    display: flex; /* 使用 flex 布局 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */

  }
  /* 桌面端样式 */
@media (min-width: 768px) {
  .box-all {
    flex-direction: row; /* 桌面端水平布局 */
    height: 90%;
    padding: 40px; /* 调整内边距 */
        align-items: center;
  }


  .box-left {
    width: 50%;
    margin-bottom: 0; /* 移除底部间距 */
    margin-right: 40px;
    ::v-deep .el-upload-dragger{
      height: 50vh;
      width: 30vw !important;
    }
  }

  .box-right {
    width: 50%;
    align-items: flex-start; /* 左对齐 */
     height: 90%;
  }
    .box-picture {
        height: 80%;
    }

    .card {
    /* height: 70%; */
    }
    .photo-list{
        height: 30%;
    }
  .map-container {
    width: 100%; /* 调整地图宽度 */
     max-width: 800px;
    height: 550px; /* 调整地图高度 */
    /* margin: auto; */
  }
   :deep(.el-dialog) {
        width: 900px !important;
    }
    .photo_info > span {
        width: auto; /* 自动宽度 */
        margin-right: 1rem; /* 右边距 */
    }

    .photo-list {
        align-items: flex-start; /*左对齐*/
    }

    :deep(.el-carousel){
        height: auto !important;
    }

}
</style>