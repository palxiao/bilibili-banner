# bilibili-banner

[查看在线演示](https://palxiao.github.io/bilibili-banner/)

| 复刻效果展示 | 动态效果演示 |
| --- | --- |
| ![](./demo/01.png) | ![](./demo/02.gif) |

## 仿B站首页动态头图

- 原生 JavaScript 实现，无第三方依赖
- 自动抓取最新效果图，可快速复刻出B站首页 Banner，接近 1:1 还原效果

### 准备工作

运行 `pnpm i` 或 `yarn / npm i` 安装项目本地依赖

### 查看演示网页

1. 运行 `npm run serve`

### 获取最新效果

1. 运行 `npm run grab`，抓取B站首图数据，在 `assets` 目录下生成数据目录（以当天日期命名）
2. 在 `config.js` 中添加配置（使用 fetch 引入 json）
3. 运行 `npm run serve`

接下来需要对每个图层进行参数调试，目前支持参数如下：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| a | number | 表示加速度，数值越高移动变化越大（接受正负值） |
| deg | number | 表示旋转幅度，数值越高旋转越快（接受正负值） |
| g | number | 表示重力，数值越高上下移动变化越大（接受正负值） |
| f | number | 表示大小变化，对应 CSS transform: scale |
| opacity | array | 透明度变化，接收一个区间 |

> 注：正负值会影响变化的方向

### 技术文章

[如何用原生 JS 复刻 Bilibili 首页头图的视差交互效果](https://juejin.cn/post/7269385060611997711)
