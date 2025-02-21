<template>
  <div class="outer" id="particles-container">
    <canvas id="particles-canvas"></canvas>
    <div class="left">

      <div class="title"><div class="words">道路隐患检测管理系统</div></div>
      <div class="word">
        <h3>道路隐患识别系统</h3>
        &nbsp;&nbsp;&nbsp;&nbsp;欢迎访问我们的智能道路监测系统！本平台采用最新的人工智能技术，专注于提升城市道路的安全管理。<br>我们的系统支持多角色用户操作，确保您能够实时监控道路状态，快速响应各类隐患。加入我们，一起<br>构建更安全、更智能的城市环境！
        <div class="imgs"><div class="simg img1"></div>
        <div class="simg img2"> </div>
        <div class="simg img3"></div>
        </div>
      </div>

    </div>
    <div class="right">
      <Logincard class="card"></Logincard>
    </div>

  </div>
</template>
<script>
import Logincard from "../components/LoginCard.vue";
import Logo from "../components/Logo.vue";
export default {
  name: 'Login',
  components: {
    Logincard,
    Logo
  },
  data() {
    return {
    }
  },
  created() {
    localStorage.clear();
  },
  mounted() {
    const container = document.getElementById('particles-container');
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    // 设置 canvas 的宽度和高度为窗口的宽度和高度
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 定义粒子对象
    class Particle {
      constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.speedX = -this.speedX;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.speedY = -this.speedY;
        }

        this.draw();
      }
    }

    // 创建粒子数组
    const particles = [];

    // 初始化粒子
    function init() {
      for (let i = 0; i < 75; i++) {
        const radius = Math.random() * 1.8 + 1;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const speedX = (Math.random() - 0.5) * 1.5;
        const speedY = (Math.random() - 0.5) * 1.5;
        const color = '#dcdfe6';

        particles.push(new Particle(x, y, radius, color, speedX, speedY));
      }
    }

    // 动画循环
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
    }

    // 初始化粒子并开始动画
    init();
    animate();
  }
}
</script>
<style type="text/css">
.st0 {
  fill: #95C122;
}

.st1 {
  fill: #0E84C7;
}
</style>
<style scoped>
img {
  /*width: 370px;*/
  margin-left: 70px;
  transform: scale(0.9);
  height: 29vh;
}
.title{
  /*width: 370px;*/
  margin-left: 10px;
  display: flex;
  height: 29vh;
  justify-content: center;
  align-items: center;
}
.words{
font-weight: 900;
font-size: 55px;
letter-spacing: 2px;

}
.right {
  z-index: 1;
  margin-right: 11%;
  white-space: nowrap;
}

.left {
  margin-top: 3vh;
  width: 50%;
  z-index: 1;
}

.outer {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  white-space: nowrap;

}

#particles-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.card {
  opacity: .85;
  margin-top: 8vh;
  box-shadow: 2px 1px 11px 6px #dcdfe6;
  width: 460px;
  border-radius: 20px;
  text-align: center;
}

.word {
  height: 48%;
  width: 42%;
  margin-left: 13.8%;
  font-size: medium;
  letter-spacing: 0.0125rem;
  box-sizing: border-box;
}
.imgs{
  width: 80vh;
  height: 36vh;
  margin-top: 4.8vh;
  display: flex;
  justify-content: space-between;
 
}
.simg{
  border-radius: 0.25rem;
  width: 32.3%;
  height: 100%;
}
.img1{
  background-image: url(../assets/a.png);
  
  transform: scaleY(0.78);
  background-size: 100% 100%;
}
.img2{
  background-image: url(../assets/a.png);
  

  transform: scaleY(0.78);
  background-size: 100% 100%;
}
.img3{
  background-image: url(../assets/a.png);

transform: scaleY(0.78);
  background-size: 100% 100%;
}
</style>