/*
 * @Author: bugdr
 * @Date: 2022-04-28 23:18:06
 * @LastEditors: bugdr
 * @LastEditTime: 2022-04-28 23:57:36
 * @FilePath: \blog-nuxt\nuxt.config.ts
 * @Description: 配置环境
 */
import { defineNuxtConfig } from 'nuxt'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    module: ["@nuxtjs/axios"],
    env: {
        baseURL: process.env.BASE_URl || "http://localhost:8080"
    },
    axios: {
        // 默认值，自动拦截失败的请求并在可能的情况下重试它们3次
        retry: false,
        // 跨域请求时是否需要使用凭证
        credentials: true
    }
})
