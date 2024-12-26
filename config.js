import { barnerImagesData1, barnerImagesData2 } from "./assets/2023-08-21/data.js";
// -- IMPORT --
const banner_20241226 = await fetch('./assets/2024-12-26/data.json?r='+Math.random())
const banner_20240926 = await fetch('./assets/2024-09-26/data.json?r='+Math.random())
const banner_20240626 = await fetch('./assets/2024-06-26/data.json?r='+Math.random())
const banner_20240606 = await fetch('./assets/2024-06-06/data.json?r='+Math.random())
const banner_20240201 = await fetch('./assets/2024-02-01/data.json?r='+Math.random())
const banner_20231212 = await fetch('./assets/2023-12-12/data.json?r='+Math.random())
const banner_20231117 = await fetch('./assets/2023-11-17/data.json?r='+Math.random())
const banner_20231026 = await fetch('./assets/2023-10-26/data.json?r='+Math.random())
const banner_20231001 = await fetch('./assets/2023-10-01/data.json?r='+Math.random())

export default [
// -- ADD NEW --
{
    name: "腾云缆车 - 去滑雪",
    data: await banner_20241226.json()
},
{
    name: "魔法扫帚 - 高架桥",
    data: await banner_20240926.json()
},
{
    name: "海洋机场 - 去旅行",
    data: await banner_20240626.json()
},
{
    name: "花草丛生 - 大橘猫",
    data: await banner_20240606.json()
},
{
    name: "保留节目 - 包饺砸",
    data: await banner_20240201.json()
},
{
    name: "落雪冰上 - 北极光",
    data: await banner_20231212.json()
},
{
    name: "秋叶风筝 - 鼠鼠",
    data: await banner_20231117.json()
},
{
    name: "打工松鼠 - 猫头鹰",
    data: await banner_20231026.json()
},
{
    name: '海上明月 - 兔子',
    data: await banner_20231001.json()
},
{
    name: '大海之上 - 鳄鱼',
    data: barnerImagesData2
},
{
    name: '海洋生物 - 乌龟',
    data: barnerImagesData1
}
]