import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs默认英语，需手动配置成中文
dayjs.locale('zh-cn') // 全局使用

// 定义一个全局过滤器，就可以在任何组件的模板中使用
// 相当于一个全局可用的方法（仅供模板使用）
// 参数1：过滤器名称
// 参数2：过滤器函数
// 使用方式： {{ 表达式 | 过滤器名称 }}
// 表达式的结果作为参数传入过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
  // console.log(value)
  return dayjs().to(dayjs(value))
})

// dayjs()获取当前最新时间
// console.log(dayjs().format('YYYY-MM-DD'))

// console.log(dayjs().from(dayjs('2022-01-01'))) // 31 年后
