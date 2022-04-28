/*
 * @Author: bugdr
 * @Date: 2022-04-29 00:04:52
 * @LastEditors: bugdr
 * @LastEditTime: 2022-04-29 00:09:16
 * @FilePath: \blog-nuxt\plugins\request.ts
 * @Description: 添加nuxt/axios配置
 */
const BASE_URl = ""
export default function ({ app, $axios, redirect }) {
    const service = $axios.create({
        baseURL: BASE_URl,
        timeout: 10 * 60000,
        headers: {
            'Content-Type': "application/json",
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    // TODO:配置axios
    // service.intercept
}