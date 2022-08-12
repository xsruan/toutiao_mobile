<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    :loading="loading"
    size="small"
    @click="onFollow"
  >已关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    :loading="loading"
    size="small"
    icon="plus"
    @click="onFollow"
  >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 isFollowed
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onFollow () {
      this.loading = true // 展示关注按钮的 loadig 状态
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
          // this.isFollowed = false
        } else {
          // 未关注，添加关注
          await addFollow(this.userId)
          // this.isFollowed = true
        }

        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注自己！'
        } else if (err.response && err.response.status === 401) {
          message = '未登录！'
        }
        this.$toast(message)
      }
      this.loading = false // 展示关注按钮的 loadig 状态
    }
  }
}
</script>

<style scoped>
</style>
