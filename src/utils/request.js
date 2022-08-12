/* 请求模块 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// JSON.parse() 
// JSON.stringify()

// JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
// JSONBig.parse() // 把 JSON 格式的字符串转成 JavaScript 对象
// JSONBig.stringify() // 把 JavaScript 对象转成 JSON 格式的字符串

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  
  // 自定义后端返回的原始数据
  // data：后端返回的原始数据，也就是 JSON 格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }

    // axios 默认会在内部这样处理返回的数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // config ： 本次请求的请求配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 注意：这里务必要返回config对象，否则请求就停在这里出不去了
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default request
