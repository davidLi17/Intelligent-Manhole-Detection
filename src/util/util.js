const serverURL = "http://101.126.18.51";
const serverImageURL = "http://101.126.18.51:3000";
export function processImageURL(url) {
  if (!url) {
    return "";
  }
  return url.replace(serverURL, serverImageURL);
}
// 防抖函数：多次触发事件，只执行最后一次
export function debounce(fn) {
  console.log('防抖函数被调用');
  let t = null // 定时器标识
  debugger

  return function () {
    console.log('防抖函数内部函数被触发');
    if (t) {
      console.log('清除之前的定时器');
      clearTimeout(t)
    }
    t = setTimeout(() => {
      console.log('执行传入的函数fn');
      fn.apply(this, arguments)
      // 使用箭头函数保证this指向正确，arguments能获取到外层函数的参数
    }, 1000)
  }
}

// 节流函数：规定时间内只执行一次
export function throttle(fn, delay = 200) {
  let timer = null
  console.log('节流函数被调用，延迟时间:', delay);
  debugger

  return function () {
    console.log('节流函数内部函数被触发');
    if (timer) {
      console.log('当前有任务在执行，直接返回');
      return
    }
    timer = setTimeout(() => {
      debugger
      console.log('执行节流后的函数');
      fn.apply(this, arguments)
      timer = null
    })
  }
}

// 平滑滚动动画函数
export function animation(obj, target, fn1) {
  console.log('开始执行动画，目标位置:', target);
  // 清除之前的定时器
  clearInterval(obj.timer);

  obj.timer = setInterval(function () {
    // 缓动效果的步长计算
    var step = (target - obj.scrollTop) / 10;
    step = step > 0 ? Math.ceil(step) : Math.floor(step);

    console.log('当前滚动位置:', obj.scrollTop, '步长:', step);

    if (obj.scrollTop >= target) {
      console.log('动画结束');
      clearInterval(obj.timer);
      if (fn1) {
        fn1();
      }
    } else {
      obj.scrollTop = obj.scrollTop + step;
    }
  }, 10);
}

// 判断上传文件类型是否为图片
export function judgeFileType(file) {
  console.log('检查文件类型:', file);

  if (file == null || file == "") {
    console.log('文件为空');
    alert("请选择要上传的图片!");
    return false;
  }

  if (file.lastIndexOf('.') == -1) {
    console.log('文件没有扩展名');
    alert("路径不正确!");
    return false;
  }

  var AllImgExt = ".jpg|.jpeg|.gif|.bmp|.png|";
  var extName = file.substring(file.lastIndexOf(".")).toLowerCase();
  console.log('文件扩展名:', extName);

  if (AllImgExt.indexOf(extName + "|") == -1) {
    var ErrMsg = "该文件类型不允许上传。请上传 " + AllImgExt + " 类型的文件，当前文件类型为" + extName;
    console.log('文件类型错误:', ErrMsg);
    alert(ErrMsg);
    return false;
  }
}

// 返回文件类型映射对象
export function fileType() {
  console.log('获取文件类型映射');
  return {
    'application/msword': 'word',
    'application/pdf': 'pdf',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.ms-excel': 'excel',
    'aplication/zip': 'zpi',
  }
}