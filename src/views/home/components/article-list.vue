<template>
  <div class="article-list">
    <van-pull-refresh v-model="isRefreshLoading" :success-text="SuccessText" @refresh="onRefresh" success-duration="1500">
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false,
      isRefreshLoading: false,
      SuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  created () {
  },
  methods: {
    async onLoad () {
      try {
        // 1.异步更新数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now() // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        })

        // // 模拟程序随机报错
        // if (Math.random() > 0.5) {
        //   // 若字符串不是标准的JSON格式，程序报错
        //   JSON.parse('dsadjsauid')
        // }

        const { results } = data.data

        // 2.把请求结果放到list数组中
        // ...是数组的展开操作符，它会吧数组一个个展开
        this.list.push(...results)

        // 3.加载状态结束后吧加载状态设为结束
        this.loading = false

        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将finished设置为true，不再加载更多
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true

        // 请求出错后关闭loading
        this.loading = false
      }
    },

    // 下拉刷新的方法
    async onRefresh () {
      try {
        // 请求获取数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          timestamp: Date.now() // 下拉刷新只获取最新的时间戳
        })

        // 追加数据到列表顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 刷新成功文本提示
        this.SuccessText = `刷新成功,更新了${results.length}条数据`

        // 关闭下拉刷新的loading状态
        this.isRefreshLoading = false
      } catch (err) {
        this.isRefreshLoading = false
        this.SuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped >
.article-list {
  margin-bottom: 88px;
  height: 79vh;
  overflow-y: auto;
}
</style>
