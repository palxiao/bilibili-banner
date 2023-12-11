import { barnerImagesData1, barnerImagesData2 } from "./assets/2023-08-21/data.js";
// -- IMPORT --
const banner_20231212 = await fetch('./assets/2023-12-12/data.json?r='+Math.random())
const banner_20231117 = await fetch('./assets/2023-11-17/data.json?r='+Math.random())
const banner_20231026 = await fetch('./assets/2023-10-26/data.json?r='+Math.random())
const banner_20231001 = await fetch('./assets/2023-10-01/data.json?r='+Math.random())

export default [
// -- ADD NEW --
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