/*
 * @Author: ShawnPhang
 * @Date: 2023-09-30 21:58:50
 * @Description: 网页抓取
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-31 09:35:25
 */
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

if (!process.argv[2]) {
  console.error('--> Banner 未命名, 请正确运行命令, 例如: npm run grab xxx')
  return
}
console.log('正在下载资源中...');

let saveFolder = "";
const today = new Date();
const year = today.getFullYear();
const month = ("0" + (today.getMonth() + 1)).slice(-2); // 月份从 0 开始计数，所以需要加 1，并且保证两位数格式
const day = ("0" + today.getDate()).slice(-2); // 保证两位数格式
const date = year + "-" + month + "-" + day

const folderPath = "./assets/" + date;
if (fs.existsSync(folderPath)) {
  // 如果文件夹存在，则清空文件夹
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.unlinkSync(filePath); // 删除文件
  });
} else {
  // 如果文件夹不存在，则创建文件夹
  fs.mkdirSync(folderPath, { recursive: true });
}
saveFolder = folderPath;

const data = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1650,
    height: 800
  })

  try {
    await page.goto("https://www.bilibili.com/", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".animated-banner");

    await sleep(3000);

    // 获取所有 ".layer" 元素
    let layerElements = await page.$$(".animated-banner .layer");
    // 获取并下载保存数据
    for (let i = 0; i < layerElements.length; i++) {
      const layerFirstChild = await page.evaluate(async (el) => {
        const pattern = /translate\(([-.\d]+px), ([-.\d]+px)\)/;
        const { width, height, src, style, tagName } = el.firstElementChild;
        const matches = style.transform.match(pattern);
        const transform = [1,0,0,1,...matches.slice(1).map(x => +x.replace('px', ''))]
        return { tagName: tagName.toLowerCase(), opacity: [style.opacity,style.opacity], transform, width, height, src, a: 0.01 };
      }, layerElements[i]);
    //   data.push(layerFirstChild);
      await download(layerFirstChild) // 下载并保存数据
    }
    // 完成后自动偏移banner
    let element = await page.$('.animated-banner')
    let { x, y } = await element.boundingBox()
    await page.mouse.move(x + 0, y + 50)
    await page.mouse.move(x + 1000, y, { steps: 1 })
    await sleep(1200);
    // 偏移后计算每个图层的相对位置，并得出加速度a
    layerElements = await page.$$(".animated-banner .layer"); // 重新获取
    for (let i = 0; i < layerElements.length; i++) {
      const skew = await page.evaluate(async (el) => {
        const pattern = /translate\(([-.\d]+px), ([-.\d]+px)\)/;
        const matches = el.firstElementChild.style.transform.match(pattern);
        return matches.slice(1).map(x => +x.replace('px', ''))[0]
      }, layerElements[i]);
      data[i].a = (skew - data[i].transform[4]) / 1000
    }
  
  } catch (error) {
    console.error("Error:", error);
  }

  async function download(item) {
    const fileArr = item.src.split("/");
    const filePath = `${saveFolder}/${fileArr[fileArr.length - 1]}`;

    const content = await page.evaluate(async (url) => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return { buffer: Array.from(new Uint8Array(buffer)) };
    }, item.src);
    //   const base64Data = Buffer.from(blobContent).toString('base64');
    //   fs.writeFileSync(filePath, base64Data, 'base64');
    const fileData = Buffer.from(content.buffer);
    fs.writeFileSync(filePath, fileData);
    data.push({ ...item, ...{ src: filePath } });
  }

  fs.writeFileSync(path.resolve(__dirname, `${saveFolder}/data.json`), JSON.stringify(data, null, 2));
  
  console.log('正在写入本地文件...');

  await sleep(300)

  // 编写 config

  let codes = fs.readFileSync("config.js", "utf8");

  const newConfig = `{
    name: "${process.argv[2]}",
    data: await banner_${date.replaceAll('-','')}.json()
},`;
  const newImport = `const banner_${date.replaceAll('-','')} = await fetch('./assets/${date}/data.json?r='+Math.random())`

  // 循环拆解每一行
  const codeCollector = [];
  for (const iterator of codes.split("\n")) {
    codeCollector.push(iterator);
    if (iterator.indexOf("-- ADD NEW --") !== -1) {
      codeCollector.push(newConfig);
    } else if (iterator.indexOf("-- IMPORT --") !== -1) {
      codeCollector.push(newImport);
    }
  }
  // 写入新文件
  fs.writeFileSync('config.js', codeCollector.join("\n"))

  await sleep(300)
  await browser.close();
  console.log('运行 npm run serve 查看效果吧！');
})();

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}
