const body = document.getElementById("app");
const lerp = (start, end, amt) => (1 - amt) * start + amt * end; // 计算线性插值

import barnersData from './config.js'
let allImagesData = barnersData[0].data

let compensate = 0; // 视窗补偿值
let layers = []; // DOM集合

document.getElementById("selectBox").addEventListener("click", (e) => {
  const setData = barnersData[+e.target.id];
  if (!setData) return;
  allImagesData = setData.data;
  body.innerHTML = "";
  layers = [];
  initItems();
});

// 添加图片元素
function initItems() {
  compensate = window.innerWidth > 1650 ? window.innerWidth / 1650 : 1;
  if (layers.length <= 0) {
    const cloneData = JSON.parse(JSON.stringify(allImagesData))
    body.style.display = "none";
    for (let i = 0; i < cloneData.length; i++) {
      const item = cloneData[i];
      const layer = document.createElement("div");
      layer.classList.add("layer");
      if (compensate !== 1) {
        item.transform[4]= item.transform[4]*compensate
        item.transform[5]= item.transform[5]*compensate
      }
      layer.style = "transform:" + new DOMMatrix(item.transform);
      item.opacity && (layer.style.opacity = item.opacity[0]);
      const child = document.createElement(item.tagName || 'img');
      if (item.tagName === 'video') {
        child.loop=true; child.autoplay=true; child.muted=true;
      }
      child.src = item.src;
      child.style.filter = `blur(${item.blur}px)`;
      child.style.width = `${item.width * compensate}px`;
      child.style.height = `${item.height * compensate}px`;
      layer.appendChild(child);
      body.appendChild(layer);
    }
    body.style.display = "";
    layers = document.querySelectorAll(".layer");
  } else {
    // 窗口大小变动时重新计算内容
    const cloneData = JSON.parse(JSON.stringify(allImagesData))
    for (let i = 0; i < layers.length; i++) {
      const item = cloneData[i];
      layers[i].firstElementChild.style.width = `${
        item.width * compensate
      }px`;
      layers[i].firstElementChild.style.height = `${
        item.height * compensate
      }px`;
      item.transform[4]= item.transform[4]*compensate
      item.transform[5]= item.transform[5]*compensate
      layers[i].style.transform = new DOMMatrix(item.transform)
    }
  }
}
initItems();

let initX = 0;
let moveX = 0;
let startTime = 0;
const duration = 300; // 动画持续时间（毫秒）
function mouseMove() {
  // 滑动操作
  animate();
}
function leave() {
  startTime = 0;
  requestAnimationFrame(homing); // 开始动画
}
function homing(timestamp) {
  !startTime && (startTime = timestamp);
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / duration, 1);
  animate(progress); // 传递动画进度
  progress < 1 && requestAnimationFrame(homing); // 继续下一帧
}
// 动画执行
function animate(progress) {
  if (layers.length <= 0) return;
  const isHoming = typeof progress === "number";
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const item = allImagesData[i];
    let m = new DOMMatrix(item.transform);
    let move = moveX * item.a; // 移动X translateX
    let s = item.f ? item.f * moveX + 1 : 1; // 放大比例 Scale
    let g = moveX * (item.g || 0); // 移动Y translateY
    if (isHoming) {
      // 回正时处理
      m.e = lerp(
        moveX * item.a + item.transform[4],
        item.transform[4],
        progress
      );
      move = 0;
      s = lerp(item.f ? item.f * moveX + 1 : 1, 1, progress);
      g = lerp(item.g ? item.g * moveX : 0, 0, progress);
    }
    m = m.multiply(new DOMMatrix([m.a * s, m.b, m.c, m.d * s, move, g]));
    if (item.deg) {
      // 有旋转角度
      const deg = isHoming
        ? lerp(item.deg * moveX, 0, progress)
        : item.deg * moveX;
      m = m.multiply(
        new DOMMatrix([
          Math.cos(deg),
          Math.sin(deg),
          -Math.sin(deg),
          Math.cos(deg),
          0,
          0,
        ])
      );
    }
    if (item.opacity) {
      // 有透明度变化
      layer.style.opacity =
        isHoming && moveX > 0
          ? lerp(item.opacity[1], item.opacity[0], progress)
          : lerp(
              item.opacity[0],
              item.opacity[1],
              (moveX / window.innerWidth) * 2
            );
    }
    layer.style.transform = m; // 应用所有变换效果
  }
}
// 鼠标滑入与滑动
body.addEventListener("mouseenter", (e) => {
  initX = e.pageX;
});
body.addEventListener("mousemove", (e) => {
  moveX = e.pageX - initX;
  requestAnimationFrame(mouseMove);
});
// 鼠标已经离开了视窗或者切出浏览器，执行回正动画
body.addEventListener("mouseleave", leave);
// document.addEventListener("mouseleave", leave)
window.onblur = leave;
// 添加窗口大小监听
window.addEventListener("resize", initItems);