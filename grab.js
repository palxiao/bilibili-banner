const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

let saveFolder = "";
const today = new Date();
const year = today.getFullYear();
const month = ("0" + (today.getMonth() + 1)).slice(-2); // 月份从 0 开始计数，所以需要加 1，并且保证两位数格式
const day = ("0" + today.getDate()).slice(-2); // 保证两位数格式

const folderPath = "./assets/" + year + "-" + month + "-" + day;
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

  try {
    await page.goto("https://www.bilibili.com/", {
      waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(".animated-banner");
    await sleep(1000);

    // 获取所有 ".layer" 元素
    const layerElements = await page.$$(".animated-banner .layer");
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
  
  await sleep(500)
  await browser.close();
})();

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}
