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
            <div class="form-title" >
              <span class="el-icon-picture" style="text-align: center; color: blue; font-size: 35px;"></span>
              &nbsp;&nbsp;照片信息
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
              <span>所属公司：{{ this.type_list[selectedIndex].class_name == 'lose' ? '中国移动' : results[selectedIndex] }}</span>
              <span>损坏类型：{{ this.predictionMap[this.type_list[selectedIndex].class_name] }}</span>
              <span>准确度：{{ this.type_list[selectedIndex].confidence.toFixed(3) }}</span>
            </div>
          </label>
          <div class="submitbtn-box">
            <button class="submit-btn" @click.prevent.stop="submitRecord">添加记录</button>
          </div>


        </div>

        <div class="photo-list">
          <el-carousel :autoplay="false" height="130px" trigger="click" >
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

          <el-progress :text-inside="true" :percentage="percentage" :color="customColorMethod" :stroke-width="18" v-show="percentage !== 0"></el-progress>
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
        userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',
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
    // console.log(this.token);
  },
  methods: {
    uploadSEE() {
      this.percentage = 0;
		// 初始化 SSE
		const eventSource = new EventSource(`http://10.33.73.141:5000/progress`);
		eventSource.addEventListener("open", function (event) {
		  console.log("SEE================>Connection opened.");
		});
		eventSource.addEventListener("message", (event) => {
		  const data = JSON.parse(event.data);
		  console.log("In AboutView.vue data::: ", data);
  
		  this.percentage = data.progress;
      console.log(data.progress)
		  console.log(data.status);
      this.progress = data.status 
		  if (data.progress === 100) {
        this.progress = "图片处理完毕！"
			eventSource.close();
		  }
		});
  
		// 上传文件
    console.log("SEE upload==========================>")
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
        // this.percentage = 5
        this.ocrAll()
        this.uploadSEE()
        //this.uploadPhotos()
      }
    },
    async ocrAll() {
      this.results = [];
      for (let file of this.imgFile_list) {
        try {
          const base64Image = await this.getBase64(file);
          const ocrResult = await this.sendToOCR(base64Image.split(',')[1]); // 移除前缀
          // console.log(ocrResult);
          this.results.push(this.processOCRResult(ocrResult));
          console.log(this.results)
        } catch (error) {
          console.error('Error:', error);
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
      const data = new  FormData();
      data.append('image', base64Image);
      data.append('detect_direction', 'false');
      data.append('paragraph', 'false');
      data.append('probability', 'false');

      try {
        const response = await axiosInstance.post(url, data);
        console.log(response.data);
        let result = response.data.words_result.map(word => word.words).join('\n');
        // console.log(result)
        return result
      } catch (error) {
        console.error('Error:', error);
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

    uploadPhotos() {
      const loadingInstance = this.$loading({ target: document.querySelector("#loading_dom") })
      this.loading = true;

      let formData = new FormData();
      const files = this.imgFile_list;

      Array.from(files).forEach((file) => {
        formData.append("file", file);
      })

      try {
        UploadMoreImages(formData)
          .then((response) => {
            console.log(response.data);
            if (response.data.info == "success") {
              let dataBase = response.data.dataBase;
              let multiDetections = response.data.multiDetections;
              dataBase.forEach(item => {
                this.img_list.push(item.predictedUrl);
                this.originalImg_list.push(item.url);
              });
              multiDetections.forEach(item => {
                //如果这里是多个不同类别的损害出现在一张图的话，其实只会返回第一个类别
                this.type_list.push(item[0]);
              })
              console.log(this.type_list)
              this.imageUrl = this.img_list[0];
              this.resetImg_List()

              loadingInstance.close();
              this.$notify({
                title: '提示',
                message: '图片分析完毕！',
                type: 'success',
                showClose: false,
              });

            } else {
              loadingInstance.close();
              this.$notify({
                title: '提示',
                message: '图片分析失败，请稍后重试！',
                type: 'error',
                showClose: false,
              });

            }
          })
      } catch (error) {
        console.log(error)
      } finally {

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
      this.imageUrl = this.imgShow[index1][index2];
      this.$refs.imglist[this.selectedIndex].classList.remove('img-selected')
      this.selectedIndex = index1 * 4 + index2;
      this.$refs.imglist[this.selectedIndex].classList.add('img-selected')
      // console.log(this.results[this.selectedIndex])
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
          console.log(response.data)
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
      console.log(lng, lat, searchKey)


      this.record_form.location = searchKey
      this.record_form.longitude = lng;
      this.record_form.latitude = lat;
    },

  },

}
</script>

<style scoped>
* {
  font-family: "Source Han Sans K Normal", sans-serif;
}

.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;


}

.box-all {
  display: flex;
  /* position: relative; */
  width: 90%;
  height: 90%;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 1.75rem;
  /* box-shadow: 2px 2px 4px #d1d9e6, -2px -2px 4px #d1d9e6; */
  box-shadow: 0 0 30px #0a113612;

}

.box-left {
  width: 40%;
  height: 90%;
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  /* background-color: #ecf0f3; */
  /* border-radius: .9rem; */
}

.box-show {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 70%;
}



.box-right {
  /* margin-left: 70px;
    width: 650px;
    height: 100%;
    background-color: #ffffff; */
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;

  /* background-color: #ecf0f3; */
  /* border-radius: .9rem; */
}

.card {
  display: flex;
  position: relative;
  width: 100%;
  height: 60%;
  gap: 20px;
  align-self: center;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 1.5rem;
  /* background: #ffffff;
  box-shadow: 0 0 30px #0a113612; */
  border-radius: .75rem;
  transition: border .3s cubic-bezier(.25, .46, .45, .94);
}

.form-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  font-size: 25px;
  margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  width: 100%;
}

label .label {
  width: 80%;
  text-align: left;
  margin-bottom: .5rem;
  /* font-size: 700; */
  color: #111f68;
}

input {
  width: 80%;
  height: 20px;
  padding: 0.5rem 1rem;
  font: 400 .9375rem/1.5rem;
  color: #111f68;
  background-color: #fff;
  border: .0625rem solid #d2d2d2;
  border-radius: .625rem;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  outline: none;
}

input:focus {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 1px #042aff;
  background-color: transparent;
  /* border-color: #042aff; */
}

.box-picture {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 100%;

}

.box-picture img {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: .75rem;
  max-width: 100%;
  max-height: 100%;
  min-width: 80%;
  min-height: 55%;


}

.box-picrure-upload {
  position: absolute;

}


.box-button {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 15%;
  /* background-color: #16c4f0; */

}

.box-result {
  width: 80%;
  height: 75%;
  background-color: #ffffff;
  border-radius: 6%;
  box-shadow: 2px 2px 4px #d1d9e6, -2px -2px 4px #d1d9e6;
}

.photo-list {
  width: 90%;
  height: fit-content;



  /* background-color: #111f68; */
  /* position: relative; */

}



.el-car {
  width: 100%;
  display: flex;

}

.img-box {
  width: 25%;
  height: 100px;

  position: relative;
  margin-right: 10px;
  margin-left: 10px;

}

.el-car .top-img {
  width: 100%;
  height: 120px;
  /* min-height: 120px;
  max-height: 140px; */
  cursor: pointer;
  border: 3px solid transparent;
  /* 边框的宽度和颜色 */
  border-radius: .75rem;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.top-img:hover {
  border: 3px solid #0d1ce6;
  /* 边框的宽度和颜色 */
}

.img-selected {
  border: 3px solid #0d1ce6 !important;
}

.icon-delete {

  cursor: pointer;
  position: absolute;

  /* margin-left: 85px;
		margin-top: -100px;
		color: #BFC5D1; */
  top: 5px;
  right: 5px;
  border: 1px solid rgb(107, 106, 106);
  border-radius: 50%;
  /* 设置边框为圆形 */

}

.icon-delete:hover {
  background-color: #918f8f;
}



/* .el-car img:focus {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 1px #042aff;
  background-color: transparent;
} */

input:hover {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 1px #042aff;
  background-color: transparent;
  /* border-color: #042aff; */
}

.map-container {

  width: 800px;
  height: 550px;
  margin: auto;

}

.submitbtn-box {

  position: relative;
  margin-top: 80px;
  width: 80%;
  padding: 0.5rem 1rem;
}

.submit-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 45px;
  bottom: 5%;
  width: 70%;
  background: #0b3fe9;
  border-radius: 1.875rem;

  border: 0;
  outline: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  /* background: linear-gradient(180deg, #363636 0%, #1B1B1B 50%, #000000 100%); */
  box-shadow: 0px 0px 0px 0px #FFFFFF, 0px 0px 0px 0px #000000;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.submit-btn:hover {
  box-shadow: 0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0000003a;

}

/* :deep(.el-dialog) {
  background-color: transparents !important;
  border-radius: .75rem;
} */
:deep(.el-carousel__arrow) {
  background-color: rgba(31, 45, 61, 0.6);
}

:deep(.el-dialog) {
  box-shadow: none !important;
  border-radius: .75rem;
  background-color: transparent !important;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  padding: 6px !important;
  border-radius: 50% !important;
  background-color: #646464 !important;
  font-size: 25px !important;
  color: #fff !important;
}

.photo_info {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 80%;
  
  margin-bottom: .5rem;
  color: #111f68;
}


/* :deep(.el-vue-amap-container, .el-vue-amap-container .el-vue-amap) {
  border-radius: .75rem;
} */

/* :deep(.el-vue-amap-container) {
  border-radius: .75rem;
} */
/* :deep(.el-dialog__body) {
    padding: 30px 20px;
  } */


/* .el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
} */


/* 下面代码用于调整文件上传框大小 */
/* .el-icon-upload:before {
      content: '\e7c3'   
  }
  .el-icon-upload {
      font-size: 30px;      
      margin: 4px 0 2px;   
  }
  :deep(.el-upload .el-upload-dragger) {
      width: 120%;
      height: 80%;
  
  } */
</style>

<style>
.home-container .box-all .box-right .el-dialog {
  box-shadow: none !important;
  border-radius: .75rem;
  background-color: transparent !important;
}

.home-container .box-all .box-right .el-dialog__headerbtn .el-dialog__close {
  padding: 6px !important;
  border-radius: 50% !important;
  background-color: #646464 !important;
  font-size: 25px !important;
  color: #fff !important;
}
</style>