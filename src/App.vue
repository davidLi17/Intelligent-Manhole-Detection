<template>
  <div id="app">
    <div class="header" >
        <el-menu
        v-if="!this.$route.meta.showIf"
        id="emenu"
        :router="true"
        collapse
          class="el-menu-vertical-demo custom-menu">
          <el-menu-item id="first">
           <img src="./assets/maintenance.png" alt="" class="top_logo">
           
          </el-menu-item>
          <el-menu-item index="/upload" class="eitem">
            <i class="el-icon-folder-add"></i>
            <span slot="title">检查</span>
          </el-menu-item>
          <el-menu-item index="/records" class="eitem">
            <i class="el-icon-folder-opened"></i>
            <span slot="title">记录</span>
          </el-menu-item>
          <el-menu-item index="/Amap"  class="eitem">
            <i class="el-icon-map-location"></i>
            <span slot="title">地图</span>
          </el-menu-item>
          <el-menu-item index="/trends" class="eitem">
            <i class="el-icon-s-marketing"></i>
            <span slot="title">统计</span>
          </el-menu-item>
          <el-menu-item index="/support" class="eitem">
            <i class="el-icon-chat-line-round"></i>
            <span slot="title">智能对话</span>
          </el-menu-item>
          <el-dropdown trigger="click" placement="right" class="users">
            <span class="el-dropdown-link">
              <div class="own-pic">
                <HeadPortrait :imgUrl="imgUrl"></HeadPortrait>
            </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="ifManagements">
                <router-link
                  to="/allocation"
                  
                >
                  <span style="background-color: rgb(255, 255, 255)"
                    >维修工单分配</span
                  >
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  type="text"
                  icon="el-icon-switch-button"
                  size="medium"
                  style="color: black"
                  @click="loginOut"
                >
                  <span>退出</span>
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
    <router-view/>
  </div>
  </div>
</template>

<script>
import HeadPortrait from "./components/HeadPortrait.vue";
import { mapGetters } from 'vuex';
import { reToken, LoginOut } from './api/login.js';

//import "../public/font/NotoSansHK.css";

  export default {
    components: {
    HeadPortrait,
  },
    data() {
      return {
        activeIndex: '1',
        ifManagement:false,
        imgUrl: require('./assets/img/head_portrait.jpg')
      };
    },
    computed: {
    ...mapGetters(['getId']),
    ifManagements() {
      console.log("app.vue",this.getId);
      if(this.getId == 'admin') 
      return true;
    else return false;
    }
  },
    mounted(){
      
      
    },
    methods: {
      
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      loginOut() {
        this.$router.push('/')
        localStorage.setItem('token', "");
          localStorage.setItem('userId', '');
          
      }
    },
    created() {
      console.log("app.vue",this.getId);
      if(this.getId == 'admin') this.ifManagement = true
      console.log(this.$route.meta.showIf);
    //   setInterval(() => {
    //     console.log("定时器触发");
    //   reToken()
    //   .then((res) =>{
    //     var token = "Bears " + res.data.access_token;
    //     localStorage.setItem('token', token);
    //   })
    // }, 15 * 60 * 1000); // 15分钟对应的毫秒数

    }
  }
</script>
<style>
@font-face {
  font-family: 'Oxygen';
  src: url("../public/font/Oxygen-Light.ttf");
}
body {
  font-family: Oxygen, Arial, sans-serif;
}
</style>
<style lang="scss">
@import url("../public/font/NotoSansHK.css");
.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  font-size: 25px;
  vertical-align: middle;
  color: rgb(117,120,137);
  transition: .3s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  padding: 0;
  margin: 0;
}
body {
  box-sizing: border-box;
}
</style>
<style scoped>
a{
  text-decoration: none;
  color: black;
}

.header{
  height:100%;
  display: flex;
  overflow: hidden;
  
}

.top_logo{
  width: 100%;
  height: 30px;
  
}
.custom-menu .el-menu-item.is-active,
.custom-menu .el-submenu.is-active > .el-submenu__title {
  background-color: #0e1f65; /* 设置选中的背景颜色 */
  color: #ffffff; /* 设置选中的文本颜色 */
}

.icons{
  margin-top: 20px;
}
#emenu{
  width: 73px;
  height: 100%;

}
.users{
  margin-top: 300px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
.el-dropdown-link{
  display: flex;
}
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}
nav a.router-link-exact-active {
  color: #42b983;
}

.buts{
  background-color: #36a997;
}
.own-pic {
  width: 80%;
  height: 33px;
}
</style>
