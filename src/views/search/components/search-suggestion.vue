<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
    <!-- 双花括号绑定会直接输出纯文本内容 -->
    <!-- <div>{{ htmlStr }}</div> -->

    <!-- 使用 v-html 指令可以绑定渲染带有 HTML 标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'

// 按需加载
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [], // 联想建议
      htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当searchText发生改变的时候会调用handler函数
      // 注意： handler函数是一个封装好的vue方法，名称固定
      // handler (val) {
      //   this.loadSearchSuggestions(val)
      // },
      // debounce函数
      // 参数1：一个function函数
      // 参数2：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 500),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },

    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`

      // 需要根据数据变量动态创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
            // 参数1：匹配模式字符串，根据这个字符串创建正则对象
            // 参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')

        // return text.replace(reg, highlightStr)

      if(text!=null){
        return text.replace(reg, highlightStr)
      }else{
        return ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
