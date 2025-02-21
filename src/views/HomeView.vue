<template>
  <div class="home">
    <!-- <div class="picture-upload">
      <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple list-type="text"
        auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处或<em>点击上传</em></div>
      </el-upload>
    </div>
    <AnalysisCard
      style="position: absolute; top: 40%; left: 8%; width: auto; height: auto; min-width: 200px; min-height: 200px;">
    </AnalysisCard>
    <AnalysisButton style="position: fixed; bottom: 10%; left: 45%;"></AnalysisButton>

    <div style="position: absolute; right: 10%; top:15%">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="pic_name" label="图片名称" width="180">
        </el-table-column>
        <el-table-column prop="picture" label="图片详情" width="180">
        </el-table-column>
      </el-table>
    </div> -->
  </div>
</template>

<script>
import AnalysisButton from "../components/AnalysisButton.vue";
import AnalysisCard from "../components/AnalysisCard.vue";
export default {
  name: 'HomeView',
  components: {
    AnalysisButton,
    AnalysisCard,
  }
}
</script>

<style scoped>
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
  .picture-upload {

    height: 100px;
    width: 100px;

    position: absolute;
    top: 15%;
    left: 5%;
  }
</style>