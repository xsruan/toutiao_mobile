<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      error: false,
      loading: false,
      finished: false,
      page: 1, // 页数
      per_page: 20 // 每页数量
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })

        // // 模拟程序随机报错
        // if (Math.random() > 0.5) {
        //   // 若字符串不是标准的JSON格式，程序报错
        //   JSON.parse('dsadjsauid')
        // }

        // 2. 将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)

        // 3. 将本次加载中的 loading 关闭
        this.loading = false

        // 4. 判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
</style>
