<template>
  <div class="outer">
    <div class="top">
      <Return class="rbut"></Return>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="image__preview">
          <el-image style="height:82%;width:80%" :src="url" :preview-src-list="detials">
          </el-image>
        </div>
      </div>
      <div class="right">
        <div class="content">时间：{{ arrayList.updatedAt }}</div>
        <div class="content">地点：{{ arrayList.location }}</div>
        <div class="content">检修人员：{{ arrayList.repairer }}</div>
        <div class="content">维修状态：{{ arrayList.damageType }}</div>
        <div class="content">备注：
          <!-- <div  v-html="arrayList.info.replace(/\n/g, '<br>')" ></div> -->


        </div>
        <div class="contents" style="margin-top:5vh">
          <el-card class="box-card" body-style="height:60%">
            <div slot="header" class="clearfix">
              <span>维修日志</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="Torepairer"
                :disabled="!isWorker">维修完毕</el-button>
              
              <el-button style="float: right; padding: 3px 0" type="text" @click="addNewLog"
                :disabled="!isWorker">提交日志</el-button>
            </div>
            <textarea class="text" v-model="info" :placeholder=pl :disabled="!isWorker">

          </textarea>
          </el-card>
          <div class="timeline">
            <el-timeline>
              <el-timeline-item v-for="(item, index) in logs" :timestamp="formatDate(item.createdAt)" placement="top">
                <el-card>
                  <h4>{{ item.description }}</h4>
                  <!-- <p>提交于 2018/4/12 20:46</p> -->
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
import { getHistoryById, upDate } from '../api/history.js';
import { getLogByHistoryId,addLog } from '../api/log.js';

export default {
  name: "Detial",
  components: {
    Return,
  },
  data() {
    return {
      url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      arrayList: {},
      detials: [],
      info: '',
      repairer: {},
      isWorker:true,
      pl:'',
      infos:'',
      active: 0,
      logs: [],
    }
  },
  methods: {
    addNewLog() {
      addLog(this.info, this.$route.params.id)
        .then((res) => {
          getLogByHistoryId(this.$route.params.id)
            .then((res) => {

              this.logs = res.data
              this.$message({
                type: 'success',
                message: "数据更新成功"
              })
            })
        })

    },
    Torepairer() {
      console.log(111);
      if(this.info) {
        this.infos = this.arrayList.info
        this.infos += '\n';
        this.infos+=this.info;}
        console.log(this.infos);
      var timestamp = Date.now();
      timestamp = new Date(timestamp).toISOString();
      this.repairer = {
        repairer: this.arrayList.repairer,
        updatedAt: timestamp,
        damageType: "已维修",
        location: this.arrayList.location,
        info: this.infos,
        isRepaired: "true"
      }
      console.log(JSON.stringify(this.repairer));
      upDate(this.$route.params.id, this.repairer)
        .then((res) => {
          console.log(res);
          this.$message({
            type: 'success',
            message: "数据更新成功"
          })
          this.info = ''
          getHistoryById(this.$route.params.id)
      .then((res) => {
        this.arrayList = res.data.History;
        var timestamp = this.arrayList.updatedAt;
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // 月份从0开始，需要加1
        var day = date.getDate();
        this.arrayList.updatedAt = year + "-" + month + "-" + day;; // 更改每个对象的时间戳字段
        console.log(this.arrayList);
        this.url = this.arrayList.url;
        this.detials.push(this.arrayList.url);
        this.detials.push(this.arrayList.predictedUrl);
      })
        })

    },
    formatDate(isoTimestamp) {
      
      const date = new Date(isoTimestamp);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1并补零
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      const formattedDateTime = `${formattedDate} ${formattedTime}`;

      return formattedDate
    },
  },
  created() {
    if(this.getId === 'checker') {
      this.isWorker = false;
      this.pl = "只有工作人员可更改"
    }
    else this.pl = "在此处输入日志"

    getLogByHistoryId(this.$route.params.id)
      .then((res) =>{
        // console.log(res.data)
        this.logs = res.data
      })

    console.log(this.$route.params.id);
    getHistoryById(this.$route.params.id)
      .then((res) => {
        this.arrayList = res.data.History;
        var timestamp = this.arrayList.updatedAt;
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // 月份从0开始，需要加1
        var day = date.getDate();
        this.arrayList.updatedAt = year + "-" + month + "-" + day;; // 更改每个对象的时间戳字段
        console.log(this.arrayList);
        this.url = this.arrayList.url;
        this.detials.push(this.arrayList.url);
        this.detials.push(this.arrayList.predictedUrl);
      })
  }
}
</script>

<style scoped>
.bottom {
  display: flex;
  justify-content: center;

}

.tip {
  text-indent: 2em;
}

.image__preview {
  width: 100%;
  height: 100%;
}

.content {
  padding: 0.6%;

}

.outer {
  width: 100%;
  height: 100%;
}
.progress{
  margin-top: 53px;
}
.right {
  width: 58%;
  height: 85%;
  display: flex;
  align-items: start;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  margin-left: 2%;
}

.top {
  display: flex;
  margin: 2vh;
  height: 8vh;
}


.rbut {
  width: 88px;
  height: 50px;
}

.left {
  padding-left: 5%;
  width: 58%;
  height: 98vh;

  box-sizing: border-box;

}

.text {
  font-size: 15px;
  letter-spacing: 0.12em;
  height: 100%;
  width: 100%;
}

.contents {
  padding: 1%;
  width: 75%;
  height: 15vh;
}

textarea {
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
}


.box-card {
  width: 100%;
  height: 100%;
}

.timeline {
  position: relative;
  margin-top: 20px;
  height: 350px;
  overflow: auto;
}
</style>