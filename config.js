/*
 * @Author: ShawnPhang
 * @Date: 2023-10-01 15:52:04
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-01 22:59:52
 */
import { barnerImagesData1, barnerImagesData2 } from "./assets/2023-08-21/data.js";

const banner_20231001 = await fetch('./assets/2023-10-01/data.json?r='+Math.random())

export default [
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