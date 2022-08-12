<template>
  <div class="home-container">
    <!-- 频道列表 -->
    <van-nav-bar class="page-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
      :my-channels="channels"
      :active="active"
      @update-active="onUpdateActive"
    />
    </van-popup>

    <!-- 导航栏 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="obj.name"
        v-for="obj in channels"
        :key="obj.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="obj" />
        <!-- 文章列表 -->
      </van-tab>
      <div slot="nav-right" class="slot-blank"></div>
      <div slot="nav-right" class="right-btn" @click="isChannelShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from '@/views/home/components/article-list'
import ChannelEdit from '@/views/home/components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelShow: false
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []

        // 已登录，请求获取用户频道列表
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
        // 未登录，判断是否由本地的列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          // 有，拿来使用
          if (localChannels) {
             channels = localChannels
          } else {
            // 没有，获取默认列表频道
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道失败')
      }
    },

    onUpdateActive (index, isChannelShow = true) {
      this.active = index
      this.isChannelShow = isChannelShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container{
  padding-top: 176px;
  /deep/ .van-nav-bar__title {
    max-width: unset
  }
  .page-nav-bar {
    position: fixed;
    top: 0;
    width: 100%;
  }

  .search-btn{
    width: 553px;
    height: 64px;
    background-color: #5babfb;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  // 深度选择器 >>>   /deep/   ::deep
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 19px;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
    }

    .slot-blank {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
    }

    .right-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}

</style>
